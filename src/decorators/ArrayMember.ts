/* eslint-disable @typescript-eslint/ban-types */
import { TypeError } from 'common-errors';

import { defaultArrayMemberStorage, PropertyInfo } from '../storage';
import { ArrayMemberOptions } from '../types';

export type Constructable = {
  constructor: unknown;
}

export function ArrayMember(index: number, options?: ArrayMemberOptions): (target: unknown, propertyKey: string) => void {
  if (typeof(index) !== 'number') {
    throw new TypeError('index must be number');
  }

  return (target: unknown, propertyKey: string) => {
    const storage = options?.arrayMemberStorage || defaultArrayMemberStorage
    storage.add((target as { constructor: never }).constructor, index, new PropertyInfo(propertyKey, options));
  };
}
