import { IUnfilledAtt, Optional } from "@utils/base-class/base.interface";
import { AllowNull, Column, DataType, Default, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Loyalty } from "./Loyalty";
import { Member } from "./Member";
import { MemberTransactionItem } from "./MemberTransactionItem";

type INullableAttr = IUnfilledAtt;

interface IAutoGeneratedAttr {
  id: number;
}

export interface IModel extends Optional<INullableAttr>, IAutoGeneratedAttr {
  loyaltyId: number;
  memberId: number;
  transactionId: string;
  persons: any;
  transactionDate: Date;
}

export type IModelCreate = Omit<IModel, keyof IAutoGeneratedAttr> & Partial<IAutoGeneratedAttr>;

@Table({
  tableName: 'member_referrals',
  paranoid: true,
  indexes: [
    { fields: ['member_id'], where: { deleted_at: null }},
  ]
})
export class MemberReferral extends Model<IModel, IModelCreate> implements IModel {
  declare id: number;

  @ForeignKey(() => Loyalty)
  @AllowNull(false)
  @Column
  loyaltyId: number;

  @ForeignKey(() => Member)
  @AllowNull(false)
  @Column
  memberId: number;

  @AllowNull(false)
  @Column
  transactionId: string;

  @AllowNull(false)
  @Column({ type: DataType.JSONB })
  persons: any;
  
  @AllowNull(false)
  @Column
  transactionDate: Date;
}