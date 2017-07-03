var express    = require('express');
var bodyParser = require('body-parser');
var confmgr    = require('../controller/confmgr');
var async      = require('wlanpub/node_modules/async');
var deviceEvent = require("wlanpub").deviceEvent;

var mqhd  = require('wlanpub').mqhd;
var basic = require('wlanpub').basic;

var serviceName = basic.serviceName.configtemplate;
var serviceName_base = basic.serviceName.base;
var jsonParser = bodyParser.json();
var suffix = '_test';

var router  = express.Router();

const CONST_ERR_NO_MAIN_CONN = 4;
const CONST_ERR_TIME_OUT = 5;

const modulename = "[configtemplate]";
function console_log(data){
    var strMessage = modulename;
    for(var i = 0; i < arguments.length; i++){
        strMessage += arguments[i];
    }
    console.warn(strMessage);
}

deviceEvent.on("device_login", function(ACSN){
    //1, 获取模板  2， 下发到设备    3. 保存结果
    console_log("......device login:", devSN);
    var devSN = ACSN;

    setTimeout(function(){
            async.waterfall([
            function(callback){
                var sendMqMsg = {};
                sendMqMsg.body = {};
                sendMqMsg.body.param = {ACSN:devSN};
                sendMqMsg.body.method = "getmodulebydevice";

                console_log("......getmodule  by  device :", devSN);

                mqhd.sendMsg(serviceName, JSON.stringify(sendMqMsg), function(jsondata) {
                    var revMessage = (typeof(jsondata) == "string") ? JSON.parse(jsondata).data:jsondata.data;
                    if(revMessage.result == "success" &&　revMessage.message.length){
                        console_log("...... get module success :", JSON.stringify(revMessage.message));
                        callback(null, revMessage.message[0]);
                    }
                    else{
                        console_log("...... get module failed ");
                        callback("error");
                    }
                });
            },
            function(moduleInfo, callback){
                console_log("...... send config to device: ", devSN);

                configDevice(devSN, moduleInfo.content, 30,  function(bResult){
                    if(bResult){
                        console_log("...... send config to device: ", devSN, "  sucess");
                        callback(null, 0);
                    }
                    else
                    {
                        console_log("...... send config to device: ", devSN, "  failed");
                        callback(null, 1);
                    }
                });
            },
            function(bResult, callback){
                var resultSaved = {};
                resultSaved.body = {};
                resultSaved.body.param = {ACSN: devSN, status: bResult};
                resultSaved.body.method = "updatedevicestatus";

                console_log("...... save config result: ", devSN);
                mqhd.sendMsg(serviceName, JSON.stringify(resultSaved));
            }]);
        }, 30* 1000);

});

router.get("/:method", function(req, res, next){
    var sendMqMsg = {};
    sendMqMsg.body = {};
    sendMqMsg.url = req.url;
    sendMqMsg.body.param = req.query;
    sendMqMsg.cookies = req.cookies;
    sendMqMsg.session = req.session;
    sendMqMsg.body.method = req.params.method;
    sendMqMsg.body.ip = req.ip;

    if (req.session && req.session.cas_user && req.session.cas_user.attributes && req.session.cas_user.attributes.name) {
        sendMqMsg.body.param.userName = req.session.cas_user.attributes.name;
    }
    console_log("...... get fucntion act: ", JSON.stringify(sendMqMsg));

    mqhd.sendMsg(serviceName, JSON.stringify(sendMqMsg), function(jsondata) {
        res.end(JSON.stringify(jsondata.data));
    });
});

