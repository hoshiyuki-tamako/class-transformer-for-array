/* eslint-disable no-sparse-arrays */
import { expect } from 'chai';
import { Fixture } from 'class-fixtures-factory';
import { Type } from 'class-transformer';
import faker from 'faker';

import { ArrayMember } from '../../src';
import { defaultValidateOptions } from '../factories/validate';

export class SkipIndexChild {
  @ArrayMember(0)
  @Fixture(() => faker.random.number())
  public id = 1;

  @ArrayMember(2)
  @Fixture(() => faker.name.firstName())
  public name = 'nameChild';
}

export class SkipIndex {
  @ArrayMember(0)
  @Fixture(() => faker.random.number())
  public id = 0;

  @ArrayMember(2)
  @Fixture(() => faker.name.firstName())
  public name = 'name';

  @ArrayMember(4)
  @Type(() => SkipIndexChild)
  @Fixture({ type: () => SkipIndexChild })
  public child?: SkipIndexChild;

  @ArrayMember(6)
  @Type(() => SkipIndexChild)
  @Fixture({ type: () => [SkipIndexChild] })
  public childArray: SkipIndexChild[] = [];

  public toPlainArray(): unknown[] {
    return [
      this.id,
      ,
      this.name,
      ,
      this.child ? [
        this.child.id,
        ,
        this.child.name,
      ] : null,
      ,
      this.childArray.map((p) => [
        p.id,
        ,
        p.name,
      ]),
    ];
  }
}

export function skipIndexValidate(expected: SkipIndex, result?: SkipIndex | null, options = defaultValidateOptions): void  {
  expect(result).not.null;
  if (options.constructor) {
    expect(result).property('constructor', SkipIndex);
  }
  expect(result).property('id', expected.id);
  expect(result).property('name', expected.name);
  if (expected.child) {
    if (options.constructor) {
      expect(result).property('child').property('constructor', SkipIndexChild);
    }
    expect(result).property('child').property('id', expected.child.id);
    expect(result).property('child').property('name', expected.child.name);
  } else {
    expect(result?.child == null).true;
  }

  expect(result).property('childArray').property('constructor', Array);
  expect(result).property('childArray').length(expected.childArray.length);
  for (const [i, childArray] of expected.childArray.entries()) {
    if (options.constructor) {
      expect(result).property('childArray').property(i.toString()).property('constructor', SkipIndexChild);
    }
    expect(result).property('childArray').property(i.toString()).property('id', childArray.id);
    expect(result).property('childArray').property(i.toString()).property('name', childArray.name);
  }
}

export function skipIndexArrayValidate(expected: SkipIndex, result?: unknown[] | null): void {
  expect(result).not.null;
  expect(result).property('constructor', Array);
  expect(result).property('0', expected.id);
  expect(result).property('2', expected.name);

  if (expected.child) {
    expect(result).property('4').property('constructor', Array);
    expect(result).property('4').property('0', expected.child.id);
    expect(result).property('4').property('2', expected.child.name);
  } else {
    expect(result?.[4] == null).true;
  }

  expect(result).property('6').property('constructor', Array);
  expect(result).property('6').length(expected.childArray.length);
  for (const [i, childArray] of expected.childArray.entries()) {
    expect(result).property('6').property(i.toString()).property('0', childArray.id);
    expect(result).property('6').property(i.toString()).property('2', childArray.name);
  }
}
