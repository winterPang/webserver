/**
 * 该文件由clientprobe_client模块提供路由功能.
 */
var express    = require('express');
var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var serviceName = basic.serviceName.clientprobe_client;
var router = express.Router();

router.all('/', function(req, res, next) {
    console.log('access /clientprobe_client...');
    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.body = req.body;
    mqhd.sendMsg(serviceName, JSON.stringify(sendMsg), function(jsondata){
            console.log('  send clientprobe_client msg...'+JSON.stringify(jsondata));
            res.send({Method: sendMsg.body.Method, Message: jsondata.message});
    });

});

module.exports = router;
