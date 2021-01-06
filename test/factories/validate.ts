import { expect } from 'chai';

import { Color, Product, Size } from './../classes/Product';
import { SkipIndex, SkipIndexChild } from './../classes/SkipIndex';

export type ValidateOptions = {
  constructor: boolean,
};

export const defaultValidateOptions = {
  constructor: true,
} as ValidateOptions;

// Product
export function productValidate(expected: Product, result?: Product | null, options = defaultValidateOptions): void {
  expect(result).not.null;
  if (options.constructor) {
    expect(result).property('constructor', Product);
  }
  expect(result).property('id', expected.id);
  expect(result).property('price', expected.price);
  // class transform
  expect(result).property('displayPrice', expected.displayPrice);
  // nested
  if (expected.color) {
    if (options.constructor) {
      expect(result).property('color').property('constructor', Color);
    }
    expect(result).property('color').property('name', expected.color.name);
  }
  // nested array
  expect(result).property('sizes').property('constructor', Array);
  expect(result).property('sizes').length(expected.sizes.length);
  for (const [i, { size }] of expected.sizes.entries()) {
    if (options.constructor) {
      expect(result).property('sizes').property(i.toString()).property('constructor', Size);
    }
    expect(result).property('sizes').property(i.toString()).property('size', size);
  }
  // array values
  expect(result).property('values').property('constructor', Array);
  expect(result).property('values').length(expected.values.length);
  for (const [i, v] of expected.values.entries() ?? []) {
    expect(result).property('values').property(i.toString(), v);
  }
}

export function productArrayValidate(expected: Product, result?: unknown[] | null): void {
  expect(result).not.null;
  expect(result).property('constructor', Array);
  expect(result).property('0', expected.id);
  expect(result).property('1', expected.price);
  // class transform
  expect(result).property('2', expected.displayPrice);
  // nested
  if (expected.color) {
    expect(result).property('3').property('0', expected.color.name);
  } else {
    expect(result?.[3] == null).true;
  }
  // nested array
  expect(result).property('4').property('constructor', Array);
  expect(result).property('4').length(expected.sizes.length);
  for (const [i, { size }] of expected.sizes.entries()) {
    expect(result).property('4').property(i.toString()).length(1);
    expect(result).property('4').property(i.toString()).property('0', size);
  }
  // array values
  expect(result).property('5').property('constructor', Array);
  expect(result).property('5').length(expected.values.length);
  for (const [i, v] of expected.values.entries() ?? []) {
    expect(result).property('5').property(i.toString(), v);
  }
}

export function skipIndexValidate(expected: SkipIndex, result?: SkipIndex | null, options = defaultValidateOptions): void  {
  expect(result).not.null;
  if (options.constructor) {
    expect(result).property('constructor', SkipIndex);
  }
  expect(result).property('id', expected.id);
  expect(result).property('name', expected.name);
  if (expected.child) {
    if (options.constructor) {
      expect(result).property('child').property('constructor', SkipIndexChild);
    }
    expect(result).property('child').property('id', expected.child.id);
    expect(result).property('child').property('name', expected.child.name);
  } else {
    expect(result?.child == null).true;
  }

  expect(result).property('childArray').property('constructor', Array);
  expect(result).property('childArray').length(expected.childArray.length);
  for (const [i, childArray] of expected.childArray.entries()) {
    if (options.constructor) {
      expect(result).property('childArray').property(i.toString()).property('constructor', SkipIndexChild);
    }
    expect(result).property('childArray').property(i.toString()).property('id', childArray.id);
    expect(result).property('childArray').property(i.toString()).property('name', childArray.name);
  }
}

export function skipIndexArrayValidate(expected: SkipIndex, result?: unknown[] | null): void {
  expect(result).not.null;
  expect(result).property('constructor', Array);
  expect(result).property('0', expected.id);
  expect(result).property('2', expected.name);

  if (expected.child) {
    expect(result).property('4').property('constructor', Array);
    expect(result).property('4').property('0', expected.child.id);
    expect(result).property('4').property('2', expected.child.name);
  } else {
    expect(result?.[4] == null).true;
  }

  expect(result).property('6').property('constructor', Array);
  expect(result).property('6').length(expected.childArray.length);
  for (const [i, childArray] of expected.childArray.entries()) {
    expect(result).property('6').property(i.toString()).property('0', childArray.id);
    expect(result).property('6').property(i.toString()).property('2', childArray.name);
  }
}
