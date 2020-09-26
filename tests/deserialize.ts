import {
  serialize,
  deserialize,
} from '../src'

describe('deserialize', () => {

  describe('object', () => {

    test('plain object', () => {

      const obj = {a: true, b: 1, c: 's'}
      const s = serialize(obj)
      const d = deserialize(s)

      expect(s).toStrictEqual({a: true, b: 1, c: 's'})
      expect(d).toStrictEqual(obj)

    })

    test('object with undefined/null', () => {

      const obj = {a: undefined, b: null}
      const s = serialize(obj)
      const d = deserialize(s)

      expect(s).toStrictEqual({a: {__type: 'Undefined', __value: 'undefined'}, b: null})
      expect(d).toStrictEqual(obj)

    })

  })

  describe('date', () => {

    test('Date object', () => {

      const date = new Date(1600000000000)
      const serialized = deserialize(serialize(date))

      expect(serialized instanceof Date).toBe(true)
      expect(serialized.getTime()).toBe(date.getTime())

    })

  })

  describe('dangerouslyDeserializeFunction', () => {

    describe('false', () => {

      test('function', () => {

        const obj = serialize(() => {})

        const r = deserialize(obj, {dangerouslyDeserializeFunction: false})

        expect(r).toBe(void(0))

      })

      test('function in object', () => {

        const obj = serialize({a: () => {}, b: 1})

        const r = deserialize(obj, {dangerouslyDeserializeFunction: false})

        expect(r).toStrictEqual({b: 1})

      })

      test('function in array', () => {

        const obj = serialize([() => {}, 0])

        const r = deserialize(obj, {dangerouslyDeserializeFunction: false})

        expect(r).toStrictEqual([0])

      })

      test('function in Set', () => {

        const obj = serialize(new Set([() => {}]))

        const r = deserialize(obj, {dangerouslyDeserializeFunction: false})

        expect(r.size).toBe(0)

      })

      test('function in Map', () => {

        const obj = serialize(new Map([['a', () => {}]]))

        const r = deserialize(obj, {dangerouslyDeserializeFunction: false})

        expect(r.size).toBe(0)

      })

    })

    describe('true', () => {

      const fn = () => {}

      test('function', () => {

        const obj = serialize(fn)

        const r = deserialize(obj, {dangerouslyDeserializeFunction: true})

        expect(r.toString()).toBe(fn.toString())

      })

      test('function in object', () => {

        const obj = serialize({a: fn, b: 1})

        const r = deserialize(obj, {dangerouslyDeserializeFunction: true})

        expect(r.a.toString()).toBe(fn.toString())

      })

      test('function in array', () => {

        const obj = serialize([fn, 0])

        const r = deserialize(obj, {dangerouslyDeserializeFunction: true})

        expect(r[0].toString()).toBe(fn.toString())

      })

      test('function in Set', () => {

        const obj = serialize(new Set([fn]))

        const r = deserialize(obj, {dangerouslyDeserializeFunction: true})

        expect([...r.values()][0].toString()).toBe(fn.toString())

      })

      test('function in Map', () => {

        const obj = serialize(new Map([['a', fn]]))

        const r = deserialize(obj, {dangerouslyDeserializeFunction: true})

        expect(r.get('a')?.toString()).toBe(fn.toString())

      })

    })

  })

})
