import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { arrayTransformAndValidateSync } from '../src';
import { UnknownClassError } from './../src/exceptions/UnknownClassError';
import { arrayMemberStorage, CustomStorageClass, customStorageValidate } from './classes/CustomStorageClass';
import { PassClassTransformOption, passClassTransformOptionValidate } from './classes/PassClassTransformOption';
import { Product, productValidate } from './classes/Product';
import { factory } from './factories';

@suite()
export class ArrayTransformAndValidateSyncTest {
  @test()
  public normal(): void {
    const expected = factory.make(Product).one();
    productValidate(expected, arrayTransformAndValidateSync(Product, expected.toPlainArray()));
  }

  @test()
  public array(): void {
    const testData = factory.make(Product).many(2);
    const results = arrayTransformAndValidateSync(Product, testData.map((o) => o.toPlainArray()), { isArray: true });
    expect(results).property('constructor', Array);
    expect(results).length(testData.length);1
    for (const [i, expected] of testData.entries()) {
      expect(results).property(i.toString());
      productValidate(expected, results[i]);
    }
  }

  @test()
  public transformOption(): void {
    const expected = factory.make(PassClassTransformOption).one();
    const result = arrayTransformAndValidateSync(PassClassTransformOption, expected.toPlainArray(), {
      transformer: { strategy: 'excludeAll' },
    });
    passClassTransformOptionValidate(expected, result);
  }

  @test()
  public fail(): void {
    const expected = factory.make(Product).one();
    const plainArray = expected.toPlainArray();
    plainArray[1] = (plainArray[1] as number).toString();
    expect(() => arrayTransformAndValidateSync(Product, plainArray)).throw();
  }

  @test()
  public customStorage(): void {
    const expected = factory.make(CustomStorageClass).one();
    customStorageValidate(expected, arrayTransformAndValidateSync(CustomStorageClass, expected.toPlainArray(), { arrayMemberStorage }));
  }

  @test()
  public customStorageFail(): void {
    const expected = factory.make(CustomStorageClass).one();
    expect(() => arrayTransformAndValidateSync(CustomStorageClass, expected.toPlainArray())).throw(UnknownClassError);
  }
}
