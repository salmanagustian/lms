import { IUnfilledAtt, Optional } from "@utils/base-class/base.interface";
import { AllowNull, Column, DataType, Default, ForeignKey, Model, Table } from "sequelize-typescript";
import { Loyalty } from "./Loyalty";
import { Tier } from "./Tier";
import { EEarnedPoint } from "@utils/enum";

type INullableAttr =  IUnfilledAtt;

interface IAutoGeneratedAttr {
  id: number;
}

export interface IModel extends Optional<INullableAttr>, IAutoGeneratedAttr {
  loyaltyId: number;
  category: EEarnedPoint;
  config: any;
}

export type IModelCreate = Omit<IModel, keyof IAutoGeneratedAttr> & Partial<IAutoGeneratedAttr>;

@Table({
  tableName: 'loyalty_benefits',
  paranoid: true,
  indexes: [
    { fields: ['loyalty_id'], where: { deleted_at: null }},
  ],
})
export class LoyaltyBenefit extends Model<IModel, IModelCreate> implements IModel {
  declare id: number;

  @ForeignKey(() => Loyalty)
  @AllowNull(false)
  @Column
  declare loyaltyId: number;

  @AllowNull(false)
  @Column
  declare category: EEarnedPoint;

  @AllowNull(false)
  @Column({ type: DataType.JSONB })
  declare config: any;
}