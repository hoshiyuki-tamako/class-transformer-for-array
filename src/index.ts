/* eslint-disable @typescript-eslint/ban-types */
import { classToPlain, ClassTransformOptions, plainToClass } from 'class-transformer';
import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { TypeError } from 'common-errors';

import { UnknownClassError } from './exceptions';
import { ClassConstructor } from './interfaces/class-constructor.type';
import { storage } from './storage';
import { ClassTransformForArrayOptions, TransformValidationForArrayOptions } from './types';

export * from './decorators';
export * from './storage';
export * from './exceptions';
export * from './types';

export function plainMapValue<T>(target: ClassConstructor<T>, array: unknown[] | unknown[][]): Record<string, unknown> {
  if (!Array.isArray(array)) {
    throw new TypeError(`input array is not an array: ${array}`);
  }

  const map = storage.getPropertyIndexMap(target);
  if (!map) {
    throw new UnknownClassError(`Cannot found class of ${target.name}`);
  }

  const obj = {} as Record<string, unknown>;
  for (const [i, o] of array.entries()) {
    const property = map.get(i);
    if (property) {
      const typeMeta = defaultMetadataStorage.findTypeMetadata(target, property.key);
      const subTarget = typeMeta?.typeFunction() as never ?? typeMeta?.reflectedType;
      if (storage.has(subTarget)) {
        if (Array.isArray(o)) {
          if (typeMeta?.reflectedType === Array || property.options?.isArray) {
            obj[property.key] = (o as unknown[][]).map((p) => plainMapValue(subTarget, p));
          } else {
            obj[property.key] = plainMapValue(subTarget, o);
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

export function plainArrayToClass<T>(target: ClassConstructor<T>, array: unknown[], options?: ClassTransformForArrayOptions & { isArray?: false }): T;
export function plainArrayToClass<T>(target: ClassConstructor<T>, array: unknown[][], options?: ClassTransformForArrayOptions & { isArray: true }): T[];
export function plainArrayToClass<T>(target: ClassConstructor<T>, array: unknown[] | unknown[][], options?: ClassTransformForArrayOptions): T[] | T {
  return plainToClass(
    target,
    options?.isArray
      ? (array as unknown[][]).map((arr) => plainMapValue(target, arr))
      : plainMapValue(target, array),
    options,
  );
}

export function classMapValue<T>(target: ClassConstructor<T>, object: Record<string, unknown>): unknown[] {
  const map = storage.getPropertyIndexMap(target);
  if (!map) {
    throw new UnknownClassError(`Cannot found class of ${target.name}`);
  }

  const arr = [] as unknown[];
  for (const [i, property] of map.entries()) {
    if (property.key in object) {
      const typeMeta = defaultMetadataStorage.findTypeMetadata(target, property.key);
      const subTarget = typeMeta?.typeFunction() ?? typeMeta?.reflectedType;
      if (storage.has(subTarget)) {
        if (typeMeta?.reflectedType === Array || property.options?.isArray) {
          if (object[property.key] == null) {
            arr[i] = object[property.key];
          } else {
            if (!Array.isArray(object[property.key])) {
              throw new TypeError(`property ${target.name}.${property.key} is not an array: ${object[property.key]}`);
            }
            arr[i] = (object[property.key] as Record<string, unknown>[]).map((p) => classMapValue(subTarget as never, p))
          }
        } else {
          arr[i] = classMapValue(subTarget as never, object[property.key] as Record<string, unknown>);
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

    const c = Array.isArray(object)
      ? (object[0] as unknown as ClassType<Object>).constructor as never
      : (object as unknown as ClassType<Object>).constructor as never;
    if (Array.isArray(object)) {
      return (record as Record<string, unknown>[]).map((o) => classMapValue(c, o))
    } else {
      return classMapValue(c, record);
    }
  }

export function arrayTransformAndValidate<T extends object>(target: ClassType<T>, array: unknown[], options?: TransformValidationForArrayOptions & { isArray?: false }): Promise<T>;
export function arrayTransformAndValidate<T extends object>(target: ClassType<T>, array: unknown[][], options?: TransformValidationForArrayOptions & { isArray: true }): Promise<T[]>;
export function arrayTransformAndValidate<T extends object>(target: ClassType<T>, array: unknown[] | unknown[][], options?: TransformValidationForArrayOptions): Promise<T | T[]> {
  return transformAndValidate(
    target,
    options?.isArray
      ? (array as unknown[][]).map((arr) => plainMapValue(target, arr))
      : plainMapValue(target, array),
    options,
  );
}
