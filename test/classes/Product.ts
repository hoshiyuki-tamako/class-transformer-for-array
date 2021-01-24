import { expect } from 'chai';
import { Fixture } from 'class-fixtures-factory';
import { Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import faker from 'faker';

import { ArrayMember } from '../../src';
import { defaultValidateOptions } from '../factories/validate';

export class Color {
  @ArrayMember(0)
  @Fixture(() => faker.commerce.color())
  public name = '';
}

export class Size {
  @ArrayMember(0)
  @Fixture(() => faker.random.number())
  public size = 0;
}

export class Product {
  @ArrayMember(0)
  @Fixture(() => faker.random.number())
  public id = 0;

  @ArrayMember(1)
  @IsNumber()
  @Fixture(() => faker.random.number())
  public price = 0;

  @ArrayMember(2)
  @Transform((value) => value?.toString(), { toClassOnly: true })
  @Transform((value) => +value, { toPlainOnly: true })
  @Fixture(() => faker.random.number().toString())
  public displayPrice = '0';

  @ArrayMember(3)
  @Type(() => Color)
  @Fixture({ type: () => Color })
  public color?: Color;

  @ArrayMember(4, { isArray: true })
  @Type(() => Size)
  @Fixture({ type: () => [Size] })
  public sizes: Size[] = [];

  @ArrayMember(5)
  @Fixture({ type: () => [Number] })
  public values: number[] = [];

  public toPlainArray(): unknown[] {
    return [
      this.id,
      this.price,
      +this.displayPrice,
      this.color ? [this.color.name] : null,
      this.sizes.map((p) => [p.size]),
      this.values,
    ];
  }
}

export function productValidate(expected: Product, result?: Product | Partial<Product> | null, options = defaultValidateOptions): void {
  expect(result).not.null.not.undefined;
  if (options.constructor) {
    expect(result).property('constructor', Product);
  }
  expect(result).property('id', expected.id);
  expect(result).property('price', expected.price);
  // class transform
  expect(result).property('displayPrice', expected.displayPrice);
  // nested
  if (expected.color) {
    if (options.constructor) {
      expect(result).property('color').property('constructor', Color);
    }
    expect(result).property('color').property('name', expected.color.name);
  }
  // nested array
  expect(result).property('sizes').property('constructor', Array);
  expect(result).property('sizes').length(expected.sizes.length);
  for (const [i, { size }] of expected.sizes.entries()) {
    if (options.constructor) {
      expect(result).property('sizes').property(i.toString()).property('constructor', Size);
    }
    expect(result).property('sizes').property(i.toString()).property('size', size);
  }
  // array values
  expect(result).property('values').property('constructor', Array);
  expect(result).property('values').length(expected.values.length);
  for (const [i, v] of expected.values.entries() ?? []) {
    expect(result).property('values').property(i.toString(), v);
  }
}

export function productArrayValidate(expected: Product, result?: unknown[] | null): void {
  expect(result).not.null.not.undefined;
  expect(result).property('constructor', Array);
  expect(result).property('0', expected.id);
  expect(result).property('1', expected.price);
  // class transform
  expect(result).property('2', +expected.displayPrice);
  // nested
  if (expected.color) {
    expect(result).property('3').property('0', expected.color.name);
  } else {
    expect(result?.[3] == null).true;
  }
  // nested array
  expect(result).property('4').property('constructor', Array);
  expect(result).property('4').length(expected.sizes.length);
  for (const [i, { size }] of expected.sizes.entries()) {
    expect(result).property('4').property(i.toString()).length(1);
    expect(result).property('4').property(i.toString()).property('0', size);
  }
  // array values
  expect(result).property('5').property('constructor', Array);
  expect(result).property('5').length(expected.values.length);
  for (const [i, v] of expected.values.entries() ?? []) {
    expect(result).property('5').property(i.toString(), v);
  }
}
