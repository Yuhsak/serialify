import {
  is,
} from './is'

import {
  fromEntries,
} from './util'

import type * as T from './types'

export const serializer = {
  Undefined: (obj: undefined): T.SerializedUndefined => {
    return {__type: 'Undefined', __value: 'undefined'} as const
  },
  Null: (obj: null): T.SerializedNull => {
    return null
  },
  Number: (obj: number): T.SerializedNumber => {
    return isNaN(obj)
      ? {__type: 'Number', __value: 'nan'} as const
      : !isFinite(obj)
        ? {__type: 'Number', __value: 'infinity'} as const
        : obj
  },
  Symbol: (obj: symbol): T.SerializedSymbol => {
    const key = obj.toString().match(/Symbol\((.*?)\)/)?.[1]
    return {__type: 'Symbol', __value: key || ''}
  },
  BigInt: (obj: BigInt): T.SerializedBigInt => {
    return {__type: 'BigInt', __value: obj.toString()}
  },
  RegExp: (obj: RegExp): T.SerializedRegExp => {
    return {__type: 'RegExp', __value: {source: obj.source, flags: obj.flags}}
  },
  Date: (obj: Date): T.SerializedDate => {
    return {__type: 'Date', __value: obj.getTime()}
  },
  Map: (obj: Map<any, any>): T.SerializedMap => {
    const keys = [...obj.keys()]
    return {__type: 'Map', __value: keys.map(key => [key, serialize(obj.get(key))])}
  },
  Set: (obj: Set<any>): T.SerializedSet => {
    const values =[...obj.values()].map(v => serialize(v))
    return {__type: 'Set', __value: values}
  },
  Function: (obj: Function): T.SerializedFunction => {
    return {__type: 'Function', __value: obj.toString()}
  },
  Array: (obj: any[]): T.SerializedArray => {
    return obj.map(v => serialize(v))
  },
  ArrayBuffer: (obj: ArrayBuffer): T.SerializedArrayBuffer => {
    return {__type: 'ArrayBuffer', __value: [...Buffer.from(obj)]}
  },
  Buffer: (obj: Buffer): T.SerializedBuffer => {
    return {__type: 'Buffer', __value: [...obj]}
  },
  Int8Array: (obj: Int8Array): T.SerializedInt8Array => {
    return {__type: 'Int8Array', __value: [...obj]}
  },
  Uint8Array: (obj: Uint8Array): T.SerializedUint8Array => {
    return {__type: 'Uint8Array', __value: [...obj]}
  },
  Uint8ClampedArray: (obj: Uint8ClampedArray): T.SerializedUint8ClampedArray => {
    return {__type: 'Uint8ClampedArray', __value: [...obj]}
  },
  Int16Array: (obj: Int16Array): T.SerializedInt16Array => {
    return {__type: 'Int16Array', __value: [...obj]}
  },
  Uint16Array: (obj: Uint16Array): T.SerializedUint16Array => {
    return {__type: 'Uint16Array', __value: [...obj]}
  },
  Int32Array: (obj: Int32Array): T.SerializedInt32Array => {
    return {__type: 'Int32Array', __value: [...obj]}
  },
  Uint32Array: (obj: Uint32Array): T.SerializedUint32Array => {
    return {__type: 'Uint32Array', __value: [...obj]}
  },
  Float32Array: (obj: Float32Array): T.SerializedFloat32Array => {
    return {__type: 'Float32Array', __value: [...obj]}
  },
  Float64Array: (obj: Float64Array): T.SerializedFloat64Array => {
    return {__type: 'Float64Array', __value: [...obj]}
  },
  BigInt64Array: (obj: BigInt64Array): T.SerializedBigInt64Array => {
    return {__type: 'BigInt64Array', __value: [...obj].map(v => v.toString())}
  },
  BigUint64Array: (obj: BigUint64Array): T.SerializedBigUint64Array => {
    return {__type: 'BigUint64Array', __value: [...obj].map(v => v.toString())}
  },
  Object: (obj: any): T.SerializedObject => {
    return fromEntries(Object.entries(obj).map(([k,v]) => [k, serialize(v)]))
  }
}

export const omit = (obj: any, type: string): any => {

  if (is.Array(obj)) {
    return obj.filter(v => {
      try {
        return v.__type !== type
      } catch(e) {
        return true
      }
    }).map(v => omit(v, type))
  }

  if (is.Object(obj)) {
    return fromEntries(Object.entries(obj).filter(([, v]) => {
      try {
        return (v as any).__type !== type
      } catch(e) {
        return true
      }
    }).map(([k,v]) => [k, omit(v, type)]))
  }

  return obj

}

export type SerializeOption = {
  ignoreFunction?: boolean
}

const isKeys = Object.keys(is) as (keyof typeof is)[]

export const serialize = (obj: any, {ignoreFunction=false}: SerializeOption={}) => {

  for (const key of isKeys) {
    if (is[key](obj)) {
      // @ts-ignore
      const r = serializer[key](obj)
      if (ignoreFunction) {
        return omit(r, 'Function')
      }
      return r
    }
  }

  return obj

}

export const stringify = (obj: any, {ignoreFunction=false}: SerializeOption={}) => JSON.stringify(serialize(obj, {ignoreFunction}))
