import { classToPlain, plainToClass } from 'class-transformer';
import { transformAndValidate } from 'class-transformer-validator';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { TypeError } from 'common-errors';

import { ClassConstructor } from '../class-transformer';
import { UnknownClassError } from '../exceptions';
import { arrayMemberClassStorage, defaultArrayMemberStorage } from '../storages';
import {
  ArrayStorageOptions,
  ClassToPlainArrayOptions,
  ClassTransformForArrayOptions,
  TransformValidationForArrayOptions,
} from '../types';

export class ClassTransformerForArray {
  public static instance = new ClassTransformerForArray();

  public plainMapValue<T>(classType: ClassConstructor<T>, array: unknown[] | unknown[][], options?: ArrayStorageOptions): Record<PropertyKey, unknown> {
    if (!Array.isArray(array)) {
      throw new TypeError(`input is not an array: ${array}`);
    }

    const storage = options?.arrayMemberStorage || defaultArrayMemberStorage;

    if (storage === defaultArrayMemberStorage) {
      const storages = arrayMemberClassStorage.get(classType);
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
        const typeMeta = defaultMetadataStorage.findTypeMetadata(classType, property.key);
        const subClassType = typeMeta?.typeFunction() as never ?? typeMeta?.reflectedType;
        if (storage.has(subClassType)) {
          if (Array.isArray(o)) {
            if (typeMeta?.reflectedType === Array || property.options?.isArray) {
              obj[property.key] = (o).map((p) => this.plainMapValue(subClassType, p, options));
            } else {
              obj[property.key] = this.plainMapValue(subClassType, o, options);
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

  public classMapValue<T>(classType: ClassConstructor<T>, object: Record<PropertyKey, unknown>, options?: ArrayStorageOptions): unknown[] {
    const storage = options?.arrayMemberStorage || defaultArrayMemberStorage;

    if (storage === defaultArrayMemberStorage) {
      const storages = arrayMemberClassStorage.get(classType);
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
            } else {
              if (!Array.isArray(object[property.key])) {
                throw new TypeError(`property ${classType.name}.${property.key} is not an array: ${object[property.key]}`);
              }
              arr[i] = (object[property.key] as Record<PropertyKey, unknown>[]).map((p) => this.classMapValue(subClassType, p, options))
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
  public plainArrayToClass<T>(classType: ClassConstructor<T>, array: unknown[], options?: ClassTransformForArrayOptions & { isArray?: false }): T;
  public plainArrayToClass<T>(classType: ClassConstructor<T>, array: unknown[][], options?: ClassTransformForArrayOptions & { isArray: true }): T[];
  public plainArrayToClass<T>(classType: ClassConstructor<T>, array: unknown[] | unknown[][], options?: ClassTransformForArrayOptions): T[] | T {
    return plainToClass(
      classType,
      options?.isArray
        ? (array as unknown[][]).map((arr) => this.plainMapValue(classType, arr, options))
        : this.plainMapValue(classType, array, options),
      options,
    );
  }

  public classToPlainArray<T>(object: T, options?: ClassToPlainArrayOptions): unknown[];
  public classToPlainArray<T>(object: T[], options?: ClassToPlainArrayOptions): unknown[][];
  public classToPlainArray<T>(object: T | T[], options?: ClassToPlainArrayOptions): unknown[] | unknown[][] {
      if (Array.isArray(object) && !object.length) {
        return [];
      }

      const record = classToPlain(object, options);

      const c = Array.isArray(object)
        ? (object[0] as unknown as ClassConstructor<T>).constructor as never
        : (object as unknown as ClassConstructor<T>).constructor as never;
      if (Array.isArray(object)) {
        return (record as Record<PropertyKey, unknown>[]).map((o) => this.classMapValue(c, o, options))
      } else {
        // TODO remove as never due to newer class-transformer use record type
        return this.classMapValue(c, record as never, options);
      }
    }

  // class transform validate
  // eslint-disable-next-line @typescript-eslint/ban-types
  public async arrayTransformAndValidate<T extends object>(classType: ClassConstructor<T>, array: unknown[], options?: TransformValidationForArrayOptions & { isArray?: false }): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  public async arrayTransformAndValidate<T extends object>(classType: ClassConstructor<T>, array: unknown[][], options?: TransformValidationForArrayOptions & { isArray: true }): Promise<T[]>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  public async arrayTransformAndValidate<T extends object>(classType: ClassConstructor<T>, array: unknown[] | unknown[][], options?: TransformValidationForArrayOptions): Promise<T | T[]> {
    return transformAndValidate(
      classType,
      options?.isArray
        ? (array as unknown[][]).map((arr) => this.plainMapValue(classType, arr, options))
        : this.plainMapValue(classType, array, options),
      options,
    );
  }
}
