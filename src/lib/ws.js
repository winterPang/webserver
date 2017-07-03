/**
 * 该文件用来处理websocket的各种消息
 */
var url             = require('url');
var isJSON          = require('wlanpub').isJSON;
var mqhd            = require('wlanpub').mqhd;
var dbhd            = require('wlanpub').dbhd;
var basic           = require('wlanpub').basic;
var log4js          = require('wlanpub').log4js;
var config          = require('wlanpub').config;
var connectionModel = require('wlanpub').connectionModel;
var devdisconnModel = require('wlanpub').devdisconnModel;
var pub             = require('./public');
var confpub         = require('../webexpress/wlan/ant/controller/confpub');
var conPrefiler     = require('./conprofiler');
var errorRecord     = require('wlanpub').errorRecord;

var connectInterval            = 0;
var devCookieFlushPeriod       = config.get('devCookieFlushPeriod');
var devCookieAge               = config.get('devCookieAge');
var devRedisAge                = devCookieAge/1000;
var logger                     = log4js.getLogger('conn');
var serviceName                = basic.serviceName;
var connectionMap              = pub.connectionMap;
var getOriginName              = pub.getOriginName;
var delConnAndNotify           = pub.delConnAndNotify;
var getSessionidByDevSN        = connectionModel.getSessionidByDevSN;
var setWebserverAddress        = connectionModel.setWebserverAddress;
var updateLastAccess           = connectionModel.updateLastAccess;
var getConnByDevSNandSessionid = connectionModel.getConnByDevSNandSessionid;
var getAddressByDevSNandSessionid = connectionModel.getAddressByDevSNandSessionid;
var addDisconnLog                 = devdisconnModel.addDisconnLog;

/* 处理websocket消息的总入口 */
exports.onWebsocketRequest = function(request) {
    var result = isRequestReject(request, connectInterval);
    if (result.bReject) {
        request.reject(403, result.reason);
        errorRecord.save(__filename, __line, "webserver", 10, "cloud reject the connection because to busy.");
        logger.warn('A new websocket connection rejected. reason: ' + result.reason);
        return;
    }
    var cloudModName = result.cloudModName;
    var originName   = result.originName;

    var connection = request.accept();//'echo-protocol', request.origin
    connectInterval = Date.now();

    logger.info('A new websocket connection accepted. remoteAddress: %s, origin: %s.', request.remoteAddress, request.origin);

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            logger.info('Received websocket utf8 message length[1]: ' + message.length);
            logger.info('Received websocket utf8 message: ' + message.utf8Data);
            connection.lastRecvTime = new Date();
            procUtf8Msg(message.utf8Data, connection, cloudModName, message.length);
        }
        else if (message.type === 'binary') {
            logger.info('Received websocket binary message of ' + message.binaryData.length + ' bytes');
            //connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        logger.warn('Peer %s : %s disconnected. devSN: %s, tokenID: %s, cloudModName: %s. reasonCode: %s, description: %s.', connection.remoteAddress, connection.socket._peername.port, connection.devSN, connection.tokenID, cloudModName, reasonCode, description);
        if (cloudModName === serviceName.base)
        {
            errorRecord.save(__filename, __line, "webserver", 10, cloudModName+' close connection because: '+description);
        }
        if (originName == serviceName.stamgr) {
            mqhd.sendMsg(cloudModName, JSON.stringify({"optType":200}));
        }else if (originName == serviceName.base && connection.devSN && connection.tokenID) {
            //存储主连接下线信息到监控的数据库中
            addDisconnLog(connection.devSN, connection.tokenID, description, connection.serverAddress, connection.connTimestamp);
            //清除数据库中的连接信息
            getConnByDevSNandSessionid(connection.devSN, connection.tokenID, function(conn) {
                delConnAndNotify(conn, 'cloud close connection proactively');
            });
            //如果下线又立马上线，就不报下线通知
            getSessionidByDevSN(connection.devSN, function(err, sessionid) {
                if (!err && sessionid == connection.tokenID) {
                    var msg = {url:'/devlogserver/setdevlog', bReply:0, body:{devSN:connection.devSN, logModule:'webserver', logLevel:4, logType:'W0010004', logStr:'Device logout', logTime:Date.now()}};
                    mqhd.sendMsg(serviceName.devlogserver, JSON.stringify(msg));
                }
            });
        }
    });
    connection.on('error', function(err) {
        errorRecord.save(__filename, __line, "webserver", 10, connection.correlationId+' connection error with reason: '+err.message);
        console.error("connection correlationId :%s", connection.correlationId);
        console.error('websocket error: '+ err);
        console.error(err);
        console.error('======华丽的分割线======');
        console.error('err.code: ' + err.code);
        console.error('err.errno: ' + err.errno);
        console.error('err.syscall: ' + err.syscall);
        console.error('err.stack: ' + err.stack);
        console.error('err.message: ' + err.message);
    });
};

