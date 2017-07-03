/*
 * Created by Administrator on 2016/2/24.
 */
var connectionModel     = require('wlanpub').connectionModel;
var connectionMap       = require('../../../../lib/public').connectionMap;

var CONST_LOG_HEAD      = "[ANTCONN][public] ";
var CONST_LOG_HEAD_ROLLBACK = "[WEBSERVER][public] rollbackDownCfg";
const DEVICE_NOT_ONLINE = -1;
const TIME_FOUR_MIN     = 4 * 60 * 1000;

exports.getMainConnection = function (devSN, cb) {
  if (!devSN) {
    if (typeof cb == "function") {
      cb(DEVICE_NOT_ONLINE);
    }
    console.log(CONST_LOG_HEAD + "getMainConnection() error: devSN undefined");
    console.log(CONST_LOG_HEAD_ROLLBACK + " " + "getMainConnection() error: devSN undefined");

    return;
  }

  connectionModel.getSessionidByDevSN(devSN, function (err, sessionid) {
    if (err || null == sessionid) {
      cb(DEVICE_NOT_ONLINE);
      console.log(CONST_LOG_HEAD + "getMainConnection() error: %s", err);
      console.log(CONST_LOG_HEAD_ROLLBACK + devSN + " " + "getMainConnection() error: %s", err);

      return;
    }
    var correlation = devSN + '/' + sessionid + '/' + 'cmtnlmgr' + '/' + 'base';

    cb(connectionMap.get(correlation));
  });
};

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function cloneObject(myObj) {
  if (typeof (myObj) != 'object' || myObj == null) return myObj;
  if (isArray(myObj)) {
    var newArray = [];
    for (var i in myObj) {
      newArray[i] = cloneObject(myObj[i]);
    }
    return newArray;
  }
  else {
    var newObj = new Object();
    for (var i in myObj) {
      newObj[i] = cloneObject(myObj[i]);
    }
    return newObj;
  }
}

exports.cloneObject = cloneObject;