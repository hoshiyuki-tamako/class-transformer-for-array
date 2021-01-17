import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { classMapValue } from '../src';
import { Product, productArrayValidate } from './classes/Product';
import { factory } from './factories';

@suite()
export class ClassMapValueTest {
  @test()
  public normal(): void {
    const expected = factory.make(Product).one();
    const result = classMapValue(Product, {...expected});
    expect(result).property('2', expected.displayPrice);
    result[2] = +(result[2] as string);
    productArrayValidate(expected, result);
  }
}
