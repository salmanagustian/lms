import { Module } from "@nestjs/common";
import { EarnedPointController } from "./controller/earned-point.controller";
import { TransactionService } from "./service/transaction.service";

@Module({
  controllers: [EarnedPointController],
  providers: [TransactionService]
})
export class EarnedPointModule {}