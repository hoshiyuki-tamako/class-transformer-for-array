import { expect } from 'chai';
import { Fixture } from 'class-fixtures-factory';
import faker from 'faker';

import { ArrayMember } from '../../src';
import { defaultValidateOptions } from '../factories/validate';

export class IdBase {
  @ArrayMember(0)
  @Fixture(() => faker.random.number())
  public id = 0;
}

export class Blog extends IdBase {
  @ArrayMember(1)
  @Fixture(() => faker.random.alphaNumeric())
  public title = '';
}

export class PersonalBlog extends Blog {
  @ArrayMember(2)
  @Fixture(() => faker.name.firstName())
  public author = '';

  public toPlainArray(): unknown[] {
    return [this.id, this.title, this.author];
  }
}

export function personalBlogValidate(expected: PersonalBlog, result?: PersonalBlog | Partial<PersonalBlog> | null, options = defaultValidateOptions): void {
  expect(result).not.null.not.undefined;
  if (options.constructor) {
    expect(result).property('constructor', PersonalBlog);
  }
  expect(result).property('id', expected.id);
  expect(result).property('title', expected.title);
  expect(result).property('author', expected.author);
}
