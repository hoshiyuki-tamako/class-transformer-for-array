import { ArrayMember } from "../../src";

export class KeyNotInObject {
  @ArrayMember(0)
  public deleteThis?: boolean = true;
}
