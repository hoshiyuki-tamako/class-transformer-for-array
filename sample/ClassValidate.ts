import 'reflect-metadata';

import { IsString } from 'class-validator';

import { ArrayMember, arrayTransformAndValidate, classToPlainArray } from '../src';

class Product {
  @ArrayMember(0)
  @IsString()
  public displayPrice = '0';
}


(async () => {
  // Product { displayPrice: '99.99' }
  const obj = await arrayTransformAndValidate(Product, ['99.99']);
  // ['99.99']
  const arr = classToPlainArray(obj);

  console.log(obj, arr);

  // throw
  await arrayTransformAndValidate(Product, [99.99]).catch(console.error);
})();
