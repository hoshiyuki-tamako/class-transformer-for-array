import { expect } from 'chai';
import { Fixture } from 'class-fixtures-factory';
import { Expose } from 'class-transformer';
import faker from 'faker';

import { ArrayMember } from '../../src';
import { defaultValidateOptions } from '../factories/validate';

export class PassClassTransformOption {
  @ArrayMember(0)
  @Fixture(() => faker.random.number({ min: 1 }))
  public id = 0;

  @ArrayMember(1)
  @Expose()
  @Fixture(() => faker.random.number().toString())
  public title = '';

  public toPlainArray(): unknown[] {
    return [this.id, this.title];
  }
}

export function passClassTransformOptionValidate(expected: PassClassTransformOption, result?: PassClassTransformOption | null, options = defaultValidateOptions): void {
  expect(result).not.null.not.undefined;
  if (options.constructor) {
    expect(result).property('constructor', PassClassTransformOption);
  }
  expect(result).property('id', 0);
  expect(result).property('title', expected.title);
}

export function passClassTransformOptionArrayValidate(expected: PassClassTransformOption, result?: unknown[] | null): void {
  expect(result).not.null.not.undefined;
  expect(result).property('constructor', Array);
  expect(result).length(2);
  expect(result).property('0').is.undefined;
  expect(result).property('1', expected.title);
}
