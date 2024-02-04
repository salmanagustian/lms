import { IsNotEmpty, IsString } from "class-validator";

export class CreateActivityRequest {
  @IsNotEmpty()
  @IsString()
  activityName: string
}