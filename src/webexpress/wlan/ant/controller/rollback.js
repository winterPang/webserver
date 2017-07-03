/*
 * 本文件是配置下发、配置平滑、配置代理、配置回滚的公共文件
 * */
var mqhd = require("wlanpub").mqhd;
var basic = require("wlanpub").basic;
var dbhd = require("wlanpub").dbhd;
var connectionModel = require("wlanpub").connectionModel;
var uuid = require("uuid");
var pub = require("../lib/public");
var conf = require("../../../../config");
var util = require("util")

var service_url = conf.url.service_url;

var serviceRollback = basic.serviceName.rollback;
var redisClient = dbhd.redisClient;

const CONST_DEFAULT_INTERVAL = 5 * 1000; //定时器默认间隔，以毫秒为单位
const CONST_SEQNUM_MAX = 2147483648; //消息序列号最大值，2^31
const CONST_CFGMSG_TYPE = 3; //3代表配置管理消息-- WebSocket识别的消息类型

// rollback文件上传与下载url
const CONST_ROLLBACK_UPLOAD = service_url + "/v3/ant/rollback";
const CONST_ROLLBACK_DOWNLOAD = service_url + "/v3/ant/rollback/download";
// const CONST_ROLLBACK_UPLOAD = "https://lvzhouv3.h3c.com/v3/ant/rollback";
// const CONST_ROLLBACK_DOWNLOAD = "https://lvzhouv3.h3c.com/v3/ant/rollback/download";

const ROLLBACK_REDIS_PREV = "rollbacksavecfg:";
const CONST_REDIS_MAX = 60 * 60; //redis数据库数据最大生存时间

const CONST_LOG_HEAD = "[WEBSERVER][controller][rollback.js] rollbackDownCfg";

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
function json2str(jsonData) {
  return JSON.stringify(jsonData);
}

function sendResult2Explore(res, jsonParam, rollbackPub) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in sendResult2Explore()");
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

function jsonCopy(dstData, srcData) {
  for (var key in srcData) {
    dstData[key] = srcData[key];
  }
}

function Rollback() {
  this.cfgSeqNum = 0;
  this.cfgMap = new Map();
  this.rollbackMap = new Map();
}

function getCmdSeqNum() {
  rollback.cfgSeqNum++;

  if (CONST_SEQNUM_MAX == rollback.cfgSeqNum) {
    rollback.cfgSeqNum = 1;
  }

  return rollback.cfgSeqNum;
}

function encapCfgMsg2Device(seqNum, jsonData, rollbackPub, cb) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in encapCfg2Device()");

  var devMsg = {};

  jsonCopy(devMsg, jsonData);
  devMsg.seqNumber = seqNum;
  devMsg.optType = CONST_CFGMSG_TYPE;
  devMsg.uuid = uuid.v1();
  devMsg.devModName = "cmtnlmgr";
  devMsg.cloudModName = "base";

  connectionModel.getSessionidByDevSN(jsonData.devSN, function (err, sessionid) {
    if (err || null == sessionid) {
      devMsg.tokenID = "";
    } else {
      devMsg.tokenID = sessionid;
    }
    cb(devMsg);
  });
}

function sendCfgMsg2Device(seqNum, jsonDevData, connection, rollbackPub, cbErrProc) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in sendCfgMsg2Device()");

  encapCfgMsg2Device(seqNum, jsonDevData, rollbackPub, function (devMsg) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " encapCfgMsg2Device callback function");

    console.warn(CONST_LOG_HEAD + rollbackPub + " sendUTF to device, devMsg is: " + JSON.stringify(devMsg));
    connection.sendUTF(JSON.stringify(devMsg)); //sendUTF

    var timeInterval = CONST_DEFAULT_INTERVAL;
    var timeTemp = jsonDevData.cfgTimeout ? Number(jsonDevData.cfgTimeout) * 1000 : 0;
    if (timeTemp > CONST_DEFAULT_INTERVAL) {
      timeInterval = timeTemp;
    }
    console.warn(CONST_LOG_HEAD + rollbackPub + " send cfg msg to device timeout interval is: " + timeInterval);

    setTimeout(function () {
      console.warn(CONST_LOG_HEAD + rollbackPub + " sendCfgMsg2Device()-->setTimeout()");

      var data = rollback.cfgMap.get(seqNum);

      if (undefined != data) {
        console.warn(CONST_LOG_HEAD + rollbackPub + " cannot get data by seqNum, seqNum is: " + seqNum);

        console.warn(CONST_LOG_HEAD + rollbackPub + " delete seqNum");
        rollback.cfgMap.delete(seqNum);

        if ("saveCfg" == data.method && undefined != data.param && undefined != data.param.fileName) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " data.method is: saveCfg");

          var rollbackKey = data.param.fileName;
          console.warn(CONST_LOG_HEAD + rollbackPub + " delete rollbackKey: " + JSON.stringify(rollbackKey));
          rollback.rollbackMap.delete(rollbackKey);

          var redisKey = ROLLBACK_REDIS_PREV + rollbackKey;
          console.warn(CONST_LOG_HEAD + rollbackPub + " delete redisKey: " + JSON.stringify(redisKey));
          redisClient.del(redisKey, function (err) {
            if (err) {
              console.warn(CONST_LOG_HEAD + rollbackPub + " sendCfgMsg2Device redis delete error, err is: %s, key is: %s", err, redisKey);
            }
            console.warn(CONST_LOG_HEAD + rollbackPub + " success to delete redisKey");
          });
        }
        // errProcReason(reason)
        cbErrProc("device not response, timeout");
      }
    }, timeInterval);
  });
}

