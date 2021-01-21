import 'reflect-metadata';

import { Expose } from 'class-transformer';

import { ArrayMember, TransformClassToPlainArray } from '../src';

class Author {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  @Expose()
  public name = '';
}

class Api {
  @TransformClassToPlainArray({ strategy: 'excludeAll' })
  public getAuthor() {
    return new Author();
  }
}

const api = new Api();

// [undefined, '']
const author = api.getAuthor();

console.log(author);
