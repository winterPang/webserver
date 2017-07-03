var express = require('express');
var compress = require('./compress');
var docx = require('./makedocx');
var fs = require('fs');
//var create = require('./createJsAndCss');
//var static        = require('../../static/routes/index');
var router = express.Router();
var url = require('url');
var express    = require('express');
var bodyParser = require('body-parser');
var config     = require('wlanpub').config;
var conf         = require('../../../../config');
var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;
var transHttpRequest = require('../../../../lib/public').transHttpRequest;
var getPinCode = require('../../../../lib/public').getPinCode;
var checkPinCode = require('../../../../lib/public').checkPinCode;
var querystring = require('querystring');

//router.use('/static', static);


router.use('/login', function(req, res, next) {
  res.sendFile('/oasis/stable/web/login.html', {root : __dirname + '../../../../../localfs'});
});

router.all('/static/*', function(req, res, next) {
    req.query.locale = req.cookies.lang || "cn";

    console.warn('[static] the content of the input request:' +
        ' \n   headers: ' + JSON.stringify(req.headers) +
        ';\n   url: ' + JSON.stringify(req.url) +
        ';\n   method: ' + JSON.stringify(req.method) +
        ';\n   cookies: ' + JSON.stringify(req.cookies) +
        ';\n   session: ' + JSON.stringify(req.session) +
        ';\n   query: ' + JSON.stringify(req.query) +
        ';\n   body: ' + JSON.stringify(req.body));

    var pathname = url.parse(req.url).pathname.slice(7);
    if (pathname.indexOf('/oasis-rest-user/restapp/users/isExistPhone') == 0 ||
        '/oasis-rest-emay/restapp/user/checkPhoneCode' == pathname ||
        pathname.indexOf('/oasis-rest-user/restapp/users/isExistName') == 0 ||
        pathname.indexOf('/oasis-rest-user/restapp/users/isExistEmail') == 0 ||
        pathname.indexOf('/oasis-rest-user/restapp/users/isActiving') == 0 ||
        pathname.indexOf('/oasis-rest-user/restapp/users/resetPwdWithCheck') == 0 ||
        '/oasis-rest-user/restapp/users' == pathname ||
        pathname.indexOf('/oasis-rest-user/restapp/users/addUser/phone') == 0||
        pathname.indexOf('/oasis-rest-user/restapp/users/addUser/email') == 0||
        pathname.indexOf('/oasis-rest-user/restapp/users/resetPwdWithEmail') == 0||
        pathname.indexOf('/oasis-rest-user/restapp/users/ACBindEmail') == 0 ||
        pathname.indexOf('/oasis-rest-user/restapp/users/ACChangeEmail') == 0 ||
        pathname.indexOf('/oasis-rest-user/restapp/users/activationUser') == 0||
        pathname.indexOf('/oasis-rest-user/restapp/users/resetPwdAUrl') == 0||
        pathname.indexOf('/oasis-rest-user/restapp/o2oportal/appDownload') == 0||
        pathname.indexOf('/oasis-rest-sms/restapp/user/publicEmay') ==0 ||
        pathname.indexOf('/oasis-rest-sms/restapp/sms/getSmsAuth') == 0||
        pathname.indexOf('/oasis-rest-notification/restapp/webnotify/getWebnotify') == 0 ||
        '/oasis-rest-sms/restapp/user/getPhoneCode' == pathname ||
        pathname.indexOf('/oasis-rest-dev-version/restdev/zipVersionModel/getVersionByIdentity') == 0) {
        console.log("oasis-rest-user: "+pathname);
        transHttpRequest(req, res, pathname, false);
    } else if ('/oasis-rest-user/restapp/users/checkPEInfo'  == pathname||
        '/oasis-rest-sms/restapp/user/sendCodeByUserName' == pathname) {
        var connectSid = req.cookies['connect.sid'];
        var pinCode = '';
        if (req.query && undefined != req.query.pinCode && '' != req.query.pinCode) {
            pinCode = req.query.pinCode;
        }
        checkPinCode(pinCode, connectSid, function(jsonData) {
            console.warn('[static] check pin code [%s], the result is %s',
                pinCode, JSON.stringify(jsonData));
            if (jsonData.retCode == 0) {
                transHttpRequest(req, res, pathname, false);
            } else {
                res.write(JSON.stringify(jsonData));
                res.end();
            }
        });
    }else if('/oasis-rest-user/restapp/users/checkPinCode'  == pathname){
        var connectSid = req.cookies['connect.sid'];
        var pinCode = '';
        if (req.query && undefined != req.query.pinCode && '' != req.query.pinCode) {
            pinCode = req.query.pinCode;
        }
        checkPinCode(pinCode, connectSid, function(jsonData) {
            console.warn('[static] check pin code [%s], the result is %s',
                pinCode, JSON.stringify(jsonData));
            res.write(JSON.stringify(jsonData));
            res.end();
            
        });
    } else if (0 == pathname.indexOf('/pinserver')) {
        var path;
        if ("{}" == JSON.stringify(req.query) || null == req.query || undefined == req.query) {
            path = pathname
        } else {
            path = pathname + '?' + querystring.stringify(req.query);
        }
        getPinCode(req, path, function(jsonData) {
            res.type('application/json');
            res.write(JSON.stringify(jsonData));
            res.end();
        });
    } else if(0 == pathname.indexOf("/getCasUrl")){
    
		res.json({
			casUrl: conf.url.cas_url + "/login?service=" + conf.url.service_url + "/oasis/stable/web/frame/index.html&loginUrl=" + conf.url.login_url
		});
    }else {
        res.sendFile('/oasis/stable/web/static/error/404Error.html',{root : __dirname + '../../../../../localfs'});
    }
});


