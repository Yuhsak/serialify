# serialify

Extended object serializer/deserializer for Node.js and browser written in TypeScript.

## Feature

- **Minimal**: input any supported object, and get serialized/deserialized.
- **Fast**: it's basically a recursive if statement.
- **Tiny**: only 1.7kb of gzipped.

## Supported data types

`serialify` can serialize many data types which is not supported by standard JSON!

| type                | standard JSON               | serialify               |
| ------------------- | --------------------------- | ----------------------- |
| `number`            | ✅                          | ✅                      |
| `boolean`           | ✅                          | ✅                      |
| `string`            | ✅                          | ✅                      |
| `null`              | ✅                          | ✅                      |
| `Array`             | ✅                          | ✅                      |
| `Object`            | ✅                          | ✅                      |
| `undefined`         | ❌                          | ✅                      |
| `bigint`            | ❌                          | ✅                      |
| `NaN`               | ❌                          | ✅                      |
| `Infinity`          | ❌                          | ✅                      |
| `Date`              | ❌                          | ✅                      |
| `RegExp`            | ❌                          | ✅                      |
| `Set`               | ❌                          | ✅                      |
| `Map`               | ❌                          | ✅                      |
| `URL`               | ❌                          | ✅                      |
| `URLSearchParams`   | ❌                          | ✅                      |
| `Buffer`            | ❌                          | ✅                      |
| `DataView`          | ❌                          | ✅                      |
| `ArrayBuffer`       | ❌                          | ✅                      |
| `SharedArrayBuffer` | ❌                          | ✅                      |
| `Int8Array`         | ❌                          | ✅                      |
| `Uint8Array`        | ❌                          | ✅                      |
| `Uint8ClampedArray` | ❌                          | ✅                      |
| `Int16Array`        | ❌                          | ✅                      |
| `Uint16Array`       | ❌                          | ✅                      |
| `Int32Array`        | ❌                          | ✅                      |
| `Uint32Array`       | ❌                          | ✅                      |
| `Float32Array`      | ❌                          | ✅                      |
| `Float64Array`      | ❌                          | ✅                      |
| `BigInt64Array`     | ❌                          | ✅                      |
| `BigUint64Array`    | ❌                          | ✅                      |

## Installation

`npm install serialify`

## Usage

### Serialize

```ts
import {serialize} from 'serialify'

serialize({
  String:            'John',
  Number:            28,
  Boolean:           true,
  Null:              null,
  Array:             [0, 1],
  Object:            {a: 0, b: 1},
  Infinity:          Infinity,
  NaN:               NaN,
  Undefined:         undefined,
  Date:              new Date(),
  Symbol:            Symbol('test'),
  RegExp:            new RegExp('^http:\/\/(.*?)(\/|$)', 'i'),
  BigInt:            BigInt('2'),
  Set:               new Set([0, 1]),
  Map:               new Map([['a', 0], ['b', 1]]),
  URL:               new URL('https://google.com'),
  URLSearchParams:   new URLSearchParams({q: 'github'}),
  Buffer:            Buffer.from('abcd'),
  DataView:          new DataView(new Uint8Array([0, 1, 2, 3]).buffer, 1, 2),
  ArrayBuffer:       new Uint8Array([0, 1, 2, 3]).buffer,
  SharedArrayBuffer: new SharedArrayBuffer(4),
  Int8Array:         new Int8Array([0, 1, 2, 3]),
  Uint8Array:        new Uint8Array([0, 1, 2, 3]),
  Uint8ClampedArray: new Uint8ClampedArray([0, 1, 2, 3]),
  Int16Array:        new Int16Array([0, 1, 2, 3]),
  Uint16Array:       new Uint16Array([0, 1, 2, 3]),
  Int32Array:        new Int32Array([0, 1, 2, 3]),
  Uint32Array:       new Uint32Array([0, 1, 2, 3]),
  Float32Array:      new Float32Array([0, 1, 2, 3]),
  Float64Array:      new Float64Array([0, 1, 2, 3,]),
  BigInt64Array:     new BigInt64Array([BigInt('1')]),
  BigUint64Array:    new BigUint64Array([BigInt('1')]),

  // Nested Objects
  NestedArray:       [new Date(), 10, {Set: new Set([0, 1])}],
  NestedObject:      {Date: new Date(), Object: {Number: 10, NaN: NaN}},
  NestedSet:         new Set([new Set([0, 1])]),
  NestedMap:         new Map([['a', 0], ['b', new Map([['c', 1]])]]),
})
```

The code above will produce the following serialized object:

