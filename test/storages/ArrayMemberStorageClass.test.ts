import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { ArrayMemberClassStorage, ArrayMemberStorage, defaultArrayMemberStorage, PropertyInfo } from '../../src';

class TmpDefault {
  public id = 0;
}

class Tmp {
  public id = 0;
}

@suite()
export class ArrayMemberStorageClassTest {
  @test()
  public defaultUseDefaultArrayMemberStorage(): void {
    const arrayMemberStorageClass = new ArrayMemberClassStorage();
    expect(arrayMemberStorageClass).property('defaultStorage', defaultArrayMemberStorage);
  }

  @test()
  public addDefaultStorage(): void {
    const arrayMemberStorageClass = new ArrayMemberClassStorage();
    arrayMemberStorageClass.add(TmpDefault);
    expect(arrayMemberStorageClass.get(TmpDefault)).length(1).includes(defaultArrayMemberStorage);
  }

  @test()
  public defaultStorage(): void {
    const arrayMemberStorage = new ArrayMemberStorage();
    const customStorage = new ArrayMemberStorage();
    const arrayMemberStorageClass = new ArrayMemberClassStorage(arrayMemberStorage);
    arrayMemberStorage.add(Tmp, 0, new PropertyInfo('id'));
    arrayMemberStorageClass.add(Tmp, customStorage);

    expect(arrayMemberStorageClass).property('defaultStorage', arrayMemberStorage);
    expect(customStorage.has(Tmp)).true;
    expect(arrayMemberStorage.has(Tmp)).false;
    expect(arrayMemberStorage.mapMoved.has(Tmp)).true;
  }
}
