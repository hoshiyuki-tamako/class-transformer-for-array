/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { arrayTransformAndValidate } from '../src';
import { Product } from './classes/Product';
import { factory } from './factories';
import { productValidate } from './factories/validate';

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ArrayTransformAndValidateTest {
  @test()
  public async normal() {
    const expected = factory.make(Product).one();
    productValidate(expected, await arrayTransformAndValidate(Product, this.mapClassToArray(expected)));
  }

  @test()
  public async array() {
    const testData = factory.make(Product).many(2);
    const results = await arrayTransformAndValidate(Product, testData.map(this.mapClassToArray), { isArray: true });
    expect(results).property('constructor', Array);
    expect(results).length(testData.length);
    for (const [i, expected] of testData.entries()) {
      expect(results).property(i.toString());
      productValidate(expected, results[i]);
    }
  }

  @test()
  public async fail() {
    const expected = factory.make(Product).one();
    const input = [
      expected.id.toString(),
      expected.price,
      expected.displayPrice,
      [expected.color!.name],
      expected.sizes.map((p) => [p.size]),
      expected.values,
    ];
    await expect(arrayTransformAndValidate(Product, input)).rejected;
  }

  private mapClassToArray(expected: Product) {
    return [
      expected.id,
      expected.price,
      expected.displayPrice,
      [expected.color!.name],
      expected.sizes.map((p) => [p.size]),
      expected.values,
    ];
  }
}
