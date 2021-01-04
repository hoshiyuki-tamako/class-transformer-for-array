import { Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';

import { ArrayMember } from '../../src';

export class Color {
  @ArrayMember(0)
  public name: string = '';
}

export class Product {
  @ArrayMember(0)
  public id: number = 0;

  @ArrayMember(1)
  @Type(() => Color)
  public color?: Color;

  @ArrayMember(2)
  @Transform((v) => +v?.toFixed())
  public price: number = 0;

  @ArrayMember(3)
  @IsString()
  public displayPrice: string = '0';

  public setId(id: number): this {
    this.id = id;
    return this;
  }

  public setColor(color: Color = new Color()): this {
    this.color = color;
    return this;
  }

  public setPrice(price: number): this {
    this.price = price;
    return this;
  }

  public setDisplayPrice(displayPrice: string): this {
    this.displayPrice = displayPrice;
    return this;
  }
}
