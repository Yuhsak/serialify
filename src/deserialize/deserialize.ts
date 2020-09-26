import {
  is,
} from '../is'

import {
  fromEntries,
} from '../util'

import {
  omit,
  OmitBySerializedEntity,
} from '../omit'

import type * as S from '../types'

import {
  Deserialize,
} from './types'

export const deserializer = {
  String: (obj: S.SerializedString) => {
    return obj
  },
  Boolean: (obj: S.SerializedBoolean) => {
    return obj
  },
  Number: (obj: S.SerializedNumber) => {
    if (is.Number(obj)) return obj
    if (obj.__value === 'infinity') {
      return Infinity
    }
    if (obj.__value === 'nan') {
      return NaN
    }
    return obj
  },
  Undefined: (obj: S.SerializedUndefined) => {
    return void (0)
  },
  Null: (obj: S.SerializedNull) => {
    return null
  },
  Symbol: (obj: S.SerializedSymbol) => {
    return Symbol(obj.__value)
  },
  BigInt: (obj: S.SerializedBigInt) => {
    return BigInt(obj.__value)
  },
  RegExp: (obj: S.SerializedRegExp) => {
    return new RegExp(obj.__value.source, obj.__value.flags)
  },
  Date: (obj: S.SerializedDate) => {
    return new Date(obj.__value)
  },
  Map: (obj: S.SerializedMap) => {
    return new Map(obj.__value.map(([k, v]) => [k, deserializeRecursive(v)]))
  },
  Set: (obj: S.SerializedSet) => {
    return new Set(obj.__value.map(v => deserializeRecursive(v)))
  },
  Function: (obj: S.SerializedFunction) => {
    return eval(`(${obj.__value})`)
  },
  Array: (obj: S.SerializedArray) => {
    return obj.map(v => deserializeRecursive(v))
  },
  ArrayBuffer: (obj: S.SerializedArrayBuffer) => {
    return new Uint8Array(obj.__value).buffer
  },
  Buffer: (obj: S.SerializedBuffer) => {
    return Buffer.from(obj.__value)
  },
  Int8Array: (obj: S.SerializedInt8Array) => {
    return new Int8Array(obj.__value)
  },
  Uint8Array: (obj: S.SerializedUint8Array) => {
    return new Uint8Array(obj.__value)
  },
  Uint8ClampedArray: (obj: S.SerializedUint8ClampedArray) => {
    return new Uint8ClampedArray(obj.__value)
  },
  Int16Array: (obj: S.SerializedInt16Array) => {
    return new Int16Array(obj.__value)
  },
  Uint16Array: (obj: S.SerializedUint16Array) => {
    return new Uint16Array(obj.__value)
  },
  Int32Array: (obj: S.SerializedInt32Array) => {
    return new Int32Array(obj.__value)
  },
  Uint32Array: (obj: S.SerializedUint32Array) => {
    return new Uint32Array(obj.__value)
  },
  Float32Array: (obj: S.SerializedFloat32Array) => {
    return new Float32Array(obj.__value)
  },
  Float64Array: (obj: S.SerializedFloat64Array) => {
    return new Float64Array(obj.__value)
  },
  BigInt64Array: (obj: S.SerializedBigInt64Array) => {
    return new BigInt64Array(obj.__value.map(v => BigInt(v)))
  },
  BigUint64Array: (obj: S.SerializedBigUint64Array) => {
    return new BigUint64Array(obj.__value.map(v => BigInt(v)))
  },
  Object: (obj: S.SerializedObject): any => {
    return fromEntries(Object.entries(obj).map(([k, v]) => [k, deserializeRecursive(v)]))
  }
}

type DeserializeRecursiveFn = {
  <T>(obj: T): Deserialize<T>
}

export const deserializeRecursive: DeserializeRecursiveFn = (obj: any): any => {

  if (!obj) {
    return obj
  }

  const type = obj.__type as keyof typeof deserializer

  if (!type || !deserializer[type]) {
    if (is.Array(obj)) {
      return deserializer.Array(obj)
    }
    if (is.Object(obj)) {
      return deserializer.Object(obj)
    }
    return obj
  }

  try {
    // @ts-ignore
    return deserializer[type](obj)
  } catch (e) {
    return obj
  }

}

export type DeserializeOption = {
  dangerouslyDeserializeFunction?: boolean
}

type DeserializeFn = {
  <T>(obj: T): Deserialize<T>
  <T>(obj: T, opt: {dangerouslyDeserializeFunction: true}): Deserialize<T>
  <T>(obj: T, opt: {dangerouslyDeserializeFunction: false}): Deserialize<OmitBySerializedEntity<T, S.SerializedFunction>> extends infer U ? U : never
  <T>(obj: T, opt: DeserializeOption): Deserialize<T> | Deserialize<OmitBySerializedEntity<T, S.SerializedFunction>> extends infer U ? U : never
}

export const deserialize: DeserializeFn = (obj: any, {dangerouslyDeserializeFunction = false}: DeserializeOption = {}): any => {

  if (obj?.__type === 'Function' && !dangerouslyDeserializeFunction) {
    return void (0)
  }

  const o = !dangerouslyDeserializeFunction ? omit(obj, 'Function') : obj
  return deserializeRecursive(o)

}

export const parse = (obj: string, {dangerouslyDeserializeFunction = false}: DeserializeOption = {}) => deserialize(JSON.parse(obj), {dangerouslyDeserializeFunction})
