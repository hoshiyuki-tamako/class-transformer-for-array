import { TransformClassToPlain } from 'class-transformer';
import isPromise from 'is-promise';

import { classToPlainArray } from '..';
import { ClassToPlainArrayOptions } from '../types';

export function TransformClassToPlainArray(options?: ClassToPlainArrayOptions): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function(...args: unknown[]) {
      const result = method.apply(this, args);
      return isPromise(result) ? result.then((v) => classToPlainArray(v, options)) : classToPlainArray(result, options);
    };
    return TransformClassToPlain(options)(target, propertyKey, descriptor);
  };
}
