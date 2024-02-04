import { Expose, Transform } from "class-transformer";

export class ActivityTransformer {
  @Expose()
  id: number;

  @Expose()
  transactionId: string;

  @Expose()
  activityName: string;

  @Expose()
  transactionDate: Date;
}