/**
 * Created by wloc_team on 2015/12/29.
 */
var express = require('express');
var bodyParser = require('body-parser');
var config = require('wlanpub').config;

var mqhd = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;
var async = require('wlanpub').async;

var serviceName = basic.serviceName.wloc_map;
var jsonParser = bodyParser.json();
var router = express.Router();

var fs = require('fs');
var multiparty = require('multiparty');
var util = require('util');
var request = require('request');
var image = require('./image');
var basePath = './localfs/';
var corePath = './localfs/v3/';
var coreFilePath = './localfs/v3/wloc_map/';
var mapFilePath = './localfs/v3/wloc_map/';
var filesave = require('../lib/filesave');
var https = require('https');
var testSuffix = config.get('testSuffix');


request.debug = false;

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, 0777);
}



fs.exists(corePath, function (exists) {
    if (!exists) {
        fs.mkdir(corePath, 0777, function (err) {
            if (err) {
                console.warn(err);
            } else {
                console.warn('creat ' + corePath + ' done!');
                fs.mkdir(coreFilePath, 0777, function (err) {
                    if (err) {
                        console.warn(err);
                    } else {
                        console.warn('creat ' + coreFilePath + ' done!');
                    }
                });
            }
        })
    }
});

function mkdirAnduploadHDFS(srcpath, devSN, mapName, res, type) {
    var hdfsConnOptions = conf.hdfsConnOption;
    var hdfsurl = 'http://' + hdfsConnOptions.host + ':' + hdfsConnOptions.port + hdfsConnOptions.path + 'wloc_map/' + devSN + '/'
        + mapName + '/';
    var hdfsurlMkdir = hdfsurl + '?op=MKDIRS';
    var hdfsMkres = request.put(hdfsurlMkdir);
    hdfsMkres.on('error', function (response) {
        console.log(JSON.stringify(response));
        res.write("mkdirAnduploadHDFS error dir maybe is exit");
        res.statusCode = 200;
        res.end();
        return;
    });

    hdfsMkres.on('response', function (response) {
        console.log(JSON.stringify(response));
        var hdfsurlCreatfile = hdfsurl + type + '.jpeg' + '?op=CREATE&overwrite=true';
        var hdfsCreate = request.put(hdfsurlCreatfile);
        hdfsCreate.on('response', function (responsecreat) {
            var rdfs = fs.createReadStream(srcpath);
            if (307 == responsecreat.statusCode) {
                var options = {
                    url: responsecreat.headers.location,
                    method: 'PUT',
                    headers: {
                        'User-Agent': 'request',
                        'content-type': 'application/octet-stream'
                    }
                };

                var writeHdfs = request(options);
                writeHdfs.on('end', function () {
                    console.log('write over');
                    res.write("upload file success");
                    res.statusCode = 200;
                    res.end();
                    return;
                });
                writeHdfs.on('error', function (error) {
                    console.warn('write to hdfs failed! may be exist!');
                    var message = "write to hdfs is failed";
                    res.write(JSON.stringify(message));
                    res.statusCode = 200;
                    res.end();
                    return;
                });
                rdfs.pipe(writeHdfs);
            }

        });
    });
};

function imageType(req, res, type) {
    var dstpath = mapFilePath;
    var form = new multiparty.Form({ uploadDir: dstpath });
    form.parse(req, function (err, fields, files) {

        if (err) {
            var message = "upload get From is error";
            console.warn('parse error: ' + err);
            res.write(JSON.stringify(message));
            res.statusCode = 200;
            res.end();
            return;
        }
        else {
            if ((fields.imgData == undefined) || (fields.mapName == undefined) ||
                (fields.devSN == undefined)) {
                var message = "upload_shortcut fields is undefined";
                res.write(JSON.stringify(message));
                res.statusCode = 200;
                res.end();
                return;
            }
            var imgData = fields.imgData[0];
            var mapName = fields.mapName[0].split('_');
            var devSN = fields.devSN[0];
            //console.log(imgData);
            var fileName = devSN + '-' + mapName[0] + '-' + type + '.jpeg';
            var path = coreFilePath + fileName;
            var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            fs.writeFile(path, dataBuffer, function (err) {
                if (err) {
                    console.log("err: " + err);
                    var message = "upload_shortcut writeFile is faile";
                    res.write(JSON.stringify(message));
                    res.statusCode = 200;
                    res.end();
                    return;
                }
                else {
                    mkdirAnduploadHDFS(path, devSN, mapName[0], res, type);
                }
            });

        }
    });
}

