import 'reflect-metadata';

import {
  ArrayMember,
  ArrayMemberClass,
  ArrayMemberClassStorage,
  ArrayMemberStorage,
  defaultArrayMemberClassStorage,
} from '../src';

const customStorage = new ArrayMemberStorage();

@ArrayMemberClass(customStorage)
class Ship {
  @ArrayMember(0)
  public id = '';

  @ArrayMember(1)
  public name = '';
}

// same as getting from static property
// true
const same = ArrayMemberClassStorage.defaultArrayMemberClassStorage === defaultArrayMemberClassStorage;

// true
const has = defaultArrayMemberClassStorage.has(Ship);

// ArrayMemberStorage[]
const storages = defaultArrayMemberClassStorage.get(Ship);

console.log(same, has, storages);
