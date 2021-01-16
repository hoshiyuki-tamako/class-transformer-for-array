import 'reflect-metadata';

import { Transform } from 'class-transformer';

import { ArrayMember, classToPlainArray, plainArrayToClass } from '../src';

class Product {
  @ArrayMember(0)
  @Transform(({ value }) => value?.toString(), { toClassOnly: true })
  @Transform(({ value }) => +value, { toPlainOnly: true })
  public displayPrice = '0';
}

// Product { displayPrice: '99.99' }
const obj = plainArrayToClass(Product, [99.99]);
// [99.99]
const arr = classToPlainArray(obj);

console.log(obj, arr);
