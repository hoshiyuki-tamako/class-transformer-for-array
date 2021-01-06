import 'reflect-metadata';

import { Fixture } from 'class-fixtures-factory';
import { Transform, Type } from 'class-transformer';
import { IsNumber, ValidateNested, IsString } from 'class-validator';
import faker from 'faker';

import { ArrayMember } from '../../src';

export class Color {
  @ArrayMember(0)
  @Fixture(() => faker.commerce.color())
  public name: string = '';
}

export class Size {
  @ArrayMember(0)
  @Fixture(() => faker.random.number())
  public size: number = 0;
}

export class Product {
  @ArrayMember(0)
  @IsNumber()
  @Fixture(() => faker.random.number())
  public id: number = 0;

  @ArrayMember(1)
  @IsNumber()
  @Fixture(() => faker.random.number())
  public price: number = 0;

  @ArrayMember(2)
  @IsString()
  @Transform((v) => v?.toString())
  @Fixture(() => faker.random.number().toString())
  public displayPrice: string = '0';

  @ArrayMember(3)
  @ValidateNested()
  @Type(() => Color)
  @Fixture({ type: () => Color })
  public color?: Color;

  @ArrayMember(4, { isArray: true })
  @ValidateNested({ each: true })
  @Type(() => Size)
  @Fixture({ type: () => [Size] })
  public sizes: Size[] = [];

  @ArrayMember(5)
  @IsNumber(undefined, { each: true })
  @Fixture({ type: () => [Number] })
  public values: number[] = [];
}
