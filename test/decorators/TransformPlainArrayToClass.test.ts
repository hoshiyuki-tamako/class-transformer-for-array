import { suite, test } from '@testdeck/mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { TransformPlainArrayToClass } from '../../src';
import { arrayMemberStorage, CustomStorageClass, customStorageValidate } from '../classes/CustomStorageClass';
import { PassClassTransformOption, passClassTransformOptionValidate } from './../classes/PassClassTransformOption';
import { Product, productValidate } from './../classes/Product';
import { factory } from './../factories';

chai.use(chaiAsPromised);

class TestToClass {
  public expected = factory.make(Product).one();

  @TransformPlainArrayToClass(Product)
  public run() {
    return this.expected.toPlainArray() as unknown as Product;
  }

  @TransformPlainArrayToClass(Product)
  public async runAsync() {
    return this.expected.toPlainArray() as unknown as Product;
  }
}

class TestToClassWithArrayOption {
  public expects = factory.make(CustomStorageClass).many(3);

  @TransformPlainArrayToClass(CustomStorageClass, { arrayMemberStorage, isArray: true })
  public run() {
    return this.expects.map((o) => o.toPlainArray()) as unknown as CustomStorageClass[];
  }

  @TransformPlainArrayToClass(CustomStorageClass, { arrayMemberStorage, isArray: true })
  public async runAsync() {
    return this.expects.map((o) => o.toPlainArray()) as unknown as CustomStorageClass[];
  }
}

class TestToClassWithOption {
  public expected = factory.make(PassClassTransformOption).one();

  @TransformPlainArrayToClass(PassClassTransformOption, { strategy: 'excludeAll' })
  public run() {
    return this.expected.toPlainArray() as unknown as PassClassTransformOption;
  }
}

@suite()
export class TransformPlainArrayToClassTest {
  @test()
  public normal(): void {
    const test = new TestToClass();
    const result = test.run();
    productValidate(test.expected, result);
  }

  @test()
  public async async(): Promise<void> {
    const test = new TestToClass();
    const result = await test.runAsync();
    productValidate(test.expected, result);
  }

  @test()
  public arrayOption(): void {
    const test = new TestToClassWithArrayOption();
    const results = test.run();
    expect(results).property('constructor', Array);
    expect(results).length(test.expects.length);
    for (const [i, expected] of test.expects.entries()) {
      customStorageValidate(expected, results[i]);
    }
  }

  @test()
  public async arrayOptionAsync(): Promise<void> {
    const test = new TestToClassWithArrayOption();
    const results = await test.runAsync();
    expect(results).property('constructor', Array);
    expect(results).length(test.expects.length);
    for (const [i, expected] of test.expects.entries()) {
      customStorageValidate(expected, results[i]);
    }
  }

  @test()
  public classTransformOption(): void {
    const test = new TestToClassWithOption();
    const result = test.run();
    passClassTransformOptionValidate(test.expected, result);
  }
}
