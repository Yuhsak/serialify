import { serialize } from '../src'

describe('sample code for README', () => {

  test('correct', () => {

    const d1 = new Date()

    const obj = serialize({
      String: 'John',
      Number: 28,
      Infinity: Infinity,
      NaN: NaN,
      Boolean: true,
      Undefined: undefined,
      Null: null,
      Date: d1,
      Symbol: Symbol('test'),
      RegExp: new RegExp('^http:\/\/(.*?)(\/|$)', 'i'),
      BigInt: BigInt('2'),
      Map: new Map([['a', 0], ['b', 1]]),
      Set: new Set([0, 1]),
      Array: [0, 1],
      Object: {a: 0, b: 1},
      NestedArray: [d1, 10, {Set: new Set([0, 1])}],
      NestedObject: {Date: d1, Object: {Number: 10, NaN: NaN}},
      Buffer: Buffer.from('abcd'),
      ArrayBuffer: new Uint8Array([0, 1, 2, 3]).buffer,
      Int8Array: new Int8Array([0, 1, 2, 3]),
      Uint8Array: new Uint8Array([0, 1, 2, 3]),
      Uint8ClampedArray: new Uint8ClampedArray([0, 1, 2, 3]),
      Int16Array: new Int16Array([0, 1, 2, 3]),
      Uint16Array: new Uint16Array([0, 1, 2, 3]),
      Int32Array: new Int32Array([0, 1, 2, 3]),
      Uint32Array: new Uint32Array([0, 1, 2, 3]),
      Float32Array: new Float32Array([0, 1, 2, 3]),
      Float64Array: new Float64Array([0, 1, 2, 3,]),
      BigInt64Array: new BigInt64Array([BigInt('1')]),
      BigUint64Array: new BigUint64Array([BigInt('1')])
    })

    expect(obj).toStrictEqual({
      String: 'John',
      Number: 28,
      Infinity: {__t: 'Number', __v: 'infinity'},
      NaN: {__t: 'Number', __v: 'nan'},
      Boolean: true,
      Undefined: {__t: 'Undefined', __v: 'undefined'},
      Null: null,
      Date: {__t: 'Date', __v: d1.getTime()},
      Symbol: {__t: 'Symbol', __v: 'test'},
      RegExp: {__t: 'RegExp', __v: {source: '^http:\\/\\/(.*?)(\\/|$)', flags: 'i'}},
      BigInt: {__t: 'BigInt', __v: '2'},
      Map: {__t: 'Map', __v: [['a', 0], ['b', 1]]},
      Set: {__t: 'Set', __v: [0, 1]},
      Array: [0, 1],
      Object: {a: 0, b: 1},
      NestedArray: [
        { __t: 'Date', __v: d1.getTime() },
        10,
        {
          Set: { __t: 'Set', __v: [0, 1] }
        }
      ],
      NestedObject: {
        Date: { __t: 'Date', __v: d1.getTime() },
        Object: {
          Number: 10,
          NaN: {__t: 'Number', __v: 'nan'}
        }
      },
      Buffer: {__t: 'Buffer', __v: [97, 98, 99, 100]},
      ArrayBuffer: {__t: 'ArrayBuffer', __v: [0, 1, 2, 3]},
      Int8Array: {__t: 'Int8Array', __v: [0, 1, 2, 3]},
      Uint8Array: {__t: 'Uint8Array', __v: [0, 1, 2, 3]},
      Uint8ClampedArray: {__t: 'Uint8ClampedArray', __v: [0, 1, 2, 3]},
      Int16Array: {__t: 'Int16Array', __v: [0, 1, 2, 3]},
      Uint16Array: {__t: 'Uint16Array', __v: [0, 1, 2, 3]},
      Int32Array: {__t: 'Int32Array', __v: [0, 1, 2, 3]},
      Uint32Array: {__t: 'Uint32Array', __v: [0, 1, 2, 3]},
      Float32Array: {__t: 'Float32Array', __v: [0, 1, 2, 3]},
      Float64Array: {__t: 'Float64Array', __v: [0, 1, 2, 3]},
      BigInt64Array: {__t: 'BigInt64Array', __v: ['1']},
      BigUint64Array: {__t: 'BigUint64Array', __v: ['1']},
    })

  })

})

