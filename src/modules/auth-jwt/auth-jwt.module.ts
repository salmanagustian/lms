import { Module } from "@nestjs/common";
import { AuthJwtService } from "./service/auth-jwt.service";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthConfigModule } from "@config/auth/config.module";

@Module({
  imports: [JwtModule.register({}), PassportModule],
  providers: [AuthJwtService],
  exports: [AuthJwtService],
})
export class AuthJwtModule {}