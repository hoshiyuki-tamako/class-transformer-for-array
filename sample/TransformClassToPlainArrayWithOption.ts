import 'reflect-metadata';

import { Expose } from 'class-transformer';

import { ArrayMember, TransformClassToPlainArray } from '../src';

class Author {
  public id = 0;

  @ArrayMember(0)
  @Expose()
  public name = '';
}

class Api {
  @TransformClassToPlainArray()
  public getAuthor() {
    return new Author();
  }
}

const api = new Api();

// ['']
const author = api.getAuthor();

console.log(author);
