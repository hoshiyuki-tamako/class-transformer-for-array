import { ArrayMemberOptions } from './types';

export class PropertyInfo {
  public key = '';
  public options?: ArrayMemberOptions;

  public constructor(key: string, options?: ArrayMemberOptions) {
    this.key = key;
    this.options = options;
  }
}

export type IndexMapProperty = Map<number, PropertyInfo>;
export const storage = new Map<unknown, IndexMapProperty>();