// =========================================================================分割线====================================================================
Rollback.prototype.procRedirectMsg2Device = function (jsonRecv, deliveryInfo) {
  console.warn(CONST_LOG_HEAD + " come in Rollback.prototype.procRedirectMsg2Device()");
  console.warn(CONST_LOG_HEAD + " receive redirect msg from another webserver, jsonRecv is: " + JSON.stringify(jsonRecv));

  var rollbackPub = jsonRecv.data.devSN + jsonRecv.data.method;

  function errProcReason(reason) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " procRedirectMsg2Device()-->errProcReason()");

    var replyRedirectMsg = {};
    replyRedirectMsg.url = "/confmgrlb";
    replyRedirectMsg.communicateResult = "fail";
    replyRedirectMsg.reason = reason;
    replyRedirectMsg.data = jsonRecv.data;

    if ("webserver internal error" == reason) {
      replyRedirectMsg.errCode = CONST_ERR_WEBSERVER;
    } else if ("main connection is not found" == reason) {
      replyRedirectMsg.errCode = CONST_ERR_NO_MAIN_CONN;
    } else {
      replyRedirectMsg.errCode = CONST_ERR_DEV_TIMEOUT;
    }

    console.warn(CONST_LOG_HEAD + rollbackPub + " errProcReason(), send replyRedirectMsg to explore, replyRedirectMsg is: " + JSON.stringify(replyRedirectMsg));
    mqhd.replyMsg(JSON.stringify(replyRedirectMsg), deliveryInfo);
  }

  if (!jsonRecv || !jsonRecv.data) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " receive redirect message err, jsonRecv is: " + JSON.stringify(jsonRecv));
    errProcReason("webserver internal error");
    return;
  }

  var jsonData = jsonRecv.data;
  console.warn(CONST_LOG_HEAD + rollbackPub + " getMainConnection AGAIN");
  pub.getMainConnection(jsonData.devSN, function (connection) {
    if (!connection) {
      console.warn(CONST_LOG_HEAD + rollbackPub + " failed to getMainConnection, devSN is:" + jsonData.devSN);
      errProcReason("main connection is not found");
      return;
    }

    console.warn(CONST_LOG_HEAD + rollbackPub + " success to getMainConnection() by redirect");

    var mapData = {};
    mapData.data = jsonData;
    mapData.deliveryInfo = deliveryInfo;

    var seqNum = getCmdSeqNum();
    rollback.cfgMap.set(seqNum, mapData);

    sendCfgMsg2Device(seqNum, jsonData, connection, rollbackPub, errProcReason);
  });
};

