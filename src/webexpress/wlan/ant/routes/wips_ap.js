/**
 * 该文件由wips_ap模块提供路由功能.
 */
var express    = require('express');
var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var CONST_LOG_HEAD = "[WIPSAP]";
var serviceName = basic.serviceName.read_wips_ap;
var router  = express.Router();
var suffix = '_test';

router.all('/', function(req, res, next) {
    //console.warn(CONST_LOG_HEAD + "access /wips_ap...");
    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;

    try
    {
        sendMsg.body = {};
        sendMsg.body.Param = {};
        if ("post" == (req.method).toLowerCase())
        {
            for (var key in req.body)
            {
                sendMsg.body[key]  = req.body[key];
            }
        }
        else if ("get" == (req.method).toLowerCase())
        {
            sendMsg.body.Method = req.query.Method;
            sendMsg.body.Param = {ACSN: req.query.ACSN};
        }

        if (sendMsg.body == {} || sendMsg.body.Method == undefined) {
            sendMsg.body.Method = "GetAp";
            sendMsg.body.Param = {};
        }

        var module = serviceName;
        if (req.session && req.session.bUserTest == 'true') {
            module = serviceName + suffix;
        }

        //console.warn(CONST_LOG_HEAD + "send msg to service: %s", JSON.stringify(sendMsg));
        mqhd.sendMsg(module, JSON.stringify(sendMsg),  function(jsondata) {
            //console.warn(CONST_LOG_HEAD + "receive msg from service: %s ", JSON.stringify(jsondata.message));
            res.end(JSON.stringify(jsondata));
            });
        }
    catch (error) {
        console.warn(CONST_LOG_HEAD + "recevice data from explore: %s", JSON.stringify(req.body));
        console.error(CONST_LOG_HEAD + "wips_ap proc except: %s", error);
    }
});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;