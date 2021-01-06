import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { plainArrayToClass } from '../src';
import { PassClassTransformOption } from './classes/PassClassTransformOption';
import { Product } from './classes/Product';
import { factory } from './factories';
import { productValidate } from './factories/validate';

/* eslint-disable @typescript-eslint/no-non-null-assertion */


@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PlainArrayToClassTest {
  @test()
  public normal() {
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
  public array() {
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

  @test()
  public classTransformOption() {
    const expected = factory.make(PassClassTransformOption).one();
    const result = plainArrayToClass(PassClassTransformOption, [expected.id, expected.title], { strategy: 'excludeAll' });
    expect(result).property('constructor', PassClassTransformOption);
    expect(result).property('id', 0);
    expect(result).property('title', expected.title);
  }
}
