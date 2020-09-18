import {
  serialize,
} from '../src/serialize'

describe('serialize', () => {

  describe('no serialization', () => {

    test('Number', () => {
      expect(serialize(1)).toBe(1)
    })

    test('String', () => {
      expect(serialize('s')).toBe('s')
    })

    test('Boolean (true)', () => {
      expect(serialize(true)).toBe(true)
    })

    test('Boolean (false)', () => {
      expect(serialize(false)).toBe(false)
    })

    test('Null', () => {
      expect(serialize(null)).toBe(null)
    })

    test('Array<number>', () => {
      expect(serialize([0,1,2,3])).toStrictEqual([0,1,2,3])
    })

    test('{a: 1, b: 2}', () => {
      expect(serialize({a: 1, b: 2})).toStrictEqual({a: 1, b: 2})
    })

  })

  describe('basics', () => {

    test('Infinity', () => {
      expect(serialize(Infinity)).toStrictEqual({__type: 'Number', __value: 'infinity'})
    })

    test('NaN', () => {
      expect(serialize(NaN)).toStrictEqual({__type: 'Number', __value: 'nan'})
    })

    test('Undefined', () => {
      expect(serialize(void(0))).toStrictEqual({__type: 'Undefined', __value: 'undefined'})
    })

    test('RegExp', () => {
      expect(serialize(/\([abc\(].*?/gi)).toStrictEqual({__type: 'RegExp', __value: {source: '\\([abc\\(].*?', flags: 'gi'}})
    })

    test('BigInt', () => {
      expect(serialize(BigInt('2'))).toStrictEqual({__type: 'BigInt', __value: '2'})
    })

    test('Symbol', () => {
      expect(serialize(Symbol('test'))).toStrictEqual({__type: 'Symbol', __value: 'test'})
    })

    test('Map', () => {
      expect(serialize(new Map([['a', 1], ['b', 2]]))).toStrictEqual({__type: 'Map', __value: [['a', 1], ['b', 2]]})
    })

    test('Set', () => {
      expect(serialize(new Set([0,1,2]))).toStrictEqual({__type: 'Set', __value: [0,1,2]})
    })

    test('Function', () => {
      const f = function () {}
      expect(serialize(f)).toStrictEqual({__type: 'Function', __value: f.toString()})
    })

    test('Buffer', () => {
      expect(serialize(Buffer.from('abc'))).toStrictEqual({__type: 'Buffer', __value: [97, 98, 99]})
    })

    test('ArrayBuffer', () => {
      expect(serialize(new Uint8Array([0,1,2,3]).buffer)).toStrictEqual({__type: 'ArrayBuffer', __value: [0, 1, 2, 3]})
    })

  })

  describe('nest', () => {

    test('array', () => {

      const arr = [
        NaN,
        Infinity,
        void(0),
        1,
        2,
        true,
        [
          void(0),
          {
            a: true,
            b: BigInt('2')
          }
        ]
      ]

      expect(serialize(arr)).toStrictEqual([
        {__type: 'Number', __value: 'nan'},
        {__type: 'Number', __value: 'infinity'},
        {__type: 'Undefined', __value: 'undefined'},
        1,
        2,
        true,
        [
          {__type: 'Undefined', __value: 'undefined'},
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
        map: new Map<any, any>([
          ['a', 0],
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

      expect(serialize(obj)).toStrictEqual({
        bool: true,
        map: {
          __type: 'Map',
          __value: [
            ['a', 0],
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

})
