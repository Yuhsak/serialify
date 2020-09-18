import {
  fromEntries,
} from '../src/util'

describe('util', () => {

  describe('fromEntries', () => {

    test('works properly', () => {

      expect(
        fromEntries([['a', true], ['b', false]])
      ).toStrictEqual({
        a: true,
        b: false,
      })

    })

  })

})
