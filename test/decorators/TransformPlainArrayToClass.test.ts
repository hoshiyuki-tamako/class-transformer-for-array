import { suite, test } from '@testdeck/mocha';

import { TransformPlainArrayToClass } from '../../src';
import { arrayMemberStorage, CustomStorageClass, customStorageValidate } from '../classes/CustomStorageClass';
import { PassClassTransformOption, passClassTransformOptionValidate } from './../classes/PassClassTransformOption';
import { Product, productValidate } from './../classes/Product';
import { factory } from './../factories';

class TestToClass {
  public expected = factory.make(Product).one();

  @TransformPlainArrayToClass(Product)
  public run() {
    return this.expected.toPlainArray();
  }

  @TransformPlainArrayToClass(Product)
  public async runAsync() {
    return this.expected.toPlainArray();
  }
}

class TestToClassWithArrayOption {
  public expects = factory.make(CustomStorageClass).many(3);

  @TransformPlainArrayToClass(CustomStorageClass, { arrayMemberStorage, isArray: true })
  public run() {
    return this.expects.map((o) => o.toPlainArray());
  }

  @TransformPlainArrayToClass(CustomStorageClass, { arrayMemberStorage, isArray: true })
  public runAsync() {
    return this.expects.map((o) => o.toPlainArray());
  }
}

class TestToClassWithOption {
  public expected = factory.make(PassClassTransformOption).one();

  @TransformPlainArrayToClass(PassClassTransformOption, { strategy: 'excludeAll' })
  public run() {
    return this.expected.toPlainArray();
  }
}

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TransformPlainArrayToClassTest {
  @test()
  public normal() {
    const test = new TestToClass();
    const result = test.run();
    productValidate(test.expected, result as never);
  }

  @test()
  public async async() {
    const test = new TestToClass();
    const result = await test.runAsync();
    productValidate(test.expected, result as never);
  }

  @test()
  public arrayOption() {
    const test = new TestToClassWithArrayOption();
    const result = test.run();
    for (const [i, expected] of test.expects.entries()) {
      customStorageValidate(expected, result[i] as never);
    }
  }

  @test()
  public async arrayOptionAsync() {
    const test = new TestToClassWithArrayOption();
    const result = await test.runAsync();
    for (const [i, expected] of test.expects.entries()) {
      customStorageValidate(expected, result[i] as never);
    }
  }

  @test()
  public classTransformOption() {
    const test = new TestToClassWithOption();
    const result = test.run();
    passClassTransformOptionValidate(test.expected, result as never);
  }
}
