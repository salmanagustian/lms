import { Injectable, UnauthorizedException } from "@nestjs/common";
import { IModel, UserLogin } from "@models/UserLogin";
import { compare } from "bcrypt";
import { ILoginPayload } from "./interface/auth.logged.interface";
import { AuthJwtService } from "modules/auth-jwt/service/auth-jwt.service";
import { AuthRequest } from "../controller/request/auth.request";

type ISignInDTO = Pick<IModel, 'email' | 'password'>
const AUDIENCE_APP = 'lms';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: AuthJwtService,
  ) {}

  async userSignIn({ email, password }: AuthRequest) {
    const userLogin = await UserLogin.scope('active').findOne({
      where: {
        email,
      },
      rejectOnEmpty: new UnauthorizedException('Mohon maaf, data user tidak dapat kami temukan'),
    });
    const isPasswordSame = await compare(password, userLogin.password);
    if (!isPasswordSame) throw new UnauthorizedException();

    const loginPayload: ILoginPayload = {
      userId: 2,
      email: userLogin.email,
    };

    return this.jwtService.createToken(
      { payload: loginPayload, audience: AUDIENCE_APP }, 
      { expiresIn: 1, expirationType: 'hour'}
    );
  }
}