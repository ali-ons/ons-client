'use strict';

var path = require('path');
var System = require('nsystem');
var MixAll = require('rocketmq-common').MixAll;
var format = require('util').format;
var string = require('string-extras');
var ONSChannel = require('../rocketmq/ons_channel');

var CHARSET = exports.CHARSET = 'utf-8';
var AccessKey = exports.AccessKey = 'AccessKey';
var SecretKey = exports.SecretKey = 'SecretKey';
var Signature = exports.Signature = 'Signature';
var SignatureMethod = exports.SignatureMethod = 'SignatureMethod';
var ONSChannelKey = exports.ONSChannelKey = 'OnsChannel';
var KeyFile = exports.KeyFile = System.getProperty('rocketmq.client.keyFile', System.getProperty('user.home') + path.sep + 'onskey');

function SessionCredentials() {
  this.accessKey = '';
  this.secretKey = '';
  this.signature = '';
  this.signatureMethod = '';
  this.onsChannel = ONSChannel.ALIYUN;

  var keyContent = MixAll.file2String(KeyFile);
  if (keyContent) {
    var prop = MixAll.string2Properties(keyContent);
    if (prop) {
      this.updateContent(prop);
    }
  }
}

var proto = SessionCredentials.prototype;

proto.updateContent = function(prop) {
  this.accessKey = prop.getProperty(AccessKey, '').trim();
  this.secretKey = prop.getProperty(SecretKey, '').trim();
  this.onsChannel = prop.get(ONSChannelKey);
};

proto.hashCode = function() {
  var prime = 31;
  var result = 1;
  result = prime * result + (this.accessKey ? string.hashCode(this.accessKey) : 0);
  result = prime * result + (this.secretKey ? string.hashCode(this.secretKey) : 0);
  result = prime * result + (this.signature ? string.hashCode(this.signature) : 0);
  result = prime * result + (this.signatureMethod ? string.hashCode(this.signatureMethod) : 0);
  result = prime * result + (this.onsChannel ? string.hashCode(String(this.onsChannel)) : 0);
  return result;
};

proto.toString = function() {
  return format('SessionCredentials [accessKey=%s, secretKey=%s, signature=%s, signatureMethod=%s, onsChannel=%s]',
    this.accessKey,
    this.secretKey,
    this.signature,
    this.signatureMethod,
    this.onsChannel
  );
};

proto.equals = function(obj) {
  if (this === obj) {
    return true;
  }
  if (!obj) {
    return false;
  }
  if (!(obj instanceof SessionCredentials)) {
    return false;
  }

  return this.accessKey === obj.accessKey &&
    this.secretKey === obj.secretKey &&
    this.signature === obj.signature &&
    this.signatureMethod === obj.signatureMethod &&
    this.onsChannel === obj.onsChannel;
};
