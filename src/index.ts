/* eslint-disable @typescript-eslint/ban-types */
import { ClassConstructor } from 'class-transformer';
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

export function plainMapValue<T, TData>(classType: ClassConstructor<T>, array: TData[], options?: ArrayStorageOptions): Record<PropertyKey, unknown> {
  return ClassTransformerForArray.instance.plainMapValue(classType, array, options);
}
export function classMapValue<T, TObject extends Record<PropertyKey, unknown>>(classType: ClassConstructor<T>, object: TObject, options?: ArrayStorageOptions): unknown[] {
  return ClassTransformerForArray.instance.classMapValue(classType, object, options);
}

export function plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[][], options?: ClassTransformForArrayOptions & { isArray: true }): T[];
export function plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[], options?: ClassTransformForArrayOptions & { isArray?: false }): T;
export function plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[] | TData[][], options?: ClassTransformForArrayOptions): T[] | T {
  return ClassTransformerForArray.instance.plainArrayToClass(classType, array as never, options as never);
}

export function classToPlainArray<T extends object>(object: T, options?: ClassToPlainArrayOptions): unknown[];
export function classToPlainArray<T extends object>(object: T[], options?: ClassToPlainArrayOptions): unknown[][];
export function classToPlainArray<T extends object>(object: T | T[], options?: ClassToPlainArrayOptions): unknown[] | unknown[][] {
  return ClassTransformerForArray.instance.classToPlainArray(object, options);
}

export async function arrayTransformAndValidate<T extends object, TData>(classType: ClassConstructor<T>, array: TData[], options?: TransformValidationForArrayOptions & { isArray?: false }): Promise<T>;
export async function arrayTransformAndValidate<T extends object, TData>(classType: ClassConstructor<T>, array: TData[][], options?: TransformValidationForArrayOptions & { isArray: true }): Promise<T[]>;
export async function arrayTransformAndValidate<T extends object, TData>(classType: ClassConstructor<T>, array: TData[] | TData[][], options?: TransformValidationForArrayOptions): Promise<T | T[]> {
  return ClassTransformerForArray.instance.arrayTransformAndValidate(classType, array as never, options as never);
}

export function arrayTransformAndValidateSync<T extends object, TData>(classType: ClassConstructor<T>, array: TData[], options?: TransformValidationForArrayOptions & { isArray?: false }): T;
export function arrayTransformAndValidateSync<T extends object, TData>(classType: ClassConstructor<T>, array: TData[][], options?: TransformValidationForArrayOptions & { isArray: true }): T[];
export function arrayTransformAndValidateSync<T extends object, TData>(classType: ClassConstructor<T>, array: TData[] | TData[][], options?: TransformValidationForArrayOptions): T | T[] {
  return ClassTransformerForArray.instance.arrayTransformAndValidateSync(classType, array as never, options as never);
}
