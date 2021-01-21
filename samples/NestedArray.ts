import 'reflect-metadata';

import { Type } from 'class-transformer';

import { ArrayMember, classToPlainArray, plainArrayToClass } from '../src';

class Attachment {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public name = 'default';
}

class Blog {
  @ArrayMember(0, { isArray: true })
  @Type(() => Attachment)
  public attachment: Attachment[] = [];
}

// Blog { attachment: [Attachment { id: 1, name: 'test1.png' }, Attachment { id: 2, name: 'test2.png' }] }
const blog = plainArrayToClass(Blog, [
  [
    [1, 'test1.png'],
    [2, 'test2.png'],
  ],
]);
// [[[1,'test1.png'],[2,'test2.png']]]
const arr = classToPlainArray(blog);

// Blog { attachment: null }
const a = plainArrayToClass(Blog, [null]);

console.log(blog, arr, a);
