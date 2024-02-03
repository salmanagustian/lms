import { Model } from "sequelize-typescript";
import { Attributes, CreationAttributes } from "sequelize";

export interface IUnfilledAtt {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export interface IUnfilledNotParanoidAtt {
  createdAt: Date;
  updatedAt: Date;
}

export type Optional<T> = {
  [P in keyof T]?: T[P] | null;
};

export type RelationAttribute<M extends Model, T = 'attributes', ForeignKey extends string = ''> = T extends 'attributes'
  ? Attributes<M>
  : Omit<CreationAttributes<M>, ForeignKey>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;