import { Injectable } from "@nestjs/common";
import { ILoginPayload } from "modules/auth/service/interface/auth.logged.interface";
import { ConfigService } from '@nestjs/config';
import { JwtService } from "@nestjs/jwt";
import { DateTime } from "luxon";

type ExpirationType = 'day' | 'second' | 'minute' | 'hour' | 'year';

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
  }

  async createToken(
    {
      payload,
      audience,
    }: {
      payload: ILoginPayload | any;
      audience: string;
    },
    {
      expiresIn = 1,
      expirationType = 'hour' as ExpirationType,
      issuer = this.configService.get('app.name'),
    }
    : {
      expiresIn?: number;
      issuer?: string;
      expirationType?: ExpirationType;
    } = {},
  ): Promise<{ expiresIn: number; token: string }> {
    const algorithm = process.env.JWT_ALGORITHM;
    const secret = process.env.JWT_SECRET;
    const expirationTime = `${expiresIn} ${expirationType}`;
    const epochExpired = DateTime.now().plus({ [expirationType || 'second']: expiresIn }).toUnixInteger();
    const token = this.jwtService.sign(
      payload,
      {
        secret,
        algorithm: algorithm as any,
        audience,
        expiresIn: expirationTime,
        issuer: issuer || this.configService.get('app.name'),
      },
    );

    return { expiresIn: epochExpired, token };
  }
}