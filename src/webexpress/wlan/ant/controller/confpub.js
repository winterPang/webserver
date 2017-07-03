/*
 * 本文件是配置下发、配置平滑、配置代理、配置回滚的公共文件
 * */
var confmgr = require("./confmgr");
var rollback = require("./rollback");

function Confpub() {
}

/* webserver重定向ant消息入口 */
Confpub.prototype.procAntRedirectMsg = function (jsonRecv, deliveryInfo) {
	
    delete jsonRecv.msgType;
    //console.warn("procAntRedirectMsg() receive msg: %s", JSON.stringify(jsonRecv));
	
    if ("rollbacksavecfg" == jsonRecv.flag) {
        rollback.procRedirectRollbackSaveCfg(jsonRecv);
    }
    else if ("servicemsg" == jsonRecv.flag) {
        confpub.procMsgFromService(jsonRecv);
    }
    else {
        if (jsonRecv.data
            && jsonRecv.data.deviceModule
            && "rollback" == (jsonRecv.data.deviceModule).toLowerCase()) {
            rollback.procRedirectMsg2Device(jsonRecv, deliveryInfo);
        }
        else if(jsonRecv.data
            && jsonRecv.data.deviceModule
            && "telnet" == (jsonRecv.data.deviceModule).toLowerCase()){
            confmgr.procRedirectTelnetMsg2Device(jsonRecv, deliveryInfo);
        }
        else {
            confmgr.procRedirectMsg2Device(jsonRecv, deliveryInfo);
        }
    }
};

/* 浏览器消息入口 */
Confpub.prototype.procMsgFromExplore = function (req, res) {
    var jsonData = req.body;
    jsonData.ip = req.ip;
    var session = req.session;

    console.log("****** proc Msg From Explore ******");
    console.log("jsonData.deviceModule : " + jsonData.deviceModule);

    try{
        if (!req.body.userName && session && session.cas_user && session.cas_user.attributes && session.cas_user.attributes.name) {
            jsonData.userName = session.cas_user.attributes.name;
        }

        if (req.session && req.session.bUserTest == 'true') {
            jsonData.bIsTestUser = true;
        }

        if (jsonData.deviceModule && "rollback" == (jsonData.deviceModule).toLowerCase()) {
            rollback.procExploreMsg(jsonData, res);
        }
        else if (jsonData.deviceModule && "telnet" == (jsonData.deviceModule).toLowerCase()) {
            confmgr.procExploreTelnetMsg(jsonData, res);
        } else {
            confmgr.procExploreMsg(jsonData, res);
        }
    }
    catch(e)
    {
        console.error("[CONFMGR] CATCH ERROR %j", e);
    }

};

/* 设备端消息入口 */
Confpub.prototype.procMsgFromDev = function (jsonDevData) {
    if (jsonDevData.deviceModule
        && "rollback" == (jsonDevData.deviceModule).toLowerCase()) {
        rollback.procDevMsg(jsonDevData);
    }
    else if (jsonDevData.deviceModule
        && "telnet" == (jsonDevData.deviceModule).toLowerCase()) {

        confmgr.procTelnetDevMsg(jsonDevData);
    }
    else {
        confmgr.procDevMsg(jsonDevData);
    }
};

/* 微服务端消息入口 */
Confpub.prototype.procMsgFromService = function (jsonSerData) {
    if (jsonSerData.deviceModule && "rollback" == (jsonSerData.deviceModule).toLowerCase()) {
        rollback.procServiceMsg(jsonSerData);
    }
    else {
        confmgr.procServiceMsg(jsonSerData);
    }
};

var confpub = module.exports = new Confpub;