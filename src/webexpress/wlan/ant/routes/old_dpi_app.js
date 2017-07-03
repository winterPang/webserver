var express    = require('express');
var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var serviceName = basic.serviceName.dpi_app;
var router  = express.Router();

router.all('/', function(req, res, next)
{
    console.log('access /dpi_app...');

    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.body = req.body;

    mqhd.sendMsg(serviceName, JSON.stringify(sendMsg), function(jsondata) {
        res.send(JSON.stringify(jsondata));
    });
});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;