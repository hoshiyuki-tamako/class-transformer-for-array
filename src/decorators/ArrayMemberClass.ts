import { TypeError } from 'common-errors';

import { defaultArrayMemberClassStorage, ArrayMemberStorage, defaultArrayMemberStorage } from '../storages';

export function ArrayMemberClass(arrayMemberStorage?: ArrayMemberStorage): ClassDecorator {
  const storage = arrayMemberStorage || defaultArrayMemberStorage;
  if (!(storage instanceof ArrayMemberStorage)) {
    throw new TypeError(`storage must be instanceof ArrayMemberStorage: ${storage}`);
  }

  return (constructor) => {
    defaultArrayMemberClassStorage.add(constructor, storage);
  };
}
