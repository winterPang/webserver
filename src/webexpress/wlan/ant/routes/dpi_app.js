var express    = require('express');
var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var serviceName = basic.serviceName.read_dpi_app;
var router  = express.Router();
var suffix = '_test';

router.all('/', function(req, res, next)
{
    console.log('access /dpi_app...');

    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.body = req.body;

    var module = serviceName;
    if (req.session && req.session.bUserTest == 'true') {
        module = serviceName + suffix;
    }
    // function callback(data1, data2,data3){
    //     //todo 
    //     //
        
    //     res.json(data);
    // }
    // //
    mqhd.sendMsg(module, JSON.stringify(sendMsg), function(jsondata) {
        res.send(JSON.stringify(jsondata));
        //callback()
    });
    //  mqhd.sendMsg("b", JSON.stringify(sendMsg), function(jsondata) {
    //     //res.send(JSON.stringify(jsondata));
    //     //
    //     callback()
    // });
    // mqhd.sendMsg("c", JSON.stringify(sendMsg), function(jsondata) {
    //    // res.send(JSON.stringify(jsondata));
    //    callback()
    // });
});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;