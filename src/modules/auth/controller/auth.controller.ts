import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../service/auth.service";
import { AuthRequest } from "./request/auth.request";
import { AuthTransformer } from "./transformer/auth.transformer";

@ApiTags('Sign-in')
@Controller({ version: '1', path: '/auth' })
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('/sign-in')
  @ApiResponse({ status: 401, description: 'Username or password are wrong' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiOperation({ summary: 'sign-in account' })
  async signIn(@Body() body: AuthRequest): Promise<AuthTransformer> {
    const { expiresIn, token } = await this.authService.userSignIn(body);

    return { expiresIn, token };
  }
}