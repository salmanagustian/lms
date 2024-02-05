import { Expose, Transform, Type } from "class-transformer";
import { DateTime } from "luxon";

export class UserTransformer {
  @Expose()
  id: number;

  @Expose()
  email: string;
}

export class MemberPointHistoryTransformer {
  @Expose()
  id: number;

  @Expose()
  transactionId: string;

  @Expose()
  transactionDate: Date;

  @Expose()
  type: string;

  @Expose()
  point: number;
}

export class MembershipTransformer {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  @Type(() => UserTransformer)
  user: UserTransformer;

  @Expose()
  phoneNumber: string;
  
  @Expose()
  @Transform(({ obj }) => {
    if (obj?.birthDate) {
      return DateTime.fromISO(obj.birthDate).toFormat('dd-MM-yyyy')
    }
  })
  birthDate: Date;

  @Expose()
  address: string;

  @Expose()
  @Transform(({ obj }) => {
    if (obj?.joinDate) {
      return DateTime.fromISO(obj.joinDate).toFormat('dd-MM-yyyy')
    }
  })
  joinDate: Date;

  @Expose()
  earnedPoint: number;

  @Expose()
  redeemedPoint: number;

  @Expose()
  remainedPoint: number;

  @Expose()
  @Type(() => MemberPointHistoryTransformer)
  pointHistories: MemberPointHistoryTransformer;

  @Expose()
  @Transform(({ obj }) => {
    if (obj?.isActive === true) return 'Active';
    return 'InActive';
  })
  status: string;
}