router.post("/", function(req, res, next){
    function getModule(callback){
        var tempMqMsg = {};
        tempMqMsg.url = req.url;
        tempMqMsg.body = {};
        tempMqMsg.cookies = req.cookies;
        tempMqMsg.session = req.session;
        tempMqMsg.body.ip = req.ip;
        tempMqMsg.body.method = "getmodule";
        tempMqMsg.body.userName = sendMqMsg.body.param.userName || "";
        tempMqMsg.body.param = {name:req.body.param.name||"", userName:sendMqMsg.body.param.userName || ""};

        console_log("...... getModule fucntion act: ", JSON.stringify(tempMqMsg));
        mqhd.sendMsg(serviceName, JSON.stringify(tempMqMsg), function(jsondata) {
            console_log("getModule get message:", JSON.stringify(jsondata));
            var revMessage = jsondata.data;

            if(revMessage.result == "failed"){
                callback("false", jsondata);
            }
            else{
                if(revMessage.message.length === 0){
                    callback("false", {result:"failed"});
                }
                else{
                    callback(null, revMessage.message[0]);
                }
            }
        });
    }

    var sendMqMsg = {};
    sendMqMsg.url = req.url;
    sendMqMsg.body = req.body;
    sendMqMsg.cookies = req.cookies;
    sendMqMsg.session = req.session;
    sendMqMsg.body.ip = req.ip;
    var cfgtimeout = req.body.cfgtimeout?req.body.cfgtimeout:110;

    if (req.session && req.session.cas_user && req.session.cas_user.attributes && req.session.cas_user.attributes.name) {
        sendMqMsg.body.userName = req.session.cas_user.attributes.name;
        if(sendMqMsg.body.userName != req.body.param.userName){
            res.end(JSON.stringify({message:{result:"failed", reason:"userName error!"}}))
        }
    }

    console_log("...... post fucntion act: ", JSON.stringify(sendMqMsg));

    //获取模块所有信息
    var deviceInfo = req.body.param.device;

    try{
        switch(sendMqMsg.body.method){
            case "updatemoduledevices": //添加设备
            {
                console_log("......updatemoduledevices action !");
                //
                async.parallel({
                    module:getModule,
                    ACSNs :function(callback){
                        //前端穿过来所有新添加的设备
                        var deviceArray = [];
                        for(var i = 0; i < deviceInfo.length; i++){
                            if(!deviceInfo[i].ACSN){
                                callback("error",[]);
                                return;
                            }
                            deviceArray.push(deviceInfo[i].ACSN);
                        }
                        console_log("......ACSN all here:", JSON.stringify(deviceArray));
                        checkThePlatform(sendMqMsg, deviceArray, callback);
                    }

                },function(error, oResult){
                    if(error){
                        res.json({result:"failed", reason:oResult});
                        return;
                    }
                    
                    var send2DeviceArray = [];
                    for(var i = 0; i < oResult.ACSNs.length; i++){
                        send2DeviceArray.push(getSend2DeviceFuc(oResult.module, oResult.ACSNs[i], cfgtimeout));
                    }

                    console_log("......config all devices action !");
                    async.parallel(send2DeviceArray, function(error, oResult){

                        var deviceNeedSave = [];
                        var isAllSuccessNum = 0;

                        for(var i = 0; i < oResult.length; i++){
                            if(oResult[i] == "success"){
                                deviceInfo[i].status = 1;
                                isAllSuccessNum++;
                            }
                            else if(oResult[i] == CONST_ERR_NO_MAIN_CONN){
                                deviceInfo[i].status = 2;
                            }
                            else{
                                deviceInfo[i].status = 0;
                            }

                            deviceNeedSave.push(deviceInfo[i]);
                        }

                        sendMqMsg.body.method = "updatedevices";
                        sendMqMsg.body.param = {
                            userName : req.body.param.userName,
                            name     : req.body.param.name,
                            device   : deviceNeedSave,
                        };
                        
                        console_log("......before save config to micro-service!", JSON.stringify(sendMqMsg));
                        mqhd.sendMsg(serviceName, JSON.stringify(sendMqMsg), function(jsondata) {
                            console_log("......save config to micro-service result:", JSON.stringify(jsondata));

                            if(jsondata.data && (jsondata.data.result == "success")){
                                if(isAllSuccessNum != deviceNeedSave.length){
                                    res.json({result:"success", deviceResult:"error", message:oResult});
                                }
                                else{
                                    res.json({result:"success",serviceResult:"success"});

                                }
                            }
                            else{
                                res.end(JSON.stringify({result:"failed", deviceResult:"failed"}));
                            }
                        });
                    });
                
                });
                break;
            }
            case "updatemodule":
            {
                console_log("......updatemodule action !");
                var updateModuleFirst = function(){
                    mqhd.sendMsg(serviceName, JSON.stringify(sendMqMsg), function(jsondata) {
                        console_log("......updateModuleFirst result:", JSON.stringify(jsondata));
                        if(jsondata.data && (jsondata.data.result == "success")){
                            updateDevices()
                        }
                        else{
                            res.end(JSON.stringify({result:"failed"}));
                        }
                    });
                }
                var updateDevices = function()
                {
                    getModule(function(err, data){
                        if(err){
                            console_log("......get modeule error ! ");
                            res.json({result:"fail"});
                        }
                        else{
                            var deviceInfo = data.device;
                            var send2DeviceArray = [];
                            for(var i = 0; i < deviceInfo.length; i++){
                                send2DeviceArray.push(getSend2DeviceFuc(data, deviceInfo[i].ACSN, cfgtimeout));
                            }
                            console_log("......before send all config to all devices ! ");
                            async.parallel(send2DeviceArray, function(error, oResult){

                                console_log("......get all config result ! ", JSON.stringify(oResult));

                                var deviceNeedSave = [];
                                var nowDate = new Date() - 0;
                                var isAllSuccessNum = 0;
                                
                                for(var i = 0; i < oResult.length; i++){
                                    if(oResult[i] == "success"){
                                        deviceInfo[i].status = 1;
                                        isAllSuccessNum++;
                                    }
                                    else if(oResult[i] == CONST_ERR_NO_MAIN_CONN){
                                        deviceInfo[i].status = 2;
                                    }
                                    else if(oResult[i] == CONST_ERR_TIME_OUT){
                                        deviceInfo[i].status = 3;
                                    }
                                    else{
                                        deviceInfo[i].status = 0;
                                    }
                                  
                                    deviceInfo[i].updateDate = nowDate;
                                    deviceNeedSave.push(deviceInfo[i]);

                                }
                                sendMqMsg.body.method = "updatemodule";
                                sendMqMsg.body.param = {
                                    userName : req.body.param.userName,
                                    name     : req.body.param.name,
                                    device   : deviceNeedSave,
                                };
                                console_log("......before save all result to micro-service");
                                mqhd.sendMsg(serviceName, JSON.stringify(sendMqMsg), function(jsondata) {
                                    console_log("......save result:", JSON.stringify(jsondata));
                                    if(jsondata.data && (jsondata.data.result == "success")){
                                        if(isAllSuccessNum != deviceNeedSave.length){
                                            res.json({result:"success",deviceResult:"error",message:oResult});
                                        }
                                        else{
                                            res.json({result:"success",deviceResult:"success"});

                                        }
                                    }
                                    else{
                                        res.end(JSON.stringify({result:"failed",deviceResult:"failed"}));
                                    }
                                });
                            });


                        }
                    });            
                }

                updateModuleFirst();

                break;
            }
            case "_test":
            {
                var MSG = {};
                MSG.body = {};
                MSG.url = "/base/getDevPlatformType";
                MSG.cookies = req.cookies;
                MSG.session = req.session;
                MSG.body.devSN = "210235A1SQC15A000051"; 

                mqhd.sendMsg(serviceName_base, JSON.stringify(MSG), function(jsondata){
                    console_log("receive message from base : %s", JSON.stringify(jsondata));
                    res.json(jsondata);
                });
                break;
            }
            default:
            {
                mqhd.sendMsg(serviceName, JSON.stringify(sendMqMsg), function(jsondata) {
                    res.end(JSON.stringify(jsondata.data));
                });
                break;
            }
        }    
    }
    catch(e){
        console_log("catch error!:", e);
        res.json({result:"failed", message:e});
    }

});