Rollback.prototype.procRedirectRollbackSaveCfg = function (jsonRecv) {
  console.warn(CONST_LOG_HEAD + " come in Rollback.prototype.procRedirectRollbackSaveCfg()");
  console.warn(CONST_LOG_HEAD + " receive jsonRecv from another webserver, jsonRecv is: " + JSON.stringify(jsonRecv));

  var aArr_devSN_time = [];
  var aArr_devSN_time = jsonRecv.body.param.fileName.split("_");
  var devSN = aArr_devSN_time[0];

  var rollbackPub = devSN + "saveCfg";

  // 参数正确
  if (jsonRecv && jsonRecv.body && jsonRecv.body.param && jsonRecv.body.param.fileName) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " delete jsonRecv.flag");
    delete jsonRecv.flag;

    var rollbackKey = jsonRecv.body.param.fileName;
    console.warn(CONST_LOG_HEAD + rollbackPub + " rollbackKey is: " + rollbackKey);
    var mapData = rollback.rollbackMap.get(rollbackKey);
    // console.warn(CONST_LOG_HEAD + rollbackPub + " mapData is: " + JSON.stringify(mapData));

    rollback.rollbackMap.delete(rollbackKey);

    if (!mapData || !mapData.data || !mapData.res) {
      console.warn(CONST_LOG_HEAD + rollbackPub + " mapData is error, maybe timeout, now return");
      return;
    }

    var res = mapData.res;
    var jsonData = mapData.data;

    if ("fail" == jsonRecv.result) {
      console.warn(CONST_LOG_HEAD + rollbackPub + " jsonRecv.result is fail");

      var jsonParam = {};
      jsonParam.result = "fail";
      jsonParam.errCode = CONST_ERR_WEBSERVER;
      jsonParam.communicateResult = "success";
      jsonParam.serviceResult = "";
      jsonParam.deviceResult = "fail";
      jsonParam.reason = "webserver internal error";
      sendResult2Explore(res, jsonParam, rollbackPub);

    } else {
      console.warn(CONST_LOG_HEAD + rollbackPub + " jsonRecv.result is success");

      var msgService = jsonRecv;
      console.warn(CONST_LOG_HEAD + rollbackPub + " delete jsonData.param");
      delete jsonData.param;
      console.warn(CONST_LOG_HEAD + rollbackPub + " copy jsonData to msgServcie.body");
      jsonCopy(msgService.body, jsonData);
      msgService.url = "/rollback";

      console.warn(CONST_LOG_HEAD + rollbackPub + " send msgService to rollback service, msgServcie is: " + JSON.stringify(msgService));
      mqhd.sendMsg(serviceRollback, JSON.stringify(msgService), function (jsonData) {
        console.warn(CONST_LOG_HEAD + rollbackPub + " receive jsonData from rollback service, jsonData is: " + JSON.stringify(jsonData));

        var errCode = ("success" == jsonData.result) ? CONST_ERR_SUCCESS : CONST_ERR_SERVICE;

        var jsonParam = {};
        jsonParam.result = jsonData.result;
        jsonParam.errCode = errCode;
        jsonParam.communicateResult = "success";
        jsonParam.serviceResult = jsonData.result;
        jsonParam.deviceResult = "success";
        jsonParam.reason = jsonData.reason;
        sendResult2Explore(res, jsonParam, rollbackPub);
      });
    }
  }
  // 参数错误
  else {
    console.warn(CONST_LOG_HEAD + rollbackPub + " param is error, jsonRecv.body.param.fileName is not exist");

    var jsonParam = {};
    jsonParam.result = "fail";
    jsonParam.errCode = CONST_ERR_WEBSERVER;
    jsonParam.communicateResult = "success";
    jsonParam.serviceResult = "";
    jsonParam.deviceResult = "";
    jsonParam.reason = "param error";
    sendResult2Explore(res, jsonParam, rollbackPub);
  }
};

