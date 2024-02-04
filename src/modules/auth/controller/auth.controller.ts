import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../service/auth.service";
import { AuthRequest } from "./request/auth.request";
import { AuthTransformer } from "./transformer/auth.transformer";
import { transformer } from "@utils/helper";
import { ResponseInterceptor } from "@utils/interceptors";
import { Authorize } from "@utils/decorator/authenticated-user.decorator";
import { User } from "@utils/decorator/user.decorator";
import { ILoggedUser } from "../service/interface/auth.logged.interface";

@ApiTags('Sign-in')
@Controller({ version: '1', path: '/auth' })
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('/sign-in')
  @ApiOperation({ summary: 'sign-in account' })
  @ApiResponse({ status: 401, description: 'Username or password are wrong' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseInterceptors(new ResponseInterceptor('sign-in'))
  async signIn(@Body() body: AuthRequest) {
    const { expiresIn, token } = await this.authService.userSignIn(body);

    return transformer(AuthTransformer, { expiresIn, token });
  }

  @Authorize()
  @Get('/me')
  @ApiOperation({ summary: 'get detail an account' })
  async me(@User() loggedUser: ILoggedUser) {
    return loggedUser;
  }
}