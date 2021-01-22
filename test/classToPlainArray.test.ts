import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import { ArrayMember, classToPlainArray, UnknownClassError } from '../src';
import { arrayMemberStorage, customStorageArrayValidate, CustomStorageClass } from './classes/CustomStorageClass';
import { PassClassTransformOption, passClassTransformOptionArrayValidate } from './classes/PassClassTransformOption';
import { Product, productArrayValidate } from './classes/Product';
import {
  Ship,
  shipArrayValidate,
  shipStorage,
  shipStoragePartial,
  ShipWithDefault,
  shipWithDefaultArrayValidate,
  ShipWithPartialProperty,
  shipWithPartialPropertyArrayValidate,
} from './classes/Ship';
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
export class ClassToPlainArrayTest {
  @test()
  public normal(): void {
    const expected = factory.make(Product).one();
    const result = classToPlainArray(expected);
    productArrayValidate(expected, result);
  }

  @test()
  public array(): void {
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
  public emptyArray(): void {
    const result = classToPlainArray([]) as [];
    expect(result.constructor).equals(Array);
    expect(result).length(0);
  }

  @test()
  public unknownClass(): void {
    expect(() => classToPlainArray(new UnknownClass())).throw(UnknownClassError);
  }

  @test()
  public keyNotInObject(): void {
    const obj = new KeyNotInObject();
    delete obj.deleteThis;
    const result = classToPlainArray(obj) as [];
    expect(result.constructor).equals(Array);
    expect(result).length(1);
    expect(result).property('0').is.undefined;
  }

  @test()
  public missingChildType(): void {
    const result = classToPlainArray(new ParentType()) as [];
    expect(result.constructor).equals(Array);
    expect(result).length(1);
    expect(result).property('0').is.null;
  }

  @test()
  public undefinedArray(): void {
    const expected = factory.make(Product).one();
    const result = classToPlainArray(Object.assign(expected, { sizes: null })) as unknown[];
    expect(result).property('4').is.null;
  }

  @test()
  public arrayIsNotArray(): void {
    const expected = factory.make(Product).one();
    expect(() => classToPlainArray(Object.assign(expected, { sizes: 1 }))).throw(TypeError)
  }

  @test()
  public skipIndex(): void {
    const expected = factory.make(SkipIndex).one();
    skipIndexArrayValidate(expected, classToPlainArray(expected));
  }

  @test()
  public classTransformOption(): void {
    const expected = factory.make(PassClassTransformOption).one();
    const result = classToPlainArray(expected, { strategy: 'excludeAll' });
    passClassTransformOptionArrayValidate(expected, result);
  }

  @test()
  public customStorage(): void {
    const expected = factory.make(CustomStorageClass).one();
    customStorageArrayValidate(expected, classToPlainArray(expected, { arrayMemberStorage }));
  }

  @test()
  public customStorageFail(): void {
    const expected = factory.make(CustomStorageClass).one();
    expect(() => classToPlainArray(expected)).throw(UnknownClassError);
  }

  @test()
  public customStorageDecorator(): void {
    const expected = factory.make(Ship).one();
    shipArrayValidate(expected, classToPlainArray(expected, { arrayMemberStorage: shipStorage }));
  }

  @test()
  public customStorageDecoratorFail(): void {
    const expected = factory.make(Ship).one();
    expect(() => classToPlainArray(expected)).throw(UnknownClassError);
  }

  @test()
  public customStorageDecoratorWithDefault(): void {
    const expected = factory.make(ShipWithDefault).one();
    shipWithDefaultArrayValidate(expected, classToPlainArray(expected, { arrayMemberStorage: shipStorage }));
    shipWithDefaultArrayValidate(expected, classToPlainArray(expected));
  }

  @test()
  public customStorageDecoratorPartial(): void {
    const expected = factory.make(ShipWithPartialProperty).one();
    shipWithPartialPropertyArrayValidate(Object.assign(new ShipWithPartialProperty(), { ... expected, name: null }), classToPlainArray(expected, { arrayMemberStorage: shipStorage }));
    shipWithPartialPropertyArrayValidate(Object.assign(new ShipWithPartialProperty(), { ... expected, id: null }), classToPlainArray(expected, { arrayMemberStorage: shipStoragePartial }));
  }

  @test()
  public customStorageDecoratorPartialFail(): void {
    const expected = factory.make(ShipWithPartialProperty).one();
    expect(() => classToPlainArray(expected)).throw(UnknownClassError);
  }
}
