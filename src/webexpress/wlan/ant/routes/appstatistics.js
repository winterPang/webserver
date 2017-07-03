/**
 * 该文件由clientprobe_client模块提供路由功能.
 */
var express = require('express');
var mqhd    = require('wlanpub').mqhd;
var basic   = require('wlanpub').basic;
var fs      = require('fs');
//var xlsx    = require('node-xlsx');
var fileop  = require('../lib/fileop');

var serviceName = basic.serviceName.appstatistics;
var router = express.Router();

const suffix = '_test';
const CONST_LOG_HEAD = '[APPSTA]';
const CONST_FILE_LIFE_CYCLE = 60 * 60 * 1000;
const CONST_DATA_NUM_MAX = 10000;
/* 分批获取时的出错阈值 */
const CONST_ERROR_THRESHOLD = 20;
const CONST_HDFS_DIR = "appstatistics/";
const basePath = './localfs/';
const appStatisticsPath = './localfs/appStatistics/';
const downloadUrlPrefix = '../../ant/appstatistics/browserdownload/';

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, 0777);
}

fs.exists(appStatisticsPath, function (exists) {
    if (!exists) {
        fs.mkdir(appStatisticsPath, 0777, function(err) {
            if(err) {
                console.warn(CONST_LOG_HEAD + "create appStatisticsPath error: " + err);
            }
        });
    }
});

function deleteFileFromWebserver (filePath) {
    fs.unlink(filePath, function (error) {
        if (!error) {
            console.log(CONST_LOG_HEAD + "del file: " + filePath + " success");
        }
    });
}

router.all('/', function(req, res, next) {
    console.log('access /appstatistics...');
    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.body = req.body;

    var module = serviceName;
    if (req.session && req.session.bUserTest == 'true') {
        module = serviceName + suffix;
    }

    mqhd.sendMsg(module, JSON.stringify(sendMsg), function(jsonData) {
        res.end(JSON.stringify(jsonData));
    });
});

router.all('/getFileStream', function(req, res, next) {
    console.warn('access /appstatistics/getFileStream...');
    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.body = req.body;

    var module = serviceName;
    if (req.session && req.session.bUserTest == 'true') {
        module = serviceName + suffix;
    }

    mqhd.sendMsg(module, JSON.stringify(sendMsg), function(jsonData) {
        var content = jsonData.message || [];
        var len = content.length;
        if (0 == len || jsonData.retCode < 0) {
            res.end();
            return ;
        }
        console.log(CONST_LOG_HEAD + JSON.stringify(jsonData.message));

        var fileName = req.body.Param.ACSN + new Date().getTime();
        var filePath = appStatisticsPath + fileName;

        for (var i = 0; i < len; i++) {
            fs.appendFileSync(filePath, JSON.stringify(content[i]) + '\r\n');
        }

        var readStream = fs.createReadStream(filePath);

        res.setHeader('Content-Type','application/octet-stream');

        readStream.on('data', function(chunk) {
            res.write(chunk);
        });
        readStream.on('end', function() {
            res.end();
        });

        setTimeout(function () {
            deleteFileFromWebserver(filePath);
        }, CONST_FILE_LIFE_CYCLE);
    });
});

//function writeXlsx (filePath, groupName, arrData) {
//    var buffer = xlsx.build([{"name": groupName, "data": arrData}
//    ]);
//    fs.writeFileSync(filePath, buffer, 'binary');
//}

function writeCommonFile (filePath, arrData) {
    var dataLen = arrData.length;
    if (dataLen == 0) {
        return ;
    }

    for (var i = 0; i < dataLen; i++) {
        fs.appendFileSync(filePath, JSON.stringify(arrData[i]) + '\r\n');
    }
}

function procDownloadDataLess10Thousand (module, sendMsg, jsonExplore, res, fileOperate, fileName) {
    sendMsg.body.Method = "GetAppointTableData";
    mqhd.sendMsg(module, JSON.stringify(sendMsg), function(jsonData) {
        var arrData = jsonData.message || [];
        var dataLen = arrData.length;

        if (jsonData.retCode < 0 || dataLen == 0) {
            jsonExplore.retCode = -1;
            res.end(JSON.stringify(jsonExplore));
            console.warn(CONST_LOG_HEAD + "download file error: procDownloadDataLess10Thousand() GetAppointTableData() retCode is %s, the number of appoint table data is %s", jsonData.retCode, dataLen);

            return ;
        }

        var filePath = appStatisticsPath + fileName;
        writeCommonFile(filePath, arrData);

        fileOperate.putFile2HDFS(CONST_HDFS_DIR, appStatisticsPath, fileName, function (reply) {
            if ("fail" == reply) {
                jsonExplore.retCode = -1;
                res.end(JSON.stringify(jsonExplore));
                deleteFileFromWebserver(filePath);
                console.warn(CONST_LOG_HEAD + "download file error: procDownloadDataLess10Thousand() put file to hdfs fail");

                return ;
            }

            jsonExplore.message.filePath = downloadUrlPrefix + fileName;
            jsonExplore.retCode = 0;
            res.end(JSON.stringify(jsonExplore));

            setTimeout(function () {
                deleteFileFromWebserver(filePath);
                fileOperate.delFileFromHDFS(CONST_HDFS_DIR, fileName, function (reply) {
                    if ("fail" == reply) {
                        console.warn(CONST_LOG_HEAD + "delete file[%s] from hdfs fail", fileName);
                    }
                });
            }, CONST_FILE_LIFE_CYCLE);
        });
    });
}

