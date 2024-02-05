import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ReportService } from "../service/report.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseInterceptor, ResponsePaginationInterceptor } from "@utils/interceptors";
import { ListEarnedPointRequest } from "./request/report.request";
import { circularToJSON, transformer } from "@utils/helper";

@ApiTags('Report')
@Controller({ version: '1', path: '/report' })
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/earned-point')
  @ApiOperation({ summary: 'report - earned point' })
  @UseInterceptors(new ResponsePaginationInterceptor('report'))
  async getReportEarnedPoint(@Query() query: ListEarnedPointRequest) {
    const { rows, count } = await this.reportService.getAllEarnedPoint(query);

    return { count, rows: circularToJSON(rows) };
  }

  @Get('/redemeed-point')
  @ApiOperation({ summary: 'report - redeemed point' })
  @UseInterceptors(new ResponsePaginationInterceptor('report'))
  async getReportRedeemedPoint(@Query() query: ListEarnedPointRequest) {
    const { rows, count } = await this.reportService.getAllRedeemedPoint(query);

    return { count, rows: circularToJSON(rows) };
  }
}