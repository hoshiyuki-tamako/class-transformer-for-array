import { ArrayMember, classToPlainArray, plainArrayToClass } from '../src';

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
