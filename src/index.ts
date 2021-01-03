import { plainToClass } from 'class-transformer';
import { transformAndValidate } from 'class-transformer-validator';
import { ClassType } from 'class-transformer-validator';
import { defaultMetadataStorage } from 'class-transformer/storage';

import { ClassConstructor } from './interfaces/class-constructor.type';
import { storage } from './storage';

export * from './decorators/ArrayMember';

function mapValues<T>(target: ClassConstructor<T>, array: unknown[]) {
  const map = storage.get(target);
  if (!map) {
    return null;
  }

  const obj = {} as { [property: string] : unknown };
  for (const [i, o] of array.entries()) {
    const property = map.get(i);
    if (property) {
      if (property.type === 'Object') {
        const subTarget = defaultMetadataStorage.findTypeMetadata(target, property.key)?.typeFunction();
        if (storage.has(subTarget)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          obj[property.key] = mapValues(subTarget as any, o as unknown[]);
        }
      } else {
        obj[property.key] = o;
      }
    }
  }
  return obj;
}

export function plainArrayToClass<T>(target: ClassConstructor<T>, array: unknown[]): T {
  return plainToClass(target, mapValues(target, array));
}

export function plainArrayToClasses<T>(target: ClassConstructor<T>, array: unknown[][]): T[] {
  return plainToClass(target, array.map((arr) => mapValues(target, arr)));
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function arrayTransformAndValidate<T extends object>(target: ClassType<T>, array: unknown[]): Promise<T> {
  return transformAndValidate(target, mapValues(target, array) ?? {}) as unknown as Promise<T>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function arrayTransformAndValidates<T extends object>(target: ClassType<T>, array: unknown[][]): Promise<T[]> {
  return transformAndValidate(target, array.map((arr) => mapValues(target, arr))) as unknown as Promise<T[]>;
}