// =========================================================================分割线====================================================================
function procMainConnectionUndefined(jsonDevData, res, rollbackPub) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in procMainConnectionUndefined()");
  console.warn(CONST_LOG_HEAD + rollbackPub + " jsonDevData is: " + JSON.stringify(jsonDevData));

  function errProc(jsonErrParam) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " procMainConnectionUndefined()-->errProc()");
    console.warn(CONST_LOG_HEAD + rollbackPub + " jsonErrParam is: " + JSON.stringify(jsonErrParam));

    var jsonParam = {};
    jsonParam.result = "fail";
    jsonParam.errCode = jsonErrParam.errCode;
    jsonParam.reason = jsonErrParam.reason;
    jsonParam.communicateResult = jsonErrParam.boolComm;
    jsonParam.serviceResult = jsonErrParam.boolService;
    jsonParam.deviceResult = jsonErrParam.boolDev;
    sendResult2Explore(res, jsonParam, rollbackPub);

    // rollback的saveCfg方法需要特殊处理
    if ("saveCfg" == jsonErrParam.jsonData.method &&
      undefined != jsonErrParam.jsonData.param && undefined != jsonErrParam.jsonData.param.fileName) {

      var rollbackKey = jsonErrParam.jsonData.param.fileName;
      console.warn(CONST_LOG_HEAD + rollbackPub + " delete rollbackKey: " + JSON.stringify(rollbackKey));
      rollback.rollbackMap.delete(rollbackKey);

      var redisKey = ROLLBACK_REDIS_PREV + rollbackKey;
      console.warn(CONST_LOG_HEAD + rollbackPub + " delete redisKey: " + JSON.stringify(redisKey));
      redisClient.del(redisKey, function (err) {
        if (err) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " failed to delete redisKey, err is: " + err);
        }
        console.warn(CONST_LOG_HEAD + rollbackPub + " success to delete redisKey");
      });
    }
  }
  // 以上是错误处理函数

  connectionModel.getWebserverAddress(jsonDevData.devSN, "cmtnlmgr", "base", function (err, serverAddress) {
    if (err || serverAddress == null) { //未成功获取主连接地址
      console.warn(CONST_LOG_HEAD + rollbackPub + " can not getWebserverAddress(), devSN is: " + jsonDevData.devSN);

      var jsonErrParam = {};
      jsonErrParam.errCode = CONST_ERR_NO_MAIN_CONN;
      jsonErrParam.reason = "main connection is not found";
      jsonErrParam.jsonData = jsonDevData;
      jsonErrParam.boolComm = "fail";
      jsonErrParam.boolDev = "";
      jsonErrParam.boolService = "";

      errProc(jsonErrParam);

    } else { //成功获取主连接地址
      console.warn(CONST_LOG_HEAD + rollbackPub + " success to getWebserverAddress(), serverAddress is: " + serverAddress);

      var msgWebserver = {};
      msgWebserver.url = "/confmgrlb";
      msgWebserver.msgType = 2; //发给另一个webserver的重定向消息
      msgWebserver.data = jsonDevData;

      console.warn(CONST_LOG_HEAD + rollbackPub + " redirect msgWebserver to another webserver, msgWebserver is: " + JSON.stringify(msgWebserver));
      mqhd.sendMsg(serverAddress, JSON.stringify(msgWebserver), function (jsonRecv) {
        console.warn(CONST_LOG_HEAD + rollbackPub + " receive jsonRecv from another webserver, jsonRecv is: " + JSON.stringify(jsonRecv));

        if (!jsonRecv || !jsonRecv.data) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " jsonRecv is error, jsonRecv is: " + JSON.stringify(jsonRecv));

          var jsonErrParam = {};
          jsonErrParam.errCode = CONST_ERR_WEBSERVER;
          jsonErrParam.reason = "webserver internal error";
          jsonErrParam.jsonData = jsonDevData;
          jsonErrParam.boolComm = "fail";
          jsonErrParam.boolDev = "";
          jsonErrParam.boolService = "";

          errProc(jsonErrParam);

          return;
        }

        // 重定向后获取主链接后, 连接成功
        if ("success" == jsonRecv.msgCfgReturn) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " jsonRecv.msgCfgReturn is success");
          console.warn(CONST_LOG_HEAD + rollbackPub + " delete jsonRecv.msgCfgReturn");
          delete jsonRecv.msgCfgReturn;

          // 设备端返回的执行结果是success
          if (jsonRecv.results && "success" == jsonRecv.results.result) {
            console.warn(CONST_LOG_HEAD + rollbackPub + " jsonRecv.results.result is success");

            // 保存配置文件, 此时不回应浏览器结果
            if ("saveCfg" == jsonRecv.data.method) {
              console.warn(CONST_LOG_HEAD + rollbackPub + " jsonRecv.data.method is: saveCfg, procSaveCfg success with balance");
            }
            // 回滚配置, 返回给浏览器结果
            else if ("rollbackCfg" == jsonRecv.data.method) {
              console.warn(CONST_LOG_HEAD + rollbackPub + " jsonRecv.data.method is: rollbackCfg");

              var msgService = {};
              msgService.body = jsonRecv.data;
              msgService.url = "/rollback";

              console.warn(CONST_LOG_HEAD + rollbackPub + " send msgServcie to rollback service, msgServcie is: " + JSON.stringify(msgService));
              mqhd.sendMsg(serviceRollback, JSON.stringify(msgService), function (serviceData) {
                console.warn(CONST_LOG_HEAD + rollbackPub + " receive serviceData from rollback service, serviceData is: " + JSON.stringify(serviceData));

                var errCode = ("success" == serviceData.result) ? CONST_ERR_SUCCESS : CONST_ERR_SERVICE;

                var jsonParam = {};
                jsonParam.result = serviceData.result;
                jsonParam.errCode = errCode;
                jsonParam.reason = serviceData.reason;
                jsonParam.communicateResult = "success";
                jsonParam.serviceResult = serviceData.result;
                jsonParam.deviceResult = "success";
                sendResult2Explore(res, jsonParam, rollbackPub);
              });
            }
          }
          // 设备端返回的执行结果是failed
          else {
            console.warn(CONST_LOG_HEAD + rollbackPub + " jsonRecv.results.result is fail");

            var reason = "device proc rollback fail";
            if (jsonRecv.results && jsonRecv.results.errInfo) {
              reason = jsonRecv.results.errInfo;
            }

            var jsonErrParam = {};
            jsonErrParam.errCode = CONST_ERR_DEV_COMM;
            jsonErrParam.reason = reason;
            jsonErrParam.jsonData = jsonRecv.data;
            jsonErrParam.boolComm = "success";
            jsonErrParam.boolDev = "fail";
            jsonErrParam.boolService = "";

            errProc(jsonErrParam);
          }
        }
        // 重定向后获取主链接后, 连接失败
        else {
          console.warn(CONST_LOG_HEAD + rollbackPub + " jsonRecv.msgCfgReturn is fail, communicate with device error");

          var errCode = jsonRecv.errCode ? jsonRecv.errCode : CONST_ERR_DEV_COMM;

          var jsonErrParam = {};
          jsonErrParam.errCode = errCode;
          jsonErrParam.reason = "communicate with device error";
          jsonErrParam.jsonData = jsonRecv.data;
          jsonErrParam.boolComm = "fail";
          jsonErrParam.boolDev = "fail";
          jsonErrParam.boolService = "";

          errProc(jsonErrParam);
        }
      });
    }
  });
}

