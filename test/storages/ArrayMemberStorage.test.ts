import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { ArrayMemberStorage, defaultArrayMemberStorage, PropertyIndex, PropertyInfo } from '../../src/storages';
import { arrayMemberStorage, CustomStorageClass } from '../classes/CustomStorageClass';

class Tmp {
  public id = 0;
}

class TmpNotExists {
  public id = 0;
}

@suite()
export class ArrayMemberStorageTest {
  @test()
  public normal(): void {
    expect(arrayMemberStorage.has(CustomStorageClass)).true;
    expect(defaultArrayMemberStorage.has(CustomStorageClass)).false;
  }

  @test()
  public add(): void {
    const storage = new ArrayMemberStorage();
    const index = 0;
    const propertyInfo = new PropertyInfo('id');
    storage.add(Tmp, index, propertyInfo);

    expect(storage.map.has(Tmp)).true;
    const propertyIndex = storage.map.get(Tmp);
    expect(propertyIndex).property('constructor', PropertyIndex);
    expect(propertyIndex?.get(index)).equal(propertyInfo);
  }

  @test()
  public has(): void {
    const storage = new ArrayMemberStorage();
    const index = 0;
    const propertyInfo = new PropertyInfo('id');
    storage.add(Tmp, index, propertyInfo);

    expect(storage.has(Tmp)).true;
    expect(storage.has(TmpNotExists)).false;
  }

  @test()
  public getPropertyIndex(): void {
    const storage = new ArrayMemberStorage();
    const index = 0;
    const propertyInfo = new PropertyInfo('id');
    storage.add(Tmp, index, propertyInfo);

    const propertyIndex = storage.getPropertyIndex(Tmp);
    expect(propertyIndex).property('constructor', PropertyIndex);
    expect(propertyIndex?.get(index)).equal(propertyInfo);
  }

  @test()
  public defaultArrayMemberStorageSame(): void {
    expect(ArrayMemberStorage).property('defaultArrayMemberStorage', defaultArrayMemberStorage);
  }
}
