import { PropertyIndex } from './PropertyIndex';
import { ArrayMemberStorage, defaultArrayMemberStorage } from './ArrayMemberStorage';

/* eslint-disable @typescript-eslint/ban-types */
export class ArrayMemberClassStorage {
  public static defaultArrayMemberClassStorage = new ArrayMemberClassStorage();

  public map = new Map<Function, ArrayMemberStorage[]>();

  public add(constructor: Function, storage: ArrayMemberStorage): this {
    const storages = this.initializeStorage(constructor, storage);
    return storage === defaultArrayMemberStorage
      ? this.addDefaultArrayMemberStorage(constructor)
      : this.addCustomArrayMemberStorage(constructor, storage, storages);

  }

  public get<T extends Function>(constructor: T): ArrayMemberStorage[] | undefined {
    return this.map.get(constructor);
  }

  public has<T extends Function>(constructor: T): boolean {
    return this.map.has(constructor);
  }

  //
  private initializeStorage(constructor: Function, storage: ArrayMemberStorage): ArrayMemberStorage[] {
    const storages = this.map.get(constructor);
    if (storages) {
      if (!storages.includes(storage)) {
        storages.push(storage);
      }
      return storages;
    } else {
      const storages = [storage];
      this.map.set(constructor, storages);
      return storages;
    }
  }

  private addDefaultArrayMemberStorage(constructor: Function): this {
    const result = defaultArrayMemberStorage.mapMoved.get(constructor);
    if (result) {
      defaultArrayMemberStorage.map.set(constructor, result);
      defaultArrayMemberStorage.mapMoved.delete(constructor);
    }
    return this;
  }

  private addCustomArrayMemberStorage(constructor: Function, storage: ArrayMemberStorage, storages: ArrayMemberStorage[]): this {
    const defaultPropertyIndex = new PropertyIndex();

    // existing properties
    const oldPropertyIndex = defaultArrayMemberStorage.mapMoved.get(constructor);
    if (oldPropertyIndex) {
      defaultPropertyIndex.map = new Map(oldPropertyIndex.map);
    }

    // new added
    const newPropertyIndex = defaultArrayMemberStorage.map.get(constructor);
    if (newPropertyIndex) {
      defaultPropertyIndex.map = new Map([...defaultPropertyIndex.map.entries(), ...newPropertyIndex.map.entries()]);

      // cleanup
      if (!storages.includes(defaultArrayMemberStorage)) {
        if (oldPropertyIndex) {
          // merge new item to old
          for (const [i, k] of newPropertyIndex.map.entries()) {
            oldPropertyIndex.set(i, k);
          }
        } else {
          defaultArrayMemberStorage.mapMoved.set(constructor, defaultPropertyIndex);
        }
        defaultArrayMemberStorage.map.delete(constructor);
      }
    }

    // merge
    const storagePropertyIndexMap = storage.map.get(constructor);
    if (storagePropertyIndexMap) {
      for (const [i, k] of storagePropertyIndexMap.entries()) {
        defaultPropertyIndex.set(i, k);
      }
    }
    storage.map.set(constructor, defaultPropertyIndex);

    return this;
  }
}

export const defaultArrayMemberClassStorage = ArrayMemberClassStorage.defaultArrayMemberClassStorage;
