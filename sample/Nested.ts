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
  @ArrayMember(0)
  @Type(() => Attachment)
  public attachment?: Attachment;
}

// Blog { attachment: Attachment { id: 1, name: 'test.png' } }
const blog = plainArrayToClass(Blog, [[1, 'test.png']]);
// [[1, 'test.png']]
const arr = classToPlainArray(blog);

// Blog { attachment: Attachment { id: null, name: 'default' } }
const a = plainArrayToClass(Blog, [[null]]);

// Blog { attachment: Attachment { id: 1, name: null } }
const b = plainArrayToClass(Blog, [[1,null]]);

// Blog { attachment: null }
const c = plainArrayToClass(Blog, [null]);

// Blog {}
const d = plainArrayToClass(Blog, []);

console.log(blog, arr, a, b, c, d);
