var express = require("wlanpub").express;
var errorRecord = require("wlanpub").errorRecord;

var router = express.Router();

const CONST_LOG_HEAD = "[WEBSERVER][routes][errorRecord.js] ";

var ERR_CODE_SUCCESS = 0;
var ERR_CODE_ADD_ARRAYING = -1;
var ERR_CODE_FAILED = -2;
var ERR_CODE_METHOD_UNKNOWN = -3;

// ===================================================================================
function json2str(jsonData) {
  return JSON.stringify(jsonData);
}

function sendResult2Explore(res, jsonParam) {
  console.log(CONST_LOG_HEAD + "come in sendResult2Explore()");
  console.log(CONST_LOG_HEAD + "jsonParam is: " + json2str(jsonParam));

  var msgExplore = {};
  msgExplore.rtnData = jsonParam.rtnData;
  msgExplore.errCode = jsonParam.errCode;

  console.log(CONST_LOG_HEAD + "send msgExplore to explore, msgExplore is: " + json2str(msgExplore));
  res.end(json2str(msgExplore));
}

function inputInspect(jsonData) {
  if (jsonData && jsonData.method) {
    return true;
  } else {
    return false;
  }
}

router.all("/", function (req, res, next) {
  console.log(CONST_LOG_HEAD + "come in router.all()");

  try {
    if (false == inputInspect(req.body)) {
      var respHttp = {};
      respHttp.result = "fail";
      respHttp.reason = "format of input data error";
      res.end(JSON.stringify(respHttp));

      return;
    }

    var sendErrLog = {};
    sendErrLog.body = req.body;
    sendErrLog.body.ip = req.ip;
    sendErrLog.url = req.url;
    sendErrLog.cookies = req.cookies;
    sendErrLog.session = req.session;
    if (req.session && req.session.cas_user && req.session.cas_user.attributes && req.session.cas_user.attributes.name) {
      sendErrLog.body.userName = req.session.cas_user.attributes.name;
    }
    console.log(CONST_LOG_HEAD + "sendErrLog is: " + json2str(sendErrLog));

    var method = sendErrLog.body.method || "";
    switch (method) {
      case "getErrorRecordCircle":
        {
          console.log(CONST_LOG_HEAD + "method is: getErrorRecordCircle");

          var oData = {};
          if (oData.hasOwnProperty("microServiceName")) {
            oData.microServiceName = sendErrLog.body.param.microServiceName;
          }
          if (oData.hasOwnProperty("timeStamp")) {
            oData.timeStamp = sendErrLog.body.param.timeStamp;
          }

          errorRecord.getErrorRecordCircle(oData, function (result, rtnData) {
            var json = {};
            if ("fail" == result) {
              console.error(CONST_LOG_HEAD + "errorRecord.getErrorRecordCircle() error, result is fail");
              json.errCode = ERR_CODE_FAILED;
              json.rtnData = "";
              sendResult2Explore(res, json);

            } else {
              console.log(CONST_LOG_HEAD + "errorRecord.getErrorRecordCircle() success");
              console.log(CONST_LOG_HEAD + "errorRecord.getErrorRecordCircle() rtnData is: " + json2str(rtnData));

              json.errCode = ERR_CODE_SUCCESS;
              json.rtnData = rtnData;
              sendResult2Explore(res, json);
            }
          });

          break;
        }
      case "getErrorRecord":
        {
          console.log(CONST_LOG_HEAD + "method is: getErrorRecord");

          var oData = {};
          if (oData.hasOwnProperty("microServiceName")) {
            oData.microServiceName = sendErrLog.body.param.microServiceName;
          }
          if (oData.hasOwnProperty("startTime")) {
            oData.startTime = sendErrLog.body.param.startTime;
          }
          if (oData.hasOwnProperty("endTime")) {
            oData.endTime = sendErrLog.body.param.endTime;
          }

          errorRecord.getErrorRecord(oData, function (result, rtnData) {
            var json = {};
            if ("fail" == result) {
              console.error(CONST_LOG_HEAD + "errorRecord.getErrorRecord() error, result is fail");
              json.errCode = ERR_CODE_FAILED;
              json.rtnData = "";
              sendResult2Explore(res, json);

            } else {
              console.log(CONST_LOG_HEAD + "errorRecord.getErrorRecord() success");
              console.log(CONST_LOG_HEAD + "errorRecord.getErrorRecord() rtnData is: " + json2str(rtnData));

              json.errCode = ERR_CODE_SUCCESS;
              json.rtnData = rtnData;
              sendResult2Explore(res, json);
            }
          });

          break;
        }
      case "save":
        {
          console.log(CONST_LOG_HEAD + "method is: save");

          var microServiceName = sendErrLog.body.param.microServiceName;
          var errorType = sendErrLog.body.param.errorType;
          var errorDescription = sendErrLog.body.param.errorDescription;

          errorRecord.save(__filename, __line, microServiceName, errorType, errorDescription, function (result, rtnData) {
            var json = {};
            if ("fail" == result) {
              console.error(CONST_LOG_HEAD + "errorRecord.save() error, result is fail");

              json.errCode = ERR_CODE_FAILED;
              json.rtnData = rtnData;
              sendResult2Explore(res, json);

            } else if ("success" == result) {
              console.log(CONST_LOG_HEAD + "errorRecord.save() success");
              console.log(CONST_LOG_HEAD + "errorRecord.save() rtnData is: " + json2str(rtnData));

              json.errCode = ERR_CODE_SUCCESS;
              json.rtnData = rtnData;
              sendResult2Explore(res, json);

            } else {
              console.log(CONST_LOG_HEAD + "errorRecord.save() add aErrLogSave...");

              json.errCode = ERR_CODE_ADD_ARRAYING;
              json.rtnData = rtnData;
              sendResult2Explore(res, json);

            }
          });

          break;
        }
      default:
        {
          console.error(CONST_LOG_HEAD + "method is unknown");

          var json = {};
          json.errCode = ERR_CODE_METHOD_UNKNOWN;
          json.rtnData = "";
          sendResult2Explore(res, json);

          break;
        }
    }

  } catch (error) {
    console.error(CONST_LOG_HEAD + "=============CATCH ERROR: " + error.message);
  }
});

router.all('/*', function (req, res, next) {
  res.status(404).end();
});

module.exports = router;