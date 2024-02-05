import * as JsonAPISerializer from 'json-api-serializer';

export const resourceNames = [
  'tier', 'sign-in', 'membership', 'transaction', 'community', 'report', 'redeem-point'
] as const;


export type Resource = typeof resourceNames[number];

export class BaseResource {
  protected serializer = new JsonAPISerializer();

  /**
   * resource string name
   * @param resourceName
   * @param data
   */
  constructor() {
    /**
     * @see {resource}
     * register all defined resource
     * */
    resourceNames.forEach((market: Resource) => {
      this.serializer.register(market, {
        id: 'id',
      });
    });
  }

  serialize(resourceName: Resource, data: any) {
    return this.serializer.serialize(resourceName, data);
  }
}
