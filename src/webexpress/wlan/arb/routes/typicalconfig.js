var fs = require('fs'),
    uuid = require('uuid'),
    express = require('express'),
    request = require('request'),
    router = express.Router(),
    bodyparser = require('body-parser'),
    multiparty = require('multiparty'),
    config = require('wlanpub').config,
    conf = require('../../../../config'),
    hdfsConnOption = conf.hdfsConnOption,
    testSuffix = config.get('testSuffix'),
    basic = require('wlanpub').basic,
    mqhd = require('wlanpub').mqhd,
    serviceName = basic.serviceName.typicalconfig;


var CONST_LOG_HEAD = '[TYPICALCONFIG]';
var browserUpload = "./localfs/v3/arb/typicalConfig/browserUpload/";
var browserDownload = "./localfs/v3/arb/typicalConfig/browserDownload/";
var HDFSPATH = 'http://' + hdfsConnOption.host + ':' + hdfsConnOption.port + hdfsConnOption.path + 'typicalconfig/';


router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended : false}));


//从浏览器获取配置文件并存储到HDFS
router.use('/putFile2HDFSFromBro', function(req, res, next){
    var sendMsg = {};
    sendMsg.url = '/v3/arb/typicalconfig/putFile2HDFSFromBro';
    if(req.socket && req.socket.remoteAddress){
        sendMsg.remoteAddress = req.socket.remoteAddress;
    }
    sendMsg.method = req.method;
    sendMsg.headers = req.headers;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.query = req.query;

    if(req.session && req.session.bUserTest == 'true'){
        serviceName += testSuffix;
    }
    if(!fs.existsSync(browserUpload)){
        checkDir(browserUpload);
    }
    var form = new multiparty.Form({uploadDir : browserUpload});
    form.parse(req, function(err, feilds, files){
        var file = files.fileName[0];
        var filePath = file.path;
        var saveName = uuid.v4() + '.cfg';
        var hdfsurl = HDFSPATH + saveName + '?op=CREATE&overwrite=true';
        var hdfs = request.put(hdfsurl);
        var uploadName = file.originalFilename;
        hdfs.on('response', function(response){
            if(307 == response.statusCode){
                var options = {
                    url : response.headers.location,
                    method : 'PUT',
                    headers : {
                        'User-Agent' : 'request',
                        'content-type' : 'application/octet-stream'
                    }
                };
                //给微服务发送消息，存储文件信息

                sendMsg.fileName = saveName;
                sendMsg.body = feilds;
                sendMsg.uploadName = uploadName;

                mqhd.sendMsg(serviceName, JSON.stringify(sendMsg), function(jsonData){
                    delete jsonData.url;
                    if(jsonData.body != undefined){
                        res.write(JSON.stringify(jsonData.body));
                    } else {
                        res.write(JSON.stringify(jsonData));
                    }
                    res.end();
                    console.log(CONST_LOG_HEAD + '  response data: ' + JSON.stringify(jsonData));
                });

                //把文件存储到hdfs上
                fs.createReadStream(filePath).pipe(request(options))
            } else {
                mqhd.sendMsg(serviceName, JSON.stringify(sendMsg), function(jsonData){

                    delete jsonData.url;
                    if(jsonData.body != undefined){
                        res.write(JSON.stringify(jsonData.body));
                    } else {
                        res.write(JSON.stringify(jsonData));
                    }
                    res.end();
                    console.log(CONST_LOG_HEAD + '  response data: ' + JSON.stringify(jsonData));
                });
            }
        })


        //传输结束时删除webserver上的缓存文件
        hdfs.on('end', function(){
            fs.unlink(filePath, function(err){
                if(err){
                    console.error(CONST_LOG_HEAD + 'Rm tempFile failed')
                }
                else {
                    console.log(CONST_LOG_HEAD + 'Rm tempFile success')
                }
            })
        })
    });

});

//下载文件
router.use('/getFileFromHDFS', function(req, res, next){
    var fileName = req.body.fileName;
    if(fileName){
        var hdfsurl = HDFSPATH + fileName + '?op=OPEN&permission=0777';
        var hdfs = request.get(hdfsurl);
        hdfs.on('response', function(response){
            if(200 == response.statusCode){
                hdfs.pipe(fs.createWriteStream(browserDownload + fileName))
            }
        });
        hdfs.on('end', function(){
            res.download(browserDownload + fileName, function(err){
                if(err){
                    console.log(CONST_LOG_HEAD + 'Download file  failed ! Error:' + err)
                } else {
                    fs.unlink(browserDownload + fileName, function(err){
                        if(err){
                            console.error(CONST_LOG_HEAD + 'Rm tempFile failed')
                        }
                        else {
                            console.log(CONST_LOG_HEAD + 'Rm tempFile success')
                        }
                    })
                }
            })
        })
    } else {
        res.end('This file is not exist')
    }


});


function checkDir(dir){
    var dirArr = dir.split('/');
    var tempDir = '';
    for(var i in dirArr){
        tempDir = tempDir + dirArr[i] + '/';
        if(!fs.existsSync(tempDir)){
            fs.mkdirSync(tempDir);
        }
    }
}


module.exports = router;


