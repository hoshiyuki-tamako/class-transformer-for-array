import { suite, test } from '@testdeck/mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { TransformClassToPlainArray } from '../../src';
import { arrayMemberStorage, customStorageArrayValidate, CustomStorageClass } from '../classes/CustomStorageClass';
import { PassClassTransformOption, passClassTransformOptionArrayValidate } from './../classes/PassClassTransformOption';
import { Product, productArrayValidate } from './../classes/Product';
import { factory } from './../factories';

chai.use(chaiAsPromised);

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
  public async runAsync() {
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
export class TransformClassToPlainArrayTest {
  @test()
  public normal(): void {
    const test = new TestToPlainArray();
    const result = test.run();
    productArrayValidate(test.expected, result as never);
  }

  @test()
  public async async(): Promise<void> {
    const test = new TestToPlainArray();
    const result = await test.runAsync();
    productArrayValidate(test.expected, result as never);
  }

  @test()
  public arrayOption(): void {
    const test = new TestToPlainArrayWithArrayOption();
    const results = test.run();
    expect(results).property('constructor', Array);
    expect(results).length(test.expects.length);
    for (const [i, expected] of test.expects.entries()) {
      customStorageArrayValidate(expected, results[i] as never);
    }
  }

  @test()
  public async arrayOptionAsync(): Promise<void> {
    const test = new TestToPlainArrayWithArrayOption();
    const results = await test.runAsync();
    expect(results).property('constructor', Array);
    expect(results).length(test.expects.length);
    for (const [i, expected] of test.expects.entries()) {
      customStorageArrayValidate(expected, results[i] as never);
    }
  }

  @test()
  public classTransformOption(): void {
    const test = new TestToPlainArrayWithOption();
    const result = test.run();
    passClassTransformOptionArrayValidate(test.expected, result as never);
  }
}
