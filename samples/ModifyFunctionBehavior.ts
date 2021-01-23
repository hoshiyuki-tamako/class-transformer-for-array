import 'reflect-metadata';

import { ArrayMember, ClassTransformerForArray, plainArrayToClass } from '../src';

class Blog {
  @ArrayMember(0)
  public id = 0;
}

// modify the function call
const oldMethod = ClassTransformerForArray.instance.plainArrayToClass;
ClassTransformerForArray.instance.plainArrayToClass = function(...args: unknown[]) {
  console.log('Called this method');
  return oldMethod.apply(this, args as never);
}

// Blog { id: 1 }
const blog = plainArrayToClass(Blog, [1]);

console.log(blog);

// restore
ClassTransformerForArray.instance.plainArrayToClass = oldMethod;
