import 'reflect-metadata';

import { ArrayMember, classToPlainArray, plainArrayToClass } from '../src';

class Blog {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public title = '';
}

// Blog { id: 12, title: 'the title' }
const blog = plainArrayToClass(Blog, [12, 'the title']);
// [12, 'the title']
const arr = classToPlainArray(blog);

console.log(blog, arr);
