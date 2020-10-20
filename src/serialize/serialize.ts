import {
  what,
} from '../is'

import type * as S from '../types'

import type {
  Serialize,
} from './types'

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
  Map: (obj: Map<any, any>): S.SerializedMap => {
    const keys = [...obj.keys()]
    return {__t: 'Map', __v: keys.map(key => [key, serializeRecursive(obj.get(key))])}
  },
  Set: (obj: Set<any>): S.SerializedSet => {
    const values = [...obj.values()].map(v => serializeRecursive(v))
    return {__t: 'Set', __v: values}
  },
  Function: (obj: Function): S.SerializedFunction => {
    return {__t: 'Function', __v: obj.toString()}
  },
  Array: (obj: any[]): S.SerializedArray => {
    return obj.map(v => serializeRecursive(v))
  },
  ArrayBuffer: (obj: ArrayBuffer): S.SerializedArrayBuffer => {
    return {__t: 'ArrayBuffer', __v: [...Buffer.from(obj)]}
  },
  Buffer: (obj: Buffer): S.SerializedBuffer => {
    const __v: number[] = []
    for (const v of obj) {
      v !== void(0) && __v.push(v)
    }
    return {__t: 'Buffer', __v}
  },
  Int8Array: (obj: Int8Array): S.SerializedInt8Array => {
    return {__t: 'Int8Array', __v: [...obj]}
  },
  Uint8Array: (obj: Uint8Array): S.SerializedUint8Array => {
    return {__t: 'Uint8Array', __v: [...obj]}
  },
  Uint8ClampedArray: (obj: Uint8ClampedArray): S.SerializedUint8ClampedArray => {
    return {__t: 'Uint8ClampedArray', __v: [...obj]}
  },
  Int16Array: (obj: Int16Array): S.SerializedInt16Array => {
    return {__t: 'Int16Array', __v: [...obj]}
  },
  Uint16Array: (obj: Uint16Array): S.SerializedUint16Array => {
    return {__t: 'Uint16Array', __v: [...obj]}
  },
  Int32Array: (obj: Int32Array): S.SerializedInt32Array => {
    return {__t: 'Int32Array', __v: [...obj]}
  },
  Uint32Array: (obj: Uint32Array): S.SerializedUint32Array => {
    return {__t: 'Uint32Array', __v: [...obj]}
  },
  Float32Array: (obj: Float32Array): S.SerializedFloat32Array => {
    return {__t: 'Float32Array', __v: [...obj]}
  },
  Float64Array: (obj: Float64Array): S.SerializedFloat64Array => {
    return {__t: 'Float64Array', __v: [...obj]}
  },
  BigInt64Array: (obj: BigInt64Array): S.SerializedBigInt64Array => {
    return {__t: 'BigInt64Array', __v: [...obj].map(v => v.toString())}
  },
  BigUint64Array: (obj: BigUint64Array): S.SerializedBigUint64Array => {
    return {__t: 'BigUint64Array', __v: [...obj].map(v => v.toString())}
  },
  Object: (obj: any): S.SerializedObject => {
    const o: Record<any, any> = {}
    for (const k in obj) {
      o[k] = serializeRecursive(obj[k])
    }
    return o
  }
}

type SerializeRecursiveFn = {
  <T>(obj: T): Serialize<T>
}

const serializeRecursive: SerializeRecursiveFn = (obj: any): any => {
  const type = what(obj)
  if (!type) return obj
  if (type === 'Function') return obj
  // @ts-ignore
  return serializer[type](obj)
}

export type SerializeOption = {
  ignoreFunction?: boolean
}

type SerializeFn = {
  <T>(obj: T): Serialize<T>
}

export const serialize: SerializeFn = <T>(obj: T): Serialize<T> => {

  return serializeRecursive(obj)

}

export const stringify = <T>(obj: T) => JSON.stringify(serialize(obj))