function getStrLen(sTem) {
    var len = 0;
    for (var i = 0; i < sTem.length; i++) {
        if (sTem.charCodeAt(i) > 127 || sTem.charCodeAt(i) == 94) {
            len += 2;
        } else {
            len++;
        }
    }
    return len;
}

/**********************************************************************************
 * Description: 解析前端过来添加地图的表单
 *      Author: ykf5327
 *        Date: 2016/10/28
 *   Parameter: req     ：前端过来的请求
 *              type    ：地图类型
 *              portflag：用于区分是新接口还是老接口
 *              res     ：给前端的应答回调函数
 *      return: NaN
 *     Caution: NaN
 *************************************************************************************/
function saveimageToMongoose(req, res) {
    var dstpath = mapFilePath;
    console.log("saveimageToMongoose started");
    var form = new multiparty.Form({ uploadDir: dstpath, maxFieldsSize: 15 * 1024 * 1024 });
    form.parse(req, function (err, fields, files) {

        if (err) {
            var message = "upload get From is error";
            console.warn('saveimageToMongoose parse error: ' + err);
            res.write(JSON.stringify(message));
            res.statusCode = 200;
            res.end();
            return;
        }
        else {
            if ((fields.imgData == undefined) || (fields.mapName == undefined) ||
                (fields.devSN == undefined)) {
                var message = "upload_shortcut fields is undefined";
                res.write(JSON.stringify(message));
                res.statusCode = 200;
                res.end();
                return;
            }
            var imgData = fields.imgData[0];
            var mapName = fields.mapName[0];
            var devSN = fields.devSN[0];
            var base64Data = imgData;
            console.warn("saveimageToMongoose mapName : " + mapName);
            console.warn("saveimageToMongoose base64Data :" + base64Data);
            filesave.addMapImage(devSN, mapName, base64Data, function (oMessage) {
                res.write(JSON.stringify(oMessage));
                res.statusCode = 200;
                res.end();
                return;
            });
        }
    });
}

/**********************************************************************************
 * Description: 解析前端过来的POST表单，并将表单里面的地图文件和地图信息存储到数据库
 *      Author: ykf5327
 *        Date: 2016/10/28
 *   Parameter: req     ：前端过来的请求
 *              type    ：地图类型
 *              portflag：用于区分是新接口还是老接口
 *              res     ：给前端的应答回调函数
 *      return: NaN
 *     Caution: NaN
 *************************************************************************************/
function saveMapInfoAndMapFile(req, res) {
    var dstpath = mapFilePath;
    /* 解析POST Form表单 */
    console.log("saveMapInfoAndMapFile " + JSON.stringify(req));
    var form = new multiparty.Form({ uploadDir: dstpath, maxFieldsSize: 15 * 1024 * 1024 });
    form.parse(req, function (err, fields, files) {

        if (err) {
            var message = "upload get From is error";
            console.warn('parse error: ' + err);
            res.write(JSON.stringify(message));
            res.statusCode = 200;
            res.end();
            return;
        }
        else {
            if ((fields.imgData == undefined) || (fields.mapName == undefined) ||
                (fields.devSN == undefined)) {
                var message = "upload_shortcut fields is undefined";
                res.write(JSON.stringify(message));
                res.statusCode = 200;
                res.end();
                return;
            }
            var imgData = fields.imgData[0];
            var mapName = fields.mapName[0];
            var devSN = fields.devSN[0];
            filesave.addMapInfoAndMapFiletoMongoose(fields, function (oMessage) {
                /**/
                var oBackMsg = {
                    retCode: oMessage.retCode,
                    errorMessage: oMessage.info
                };
                if (oMessage.retCode == 0) {
                    /* 说明添加成功将地图信息通知给wloc_map微服务，微服务再将数据发送给设备 */
                    var oMapInfo = {
                        devSN: fields.devSN[0],
                        Method: "sendMapInfoToDev",
                        Param: {
                            devSN: fields.devSN[0],
                            mapName: fields.mapName[0],
                            apList: fields.apList[0],
                            scale: fields.scale[0]
                        }
                    }
                    sendMsg.url = req.url;
                    sendMsg.method = req.method;
                    sendMsg.headers = req.headers;
                    sendMsg.body = oMapInfo;
                    sendMsg.body.cookies = req.cookies;
                    sendMsg.body.session = req.session;
                    var serviceNameTemp = serviceName;
                    if (req.session && req.session.bUserTest == 'true') {
                        serviceNameTemp += testSuffix;
                    }
                    mqhd.sendMsg(serviceNameTemp, JSON.stringify(sendMsg), function (jsonData) {
                        /* 不关心微服务的返回值 因为微服务并不知道发送到设备成功没有 关心返回值没用*/
                        console.log("saveMapInfoAndMapFile mqhd.sendMsg " + JSON.stringify(jsonData));
                    });
                }
                console.log("saveMapInfoAndMapFile res.write " + JSON.stringify(oBackMsg));
                res.write(JSON.stringify(oBackMsg));
                res.statusCode = 200;
                res.end();
                return;
            });
        }
    });
}

