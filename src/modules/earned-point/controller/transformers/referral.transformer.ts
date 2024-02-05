import { Expose, Transform } from "class-transformer";
import { DateTime } from "luxon";

export class ReferralTransformer {
  @Expose()
  id: number;

  @Expose()
  transactionId: string;

  @Expose()
  @Transform(({ obj }) => obj?.persons)
  persons: any;

  @Expose()
  @Transform(({ obj }) => {
    if (obj?.transactionDate) {
      return DateTime.fromISO(obj.transactionDate).toFormat('dd-MM-yyyy HH:mm:ss')
    }
  })
  transactionDate: Date;
}