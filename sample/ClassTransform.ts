import 'reflect-metadata';

import { Transform } from 'class-transformer';

import { ArrayMember, classToPlainArray, plainArrayToClass } from '../src';

class Product {
  @ArrayMember(0)
  @Transform((v) => v?.toString(), { toClassOnly: true })
  @Transform((v) => +v, { toPlainOnly: true })
  public displayPrice = '0';
}

// Product { displayPrice: '99.99' }
const obj = plainArrayToClass(Product, [99.99]);
// [99.99]
const arr = classToPlainArray(obj);

console.log(obj, arr);