/* 将页面过来的图片base64存储到数据库中 */
router.post('/backgroundnew', function (req, res) {
    saveimageToMongoose(req, res);
});

router.post('/hdfsTest',function(req,res){
    filesave.addFileTohdfs(res);
})

/* 这个路由是给从杨盟那边获取地图的路由 */
router.use('/map', function (req, res) {
    var path = req.originalUrl.split("/v3/wloc/map")[1];
    console.warn("/wloc/map");
    console.warn(req.originalUrl);
    console.warn(path);
    var options = {
        host: 'lvzhoutest.h3c.com',//lvzhouv3.h3c.com
        port: 443,
        headers: req.headers,
        path: path,
        method: 'GET'
    },
        req1 = https.request(options, function (res1) {
            res.writeHead(res1.statusCode, res1.headers);
            res1.pipe(res);
        }).on('error', function (e) {
            try { res.end('error happend :' + req.url + " " + e.message + " " + e.LineNumber); } catch (e) { };
        });
    ('POST' == req.method) && req1.write(req.reqData);
    req1.end();
});

/* 删除地图的路由 */
router.post('/delMapAndDirNew', function (req, res) {
    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.method = req.method;
    sendMsg.headers = req.headers;
    sendMsg.body = req.body;
    sendMsg.body.cookies = req.cookies;
    sendMsg.body.session = req.session;
    /*根据mapName想地图微服务获取需要删除文件的文件名字，和hdfs的url*/
    console.warn("wloc delMapAndDirNew sendMsg");
    console.warn(JSON.stringify(sendMsg.body));
    var serviceNameTemp = serviceName;
    if (req.session && req.session.bUserTest == 'true') {
        serviceNameTemp += testSuffix;
    }
    mqhd.sendMsg(serviceNameTemp, JSON.stringify(sendMsg), function (jsonData) {
        res.write(JSON.stringify(jsonData));
        res.end();
        return;
    });
});

/* 获取地图的路由 */
router.use('/image', image);

/* /v3/wloc 的默认路由 上面的都没匹配上则走这个路由*/
router.all(jsonParser, function (req, res, next) {
    console.warn('  access /wloc/*...');
    console.warn(req.url);
    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.method = req.method;
    sendMsg.headers = req.headers;
    sendMsg.body = req.body;
    sendMsg.body.cookies = req.cookies;
    sendMsg.body.session = req.session;
    console.warn('wloc all sendMsg = ');
    console.warn(JSON.stringify(sendMsg));
    var temp = req.url.split('/');
    var serName1 = temp[1];
    var serviceNameTemp = serviceName;
    if (req.session && req.session.bUserTest == 'true') {
        serviceNameTemp += testSuffix;
    }

    mqhd.sendMsg(serviceNameTemp, JSON.stringify(sendMsg), function (jsonData) {
        console.warn('  render wloc_Map msg...');
        console.warn('  wloc data: ' + JSON.stringify(jsonData));
        delete jsonData.url;
        res.write(JSON.stringify(jsonData));
        res.statusCode = 200;
        res.end();

        return;
    });
});

router.all('/*', function (req, res, next) {
    res.status(404).end();
});

module.exports = router;