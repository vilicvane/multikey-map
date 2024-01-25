[![NPM version](https://img.shields.io/npm/v/multikey-map?color=%23cb3837&style=flat-square)](https://www.npmjs.com/package/multikey-map)
[![Repository package.json version](https://img.shields.io/github/package-json/v/vilicvane/multikey-map?color=%230969da&label=repo&style=flat-square)](./package.json)
[![MIT License](https://img.shields.io/badge/license-MIT-999999?style=flat-square)](./LICENSE)
[![Discord](https://img.shields.io/badge/chat-discord-5662f6?style=flat-square)](https://discord.gg/wEVn2qcf8h)

# Multikey Map

A simple map implementation that supports multiple keys, using ES6 `Map` and `WeakMap` internally.

## Installation

```sh
yarn add multikey-map
# or
npm install multikey-map --save
```

## Usage

```ts
import MultikeyMap from 'multikey-map';

let map = new MultikeyMap<[string, number], string | undefined>();

map.set(['foo', 0], 'a');
map.set(['foo', 1], 'b');

map.get(['foo', 0]); // 'a'
map.get(['foo', 1]); // 'b'
map.get(['foo', 2]); // undefined
map.has(['foo', 2]); // false
map.hasAndGet(['foo', 2]); // [false, undefined]

map.set(['bar', 0], undefined);

map.get(['bar', 0]); // undefined
map.has(['bar', 0]); // true
map.hasAndGet(['bar', 0]); // [true, undefined]

let weakMap = new MultikeyMap<[object, object], number | undefined>(true);
```

## License

MIT License.
