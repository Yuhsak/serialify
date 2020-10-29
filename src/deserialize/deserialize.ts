import {isNumber as n, what} from 'what-is-that'

import type * as S from '../types'
import type {Deserialize} from './types'
import {DeserializeError} from './error'
import {getObjectName as g} from '../util'

export const deserializer = {
  Identity: (o: any) => {
    return o
  },
  String: (o: S.SerializedString) => {
    return o
  },
  Boolean: (o: S.SerializedBoolean) => {
    return o
  },
  Number: (o: S.SerializedNumber) => {
    if (!n(o)) {
      if (o.__v === 'nan') {
        return NaN
      }
      if (o.__v === 'infinity') {
        return Infinity
      }
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
  Map: (o: S.SerializedMap, p: string='o') => {
    return new Map(o.__v.map(([k, v]) => [k, _deserialize(v, p+'.get("'+k+'")')]))
  },
  Set: (o: S.SerializedSet, p: string='o') => {
    return new Set(o.__v.map((v,i) => _deserialize(v, p+'['+i+']')))
  },
  Array: (o: S.SerializedArray, p: string='o') => {
    return o.map((v,i) => _deserialize(v, p+'['+i+']'))
  },
  DataView: (o: S.SerializedDataView) => {
    return new DataView(new Uint8Array(o.__v.buffer).buffer, o.__v.byteOffset, o.__v.byteLength)
  },
  ArrayBuffer: (o: S.SerializedArrayBuffer) => {
    return new Uint8Array(o.__v).buffer
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
  Object: (o: S.SerializedObject, p: string='o'): any => {
    const t: Record<any, any> = {}
    for (const k in o) {
      t[k] = _deserialize(o[k], p+'.'+k)
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
    if (!o.__t || o.__v === void (0) || o.__v === null) return t
    if (o.__t === 'Array') return t
    // @ts-ignore
    if (!deserializer[o.__t]) return t
    return o.__t
  }
  // @ts-ignore
  return deserializer[t] ? 'Identity' : void(0)
}

type DeserializeFn = {
  <T>(o: T): Deserialize<T>
}

const _deserialize = <T>(o: T, p: string): Deserialize<T> => {
  // @ts-ignore
  const f = deserializer[gt(o)]

  if (!f) {
    throw new DeserializeError(`${g(o)} can't be deserialized.`, p)
  }

  return f(o, p)
}

export const deserialize: DeserializeFn = <T>(o: T): Deserialize<T> => _deserialize(o, 'o')

type ParseFn = {
  <T=any>(o: string, reviver?: (this: any, key: string, value: any) => any): T
}

export const parse: ParseFn = (o: string, reviver?: (this: any, key: string, value: any) => any): any => deserialize(JSON.parse(o, reviver))
