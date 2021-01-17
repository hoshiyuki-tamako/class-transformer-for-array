import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { classMapValue } from '../src';
import { Product, productArrayValidate } from './classes/Product';
import { factory } from './factories';

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ClassMapValueTest {
  @test()
  public normal() {
    const expected = factory.make(Product).one();
    const result = classMapValue(Product, {...expected});
    expect(result).property('2', expected.displayPrice);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[2] = +result[2];
    productArrayValidate(expected, result);
  }
}
