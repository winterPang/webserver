;(function($){
var MODULE_NAME = "health.onekeyrepair";


/*
   获取数据库中存在的配置信息
*/
function getDatabase_data(){

	var configFlowOpt = {
		url:MyConfig.path +'/diagnosis_read/web/config?devSN='+FrameInfo.ACSN,
		type:'get',
		dataType:"json",
		onSuccess:getConfigFlowSuc,
		onFailed:getConfigFlowFail
	};

	   Utils.Request.sendRequest(configFlowOpt);

	/*获取配置成功的回调*/
	function getConfigFlowSuc(cfgdata){
		if(cfgdata.length == 0){

			$("#cfg").removeClass('hide');
			$("#btn").removeClass('hide');
			$("#waitCfg").addClass('hide');
			$("#success").addClass('gray');
			$("#config").html("当前配置已经最优！");
			$("#config").addClass('bestCfg');

		}else{

			apmgrqueryNoExistConfig(cfgdata);

		}
	}

	/*获取配置失败的回调*/
	function getConfigFlowFail(){

	}
}

/*
   查询设备上不经存在的配置信息,apmgr模块
 */
function apmgrqueryNoExistConfig(cfgdata) {

	   var surl = MyConfig.path +"/ant/confmgr";

	   var apmgrNoExistCfgFlowOpt = {
		   url:surl,
		   dataType:"json",
		   type:"post",
		   timeout:5000,
		   data:{
			   configType:0,
			   devSN:FrameInfo.ACSN,
			   cloudModule:"apmgr",
			   deviceModule:"apmgr",
			   method:"JudgeCfgExist"
		   },
		   onSuccess:getSuc,
		   onFailed:getFail
	   };

	       Utils.Request.sendRequest(apmgrNoExistCfgFlowOpt);

		/*获取apmgr不存在的配置。成功时回调*/
		function getSuc(apmgrnoexistdata){

			stamgrqueryNoExistConfig(apmgrnoexistdata,cfgdata);
		}

	   /*获取apmgr不存在的配置。失败时回调*/
	   function getFail(status){
		   if( status.statusText == 'timeout'){
			   $("#cfg").removeClass('hide');
			   $("#btn").removeClass('hide');
			   $("#waitCfg").addClass('hide');
			   $("#success").addClass('gray');
			   $("#config").html("获取下发配置失败！");
			   $("#config").addClass('bestCfg');
		   }
	   }
}

/*
 查询设备上不存在的配置信息，stamgr模块
 */
function 	stamgrqueryNoExistConfig(apmgrnoexistdata,cfgdata){

	var surl = MyConfig.path +"/ant/confmgr";

	var stamgrFlowOpt = {
		url:surl,
		dataType:"json",
		timeout:5000,
		type:"post",
		data:{
			configType:0,
			devSN:FrameInfo.ACSN,
			cloudModule:"stamgr",
			deviceModule:"stamgr",
			method:"JudgeCfgExist",
			param:[1,2,3,4,5,6]
		},
		onSuccess:getStamgrNoExistCfgSuc,
		onFailed:getStamgrNoExistCfgFail
	};

	    Utils.Request.sendRequest(stamgrFlowOpt);

	/*获取stamgr不存在的配置success回调*/
	function getStamgrNoExistCfgSuc(stamgrnoexistdata){
		var apmgrdata = apmgrnoexistdata.deviceResult;
		var stamgrdata = stamgrnoexistdata.deviceResult;
		var deviceNoExistCfgData = [];

		try {
			if ((apmgrdata.length != 0) && (stamgrdata.length != 0)) {
				deviceNoExistCfgData = apmgrdata.concat(stamgrdata);
			} else if ((apmgrdata.length == 0) && (stamgrdata.length != 0)) {
				deviceNoExistCfgData = stamgrdata;
			} else if ((apmgrdata.length != 0) && (stamgrdata.length == 0)) {
				deviceNoExistCfgData = apmgrdata;
			}

			var cfg = new Array();

			if (deviceNoExistCfgData.length != 0) {
				for(var i = 0;i < deviceNoExistCfgData.length;i++){
					for(var j = 0 ; j < cfgdata.length ;j++){
						if( deviceNoExistCfgData[i].NoExistCfg == cfgdata[j].config){
							cfg.push(cfgdata[j]);
							break;
						}
					}
				}

				if( cfg.length != 0 ) {

					$("#cfg").removeClass('hide');
					$("#btn").removeClass('hide');
					$("#waitCfg").addClass('hide');

					initCfg_data(cfg);

					analyseCfg_data(cfg);

				}else{

					$("#cfg").removeClass('hide');
					$("#btn").removeClass('hide');
					$("#waitCfg").addClass('hide');
					$("#success").addClass('gray');
					$("#config").html("当前配置已经最优！");
					$("#config").addClass('bestCfg');

				}
			}
			else {

				$("#cfg").removeClass('hide');
				$("#btn").removeClass('hide');
				$("#waitCfg").addClass('hide');
				$("#success").addClass('gray');
				$("#config").html("当前配置已经最优！");
				$("#config").addClass('bestCfg');

			}
		}catch(exception){

		}
	}

	/*获取stamgr不存在的配置fail回调*/
	function getStamgrNoExistCfgFail(status){
		if( status.statusText == 'timeout'){
			$("#cfg").removeClass('hide');
			$("#btn").removeClass('hide');
			$("#waitCfg").addClass('hide');
			$("#success").addClass('gray');
			$("#config").html("获取下发配置失败！");
			$("#config").addClass('bestCfg');
		}
	}
}


/*
   解析需要下发的配置信息
*/
function analyseCfg_data(data){
	$("#success").on("click",function(){
		var apmgrConf = new Array();
		var stamgrConf = new Array();
		for(var i = 0; i < data.length; i ++){
			if((data[i].config.indexOf('beacon') >= 0) || (data[i].config.indexOf('disabled') >= 0)){
				apmgrConf.push(data[i]);
			}else{
				stamgrConf.push(data[i]);
			}
		}

		if( apmgrConf.length != 0){
			apmgrConfig(apmgrConf);
		}

		if( stamgrConf.length != 0){
			stamgrConfig(stamgrConf);
		}
	})
}

/*
   点击下发配置后将数据库中的配置删除
*/
function deleteConfig(data){
	var arr = new Array();
	for(var i = 0;i < data.length; ++ i){
		arr.push({'config':data[i].config});
	}

	var delconfigFlowOpt = {
		url:MyConfig.path +'/diagnosis_read/web/delconfig?devSN='+FrameInfo.ACSN,
		type:'post',
		dataType:'json',
		data:{
			config:arr
		},
		onSuccess:delSuc,
		onFailed:delFail
	};

	    Utils.Request.sendRequest(delconfigFlowOpt);

	/*删除成功的回调*/
	function delSuc(){

	}

	/*删除失败的回调*/
	function delFail(){

	}
}

/*
   向apmgr下发配置
*/
function apmgrConfig(apmgrConf) {
	var beaconArr = new Array();
	var beaconArr2 = new Array();
	var rateDisableArr = new Array();
	var rateDisableArr2 = new Array();
	for(var i = 0; i < apmgrConf.length; ++ i){
		if(apmgrConf[i].config.indexOf('beacon') >= 0){
            var c = apmgrConf[i].config.split(' ');
			var conf = {value:Number(c[1])};
			beaconArr.push(conf);
			beaconArr2.push(apmgrConf[i]);
			beaconConf(beaconArr,beaconArr2);
		}else{
			var d = apmgrConf[i].config.split(' ');
			for(var i = 2;i < d.length;++ i){
				rateDisableArr.push(d[i]*2);
			}
			rateDisableArr2.push(apmgrConf[i]);
			rateDisableConf(rateDisableArr,rateDisableArr2);
		}
	}
}

/*
   该命令是用来配置发送Beacon帧的时间间隔
*/
function beaconConf(beaconArr,beaconArr2){
	var surl = MyConfig.path +"/ant/confmgr";

	var beaconOpt = {
		url:surl,
		dataType:"json",
		type:"post",
		data:{
			configType:0,
			devSN:FrameInfo.ACSN,
			cloudModule:"apmgr",
			deviceModule:"apmgr",
			method:"BeaconInterval",
			param : beaconArr[0]
		},
		onSuccess:sendBeaconSuc,
		onFailed:sendBeaconFail
	};

	   Utils.Request.sendRequest(beaconOpt);

	/*下发配置成功的回调*/
	function sendBeaconSuc(data){
		try {
			if (data.communicateResult == "fail") {
				Frame.Msg.info('配置下发失败',"error");
				addLog_fail();
			} else if (data.communicateResult == "success") {
				Frame.Msg.info("配置下发成功");
				deleteConfig(beaconArr2);
				addLog_success();
			}
		}catch(exception){

		}
	}

	/*下发配置失败的回调*/
	function sendBeaconFail(){

	}
}

/*
   次命令是用来配置射频速率
*/
function rateDisableConf(rateDisableArr,rateDisableArr2){
	var surl = MyConfig.path +"/ant/confmgr";

	var rateDisableOpt = {
		url:surl,
		dataType:"json",
		type:"post",
		data:{
			configType:0,
			devSN:FrameInfo.ACSN,
			cloudModule:"apmgr",
			deviceModule:"apmgr",
			method:"RateDisabled",
			param : rateDisableArr
		},
		onSuccess:sendRateDisableSuc,
		onFailed:sendRateDisableFail
	};

	   Utils.Request.sendRequest(rateDisableOpt);

	/*下发配置成功的回调*/
	function sendRateDisableSuc(data){
		try{
			if( data.communicateResult == "fail"){
				Frame.Msg.info('配置下发失败',"error");
				addLog_fail();
			}else if( data.communicateResult == "success"){
				Frame.Msg.info("配置下发成功");
				deleteConfig(rateDisableArr2);
				addLog_success();
			}
		}catch(exception){

		}
	}

	/*下发配置失败的回调*/
	function sendRateDisableFail(){

	}
}
/*
   向stamgr下发配置
*/
function stamgrConfig(stamgrConf) {
	var keepAliveArr= new Array();
	var broadCastArr = new Array();
	var navigationArr = new Array();
	var loadBalanceArr = new Array();
	var rateLimitArr = new Array();
	var optionArr = new Array();
	for(var i = 0; i < stamgrConf.length; ++ i){
		if(stamgrConf[i].config.indexOf('keep') >= 0){
			keepAliveArr.push(stamgrConf[i]);
			keepAliveConf(keepAliveArr);
		}else if(stamgrConf[i].config.indexOf('broadcast') >= 0){
			broadCastArr.push(stamgrConf[i]);
			broadCastConf(broadCastArr);
		}else if(stamgrConf[i].config.indexOf('navigation') >= 0){
			navigationArr.push(stamgrConf[i]);
			navigationConf(navigationArr);
		}else if(stamgrConf[i].config.indexOf('balance') >= 0){
			loadBalanceArr.push(stamgrConf[i]);
			loadBalanceConf(loadBalanceArr);
		}else if(stamgrConf[i].config.indexOf('client-rate-limit') >=0){
			rateLimitArr.push(stamgrConf[i]);
			rateLimitConf(rateLimitArr);
		}else if(stamgrConf[i].config.indexOf('option') >= 0){
			optionArr.push(stamgrConf[i]);
			optionConf(optionArr);
		}
	}
}

/*
  此命令是用来关闭客户端保护
*/
function keepAliveConf(keepAliveArr){
	var surl = MyConfig.path +"/ant/confmgr";

	var keepOpt = {
		url:surl,
		dataType:"json",
		type:"post",
		data:{
			configType:0,
			devSN:FrameInfo.ACSN,
			cloudModule:"stamgr",
			deviceModule:"stamgr",
			method:"ClientKeepAlive",
			param : keepAliveArr
		},
		onSuccess:sendkeepSuc,
		onFailed:sendkeepFail
	};

	    Utils.Request.sendRequest(keepOpt);

	/*下发配置成功的回调*/
	function sendkeepSuc(data){
		try{
			if( data.communicateResult == "fail"){
				Frame.Msg.info('配置下发失败',"error");
				addLog_fail();
			}else if( data.communicateResult == "success"){
				Frame.Msg.info("配置下发成功");
				deleteConfig(keepAliveArr);
				addLog_success();
			}
		}catch(exception){

		}
	}

	/*下发配置失败的回调*/
	function sendkeepFail(){

	}
}

/*
  此命令行是用来AP回复广播Probe request报文功能恢复缺省情况。
*/
function broadCastConf(broadCastArr){
	var surl = MyConfig.path +"/ant/confmgr";

	var bordarOpt = {
		url:surl,
		dataType:"json",
		type:"post",
		data:{
			configType:0,
			devSN:FrameInfo.ACSN,
			cloudModule:"stamgr",
			deviceModule:"stamgr",
			method:"BroadCastProbe",
			param : broadCastArr
		},
		onSuccess:sendbordarSuc,
		onFailed:sendbordarFail
	};

	Utils.Request.sendRequest(bordarOpt);

	/*下发配置成功的回调*/
	function sendbordarSuc(data){
		try{
			if( data.communicateResult == "fail"){
				Frame.Msg.info('配置下发失败',"error");
				addLog_fail();
			}else if( data.communicateResult == "success"){
				Frame.Msg.info("配置下发成功");
				deleteConfig(broadCastArr);
				addLog_success();
			}
		}catch(exception){

		}
	}

	/*下发配置失败的回调*/
	function sendbordarFail(){

	}
}

/*
   次命令是用来开启AP频谱导航功能
*/
function navigationConf(navigationArr){
	var surl = MyConfig.path +"/ant/confmgr";

	var navigationOpt = {
		url:surl,
		dataType:"json",
		type:"post",
		data:{
			configType:0,
			devSN:FrameInfo.ACSN,
			cloudModule:"stamgr",
			deviceModule:"stamgr",
			method:"bNavigationEn",
			param : navigationArr
		},
		onSuccess:sendNavigationSuc,
		onFailed:sendNavigationFail
	};

	Utils.Request.sendRequest(navigationOpt);

	/*下发配置成功的回调*/
	function sendNavigationSuc(data){
		try{
			if( data.communicateResult == "fail"){
				Frame.Msg.info('配置下发失败',"error");
				addLog_fail();
			}else if( data.communicateResult == "success"){
				Frame.Msg.info("配置下发成功");
				deleteConfig(navigationArr);
				addLog_success();
			}
		}catch(exception){

		}
	}

	/*下发配置失败的回调*/
	function sendNavigationFail(){

	}
}

/*
  此命令用来开启负载均衡功能
*/
function loadBalanceConf(loadBalanceArr){
	var surl = MyConfig.path +"/ant/confmgr";

	var loadBalanceOpt = {
		url:surl,
		dataType:"json",
		type:"post",
		data:{
			configType:0,
			devSN:FrameInfo.ACSN,
			cloudModule:"stamgr",
			deviceModule:"stamgr",
			method:"LoadBalance",
			param : loadBalanceArr
		},
		onSuccess:sendloadSuc,
		onFailed:sendloadFail
	};

	Utils.Request.sendRequest(loadBalanceOpt);

	/*下发配置成功的回调*/
	function sendloadSuc(data){
		try{
			if( data.communicateResult == "fail"){
				Frame.Msg.info('配置下发失败',"error");
				addLog_fail();
			}else if( data.communicateResult == "success"){
				Frame.Msg.info("配置下发成功");
				deleteConfig(loadBalanceArr);
				addLog_success();
			}
		}catch(exception){

		}
	}

	/*下发配置失败的回调*/
	function sendloadFail(){

	}
}

/*用来配置客户端限速速率（最大接收速率,最大发送速率）*/
function rateLimitConf(rateLimitArr){

	var rateLimitOpt = {
		url:MyConfig.path +'/ant/confmgr',
		type:'post',
		dataType: "json",
		contentType: "application/json",
		data:JSON.stringify({
			devSN:FrameInfo.ACSN,
			configType:0,
			cloudModule:'stamgr',
			deviceModule :'stamgr',
			method:'LimitRate',
			param:rateLimitArr
		}),
		onSuccess:sendRateLimitSuc,
		onFailed:sendRateLimitFail
	};

	Utils.Request.sendRequest(rateLimitOpt);

	/*下发配置成功的回调*/
	function sendRateLimitSuc(data){
		try{
			if( data.communicateResult == "fail"){
				Frame.Msg.info('配置下发失败',"error");
				addLog_fail();
			}else if( data.communicateResult == "success"){
				Frame.Msg.info("配置下发成功");
				deleteConfig(rateLimitArr);
				addLog_success();
			}
		}catch(exception){

		}
	}

	/*下发配置失败的回调*/
	function sendRateLimitFail(){

	}
}

/*用来拒绝弱信号终端接入*/
function optionConf(optionArr){

	var optionOpt = {
		url:MyConfig.path +'/ant/confmgr',
		type:'post',
		dataType:'json',
		data:{
			configType:0,
			devSN:FrameInfo.ACSN,
			cloudModule:"stamgr",
			deviceModule:"stamgr",
			method:"ClientReject",
			param:optionArr
		},
		onSuccess:sendOptionSuc,
		onFailed:sendOptionFail
	};

	    Utils.Request.sendRequest(optionOpt);

	/*下发配置成功的回调*/
	function sendOptionSuc(data){
		if(data.communicateResult == "fail"){

			Frame.Msg.info("配置下发失败","error");
			addLog_fail();

		}else if (data.communicateResult == "success"){

			Frame.Msg.info("配置下发成功");
			deleteConfig(optionArr);
			addLog_success();
		}
	}

	/*下发配置失败的回调*/
	function sendOptionFail(){

	}
}


/*
   需要下发的配置显示在页面上
*/
function initCfg_data(data){
  var config = [];
  for(var i=0; i<data.length;i++){
	  config[i] = data[i].config +'\r\n';
  }
	$("#config").val(config.join(' '));
}

/*下配置成功后，添加用户日志*/
function addLog_success(){

	var logSucFlowOpt = {
		url:MyConfig.path +'/ant/logmgr',
		type:'post',
		dataType:'json',
		data:{
			method:"addLog",
			devSN:FrameInfo.ACSN, //string,设备SN号
			module:"一键优化",//string,模块
			level:"普通",//string 级别
			message: "成功"//string,日志内容
		},
		onSuccess:addLogSucFlowSuc,
		onFailed:addLogSucFlowFail
	};

	    Utils.Request.sendRequest(logSucFlowOpt);

	/*添加日志成功的回调*/
	function addLogSucFlowSuc(){

	}

	/*添加日志失败的回调*/
	function addLogSucFlowFail(){

	}
}

/*下配置失败后，添加用户日志*/
function addLog_fail(){

	var logFailFlowOpt = {
		url:MyConfig.path +'/ant/logmgr',
		type:'post',
		dataType:'json',
		data:{
			method:"addLog",
			devSN:FrameInfo.ACSN, //string,设备SN号
			module:"一键优化",//string,模块
			level:"普通",//string 级别
			message: "失败"//string,日志内容
		},
		onSuccess:addLogFailFlowSuc,
		onFailed:addLogFailFlowFail
	};

	    Utils.Request.sendRequest(logFailFlowOpt);

	/*添加日志成功的回调*/
	function addLogFailFlowSuc(){

	}

	/*添加日志失败的回调*/
	function addLogFailFlowFail(){

	}
}

function getRcText(sRcId){
    return   Utils.Base.getRcString("onekeyrepair_rc",sRcId);
}

function getRcString(sRcId,sRcName){
    return   $("#"+sRcId).attr(sRcName);
}

function _init(){

	getDatabase_data();

}

function _destroy(){

	Utils.Request.clearMoudleAjax(MODULE_NAME);
}

Utils.Pages.regModule(MODULE_NAME,{
    "init": _init,
    "destroy": _destroy,
    "widgets": ["Echart","Panel","Minput","Form"],
    "utils": [ "Device","Request"]
})
})(jQuery);