function procExploreSaveCfg(jsonDevData, res, rollbackPub) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in procExploreSaveCfg()");

  function errProcReason(reason) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " procExploreSaveCfg()-->errProcReason()");

    var jsonParam = {};
    jsonParam.result = "fail";
    jsonParam.errCode = CONST_ERR_DEV_TIMEOUT;
    jsonParam.communicateResult = "fail";
    jsonParam.serviceResult = "";
    jsonParam.deviceResult = "";
    jsonParam.reason = reason;

    sendResult2Explore(res, jsonParam, rollbackPub);
  }
  // 以上是错误处理函数

  if (!jsonDevData.param || !jsonDevData.param.fileName || undefined == jsonDevData.devSN) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " jsonDevData.param is error, jsonDevData is: " + JSON.stringify(jsonDevData));

    var jsonParam = {};
    jsonParam.result = "fail";
    jsonParam.errCode = CONST_ERR_MSG_UNKNOWN;
    jsonParam.reason = "message unknown";
    jsonParam.communicateResult = "";
    jsonParam.deviceResult = "";
    jsonParam.serviceResult = "";

    sendResult2Explore(res, jsonParam, rollbackPub);

    return;
  }

  var msgService = {};
  msgService.url = "/rollback";
  msgService.body = {};
  msgService.body.method = "isFileinfoExist";
  msgService.body.fileName = jsonDevData.param.fileName;
  msgService.body.devSN = jsonDevData.devSN;

  console.warn(CONST_LOG_HEAD + rollbackPub + " send msgService to rollback service, msgServcie.body.method is: isFileinfoExist");
  mqhd.sendMsg(serviceRollback, JSON.stringify(msgService), function (serviceData) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " receive serviceData from rollback service, serviceData is: " + JSON.stringify(serviceData));

    // 数据库中已经存在此文件名
    if (serviceData && "true" == serviceData.result) {
      console.warn(CONST_LOG_HEAD + rollbackPub + " serviceData.result is true, the cfgfile fileName has existed");

      var jsonParam = {};
      jsonParam.result = "fail";
      jsonParam.errCode = CONST_ERR_FILE_DUPLICATE;
      jsonParam.reason = "file duplicate";
      jsonParam.communicateResult = "";
      jsonParam.deviceResult = "";
      jsonParam.serviceResult = "";

      sendResult2Explore(res, jsonParam, rollbackPub);
    }
    // 数据库中没有此文件名
    else {
      console.warn(CONST_LOG_HEAD + rollbackPub + " the cfgfile fileName not existed, now start save cfgfile");

      jsonDevData.param.downloadUrl = CONST_ROLLBACK_UPLOAD;
      jsonDevData.param.curlTimeout = jsonDevData.cfgTimeout;
      console.warn(CONST_LOG_HEAD + rollbackPub + " jsonDevData is: " + JSON.stringify(jsonDevData));

      var mapData = {};
      mapData.data = jsonDevData;
      mapData.res = res;

      var rollbackKey = jsonDevData.param.fileName;
      // rollbackMap比较特殊，用于保存设备文件上传信息
      rollback.rollbackMap.set(rollbackKey, mapData);
      var redisKey = ROLLBACK_REDIS_PREV + rollbackKey;
      var webserveraddress = basic.serviceName.webserver + ":" + basic.getLocalIP("eth", "IPv4") + ":" + process.pid;

      console.warn(CONST_LOG_HEAD + rollbackPub + " save webserveraddress by redisKey, redisKey is: " + JSON.stringify(redisKey)); //-->
      console.warn(CONST_LOG_HEAD + rollbackPub + " webserveraddress is: " + JSON.stringify(webserveraddress)); //-->
      redisClient.set(redisKey, webserveraddress, function (err) {
        // 通过key保存webserveraddress成功
        if (!err) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " success to save webserveraddress by redisKey");
          // 设置键的有效时长
          console.warn(CONST_LOG_HEAD + rollbackPub + " redisKey expiration is: " + CONST_REDIS_MAX);
          redisClient.expire(redisKey, CONST_REDIS_MAX);

          pub.getMainConnection(jsonDevData.devSN, function (connection) {
            if (!connection) {
              console.warn(CONST_LOG_HEAD + rollbackPub + " can not getMainConnection()");
              procMainConnectionUndefined(jsonDevData, res, rollbackPub);
              return;
            }
            console.warn(CONST_LOG_HEAD + rollbackPub + " success to getMainConnection()");

            var seqNum = getCmdSeqNum();
            console.warn(CONST_LOG_HEAD + rollbackPub + " set seqNum for mapData, seqNum is: " + seqNum);
            // console.warn(CONST_LOG_HEAD + rollbackPub + " set seqNum for mapData, mapData is: " + JSON.stringify(mapData));
            rollback.cfgMap.set(seqNum, mapData);

            sendCfgMsg2Device(seqNum, jsonDevData, connection, rollbackPub, errProcReason);
          });
        }
        // 通过key保存webserveraddress失败
        else {
          console.warn(CONST_LOG_HEAD + rollbackPub + " failed to save webserveraddress by redisKey, err: " + err);

          var jsonParam = {};
          jsonParam.result = "fail";
          jsonParam.errCode = CONST_ERR_WEBSERVER;
          jsonParam.communicateResult = "";
          jsonParam.serviceResult = "";
          jsonParam.deviceResult = "";
          jsonParam.reason = "webserver internal error";

          sendResult2Explore(res, jsonParam, rollbackPub);
        }
      });
    }
  });
}

