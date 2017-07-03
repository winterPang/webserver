/*
 * 本文件是配置下发、配置平滑、配置代理的公共文件
 */
var mqhd            = require('wlanpub').mqhd;
var basic           = require('wlanpub').basic;
var connectionModel = require('wlanpub').connectionModel;
var uuid            = require('uuid');
var pub             = require('../lib/public');
var devList         = require('../lib/devList');

const CONST_DEFAULT_INTERVAL = 5 * 1000; //定时器默认间隔，以毫秒为单位
const CONST_SEQNUM_MAX = 2147483648; //消息序列号最大值，2^31

const CONST_TIMER_INTERVAL = 60 *1000;
/* WebSocket识别的消息类型 */
const CONST_CFGMSG_TYPE = 3; //3代表配置管理消息

/* webserver配置管理模块（本文件）需要识别的消息类型 */
const CONST_EXPLORE_PUT_DATA_2_DEVICE = 0;
const CONST_EXPLORE_PUT_DATA_2_SERVICE = 1;
const CONST_SERVICE_ANNOUNCE_SMOOTH_START = 2;
const CONST_SERVICE_PUT_CFG_2_DEVICE = 3;
const CONST_DEVICE_2_SERVICE = 4;

/* 微服务需要识别的消息类型 */
const CONST_SUBMSG_FROM_EXPLORE = 0;
const CONST_SUBMSG_SMOOTH_ALL = 1;
const CONST_SUBMSG_SMOOTH_START = 2;
const CONST_SUBMSG_RECV_DEVICE_CFG = 3;
const CONST_SUBMSG_SMOOTH_END = 4;
const CONST_SUBMSG_CFG_FROM_SERVICE = 5;
const CONST_SUBMSG_DEVICE_SEND_CFG = 6;
const CONST_SUBMSG_DEVICE_GET_CFG = 7;

const CONST_MESSAGELEN_10K = 10240;

/* 消息序列号保留值 */
const CONST_SEQ_RESERVE = 0;
const DEVICE_NOT_ONLINE = -1;

/*
 * errCode:
 * 0-->成功
 * 1-->消息格式问题，webserver无法解析
 * 2-->权限问题
 * 3-->设备端消息超时
 * 4-->主连接未找到
 * 5-->webserver内部逻辑错误
 * 6-->webserver与设备端通信异常
 * 7-->微服务消息处理错误
 * */
const CONST_ERR_SUCCESS = 0;
const CONST_ERR_MSG_UNKNOWN = 1;
const CONST_ERR_PERMISSION = 2;
const CONST_ERR_DEV_TIMEOUT = 3;
const CONST_ERR_NO_MAIN_CONN = 4;
const CONST_ERR_WEBSERVER =5;
const CONST_ERR_DEV_COMM = 6;
const CONST_ERR_SERVICE = 7;
const CONST_ERR_DEV_NO_SUPPORT_DRS = 8;

var serviceConfmgr    = basic.serviceName.confmgr;
var serviceLogmgr     = basic.serviceName.logmgr;
var getDevListByScene = devList.getDevListByScene;

const CONST_LOG_HEAD = "[CONFMGR]";
const CONST_LOG_HEAD_SCENE = "[WEBSERVER][controller][confmgr.js] ";

function jsonCopy (dstData, srcData) {
    for (var key in srcData) {
        dstData[key] = srcData[key];
    }
}

/* 向日志管理微服务发送日志 */
function sendLog(userName, devSN, ip, module, level, message) {
    var jsonData = {};
    jsonData.body = {};
    jsonData.from = "service";

    jsonData.body.method    = "addLog";
    jsonData.body.userName  = userName;
    jsonData.body.devSN     = devSN;
    jsonData.body.ip        = ip;
    jsonData.body.module    = module;
    jsonData.body.level     = level;
    jsonData.body.message   = message;

    mqhd.sendMsg(serviceLogmgr, JSON.stringify(jsonData), function (jsonRecv) {});
}

/* 单个配置下发结果返回浏览器 */
function sendOneCfgResult2Explore (res, result, deviceResult, errCode, communicateResult, serviceResult, reason) {
    var msgExplore = {};

    msgExplore.result  = result;
    msgExplore.deviceResult = deviceResult || [];
    msgExplore.errCode = errCode;

    /* 兼容旧版本实现 */
    msgExplore.communicateResult = communicateResult;
    msgExplore.serviceResult = serviceResult;
    msgExplore.reason = reason;

    console.warn(CONST_LOG_HEAD + "return  to  explore msg :" + JSON.stringify(msgExplore));
    try{
        res.end(JSON.stringify(msgExplore));
    }
    catch(e)
    {
        console.error(CONST_LOG_HEAD, "sendOneCfgResult2Explore catch error!", e.stack);
    }
}

/* 配置代理结果返回浏览器 */
function sendCfgProxyResult2Explore (res, result, errCode, echoInfo, communicateResult, deviceResult) {
    var msgExplore = {};
    msgExplore.result = result;
    msgExplore.echoInfo = echoInfo;
    msgExplore.errCode = errCode;

    /* 兼容旧版本实现 */
    msgExplore.communicateResult = communicateResult;
    msgExplore.deviceResult = deviceResult || [];

    res.end(JSON.stringify(msgExplore));
}

/* 场景配置下发结果返回浏览器 */
function sendSceneCfgResult2Explore (res, serviceResult, deviceResults, reason) {
    console.warn(CONST_LOG_HEAD_SCENE + "come in sendSceneCfgResult2Explore()");

    var msgExplore = {};

    msgExplore.serviceResult = serviceResult;
    msgExplore.deviceResults = deviceResults;
    msgExplore.reason = reason;
    res.end(JSON.stringify(msgExplore));
}

/* 场景下单条配置结果处理 */
function procOneCfgResultOfScene (policy, res, sceneSeqNumber, devSN, communicateResult, deviceResult, serviceResult, reason, bIsTestUser) {
    console.warn(CONST_LOG_HEAD_SCENE + "come in procOneCfgResultOfScene()");

    var sceneCfg = confmgr.sceneMap.get(sceneSeqNumber);
    
    console.warn(CONST_LOG_HEAD_SCENE + "policy is: " + policy, 
                "sceneSeqNumber is: " + sceneSeqNumber, 
                "devSN is: " + devSN,
                "communicateResult is: " + communicateResult, 
                "deviceResult is: " + deviceResult, 
                "serviceResult is: " + serviceResult, "reason is: " + reason);


    if (sceneCfg) {
        var result = {};
        result.devSN = devSN;
        result.communicateResult = communicateResult;
        result.deviceResult = deviceResult;
        result.reason = reason;
        sceneCfg.deviceResults.push(result);
        sceneCfg.devNum--;
        if (0 == sceneCfg.devNum) {
            sceneCfg.timeouthandle && clearTimeout(sceneCfg.timeouthandle);
            sceneCfg.timeouthandle = null;
            confmgr.sceneMap.delete(sceneSeqNumber);

            if ("cloudFirst" == policy) {
                console.warn(CONST_LOG_HEAD_SCENE + "policy is cloudFirst");
                if (!res) {
                    console.warn(CONST_LOG_HEAD + "procOneCfgResultOfScene() error: no res exists");
                    return;
                }
                sendSceneCfgResult2Explore(res, serviceResult, sceneCfg.deviceResults, reason);
            }
            else {
                console.warn(CONST_LOG_HEAD_SCENE + "policy is deviceFirst");

                sceneCfg.cfg.subMsgType = CONST_SUBMSG_FROM_EXPLORE;
                sceneCfg.cfg.url = "/confmgr";
                var serviceConfmgrName = bIsTestUser == true ? serviceConfmgr + basic.testSuffix : serviceConfmgr;
                mqhd.sendMsg(serviceConfmgrName, JSON.stringify(sceneCfg.cfg), function (jsonSer) {
                    if (!res) {
                        console.warn(CONST_LOG_HEAD + "procOneCfgResultOfScene() error: no res exists");
                        return;
                    }
                    sendSceneCfgResult2Explore(res, jsonSer.result, sceneCfg.deviceResults, jsonSer.reason);
                });
            }
            return ;
        }
        console.warn(CONST_LOG_HEAD_SCENE + "sceneCfg.devNum is not 0, now sceneMap.set()");
        confmgr.sceneMap.set(sceneSeqNumber, sceneCfg);
    }
}

