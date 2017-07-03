/**
 * Created by hawk_team on 2016/1/26.
 */
var express    = require('express');
var bodyParser = require('body-parser');
var config     = require('wlanpub').config;
var mqhd       = require('wlanpub').mqhd;
var basic      = require('wlanpub').basic;
var dbhd       = require('wlanpub').dbhd;
var hdfshd     = require('wlanpub').hdfsoper;
var getHdfsOption = hdfshd.getHdfsOption;
var conf       = require('../../../../config');
var fs         = require('fs');
var path       = require('path');
var multiparty = require('multiparty');
var request    = require('request');
var fdfs = require('fdfs');
var redisClient = dbhd.redisClient;
var serviceName = basic.serviceName.fsserver;
var jsonParser = bodyParser.json();
var router  = express.Router();
var testSuffix      = config.get('testSuffix');
var service_url  = conf.url.service_url;
var basePath = './localfs/';
var fsPath = './localfs/fs/';
var browserDownload = "../../fs/browserdownload/";
var hdfsConnOption = getHdfsOption('hdfsConnOption');
var HDFSPATH = 'http://' + hdfsConnOption.host + ':' + hdfsConnOption.port + hdfsConnOption.path + 'fs/';
var DOWNLOADURL = service_url + "/v3/fs/download/";
var UPLOADURL = service_url + "/v3/fs/upload/";
var PROGRESS_KEY = "progress:";
var DOWNLOADDELAYTIME = 2 * 3600 * 1000;
var REDISEXPIRETIME = 120;
var FILEMODE = 0777;
var ERRCODE_SUCCESS = 0,
    ERRCODE_NOTENOUGHSPACE = 1,
    ERRCODE_DOWNLOADING = 5,
    ERRCODE_FILEEXIST = 6;
request.debug = false;
var fastdfsTrackerServer  = process.env.LVZHOUV3_CONFIG_FASTDFS_TRACKER_SERVER || config.get('fastdfsTrackerServer');
var trackerServerInfoSet = fastdfsTrackerServer.split(':');
var trackerServerHost = trackerServerInfoSet[0], trackerServerPort = trackerServerInfoSet[1];
var fdfsClient =  new fdfs({
    // tracker servers
    trackers: [
        {
            host: trackerServerHost,
            port: trackerServerPort
        }
    ],
    // 默认超时时间10s
    timeout: 10000,
    // 默认后缀
    // 当获取不到文件后缀时使用
    defaultExt: 'txt',
    // charset默认utf8
    charset: 'utf8'
});

if (!fs.existsSync(basePath)){
    fs.mkdirSync(basePath, FILEMODE);
}

fs.exists(fsPath, function (exists) {
    if (!exists) {
        fs.mkdir(fsPath, FILEMODE, function(err){
            if(err){
                console.error("[fsserver]"+err);
            }else{
                console.log('[fsserver] create ' + fsPath +  ' done!');
            }
        })
    }
});
/*将文件从web server里面删除*/
function deleteFileFromWebserver(srcpath){
    fs.unlink(srcpath,function(error){
        if (!error) {
            console.log("[fsserver]del file: " + srcpath + " success");
        }
    });
}
/* 向redis中存储进度信息 */
function saveProgressToRedis(progressKey, progData){
    redisClient.set(progressKey, JSON.stringify(progData), function(err){
        if (!err) {
            // 设置数据在redis数据库中的失效时间
            redisClient.expire(progressKey, REDISEXPIRETIME);
        }else {
            console.error('[fsserver]set uploadFile progress to redis failed with error: ' + err);
        }
    });
}
/* 从redis中删除进度信息 */
function deleteProgressFromRedis(devSN){
    var progressKey = PROGRESS_KEY + devSN;
    redisClient.del(progressKey, function(err, reply) {
        if (!err) {
            console.log('del progressKey from redis success. key/value = (%s)/%s', progressKey, reply);
        }else {
            console.warn('del progressKey from redis with error: ' + err);
        }
    });
}
/* 将文件从hdfs里面删除 */
function deleteFileFromHDFS(hdfsUrl) {
    var hdfsDeleteUrl = hdfsUrl + "?op=DELETE&recursive=false";
    var hdfsDel = request.del(hdfsDeleteUrl);
    hdfsDel.on('error', function () {
        console.error("[fsserver] del file from hdfs failed:"+hdfsUrl);
    });
}
/* 上传文件到HDFS上 */
function uploadToHDFS(srcpath, orgFilename, fileSize, devSN, req, res, bIsBrowser) {
    var hdfsPath = HDFSPATH + devSN + "/";
    var hdfsUrl = hdfsPath + orgFilename;
    /* 在HDFS上创建以devSN为名字的目录 */
    var hdfsDir = request.put(hdfsPath + "?op=MKDIRS");
    hdfsDir.on('response', function(response){
        if (200 == response.statusCode){
            var hdfs = request.put(hdfsUrl + '?op=CREATE&overwrite=true');
            hdfs.on('response', function(response) {
                var rdfs = fs.createReadStream(srcpath);
                if (307 == response.statusCode) {
                    var options = {
                        url: response.headers.location,
                        method: 'PUT',
                        headers: {
                            'User-Agent': 'request',
                            'content-type': 'application/octet-stream'
                        }
                    };
                    var writeHdfs = request(options);
                    writeHdfs.on('end',function() {
                        console.warn("[fsserver] write "+orgFilename+" over");
                        deleteFileFromWebserver(srcpath);
                        /*浏览器端上传文件到设备*/
                        if (bIsBrowser) {
                            var body = {
                                Method: "uploadFileToDev",
                                fileName: orgFilename,
                                fileSize: fileSize,
                                url: DOWNLOADURL + devSN + "/" + orgFilename,
                                devSN: devSN
                            };
                            var sendMsg = {};
                            sendMsg.body = body;
                            sendMsg.cookies = req.cookies;
                            sendMsg.session = req.session;
                            if (req.session && req.session.bUserTest == 'true') {
                                //console.log('default bUserTest true');
                               // serviceName += testSuffix;
                            }
                            console.warn('[fsserver] sendMsg.body = ' + JSON.stringify(sendMsg.body));
                            mqhd.sendMsg(serviceName, JSON.stringify(sendMsg), function (jsonData) {
                                console.warn('[fsserver] jsonData:\r\n' + JSON.stringify(jsonData));
                                delete  jsonData.url;
                                /* 从redis中删除 */
                                deleteProgressFromRedis(devSN);
                                res.write(JSON.stringify(jsonData));
                                res.end();
                            });
                        }
                        else {
                            var progData = {broProgress: 0, broRate: 0, devProgress: 100, devRate: 0, retCode: 0};
                            var time = new Date();
                            progData.time = time.valueOf();
                            progData.flag = true;
                            var progressKey = PROGRESS_KEY + devSN;
                            saveProgressToRedis(progressKey, progData);
                            res.statusCode = 200;
                            res.end();
                        }
                    });
                    writeHdfs.on('error',function(err){
                        var respHttp={};
                        respHttp.message = " write " + orgFilename + " to hdfs is failed";
                        respHttp.retCode = 1;
                        res.write(JSON.stringify(respHttp));
                        res.end();
                        console.warn("[fsserver]"+err);
                        console.warn("[fsserver]"+respHttp.message);
                        deleteFileFromWebserver(srcpath);
                    });
                    rdfs.pipe(writeHdfs);
                    rdfs.on('end',function(){
                    });
                    rdfs.on('readable',function(){
                    });
                    rdfs.on('data',function(chunk){
                    });
                    rdfs.on('close',function(){
                    });
                    rdfs.on('error',function(error){
                        console.error("[fsserver]"+error);
                        res.end();
                    });
                    console.log("[fsserver]rdfs:\r\n"+JSON.stringify(rdfs));
                }
            });
        }
    });
    hdfsDir.on('error',function(err){
        var message = "HDFS makedir failed!";
        console.warn("[fsserver]"+message);
        console.warn("[fsserver]"+err);
        res.write(JSON.stringify(message));
        res.end();
    });
}
/**
 * 上传文件到FDFS
 * @param srcPathArray 本地文件路径数组
 * @param fileIdArray 已上传成功的文件的id数组
 * @param index 当前要上传的本地文件路径在 srcPathArray 中的下标
 * @param isRollback 出现错误时，是否删除已上传的文件
 * @param res 请求的响应内容
 */
