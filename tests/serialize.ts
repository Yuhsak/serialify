import {
  serialize,
} from '../src'

import type * as T from '../src/types'

describe('serialize', () => {

  describe('basics', () => {

    test('Number', () => {
      const result: T.SerializedNumber = serialize(1)
      expect(result).toStrictEqual(1)
    })

    test('String', () => {
      const result: T.SerializedString = serialize('s')
      expect(result).toStrictEqual('s')
    })

    test('Boolean:true', () => {
      const result: T.SerializedBoolean = serialize(true)
      expect(result).toStrictEqual(true)
    })

    test('Boolean:false', () => {
      const result: T.SerializedBoolean = serialize(false)
      expect(result).toStrictEqual(false)
    })

    test('Null', () => {
      const result = serialize<null>(null)
      expect(serialize(null)).toStrictEqual(null)
    })

    test('Undefined', () => {
      const result = serialize<undefined>(void(0))
      expect(serialize(void (0))).toStrictEqual({__t: 'Undefined', __v: 'undefined'})
    })

    test('Array<number>', () => {
      const result: T.SerializedNumber[] = serialize([0, 1, 2, 3])
      expect(serialize([0, 1, 2, 3])).toStrictEqual([0,1,2,3])
    })

    test('{a: 1, b: 2}', () => {
      const result: {a: T.SerializedNumber, b: T.SerializedString} = serialize({a: 1, b: '2'})
      expect(result).toStrictEqual({a: 1, b: '2'})
    })

    test('Infinity', () => {
      const result: T.SerializedNumber = serialize(Infinity)
      expect(result).toStrictEqual({__t: 'Number', __v: 'infinity'})
    })

    test('NaN', () => {
      const result: T.SerializedNumber = serialize(NaN)
      expect(result).toStrictEqual({__t: 'Number', __v: 'nan'})
    })

    test('RegExp', () => {
      const result: T.SerializedRegExp = serialize(/\([abc\(].*?/gi)
      expect(result).toStrictEqual({__t: 'RegExp', __v: {source: '\\([abc\\(].*?', flags: 'gi'}})
    })

    test('BigInt', () => {
      const result: T.SerializedBigInt = serialize(BigInt('2'))
      expect(result).toStrictEqual({__t: 'BigInt', __v: '2'})
    })

    test('Symbol', () => {
      const result: T.SerializedSymbol = serialize(Symbol('test'))
      expect(result).toStrictEqual({__t: 'Symbol', __v: 'test'})
    })

    test('Map', () => {
      const result: T.Serialized<'Map', [string, T.SerializedNumber][]> = serialize(new Map([['a', 1], ['b', 2]]))
      expect(result).toStrictEqual({__t: 'Map', __v: [['a', 1], ['b', 2]]})
    })

    test('Set', () => {
      const result: T.Serialized<'Set', T.SerializedNumber[]> = serialize(new Set([0, 1, 2]))
      expect(result).toStrictEqual({__t: 'Set', __v: [0,1,2]})
    })

    test('Buffer', () => {
      const result: T.SerializedBuffer = serialize(Buffer.from('abc'))
      expect(result).toStrictEqual({__t: 'Buffer', __v: [97, 98, 99]})
    })

    test('ArrayBuffer', () => {
      const result: T.SerializedArrayBuffer = serialize(new Uint8Array([0, 1, 2, 3]).buffer)
      expect(result).toStrictEqual({__t: 'ArrayBuffer', __v: [0, 1, 2, 3]})
    })

  })

  describe('nest', () => {

    test('array', () => {

      const arr = [
        NaN,
        Infinity,
        's',
        1,
        2,
        true,
        [
          false,
          {
            a: true,
            b: BigInt('2')
          }
        ]
      ] as const

      const result = serialize(arr)

      expect(result).toStrictEqual([
        {__t: 'Number', __v: 'nan'},
        {__t: 'Number', __v: 'infinity'},
        's',
        1,
        2,
        true,
        [
          false,
          {
            a: true,
            b: {__t: 'BigInt', __v: '2'}
          }
        ]
      ])

    })

    test('object', () => {

      const obj = {
        bool: true,
        set: new Set<boolean>([true]),
        map: new Map<string, boolean | Set<any>>([
          ['a', true],
          ['b', new Set([
            new Map<any, any>([
              ['c', [0, 1, void(0)]],
              ['d', new Map<any, any>([
                ['e', 10],
                ['f', new Set(['g'])]
              ])]
            ])
          ])]
        ])
      }

      const result = serialize(obj)

      expect(result).toStrictEqual({
        bool: true,
        set: {__t: 'Set', __v: [true]},
        map: {
          __t: 'Map',
          __v: [
            ['a', true],
            ['b', {__t: 'Set', __v: [
              {__t: 'Map', __v: [
                ['c', [0, 1, {__t: 'Undefined', __v: 'undefined'}]],
                ['d', {__t: 'Map', __v: [
                  ['e', 10],
                  ['f', {__t: 'Set', __v: ['g']}]
                ]}]
              ]}
            ]}]
          ]
        }
      })

    })

  })

  describe('multiple dispatch', () => {

    const obj = {
      a: [0, 1, 2],
      b: {
        c: new Map([['d', [{
          e: true,
          f: new Set(['g'])
        }]]])
      }
    }

    const shouldbe = {
      a: [0, 1, 2],
      b: {
        c: {
          __t: 'Map', __v: [['d', [{
            e: true,
            f: {__t: 'Set', __v: ['g']}
          }]]]
        }
      }
    }

    test('2', () => {

      const res = serialize(serialize(obj))

      expect(res).toStrictEqual(shouldbe)

    })

    test('3', () => {

      const res = serialize(serialize(serialize(obj)))

      expect(res).toStrictEqual(shouldbe)

    })

  })

})
