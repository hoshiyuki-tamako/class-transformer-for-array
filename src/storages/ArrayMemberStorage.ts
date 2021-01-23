/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
import { PropertyIndex } from './PropertyIndex';
import { PropertyInfo } from './PropertyInfo';

export type ConstructorMap = Map<Function, PropertyIndex>;
export class ArrayMemberStorage {
  public static defaultArrayMemberStorage = new ArrayMemberStorage();

  public map = new Map() as ConstructorMap;

  public add<T extends Function>(constructor: T, index: number, info: PropertyInfo): this {
    if (!this.map.has(constructor)) {
      const newMap = new PropertyIndex();
      this.map.set(constructor, newMap);
      // inherit
      for (const [c, propertyIndex] of this.map.entries()) {
        if (constructor.prototype instanceof c) {
          for (const [i, p] of propertyIndex.entries()) {
            newMap.set(i, p);
          }
        }
      }
    }

    this.map.get(constructor)!.add(index, info);
    return this;
  }

  public has<T extends Function>(constructor: T): boolean {
    return this.map.has(constructor);
  }

  public getPropertyIndex<T extends Function>(constructor: T): PropertyIndex | undefined {
    return this.map.get(constructor);
  }
}

export const defaultArrayMemberStorage = ArrayMemberStorage.defaultArrayMemberStorage;
