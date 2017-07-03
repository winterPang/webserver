var connectionMap = require('./public').connectionMap;
var async   = require("wlanpub").async;
var mqhd    = require("wlanpub").mqhd;

const TIME_FOUR_MIN = 4 * 60 * 1000;

var methodMap = {
	getMainConnectionStatus: getMainConnectionStatus
};
function getMainConnectionStatus(devInfo, deliveryinfo) {
	var oMessage = {
		data:{
			retCode: 0,
			message: null
		},
		url:"/webserver"
	};

	if (!devInfo.devSN || !devInfo.sessionid) {
		oMessage.data.retCode = 1;
		oMessage.data.message = "devSN and sessionid error";

		mqhd.replyMsg(JSON.stringify(oMessage), deliveryinfo);
		console.log("[MAINCONNECTION]" + "getMainConnection() error: devSN undefined");
		console.log("[MAINCONNECTION]" + " " + "getMainConnection() error: devSN undefined");

		return;
	}

	if(devInfo.sessionid)
	{
		//说明是设备网关
			var mapId = devInfo.devSN + "/" + devInfo.sessionid + '/' + 'cmtnlmgr' + '/' + 'base';
			var message = connectionMap.get(mapId);
			if(message && ((new Date() - (message.lastRecvTime || 0)) < (devInfo.duration || TIME_FOUR_MIN)))
			{
				oMessage.data.message = 0;
			}
			else
			{
				oMessage.data.message = 1;
			}
	}
	else{
		oMessage.data.retCode = 1;
		oMessage.data.message = "seesionid error";
	}

	mqhd.replyMsg(JSON.stringify(oMessage), deliveryinfo);
	console.warn("[MAINCONNECTION]", oMessage);
}

function procMsg(jsonData, deliveryinfo)
{
	console.log("get ms message :", jsonData);
	if(!jsonData.method|| !jsonData.param || !methodMap.hasOwnProperty(jsonData.method))
	{	
		var oMessage = {
			data:{
				retCode: 1,
				message: "no method"
			},
			url:"/webserver"
		};
		console.error("[MAINCONNECTION]", "get ask without method");
		mqhd.replyMsg(JSON.stringify(oMessage), deliveryinfo);
		return;
	}

	methodMap[jsonData.method](jsonData.param, deliveryinfo);
}



module.exports = procMsg;
