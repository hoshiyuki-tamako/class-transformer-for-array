import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import { TypeError } from 'common-errors';

import { ArrayMember } from '../../src';

class TestClass {
  public test1 = '';
  public test2 = '';
}

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ArrayMemberTest {
  @test()
  public normal() {
    expect(() => ArrayMember(0)(Object.create(TestClass.prototype), 'test1')).not.throw();
    expect(() => ArrayMember(1)(Object.create(TestClass.prototype), 'test2')).not.throw();
  }

  @test()
  public typeError() {
    expect(() => ArrayMember('' as never)).throw(TypeError);
    expect(() => ArrayMember(true as never)).throw(TypeError);
    expect(() => ArrayMember({} as never)).throw(TypeError);
  }
}
