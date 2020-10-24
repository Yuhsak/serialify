import {isNumber as n, what} from 'what-is-that'

import type * as S from '../types'
import type {Deserialize} from './types'
import {getObjectName as g} from '../util'

export const deserializer = {
  String: (o: S.SerializedString) => {
    return o
  },
  Boolean: (o: S.SerializedBoolean) => {
    return o
  },
  Number: (o: S.SerializedNumber) => {
    if (n(o)) return o
    if (o.__v === 'infinity') {
      return Infinity
    }
    if (o.__v === 'nan') {
      return NaN
    }
    return o
  },
  Undefined: (o: S.SerializedUndefined) => {
    return void (0)
  },
  Null: (o: S.SerializedNull) => {
    return null
  },
  Symbol: (o: S.SerializedSymbol) => {
    return Symbol(o.__v)
  },
  BigInt: (o: S.SerializedBigInt) => {
    return BigInt(o.__v)
  },
  RegExp: (o: S.SerializedRegExp) => {
    return new RegExp(o.__v.source, o.__v.flags)
  },
  Date: (o: S.SerializedDate) => {
    return new Date(o.__v)
  },
  URL: (o: S.SerializedURL) => {
    return new URL(o.__v)
  },
  URLSearchParams: (o: S.SerializedURLSearchParams) => {
    return new URLSearchParams(o.__v)
  },
  Map: (o: S.SerializedMap) => {
    return new Map(o.__v.map(([k, v]) => [k, deserialize(v)]))
  },
  Set: (o: S.SerializedSet) => {
    return new Set(o.__v.map(v => deserialize(v)))
  },
  Array: (o: S.SerializedArray) => {
    return o.map(v => deserialize(v))
  },
  DataView: (o: S.SerializedDataView) => {
    return new DataView(new Uint8Array(o.__v.buffer).buffer, o.__v.byteOffset, o.__v.byteLength)
  },
  ArrayBuffer: (o: S.SerializedArrayBuffer) => {
    return new Uint8Array(o.__v).buffer
  },
  SharedArrayBuffer: (o: S.SerializedSharedArrayBuffer) => {
    const s = new SharedArrayBuffer(o.__v.length)
    const u = new Uint8Array(s)
    let i = 0
    while (i<u.length) {u[i] = o.__v[i++]}
    return s
  },
  Buffer: (o: S.SerializedBuffer) => {
    return Buffer.from(o.__v)
  },
  Int8Array: (o: S.SerializedInt8Array) => {
    return new Int8Array(o.__v)
  },
  Uint8Array: (o: S.SerializedUint8Array) => {
    return new Uint8Array(o.__v)
  },
  Uint8ClampedArray: (o: S.SerializedUint8ClampedArray) => {
    return new Uint8ClampedArray(o.__v)
  },
  Int16Array: (o: S.SerializedInt16Array) => {
    return new Int16Array(o.__v)
  },
  Uint16Array: (o: S.SerializedUint16Array) => {
    return new Uint16Array(o.__v)
  },
  Int32Array: (o: S.SerializedInt32Array) => {
    return new Int32Array(o.__v)
  },
  Uint32Array: (o: S.SerializedUint32Array) => {
    return new Uint32Array(o.__v)
  },
  Float32Array: (o: S.SerializedFloat32Array) => {
    return new Float32Array(o.__v)
  },
  Float64Array: (o: S.SerializedFloat64Array) => {
    return new Float64Array(o.__v)
  },
  BigInt64Array: (o: S.SerializedBigInt64Array) => {
    return new BigInt64Array(o.__v.map(v => BigInt(v)))
  },
  BigUint64Array: (o: S.SerializedBigUint64Array) => {
    return new BigUint64Array(o.__v.map(v => BigInt(v)))
  },
  Object: (o: S.SerializedObject): any => {
    const t: Record<any, any> = {}
    for (const k in o) {
      t[k] = deserialize(o[k])
    }
    return t
  }
}

const gt = (o: any) => {
  const t = what(o)
  if (t === 'Null') return t
  if (t === 'Number') return t
  if (t === 'Boolean') return t
  if (t === 'String') return t
  if (t === 'Array') return t
  if (t === 'Object') {
    if (!o.__t || !o.__v) return t
    if (o.__t === 'Array') return t
    // @ts-ignore
    if (!deserializer[o.__t]) return t
    return o.__t
  }
  return t
}

type DeserializeFn = {
  <T>(o: T): Deserialize<T>
}

export const deserialize: DeserializeFn = (o: any): any => {

  // @ts-ignore
  const f = deserializer[gt(o)]

  if (!f) {
    throw new Error(`${g(o)} can't be deserialized.`)
  }

  return f(o)

}

export const parse = (o: string): any => deserialize(JSON.parse(o))
