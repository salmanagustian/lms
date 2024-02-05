import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTierRequest, ListTierQuery, UpdateTierRequest } from "./request/tier.request";
import { TierService } from "../service/tier.service";
import { TierTransformer } from "./transformer/tier.transformer";
import { transformer } from "@utils/helper";
import { ResponseInterceptor, ResponsePaginationInterceptor } from "@utils/interceptors";

@ApiTags('Tier')
@Controller({ version: '1', path: '/tier' })
export class TierController {
  constructor(private readonly tierService: TierService) {};

  @Get()
  @ApiOperation({ summary: 'get list of tiers' })
  @UseInterceptors(new ResponsePaginationInterceptor('tier'))
  async getList(@Query() query: ListTierQuery) {
    const { count, rows } = await this.tierService.list(query);

    return { count, rows: transformer(TierTransformer, rows) };
  }

  @Post()
  @ApiOperation({ summary: 'create tier data' })
  @UseInterceptors(new ResponseInterceptor('tier'))
  async createTier(@Body() body: CreateTierRequest) {
    const tier = await this.tierService.create(body);

    return transformer(TierTransformer, tier);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get detail tier data' })
  @UseInterceptors(new ResponseInterceptor('tier'))
  async findTier(@Param('id', ParseIntPipe) id: number) {
    const tier = await this.tierService.getOne(id);
    return transformer(TierTransformer, tier);
  }

  @Put(':id')
  @ApiOperation({ summary: 'update tier data' })
  @UseInterceptors(new ResponseInterceptor('tier'))
  async updateTier(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTierRequest) {
    const tier = await this.tierService.update(id, body);

    return transformer(TierTransformer, tier);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete tier data' })
  @HttpCode(204)
  async deleteTier(@Param('id', ParseIntPipe) id: number) {
    return this.tierService.delete(id);
  }
}