import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { ArrayMember } from '../../src';

class TestClass {
  public test1 = '';
  public test2 = '';
}

@suite()
export class ArrayMemberTest {
  @test()
  public normal(): void {
    expect(() => ArrayMember(0)(Object.create(TestClass.prototype), 'test1')).not.throw();
    expect(() => ArrayMember(1)(Object.create(TestClass.prototype), 'test2')).not.throw();
  }

  @test()
  public typeError(): void {
    expect(() => ArrayMember('' as never)).throw(TypeError);
    expect(() => ArrayMember(true as never)).throw(TypeError);
    expect(() => ArrayMember({} as never)).throw(TypeError);
  }
}
