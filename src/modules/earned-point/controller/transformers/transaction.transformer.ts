import { Expose } from "class-transformer";

export class TransactionTransformer {
  @Expose()
  id: number;

  @Expose()
  transactionId: string;

  @Expose()
  amount: number;

  @Expose()
  transactionDate: Date;
}