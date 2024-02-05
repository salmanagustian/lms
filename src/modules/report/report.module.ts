import { Module } from "@nestjs/common";
import { ReportController } from "./controller/report.controller";
import { ReportService } from "./service/report.service";

@Module({
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}