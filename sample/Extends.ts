import { ArrayMember, classToPlainArray, plainArrayToClass } from '../src';

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
