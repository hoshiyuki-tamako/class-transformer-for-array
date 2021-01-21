import 'reflect-metadata';

import { ArrayMember, ArrayMemberStorage, classToPlainArray, plainArrayToClass } from '../src';

// create a storage
const myStorage = new ArrayMemberStorage();

class CustomClass {
  @ArrayMember(0, { arrayMemberStorage: myStorage })
  public id = 0;
}

// CustomClass { id: 1 }
const result = plainArrayToClass(CustomClass, [1], { arrayMemberStorage: myStorage });

// [1]
const arr = classToPlainArray(result, { arrayMemberStorage: myStorage });

// throw UnknownClassError
try {
  plainArrayToClass(CustomClass, [123]);
} catch (e) {
  console.error(e.message);
}

console.log(result, arr);
