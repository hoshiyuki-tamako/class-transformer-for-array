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

// class PropertyIndex
const propertyIndex = defaultArrayMemberStorage.getPropertyIndex(Ship);
if (propertyIndex) {
  // map is sorted by index
  // Map<number, PropertyInfo>
  const map = propertyIndex.map;

  // PropertyInfo { key: 'id', options: undefined }
  const a = propertyIndex.get(0);
  // PropertyInfo { key: 'name', options: undefined }
  const b = propertyIndex.get(1);

  console.log(same, has, map, a, b);
}
