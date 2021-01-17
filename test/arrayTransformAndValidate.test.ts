import { suite, test } from '@testdeck/mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { arrayTransformAndValidate } from '../src';
import { UnknownClassError } from './../src/exceptions/UnknownClassError';
import { arrayMemberStorage, CustomStorageClass, customStorageValidate } from './classes/CustomStorageClass';
import { PassClassTransformOption, passClassTransformOptionValidate } from './classes/PassClassTransformOption';
import { Product, productValidate } from './classes/Product';
import { factory } from './factories';

chai.use(chaiAsPromised);

@suite()
export class ArrayTransformAndValidateTest {
  @test()
  public async normal(): Promise<void> {
    const expected = factory.make(Product).one();
    productValidate(expected, await arrayTransformAndValidate(Product, expected.toPlainArray()));
  }

  @test()
  public async array(): Promise<void> {
    const testData = factory.make(Product).many(2);
    const results = await arrayTransformAndValidate(Product, testData.map((o) => o.toPlainArray()), { isArray: true });
    expect(results).property('constructor', Array);
    expect(results).length(testData.length);1
    for (const [i, expected] of testData.entries()) {
      expect(results).property(i.toString());
      productValidate(expected, results[i]);
    }
  }

  @test()
  public async transformOption(): Promise<void> {
    const expected = factory.make(PassClassTransformOption).one();
    const result = await arrayTransformAndValidate(PassClassTransformOption, expected.toPlainArray(), {
      transformer: { strategy: 'excludeAll' },
    });
    passClassTransformOptionValidate(expected, result);
  }

  @test()
  public async fail(): Promise<void> {
    const expected = factory.make(Product).one();
    const plainArray = expected.toPlainArray();
    plainArray[1] = (plainArray[1] as number).toString();
    await expect(arrayTransformAndValidate(Product, plainArray)).rejected;
  }

  @test()
  public async customStorage(): Promise<void> {
    const expected = factory.make(CustomStorageClass).one();
    customStorageValidate(expected, await arrayTransformAndValidate(CustomStorageClass, expected.toPlainArray(), { arrayMemberStorage }));
  }

  @test()
  public async customStorageFail(): Promise<void> {
    const expected = factory.make(CustomStorageClass).one();
    await expect(arrayTransformAndValidate(CustomStorageClass, expected.toPlainArray())).rejectedWith(UnknownClassError);
  }
}
