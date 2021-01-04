import { ArrayMember } from "../../src";

export class ChildType {

}

export class ParentType {
  @ArrayMember(0)
  public child: ChildType | null = null;
}
