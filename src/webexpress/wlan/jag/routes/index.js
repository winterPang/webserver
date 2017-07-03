/**
 * 该文件由base模块提供路由功能.
 */
var express    = require('express');
var bodyParser = require('body-parser');
var config     = require('wlanpub').config;
var qs = require('querystring');

var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var serviceName = basic.serviceName.maintenance;
var serviceKernelName = basic.serviceName.kernelmonitor;
var jsonParser = bodyParser.json();
var router  = express.Router();

var fs = require('fs');
var multiparty = require('multiparty');
var util = require('util');
var request = require('request');
var basePath = './localfs/';
var corePath = './localfs/maintenance/';
var coreFilePath = './localfs/maintenance/core/';
var testSuffix      = config.get('testSuffix');
request.debug = false;

if (!fs.existsSync(basePath)){
	fs.mkdirSync(basePath, 0777);
}

            
             
fs.exists(corePath, function (exists) {
  if (!exists)
  {
      fs.mkdir(corePath, 0777, function(err){
      if(err){
             console.log(err);
      }else{
             console.log('creat ' + corePath +  ' done!');
             fs.mkdir(coreFilePath, 0777, function(err){
             if(err){
                    console.log(err);
             }else{
                    console.log('creat ' + coreFilePath +  ' done!');
             }
             });
      }
      })
  }
});

/*router.get('/app/diagnose', function(req, res, next) {
    console.log('access /maintenance/app/diagnose...');
    console.log('req: ' + req);
    console.log('url: ' + req.originalUrl);
    console.log('req.url: ' + req.url);
    console.log('path: ' + req.path);
    console.log('hostname: ' + req.hostname);
    console.log('method: ' + req.method);
    console.log('body: ' + req.body);
    var sendMsg = {};
    sendMsg.url     = req.url;
    sendMsg.method  = req.method;
    sendMsg.headers = req.headers;
    sendMsg.body = req.body;
    sendMsg.getType = 1;
    mqhd.sendMsg(serviceName, JSON.stringify(sendMsg),function(jsonData) {
        console.log('  render get msg...');
        console.log('  render get msg...'+JSON.stringify(jsonData));
        delete  jsonData.url;
        res.header("Access-Control-Allow-Origin", "*");
  		  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, username, AuthToken");
  			res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        res.send( JSON.stringify(jsonData.body));
        console.log('  render get msg2...'+JSON.stringify(jsonData));
    });
       
});

router.get('/app/result', function(req, res, next) {
    console.log('access /maintenance/app/result...');
    console.log('req: ' + req);
    console.log('url: ' + req.originalUrl);
    console.log('req.url: ' + req.url);
    console.log('path: ' + req.path);
    console.log('hostname: ' + req.hostname);
    console.log('method: ' + req.method);
    console.log('body: ' + req.body);
    var sendMsg = {};
    sendMsg.url     = req.url;
    sendMsg.method  = req.method;
    sendMsg.headers = req.headers;
    sendMsg.body = req.body;
    sendMsg.getType = 2;
    mqhd.sendMsg(serviceName, JSON.stringify(sendMsg),function(jsonData) {
        console.log('  render get msg...');
        console.log('  render get msg...'+JSON.stringify(jsonData));
        delete  jsonData.url;
        res.header("Access-Control-Allow-Origin", "*");
  		  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, username, AuthToken");
  			res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        res.send( JSON.stringify(jsonData.body));
        console.log('  render get msg2...'+JSON.stringify(jsonData));
    });
});

router.get('/', function(req, res, next) {
    console.log('get /maintenance/home...');
    console.log('req: ' + req);
    console.log('url: ' + req.originalUrl);
    console.log('req.url: ' + req.url);
    console.log('path: ' + req.path);
    console.log('hostname: ' + req.hostname);
    console.log('method: ' + req.method);
    console.log('body: ' + req.body);
    var sendMsg = {};
    sendMsg.url     = req.url;
    sendMsg.method  = req.method;
    sendMsg.headers = req.headers;
    sendMsg.body =req.body;
    mqhd.sendMsg(serviceName, JSON.stringify(sendMsg), res,function(jsonData, response) {
        console.log('  render get msg...');
        delete  jsonData.url;
        console.log(jsonData.body);
        response.send(jsonData.body);
        //console.log('  render get msg2...'+JSON.stringify(jsonData));
    });
});*/

