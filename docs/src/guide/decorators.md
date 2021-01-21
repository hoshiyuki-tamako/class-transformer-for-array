# Decorators

## ArrayMember

```ts
export function ArrayMember(index: number, options?: ArrayMemberOptions): PropertyDecorator;
```

## ArrayMemberClass

```ts
export function ArrayMemberClass(arrayMemberStorage?: ArrayMemberStorage): ClassDecorator;
```

## TransformClassToPlainArray

```ts
export function TransformClassToPlainArray(options?: ClassToPlainArrayOptions): MethodDecorator;
```

## TransformPlainArrayToClass

```ts
export function TransformPlainArrayToClass<T>(classType: ClassConstructor<T>, options?: ClassTransformForArrayOptions): MethodDecorator;
```
