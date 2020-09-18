import {
  serialize,
  deserialize,
} from '../src'

describe('deserialize', () => {

  describe('object', () => {

    test('plain object', () => {
      const obj = {a: true, b: 1, c: 's'}
      expect(
        deserialize(
          serialize(obj)
        )
      ).toStrictEqual(obj)
    })

    test('object with undefined/null', () => {

      const obj = {a: undefined, b: null}
      expect(
        deserialize(
          serialize(obj)
        )
      ).toStrictEqual(obj)

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
