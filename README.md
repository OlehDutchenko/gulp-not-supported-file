# gulp-not-supported-file

![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
[![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)](https://nodejs.org/en/docs/es6/)
[![license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/dutchenkoOleg/gulp-not-supported-file/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/dutchenkoOleg/gulp-not-supported-file.svg?branch=master)](https://travis-ci.org/dutchenkoOleg/gulp-not-supported-file)

> _Not a Gulp plugin,_  
> _but for Gulp plugin developers._  
> _Check the file before process it in your Gulp plugin_

[![js-happiness-style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)

## What is this and why it was created?

Most of Gulp plugins for compiling/rendering static files use [through2](https://www.npmjs.com/package/through2) for processing. And first step of each code is a testing file  
\- it is not null  
\- it is not stream  
\- it is not ...  
And after this checkouts we may work with file.

_Little example_

```js
const through2 = require('through2');
const PluginError = require('plugin-error');
const PLUGIN_NAME = 'my-plugin';

function myGulpPLugin(options) {
	// process options if need
	// ...
	
	// processing
	return through2.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}
		
		if (file.isStream()) {
			return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
		}
		
		if (!file.contents.length) {
			return cb(null, file);
		}
		
		// and other if and if
		// ...
		
		// and then work with it
	});
}
```

> _I'm tired of writing the same code every time._  
> _So I wrote it once and wrapped it in a tiny module._

---

## How it works

Call this module with your file and with your plugin error handler. Module will return result:

- `false` if the file is suitable for work
- `Array` if the file failed the test. Array will contain arguments. First of them is text status name of fail and next arguments for `through2` callback.

***Status list***

- `'isDirectory'` - will be error
- `'isNull'` - will be error
- `'isStream'` - will be error
- `'isEmpty'` - skip file
- `'isUnderscore'` - skip file

***Usage example***

```js
const through2 = require('through2');
const PluginError = require('plugin-error');
const PLUGIN_NAME = 'my-plugin';

const notSupportedFile = require('gulp-not-supported-file');

// ---------------------------
	
// private method plugin error
function pluginError (data, errorOptions) {
	return new PluginError(PLUGIN_NAME, data, errorOptions);
}

// core plugin method
function myGulpPlugin(options) {
	// process options if need
	// ...
	
	// processing
	return through2.obj(function (file, enc, cb) {
		let notSupported = notSupportedFile(file, pluginError);
		
		if (Array.isArray(notSupported)) {
			notSupported.shift();       // or with saving -> let failStatus = notSupported.shift();
			return cb(...notSupported); // or es5 apply -> cb.apply(null, notSupported);
		}
		
		// work with file if passed
		// ...
	});
}

module.exports = PLUGIN_NAME;

```

### Module also has few options

Options are passed by the third argument and must be an `object`

```js
let notSupported = notSupportedFile(file, pluginError, options);
```



#### `noUnderscore`

type `boolean` /
default `true`

File with empty content will be skipped and not using in stream next.  

_You will receive message in console if it happens_  
_Example of log:_

![no-empty log example](https://raw.githubusercontent.com/dutchenkoOleg/gulp-not-supported-file/master/assets/no-underscore.png)


#### `noEmpty`

type `boolean` /
default `true`

File with empty content will be skipped and not using in stream next.  
Return `['isEmpty']`  
_**Note!** Spaces, tabs and newlines will be treated as empty content._  
 
_You will receive message in console if it happens_stream next._  
_Example of log:_

![no-empty log example](https://raw.githubusercontent.com/dutchenkoOleg/gulp-not-supported-file/master/assets/no-empty.png)

#### `silent`

type `boolean` /
default `false`

No logs about `noEmpty` and `noUnderscore` files

---

## Installing

```shell
npm install --save gulp-not-supported-file
# or using yarn cli
yarn add gulp-not-supported-file
```

## Tests

1. `npm test` for testing code style and run mocha tests
1. `npm run happiness-fix` for automatically fix most of problems with code style 

## Changelog

Please read [CHANGELOG.md](https://github.com/dutchenkoOleg/gulp-not-supported-file/blob/master/CHANGELOG.md)

## Contributing

Please read [CONTRIBUTING.md](https://github.com/dutchenkoOleg/gulp-not-supported-file/blob/master/CONTRIBUTING.md)
