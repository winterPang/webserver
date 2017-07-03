/*
 * 该文件由confmgr模块提供路由功能.
 */
var express    = require('express');
var confpub    = require('../controller/confpub');
var user       = require('wlanpub').user;
var xiaoxiaobeicfg = require('./xiaoxiaobeicfg');

var getDevPermission = user.getDevPermission;
var router            = express.Router();
var CONST_LOG_HEAD    = "[CONFMGR]";

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
const CONST_ERR_WEBSERVER = 5;
const CONST_ERR_DEV_COMM = 6;
const CONST_ERR_SERVICE = 7;

function procOneCfg (req, resp) {
    var jsonData = req.body;

    if (!jsonData.devSN) {
        console.warn(CONST_LOG_HEAD + "procOneCfg() devSN undefined");
        var msgExplore = {};
        msgExplore.result = "fail";
        msgExplore.communicateResult = "fail";
        msgExplore.reason = "message unknown";
        msgExplore.errCode = CONST_ERR_MSG_UNKNOWN;
        resp.end(JSON.stringify(msgExplore));

        return;
    }

    /* 微服务来的消息免认证 */
    if ("microservice" == jsonData.from) {
        confpub.procMsgFromExplore(req, resp);
        console.warn(CONST_LOG_HEAD + "receive msg from service: %s", JSON.stringify(jsonData));
        return ;
    }

    getDevPermission(req.cookies, req.session, jsonData.devSN, function (result, retCode) {
        var monnitor_exec = result && result.permission && result.permission.MONITOR_EXEC;
        var config_read = result && result.permission && result.permission.CONFIG_READ;
        var config_write = result && result.permission && result.permission.CONFIG_WRITE;

        var maintenance_read = result && result.permission && result.permission.MAINTENANCE_READ;
        var maintenance_write = result && result.permission && result.permission.MAINTENANCE_WRITE;
        var maintenance_exec = result && result.permission && result.permission.MAINTENANCE_EXEC;

        console.warn("One scene One Device")
        console.warn("monnitor_exec : " + monnitor_exec);
        console.warn("config_read : " + config_read);
        console.warn("config_write : " + config_write);
        console.warn("maintenance_read : " + maintenance_read);
        console.warn("maintenance_write: " + maintenance_write);
        console.warn("maintenance_exec : " + maintenance_exec);

        if ((0 == retCode) && (monnitor_exec || config_read || config_write ||
            maintenance_read || maintenance_write || maintenance_exec)) {
            confpub.procMsgFromExplore(req, resp);
        }
        else {
            var msgExplore = {};
            msgExplore.result = "fail";
            msgExplore.reason = "permission deny";
            msgExplore.errCode = CONST_ERR_PERMISSION;
            resp.end(JSON.stringify(msgExplore));
        }
    });
}

function procSceneCfg(req, resp) {
    console.warn(CONST_LOG_HEAD + "procSceneCfg() receive msg from explore: %s", JSON.stringify(req.body));
    var jsonData = req.body;

    if (!jsonData.userName || !jsonData.shopName) {
        console.warn(CONST_LOG_HEAD + "procSceneCfg error: sceneName undefined");
        var msgExplore = {};
        msgExplore.serviceResult = "fail";
        msgExplore.reason = "message unknown";
        resp.end(JSON.stringify(msgExplore));
        console.warn(CONST_LOG_HEAD + "send msg to explore: %s", JSON.stringify(msgExplore));
        return ;
    }

    confpub.procMsgFromExplore(req, resp);
}

router.post('/', function(req, resp, next) {
    console.warn(CONST_LOG_HEAD + "access /confmgr...");

    try {
        var jsonData = req.body;

        if(jsonData.multicfg)
        {
            xiaoxiaobeicfg(req, resp);
            return;
        }
        /* 基于场景(一个场景可能对应多个设备)处理配置 */
        if ("true" == jsonData.sceneFlag) {
            procSceneCfg(req, resp);
        }
        /* 基于单个设备处理配置 */
        else {
            procOneCfg(req, resp);
        }
    }
    catch (error) {
        console.warn(CONST_LOG_HEAD + "receive data from explore: %s", JSON.stringify(req.body));
        console.warn(CONST_LOG_HEAD + "confmgr proc except: " + error.stack);
    }
});

router.all('/*', function(req, res, next) {
    res.status(404).end();
});

module.exports = router;