function Confmgr() {
    /* cfgSeqNum的获取地点是在与设备建主连接的那个webserver */
    this.cfgSeqNum = 0;
    /* sceneNum的获取地点是https请求入口的webserver */
    this.sceneSeqNum = 0;
    /* key/value：cfgSeqNum/configuration */
    this.cfgMap = new Map();
    /* key/value：sceneSeqNum/(configuration + devNum + devResult) */
    this.sceneMap = new Map();
    this.telnetSessionMap = new Map();
}

function getCmdSeqNum () {
    confmgr.cfgSeqNum ++;

    if (CONST_SEQNUM_MAX == confmgr.cfgSeqNum) {
        confmgr.cfgSeqNum = 1;
    }

    return confmgr.cfgSeqNum;
}

function getSceneSeqNum () {
    confmgr.sceneSeqNum ++;

    if (CONST_SEQNUM_MAX == confmgr.sceneSeqNum) {
        confmgr.sceneSeqNum = 1;
    }

    return confmgr.sceneSeqNum;
}

function encapCfgMsg2Device (seqNum, jsonData, cb) {
    console.warn(CONST_LOG_HEAD_SCENE + "come in encapCfgMsg2Device()");

    var devMsg = {};

    jsonCopy(devMsg, jsonData);
    devMsg.seqNumber = seqNum;
    devMsg.optType = CONST_CFGMSG_TYPE;
    devMsg.uuid = uuid.v1();
    devMsg.devModName = 'cmtnlmgr';
    devMsg.cloudModName = 'base';

    connectionModel.getSessionidByDevSN(jsonData.devSN, function (err, sessionid) {
        if (err || null == sessionid) {
            devMsg.tokenID = '';
        }
        else {
            devMsg.tokenID = sessionid;
        }
        cb(devMsg);
    });
}

function sendTelnetMsg2Device (seqNum, jsonDevData, connection) {
    console.warn(CONST_LOG_HEAD + "come in sendTelnetMsg2Device");
        encapCfgMsg2Device(seqNum, jsonDevData, function (devMsg) {
        connection.sendUTF(JSON.stringify(devMsg));
        console.warn(CONST_LOG_HEAD + "send telnet message to device: " + JSON.stringify(devMsg));
    });
}

function sendCfgMsg2Device (seqNum, jsonDevData, connection, cbErrProc) {
    console.warn(CONST_LOG_HEAD + "sendCfgMsg2Device()");
    console.warn(CONST_LOG_HEAD_SCENE + "sendCfgMsg2Device()");

    encapCfgMsg2Device(seqNum, jsonDevData, function (devMsg) {
        console.warn(CONST_LOG_HEAD + "send msg to device: " + JSON.stringify(devMsg));

        //websocket 出问题的情况下定时器不触发的情况
        try{
            var timeInterval = CONST_DEFAULT_INTERVAL;
            var timeTemp = jsonDevData.cfgTimeout ? Number(jsonDevData.cfgTimeout) * 1000 : 0;

            if (timeTemp > CONST_DEFAULT_INTERVAL) {
                timeInterval = timeTemp;
            }

            console.warn(CONST_LOG_HEAD + "send cfg msg to device time interval: %s", timeInterval);

            var cfgmap = confmgr.cfgMap.get(seqNum);
            cfgmap.timeHandle = setTimeout(function () {
                if (confmgr.cfgMap.get(seqNum)) {
                    confmgr.cfgMap.delete(seqNum);

                    console.warn(CONST_LOG_HEAD + "device not response, timeout");
                    cbErrProc("device not response, timeout");
                }
            }, timeInterval);
            confmgr.cfgMap.set(seqNum, cfgmap);

            connection.sendUTF(JSON.stringify(devMsg));
        }
        catch(err){
            var cfgmapTemp = confmgr.cfgMap.get(seqNum);
            if (cfgmapTemp) {
                clearTimeout(cfgmapTemp.timeHandle);
                confmgr.cfgMap.delete(seqNum);

                console.warn(CONST_LOG_HEAD + "sendUTF to device error !", err);
                cbErrProc("sendUTF to device error !");
            }        
        }
    });
}

/* 在建立主链接的webserver上生成新的session并通过sessionId保存上下文 */
function createNewSession(devSN){
    var sessionData = {};
    var sessionId = getCmdSeqNum();

    sessionData.session = sessionId;
    sessionData.message = "";
    sessionData.returnType = "";//delivery  && res
    sessionData.delivery = "";
    sessionData.res = "";
    sessionData.devSN = devSN;

    confmgr.telnetSessionMap.set(sessionId, sessionData);

    return sessionId;

}

/* 重定向telnet消息给设备 */
Confmgr.prototype.procRedirectTelnetMsg2Device = function(jsonRecv, deliveryInfo){
    console.warn(CONST_LOG_HEAD + "come in procRedirectTelnetMsg2Device");
    function errProc (reason) {
        console.warn(CONST_LOG_HEAD + "errProc reason is %s",reason);
        replyTelnetMsg2Browser({deviceModule:"TELNET",msgCfgReturn:"fail"},
            {returnType:"delivery", delivery:{data:jsonRecv.data||{}, deliveryInfo:deliveryInfo},message:reason});
    }
    if (!jsonRecv || !jsonRecv.data) {
        console.warn(CONST_LOG_HEAD + "procRedirectTelnetMsg2Device() receive redirect msg is undefined");
        errProc("request data is undefined" );

        return;
    }
    var jsonData = jsonRecv.data;

    pub.getMainConnection(jsonData.devSN, function (connection) {
        if (!connection) {
            errProc("main connection is not found");
            return;
        }

        /* session不存在 创建session并告知前端{session:"",data:"..."} */
        if(!jsonData.session)
        {
            console.warn(CONST_LOG_HEAD + "session is not exist and create it");
            jsonData.session = createNewSession(jsonData.devSN);

            replyTelnetMsg2Browser({deviceModule:"TELNET",msgCfgReturn:"success",session:jsonData.session},
                {returnType:"delivery", delivery:{data:jsonData, deliveryInfo:deliveryInfo},message:""});
        }
        else{
            jsonData.session = Number(jsonData.session);
            var sessionMsg = confmgr.telnetSessionMap.get(jsonData.session);
            if(!sessionMsg) {
                dealMsg({deviceModule:"TELNET",msgCfgReturn:"fail"},
                    {returnType:"delivery", delivery:{data:jsonData, deliveryInfo:deliveryInfo},message:"session invalid!"});
                return;
            }

            /* 前端主动关闭telnet */
            if(jsonData.hasOwnProperty("timeOut")){
                console.warn(CONST_LOG_HEAD + "..........explore command to close session!");
                closeSession(sessionMsg);
                return;
            }
            /* 前端保活定时器 */
            resetTimeout(sessionMsg);

            /* 如果没有命令下发，查找Map,有数据返回，没数据起定时器 */
            if(!jsonData.cmdProxy){
                if(sessionMsg.returnType)
                {
                    dealMsg({deviceModule:"TELNET",msgCfgReturn:"success"},sessionMsg);
                }

                sessionMsg.returnType = "delivery";//delivery  && response
                sessionMsg.delivery = {data:jsonData, deliveryInfo:deliveryInfo };
                if(sessionMsg.message){
                    dealMsg({deviceModule:"TELNET",msgCfgReturn:"success"},sessionMsg);
                }
                else{
                    clearTimeout(sessionMsg.timeOutHandle);
                    sessionMsg.timeOutHandle = setTimeout(function(){
                        console.warn(".........." + "sessionMsg.timeOutHandle action" );
                        dealMsg({deviceModule:"TELNET",msgCfgReturn:"success"},sessionMsg);
                    },CONST_TIMER_INTERVAL);
                }
                return ;
            }
            else{
				if(jsonData.cmdProxy == '03'){
					sessionMsg.message = '';
				}
				
                //如果带有字段， 返回ok
                replyTelnetMsg2Browser({deviceModule:"TELNET",msgCfgReturn:"success"},
                    {returnType:"delivery", delivery:{data:jsonData, deliveryInfo:deliveryInfo},message:"ok"});
            }
        }

        var seqNum = getCmdSeqNum();

        sendTelnetMsg2Device(seqNum, jsonData, connection);
    });
}