function procExploreRollbackCfg(jsonDevData, res, rollbackPub) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in procExploreRollbackCfg()");

  function errProcReason(reason) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " procExploreRollbackCfg()-->errProcReason()");

    var jsonParam = {};
    jsonParam.result = "fail";
    jsonParam.errCode = CONST_ERR_DEV_TIMEOUT;
    jsonParam.communicateResult = "fail";
    jsonParam.serviceResult = "";
    jsonParam.deviceResult = "";
    jsonParam.reason = reason;

    sendResult2Explore(res, jsonParam, rollbackPub);
  }
  // 以上是错误处理函数

  if (!jsonDevData.param || !jsonDevData.param.fileName) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " jsonDevData.param.fileName error, err is: " + JSON.stringify(jsonDevData));

    var jsonParam = {};
    jsonParam.result = "fail";
    jsonParam.errCode = CONST_ERR_MSG_UNKNOWN;
    jsonParam.communicateResult = "";
    jsonParam.serviceResult = "";
    jsonParam.deviceResult = "";
    jsonParam.reason = "message unknown";

    sendResult2Explore(res, jsonParam, rollbackPub);
    return;
  }

  var msgService = {};
  msgService.url = "/rollback";
  msgService.body = {};
  msgService.body.method = "isFileinfoExist";
  msgService.body.fileName = jsonDevData.param.fileName;
  msgService.body.devSN = jsonDevData.devSN;

  console.warn(CONST_LOG_HEAD + rollbackPub + " send msgServcie to rollback service, msgServcie is: " + JSON.stringify(msgService));
  mqhd.sendMsg(serviceRollback, JSON.stringify(msgService), function (serviceData) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " receive serviceData from rollback service, serviceData is: " + JSON.stringify(serviceData));

    // 检查数据库中是否有 文件名为 fileName 的文件存在
    if (serviceData && "true" != serviceData.result) {
      console.warn(CONST_LOG_HEAD + rollbackPub + " serviceData.result is not true");

      var jsonParam = {};
      jsonParam.result = "fail";
      jsonParam.errCode = CONST_ERR_FILE_NOT_FOUND;
      jsonParam.communicateResult = "fail";
      jsonParam.serviceResult = "";
      jsonParam.deviceResult = "";
      jsonParam.reason = "file not found";

      sendResult2Explore(res, jsonParam, rollbackPub);
    } else {
      console.warn(CONST_LOG_HEAD + rollbackPub + " serviceData.result is true");

      jsonDevData.param.downloadUrl = CONST_ROLLBACK_DOWNLOAD + "/" + jsonDevData.param.fileName;
      jsonDevData.param.curlTimeout = jsonDevData.cfgTimeout;
      console.warn(CONST_LOG_HEAD + rollbackPub + " jsonDevData is: " + JSON.stringify(jsonDevData));

      pub.getMainConnection(jsonDevData.devSN, function (connection) {
        if (!connection) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " can not getMainConnection()");
          procMainConnectionUndefined(jsonDevData, res, rollbackPub);
          return;
        }
        console.warn(CONST_LOG_HEAD + rollbackPub + " success to getMainConnection()");

        var mapData = {};
        mapData.data = jsonDevData;
        mapData.res = res;

        var seqNum = getCmdSeqNum();
        console.warn(CONST_LOG_HEAD + rollbackPub + " set seqNum for mapData, seqNum is: " + seqNum);
        // console.warn(CONST_LOG_HEAD + rollbackPub + " set seqNum for mapData, mapData is: " + JSON.stringify(mapData));
        rollback.cfgMap.set(seqNum, mapData);

        sendCfgMsg2Device(seqNum, jsonDevData, connection, rollbackPub, errProcReason);
      });
    }
  });
}

