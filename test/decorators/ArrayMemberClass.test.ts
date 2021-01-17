/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import { TypeError } from 'common-errors';

import { ArrayMember, ArrayMemberClass } from '../../src';
import { arrayMemberClassStorage, ArrayMemberStorage, defaultArrayMemberStorage } from './../../src/storage';

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

class Tmp {
  public id = 0;
  public name = '';
}

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ArrayMemberClassTest {
  @test()
  public normal() {
    const storage = new ArrayMemberStorage();
    const a = ArrayMemberClass(storage);

    ArrayMember(0)(Object.create(Tmp.prototype), 'id');
    a(Tmp);
    expect(arrayMemberClassStorage.has(Tmp)).true;
  }

  @test()
  public multipleStorage() {
    const storage1 = new ArrayMemberStorage();
    const storage2 = new ArrayMemberStorage();
    const a = ArrayMemberClass(storage1);
    const b = ArrayMemberClass(storage2);
    ArrayMember(0)(Object.create(Tmp.prototype), 'id');
    a(Tmp);
    b(Tmp);
    expect(arrayMemberClassStorage.has(Tmp)).true;
    expect(storage1.has(Tmp)).true;
    expect(storage2.has(Tmp)).true;
  }

  @test()
  public decorators() {
    expect(arrayMemberClassStorage.has(Test)).true;
    expect(customStorage.has(Test)).true;

    expect(arrayMemberClassStorage.has(MultiStorage)).true;
    expect(customStorage.has(MultiStorage)).true;
    expect(customStorage2.has(MultiStorage)).true;

    expect(arrayMemberClassStorage.has(AllStorage)).true;
    expect(customStorage.has(AllStorage)).true;
    expect(customStorage2.has(AllStorage)).true;
    expect(defaultArrayMemberStorage.has(AllStorage)).true;

    expect(arrayMemberClassStorage.has(DuplicateStorage)).true;
    expect(customStorage.has(DuplicateStorage)).true;

    expect(arrayMemberClassStorage.has(EmptyProperty)).true;

    expect(defaultArrayMemberStorage.has(EmptyStorageParam)).true;
  }

  @test()
  public lateDecorator() {
    const storage = new ArrayMemberStorage();
    const a = ArrayMemberClass(storage);

    ArrayMember(0)(Object.create(Tmp.prototype), 'id');
    a(Tmp);
    ArrayMember(1)(Object.create(Tmp.prototype), 'name');
    expect(arrayMemberClassStorage.has(Tmp)).true;

    expect(storage.has(Tmp)).true;

    const propertyIndexMap = storage.getPropertyIndexMap(Tmp);
    expect(propertyIndexMap).not.null;
    const propertyA = propertyIndexMap!.get(0);
    expect(propertyA).not.null;
    expect(propertyA).property('key', 'id');

    const propertyB = propertyIndexMap!.get(1);
    expect(propertyB).not.null;
    expect(propertyB).property('key', 'name');
  }

  @test()
  public typeError() {
    expect(() => ArrayMemberClass(true as never)).throw(TypeError);
    expect(() => ArrayMemberClass({} as never)).throw(TypeError);
  }
}
