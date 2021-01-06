import { expect } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { plainArrayToClass } from '../src';
import { Product } from './classes/Product';
import { factory } from './factories';
import { productValidate } from './factories/validate';

/* eslint-disable @typescript-eslint/no-non-null-assertion */


@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PlainArrayToClassTest {
  @test()
  public async normal() {
    const expected = factory.make(Product).one();
    productValidate(expected, plainArrayToClass(Product, [
      expected.id,
      expected.price,
      +expected.displayPrice,
      [expected.color!.name],
      expected.sizes.map((p) => [p.size]),
      expected.values,
    ]));
  }

  @test()
  public async array() {
    const testData = factory.make(Product).many(2);
    const results = plainArrayToClass(Product, testData.map((expected) => [
      expected.id,
      expected.price,
      +expected.displayPrice,
      [expected.color!.name],
      expected.sizes.map((p) => [p.size]),
      expected.values,
    ]), { isArray: true });
    expect(results).property('constructor', Array);
    expect(results).length(testData.length);
    for (const [i, expected] of testData.entries()) {
      expect(results).property(i.toString());
      productValidate(expected, results[i]);
    }
  }
}
