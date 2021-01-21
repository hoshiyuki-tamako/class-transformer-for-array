import 'reflect-metadata';

import { IsNumber } from 'class-validator';

import {
  ArrayMember,
  ArrayMemberClass,
  ArrayMemberStorage,
  arrayTransformAndValidate,
  classToPlainArray,
  plainArrayToClass,
} from '../src';

// create a storage
const myStorage = new ArrayMemberStorage();

@ArrayMemberClass(myStorage)
class CustomClass {
  @ArrayMember(0)
  @IsNumber()
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

(async() => {
  // CustomClass { id: 1 }
  const r = await arrayTransformAndValidate(CustomClass, [1], { arrayMemberStorage: myStorage });
  console.log(r);
})();
