import { TypeError } from 'common-errors';

import { PropertyInfo, storage } from '../storage';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export function ArrayMember(index: number): (target: {
  constructor: unknown;
}, propertyKey: string) => void {
  if (typeof(index) !== 'number') {
    throw new TypeError('index must be number');
  }

  return (target: { constructor: unknown }, propertyKey: string): void => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    if (!storage.has(target.constructor)) {
      storage.set(target.constructor, new Map());
    }
    const map = storage.get(target.constructor);
    map!.set(index, new PropertyInfo(propertyKey));
    storage.set(target.constructor, new Map([...map!.entries()].sort((a, b) => a[0] - b[0])));
  };
}
