import {
  is,
  isKeys,
} from '../is'

import {
  fromEntries,
} from '../util'

import {
  omit,
  OmitBySerializedEntity,
} from '../omit'

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
      ? {__type: 'Number', __value: 'nan'}
      : !isFinite(obj)
        ? {__type: 'Number', __value: 'infinity'}
        : obj
  },
  Undefined: (obj: undefined): S.SerializedUndefined => {
    return {__type: 'Undefined', __value: 'undefined'}
  },
  Null: (obj: null): S.SerializedNull => {
    return null
  },
  Symbol: (obj: symbol): S.SerializedSymbol => {
    const key = obj.toString().match(/Symbol\((.*?)\)/)?.[1]
    return {__type: 'Symbol', __value: key || ''}
  },
  BigInt: (obj: BigInt): S.SerializedBigInt => {
    return {__type: 'BigInt', __value: obj.toString()}
  },
  RegExp: (obj: RegExp): S.SerializedRegExp => {
    return {__type: 'RegExp', __value: {source: obj.source, flags: obj.flags}}
  },
  Date: (obj: Date): S.SerializedDate => {
    return {__type: 'Date', __value: obj.getTime()}
  },
  Map: (obj: Map<any, any>): S.SerializedMap => {
    const keys = [...obj.keys()]
    return {__type: 'Map', __value: keys.map(key => [key, serializeRecursive(obj.get(key))])}
  },
  Set: (obj: Set<any>): S.SerializedSet => {
    const values = [...obj.values()].map(v => serializeRecursive(v))
    return {__type: 'Set', __value: values}
  },
  Function: (obj: Function): S.SerializedFunction => {
    return {__type: 'Function', __value: obj.toString()}
  },
  Array: (obj: any[]): S.SerializedArray => {
    return obj.map(v => serializeRecursive(v))
  },
  ArrayBuffer: (obj: ArrayBuffer): S.SerializedArrayBuffer => {
    return {__type: 'ArrayBuffer', __value: [...Buffer.from(obj)]}
  },
  Buffer: (obj: Buffer): S.SerializedBuffer => {
    return {__type: 'Buffer', __value: [...obj]}
  },
  Int8Array: (obj: Int8Array): S.SerializedInt8Array => {
    return {__type: 'Int8Array', __value: [...obj]}
  },
  Uint8Array: (obj: Uint8Array): S.SerializedUint8Array => {
    return {__type: 'Uint8Array', __value: [...obj]}
  },
  Uint8ClampedArray: (obj: Uint8ClampedArray): S.SerializedUint8ClampedArray => {
    return {__type: 'Uint8ClampedArray', __value: [...obj]}
  },
  Int16Array: (obj: Int16Array): S.SerializedInt16Array => {
    return {__type: 'Int16Array', __value: [...obj]}
  },
  Uint16Array: (obj: Uint16Array): S.SerializedUint16Array => {
    return {__type: 'Uint16Array', __value: [...obj]}
  },
  Int32Array: (obj: Int32Array): S.SerializedInt32Array => {
    return {__type: 'Int32Array', __value: [...obj]}
  },
  Uint32Array: (obj: Uint32Array): S.SerializedUint32Array => {
    return {__type: 'Uint32Array', __value: [...obj]}
  },
  Float32Array: (obj: Float32Array): S.SerializedFloat32Array => {
    return {__type: 'Float32Array', __value: [...obj]}
  },
  Float64Array: (obj: Float64Array): S.SerializedFloat64Array => {
    return {__type: 'Float64Array', __value: [...obj]}
  },
  BigInt64Array: (obj: BigInt64Array): S.SerializedBigInt64Array => {
    return {__type: 'BigInt64Array', __value: [...obj].map(v => v.toString())}
  },
  BigUint64Array: (obj: BigUint64Array): S.SerializedBigUint64Array => {
    return {__type: 'BigUint64Array', __value: [...obj].map(v => v.toString())}
  },
  Object: (obj: any): S.SerializedObject => {
    return fromEntries(Object.entries(obj).map(([k, v]) => [k, serializeRecursive(v)]))
  }
}

type SerializeRecursiveFn = {
  <T>(obj: T): Serialize<T>
}

const serializeRecursive: SerializeRecursiveFn = (obj: any): any => {
  for (const key of isKeys) {
    if (is[key](obj)) {
      // @ts-ignore
      return serializer[key](obj)
    }
  }
  return obj
}

export type SerializeOption = {
  ignoreFunction?: boolean
}

type SerializeFn = {
  <T>(obj: T): Serialize<T>
  <T>(obj: T, opt: {ignoreFunction: false}): Serialize<T>
  <T>(obj: T, opt: {ignoreFunction: true}): OmitBySerializedEntity<Serialize<T>, S.Serialized<'Function', any>> extends infer A ? A : never
  <T>(obj: T, opt: SerializeOption): Serialize<T> | OmitBySerializedEntity<Serialize<T>, S.Serialized<'Function', any>> extends infer A ? A : never
}

export const serialize: SerializeFn = (obj: any, {ignoreFunction = false}: SerializeOption = {}): any => {

  const s = serializeRecursive(obj)

  if (ignoreFunction && (s as any)?.__type === 'Function') {
    return void (0)
  }

  if (ignoreFunction) {
    return omit(s, 'Function')
  }

  return s

}

export const stringify = <T>(obj: T, {ignoreFunction = false}: SerializeOption = {}) => JSON.stringify(serialize(obj, {ignoreFunction}))
