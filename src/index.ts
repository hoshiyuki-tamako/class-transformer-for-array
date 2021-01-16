import { ClassConstructor, classToPlain, plainToClass } from 'class-transformer';
import { transformAndValidate } from 'class-transformer-validator';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { TypeError } from 'common-errors';

import { UnknownClassError } from './exceptions';
import { arrayMemberClassStorage, defaultArrayMemberStorage } from './storage';
import {
  ArrayStorageOptions,
  ClassToPlainArrayOptions,
  ClassTransformForArrayOptions,
  TransformValidationForArrayOptions,
} from './types';

/* eslint-disable @typescript-eslint/ban-types */

export * from './decorators';
export * from './storage';
export * from './exceptions';
export * from './types';

export function plainMapValue<T>(target: ClassConstructor<T>, array: unknown[] | unknown[][], options?: ArrayStorageOptions): Record<string, unknown> {
  if (!Array.isArray(array)) {
    throw new TypeError(`input is not an array: ${array}`);
  }

  const storage = options?.arrayMemberStorage || defaultArrayMemberStorage;

  if (storage === defaultArrayMemberStorage) {
    const storages = arrayMemberClassStorage.get(target);
    if (storages?.length && !storages.includes(defaultArrayMemberStorage)) {
      throw new UnknownClassError(`Cannot found class of ${target.name}. please make sure @ArrayMemberClass is correct`);
    }
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
            obj[property.key] = (o as unknown[][]).map((p) => plainMapValue(subTarget, p, options));
          } else {
            obj[property.key] = plainMapValue(subTarget, o, options);
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
      ? (array as unknown[][]).map((arr) => plainMapValue(target, arr, options))
      : plainMapValue(target, array, options),
    options,
  );
}

export function classMapValue<T>(target: ClassConstructor<T>, object: Record<string, unknown>, options?: ArrayStorageOptions): unknown[] {
  const storage = options?.arrayMemberStorage || defaultArrayMemberStorage;

  if (storage === defaultArrayMemberStorage) {
    const storages = arrayMemberClassStorage.get(target);
    if (storages?.length && !storages.includes(defaultArrayMemberStorage)) {
      throw new UnknownClassError(`Cannot found class of ${target.name}. please make sure @ArrayMemberClass is correct`);
    }
  }

  const map = storage.getPropertyIndexMap(target);
  if (!map) {
    throw new UnknownClassError(`Cannot found class of ${target.name}`);
  }

  const arr = [] as unknown[];
  for (const [i, property] of map.entries()) {
    if (property.key in object) {
      const typeMeta = defaultMetadataStorage.findTypeMetadata(target, property.key);
      const subTarget = typeMeta?.typeFunction() as never ?? typeMeta?.reflectedType;
      if (storage.has(subTarget)) {
        if (typeMeta?.reflectedType === Array || property.options?.isArray) {
          if (object[property.key] == null) {
            arr[i] = object[property.key];
          } else {
            if (!Array.isArray(object[property.key])) {
              throw new TypeError(`property ${target.name}.${property.key} is not an array: ${object[property.key]}`);
            }
            arr[i] = (object[property.key] as Record<string, unknown>[]).map((p) => classMapValue(subTarget, p, options))
          }
        } else {
          arr[i] = classMapValue(subTarget, object[property.key] as Record<string, unknown>, options);
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

export function classToPlainArray<T>(object: T, options?: ClassToPlainArrayOptions): unknown[];
export function classToPlainArray<T>(object: T[], options?: ClassToPlainArrayOptions): unknown[][];
export function classToPlainArray<T>(
    object: T | T[],
    options?: ClassToPlainArrayOptions
  ): unknown[] | unknown[][] {
    if (Array.isArray(object) && !object.length) {
      return [];
    }

    const record = classToPlain(object, options);

    const c = Array.isArray(object)
      ? (object[0] as unknown as ClassConstructor<Object>).constructor as never
      : (object as unknown as ClassConstructor<Object>).constructor as never;
    if (Array.isArray(object)) {
      return (record as Record<string, unknown>[]).map((o) => classMapValue(c, o, options))
    } else {
      return classMapValue(c, record, options);
    }
  }

export async function arrayTransformAndValidate<T extends object>(target: ClassConstructor<T>, array: unknown[], options?: TransformValidationForArrayOptions & { isArray?: false }): Promise<T>;
export async function arrayTransformAndValidate<T extends object>(target: ClassConstructor<T>, array: unknown[][], options?: TransformValidationForArrayOptions & { isArray: true }): Promise<T[]>;
export async function arrayTransformAndValidate<T extends object>(target: ClassConstructor<T>, array: unknown[] | unknown[][], options?: TransformValidationForArrayOptions): Promise<T | T[]> {
  return transformAndValidate(
    target,
    options?.isArray
      ? (array as unknown[][]).map((arr) => plainMapValue(target, arr, options))
      : plainMapValue(target, array, options),
    options,
  );
}
