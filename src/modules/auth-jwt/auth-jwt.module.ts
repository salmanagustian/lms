import { Module } from "@nestjs/common";
import { AuthJwtService } from "./service/auth-jwt.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthJwtService],
  exports: [AuthJwtService],
})
export class AuthJwtModule {}