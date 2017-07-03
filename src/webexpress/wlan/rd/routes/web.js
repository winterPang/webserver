/**
 * Created by Administrator on 2016/1/15.
 */
/**
 * Created by Administrator on 2016/1/15.
 */
var express = require('express');
var ssoUrl  = require('./renderRegist');
var router  = express.Router();


router.use('/logout', function(req, res, next) {
    var logutRedict="http://sso.h3c.com/Logoutsso.aspx?RequestUrl=http://"+req.headers.host+"/rd";
    res.redirect(logutRedict);

});
router.use('/home', function(req, res, next) {
    res.redirect('/rd/wnm/frame/home.html');

});

router.use('/', function(req, res, next) {
    var ssoAuthUrl = ssoUrl.Serialize(req.hostname+req.port);
    res.redirect(ssoAuthUrl);
});

module.exports = router;