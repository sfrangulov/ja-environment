<h1 align="center" style="border-bottom: none;">⚒️ ja-environment</h1>

<h3 align="center">Just another environment configurations manager</h3>

<p align="center">
        <a href="./LICENSE">
    <img alt="license" src="https://img.shields.io/badge/license-ISC-blue.svg" />
  </a> <a href="https://requirejs.org/docs/commonjs.html">
      <img alt="commonjs module" src="https://img.shields.io/badge/module-CommonJS-blue" />
    </a> <a href="https://www.typescriptlang.org/">
    <img alt="typescript version" src="https://img.shields.io/npm/dependency-version/ja-environment/dev/typescript.svg" />
  </a>
   <a href="https://www.npmjs.com/package/ja-environment">
    <img alt="npm version" src="https://img.shields.io/npm/v/ja-environment.svg?style=flat" />
  </a> <a href="https://www.npmjs.com/package/ja-environment">
    <img alt="npm downloads" src="https://img.shields.io/npm/dt/ja-environment.svg?style=flat" />
  </a>
    </p>

## Install
```
npm install --save ja-environment
```

or

```
yarn install ja-environment
```
  

## Import module
```js
const { JAEnvironment, JsonFileProvider } = require('ja-environment');
```
or
```js
import { JAEnvironment, JsonFileProvider } from 'ja-environment';
```
  

## Usage

Configuration files by default should be located in \_\_environment\_\_ folder with following structure:
* default.json
* development.json
* test.json
* any_other.json

All files are optional

You can automatically encrypt any key of json by add ! in key name.

Example:

example.json
``` json
{
  "default": "it is a default",
  "!secret": "secret",
  "section": {
    "!secret": "secret value"
  }
}

```
example.jsone
``` json
{
  "default": "it is a default",
  "!secret": "21912fdb6fe67c40bd71e37da66adc7a290780861d0b5a2499be846a7076e4b731323334353637383930414243444546a+ZlSuBolZ7wXGJKerZPiQ==",
  "section": {
    "!secret": "21912fdb6fe67c40bd71e37da66adc7a290780861d0b5a2499be846a7076e4b731323334353637383930414243444546a+ZlSuBolZ7wXGJKerZPiQ=="
  }
}

````
Configure environment variables:

```bash
export NODE_ENV=development
export ENV_SECRET=1234567890ABCDEF # optional for encrypotor
```

Initialization:
```js
const provider = new JsonFileProvider({});
const env = new JAEnvironment({
  provider
});
env.init();

```
Usage:
```js
console.log(env.get("section.secret")); //output is "secret value"
```
More examples you can find in tests
  

## Build
```
npm run build // for single build

npm run watch // to watch changes
```

or

```
yarn build // for single build

yarn watch // to watch changes
```
  

## Author

[Sergey Frangulov](mailto:sergey.frangulov@gmail.com)

## License
ISC License

Copyright (c) 2020 Sergey Frangulov

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  