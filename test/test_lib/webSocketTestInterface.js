var createConn = require('testpub/createConnection.js')
    , createConnection = createConn.createConnection
    , sendMsg = createConn.sendMsg
    , recvMsg = createConn.recvMsg;

//****************************创建连接，接收微服务返回数据与查询结果******************************
function createWsRecvAndFind(url, headers, jsonData, connectionModel, callback) {
    createConnection(url, headers, function (connection) {

        if (jsonData.optType === 2) {
            sendMsg(connection, jsonData, function () {

                recvMsg(connection, function (message) {
                    callback(message);
                });
            });
        } else if (jsonData.optType === 1 & jsonData.cloudModName != undefined) {

            sendMsg(connection, jsonData, function () {

                recvMsg(connection, function (message) {

                    findSessionIdAndServerAddress(connectionModel, jsonData, function (redisSession, rediAddress, mongooSession, mongooAddress) {
                        if (message != undefined) {
                            callback(message, redisSession, rediAddress, mongooSession, mongooAddress);
                        } else {
                            callback(null, redisSession, rediAddress, mongooSession, mongooAddress);
                        }
                    });
                });
            });
        } else {
            sendMsg(connection, jsonData, function () {
                callback();
                console.log("send success!");
            });
        }
    });
}

//**************************************查询sesionid 和webserveAddress ***********************************
function findSessionIdAndServerAddress(connectionModel, jsonData, callback) {

    setTimeout(function(){

    var devSNandSessionid = jsonData.devSN + '/' + jsonData.tokenID;

    var correlation = jsonData.devSN + '/' + jsonData.tokenID + '/' + jsonData.devModName + '/' + jsonData.cloudModName;

    var rediSession, rediAddress, mongooSession, mongooAddress;

    var redisKey = 'conn:' + devSNandSessionid;
//-----------------------------------查询redis中的sessionid------------------------------
    connectionModel.redisClient.get('devsid:' + jsonData.devSN, function (redisErr, redisSessionReply) {
        if (!redisErr) {

            if (redisSessionReply != null) {
                rediSession = redisSessionReply;
                console.log('get sessionid from redis success');
                console.log('redisSessionReply......');
                console.log(redisSessionReply);

                console.log('find sessionid from redis success');
            }
            else {
                rediSession = null;
                console.error('the sessionid from redis is null...');
            }
        } else {
            rediSession = null;
            console.error('get sessionid from redis failed with error: %s. begin to find from mongoose...', redisErr);
        }
//-------------------------------查询redis中的serverAddress------------------------------------------
        connectionModel.redisClient.get(redisKey, function (err, redisAddressReply) {

            if (!err) {
                console.log('get connection from redis success. key/value = (%s)/%s', redisKey, redisAddressReply);
                if (redisAddressReply != null) {
                    console.log('redisAddressReply......')
                    console.log(redisAddressReply);

                    var connection = JSON.parse(redisAddressReply);
                    if (jsonData.cloudModName === "base")
                    {
                        if (connection.mainconnection != undefined) {
                            console.log(connection);
                            console.log('find main connection from redis success');
                            rediAddress = connection.mainconnection.serverAddress.split(':')[0];
                        } else {
                            rediAddress = null;
                            console.error('the main connection from redis is null. begin to find from mongoose...');
                        }
                    } else {
                        if (connection.subconnectionArray != undefined) {
                            var i;
                            for (i = 0; i < connection.subconnectionArray.length; i++) {
                                var subconnection = connection.subconnectionArray[i];
                                if (subconnection.correlation == correlation) {
                                    console.log('subconnectionArray......');
                                    console.log(connection.subconnectionArray);
                                    console.log('find sub connection from redis success');

                                    if (connection.subconnectionArray[i].serverAddress != null) {

                                        rediAddress = connection.subconnectionArray[i].serverAddress.split(':')[0];
                                    } else {
                                        rediAddress = null;
                                    }
                                    break;
                                }
                            }
                        }
                        else {
                            rediAddress = null;
                            console.error('the sub connection from redis is null. begin to find from mongoose...');
                        }
                    }
                } else {
                    rediAddress = null;
                    console.error('the connection from redis is null. begin to find from mongoose...');
                }
            } else {
                rediAddress = null;
                console.error('get connection from redis failed with error: %s. begin to find from mongoose...', err);
            }
//---------------------------查询mongoose中的sessionid----------------------------------
            connectionModel.sessionidModel.findOne({devSN: jsonData.devSN}, function (error, mongooseSessionid) {

                if (!error) {

                    if(mongooseSessionid != null)
                    {
                        if (mongooseSessionid.sessionid != undefined) {
                            mongooSession = mongooseSessionid.sessionid;
                            console.log('mongooseSessionid.............');
                            console.log(mongooseSessionid);
                        }else{
                            mongooSession = null;
                            console.error('sessionid from mongoose is null.');
                        }
                    }else {
                        mongooSession = null;
                        console.error('sessionid from mongoose is null.');
                    }
                } else {
                    mongooSession = null;
                    console.error('find sessionid from mongoose with error: ' + error);
                }
//---------------------------查询mongoose中的serverAddress------------------------------------
                connectionModel.connectionModel.findOne({devSNandSessionid: devSNandSessionid}, function (error, mongooseAddress) {
                    if (!error) {
                        if (mongooseAddress == null) {
                            console.log('connection from mongoose is null.');
                            mongooAddress = null;
                        } else {
                            console.log("mongooseAddress.............");
                            console.log(mongooseAddress);
                            var connect = mongooseAddress;
                            if (jsonData.cloudModName === 'base') {
                                if (connect.mainconnection != undefined) {

                                    console.log('find main connection from mongoose success');

                                    if (connect.mainconnection.serverAddress != null) {
                                        mongooAddress = connect.mainconnection.serverAddress.split(':')[0];
                                    } else {
                                        mongooAddress = null;
                                    }
                                } else {
                                    mongooAddress = null;
                                    console.log('the main connection from mongoose is null.');
                                }
                            } else {
                                if (connect.subconnectionArray != undefined) {
                                    var i;
                                    for (i = 0; i < connect.subconnectionArray.length; i++) {
                                        var subconnection = connect.subconnectionArray[i];
                                        if (subconnection.correlation == correlation) {
                                            console.log('find sub connection from mongoose success');
                                            if (subconnection.serverAddress != null) {

                                                mongooAddress = subconnection.serverAddress.split(':')[0];
                                            } else {
                                                mongooAddress = null;
                                            }
                                            break;
                                        }
                                    }
                                } else {
                                    mongooAddress = null;
                                    console.log('the sub connection from mongoose is null.');
                                }
                            }
                        }
                    } else {
                        mongooAddress = null;
                        console.error('find connection from mongoose with error: ' + error);
                    }
                    callback(rediSession, rediAddress, mongooSession, mongooAddress);
                });
            });
        });
    });
    },10000);
}

exports.createWsRecvAndFind = createWsRecvAndFind;
exports.findSessionIdAndServerAddress = findSessionIdAndServerAddress;