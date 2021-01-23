# class-transformer-for-array

![test](https://github.com/hoshiyuki-tamako/class-transformer-for-array/workflows/test/badge.svg)
![npm publish](https://github.com/hoshiyuki-tamako/class-transformer-for-array/workflows/npm%20publish/badge.svg)
![nycrc config on GitHub](https://img.shields.io/nycrc/hoshiyuki-tamako/class-transformer-for-array?config=.nycrc&preferredThreshold=branches)

Transform array of data by index to class object

## Documentation

[https://hoshiyuki-tamako.github.io/class-transformer-for-array/guide/](https://hoshiyuki-tamako.github.io/class-transformer-for-array/guide/)

## Install

```bash
npm i class-transformer-for-array class-transformer-validator class-transformer class-validator reflect-metadata
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
