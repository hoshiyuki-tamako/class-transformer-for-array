/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { ArrayMemberStorage, defaultArrayMemberStorage, PropertyInfo } from '../src/storage';
import { arrayMemberStorage, CustomStorageClass } from './classes/CustomStorageClass';

class Tmp {
  public id = 0;
}

class TmpNotExists {
  public id = 0;
}

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class StorageTest {
  @test()
  public normal() {
    expect(arrayMemberStorage.has(CustomStorageClass)).true;
    expect(defaultArrayMemberStorage.has(CustomStorageClass)).false;
  }

  @test()
  public add() {
    const storage = new ArrayMemberStorage();
    const index = 0;
    const propertyInfo = new PropertyInfo('id');
    storage.add(Tmp, index, propertyInfo);

    expect(storage.map.has(Tmp)).true;
    expect(storage.map.get(Tmp)).a(Map.name);
    expect(storage.map.get(Tmp)!.get(index)).equal(propertyInfo);
  }

  @test()
  public has() {
    const storage = new ArrayMemberStorage();
    const index = 0;
    const propertyInfo = new PropertyInfo('id');
    storage.add(Tmp, index, propertyInfo);

    expect(storage.has(Tmp)).true;
    expect(storage.has(TmpNotExists)).false;
  }

  @test()
  public getPropertyIndexMap() {
    const storage = new ArrayMemberStorage();
    const index = 0;
    const propertyInfo = new PropertyInfo('id');
    storage.add(Tmp, index, propertyInfo);

    const propertyIndexMap = storage.getPropertyIndexMap(Tmp);
    expect(propertyIndexMap).a(Map.name);
    expect(propertyIndexMap!.get(index)).equal(propertyInfo);
  }
}
