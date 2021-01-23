import { ArrayMemberOptions } from './../types';

export class PropertyInfo {
  public key: PropertyKey;
  public options?: ArrayMemberOptions;

  public constructor(key: PropertyKey, options?: ArrayMemberOptions) {
    this.key = key;
    this.options = options;
  }
}
