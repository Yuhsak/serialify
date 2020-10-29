import {what as w} from 'what-is-that'

import type * as S from '../types'
import type {Serialize} from './types'
import {SerializeError} from './error'
import {getObjectName as g} from '../util'

function spread(o: Buffer | S.TypedArray): number[]
function spread(o: S.TypedBigIntArray): string[]
function spread(o: Buffer | S.TypedArray | S.TypedBigIntArray) {
  const t = w(o)
  const a = []
  let i = 0
  while (i < o.length) {
    a.push((t === 'BigInt64Array' || t === 'BigUint64Array') ? o[i++].toString() : o[i++])
  }
  return a
}

export const serializer = {
  String: (o: string): S.SerializedString => {
    return o
  },
  Boolean: (o: boolean): S.SerializedBoolean => {
    return o
  },
  Number: (o: number): S.SerializedNumber => {
    return isNaN(o)
      ? {__t: 'Number', __v: 'nan'}
      : !isFinite(o)
        ? {__t: 'Number', __v: 'infinity'}
        : o
  },
  Undefined: (o: undefined): S.SerializedUndefined => {
    return {__t: 'Undefined', __v: 'undefined'}
  },
  Null: (o: null): S.SerializedNull => {
    return null
  },
  Symbol: (o: symbol): S.SerializedSymbol => {
    const k = (o.toString().match(/Symbol\((.+?)\)/)||['',''])[1]
    return {__t: 'Symbol', __v: k}
  },
  BigInt: (o: BigInt): S.SerializedBigInt => {
    return {__t: 'BigInt', __v: o.toString()}
  },
  RegExp: (o: RegExp): S.SerializedRegExp => {
    return {__t: 'RegExp', __v: {source: o.source, flags: o.flags}}
  },
  Date: (o: Date): S.SerializedDate => {
    return {__t: 'Date', __v: o.getTime()}
  },
  URL: (o: URL): S.SerializedURL => {
    return {__t: 'URL', __v: o.href}
  },
  URLSearchParams: (o: URLSearchParams): S.SerializedURLSearchParams => {
    return {__t: 'URLSearchParams', __v: o.toString()}
  },
  Map: (o: Map<any, any>, p: string='o'): S.SerializedMap => {
    const keys = [...o.keys()]
    return {__t: 'Map', __v: keys.map(key => [key, _serialize(o.get(key), p+'.get("'+key+'")')])}
  },
  Set: (o: Set<any>, p: string='o'): S.SerializedSet => {
    const values = [...o.values()].map((v,i) => _serialize(v, p+'['+i+']'))
    return {__t: 'Set', __v: values}
  },
  Array: (o: any[], p: string='o'): S.SerializedArray => {
    return o.map((v,i) => _serialize(v, p+'['+i+']'))
  },
  DataView: (o: DataView): S.SerializedDataView => {
    return {__t: 'DataView', __v: {buffer: spread(new Uint8Array(o.buffer)), byteOffset: o.byteOffset, byteLength: o.byteLength}}
  },
  ArrayBuffer: (o: ArrayBuffer): S.SerializedArrayBuffer => {
    return {__t: 'ArrayBuffer', __v: spread(new Uint8Array(o))}
  },
  Buffer: (o: Buffer): S.SerializedBuffer => {
    return {__t: 'Buffer', __v: spread(o)}
  },
  Int8Array: (o: Int8Array): S.SerializedInt8Array => {
    return {__t: 'Int8Array', __v: spread(o)}
  },
  Uint8Array: (o: Uint8Array): S.SerializedUint8Array => {
    return {__t: 'Uint8Array', __v: spread(o)}
  },
  Uint8ClampedArray: (o: Uint8ClampedArray): S.SerializedUint8ClampedArray => {
    return {__t: 'Uint8ClampedArray', __v: spread(o)}
  },
  Int16Array: (o: Int16Array): S.SerializedInt16Array => {
    return {__t: 'Int16Array', __v: spread(o)}
  },
  Uint16Array: (o: Uint16Array): S.SerializedUint16Array => {
    return {__t: 'Uint16Array', __v: spread(o)}
  },
  Int32Array: (o: Int32Array): S.SerializedInt32Array => {
    return {__t: 'Int32Array', __v: spread(o)}
  },
  Uint32Array: (o: Uint32Array): S.SerializedUint32Array => {
    return {__t: 'Uint32Array', __v: spread(o)}
  },
  Float32Array: (o: Float32Array): S.SerializedFloat32Array => {
    return {__t: 'Float32Array', __v: spread(o)}
  },
  Float64Array: (o: Float64Array): S.SerializedFloat64Array => {
    return {__t: 'Float64Array', __v: spread(o)}
  },
  BigInt64Array: (o: BigInt64Array): S.SerializedBigInt64Array => {
    return {__t: 'BigInt64Array', __v: spread(o)}
  },
  BigUint64Array: (o: BigUint64Array): S.SerializedBigUint64Array => {
    return {__t: 'BigUint64Array', __v: spread(o)}
  },
  Object: (o: any, path: string='o'): S.SerializedObject => {
    const t: Record<any, any> = {}
    for (const k in o) {
      t[k] = _serialize(o[k], path+'.'+k)
    }
    return t
  }
}

type SerializeFn = {
  <T>(o: T): Serialize<T>
}

const _serialize = <T>(o: T, p: string): Serialize<T> => {
  // @ts-ignore
  const f = serializer[w(o)]
  if (!f) {
    throw new SerializeError(`${g(o)} can't be serialized.`, p)
  }
  return f(o, p)
}

export const serialize: SerializeFn = <T>(o: T): Serialize<T> => _serialize(o, 'o')

type StringifyFn = {
  <T>(o: T, replacer ?: (this: any, key: string, value: any) => any, space ?: string | number): string
  <T>(o: T, replacer?: (number | string)[] | null, space?: string | number): string
}

export const stringify: StringifyFn = <T>(o: T, replacer?: any, space?: any) => JSON.stringify(serialize(o), replacer, space)
