/**
 * 该文件由clientprobe_client模块提供路由功能.
 */
var express    = require('express');
var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var serviceName = basic.serviceName.read_probeap;
var router = express.Router();
var suffix = '_test';

router.all('/', function(req, res, next) {
    console.log('access /probeap...');
    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.body = req.body;

    var module = serviceName;
    if (req.session && req.session.bUserTest == 'true') {
        module = serviceName + suffix;
    }

    mqhd.sendMsg(module, JSON.stringify(sendMsg), function(jsondata) {
        res.send({Method: sendMsg.body.Method, Message: jsondata.message});
    });
});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;
