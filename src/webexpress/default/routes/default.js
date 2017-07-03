/**
 * ���ļ��ṩĬ��·�ɹ���.
 */
var url        = require('url');
var express    = require('express');
var bodyParser = require('body-parser');
var mqhd       = require('wlanpub').mqhd;
var config     = require('wlanpub').config;

var jsonParser = bodyParser.json();
var router     = express.Router();
var testSuffix = config.get('testSuffix');

router.all('(/v3)?(/)?', function(req, res, next) {
    res.redirect('/v3/web');
});

router.all(jsonParser, function(req, res, next) {
    console.log('access default...');
    //console.log('req.url = ' + req.url);
    //console.log('req.method = ' + req.method);
    //console.log('req.headers = ' + JSON.stringify(req.headers, null, 2));
    //console.log('req.body = ' + JSON.stringify(req.body));

    var pathArray = url.parse(req.url).pathname.slice(1).split('/');
    console.log('pathArray: ' + pathArray);
    if (pathArray[0] == 'favicon.ico') {
        res.end();
        return;
    }
    if (pathArray[0] == '' || pathArray[0] == undefined ||
        pathArray[1] == '' || pathArray[1] == undefined) {
        res.status(404).end();
        return;
    }
    var module = pathArray[0];
    var sendMsg = {};
    sendMsg.url = req.url;
    if (pathArray[0] == 'v3') {
        module      = pathArray[1];
        sendMsg.url = req.url.slice(3);
    }
    else if (pathArray[0] == 'oasis') {
        module      = pathArray[1];
        sendMsg.url = req.url.slice(6);
    }
    if (req.socket && req.socket.remoteAddress) {
        sendMsg.remoteAddress = req.socket.remoteAddress;
    }
    sendMsg.method  = req.method;
    sendMsg.headers = req.headers;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.query   = req.query;
    sendMsg.body    = req.body;
    //console.log('req.session: ' + JSON.stringify(req.session, null, 2));
    if (req.session && req.session.bUserTest == 'true') {
        //console.log('default bUserTest true');
        module += testSuffix;
    }

    mqhd.sendMsg(module, JSON.stringify(sendMsg), function(jsonData) {
        //console.log('  render default msg...');
        delete jsonData.url;
        if ((url.parse(req.url).pathname === '/v3/base/userauth')&&(req.headers["user-agent"] != "oasismid")) {
            //console.log('  render base remove Transfer-Encoding...');
            res.removeHeader('Transfer-Encoding');
            // if (jsonData.body != undefined) {
            //     res.setHeader('Content-Length', JSON.stringify(jsonData.body).length);
            // }else {
            //     res.setHeader('Content-Length', JSON.stringify(jsonData).length);
            // }
        }
        if (jsonData.body != undefined) {
            res.write(JSON.stringify(jsonData.body));
        }else {
            res.write(JSON.stringify(jsonData));
        }
        res.end();
        console.log('  response data: ' + JSON.stringify(jsonData));
    });
});

module.exports = router;