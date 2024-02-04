import { IsNotEmpty, IsNumber, IsArray, IsString, IsEmail, ValidateNested, ArrayMinSize } from "class-validator";

export class ReferralPersonsRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;
}

export class CreateReferralRequest {
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true, always: true })
  persons: ReferralPersonsRequest[];
}