function uploadToFDFS(srcPathArray, fileIdArray, index, isRollback, res) {
    var srcPath = srcPathArray[index];
    console.log("[fsserver] uploadToFDFS: src path is："+srcPath);
    try{
        fdfsClient.upload(srcPath).then(function(fileId){
            fileIdArray.push(fileId);
            console.log("[fsserver] uploadToFDFS: file id is："+fileId);
            // 已将最后一个文件上传成功，构造返回结果
            if(index == srcPathArray.length-1){
                var filePathArray = [];
                var fastdfsTrackerDomain  = process.env.LVZHOUV3_CONFIG_FASTDFS_SERVER_DOMAIN || config.get('fastdfsTrackerDomain');
                for (var i = 0; i < fileIdArray.length; i++){
                    filePathArray.push('http://'+fastdfsTrackerDomain+'/'+fileIdArray[i]);
                }
                var result = buildNormalResult({filePath:filePathArray});
                res.write(JSON.stringify(result));
                res.statusCode = 200;
                res.end();
            }else{
                // 继续上传下一个文件
                var next = index+1;
                uploadToFDFS(srcPathArray, fileIdArray, next, isRollback, res);
            }
        }).error(function(error){
            console.error("[fsserver] uploadToFDFS: failed to upload file " +srcPath+ " for reason: " + error);
            if (isRollback && isRollback == true){
                var resultIdArray = [];
                deleteFromFDFS(fileIdArray, resultIdArray, 0);
            }
            var result = buildErrResult(error);
            res.write(JSON.stringify(result));
            res.end();
        });
    }catch(error){
        console.error("[fsserver] uploadToFDFS: failed to upload file " +srcPath+ " for reason: " + error);
        if (isRollback && isRollback == true){
            var resultIdArray = [];
            deleteFromFDFS(fileIdArray, resultIdArray, 0);
        }
        var result = buildErrResult(error);
        res.write(JSON.stringify(result));
        res.end();
    }
}
/**
 * 从FastDFS上删除文件
 * @param fileIdArray 待删除的文件id数组
 * @param resultPathArray 删除成功的文件id数组
 * @param index 当前要删除的文件id在fileIdArray中的下标
 */
function deleteFromFDFS(fileIdArray, resultIdArray, index) {
    var fileId = fileIdArray[index];
    console.log("[fsserver] deleteFromFDFS: file id is： "+fileId);
    try{
        fdfsClient.del(fileId).then(function(){
            console.log("[fsserver] deleteFromFDFS: succeeded to delete: "+fileId);
            resultIdArray.push(fileId);
            if(index < fileIdArray.length-1){
                // 继续删除下一个文件
                var next = index+1;
                deleteFromFDFS(fileIdArray, resultIdArray, next);
            }
        }).error(function(error){
            console.error("[fsserver] deleteFromFDFS: failed to delete " + fileId +" for reason: " + error);
            // 即使删除报错，也应继续删除下一个文件，以尽可能使所有无用文件都被删除
            var next = index+1;
            deleteFromFDFS(fileIdArray, resultIdArray, next);
        });
    }catch(error){
        console.error("[fsserver] deleteFromFDFS: failed to delete " + fileId +" for reason: " + error);
        // 即使删除报错，也应继续删除下一个文件，以尽可能使所有无用文件都被删除
        var next = index+1;
        deleteFromFDFS(fileIdArray, resultIdArray, next);
    }
}
function buildNormalResult(data) {
    return {
        code:0,
        errMsg:{},
        data:data
    };
}
function buildErrResult(err) {
    return {
        code:1,
        errMsg:err,
        data:{}
    };
}
/* 靠近浏览器端的webserver从HDFS上下载文件  fs专用支持大文件下载*/
function fsBrowserDownFromHDFS(fileName, devSN){
    var destPath = fsPath + devSN + '/';
    var hdfsUrl = HDFSPATH  + devSN + "/" + fileName;
    var hdfs = request(hdfsUrl + '?op=OPEN');
    var fsWrite = fs.createWriteStream(destPath + fileName);
    var progressKey = PROGRESS_KEY + devSN ;
    var progData = {broProgress: 0, broRate: 0, devProgress: 100, devRate: 0, retCode: 0};
    var time = new Date();

    hdfs.pipe(fsWrite);
    progData.time = time.valueOf();
    progData.flag = true;

    /* 文件成功下载到webserver */
    fsWrite.on('close', function () {
        deleteFileFromHDFS(hdfsUrl);
        /*定时将文件从Webserver上删除*/
        setTimeout(function(){
            deleteFileFromWebserver(destPath + fileName);
        },DOWNLOADDELAYTIME);
        /* 将路径返回给浏览器 */
        progData.localFlag = "complete";
        saveProgressToRedis(progressKey, progData);
        console.warn('[fsserver]download file to webserver nearby browser: ' + fileName);
    });
    fsWrite.on('error', function () {
        var message = "webserver downloadFile "+fileName+" Failed";
        progData.localFlag = "error";
        saveProgressToRedis(progressKey, progData);
        console.warn('[fsserver]' + message);
    });
}
/* 靠近浏览器端的webserver从HDFS上下载文件 */
function browserDownFromHDFS(fileName, devSN, jsonData, res){
    var destPath = fsPath + devSN + '/';
    var hdfsUrl = HDFSPATH  + devSN + "/" + fileName;
    var hdfs = request(hdfsUrl + '?op=OPEN');
    var fsWrite = fs.createWriteStream(destPath + fileName);
    hdfs.pipe(fsWrite);
    /* 文件成功下载到webserver */
    fsWrite.on('close', function () {
        deleteProgressFromRedis(devSN);
        deleteFileFromHDFS(hdfsUrl);
        /*定时将文件从Webserver上删除*/
        setTimeout(function(){
            deleteFileFromWebserver(destPath + fileName);
        },DOWNLOADDELAYTIME);
        /* 将路径返回给浏览器 */
        jsonData.fileName = browserDownload + devSN + '/' + fileName;
        res.write(JSON.stringify(jsonData));
        res.end();
        console.warn('[fsserver]download file to webserver nearby browser: ' + JSON.stringify(jsonData));
    });
    fsWrite.on('error', function () {
        var message = "webserver downloadFile "+fileName+" Failed";
        jsonData.retCode = 1;
        res.write(JSON.stringify(jsonData));
        res.end();
        console.warn('[fsserver]' + message);
    });
}

/*浏览器端的webserver下载前判断是否创建文件夹 fs专用*/
function fsBrowserDownLoadMkdir(fileName, devSN){
    var destPath = fsPath + devSN + '/';
    fs.exists(destPath, function (exists) {
        if (!exists) {
            fs.mkdir(destPath, FILEMODE, function (err) {
                if (err) {
                    console.error("[fsserver]" + err);
                } else {
                    console.warn('[fsserver]create ' + destPath + ' done!');
                    fsBrowserDownFromHDFS(fileName, devSN);
                }
            })
        }
        else {
            fsBrowserDownFromHDFS(fileName, devSN);
        }
    });
}
/*浏览器端的webserver下载前判断是否创建文件夹*/
function browserDownLoadMkdir(fileName, devSN, jsonData, res){
    var destPath = fsPath + devSN + '/';
    fs.exists(destPath, function (exists) {
        if (!exists) {
            fs.mkdir(destPath, FILEMODE, function (err) {
                if (err) {
                    console.error("[fsserver]" + err);
                } else {
                    console.warn('[fsserver]create ' + destPath + ' done!');
                    browserDownFromHDFS(fileName, devSN, jsonData, res);
                }
            })
        }
        else {
            browserDownFromHDFS(fileName, devSN, jsonData, res);
        }
    });
}
function fsDevDownFromHDFS(fileName, devSN, offset, res) {
    var hdfsUrl = HDFSPATH  + devSN + "/" + fileName;
    var hdfsState = request(hdfsUrl + '?op=GETFILESTATUS',
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.warn("[fsserver]get file success.");
                var fileSize = body.length;
                var hdfs = request(hdfsUrl + '?op=OPEN&offset='+ offset);
                if(offset == 0) {
                    res.setHeader('Accept-Range', 'bytes');
                }
                else {
                    res.setHeader('Content-Range', 'bytes ' + offset + '-' + (fileSize - 1) + '/' + fileSize);
                    res.writeHead(206, 'Partial Content', {
                        'Content-Type' : 'application/octet-stream',
                    });
                }
                hdfs.pipe(res);
                hdfs.on('end',function(){
                    console.error("[fsserver]device download "+fileName+"done.");
                    res.end();
                });
                hdfs.on('error',function(error){
                    console.error("[fsserver]"+error);
                    res.end();
                });
            }
        });

    hdfsState.on('error',function(error){
        console.error("[fsserver]get file state "+error);
        res.end();
    });
}
/* 靠近设备端的webserver从HDFS上下载文件 */
function devDownFromHDFS(fileName, destPath, devSN, res) {
    var hdfsUrl = HDFSPATH  + devSN + "/" + fileName;
    var hdfs = request(hdfsUrl + '?op=OPEN');
    var fsWrite = fs.createWriteStream(destPath + fileName);

    hdfs.pipe(fsWrite);
    fsWrite.on('close', function () {
        /*定时删除hdfs的文件和与设备直连的webserver上的文件*/
        setTimeout(function () {
            deleteFileFromHDFS(hdfsUrl);
            deleteFileFromWebserver(destPath + fileName);
        }, DOWNLOADDELAYTIME);
        res.download(destPath + fileName);
        console.warn("[fsserver]download " + fileName + " to webserver nearby device");
    });
    fsWrite.on('error', function (err) {
        res.end();
        console.warn("[fsserver]download " + fileName + " from hdfs error: " + err);
    });
}
/* 文件上传进度存数据库 */
function uploadProgress(bytesReceived, bytesExpected, isBrowser, devSN, percent, firstTime){
    var progress = Math.floor(bytesReceived / bytesExpected * 100);
    var progressKey = PROGRESS_KEY + devSN;
    redisClient.get(progressKey, function(err, reply){
        if (!err) {
            var time = new Date();
            var tempTime;
            var progData = {
                broProgress : 0,
                broRate : 0,
                devProgress : 0,
                devRate : 0,
                retCode : 0
            };
            var downloadSize = 0;
            var lastDate = JSON.parse(reply);
            if (reply != null){
                var lastTime = lastDate.time;
                var lastDownloadsize = lastDate.bytesReceived || 0;
                tempTime = (time - lastTime) / 1000;
                downloadSize = bytesReceived - lastDownloadsize;
            }
            else{
                tempTime = (time - firstTime) / 1000;
                downloadSize = bytesReceived;
            }

            var rate = 0;
            if (downloadSize > 0)
            {
                rate = Math.floor((downloadSize / 1024) / tempTime);
            }

            if (isBrowser){
                progData.broRate = rate;
                progData.broProgress = progress;
            }
            else{
                progData.devRate = rate;
                progData.devProgress = progress;
            }
            progData.time = time.valueOf();
            progData.bytesReceived = bytesReceived;
            saveProgressToRedis(progressKey, progData);
        }
    });
    return progress;
}

