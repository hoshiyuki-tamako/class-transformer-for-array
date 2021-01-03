export class PropertyInfo {
  public key = '';
  public type = '';

  public constructor(key: string, type: string) {
    this.key = key;
    this.type = type;
  }
}

export type IndexMapProperty = Map<number, PropertyInfo>;
export const storage = new Map<unknown, IndexMapProperty>();
