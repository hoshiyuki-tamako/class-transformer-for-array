import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import { TypeError } from 'common-errors';

import { ArrayMember } from '../../src';

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ArrayMemberTest {
  @test()
  public arrayMember() {
    expect(() => ArrayMember(0)).not.throw();
    expect(() => ArrayMember(0)).not.throw();
    ArrayMember(1);
  }

  @test()
  public arrayMemberThrow() {
    expect(() => ArrayMember(0)).not.throw();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => ArrayMember('0' as any)).throw(TypeError);
  }
}
