'use strict';

var format = require('util').format;

exports.FIND_NS_FAILED = 'https://github.com/alibaba/ons/issues/1';
exports.CONNECT_BROKER_FAILED = 'https://github.com/alibaba/ons/issues/2';
exports.SEND_MSG_TO_BROKER_TIMEOUT = "https://github.com/alibaba/ons/issues/3";
exports.SERVICE_STATE_WRONG = 'https://github.com/alibaba/ons/issues/4';
exports.BROKER_RESPONSE_EXCEPTION = 'https://github.com/alibaba/ons/issues/5';
exports.CLIENT_CHECK_MSG_EXCEPTION = 'https://github.com/alibaba/ons/issues/6';
exports.TOPIC_ROUTE_NOT_EXIST = 'https://github.com/alibaba/ons/issues/7';
exports.errorMessage = function(msg, url) {
  return format("%s\nSee %s for further details.", msg, url);
};
