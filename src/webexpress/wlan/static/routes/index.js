var express     = require('express');
var http        = require('http');
var querystring = require('querystring');

var data         = require('./data/data');
var bodyParser   = require('body-parser');
var digest       = require('wlanpub').digest;
var config       = require('wlanpub').config;
var jsonParser   = bodyParser.json();
var router       = express.Router();

var digestOption   = config.get('digestOption');
var messageHost    = config.get('messageHost');

//获取验证码
router.use('/sms', function(req, res, next) {
    console.log(req.headers);
    console.log(req.method);
    console.log(req.query);
    var sendData={};
    if ("post" == (req.method).toLowerCase())
    {
        console.log(req.body);
        sendData = req.body;
    }
    else if ("get" == (req.method).toLowerCase())
    {

        console.log(req.query);
        sendData = req.query;

    }
    if(!sendData){
        res.send(JSON.stringify({message:"error",errorCode:"1"}));
    }
    var tel = sendData.tel;
    //var authNum=parseInt(Math.random().toFixed(4)*10000);
    var chars = "0123456789";
    var maxPos = chars.length;
    var authNum = '';
    for (i = 0; i < 4; i++) {
        authNum += chars.charAt(Math.floor(Math.random() * maxPos));
    }

    console.log("=================="+authNum);
    var message ="验证码:"+authNum;
    console.warn(message);
    var params={
        Tel:tel,
        AuthNum:authNum
    }
    data.saveUserInfo(params,function(info,status){
            if(status==1){
                var queryStr = {
                    method:6,
                    tel:tel,
                    message:message
                }
                var qstr = querystring.stringify(queryStr);
                console.warn(qstr);
                var options = {
                    //hostname:"172.27.8.184",
                    hostname:messageHost,
                    port:"8080",
                    // path:"/myApp/firstHandler?method=3&tel="+tel+"&message="+message,
                    path:"/myApp/firstHandler?"+qstr,
                    method:"GET",
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                }

                function msgCallBack(response){
                    var body = '';
                    response.on('data', function(chunk) {
                        body += chunk;
                    });
                    response.on('end', function() {
                        console.warn(body);
                        res.send(body);
                    });
                }
                var reqMsg = http.request(options, msgCallBack);
                //reqMsg.write();
                reqMsg.end();
            }else {
                res.send(JSON.stringify({message:"error",errorCode:"1"}));
            }
        })

})

//get Telephone
router.use('/getTel', function(req, res, next) {
    console.log(req.headers);
    console.log(req.method);
    console.log(req.query);
    var sendData={};
    if ("post" == (req.method).toLowerCase())
    {
        console.log(req.body);
        sendData = req.body;
    }
    else if ("get" == (req.method).toLowerCase())
    {

        console.log(req.query);
        sendData = req.query;

    }
    
    var path = req.url.split("?")[1];

    if(path)
    {
        //console.log(user_name);
        digestOption.method = "GET";
        digestOption.path   = "/o2oportal/sso/getUserInfo?"+path;
        digest(digestOption, null, res, function(response) {
            var resData = '';
            response.on('data', function (chunk) {
                resData += chunk;
            });
            response.on('end', function () {
                console.log(resData);
                res.write(resData);
                res.end();
            });
            response.on('error', function (err) {
                console.error('http-digest-client error: ', err);
            });
        });
    }else{
        res.send(JSON.stringify({error_message:"error",error_code:"1"}));
    }

})

//验证
router.use('/conp', function(req, res, next) {
    console.log(req.headers);
    console.log(req.method);
    console.log(req.query);
    var sendData={};
    if ("post" == (req.method).toLowerCase())
    {
        console.log(req.body);
        sendData = req.body;
    }
    else if ("get" == (req.method).toLowerCase())
    {

        console.log(req.query);
        sendData = req.query;

    }
    if(!sendData){
        res.send(JSON.stringify({message:"error",errorCode:"1"}));
    }

    var tel = sendData.tel;
    var authNum=sendData.authNum;
    var user_name=sendData.user_name;
    var new_password=sendData.new_password;
    data.findUserInfo(tel,function(err,dataInfo) {
      /*  console.log(err);
        console.log(data);*/
        if (dataInfo && dataInfo.AuthNum == authNum)
        {

            data.updateUserInfo(tel,function(error,data){

                if(data){
                    digestOption.method = "POST";
                    digestOption.path   = "/o2oportal/sso/resetPwd";

                    digest(digestOption, {"user_name":user_name,"new_password":new_password}, res, function(response) {
                        var resData = '';
                        response.on('data', function (chunk) {
                            resData += chunk;
                        });
                        response.on('end', function () {
                            console.log(resData);
                            res.write(resData);
                            res.end();
                        });
                        response.on('error', function (err) {
                            console.error('http-digest-client error: ', err);
                        });
                    });
                }else{
                    res.send(JSON.stringify({error_message:"update error",error_code:"1002"}));
                }
            })
        }else{
            res.send(JSON.stringify({error_message:"identifying code error",error_code:"1001"}));
        }
    })
})

router.use('/', function(req, res, next) {
    console.log(req.headers);
    console.log(req.method);
    console.log(req.query);
    res.send(JSON.stringify({message:"error",errorCode:"1"}));
})

module.exports = router;
