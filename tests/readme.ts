import { serialize, deserialize } from '../src'

describe('sample code for README', () => {

  test('correct', () => {

    const obj = {
      String: 'John',
      Number: 28,
      Boolean: true,
      Undefined: undefined,
      Null: null,
      Array: [0, 1, 2, 3],
      Object: { a: 0, b: 1 },
      Date: new Date(),
      Function: function () { return 'OK' },
      Symbol: Symbol('test'),
      RegExp: new RegExp('^http:\/\/(.*?)(\/|$)', 'i'),
      BigInt: BigInt('2'),
      Map: new Map([['a', 0], ['b', 1]]),
      Set: new Set([0, 1, 2, 3]),
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
    }

    const s = serialize(obj)

    console.log(s)

  })

})

