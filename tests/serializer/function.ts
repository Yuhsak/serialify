import {
  serializer,
} from '../../src/serialize'

describe('serializer', () => {

  describe('Function', () => {

    test('function', () => {
      const f = function () {}
      expect(serializer.Function(f)).toStrictEqual({
        __type: 'Function',
        __value: f.toString(),
      })
    })

    test('arrow function', () => {
      const f = () => {}
      expect(serializer.Function(f)).toStrictEqual({
        __type: 'Function',
        __value: f.toString(),
      })
    })

    test('async function', () => {
      const f = async () => {}
      expect(serializer.Function(f)).toStrictEqual({
        __type: 'Function',
        __value: f.toString(),
      })
    })

    test('class', () => {
      const f = class A {}
      expect(serializer.Function(f)).toStrictEqual({
        __type: 'Function',
        __value: f.toString(),
      })
    })

  })

})
