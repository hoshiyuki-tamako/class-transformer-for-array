import 'reflect-metadata';

export class PropertyInfo {
  public key = '';
  public type = '';

  public constructor(key: string, type: string) {
    this.key = key;
    this.type = type;
  }
}

export type IndexMapProperty = Map<number, PropertyInfo>;
export const storage = new Map<unknown, IndexMapProperty>();
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
