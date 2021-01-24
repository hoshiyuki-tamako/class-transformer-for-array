import { defaultArrayMemberClassStorage, defaultArrayMemberStorage, PropertyInfo } from '../storages';
import { ArrayMemberOptions } from '../types';

export function ArrayMember(index: number, options?: ArrayMemberOptions): PropertyDecorator {
  if (typeof(index) !== 'number') {
    throw new TypeError(`index must be number: ${index}`);
  }

  return (target, propertyKey) => {
    const storage = options?.arrayMemberStorage || defaultArrayMemberStorage;
    storage.add(target.constructor, index, new PropertyInfo(propertyKey, options));

    if (!options?.arrayMemberStorage) {
      for (const eachStorage of defaultArrayMemberClassStorage.get(target.constructor) ?? []) {
        eachStorage.add(target.constructor, index, new PropertyInfo(propertyKey, options));
      }
    }
  };
}
