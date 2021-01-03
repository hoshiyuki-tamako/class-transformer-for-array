# class-transformer-for-array
 transform rows of data by index to class object

## Example

```ts
import {
  ArrayMember,
  arrayTransformAndValidate,
  arrayTransformAndValidates,
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
  @Type(_ => Color)
  public color?: Color;

  @ArrayMember(2)
  @Transform((v) => +v.toFixed())
  public price: number = 0;

  @ArrayMember(3)
  @IsString()
  public displayPrice: string = '0';
}

// single object
const single = [1, ['blue'], 2.2, '2.2'];
plainArrayToClass(Product, single);
await arrayTransformAndValidate(Product, single);

// multiple object
const multiple = [
  [1, ['blue'], 2.2],
  [2, ['yellow'], 2.2],
] as unknown[][][];
plainArrayToClasses(Product, multiple);
await arrayTransformAndValidates(Product, multiple);
```
