'use strict';

/**
 * Check the file before process it in your Gulp plugin
 * @module gulp-not-supported-file
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const chalk = require('chalk');

// ----------------------------------------
// Helpers
// ----------------------------------------

/**
 * Saved plug-in name for use in terminal logs
 * @const {string}
 * @private
 */
const pluginName = 'gulp-not-supported-file';

/**
 * Get msg with file path if exist
 * @param {File}   file
 * @param {string} msg
 * @return {string}
 * @private
 */
function withFilePath (file, msg) {
	if (file && file.path) {
		msg += `\n    ${file.path}`;
	}
	
	return msg;
}

// ----------------------------------------
// Exports
// ----------------------------------------

/**
 * Checking if file is supported for processing
 * returns `false` if supported
 * returns `Array` if not supported
 *
 * @param {File}     file
 * @param {Function} pluginError
 * @param {Object}   [options={}]
 * @param {boolean}  [options.noEmpty]
 * @param {boolean}  [options.noUnderscore]
 * @param {boolean}  [options.silent]
 * @return {boolean|Array}
 */
module.exports = function notSupportedFile (file, pluginError, options = {}) {
	let {
		noEmpty = true,
		noUnderscore = true,
		silent = false
	} = options;

	if (typeof file !== 'object' || file === null) {
		throw new Error(`${pluginName}\n'file' must be an object`);
	}

	if (typeof pluginError !== 'function') {
		throw new Error(`${pluginName}\n'pluginError' must be a function`);
	}

	if (file.isDirectory()) {
		return ['isDirectory', pluginError(
			withFilePath(file, 'Error! file is directory!')
		)];
	}

	if (file.isNull()) {
		return ['isNull', pluginError(
			withFilePath(file, 'Error! file is null!')
		)];
	}

	if (file.isStream()) {
		return ['isStream', pluginError(
			withFilePath(file, 'Error! Streams are not supported!')
		)];
	}

	if (noEmpty) {
		let fileContent = String(file.contents);

		fileContent = fileContent.replace(/\s|\t|\n|\r/g, '');
		if (!fileContent.length) {
			if (silent !== true) {
				console.log(chalk.yellow('Warning! File with empty content, skipped'));
				console.log(chalk.magenta(file.path));
			}
			return ['isEmpty'];
		}
	}

	if (noUnderscore) {
		let hasUnderscore = path.basename(file.path).indexOf('_') === 0;

		if (hasUnderscore) {
			if (silent !== true) {
				console.log(chalk.yellow('Warning! File starting with \'_\', skipped'));
				console.log(chalk.magenta(file.path));
			}
			return ['isUnderscore'];
		}
	}

	return false;
};
