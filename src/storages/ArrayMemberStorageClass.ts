import { ArrayMemberStorage, defaultArrayMemberStorage } from './ArrayMemberStorage';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
export class ArrayMemberClassStorage {
  public static defaultArrayMemberClassStorage = new ArrayMemberClassStorage();

  public map = new Map<Function, ArrayMemberStorage[]>();

  public add(constructor: Function, storage: ArrayMemberStorage): this {
    if (!this.map.has(constructor)) {
      this.map.set(constructor, []);
    }

    const storages = this.map.get(constructor);
    if (!storages!.includes(storage)) {
      storages!.push(storage);
    }

    const result = defaultArrayMemberStorage.map.get(constructor);
    if (result) {
      const defaultPropertyIndexMap = new Map(result);
      for (const [i, k] of storage.map.get(constructor)?.entries() ?? []) {
        defaultPropertyIndexMap.set(i, k);
      }
      storage.map.set(constructor, defaultPropertyIndexMap);
    }
    return this;
  }

  public get<T extends Function>(constructor: T): ArrayMemberStorage[] | undefined {
    return this.map.get(constructor);
  }

  public has<T extends Function>(constructor: T): boolean {
    return this.map.has(constructor);
  }
}

export const defaultArrayMemberClassStorage = ArrayMemberClassStorage.defaultArrayMemberClassStorage;
