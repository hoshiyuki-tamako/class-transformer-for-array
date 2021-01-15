import { ClassTransformOptions } from 'class-transformer';
import { TransformValidationOptions } from 'class-transformer-validator';

import { ArrayMemberStorage } from '../storage';

export type ArrayStorageOptions = {
  arrayMemberStorage?: ArrayMemberStorage;
}

export type ArrayMemberOptions = {
  isArray?: boolean;
} & ArrayStorageOptions;

export type ClassTransformForArrayOptions = ClassTransformOptions & ArrayMemberOptions;
export type TransformValidationForArrayOptions = TransformValidationOptions & ArrayMemberOptions;
export type ClassToPlainArrayOptions = ClassTransformOptions & ArrayStorageOptions;
