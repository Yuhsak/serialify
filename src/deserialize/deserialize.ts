import {is, what} from 'what-is-that'

import type * as S from '../types'
import type {Deserialize} from './types'
import {getObjectName} from '../util'

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
  URL: (obj: S.SerializedURL) => {
    return new URL(obj.__v)
  },
  URLSearchParams: (obj: S.SerializedURLSearchParams) => {
    return new URLSearchParams(obj.__v)
  },
  Map: (obj: S.SerializedMap) => {
    return new Map(obj.__v.map(([k, v]) => [k, deserialize(v)]))
  },
  Set: (obj: S.SerializedSet) => {
    return new Set(obj.__v.map(v => deserialize(v)))
  },
  // Function: (obj: S.SerializedFunction) => {
  //   return eval(`(${obj.__v})`)
  // },
  Array: (obj: S.SerializedArray) => {
    return obj.map(v => deserialize(v))
  },
  DataView: (obj: S.SerializedDataView) => {
    return new DataView(new Uint8Array(obj.__v.buffer).buffer, obj.__v.byteOffset, obj.__v.byteLength)
  },
  ArrayBuffer: (obj: S.SerializedArrayBuffer) => {
    return new Uint8Array(obj.__v).buffer
  },
  SharedArrayBuffer: (obj: S.SerializedSharedArrayBuffer) => {
    const sab = new SharedArrayBuffer(obj.__v.length)
    const ui8 = new Uint8Array(sab)
    let i = 0
    while (i<ui8.length) {ui8[i] = obj.__v[i++]}
    return sab
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
      o[k] = deserialize(obj[k])
    }
    return o
  }
}

const getType = (obj: any) => {
  const type = what(obj)
  if (type === 'Null') return type
  if (type === 'Number') return type
  if (type === 'Boolean') return type
  if (type === 'String') return type
  if (type === 'Array') return type
  if (type === 'Object') {
    if (!obj.__t || !obj.__v) return type
    if (obj.__t === 'Array') return type
    // @ts-ignore
    if (!deserializer[obj.__t]) return type
    return obj.__t
  }
  return type
}

type DeserializeFn = {
  <T>(obj: T): Deserialize<T>
}

export const deserialize: DeserializeFn = (obj: any): any => {

  // @ts-ignore
  const handler = deserializer[getType(obj)]

  if (!handler) {
    throw new Error(`${getObjectName(obj)} can't be deserialized.`)
  }

  return handler(obj)

}

export const parse = (obj: string): any => deserialize(JSON.parse(obj))
