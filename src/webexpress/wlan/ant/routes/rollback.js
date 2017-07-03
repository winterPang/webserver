var pub = require("../../../../lib/public");
var rollback = require("../controller/rollback");
var confpub = require("../controller/confpub");
var fileop = require("../lib/fileop");
var config = require("wlanpub").config;
var mqhd = require("wlanpub").mqhd;
var basic = require("wlanpub").basic;
var dbhd = require("wlanpub").dbhd;
var user = require("wlanpub").user;
var express = require("express");
var fs = require("fs");
var util = require("util")
var conf = require("../../../../config");

var getDevPermission = user.getDevPermission;
var serviceName = basic.serviceName.rollback;
var router = express.Router();
var redisClient = dbhd.redisClient;

const ROLLBACK_REDIS_PREV = "rollbacksavecfg:";

const basePath = "./localfs/";
const rollbackPath = "./localfs/rollback/";
const rollbackDownloadPath = "./localfs/rollback/download/";
const rollbackUploadPath = "./localfs/rollback/upload/";
const CONST_HDFS_DIR = "rollback/";
const hdfsConnOption = conf.hdfsConnOption;

const CONST_LOG_HEAD = "[WEBSERVER][routers][rollback.js] rollbackDownCfg";


/**
 * errCode:
 * 0--->成功
 * 1--->消息格式问题，webserver无法解析
 * 2--->权限问题
 * 3--->设备端消息超时
 * 4--->主连接未找到
 * 5--->webserver内部逻辑错误
 * 6--->webserver与设备端通信异常
 * 7--->微服务消息处理错误
 * 8--->文件重复
 * 9--->文件未找到
 * 10-->设备消息处理错误
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

// =========================================================================分割线====================================================================
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, 0777);
}

if (!fs.existsSync(rollbackPath)) {
  fs.mkdirSync(rollbackPath, 0777);
}

if (!fs.existsSync(rollbackDownloadPath)) {
  fs.mkdirSync(rollbackDownloadPath, 0777);
}

if (!fs.existsSync(rollbackUploadPath)) {
  fs.mkdirSync(rollbackUploadPath, 0777);
}

// =========================================================================分割线====================================================================
function json2str(jsonData) {
  return JSON.stringify(jsonData);
}

// 返回配置保存和配置回滚的消息结果
function sendRollbackResult2Explore(res, jsonParam, rollbackPub) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in sendRollback2Explore()");
  // console.warn(CONST_LOG_HEAD + rollbackPub + " jsonParam is: " + JSON.stringify(jsonParam));

  var msgExplore = {};
  msgExplore.result = jsonParam.result;
  msgExplore.errCode = jsonParam.errCode;

  // 兼容旧版本实现
  msgExplore.communicateResult = jsonParam.communicateResult;
  msgExplore.serviceResult = jsonParam.serviceResult;
  msgExplore.deviceResult = jsonParam.deviceResult;
  msgExplore.reason = jsonParam.reason;

  console.warn(CONST_LOG_HEAD + rollbackPub + " send msgExplore to explore, msgExplore is: " + JSON.stringify(msgExplore));
  res.end(JSON.stringify(msgExplore));
}

// 返回普通消息结果
function sendCommonResult2Explore(res, jsonParam, rollbackPub) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in sendCommon2Explore()");
  // console.warn(CONST_LOG_HEAD + rollbackPub + " jsonParam is: " + JSON.stringify(jsonParam));

  var msgExplore = {};
  msgExplore.result = jsonParam.result;
  msgExplore.reason = jsonParam.reason;

  console.warn(CONST_LOG_HEAD + rollbackPub + " send msgExplore to explore, msgExplore is: " + JSON.stringify(msgExplore));
  res.end(JSON.stringify(msgExplore));
}

// =========================================================================分割线====================================================================
function procGetFileStream(jsonExploreData, req, res, rollbackPub) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in procGetFileStream()");
  console.warn(CONST_LOG_HEAD + rollbackPub + " jsonExploreData is: " + JSON.stringify(jsonExploreData));

  if (undefined == jsonExploreData.fileName || undefined == jsonExploreData.devSN) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " procGetFileStream() message unknown");

    var jsonParam = {};
    jsonParam.result = "fail";
    jsonParam.reason = "message unknown";
    sendCommonResult2Explore(res, jsonParam, rollbackPub);

    return;
  }

  var filename = jsonExploreData.fileName;

  var msgService = {};
  msgService.url = "/rollback";
  msgService.body = {};
  msgService.body.method = "isFileinfoExist";
  msgService.body.fileName = filename;
  msgService.body.devSN = jsonExploreData.devSN;

  console.warn(CONST_LOG_HEAD + rollbackPub + " send msgService to rollback service, msgService is: " + JSON.stringify(msgService));
  mqhd.sendMsg(serviceName, JSON.stringify(msgService), function (serviceData) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " receive serviceData from rollback service, serviceData is: " + JSON.stringify(serviceData));

    if (serviceData && "true" == serviceData.result) {
      var fop = new fileop(req, res);
      fop.getFileFromHDFS(CONST_HDFS_DIR, filename, rollbackPub, null);
    } else {
      console.warn(CONST_LOG_HEAD + rollbackPub + " file not find");
      res.end();
    }
  });
}

function procDelFileStream(jsonExploreData, req, res, rollbackPub) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in procDelFileStream()");
  console.warn(CONST_LOG_HEAD + rollbackPub + " jsonExploreData is: " + JSON.stringify(jsonExploreData));

  if (undefined == jsonExploreData.fileName || undefined == jsonExploreData.devSN) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " procDelFileStream() message unknown");

    var jsonParam = {};
    jsonParam.result = "fail";
    jsonParam.reason = "message unknown";
    sendCommonResult2Explore(res, jsonParam, rollbackPub);
    return;
  }

  var filename = jsonExploreData.fileName;
  var msgService = {};
  msgService.url = "/rollback";
  msgService.body = {};
  msgService.body.method = "isFileinfoExist";
  msgService.body.fileName = filename;
  msgService.body.devSN = jsonExploreData.devSN;

  console.warn(CONST_LOG_HEAD + rollbackPub + " send msgService to rollback service, method is: isFileinfoExist");
  mqhd.sendMsg(serviceName, JSON.stringify(msgService), function (serviceData) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " receive serviceData from rollback service, serviceData is: " + JSON.stringify(serviceData));

    // 数据库中成功找到文件名为fileName的配置文件信息, 执行删除流程
    if (serviceData && "true" == serviceData.result) {
      var fop = new fileop(req, res);
      // 在hdfs数据库中删除配置文件
      fop.delFileFromHDFS(CONST_HDFS_DIR, filename, rollbackPub, function (result) {
        if ("success" == result) {
          var msgService = {};
          msgService.body = jsonExploreData;
          msgService.url = "/rollback";

          console.warn(CONST_LOG_HEAD + rollbackPub + " send msgService to rollback service, msgService is: " + JSON.stringify(msgService));
          mqhd.sendMsg(serviceName, JSON.stringify(msgService), function (jsonRecv) {
            console.warn(CONST_LOG_HEAD + rollbackPub + " receive jsonRecv from rollback service, jsonRecv is: " + JSON.stringify(jsonRecv));

            var jsonParam = {};
            jsonParam.result = jsonRecv.result;
            jsonParam.reason = jsonRecv.reason;
            sendCommonResult2Explore(res, jsonParam, rollbackPub);
          });
        } else {
          console.warn(CONST_LOG_HEAD + rollbackPub + " webserver process del file[%s] fail", filename);

          var jsonParam = {};
          jsonParam.result = "fail";
          jsonParam.reason = "webserver internal error";
          sendCommonResult2Explore(res, jsonParam, rollbackPub);
        }
      });
    }
    // 数据库中没有文件名为fileName的文件信息, 表示数据库中不存在此配置文件, 不用删除, 返回给浏览器"成功"
    else {
      console.warn(CONST_LOG_HEAD + rollbackPub + " del file failed, return explore success, because the file is not existed");

      var jsonParam = {};
      jsonParam.result = "success";
      jsonParam.reason = "";
      sendCommonResult2Explore(res, jsonParam, rollbackPub);
    }
  });
}

// 处理浏览器消息
router.post("/", function (req, res) {
  if (!req.body || !req.body.devSN || !req.body.method) {
    console.warn(CONST_LOG_HEAD + "req.body is unknown, drop this msg");
    return;
  }

  var jsonData = req.body;
  var rollbackPub = req.body.devSN + req.body.method;

  console.warn(CONST_LOG_HEAD + rollbackPub + " access /rollback...");
  console.warn(CONST_LOG_HEAD + rollbackPub + " req.body is: " + JSON.stringify(req.body));

  console.warn(CONST_LOG_HEAD + rollbackPub + " req.cookies is: " + JSON.stringify(req.cookies)); //-->
  console.warn(CONST_LOG_HEAD + rollbackPub + " req.session is: " + JSON.stringify(req.session)); //-->

  function errProc(jsonRecv) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " access /rollback-->errProc()");

    // 配置保存、配置还原错误处理
    if (jsonRecv.deviceModule) {
      console.warn(CONST_LOG_HEAD + rollbackPub + " errProc(), jsonRecv.deviceModule is: " + JSON.stringify(req.body.method));

      var jsonParam = {};
      jsonParam.result = "fail";
      jsonParam.errCode = CONST_ERR_PERMISSION;
      jsonParam.communicateResult = "fail";
      jsonParam.serviceResult = "";
      jsonParam.deviceResult = "";
      jsonParam.reason = "permission deny";
      sendRollbackResult2Explore(res, jsonParam, rollbackPub);
      return;
    }

    // 浏览器获取配置文件内容错误处理
    if ("getFileStream" == jsonRecv.method) {
      console.warn(CONST_LOG_HEAD + rollbackPub + " errProc(), jsonRecv.method is: getFileStream");

      var jsonParam = {};
      jsonParam.result = "fail";
      jsonParam.reason = "permission deny";
      sendCommonResult2Explore(res, jsonParam, rollbackPub);
      return;
    }

    // 浏览器获取配置文件内容错误处理
    if ("deleteCfg" == jsonRecv.method) {
      console.warn(CONST_LOG_HEAD + rollbackPub + " errProc(), jsonRecv.method is: deleteCfg");

      var jsonParam = {};
      jsonParam.result = "fail";
      jsonParam.reason = "permission deny";
      sendCommonResult2Explore(res, jsonParam, rollbackPub);
      return;
    }

    // 浏览器端其他消息错误处理
    console.warn(CONST_LOG_HEAD + rollbackPub + " errProc(), unknown error from explore");

    var jsonParam = {};
    jsonParam.result = "fail";
    jsonParam.reason = "unknown error from explore";
    sendCommonResult2Explore(res, jsonParam, rollbackPub);
  }
  // 以上是错误处理函数

  try {
    getDevPermission(req.cookies, req.session, jsonData.devSN, function (result, errcode) {
      console.warn(CONST_LOG_HEAD + rollbackPub + " getDevPermission(), result is: %s, errcode is: %d", JSON.stringify(result), errcode);

      var maintenance_read = result && result.permission && result.permission.MAINTENANCE_READ;
      var maintenance_write = result && result.permission && result.permission.MAINTENANCE_WRITE;
      var maintenance_exec = result && result.permission && result.permission.MAINTENANCE_EXEC;

      // 此用户有权限
      if ((maintenance_exec || maintenance_read || maintenance_write) && (errcode != -1)) {
        console.warn(CONST_LOG_HEAD + rollbackPub + " getDevPermission() is success");

        // 处理method为 saveCfg, rollbackCfg 的浏览器消息
        if (jsonData.deviceModule) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " jsonData.deviceModule is: " + JSON.stringify(jsonData.deviceModule));
          console.warn(CONST_LOG_HEAD + rollbackPub + " jsonData.method is: " + JSON.stringify(jsonData.method));
          confpub.procMsgFromExplore(req, res);
          return;
        }

        // 处理method为 getFileStream, deleteCfg 的浏览器消息, 对hdfs数据库操作
        if ("getFileStream" == jsonData.method) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " jsonData.method is: getFileStream");
          procGetFileStream(jsonData, req, res, rollbackPub);
          return;
        }
        if ("deleteCfg" == jsonData.method) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " jsonData.method is: deleteCfg");
          procDelFileStream(jsonData, req, res, rollbackPub);
          return;
        }

        // 其他 method, 进微服务, 对mongodb数据库操作
        var msgService = {};
        msgService.body = jsonData;
        msgService.url = "/rollback";
        msgService.cookies = req.cookies;
        msgService.session = req.session;

        console.warn(CONST_LOG_HEAD + rollbackPub + " send msgService to rollback service, msgService is: " + JSON.stringify(msgService));
        mqhd.sendMsg(serviceName, JSON.stringify(msgService), function (jsonRecv) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " receive jsonRecv from rollback service, jsonRecv is: " + JSON.stringify(jsonRecv));

          var jsonParam = {};
          jsonParam.result = jsonRecv.result;
          jsonParam.reason = jsonRecv.reason;
          sendCommonResult2Explore(res, jsonParam, rollbackPub);
        });
      }
      // 此用户没有权限
      else {
        console.warn(CONST_LOG_HEAD + rollbackPub + " getDevPermission() is error");
        errProc(jsonData);
      }
    });
  } catch (error) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " receive req.body is: " + JSON.stringify(req.body));
    console.warn(CONST_LOG_HEAD + rollbackPub + " err is: " + error);
  }
});

// =========================================================================分割线====================================================================
// 处理设备文件下载
router.get("/download/*", function (req, res) {
  console.warn(CONST_LOG_HEAD + " ================================access /rollback/download...");

  try {
    var arr = req.url.split("/");
    var fileName = arr[2];

    if (undefined == fileName) {
      console.warn(CONST_LOG_HEAD + " device download error: fileName is undefined");

      res.end();
      return;
    }

    var aArr_devSN_time = [];
    var aArr_devSN_time = fileName.split("_");
    var devSN = aArr_devSN_time[0];
    var rollbackPub = devSN + "rollbackCfg";

    var fop = new fileop(req, res);
    fop.getFileFromHDFS(CONST_HDFS_DIR, fileName, rollbackPub, function (result) {
      if ("fail" == result) {
        console.warn(CONST_LOG_HEAD + rollbackPub + " failed to process download file[%s] to device", fileName);
      }
    });
  } catch (err) {
    console.error(CONST_LOG_HEAD + rollbackPub + " failed to process download cfgfile to device, error is: " + err);
  }
});

// =========================================================================分割线====================================================================
function sendMsg2OtherWebserver(webserveraddress, result, fileName, fileSize, filePath, rollbackPub) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in sendMsg2OtherWebserver()");

  console.warn(CONST_LOG_HEAD + rollbackPub + " param 1, webserveraddress is: " + webserveraddress);
  console.warn(CONST_LOG_HEAD + rollbackPub + " param 2, result is: " + result);
  console.warn(CONST_LOG_HEAD + rollbackPub + " param 3, fileName is: " + fileName);
  console.warn(CONST_LOG_HEAD + rollbackPub + " param 4, fileSize is: " + fileSize);
  console.warn(CONST_LOG_HEAD + rollbackPub + " param 5, filePath is: " + filePath);

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

  console.warn(CONST_LOG_HEAD + rollbackPub + " redirect msgWebserver to another webserver, msgWebserver is: " + JSON.stringify(msgWebserver));
  mqhd.sendMsg(webserveraddress, JSON.stringify(msgWebserver));
}

function uploadToHDFS(req, fop, srcPath, fileName, rollbackPub) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in uploadToHDFS(), upload file path: %s, fileName: %s", srcPath, fileName);

  var fileStat = fs.statSync(srcPath + fileName);
  var localaddress = basic.serviceName.webserver + ":" + basic.getLocalIP("eth", "IPv4") + ":" + process.pid;
  console.warn(CONST_LOG_HEAD + rollbackPub + " localaddress is: " + JSON.stringify(localaddress)); //-->

  fop.putFile2HDFS(CONST_HDFS_DIR, srcPath, fileName, rollbackPub, function (result) {
    var redisKey = ROLLBACK_REDIS_PREV + fileName;
    console.warn(CONST_LOG_HEAD + rollbackPub + " redisKey is: " + redisKey);

    // "success" == result
    if ("success" == result) {
      console.warn(CONST_LOG_HEAD + rollbackPub + " success to upload cfgfile[%s] to hdfs", fileName);

      console.warn(CONST_LOG_HEAD + rollbackPub + " get webserveraddress by redisKey");
      redisClient.get(redisKey, function (err, webserveraddress) {
        console.warn(CONST_LOG_HEAD + rollbackPub + " webserveraddress is: " + JSON.stringify(webserveraddress)); //-->

        console.warn(CONST_LOG_HEAD + rollbackPub + " delete redisKey");
        redisClient.del(redisKey, function (error) {
          if (error) {
            console.warn(CONST_LOG_HEAD + rollbackPub + " failed to delete redisKey, err is: " + error);
          }
          console.warn(CONST_LOG_HEAD + rollbackPub + " success to delete redisKey");
        });

        if (err || null == webserveraddress) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " failed to get webserveraddress, err is: " + err);
          return;
        }

        // 无需重定向
        if (localaddress == webserveraddress) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " localaddress == webserveraddress");

          var rollbackData = rollback.rollbackMap.get(fileName);
          // console.warn(CONST_LOG_HEAD + rollbackPub + " get rollbackData by fileName, rollbackData is: " + JSON.stringify(rollbackData)); //-->

          console.warn(CONST_LOG_HEAD + rollbackPub + " delete fileName");
          rollback.rollbackMap.delete(fileName);

          if (undefined == rollbackData || undefined == rollbackData.res || undefined == rollbackData.data) {
            console.warn(CONST_LOG_HEAD + rollbackPub + " rollbackMap is undefined, maybe process cfgfile upload timeout, now return");
            return;
          }

          var odata = rollbackData.data;
          var res = rollbackData.res;

          if (undefined != odata && undefined != odata.param && undefined != odata.param.fileName) {
            var sendMsg = {};
            sendMsg.body = odata;
            sendMsg.body.param.fileSize = fileStat.size;
            sendMsg.body.param.filePath = "http://" + hdfsConnOption.host + ":" + hdfsConnOption.port + hdfsConnOption.path + CONST_HDFS_DIR + fileName + "?op=OPEN";
            sendMsg.url = "/rollback";

            console.warn(CONST_LOG_HEAD + rollbackPub + " send sendMsg to rollback service, sendMsg is: " + JSON.stringify(sendMsg));
            mqhd.sendMsg(serviceName, JSON.stringify(sendMsg), function (jsonData) {
              console.warn(CONST_LOG_HEAD + rollbackPub + " receive JsonData from rollback service, jsonData is: " + JSON.stringify(jsonData));

              var errCode = ("success" == jsonData.result) ? CONST_ERR_SUCCESS : CONST_ERR_SERVICE;

              var jsonParam = {};
              jsonParam.result = jsonData.result;
              jsonParam.errCode = errCode;
              jsonParam.communicateResult = "success";
              jsonParam.serviceResult = jsonData.result;
              jsonParam.deviceResult = "success";
              jsonParam.reason = jsonData.reason;
              sendRollbackResult2Explore(res, jsonParam, rollbackPub);
            });
          } else {
            console.warn(CONST_LOG_HEAD + rollbackPub + " odata.param.fileName is undefined, now return");

            var jsonParam = {};
            jsonParam.result = "failed";
            jsonParam.errCode = CONST_ERR_WEBSERVER;
            jsonParam.communicateResult = "success";
            jsonParam.serviceResult = "failed";
            jsonParam.deviceResult = "success";
            jsonParam.reason = "fileName is undefined";
            sendRollbackResult2Explore(res, jsonParam, rollbackPub);

            return;
          }

        }

        // 需要重定向
        else {
          console.warn(CONST_LOG_HEAD + rollbackPub + " localaddress != webserveraddress");
          var filePath = "http://" + hdfsConnOption.host + ":" + hdfsConnOption.port + hdfsConnOption.path + "rollback/" + fileName + "?op=OPEN";
          sendMsg2OtherWebserver(webserveraddress, "success", fileName, fileStat.size, filePath, rollbackPub);
        }
      });
    }

    // "success" != result
    else {
      console.warn(CONST_LOG_HEAD + rollbackPub + " failed to upload cfgfile[%s] to hdfs", fileName);

      console.warn(CONST_LOG_HEAD + rollbackPub + " get webserveraddress by redisKey");
      redisClient.get(redisKey, function (err, webserveraddress) {
        console.warn(CONST_LOG_HEAD + rollbackPub + " webserveraddress is: " + JSON.stringify(webserveraddress)); //-->

        console.warn(CONST_LOG_HEAD + rollbackPub + " delete redisKey");
        redisClient.del(redisKey, function (error) {
          if (error) {
            console.warn(CONST_LOG_HEAD + rollbackPub + " failed to delete redisKey, err is: " + error);
          }
          console.warn(CONST_LOG_HEAD + rollbackPub + " success to delete redisKey");
        });

        if (err || null == webserveraddress) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " failed to get webserveraddress, err is: " + err);
          return;
        }

        // 无需重定向
        if (localaddress == webserveraddress) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " localaddress == webserveraddress");

          var rollbackData = rollback.rollbackMap.get(fileName);
          // console.warn(CONST_LOG_HEAD + rollbackPub + " get rollbackData by fileName, rollbackData is: " + JSON.stringify(rollbackData));  //-->

          console.warn(CONST_LOG_HEAD + rollbackPub + " delete fileName");
          rollback.rollbackMap.delete(fileName);

          if (undefined == rollbackData || undefined == rollbackData.res || undefined == rollbackData.data) {
            console.warn(CONST_LOG_HEAD + rollbackPub + " rollbackMap is undefined, maybe process cfgfile upload timeout");
            return;
          }

          var res = rollbackData.res;

          var jsonParam = {};
          jsonParam.result = "fail";
          jsonParam.errCode = CONST_ERR_WEBSERVER;
          jsonParam.communicateResult = "fail";
          jsonParam.serviceResult = "";
          jsonParam.deviceResult = "success";
          jsonParam.reason = "webserver internal error";
          sendRollbackResult2Explore(res, jsonParam, rollbackPub);
          return;
        }

        // 需要重定向
        else {
          console.warn(CONST_LOG_HEAD + rollbackPub + " localaddress != webserveraddress");
          sendMsg2OtherWebserver(webserveraddress, "fail", fileName, "", "", rollbackPub);
        }
      });
    }

    console.warn(CONST_LOG_HEAD + rollbackPub + " now call fs.unlink()");
    fs.unlink(srcPath + fileName, function (err) {
      if (err) {
        console.warn(CONST_LOG_HEAD + rollbackPub + " failed to rm file[%s], err: %s", srcPath + fileName, err);
      }
      console.warn(CONST_LOG_HEAD + rollbackPub + " success to rm file[%s]", srcPath + fileName);
    });
  });
}

// 处理设备文件上传
router.post("/upload", function (req, res) {
  console.warn(CONST_LOG_HEAD + " ================================access /rollback/upload...");

  try {
    res.setTimeout(6000 * 1000);
    var fop = new fileop(req, res);
    fop.getFileFromDev(rollbackUploadPath, function (result, fileName) {
      var aArr_devSN_time = [];
      var aArr_devSN_time = fileName.split("_");
      var devSN = aArr_devSN_time[0];
      var rollbackPub = devSN + "saveCfg";
      console.warn(CONST_LOG_HEAD + " upload rollbackPub is: " + rollbackPub);

      if ("success" != result) {
        console.warn(CONST_LOG_HEAD + rollbackPub + " failed to get file from device, now return");
        res.statusCode = 400;
        res.end();

        return;
      }

      uploadToHDFS(req, fop, rollbackUploadPath, fileName, rollbackPub);
      res.statusCode = 200;
      res.end();
    });
  } catch (err) {
    res.end();
    console.warn(CONST_LOG_HEAD + rollbackPub + " process device upload file except, err is: " + err);
  }
});

// =========================================================================分割线====================================================================
router.all("/*", function (req, res, next) {
  res.status(404).end();
});

module.exports = router;