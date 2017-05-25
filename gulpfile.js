'use strict';

/**
 * Testing with `gulp-mocha` and `chai`
 * @module
 *
 * @author Oleg Dutchenko <dutchenko.o.wezom@gmail.com>
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const should = require('should');

// ----------------------------------------
// Exports
// ----------------------------------------

gulp.task('test', function () {
	return gulp.src('test/test.js', {read: false})
		.pipe(mocha({
			reporter: 'spec',
			globals: {
				should
			}
		}));
});
