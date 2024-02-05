import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { RedeemPointService } from "../service/redeem-point.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseInterceptor } from "@utils/interceptors";
import { RedeemedPointRequest } from "./request/redeem-point.request";
import { User } from "@utils/decorator/user.decorator";
import { ILoggedUser } from "modules/auth/service/interface/auth.logged.interface";
import { Authorize } from "@utils/decorator/authenticated-user.decorator";

@ApiTags('Redeemed Point')
@Authorize()
@Controller({ version: '1', path: '/redeem-point' })
export class RedeemPointController {
  constructor(private readonly redeemPointService: RedeemPointService) {}

  @Post()
  @ApiOperation({ summary: 'redeemed-point - redeem' })
  @UseInterceptors(new ResponseInterceptor('redeem-point'))
  async redeemUserPoint(@Body() body: RedeemedPointRequest, @User() loggedUser: ILoggedUser) {
    const redeemed = await this.redeemPointService.redeemPoint(body, loggedUser);

    return redeemed;
  }
}