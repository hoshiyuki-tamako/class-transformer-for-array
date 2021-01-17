/* eslint-disable no-sparse-arrays */
import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import { Type } from 'class-transformer';

import { ArrayMember, plainMapValue, UnknownClassError } from '../src';
import { Product, productValidate } from './classes/Product';
import { SkipIndex, skipIndexValidate } from './classes/SkipIndex';
import { factory } from './factories';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
class UnknownClass {}

class ObjectMapChild {
  @ArrayMember(0)
  public id = 0;
}

class ObjectMap {
  @ArrayMember(0)
  @Type(() => ObjectMapChild)
  public test?: ObjectMapChild;
}


@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class PlainMapValueTest {
  @test()
  public normal() {
    const expected = factory.make(Product).one();
    const result = plainMapValue(Product, expected.toPlainArray());
    expected.displayPrice = +expected.displayPrice as never;
    expect(result).property('constructor', Object);
    productValidate(expected, result as never, { constructor: false });
  }

  @test()
  public object() {
    const obj = { ok: 1 };
    const result = plainMapValue(ObjectMap, [obj]);
    expect(result).property('constructor', Object);
    expect(result).property('test', obj);
  }

  @test()
  public skipIndex() {
    const expected = factory.make(SkipIndex).one();
    const result = plainMapValue(SkipIndex, expected.toPlainArray());
    expect(result).property('constructor', Object);
    skipIndexValidate(expected, result as never, { constructor: false });
  }

  @test()
  public unknownClass() {
    expect(() => plainMapValue(UnknownClass, [])).throw(UnknownClassError);
  }

  @test()
  public inputIsNotArray() {
    expect(() => plainMapValue(Product, null as never)).throw(TypeError);
    expect(() => plainMapValue(Product, 1 as never)).throw(TypeError);
  }
}
