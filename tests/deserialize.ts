import {
  deserialize,
  deserializer,
  parse,
} from '../src/deserialize'

import {
  serialize,
} from '../src/serialize'

import * as T from '../src/types'

describe('deserializer', () => {

  test('Array', () => {
    expect(deserializer.Array([])).toStrictEqual([])
  })

  test('Object', () => {
    expect(deserializer.Object({})).toStrictEqual({})
  })

  test('Set', () => {
    expect(deserializer.Set({__t: 'Set', __v: []}).size).toBe(0)
  })

  test('Map', () => {
    expect(deserializer.Map({__t: 'Map', __v: []}).size).toBe(0)
  })

})

describe('deserialize', () => {

  test('Number', () => {
    deserializer.Number(1)
    // @ts-ignore
    expect(deserializer.Number({__t: 'Number', __v: 'nothing'})).toStrictEqual({__t: 'Number', __v: 'nothing'})
    const result = deserialize(1)
    expect(result).toStrictEqual(1)
  })

  test('Number:NaN', () => {
    const o: T.SerializedNumber = {__t: 'Number', __v: 'nan'}
    const result= deserialize(o)
    expect(result).toBeNaN()
  })

  test('Number:Infinity', () => {
    const o: T.SerializedNumber = {__t: 'Number', __v: 'infinity'}
    const result = deserialize(o)
    expect(result).toBe(Infinity)
  })

  test('String', () => {
    const result = deserialize('s')
    expect(result).toBe('s')
  })

  test('Boolean:true', () => {
    const result = deserialize(true)
    expect(result).toBe(true)
  })

  test('Boolean:false', () => {
    const result = deserialize(false)
    expect(result).toBe(false)
  })

  test('Null', () => {
    const result = deserialize<null>(null)
    expect(result).toBe(null)
  })

  test('Undefined', () => {
    const o: T.SerializedUndefined = {__t: 'Undefined', __v: 'undefined'}
    const result = deserialize(o)
    expect(result).toBe(void(0))
  })

  test('{a: 1, b: 2}', () => {
    const result = deserialize({a: 1, b: '2'})
    expect(result).toStrictEqual({a: 1, b: '2'})
  })

  test('BigInt', () => {
    const o: T.SerializedBigInt = {__t: 'BigInt', __v: '1'}
    const result = deserialize(o)
    expect(result).toBe(BigInt('1'))
  })

  test('Symbol', () => {
    const o: T.SerializedSymbol = {__t: 'Symbol', __v: ''}
    const result = deserialize(o)
    expect(result.toString()).toBe('Symbol()')
  })

  test('RegExp', () => {
    const o: T.SerializedRegExp = {__t: 'RegExp', __v: {source: '\\([abc\\(].*?', flags: 'gi'}}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(RegExp)
  })

  test('Date', () => {

    const date = new Date(1600000000000)
    const serialized = deserialize(serialize(date))

    expect(serialized instanceof Date).toBe(true)
    expect(serialized.getTime()).toBe(date.getTime())

  })

  test('URL', () => {
    const o: T.SerializedURL = {__t: 'URL', __v: 'http://a/'}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(URL)
  })

  test('URLSearchParams', () => {
    const o: T.SerializedURLSearchParams = {__t: 'URLSearchParams', __v: 'q=test'}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(URLSearchParams)
  })

  test('Array<number>', () => {
    const result = deserialize([0, 1, 2, 3])
    expect(result).toStrictEqual([0, 1, 2, 3])
  })

  test('Map', () => {
    const o: T.SerializedMap<string, number> = {__t: 'Map', __v: [['a', 0]]}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(Map)
  })

  test('Set', () => {
    const o : T.SerializedSet<number> = {__t: 'Set', __v: [0]}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(Set)
  })

  test('Buffer', () => {
    const o: T.SerializedBuffer = {__t: 'Buffer', __v: [97, 98, 99]}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(Buffer)
  })

  test('DataView', () => {
    const o: T.SerializedDataView = {__t: 'DataView', __v: {buffer: [0], byteOffset: 0, byteLength: 1}}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(DataView)
  })

  test('ArrayBuffer', () => {
    const o: T.SerializedArrayBuffer = {__t: 'ArrayBuffer', __v: [0, 1, 2, 3]}
    const result = deserialize(o)
    expect(result.toString()).toBe('[object ArrayBuffer]')
  })

  test('Int8Array', () => {
    const o: T.SerializedInt8Array = {__t: 'Int8Array', __v: [0]}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(Int8Array)
  })

  test('Uint8Array', () => {
    const o: T.SerializedUint8Array = {__t: 'Uint8Array', __v: [0]}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(Uint8Array)
  })

  test('Uint8ClampedArray', () => {
    const o: T.SerializedUint8ClampedArray = {__t: 'Uint8ClampedArray', __v: [0]}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(Uint8ClampedArray)
  })

  test('Int16Array', () => {
    const o: T.SerializedInt16Array = {__t: 'Int16Array', __v: [0]}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(Int16Array)
  })

  test('Uint16Array', () => {
    const o: T.SerializedUint16Array = {__t: 'Uint16Array', __v: [0]}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(Uint16Array)
  })

  test('Int32Array', () => {
    const o: T.SerializedInt32Array = {__t: 'Int32Array', __v: [0]}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(Int32Array)
  })

  test('Uint32Array', () => {
    const o: T.SerializedUint32Array = {__t: 'Uint32Array', __v: [0]}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(Uint32Array)
  })

  test('Float32Array', () => {
    const o: T.SerializedFloat32Array = {__t: 'Float32Array', __v: [0]}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(Float32Array)
  })

  test('Float64Array', () => {
    const o: T.SerializedFloat64Array = {__t: 'Float64Array', __v: [0]}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(Float64Array)
  })

  test('BigInt64Array', () => {
    const o: T.SerializedBigInt64Array = {__t: 'BigInt64Array', __v: ['0']}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(BigInt64Array)
  })

  test('BigUint64Array', () => {
    const o: T.SerializedBigUint64Array = {__t: 'BigUint64Array', __v: ['0']}
    const result = deserialize(o)
    expect(result).toBeInstanceOf(BigUint64Array)
  })

  describe('object', () => {

    test('plain object', () => {

      const obj = {a: true, b: 1, c: 's'}
      const s = deserialize(obj)
      const d = deserialize(s)

      expect(s).toStrictEqual({a: true, b: 1, c: 's'})
      expect(d).toStrictEqual(obj)

    })

    test('object with undefined/null', () => {

      const obj = {a: undefined, b: null}
      const s = serialize(obj)
      const d = deserialize(s)

      expect(s).toStrictEqual({a: {__t: 'Undefined', __v: 'undefined'}, b: null})
      expect(d).toStrictEqual(obj)

    })

    test('object which contains Array for __t', () => {
      expect(deserialize({__t: 'Array', __v: [0, 1, 2]})).toStrictEqual({__t: 'Array', __v: [0,1,2]})
    })

    test('object which contains Object for __t', () => {
      expect(deserialize({__t: 'Object', __v: {a: true}})).toStrictEqual({__t: 'Object', __v: {a: true}})
    })

    test('object which contains unknown __t', () => {
      expect(deserialize({__t: 'Unknown', __v: ''})).toStrictEqual({__t: 'Unknown', __v: ''})
    })

  })

})

describe('Identity', () => {

  test('Undefined', () => {
    const d: undefined = void(0)
    const result = deserialize(d)
    expect(result).toBe(d)
  })

  test('Date', () => {
    const d = new Date()
    const result = deserialize(d)
    expect(result).toBe(d)
  })

})

describe('Error', () => {

  test('Function', () => {
    expect(() => {
      deserialize(() => {})
    }).toThrowError()
  })

})

describe('parse', () => {

  test('parse', () => {
    expect(parse('{"a":{"__t":"Undefined","__v":"undefined"}}')).toStrictEqual({a: void(0)})
  })

})
