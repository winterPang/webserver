/**
 * Created by Administrator on 2016/1/5.
 */
var express = require('express');
var router = express.Router();
var wechatnotify = require('./wechatnotify');
var typicalconfig=require('./typicalconfig');
var portalhistoryexport=require('./portalhistoryexport');

router.use('/wechatnotify', wechatnotify);
router.use('/typicalconfig',typicalconfig);
router.use('/portalhistory',portalhistoryexport);

router.all('/*', function(req, res, next) {
    res.status(404).end("this url is not exist:"+req.url);
});

module.exports = router;