function getSend2DeviceFuc(moduleInfo, ACSN, cfgtimeout){
    var devSN = ACSN;
    var config = moduleInfo.content;
    return function(callback){
        miltiCommand2Device(devSN, config, cfgtimeout, function(result, errCode){
            if(result){
                callback(null, "success");
            }
            else{
                callback(null, errCode);
            }
        });
    }
}

function miltiCommand2Device(devSN, config, cfgtimeout, callback){
    var funcSendArray = [];
    var errCode       = "failed";
    for(var i = 0; i < config.length; i++){
        funcSendArray.push(getConfigDevice(devSN, cfgtimeout, config[i]));
    }
    async.series(funcSendArray,function(err, oResult){
        if(err){
            if(Array.isArray(oResult) && oResult.find(function(a){return a == CONST_ERR_NO_MAIN_CONN})){
                errCode = CONST_ERR_NO_MAIN_CONN;
            }
            if(Array.isArray(oResult) && oResult.find(function(a){return a == CONST_ERR_TIME_OUT})){
                errCode = CONST_ERR_TIME_OUT;
            }
            callback(false, errCode);
        }
        else{
            configDevice(devSN,"save force\r\n", cfgtimeout, function(err, strResult){
                if(err){
                    callback(false, errCode);
                }
                else{
                    callback(true);
                }
            });
            
        }
    });
}

