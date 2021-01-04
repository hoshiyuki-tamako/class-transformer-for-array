/* eslint-disable @typescript-eslint/no-explicit-any */
import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import { ClassType } from 'class-transformer/ClassTransformer';

import { classMapValue } from '../src';
import { Color, Product } from './classes/Product';

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ClassMapValueTest {
  @test()
  public async normal() {
    const expected = {"id":1,"price":2,"displayPrice":"2","sizes":[{"size":1},{"size":2}],"color":{"name":"blue"},"values":[1,2]}
    const result = classMapValue(Product, expected);
    // basic
    expect(result.constructor).equals(Array);
    expect(result).property('0', expected.id);
    // nested
    expect(result).property('1').not.null;
    expect((result[1] as ClassType<Color>)?.constructor).equals(Array);
    expect(result).property('1').property('0', expected.color?.name);
    // other values
    expect(result).property('2', expected.price);
    expect(result).property('3', expected.displayPrice);

    expect(result[4]).not.null;
    expect((result[4] as any).constructor).equal(Array);
    expect(result[4]).length(2);
    expect(result).property('4').property('0').property('0', expected.sizes[0].size);
    expect(result).property('4').property('1').property('0', expected.sizes[1].size);

    expect(result[5]).not.null;
    expect((result[5] as any).constructor).equal(Array);
    expect(result[5]).length(2);
    expect(result).property('5').property('0', expected.values[0]);
    expect(result).property('5').property('1', expected.values[1]);
  }
}
