import { TypeError } from 'common-errors';

import { PropertyInfo, storage } from '../storage';
import { ArrayMemberOptions } from '../types';

export type Constructable = {
  constructor: unknown;
}

export function ArrayMember(index: number, options?: ArrayMemberOptions): (target: unknown, propertyKey: string) => void {
  if (typeof(index) !== 'number') {
    throw new TypeError('index must be number');
  }

  return (target: unknown, propertyKey: string) => {
    storage.add((target as { constructor: never }).constructor, index, new PropertyInfo(propertyKey, options));
  };
}
