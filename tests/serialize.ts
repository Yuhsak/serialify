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
      expect(serialize(void (0))).toStrictEqual({__type: 'Undefined', __value: 'undefined'})
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
      expect(result).toStrictEqual({__type: 'Number', __value: 'infinity'})
    })

    test('NaN', () => {
      const result: T.SerializedNumber = serialize(NaN)
      expect(result).toStrictEqual({__type: 'Number', __value: 'nan'})
    })

    test('RegExp', () => {
      const result: T.SerializedRegExp = serialize(/\([abc\(].*?/gi)
      expect(result).toStrictEqual({__type: 'RegExp', __value: {source: '\\([abc\\(].*?', flags: 'gi'}})
    })

    test('BigInt', () => {
      const result: T.SerializedBigInt = serialize(BigInt('2'))
      expect(result).toStrictEqual({__type: 'BigInt', __value: '2'})
    })

    test('Symbol', () => {
      const result: T.SerializedSymbol = serialize(Symbol('test'))
      expect(result).toStrictEqual({__type: 'Symbol', __value: 'test'})
    })

    test('Map', () => {
      const result: T.Serialized<'Map', [string, T.SerializedNumber][]> = serialize(new Map([['a', 1], ['b', 2]]))
      expect(result).toStrictEqual({__type: 'Map', __value: [['a', 1], ['b', 2]]})
    })

    test('Set', () => {
      const result: T.Serialized<'Set', T.SerializedNumber[]> = serialize(new Set([0, 1, 2]))
      expect(result).toStrictEqual({__type: 'Set', __value: [0,1,2]})
    })

    test('Function', () => {
      const f = function () {}
      const result: T.SerializedFunction = serialize(f)
      expect(result).toStrictEqual({__type: 'Function', __value: f.toString()})
    })

    test('Buffer', () => {
      const result: T.SerializedBuffer = serialize(Buffer.from('abc'))
      expect(result).toStrictEqual({__type: 'Buffer', __value: [97, 98, 99]})
    })

    test('ArrayBuffer', () => {
      const result: T.SerializedArrayBuffer = serialize(new Uint8Array([0, 1, 2, 3]).buffer)
      expect(result).toStrictEqual({__type: 'ArrayBuffer', __value: [0, 1, 2, 3]})
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
        {__type: 'Number', __value: 'nan'},
        {__type: 'Number', __value: 'infinity'},
        's',
        1,
        2,
        true,
        [
          false,
          {
            a: true,
            b: {__type: 'BigInt', __value: '2'}
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
        set: {__type: 'Set', __value: [true]},
        map: {
          __type: 'Map',
          __value: [
            ['a', true],
            ['b', {__type: 'Set', __value: [
              {__type: 'Map', __value: [
                ['c', [0, 1, {__type: 'Undefined', __value: 'undefined'}]],
                ['d', {__type: 'Map', __value: [
                  ['e', 10],
                  ['f', {__type: 'Set', __value: ['g']}]
                ]}]
              ]}
            ]}]
          ]
        }
      })

    })

  })

  describe('ignore', () => {

    describe('true', () => {

      test('function', () => {
        const result: never = serialize(() => {}, {ignoreFunction: true})
        expect(result).toBe(undefined)
      })

      test('function in object', () => {

        const obj = {
          a: 'a',
          b: () => {}
        }

        const result: {a: T.SerializedString, b: never} = serialize(obj, {ignoreFunction: true})

        expect(result).toStrictEqual({
          a: 'a'
        })

      })

      test('function in array', () => {

        const obj = [() => {}, 0]

        const result: T.SerializedNumber[] = serialize(obj, {ignoreFunction: true})

        expect(result).toStrictEqual([0])

      })

      test('function in set', () => {

        const obj = new Set([() => {}, 0])

        const result = serialize(obj, {ignoreFunction: true})

        expect(result).toStrictEqual({__type: 'Set', __value: [0]})

      })

      test('function in map', () => {

        const obj = new Map([['a', () => {}]])

        const result = serialize(obj, {ignoreFunction: true})

        expect(result).toStrictEqual({__type: 'Map', __value: []})

      })

    })

    describe('false', () => {

      const fn = () => {}

      test('function', () => {
        const result: T.SerializedFunction = serialize(fn, {ignoreFunction: false})
        expect(result).toStrictEqual({__type: 'Function', __value: fn.toString()})
      })

      test('function in object', () => {

        const obj = {
          a: 'a',
          b: fn
        }

        const result: {a: T.SerializedString, b: T.SerializedFunction} = serialize(obj, {ignoreFunction: false})

        expect(result).toStrictEqual({
          a: 'a',
          b: {__type: 'Function', __value: fn.toString()}
        })

      })

      test('function in array', () => {

        const obj = [fn, 0]

        const result: (T.SerializedNumber | T.SerializedFunction)[] = serialize(obj, {ignoreFunction: false})

        expect(result).toStrictEqual([{__type: 'Function', __value: fn.toString()}, 0])

      })

      test('function in set', () => {

        const obj = new Set([fn, 0])

        const result = serialize(obj, {ignoreFunction: false})

        expect(result).toStrictEqual({__type: 'Set', __value: [{__type: 'Function', __value: fn.toString()}, 0]})

      })

      test('function in map', () => {

        const obj = new Map([['a', () => {}]])

        const result = serialize(obj, {ignoreFunction: false})

        expect(result).toStrictEqual({__type: 'Map', __value: [['a', {__type: 'Function', __value: fn.toString()}]]})

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
          __type: 'Map', __value: [['d', [{
            e: true,
            f: {__type: 'Set', __value: ['g']}
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
