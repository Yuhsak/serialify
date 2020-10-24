import type * as S from '../types'

export type SerializeSingle<O> =
  O extends null ? S.SerializedNull :
  O extends undefined ? S.SerializedUndefined :
  O extends string ? S.SerializedString :
  O extends boolean ? S.SerializedBoolean :
  O extends number ? S.SerializedNumber :
  O extends symbol ? S.SerializedSymbol :
  O extends BigInt ? S.SerializedBigInt :
  O extends RegExp ? S.SerializedRegExp :
  O extends Date ? S.SerializedDate :
  O extends Buffer ? S.SerializedBuffer :
  O extends Int8Array ? S.SerializedInt8Array :
  O extends Uint8Array ? S.SerializedUint8Array :
  O extends Uint8ClampedArray ? S.SerializedUint8ClampedArray :
  O extends Int16Array ? S.SerializedInt16Array :
  O extends Uint16Array ? S.SerializedUint16Array :
  O extends Int32Array ? S.SerializedInt32Array :
  O extends Uint32Array ? S.SerializedUint32Array :
  O extends Float32Array ? S.SerializedFloat32Array :
  O extends Float64Array ? S.SerializedFloat64Array :
  O extends BigInt64Array ? S.SerializedBigInt64Array :
  O extends BigUint64Array ? S.SerializedBigUint64Array :
  O extends DataView ? S.SerializedDataView :
  O extends ArrayBuffer ? S.SerializedArrayBuffer :
  O extends Set<infer V> ? S.SerializedSet<V> :
  O extends Map<infer K, infer V> ? S.SerializedMap<K, V> :
  O extends URL ? S.SerializedURL :
  O extends URLSearchParams ? S.SerializedURLSearchParams :
  never

export type Serialize<T> = T extends any
  ? SerializeSingle<T> extends never
    ? {[K in keyof T]: Serialize<T[K]>}
    : T extends Set<infer V>
      ? S.Serialized<'Set', Serialize<V>[]>
      : T extends Map<infer K, infer V>
        ? S.Serialized<'Map', [K, Serialize<V>][]>
        : SerializeSingle<T>
  : never
