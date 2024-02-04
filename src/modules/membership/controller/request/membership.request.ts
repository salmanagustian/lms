import { IsNotEmpty } from "class-validator";

export class ListMembershipRequest {
  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  size: number;
}