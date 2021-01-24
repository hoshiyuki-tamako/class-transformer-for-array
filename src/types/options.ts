import { ClassTransformOptions } from 'class-transformer';
import { TransformValidationOptions } from 'class-transformer-validator';

import { ArrayMemberStorage } from '../storages';

export type ArrayStorageOptions = {
  arrayMemberStorage?: ArrayMemberStorage;
}

export type ArrayDeterminationOptions = {
  isArray?: boolean;
}

export type ArrayMemberOptions = ArrayDeterminationOptions & ArrayStorageOptions;

export type ClassTransformForArrayOptions = ClassTransformOptions & ArrayMemberOptions;
export type TransformValidationForArrayOptions = TransformValidationOptions & ArrayMemberOptions;
export type ClassToPlainArrayOptions = ClassTransformOptions & ArrayStorageOptions;
