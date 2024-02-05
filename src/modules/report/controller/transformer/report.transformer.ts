import { Expose } from "class-transformer";

export class ReportTransformer {
  @Expose()
  id: number;

  @Expose()
  name: string;
}