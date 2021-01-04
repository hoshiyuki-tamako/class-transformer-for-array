/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import { ClassType } from 'class-transformer/ClassTransformer';

import { classToPlainArray } from '../src';
import { Color, Product } from './classes/Product';

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ClassToPlainArrayTest {
  @test()
  public async classToPlainArray() {
    const expected = new Product().setColor();
    const result = classToPlainArray(expected) as unknown[];
    // basic
    expect(result.constructor).equals(Array);
    expect(result).property('0', expected.id);
    // nested
    expect(result).property('1').not.null;
    expect((result[1] as ClassType<Color>)?.constructor).equals(Array);
    expect(result).property('1').property('0', expected.color!.name);
    // other values
    expect(result).property('2', expected.price);
    expect(result).property('3', expected.displayPrice);
  }

  @test()
  public async classToPlainArrayArray() {
    const array = [
      new Product().setColor(),
      new Product().setId(1).setColor().setPrice(1).setDisplayPrice('1'),
    ];
    const results = classToPlainArray(array) as unknown[][];
    {
      const expected = array[0];
      const result = results[0];
      // basic
      expect(result.constructor).equals(Array);
      expect(result).property('0', expected.id);
      // nested
      expect(result).property('1').not.null;
      expect((result[1] as ClassType<Color>)?.constructor).equals(Array);
      expect(result).property('1').property('0', expected.color!.name);
      // other values
      expect(result).property('2', expected.price);
      expect(result).property('3', expected.displayPrice);
    }
    {
      const expected = array[1];
      const result = results[1];
      // basic
      expect(result.constructor).equals(Array);
      expect(result).property('0', expected.id);
      // nested
      expect(result).property('1').not.null;
      expect((result[1] as ClassType<Color>)?.constructor).equals(Array);
      expect(result).property('1').property('0', expected.color!.name);
      // other values
      expect(result).property('2', expected.price);
      expect(result).property('3', expected.displayPrice);
    }
  }
}
