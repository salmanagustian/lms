import { Module } from "@nestjs/common";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { AuthJwtModule } from "modules/auth-jwt/auth-jwt.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthJwtCmsStrategy } from "./service/strategy/auth.strategy";

@Module({
  imports: [AuthJwtModule],
  controllers: [AuthController],
  providers: [AuthService, AuthJwtCmsStrategy],
})
export class AuthModule {}