function sendMsg2Devlog(req, res) {
    var data4Devlog = {};
    var module = basic.serviceName.devlogserver;
    data4Devlog.msgType = 123;
    data4Devlog.fileName = path.basename(req.body.fileName);
    data4Devlog.devSN = req.body.devSN;
    if (req.session && req.session.bUserTest == 'true') {
        module += '_test';
    }
    console.warn('module = ' + module);
    mqhd.sendMsg(module, JSON.stringify(data4Devlog), function(Data) {
        console.warn("Recv data from devlogserver!");
        res.write(JSON.stringify(Data));
        res.end();
    });
}
/* 同步日志文件 */
router.post('/syncLogfile', function(req, res) {
    res.setTimeout(6000000);
    console.warn('[fsserver] access fs/syncLogfile');
    var devSN = req.body.devSN;
    var module = basic.serviceName.fsserver;
    var sendMsg = {};
    sendMsg.body = req.body;
    sendMsg.body.url = UPLOADURL + devSN + '/';
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    console.warn('[fsserver] sendMsg.body = ' + JSON.stringify(sendMsg.body));
    if (req.session && req.session.bUserTest == 'true') {
        module += '_test';
        console.warn('module = ' + module);
    }
    mqhd.sendMsg(module, JSON.stringify(sendMsg), function (jsonData) {
        console.warn('[fsserver] render syncLogfile msg...');
        delete jsonData.url;
        /* 返回成功则发送消息到devlogserver处理 */
        if (jsonData.retCode == 0) {
            sendMsg2Devlog(req, res);
        }
        /* 返回失败，告知前台 */
        else {
            res.write(JSON.stringify(jsonData));
            res.end();
        }
    });
});
/* 同步日志文件 */
router.post('/exportLogfile', function(req, res) {
    console.warn('[fsserver] access fs/exportLogfile');
    var devSN = req.body.devSN;
    var module = basic.serviceName.devlogserver;
    var sendMsg = {};
    sendMsg.devSN = devSN;
    sendMsg.msgType = 456;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.oFilter = req.body.oFilter;
    sendMsg.oSorter = req.body.oSorter;
    console.warn('[fsserver] sendMsg = ' + JSON.stringify(sendMsg));
    if (req.session && req.session.bUserTest == 'true') {
        module += '_test';
        console.warn('module = ' + module);
    }
    mqhd.sendMsg(module, JSON.stringify(sendMsg), function(jsonData) {
        console.warn('[fsserver] render exportLogfile msg...');
        delete jsonData.url;
        /* 返回成功则开始下载 */
        if (jsonData.retCode == 0) {
            var filename = jsonData.filename;
            browserDownLoadMkdir(filename, devSN, jsonData, res);
        }
        /* 返回失败，告知前台 */
        else {
            res.write(JSON.stringify(jsonData));
            res.end();
        }
    });
});

/* 导出clientList列表 */
router.post('/exportClientsList', function(req, res){
    try{
        console.warn('[fsserver] access fs/exportClientsList');
        var devSN = req.body.devSN;
        var sendMsg = {};
        sendMsg.devSN = devSN;
        sendMsg.msgType = 789;
        sendMsg.cookies = req.cookies;
        sendMsg.session = req.session;
        console.warn('[fsserver] sendMsg = ' + JSON.stringify(sendMsg));
        mqhd.sendMsg(basic.serviceName.stamgr, JSON.stringify(sendMsg), function(jsonData) {
            console.warn('[fsserver] render exportClientsList msg...');
            delete jsonData.url;
            /* 返回成功则开始下载 */
            if (jsonData.retCode == 0) {
                var filename = jsonData.filename;
                browserDownLoadMkdir(filename, devSN, jsonData, res);
            }
            /* 返回失败，告知前台 */
            else {
                res.write(JSON.stringify(jsonData));
                res.end();
            }
        });
    }
    catch(err)
    {
        console.error("process fs/exportClientsList failed with err");
        console.error(err);
    }

});

/**********************************************************************************
 * Description: 根据过滤条件导出clientList列表
 *      Author: ykf7248
 *        Date: 2016/9/12
 *   Parameter: /exportClientListbyCondition  导出接口url
 *    Callback: res, 返回结果
 *      Return:N/A
 *     Caution:
 *************************************************************************************/
router.post('/exportClientsListbyCondition', function(req, res){
    try{
        console.warn('[fsserver] access fs/exportClientsListbyCondition');
        var devSN = req.body.devSN;
        var sendMsg = {data:{}};
        sendMsg.data.devSN = devSN;
        sendMsg.data.auth = req.body.auth;
        sendMsg.data.branch = req.body.branch;
        sendMsg.msgType = 111000;
        sendMsg.data.cookies = req.cookies;
        sendMsg.data.session = req.session;
        console.warn('[fsserver] sendMsg = ' + JSON.stringify(sendMsg));
        mqhd.sendMsg(basic.serviceName.stamonitor, JSON.stringify(sendMsg), function(jsonData) {
            console.warn('[fsserver] render exportClientsListbyCondition msg...');
            delete jsonData.url;
            /* 返回成功则开始下载 */
            if (jsonData.retCode == 0) {
                var filename = jsonData.filename;
                browserDownLoadMkdir(filename, devSN, jsonData, res);
            }
            /* 返回失败，告知前台 */
            else {
                res.write(JSON.stringify(jsonData));
                res.end();
            }
        });
    }
    catch(err)
    {
        console.error("process fs/exportClientsListbyCondition failed with err");
        console.error(err);
    }
});

/* 导出apList列表 */
router.post('/exportApsList', function(req, res){
    try{
        console.warn('[fsserver] access fs/exportApsList');
        var devSN = req.body.devSN;
        var sendMsg = {};
        sendMsg.devSN = devSN;
        if (req.body.branch != undefined) {
            var branchName = req.body.branch;
            sendMsg.branchName = branchName;
        }
        sendMsg.msgType = 789;
        sendMsg.cookies = req.cookies;
        sendMsg.session = req.session;
        console.warn('[fsserver] sendMsg = ' + JSON.stringify(sendMsg));
        mqhd.sendMsg(basic.serviceName.apmonitor, JSON.stringify(sendMsg), function(jsonData) {
            console.warn('[fsserver] render exportApsList msg...');
            delete jsonData.url;
            /* 返回成功则开始下载 */
            if (jsonData.retCode == 0) {
                var filename = jsonData.filename;
                browserDownLoadMkdir(filename, devSN, jsonData, res);
            }
            /* 返回失败，告知前台 */
            else {
                res.write(JSON.stringify(jsonData));
                res.end();
            }
        });
    }
    catch(err)
    {
        console.error("process fs/exportApsList failed with err");
        console.error(err);
    }

});

/* 导出本地AC列表 */
router.post('/exportLocalACsList', function(req, res){
    try{
        console.warn('[fsserver] access fs/exportLocalACsList');
        var devSN = req.body.devSN;
        var sendMsg = {};
        sendMsg.devSN = devSN;
        sendMsg.msgType = 678;
        sendMsg.cookies = req.cookies;
        sendMsg.session = req.session;
        console.warn('[fsserver] sendMsg = ' + JSON.stringify(sendMsg));
        mqhd.sendMsg(basic.serviceName.apmonitor, JSON.stringify(sendMsg), function(jsonData) {
            console.warn('[fsserver] render exportLocalACsList msg...');
            delete jsonData.url;
            /* 返回成功则开始下载 */
            if (jsonData.retCode == 0) {
                var filename = jsonData.filename;
                browserDownLoadMkdir(filename, devSN, jsonData, res);
            }
            /* 返回失败，告知前台 */
            else {
                res.write(JSON.stringify(jsonData));
                res.end();
            }
        });
    }
    catch(err)
    {
        console.error("process fs/exportLocalACsList failed with err");
        console.error(err);
    }

});

