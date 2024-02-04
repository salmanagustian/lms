import { IUnfilledAtt, Optional } from "@utils/base-class/base.interface";
import { AllowNull, Column, Default, Model, Scopes, Table } from "sequelize-typescript";

type INullableAttr = IUnfilledAtt;

interface IAutoGeneratedAttr {
  id: number;
}

export interface IModel extends Optional<INullableAttr>, IAutoGeneratedAttr {
  name: string;
  minPoint: number;
  maxPoint: number;
}

export type IModelCreate = Omit<IModel, keyof IAutoGeneratedAttr> & Partial<IAutoGeneratedAttr>;
export type IModelUpdate = IModelCreate;
@Table({
  tableName: 'tiers',
  // paranoid: true,
})
export class Tier extends Model<IModel, IModelCreate> implements IModel {
  declare id: number;

  @AllowNull(false)
  @Column
  declare name: string;

  @AllowNull(false)
  @Column
  declare minPoint: number;

  @AllowNull(false)
  @Column
  declare maxPoint: number;
}