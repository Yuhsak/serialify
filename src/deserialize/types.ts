import type * as S from '../types'

export type DeserializeSingle<T> =
  T extends null ? null :
  T extends undefined ? undefined :
  T extends string ? string :
  T extends boolean ? boolean :
  T extends number ? number :
  T extends symbol ? symbol :
  T extends BigInt ? BigInt :
  T extends RegExp ? RegExp :
  T extends Date ? Date :
  T extends Buffer ? Buffer :
  T extends Int8Array ? Int8Array :
  T extends Uint8Array ? Uint8Array :
  T extends Uint8ClampedArray ? Uint8ClampedArray :
  T extends Int16Array ? Int16Array :
  T extends Uint16Array ? Uint16Array :
  T extends Int32Array ? Int32Array :
  T extends Uint32Array ? Uint32Array :
  T extends Float32Array ? Float32Array :
  T extends Float64Array ? Float64Array :
  T extends BigInt64Array ? BigInt64Array :
  T extends BigUint64Array ? BigUint64Array :
  T extends DataView ? DataView :
  T extends ArrayBuffer ? ArrayBuffer :
  T extends Set<infer V> ? Set<V> :
  T extends Map<infer K, infer V> ? Map<K, V> :
  T extends URL ? URL :
  T extends URLSearchParams ? URLSearchParams :
  T extends S.SerializedDataView ? DataView :
  T extends S.SerializedBigInt ? BigInt :
  T extends S.SerializedBigInt64Array ? BigInt64Array :
  T extends S.SerializedBigUint64Array ? BigUint64Array :
  T extends S.SerializedBoolean ? boolean :
  T extends S.SerializedBuffer ? Buffer :
  T extends S.SerializedArrayBuffer ? ArrayBuffer :
  T extends S.SerializedDate ? Date :
  T extends S.SerializedFloat32Array ? Float32Array :
  T extends S.SerializedFloat64Array ? Float64Array :
  T extends S.SerializedInt16Array ? Int16Array :
  T extends S.SerializedInt32Array ? Int32Array :
  T extends S.SerializedInt8Array ? Int8Array :
  T extends S.SerializedMap<infer K, infer V> ? Map<K, V> :
  T extends S.SerializedNumber ? number :
  T extends S.SerializedRegExp ? RegExp :
  T extends S.SerializedSet<infer V> ? Set<V> :
  T extends S.SerializedSymbol ? symbol :
  T extends S.SerializedUint16Array ? Uint16Array :
  T extends S.SerializedUint32Array ? Uint32Array :
  T extends S.SerializedUint8Array ? Uint8Array :
  T extends S.SerializedUint8ClampedArray ? Uint8ClampedArray :
  T extends S.SerializedUndefined ? undefined :
  T extends S.SerializedURL ? URL :
  T extends S.SerializedURLSearchParams ? URLSearchParams :
  never

export type Deserialize<T> = T extends any
  ? DeserializeSingle<T> extends never
    ? {[K in keyof T]: Deserialize<T[K]>}
    : T extends S.SerializedSet<infer V>
      ? Set<Deserialize<V>>
      : T extends S.SerializedMap<infer K, infer V>
        ? Map<K, Deserialize<V>>
        : DeserializeSingle<T>
  : never
