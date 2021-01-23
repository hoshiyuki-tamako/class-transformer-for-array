import { PropertyInfo } from './PropertyInfo';

export type propertyIndex = Map<number, PropertyInfo>;

export class PropertyIndex {
  public map = new Map() as propertyIndex;

  public add(index: number, info: PropertyInfo): this {
    this.map = new Map([...this.entries(), [index, info] as [number, PropertyInfo]].sort((a, b) => a[0] - b[0]));
    return this;
  }

  public set(index: number, info: PropertyInfo): propertyIndex {
    return this.map.set(index, info);
  }

  public get(index: number): PropertyInfo | undefined {
    return this.map.get(index);
  }

  public entries(): IterableIterator<[number, PropertyInfo]> {
    return this.map.entries();
  }
}
