import { Expose } from "class-transformer";

export class AuthTransformer {
  @Expose()
  expiresIn: number;

  @Expose()
  token: string;
}