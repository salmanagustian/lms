import { Expose, Transform } from "class-transformer";
import { DateTime } from "luxon";

export class TransactionTransformer {
  @Expose()
  id: number;

  @Expose()
  transactionId: string;

  @Expose()
  amount: number;

  @Expose()
  @Transform(({ obj }) => {
    if (obj?.transactionDate) {
      return DateTime.fromISO(obj.transactionDate).toFormat('dd-MM-yyyy HH:mm:ss')
    }
  })
  transactionDate: Date;
}