# serialify

Object serializer/deserializer for node.js written with TypeScript

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
  Buffer:            Buffer.from('abcd'),
  ArrayBuffer:       new Uint8Array([0, 1, 2, 3]).buffer,
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
  Buffer:            { __t: 'Buffer', __v: [97, 98, 99, 100] },
  ArrayBuffer:       { __t: 'ArrayBuffer', __v: [0, 1, 2, 3] },
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
'{ "String": "John", "Number": 28, "Set": { "__t": "Set", "__v": [0, 1, 2, 3] }, "Date": { __t: "Date", __v: 1600392736750 } }'
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

`parse()` to deserialize jsonString created by `stringify()`.

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
