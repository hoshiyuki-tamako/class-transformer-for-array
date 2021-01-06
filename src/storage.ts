/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
import { ArrayMemberExistsError } from './exceptions/ArrayMemberExistsError';
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

  public add(constructor: Function, index: number, info: PropertyInfo): void {
    if (!this.map.has(constructor)) {
      this.map.set(constructor, new Map());
    }

    const indexMap = this.map!.get(constructor);
    if (indexMap!.has(index)) {
      const oldInfo = indexMap!.get(index);
      throw new ArrayMemberExistsError(`ArrayMember ${index} exists in ${constructor.name}.${oldInfo!.key}: should not override ${constructor.name}.${info.key}`);
    }

    indexMap!.set(index, info);
    this.map!.set(constructor, new Map([...indexMap!.entries()].sort((a, b) => a[0] - b[0])));
  }

  public has(constructor: Function): boolean {
    return this.map.has(constructor);
  }

  public getPropertyIndexMap(constructor: Function): PropertyIndexMap | undefined {
    return this.map.get(constructor);
  }
}

export const storage = new Storage();
