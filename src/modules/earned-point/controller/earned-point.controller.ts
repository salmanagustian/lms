import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { TransactionService } from "../service/transaction.service";
import { CreateTransactionRequest } from "./request/transaction.request";
import { Authorize } from "@utils/decorator/authenticated-user.decorator";
import { User } from "@utils/decorator/user.decorator";
import { ILoggedUser } from "modules/auth/service/interface/auth.logged.interface";
import { ResponseInterceptor } from "@utils/interceptors";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { transformer } from "@utils/helper";
import { TransactionTransformer } from "./transformers/transaction.transformer";
import { ReferralService } from "../service/referral.service";
import { CreateReferralRequest } from "./request/referral.request";
import { ReferralTransformer } from "./transformers/referral.transformer";
import { CreateActivityRequest } from "./request/activity.request";
import { ActivityService } from "../service/activity.service";
import { ActivityTransformer } from "./transformers/activity.transformer";

@ApiTags('Earned Point')
@Authorize()
@Controller({ version: '1', path: '/' })
export class EarnedPointController {
  constructor(private readonly transactionService: TransactionService,
    private readonly referralService: ReferralService,
    private readonly activityService: ActivityService,
    ) {}

  @Post('/transaction')
  @ApiOperation({ summary: 'earned point - add transaction' })
  @UseInterceptors(new ResponseInterceptor('transaction'))
  async createTransaction(@Body() body: CreateTransactionRequest, @User() loggedUser: ILoggedUser) {
    const transactions = await this.transactionService.create(body, loggedUser);
    return transformer(TransactionTransformer, transactions);
  }

  @Post('/community/referral')
  @ApiOperation({ summary: 'earned point - add member get member' })
  @UseInterceptors(new ResponseInterceptor('community'))
  async createReferral(@Body() body: CreateReferralRequest, @User() loggedUser: ILoggedUser) {
    const transactions = await this.referralService.createReferral(body, loggedUser);
    return transformer(ReferralTransformer, transactions);
  }

  @Post('/community/activity')
  @ApiOperation({ summary: 'earned point - add member activity' })
  @UseInterceptors(new ResponseInterceptor('community'))
  async createActivity(@Body() body: CreateActivityRequest, @User() loggedUser: ILoggedUser) {
    const transactions = await this.activityService.createActivity(body, loggedUser);
    return transformer(ActivityTransformer, transactions);
  }
}