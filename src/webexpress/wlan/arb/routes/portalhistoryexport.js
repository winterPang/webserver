var fs = require('fs'),
    uuid = require('uuid'),
    express = require('express'),
    request = require('request'),
    router = express.Router(),
    bodyparser = require('body-parser'),
    multiparty = require('multiparty'),
    config = require('wlanpub').config,
    hdfshd = require('wlanpub').hdfsoper,
    getHdfsOption = hdfshd.getHdfsOption,
    hdfsOpt = getHdfsOption('hdfsConnOption'),
    testSuffix = config.get('testSuffix'),
    basic = require('wlanpub').basic,
    mqhd = require('wlanpub').mqhd,
    serviceName = basic.serviceName.portalmonitor,
    FILEMODE = 0777;
var tar = require('tar-fs');
var async = require('wlanpub').async;
var downloadPath = "./localfs/v3/arb/portalHistory";
var browserdownloadPath = "../arb/portalHistory";
var CONST_LOG_HEAD = '[portalhistory]';
var HDFSPATH = 'http://' + hdfsOpt.host + ':' + hdfsOpt.port + hdfsOpt.path + 'portalHistory';
require('date-utils');
router.post('/getfilepath', function(req, res){
    var jsonData = req.body;
    var fileNames = [];
    if(jsonData && jsonData.diffTime){
        if(jsonData.diffTime > 7 * 24 * 3600){
            fileNames[0] = 'thisMonth.tar'
        } else if(jsonData.diffTime > 1 * 24 * 3600){
            fileNames[0] = 'thisWeek.tar';
        } else {
            fileNames[0] = new Date(Date.now() - 24 * 3600 * 1000).toFormat('YYYYMMDD') + '.tar';
        }
    } else if(jsonData && jsonData.startTime && jsonData.endTime){
        var temp = jsonData.startTime;
        while(temp < jsonData.endTime){
            fileNames.push(new Date(temp).toFormat('YYYYMMDD') + '.tar');
            temp = temp + 24 * 3600 * 1000;
        }
    } else {
        fileNames[0] = new Date(Date.now() - 24 * 3600 * 1000).toFormat('YYYYMMDD') + '.tar';
    }
    var folderNames = [];
    if(jsonData.devSN && (jsonData.devSN instanceof Array ) && jsonData.devSN.length != 0){
        folderNames = jsonData.devSN || [];
    }
    var browserTargetFilePath = null;
    var browserTargetFileName = null;
    if(fileNames.length == 1){
        browserTargetFileName = fileNames[0];
    } else {
        browserTargetFileName = fileNames[0].split(".")[0] + "-" + fileNames[fileNames.length - 1]
    }
    var path = null;
    if(folderNames.length == 1){
        path = browserdownloadPath + "/" + folderNames[0] + "/" + browserTargetFileName;
        if(fs.existsSync(path)){
            res.send({
                filePath : path,
                retCode : 0,
                message : 'file exist!'
            });
            res.end();
        } else {
            downloadFilesFromHDFS(folderNames, fileNames, null, function(err, browserFilename){
                res.send({
                    filePath : browserdownloadPath + browserFilename,
                    retCode : 0,
                    message : 'file exist!'
                });
                res.end();
            })
        }
    } else if(folderNames.length > 1 && jsonData.userName && jsonData.nasid){
        browserTargetFilePath = "/" + jsonData.nasid + "/" + jsonData.userName;
        path = browserdownloadPath + browserTargetFilePath + "/" + browserTargetFileName;
        if(fs.existsSync(path)){
            res.send({
                filePath : path,
                retCode : 0,
                message : 'file exist!'
            });
            res.end();
        } else {
            downloadFilesFromHDFS(folderNames, fileNames, browserTargetFilePath, function(err, browserFilename){
                res.send({
                    filePath : browserdownloadPath + browserFilename,
                    retCode : 0,
                    message : 'file exist!'
                });
                res.end();
            })
        }

    } else {
        res.send({retCode : 0, message : '请求参数错误'});
    }
    setTimeout(function(){
        for(var j in folderNames){
            deleteFolderRecursive(downloadPath + '/' + folderNames[j]);
        }
        if(folderNames.length>1){
            deleteFile(path);
        }
    }, 5 * 60 * 1000);
});
/*
 * params  folderNames文件夹名的数组（设备号的数据，下载多台设备下的记录） fileNames 文件名的数组（下载多天的文件）
 *当folderNames长度大于1时最终的打包文件放在browserFilePath下否则放在folderNames[0]+"/"下
 * 当fileNames的长度为1时不进行打包，否则对文件进行打包打包后的文件名为fileNames[0]+"-"+fileNames[fileNames.length-1]
 *
 * */
