export const fromEntries = (entries: [any, any][]) => {
  return entries.reduce((acc, entry) => {
    return {...acc, [entry[0]]: entry[1]}
  }, {})
}

export const toString = (obj: any) => Object.prototype.toString.call(obj)
