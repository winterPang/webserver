var pub = require('../../../../lib/public');
var rollback = require('../controller/rollback');
var confpub = require('../controller/confpub');
var fileop = require('../lib/fileop');
var config = require('wlanpub').config;
var mqhd = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;
var dbhd = require('wlanpub').dbhd;
var user = require('wlanpub').user;
var express = require('express');
var fs = require('fs');
var conf = require('../../../../config');

var isDevBind2UserForWebserver = user.isDevBind2UserForWebserver;
var serviceName = basic.serviceName.read_rollback;
var router = express.Router();
var redisClient = dbhd.redisClient;

var suffix = '_test';

const ROLLBACK_REDIS_PREV = "rollbacksavecfg:";

const basePath = './localfs/';
const rollbackPath = './localfs/rollback/';
const rollbackDownloadPath = './localfs/rollback/download/';
const rollbackUploadPath = './localfs/rollback/upload/';
const CONST_HDFS_DIR = "rollback/";
const hdfsConnOption = conf.hdfsConnOption;
const CONST_LOG_HEAD = "[R_ROLLBACK][router] ";

/**
 *  errCode:
 *  0--->成功
 *  1--->消息格式问题，webserver无法解析
 *  2--->权限问题
 *  3--->设备端消息超时
 *  4--->主连接未找到
 *  5--->webserver内部逻辑错误
 *  6--->webserver与设备端通信异常
 *  7--->微服务消息处理错误
 *  8--->文件重复
 *  9--->文件未找到
 *  10-->设备消息处理错误
 */
const CONST_ERR_SUCCESS = 0;
const CONST_ERR_MSG_UNKNOWN = 1;
const CONST_ERR_PERMISSION = 2;
const CONST_ERR_DEV_TIMEOUT = 3;
const CONST_ERR_NO_MAIN_CONN = 4;
const CONST_ERR_WEBSERVER = 5;
const CONST_ERR_DEV_COMM = 6;
const CONST_ERR_SERVICE = 7;
const CONST_ERR_FILE_DUPLICATE = 8;
const CONST_ERR_FILE_NOT_FOUND = 9;
const CONST_ERR_DEVICE_PROC = 10;

/* 返回配置保存和配置回滚的消息结果 */
function sendRollbackResult2Explore(res, result, errCode, communicateResult, serviceResult, deviceResult, reason) {
  var msgExplore = {};

  msgExplore.result = result;
  msgExplore.errCode = errCode;

  /* 兼容旧版本实现 */
  msgExplore.communicateResult = communicateResult;
  msgExplore.serviceResult = serviceResult;
  msgExplore.deviceResult = deviceResult;
  msgExplore.reason = reason;

  res.end(JSON.stringify(msgExplore));
  //console.warn(CONST_LOG_HEAD + "send result to explore: %s", JSON.stringify(msgExplore));
}

/* 返回普通消息结果 */
function sendCommonResult2Explore(res, result, reason) {
  var msgExplore = {};

  msgExplore.result = result;
  msgExplore.reason = reason;

  res.end(JSON.stringify(msgExplore));
  //console.warn(CONST_LOG_HEAD + "send result to explore: %s", JSON.stringify(msgExplore));
}

function procGetFileStream(module, jsonExploreData, req, resp) {
  if (undefined == jsonExploreData.fileName
    || undefined == jsonExploreData.devSN) {
    resp.end();
    console.warn(CONST_LOG_HEAD + "procGetFileStream() message unknown");
    return;
  }
  var filename = jsonExploreData.fileName;

  var msgService = {};
  msgService.url = "/rollback";
  msgService.body = {};
  msgService.body.method = "isFileinfoExist";
  msgService.body.fileName = filename;
  msgService.body.devSN = jsonExploreData.devSN;

  mqhd.sendMsg(module, JSON.stringify(msgService), function (serviceData) {
    if (serviceData && "true" == serviceData.result) {
      var fop = new fileop(req, resp);
      fop.getFileFromHDFS(CONST_HDFS_DIR, filename, null);
    }
    else {
      resp.end();
      console.warn(CONST_LOG_HEAD + "file not find");
    }
  });
}

function procDelFileStream(module, jsonExploreData, req, resp) {
  if (undefined == jsonExploreData.fileName
    || undefined == jsonExploreData.devSN) {
    sendCommonResult2Explore(resp, "fail", "message unknown");
    console.warn(CONST_LOG_HEAD + "procDelFileStream() message unknown");

    return;
  }

  var filename = jsonExploreData.fileName;
  var msgService = {};
  msgService.url = "/rollback";
  msgService.body = {};
  msgService.body.method = "isFileinfoExist";
  msgService.body.fileName = filename;
  msgService.body.devSN = jsonExploreData.devSN;

  mqhd.sendMsg(module, JSON.stringify(msgService), function (serviceData) {
    if (serviceData && "true" == serviceData.result) {
      var fop = new fileop(req, resp);
      fop.delFileFromHDFS(CONST_HDFS_DIR, filename, function (result) {
        if ("success" == result) {
          var msgService = {};
          msgService.body = jsonExploreData;
          msgService.url = '/rollback';
          //console.warn(CONST_LOG_HEAD + "send msg to service: %s", JSON.stringify(msgService));
          mqhd.sendMsg(module, JSON.stringify(msgService), function (jsonRecv) {
            //console.warn(CONST_LOG_HEAD + "receive msg from service: %s", JSON.stringify(jsonRecv));
            sendCommonResult2Explore(resp, jsonRecv.result, jsonRecv.reason);
          });
        }
        else {
          console.warn(CONST_LOG_HEAD + "webserver process del file[%s] fail", filename);
          sendCommonResult2Explore(resp, "fail", "webserver internal error");
        }
      });
    }
    else {
      sendCommonResult2Explore(resp, "success", "");
    }
  });
}