Confmgr.prototype.procRedirectMsg2Device = function (jsonRecv, deliveryInfo) {
    console.warn(CONST_LOG_HEAD + "procRedirectMsg2Device() receive redirect msg from another webserver: %s", JSON.stringify(jsonRecv));
    function errProc (errCode, reason) {
        var replyRedirectMsg = {};
        replyRedirectMsg.url = "/confmgrlb";
        replyRedirectMsg.msgCfgReturn = "fail";
        replyRedirectMsg.reason = reason;
        replyRedirectMsg.errCode = errCode;
        replyRedirectMsg.data = jsonRecv.data;

        mqhd.replyMsg(JSON.stringify(replyRedirectMsg), deliveryInfo);
    }

    if (!jsonRecv || !jsonRecv.data) {
        console.warn(CONST_LOG_HEAD + "procRedirectMsg2Device() receive redirect msg is undefined");
        errProc(CONST_ERR_WEBSERVER, "request data is undefined" );

        return;
    }

    var jsonData = jsonRecv.data;

    pub.getMainConnection(jsonData.devSN, function (connection) {
        if (!connection || (connection == DEVICE_NOT_ONLINE)) {
            console.warn(CONST_LOG_HEAD + "procRedirectMsg2Device() main connection of %s is not found", jsonData.devSN);
            errProc(CONST_ERR_NO_MAIN_CONN, "main connection is not found");

            return;
        }


        var mapData = {};
        mapData.data = jsonData;
        mapData.deliveryInfo = deliveryInfo;
        mapData.timeHandle = 0;

        var seqNum = getCmdSeqNum();

        confmgr.cfgMap.set(seqNum, mapData);

        sendCfgMsg2Device(seqNum, jsonData, connection, function (reason) {
            var replyRedirectMsg = {};
            replyRedirectMsg.url = "/confmgrlb";
            replyRedirectMsg.msgCfgReturn = "fail";
            replyRedirectMsg.reason = reason;
            replyRedirectMsg.errCode = CONST_ERR_DEV_TIMEOUT;
            replyRedirectMsg.data = jsonRecv.data;

            mqhd.replyMsg(JSON.stringify(replyRedirectMsg), deliveryInfo);
        });
    });
};

function procCloudFirstMainConnectionUndefined (jsonDevData, res) {
    function errProc (errCode, reason, boolComm, arrDev) {
        if ("true" == jsonDevData.sceneFlag) {
            procOneCfgResultOfScene("cloudFirst", res, jsonDevData.sceneSeqNumber, jsonDevData.devSN, "fail", [], jsonDevData.serviceResult, reason || "", jsonDevData.bIsTestUser);

            return ;
        }

        sendOneCfgResult2Explore(res, "fail", arrDev, errCode, boolComm, jsonDevData.serviceResult, reason);
    }

    connectionModel.getWebserverAddress(jsonDevData.devSN, 'cmtnlmgr', 'base', function (err, serverAddress) {
        if (err || serverAddress == null) { //未成功获取主连接
            console.warn(CONST_LOG_HEAD + "procCloudFirstMainConnectionUndefined() main connection of %s is not found", jsonDevData.devSN);
            errProc(CONST_ERR_NO_MAIN_CONN, "main connection is not found", "fail", "");
        }
        else {//成功获取主连接
            var msgWebserver = {};
            msgWebserver.url = "/confmgrlb";
            msgWebserver.msgType = 2; //发给另一个webserver的重定向消息
            msgWebserver.data = jsonDevData;

            console.warn(CONST_LOG_HEAD + "cloud first, redirect msg to another webserver: %s", JSON.stringify(msgWebserver));
            mqhd.sendMsg(serverAddress, JSON.stringify(msgWebserver), function (jsonRecv) {
                console.warn(CONST_LOG_HEAD + "cloud first, receive redirect replyMsg from another webserver: %s", JSON.stringify(jsonRecv));
                if (!jsonRecv || !jsonRecv.data || !jsonRecv.data.deviceModule) {
                    errProc(CONST_ERR_WEBSERVER, "webserver process fail", "fail", "");
                    console.warn(CONST_LOG_HEAD + "cloud first, webserver internal error: the formate of receive redirect replyMsg error");

                    return;
                }

                if ("true" == jsonRecv.data.sceneFlag) {
                    procOneCfgResultOfScene("cloudFirst", res, jsonRecv.data.sceneSeqNumber, jsonRecv.devSN, jsonRecv.msgCfgReturn, jsonRecv.results || [], jsonRecv.data.serviceResult, jsonRecv.data.reason || jsonDevData.msgCfgErrInfo || "", jsonDevData.bIsTestUser);
                }
                else {
                    var errCode = CONST_ERR_SUCCESS;
                    if ("success" !=  jsonRecv.msgCfgReturn) {
                        errCode = jsonRecv.errCode ? jsonRecv.errCode : CONST_ERR_DEV_COMM;
                    }
                    else
                    {
                        connectionModel.updateMainConnectionTime(jsonDevData.devSN);
                    }

                    sendOneCfgResult2Explore(res, jsonRecv.msgCfgReturn, jsonRecv.results, errCode, jsonRecv.msgCfgReturn, jsonDevData.serviceResult, jsonDevData.reason || jsonDevData.msgCfgErrInfo);
                }
            });
        }
    });
}

