import 'reflect-metadata';

import { IsString } from 'class-validator';

import { ArrayMember, arrayTransformAndValidate, arrayTransformAndValidateSync, classToPlainArray } from '../src';

class Product {
  @ArrayMember(0)
  @IsString()
  public displayPrice = '0';
}

// Product { displayPrice: '99.99' }
const obj1 = arrayTransformAndValidateSync(Product, ['99.99']);

(async () => {
  // Product { displayPrice: '99.99' }
  const obj2 = await arrayTransformAndValidate(Product, ['99.99']);

  // ['99.99']
  const arr = classToPlainArray(obj1);

  console.log(obj1, obj2, arr);

  // throw
  await arrayTransformAndValidate(Product, [99.99]).catch(console.error);
})();
