/**
 * 该文件由dpi_url模块提供路由功能.
 */
var express    = require('express');
var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var serviceNameUrl = basic.serviceName.read_dpi_url;
var router  = express.Router();
var suffix = '_test';

router.all('/', function(req, res, next) {
    console.log('access /dpi_url...');
    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.body = req.body;

    var module = serviceNameUrl;
    if (req.session && req.session.bUserTest == 'true') {
        module = serviceNameUrl + suffix;
    }

    mqhd.sendMsg(module, JSON.stringify(sendMsg), function(jsondata) {
        res.send(JSON.stringify(jsondata));
    });
});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;