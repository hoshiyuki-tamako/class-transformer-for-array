import { suite, test } from '@testdeck/mocha';

import { TransformClassToPlainArray } from '../../src';
import { arrayMemberStorage, customStorageArrayValidate, CustomStorageClass } from '../classes/CustomStorageClass';
import { PassClassTransformOption, passClassTransformOptionArrayValidate } from './../classes/PassClassTransformOption';
import { Product, productArrayValidate } from './../classes/Product';
import { factory } from './../factories';

class TestToPlainArray {
  public expected = factory.make(Product).one();

  @TransformClassToPlainArray()
  public run() {
    return this.expected;
  }

  @TransformClassToPlainArray()
  public async runAsync() {
    return this.expected;
  }
}

class TestToPlainArrayWithArrayOption {
  public expects = factory.make(CustomStorageClass).many(3);

  @TransformClassToPlainArray({ arrayMemberStorage })
  public run() {
    return this.expects;
  }

  @TransformClassToPlainArray({ arrayMemberStorage })
  public runAsync() {
    return this.expects;
  }
}

class TestToPlainArrayWithOption {
  public expected = factory.make(PassClassTransformOption).one();

  @TransformClassToPlainArray({ strategy: 'excludeAll' })
  public run() {
    return this.expected;
  }
}


@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TransformClassToPlainArrayTest {
  @test()
  public normal() {
    const test = new TestToPlainArray();
    const result = test.run();
    productArrayValidate(test.expected, result as never);
  }

  @test()
  public async async() {
    const test = new TestToPlainArray();
    const result = await test.runAsync();
    productArrayValidate(test.expected, result as never);
  }

  @test()
  public arrayOption() {
    const test = new TestToPlainArrayWithArrayOption();
    const result = test.run();
    for (const [i, expected] of test.expects.entries()) {
      customStorageArrayValidate(expected, result[i] as never);
    }
  }

  @test()
  public async arrayOptionAsync() {
    const test = new TestToPlainArrayWithArrayOption();
    const result = await test.runAsync();
    for (const [i, expected] of test.expects.entries()) {
      customStorageArrayValidate(expected, result[i] as never);
    }
  }

  @test()
  public classTransformOption() {
    const test = new TestToPlainArrayWithOption();
    const result = test.run();
    passClassTransformOptionArrayValidate(test.expected, result as never);
  }
}