```ts
{
  String:            'John',
  Number:            28,
  Boolean:           true,
  Null:              null,
  Array:             [0, 1],
  Object:            {a: 0, b: 1},
  Infinity:          { __t: 'Number', __v: 'infinity' },
  NaN:               { __t: 'Number', __v: 'nan' },
  Undefined:         { __t: 'Undefined', __v: 'undefined' },
  Date:              { __t: 'Date', __v: 1601111145054 },
  Symbol:            { __t: 'Symbol', __v: 'test' },
  RegExp:            { __t: 'RegExp', __v: {source: '^http:\\/\\/(.*?)(\\/|$)', flags: 'i'} },
  BigInt:            { __t: 'BigInt', __v: '2' },
  Set:               { __t: 'Set', __v: [0, 1] },
  Map:               { __t: 'Map', __v: [['a', 0], ['b', 1]] },
  URL:               { __t: 'URL', __v: 'https://google.com' },
  URLSearchParams:   { __t: 'URLSearchParams', __v: 'q=github' },
  Buffer:            { __t: 'Buffer', __v: [97, 98, 99, 100] },
  DataView:          { __t: 'DataView', __v: {buffer: [0, 1, 2, 3], byteOffset: 1, byteLength: 2} },
  ArrayBuffer:       { __t: 'ArrayBuffer', __v: [0, 1, 2, 3] },
  SharedArrayBuffer: { __t: 'SharedArrayBuffer', __v: [0, 0, 0, 0] },
  Int8Array:         { __t: 'Int8Array', __v: [0, 1, 2, 3] },
  Uint8Array:        { __t: 'Uint8Array', __v: [0, 1, 2, 3] },
  Uint8ClampedArray: { __t: 'Uint8ClampedArray', __v: [0, 1, 2, 3] },
  Int16Array:        { __t: 'Int16Array', __v: [0, 1, 2, 3] },
  Uint16Array:       { __t: 'Uint16Array', __v: [0, 1, 2, 3] },
  Int32Array:        { __t: 'Int32Array', __v: [0, 1, 2, 3] },
  Uint32Array:       { __t: 'Uint32Array', __v: [0, 1, 2, 3] },
  Float32Array:      { __t: 'Float32Array', __v: [0, 1, 2, 3] },
  Float64Array:      { __t: 'Float64Array', __v: [0, 1, 2, 3] },
  BigInt64Array:     { __t: 'BigInt64Array', __v: ['1'] },
  BigUint64Array:    { __t: 'BigUint64Array', __v: ['1'] },

  // Nested Objects
  NestedArray: [
    { __t: 'Date', __v: 1601111145054 },
    10,
    {
      Set: { __t: 'Set', __v: [0, 1] }
    }
  ],
  NestedObject: {
    Date: { __t: 'Date', __v: 1601111145054 },
    Object: {
      Number: 10,
      NaN: { __t: 'Number', __v: 'nan' }
    }
  },
  NestedSet: { __t: 'Set', __v: [
    { __t: 'Set', __v: [0,1] }
  ]},
  NestedMap: { __t: 'Map', __v: [
    ['a', 0],
    ['b', { __t: 'Map', __v: [['c', 1]] }]
  ]},
}
```

**typing**

For TypeScript, `serialize()` will also translate the type of the source object.

```ts
import {serialize} from 'serialify'

const obj = {name: 'John', birth: new Date()}

const s = serialize(obj)

/**
 * s: {
 *  name: string;
 *  birth: { __t: 'Date', __v: number };
 * }
 **/
```

### Stringify

To get a json string representation of serialized object directly, just import and call `stringify()`.

```ts
import {stringify} from 'serialify'

stringify({
  String: 'John',
  Number: 28,
  Set: new Set([0, 1, 2, 3]),
  Date: new Date()
})
```

The code above will produce the following string:

```ts
'{ "String": "John", "Number": 28, "Set": { "__t": "Set", "__v": [0, 1, 2, 3] }, "Date": { "__t": "Date", "__v": 1600392736750 } }'
```

### Deserialize

`deserialize()` to make serialized object back into it's origin.

```ts
import {serialize, deserialize} from 'serialify'

const obj = {
  String: 'John',
  Number: 28,
  Set: new Set([0, 1, 2, 3]),
  Date: new Date()
}

const serialized = serialize(obj)

/**
 * serialized = {
 *  String: 'John',
 *  Number: 28,
 *  Set: { __t: 'Set', __v: [0, 1, 2, 3] },
 *  Date: { __t: 'Date', __v: 1600392736750 }
 * }
 **/

deserialize(serialized)

/**
 * {
 *  String: 'John',
 *  Number: 28,
 *  Set: Set([0, 1, 2, 3]),
 *  Date: Date(1600392736750),
 * }
 **/
```

**typing**

`deserialize()` will also translate the type of the serialized object, just like `serialize()` does.

```ts
import {serialize, deserialize} from 'serialify'

const obj = {name: 'John', birth: new Date()}

const s = serialize(obj)

const d = deserialize(s)

/**
 * d: {
 *  name: string;
 *  birth: Date;
 * }
 **/
```

### Parse

`parse()` to deserialize JSON string created by `stringify()`.

```ts
import {stringify, parse} from 'serialify'

const jsonString = stringify({
  String: 'John',
  Number: 28,
  Set: new Set([0, 1, 2, 3]),
  Date: new Date()
})

parse(jsonString)

/**
 * {
 *  String: 'John',
 *  Number: 28,
 *  Set: Set([0, 1, 2, 3]),
 *  Date: Date(1600392736750),
 * }
 **/
```
