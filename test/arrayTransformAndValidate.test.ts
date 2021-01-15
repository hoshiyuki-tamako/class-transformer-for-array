import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { arrayTransformAndValidate } from '../src';
import { UnknownClassError } from './../src/exceptions/UnknownClassError';
import { arrayMemberStorage, CustomStorageClass, customStorageValidate } from './classes/CustomStorageClass';
import { PassClassTransformOption } from './classes/PassClassTransformOption';
import { Product, productValidate } from './classes/Product';
import { factory } from './factories';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
  public async transformOption() {
    const expected = factory.make(PassClassTransformOption).one();
    const result = await arrayTransformAndValidate(PassClassTransformOption, [expected.id, expected.title], {
      transformer: { strategy: 'excludeAll' },
    });
    expect(result).property('constructor', PassClassTransformOption);
    expect(result).property('id', 0);
    expect(result).property('title', expected.title);
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

  @test()
  public async customStorage() {
    const expected = factory.make(CustomStorageClass).one();
    customStorageValidate(expected, await arrayTransformAndValidate(CustomStorageClass, [expected.id], { arrayMemberStorage }));
  }

  @test()
  public async customStorageFail() {
    const expected = factory.make(CustomStorageClass).one();
    await expect(arrayTransformAndValidate(CustomStorageClass, [expected.id])).rejectedWith(UnknownClassError);
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
