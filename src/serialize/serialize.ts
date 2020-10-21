import {what} from 'what-is-that'

import type * as S from '../types'
import type {Serialize} from './types'
import {getObjectName} from '../util'

function spread(obj: Buffer | S.TypedArray): number[]
function spread(obj: S.TypedBigIntArray): string[]
function spread(obj: Buffer | S.TypedArray | S.TypedBigIntArray) {
  const type = what(obj)
  const arr = []
  let i = 0
  while (i < obj.length) {
    arr.push((type === 'BigInt64Array' || type === 'BigUint64Array') ? obj[i++].toString() : obj[i++])
  }
  return arr
}

export const serializer = {
  String: (obj: string): S.SerializedString => {
    return obj
  },
  Boolean: (obj: boolean): S.SerializedBoolean => {
    return obj
  },
  Number: (obj: number): S.SerializedNumber => {
    return isNaN(obj)
      ? {__t: 'Number', __v: 'nan'}
      : !isFinite(obj)
        ? {__t: 'Number', __v: 'infinity'}
        : obj
  },
  Undefined: (obj: undefined): S.SerializedUndefined => {
    return {__t: 'Undefined', __v: 'undefined'}
  },
  Null: (obj: null): S.SerializedNull => {
    return null
  },
  Symbol: (obj: symbol): S.SerializedSymbol => {
    const key = obj.toString().match(/Symbol\((.*?)\)/)?.[1]
    return {__t: 'Symbol', __v: key || ''}
  },
  BigInt: (obj: BigInt): S.SerializedBigInt => {
    return {__t: 'BigInt', __v: obj.toString()}
  },
  RegExp: (obj: RegExp): S.SerializedRegExp => {
    return {__t: 'RegExp', __v: {source: obj.source, flags: obj.flags}}
  },
  Date: (obj: Date): S.SerializedDate => {
    return {__t: 'Date', __v: obj.getTime()}
  },
  URL: (obj: URL): S.SerializedURL => {
    return {__t: 'URL', __v: obj.origin}
  },
  URLSearchParams: (obj: URLSearchParams): S.SerializedURLSearchParams => {
    return {__t: 'URLSearchParams', __v: obj.toString()}
  },
  Map: (obj: Map<any, any>): S.SerializedMap => {
    const keys = [...obj.keys()]
    return {__t: 'Map', __v: keys.map(key => [key, serialize(obj.get(key))])}
  },
  Set: (obj: Set<any>): S.SerializedSet => {
    const values = [...obj.values()].map(v => serialize(v))
    return {__t: 'Set', __v: values}
  },
  // Function: (obj: Function): S.SerializedFunction => {
  //   return {__t: 'Function', __v: obj.toString()}
  // },
  Array: (obj: any[]): S.SerializedArray => {
    return obj.map(v => serialize(v))
  },
  DataView: (obj: DataView): S.SerializedDataView => {
    return {__t: 'DataView', __v: {buffer: spread(new Uint8Array(obj.buffer)), byteOffset: obj.byteOffset, byteLength: obj.byteLength}}
  },
  ArrayBuffer: (obj: ArrayBuffer): S.SerializedArrayBuffer => {
    return {__t: 'ArrayBuffer', __v: spread(new Uint8Array(obj))}
  },
  SharedArrayBuffer: (obj: SharedArrayBuffer): S.SerializedSharedArrayBuffer => {
    return {__t: 'SharedArrayBuffer', __v: spread(new Uint8Array(obj))}
  },
  Buffer: (obj: Buffer): S.SerializedBuffer => {
    return {__t: 'Buffer', __v: spread(obj)}
  },
  Int8Array: (obj: Int8Array): S.SerializedInt8Array => {
    return {__t: 'Int8Array', __v: spread(obj)}
  },
  Uint8Array: (obj: Uint8Array): S.SerializedUint8Array => {
    return {__t: 'Uint8Array', __v: spread(obj)}
  },
  Uint8ClampedArray: (obj: Uint8ClampedArray): S.SerializedUint8ClampedArray => {
    return {__t: 'Uint8ClampedArray', __v: spread(obj)}
  },
  Int16Array: (obj: Int16Array): S.SerializedInt16Array => {
    return {__t: 'Int16Array', __v: spread(obj)}
  },
  Uint16Array: (obj: Uint16Array): S.SerializedUint16Array => {
    return {__t: 'Uint16Array', __v: spread(obj)}
  },
  Int32Array: (obj: Int32Array): S.SerializedInt32Array => {
    return {__t: 'Int32Array', __v: spread(obj)}
  },
  Uint32Array: (obj: Uint32Array): S.SerializedUint32Array => {
    return {__t: 'Uint32Array', __v: spread(obj)}
  },
  Float32Array: (obj: Float32Array): S.SerializedFloat32Array => {
    return {__t: 'Float32Array', __v: spread(obj)}
  },
  Float64Array: (obj: Float64Array): S.SerializedFloat64Array => {
    return {__t: 'Float64Array', __v: spread(obj)}
  },
  BigInt64Array: (obj: BigInt64Array): S.SerializedBigInt64Array => {
    return {__t: 'BigInt64Array', __v: spread(obj)}
  },
  BigUint64Array: (obj: BigUint64Array): S.SerializedBigUint64Array => {
    return {__t: 'BigUint64Array', __v: spread(obj)}
  },
  Object: (obj: any): S.SerializedObject => {
    const o: Record<any, any> = {}
    for (const k in obj) {
      o[k] = serialize(obj[k])
    }
    return o
  }
}

type SerializeFn = {
  <T>(obj: T): Serialize<T>
}

export const serialize: SerializeFn = <T>(obj: T): Serialize<T> => {
  // @ts-ignore
  const handler = serializer[what(obj)]
  if (!handler) {
    throw new Error(`${getObjectName(obj)} can't be serialized.`)
  }
  return handler(obj)
}

export const stringify = <T>(obj: T) => JSON.stringify(serialize(obj))