/**********************************************************************************
 * Description: 根据过滤条件导出studentList列表
 *      Author: gkf7248
 *        Date: 20167/4/28
 *   Parameter: /exportStudnetList 导出接口url
 *    Callback: res, 返回结果
 *      Return:N/A
 *     Caution:
 *************************************************************************************/
router.post('/exportStudentList', function(req, res){
    try{
        console.warn('[fsserver] access fs/exportStudentList');
        var oParam = req.body;
        var scenarioId = oParam.scenarioId;
        var sendMsg = {msgData:{}};
        sendMsg.msgData.scenarioId = scenarioId;
        sendMsg.msgData.schoolId = oParam.schoolId;

        if (oParam.years != undefined && (oParam.baseGrade != undefined)) {
            sendMsg.msgData.years = oParam.years;
            sendMsg.msgData.baseGrade = oParam.baseGrade;
            if(oParam.classId != undefined){
                sendMsg.msgData.classId = oParam.classId;
            }
        }
        
        if(oParam.exportType != undefined){
            sendMsg.subMsgType = oParam.exportType;
        }

        sendMsg.msgType = "/exportStudentList";
        sendMsg.msgData.cookies = req.cookies;
        sendMsg.msgData.session = req.session;
        console.warn('[fsserver] sendMsg = ' + JSON.stringify(sendMsg));
        mqhd.sendMsg(basic.serviceName.iotedu_primary_read, JSON.stringify(sendMsg), function(jsonData) {
            console.warn('[fsserver] render exportStudentList msg...');
            delete jsonData.url;
            /* 返回成功则开始下载 */
            if (jsonData.retCode == 0) {
                var filename = jsonData.filename;
                browserDownLoadMkdir(filename, scenarioId, jsonData, res);
            }
            /* 返回失败，告知前台 */
            else {
                res.write(JSON.stringify(jsonData));
                res.end();
            }
        });
    } catch(err) {
        console.error("process fs/exportStudentList failed with err");
        console.error(err);
    }
});

/* 浏览器下载文件 */
router.get('/browserdownload/*', function(req, res){
    var arr = req.url.split('/');
    var filePath = fsPath + arr[2] + '/' + arr[3];
    res.download(filePath);
});

/*浏览器下载APPOSITION模板*/
router.get("/downloadappositiontemplate",function(req,res){
    res.download("./localfs/fs/files/ap_position_template.xlsm");
    console.warn('=====apposition download success!');
})

/*浏览器下载CLOUDAPGROUP模板*/
router.get("/downloadcloudapgrouptemplate",function(req,res){
    res.download("./localfs/fs/files/ap_cloudgroup_template.xlsm");
    console.warn('=====cloudapgroup download success!');
})

router.get("/downloadmanualaplisttemplate",function(req,res){
    res.download("./localfs/fs/files/manual_import_apList_template.xlsx");
    console.warn('=====downloadmanualaplisttemplate download success!');
})

router.get("/downloadstudentstemplate",function(req,res){
    res.download("./localfs/fs/files/import_students_template.xlsx");
    console.warn('=====downloadstudentstemplate download success!');
})

router.get("/downloadlocalizertemplate",function(req, res){
    res.download("./localfs/fs/files/import_localizer_template.xlsx");
    console.warn('=====downloadlocalizertemplate download success!');
})

/* 浏览器端文件上传之前的检查 */
router.post('/checkLoadFile', function(req, res){
    console.warn('[fsserver] access fs/checkLoadFile');
    var devSN = req.body.devSN;
    var fileName = req.body.fileName;
    var fileSize = req.body.fileSize;
    var time = new Date();
    var respHttp = {};
    var progressKey = PROGRESS_KEY + devSN;
    redisClient.get(progressKey, function (err, reply) {
        if (!err) {
            /* 其他人正在上传或是可能上次残留*/
            if ((reply != null) && (time - JSON.parse(reply).time < REDISEXPIRETIME * 1000)) {
                console.warn("[fsserver]other browser is uploading or downloading");
                respHttp.retCode = ERRCODE_DOWNLOADING;
                res.write(JSON.stringify(respHttp));
                res.end();
            }
            else{
                /*删除webserver意外挂掉后progress的残留*/
                if (reply != null){
                    deleteProgressFromRedis(devSN);
                }
                var sendMsg = {};
                sendMsg.body = {};
                sendMsg.body.devSN = devSN;
                sendMsg.body.Method = 'getDevFileStatus';
                sendMsg.cookies = req.cookies;
                sendMsg.session = req.session;
                console.warn('[fsserver] sendMsg.body = ' + JSON.stringify(sendMsg.body));
                mqhd.sendMsg(serviceName, JSON.stringify(sendMsg), function (jsonData) {
                    console.warn('[fsserver] render checkLoadFile msg...');
                    delete jsonData.url;
                    var fileList = jsonData.message;
                    var filePath = fileList[0].filePath + '/' + fileList[0].fileName;
                    for (var i = 1; i < fileList.length; i++){
                        if ((fileList[i].filePath == filePath)&&(fileList[i].fileName == fileName)){
                            respHttp.retCode = ERRCODE_FILEEXIST;
                            res.write(JSON.stringify(respHttp));
                            res.end();
                            return;
                        }
                    }
                    if (fileSize > (jsonData.memoryLeft*1024*1024)){
                        respHttp.retCode = ERRCODE_NOTENOUGHSPACE;
                    }
                    else {
                        respHttp.retCode = 0;
                        var progData = {broProgress: 0, broRate: 0, devProgress: 0, devRate: 0, retCode: 0};
                        progData.time = time.valueOf();
                        saveProgressToRedis(progressKey, progData);
                    }
                    res.write(JSON.stringify(respHttp));
                    res.end();
                })
            }
        }
        else{
            console.warn("[fsserver]get browser progress with error: " + err);
            respHttp.retCode = 1;
            res.write(JSON.stringify(respHttp));
            res.end();
        }
    });
});
/* 浏览器端文件上传 */
router.post('/uploadFile/*', function(req, res){
    console.warn('[fsserver] access fs/uploadFile');
    res.setTimeout(6000000);
    var urlArr = req.url.split("/");
    var devSN = urlArr[2];
    var percent = 0;
    var firstTime = new Date();
    /* 接收浏览器传输的文件 */
    try {
        var form = new multiparty.Form({uploadDir: fsPath});
        form.parse(req, function (err, fields, files) {
            if (err) {
                var respHttp = {};
                respHttp.message = "browser upload parse error";
                respHttp.retCode = ERRCODE_DOWNLOADING;
                console.warn("[fsserver]" + respHttp.message + err);
                res.write(JSON.stringify(respHttp));
                res.end();
                clearInterval(handle);
            } else {
                //console.warn('[fsserver] fields : \r\n' + JSON.stringify(fields));
                console.warn('[fsserver] files : \r\n' + JSON.stringify(files));
                var inputFile = files.sysFile[0];
                var orgFilename = inputFile.originalFilename;
                var uploadedPath = inputFile.path;
                var fileSize = inputFile.size;
                uploadToHDFS(uploadedPath, orgFilename, fileSize, devSN, req, res, true);
            }
        });
        /* 获取进度，存数据库 */
        form.on("progress", function (bytesReceived, bytesExpected) {
            percent = uploadProgress(bytesReceived, bytesExpected, true, devSN, percent, firstTime);
        });
        var handle = setInterval(function () {
            if (percent != 100) {
                console.error('[fsserver]browser upload file percent: ' + percent);
                percent = uploadProgress(form.bytesReceived, form.bytesExpected, true, devSN, percent, firstTime);
            }
            if (percent == 100) {
                console.error('[fsserver]browser upload file complete');
                clearInterval(handle);
            }
        }, 5000);
    }
    catch (error) {
        clearInterval(handle);
        console.error("[fsserver]process browser upload file unexpected: " + error);
    }

});
/* APP或者浏览器端文件上传到FDFS(没有进度信息等控制) */
router.post('/uploadFileToFDFS', function(req, res){
    console.warn('[fsserver] access fs/uploadFileForFeedback');
    res.setTimeout(120000);
    /* 接收浏览器传输的文件 */
    try {
        var form = new multiparty.Form({uploadDir: fsPath});
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.warn("[fsserver]" + "browser or app upload parse error" + err);
                var result = buildErrResult(err);
                res.write(JSON.stringify(result));
                res.end();
            } else {
                console.warn('[fsserver] fields : \r\n' + JSON.stringify(fields));
                console.warn('[fsserver] files : \r\n' + JSON.stringify(files));
                var srcPathArray = [];
                for(var elementName in files){
                    console.log('[fsserver] elemnt name is : '+elementName);
                    var fileList = files[elementName];
                    if (fileList){
                        console.log('[fsserver] file list exists for element name : '+elementName);
                        var firstFile = fileList[0];
                        if(firstFile){
                            console.log('[fsserver] first file exists for element name : '+elementName);
                            console.log('[fsserver] first file path is : '+firstFile.path);
                            srcPathArray.push(firstFile.path);
                        }
                    }
                }
                var fileIdArray = [];
                uploadToFDFS(srcPathArray, fileIdArray, 0, true, res);
            }
        });
    }
    catch (error) {
        console.error("[fsserver]process upload file unexpected: " + error);
    }
});
router.post("/uploadAPpositionFile/*", function(req, res){
    console.warn('[fsserver] access fs/uploadAPpositionFile');
    var urlArr = req.url.split("/");
    var devSN = urlArr[2];

    var form = new multiparty.Form({uploadDir: fsPath});
    form.parse(req, function (err, fields, files) {
        if (err) {
            var respHttp = {};
            respHttp.message = "browser upload parse error";
            respHttp.retCode = ERRCODE_DOWNLOADING;
            console.warn("[fsserver_position]" + respHttp.message + err);
            res.write(JSON.stringify(respHttp));
            res.end();
        } else {
            console.warn('[fsserver_position] files : \r\n' + JSON.stringify(files));
            var inputFile = files.file_dong_AP[0];
            var orgFilename = inputFile.originalFilename;
            var uploadedPath = inputFile.path;
            var fileSize = inputFile.size;
            uploadAPpositionFileToHDFS(uploadedPath, orgFilename, fileSize, devSN, req, res, true);
        }
    })
})

