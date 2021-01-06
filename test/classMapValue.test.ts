import { suite, test } from '@testdeck/mocha';

import { classMapValue } from '../src';
import { Product, productArrayValidate } from './classes/Product';
import { factory } from './factories';

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ClassMapValueTest {
  @test()
  public normal() {
    const expected = factory.make(Product).one();
    productArrayValidate(expected, classMapValue(Product, {...expected}));
  }
}
