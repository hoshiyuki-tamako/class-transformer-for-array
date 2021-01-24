import 'reflect-metadata';

import { ArrayMember, ArrayMemberClass, ArrayMemberStorage, classToPlainArray, plainArrayToClass } from '../src';

// create storages
const myStorage1 = new ArrayMemberStorage();
const myStorage2 = new ArrayMemberStorage();

@ArrayMemberClass(myStorage1)
class CustomClass {
  @ArrayMember(0)
  public id = 0;

  // Make sure arrayMemberStorage is not defaultArrayMemberStorage as default storage will be override by @ArrayMemberClass(myStorage1)
  @ArrayMember(1, { arrayMemberStorage: myStorage2 })
  public name = '';
}

// CustomClass { id: 1, name: '' }
const result1 = plainArrayToClass(CustomClass, [1, 'name'], { arrayMemberStorage: myStorage1 });

// CustomClass { id: 0, name: 'name' }
const result2 = plainArrayToClass(CustomClass, [1, 'name'], { arrayMemberStorage: myStorage2 });

// [1]
const arr1 = classToPlainArray(result1, { arrayMemberStorage: myStorage1 });

// [undefined, 'name']
const arr2 = classToPlainArray(result2, { arrayMemberStorage: myStorage2 });

console.log(result1, result2, arr1, arr2);
