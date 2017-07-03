/**
 * 该文件由nat_detect模块提供路由功能.
 */
var express    = require('express');
var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var serviceName = basic.serviceName.nat_detect;
var router  = express.Router();
var suffix = '_test';

router.all('/', function(req, res, next) {
    console.log('access /natdetect...');

    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.body = {};

    try
    {
        if ("post" == (req.method).toLowerCase())
        {
            sendMsg.body = req.body;
        }
        else if ("get" == (req.method).toLowerCase())
        {
            sendMsg.body.Method = req.query.Method;
            sendMsg.body.Param = {ACSN: req.query.ACSN};
        }

        var module = serviceName;
        if (req.session && req.session.bUserTest == 'true') {
            module = serviceName + suffix;
        }

        mqhd.sendMsg(module, JSON.stringify(sendMsg), function(jsondata) {
            res.end(JSON.stringify(jsondata));
        });
    }
    catch (error)
    {
        console.warn("recevice data from explore: " + JSON.stringify(req.body));
        console.error("nat_detect proc except: " + error);
    }
});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;
