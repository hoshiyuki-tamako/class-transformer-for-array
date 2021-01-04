import { Type } from 'class-transformer';

import { ArrayMember } from '../../src';

export class SkipIndexChild {
  @ArrayMember(0)
  public id = 1;

  @ArrayMember(2)
  public name = 'nameChild';
}

export class SkipIndex {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(2)
  public name = 'name';

  @ArrayMember(4)
  @Type(() => SkipIndexChild)
  public child?: SkipIndexChild;

  @ArrayMember(6)
  @Type(() => SkipIndexChild)
  public childArray: SkipIndexChild[] = [];
}
