import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class AuthRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'string' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, { message: 'Password must be at least 8 characters, including one uppercase, lowercase letter. And at least have one number and one special character' })
  password: string;
}