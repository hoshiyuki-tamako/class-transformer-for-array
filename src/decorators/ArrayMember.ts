/* eslint-disable @typescript-eslint/ban-types */
import { ClassConstructor } from 'class-transformer';
import { TypeError } from 'common-errors';

import { arrayMemberClassStorage, defaultArrayMemberStorage, PropertyInfo } from '../storage';
import { ArrayMemberOptions } from '../types';

export function ArrayMember(index: number, options?: ArrayMemberOptions): (target: unknown, propertyKey: string) => void {
  if (typeof(index) !== 'number') {
    throw new TypeError(`index must be number: ${index}`);
  }

  return (target: unknown, propertyKey: string) => {
    const c = target as ClassConstructor<Object>;

    if (!options?.arrayMemberStorage) {
      for (const eachStorage of arrayMemberClassStorage.get(c.constructor) ?? []) {
        eachStorage.add(c.constructor, index, new PropertyInfo(propertyKey, options));
      }
    }

    const storage = options?.arrayMemberStorage || defaultArrayMemberStorage;
    storage.add(c.constructor, index, new PropertyInfo(propertyKey, options));
  };
}
