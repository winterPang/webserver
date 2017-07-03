/**
 * Created by Administrator on 2016/1/5.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var qs = require('querystring');
var mqhd  = require('wlanpub').mqhd;
var logic = require('./logic');

router.use('/cas_session', function(req, res, next) {
    var session= req.session;
    if (req.session.arb_info == undefined){
        res.redirect('/v3/web');
    } else {
        console.warn(session[req.session.arb_info.arb_session_name]);
        res.json(session[req.session.arb_info.arb_session_name]);
    }
});

/* unbind... */
router.use('/unbind', function(req, res, next) {
    console.warn('unbind web:' + req.url);
    var session= req.session;

    if (req.session.arb_info == undefined) {
        res.redirect('/v3/web');
    } else {
        var sendMsg = {};
        sendMsg.url     = '/delaccount';
        sendMsg.body    = {
            "account": session[req.session.arb_info.arb_session_name].user,
            "openID": session.arb_info.openID
        };

        if (sendMsg.body.account !== undefined) {
            mqhd.sendMsg("wechatnotify", JSON.stringify(sendMsg), function (jsonData) {
                res.redirect('/v3/arb/wechatnotify/logout');
                if (jsonData.body.retCode === 0) {
                    console.warn('  response data: ' + JSON.stringify(jsonData));
                }
            });
        }
    }
});
//sendnotify
router.use('/sendnotify', function(req, res, next) {
    console.warn('web:' + req.url);

    var sendMsg = {};
    sendMsg.url     = '/sendnotify';
    sendMsg.body    = req.body;

    mqhd.sendMsg("wechatnotify", JSON.stringify(sendMsg), function (jsonData) {
        if (jsonData.body != undefined) {
            res.write(JSON.stringify(jsonData.body));
        }else {
            res.write(JSON.stringify(jsonData));
        }
        res.end();
        console.warn('  response data: ' + JSON.stringify(jsonData));
    });
});

/* GET wechatnotify home page. */
router.use('/', logic.isBindCloud);

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;