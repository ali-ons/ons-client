'use strict';

var util = require('util');

module.exports = ONSClientError;

function ONSClientError(msg) {
  Error.call(this);
  Error.captureStackTrace(this, ONSClientError);
  this.message = msg;
  this.name = 'ONSClientError';
}

util.inherits(ONSClientError, Error);
