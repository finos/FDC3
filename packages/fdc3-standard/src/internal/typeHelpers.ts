type AtLeastOne<T> = [T, ...T[]];

/**
 * Ensures at compile time that the given string tuple is exhaustive on a given union type, i.e. contains ALL possible values of the given UNION_TYPE.
 */
export const exhaustiveStringTuple =
  <UNION_TYPE extends string>() =>
  <L extends AtLeastOne<UNION_TYPE>>(
    ...tuple: L extends any
      ? Exclude<UNION_TYPE, L[number]> extends never
        ? L
        : Exclude<UNION_TYPE, L[number]>[]
      : never
  ) =>
    tuple;
