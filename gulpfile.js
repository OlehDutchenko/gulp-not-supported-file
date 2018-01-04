'use strict';

/**
 * @fileOverview Testing with `gulp-mocha`
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.2.0
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
