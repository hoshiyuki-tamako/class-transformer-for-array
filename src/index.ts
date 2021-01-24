import { ClassConstructor } from './class-transformer';
import { ClassMapValueReturn, ClassTransformerForArray } from './core';
import {
  ArrayStorageOptions,
  ClassToPlainArrayOptions,
  ClassTransformForArrayOptions,
  TransformValidationForArrayOptions,
} from './types';

/* eslint-disable @typescript-eslint/ban-types */
export * from './decorators';
export * from './storages';
export * from './exceptions';
export * from './types';
export * from './core';

export function plainMapValue<T, TData>(classType: ClassConstructor<T>, array: TData[], options?: ArrayStorageOptions): Partial<T> {
  return ClassTransformerForArray.instance.plainMapValue(classType, array, options);
}
export function classMapValue<T>(classType: ClassConstructor<T>, object: Partial<T>, options?: ArrayStorageOptions): ClassMapValueReturn<Partial<T>> {
  return ClassTransformerForArray.instance.classMapValue(classType, object, options);
}

export function plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[][], options?: ClassTransformForArrayOptions & { isArray: true }): T[];
export function plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[], options?: ClassTransformForArrayOptions & { isArray?: false }): T;
export function plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[] | TData[][], options?: ClassTransformForArrayOptions): T[] | T {
  return ClassTransformerForArray.instance.plainArrayToClass(classType, array as never, options as never);
}

export function classToPlainArray<T extends object>(object: Exclude<T, unknown[]>, options?: ClassToPlainArrayOptions): ClassMapValueReturn<T>;
export function classToPlainArray<T extends object>(object: T[], options?: ClassToPlainArrayOptions): ClassMapValueReturn<T>[];
export function classToPlainArray<T extends object>(object: T | T[], options?: ClassToPlainArrayOptions): ClassMapValueReturn<T> | ClassMapValueReturn<T>[] {
  return ClassTransformerForArray.instance.classToPlainArray(object as never, options);
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
