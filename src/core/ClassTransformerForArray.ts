/* eslint-disable @typescript-eslint/ban-types */
import { classToPlain, plainToClass } from 'class-transformer';
import { transformAndValidate, transformAndValidateSync } from 'class-transformer-validator';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { TypeError } from 'common-errors';

import { ClassConstructor } from '../class-transformer';
import { UnknownClassError } from '../exceptions';
import { defaultArrayMemberClassStorage, defaultArrayMemberStorage } from '../storages';
import {
  ArrayStorageOptions,
  ClassToPlainArrayOptions,
  ClassTransformForArrayOptions,
  TransformValidationForArrayOptions,
} from '../types';

export class ClassTransformerForArray {
  public static instance = new ClassTransformerForArray();

  public plainMapValue<T, TData>(classType: ClassConstructor<T>, array: TData[] | TData[][], options?: ArrayStorageOptions): Record<PropertyKey, unknown> {
    if (!Array.isArray(array)) {
      throw new TypeError(`input is not an array: ${array}`);
    }

    const storage = options?.arrayMemberStorage || defaultArrayMemberStorage;

    if (storage === defaultArrayMemberStorage) {
      const storages = defaultArrayMemberClassStorage.get(classType);
      if (storages?.length && !storages.includes(defaultArrayMemberStorage)) {
        throw new UnknownClassError(`Cannot found class of ${classType.name}. please make sure @ArrayMemberClass is correct`);
      }
    }

    const map = storage.getPropertyIndexMap(classType);
    if (!map) {
      throw new UnknownClassError(`Cannot found class of ${classType.name}`);
    }

    const obj = {} as Record<PropertyKey, unknown>;
    for (const [i, o] of array.entries()) {
      const property = map.get(i);
      if (property) {
        const typeMeta = defaultMetadataStorage.findTypeMetadata(classType, property.key as string);
        const subClassType = typeMeta?.typeFunction() as never ?? typeMeta?.reflectedType;
        if (storage.has(subClassType) && Array.isArray(o)) {
          if (typeMeta?.reflectedType === Array || property.options?.isArray) {
            obj[property.key] = (o).map((p) => this.plainMapValue(subClassType, p as never, options));
          } else {
            obj[property.key] = this.plainMapValue(subClassType, o, options);
          }
        } else {
          obj[property.key] = o;
        }
      }
    }
    return obj;
  }

  public classMapValue<T, TObject extends Record<PropertyKey, unknown>>(classType: ClassConstructor<T>, object: TObject, options?: ArrayStorageOptions): unknown[] {
    const storage = options?.arrayMemberStorage || defaultArrayMemberStorage;

    if (storage === defaultArrayMemberStorage) {
      const storages = defaultArrayMemberClassStorage.get(classType);
      if (storages?.length && !storages.includes(defaultArrayMemberStorage)) {
        throw new UnknownClassError(`Cannot found class of ${classType.name}. please make sure @ArrayMemberClass is correct`);
      }
    }

    const map = storage.getPropertyIndexMap(classType);
    if (!map) {
      throw new UnknownClassError(`Cannot found class of ${classType.name}`);
    }

    const arr = [] as unknown[];
    for (const [i, property] of map.entries()) {
      if (property.key in object) {
        const typeMeta = defaultMetadataStorage.findTypeMetadata(classType, property.key);
        const subClassType = typeMeta?.typeFunction() as never ?? typeMeta?.reflectedType;
        if (storage.has(subClassType)) {
          if (typeMeta?.reflectedType === Array || property.options?.isArray) {
            if (object[property.key] == null) {
              arr[i] = object[property.key];
            } else if (!Array.isArray(object[property.key])) {
              throw new TypeError(`property ${classType.name}.${property.key} is not an array: ${object[property.key]}`);
            } else {
              arr[i] = (object[property.key] as Record<PropertyKey, unknown>[]).map((p) => this.classMapValue(subClassType, p, options));
            }
          } else {
            arr[i] = this.classMapValue(subClassType, object[property.key] as Record<PropertyKey, unknown>, options);
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

  // class transform
  public plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[], options?: ClassTransformForArrayOptions & { isArray?: false }): T;
  public plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[][], options?: ClassTransformForArrayOptions & { isArray: true }): T[];
  public plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[] | TData[][], options?: ClassTransformForArrayOptions): T[] | T {
    return plainToClass(
      classType,
      options?.isArray
        ? (array as TData[][]).map((arr) => this.plainMapValue(classType, arr, options))
        : this.plainMapValue(classType, array, options),
      options,
    );
  }

  public classToPlainArray<T extends object>(object: T, options?: ClassToPlainArrayOptions): unknown[];
  public classToPlainArray<T extends object>(object: T[], options?: ClassToPlainArrayOptions): unknown[][];
  public classToPlainArray<T extends object>(object: T | T[], options?: ClassToPlainArrayOptions): unknown[] | unknown[][] {
      const record = classToPlain(object, options);
      return Array.isArray(object)
        ? (record as Record<PropertyKey, unknown>[]).map((r, i) => this.classMapValue(object[i].constructor as never, r, options))
        : this.classMapValue(object.constructor as never, record as never, options); // TODO class-transformer use record type on newer version
    }

  // class transform validate
  public async arrayTransformAndValidate<T extends object, TData>(classType: ClassConstructor<T>, array: TData[], options?: TransformValidationForArrayOptions & { isArray?: false }): Promise<T>;
  public async arrayTransformAndValidate<T extends object, TData>(classType: ClassConstructor<T>, array: TData[][], options?: TransformValidationForArrayOptions & { isArray: true }): Promise<T[]>;
  public async arrayTransformAndValidate<T extends object, TData>(classType: ClassConstructor<T>, array: TData[] | TData[][], options?: TransformValidationForArrayOptions): Promise<T | T[]> {
    return transformAndValidate(
      classType,
      options?.isArray
        ? (array as TData[][]).map((arr) => this.plainMapValue(classType, arr, options))
        : this.plainMapValue(classType, array, options),
      options,
    );
  }

  public arrayTransformAndValidateSync<T extends object, TData>(classType: ClassConstructor<T>, array: TData[], options?: TransformValidationForArrayOptions & { isArray?: false }): T;
  public arrayTransformAndValidateSync<T extends object, TData>(classType: ClassConstructor<T>, array: TData[][], options?: TransformValidationForArrayOptions & { isArray: true }): T[];
  public arrayTransformAndValidateSync<T extends object, TData>(classType: ClassConstructor<T>, array: TData[] | TData[][], options?: TransformValidationForArrayOptions): T | T[] {
    return transformAndValidateSync(
      classType,
      options?.isArray
        ? (array as TData[][]).map((arr) => this.plainMapValue(classType, arr, options))
        : this.plainMapValue(classType, array, options),
      options,
    );
  }
}
