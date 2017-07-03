/**
 * 该文件用来存放公共数据
 */
var url             = require('url');
var http            = require('http');
var querystring     = require('querystring');
var basic           = require('wlanpub').basic;
var mqhd            = require('wlanpub').mqhd;
var config          = require('wlanpub').config;
var log4js          = require('wlanpub').log4js;
var connectionModel = require('wlanpub').connectionModel;
var user            = require('wlanpub').user;
var confEnv         = require("../config");
/**
 * websocket连接映射表.key/value=(devSN/tokenID/devModName/cloudModName)/connection.
 * 设备端的业务进程与云端的业务模块之间的连接是多对多的关系，故需包含devModName和cloudModName.而tokenID用来区分连接的新旧.
 */
var connectionMap  = new Map();

var serviceName      = basic.serviceName;
var testSuffix       = config.get('testSuffix');
var logger           = log4js.getLogger('conn');
var delConnections   = connectionModel.delConnections;
var getDevPermission = user.getDevPermission;

function getUserAttr(userName, callback) {
    //console.log('[PUB]getUserAttr');
    var sendMsg = {body:{Method:'getUserAttr', param:{userName:userName}}};
    mqhd.sendMsg(serviceName.scenarioserver, JSON.stringify(sendMsg), function(jsonData) {
        //console.log('[PUB]getUserAttr response data: ' + JSON.stringify(jsonData));
        if (jsonData.retCode == 0 && jsonData.message && jsonData.message.bUserTest == 'true') {
            //console.log('[PUB]getUserAttr bUserTest true');
            callback(true);
        }else {
            //console.log('[PUB]getUserAttr bUserTest false');
            callback(false);
        }
    });
}

function getUserNewAttr(userName, callback) {
    //console.log('[PUB]getUserNewAttr');
    var sendMsg = {body:{Method:'getUserAttr', param:{userName:userName}}};
    mqhd.sendMsg(serviceName.scenarioserver, JSON.stringify(sendMsg), function(jsonData) {
        //console.log('[PUB]getUserNewAttr response data: ' + JSON.stringify(jsonData));
        if (jsonData.retCode == 0 && jsonData.message && jsonData.message.bUserNew == 'true') {
            //console.log('[PUB]getUserNewAttr bUserTest true');
            callback(true);
        }else {
            //console.log('[PUB]getUserNewAttr bUserTest false');
            callback(false);
        }
    });
}

function isUserHasPermission(cookies, session, devSN, callback) {
    getDevPermission(cookies, session, devSN, function(result, retCode) {
        console.warn('isUserHasPermission, result: %s, retCode: %s.', JSON.stringify(result), retCode);
        if (retCode === 0 && result && result.permission) {
            var permission = result.permission;
            for (var i in permission) {
                if (permission[i] === true) {
                    return callback(true);
                }
            }
        }
        callback(false);
    });
}

function checkPinCode(pinCode, connectSid, callback) {
    var sendMsg        = {};
    sendMsg.path       = '/pinserver';
    sendMsg.msgType    = 1;
    sendMsg.connectSid = connectSid;
    sendMsg.pinCode    = pinCode;

    mqhd.sendMsg('pinserver', JSON.stringify(sendMsg), function(jsonData) {
        console.warn('[check pincode] message responsed by mq: ' + JSON.stringify(jsonData));
        callback(jsonData);
    });
}

function getPinCode(req, pathname, callback) {
    var sendMsg = {};
    sendMsg.url   = pathname;
    sendMsg.method  = req.method;
    sendMsg.headers = req.headers;
    sendMsg.cookies = req.cookies;
    sendMsg.session = req.session;
    sendMsg.query   = req.query;
    sendMsg.body    = req.body;

    mqhd.sendMsg('pinserver', JSON.stringify(sendMsg), function(jsonData) {
        //console.warn('[get pincode] pinserver response data: ' + JSON.stringify(jsonData));
        callback(jsonData);
    });
}

function getOriginName(strName) {
    var tmpIdx   = strName.indexOf(testSuffix);
    return (-1 == tmpIdx) ? strName : strName.slice(0, tmpIdx);
}

function delConnAndNotify(connect, closeReason) {
    if (connect == null) {
        return;
    }
    var devSNandSessionid = connect.devSNandSessionid;
    if (connect.mainconnection == undefined) {
        logger.error(closeReason + ' but connect.mainconnection is undefined. connect: %s.', JSON.stringify(connect));
    }else {
        var correlation = connect.mainconnection.correlation;
        if (correlation == undefined) {
            logger.error(closeReason + ' but connect.mainconnection.correlation is undefined. connect: %s.', JSON.stringify(connect));
        }else {
            var lastAccess = connect.mainconnection.lastAccess.toLocaleString();
            var connection = connectionMap.get(correlation);
            if (connection != undefined) {
                connection.close(1000, closeReason + ', last optType2 time: ' + lastAccess);
                logger.warn(closeReason + ' and delete main connection(%s), last optType2 time: %s.', correlation, lastAccess);
            }else {
                logger.warn(closeReason + ' and main connection(%s) is on another webserver. begin to notify other webserver(%s). last optType2 time: %s.', correlation, connect.mainconnection.serverAddress, lastAccess);
                var jsonData = {};
                jsonData.msgType = 1;
                jsonData.correlation = correlation;
                if (connect.mainconnection.serverAddress != undefined) {
                    mqhd.sendMsg(connect.mainconnection.serverAddress, JSON.stringify(jsonData));
                }
            }
            // 删除Map表中相关数据
            connectionMap.delete(correlation);
        }
    }

    // 通知其它webserver拆除子连接
    notifyCloseSubConnection(connect, closeReason);
    // 删除数据库中本连接相关的信息
    delConnections(devSNandSessionid);
}

