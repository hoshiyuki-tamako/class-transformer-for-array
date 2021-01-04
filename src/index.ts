/* eslint-disable @typescript-eslint/no-explicit-any */
import { classToPlain, ClassTransformOptions, plainToClass } from 'class-transformer';
import { ClassType, transformAndValidate, TransformValidationOptions } from 'class-transformer-validator';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { TypeError } from 'common-errors';

import { UnknownClassError } from './exceptions';
import { ClassConstructor } from './interfaces/class-constructor.type';
import { storage } from './storage';

export * from './decorators/ArrayMember';
export * from './storage';
export * from './exceptions';
export * from './types';

function plainMapValues<T>(target: ClassConstructor<T>, array: unknown[]) {
  const map = storage.get(target);
  if (!map) {
    throw new UnknownClassError(`Cannot found class of ${target.name}`);
  }

  const obj = {} as { [property: string] : unknown };
  for (const [i, o] of array.entries()) {
    const property = map.get(i);
    if (property) {
      const typeMeta = defaultMetadataStorage.findTypeMetadata(target, property.key);
      const subTarget = typeMeta?.typeFunction();
      if (storage.has(subTarget)) {
        if (Array.isArray(o)) {
          if (typeMeta?.reflectedType === Array || property.options?.isArray) {
            obj[property.key] = o.map((p) => plainMapValues(subTarget as any, p));
          } else {
            obj[property.key] = plainMapValues(subTarget as any, o);
          }
        } else {
          obj[property.key] = o;
        }
      } else {
        obj[property.key] = o;
      }
    }
  }
  return obj;
}

export function plainArrayToClass<T>(target: ClassConstructor<T>, array: unknown[], options?: ClassTransformOptions): T {
  return plainToClass(target, plainMapValues(target, array), options);
}

export function plainArrayToClasses<T>(target: ClassConstructor<T>, array: unknown[][], options?: ClassTransformOptions): T[] {
  return plainToClass(target, array.map((arr) => plainMapValues(target, arr)), options);
}

function classMapValue<T>(target: ClassConstructor<T>, object: Record<string, unknown>) {
  const map = storage.get(target);
  if (!map) {
    throw new UnknownClassError(`Cannot found class of ${target.name}`);
  }

  const arr = [] as unknown[];
  for (const [i, property] of map.entries()) {
    if (property.key in object) {
      const typeMeta = defaultMetadataStorage.findTypeMetadata(target, property.key);
      const subTarget = typeMeta?.typeFunction();
      if (storage.has(subTarget)) {
        if (typeMeta?.reflectedType === Array || property.options?.isArray) {
          if (object[property.key] == null) {
            arr[i] = object[property.key];
          } else {
            if (!Array.isArray(object[property.key])) {
              throw new TypeError(`property ${target.name}.${property.key} is not an array: ${object[property.key]}`);
            }
            arr[i] = (object[property.key] as Record<string, unknown>[]).map((p) => classMapValue(subTarget as any, p))
          }
        } else {
          arr[i] = classMapValue(subTarget as any, object[property.key] as Record<string, unknown>);
        }
      } else {
        arr[i] = object[property.key];
      }
    } else {
      arr[i] = undefined;
    }
  }
  return arr;
}

export function classToPlainArray<T>(object: T, options?: ClassTransformOptions): unknown[];
export function classToPlainArray<T>(object: T[], options?: ClassTransformOptions): unknown[][];
export function classToPlainArray<T>(
    object: T | T[],
    options?: ClassTransformOptions
  ): unknown[] | unknown[][] {
    if (Array.isArray(object) && !object.length) {
      return [];
    }

    const record = classToPlain(object, options);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = Array.isArray(object) ? (object[0] as any).constructor : (object as any).constructor as any;
    if (Array.isArray(object)) {
      return (record as Record<string, unknown>[]).map((o) => classMapValue(c, o))
    } else {
      return classMapValue(c, record);
    }
  }

// eslint-disable-next-line @typescript-eslint/ban-types
export function arrayTransformAndValidate<T extends object>(target: ClassType<T>, array: unknown[], options?: TransformValidationOptions): Promise<T> {
  return transformAndValidate(target, plainMapValues(target, array), options) as unknown as Promise<T>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function arrayTransformAndValidates<T extends object>(target: ClassType<T>, array: unknown[][], options?: TransformValidationOptions): Promise<T[]> {
  return transformAndValidate(target, array.map((arr) => plainMapValues(target, arr)), options) as unknown as Promise<T[]>;
}
