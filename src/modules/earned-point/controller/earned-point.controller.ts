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

@ApiTags('Earned Point')
@Authorize()
@Controller({ version: '1', path: '/' })
export class EarnedPointController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/transaction')
  @ApiOperation({ summary: 'earned point - add transaction' })
  @UseInterceptors(new ResponseInterceptor('transaction'))
  async createTransaction(@Body() body: CreateTransactionRequest, @User() loggedUser: ILoggedUser) {
    const transactions = await this.transactionService.create(body, loggedUser);
    return transformer(TransactionTransformer, transactions);
  }
}