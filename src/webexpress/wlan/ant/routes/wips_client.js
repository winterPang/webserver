/**
 * 该文件由wips_client模块提供路由功能.
 */
var express    = require('express');
var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var serviceName = basic.serviceName.read_wips_client;
var router  = express.Router();
var suffix = '_test';

router.all('/', function(req, res, next) {
    console.warn('access /wips_client...');
    
    var sendMsg = {};
    sendMsg.url     = req.url;
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
                sendMsg.body[key]    = req.body[key];
            }
        }
        else if ("get" == (req.method).toLowerCase())
        {
            sendMsg.body.Method = req.query.Method;
            sendMsg.body.Param = {ACSN: req.query.ACSN};
        }
        else
        {
            console.warn("http request method unknown");
        }

        if(sendMsg.body == {} || sendMsg.body.Method == undefined){
            sendMsg.body.Method = "GetClient";
            sendMsg.body.Param = {};
        }
        //console.warn('sendMsg = ' + JSON.stringify(sendMsg));
        var module = serviceName;
        if (req.session && req.session.bUserTest == 'true') {
            module = serviceName + suffix;
        }

        mqhd.sendMsg(module, JSON.stringify(sendMsg),  function(jsondata){
            //console.log('  render wips_client msg...', JSON.stringify(jsondata.message));
            res.write(JSON.stringify(jsondata));
            res.end();

        });
    }
    catch (error)
    {
        console.warn("recevice data from explore: " + JSON.stringify(req.body));
        console.error("wips_client proc error: " + error);
    }

});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;