function getConfigDevice(devSN, cfgtimeout, config){
    return function(callback){
        configDevice(devSN, config, cfgtimeout, callback);
    }
}

function configDevice(devSN, config, cfgtimeout, myCalback){

    var tempcmdcfg = config;
    tempcmdcfg = tempcmdcfg.replace(/\\r\\n/g, "\r\n");


    var commandTemp = {
        configType:0,
        devSN :devSN,
        deviceModule : "CMDPROXY",
        echo : 1,
        cmdProxy: "return\r\n" + tempcmdcfg + "\r\n",
        cfgTimeout:cfgtimeout,
    };
    var errCode = "failed";

    var timeHandle = setTimeout(function(){
        console_log("configure ", devSN, " timeout!!!");
        myCalback("error", CONST_ERR_TIME_OUT); //超时返回错误码
    }, cfgtimeout * 1000);

    console_log("......before send config to device ! ", JSON.stringify(commandTemp));

    var beforeFuncResult = {
        end:function(strResult){
            clearInterval(timeHandle);
            console.log( "....beforeFuncResult:" + JSON.stringify(strResult) );
            var oResult = JSON.parse(strResult);
            if(oResult.result == "success"){
                myCalback(null, "success");
            }
            else{
                errCode = oResult.errCode;
                myCalback("error", errCode);
            }
        }
    };
    confmgr.sendOneCfgMsg2Dev(commandTemp,  beforeFuncResult);   


}


function checkThePlatform(obody, devlist, callback){
    var devDelArray = [];
    for(var i = 0; i < devlist.length; i++){
        devDelArray.push(addDev2Array(obody, devlist[i]));
    }

    async.series(devDelArray, function(err, oResult){
        if(err){
            console_log("xiaoxiaobei openwrt not support this function!", JSON.stringify(oResult));
            callback(err, oResult);
            return;
        }

        callback(null, devlist);
    });

}

function addDev2Array(obody, devSN){
    return function(callback){
        var sendMqMsg = {};
        sendMqMsg.body = {};
        sendMqMsg.url = "/base/getDevPlatformType";
        sendMqMsg.cookies = obody.cookies;
        sendMqMsg.session = obody.session;
        sendMqMsg.body.devSN = devSN; 

        mqhd.sendMsg(serviceName_base, JSON.stringify(sendMqMsg), function(jsondata){
            console_log("receive message from base : %s", JSON.stringify(jsondata));
            if(Number(jsondata.body.retCode) === 1){
                callback(true, "unknown");
                return;
            }

            if(Number(jsondata.body.platformType) === 0){
                callback(null, "comware");
                return;
            }

            callback(true, "openwrt");
        });
    };
}


module.exports = router;