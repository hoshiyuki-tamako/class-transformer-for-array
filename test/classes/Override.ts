import { expect } from 'chai';
import { Fixture } from 'class-fixtures-factory';
import faker from 'faker';

import { ArrayMember } from '../../src';
import { defaultValidateOptions } from '../factories/validate';
import { IdBase } from './PersonalBlog';

export class Override extends IdBase {
  @ArrayMember(0)
  @Fixture(() => faker.random.number())
  public weight = 0;
}

export function OverrideValidate(expected: Override, result?: Override | null, options = defaultValidateOptions): void {
  expect(result).not.null;
  if (options.constructor) {
    expect(result).property('constructor', Override);
  }
  expect(result).property('id', expected.id);
  expect(result).property('weight', expected.weight);
}
