/* eslint-disable @typescript-eslint/ban-types */
import { PropertyIndex } from './PropertyIndex';
import { PropertyInfo } from './PropertyInfo';

export type ConstructorMap = Map<Function, PropertyIndex>;

export class ArrayMemberStorage {
  public static defaultArrayMemberStorage = new ArrayMemberStorage();

  public map = new Map() as ConstructorMap;

  public mapMoved = new Map() as ConstructorMap;

  public add<T extends Function>(constructor: T, index: number, info: PropertyInfo): this {
    const propertyIndex = this.map.get(constructor);
    if (propertyIndex) {
      propertyIndex.add(index, info);
    } else {
      const newMap = new PropertyIndex();
      // inherit
      for (const iterator of [this.mapMoved.entries(), this.map.entries()]) {
        for (const [c, propertyIndex] of iterator) {
          if (constructor.prototype instanceof c) {
            for (const [i, p] of propertyIndex.entries()) {
              newMap.set(i, p);
            }
          }
        }
      }
      this.map.set(constructor, newMap.add(index, info));
    }
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