function procMainConnectionUndefined (jsonDevData, res) {
    console.warn(CONST_LOG_HEAD +"come in procMainConnectionUndefined");
    var serviceConfmgrName = jsonDevData.bIsTestUser == true ? serviceConfmgr + basic.testSuffix : serviceConfmgr;

    function errProc (errCode, reason, boolComm, arrDev, boolService) {
        if ("true" == jsonDevData.sceneFlag) {
            procOneCfgResultOfScene("deviceFirst", res, jsonDevData.sceneSeqNumber, jsonDevData.devSN, "fail", [], "", reason || "", jsonDevData.bIsTestUser);

            return ;
        }

        sendOneCfgResult2Explore(res, "fail", arrDev, errCode, boolComm, boolService, reason);
    }

    connectionModel.getWebserverAddress(jsonDevData.devSN, 'cmtnlmgr', 'base', function (err, serverAddress) {
        var msgService = {};
        if (err || serverAddress == null) { //未成功获取主连接
            console.warn(CONST_LOG_HEAD + "procMainConnectionUndefined() main connection of %s is not found", jsonDevData.devSN);
            if ("false" == jsonDevData.careMainConn) {
                msgService = jsonDevData;
                msgService.url = "/confmgr";

                console.warn(CONST_LOG_HEAD + "send msg to service: %s", JSON.stringify(msgService));
                mqhd.sendMsg(serviceConfmgrName, JSON.stringify(msgService), function (jsonRecv) {
                    console.warn(CONST_LOG_HEAD + "receive msg from service: %s", JSON.stringify(jsonRecv));
                    var errCode = ("success" == jsonRecv.result) ? CONST_ERR_SUCCESS : CONST_ERR_SERVICE;

                    sendOneCfgResult2Explore(res, jsonRecv.result, [], errCode, "success", jsonRecv.result, jsonRecv.reason || "");
                });

                return ;
            }

            errProc(CONST_ERR_NO_MAIN_CONN, "main connection is not found", "fail", "", "");
        }
        else {//成功获取主连接
            console.warn(CONST_LOG_HEAD + "get main connection success and serverAddress is %s",serverAddress);
            var msgWebserver = {};
            msgWebserver.url = "/confmgrlb";
            msgWebserver.msgType = 2; //发给另一个webserver的重定向消息
            msgWebserver.data = jsonDevData;
            var timeouthandle = null;

            if ("true" != jsonDevData.sceneFlag) {
                timeouthandle = setTimeout(function(){
                    switch(jsonDevData.deviceModule.toLowerCase())
                    {
                        case "cmdproxy" : {
                            sendCfgProxyResult2Explore(res, "fail", CONST_ERR_DEV_TIMEOUT, "", "timeout");
                            break;
                        }
                        case "telnet" : {
                            console.log(CONST_LOG_HEAD + "device msgCfgReturn failed !");
                            res.end(JSON.stringify({data:"*****request timeout*****", reason:"telnet timeout"}));

                            //sendCfgProxyResult2Explore(res, "fail", CONST_ERR_DEV_COMM, "", []);
                            break;
                        }
                        /* confmgr的消息处理 */
                        default : {
                            sendOneCfgResult2Explore(res, "fail", "fail", CONST_ERR_DEV_TIMEOUT, "fail", "timeout", "timeout");
                        }
                    }
                },  jsonDevData.cfgTimeout * 1000 || 60000);
            }

            //console.warn(CONST_LOG_HEAD + "redirect msg to another webserver: %s", JSON.stringify(msgWebserver));
            mqhd.sendMsg(serverAddress, JSON.stringify(msgWebserver), function (jsonRecv) {
                console.warn(CONST_LOG_HEAD + "receive redirect replyMsg from another webserver: %s", JSON.stringify(jsonRecv));
                if (!jsonRecv || !jsonRecv.data || !jsonRecv.data.deviceModule) {
                    errProc(CONST_ERR_WEBSERVER, "webserver process fail", "fail", "", "");
                    console.warn(CONST_LOG_HEAD + "webserver internal error: the format of receive redirect replyMsg error");
                    return;
                }
                if("true" != jsonRecv.data.sceneFlag)
                {
                    clearTimeout(timeouthandle);
                    timeouthandle = null;
                }
                if ("success" == jsonRecv.msgCfgReturn) {
                    delete jsonRecv.msgCfgReturn;
                    switch ((jsonRecv.data.deviceModule).toLowerCase()) {
                        case "cmdproxy" : {
                            sendCfgProxyResult2Explore(res, "success", CONST_ERR_SUCCESS, jsonRecv.echoInfo, "success", jsonRecv.results);
                            break;
                        }
                        case "telnet" :{

                            var TelnetData = {session: jsonRecv.session, data: jsonRecv.echoInfo};
                            if(!jsonRecv.session)
                            {
                                res.end();
                            }
                            else
                            {
                                //res.send(new Buffer(JSON.stringify(TelnetData)));
                                res.set({'Content-Type': 'application/json'});
                                res.json(TelnetData);
                                res.end();
                            }
							
                            //sendCfgProxyResult2Explore(res, "success", CONST_ERR_SUCCESS, jsonRecv.echoInfo, "success", jsonRecv.results);
                            break;
                        }
                        /* confmgr的消息处理 */
                        default : {
                            if(jsonRecv.data.devSN)
                            {
                                connectionModel.updateMainConnectionTime(jsonRecv.data.devSN);
                            }
                            if ("true" == jsonRecv.data.sceneFlag) {
                                procOneCfgResultOfScene("deviceFirst", res, jsonDevData.sceneSeqNumber, jsonRecv.devSN, "success", jsonRecv.results || [], "", "", jsonDevData.bIsTestUser);
                            }
                            else {
                                msgService = {};
                                jsonCopy(msgService, jsonRecv);
                                jsonCopy(msgService, jsonRecv.data);
                                delete msgService.data;
                                delete msgService.optType;
                                delete msgService.msgType;
                                msgService.url = "/confmgr";
                                console.warn(CONST_LOG_HEAD + "send msg to service: %s", JSON.stringify(msgService));
                                mqhd.sendMsg(serviceConfmgrName, JSON.stringify(msgService), function (serviceData) {
                                    console.warn(CONST_LOG_HEAD + "receive msg from service: %s", JSON.stringify(serviceData));
                                    var errCode = ("success" == serviceData.result) ? CONST_ERR_SUCCESS : CONST_ERR_SERVICE;
                                    sendOneCfgResult2Explore(res, serviceData.result, jsonRecv.results, errCode, "success", serviceData.result, serviceData.reason);
                                });
                            }
                            break;
                        }
                    }
                }
                else {
                    switch ((jsonRecv.data.deviceModule).toLowerCase()) {
                        case "cmdproxy" : {
                            sendCfgProxyResult2Explore(res, "fail", CONST_ERR_DEV_COMM, "", []);
                            break;
                        }
                        case "telnet" : {
                            console.log(CONST_LOG_HEAD + "device msgCfgReturn failed !");

                            if(jsonRecv.hasOwnProperty("msgCfgErrInfo")){
                                res.end(JSON.stringify({
                                    data:jsonRecv.echoInfo,
                                    reason:"telnet connection failed",
                                    msgCfgErrInfo:jsonRecv.msgCfgErrInfo
                                }));
                            }else{
                                res.end(JSON.stringify({data:jsonRecv.echoInfo, reason:"telnet connection failed"}));
                            }
                            //sendCfgProxyResult2Explore(res, "fail", CONST_ERR_DEV_COMM, "", []);
                            break;
                        }
                        /* confmgr的消息处理 */
                        default : {
                            if ("true" == jsonRecv.data.sceneFlag) {
                                procOneCfgResultOfScene("deviceFirst", res, jsonDevData.sceneSeqNumber, jsonRecv.devSN, "fail", jsonRecv.results || [], "", jsonRecv.msgCfgErrInfo || "", jsonDevData.bIsTestUser);
                            }
                            else if ((jsonRecv.hasOwnProperty("msgCfgErrInfo") == true) && ("" == jsonRecv.msgCfgErrInfo)){
                                console.warn(CONST_LOG_HEAD + "Device does not support DRS");
                                sendOneCfgResult2Explore(res, "fail", [], CONST_ERR_DEV_NO_SUPPORT_DRS, "fail", "", "Device does not support DRS");
                            }
                            else {
                                console.warn(CONST_LOG_HEAD + "communicate with device except");
                                if (CONST_ERR_NO_MAIN_CONN == jsonRecv.errCode && "false" == jsonDevData.careMainConn) {
                                    msgService = jsonDevData;
                                    msgService.url = "/confmgr";
                                    console.warn(CONST_LOG_HEAD + "send msg to service: %s", JSON.stringify(msgService));
                                    mqhd.sendMsg(serviceConfmgrName, JSON.stringify(msgService), function (jsonRecv) {
                                        //console.warn(CONST_LOG_HEAD + "receive msg from service: %s", JSON.stringify(jsonRecv));
                                        var errCode = ("success" == jsonRecv.result) ? CONST_ERR_SUCCESS : CONST_ERR_SERVICE;
                                        sendOneCfgResult2Explore(res, jsonRecv.result, [], errCode, "success", jsonRecv.result, jsonRecv.reason);
                                    });

                                    return ;
                                }
                                var errCode = jsonRecv.errCode ? jsonRecv.errCode : CONST_ERR_DEV_COMM;
                                sendOneCfgResult2Explore(res, "fail", [], errCode, "fail", "", "communicate with device except");
                            }
                            break;
                        }
                    }
                }
            });
        }
    });
}

function resetTimeout(sessionMap)//前端保活定时器
{
    if(sessionMap.timeoutID)
    {
        //取消之前定时器
        clearTimeout(sessionMap.timeoutID);
    }
    //重启定时器
    sessionMap.timeoutID = setTimeout(function () {
        /* 超时后 通知设备断开telnet并删除当前session*/
        console.warn(CONST_LOG_HEAD + "..........can`t connect to explore, timeout close session!");
        closeSession(sessionMap);
    }, 2 * 60 *1000 );

}

function closeSession(sessionMap){
    var jsonData = {deviceModule:"TELNET",
        cmdProxy:"",
        timeOut:"",
        session:sessionMap.session
    };

    /* 获取主链接，发送timeout 断开telnet并删除sessionId */
    pub.getMainConnection(sessionMap.devSN, function (connection) {
        if (connection && (connection != DEVICE_NOT_ONLINE)) {
            sendTelnetMsg2Device(getCmdSeqNum(), jsonData, connection);
        }
    });

    confmgr.telnetSessionMap.delete(sessionMap.session);
}