function isRequestReject(request, connectInterval) {
    var result = {};
    var pathName  = url.parse(request.resourceURL).pathname;
    logger.info('  request.resourceURL = ' + pathName);
    var pathArray = pathName.slice(1).split('/');
    logger.info('  pathArray: ' + pathArray);
    var cloudModName = pathArray[1];
    var bCloudModNameNull = false;
    if (cloudModName) {
        var originName   = getOriginName(cloudModName);
        if (pathArray[1] == 'jag') {
            cloudModName = pathArray[2];
            if (cloudModName) {
                originName = getOriginName(cloudModName);
            }else {
                bCloudModNameNull = true;
            }
        }
    }else {
        bCloudModNameNull = true;
    }
    if (bCloudModNameNull) {
        result.bReject = true;
        result.reason  = "cloudModName is null. pathname: " + pathName;
        return result;
    }
    result.cloudModName = cloudModName;
    result.originName   = originName;

    var interval = Date.now() - connectInterval;
    if (interval < 100 && originName && originName.toLowerCase() == serviceName.base) {
        result.bReject = true;
        result.reason  = "server is too busy.";
        return result;
    }

    return result;
}

/* 处理utf8类型消息的总入口 */
function procUtf8Msg(data, connection, cloudModName, length) {
    var jsonData;

    try {
        jsonData = JSON.parse(data);
    }catch(err) {
        logger.error('[WS]unexpected websocket message. JSON.parse with Error: %s. message: %s. Error stack: %s.', err, data, err.stack);
        return;
    }

    if (jsonData.optType == undefined) {
        logger.warn('[WS]unexpected websocket message. optType is undefined. message: ' + data);
        return;
    }
    var mqOption = mqhd.getSendOption();
    if (jsonData.optType == 2) {
        connection.sendUTF('{"optType":2, "retCode":0}');
        // 更新lastAccess
        var devSNAndTokenId = jsonData.devSN + '/' + jsonData.tokenID;
        updateLastAccess(jsonData.devSN, jsonData.tokenID, jsonData.devModName, jsonData.cloudModName, mqOption.replyTo);
        logger.warn('receive optType2 and update lastAccess. devSNAndTokenId = %s.', devSNAndTokenId);
        // 更新设备的session会话到期时间
        var now = new Date();
        if (now.getHours() == 2 && dbhd.redisClient) {
            var sid = 'sess:' + jsonData.tokenID;
            dbhd.redisClient.get(sid, function (err, reply) {
                if ((!err) && reply) {
                    console.log('reply: ' + reply);
                    var jsonReply = JSON.parse(reply);
                    var cookie  = jsonReply.cookie;
                    if (cookie.expires) {
                        var expires = new Date(cookie.expires);
                    }
                    if (expires && expires - now < devCookieFlushPeriod) {
                        var newExpires = new Date(Date.now() + devCookieAge);
                        cookie.expires = newExpires.toISOString();
                        cookie.originalMaxAge = devCookieAge;
                        jsonReply.cookie = cookie;
                        dbhd.redisClient.set(sid, JSON.stringify(jsonReply), function (err, reply) {
                            if (!err) {
                                dbhd.redisClient.expire(sid, devRedisAge);
                                dbhd.redisClient.get(sid, function (err, reply) {
                                    console.log('set cookie success. new reply: ' + reply);
                                });
                            }
                        });
                    }
                }
            });
        }
    }else {
        if (jsonData.cloudModName == undefined) {
            logger.warn('[WS]cloudModName is undefined. please check it. message: ' + data);
            return;
        }
        if (jsonData.optType == 1) {
            connection.devSN         = jsonData.devSN;
            connection.tokenID       = jsonData.tokenID;
            connection.serverAddress = mqOption.replyTo;
            connection.connTimestamp = Date.now();
            // //bycc
            conPrefiler.updateConnectionCount(connection.devSN, jsonData.cloudModName.toLowerCase());
            var correlation = jsonData.devSN + '/' + jsonData.tokenID + '/' + jsonData.devModName + '/' + jsonData.cloudModName;
            connection.correlationId = correlation;
            logger.warn('receive optType1. correlation = %s. Peer %s : %s.', correlation, connection.remoteAddress, connection.socket._peername.port);
            if (jsonData.cloudModName.toLowerCase() === serviceName.base) {
                //logger.warn('receive optType1. correlation = %s.', correlation);
                errorRecord.save(__filename, __line, "webserver", 10, "main connection established with correlation:"+correlation);
                //通知devlogserver设备上线
                var msg = {url:'/devlogserver/setdevlog', bReply:0, body:{devSN:connection.devSN, logModule:'webserver', logLevel:6, logType:'W0010003', logStr:'Device login', logTime:Date.now()}};
                mqhd.sendMsg(serviceName.devlogserver, JSON.stringify(msg));
                //清除该设备的老的连接信息，然后再添加新的连接信息
                getSessionidByDevSN(connection.devSN, function(err, sessionid) {
                    if (!err && sessionid != null) {
                        //清除数据库中的连接信息
                        getConnByDevSNandSessionid(connection.devSN, sessionid, function(conn) {
                            delConnAndNotify(conn, 'cloud close connection proactively');
                        });
                    }
                    procOptType1(jsonData, connection, mqOption, cloudModName, correlation);
                });
            } else {//对于子连接，如果主连接未建立，则拒绝建立子连接
                getAddressByDevSNandSessionid(jsonData.devSN, jsonData.tokenID, 'cmtnlmgr', serviceName.base, function(error, address) {
                    if (error || address == null) {
                        if (address == null) {
                            logger.warn('main connection address is null. devSN/tokenID: %s/%s.', jsonData.devSN, jsonData.tokenID);
                        } else {
                            logger.error('get main connection address with error: %s. devSN/tokenID: %s/%s.', error, jsonData.devSN, jsonData.tokenID);
                            logger.error(error);
                        }
                        errorRecord.save(__filename, __line, "webserver", 10, "main connection address is null and so reject sub connection");
                        connection.close(1000, 'main connection address is null and so reject sub connection');
                    } else {
                        //判断该设备总连接数是否达到了上线以及webserver总连接数是否达到了上线
                        if (conPrefiler.IsAllowConnect(jsonData.devSN)){
                            procOptType1(jsonData, connection, mqOption, cloudModName, correlation);
                        }else{
                            connection.close(1000, 'connection limit. optType1 reject.');
                        }
                    }
                });
            }
        } else {
            // //bycc
            // connection.accessCount++;
            // //logger.warn("[WS-CC] cloudname=%s,count=%s,devSN=%s", connection.accessCloudMod, connection.accessCount, connection.devSN);
            // if (connection.accessCount == 100)
            // {
            //     connection.accessCount = 0;
            //     var UseTime = parseInt((new Date() - connection.accessTime)/1000);
            //     connection.lastAccessRate = (100/UseTime).toFixed(4);
            //     logger.warn("[WS-CC] %s - %s access 100 times, rate:%s, cloudModName:%s.", new Date(connection.accessTime), new Date(), connection.lastAccessRate, connection.accessCloudMod);
            //     connection.accessTime = new Date();
            // }
            conPrefiler.updateAccessCount(connection.devSN, jsonData.cloudModName.toLowerCase());
            conPrefiler.updateAccessFlow(connection.devSN, jsonData.cloudModName.toLowerCase(), length);
            if (!conPrefiler.IsAllowAccess() || !conPrefiler.IsAllowPkg())
            {
                console.error("[CONPREFILER] resource is not enought.");
                return;
            }
            if (jsonData.cloudModName.toLowerCase() === serviceName.confmgr) {
                try {
                    if (cloudModName.indexOf(basic.testSuffix) > 0){
                        jsonData.bIsTestUser = true;
                    }
                    confpub.procMsgFromDev(jsonData);
                }
                catch (err) {
                    console.error("confpub procMsgFromDev except: " + err);
                }
            }else {
                //devmgr新设备用，devmonitor老设备用，apmgr小小贝专用
                // if ((jsonData.cloudModName == serviceName.devmgr || jsonData.cloudModName == serviceName.devmonitor || jsonData.cloudModName == serviceName.apmgr) && jsonData.optType == 11) {
                //     jsonData.devAddress = connection.remoteAddress;
                // }
                jsonData.devAddress = connection.remoteAddress;
                logger.info('Received websocket utf8 message length[2]: ' + length);
                mqhd.sendMsg(cloudModName, JSON.stringify(jsonData));
            }
        }
    }
}

