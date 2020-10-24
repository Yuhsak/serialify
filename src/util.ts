import {getReprStr} from 'what-is-that'

export const getObjectName = (o: any): string => {
  const r = getReprStr(o)
  return (r === 'Object' && typeof o.constructor === 'function' && (o.constructor.name || 'Unknown object (some instance of custom class or something)')) || r
}
