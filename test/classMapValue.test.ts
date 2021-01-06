import { suite, test } from '@testdeck/mocha';

import { classMapValue } from '../src';
import { Product } from './classes/Product';
import { factory } from './factories';
import { productArrayValidate } from './factories/validate';

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ClassMapValueTest {
  @test()
  public async normal() {
    const expected = factory.make(Product).one();
    productArrayValidate(expected, classMapValue(Product, {...expected}));
  }
}
