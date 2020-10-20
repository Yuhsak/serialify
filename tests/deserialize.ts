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

      expect(s).toStrictEqual({a: {__t: 'Undefined', __v: 'undefined'}, b: null})
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

})
