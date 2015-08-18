'use strict';

module.exports = Properties;

function Properties(defaults) {
  this.properties = defaults || {};
}

var proto = Properties.prototype;

proto.get = function(key) {
  return this.properties[key];
};

proto.set = function(key, value) {
  this.properties[key] = value;
  return this;
};

proto.toString = function() {
  var properties = this.properties;
  var serial = Object.keys(properties).map(serialize).join(', ');
  return '{' + serial + '}';

  function serialize(key) {
    var value = properties[key];
    return [key, value].join('=');
  }
};