function uploadAPpositionFileToHDFS(srcpath, orgFilename, fileSize, devSN, req, res) {
    var hdfsPath = HDFSPATH + "apposition/"+devSN + "/";
    var hdfsUrl = hdfsPath + orgFilename;
    /* 在HDFS上创建以devSN为名字的目录 */
    var hdfsDir = request.put(hdfsPath + "?op=MKDIRS");
    hdfsDir.on('response', function(response){
        if (200 == response.statusCode){
            var hdfs = request.put(hdfsUrl + '?op=CREATE&overwrite=true');
            hdfs.on('response', function(response) {
                var rdfs = fs.createReadStream(srcpath);
                if (307 == response.statusCode) {
                    var options = {
                        url: response.headers.location,
                        method: 'PUT',
                        headers: {
                            'User-Agent': 'request',
                            'content-type': 'application/octet-stream'
                        }
                    };
                    var writeHdfs = request(options);
                    writeHdfs.on('end',function() {
                        console.warn("[fsserver_position] write "+orgFilename+" over");
                        deleteFileFromWebserver(srcpath);

                        var body = {
                            Method: "uploadFile",
                            fileName: orgFilename,
                            fileSize: fileSize,
                            devSN: devSN,
                            filepath:hdfsUrl
                        };
                        var module = basic.serviceName.position;
                        var sendMsg = {};
                        sendMsg.body = body;
                        sendMsg.cookies = req.cookies;
                        sendMsg.session = req.session;
                        sendMsg.msgType = 'uploadApposition';

                        if (req.session && req.session.bUserTest == 'true') {
                            module += '_test';
                            console.warn('module = ' + module);
                        }
                        console.warn('[fsserver_position] sendMsg.body = ' + JSON.stringify(sendMsg.body));
                        mqhd.sendMsg(module, JSON.stringify(sendMsg), function (jsonData) {
                            console.warn('[fsserver_position] jsonData:\r\n' + JSON.stringify(jsonData));
                            delete  jsonData.url;
                            res.write(JSON.stringify(jsonData));
                            res.end();
                        });
                    });
                    writeHdfs.on('error',function(err){
                        var respHttp={};
                        respHttp.message = " write " + orgFilename + " to hdfs is failed";
                        respHttp.retCode = 1;
                        res.write(JSON.stringify(respHttp));
                        res.end();
                        console.warn("[fsserver_position]"+err);
                        console.warn("[fsserver_position]"+respHttp.message);
                        deleteFileFromWebserver(srcpath);
                    });
                    rdfs.pipe(writeHdfs);

                    rdfs.on('error',function(error){
                        console.error("[fsserver_position]"+error);
                        res.end();
                    });
                    console.log("[fsserver_position]rdfs:\r\n"+JSON.stringify(rdfs));
                }
            });
        }
    });
    hdfsDir.on('error',function(err){
        var message = "HDFS makedir failed!";
        console.warn("[fsserver_position]"+message);
        console.warn("[fsserver_position]"+err);
        res.write(JSON.stringify(message));
        res.end();
    });
}

router.post("/uploadCloudapgroupFile/*", function(req, res){
    console.warn('[fsserver] access fs/uploadCloudapgroupFile');
    var urlArr = req.url.split("/");
    var devSN = urlArr[2];

    var form = new multiparty.Form({uploadDir: fsPath});
    form.parse(req, function (err, fields, files) {
        if (err) {
            var respHttp = {};
            respHttp.message = "browser upload parse error";
            respHttp.retCode = ERRCODE_DOWNLOADING;
            console.warn("[fsserver_cloudapgroup]" + respHttp.message + err);
            res.write(JSON.stringify(respHttp));
            res.end();
        } else {
            console.warn('[fsserver_cloudapgroup] files : \r\n' + JSON.stringify(files));
            var inputFile = files.sysFile[0];
            var orgFilename = inputFile.originalFilename;
            var uploadedPath = inputFile.path;
            var fileSize = inputFile.size;
            uploadCloudapgroupFileToHDFS(uploadedPath, orgFilename, fileSize, devSN, req, res, true);
        }
    })
})

function uploadCloudapgroupFileToHDFS(srcpath, orgFilename, fileSize, devSN, req, res) {
    console.warn("[fsserver_cloudapgroup] srcpath:" + srcpath);
    var hdfsPath = HDFSPATH + "cloudapgroup/"+devSN + "/";
    var hdfsUrl = hdfsPath + orgFilename;
    /* 在HDFS上创建以devSN为名字的目录 */
    var hdfsDir = request.put(hdfsPath + "?op=MKDIRS");
    hdfsDir.on('response', function(response){
        if (200 == response.statusCode){
            var hdfs = request.put(hdfsUrl + '?op=CREATE&overwrite=true');
            hdfs.on('response', function(response) {
                var rdfs = fs.createReadStream(srcpath);
                if (307 == response.statusCode) {
                    var options = {
                        url: response.headers.location,
                        method: 'PUT',
                        headers: {
                            'User-Agent': 'request',
                            'content-type': 'application/octet-stream'
                        }
                    };
                    var writeHdfs = request(options);
                    writeHdfs.on('end',function() {
                        console.warn("[fsserver_cloudapgroup write "+orgFilename+" over");
                        deleteFileFromWebserver(srcpath);

                        var body = {
                            Method: "uploadCloudapgroup",
                            fileName: orgFilename,
                            fileSize: fileSize,
                            devSN: devSN,
                            filepath:hdfsUrl
                        };
                        var module = basic.serviceName.cloudapgroup;
                        var sendMsg = {};
                        sendMsg.body = body;
                        sendMsg.cookies = req.cookies;
                        sendMsg.session = req.session;

                        if (req.session && req.session.bUserTest == 'true') {
                            module += '_test';
                            console.warn('module = ' + module);
                        }
                        console.warn('[fsserver_cloudapgroup] sendMsg.body = ' + JSON.stringify(sendMsg.body));
                        mqhd.sendMsg(module, JSON.stringify(sendMsg), function (jsonData) {
                            console.warn('[fsserver_cloudapgroup] jsonData:\r\n' + JSON.stringify(jsonData));
                            delete  jsonData.url;
                            res.write(JSON.stringify(jsonData));
                            res.end();
                        });
                    });
                    writeHdfs.on('error',function(err){
                        var respHttp={};
                        respHttp.message = " write " + orgFilename + " to hdfs is failed";
                        respHttp.retCode = 1;
                        res.write(JSON.stringify(respHttp));
                        res.end();
                        console.warn("[fsserver_cloudapgroup]"+err);
                        console.warn("[fsserver_cloudapgroup]"+respHttp.message);
                        deleteFileFromWebserver(srcpath);
                    });
                    rdfs.pipe(writeHdfs);

                    rdfs.on('error',function(error){
                        console.error("[fsserver_cloudapgroup]"+error);
                        res.end();
                    });
                    console.log("[fsserver_cloudapgroup]rdfs:\r\n"+JSON.stringify(rdfs));
                }
            });
        }
    });
    hdfsDir.on('error',function(err){
        var message = "HDFS makedir failed!";
        console.warn("[fsserver_cloudapgroup]"+message);
        console.warn("[fsserver_cloudapgroup]"+err);
        res.write(JSON.stringify(message));
        res.end();
    });
}

