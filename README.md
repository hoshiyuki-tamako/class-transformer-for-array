# class-transformer-for-array

transform rows of data by index to class object

## Documentation

[https://hoshiyuki-tamako.github.io/class-transformer-for-array/guide/](https://hoshiyuki-tamako.github.io/class-transformer-for-array/guide/)

## Notes

Make sure using `class-transformer@0.2.3`. newer version will be supported in future

## Install

```bash
npm i class-transformer-for-array class-transformer-validator class-transformer@0.2.3 class-validator reflect-metadata
```

or

```bash
npm i class-transformer-for-array
```

## Usage

### Basic

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

### Nested Raw Array

```ts
import 'reflect-metadata';

import { ArrayMember, classToPlainArray, plainArrayToClass } from 'class-transformer-for-array';

class Attachment {
  @ArrayMember(0)
  public serverIds: number[] = [];
}

// Attachment { serverIds: [1, 2, 3] }
const attachment = plainArrayToClass(Attachment, [[1,2,3]]);
// [[1,2,3]]
const arr = classToPlainArray(attachment);

// Attachment { serverIds: [] }
const a = plainArrayToClass(Attachment, []);
// Attachment { serverIds: null }
const b = plainArrayToClass(Attachment, [null]);

console.log(attachment, arr, a, b);
```

### Class Transform

```ts
import 'reflect-metadata';

import { Transform } from 'class-transformer';

import { ArrayMember, classToPlainArray, plainArrayToClass } from 'class-transformer-for-array';

class Product {
  @ArrayMember(0)
  @Transform((value) => value?.toString(), { toClassOnly: true })
  @Transform((value) => +value, { toPlainOnly: true })
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

import { ArrayMember, arrayTransformAndValidate, arrayTransformAndValidateSync, classToPlainArray } from 'class-transformer-for-array';

class Product {
  @ArrayMember(0)
  @IsString()
  public displayPrice = '0';
}

// Product { displayPrice: '99.99' }
const obj1 = arrayTransformAndValidateSync(Product, ['99.99']);

(async () => {
  // Product { displayPrice: '99.99' }
  const obj2 = await arrayTransformAndValidate(Product, ['99.99']);

  // ['99.99']
  const arr = classToPlainArray(obj1);

  console.log(obj1, obj2, arr);

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
import 'reflect-metadata';

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
import 'reflect-metadata';

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
import { ClassTransformerForArrayError, plainMapValue, UnknownClassError } from 'class-transformer-for-array';

try {
  // class not registered
  plainMapValue(Object, [12, 'the title']);
} catch (e) {
  if (e instanceof UnknownClassError) {
    console.error(e.message);
  }
  // catch all error from this library ( does not include TypeError )
  if (e instanceof ClassTransformerForArrayError) {
    console.error(e.message);
  }
}

try {
  // cannot pass null
  plainMapValue(Object, null as never);
} catch (e) {
  // type error
  if (e instanceof TypeError) {
    console.error(e.message);
  }
}
```

### Custom Storage

```ts
import 'reflect-metadata';

import { IsNumber } from 'class-validator';

import {
  ArrayMember,
  ArrayMemberClass,
  ArrayMemberStorage,
  arrayTransformAndValidate,
  classToPlainArray,
  plainArrayToClass,
} from 'class-transformer-for-array';

// create a storage
const myStorage = new ArrayMemberStorage();

@ArrayMemberClass(myStorage)
class CustomClass {
  @ArrayMember(0)
  @IsNumber()
  public id = 0;
}

// CustomClass { id: 1 }
const result = plainArrayToClass(CustomClass, [1], { arrayMemberStorage: myStorage });

// [1]
const arr = classToPlainArray(result, { arrayMemberStorage: myStorage });

// throw UnknownClassError
try {
  plainArrayToClass(CustomClass, [123]);
} catch (e) {
  console.error(e.message);
}

console.log(result, arr);

(async() => {
  // CustomClass { id: 1 }
  const r = await arrayTransformAndValidate(CustomClass, [1], { arrayMemberStorage: myStorage });
  console.log(r);
})();
```

### Custom Storage Multiple

```ts
import 'reflect-metadata';

import {
  ArrayMember,
  ArrayMemberClass,
  ArrayMemberStorage,
  classToPlainArray,
  defaultArrayMemberStorage,
  plainArrayToClass,
} from 'class-transformer-for-array';

// create storages
const myStorage1 = new ArrayMemberStorage();
const myStorage2 = new ArrayMemberStorage();

@ArrayMemberClass(myStorage1)
@ArrayMemberClass(myStorage2)
@ArrayMemberClass(defaultArrayMemberStorage)
class CustomClass {
  @ArrayMember(0)
  public id = 0;
}

// CustomClass { id: 1 }
const result1 = plainArrayToClass(CustomClass, [1], { arrayMemberStorage: myStorage1 });
const result2 = plainArrayToClass(CustomClass, [1], { arrayMemberStorage: myStorage2 });
const result3 = plainArrayToClass(CustomClass, [1]);

// [1]
const arr1 = classToPlainArray(result1, { arrayMemberStorage: myStorage1 });
const arr2 = classToPlainArray(result2, { arrayMemberStorage: myStorage2 });
const arr3 = classToPlainArray(result3);

console.log(result1, result2, result3, arr1, arr2, arr3);
```

### Custom Storage Manual Assign

```ts
import 'reflect-metadata';

import { ArrayMember, ArrayMemberStorage, classToPlainArray, plainArrayToClass } from 'class-transformer-for-array';

// create a storage
const myStorage = new ArrayMemberStorage();

class CustomClass {
  @ArrayMember(0, { arrayMemberStorage: myStorage })
  public id = 0;
}

// CustomClass { id: 1 }
const result = plainArrayToClass(CustomClass, [1], { arrayMemberStorage: myStorage });

// [1]
const arr = classToPlainArray(result, { arrayMemberStorage: myStorage });

// throw UnknownClassError
try {
  plainArrayToClass(CustomClass, [123]);
} catch (e) {
  console.error(e.message);
}

console.log(result, arr);
```

### Custom Storage Partial

```ts
import 'reflect-metadata';

import { ArrayMember, ArrayMemberClass, ArrayMemberStorage, classToPlainArray, plainArrayToClass } from 'class-transformer-for-array';

// create storages
const myStorage1 = new ArrayMemberStorage();
const myStorage2 = new ArrayMemberStorage();

@ArrayMemberClass(myStorage1)
class CustomClass {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1, { arrayMemberStorage: myStorage2 })
  public name = '';
}

// CustomClass { id: 1, name: '' }
const result1 = plainArrayToClass(CustomClass, [1, 'name'], { arrayMemberStorage: myStorage1 });

// CustomClass { id: 0, name: 'name' }
const result2 = plainArrayToClass(CustomClass, [1, 'name'], { arrayMemberStorage: myStorage2 });

// [1]
const arr1 = classToPlainArray(result1, { arrayMemberStorage: myStorage1 });

// [undefined, 'name']
const arr2 = classToPlainArray(result2, { arrayMemberStorage: myStorage2 });

console.log(result1, result2, arr1, arr2);
```

### Default Storage

```ts
import 'reflect-metadata';

import { ArrayMember, ArrayMemberStorage, defaultArrayMemberStorage } from 'class-transformer-for-array';

class Ship {
  @ArrayMember(0)
  public id = '';

  @ArrayMember(1)
  public name = '';
}

// same as getting from static property
// true
const same = ArrayMemberStorage.defaultArrayMemberStorage === defaultArrayMemberStorage;

// true
const has = defaultArrayMemberStorage.has(Ship);

// Map<number, PropertyInfo>
// map is sorted by index
const propertyIndexMap = defaultArrayMemberStorage.getPropertyIndexMap(Ship);
if (propertyIndexMap) {
  // PropertyInfo { key: 'id', options: undefined }
  const a = propertyIndexMap.get(0);
  // PropertyInfo { key: 'name', options: undefined }
  const b = propertyIndexMap.get(1);
  console.log(same, has, a, b);
}
```

### Default Storage Class

```ts
import 'reflect-metadata';

import {
  ArrayMember,
  ArrayMemberClass,
  ArrayMemberClassStorage,
  ArrayMemberStorage,
  defaultArrayMemberClassStorage,
} from 'class-transformer-for-array';

const customStorage = new ArrayMemberStorage();

@ArrayMemberClass(customStorage)
class Ship {
  @ArrayMember(0)
  public id = '';

  @ArrayMember(1)
  public name = '';
}

// same as getting from static property
// true
const same = ArrayMemberClassStorage.defaultArrayMemberClassStorage === defaultArrayMemberClassStorage;

// true
const has = defaultArrayMemberClassStorage.has(Ship);

// ArrayMemberStorage[]
const storages = defaultArrayMemberClassStorage.get(Ship);

console.log(same, has, storages);
```

### Method Decorators

#### TransformPlainArrayToClass

```ts
import 'reflect-metadata';

import { ArrayMember, TransformPlainArrayToClass } from 'class-transformer-for-array';

class Blog {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public title = '';
}

class Api {
  @TransformPlainArrayToClass(Blog)
  public getBlog() {
    return [1, 'the title'];
  }

  @TransformPlainArrayToClass(Blog, { isArray: true })
  public getBlogs() {
    return Array.from({ length: 3 }, (_, id) => [id, `title ${id}`]);
  }

  @TransformPlainArrayToClass(Blog)
  public async asyncGetBlog() {
    return [1, 'the title'];
  }
}

(async () => {
  const api = new Api();

  // Blog { id: 1, title: 'the title' }
  const blog = api.getBlog();

  // [Blog { id: 0, title: 'title 0' }, Blog { id: 1, title: 'title 1' }, Blog { id: 2, title: 'title 2' }]
  const blogs = api.getBlogs();

  // Blog { id: 1, title: 'the title' }
  const asyncBlog = await api.asyncGetBlog();

  console.log(blog, blogs, asyncBlog);
})();
```

#### TransformPlainArrayToClass With Options

```ts
import 'reflect-metadata';

import { Expose } from 'class-transformer';

import { ArrayMember, ArrayMemberClass, ArrayMemberStorage, TransformPlainArrayToClass } from 'class-transformer-for-array';

const customStorage = new ArrayMemberStorage();

@ArrayMemberClass(customStorage)
class Author {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  @Expose()
  public name = '';
}

class Api {
  @TransformPlainArrayToClass(Author, { strategy: 'excludeAll', arrayMemberStorage: customStorage })
  public getAuthor() {
    return [999, 'the author name'];
  }
}

const api = new Api();

// Author { id: 0, name: 'the author name' }
const author = api.getAuthor();

console.log(author);
```

#### TransformClassToPlainArray

```ts
import 'reflect-metadata';

import { ArrayMember, TransformClassToPlainArray } from 'class-transformer-for-array';

class Blog {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public title = '';
}

class Api {
  @TransformClassToPlainArray()
  public getBlog() {
    return new Blog();
  }

  @TransformClassToPlainArray()
  public getBlogs() {
    return Array.from({ length: 3 }, (_, id) => Object.assign(new Blog(), { id }));
  }

  @TransformClassToPlainArray()
  public async asyncGetBlog() {
    return new Blog();
  }
}

(async () => {
  const api = new Api();

  // [0,'']
  const blog = api.getBlog();

  // [[0,''],[1,''],[2,'']]
  const blogs = api.getBlogs();

  // [0,'']
  const asyncBlog = await api.asyncGetBlog();

  console.log(blog, blogs, asyncBlog);
})();
```

#### TransformClassToPlainArray With Options

```ts
import 'reflect-metadata';

import { Expose } from 'class-transformer';

import { ArrayMember, TransformClassToPlainArray } from 'class-transformer-for-array';

class Author {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  @Expose()
  public name = '';
}

class Api {
  @TransformClassToPlainArray({ strategy: 'excludeAll' })
  public getAuthor() {
    return new Author();
  }
}

const api = new Api();

// [undefined, '']
const author = api.getAuthor();

console.log(author);
```

### Modify Function Behavior

```ts
import 'reflect-metadata';

import { ArrayMember, ClassTransformerForArray, plainArrayToClass } from 'class-transformer-for-array';

class Blog {
  @ArrayMember(0)
  public id = 0;
}

// modify the function call
const oldMethod = ClassTransformerForArray.instance.plainArrayToClass;
ClassTransformerForArray.instance.plainArrayToClass = function(...args: unknown[]) {
  console.log('Called this method');
  return oldMethod.apply(this, args as never);
}

// Called this method
// Blog { id: 1 }
const blog = plainArrayToClass(Blog, [1]);

console.log(blog);
```
