import { ClassTransformOptions, plainToInstance } from "class-transformer";
import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";

export const circularToJSON = (circular: unknown) => JSON.parse(JSON.stringify(circular));

/**
 * `options.raw` = `true` for using pure object that you provided.
 * `options.raw` = `false` | `undefined` for coverting circular structure to JSON
 * @param cls
 * @param obj
 * @param options
 */
export function transformer<T, V>(
  cls: { new (...args: unknown[]): T },
  obj: V[],
  options?: ClassTransformOptions & { raw?: boolean },
): T[];
export function transformer<T, V>(
  cls: { new (...args: unknown[]): T },
  obj: V,
  options?: ClassTransformOptions & { raw?: boolean },
): T;
export function transformer<T, V>(
  cls: { new (...args: unknown[]): T },
  obj: V | V[],
  options?: ClassTransformOptions & { raw?: boolean },
) {
  const result = plainToInstance(cls, options?.raw ? obj : circularToJSON(obj), {
    excludeExtraneousValues: true,
    exposeUnsetFields: true,
    enableImplicitConversion: true,
    // exposeDefaultValues: true,
    ...options,
  });
  return result as unknown;
}

/**
 * Resource for handling get format transaction id
 * @param earnedPointCode string
 * @param transaction Transaction
 * @returns string
 */
export async function getFmtTransactionId(earnedPointCode: string, sequelize: Sequelize, transaction: Transaction): Promise<string> {
  const [res, _] = await sequelize.query(`select format_transaction_id_fn('${earnedPointCode}') as earnedtrscode`, { transaction });
  const earnedTrsCode = JSON.parse(JSON.stringify(res?.[0]))?.earnedtrscode as string;
  return earnedTrsCode;
}