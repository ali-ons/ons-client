'use strict';

var System = require('nsystem');
var string = require('string-extras');
var ONSClientError = require('../authority/error/ons_client_error');
var SessionCredentials = require('../authority/session_credentials');
var NameAddrUtil = require('../util/name_addr_util');
var FAQ = require('./faq');
var PropertyKeyConst = require('ons-api').PropertyKeyConst;
var UtilAll = require('rocketmq-common').UtilAll;
var TopAddressing = require('rocketmq-common').TopAddressing;
var debug = require('debug')('ons-client:abstract');

// 内网服务器地址
var WSADDR_INTERNAL = System.getProperty(
  'com.aliyun.openservices.ons.addr.internal',
  'http://onsaddr-internal.aliyun.com:8080/rocketmq/nsaddr4client-internal'
);

// 公网服务器地址
var WSADDR_INTERNET = System.getProperty(
  'com.aliyun.openservices.ons.addr.internet',
  'http://onsaddr-internet.aliyun.com/rocketmq/nsaddr4client-internet'
);

var WSADDR_INTERNAL_TIMEOUTMILLS = Number(System.getProperty('com.aliyun.openservices.ons.addr.internal.timeoutmills', '3000'));
var WSADDR_INTERNET_TIMEOUTMILLS = Number(System.getProperty('com.aliyun.openservices.ons.addr.internet.timeoutmills', '5000'));

module.exports = ONSClientAbstract;

function ONSClientAbstract(properties) {
  this.properties = properties;
  this.sessionCredentials = new SessionCredentials();
  this.sessionCredentials.updateContent(properties);
  if (!this.sessionCredentials.accessKey) {
    throw new ONSClientError('please set access key');
  }
  if (!this.sessionCredentials.secretKey) {
    throw new ONSClientError('please set secret key');
  }
  if (!this.sessionCredentials.onsChannel) {
    throw new ONSClientError('please set ons channel');
  }

  this.nameServerAddr = NameAddrUtil.getNameAdd();
  // 用户指定了Name Server
  // 私有云模式有可能需要
  var property = this.properties.getProperty(PropertyKeyConst.NAMESRV_ADDR);
  if (property) {
    this.nameServerAddr = property;
    return;
  }

  // 优先级 1、Name Server设置优先级最高 2、其次是地址服务器
  if (!this.nameServerAddr) {
    var addr = this.fetchNameServerAddr();
    if (addr) {
      this.nameServerAddr = addr;
    }
  }
  if (!this.nameServerAddr) {
    throw new ONSClientError(FAQ.errorMessage(
      'Can not find name server, May be your network problem.', FAQ.FIND_NS_FAILED));
  }
}

var proto = ONSClientAbstract.prototype;

proto.buildIntanceName = function() {
  return UtilAll.getpid() +
    '#' + string.hashCode(this.nameServerAddr) +
    '#' + string.hashCode(this.sessionCredentials.accessKey);
};

proto.fetchNameServerAddr = function() {
  var top, nsAddrs;

  // 用户指定了地址服务器
  var property = this.properties.getProperty(PropertyKeyConst.ONSAddr);
  if (property) {
    top = new TopAddressing(property);
    return top.fetchNSAddr();
  }

  // 用户未指定，默认访问内网地址服务器
  top = new TopAddressing(WSADDR_INTERNAL);
  nsAddrs = top.fetchNSAddr(false, WSADDR_INTERNAL_TIMEOUTMILLS);
  if (nsAddrs) {
    debug('connected to internal server, %s success, %s', WSADDR_INTERNAL, nsAddrs);
    return nsAddrs;
  }

  // 用户未指定，然后访问公网地址服务器
  top = new TopAddressing(WSADDR_INTERNET);
  nsAddrs = top.fetchNSAddr(false, WSADDR_INTERNET_TIMEOUTMILLS);
  if (nsAddrs) {
    debug('connected to internet server, %s success, %s', WSADDR_INTERNET, nsAddrs);
    return nsAddrs;
  }

  return null;
};
