import { IsNotEmpty, IsNumber, IsOptional, IsString, Max } from "class-validator";

export class ListTierQuery {
  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  size: number;

  @IsOptional()
  search: string;
}

export class CreateTierRequest {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  minPoint: number;

  @IsNotEmpty()
  @IsNumber()
  maxPoint: number;
}

export class UpdateTierRequest extends CreateTierRequest {}