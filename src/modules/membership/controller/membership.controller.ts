import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { MembershipService } from "../service/membership.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseInterceptor, ResponsePaginationInterceptor } from "@utils/interceptors";
import { transformer } from "@utils/helper";
import { ListMembershipRequest } from "./request/membership.request";
import { MembershipTransformer } from "./transformer/membership.transformer";

@ApiTags('Membership')
@Controller({ version: '1', path: '/membership' })
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get()
  @ApiOperation({ summary: 'get list membership' })
  @UseInterceptors(new ResponsePaginationInterceptor('membership'))
  async getList(@Query() query: ListMembershipRequest) {
    const { count, rows } = await this.membershipService.list(query);

    return { count, rows: transformer(MembershipTransformer, rows) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'get detail membership data' })
  @UseInterceptors(new ResponseInterceptor('membership'))
  async findMember(@Param('id', ParseIntPipe) id: number) {
    const memberData = await this.membershipService.getOne(id);
    return transformer(MembershipTransformer, memberData);
  }
}