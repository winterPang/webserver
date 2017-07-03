var configurate      = require("./configuration");
var config           = require("wlanpub").config;

const UPDATE_TIME    = 5 * 60 * 1000;
var DEVICE_CMD       = "return\r\nsystem\r\ninfo-center format unicom\r\ninfo-center loghost lvzhourd-1.chinacloudapp.cn\r\ninfo-center source default loghost level informational";
const MONGO_ERROR    = 1;
const TIMEOUT_ERROR  = 2;
const DEVICE_CFG_CMD = ["info-center format unicom", "info-center loghost ", "info-center source default loghost level"];
const DEVICE_DIS_CMD = "";
var UNDO_DEVICE_CMD  = "return\r\nsystem\r\nundo info-center format\r\nundo info-center loghost lvzhourd-1.chinacloudapp.cn\r\nundo info-center source default loghost\r\nreturn\r\n";
const LOG_HEAD       = "[CONFMODULE]";

if(config.has("devlogserver"))
{
    DEVICE_CFG_CMD[1] + config.get("devlogserver");
    DEVICE_CMD = DEVICE_CMD.replace("lvzhourd-1.chinacloudapp.cn", config.get("devlogserver"));
    UNDO_DEVICE_CMD = UNDO_DEVICE_CMD.replace("lvzhourd-1.chinacloudapp.cn", config.get("devlogserver"));
}
else
{
    DEVICE_CFG_CMD[1] + "lvzhourd-1.chinacloudapp.cn";
}

//0 -- 成功  1 ---失败  message---当前状态 2--下发配置失败
function setConfiguration(jsonData, cb)
{
    console.log(LOG_HEAD, "setConfiguration come in," , jsonData);
    if(!jsonData || !jsonData.devSN || !jsonData.status || !( jsonData.status == "on" || jsonData.status == "off"))
    {
        cb({retCode : 1, message : "param error"});
        return;
    }
    var devSN            = jsonData.devSN;
    var reg              = /^([\s\S]*) ([\s\S]*)$/;
    var cmdProxy         = DEVICE_CMD.replace(reg, "$1 " + (jsonData.level || "informational" + "\r\n"));
    var tempCfg          = {devSN: devSN, cmdProxy: cmdProxy, cfgtimeout: 60};
    var flag             = jsonData.status.toLowerCase();
    var returnMsg        = {retCode:0, message:""};
    var tempDeviceCfgCmd = [DEVICE_CFG_CMD[0], DEVICE_CFG_CMD[1]];
    if(jsonData.level && (jsonData.level != "informational"))
    {
        tempDeviceCfgCmd.push(DEVICE_CFG_CMD[2] + ' ' + (jsonData.level || "debugging"));
    }
    if(flag == "off")
    {
        tempCfg.cmdProxy = UNDO_DEVICE_CMD;
    }
    configurate.sendCmd2Device(tempCfg, function(err, result){
        if(err)
        {
            returnMsg.retCode = 2;
            cb(returnMsg);
            return;
        }
        if(isConfigIndevice(tempDeviceCfgCmd, result.echoInfo)) //检查配置是否存在， 存在且下发的是开， 则成功，存在且下发的是关
        {
            returnMsg.message = "on";
            if(flag == "off")
            {
                returnMsg.retCode = 1;
            }
            cb(returnMsg);
            return;
        }
        returnMsg.message = "off";
        if(flag == "on")
        {
            returnMsg.retCode = 1;
        }

        cb(returnMsg);
    });

}

//1--数据库操作失败，-1--状态关   0--状态开
function checkConfiguration (jsonData, cb)
{
    console.log(LOG_HEAD, "checkConfiguration come in," , jsonData);
    if(!jsonData || !jsonData.devSN)
    {
        cb({retCode : 1, message : "param error"});
        return;
    }
    var devSN = jsonData.devSN;
    var returnMsg = {retCode : 0, message:""};
    configurate.table.findOne({devSN : devSN}, function(err, config){
        console.log(LOG_HEAD, "checkConfiguration findone come in," , jsonData);
        if(err )
        {
            returnMsg.retCode = 1;
            cb(returnMsg);
            return;
        }
        var tempTime = (config && config.configuration && config.time)?(config.time):0;
        if(Date.now() - new Date(tempTime) > UPDATE_TIME)
        {
            var tempCfg = {devSN: devSN, cmdProxy: DEVICE_DIS_CMD, cfgtimeout: 120};
            configurate.disCurrentConfig(devSN, function(err, result){
                console.log(LOG_HEAD, "checkConfiguration findone sendCmd2Device come in," ,err,  result);
                if(err || !(result && result.echoInfo))
                {
                    returnMsg.retCode = 2;
                    cb(returnMsg);
                    return;
                }
                if(isConfigIndevice([DEVICE_CFG_CMD[0], DEVICE_CFG_CMD[1]], result.echoInfo))
                {
                    returnMsg.message = getLevel(result.echoInfo);
                    cb(returnMsg);
                    return;
                }
                returnMsg.retCode = -1;
                cb(returnMsg);
            });
            return;
        }

        if(isConfigIndevice([DEVICE_CFG_CMD[0], DEVICE_CFG_CMD[1]], config.configuration))
        {
            returnMsg.message = getLevel(config.configuration);
            cb(returnMsg);
            return;
        }
        returnMsg.retCode = -1;

        cb(returnMsg);
    });
}

function isConfigIndevice(config, deviceCfg)
{
    for(var i = 0; i < config.length ; i++)
    {
        if(deviceCfg.search(config[i]) == -1)
        {
            return false;
        }     
    }

    return true;
}

function getLevel(deviceCfg)
{
    var regex = /info-center source default loghost level (\w*)/;
    var matchInfo = deviceCfg.match(regex);
    var level = (matchInfo && Array.isArray(matchInfo)) ? matchInfo[1] : "informational";
    if(level)
    {
        return level;
    }
    return "";
}

module.exports= {
    setConfiguration: setConfiguration,
    getConfiguration :checkConfiguration
};