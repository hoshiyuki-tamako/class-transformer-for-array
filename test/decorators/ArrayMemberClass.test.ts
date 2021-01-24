import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import {
  ArrayMember,
  ArrayMemberClass,
  ArrayMemberStorage,
  defaultArrayMemberClassStorage,
  defaultArrayMemberStorage,
} from '../../src';
import { PropertyInfo } from './../../src/storages/PropertyInfo';

const customStorage = new ArrayMemberStorage();

@ArrayMemberClass(customStorage)
class Test {
  @ArrayMember(0)
  public id = 0;
}

const customStorage2 = new ArrayMemberStorage();

@ArrayMemberClass(customStorage)
@ArrayMemberClass(customStorage2)
class MultiStorage {
  @ArrayMember(0)
  public id = 0;
}

@ArrayMemberClass(customStorage)
@ArrayMemberClass(customStorage2)
@ArrayMemberClass(defaultArrayMemberStorage)
class AllStorage {
  @ArrayMember(0)
  public id = 0;
}

@ArrayMemberClass(customStorage)
@ArrayMemberClass(customStorage)
class DuplicateStorage {
  @ArrayMember(0)
  public id = 0;
}

@ArrayMemberClass(customStorage)
class EmptyProperty {
}

@ArrayMemberClass()
class EmptyStorageParam {
  @ArrayMember(0)
  public id = 0;
}

@ArrayMemberClass(customStorage)
class LateArrayMemberClass {
  @ArrayMember(0)
  public id = 0;
}


const customStorageMixed = new ArrayMemberStorage();
@ArrayMemberClass(customStorage)
class Mixed {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1, { arrayMemberStorage: customStorageMixed })
  public title = '';
}

class Tmp {
  public id = 0;
  public name = '';
}

@suite()
export class ArrayMemberClassTest {
  @test()
  public normal(): void {
    const storage = new ArrayMemberStorage();
    const a = ArrayMemberClass(storage);

    ArrayMember(0)(Object.create(Tmp.prototype), 'id');
    a(Tmp);
    expect(defaultArrayMemberClassStorage.has(Tmp)).true;
  }

  @test()
  public multipleStorage(): void {
    const storage1 = new ArrayMemberStorage();
    const storage2 = new ArrayMemberStorage();
    const a = ArrayMemberClass(storage1);
    const b = ArrayMemberClass(storage2);
    ArrayMember(0)(Object.create(Tmp.prototype), 'id');
    a(Tmp);
    b(Tmp);
    expect(defaultArrayMemberClassStorage.has(Tmp)).true;
    expect(storage1.has(Tmp)).true;
    expect(storage2.has(Tmp)).true;
  }

  @test()
  public decorators(): void {
    expect(defaultArrayMemberClassStorage.has(Test)).true;
    expect(customStorage.has(Test)).true;
    expect(defaultArrayMemberStorage.has(Test)).false;
    expect(defaultArrayMemberStorage.mapMoved.has(Test)).true;

    expect(defaultArrayMemberClassStorage.has(MultiStorage)).true;
    expect(customStorage.has(MultiStorage)).true;
    expect(customStorage2.has(MultiStorage)).true;
    expect(defaultArrayMemberStorage.has(MultiStorage)).false;
    expect(defaultArrayMemberStorage.mapMoved.has(MultiStorage)).true;

    expect(defaultArrayMemberClassStorage.has(AllStorage)).true;
    expect(customStorage.has(AllStorage)).true;
    expect(customStorage2.has(AllStorage)).true;
    expect(defaultArrayMemberStorage.has(AllStorage)).true;
    expect(defaultArrayMemberStorage.mapMoved.has(AllStorage)).false;

    expect(defaultArrayMemberClassStorage.has(DuplicateStorage)).true;
    expect(customStorage.has(DuplicateStorage)).true;
    expect(defaultArrayMemberStorage.has(DuplicateStorage)).false;
    expect(defaultArrayMemberStorage.mapMoved.has(DuplicateStorage)).true;

    expect(defaultArrayMemberClassStorage.has(EmptyProperty)).true;

    expect(defaultArrayMemberStorage.has(EmptyStorageParam)).true;
  }

  @test()
  public lateArrayMemberDecorator(): void {
    const storage = new ArrayMemberStorage();
    const a = ArrayMemberClass(storage);

    ArrayMember(0)(Object.create(Tmp.prototype), 'id');
    a(Tmp);
    ArrayMember(1)(Object.create(Tmp.prototype), 'name');
    expect(defaultArrayMemberClassStorage.has(Tmp)).true;

    expect(storage.has(Tmp)).true;

    const propertyIndex = storage.getPropertyIndex(Tmp);
    expect(propertyIndex).not.null.not.undefined;
    const propertyA = propertyIndex?.get(0);
    expect(propertyA).not.null.not.undefined;
    expect(propertyA).property('key', 'id');

    const propertyB = propertyIndex?.get(1);
    expect(propertyB).not.null.not.undefined;
    expect(propertyB).property('key', 'name');
  }

  @test()
  public lateArrayMemberClassDecorator(): void {
    ArrayMemberClass()(LateArrayMemberClass);
    expect(customStorage.has(LateArrayMemberClass)).true;
    expect(defaultArrayMemberStorage.has(LateArrayMemberClass)).true;
    expect(defaultArrayMemberStorage.mapMoved.has(LateArrayMemberClass)).false;
  }

  @test()
  public mixed(): void {
    expect(customStorage.has(Mixed)).true;
    expect(customStorageMixed.has(Mixed)).true;
    expect(defaultArrayMemberStorage.has(Mixed)).false;

    //
    const propertyIndex = customStorage.getPropertyIndex(Mixed);
    expect(propertyIndex).not.null.not.undefined;
    if (propertyIndex) {
      expect(propertyIndex.get(1)).undefined;

      const propertyInfo = propertyIndex.get(0);
      expect(propertyInfo).property('constructor', PropertyInfo);
      expect(propertyInfo).property('key', 'id');
      expect(propertyInfo).property('options').undefined;
    }

    //
    const mixedPropertyIndex = customStorageMixed.getPropertyIndex(Mixed);
    expect(mixedPropertyIndex).not.null.not.undefined;
    if (mixedPropertyIndex) {
      expect(mixedPropertyIndex.get(0)).undefined;

      const propertyInfo = mixedPropertyIndex.get(1);
      expect(propertyInfo).property('constructor', PropertyInfo);
      expect(propertyInfo).property('key', 'title');
      expect(propertyInfo).property('options').not.null.not.undefined;
    }
  }

  @test()
  public typeError(): void {
    expect(() => ArrayMemberClass(true as never)).throw(TypeError);
    expect(() => ArrayMemberClass({} as never)).throw(TypeError);
  }
}
