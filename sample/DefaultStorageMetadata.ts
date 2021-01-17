import 'reflect-metadata';

import { ArrayMember, ArrayMemberStorage, defaultArrayMemberStorage } from '../src';

class Ship {
  @ArrayMember(0)
  public id = '';

  @ArrayMember(1)
  public name = '';
}

// same as getting from static property
// true
const same = ArrayMemberStorage.defaultArrayMemberStorage === defaultArrayMemberStorage;

// true
const has = defaultArrayMemberStorage.has(Ship);

// Map<number, PropertyInfo>
const propertyIndexMap = defaultArrayMemberStorage.getPropertyIndexMap(Ship);
if (propertyIndexMap) {
  // PropertyInfo { key: 'id', options: undefined }
  const a = propertyIndexMap.get(0);
  // PropertyInfo { key: 'name', options: undefined }
  const b = propertyIndexMap.get(1);
  console.log(same, has, a, b);
}
