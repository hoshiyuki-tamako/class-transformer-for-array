import 'reflect-metadata';

import { IsString } from 'class-validator';

import { ArrayMember, arrayTransformAndValidate, classToPlainArray } from '../src';

class Product {
  @ArrayMember(0)
  @IsString()
  public displayPrice = '0';
}

(async () => {
  // [Product { displayPrice: '99.99' }, Product { displayPrice: '88.88' }, Product { displayPrice: '77.77' }]
  const obj = await arrayTransformAndValidate(Product, [
    ['99.99'],
    ['88.88'],
    ['77.77'],
  ], { isArray: true });
  // [['99.99'],['88.88'],['77.77']]
  const arr = classToPlainArray(obj);

  console.log(obj, arr);
})();
