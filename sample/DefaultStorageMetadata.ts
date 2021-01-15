import { ArrayMember, defaultArrayMemberStorage } from '../src';

class Ship {
  @ArrayMember(0)
  public id = '';

  @ArrayMember(1)
  public name = '';
}

// true
const has = defaultArrayMemberStorage.has(Ship);

// Map<number, PropertyInfo>
const propertyIndexMap = defaultArrayMemberStorage.getPropertyIndexMap(Ship);
if (propertyIndexMap) {
  // PropertyInfo { key: 'id', options: undefined }
  const a = propertyIndexMap.get(0);
  // PropertyInfo { key: 'name', options: undefined }
  const b = propertyIndexMap.get(1);
  console.log(has, a, b);
}
