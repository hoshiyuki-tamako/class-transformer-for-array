import 'reflect-metadata';

import { Fixture } from 'class-fixtures-factory';
import { Type } from 'class-transformer';
import faker from 'faker';

import { ArrayMember } from '../../src';

export class SkipIndexChild {
  @ArrayMember(0)
  @Fixture(() => faker.random.number())
  public id = 1;

  @ArrayMember(2)
  @Fixture(() => faker.name.firstName())
  public name = 'nameChild';
}

export class SkipIndex {
  @ArrayMember(0)
  @Fixture(() => faker.random.number())
  public id = 0;

  @ArrayMember(2)
  @Fixture(() => faker.name.firstName())
  public name = 'name';

  @ArrayMember(4)
  @Type(() => SkipIndexChild)
  @Fixture({ type: () => SkipIndexChild })
  public child?: SkipIndexChild;

  @ArrayMember(6)
  @Type(() => SkipIndexChild)
  @Fixture({ type: () => [SkipIndexChild] })
  public childArray: SkipIndexChild[] = [];
}
