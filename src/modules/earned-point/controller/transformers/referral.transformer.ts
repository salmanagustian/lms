import { Expose, Transform } from "class-transformer";

export class ReferralTransformer {
  @Expose()
  id: number;

  @Expose()
  transactionId: string;

  @Expose()
  @Transform(({ obj }) => obj?.persons)
  persons: any;

  @Expose()
  transactionDate: Date;
}