import { IUnfilledAtt, Optional } from "@utils/base-class/base.interface";
import { AllowNull, Column, Default, HasOne, Model, Scopes, Table } from "sequelize-typescript";
import { Member } from "./Member";

export interface INullableAttr extends IUnfilledAtt {
  isActive: boolean,
}

interface IAutoGeneratedAttr {
  id: number;
}

export interface IModel extends Optional<INullableAttr>, IAutoGeneratedAttr {
  email: string;
  password: string;
}

export type IModelCreate = Omit<IModel, keyof IAutoGeneratedAttr> & Partial<IAutoGeneratedAttr>;

@Scopes(() => ({
  active: ({
    where: {
      isActive: true,
    },
  }),
}))
@Table({
  tableName: 'user_login',
  paranoid: true,
  indexes: [
    { fields: ['email'], where: { is_deleted: false } }
  ],
})
export class UserLogin extends Model<IModel, IModelCreate> implements IModel {
  declare id: number;

  @AllowNull(false)
  @Column
  declare email: string;

  @AllowNull(false)
  @Column
  declare password: string;

  @AllowNull(false)
  @Default(true)
  @Column
  declare isActive: boolean;

  @HasOne(() => Member)
  declare member: Member;
}