import { IsNumber } from 'class-validator';

import { ArrayMember, ArrayMemberStorage, arrayTransformAndValidate, classToPlainArray, plainArrayToClass } from '../src';

// create a storage
const myStorage = new ArrayMemberStorage();

class CustomClass {
  @ArrayMember(0, { arrayMemberStorage: myStorage })
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
  const r = await arrayTransformAndValidate(CustomClass, [123], { arrayMemberStorage: myStorage });
  console.log(r);
})();