/* 浏览器端向设备发送文件下载消息 */
router.post('/downloadFile', function(req, res){
    console.warn('[fsserver] access fs/downloadFile');
    var devSN = req.body.devSN;
    var progressKey = PROGRESS_KEY + devSN;
    var respHttp = {};
    redisClient.get(progressKey, function (err, reply) {
        if (!err) {
            var time = new Date();
            /* 其他人正在上传或是可能上次残留*/
            if ((reply != null) && (time - JSON.parse(reply).time < REDISEXPIRETIME * 1000)) {
                console.warn("[fsserver]other browser is uploading or downloading");
                respHttp.retCode = ERRCODE_DOWNLOADING;
                res.write(JSON.stringify(respHttp));
                res.end();
            }
            else {
                /*删除webserver意外挂掉后progress的残留*/
                if (reply != null) {
                    deleteProgressFromRedis(devSN);
                }
                var sendMsg = {};
                sendMsg.body = req.body;
                sendMsg.body.url = UPLOADURL + devSN + '/downloadFile/';
                sendMsg.cookies = req.cookies;
                sendMsg.session = req.session;
                console.warn('[fsserver] sendMsg.body = ' + JSON.stringify(sendMsg.body));
                mqhd.sendMsg(serviceName, JSON.stringify(sendMsg), function (jsonData) {
                    console.warn('[fsserver] render downloadFile msg...');
                    delete jsonData.url;
                    if (jsonData.retCode == 0) {
                        var progData = {broProgress: 0, broRate: 0, devProgress: 0, devRate: 0, retCode: 0};
                        progData.time = time.valueOf();
                        saveProgressToRedis(progressKey, progData);
                    }
                    res.write(JSON.stringify(jsonData));
                    res.end();
                });
            }
        }
        else{
            console.warn("[fsserver]get browser progress with error: " + err);
            respHttp.retCode = 1;
            res.write(JSON.stringify(respHttp));
            res.end();
        }
    })
});
/* 设备端文件上传 */
router.post('/upload/*/upload', function(req, res) {
    console.warn('[fsserver]access /fs/upload...');
    var arr = req.url.split('/');
    var devSN = arr[2];
    var percent = 0;
    var firstTime = new Date();
    if (arr.length == 6) {
        var sendMsg = {};
        sendMsg.optType = 16;
        sendMsg.devSN = devSN;
        sendMsg.uuid = arr[4];
        sendMsg.retCode = 0;
        console.warn('[fsserver] sendMsg = ' + JSON.stringify(sendMsg));
        /*设备可以上传，直接先返回成功*/
        mqhd.sendMsg(serviceName, JSON.stringify(sendMsg));
    }
    try {
        res.setTimeout(6000000);
        var form = new multiparty.Form({uploadDir: fsPath});
        //下载后处理
        form.parse(req, function(err, fields, files) {
            console.warn("[fsserver]files:\r\n"+JSON.stringify(files));
            if(err) {
                console.warn('[fsserver]device upload parse error' + err);
                clearInterval(handle);
            }
            else {
                var inputFile = files.filename[0];
                var uploadedPath = inputFile.path;
                var originalName = inputFile.originalFilename;
                var fileSize = inputFile.size;
                uploadToHDFS(uploadedPath, originalName, fileSize, devSN, req, res, false);
            }
        });
        form.on("progress", function(bytesReceived, bytesExpected){
            percent = uploadProgress(bytesReceived, bytesExpected, false, devSN, percent, firstTime);
        });
        var handle = setInterval(function() {
            if (percent != 100){
                console.error('[fsserver]device upload file percent: ' + percent);
                percent = uploadProgress(form.bytesReceived, form.bytesExpected, false, devSN, percent, firstTime);
            }
            if (percent == 100){
                console.error('[fsserver]device upload file complete');
                clearInterval(handle);
            }
        }, 5000);
    }
    catch (error) {
        clearInterval(handle);
        console.error("[fsserver]process device upload file unexpected: " + error);
    }
});
/* 设备端文件下载 */
router.get('/download/*', function(req, res) {
    console.warn('[fsserver]access /fs/download...');
    try{
        console.warn(service_url);
        console.warn('[fsserver]url:'+ JSON.stringify(req.headers));
        var arr = req.url.split('/');
        var fileName = arr[3];
        var devSN = arr[2];
        var destPath = fsPath + devSN + '/';
        var offset = 0;
        if (req.headers.range)
        {
            var range = req.headers.range;
            offset = parseInt(range.slice(6,-1));
            console.warn("[fsserver]already download " + offset + "bytes.");
        }
        if (undefined == fileName) {
            res.end();
            console.warn("[fsserver]parameter error");
            return;
        }
        console.warn('[fsserver]open file ' + fileName +  ' on HDFS!');
        fsDevDownFromHDFS(fileName, devSN, offset, res);
    }
    catch (error) {
        console.error("[fsserver]process download file except: " + error);
    }
});
/* 文件上传下载获取进度条 */
router.post('/progress', function(req, res){
    var devSN = req.body.devSN;
    var progressKey = PROGRESS_KEY + devSN;
    var resHttp = {broProgress:"",broRate:"",devProgress:"",devRate:"", retCode:0};
    redisClient.get(progressKey, function (err, reply) {
        if (!err) {
            if (reply != null) {
                var data = JSON.parse(reply);
                var fileName = path.basename(req.body.fileName);
                resHttp.broProgress = data.broProgress;
                resHttp.broRate = data.broRate;
                resHttp.devProgress = data.devProgress;
                resHttp.devRate = data.devRate;
                /*进度100%*/
                if ((req.body.fileName != undefined) && (data.devProgress == 100)) {
                    /*没有全部上传到HDFS*/
                    if (!data.flag){
                        resHttp.devProgress = 99;
                        res.write(JSON.stringify(resHttp));
                        res.end();
                    }
                    /*全部上传到HDFS，回传浏览器文件地址*/
                    else {
                        if (data.localFlag == undefined)
                        {
                            var progData = {broProgress: 0, broRate: 0, devProgress: 100, devRate: 0, retCode: 0};
                            var time = new Date();
                            progData.time = time.valueOf();
                            progData.flag = true;
                            progData.localFlag = "downloading";
                            saveProgressToRedis(progressKey, progData);
                            fsBrowserDownLoadMkdir(fileName, devSN);
                            resHttp.devProgress = 99;
                            res.write(JSON.stringify(resHttp));
                            res.end();
                        }
                        else
                        {
                            if("downloading" == data.localFlag)
                            {
                                resHttp.devProgress = 99;
                                res.write(JSON.stringify(resHttp));
                                res.end();
                            }
                            else if ("complete" == data.localFlag)
                            {
                                resHttp.fileName = browserDownload + devSN + '/' + fileName;
                                res.write(JSON.stringify(resHttp));
                                res.end();
                                deleteProgressFromRedis(devSN);
                            }
                            else
                            {
                                resHttp.retCode = 1;
                                res.write(JSON.stringify(resHttp));
                                res.end();
                                deleteProgressFromRedis(devSN);
                            }

                        }
                    }
                }
                /*否则直接回复浏览器进度信息*/
                else{
                    //console.warn('[fsserver]' + JSON.stringify(resHttp));
                    res.write(JSON.stringify(resHttp));
                    res.end();
                }
            }
            /*没有读取到进度信息*/
            else {
                console.warn('[fsserver]' + JSON.stringify(resHttp));
                res.write(JSON.stringify(resHttp));
                res.end();
            }
        }
        /*读数据库出错*/
        else{
            console.warn("[fsserver]get progress with error: " + err);
            res.end();
        }
    });
});

/* 导出窜货分析列表 */
router.post('/exportFleeingInfo', function(req, res){
    try{
        console.warn('[fsserver] access fs/exportFleeingInfo');
        var rdUserName = "langtest"
        var body = {
            rdUserName : rdUserName,
            query : req.body.query,
            method : "downloadFleeingInfo"
        };
        var sendMsg = {};
        sendMsg.url = '/rdfuncmgr/fleeing';
        sendMsg.body = body;
        sendMsg.cookies = req.cookies;
        sendMsg.session = req.session;
        console.warn('[fsserver] sendMsg = ' + JSON.stringify(sendMsg));
        mqhd.sendMsg(basic.serviceName.rdfuncmgr, JSON.stringify(sendMsg), function(jsonData) {
            console.warn('[fsserver] render exportFleeingInfo msg...');
            delete jsonData.url;
            /* 返回成功则开始下载 */
            if (jsonData.retCode == 0) {
                var filename = jsonData.msg;
                browserDownLoadMkdir(filename, rdUserName, jsonData, res);
            }
            /* 返回失败，告知前台 */
            else {
                res.write(JSON.stringify(jsonData));
                res.end();
            }
        });
    }
    catch(err)
    {
        console.error("process fs/exportFleeingInfo failed with err");
        console.error(err)
    }
});

