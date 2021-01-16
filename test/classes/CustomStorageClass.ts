import { expect } from 'chai';
import { Fixture } from 'class-fixtures-factory';
import { Type } from 'class-transformer';
import faker from 'faker';

import { ArrayMember, ArrayMemberStorage } from '../../src';
import { defaultValidateOptions } from '../factories/validate';

export const arrayMemberStorage = new ArrayMemberStorage();

export class CustomStorageClassChild {
  @ArrayMember(0, { arrayMemberStorage })
  @Fixture(() => faker.random.number())
  public id = 0;
}

export class CustomStorageClass {
  @ArrayMember(0, { arrayMemberStorage })
  @Fixture(() => faker.random.number())
  public id = 0;

  @ArrayMember(1, { arrayMemberStorage })
  @Type(() => CustomStorageClassChild)
  @Fixture({ type: () => CustomStorageClassChild })
  public child?: CustomStorageClassChild;
}

export function customStorageValidate(expected: CustomStorageClass, result?: CustomStorageClass | null, options = defaultValidateOptions): void {
  expect(result).not.null;
  if (options.constructor) {
    expect(result).property('constructor', CustomStorageClass);
  }
  expect(result).property('id', expected.id);
  if (expected.child) {
    if (options.constructor) {
      expect(result).property('child').property('constructor', CustomStorageClassChild);
    }
    expect(result).property('child').property('id', expected.child.id);
  }
}

export function customStorageArrayValidate(expected: CustomStorageClass, result?: unknown[] | null): void {
  expect(result).not.null;
  expect(result).property('constructor', Array);
  expect(result).property('0', expected.id);
  if (expected.child) {
    expect(result).property('1').property('constructor', Array);
    expect(result).property('1').property('0', expected.child.id);
  }
}
