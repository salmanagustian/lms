import { Expose } from "class-transformer";

export class TierTransformer {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  minPoint: number;

  @Expose()
  maxPoint: number;
}