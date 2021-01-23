import { suite, test } from '@testdeck/mocha';
import chai, { expect } from 'chai';
import assertArrays from 'chai-arrays';

import { ArrayMember, defaultArrayMemberStorage, PropertyIndex, PropertyInfo } from '../../src';

chai.use(assertArrays);

class UnOrdered {
  @ArrayMember(1)
  public prop1 = 0;

  @ArrayMember(0)
  public prop0 = 0;

  @ArrayMember(2)
  public prop2 = 0;

  @ArrayMember(3)
  public prop3 = 0;
}

@suite()
export class PropertyIndexTest {
  @test()
  public mapOrdered(): void {
    const propertyIndex = new PropertyIndex();
    propertyIndex.add(3, new PropertyInfo(3))
      .add(0, new PropertyInfo(0))
      .add(1, new PropertyInfo(1));
    expect([...propertyIndex.map.keys()]).to.be.sorted();
  }

  @test()
  public mapOrderedByArrayMember(): void {
    const propertyIndex = defaultArrayMemberStorage.getPropertyIndex(UnOrdered);
    expect(propertyIndex).not.null.not.undefined;
    if (propertyIndex) {
      expect([...propertyIndex.map.keys()]).to.be.sorted();
    }
  }
}
