import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Sequelize } from 'sequelize-typescript';
import { ILoggedUser, ILoginPayload } from '../interface/auth.logged.interface';
import { UserLogin } from '@models/UserLogin';

@Injectable()
export class AuthJwtCmsStrategy extends PassportStrategy(Strategy, 'auth') {
  constructor(
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: process.env.JWT_ALGORITM,
      audience: 'lms',
      issuer: configService.get('app.name'),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: ILoginPayload): Promise<ILoggedUser> {
    console.log('PAYLOAD: \n', payload);
    const userLogin = await UserLogin.scope('active').findOne({
      attributes: ['id', 'email'],
      where: {
        id: payload.userId,
        email: payload.email,
      },
      rejectOnEmpty: new UnauthorizedException(),
    });

    return {
      userId: userLogin.id,
      email: userLogin.email,
    };
  }
}
