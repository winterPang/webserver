var express    = require('express');
var bodyParser = require('body-parser');

var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var serviceName = basic.serviceName.read_logmgr;
var jsonParser = bodyParser.json();
var suffix = '_test';

var router  = express.Router();

function inputInspect(jsonData)
{
    if (jsonData && jsonData.method) {
        return true;
    } else {
        return false;
    }
}

router.all("/", function(req, res, next)
{
    console.log('access /logmgr...');

    try {
        if (false == inputInspect(req.body)) {
            var respHttp = {};
            respHttp.result = "fail";
            respHttp.reason= "format of input data error";
            res.end(JSON.stringify(respHttp));

            return ;
        }

        var sendMsg = {};
        sendMsg.url = req.url;
        sendMsg.body = req.body;
        sendMsg.cookies = req.cookies;
        sendMsg.session = req.session;
        if (req.session && req.session.cas_user && req.session.cas_user.attributes && req.session.cas_user.attributes.name) {
            sendMsg.body.userName = req.session.cas_user.attributes.name;
        }
        sendMsg.body.ip = req.ip;

        var module = serviceName;
        if (req.session && req.session.bUserTest == 'true') {
            module = serviceName + suffix;
        }

        mqhd.sendMsg(module, JSON.stringify(sendMsg), function(jsondata) {
            res.end(JSON.stringify(jsondata));
        });
    }
    catch (error) {
        console.error("");
    }
});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;