function sendOneCfgMsg2Dev (jsonData, res) {
    console.warn(CONST_LOG_HEAD_SCENE + "come in sendOneCfgMsg2Dev()");

    function errProc(reason) {
        if ("true" == jsonData.sceneFlag) {
            procOneCfgResultOfScene("deviceFirst", res, jsonData.sceneSeqNumber, jsonData.devSN, "fail", [], "", reason || "", jsonData.bIsTestUser);

            return ;
        }

        sendOneCfgResult2Explore(res, "fail", [], CONST_ERR_DEV_TIMEOUT, "fail", "", reason);
    }

    pub.getMainConnection(jsonData.devSN, function (connection) {
        if (connection == DEVICE_NOT_ONLINE) {
            console.warn(CONST_LOG_HEAD_SCENE + "device not online");
            
            errProc("device is not onLine");
            
            return;
        }

        if (!connection) {
            console.warn(CONST_LOG_HEAD_SCENE + "main connection is not find");
            
            procMainConnectionUndefined(jsonData, res);

            return;
        }

        var mapData = {};
        mapData.data = jsonData;
        mapData.res = res;

        var seqNum = getCmdSeqNum();

        confmgr.cfgMap.set(seqNum, mapData);

        sendCfgMsg2Device(seqNum, jsonData, connection, errProc);
    });
}

function sendSceneCfgMsg2Dev (jsonData, res) {
    //console.warn(CONST_LOG_HEAD + "process send scene cfg to device: %s", JSON.stringify(jsonData));
    console.warn(CONST_LOG_HEAD_SCENE + "come in sendSceneCfgMsg2Dev()");

    var jsonOption = {
        "userName"   : jsonData.userName,
        "shopName"   : jsonData.shopName,
        "scenarioId" : jsonData.nasId
    };

    getDevListByScene(jsonOption, function (reply) {
        console.warn(CONST_LOG_HEAD_SCENE + "reply is: " + JSON.stringify(reply));

        if ("fail" == reply || reply.error_code) {
            /* 出错处理，返回给浏览器错误 */
            console.warn(CONST_LOG_HEAD + "sendSceneCfgMsg2Dev() get devList error: %s", JSON.stringify(reply));
            sendSceneCfgResult2Explore(res, "fail", [], "permission deny");
            return ;
        }

        var devList = reply.data_list || [];

        if (0 === devList.length) {
            /* 直接将消息发给微服务 */
            console.warn(CONST_LOG_HEAD + "sendSceneCfgMsg2Dev() devList is null");
            console.warn(CONST_LOG_HEAD_SCENE + "devList.length is 0");

            jsonData.subMsgType = CONST_SUBMSG_FROM_EXPLORE;
            jsonData.url = "/confmgr";

            var serviceConfmgrName = jsonData.bIsTestUser == true ? serviceConfmgr + basic.testSuffix : serviceConfmgr;
            mqhd.sendMsg(serviceConfmgrName, JSON.stringify(jsonData), function (jsonSer) {
                sendSceneCfgResult2Explore(res, jsonSer.result, [], jsonSer.reason);
            });
            return ;
        }
        //允许devsn数组下发， 但是devsn必须是同一个nasID下面的
        if(jsonData.devSN && Array.isArray(jsonData.devSN) && jsonData.devSN.length)
        {
            //排查是否有不符合条件的设备序列号
            var tempDevlist = {};
            for(var i in devList)
            {
                tempDevlist[devList[i]] = true;
            }
            for(var j in jsonData.devSN)
            {
                if(!tempDevlist[jsonData.devSN[j]])
                {
                    sendSceneCfgResult2Explore(res, "fail", [], "extra devSN of scenarioid");
                    return;
                }
            }
            devList = jsonData.devSN;
        }

        var sceneSeqNum = getSceneSeqNum();
        var sceneCfg = {};
        sceneCfg.cfg = jsonData;
        sceneCfg.cfg.subMsgType = CONST_SUBMSG_FROM_EXPLORE;
        sceneCfg.devNum = devList.length;
        sceneCfg.deviceResults = [];
        sceneCfg.res = res;

        //此处加一个setTimeout

        var devSNmap = {};
        devList.map(function(devSN){
            devSNmap[devSN] = true;
        });

        sceneCfg.timeouthandle = setTimeout(function(){
            var resultMap = confmgr.sceneMap.get(sceneSeqNum);
            if(!resultMap)
            {
                return;
            }
            for(var i = 0; i < resultMap.deviceResults.length; i++)
            {
                delete devSNmap[resultMap.deviceResults[i].devSN];
            }
            for(var j in devSNmap)
            {
                resultMap.deviceResults.push({devSN:j, communicateResult:"fail", deviceResult:"timeout"})
            }
            sendSceneCfgResult2Explore(resultMap.res, "fail", resultMap.deviceResults, "timeout");
            confmgr.sceneMap.delete(sceneSeqNum);
        }, jsonData.cfgTimeout * 1000 || 60000);
        
        confmgr.sceneMap.set(sceneSeqNum, sceneCfg);

        for (var i = 0; i < devList.length; i++) {
            var jsonDev = {};
            jsonCopy(jsonDev, jsonData);
            jsonDev.devSN = devList[i];
            jsonDev.sceneSeqNumber = sceneSeqNum;
            
            console.warn(CONST_LOG_HEAD_SCENE + "jsonDev is: " + JSON.stringify(jsonDev));
            
            sendOneCfgMsg2Dev(jsonDev, res);
        }
    });
}

function sendCloudFirstOneCfgMsg2Dev(jsonData, res) {
    function errProc (reason) {
        if ("true" == jsonData.sceneFlag) {
            procOneCfgResultOfScene("cloudFirst", res, jsonData.sceneSeqNumber, jsonData.devSN, "fail", [], jsonData.serviceResult, jsonData.reason, jsonData.bIsTestUser);

            return ;
        }

        sendOneCfgResult2Explore(res, "fail", [], CONST_ERR_DEV_TIMEOUT, "fail", jsonData.serviceResult, reason);
    }

    pub.getMainConnection(jsonData.devSN, function (connection) {
        if(connection == DEVICE_NOT_ONLINE)
        {
            errProc("device is not onLine");
            return;
        }
        if (!connection) {
            procCloudFirstMainConnectionUndefined(jsonData, res);

            return;
        }

        var mapData = {};
        mapData.data = jsonData;
        mapData.res = res;

        var seqNum = getCmdSeqNum();

        confmgr.cfgMap.set(seqNum, mapData);

        sendCfgMsg2Device(seqNum, jsonData, connection, errProc);
    });
}

function sendCloudFirstSceneCfgMsg2Dev(jsonData, res) {
    //console.warn(CONST_LOG_HEAD + "cloud first, process send scene cfg to device: %s", JSON.stringify(jsonData));
    var jsonOption = {
        "userName"   : jsonData.userName,
        "shopName"   : jsonData.shopName,
        "scenarioId" : jsonData.nasId
    };

    getDevListByScene(jsonOption, function (reply) {
        if ("fail" == reply || reply.error_code) {
            /* 出错处理，返回给浏览器错误 */
            console.warn(CONST_LOG_HEAD + "cloud first, sendSceneCfgMsg2Dev() get devList error: %s", JSON.stringify(reply));
            sendSceneCfgResult2Explore(res, jsonData.serviceResult, [], "permission deny");

            return ;
        }

        var devList = reply.data_list || [];

        if (0 === devList.length) {
            /* 直接将消息发给浏览器 */
            console.warn(CONST_LOG_HEAD + "cloud first, sendSceneCfgMsg2Dev() devList is null");
            sendSceneCfgResult2Explore(res, jsonData.serviceResult, [], "no device in scene");

            return ;
        }

        var sceneSeqNum = getSceneSeqNum();
        var sceneCfg = {};
        sceneCfg.cfg = jsonData;
        sceneCfg.devNum = devList.length;
        sceneCfg.deviceResults = [];
        sceneCfg.res = res;

        //此处加一个setTimeout
        var devSNmap = {};
        devList.map(function(devSN){
            devSNmap[devSN] = true;
        });

        sceneCfg.timeouthandle = setTimeout(function(){
            var resultMap = confmgr.sceneMap.get(sceneSeqNum);
            if(!resultMap)
            {
                return;
            }
            for(var i = 0; i < resultMap.deviceResults.length; i++)
            {
                delete devSNmap[resultMap.deviceResults[i].devSN];
            }
            for(var j in devSNmap)
            {
                resultMap.deviceResults.push({devSN:j, communicateResult:"fail", deviceResult:"timeout"})
            }
            sendSceneCfgResult2Explore(resultMap.res, jsonOption.serviceResult, resultMap.deviceResults, "timeout");
            confmgr.sceneMap.delete(sceneSeqNum);
        }, jsonData.cfgTimeout * 1000);
        
        confmgr.sceneMap.set(sceneSeqNum, sceneCfg);

        for (var i = 0; i < devList.length; i++) {
            var jsonDev = {};
            jsonCopy(jsonDev, jsonData);
            jsonDev.devSN = devList[i].toUpperCase();
            jsonDev.sceneSeqNumber = sceneSeqNum;
            sendCloudFirstOneCfgMsg2Dev(jsonDev, res);
        }
    });
}