function notifyCloseSubConnection(connection, closeReason) {
    if (connection.subconnectionArray != undefined) {
        var i, subConn;
        var jsonData = {};
        jsonData.msgType = 1;
        var mqOption = mqhd.getSendOption();
        for (i = 0; i < connection.subconnectionArray.length; i++) {
            var subconnection = connection.subconnectionArray[i];
            if (subconnection.serverAddress) {
                if (subconnection.serverAddress != mqOption.replyTo) {
                    jsonData.correlation = subconnection.correlation;
                    mqhd.sendMsg(subconnection.serverAddress, JSON.stringify(jsonData));
                    logger.warn(closeReason + ' and sub connection(%s) is on another webserver. begin to notify other webserver(%s).', subconnection.correlation, subconnection.serverAddress);
                }else {
                    subConn = connectionMap.get(subconnection.correlation);
                    if (subConn != undefined) {
                        subConn.close(1000, closeReason);
                        logger.warn(closeReason + ' and delete sub connection of correlation: ' + subconnection.correlation);
                        //var strArray  = subconnection.correlation.split('/');
                        //if (strArray[3] == serviceName.stamgr) {
                        //    mqhd.sendMsg(strArray[3], JSON.stringify({"optType":200}));
                        //}
                    }else {
                        logger.error(closeReason + ' and sub connection(%s, %s) is on myself but cannot find it out. please check it.', subconnection.correlation, subconnection.serverAddress);
                    }
                    // 删除Map表中相关数据
                    connectionMap.delete(subconnection.correlation);
                }
            }
        }
    }
}

function transHttpRequest(req, res, pathname, isAddUser) {
    var pathArray = url.parse(req.url).pathname.slice(1).split('/');
    console.warn('[oasis] parsed the input request url and checked out the path array: ' + pathArray);

    if (pathArray[1] == '' || pathArray[1] == undefined) {
        res.status(404).end();
        return;
    }
    var query = req.query;
    var options = {
        host: confEnv.oasis.host,
        port: confEnv.oasis.port,
        path: pathname + '?' + querystring.stringify(query),
        method: req.method
    };
    options.headers = req.headers;
    if (req.socket && req.socket.remoteAddress) {
        var iparray = req.socket.remoteAddress.split(':');
        options.headers['x-real-ip'] = iparray[3];
    }

    if ("{}" == JSON.stringify(query) || null == query || undefined == query) {
        options.path = pathname;
    }
    if (isAddUser && req.session && req.session.cas_user
        && req.session.cas_user.attributes && req.session.cas_user.attributes.name){
        if (query && query.user_name) {
            query.user_name = req.session.cas_user.attributes.name;
            options.path = pathname + '?' + querystring.stringify(query);
        } else if ("{}" == JSON.stringify(query) || null == query || undefined == query){
            options.path = pathname + '?user_name=' + req.session.cas_user.attributes.name;
        } else {
            options.path += '&user_name=' + req.session.cas_user.attributes.name;
        }
    }
    options.timeout = 180000;
    console.warn('[oasis] the options of the request to be sent: ' + JSON.stringify(options));
    var interval  = Date.now();
    var request = http.request(options, function(response) {
        var chunks = [];
        var size = 0;
        response.on('data', function (chunk) {
            chunks.push(chunk);
            size+=chunk.length;
        });
        response.on('end', function() {
            if (!res.finished) {
                /*if (undefined != response.headers['Content-type']) {
                    res.type(response.headers['Content-type']);
                }*/
                interval = Date.now() - interval;
                var buf = Buffer.concat(chunks,size);
                console.warn('[oasis] Receice response from v2 service:'
                    + response.statusCode + ', spent time: ' + interval
                    + 'ms, the request url:' + req.url
                    + ', respone headers:' + JSON.stringify(response.headers)
                    + ', response data: ' + buf.toString());
                res.writeHead(response.statusCode, response.headers);
                res.write(buf.toString());
                res.end();
            }
        });
        response.on('error', function(err) {
            console.error('[oasis] Failed to get the response with error: ' + err);
        });
    });
    request.write(JSON.stringify(req.body));
    request.end();
    request.on('error', function(err) {
        console.error('[oasis] Failed to translate the request with error: ' + err);
    });
}
exports.connectionMap    = connectionMap;
exports.getUserAttr      = getUserAttr;
exports.getUserNewAttr   = getUserNewAttr;
exports.getOriginName    = getOriginName;
exports.delConnAndNotify = delConnAndNotify;
exports.isUserHasPermission = isUserHasPermission;
exports.transHttpRequest = transHttpRequest;
exports.checkPinCode       = checkPinCode;
exports.getPinCode         = getPinCode;