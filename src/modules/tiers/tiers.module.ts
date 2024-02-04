import { Module } from "@nestjs/common";
import { TierController } from "./controller/tier.controller";
import { TierService } from "./service/tier.service";

@Module({
  controllers: [TierController],
  providers: [TierService],
})
export class TierModule {}