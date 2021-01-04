export class PropertyInfo {
  public key = '';

  public constructor(key: string) {
    this.key = key;
  }
}

export type IndexMapProperty = Map<number, PropertyInfo>;
export const storage = new Map<unknown, IndexMapProperty>();
