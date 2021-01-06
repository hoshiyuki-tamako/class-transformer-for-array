import { Fixture } from 'class-fixtures-factory';
import { Expose } from 'class-transformer';
import faker from 'faker';

import { ArrayMember } from '../../src';

export class PassClassTransformOption {
  @ArrayMember(0)
  @Fixture(() => faker.random.number({ min: 1 }))
  public id = 0;

  @ArrayMember(1)
  @Expose()
  @Fixture(() => faker.random.number().toString())
  public title = '';
}
