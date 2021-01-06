import { ClassTransformOptions } from 'class-transformer';
import { TransformValidationOptions } from 'class-transformer-validator';

export type ArrayMemberOptions = {
  isArray?: boolean;
}

export type ClassTransformForArrayOptions = ClassTransformOptions & ArrayMemberOptions;
export type TransformValidationForArrayOptions = TransformValidationOptions & ArrayMemberOptions;
