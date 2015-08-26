'use strict';

var MixAll = require('rocketmq-common').MixAll;
var System = require('nsystem');

exports.getNameAdd = function() {
  return System.getProperty(MixAll.NAMESRV_ADDR_PROPERTY, System.getenv(MixAll.NAMESRV_ADDR_ENV));
};
