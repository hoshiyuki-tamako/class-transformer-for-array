import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { plainMapValue } from '../src';
import { Product } from './classes/Product';

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PlainMapValueTest {
  @test()
  public async normal() {
    const expected = [1, ['blue'], 2.2, '2', [[1], [2]], [1, 2]] as unknown[][][];
    const result = plainMapValue(Product, expected);
    // basic
    expect(result).property('id', expected[0]);
    // nested
    expect(result).property('color').not.null;
    expect(result).property('color').property('name', expected[1][0]);
    // test class-transform
    expect(result).property('price', expected[2]);
    expect(result).property('displayPrice', expected[3]);
    // test array
    expect(result.sizes).not.null;
    expect(result.sizes).property('constructor').equal(Array);
    expect(result.sizes).length(2);
    expect(result.sizes).property('0').property('size', expected[4][0][0]);
    expect(result.sizes).property('1').property('size', expected[4][1][0]);

    expect(result.values).not.null;
    expect(result.values).length(2);
    expect(result.values).property('0').equal(expected[5][0]);
    expect(result.values).property('1').equal(expected[5][1]);
  }
}
