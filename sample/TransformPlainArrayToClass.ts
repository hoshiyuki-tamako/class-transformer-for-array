import 'reflect-metadata';

import { ArrayMember, TransformPlainArrayToClass } from '../src';

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
