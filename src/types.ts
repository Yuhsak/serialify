export type Serialized<T, V> = {
  __t: T
  __v: V
}

export type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array
export type TypedBigIntArray = BigInt64Array | BigUint64Array

export type SerializedString = string
export type SerializedBoolean = boolean
export type SerializedNumber = Serialized<'Number', 'infinity'> | Serialized<'Number', 'nan'> | number
export type SerializedUndefined = Serialized<'Undefined', 'undefined'>
export type SerializedNull = null
export type SerializedSymbol = Serialized<'Symbol', string>
export type SerializedBigInt = Serialized<'BigInt', string>
export type SerializedRegExp = Serialized<'RegExp',{source: string, flags: string}>
export type SerializedDate = Serialized<'Date', number>
export type SerializedMap<K=any, V=any> = Serialized<'Map', [K, V][]>
export type SerializedSet<V=any> = Serialized<'Set', V[]>
export type SerializedFunction = Serialized<'Function', string>
export type SerializedArray = any[]
export type SerializedDataView = Serialized<'DataView', {buffer: number[], byteOffset: number, byteLength: number}>
export type SerializedArrayBuffer = Serialized<'ArrayBuffer', number[]>
export type SerializedSharedArrayBuffer = Serialized<'SharedArrayBuffer', number[]>
export type SerializedBuffer = Serialized<'Buffer', number[]>
export type SerializedInt8Array = Serialized<'Int8Array', number[]>
export type SerializedUint8Array = Serialized<'Uint8Array', number[]>
export type SerializedUint8ClampedArray = Serialized<'Uint8ClampedArray', number[]>
export type SerializedInt16Array = Serialized<'Int16Array', number[]>
export type SerializedUint16Array = Serialized<'Uint16Array', number[]>
export type SerializedInt32Array = Serialized<'Int32Array', number[]>
export type SerializedUint32Array = Serialized<'Uint32Array', number[]>
export type SerializedFloat32Array = Serialized<'Float32Array', number[]>
export type SerializedFloat64Array = Serialized<'Float64Array', number[]>
export type SerializedBigInt64Array = Serialized<'BigInt64Array', string[]>
export type SerializedBigUint64Array = Serialized<'BigUint64Array', string[]>
export type SerializedURL = Serialized<'URL', string>
export type SerializedURLSearchParams = Serialized<'URLSearchParams', string>
export type SerializedObject = any
