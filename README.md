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

## Usage

see `./sample/*.ts` for the script

see unit test for more example

### Simple

```ts
import 'reflect-metadata';

import { ArrayMember, classToPlainArray, plainArrayToClass } from 'class-transformer-for-array';

class Blog {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public title = '';
}

// Blog { id: 12, title: "the title" }
const blog = plainArrayToClass(Blog, [12, 'the title']);
// [12, 'the title']
const arr = classToPlainArray(blog);

console.log(blog, arr);
```

### Array

```ts
import 'reflect-metadata';

import { ArrayMember, classToPlainArray, plainArrayToClass } from 'class-transformer-for-array';

class Blog {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public title = '';
}

// [Blog { id: 1, title: 'the title' }, Blog { id: 2, title: 'the title' }, Blog { id: 3, title: 'the title' }]
const blog = plainArrayToClass(Blog, [
  [1, 'the title'],
  [2, 'the title'],
  [3, 'the title'],
], { isArray: true });
// [[1,'the title'],[2,'the title'],[3,'the title']]
const arr = classToPlainArray(blog);

console.log(blog, arr);
```

### Nested

```ts
import 'reflect-metadata';

import { Type } from 'class-transformer';

import { ArrayMember, classToPlainArray, plainArrayToClass } from 'class-transformer-for-array';

class Attachment {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public name = 'default';
}

class Blog {
  @ArrayMember(0)
  @Type(() => Attachment)
  public attachment?: Attachment;
}

// Blog { attachment: Attachment { id: 1, name: "test.png" } }
const blog = plainArrayToClass(Blog, [[1, 'test.png']]);
// [[1, 'test.png']]
const arr = classToPlainArray(blog);

// Blog { attachment: Attachment { id: null, name: 'default' } }
const a = plainArrayToClass(Blog, [[null]]);

// Blog { attachment: Attachment { id: 1, name: null } }
const b = plainArrayToClass(Blog, [[1,null]]);

// Blog { attachment: null }
const c = plainArrayToClass(Blog, [null]);

// Blog {}
const d = plainArrayToClass(Blog, []);

console.log(blog, arr, a, b, c, d);
```

### Nested Array

```ts
import 'reflect-metadata';

import { Type } from 'class-transformer';

import { ArrayMember, classToPlainArray, plainArrayToClass } from 'class-transformer-for-array';

class Attachment {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public name = 'default';
}

class Blog {
  @ArrayMember(0, { isArray: true })
  @Type(() => Attachment)
  public attachment: Attachment[] = [];
}

// Blog { attachment: [Attachment { id: 1, name: "test1.png" }, Attachment { id: 2, name: "test2.png" }] }
const blog = plainArrayToClass(Blog, [
  [
    [1, 'test1.png'],
    [2, 'test2.png'],
  ],
]);
// [[[1,'test1.png'],[2,'test2.png']]]
const arr = classToPlainArray(blog);

// Blog { attachment: null }
const a = plainArrayToClass(Blog, [null]);

console.log(blog, arr, a);
```

### Class Transform

```ts
import 'reflect-metadata';

import { Transform } from 'class-transformer';

import { ArrayMember, classToPlainArray, plainArrayToClass } from 'class-transformer-for-array';

class Product {
  @ArrayMember(0)
  @Transform((v) => v?.toString(), { toClassOnly: true })
  @Transform((v) => +v, { toPlainOnly: true })
  public displayPrice = '0';
}

// Product { displayPrice: '99.99' }
const obj = plainArrayToClass(Product, [99.99]);
// [99.99]
const arr = classToPlainArray(obj);

console.log(obj, arr);
```

### Class Validate

```ts
import 'reflect-metadata';

import { IsString } from 'class-validator';

import { ArrayMember, arrayTransformAndValidate, classToPlainArray } from 'class-transformer-for-array';

class Product {
  @ArrayMember(0)
  @IsString()
  public displayPrice = '0';
}


(async () => {
  // Product { displayPrice: '99.99' }
  const obj = await arrayTransformAndValidate(Product, ['99.99']);
  // ['99.99']
  const arr = classToPlainArray(obj);

  console.log(obj, arr);

  // throw
  await arrayTransformAndValidate(Product, [99.99]).catch(console.error);
})();
```

### Class Validate array

```ts
import 'reflect-metadata';

import { IsString } from 'class-validator';

import { ArrayMember, arrayTransformAndValidate, classToPlainArray } from 'class-transformer-for-array';

class Product {
  @ArrayMember(0)
  @IsString()
  public displayPrice = '0';
}

(async () => {
  // [Product { displayPrice: '99.99' }, Product { displayPrice: '88.88' }, Product { displayPrice: '77.77' }]
  const obj = await arrayTransformAndValidate(Product, [
    ['99.99'],
    ['88.88'],
    ['77.77'],
  ], { isArray: true });
  // [['99.99'],['88.88'],['77.77']]
  const arr = classToPlainArray(obj);

  console.log(obj, arr);
})();
```

### Extends

```ts
import { ArrayMember, classToPlainArray, plainArrayToClass } from 'class-transformer-for-array';

class IdBase {
  @ArrayMember(0)
  public id = 0;
}

class Blog extends IdBase {
  @ArrayMember(1)
  public title = '';
}

class PersonalBlog extends Blog {
  @ArrayMember(2)
  public author = '';
}

// PersonalBlog { id: 1, title: 'book', author: 'admin' }
const result = plainArrayToClass(PersonalBlog, [1, 'book', 'admin']);
// [1,'book','admin']
const arr = classToPlainArray(result);

console.log(result, arr);
```

### Override

```ts
import { ArrayMember, classToPlainArray, plainArrayToClass } from 'class-transformer-for-array';

class Blog {
  @ArrayMember(0)
  public title = '';
}

class PersonalBlog extends Blog {
  @ArrayMember(0)
  public author = '';
}

// PersonalBlog { title: '', author: 'admin' }
const result = plainArrayToClass(PersonalBlog, ['admin']);
// ['admin']
const arr = classToPlainArray(result);

console.log(result, arr);
```

### Map Data Without Transform

```ts
import 'reflect-metadata';

import { ArrayMember, classMapValue, plainMapValue } from 'class-transformer-for-array';

class Blog {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public title = '';
}

// { id: 12, title: 'the title' }
const blog = plainMapValue(Blog, [12, 'the title']);
// [12, 'the title']
const arr = classMapValue(Blog, blog);

console.log(blog, arr);
```

### Error Handling

```ts
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ClassTransformerForArrayError, plainMapValue, UnknownClassError } from 'class-transformer-for-array';
import { TypeError } from 'class-transformer-for-array/common-errors';

// const { TypeError } = commonErrors;
try {
  // class not registered
  plainMapValue(Object, [12, 'the title']);
} catch (e) {
  if (e instanceof UnknownClassError) {
    console.error(e.message);
  }
  // catch all error from this library ( does not include common-errors )
  if (e instanceof ClassTransformerForArrayError) {
    console.error(e.message);
  }
}

try {
  // cannot pass null
  // @ts-ignore
  plainMapValue(Object, null);
} catch (e) {
  // type error
  if (e instanceof TypeError) {
    console.error(e.message);
  }
}
```
