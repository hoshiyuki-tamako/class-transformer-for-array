import { FixtureFactory } from 'class-fixtures-factory';

import { PassClassTransformOption } from '../classes/PassClassTransformOption';
import { Color, Product, Size } from './../classes/Product';
import { SkipIndex, SkipIndexChild } from './../classes/SkipIndex';

export const factory = new FixtureFactory();
factory.register([Product, Color, Size, SkipIndexChild, SkipIndex, PassClassTransformOption]);
