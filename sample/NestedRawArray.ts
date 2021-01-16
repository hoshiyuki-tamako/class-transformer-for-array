import 'reflect-metadata';

import { ArrayMember, classToPlainArray, plainArrayToClass } from '../src';

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
