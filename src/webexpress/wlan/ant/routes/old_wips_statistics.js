/**
 * 该文件由wips_ap模块提供路由功能.
 */
var express    = require('express');
var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var serviceName = basic.serviceName.wips_statistics;
var router  = express.Router();

router.all('/', function(req, res, next) {
    console.warn('access /wips_statistics...');
   
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


        mqhd.sendMsg(serviceName, JSON.stringify(sendMsg),  function(jsondata){
            res.write(JSON.stringify(jsondata));
            res.end();

        });
    }
    catch (error)
    {
        console.warn("recevice data from explore: " + JSON.stringify(req.body));
        console.error("wips_statistics proc error: " + error);
    }

});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;
