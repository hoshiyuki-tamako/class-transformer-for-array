import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { plainArrayToClass } from '../src';
import { UnknownClassError } from './../src/exceptions/UnknownClassError';
import { arrayMemberStorage, CustomStorageClass, customStorageValidate } from './classes/CustomStorageClass';
import { Override, overrideValidate } from './classes/Override';
import { PassClassTransformOption } from './classes/PassClassTransformOption';
import { PersonalBlog, personalBlogValidate } from './classes/PersonalBlog';
import { Product, productValidate } from './classes/Product';
import { factory } from './factories';

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

  @test()
  public extendsClass() {
    const expected = factory.make(PersonalBlog).one();
    personalBlogValidate(expected, plainArrayToClass(PersonalBlog, [expected.id, expected.title, expected.author]));
  }

  @test()
  public overrideClass() {
    const expected = factory.make(Override).one();
    overrideValidate(Object.assign(new Override(), {
      weight: expected.weight,
    }), plainArrayToClass(Override, [expected.weight]));
  }

  @test()
  public customStorage() {
    const expected = factory.make(CustomStorageClass).one();
    customStorageValidate(expected, plainArrayToClass(CustomStorageClass, [expected.id], { arrayMemberStorage }));
  }

  @test()
  public customStorageFail() {
    const expected = factory.make(CustomStorageClass).one();
    expect(() => plainArrayToClass(CustomStorageClass, [expected.id])).throw(UnknownClassError);
  }
}
