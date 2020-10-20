import {
  is,
  what,
} from '../is'

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
    if (obj.__v === 'infinity') {
      return Infinity
    }
    if (obj.__v === 'nan') {
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
    return Symbol(obj.__v)
  },
  BigInt: (obj: S.SerializedBigInt) => {
    return BigInt(obj.__v)
  },
  RegExp: (obj: S.SerializedRegExp) => {
    return new RegExp(obj.__v.source, obj.__v.flags)
  },
  Date: (obj: S.SerializedDate) => {
    return new Date(obj.__v)
  },
  Map: (obj: S.SerializedMap) => {
    return new Map(obj.__v.map(([k, v]) => [k, deserializeRecursive(v)]))
  },
  Set: (obj: S.SerializedSet) => {
    return new Set(obj.__v.map(v => deserializeRecursive(v)))
  },
  // Function: (obj: S.SerializedFunction) => {
  //   return eval(`(${obj.__v})`)
  // },
  Array: (obj: S.SerializedArray) => {
    return obj.map(v => deserializeRecursive(v))
  },
  ArrayBuffer: (obj: S.SerializedArrayBuffer) => {
    return new Uint8Array(obj.__v).buffer
  },
  Buffer: (obj: S.SerializedBuffer) => {
    return Buffer.from(obj.__v)
  },
  Int8Array: (obj: S.SerializedInt8Array) => {
    return new Int8Array(obj.__v)
  },
  Uint8Array: (obj: S.SerializedUint8Array) => {
    return new Uint8Array(obj.__v)
  },
  Uint8ClampedArray: (obj: S.SerializedUint8ClampedArray) => {
    return new Uint8ClampedArray(obj.__v)
  },
  Int16Array: (obj: S.SerializedInt16Array) => {
    return new Int16Array(obj.__v)
  },
  Uint16Array: (obj: S.SerializedUint16Array) => {
    return new Uint16Array(obj.__v)
  },
  Int32Array: (obj: S.SerializedInt32Array) => {
    return new Int32Array(obj.__v)
  },
  Uint32Array: (obj: S.SerializedUint32Array) => {
    return new Uint32Array(obj.__v)
  },
  Float32Array: (obj: S.SerializedFloat32Array) => {
    return new Float32Array(obj.__v)
  },
  Float64Array: (obj: S.SerializedFloat64Array) => {
    return new Float64Array(obj.__v)
  },
  BigInt64Array: (obj: S.SerializedBigInt64Array) => {
    return new BigInt64Array(obj.__v.map(v => BigInt(v)))
  },
  BigUint64Array: (obj: S.SerializedBigUint64Array) => {
    return new BigUint64Array(obj.__v.map(v => BigInt(v)))
  },
  Object: (obj: S.SerializedObject): any => {
    const o: Record<any, any> = {}
    for (const k in obj) {
      o[k] = deserializeRecursive(obj[k])
    }
    return o
  }
}

type DeserializeRecursiveFn = {
  <T>(obj: T): Deserialize<T>
}

export const deserializeRecursive: DeserializeRecursiveFn = (obj: any): any => {

  if (!obj) return obj

  const type = obj.__t as keyof typeof deserializer

  if (!type || !deserializer[type]) {
    const t = what(obj)
    if (t === 'Array') {
      return deserializer.Array(obj)
    }
    if (t === 'Object') {
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
}

export const deserialize: DeserializeFn = (obj: any): any => {

  return deserializeRecursive(obj)

}

export const parse = (obj: string): any => deserialize(JSON.parse(obj))
