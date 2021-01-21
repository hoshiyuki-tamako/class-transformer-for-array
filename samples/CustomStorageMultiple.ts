import 'reflect-metadata';

import {
  ArrayMember,
  ArrayMemberClass,
  ArrayMemberStorage,
  classToPlainArray,
  defaultArrayMemberStorage,
  plainArrayToClass,
} from '../src';

// create storages
const myStorage1 = new ArrayMemberStorage();
const myStorage2 = new ArrayMemberStorage();

@ArrayMemberClass(myStorage1)
@ArrayMemberClass(myStorage2)
@ArrayMemberClass(defaultArrayMemberStorage)
class CustomClass {
  @ArrayMember(0)
  public id = 0;
}

// CustomClass { id: 1 }
const result1 = plainArrayToClass(CustomClass, [1], { arrayMemberStorage: myStorage1 });
const result2 = plainArrayToClass(CustomClass, [1], { arrayMemberStorage: myStorage2 });
const result3 = plainArrayToClass(CustomClass, [1]);

// [1]
const arr1 = classToPlainArray(result1, { arrayMemberStorage: myStorage1 });
const arr2 = classToPlainArray(result2, { arrayMemberStorage: myStorage2 });
const arr3 = classToPlainArray(result3);

console.log(result1, result2, result3, arr1, arr2, arr3);
