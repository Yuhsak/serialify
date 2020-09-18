export const fromEntries = (entries: [any, any][]) => {
  return entries.reduce((acc, entry) => {
    return {...acc, [entry[0]]: entry[1]}
  }, {})
}