function uploadToHDFS(srcpath, filename, req) {
    console.log(srcpath);
    console.log(filename);
    var hdfsConnOption = config.get('hdfsConnOption');
    //var hdfsurl = 'http://172.27.8.115:50070/webhdfs/v1/home/hdfs/maintenance/core/' + filename + '?op=CREATE';
    var subdir = 'diagnose';
    if (filename.indexOf('core') > 0) {
        subdir = 'core';
    }
    else if ((filename.indexOf('sbin') >= 0) || (filename.indexOf('lib') >= 0)) {
        subdir = 'version';
    }
    var hdfsurl = 'http://' + hdfsConnOption.host + ':' + hdfsConnOption.port + hdfsConnOption.path + 'maintenance/'+ subdir + '/' + filename + '?op=CREATE';
    console.log(hdfsurl);
    var hdfs1 = request.put(hdfsurl);

    hdfs1.on('response', function (response) {
        console.log(response.headers.location); // 200
        console.log(response.statusCode);
        var rdfs = fs.createReadStream(srcpath + filename);
        if (307 == response.statusCode) {
            console.log('307');
            var options = {
                url: response.headers.location,
                method: 'PUT',
                headers: {
                    'User-Agent': 'request',
                    'content-type': 'application/octet-stream'
                }
            };
            var writeHdfs = request(options);
            //var writeHdfs = request.put(response.headers.location);
            console.log('----------------------------');
            //request.head({"content-type": "application/octet-stream"});
            //console.log(request.head);
            console.log(writeHdfs.headers);
            console.log('----------------------------');
            writeHdfs.on('end', function () {
                console.log('write over');

                var sendMsg = {};
                sendMsg.url = '/maintenance/upload';
                sendMsg.method = req.method;
                sendMsg.headers = req.headers;
                sendMsg.body = filename;

                var serviceModelName = serviceName;
                console.warn("send filename: ." + filename);

                var isKernel = filename.indexOf("kernel.core.txt");
                if (isKernel >= 0){
                    console.warn("Send msg to kernelmonitor.");
                    sendMsg.url = '/kernelmonitor/kernelinfo';
                    serviceModelName = serviceKernelName;
                }

                mqhd.sendMsg(serviceModelName, JSON.stringify(sendMsg), function (jsonData) {
                    console.log('  render maintenance uploadfile msg...');
                    delete  jsonData.url;
                    //res.write(JSON.stringify(jsonData.body));

                    console.log('  transmit data: ' + JSON.stringify(jsonData.body));
                    fs.unlink(srcpath + filename, function (err) {
                        console.log('rm file err');
                        console.log(err);
                    });
                });

            });
            rdfs.on('end', function () {
                console.log('read over');
            });
            rdfs.on('readable', function () {
                console.log('readable happen');
            });
            rdfs.on('data', function (chunk) {
                console.log('get %d bytes', chunk.length);
            });
            rdfs.on('close', function () {
                console.log('read over');
            });
            rdfs.on('error', function (error) {
                console.log(error);
            });
            writeHdfs.on('error', function (err) {
                console.log(err);
                console.log('write to hdfs failed! may be exist!');
            });

            rdfs.pipe(writeHdfs);

        }
        //console.log(response.headers['content-type']) // 'image/png'
    });
}

router.get('/maintenance/upload', function(req, res){
        console.log('download file');
        console.log(req.headers);
        console.log(req.url);
        var temp = req.url.split('?');
        console.log(qs.parse(temp[1]));
        var keyValue = qs.parse(temp[1]);
        var hdfsConnOption = config.get('hdfsConnOption');
    var subdir = 'diagnose';
    if (keyValue.filename.indexOf('core') > 0) {
        subdir = 'core';
    }
    else if ((keyValue.filename.indexOf('sbin') >= 0) || (keyValue.filename.indexOf('lib') >= 0)) {
        subdir = 'version';
    }
    //var hdfsurl = 'http://172.27.8.115:50070/webhdfs/v1/home/hdfs/maintenance/core/' + filename + '?op=CREATE';
        var hdfsurl = 'http://' + hdfsConnOption.host + ':' + hdfsConnOption.port + hdfsConnOption.path + 'maintenance/'+ subdir + '/' + keyValue.filename + '?op=OPEN';
        var fileStream = request(hdfsurl);
        fileStream.pipe(res);

    });

router.post('/maintenance/upload', function(req, res){
    console.log('maintain uplaod');
    procUploadFile(req, res);
});

router.post('/maintenance'+ testSuffix + '/upload', function(req, res){
    console.log('maintain_test uplaod');
    procUploadFile(req, res);
});

function procUploadFile(req, res){

    res.setTimeout(6000000);
    var dstpath = coreFilePath;//'./localfs/maintenance/core/';
    var form = new multiparty.Form({uploadDir: dstpath});
    //下载后处理
    form.parse(req, function(err, fields, files) {

        var filesTmp = JSON.stringify(files,null,2);
        //console.log(req);
        if(err){
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + filesTmp);
            var inputFile = files.filename[0];//.upload[0];
            var uploadedPath = inputFile.path;
            var dstPath = dstpath + inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function(err) {
                if(err){
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');

                    uploadToHDFS(dstpath, inputFile.originalFilename, req);
                    //var rdfs = fs.createReadStream('node8_70f9-6d6c-84a0_apmgrd_383_11_20151023-170007_1445619607.core');

                    //rdfs.pipe(request.put('http://192.168.110.34:3001/upload?filename=node8_70f9-6d6c-84a0_apmgrd_383_11_20151023-170007_1445619607.core'));
                    res.statusCode = 200;
                    res.end();


                }
            });
        }
    });
}

// 提示：post请求才加载bodyParser中间件
router.all( jsonParser, function(req, res, next) {
    console.log('  access /maintenance/*...');
   console.log(req.url);
    var sendMsg = {};
    sendMsg.url     = req.url;
    sendMsg.method  = req.method;
    sendMsg.headers = req.headers;
    sendMsg.body    = req.body;
    console.log('req.body = ' + JSON.stringify(req.body));
    var temp = req.url.split('/');
    var serName1 = temp[1];

    if (req.session && req.session.bUserTest == 'true') {
        //console.log('default bUserTest true');
        serName1 += testSuffix;
    }

    mqhd.sendMsg(serName1, JSON.stringify(sendMsg), function(jsonData) {
        console.log('  render maintenance msg...');
        delete jsonData.url;
        res.write(JSON.stringify(jsonData.body));
        res.end();
        console.log('  transmit data: ' + JSON.stringify(jsonData.body));
    });
});

module.exports = router;