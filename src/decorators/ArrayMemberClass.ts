/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TypeError } from 'common-errors';

import { arrayMemberClassStorage, ArrayMemberStorage, defaultArrayMemberStorage } from '../storages';

export function ArrayMemberClass(arrayMemberStorage?: ArrayMemberStorage): ClassDecorator {
  const storage = arrayMemberStorage || defaultArrayMemberStorage;
  if (!(storage instanceof ArrayMemberStorage)) {
    throw new TypeError(`storage must be instanceof ArrayMemberStorage: ${storage}`);
  }

  return (constructor) => {
    if (!arrayMemberClassStorage.has(constructor)) {
      arrayMemberClassStorage.set(constructor, []);
    }

    const storages = arrayMemberClassStorage.get(constructor);
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
  };
}