// 浏览器消息入口
Rollback.prototype.procExploreMsg = function (jsonDevData, res) {
  console.warn(CONST_LOG_HEAD + jsonDevData.devSN + jsonDevData.method + " come in Rollback.prototype.procExploreMsg()");

  switch (jsonDevData.method) {

    case "saveCfg":
      {
        var rollbackPub = jsonDevData.devSN + "saveCfg";
        console.warn(CONST_LOG_HEAD + rollbackPub + " jsonDevData.method is: saveCfg");

        procExploreSaveCfg(jsonDevData, res, rollbackPub);
        break;
      }

    case "rollbackCfg":
      {
        var rollbackPub = jsonDevData.devSN + "rollbackCfg";
        console.warn(CONST_LOG_HEAD + rollbackPub + " jsonDevData.method is: rollbackCfg");

        procExploreRollbackCfg(jsonDevData, res, rollbackPub);
        break;
      }

    default:
      {
        console.warn(CONST_LOG_HEAD + "jsonDevData.method is unknown");

        var jsonParam = {};
        jsonParam.result = "fail";
        jsonParam.errCode = CONST_ERR_MSG_UNKNOWN;
        jsonParam.communicateResult = "fail";
        jsonParam.serviceResult = "";
        jsonParam.deviceResult = "";
        jsonParam.reason = "message unknown";

        sendResult2Explore(res, jsonParam, rollbackPub);
        break;
      }

  }
};

// =========================================================================分割线====================================================================
function procDevSaveCfg(jsonDevData, reserveData, res, rollbackPub) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in procDevSaveCfg()");

  if ("success" != jsonDevData.msgCfgReturn || undefined == jsonDevData.results || (undefined != jsonDevData.results && "success" != jsonDevData.results.result)) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " failed to proc rollbackSaveCfg() with no banlance");
    console.warn(CONST_LOG_HEAD + rollbackPub + " jsonDevData.msgCfgReturn is not success");

    if (reserveData.param && reserveData.param.fileName) {
      console.warn(CONST_LOG_HEAD + rollbackPub + " reserveData.param.fileName is exit");

      var rollbackKey = reserveData.param.fileName;
      console.warn(CONST_LOG_HEAD + rollbackPub + " delete rollbackKey");
      rollback.rollbackMap.delete(rollbackKey);

      var redisKey = ROLLBACK_REDIS_PREV + rollbackKey;
      console.warn(CONST_LOG_HEAD + "delete redisKey");
      redisClient.del(redisKey, function (err) {
        if (err) {
          console.warn(CONST_LOG_HEAD + rollbackPub + " failed to delete redisKey[%s], error: %s", redisKey, err);
        }
        console.warn(CONST_LOG_HEAD + rollbackPub + " success to delete redisKey");
      });
    }
    console.warn(CONST_LOG_HEAD + rollbackPub + " reserveData.param.fileName is not exit");

    var errCode = CONST_ERR_SUCCESS;
    var bComm = "success";
    var bDevice = "success";
    var reason = "";

    if ("success" != jsonDevData.msgCfgReturn) {
      errCode = CONST_ERR_DEV_COMM;
      bComm = "fail";
      reason = "communicate with device error";
    }

    if (undefined == jsonDevData.results || (undefined != jsonDevData.results && "success" != jsonDevData.results.result)) {
      errCode = CONST_ERR_DEVICE_PROC;
      bDevice = "fail";
      reason = "device process message error";
    }

    var jsonParam = {};
    jsonParam.result = "fail";
    jsonParam.errCode = errCode;
    jsonParam.communicateResult = bComm;
    jsonParam.serviceResult = "";
    jsonParam.deviceResult = bDevice;
    jsonParam.reason = reason;

    sendResult2Explore(res, jsonParam, rollbackPub);

    return;
  } else {
    console.warn(CONST_LOG_HEAD + rollbackPub + " success to proc rollbackSaveCfg() with no balance");
  }
}

function procDevRollbackCfg(jsonDevData, reserveData, res, rollbackPub) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in procDevRollbackCfg()");

  if ("success" != jsonDevData.msgCfgReturn || undefined == jsonDevData.results ||
    (undefined != jsonDevData.results && "success" != jsonDevData.results.result)) {

    console.warn(CONST_LOG_HEAD + rollbackPub + " failed to proc rollbackCfg() with no banlance");
    console.warn(CONST_LOG_HEAD + rollbackPub + " jsonDevData.msgCfgReturn is not success");

    var errCode = CONST_ERR_SUCCESS;
    var bComm = "success";
    var bDevice = "success";
    var reason = "";

    if ("success" != jsonDevData.msgCfgReturn) {
      errCode = CONST_ERR_DEV_COMM;
      bComm = "fail";
      reason = "communicate with device error";
    }
    if (undefined == jsonDevData.results || (undefined != jsonDevData.results && "success" != jsonDevData.results.result)) {
      errCode = CONST_ERR_DEVICE_PROC;
      bDevice = "fail";
      reason = "device process message error"
    }

    var jsonParam = {};
    jsonParam.result = "fail";
    jsonParam.errCode = errCode;
    jsonParam.communicateResult = bComm;
    jsonParam.serviceResult = "";
    jsonParam.deviceResult = bDevice;
    jsonParam.reason = reason;

    sendResult2Explore(res, jsonParam, rollbackPub);

    return;
  }
  console.warn(CONST_LOG_HEAD + rollbackPub + " success to proc rollbackCfg() with no banlance");

  var msgService = {};
  msgService.body = reserveData;
  msgService.url = "/rollback";

  console.warn(CONST_LOG_HEAD + rollbackPub + " send msgService to rollback service, msgServcie is: " + JSON.stringify(msgService));
  mqhd.sendMsg(serviceRollback, JSON.stringify(msgService), function (jsonSerData) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " receive jsonSerData from rollback service, jsonSerData is: " + JSON.stringify(jsonSerData));

    var errCode = ("success" == jsonSerData.result) ? CONST_ERR_SUCCESS : CONST_ERR_SERVICE;

    var jsonParam = {};
    jsonParam.result = jsonSerData.result;
    jsonParam.errCode = errCode;
    jsonParam.communicateResult = "success";
    jsonParam.serviceResult = jsonSerData.result;
    jsonParam.deviceResult = "success";
    jsonParam.reason = jsonSerData.reason;

    sendResult2Explore(res, jsonParam, rollbackPub);
  });
}

