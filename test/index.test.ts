import { suite, test } from '@testdeck/mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as classTransformerValidator from 'class-transformer-validator';
import sinon from 'sinon';

import {
  arrayTransformAndValidate,
  arrayTransformAndValidateSync,
  classMapValue,
  classToPlainArray,
  ClassTransformerForArray,
  plainArrayToClass,
  plainMapValue,
  TransformClassToPlainArray,
  TransformPlainArrayToClass,
} from '../src';

chai.use(chaiAsPromised);

const sandbox = sinon.createSandbox();
const value = Object.create(null);
const func = () => value;

class TransformTest {
  @TransformPlainArrayToClass(TransformTest)
  public plainArrayToClass() {
    return value;
  }

  @TransformPlainArrayToClass(TransformTest)
  public async plainArrayToClassAsync() {
    return value;
  }

  @TransformClassToPlainArray()
  public classToPlainArray() {
    return value;
  }

  @TransformClassToPlainArray()
  public async classToPlainArrayAsync() {
    return value;
  }
}

@suite('make sure its proxy over static instance')
export class IndexTest {
  public transformTest = new TransformTest();

  @test()
  public plainMapValue(): void {
    expect(plainMapValue(IndexTest, [])).equal(value);
  }

  @test()
  public classMapValue(): void {
    expect(classMapValue(IndexTest, Object())).equal(value);
  }

  @test()
  public plainArrayToClass(): void {
    expect(plainArrayToClass(IndexTest, [])).equal(value);
  }

  @test()
  public classToPlainArray(): void {
    expect(classToPlainArray(Object())).equal(value);
  }

  @test()
  public async arrayTransformAndValidate(): Promise<void> {
    expect(await arrayTransformAndValidate(IndexTest, [])).equal(value);
  }

  @test()
  public arrayTransformAndValidateSync(): void {
    expect(arrayTransformAndValidateSync(IndexTest, [])).equal(value);
  }

  @test()
  public transformPlainArrayToClass(): void {
    expect(this.transformTest.classToPlainArray()).equal(value);
  }

  @test()
  public async transformPlainArrayToClassAsync(): Promise<void> {
    expect(await this.transformTest.plainArrayToClassAsync()).equal(value);
  }

  @test()
  public transformClassToPlainArray(): void {
    expect(this.transformTest.classToPlainArray()).equal(value);
  }

  @test()
  public async transformClassToPlainArrayAsync(): Promise<void> {
    expect(await this.transformTest.classToPlainArrayAsync()).equal(value);
  }

  public before(): void {
    sandbox.stub(ClassTransformerForArray, 'instance').value({
      plainMapValue: func,
      classMapValue: func,
      plainArrayToClass: func,
      classToPlainArray: func,
      arrayTransformAndValidate: func,
      arrayTransformAndValidateSync: func,
    });
    sandbox.stub(classTransformerValidator, 'transformAndValidate').callsFake(() => value);
    sandbox.stub(classTransformerValidator, 'transformAndValidateSync').callsFake(() => value);
  }

  public after(): void {
    sandbox.restore();
  }
}