function procExploreSendCfg2Device (jsonData, res) {
    console.warn(CONST_LOG_HEAD_SCENE + "come in procExploreSendCfg2Device()");

    // "严重,错误,警告,普通" 改为  “Severe,Mistake,Warning,Common”
    if ("CMDPROXY" == jsonData.deviceModule && "#" != jsonData.cmdProxy) {
        sendLog(jsonData.userName, jsonData.devSN, jsonData.ip, "Command Helper", "Common", jsonData.cmdProxy);
    }

    if ("cloudFirst" == jsonData.policy) {
        var msgService = jsonData;
        msgService.url = "/confmgr";
        msgService.subMsgType = CONST_SUBMSG_FROM_EXPLORE;
        //console.warn(CONST_LOG_HEAD + "cloud first, send msg to service: %s", JSON.stringify(msgService));
        var serviceConfmgrName = jsonData.bIsTestUser == true ? serviceConfmgr + basic.testSuffix : serviceConfmgr;
        mqhd.sendMsg(serviceConfmgrName, JSON.stringify(msgService), function (jsonSer) {
            //console.warn(CONST_LOG_HEAD + "cloud first, receive msg from service: %s", JSON.stringify(jsonSer));
            if ("fail" == jsonSer.result) {
                if ("true" == jsonData.sceneFlag) {
                    sendSceneCfgResult2Explore(res, "fail", [], jsonSer.reason);
                }
                else {
                    sendOneCfgResult2Explore(res, "fail", [], CONST_ERR_SERVICE, "", "fail", jsonSer.reason);
                }

                return ;
            }
            jsonData.serviceResult = "success";
            jsonData.reason = "";
            if (jsonSer.newReq){
                jsonData.method = jsonSer.newReq.method;
                jsonData.param = jsonSer.newReq.param;
                if(jsonSer.newReq.list)
                {
                    jsonData.list = jsonSer.newReq.list;
                }
            }
            if ("true" == jsonData.sceneFlag) {
                sendCloudFirstSceneCfgMsg2Dev(jsonData, res);
            }
            else {
                sendCloudFirstOneCfgMsg2Dev(jsonData, res);
            }
        });
    }
    else {
        if ("true" == jsonData.sceneFlag) {
            console.warn(CONST_LOG_HEAD_SCENE + "sceneFlag is true");
            sendSceneCfgMsg2Dev(jsonData, res);
        }
        else {
            console.warn(CONST_LOG_HEAD_SCENE + "sceneFlag is not exist");
            sendOneCfgMsg2Dev(jsonData, res);
        }
    }
}

function procExploreSendMsg2Service (jsonSerData, res) {
    var msgService = jsonSerData;
    msgService.url = "/confmgr";
    msgService.subMsgType = CONST_SUBMSG_FROM_EXPLORE;

    if (undefined != jsonSerData.isActiveDownCfg) {
        msgService.subMsgType = CONST_SUBMSG_SMOOTH_ALL;
    }

    var serviceConfmgrName = jsonSerData.bIsTestUser == true ? serviceConfmgr + basic.testSuffix : serviceConfmgr;
    mqhd.sendMsg(serviceConfmgrName, JSON.stringify(msgService), function (serviceData) {
        var msgExplore = {};
        msgExplore.result = serviceData.result;
        msgExplore.reason = serviceData.reason;
        res.end(JSON.stringify(msgExplore));
    });
}

/* 浏览器来的Telnet消息 */
Confmgr.prototype.procExploreTelnetMsg = function (jsonData, res) {
    console.warn(CONST_LOG_HEAD +"come in procExploreTelnetMsg");

    /* 获取当前设备的主链接 */
    pub.getMainConnection(jsonData.devSN, function (connection) {
        if(connection == DEVICE_NOT_ONLINE)
        {
            //errProc("device is not onLine");
			res.end(JSON.stringify({data:"device is not online"}));
            return;
        }
        if (!connection) {
            procMainConnectionUndefined(jsonData, res);
            return;
        }
        /* 成功获取主链接 */
        /* session不存在时，创建session并告知前端{session：xx,data: "..."}&&下发Telnet消息给设备 */
        if(!jsonData.session)
        {
            console.warn(CONST_LOG_HEAD + "session is not exist and create it");
            jsonData.session = createNewSession(jsonData.devSN);
            console.warn(CONST_LOG_HEAD + "session is ",jsonData.session);
			res.end(JSON.stringify({session:jsonData.session, data:""}));
        }

        /* session存在时，通过Map查找上下文；存在上下文起前端保活定时器，不存在上下文告知前端{session:XX,data:"error"} */
        else{
            jsonData.session = Number(jsonData.session);
            var sessionMsg = confmgr.telnetSessionMap.get(jsonData.session);

            if(!sessionMsg){
				res.end(JSON.stringify({data:"error: session is invalid"}));
                return;
            }

            /* 前端主动关闭telnet */
            if(jsonData.hasOwnProperty("timeOut")){
                console.warn(CONST_LOG_HEAD + "..........explore command to close session!");
                closeSession(sessionMsg);
                return;
            }

            /* 前端保活定时器 */
            resetTimeout(sessionMsg);

            /* 前端输入命令，告知前端ok并发送命令给设备
            命令为空时，判断上下文中message是否存在，存在发给前端;不存在，起定时器，超时返回前端*/
            if(!jsonData.cmdProxy){
                if(sessionMsg.returnType)
                {
                    dealMsg({deviceModule:"TELNET",msgCfgReturn:"success"},sessionMsg);
                }
                sessionMsg.returnType = "res";//delivery  && response
                sessionMsg.res = res;
                if(sessionMsg.message){
                    dealMsg({deviceModule:"TELNET",msgCfgReturn:"success"},sessionMsg);
                }
                else{
                    clearTimeout(sessionMsg.timeOutHandle);
                    sessionMsg.timeOutHandle = setTimeout(function(){
                        dealMsg({deviceModule:"TELNET",msgCfgReturn:"success"},sessionMsg);
                    },CONST_TIMER_INTERVAL);
                }
                return ;
            }
            else{
				if(jsonData.cmdProxy == '03'){
					sessionMsg.message = '';
				}
                //res.end(JSON.stringify({session:jsonData.session, data:"ok"}));
                res.end();
            }
        }
        var seqNum = getCmdSeqNum();

        sendTelnetMsg2Device(seqNum, jsonData, connection);
    });
}


Confmgr.prototype.procExploreMsg = function (jsonData, res) {
    console.warn(CONST_LOG_HEAD_SCENE + "come in Confmgr.prototype.procExploreMsg()");
    if (undefined == jsonData.configType) {
        console.warn(CONST_LOG_HEAD + "procExploreMsg() config type is undefined, receive msg from explore: %s", JSON.stringify(jsonData));
        return;
    }

    switch (Number(jsonData.configType)) {
        /* 浏览器配置下发设备 */
        case CONST_EXPLORE_PUT_DATA_2_DEVICE : {
            console.warn(CONST_LOG_HEAD_SCENE + "configType is 0");
            procExploreSendCfg2Device(jsonData, res);
            break;
        }
        /* 浏览器消息直接发给微服务 */
        case CONST_EXPLORE_PUT_DATA_2_SERVICE : {
            procExploreSendMsg2Service(jsonData, res);
            break;
        }
        default : {
            console.warn(CONST_LOG_HEAD + "procExploreMsg() config type is unknown, receive msg from explore: %s", JSON.stringify(jsonData));
            break;
        }
    }
};

