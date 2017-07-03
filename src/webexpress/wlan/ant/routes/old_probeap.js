/**
 * 该文件由clientprobe_client模块提供路由功能.
 */
var express    = require('express');
var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var serviceName = basic.serviceName.probeap;
var router = express.Router();

router.all('/', function(req, res, next) {
    console.log('access /probeap...');
    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.body = req.body;

    mqhd.sendMsg(serviceName, JSON.stringify(sendMsg), function(jsondata) {
        res.send({Method: sendMsg.body.Method, Message: jsondata.message});
    });
});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;
