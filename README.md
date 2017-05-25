# gulp-not-supported-file

![work in progress](https://img.shields.io/badge/Status-WIP-red.svg)
![license](https://img.shields.io/badge/License-MIT-blue.svg)
[![changelog](https://img.shields.io/badge/CHANGELOG-md-blue.svg)](./CHANGELOG.md)

> _Not a Gulp plugin,_  
> _but for Gulp plugin developers._  
> _Check the file before process it in your Gulp plugin_

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
- `Array` if the file failed the test. Array will contain arguments for `through2` callback.

***Usage example***

```js
const gutil = require('gulp-util');
const through2 = require('through2');
const notSupportedFile = require('gulp-not-supported-file');

// for check data type
const _isArray = require('lodash.isarray');

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
		
		if (_isArray(notSupported)) {
			// name of failed test
			// - 'isDirectory' -> will be error
			// - 'isNull' -> will be error
			// - 'isStream' -> will be error
			// - 'isEmpty' -> skip file
			// - 'isUndercored' -> skip file
			let failStatus = notSupported.shift();
			
			// es6 spread
			return cb(...notSupported);
			
			// or es5 apply
			return cb.apply(null, notSupported);
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


#### `noUnderscore`

type `boolean` /
default `true`

_File starting with `_` will be skipped_


#### `silent`

type `boolean` /
default `false`

_No console logs if set `true`_

---

## Changelog

read [CHANGELOG.md](./CHANGELOG.md)

## Tests

Sorry but here no tests yet


## Contributing

You're welcome - [issues](https://github.com/dutchenkoOleg/gulp-not-supported-file/issues) and [pulls](https://github.com/dutchenkoOleg/gulp-not-supported-file/pulls)
