import {is} from './is'

import {fromEntries} from './util'

import type * as S from './types'

export type OmitBySerializedEntity<T, E> = T extends S.Serialized<any, any>
  ? T extends S.SerializedSet<infer V>
    ? S.Serialized<'Set', OmitBySerializedEntity<V, E>[]>
    : T extends S.SerializedMap<infer K, infer V>
      ? S.Serialized<'Map', [K, OmitBySerializedEntity<V, E>][]>
      : Exclude<T, E>
  : {[K in keyof T]: OmitBySerializedEntity<T[K], E>}

type OmitFn = {
  <T, E extends Exclude<keyof typeof is, 'Object' | 'Array'>>(obj: T, type: E): OmitBySerializedEntity<T, S.Serialized<E, any>>
}

export const omit: OmitFn = (obj: any, type: any): any => {

  if (!obj) return obj

  if ((obj as any)?.__t === 'Map') {
    const value = (obj as any)?.__v
    if (value && is.Array(value)) {
      return {
        __t: 'Map', __v: value.filter(([, v]: [string, any]) => {
          try {
            return v?.__t !== type
          } catch (e) {
            return true
          }
        }).map(([k, v]: [string, any]) => [k, omit(v, type)])
      }
    }
    return
  }

  if (is.Array(obj)) {
    return obj.filter(v => {
      try {
        return v.__t !== type
      } catch (e) {
        return true
      }
    }).map(v => omit(v, type))
  }

  if (is.Object(obj)) {
    return fromEntries(Object.entries(obj).filter(([, v]) => {
      try {
        return (v as any).__t !== type
      } catch (e) {
        return true
      }
    }).map(([k, v]) => [k, omit(v, type)]))
  }

  return obj

}
