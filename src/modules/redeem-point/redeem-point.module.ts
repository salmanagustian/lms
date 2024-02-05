import { Module } from "@nestjs/common";
import { RedeemPointController } from "./controller/redeem-point.controller";
import { RedeemPointService } from "./service/redeem-point.service";

@Module({
  controllers: [RedeemPointController],
  providers: [RedeemPointService],
})
export class RedeemPointModule {}