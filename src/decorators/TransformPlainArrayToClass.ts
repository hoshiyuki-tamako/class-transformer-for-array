import { ClassConstructor, TransformPlainToClass } from 'class-transformer';
import isPromise from 'is-promise';

import { plainArrayToClass } from '..';
import { ClassTransformForArrayOptions } from '../types';

export function TransformPlainArrayToClass<T>(classType: ClassConstructor<T>, options?: ClassTransformForArrayOptions): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function(...args: unknown[]) {
      const result = method.apply(this, args);
      return isPromise(result) ? result.then((v) => plainArrayToClass(classType, v, options as never)) : plainArrayToClass(classType, result, options as never);
    };
    return TransformPlainToClass(classType, options)(target, propertyKey, descriptor);
  };
}