function downloadFilesFromHDFS(folderNames, fileNames, browserFilePath, callback){
    async.mapLimit(folderNames, 1, function(folderName, foldercb){
        async.mapLimit(fileNames, 10, function(fileName, filecb){
            var filePath = "/" + folderName + "/" + fileName;
            downloadFileFromHDFS(filePath, filePath, function(statusCode){
                filecb(statusCode);
            })
        }, function(downLoadErr){
            if(fileNames.length > 1){
                var targetFileName = fileNames[0].split(".")[0] + "-" + fileNames[fileNames.length - 1];
                packFile(downloadPath + "/" + folderName, fileNames, downloadPath + "/" + folderName, targetFileName, function(tarErr){
                    foldercb(tarErr, folderName + "/" + targetFileName)
                })
            } else {
                foldercb(downLoadErr, folderName + "/" + fileNames[0]);
            }
        })
    }, function(err, targetFileNames){
        if(folderNames.length > 1){
            var browserFileName = "";
            if(fileNames.length > 1){
                browserFileName = fileNames[0] + "-" + fileNames[fileNames.length - 1] + ".tar";
            } else {
                browserFileName = fileNames[0];
            }
            packFile(downloadPath, targetFileNames, downloadPath + "/" + browserFilePath, browserFileName, function(tarErr){
                callback(tarErr, browserFilePath + "/" + browserFileName)
            })
        } else {
            callback(err, targetFileNames[0])
        }
    })

}
//下载单个文件
function downloadFileFromHDFS(localFilePath, hdfsFilePath, callback){
    var tempLocalFilePath = downloadPath + localFilePath;
    var hdfsUrl = HDFSPATH + hdfsFilePath + '?op=OPEN';
    checkDir(tempLocalFilePath);
    var hdfs = request.get(hdfsUrl);
    var file = fs.createWriteStream(tempLocalFilePath);
    hdfs.on('response', function(response){
        console.warn('response.statusCode' + response.statusCode);
        if(200 == response.statusCode){
            hdfs.pipe(file);
        } else {
            callback(404);
            file.end();
            deleteFile(tempLocalFilePath);
        }
    });
    hdfs.on('end', function(){
        file.on('finish', function(){
            callback(200)
        })

    });
    hdfs.on('error', function(err){
        file.end();
        deleteFile(tempLocalFilePath);
        console.error("hdfs" + err);
        callback(404);
    })

}
//打包文件
function packFile(sourcePath, sourceFileNames, targetPath, targetFileName, callback){
    var tarPath = targetPath + "/" + targetFileName;
    var tempFileNames = getFilenames(sourcePath, sourceFileNames);
    if(tempFileNames.length > 0){
        var pack = tar.pack(sourcePath, {
            entries : tempFileNames
        });
        var writeStream = fs.createWriteStream(tarPath);
        pack.pipe(writeStream);
        writeStream.on('close', function(){
            callback(null);
        });
        writeStream.on('err', function(err){
            console.error("packFile failed! ERROR" + err);
            callback(err);
        })
    } else {
        callback("fileNames length is 0");
    }
}
//检查一组文件名，返回文件存在的文件名数组
function getFilenames(filePath, fileNames){
    var temp = [];
    var i = 0;
    if(fileNames instanceof Array){
        while(fileNames[i]){
            if(fs.existsSync(filePath + fileNames[i])){
                temp.push(fileNames[i]);
                i++;
            }
        }
        return temp;
    } else {
        return temp;
    }

}
//检查创建文件夹
function checkDir(dir){
    var dirArr = dir.split('/');
    var tempDir = '';
    for(var i in dirArr){
        tempDir = tempDir + dirArr[i] + '/';
        if(!fs.existsSync(tempDir)){
            fs.mkdirSync(tempDir, FILEMODE);
        }
    }
}

function deleteFolderRecursive(path){
    try{
        var files = [];
        if(fs.existsSync(path)){
            files = fs.readdirSync(path);
            files.forEach(function(file, index){
                var curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()){
                    deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    } catch (e) {
        console.error(CONST_LOG_HEAD + e);
    }
}
function deleteFile(path){
   if(fs.existsSync(path)){
        fs.unlinkSync(path);
    }
}

module.exports = router;
