'use strict';

var Producer = require('./rocketmq/producer');

module.exports = ONSFactory;

function ONSFactory() {
}

var proto = ONSFactory.prototype;

proto.createProducer = function(properties) {
  return new Producer(properties);
};

proto.createConsumer = function() {};

proto.createOrderProducer = function() {};

proto.createOrderedConsumer = function() {};

proto.createTransactionProducer = function() {};
