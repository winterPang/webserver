var pub             = require('./public');
var conf            = require('../config');
var connectionModel = require('wlanpub').connectionModel;

var delConnAndNotify        = pub.delConnAndNotify;
var delOldConnections       = connectionModel.delOldConnections;
var bDelDevConnPeriodically = conf.devConn.bDelPeriodically;
var devConnDelPeriod        = conf.devConn.delPeriod;
var devConnTimeoutPeriod    = conf.devConn.timeoutPeriod;

console.warn('bDelDevConnPeriodically: %s, devConnDelPeriod: %s, devConnTimeoutPeriod: %s.', bDelDevConnPeriodically, devConnDelPeriod, devConnTimeoutPeriod);

if (bDelDevConnPeriodically == true || bDelDevConnPeriodically == 'true') {
    setInterval(timeOutProc, devConnDelPeriod);
}

function timeOutProc() {
    delOldConnections(devConnTimeoutPeriod, function(connect) {
        delConnAndNotify(connect, 'timeout and main connection not received optType2');
    });
}
