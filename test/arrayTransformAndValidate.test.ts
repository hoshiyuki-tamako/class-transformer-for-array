import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { arrayTransformAndValidate } from '../src';
import { Color, Product } from './classes/Product';

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ArrayTransformAndValidateTest {
  @test()
  public async arrayTransformAndValidate() {
    const expected = [1, ['blue'], 2.2, '2'] as unknown[][];
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
}
