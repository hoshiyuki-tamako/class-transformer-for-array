import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import { Type } from 'class-transformer';

import { ArrayMember, plainMapValue, UnknownClassError } from '../src';
import { Product, productValidate } from './classes/Product';
import { SkipIndex, skipIndexValidate } from './classes/SkipIndex';
import { factory } from './factories';

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
export class PlainMapValueTest {
  @test()
  public normal(): void {
    const expected = factory.make(Product).one();
    const result = plainMapValue(Product, expected.toPlainArray());
    expect(result).property('constructor', Object);
    productValidate(Object.assign(expected, { displayPrice: +expected.displayPrice }), result, { constructor: false });
  }

  @test()
  public object(): void {
    const obj = { ok: 1 };
    const result = plainMapValue(ObjectMap, [obj]);
    expect(result).property('constructor', Object);
    expect(result).property('test', obj);
  }

  @test()
  public skipIndex(): void {
    const expected = factory.make(SkipIndex).one();
    const result = plainMapValue(SkipIndex, expected.toPlainArray());
    expect(result).property('constructor', Object);
    skipIndexValidate(expected, result, { constructor: false });
  }

  @test()
  public unknownClass(): void {
    expect(() => plainMapValue(UnknownClass, [])).throw(UnknownClassError);
  }

  @test()
  public inputIsNotArray(): void {
    expect(() => plainMapValue(Product, null as never)).throw(TypeError);
    expect(() => plainMapValue(Product, 1 as never)).throw(TypeError);
  }
}
