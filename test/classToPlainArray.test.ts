import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import { TypeError } from 'common-errors';

import { ArrayMember, classToPlainArray, UnknownClassError } from '../src';
import { arrayMemberStorage, customStorageArrayValidate, CustomStorageClass } from './classes/CustomStorageClass';
import { PassClassTransformOption } from './classes/PassClassTransformOption';
import { Product, productArrayValidate } from './classes/Product';
import { SkipIndex, skipIndexArrayValidate } from './classes/SkipIndex';
import { factory } from './factories';

class KeyNotInObject {
  @ArrayMember(0)
  public deleteThis?: boolean = true;
}

class UnknownClass {}

class ChildType {}

class ParentType {
  @ArrayMember(0)
  public child: ChildType | null = null;
}

@suite()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ClassToPlainArrayTest {
  @test()
  public normal() {
    const expected = factory.make(Product).one();
    const result = classToPlainArray(Object.assign(new Product(), expected, { displayPrice: +expected.displayPrice }));
    productArrayValidate(expected, result);
  }

  @test()
  public array() {
    const testData = factory.make(Product).many(2);
    const results = classToPlainArray(testData) as unknown[][];
    expect(results).property('constructor', Array);
    expect(results).length(testData.length);
    for (const [i, expected] of testData.entries()) {
      expect(results).property(i.toString());
      productArrayValidate(expected, results[i]);
    }
  }

  @test()
  public emptyArray() {
    const result = classToPlainArray([]) as [];
    expect(result.constructor).equals(Array);
    expect(result).length(0);
  }

  @test()
  public unknownClass() {
    expect(() => classToPlainArray(new UnknownClass())).throw(UnknownClassError);
  }

  @test()
  public keyNotInObject() {
    const obj = new KeyNotInObject();
    delete obj.deleteThis;
    const result = classToPlainArray(obj) as [];
    expect(result.constructor).equals(Array);
    expect(result).length(1);
    expect(result).property('0').is.undefined;
  }

  @test()
  public missingChildType() {
    const result = classToPlainArray(new ParentType()) as [];
    expect(result.constructor).equals(Array);
    expect(result).length(1);
    expect(result).property('0').is.null;
  }

  @test()
  public undefinedArray() {
    const expected = factory.make(Product).one();
    const result = classToPlainArray(Object.assign(expected, { sizes: null })) as unknown[];
    expect(result).property('4').is.null;
  }

  @test()
  public arrayIsNotArray() {
    const expected = factory.make(Product).one();
    expect(() => classToPlainArray(Object.assign(expected, { sizes: 1 }))).throw(TypeError)
  }

  @test()
  public skipIndex() {
    const expected = factory.make(SkipIndex).one();
    skipIndexArrayValidate(expected, classToPlainArray(expected));
  }

  @test()
  public classTransformOption() {
    const expected = factory.make(PassClassTransformOption).one();
    const result = classToPlainArray(expected, { strategy: 'excludeAll' });
    expect(result).property('constructor', Array);
    expect(result).length(2);
    expect(result).property('0').is.undefined;
    expect(result).property('1', expected.title);
  }

  @test()
  public customStorage() {
    const expected = factory.make(CustomStorageClass).one();
    customStorageArrayValidate(expected, classToPlainArray(expected, { arrayMemberStorage }));
  }

  @test()
  public customStorageFail() {
    const expected = factory.make(CustomStorageClass).one();
    expect(() => classToPlainArray(expected)).throw(UnknownClassError);
  }
}
