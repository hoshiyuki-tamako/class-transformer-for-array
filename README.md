# class-transformer-for-array

transform rows of data by index to class object

## Install

```bash
npm i class-transformer-for-array class-transformer-validator class-transformer class-validator
```

or

```bash
npm i class-transformer-for-array
```

## Example

```ts
import { Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';

import {
  ArrayMember,
  arrayTransformAndValidate,
  arrayTransformAndValidates,
  classToPlainArray,
  plainArrayToClass,
  plainArrayToClasses,
} from 'class-transformer-for-array';

class Color {
  @ArrayMember(0)
  public name: string = '';
}

class Product {
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
}

{
  // single object
  const single = [1, ['blue'], 2.2, '2'];
  const object1 = plainArrayToClass(Product, single);
  const object2 = await arrayTransformAndValidate(Product, single);
  
  // [1, ['blue'], 2, '2']
  classToPlainArray(object1);
}


{
  // multiple object
  const multiple = [
    [1, ['blue'], 2.2, '2'],
    [2, ['yellow'], 2.2, '2'],
  ];
  const object1 = plainArrayToClasses(Product, multiple);
  const object2 = await arrayTransformAndValidates(Product, multiple);
  
  /*
  [
    [1, ['blue'], 2, '2'],
    [2, ['yellow'], 2, '2'],
  ]
  */
  classToPlainArray(object1);
}
```

### Error Handling

```ts
import {
  ClassTransformerForArrayError,
  UnknownClassError,
  UnknownTypeError
} from 'class-transformer-for-array';

try {
  const single = [1, ['blue'], 2.2, '2'];
  const object1 = plainArrayToClass(Product, single);
} catch (e) {
  // catch all error
  if (e instanceof ClassTransformerForArrayError) {

  }
  // if parent class not register
  if (e instanceof UnknownClassError) {

  }
  // if child class type not register
  if (e instanceof UnknownTypeError) {

  }
}
```
