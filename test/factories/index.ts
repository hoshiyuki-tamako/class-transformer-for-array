import { FixtureFactory } from 'class-fixtures-factory';

import { PassClassTransformOption } from '../classes/PassClassTransformOption';
import { Ship, ShipWithDefault, ShipWithPartialProperty } from '../classes/Ship';
import { CustomStorageClass, CustomStorageClassChild } from './../classes/CustomStorageClass';
import { Override } from './../classes/Override';
import { PersonalBlog } from './../classes/PersonalBlog';
import { Color, Product, Size } from './../classes/Product';
import { SkipIndex, SkipIndexChild } from './../classes/SkipIndex';

export const factory = new FixtureFactory();
factory.register([Product, Color, Size, SkipIndexChild, SkipIndex, PassClassTransformOption, PersonalBlog, Override, CustomStorageClass, CustomStorageClassChild, Ship, ShipWithDefault, ShipWithPartialProperty]);
