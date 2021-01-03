import { suite, test } from '@testdeck/mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';

import {
  ArrayMember,
  arrayTransformAndValidate,
  arrayTransformAndValidates,
  plainArrayToClass,
  plainArrayToClasses,
} from '../src';

chai.use(chaiAsPromised);
class Color {
  @ArrayMember(0)
  public name: string = '';
}

class Product {
  @ArrayMember(0)
  public id: number = 0;

  @ArrayMember(1)
  @Type(_ => Color)
  public color: Color | null = null;

  @ArrayMember(2)
  @Transform((v) => +v.toFixed())
  public price: number = 0;

  @ArrayMember(3)
  @IsString()
  public displayPrice: string = '0';
}

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Main {
  @test()
  public plainArrayToClass() {
    const expected = [1, ['blue'], 2.2] as unknown[][];
    const result = plainArrayToClass(Product, expected);
    // basic
    expect(result.constructor).equals(Product);
    expect(result).property('id', expected[0]);
    // nested
    expect(result).property('color').not.null;
    expect(result.color?.constructor).equals(Color);
    expect(result).property('color').property('name', expected[1][0]);
    // test class-transform
    expect(result).property('price', +(+expected[2]).toFixed());
  }

  @test()
  public plainArrayToClasses() {
    const expected = [
      [1, ['blue'], 2.2],
      [2, ['yellow'], 2.2],
    ] as unknown[][][];
    const results = plainArrayToClasses(Product, expected);
    {
      const row = expected[0];
      const result = results[0];
      // basic
      expect(result.constructor).equals(Product);
      expect(result).property('id', row[0]);
      // nested
      expect(result).property('color').not.null;
      expect(result.color?.constructor).equals(Color);
      expect(result).property('color').property('name', row[1][0]);
      // test class-transform
      expect(result).property('price', +(+row[2]).toFixed());
    }
    {
      const row = expected[1];
      const result = results[1];
      // basic
      expect(result.constructor).equals(Product);
      expect(result).property('id', row[0]);
      // nested
      expect(result).property('color').not.null;
      expect(result.color?.constructor).equals(Color);
      expect(result).property('color').property('name', row[1][0]);
      // test class-transform
      expect(result).property('price', +(+row[2]).toFixed());
    }
  }

  @test()
  public async arrayTransformAndValidateNormal() {
    const expected = [1, ['blue'], 2.2, '2.2'] as unknown[][];
    const result = await arrayTransformAndValidate(Product, expected);
    // basic
    expect(result.constructor).equals(Product);
    expect(result).property('id', expected[0]);
    // nested
    expect(result).property('color').not.null;
    expect(result.color?.constructor).equals(Color);
    expect(result).property('color').property('name', expected[1][0]);
    // test class-transform
    expect(result).property('price', +(+expected[2]).toFixed());
    // test class-validate
    expect(result).property('displayPrice', expected[3]);
  }

  @test()
  public async arrayTransformAndValidateFail() {
    const expected = [1, ['blue'], 2.2, 0] as unknown[][];
    await expect(arrayTransformAndValidate(Product, expected)).to.eventually.be.rejected;
  }

  @test()
  public async arrayTransformAndValidatesNormal() {
    const expected = [
      [1, ['blue'], 2.2],
      [2, ['yellow'], 2.2],
    ] as unknown[][][];
    const results = await arrayTransformAndValidates(Product, expected);
    {
      const row = expected[0];
      const result = results[0];
      // basic
      expect(result.constructor).equals(Product);
      expect(result).property('id', row[0]);
      // nested
      expect(result).property('color').not.null;
      expect(result.color?.constructor).equals(Color);
      expect(result).property('color').property('name', row[1][0]);
      // test class-transform
      expect(result).property('price', +(+row[2]).toFixed());
    }
    {
      const row = expected[1];
      const result = results[1];
      // basic
      expect(result.constructor).equals(Product);
      expect(result).property('id', row[0]);
      // nested
      expect(result).property('color').not.null;
      expect(result.color?.constructor).equals(Color);
      expect(result).property('color').property('name', row[1][0]);
      // test class-transform
      expect(result).property('price', +(+row[2]).toFixed());
    }
  }

  @test()
  public async arrayTransformAndValidatesFail() {
    const expected = [
      [1, ['blue'], 2.2, 0],
      [2, ['yellow'], 2.2, 0],
    ] as unknown[][][];
    await expect(arrayTransformAndValidates(Product, expected)).to.eventually.be.rejected;
  }
}
