import { Module } from "@nestjs/common";
import { MembershipController } from "./controller/membership.controller";
import { MembershipService } from "./service/membership.service";

@Module({
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}