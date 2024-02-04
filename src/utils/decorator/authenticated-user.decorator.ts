import { UseGuards, UseInterceptors, applyDecorators } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthenticatedUserInterceptor } from "@utils/interceptors";
import { ClsInterceptor } from "nestjs-cls";
import { AuthGuard } from '@nestjs/passport';

export function Authorize() {
  return applyDecorators(
    UseGuards(AuthGuard(['auth'])),
    ApiBearerAuth(),
    UseInterceptors(ClsInterceptor, AuthenticatedUserInterceptor),
  );
}