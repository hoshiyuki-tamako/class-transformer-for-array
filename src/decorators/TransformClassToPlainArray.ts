import isPromise from 'is-promise';

import { ClassTransformerForArray } from '../core';
import { ClassToPlainArrayOptions } from '../types';

export function TransformClassToPlainArray(options?: ClassToPlainArrayOptions): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function(...args: unknown[]) {
      const result = method.apply(this, args);
      return isPromise(result) ? result.then((v) => ClassTransformerForArray.instance.classToPlainArray(v, options)) : ClassTransformerForArray.instance.classToPlainArray(result, options);
    };
  };
}
