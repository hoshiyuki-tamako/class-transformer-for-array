import { expect } from 'chai';
import { Fixture } from 'class-fixtures-factory';
import faker from 'faker';

import { ArrayMember, ArrayMemberClass } from '../../src';
import { defaultValidateOptions } from '../factories/validate';
import { ArrayMemberStorage, defaultArrayMemberStorage } from './../../src/storage';

export const shipStorage = new ArrayMemberStorage();

//
@ArrayMemberClass(shipStorage)
export class Ship {
  @ArrayMember(0)
  @Fixture(() => faker.random.number())
  public id = 0;

  public toPlainArray(): unknown[] {
    return [this.id];
  }
}

export function shipValidate(expected: Ship, result?: Ship | null, options = defaultValidateOptions): void {
  expect(result).not.null;
  if (options.constructor) {
    expect(result).property('constructor', Ship);
  }
  expect(result).property('id', expected.id);
}

export function shipArrayValidate(expected: Ship, result?: unknown[] | null): void {
  expect(result).not.null;
  expect(result).property('constructor', Array);
  expect(result).property('0', expected.id);
}

//
@ArrayMemberClass(shipStorage)
@ArrayMemberClass(defaultArrayMemberStorage)
export class ShipWithDefault extends Ship {
  @ArrayMember(1)
  @Fixture(() => faker.name.firstName())
  public name = '';

  public toPlainArray(): unknown[] {
    return [...super.toPlainArray(), this.name];
  }
}

export function shipWithDefaultValidate(expected: ShipWithDefault, result?: ShipWithDefault | null, options = defaultValidateOptions): void {
  expect(result).not.null;
  if (options.constructor) {
    expect(result).property('constructor', ShipWithDefault);
  }
  expect(result).property('id', expected.id);
  expect(result).property('name', expected.name);
}

export function shipWithDefaultArrayValidate(expected: ShipWithDefault, result?: unknown[] | null): void {
  expect(result).not.null;
  expect(result).property('constructor', Array);
  expect(result).property('0', expected.id);
  expect(result).property('1', expected.name);
}

//
export const shipStoragePartial = new ArrayMemberStorage();

@ArrayMemberClass(shipStorage)
export class ShipWithPartialProperty {
  @ArrayMember(0)
  @Fixture(() => faker.random.number({ min: 1 }))
  public id = 0;

  @ArrayMember(1, { arrayMemberStorage: shipStoragePartial })
  @Fixture(() => faker.name.firstName())
  public name = '';

  public toPlainArray(): unknown[] {
    return [this.id, this.name];
  }
}

export function shipWithPartialPropertyValidate(expected: ShipWithPartialProperty, result?: ShipWithPartialProperty | null, options = defaultValidateOptions): void {
  expect(result).not.null;
  if (options.constructor) {
    expect(result).property('constructor', ShipWithPartialProperty);
  }
  expect(result).property('id', expected.id);
  expect(result).property('name', expected.name);
}

export function shipWithPartialPropertyArrayValidate(expected: ShipWithPartialProperty, result?: unknown[] | null): void {
  expect(result).not.null;
  expect(result).property('constructor', Array);
  if (expected.id != null) {
    expect(result).property('0', expected.id);
  }
  if (expected.name != null) {
    expect(result).property('1', expected.name);
  }
}
