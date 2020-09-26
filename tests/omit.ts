import {omit} from '../src'

import type * as S from '../src/types'

const fn = {__type: 'Function', __value: '() => {}'} as const

describe('omit', () => {

  describe('nothing happen', () => {

    test('string', () => {
      const r: string = omit('a', 'Function')
      expect(r).toBe('a')
    })

    test('number:0', () => {
      const r: number = omit(0, 'Function')
      expect(r).toBe(0)
    })

    test('number:1', () => {
      const r: number = omit(1, 'Function')
      expect(r).toBe(1)
    })

    test('boolean', () => {
      const r: boolean = omit(true, 'Function')
      expect(r).toBe(true)
    })

    test('null', () => {
      const r = omit(null, 'Function')
      expect(r).toBe(null)
    })

    test('undefined', () => {
      const r = omit(void(0), 'Function')
      expect(r).toBe(void(0))
    })

    test('serialized function', () => {
      const r = omit(fn, 'Function')
      expect(r).toStrictEqual(fn)
    })

  })

  describe('array', () => {

    test('nothing happen', () => {
      const r: number[] = omit([1, 2, 3], 'Function')
      expect(r).toStrictEqual([1, 2, 3])
    })

    test('flat', () => {
      const r: number[] = omit([fn, fn, 1], 'Function')
      expect(r).toStrictEqual([1])
    })

    test('nest', () => {
      const r: never[][][] = omit([fn, fn, [fn, fn, [fn, fn]]], 'Function')
      expect(r).toStrictEqual([[[]]])
    })

  })

  describe('object', () => {

    test('nothing happen', () => {
      const r: {a: number, b: number} = omit({a: 1, b: 2}, 'Function')
      expect(r).toStrictEqual(r)
    })

    test('flat', () => {
      const r: {b: number} = omit({a: fn, b: 1}, 'Function')
      expect(r).toStrictEqual({b: 1})
    })

    test('nest', () => {
      const r: {a: never, b: {c: never, d: {e: never}}} = omit({a: fn, b: {c: fn, d: {e: fn}}}, 'Function')
      expect(r).toStrictEqual({b: {d: {}}})
    })

  })

  describe('set', () => {

    test('nothing happen', () => {
      const set = {__type: 'Set', __value: [{__type: 'Number', __value: 0}]} as const
      const r = omit(set, 'Function')
      expect(r).toStrictEqual(set)
    })

    test('flat', () => {
      const set = {__type: 'Set', __value: [{__type: 'Number', __value: 0}]} as const
      const setWithFn = {__type: 'Set', __value: [{__type: 'Number', __value: 0}, fn]} as const
      const r = omit(setWithFn, 'Function')
      expect(r).toStrictEqual(set)
    })

    test('nest', () => {
      const set = {__type: 'Set', __value: [{__type: 'Set', __value: [{__type: 'Set', __value: []}]}]} as const
      const setWithFn = {__type: 'Set', __value: [{__type: 'Set', __value: [{__type: 'Set', __value: [fn]}]}]} as const
      const r = omit(setWithFn, 'Function')
      expect(r).toStrictEqual(set)
    })

  })

  describe('map', () => {

    test('nothing happen', () => {
      const map = {__type: 'Map', __value: [['a', {__type: 'String', __value: 'a'}]]} as const
      const r = omit(map, 'Function')
      expect(r).toStrictEqual(map)
    })

    test('flat', () => {
      const map = {__type: 'Map', __value: []} as const
      const mapWithFn = {__type: 'Map', __value: [['a', fn]]} as const
      const r = omit(mapWithFn, 'Function')
      expect(r).toStrictEqual(map)
    })

    test('nest', () => {
      const map = {__type: 'Map', __value: [['a', {__type: 'Map', __value: []}]]} as const
      const mapWithFn: S.SerializedMap<string, S.SerializedMap<string, S.SerializedFunction>> = {__type: 'Map', __value: [['a', {__type: 'Map', __value: [['a', fn]]}]]}
      const r = omit(mapWithFn, 'Function')
      expect(r).toStrictEqual(map)
    })

  })

})
