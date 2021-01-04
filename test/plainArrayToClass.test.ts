import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { plainArrayToClass, UnknownTypeError } from '../src';
import { UnknownClassError } from './../src/exceptions/UnknownClassError';
import { Color, Product } from './classes/Product';
import { UnknownClass, UnknownTypeParent } from './classes/Unknown';

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PlainArrayToClassTest {
  @test()
  public normal() {
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
    expect(result).property('displayPrice', new Product().displayPrice);
  }

  @test()
  public empty() {
    const expected = new Product();
    const result = plainArrayToClass(Product, []);
    // basic
    expect(result.constructor).equals(Product);
    expect(result).property('id', expected.id);
    // nested
    expect(result).not.property('color');
    // test class-transform
    expect(result).property('price', expected.price);
    expect(result).property('displayPrice', expected.displayPrice);
  }

  @test()
  public nullValue() {
    const expected = [1, [null], 2.2] as unknown[][];
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
    expect(result).property('displayPrice', new Product().displayPrice);
  }

  @test()
  public nullArray() {
    const expected = [1, null, 2.2] as unknown[];
    const result = plainArrayToClass(Product, expected);
    // basic
    expect(result.constructor).equals(Product);
    expect(result).property('id', expected[0]);
    // nested
    expect(result).property('color').is.null;
    // test class-transform
    expect(result).property('price', +(expected[2] as number).toFixed());
    expect(result).property('displayPrice', new Product().displayPrice);
  }

  @test()
  public emptyArray() {
    const expected = [1, [], 2.2] as unknown[];
    const result = plainArrayToClass(Product, expected);
    // basic
    expect(result.constructor).equals(Product);
    expect(result).property('id', expected[0]);
    // nested
    expect(result).property('color').not.null;
    expect(result.color?.constructor).equals(Color);
    expect(result).property('color').property('name', new Color().name);
    // test class-transform
    expect(result).property('price', +(expected[2] as number).toFixed());
    expect(result).property('displayPrice', new Product().displayPrice);
  }

  @test()
  public outOfIndex() {
    const expected = [1, ['blue'], 2.2, '0', 'out-of-index'] as unknown[][];
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
    expect(result).property('displayPrice', new Product().displayPrice);
  }

  @test()
  public unknownClass() {
    expect(() => plainArrayToClass(UnknownClass, [])).throw(UnknownClassError);
  }

  @test()
  public unknownTypeWithoutValue() {
    expect(() => plainArrayToClass(UnknownTypeParent, [[]])).not.throw();
  }

  @test()
  public unknownType() {
    expect(() => plainArrayToClass(UnknownTypeParent, [[1]])).throw(UnknownTypeError);
  }
}
