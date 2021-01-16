/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TypeError } from 'common-errors';

import { arrayMemberClassStorage, ArrayMemberStorage, defaultArrayMemberStorage } from './../storage';

/* eslint-disable @typescript-eslint/ban-types */
export function ArrayMemberClass(storage?: ArrayMemberStorage): (constructor: Function) => void {
  const _storage = storage || defaultArrayMemberStorage;
  if (!(storage instanceof ArrayMemberStorage)) {
    throw new TypeError(`storage must be instanceof ArrayMemberStorage: ${storage}`);
  }

  return (constructor: Function) => {
    if (!arrayMemberClassStorage.has(constructor)) {
      arrayMemberClassStorage.set(constructor, []);
    }

    const storages = arrayMemberClassStorage.get(constructor);
    if (!storages!.includes(_storage)) {
      storages!.push(_storage);
    }

    const result = defaultArrayMemberStorage.map.get(constructor);
    if (result) {
      const defaultPropertyIndexMap = new Map(result);
      for (const [i, k] of _storage.map.get(constructor)?.entries() ?? []) {
        defaultPropertyIndexMap.set(i, k);
      }
      _storage.map.set(constructor, defaultPropertyIndexMap);
    }
  };
}
