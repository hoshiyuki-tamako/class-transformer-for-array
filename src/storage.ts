/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
import { ArrayMemberOptions } from './types';

export class PropertyInfo {
  public key = '';
  public options?: ArrayMemberOptions;

  public constructor(key: string, options?: ArrayMemberOptions) {
    this.key = key;
    this.options = options;
  }
}

export type PropertyIndexMap = Map<number, PropertyInfo>;
export type ConstructorMap = Map<Function, PropertyIndexMap>;

export class Storage {
  public map = new Map() as ConstructorMap;

  public add(constructor: Function, index: number, info: PropertyInfo): this {
    if (!this.map.has(constructor)) {
      const newMap = new Map() as PropertyIndexMap;
      this.map.set(constructor, newMap);
      // inherit
      for (const [c, propertyIndexMap] of this.map.entries()) {
        if (constructor.prototype instanceof c) {
          for (const [i, p] of propertyIndexMap.entries()) {
            newMap.set(i, p);
          }
        }
      }
    }

    const indexMap = this.map!.get(constructor)!.set(index, info);
    this.map!.set(constructor, new Map([...indexMap!.entries()].sort((a, b) => a[0] - b[0])));

    return this;
  }

  public has(constructor: Function): boolean {
    return this.map.has(constructor);
  }

  public getPropertyIndexMap(constructor: Function): PropertyIndexMap | undefined {
    return this.map.get(constructor);
  }
}

export const storage = new Storage();
