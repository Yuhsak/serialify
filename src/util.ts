import {getReprStr} from 'what-is-that'

export const getObjectName = (obj: any): string => {
  const repr = getReprStr(obj)
  return (repr === 'Object' && typeof obj.constructor === 'function' && (obj.constructor.name || 'Unknown object (some instance of custom class or something)')) || repr
}