router.get('/doc/makedocx',function(req,res){
  var param =  url.parse(req.url,true);
  var DocIndex = param.query.DocIndex;
  var sendMsg = {};
  sendMsg.url     = req.url;
  sendMsg.method  = req.method;
  sendMsg.headers = req.headers;
  sendMsg.cookies = req.cookies;
  sendMsg.session = req.session;
  sendMsg.action = "getDoc";
  sendMsg.DocIndex = DocIndex;
  console.log(sendMsg);
  mqhd.sendMsg("webdoc", JSON.stringify(sendMsg), function(jsonData) {
    console.warn('  render wloc_Map msg...');
    console.log(JSON.stringify(jsonData));
    delete jsonData.url;
    if (jsonData.retCode == 0)
    {
      var httpmsg = {
        Name :jsonData.data[0].Name,
        DocIndex:jsonData.data[0].DocIndex,
        AllItems:jsonData.data[0].AllItems,
        retcode:jsonData.retCode
      };
      docx.makedocx(httpmsg, res);
    }
    else{
      res.write(JSON.stringify(jsonData));
      res.statusCode = 200;
      res.end();
      return;
    }
  });

});

router.get('/doc/getdoclist',function(req, res){
  var sendMsg = {};
  sendMsg.url     = req.url;
  sendMsg.method  = req.method;
  sendMsg.headers = req.headers;
  sendMsg.cookies = req.cookies;
  sendMsg.session = req.session;
  sendMsg.action = "getdoclist";
  console.log(sendMsg);
  mqhd.sendMsg("webdoc", JSON.stringify(sendMsg), function(jsonData) {
    console.warn('  render wloc_Map msg...');
    console.log(JSON.stringify(jsonData));
    delete jsonData.url;
    var httpmsg = {
      doclist :[],
      retcode:0
    };
    if (jsonData.retCode == 0)
    {
      httpmsg.doclist = jsonData.data;
      httpmsg.retcode = jsonData.retCode;
      res.write(JSON.stringify(httpmsg));
      res.statusCode = 200;
      res.end();
      return;
    }
    else{
      res.write(JSON.stringify(jsonData));
      res.statusCode = 200;
      res.end();
      return;
    }
  });
});

router.get('/doc/getdocapi',function(req, res){
  var param =  url.parse(req.url,true);
  var DocIndex = param.query.DocIndex;
  var sendMsg = {};
  sendMsg.url     = req.url;
  sendMsg.method  = req.method;
  sendMsg.headers = req.headers;
  sendMsg.cookies = req.cookies;
  sendMsg.session = req.session;
  sendMsg.action = "getDoc";
  sendMsg.DocIndex = DocIndex;
  console.log(sendMsg);
  mqhd.sendMsg("webdoc", JSON.stringify(sendMsg), function(jsonData) {
    delete jsonData.url;
    if (jsonData.retCode == 0)
    {
      var httpmsg = {
        Name :jsonData.data[0].Name,
        DocIndex:jsonData.data[0].DocIndex,
        AllItems:jsonData.data[0].AllItems,
        retcode:jsonData.retCode
      };
      res.write(JSON.stringify(httpmsg));
      res.statusCode = 200;
      res.end();
      return;
    }
    else{
      res.write(JSON.stringify(jsonData));
      res.statusCode = 200;
      res.end();
      return;
    }
  });
});

router.get('/doc/delete',function(req, res){
  var param =  url.parse(req.url,true);
  var DocIndex = param.query.DocIndex;
  var sendMsg = {};
  sendMsg.url     = req.url;
  sendMsg.method  = req.method;
  sendMsg.headers = req.headers;
  sendMsg.cookies = req.cookies;
  sendMsg.session = req.session;
  sendMsg.action = "delDoc";
  sendMsg.DocIndex = DocIndex;
  mqhd.sendMsg("webdoc", JSON.stringify(sendMsg), function(jsonData) {
    res.write(JSON.stringify(jsonData));
    res.statusCode = 200;
    res.end();
    return;
  });
});

router.post('/doc/addapi',function(req, res){
  var sendMsg = {};
  sendMsg.url     = req.url;
  sendMsg.method  = req.method;
  sendMsg.headers = req.headers;
  sendMsg.cookies = req.cookies;
  sendMsg.session = req.session;
  sendMsg.action = "addDoc";
  sendMsg.body = req.body;
  mqhd.sendMsg("webdoc", JSON.stringify(sendMsg), function(jsonData){
    res.write(JSON.stringify(jsonData));
    res.statusCode = 200;
    res.end();
    return;
  });
});
/* GET home page. */
router.use('/cas_session', function(req, res, next) {
  var session= req.session;
  session.cas_user.JSESSIONID = req.sessionID;
  res.json(session.cas_user);
});

/* GET home page. */
router.use('/', function(req, res, next) {
   res.clearCookie('current_menu',{path: '/oasis/web/frame'});
  if(req.url == "/"){
        var service_url =  conf.url.service_url;
        res.redirect(service_url+'/oasis/stable/web/frame/index.html');
    }else{
        res.sendFile('/oasis/stable/web/static/error/404Error.html',{root : __dirname + '../../../../../localfs'});
    }
});

module.exports = router;
