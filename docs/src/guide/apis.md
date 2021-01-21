# APIs

## plainMapValue

```ts
export function plainMapValue<T, TData>(classType: ClassConstructor<T>, array: TData[], options?: ArrayStorageOptions): Record<PropertyKey, unknown>;
```

## classMapValue

```ts
export function classMapValue<T, TData>(classType: ClassConstructor<T>, array: TData[], options?: ArrayStorageOptions): Record<PropertyKey, unknown>;
```

## plainArrayToClass

```ts
export function plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[][], options?: ClassTransformForArrayOptions & { isArray: true }): T[];
export function plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[], options?: ClassTransformForArrayOptions & { isArray?: false }): T;
export function plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[] | TData[][], options?: ClassTransformForArrayOptions): T[] | T;
```

## classToPlainArray

```ts
export function classToPlainArray<T extends object>(object: T, options?: ClassToPlainArrayOptions): unknown[];
export function classToPlainArray<T extends object>(object: T[], options?: ClassToPlainArrayOptions): unknown[][];
export function classToPlainArray<T extends object>(object: T | T[], options?: ClassToPlainArrayOptions): unknown[] | unknown[][];
```

## arrayTransformAndValidate

```ts
export async function arrayTransformAndValidate<T extends object, TData>(classType: ClassConstructor<T>, array: TData[], options?: TransformValidationForArrayOptions & { isArray?: false }): Promise<T>;
export async function arrayTransformAndValidate<T extends object, TData>(classType: ClassConstructor<T>, array: TData[][], options?: TransformValidationForArrayOptions & { isArray: true }): Promise<T[]>;
export async function arrayTransformAndValidate<T extends object, TData>(classType: ClassConstructor<T>, array: TData[] | TData[][], options?: TransformValidationForArrayOptions): Promise<T | T[]>;
```

## arrayTransformAndValidateSync

```ts
export function arrayTransformAndValidateSync<T extends object, TData>(classType: ClassConstructor<T>, array: TData[], options?: TransformValidationForArrayOptions & { isArray?: false }): T;
export function arrayTransformAndValidateSync<T extends object, TData>(classType: ClassConstructor<T>, array: TData[][], options?: TransformValidationForArrayOptions & { isArray: true }): T[];
export function arrayTransformAndValidateSync<T extends object, TData>(classType: ClassConstructor<T>, array: TData[] | TData[][], options?: TransformValidationForArrayOptions): T | T[];
```
