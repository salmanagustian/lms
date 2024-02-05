import { IsNotEmpty, IsOptional } from "class-validator";

export class ListEarnedPointRequest {
  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  size: number;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;

  @IsOptional()
  search?: string;
}