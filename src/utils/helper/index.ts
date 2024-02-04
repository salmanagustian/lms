import { ClassTransformOptions, plainToInstance } from "class-transformer";

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