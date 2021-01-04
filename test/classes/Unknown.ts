import { ArrayMember } from '../../src';

export class UnknownClass {
}

export class UnknownTypeChild {
}

export class UnknownTypeParent {
  @ArrayMember(0)
  public property?: UnknownTypeChild;
}
