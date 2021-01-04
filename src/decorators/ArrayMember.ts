import 'reflect-metadata';
import { PropertyInfo, storage } from '../storage';

export function ArrayMember(index: number): (target: {
  constructor: unknown;
}, propertyKey: string) => void {
  if (typeof(index) !== 'number') {
    throw new Error('index must be number');
  }

  return (target: { constructor: unknown }, propertyKey: string): void => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const metadata = Reflect.getMetadata("design:type", target as Object, propertyKey);
    if (!storage.has(target.constructor)) {
      storage.set(target.constructor, new Map());
    }
    const map = storage.get(target.constructor);
    if (map) {
      map.set(index, new PropertyInfo(propertyKey, metadata.name));
      storage.set(target.constructor, new Map([...map.entries()].sort((a, b) => a[0] - b[0])));
    }
  };
}
