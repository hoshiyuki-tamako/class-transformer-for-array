import { ArrayMemberOptions } from './../types';

export class PropertyInfo {
  // TODO due to typescript not allow symbol as object key access, tmp fix
  public key: string;
  public options?: ArrayMemberOptions;

  public constructor(key: PropertyKey, options?: ArrayMemberOptions) {
    // TODO due to typescript not allow symbol as object key access, tmp fix
    this.key = key as string;
    this.options = options;
  }
}
