# Jest Unhandled Rejection Reporter

[![Build Status](https://travis-ci.org/the0neWhoKnocks/jest-unhandled-rejection-reporter.svg?branch=master)](https://travis-ci.org/the0neWhoKnocks/jest-unhandled-rejection-reporter)
[![npm version](https://badge.fury.io/js/%40noxx%2Fjest-unhandled-rejection-reporter.svg?cb=1)](https://badge.fury.io/js/%40noxx%2Fjest-unhandled-rejection-reporter)

A Jest reporter that tells you where Unhandled Rejections are emanating from.

![example of reporter output](https://user-images.githubusercontent.com/344140/60380487-6319ff80-99fb-11e9-80a9-98c110905972.png)

---

## Usage

Install the module
```sh
npm i -D @noxx/jest-unhandled-rejection-reporter
```

Then wire the reporter up
1. First off, you must use the `--runInBand` (or `-i`) flag to run your tests.
When run in parallel, the reporting of test paths is inconsistent.
1. In your `jest.config.js` file you need to add these lines
```js
// You can have other `reporters`, but this one has to be included as well.
reporters: [
  '@noxx/jest-unhandled-rejection-reporter',
],
// You can call the file whatever you'd like, the important bit is that you
// have a `setupFilesAfterEnv` section and a setup file.
setupFilesAfterEnv: [
  './testSetupFile.js',
],
```
1. At the bottom of your setup file, you'll need to add this.
```js
process.on('unhandledRejection', require('@noxx/jest-unhandled-rejection-reporter').rejectionHandler);
```
