import 'reflect-metadata';

import { ArrayMember, ClassMapValueReturn, TransformClassToPlainArray } from '../src';

class Blog {
  @ArrayMember(0)
  public id = 0;

  @ArrayMember(1)
  public title = '';
}

class Api {
  @TransformClassToPlainArray()
  public getBlog() {
    return new Blog() as unknown as ClassMapValueReturn<Blog>;
  }

  @TransformClassToPlainArray()
  public getBlogs() {
    return Array.from({ length: 3 }, (_, id) => Object.assign(new Blog(), { id })) as unknown as ClassMapValueReturn<Blog>[];
  }

  @TransformClassToPlainArray()
  public async asyncGetBlog() {
    return new Blog() as unknown as ClassMapValueReturn<Blog>;
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
