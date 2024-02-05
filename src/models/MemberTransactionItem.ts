import { IUnfilledAtt, Optional } from "@utils/base-class/base.interface";
import { AllowNull, BelongsToMany, Column, Default, ForeignKey, Model, Table } from "sequelize-typescript";
import { MemberTransaction } from "./MemberTransaction";

type INullableAttr = IUnfilledAtt;

interface IAutoGeneratedAttr {
  id: number;
}

export interface IModel extends Optional<INullableAttr>, IAutoGeneratedAttr {
  transactionId: number;
  name: string;
  price: number;
  qty: number;
  subTotal: number;
}

export type IModelCreate = Omit<IModel, keyof IAutoGeneratedAttr> & Partial<IAutoGeneratedAttr>;

@Table({
  tableName: 'member_transaction_items',
  paranoid: true,
  indexes: [
    { fields: ['transaction_id'], where: { deleted_at: null }},
  ]
})
export class MemberTransactionItem extends Model<IModel, IModelCreate> implements IModel {
  declare id: number;

  @ForeignKey(() => MemberTransaction)
  @AllowNull(false)
  @Column
  declare transactionId: number;

  @AllowNull(false)
  @Column
  declare name: string;

  @AllowNull(false)
  @Default(0)
  @Column
  declare price: number;

  @AllowNull(false)
  @Default(0)
  @Column
  declare qty: number;

  @AllowNull(false)
  @Default(0)
  @Column
  declare subTotal: number;
}