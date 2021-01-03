import 'reflect-metadata';
import { PropertyInfo, storage } from '../storage';

export function ArrayMember(index: number) {
  return (target: { constructor: unknown }, propertyKey: string): void => {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const metadata = Reflect.getMetadata("design:type", target as Object, propertyKey);
    if (!storage.has(target.constructor)) {
      storage.set(target.constructor, new Map());
    }
    const map = storage.get(target.constructor);
    map?.set(index, new PropertyInfo(propertyKey, metadata.name));
  };
}