function procDownloadDataMore10Thousand (module, dataNum, sendMsg, jsonExplore, res, fileOperate, fileName) {
    var filePath = appStatisticsPath + fileName;
    var times = Math.ceil(dataNum / CONST_DATA_NUM_MAX);
    var errTimes = 0;
    var progress = 0;

    /* 大于1万条数据一次1万条分批获取 */
    for (var i = 0; i < times; i ++) {
        sendMsg.body.Method = "GetAppointTableData";
        sendMsg.body.Param.Skip = i * CONST_DATA_NUM_MAX;
        sendMsg.body.Param.Limit = CONST_DATA_NUM_MAX;

        mqhd.sendMsg(module, JSON.stringify(sendMsg), function(jsonData) {
            progress ++;
            var arrData = jsonData.message || [];

            if (jsonData.retCode < 0) {
                errTimes ++;
            }
            else {
                writeCommonFile(filePath, arrData);
            }

            /* 分批获取结束 */
            if (progress == times) {
                /* 错误率大于20%,则清空文件内容,写入出错提示 */
                if (100 * errTimes / times > CONST_ERROR_THRESHOLD) {
                    fs.writeFileSync(filePath, "download file error");
                }

                fileOperate.putFile2HDFS(CONST_HDFS_DIR, appStatisticsPath, fileName, function (reply) {
                    if ("fail" == reply) {
                        jsonExplore.retCode = -1;
                        res.end(JSON.stringify(jsonExplore));
                        deleteFileFromWebserver(filePath);
                        console.warn(CONST_LOG_HEAD + "download file error: procDownloadDataMore10Thousand() put file to hdfs fail");

                        return ;
                    }

                    jsonExplore.message.filePath = downloadUrlPrefix + fileName;
                    jsonExplore.retCode = 0;
                    res.end(JSON.stringify(jsonExplore));

                    setTimeout(function () {
                        deleteFileFromWebserver(filePath);
                        fileOperate.delFileFromHDFS(CONST_HDFS_DIR, fileName, function (reply) {
                            if ("fail" == reply) {
                                console.warn(CONST_LOG_HEAD + "delete file[%s] from hdfs fail", fileName);
                            }
                        });
                    }, CONST_FILE_LIFE_CYCLE);
                });
            }
        });
    }
}

router.all('/downloadFile', function(req, res, next) {
    console.warn('access /appstatistics/downloadFile...');
    var sendMsg = {};
    sendMsg.url = req.url;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.body = req.body;

    var module = serviceName;
    if (req.session && req.session.bUserTest == 'true') {
        module = serviceName + suffix;
    }

    sendMsg.body.Method = "GetAppointTableDataNum";

    mqhd.sendMsg(module, JSON.stringify(sendMsg), function(jsonData) {
        var dataNum = jsonData.message;

        var jsonExplore = {};
        jsonExplore.message = {};
        jsonExplore.retCode = 0;

        if (0 == dataNum || jsonData.retCode < 0) {
            jsonExplore.retCode = -1;
            res.end(JSON.stringify(jsonExplore));
            console.warn(CONST_LOG_HEAD + "download file error: GetAppointTableDataNum() retCode is %s, the number of appoint table data is %s", jsonData.retCode, dataNum);

            return ;
        }

        var fileName = req.body.Param.ACSN + '_' + req.body.Param.TbName + '_' + new Date().getTime() + ".txt";

        var fileOperate = new fileop(req, res);

        /* 小于1万条数据不需要分批取 */
        if (CONST_DATA_NUM_MAX >= dataNum) {
            procDownloadDataLess10Thousand(module, sendMsg, jsonExplore, res, fileOperate, fileName);

            return ;
        }
        /* 大于1万条数据一次1万条分批获取 */
        procDownloadDataMore10Thousand(module, dataNum, sendMsg, jsonExplore, res, fileOperate, fileName);
    });
});

/* 浏览器下载文件 */
router.get('/browserdownload/*', function(req, res){
    var arr = req.url.split('/');
    var fileName = arr[2];
    var filePath = appStatisticsPath + fileName;

    if (fs.existsSync(filePath)) {
        res.download(filePath);
        console.warn(CONST_LOG_HEAD + "browser download file[%s] success from local", fileName);
        return ;
    }

    var fileOperate = new fileop(req, res);
    //fileOperate.existFileOnHDFS(CONST_HDFS_DIR, fileName, function (reply) {
    //    if ("true" == reply) {
    fileOperate.getFileFromHDFS(CONST_HDFS_DIR, fileName, function (reply) {
        if ("fail" == reply) {
            console.warn(CONST_LOG_HEAD + "browser download file error: get file from hdfs fail");
            return ;
        }
        console.warn(CONST_LOG_HEAD + "browser download file[%s] success from hdfs", fileName);
    });
    //}
    //else {
    //    res.download();
    //}
    //});
});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;