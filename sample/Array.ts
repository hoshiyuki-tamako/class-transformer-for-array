import 'reflect-metadata';

import { ArrayMember, classToPlainArray, plainArrayToClass } from '../src';

class Blog {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public title = '';
}

// [Blog { id: 1, title: 'the title' }, Blog { id: 2, title: 'the title' }, Blog { id: 3, title: 'the title' }]
const blog = plainArrayToClass(Blog, [
  [1, 'the title'],
  [2, 'the title'],
  [3, 'the title'],
], { isArray: true });
// [[1,'the title'],[2,'the title'],[3,'the title']]
const arr = classToPlainArray(blog);

console.log(blog, arr);
