var scenario                    = require('wlanpub').getScenario();
var confmgr                     = require('../controller/confmgr');
var async                       = require('wlanpub').async;
var mqhd                        = require('wlanpub').mqhd;
var basic                       = require('wlanpub').basic;

var serviceConfmgr              = basic.serviceName.confmgr;
const CONST_SUBMSG_FROM_EXPLORE = 0;
const CONST_CONFIG_RESULT_PROC  = 8;
const NO_PERMISSION             = 1;
const CONSOLEHEAD               = "[CONFMGR][confmgr]";

function jsonCopy (dstData, srcData) {
    for (var key in srcData) {
        dstData[key] = srcData[key];
    }
}

function miltiConfig(req, res)
{
	var param   = req.body;
	var cookies = req.cookies;
	var session = req.session;
	var paramLength  = param.param.length;
	var parallelArray = [];
    var bIsTestUser = false;

	var tempBody = {};
	tempBody.cloudModule = param.cloudModule;
	tempBody.deviceModule = param.deviceModule;

    if (req.session && req.session.bUserTest == 'true') 
    {
        bIsTestUser = true;
    }
    console.log(CONSOLEHEAD, "#### miltiConfig", param);

    var msgService = {};
    jsonCopy(msgService, param);
    msgService.url = "/confmgr";
    msgService.subMsgType = CONST_SUBMSG_FROM_EXPLORE;
    var serviceConfmgrName = bIsTestUser == true ? serviceConfmgr + basic.testSuffix : serviceConfmgr;

	for(var i = 0; i < paramLength; i++)
	{
		var funcArray = [];
		var tempParam = {};
		tempParam.cloudModule = param.cloudModule;
		tempParam.deviceModule = param.deviceModule;
		tempParam.method  = param.method;
		tempParam.param = [];
		tempParam.devSN = param.param[i].devSN;
		tempParam.cfgTimeout = param.cfgTimeout || 60; 
	        if(param.param[i].radioList)
	        {
	            for(var j = 0; j < param.param[i].radioList; j++)
	            {
	                tempParam.param.push(param.param[i].radioList[j]);
	                tempParam.param[j].nasId = param.param[i].nasId;
	            }
	        }
	        else
	        {
	            tempParam.param.push(param.param[i]);
	        }

		funcArray.push(checkPermission(tempParam, cookies, session));
		funcArray.push(sendMsg2Dev(tempParam));
		parallelArray.push(seriesReturn(funcArray));
	}
    console.log(CONSOLEHEAD, "#### miltiConfig", param);
    mqhd.sendMsg(serviceConfmgrName, JSON.stringify(msgService), function(msg)
    {    
    	if(msg.result != "success")
    	{
    		res.end(JSON.stringify({serviceResult:"fail", deviceResults:[]}));
    		return;
    	}
    	async.parallel(parallelArray, function(err, result){
	    	if(err)
	    	{
	    		console.error('[xiaoxiaobeicfg][miltiConfig][confmgr]', "######## parallel error", err, result);
	    		res.end(JSON.stringify({"serviceResult" : "fail", deviceResults:result, reason:"async error"}));
	    		return;
	    	}
	    	res.end(JSON.stringify({serviceResult:"success", deviceResults:result}));
	    	mqhd.sendMsg(serviceConfmgrName, JSON.stringify({url:"/confmgr", 
	    		subMsgType:CONST_CONFIG_RESULT_PROC,
	    		cloudModule:"xiaoxiaobeicfg",
	    		method:"recordResults", 
	    		request:req.body,
	    		deviceResults:result
	    	}));
        });
	});

}

function seriesReturn (funcArray)
{
	return function(cb)
	{
		async.waterfall(funcArray, function(error, result)
		{
	        console.log(CONSOLEHEAD, "#### seriesReturn waterfall action", result);
			if(error)
			{
				console.error('[xiaoxiaobeicfg][multi][confmgr]', '######## waterfall error', error, result);
				// res.end(JSON.stringify({"serviceResult" : "fail", deviceResults:[], reason:"async error"}));
			}
			cb(null, result);
			// res.end(JSON.stringify({serviceResult:"success", deviceResults:result}));
		});
	}
}

function checkPermission(jsonData, cookies, session)
{
	console.log(CONSOLEHEAD, "#### checkPermission action", jsonData);

	return function(cb)
	{
		scenario.getDevPermission(cookies, session, jsonData.devSN, function(result, retCode)
		{
	        var monnitor_exec = result && result.permission && result.permission.MONITOR_EXEC;
	        var config_read = result && result.permission && result.permission.CONFIG_READ;
	        var config_write = result && result.permission && result.permission.CONFIG_WRITE;
	        var maintenance_read = result && result.permission && result.permission.MAINTENANCE_READ;
	        var maintenance_write = result && result.permission && result.permission.MAINTENANCE_WRITE;
	        var maintenance_exec = result && result.permission && result.permission.MAINTENANCE_EXEC;

	        if ((0 != retCode) || !(monnitor_exec || config_read || config_write || maintenance_read || maintenance_write || maintenance_exec)) 
	        {
            	cb(-1, {devSN : jsonData.devSN, result : "fail"});
        	}
        	else
        	{
        		cb(null)
        	}
		});
	}
}


function sendMsg2Dev(jsonData)
{
	console.log(CONSOLEHEAD, "#### sendMsg2Dev action", jsonData);
	return function(cb)
	{
        // setTimeout(function(){

        // }, jsonData.cfgTimeout * 1000);
		var resFunction = {
			end:function(strResult){
	            var result = JSON.parse(strResult);
	            console.log(CONSOLEHEAD, "#### sendMsg2Dev end action", jsonData);
	            result.devSN = jsonData.devSN;
	            cb(null, result);
	        }
		}
		confmgr.sendOneCfgMsg2Dev(jsonData, resFunction);
	}
}

module.exports = miltiConfig;