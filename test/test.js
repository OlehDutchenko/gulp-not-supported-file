'use strict';

/**
 * Testing with `gulp-mocha`
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.2.3
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const fs = require('fs');
const PluginError = require('plugin-error');
const Vinyl = require('vinyl');
const notSupportedFile = require('../index');
const should = require('should');

// ----------------------------------------
// Helpers
// ----------------------------------------

function pluginError (sample, options) {
	return new PluginError('test-plugin', sample, options);
}

const file1 = './test/fixtures/supported-file.js';
const file2 = './test/fixtures/supported-file.scss';
const file3 = './test/fixtures/empty-file.css';
const file4 = './test/fixtures/_underscore.scss';
const directory1 = './test/fixtures/';
const directory2 = './test/fixtures';

// ----------------------------------------
// Tests
// ----------------------------------------

// eslint-disable-next-line
describe('passing all sources', function () {
	// eslint-disable-next-line
	it(`should pass ${file1}`, function () {
		let file = new Vinyl({
			cwd: __dirname,
			path: file1,
			contents: fs.readFileSync(file1)
		});
		let notSupported = notSupportedFile(file, pluginError, {});

		should.equal(false, notSupported);
	});

	// eslint-disable-next-line
	it(`should pass ${file2}`, function () {
		let file = new Vinyl({
			cwd: __dirname,
			path: file2,
			contents: fs.readFileSync(file2)
		});
		let notSupported = notSupportedFile(file, pluginError, {});

		should.equal(false, notSupported);
	});

	// eslint-disable-next-line
	it(`should not pass ${file2} without content`, function () {
		let file = new Vinyl({
			cwd: __dirname,
			path: file2
		});
		let notSupported = notSupportedFile(file, pluginError, {});

		should.equal(true, Array.isArray(notSupported));

		let failedStatus = notSupported.shift();

		should.equal('isNull', failedStatus);
		should.equal('object', typeof notSupported[0]);
	});

	// eslint-disable-next-line
	it(`should not pass ${file2} without reading (isStream)`, function () {
		let file = new Vinyl({
			cwd: __dirname,
			path: file2,
			contents: fs.readFileSync(file2)
		});

		file.isStream = function () {
			return true;
		};

		let notSupported = notSupportedFile(file, pluginError, {});

		should.equal(true, Array.isArray(notSupported));

		let failedStatus = notSupported.shift();

		should.equal('isStream', failedStatus);
		should.equal('object', typeof notSupported[0]);
	});

	// eslint-disable-next-line
	it(`should warning log before and skip ${file3}`, function () {
		let file = new Vinyl({
			cwd: __dirname,
			path: file3,
			contents: fs.readFileSync(file3)
		});
		let notSupported = notSupportedFile(file, pluginError, {});

		should.equal(true, Array.isArray(notSupported));
		should.equal('isEmpty', notSupported[0]);
	});

	// eslint-disable-next-line
	it(`should pass ${file3} with turned off 'noEmpty' prop`, function () {
		let file = new Vinyl({
			cwd: __dirname,
			path: file3,
			contents: fs.readFileSync(file3)
		});
		let notSupported = notSupportedFile(file, pluginError, {
			noEmpty: false
		});

		should.equal(false, notSupported);
	});

	// eslint-disable-next-line
	it(`should warning log before and skip ${file4}`, function () {
		let file = new Vinyl({
			cwd: __dirname,
			path: file4,
			contents: fs.readFileSync(file4)
		});
		let notSupported = notSupportedFile(file, pluginError, {});

		should.equal(true, Array.isArray(notSupported));
		should.equal('isUnderscore', notSupported[0]);
	});

	// eslint-disable-next-line
	it(`should pass ${file4} with turned off 'noUnderscore' prop`, function () {
		let file = new Vinyl({
			cwd: __dirname,
			path: file4,
			contents: fs.readFileSync(file4)
		});
		let notSupported = notSupportedFile(file, pluginError, {
			noUnderscore: false
		});

		should.equal(false, notSupported);
	});

	// eslint-disable-next-line
	it(`should not pass ${directory1}`, function () {
		let file = new Vinyl({
			cwd: __dirname,
			path: directory1
		});
		let notSupported = notSupportedFile(file, pluginError, {});

		should.equal(true, Array.isArray(notSupported));

		let failedStatus = notSupported.shift();

		should.equal('isNull', failedStatus);
		should.equal('object', typeof notSupported[0]);
	});

	// eslint-disable-next-line
	it(`should not pass ${directory2}`, function () {
		let file = new Vinyl({
			cwd: __dirname,
			path: directory2
		});

		file.isDirectory = function () {
			return true;
		};

		let notSupported = notSupportedFile(file, pluginError, {});

		should.equal(true, Array.isArray(notSupported));

		let failedStatus = notSupported.shift();

		should.equal('isDirectory', failedStatus);
		should.equal('object', typeof notSupported[0]);
	});
});