/* 处理浏览器消息 */
router.post('/', function (req, resp) {
  console.warn(CONST_LOG_HEAD + "access /rollback ...");
  //console.warn(CONST_LOG_HEAD + "receive msg from explore: %s", JSON.stringify(req.body));

  function errProc(jsonRecv) {
    /* 配置保存、配置还原错误处理 */
    if (jsonRecv.deviceModule) {
      sendRollbackResult2Explore(resp, "fail", CONST_ERR_PERMISSION, "fail", "", "", "permission deny");
      return;
    }

    /* 浏览器获取配置文件内容错误处理 */
    if ("getFileStream" == jsonRecv.method) {
      resp.end();
      return;
    }

    /* 浏览器端其他消息错误处理 */
    sendCommonResult2Explore(resp, "fail", "permission deny");
  }

  if (!req.body) {
    console.warn(CONST_LOG_HEAD + "message unknown, drop this message");
    return;
  }

  var jsonData = req.body;
  var module = serviceName;
  if (req.session && req.session.bUserTest == 'true') {
    module = serviceName + suffix;
  }

  try {
    isDevBind2UserForWebserver(req.cookies, req.session, jsonData.devSN, function (err, bBinded) {
      if (!err && bBinded) {
        if (jsonData.deviceModule) {
          confpub.procMsgFromExplore(req, resp);
          return;
        }

        if ("getFileStream" == jsonData.method) {
          procGetFileStream(module, jsonData, req, resp);
          return;
        }

        if ("deleteCfg" == jsonData.method) {
          procDelFileStream(module, jsonData, req, resp);
          return;
        }

        var msgService = {};
        msgService.body = jsonData;
        msgService.url = '/rollback';

        //console.warn(CONST_LOG_HEAD + "send msg to rollback service: %s", JSON.stringify(msgService));
        mqhd.sendMsg(module, JSON.stringify(msgService), function (jsonRecv) {
          //console.warn(CONST_LOG_HEAD + "receive msg from service: %s", JSON.stringify(jsonRecv));
          sendCommonResult2Explore(resp, jsonRecv.result, jsonRecv.reason);
        });
      }
      else {
        errProc(jsonData);
      }
    });
  }
  catch (error) {
    console.warn(CONST_LOG_HEAD + "receive data from explore: %s", JSON.stringify(req.body));
    console.warn(CONST_LOG_HEAD + "process rollback except: %s", error);
  }
});

/* 处理设备文件下载 */
router.get('/download/*', function (req, resp) {
  console.warn(CONST_LOG_HEAD + "access /rollback/download...");
  try {
    var arr = req.url.split('/');
    var fileName = arr[2];

    if (undefined == fileName) {
      resp.end();
      console.warn(CONST_LOG_HEAD + "device download error: file name is undefined");
      return;
    }

    var fop = new fileop(req, resp);
    fop.getFileFromHDFS(CONST_HDFS_DIR, fileName, function (result) {
      if ("fail" == result) {
        console.warn(CONST_LOG_HEAD + "process download file[%s] to dev fail", fileName);
      }
    });
  }
  catch (err) {
    console.error(CONST_LOG_HEAD + "process download file to dev except: %s", err);
  }
});

function sendMsg2OtherWebserver(webserverAddress, result, fileName, fileSize, filePath) {
  var msgWebserver = {};

  msgWebserver.flag = "rollbacksavecfg";
  msgWebserver.url = "/rollback";
  msgWebserver.msgType = 2;
  msgWebserver.result = result;
  msgWebserver.body = {};
  msgWebserver.body.param = {};
  msgWebserver.body.param.fileName = fileName;
  msgWebserver.body.param.fileSize = fileSize;
  msgWebserver.body.param.filePath = filePath;

  mqhd.sendMsg(webserverAddress, JSON.stringify(msgWebserver));
  //console.warn(CONST_LOG_HEAD + "redirect rollback savecfg msg to another webserver: %s", JSON.stringify(msgWebserver));
}

