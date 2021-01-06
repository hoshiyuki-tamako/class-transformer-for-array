import { FixtureFactory } from 'class-fixtures-factory';

import { Color, Product, Size } from './../classes/Product';
import { SkipIndex, SkipIndexChild } from './../classes/SkipIndex';

export const factory = new FixtureFactory();
factory.register([Product, Color, Size, SkipIndexChild, SkipIndex]);