/* 导入窜货分析表 */
router.post("/importFleeingInfo", function(req, res){
    console.warn('[fsserver] access fs/uploadFleeingInfoFile ===langtest===');
    console.warn('[admin] the content of the input request:' +
        ' \n   headers: ' + JSON.stringify(req.headers) +
        ';\n   url: ' + JSON.stringify(req.url) +
        ';\n   method: ' + JSON.stringify(req.method) +
        ';\n   cookies: ' + JSON.stringify(req.cookies) +
        ';\n   session: ' + JSON.stringify(req.session) +
        ';\n   query: ' + JSON.stringify(req.query) +
        ';\n   body: ' + JSON.stringify(req.body));

    var rdUserName = req.session.rdUserName ? req.session.rdUserName : "test";
    var form = new multiparty.Form({uploadDir: fsPath});
    form.parse(req, function (err, fields, files) {
        if (err) {
            var respHttp = {};
            respHttp.message = "browser upload parse error";
            respHttp.retCode = ERRCODE_DOWNLOADING;
            console.warn("[fsserver_rdfuncmgr]" + respHttp.message + err);
            res.write(JSON.stringify(respHttp));
            res.end();
        } else {
            console.warn('[fsserver_rdfuncmgr] files : \r\n' + JSON.stringify(files));
            var inputFile = files.sysFile[0];
            var orgFilename = inputFile.originalFilename;
            var uploadedPath = inputFile.path;
            var fileSize = inputFile.size;
            uploadFleeingInfoFileToHDFS(uploadedPath, orgFilename, fileSize, rdUserName, req, res, true);
        }
    })
});
function uploadFleeingInfoFileToHDFS(srcpath, orgFilename, fileSize, rdUserName, req, res) {
    console.warn("[fsserver_rdfuncmgr] srcpath:" + srcpath);
    var hdfsPath = HDFSPATH + "rdfuncmgr/"+rdUserName + "/";
    var hdfsUrl = hdfsPath + orgFilename;
    /* 在HDFS上创建以rdUserName为名字的目录 */
    var hdfsDir = request.put(hdfsPath + "?op=MKDIRS");
    hdfsDir.on('response', function(response){
        if (200 == response.statusCode){
            var hdfs = request.put(hdfsUrl + '?op=CREATE&overwrite=true');
            hdfs.on('response', function(response) {
                var rdfs = fs.createReadStream(srcpath);
                if (307 == response.statusCode) {
                    var options = {
                        url: response.headers.location,
                        method: 'PUT',
                        headers: {
                            'User-Agent': 'request',
                            'content-type': 'application/octet-stream'
                        }
                    };
                    var writeHdfs = request(options);
                    writeHdfs.on('end',function() {
                        console.warn("[fsserver_rdfuncmgr write "+orgFilename+" over");
                        deleteFileFromWebserver(srcpath);

                        var body = {
                            fileName: orgFilename,
                            fileSize: fileSize,
                            rdUserName: rdUserName,
                            filepath:hdfsUrl,
                            method:"uploadFleeingInfo"
                        };
                        var module = basic.serviceName.rdfuncmgr;
                        var sendMsg = {};
                        sendMsg.url = '/rdfuncmgr/fleeing';
                        sendMsg.body = body;
                        sendMsg.cookies = req.cookies;
                        sendMsg.session = req.session;

                        if (req.session && req.session.bUserTest == 'true') {
                            module += '_test';
                            console.warn('module = ' + module);
                        }
                        console.warn('[fsserver_rdfuncmgr] sendMsg.body = ' + JSON.stringify(sendMsg.body));
                        mqhd.sendMsg(module, JSON.stringify(sendMsg), function (jsonData) {
                            console.warn('[fsserver_rdfuncmgr] jsonData:\r\n' + JSON.stringify(jsonData));
                            delete  jsonData.url;
                            res.write(JSON.stringify(jsonData));
                            res.end();
                        });
                    });
                    writeHdfs.on('error',function(err){
                        var respHttp={};
                        respHttp.message = " write " + orgFilename + " to hdfs is failed";
                        respHttp.retCode = 1;
                        res.write(JSON.stringify(respHttp));
                        res.end();
                        console.warn("[fsserver_rdfuncmgr]"+err);
                        console.warn("[fsserver_rdfuncmgr]"+respHttp.message);
                        deleteFileFromWebserver(srcpath);
                    });
                    rdfs.pipe(writeHdfs);

                    rdfs.on('error',function(error){
                        console.error("[fsserver_rdfuncmgr]"+error);
                        res.end();
                    });
                    console.log("[fsserver_rdfuncmgr]rdfs:\r\n"+JSON.stringify(rdfs));
                }
            });
        }
    });
    hdfsDir.on('error',function(err){
        var message = "HDFS makedir failed!";
        console.warn("[fsserver_rdfuncmgr]"+message);
        console.warn("[fsserver_rdfuncmgr]"+err);
        res.write(JSON.stringify(message));
        res.end();
    });
}



function uploadStudentsInfoFileToHDFS(srcpath, orgFilename, fileSize, req, res){

    try{
        var scenarioId = req.query.scenarioId;
        var schoolId = req.query.schoolId;

        var hdfsPath = HDFSPATH + "studentsInfoFile/"+ scenarioId + "/" + schoolId + "/";
        var hdfsUrl = hdfsPath + orgFilename;
        /* 在HDFS上创建以devSN为名字的目录 */
        var hdfsDir = request.put(hdfsPath + "?op=MKDIRS");
        hdfsDir.on('response', function(response){
            if (200 == response.statusCode){
                var hdfs = request.put(hdfsUrl + '?op=CREATE&overwrite=true');
                hdfs.on('response', function(response) {
                    var rdfs = fs.createReadStream(srcpath);
                    if (307 == response.statusCode) {
                        var options = {
                            url: response.headers.location,
                            method: 'PUT',
                            headers: {
                                'User-Agent': 'request',
                                'content-type': 'application/octet-stream'
                            }
                        };
                        var writeHdfs = request(options);
                        writeHdfs.on('end',function() {
                            console.warn("[fsserver_studentsInfo] write "+orgFilename+" over");
                            deleteFileFromWebserver(srcpath);

                            var body = {
                                Method: "uploadStudentsInfoFile",
                                fileName: orgFilename,
                                fileSize: fileSize,
                                scenarioId: scenarioId,
                                schoolId:schoolId,
                                filepath:hdfsUrl
                            };
                            var module = "iotedu_primary_write";
                            var sendMsg = {};
                            sendMsg.msgData = {
                                "body":body
                            };
                            sendMsg.cookies = req.cookies;
                            sendMsg.session = req.session;
                            sendMsg.msgType = '/uploadStudentsInfoFile';

                            console.warn('[fsserver_studentsInfo] sendMsg.msgData = ' + JSON.stringify(sendMsg.msgData));
                            mqhd.sendMsg(module, JSON.stringify(sendMsg), function (jsonData) {
                                console.warn('[fsserver_studentsInfo] jsonData:\r\n' + JSON.stringify(jsonData));
                                delete  jsonData.url;
                                res.write(JSON.stringify(jsonData));
                                res.end();
                            });
                        });
                        writeHdfs.on('error',function(err){
                            var respHttp={};
                            respHttp.result = " write " + orgFilename + " to hdfs is failed";
                            respHttp.retCode = 1;
                            res.write(JSON.stringify(respHttp));
                            res.end();
                            console.warn("[fsserver_studentsInfo]"+err);
                            console.warn("[fsserver_studentsInfo]"+respHttp.message);
                            deleteFileFromWebserver(srcpath);
                        });
                        rdfs.pipe(writeHdfs);

                        rdfs.on('error',function(error){
                            console.error("[fsserver_studentsInfo]"+error);
                            res.end();
                        });
                        console.log("[fsserver_studentsInfo]rdfs:\r\n"+JSON.stringify(rdfs));
                    }
                });
            }
        });
        hdfsDir.on('error',function(err){
            var message = "HDFS makedir failed!";
            console.warn("[fsserver_studentsInfo]"+message);
            console.warn("[fsserver_studentsInfo]"+err);
            res.write(JSON.stringify(message));
            res.end();
        });

    }catch(err){
        console.error("uploadStudentsInfoFileToHDFS catch err"+err)
    }
}

router.post("/uploadStudentsFile", function(req, res){
    try{
        console.warn('[fsserver] access fs/uploadStudentsFile');

        var form = new multiparty.Form({uploadDir: fsPath});
        form.parse(req, function (err, fields, files) {
            if (err) {
                var respHttp = {};
                respHttp.result = "browser upload parse error";
                respHttp.retCode = ERRCODE_DOWNLOADING;
                console.warn("[fsserver_studentsInfo]" + respHttp.message + err);
                res.write(JSON.stringify(respHttp));
                res.end();
            } else {
                console.warn('[fsserver_studentsInfo] files : \r\n' + JSON.stringify(files));
                var inputFile = files.file[0];
                var orgFilename = inputFile.originalFilename;
                var uploadedPath = inputFile.path;
                var fileSize = inputFile.size;
                uploadStudentsInfoFileToHDFS(uploadedPath, orgFilename, fileSize, req, res, true);
            }
        })

    }catch(err){
        console.error('[fsserver] catch fs/uploadStudentsFile err'+err);
    }
});


