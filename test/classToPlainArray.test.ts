import { SkipIndex, SkipIndexChild } from './classes/SkipIndex';
import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import { ClassType } from 'class-transformer/ClassTransformer';
import { TypeError } from 'common-errors';

import { classToPlainArray, UnknownClassError } from '../src';
import { KeyNotInObject } from './classes/KeyNotInObject';
import { ParentType } from './classes/MissingChildType';
import { Color, Product } from './classes/Product';
import { UnknownClass } from './classes/Unknown';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ClassToPlainArrayTest {
  @test()
  public async normal() {
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
  public async array() {
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

  @test()
  public emptyArray() {
    const result = classToPlainArray([]) as [];
    expect(result.constructor).equals(Array);
    expect(result).length(0);
  }

  @test()
  public unknownClass() {
    expect(() => classToPlainArray(new UnknownClass())).throw(UnknownClassError);
  }

  @test()
  public keyNotInObject() {
    const obj = new KeyNotInObject();
    delete obj.deleteThis;
    const result = classToPlainArray(obj) as [];
    expect(result.constructor).equals(Array);
    expect(result).length(1);
    expect(result).property('0', undefined);
  }

  @test()
  public missingChildType() {
    const result = classToPlainArray(new ParentType()) as [];
    expect(result.constructor).equals(Array);
    expect(result).length(1);
    expect(result).property('0', null);
  }

  @test()
  public undefinedArray() {
    const expected = new Product().setColor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (expected as any).sizes = null;
    const result = classToPlainArray(expected) as unknown[];
    expect(result).property('4').is.null;
  }

  @test()
  public arrayIsNotArray() {
    const expected = new Product().setColor();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (expected as any).sizes = 1;
    expect(() => classToPlainArray(expected)).throw(TypeError)
  }

  @test()
  public skipIndex() {
    const data = new SkipIndex();
    data.child = new SkipIndexChild();
    data.childArray = [new SkipIndexChild(), new SkipIndexChild()];
    const result = classToPlainArray(data) as [];
    expect(result.constructor).equals(Array);
    expect(result).property('0', data.id);
    expect(result).property('2', data.name);
    expect(result).property('4').property('0', data.child.id);
    expect(result).property('4').property('2', data.child.name);
    expect(result).property('6').property('0').property('0', data.childArray[0].id);
    expect(result).property('6').property('0').property('2', data.childArray[0].name);
    expect(result).property('6').property('1').property('0', data.childArray[1].id);
    expect(result).property('6').property('1').property('2', data.childArray[1].name);
  }
}
