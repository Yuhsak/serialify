import {getReprStr} from 'what-is-that'

export const getObjectName = (o: any): string => {
  const r = getReprStr(o)
  if (r !== 'Object') return r
  if (typeof o.constructor === 'function') return o.constructor.name || 'Unknown object (some instance of custom class or something)'
  return 'Unknown object (something with no constructor)'
}
