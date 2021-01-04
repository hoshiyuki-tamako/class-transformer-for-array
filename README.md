# class-transformer-for-array

transform rows of data by index to class object

## Install

```bash
npm i class-transformer-for-array class-transformer-validator class-transformer class-validator reflect-metadata
```

or

```bash
npm i class-transformer-for-array
```

## Example

### Simple

```ts
import 'reflect-metadata';

import { plainArrayToClass, classToPlainArray } from 'class-transformer-for-array';

class Blog {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public title = '';

  @ArrayMember(2)
  public content = '';
}


// Blog { id = 12, title = "the title", content = "abc content" }
const blog = plainArrayToClass(Blog, [12, 'the title', 'abc content']);
// [12, 'the title', 'abc content']
const arr = classToPlainArray(blog);
```

### Complex

```ts
// make sure to import reflect-metadata
import 'reflect-metadata';

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

class Size {
  @ArrayMember(0)
  public size: number = 0;
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

  @ArrayMember(4)
  @Type(() => Size)
  public sizes?: Size[] = [];

  @ArrayMember(5)
  public values: number[] = [];
}

{
  // single object
  const single = [1, ['blue'], 2.2, '2', [[1], [2]], [1, 2]];
  // {"id":1,"price":2,"displayPrice":"2","sizes":[{"size":1},{"size":2}],"color":{"name":"blue"},"values":[1,2]}
  const object1 = plainArrayToClass(Product, single);
  const object2 = await arrayTransformAndValidate(Product, single);
  
  // [1, ['blue'], 2.2, '2', [[1], [2]], [1, 2]]
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
} from 'class-transformer-for-array';

import { TypeError } from 'common-errors';

try {
  const single = [1, ['blue'], 2.2, '2'];
  const object1 = plainArrayToClass(Product, single);
} catch (e) {
  // catch all error
  if (e instanceof ClassTransformerForArrayError) {

  }
  // if class not register
  if (e instanceof UnknownClassError) {

  }
}

try {
  const result = classToPlainArray(new Product());
} catch (e) {
  // all above exception plus below
  // if type error, make sure to `npm i common-errors` to catch below exception
  if (e instanceof TypeError) {

  }
}
```