// 设备端消息入口
Rollback.prototype.procDevMsg = function (jsonDevData) {
  console.warn(CONST_LOG_HEAD + "come in Rollback.prototype.procDevMsg()");
  console.warn(CONST_LOG_HEAD + "receive jsonDevData is: " + JSON.stringify(jsonDevData));

  if (undefined == jsonDevData.seqNumber) {
    console.warn(CONST_LOG_HEAD + "jsonDevData.seqNumber is undefined, drop this msg, now return");
    return;
  }

  var seqNum = Number(jsonDevData.seqNumber);
  console.warn(CONST_LOG_HEAD + "seqNum is: " + seqNum);
  var mapData = rollback.cfgMap.get(seqNum);
  // console.warn(CONST_LOG_HEAD + "get mapData by seqNum, mapData is: " + JSON.stringify(mapData));
  console.warn(CONST_LOG_HEAD + "delete seqNum");
  rollback.cfgMap.delete(seqNum);

  if (!mapData) {
    console.warn(CONST_LOG_HEAD + "mapData is null, now return");
    return;
  }

  var rollbackPub = mapData.data.devSN + mapData.data.method;

  console.warn(CONST_LOG_HEAD + rollbackPub + " come in Rollback.prototype.procDevMsg()");
  console.warn(CONST_LOG_HEAD + rollbackPub + " receive jsonDevData is: " + JSON.stringify(jsonDevData));

  // deliveryInfo不为空时说明消息, 需要重定向
  var delivery = mapData.deliveryInfo;
  if (undefined != delivery) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " mapData.deliveryInfo is exist, need redirect, delivery is: " + JSON.stringify(delivery));

    console.warn(CONST_LOG_HEAD + rollbackPub + " delete mapData.deliveryInfo");
    delete mapData.deliveryInfo;

    console.warn(CONST_LOG_HEAD + rollbackPub + " copy jsonDevData to mapData");
    jsonCopy(mapData, jsonDevData);

    console.warn(CONST_LOG_HEAD + rollbackPub + " delete mapData.optType and mapData.msgType");
    delete mapData.optType;
    delete mapData.msgType;

    mapData.url = "/confmgrlb";

    console.warn(CONST_LOG_HEAD + rollbackPub + " reply mapData to another webserver, mapData is: " + JSON.stringify(mapData));
    mqhd.replyMsg(JSON.stringify(mapData), delivery);

    return;
  }

  // 不需要重定向
  console.warn(CONST_LOG_HEAD + rollbackPub + " mapData.deliveryInfo is not exist, no need redirect");
  if (!mapData.res || !mapData.data) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " mapData.res or mapData.data is null, now return");
    return;
  }

  var jsonData = mapData.data;
  var res = mapData.res;

  switch (jsonData.method) {
    // 设备端文件保存成功时此处不需要处理，处理失败时需要立即返回给浏览器失败结果
    case "saveCfg":
      {
        console.warn(CONST_LOG_HEAD + rollbackPub + " jsonData.method is: saveCfg");
        procDevSaveCfg(jsonDevData, jsonData, res, rollbackPub);
        break;
      }

    case "rollbackCfg":
      {
        console.warn(CONST_LOG_HEAD + rollbackPub + " jsonData.method is: rollbackCfg");
        procDevRollbackCfg(jsonDevData, jsonData, res, rollbackPub);
        break;
      }

    default:
      {
        console.warn(CONST_LOG_HEAD + rollbackPub + " jsonData.method is: unknown");
        break;
      }
  }
};

// =========================================================================分割线====================================================================
Rollback.prototype.procServiceMsg = function (jsonSerData) {
  console.warn(CONST_LOG_HEAD + "procMsgFromService() recevice message from service: %s", JSON.stringify(jsonSerData));
};

var rollback = module.exports = new Rollback;