function uploadToHDFS(req, fop, srcPath, fileName) {
  //console.warn(CONST_LOG_HEAD + "upload file path: %s, fileName: %s", srcPath, fileName);
  var module = serviceName;
  if (req.session && req.session.bUserTest == 'true') {
    module = serviceName + suffix;
  }

  var fileStat = fs.statSync(srcPath + fileName);
  var localaddress = basic.getLocalIP('eth', 'IPv4') + ':' + process.pid;

  fop.putFile2HDFS(CONST_HDFS_DIR, srcPath, fileName, function (result) {
    var redisKey = ROLLBACK_REDIS_PREV + fileName;

    if ("success" == result) {
      //console.warn(CONST_LOG_HEAD + "upload file[%s] to hdfs server success", fileName);
      redisClient.get(redisKey, function (err, webserveraddress) {
        redisClient.del(redisKey, function (error) {
          if (error) {
            console.warn(CONST_LOG_HEAD + "delete redisKey fail: %s", error);
          }
        });

        if (err || null == webserveraddress) {
          console.warn(CONST_LOG_HEAD + "get webserveraddress error: %s, redisKey: %s", err, redisKey);
          return;
        }

        if (localaddress == webserveraddress) {
          var rollbackData = rollback.rollbackMap.get(fileName);
          rollback.rollbackMap.delete(fileName);
          if (undefined == rollbackData
            || undefined == rollbackData.res
            || undefined == rollbackData.data) {
            console.warn(CONST_LOG_HEAD + "find no rollbackMap, maybe process file upload timeout");
            return;
          }

          var odata = rollbackData.data;
          var res = rollbackData.res;

          if (undefined != odata
            && undefined != odata.param
            && undefined != odata.param.fileName) {
            var sendMsg = {};
            sendMsg.body = odata;
            sendMsg.body.param.fileSize = fileStat.size;
            sendMsg.body.param.filePath = 'http://' + hdfsConnOption.host + ':' + hdfsConnOption.port + hdfsConnOption.path + CONST_HDFS_DIR + fileName + '?op=OPEN';
            sendMsg.url = "/rollback";

            console.warn(CONST_LOG_HEAD + "send msg to service: %s", JSON.stringify(sendMsg));
            mqhd.sendMsg(module, JSON.stringify(sendMsg), function (jsonData) {
              console.warn(CONST_LOG_HEAD + "receive msg from service: %s", JSON.stringify(jsonData));
              var errCode = ("success" == jsonData.result) ? CONST_ERR_SUCCESS : CONST_ERR_SERVICE;
              sendRollbackResult2Explore(res, jsonData.result, errCode, "success", jsonData.result, "success", jsonData.reason);
            });
          }
          return;
        }

        var filePath = 'http://' + hdfsConnOption.host + ':' + hdfsConnOption.port + hdfsConnOption.path + 'rollback/' + fileName + '?op=OPEN';
        sendMsg2OtherWebserver(webserveraddress, "success", fileName, fileStat.size, filePath);
      });
    }
    else {
      console.warn(CONST_LOG_HEAD + "webserver upload file[%s] to hdfs fail", fileName);

      redisClient.get(redisKey, function (err, webserveraddress) {
        redisClient.del(redisKey, function (error) {
          if (error) {
            console.warn(CONST_LOG_HEAD + "delete redisKey fail: %s", error);
          }
        });

        if (err || null == webserveraddress) {
          console.warn(CONST_LOG_HEAD + "get webserveraddress error: %s, redisKey: %s", err, redisKey);
          return;
        }

        if (localaddress == webserveraddress) {
          var rollbackData = rollback.rollbackMap.get(fileName);
          rollback.rollbackMap.delete(fileName);

          if (undefined == rollbackData
            || undefined == rollbackData.res
            || undefined == rollbackData.data) {
            console.warn(CONST_LOG_HEAD + "find no rollbackMap, maybe process file upload timeout");
            return;
          }

          var res = rollbackData.res;
          sendRollbackResult2Explore(res, "fail", CONST_ERR_WEBSERVER, "fail", "", "success", "webserver internal error");
          return;
        }

        sendMsg2OtherWebserver(webserveraddress, "fail", fileName, "", "");
      });
    }

    fs.unlink(srcPath + fileName, function (err) {
      if (err) {
        console.warn(CONST_LOG_HEAD + "rm file[%s] error: %s", srcPath + fileName, err);
      }
    });
  });
}

/* 处理设备文件上传 */
router.post('/upload', function (req, resp) {
  console.warn(CONST_LOG_HEAD + "access /rollback/upload...");
  try {
    resp.setTimeout(6000 * 1000);
    var fop = new fileop(req, resp);
    fop.getFileFromDev(rollbackUploadPath, function (result, fileName) {
      if ("success" != result) {
        console.warn(CONST_LOG_HEAD + "get file from dev fail");
        resp.statusCode = 400;
        resp.end();

        return;
      }

      uploadToHDFS(req, fop, rollbackUploadPath, fileName);
      resp.statusCode = 200;
      resp.end();
    });
  }
  catch (err) {
    resp.end();
    console.warn(CONST_LOG_HEAD + "process device upload file except: %s", err);
  }
});

router.all('/*', function (req, res, next) {
  res.status(404).end();
});

module.exports = router;