function procOptType1(jsonData, connection, mqOption, cloudModName, correlation) {
    // 保存新连接与webserver的ip地址对应关系，方便业务模块找到该映射
    setWebserverAddress(jsonData.devSN, jsonData.tokenID, jsonData.devModName, jsonData.cloudModName, mqOption.replyTo, function(error) {
        if (error) {
            connection.close(1000, 'cloud save connection to database with error');
            logger.error('cloud save connection to database with error: %s. jsonData: %s.', error, JSON.stringify(jsonData));
            errorRecord.save(__filename, __line, "webserver", 10, "cloud save connection to database with error");

            return;
        } 
        try{
            var oldConnection = connectionMap.get(correlation);
            if ((oldConnection != undefined) && (cloudModName.toLowerCase() !== serviceName.base))
            {
	    	    logger.error("[CONN]Del Old con %s:%s, new con %s:%s", oldConnection.remoteAddress, oldConnection.socket._peername.port, connection.remoteAddress, connection.socket._peername.port);
                oldConnection.close(1000, "close old connection when reconnect.");
                connectionMap.delete(correlation);
            }
        }catch(err){
            console.error("[CONN]Del Old con error.")
            errorRecord.save(__filename, __line, "webserver", 10, "Delete old connection error");
            console.error(err);
        }

        // 保存websocket连接到Map表中
        connectionMap.set(correlation, connection); 

        if(cloudModName == serviceName.stamgr){
            logger.info('connection to stamgr direct reply ok!');
            var responseMsg = {"optType":1, "retCode":0};
            responseMsg.devSN      = jsonData.devSN;
            responseMsg.tokenID    = jsonData.tokenID;
            responseMsg.devModName = jsonData.devModName;

            connection.sendUTF(JSON.stringify(responseMsg));
            
            return;
        }
        
        mqhd.sendMsg(cloudModName, JSON.stringify(jsonData));  
    });
}