;(function ($) {
var MODULE_NAME = "city_dashboard.syslog";

var g_bflag = true;

    function getRcText(sRcId)
    {
        return Utils.Base.getRcString("app_syslog_rc", sRcId);
    }
    function initForm(){
        $("#submit_scan").on("click",function()
        {
            // Utils.Base.redirect ({np:$(this).attr("href")});
            window.location.hash = "#M_LOG";
            return false;
        });
        $("#refresh_logs").on("click", loadEnd);
    }

	function _init()
	{	    
        initForm();
        loadEnd();
	}


    function statStatus(aData)
    {
        var nTotal = aData.length;
        var nEmerg = aData[0]+aData[1];    /*0*/
        var nAlert = aData[2]+aData[3];    /*1*/
        var nCritical = aData[4]+aData[5]; /*2*/
        var nError = aData[6]+aData[7];    /*3*/
        
      //   for(var i=0;i<aData.length;i++)
      //   {
     	// 	switch (parseInt(aData[i].logLevel))
    		// {
      //           case 0:
      //           case 1:
      //           {
      //               nEmerg++;
      //               break;                    
      //           }
      //           case 2:
      //           case 3:
      //           {
      //               nAlert++;
      //               break;
      //           }
      //           case 4:
      //           case 5:
      //           {
      //               nCritical++;
      //               break;
      //           }
      //           case 6:
      //           case 7:
      //           {
      //               nError++;
      //               break;
      //           }
      //           default:
      //               break;
    		// }              
      //   }
        // if(0 == nTotal)
        // {
        //     $("#total .number").addClass("bg-dark");
        // }
        $("#total .number").html(nTotal);
        // if(nEmerg > 0)
        // {
        //     $("#emergency .syslog-info").removeClass("bg-grey");
        //     $("#emergency .syslog-info").addClass("bg-emergency");
        // }
        // else
        // {
        //     $("#emergency .syslog-info").addClass("bg-grey");
        // }
        $("#emergency .number").html(nEmerg);
        // if(nCritical > 0)
        // {
        //     $("#critical .syslog-info").removeClass("bg-grey");
        //     $("#critical .syslog-info").addClass("bg-warning");
        // }
        // else
        // {
        //     $("#critical .syslog-info").addClass("bg-grey");
        // }
        $("#critical .number").html(nCritical);
        // if(nError > 0)
        // {
        //     $("#error .syslog-info").removeClass("bg-grey");
        //     $("#error .syslog-info").addClass("bg-info");
        // }
        // else
        // {
        //     $("#error .syslog-info").addClass("bg-grey");
        // }
        $("#error .number").html(nError);
        // if(nAlert > 0)
        // {
        //     $("#alert .syslog-info").removeClass("bg-grey");
        //     $("#alert .syslog-info").addClass("bg-critical");
        // }
        // else
        // {
        //     $("#alert .syslog-info").addClass("bg-grey");
        // }
        $("#alert .number").html(nAlert);

    }
    function getSyslogFlowSuc (data){
        // statStatus(data.devLog);
        statStatus(data.logstats);
    }
    function getSyslogFlowFail (){
        console.log("Request getdevlog fail");
    }
	function loadEnd()
	{
        var syslogFlowOpt = {
            // url : MyConfig.path+"/devlogserver/getdevlog?devSN=" + FrameInfo.ACSN,
            url : MyConfig.path+"/devlogserver/getlogstats?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType:"json",
            onSuccess:getSyslogFlowSuc,
            onFailed:getSyslogFlowFail
        }
        Utils.Request.sendRequest(syslogFlowOpt);
 	}
   
    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
	function _resize(jParent)
	{
        Frame.Debuger.info("resize sysinfo in APP");
	}


Utils.Pages.regModule(MODULE_NAME, {
    "init": _init, 
    "destroy": _destroy,
    "resize": _resize, 
    "widgets": ["Mlist"], 
    "utils":["Request"],
    "subModules":[]
});

})( jQuery );

