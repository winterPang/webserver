
var confmgr    = require('../controller/confmgr');
var config     = require('wlanpub').config;
var mongooper  = require('wlanpub').mongooper;
const LOG_HEAD = "[CONFMODULE]";

function CfgModule ()
{
    this.db = null;
    this.table = null;

    this.init();
}

CfgModule.prototype.init = function()
{
    var mongourl  = config.get('mongoConnParas');
    this.db = mongooper.connectDatabase("webserver", mongourl, 5);

    var cfgSchema = new this.db.Schema({
        devSN          : {type:String, unique:true},
        configuration  : String,
        time           : Date
    });

    this.table = this.db.mongo.model("configure", cfgSchema);
};

CfgModule.prototype.sendCmd2Device = function(cfg, cb)
{
    var self = this;
    var commandTemp = {
        configType:0,
        devSN :cfg.devSN,
        deviceModule : "CMDPROXY",
        echo : "1",
        cmdProxy: "return\r\n" + cfg.cmdProxy + "\r\n" ,
        cfgTimeout:cfg.cfgtimeout,
    };

    var beforeFuncResult = {
        end:function(strResult){
            console.log(LOG_HEAD, "....beforeFuncResult:" + JSON.stringify(strResult) );
            var oResult = JSON.parse(strResult);
            if(oResult.result == "success"){
                self.disCurrentConfig(cfg.devSN, cb);
            }
            else{
                errCode = oResult.errCode;
                cb("fail", errCode);    
            }
        }
    };

    confmgr.sendOneCfgMsg2Dev(commandTemp,  beforeFuncResult); 
};

CfgModule.prototype.disCurrentConfig = function(devSN, cb)
{
    var self = this;
    var commandDisthis = {
        configType:0,
        devSN :devSN,
        deviceModule : "CMDPROXY",
        echo : "1",
        cmdProxy: "return\r\nsystem\r\ndisplay this\r\n" ,
        cfgTimeout: 20,
    };

    var disthisFuncResult = {
        end:function(strResult){
            console.log(LOG_HEAD, "....disthisFuncResult:" + JSON.stringify(strResult) );
            var oResult = JSON.parse(strResult);
            if(oResult && (oResult.result == "success") && (oResult.echoInfo)){
                var headLocation = oResult.echoInfo.search('#');
                if((headLocation > 0) && (oResult.echoInfo.length > 107))
                {
                    oResult.echoInfo = oResult.echoInfo.slice(headLocation);
                    self.saveCfg2Device(devSN, oResult);
                    cb(null, oResult);
                    return;
                }
            }
            errCode = oResult.errCode;
            cb("fail", errCode);    
        }
    };

    confmgr.sendOneCfgMsg2Dev(commandDisthis,  disthisFuncResult); 
};

CfgModule.prototype.saveCfg2Device = function(devSN, oResult)
{
    var message = oResult.echoInfo;

    var findOper = {devSN: devSN};
    var setOper  = {$set: {configuration : oResult.echoInfo, time: new Date()}};

    this.table.update(findOper, setOper,{upsert:true}, function(err, result){
        if(err)
        {
            console.error(LOG_HEAD,"update configuration error : ", err);
        }
        console.log(LOG_HEAD, "saveCfg2Device  result ", result);
    });

};

module.exports = new CfgModule();

// 1, 下发命令，+dis this， 返回结果， 查看结果中是否有配置成功， 保存dis this结果到数据库