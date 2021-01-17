import isPromise from 'is-promise';

import { ClassConstructor } from '../class-transformer';
import { ClassTransformerForArray } from '../core';
import { ClassTransformForArrayOptions } from '../types';

export function TransformPlainArrayToClass<T>(classType: ClassConstructor<T>, options?: ClassTransformForArrayOptions): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function(...args: unknown[]) {
      const result = method.apply(this, args);
      return isPromise(result) ? result.then((v) => ClassTransformerForArray.instance.plainArrayToClass(classType, v as unknown[], options as never)) : ClassTransformerForArray.instance.plainArrayToClass(classType, result, options as never);
    };
  };
}
