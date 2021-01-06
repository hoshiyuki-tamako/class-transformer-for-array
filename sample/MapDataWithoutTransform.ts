import 'reflect-metadata';

import { ArrayMember, classMapValue, plainMapValue } from '../src';

class Blog {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public title = '';
}

// { id: 12, title: 'the title' }
const blog = plainMapValue(Blog, [12, 'the title']);
// [12, 'the title']
const arr = classMapValue(Blog, blog);

console.log(blog, arr);