function procSendDevMsg2Service (jsonDevData) {
    console.warn(CONST_LOG_HEAD + "send device msg to service: %s", JSON.stringify(jsonDevData));

    var serviceConfmgrName = jsonDevData.bIsTestUser == true ? serviceConfmgr + basic.testSuffix : serviceConfmgr;
    mqhd.sendMsg(serviceConfmgrName, JSON.stringify(jsonDevData));
}

function procOneCfgResult (reserveData, res, jsonDevData) {
    console.warn(CONST_LOG_HEAD + "come in procOneCfgResult()");
    if (!res) {
        console.warn(CONST_LOG_HEAD + "procOneCfgResult() no res in cfgMap");
        return;
    }

    /* 模块（drs、wips、probe）处理成功, 通知配置管理微服务. */
    if ("success" == jsonDevData.msgCfgReturn) {
        delete jsonDevData.msgCfgReturn;

        /* 配置代理消息直接返回给浏览器 */
        if (reserveData.deviceModule && "cmdproxy" == (reserveData.deviceModule).toLowerCase()) {
            sendCfgProxyResult2Explore(res, "success", CONST_ERR_SUCCESS, jsonDevData.echoInfo, "success", jsonDevData.results);

            return;
        }

        var msgService = reserveData;
        jsonCopy(msgService, jsonDevData);
        msgService.url = "/confmgr";

        console.warn(CONST_LOG_HEAD + "send msg to service: %s", JSON.stringify(msgService));
        var serviceConfmgrName = jsonDevData.bIsTestUser == true ? serviceConfmgr + basic.testSuffix : serviceConfmgr;
        mqhd.sendMsg(serviceConfmgrName, JSON.stringify(msgService), function (serviceData) {
            console.warn(CONST_LOG_HEAD + "receive msg from service: %s", JSON.stringify(serviceData));

            var errCode = ("success" == serviceData.result) ? CONST_ERR_SUCCESS : CONST_ERR_SERVICE;
            sendOneCfgResult2Explore(res, serviceData.result, jsonDevData.results, errCode, "success", serviceData.result, serviceData.reason);
        });
    }else if ((jsonDevData.hasOwnProperty("msgCfgErrInfo") == true) && ("" == jsonDevData.msgCfgErrInfo)){
        console.warn(CONST_LOG_HEAD + "Device does not support DRS");
        sendOneCfgResult2Explore(res, "fail", [], CONST_ERR_DEV_NO_SUPPORT_DRS, "fail", "", "Device does not support DRS");
    }
    else {
        console.warn(CONST_LOG_HEAD + "communicate with device except");
        sendOneCfgResult2Explore(res, "fail", [], CONST_ERR_DEV_COMM, "fail", "", "communicate with device except");
    }
}

function procCloudFirstOneCfgResult (reserveData, res, jsonDevData) {
    if (!res) {
        console.warn(CONST_LOG_HEAD + "procOneCfgResult() no res in cfgMap");
        return;
    }

    var errCode = CONST_ERR_SUCCESS;
    var reason = "";
    if ("success" != jsonDevData.msgCfgReturn) {
        errCode = CONST_ERR_DEV_COMM;
        reason = "communicate with device except";
    }

    sendOneCfgResult2Explore(res, jsonDevData.msgCfgReturn, jsonDevData.results, errCode, jsonDevData.msgCfgReturn, reserveData.serviceResult, reason);
}

function procExploreCfgResult (jsonDevData, reserveData) {
    console.warn(CONST_LOG_HEAD_SCENE + "come in procExploreCfgResult()");

    var delivery = reserveData.deliveryInfo;
    if (delivery) {
        console.warn(CONST_LOG_HEAD_SCENE + "delivery is exist");

        delete reserveData.deliveryInfo;
        jsonCopy(reserveData, jsonDevData);
        delete reserveData.optType;
        delete reserveData.msgType;
        reserveData.url = "/confmgrlb";

        mqhd.replyMsg(JSON.stringify(reserveData), delivery);
        console.warn(CONST_LOG_HEAD + "reply msg to another webserver: %s", JSON.stringify(reserveData));

        return;
    }
    console.warn(CONST_LOG_HEAD_SCENE + "no delivery");

    var reserveCfg = reserveData.data;
    var res = reserveData.res;

    if (!reserveCfg) {
        console.warn(CONST_LOG_HEAD + "procExploreCfgResult() no reserve cfg in cfgMap");

        return;
    }

    if ("cloudFirst" == reserveCfg.policy) {
        console.warn(CONST_LOG_HEAD_SCENE + "reserveCfg.policy is cloudFirst");

        if ("true" == reserveCfg.sceneFlag) {
            procOneCfgResultOfScene("cloudFirst", res, reserveCfg.sceneSeqNumber, jsonDevData.devSN, jsonDevData.msgCfgReturn || "fail", jsonDevData.results || [], reserveCfg.serviceResult, reserveCfg.reason, jsonDevData.bIsTestUser);

            return ;
        }

        procCloudFirstOneCfgResult(reserveCfg, res, jsonDevData);
    }
    else {
        console.warn(CONST_LOG_HEAD_SCENE + "reserveCfg.policy is deviceFirst");

        if ("true" == reserveCfg.sceneFlag) {
            console.warn(CONST_LOG_HEAD_SCENE + "reserveCfg.sceneFlag is true");
            procOneCfgResultOfScene("deviceFirst", res, reserveCfg.sceneSeqNumber, jsonDevData.devSN, jsonDevData.msgCfgReturn || "fail", jsonDevData.results || [], "", "", jsonDevData.bIsTestUser);

            return ;
        }

        procOneCfgResult(reserveCfg, res, jsonDevData);
    }
}

function procServiceCfgResult (jsonDevData, reserveData) {
    var reserveCfg = reserveData.data;

    if (!reserveCfg) {
        console.warn(CONST_LOG_HEAD + "procExploreCfgResult() no reserve cfg in cfgMap");

        return;
    }

    var msgService = {};
    msgService.url = "/confmgr";
    msgService.communicateResult = jsonDevData.msgCfgReturn;
    msgService.subMsgType = CONST_SUBMSG_CFG_FROM_SERVICE;
    delete jsonDevData.msgCfgReturn;
    jsonCopy(msgService, reserveCfg);
    jsonCopy(msgService, jsonDevData);
    var serviceConfmgrName = jsonDevData.bIsTestUser == true ? serviceConfmgr + basic.testSuffix : serviceConfmgr;
    mqhd.sendMsg(serviceConfmgrName, JSON.stringify(msgService));
    console.warn(CONST_LOG_HEAD + "procServiceCfgResult() send msg to service: %s", JSON.stringify(msgService));
}

function procCfgResult (jsonDevData) {
    console.warn(CONST_LOG_HEAD_SCENE + "come in procCfgResult()");

    if (undefined == jsonDevData.seqNumber) {
        console.warn(CONST_LOG_HEAD + "procCfgResult() seqNumber undefined, device data: %s", JSON.stringify(jsonDevData));
        return ;
    }
    var seqNum = Number(jsonDevData.seqNumber);
    var reserveData = confmgr.cfgMap.get(seqNum);
    reserveData.timeHandle && clearTimeout(reserveData.timeHandle);
    confmgr.cfgMap.delete(seqNum);

    if (!reserveData || !reserveData.data || undefined == reserveData.data.configType) {
        console.warn(CONST_LOG_HEAD + "procCfgResult() no data in cfgMap, device data: %s", JSON.stringify(jsonDevData));

        return;
    }

    if (CONST_EXPLORE_PUT_DATA_2_DEVICE == Number(reserveData.data.configType)) {
        console.warn(CONST_LOG_HEAD_SCENE + "configType is 0");
        procExploreCfgResult(jsonDevData, reserveData);
    }
    else if (CONST_SERVICE_PUT_CFG_2_DEVICE == Number(reserveData.data.configType)) {
        procServiceCfgResult(jsonDevData, reserveData);
    }
}


