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
  Infinity:          Infinity,
  NaN:               NaN,
  Boolean:           true,
  Undefined:         undefined,
  Null:              null,
  Date:              new Date(),
  Function:          function () { return 'OK' },
  Symbol:            Symbol('test'),
  RegExp:            new RegExp('^http:\/\/(.*?)(\/|$)', 'i'),
  BigInt:            BigInt('2'),
  Map:               new Map([['a', 0], ['b', 1]]),
  Set:               new Set([0, 1, 2, 3]),
  Array:             [0, 1, 2, 3],
  Object:            { a: 0, b: 1 },
  NestedArray:       [new Date(), 10, {Set: new Set([0, 1])}],
  NestedObject:      {Date: new Date(), Object: {Number: 10, NaN: NaN}}
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
  BigUint64Array:    new BigUint64Array([BigInt('1')])
})
```

The code above will produce the following serialized object:

```ts
{
  String:            'John',
  Number:            28,
  Infinity:          { __type: 'Number', __value: 'infinity' },
  NaN:               { __type: 'Number', __value: 'nan' },
  Boolean:           true,
  Undefined:         { __type: 'Undefined', __value: 'undefined' },
  Null:              null,
  Date:              { __type: 'Date', __value: 1600392736750 },
  Function:          { __type: 'Function', __value: "function () { return 'OK'; }" },
  Symbol:            { __type: 'Symbol', __value: 'test' },
  RegExp:            { __type: 'RegExp', __value: { source: '^http:\\/\\/(.*?)(\\/|$)', flags: 'i' }},
  BigInt:            { __type: 'BigInt', __value: '2' },
  Map:               { __type: 'Map', __value: [ ['a', 0], ['b', 1] ] },
  Set:               { __type: 'Set', __value: [ 0, 1, 2, 3 ] },
  Array:             [ 0, 1, 2, 3 ],
  Object:            { a: 0, b: 1 },
  NestedArray:       [ { __type: 'Date', __value: 1600392736750 }, 10, { Set: {__type: 'Set', __value: [0, 1] } } ],
  NestedObject:      { Date: { __type: 'Date', __value: 1600392736750 }, Object: { Number: 10, NaN: { __type: 'Number', __value: 'nan' } } }
  Buffer:            { __type: 'Buffer', __value: [ 97, 98, 99, 100 ] },
  ArrayBuffer:       { __type: 'ArrayBuffer', __value: [ 0, 1, 2, 3 ] },
  Int8Array:         { __type: 'Int8Array', __value: [ 0, 1, 2, 3 ] },
  Uint8Array:        { __type: 'Uint8Array', __value: [ 0, 1, 2, 3 ] },
  Uint8ClampedArray: { __type: 'Uint8ClampedArray', __value: [ 0, 1, 2, 3 ] },
  Int16Array:        { __type: 'Int16Array', __value: [ 0, 1, 2, 3 ] },
  Uint16Array:       { __type: 'Uint16Array', __value: [ 0, 1, 2, 3 ] },
  Int32Array:        { __type: 'Int32Array', __value: [ 0, 1, 2, 3 ] },
  Uint32Array:       { __type: 'Uint32Array', __value: [ 0, 1, 2, 3 ] },
  Float32Array:      { __type: 'Float32Array', __value: [ 0, 1, 2, 3 ] },
  Float64Array:      { __type: 'Float64Array', __value: [ 0, 1, 2, 3 ] },
  BigInt64Array:     { __type: 'BigInt64Array', __value: [ '1' ] },
  BigUint64Array:    { __type: 'BigUint64Array', __value: [ '1' ] },
}
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
 *  Set: { __type: 'Set', __value: [0, 1, 2, 3] },
 *  Date: { __type: 'Date', __value: 1600392736750 }
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
'{ "String": "John", "Number": 28, "Set": { "__type": "Set", "__value": [0, 1, 2, 3] }, "Date": { __type: "Date", __value: 1600392736750 } }'
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

### Optional Usage

When calling `serialize()` or `stringify()`, an option can be set with value of `{ignoreFunction: boolean}`.

If ignoreFunction is set to `true`, Function value will be omitted from output serialized object. (default: `false`)

Since `Function` object could be serialized incorrectly depends on it's context, this option could be useful when you want to avoid exception at runtime.

```ts
import {serialize} from 'serialify'

const obj = {
  name: 'John',
  fn: function () {return 'OK'},
}

serialize(obj)

/**
 * {
 *  name: 'John',
 *  fn: { __type: 'Function', __value: 'function () {return \'OK\'}' }
 * }
 **/

serialize(obj, {ignoreFunction: true})

/**
 * {
 *  name: 'John'
 * }
 **/
