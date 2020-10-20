import {
  toString,
} from './util'

const context = (0,eval)('this')

export const what = (obj: any) => {

  if (obj === null) return 'Null'

  const t = typeof obj
  if (t === 'string') return 'String'
  if (t === 'number') return 'Number'
  if (t === 'boolean') return 'Boolean'
  if (t === 'undefined') return 'Undefined'
  if (t === 'bigint') return 'BigInt'
  if (t === 'symbol') return 'Symbol'
  if (t === 'function') return 'Function'

  const s = toString(obj)
  if (s === '[object RegExp]') return 'RegExp'
  if (s === '[object Date]') return 'Date'
  if (s === '[object Map]') return 'Map'
  if (s === '[object Set]') return 'Set'
  if (s === '[object Array]') return 'Array'
  if (s === '[object ArrayBuffer]') return 'ArrayBuffer'
  // Must handle Buffer before Uint8Array because Buffer has '[object Uint8Array]' for its string representation
  if (!!(context.Buffer && context.Buffer.isBuffer?.(obj))) return 'Buffer'
  if (s === '[object Int8Array]') return 'Int8Array'
  if (s === '[object Uint8Array]') return 'Uint8Array'
  if (s === '[object Uint8ClampedArray]') return 'Uint8ClampedArray'
  if (s === '[object Int16Array]') return 'Int16Array'
  if (s === '[object Uint16Array]') return 'Uint16Array'
  if (s === '[object Int32Array]') return 'Int32Array'
  if (s === '[object Uint32Array]') return 'Uint32Array'
  if (s === '[object Float32Array]') return 'Float32Array'
  if (s === '[object Float64Array]') return 'Float64Array'
  if (s === '[object BigInt64Array]') return 'BigInt64Array'
  if (s === '[object BigUint64Array]') return 'BigUint64Array'

  if (t === 'object') return 'Object'

}

export const is = {
  String: (obj: any): obj is string => {
    return typeof obj === 'string'
  },
  Boolean: (obj: any): obj is boolean => {
    return typeof obj === 'boolean'
  },
  Number: (obj: any): obj is number => {
    return typeof obj === 'number'
  },
  Undefined: (obj: any): obj is undefined => {
    return obj === void (0)
  },
  Null: (obj: any): obj is null => {
    return obj === null
  },
  Symbol: (obj: any): obj is symbol => {
    return typeof obj === 'symbol'
  },
  BigInt: (obj: any): obj is BigInt => {
    return typeof obj === 'bigint'
  },
  RegExp: (obj: any): obj is RegExp => {
    return toString(obj) === '[object RegExp]'
  },
  Date: (obj: any): obj is Date => {
    return toString(obj) === '[object Date]'
  },
  Map: (obj: any): obj is Map<any, any> => {
    return toString(obj) === '[object Map]'
  },
  Set: (obj: any): obj is Set<any> => {
    return toString(obj) === '[object Set]'
  },
  Function: (obj: any): obj is Function => {
    return typeof obj === 'function'
  },
  Array: (obj: any): obj is Array<any> => {
    return toString(obj) === '[object Array]'
  },
  ArrayBuffer: (obj: any): obj is ArrayBuffer => {
    return toString(obj) === '[object ArrayBuffer]'
  },
  Buffer: (obj: any): obj is Buffer => {
    return !!(context.Buffer && context.Buffer.isBuffer?.(obj))
  },
  Int8Array: (obj: any): obj is Int8Array => {
    return toString(obj) === '[object Int8Array]'
  },
  Uint8Array: (obj: any): obj is Uint8Array => {
    return !is.Buffer(obj) && toString(obj) === '[object Uint8Array]'
  },
  Uint8ClampedArray: (obj: any): obj is Uint8ClampedArray => {
    return toString(obj) === '[object Uint8ClampedArray]'
  },
  Int16Array: (obj: any): obj is Int16Array => {
    return toString(obj) === '[object Int16Array]'
  },
  Uint16Array: (obj: any): obj is Uint16Array => {
    return toString(obj) === '[object Uint16Array]'
  },
  Int32Array: (obj: any): obj is Int32Array => {
    return toString(obj) === '[object Int32Array]'
  },
  Uint32Array: (obj: any): obj is Uint32Array => {
    return toString(obj) === '[object Uint32Array]'
  },
  Float32Array: (obj: any): obj is Float32Array => {
    return toString(obj) === '[object Float32Array]'
  },
  Float64Array: (obj: any): obj is Float64Array => {
    return toString(obj) === '[object Float64Array]'
  },
  BigInt64Array: (obj: any): obj is BigInt64Array => {
    return toString(obj) === '[object BigInt64Array]'
  },
  BigUint64Array: (obj: any): obj is BigUint64Array => {
    return toString(obj) === '[object BigUint64Array]'
  },
  Object: (obj: any) => {
    return typeof obj !== 'object'
      ? false
      : (
        !is.Null(obj) &&
        !is.RegExp(obj) &&
        !is.Date(obj) &&
        !is.Map(obj) &&
        !is.Set(obj) &&
        !is.Array(obj) &&
        !is.ArrayBuffer(obj) &&
        !is.Buffer(obj) &&
        !is.Int8Array(obj) &&
        !is.Uint8Array(obj) &&
        !is.Uint8ClampedArray(obj) &&
        !is.Int16Array(obj) &&
        !is.Uint16Array(obj) &&
        !is.Int32Array(obj) &&
        !is.Uint32Array(obj) &&
        !is.Float32Array(obj) &&
        !is.Float64Array(obj) &&
        !is.BigInt64Array(obj) &&
        !is.BigUint64Array(obj)
      )
  }
}

export const isKeys = Object.keys(is) as (keyof typeof is)[]
