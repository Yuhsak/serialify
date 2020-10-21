import type * as S from '../types'

export type DeserializeSingle<T> =
  T extends S.SerializedArrayBuffer ? ArrayBuffer :
  T extends S.SerializedBigInt ? BigInt :
  T extends S.SerializedBigInt64Array ? BigInt64Array :
  T extends S.SerializedBigUint64Array ? BigUint64Array :
  T extends S.SerializedBoolean ? boolean :
  T extends S.SerializedBuffer ? Buffer :
  T extends S.SerializedDate ? Date :
  T extends S.SerializedFloat32Array ? Float32Array :
  T extends S.SerializedFloat64Array ? Float64Array :
  // T extends S.SerializedFunction ? Function :
  T extends S.SerializedInt16Array ? Int16Array :
  T extends S.SerializedInt32Array ? Int32Array :
  T extends S.SerializedInt8Array ? Int8Array :
  T extends S.SerializedMap<infer K, infer V> ? Map<K, V> :
  T extends S.SerializedNull ? null :
  T extends S.SerializedNumber ? number :
  T extends S.SerializedRegExp ? RegExp :
  T extends S.SerializedSet<infer V> ? Set<V> :
  T extends S.SerializedString ? string :
  T extends S.SerializedSymbol ? symbol :
  T extends S.SerializedUint16Array ? Uint16Array :
  T extends S.SerializedUint32Array ? Uint32Array :
  T extends S.SerializedUint8Array ? Uint8Array :
  T extends S.SerializedUint8ClampedArray ? Uint8ClampedArray :
  T extends S.SerializedUndefined ? undefined :
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
