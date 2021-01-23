import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import {
  ArrayMember,
  ArrayMemberClass,
  ArrayMemberStorage,
  defaultArrayMemberClassStorage,
  defaultArrayMemberStorage,
} from '../../src';

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

    expect(defaultArrayMemberClassStorage.has(MultiStorage)).true;
    expect(customStorage.has(MultiStorage)).true;
    expect(customStorage2.has(MultiStorage)).true;

    expect(defaultArrayMemberClassStorage.has(AllStorage)).true;
    expect(customStorage.has(AllStorage)).true;
    expect(customStorage2.has(AllStorage)).true;
    expect(defaultArrayMemberStorage.has(AllStorage)).true;

    expect(defaultArrayMemberClassStorage.has(DuplicateStorage)).true;
    expect(customStorage.has(DuplicateStorage)).true;

    expect(defaultArrayMemberClassStorage.has(EmptyProperty)).true;

    expect(defaultArrayMemberStorage.has(EmptyStorageParam)).true;
  }

  @test()
  public lateDecorator(): void {
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
  public typeError(): void {
    expect(() => ArrayMemberClass(true as never)).throw(TypeError);
    expect(() => ArrayMemberClass({} as never)).throw(TypeError);
  }
}
