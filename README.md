# gulp-not-supported-file

![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)
![license](https://img.shields.io/badge/License-MIT-blue.svg)
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
function myGulpPLugin(options) {
	// process options if need
	// ...
	
	// processing
	return through2.obj(function(file, enc, cb) {
		if (file.isNull()) {
			return cb(null, file);
		}
		
		if (file.isStream()) {
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
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
const gutil = require('gulp-util');
const through2 = require('through2');
const notSupportedFile = require('gulp-not-supported-file');

// my awesome plugin name
const pluginName = 'my-gulp-plugin';

// ---------------------------

// core plugin method
function myGulpPlugin(options) {
	// process options if need
	// ...
	
	// private method plugin error
	function pluginError (data, options) {
		return new gutil.PluginError(pluginName, data, options);
	}
	
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

module.exports = myGulpPlugin;

```

### Module also has few options

Options are passed by the third argument and must an `object`

```js
let notSupported = notSupportedFile(file, pluginError, options);
```


#### `noEmpty`

type `boolean` /
default `true`

_File with empty content will be skipped_  
_**Note!** Spaces, tabs and newlines will be treated as empty content._  
_return `['isEmpty']` on fail_


#### `noUnderscore`

type `boolean` /
default `true`

_File starting with `_` will be skipped_  
_return `['isUnderscore']` on fail_


#### `silent`

type `boolean` /
default `false`

_No console logs if set `true`_

---

## Installing

```shell
npm install --save gulp-not-supported-file
# or using yarn cli
yarn add gulp-not-supported-file
```

## Changelog

Please read [CHANGELOG.md](https://github.com/dutchenkoOleg/gulp-not-supported-file/blob/master/CHANGELOG.md)

## Tests

1. `npm test` for testing code style and run mocha tests
1. `npm run happiness-fix` for automatically fix problems 

## Contributing

Please read [CONTRIBUTING.md](https://github.com/dutchenkoOleg/gulp-not-supported-file/blob/master/CONTRIBUTING.md)
