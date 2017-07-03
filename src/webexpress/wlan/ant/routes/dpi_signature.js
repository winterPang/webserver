var confpub         = require('../controller/confpub');
var config          = require('wlanpub').config;
var mqhd            = require('wlanpub').mqhd;
var basic           = require('wlanpub').basic;
var express         = require('express');
var qs              = require('querystring');
var fs              = require('fs');
var multiparty      = require('multiparty');
var request         = require('request');
var user            = require('wlanpub').user;

var isDevBind2UserForWebserver = user.isDevBind2UserForWebserver;
var serviceName = basic.serviceName.dpi_signature;
var router  = express.Router();

var basePath = './localfs/';
var signaturePath = './localfs/dpi_signature/';
var signatureDownloadPath = './localfs/dpi_signature/download/';
var signatureUploadPath = './localfs/dpi_signature/upload/';
var hdfsConnOption = config.get('hdfsConnOption');

var CONST_LOG_HEAD = "[DPISIG]";

if (!fs.existsSync(basePath)) {
	fs.mkdirSync(basePath, 0777);
}

fs.exists(signaturePath, function (exists) {
    if (!exists) {
        fs.mkdir(signaturePath, 0777, function(err) {
            if(err) {
                console.warn(CONST_LOG_HEAD + "create signaturePath: " + err);
            }
            fs.exists(signatureDownloadPath, function (exists) {
                if (!exists) {
                    fs.mkdir(signatureDownloadPath, 0777, function(err) {
                        if(err) {
                            console.warn(CONST_LOG_HEAD + "create signatureDownloadPath: " + err);
                        }
                    });
                }
            });
            fs.exists(signatureUploadPath, function (exists) {
                if (!exists) {
                    fs.mkdir(signatureUploadPath, 0777, function(err) {
                        if(err) {
                            console.warn(CONST_LOG_HEAD + "create signatureUploadPath: " + err);
                        }
                    });
                }
            });
        });
    }
});

router.post('/', function(req, res) {
    console.warn(CONST_LOG_HEAD + "access /dpi_signature ...");

    try {
        if (!req.body || !req.body.devSN) {
            console.warn(CONST_LOG_HEAD + "req data error");
            var msgHttp = {};
            msgHttp.communicateResult = "fail";
            msgHttp.reason = "req data error";
            res.end(JSON.stringify(msgHttp));
            return;
        }

        var odata = req.body;
        isDevBind2UserForWebserver(req.cookies, req.session, odata.devSN, function (err, bBinded) {
            if (!err && bBinded) {
               
                if (odata.deviceModule) {
                    confpub.procMsgFromExplore(req, res);
                }
                
                else {
                    var msgService = {};
                    msgService.body = odata;
                    msgService.url = '/dpi_signature';
                    console.warn(CONST_LOG_HEAD + "send msg to dpi_signature service: " + JSON.stringify(msgService));
                    mqhd.sendMsg(serviceName, JSON.stringify(msgService), function (jsonRecv) {
                        console.warn(CONST_LOG_HEAD + "receive msg from service: " + JSON.stringify(jsonRecv));
                        res.end(JSON.stringify(jsonRecv));
                    });
                }
            }
            else {
                var msgExplore = {};
              
                if (odata.deviceModule) {
                    msgExplore.communicateResult = "fail";
                }
                else {
                    msgExplore.result = "fail";
                }
                msgExplore.reason = "permission deny";
                res.end(JSON.stringify(msgExplore));
            }
        });

    }
    catch (error) {
        console.warn(CONST_LOG_HEAD + "receive data from explore: " + JSON.stringify(req.body));
        console.warn(CONST_LOG_HEAD + "process dpi_signature except: " + error);
    }
});


router.get('/download/*', function(req, res) {
    console.warn(CONST_LOG_HEAD + "access /dpi_signature/download...");
    try {
        var arr = req.url.split('/');
        var filename = arr[2];

        if (undefined == filename) {
            res.end();
            console.warn(CONST_LOG_HEAD + "file name is undefined");
            return;
        }

        fs.exists(signatureDownloadPath + filename, function(exists) {
            if (!exists) {
                var hdfsurl = 'http://' + hdfsConnOption.host + ':' + hdfsConnOption.port + hdfsConnOption.path + 'dpi_signature/' + filename + '?op=OPEN';
                var localStream = fs.createWriteStream(signatureDownloadPath + filename);
                var fileStream = request(hdfsurl);
                fileStream.pipe(localStream);

                localStream.on('close', function () {
                    res.download(signatureDownloadPath + filename);
                });
                localStream.on('error', function (err) {
                    res.end();
                    console.warn(CONST_LOG_HEAD + "download file from hdfs error: " + err);
                });
            }
            else {
                res.download(signatureDownloadPath + filename);
            }
        });
    }
    catch (error) {
        console.warn("process dpi_signature download file except: " + error);
    }
});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;