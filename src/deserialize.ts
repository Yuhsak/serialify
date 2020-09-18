import {
  is,
} from './is'

import {
  fromEntries,
} from './util'

import type * as T from './types'

export const deserializer = {
  Undefined: (obj: T.SerializedUndefined) => {
    return void(0)
  },
  Null: (obj: T.SerializedNull) => {
    return null
  },
  Number: (obj: T.SerializedNumber) => {
    if (typeof obj === 'number') {
      return obj
    }
    if (obj.__value === 'infinity') {
      return Infinity
    }
    if (obj.__value === 'nan') {
      return NaN
    }
    return obj
  },
  Symbol: (obj: T.SerializedSymbol) => {
    return Symbol(obj.__value)
  },
  BigInt: (obj: T.SerializedBigInt) => {
    return BigInt(obj.__value)
  },
  RegExp: (obj: T.SerializedRegExp) => {
    return new RegExp(obj.__value.source, obj.__value.flags)
  },
  Date: (obj: T.SerializedDate) => {
    return new Date(obj.__value)
  },
  Map: (obj: T.SerializedMap) => {
    return new Map(obj.__value.map(([k, v]) => [k, deserialize(v)]))
  },
  Set: (obj: T.SerializedSet) => {
    return new Set(obj.__value.map(deserialize))
  },
  Function: (obj: T.SerializedFunction) => {
    return eval(`(${obj.__value})`)
  },
  Array: (obj: T.SerializedArray) => {
    return obj.map(deserialize)
  },
  ArrayBuffer: (obj: T.SerializedArrayBuffer) => {
    return new Uint8Array(obj.__value).buffer
  },
  Buffer: (obj: T.SerializedBuffer) => {
    return Buffer.from(obj.__value)
  },
  Int8Array: (obj: T.SerializedInt8Array) => {
    return new Int8Array(obj.__value)
  },
  Uint8Array: (obj: T.SerializedUint8Array) => {
    return new Uint8Array(obj.__value)
  },
  Uint8ClampedArray: (obj: T.SerializedUint8ClampedArray) => {
    return new Uint8ClampedArray(obj.__value)
  },
  Int16Array: (obj: T.SerializedInt16Array) => {
    return new Int16Array(obj.__value)
  },
  Uint16Array: (obj: T.SerializedUint16Array) => {
    return new Uint16Array(obj.__value)
  },
  Int32Array: (obj: T.SerializedInt32Array) => {
    return new Int32Array(obj.__value)
  },
  Uint32Array: (obj: T.SerializedUint32Array) => {
    return new Uint32Array(obj.__value)
  },
  Float32Array: (obj: T.SerializedFloat32Array) => {
    return new Float32Array(obj.__value)
  },
  Float64Array: (obj: T.SerializedFloat64Array) => {
    return new Float64Array(obj.__value)
  },
  BigInt64Array: (obj: T.SerializedBigInt64Array) => {
    return new BigInt64Array(obj.__value.map(v => BigInt(v)))
  },
  BigUint64Array: (obj: T.SerializedBigUint64Array) => {
    return new BigUint64Array(obj.__value.map(v => BigInt(v)))
  },
  Object: (obj: T.SerializedObject): any => {
    return fromEntries(Object.entries(obj).map(([k, v]) => [k, deserialize(v)]))
  }
}

export const deserialize = (obj: any): any => {

  try {
    // @ts-ignore
    return deserializer[obj.__type](obj)
  } catch (e) {
    if (is.Array(obj)) {
      return deserializer.Array(obj)
    }
    if (is.Object(obj)) {
      return deserializer.Object(obj)
    }
    return obj
  }

}

export const parse = (obj: string) => deserialize(JSON.parse(obj))