Confmgr.prototype.procTelnetDevMsg = function (jsonDevData) {
    console.warn(CONST_LOG_HEAD + "procTelnetDevMsg() receive msg from device: %s", JSON.stringify(jsonDevData));

    //设备返回telnet的数据，不必关心数据类型，直接在echoMsg中的数据就是；
    var sessionMsg  = confmgr.telnetSessionMap.get(Number(jsonDevData.session));
    if(!sessionMsg)
    {
        //设备返回的数据反查不到连接信息，无法给设备发送信息
        console.error(CONST_LOG_HEAD + "session is invalid");
        return;
    }
    /* 设备返回信息，填充进message这个缓冲区中 */
    if(jsonDevData.echoInfo){//不管结果如何，
        sessionMsg.message += jsonDevData.echoInfo;
    }

    /* 当定时器存在，清除定时器并返回缓冲区message中数据给前端 */
    if(sessionMsg.timeOutHandle)
    {
        clearTimeout(sessionMsg.timeOutHandle);
        sessionMsg.timeOutHandle = null;
        dealMsg(jsonDevData, sessionMsg);
    }
}

function dealMsg(jsonData, sessionMsg)
{
    if(jsonData.msgCfgReturn == 'fail') {
        console.warn(CONST_LOG_HEAD + "..........device command to close session!");
        replyTelnetMsg2Browser(jsonData, sessionMsg);
        closeSession(sessionMsg);
    }
    else{
        jsonData.session = sessionMsg.session;
        replyTelnetMsg2Browser(jsonData, sessionMsg);
    }
}

function replyTelnetMsg2Browser(jsonData, sessionMsg)
{
	var messageLen = sessionMsg.message.length;
	var subString = '';

    /* 信息长度小于等于4K字节 发送给前端并清空缓存区 */
	if(messageLen <= CONST_MESSAGELEN_10K) {
		subString = sessionMsg.message;
		sessionMsg.message = '';
	}
    /* 大于4K字节时，每4K字节返回前端 */
	else{
		subString = sessionMsg.message.substring(0,CONST_MESSAGELEN_10K);
		sessionMsg.message = sessionMsg.message.substring(CONST_MESSAGELEN_10K);
	}

	switch(sessionMsg.returnType)
    {
		
        /* 重定向webserver */
        case "delivery":
        {
            //{data:{deviceModule:"TELNET"},msgCfgReturn:"success"},
            var deliveryData = {data:sessionMsg.delivery.data};
            deliveryData.data.deviceModule = jsonData.deviceModule;
            deliveryData.echoInfo = subString;
            deliveryData.session = jsonData.session;
            deliveryData.msgCfgReturn  = jsonData.msgCfgReturn;
            deliveryData.url = "/confmgrlb";

            if(jsonData.hasOwnProperty("msgCfgErrInfo")){
                deliveryData.msgCfgErrInfo = jsonData.msgCfgErrInfo;
            }

            console.warn(CONST_LOG_HEAD + "replyMsg to webserver and deliveryData is %s",JSON.stringify(deliveryData));
            mqhd.replyMsg(JSON.stringify(deliveryData), sessionMsg.delivery.deliveryInfo);
            sessionMsg.returnType = '';
            sessionMsg.delivery  = '';

            break;
        }
        /* 本地webserver */
        case "res":
        {
            var res = sessionMsg.res;
            res.set({'Content-Type': 'application/json'});
            // res.send(new Buffer(JSON.stringify({session:jsonData.session, data:subString})));
            if(jsonData.hasOwnProperty("msgCfgErrInfo")){
                res.json({session:jsonData.session, data:subString, msgCfgErrInfo:jsonData.msgCfgErrInfo});
            }else{
                res.json({session:jsonData.session, data:subString});
            }

            res.end();
            sessionMsg.res = '';
            sessionMsg.returnType = '';

            break;
        }
        default:{
            break;
        }
    }
}


Confmgr.prototype.procDevMsg = function (jsonDevData) {
    console.warn(CONST_LOG_HEAD_SCENE + "come in Confmgr.prototype.procDevMsg()");
    // console.warn(CONST_LOG_HEAD + "procDevMsg() receive msg from device: %s", JSON.stringify(jsonDevData));
    if (undefined == jsonDevData.subMsgType) {
        console.warn(CONST_LOG_HEAD + "procDevMsg() subMsgType undefined");
        return;
    }

    switch (Number(jsonDevData.subMsgType)) {
        /* 设备端对云端下发的配置返回结果处理 */
        case CONST_SUBMSG_FROM_EXPLORE : {
            console.warn(CONST_LOG_HEAD_SCENE + "subMsgType is 0");
            procCfgResult(jsonDevData);
            break;
        }
        /* 设备端上报平滑开始、平滑配置、平滑结束和正常的配置 */
        case CONST_SUBMSG_SMOOTH_START:
        case CONST_SUBMSG_RECV_DEVICE_CFG:
        case CONST_SUBMSG_SMOOTH_END:
        case CONST_SUBMSG_DEVICE_SEND_CFG :
        case CONST_SUBMSG_DEVICE_GET_CFG :{
            procSendDevMsg2Service(jsonDevData);
            break;
        }
        default : {
            console.warn(CONST_LOG_HEAD + "procMsgFromDev() subMsgType unknown");
            break;
        }
    }
};

function sendOneSerCfg2Dev (jsonSerData) {

    function errProc (reason) {
        var msgService = {};
        msgService.url = "/confmgr";
        msgService.communicateResult = "fail";
        msgService.subMsgType = CONST_SUBMSG_CFG_FROM_SERVICE;
        msgService.reason = reason;
        jsonCopy(msgService, jsonSerData);

        var serviceConfmgrName = jsonSerData.bIsTestUser == true ? serviceConfmgr + basic.testSuffix : serviceConfmgr;
        mqhd.sendMsg(serviceConfmgrName, JSON.stringify(msgService));
        console.warn(CONST_LOG_HEAD + "send msg to service: %s", JSON.stringify(msgService));
    }

    if (!jsonSerData.devSN) {
        errProc("message unknown");
        console.warn(CONST_LOG_HEAD + "procMsgFromService() msg unknown");
        return ;
    }

    pub.getMainConnection(jsonSerData.devSN, function (connection) {
        if(connection == DEVICE_NOT_ONLINE)
        {
            errProc("device is not onLine");
            return;
        }
        if (!connection) {
            errProc("main connection is not found");
            console.warn(CONST_LOG_HEAD + "procMsgFromService() main connection of device[%s] is not found", jsonSerData.devSN);
            return ;
        }

        var seqNum = getCmdSeqNum();
        var jsonCfg = {};
        jsonCfg.data = jsonSerData;
        confmgr.cfgMap.set(seqNum, jsonCfg);

        sendCfgMsg2Device(seqNum, jsonSerData, connection, errProc);
    });
}

Confmgr.prototype.procServiceMsg = function (jsonSerData) {
    //console.warn(CONST_LOG_HEAD + "procMsgFromService() recevice msg from service: " + JSON.stringify(jsonSerData));

    delete jsonSerData.msgType;

    if (undefined == jsonSerData.configType) {
        console.warn(CONST_LOG_HEAD + "procServiceMsg() receive msg unknown");

        return;
    }

    var configType = Number(jsonSerData.configType);

    /* 微服务通知配置平滑开始 */
    if (CONST_SERVICE_ANNOUNCE_SMOOTH_START == configType) {
        if (!jsonSerData.devSN) {
            console.warn(CONST_LOG_HEAD + "procMsgFromService() msg unknown");
            return ;
        }

        pub.getMainConnection(jsonSerData.devSN, function (connection) {
            if (!connection) {
                console.warn(CONST_LOG_HEAD + "procMsgFromService() main connection of device[%s] is not found", jsonSerData.devSN);
                return ;
            }
            encapCfgMsg2Device(CONST_SEQ_RESERVE, jsonSerData, function (devMsg) {
                connection.sendUTF(JSON.stringify(devMsg));
            });
        });
    }
    /* 微服务配置下发设备 */
    else if (CONST_SERVICE_PUT_CFG_2_DEVICE == configType) {
        sendOneSerCfg2Dev(jsonSerData);
    }
    else {
        console.warn(CONST_LOG_HEAD + "procMsgFromService() receive msg configType unknown: %s", configType);
    }
};

Confmgr.prototype.sendOneCfgMsg2Dev = sendOneCfgMsg2Dev;

var confmgr = module.exports = new Confmgr();