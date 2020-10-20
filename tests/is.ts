import {
  is,
  what,
} from '../src/is'

describe('is', () => {

  describe('Undefined', () => {

    test('void(0) toBe true', () => {
      expect(is.Undefined(void(0))).toBe(true)
    })

    test('null toBe false', () => {
      expect(is.Undefined(null)).toBe(false)
    })

    test('1 toBe false', () => {
      expect(is.Undefined(1)).toBe(false)
    })

    test('0 toBe false', () => {
      expect(is.Undefined(0)).toBe(false)
    })

  })

  describe('Object', () => {

    test('{} toBe true', () => {
      expect(is.Object({})).toBe(true)
    })

    test('() => null toBe false', () => {
      expect(is.Object(() => null)).toBe(false)
    })

    test('new Date() toBe false', () => {
      expect(is.Object(new Date())).toBe(false)
    })

  })

  describe('ArrayBuffer', () => {

    test('ArrayBuffer toBe true', () => {
      expect(is.ArrayBuffer(new Uint8Array([0, 1]).buffer)).toBe(true)
    })

  })

})

describe('what', () => {

  test('string', () => {
    expect(what('test')).toBe('String')
  })

})
