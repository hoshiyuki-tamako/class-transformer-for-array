import 'reflect-metadata';

import { Expose } from 'class-transformer';

import { ArrayMember, ArrayMemberClass, ArrayMemberStorage, TransformPlainArrayToClass } from '../src';

const customStorage = new ArrayMemberStorage();

@ArrayMemberClass(customStorage)
class Author {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  @Expose()
  public name = '';
}

class Api {
  @TransformPlainArrayToClass(Author, { strategy: 'excludeAll', arrayMemberStorage: customStorage })
  public getAuthor() {
    return [999, 'the author name'] as unknown as Author;
  }
}

const api = new Api();

// Author { id: 0, name: 'the author name' }
const author = api.getAuthor();

console.log(author);
