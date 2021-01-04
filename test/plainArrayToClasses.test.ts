import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { plainArrayToClasses } from '../src';
import { Color, Product } from './classes/Product';

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PlainArrayToClassesTest {
  @test()
  public normal() {
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
      expect(result).property('displayPrice', new Product().displayPrice);
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
      expect(result).property('displayPrice', new Product().displayPrice);
    }
  }
}