function uploadManualApListFileToHDFS(srcpath, orgFilename, fileSize, req, res){

    try{
        var scenarioId = req.query.scenarioId;
        var schoolId = req.query.schoolId;

        var hdfsPath = HDFSPATH + "manualApListFile/"+ scenarioId + "/" + schoolId + "/";
        var hdfsUrl = hdfsPath + orgFilename;
        /* 在HDFS上创建以devSN为名字的目录 */
        var hdfsDir = request.put(hdfsPath + "?op=MKDIRS");
        hdfsDir.on('response', function(response){
            if (200 == response.statusCode){
                var hdfs = request.put(hdfsUrl + '?op=CREATE&overwrite=true');
                hdfs.on('response', function(response) {
                    var rdfs = fs.createReadStream(srcpath);
                    if (307 == response.statusCode) {
                        var options = {
                            url: response.headers.location,
                            method: 'PUT',
                            headers: {
                                'User-Agent': 'request',
                                'content-type': 'application/octet-stream'
                            }
                        };
                        var writeHdfs = request(options);
                        writeHdfs.on('end',function() {
                            console.warn("[fsserver_manualApList] write "+orgFilename+" over");
                            deleteFileFromWebserver(srcpath);

                            var body = {
                                Method: "uploadManualApList",
                                fileName: orgFilename,
                                fileSize: fileSize,
                                scenarioId: scenarioId,
                                schoolId:schoolId,
                                filepath:hdfsUrl
                            };
                            var module = "iotedu_primary_write";
                            var sendMsg = {};
                            sendMsg.msgData = {
                                "body":body
                            };
                            sendMsg.cookies = req.cookies;
                            sendMsg.session = req.session;
                            sendMsg.msgType = '/uploadManualApList';

                            console.warn('[fsserver_manualApList] sendMsg.msgData = ' + JSON.stringify(sendMsg.msgData));
                            mqhd.sendMsg(module, JSON.stringify(sendMsg), function (jsonData) {
                                console.warn('[fsserver_manualApList] jsonData:\r\n' + JSON.stringify(jsonData));
                                delete  jsonData.url;
                                res.write(JSON.stringify(jsonData));
                                res.end();
                            });
                        });
                        writeHdfs.on('error',function(err){
                            var respHttp={};
                            respHttp.result = " write " + orgFilename + " to hdfs is failed";
                            respHttp.retCode = 1;
                            res.write(JSON.stringify(respHttp));
                            res.end();
                            console.warn("[fsserver_manualApList]"+err);
                            console.warn("[fsserver_manualApList]"+respHttp.message);
                            deleteFileFromWebserver(srcpath);
                        });
                        rdfs.pipe(writeHdfs);

                        rdfs.on('error',function(error){
                            console.error("[fsserver_manualApList]"+error);
                            res.end();
                        });
                        console.log("[fsserver_manualApList]rdfs:\r\n"+JSON.stringify(rdfs));
                    }
                });
            }
        });
        hdfsDir.on('error',function(err){
            var message = "HDFS makedir failed!";
            console.warn("[fsserver_manualApList]"+message);
            console.warn("[fsserver_manualApList]"+err);
            res.write(JSON.stringify(message));
            res.end();
        });

    }catch(err){
        console.error("fsserver_manualApList catch err"+err)
    }
}


router.post("/uploadManualApListFile", function(req, res){
    try{
        console.warn('[fsserver] access fs/uploadManualApListFile');

        var form = new multiparty.Form({uploadDir: fsPath});
        form.parse(req, function (err, fields, files) {
            if (err) {
                var respHttp = {};
                respHttp.result = "browser upload parse error";
                respHttp.retCode = ERRCODE_DOWNLOADING;
                console.warn("[fsserver_manualApList]" + respHttp.message + err);
                res.write(JSON.stringify(respHttp));
                res.end();
            } else {
                console.warn('[fsserver_manualApList] files : \r\n' + JSON.stringify(files));
                var inputFile = files.file[0];
                var orgFilename = inputFile.originalFilename;
                var uploadedPath = inputFile.path;
                var fileSize = inputFile.size;
                uploadManualApListFileToHDFS(uploadedPath, orgFilename, fileSize, req, res, true);
            }
        })

    }catch(err){
        console.error('[fsserver] catch fs/uploadStudentsFile err'+err);
    }
});

function uploadLocalizerFileToHDFS(srcpath, orgFilename, fileSize, req, res){
    try{
        var scenarioId = req.query.scenarioId;
        var schoolId = req.query.schoolId;

        var hdfsPath = HDFSPATH + "localizerFile/"+ scenarioId + "/" + schoolId + "/";
        var hdfsUrl = hdfsPath + orgFilename;
        /* 在HDFS上创建以devSN为名字的目录 */
        var hdfsDir = request.put(hdfsPath + "?op=MKDIRS");
        hdfsDir.on('response', function(response){
            if (200 == response.statusCode){
                var hdfs = request.put(hdfsUrl + '?op=CREATE&overwrite=true');
                hdfs.on('response', function(response) {
                    var rdfs = fs.createReadStream(srcpath);
                    if (307 == response.statusCode) {
                        var options = {
                            url: response.headers.location,
                            method: 'PUT',
                            headers: {
                                'User-Agent': 'request',
                                'content-type': 'application/octet-stream'
                            }
                        };
                        var writeHdfs = request(options);
                        writeHdfs.on('end',function() {
                            console.warn("[uploadLocalizerFileToHDFS] write "+orgFilename+" over");
                            deleteFileFromWebserver(srcpath);

                            var body = {
                                Method: "uploadLocalizerList",
                                fileName: orgFilename,
                                fileSize: fileSize,
                                scenarioId: scenarioId,
                                schoolId:schoolId,
                                filepath:hdfsUrl
                            };
                            var module = "iotedu_primary_write";
                            var sendMsg = {};
                            sendMsg.msgData = {
                                "body":body
                            };
                            sendMsg.cookies = req.cookies;
                            sendMsg.session = req.session;
                            sendMsg.msgType = '/uploadLocalizerList';

                            console.warn('[uploadLocalizerFileToHDFS] sendMsg.msgData = ' + JSON.stringify(sendMsg.msgData));
                            mqhd.sendMsg(module, JSON.stringify(sendMsg), function (jsonData) {
                                console.warn('[uploadLocalizerFileToHDFS] jsonData:\r\n' + JSON.stringify(jsonData));
                                delete  jsonData.url;
                                res.write(JSON.stringify(jsonData));
                                res.end();
                            });
                        });
                        writeHdfs.on('error',function(err){
                            var respHttp={};
                            respHttp.result = " write " + orgFilename + " to hdfs is failed";
                            respHttp.retCode = 1;
                            res.write(JSON.stringify(respHttp));
                            res.end();
                            console.warn("[uploadLocalizerFileToHDFS]"+err);
                            console.warn("[uploadLocalizerFileToHDFS]"+respHttp.message);
                            deleteFileFromWebserver(srcpath);
                        });
                        rdfs.pipe(writeHdfs);

                        rdfs.on('error',function(error){
                            console.error("[uploadLocalizerFileToHDFS]"+error);
                            res.end();
                        });
                        console.log("[uploadLocalizerFileToHDFS]rdfs:\r\n"+JSON.stringify(rdfs));
                    }
                });
            }
        });
        hdfsDir.on('error',function(err){
            var message = "HDFS makedir failed!";
            console.warn("[uploadLocalizerFileToHDFS]"+message);
            console.warn("[uploadLocalizerFileToHDFS]"+err);
            res.write(JSON.stringify(message));
            res.end();
        });

    }catch(err){
        console.error("uploadLocalizerFileToHDFS catch err"+err)
    }
}

router.post("/uploadLocalizerFile", function(req, res){
    try{
        console.warn('[fsserver] access fs/uploadLocalizerFile');

        var form = new multiparty.Form({uploadDir: fsPath});
        form.parse(req, function (err, fields, files) {
            if (err) {
                var respHttp = {};
                respHttp.result = "browser upload parse error";
                respHttp.retCode = ERRCODE_DOWNLOADING;
                console.warn("[uploadLocalizerFile]" + respHttp.message + err);
                res.write(JSON.stringify(respHttp));
                res.end();
            } else {
                console.warn('[uploadLocalizerFile] files : \r\n' + JSON.stringify(files));
                var inputFile = files.file[0];
                var orgFilename = inputFile.originalFilename;
                var uploadedPath = inputFile.path;
                var fileSize = inputFile.size;
                uploadLocalizerFileToHDFS(uploadedPath, orgFilename, fileSize, req, res, true);
            }
        })

    }catch(err){
        console.error('[fsserver] catch fs/uploadStudentsFile err'+err);
    }
});




/* 默认路由（获取文件列表，删除文件，修改文件名）*/
router.all(jsonParser, function(req, res) {
    console.warn('[fsserver]access /fs/*...');
    console.warn("[fsserver]url:"+req.url);
    var sendMsg = {};
    sendMsg.body    = req.body;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    console.warn('[%s]sendMsg.body = %s',serviceName, JSON.stringify(sendMsg.body));
    mqhd.sendMsg(serviceName, JSON.stringify(sendMsg), function(jsonData) {
        console.warn('[fsserver]render /fs/*... msg...');
        delete jsonData.url;
        res.write(JSON.stringify(jsonData));
        res.end();
    });
});

module.exports = router;