import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { arrayTransformAndValidates } from '../src';
import { Color, Product } from './classes/Product';

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ArrayTransformAndValidatesTest {
  @test()
  public async arrayTransformAndValidates() {
    const expected = [
      [1, ['blue'], 2.2, '2'],
      [2, ['yellow'], 2.2, '2'],
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
