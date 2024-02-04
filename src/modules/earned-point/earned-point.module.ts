import { Module } from "@nestjs/common";
import { EarnedPointController } from "./controller/earned-point.controller";
import { TransactionService } from "./service/transaction.service";
import { ReferralService } from "./service/referral.service";
import { ActivityService } from "./service/activity.service";

@Module({
  controllers: [EarnedPointController],
  providers: [TransactionService, ReferralService, ActivityService]
})
export class EarnedPointModule {}