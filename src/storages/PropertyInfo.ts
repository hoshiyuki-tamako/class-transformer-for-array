import { ArrayMemberOptions } from './../types';

// TODO typescript 4.2 key: PropertyKey
export class PropertyInfo {
  public key: string;
  public options?: ArrayMemberOptions;

  public constructor(key: PropertyKey, options?: ArrayMemberOptions) {
    this.key = key as string;
    this.options = options;
  }
}
