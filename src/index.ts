import { ClassConstructor } from './class-transformer';

import { ClassTransformerForArray } from './core';
import {
  ArrayStorageOptions,
  ClassToPlainArrayOptions,
  ClassTransformForArrayOptions,
  TransformValidationForArrayOptions,
} from './types';

export * from './decorators';
export * from './storages';
export * from './exceptions';
export * from './types';
export * from './core';

export function plainMapValue<T>(classType: ClassConstructor<T>, array: unknown[] | unknown[][], options?: ArrayStorageOptions): Record<PropertyKey, unknown> {
  return ClassTransformerForArray.instance.plainMapValue(classType, array, options);
}
export function classMapValue<T>(classType: ClassConstructor<T>, object: Record<PropertyKey, unknown>, options?: ArrayStorageOptions): unknown[] {
  return ClassTransformerForArray.instance.classMapValue(classType, object, options);
}

export function plainArrayToClass<T>(classType: ClassConstructor<T>, array: unknown[], options?: ClassTransformForArrayOptions & { isArray?: false }): T;
export function plainArrayToClass<T>(classType: ClassConstructor<T>, array: unknown[][], options?: ClassTransformForArrayOptions & { isArray: true }): T[];
export function plainArrayToClass<T>(classType: ClassConstructor<T>, array: unknown[] | unknown[][], options?: ClassTransformForArrayOptions): T[] | T {
  return ClassTransformerForArray.instance.plainArrayToClass(classType, array, options as never);
}

export function classToPlainArray<T>(object: T, options?: ClassToPlainArrayOptions): unknown[];
export function classToPlainArray<T>(object: T[], options?: ClassToPlainArrayOptions): unknown[][];
export function classToPlainArray<T>(object: T | T[], options?: ClassToPlainArrayOptions): unknown[] | unknown[][] {
  return ClassTransformerForArray.instance.classToPlainArray(object, options);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export async function arrayTransformAndValidate<T extends object>(classType: ClassConstructor<T>, array: unknown[], options?: TransformValidationForArrayOptions & { isArray?: false }): Promise<T>;
// eslint-disable-next-line @typescript-eslint/ban-types
export async function arrayTransformAndValidate<T extends object>(classType: ClassConstructor<T>, array: unknown[][], options?: TransformValidationForArrayOptions & { isArray: true }): Promise<T[]>;
// eslint-disable-next-line @typescript-eslint/ban-types
export async function arrayTransformAndValidate<T extends object>(classType: ClassConstructor<T>, array: unknown[] | unknown[][], options?: TransformValidationForArrayOptions): Promise<T | T[]> {
  return ClassTransformerForArray.instance.arrayTransformAndValidate(classType, array, options as never);
}
