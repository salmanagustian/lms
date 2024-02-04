import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { ClsServiceManager } from "nestjs-cls";

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const clsService = ClsServiceManager.getClsService();
  const getUser = clsService.get('user');
  return getUser;
});