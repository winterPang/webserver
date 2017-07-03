/**
 * Created by Administrator on 2016/1/15.
 */
var express    = require('express');
var path       = require('path');
var uuid       = require('uuid');
var bodyParser = require('body-parser');

var ace    = require('../../ace/routes/index');
var jag    = require('../../jag/routes/index');
var defaul = require('../../../default/routes/default');
var ssoUrl = require('./renderRegist');
//var web = require('./web');
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//连接跳转到sso登录认证页面认证成功跳转的页面（进行认证处理）
router.use('/home', function(req, res, next) {
    //sso第一次 登录成功，之后将通过cookie校验
    if(req.query.ResponseTicket){
        var result ={};
        try{
            result =ssoUrl.Deserialize(req.query.ResponseTicket);
            result.res = true;
        }catch(err){
            console.warn('web:ResponseTicket===' + err);
            result.res = false;
        }
        var SSOAuth_Cookie = uuid.v1().split("-").join("");
        res.cookie('SSOAuth_Cookie', SSOAuth_Cookie, {path:'/rd',httpOnly:true,secure:true});
        //解析userInfo
        if(result.res&&result.userInfo){
            req.session.rdUserName = result.userInfo;
            res.redirect('/rd/web/frame/index.html');
        }else{
            res.redirect('/rd/logout');
        }
    }else if(req.cookies && req.cookies.SSOAuth_Cookie && req.session && req.session.rdUserName){
        res.redirect('/rd/web/frame/index.html');
    }else{
        res.redirect('/rd');
    }
});

//连接跳转到sso登录认证页面认证成功跳转的页面（进行认证处理）
router.use('/logout', function(req, res, next) {
    res.clearCookie('SSOAuth_Cookie', {path:'/rd',httpOnly:true,secure:true});
    req.session.destroy(function ( err ) {
        if( err ) { console.error( 'rd logout error: ' + err ); }
    });
    var logutRedict="http://sso.h3c.com/Logoutsso.aspx?RequestUrl=https://"+req.headers.host+"/rd";
    res.redirect(logutRedict);

});

//连接跳转到sso登录认证页面，该中间件必须放在home路由中间件后面
router.use(function(req, res, next){
    if(req.cookies && req.cookies.SSOAuth_Cookie && req.session && req.session.rdUserName){
        if (isLegalUser(req.session.rdUserName)) {
            next();
        }else {
            res.sendFile('/rd/web/static/norights.html', {root : __dirname + '../../../../../localfs'});
        }
    }else {
        var ssoAuthUrl = ssoUrl.Serialize(req.headers.host);
        res.redirect(ssoAuthUrl);
    }
});

router.use(express.static(path.join(__dirname, '../../../../localfs/rd')));

router.use('/getRdUserName', function(req, res, next) {
    res.end(JSON.stringify({rdUserName:req.session.rdUserName}));
});

router.use('/ace', ace);
router.use('/jag', jag);

//默认模块路由last 
router.use('/', defaul);

function isLegalUser(user) {
    var userArray = ['fkf5862', 'l10018', 'pkf5911', 'x07476', 'z04434', 'w11273', 'y09014', 'f02720', 'w02212', 'j03349', 'ckf6103', 'jkf6102', 'skf6435', 'w08156', 'lkf5951', 'lkf6050', 'y04460', 'y08675', 'z00835', 'w04855', 'j09980', 'h03819', 'ykf5851', 'rkf5783', 'zkf6537', 'pkf5580', 'lkf6417', 'hkf6425', 'zkf4789', 'l09810', 'x04730', 'q04356', 'y10159', 'z07742', 'z09093', 'w08292', 'w07457', 'j11153', 'c09347', 'd09675', 'c11824', 'lkf6741', 'z09364', 'g01887', 'j09038', 'b05558', 'l05945', 'ckf6811', 'lkf7195', 'z10236', 'h09775', 'z07915', 'y09174', 'l11699'];

    for (var i = 0; i < userArray.length; i++) {
        if (user == userArray[i]) {
            return true;
        }
    }

    return false;
}

module.exports = router;