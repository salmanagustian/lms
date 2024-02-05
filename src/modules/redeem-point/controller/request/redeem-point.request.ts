import { IsNotEmpty, IsNumber } from "class-validator";

export class RedeemedPointRequest {
  @IsNotEmpty()
  @IsNumber()
  redeemedPoint: number;
}