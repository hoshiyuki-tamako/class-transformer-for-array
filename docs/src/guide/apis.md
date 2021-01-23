# APIs

## plainMapValue

```ts
export function plainMapValue<T, TData>(classType: ClassConstructor<T>, array: TData[], options?: ArrayStorageOptions): Partial<T>;
```

## classMapValue

```ts
export function classMapValue<T>(classType: ClassConstructor<T>, object: Partial<T>, options?: ArrayStorageOptions): ClassMapValueReturn<Partial<T>>;
```

## plainArrayToClass

```ts
export function plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[][], options?: ClassTransformForArrayOptions & { isArray: true }): T[];
export function plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[], options?: ClassTransformForArrayOptions & { isArray?: false }): T;
export function plainArrayToClass<T, TData>(classType: ClassConstructor<T>, array: TData[] | TData[][], options?: ClassTransformForArrayOptions): T[] | T;
```

## classToPlainArray

```ts
export function classToPlainArray<T extends object>(object: Exclude<T, unknown[]>, options?: ClassToPlainArrayOptions): ClassMapValueReturn<T>;
export function classToPlainArray<T extends object>(object: T[], options?: ClassToPlainArrayOptions): ClassMapValueReturn<T>[];
export function classToPlainArray<T extends object>(object: T | T[], options?: ClassToPlainArrayOptions): ClassMapValueReturn<T> | ClassMapValueReturn<T>[];
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
