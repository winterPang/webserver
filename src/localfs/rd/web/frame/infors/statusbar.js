;(function ($) {
var MODULE_NAME = "frame.infors.statusbar";
var FORM_NAME = "statusbar_page";
var NC = Utils.Pages["Frame.NC"].NC_AP;
var g_oTimer = false;

function mergeData(aLogs, aClient, oAP)
{
    var nEmerg = 0,nAlert = 0,nCritical = 0,nDebug = 0;
    for(var i=0;i<aLogs.length;i++){
        var nLevel = parseInt(aLogs[i].Severity);
        if(nLevel <= 1){
            nEmerg++;
        }else if(nLevel > 1 && nLevel <=3){
            nAlert++;
        }else if(nLevel > 3 && nLevel <=5){
            nCritical++;
        }else if(nLevel > 5){
            nDebug++;
        }      
    }

    var nClient = 0;
    for(var i=0;i<aClient.length;i++)
    {
        nClient += parseInt(aClient[i].ClientNumber);
    }

    var nApTotal = -(-oAP.RunApNum-oAP.OfflineApNum-oAP.UnhealthyApNum);
    var sOnline = (Math.round(oAP.RunApNum * 100 / nApTotal) || 0 ) + "%";
    var sOffline = (Math.round(oAP.OfflineApNum * 100 / nApTotal) || 0 ) + "%";
    var sUnhealthy = (Math.round(oAP.UnhealthyApNum * 100 / nApTotal) || 0 ) + "%";

    var oInfor = {
        "bar_emergency" : nEmerg,
        "bar_alert" : nAlert,
        "bar_critical" : nCritical,
        "bar_debug" : nDebug,
        "bar_client" : nClient,
        "bar_online" : sOnline,
        "bar_offline" : sOffline,
        "bar_unhealthy" : sUnhealthy
    };

    Utils.Base.updateHtml($("#"+FORM_NAME),oInfor);
    return oInfor;
}

function initData(){
    function myCallback(oInfos)
    {
        var aSysLog = Utils.Request.getTableRows(NC.Logs, oInfos);
        var aClient = Utils.Request.getTableRows (NC.ClientStatus, oInfos);
        var oAP = Utils.Request.getTableRows (NC.APSummary, oInfos)[0] || {};
        var oInfor = mergeData(aSysLog, aClient, oAP);
        Utils.Base.addComma(oInfor);

        if(g_oTimer)
        {
            clearTimeout(g_oTimer);
        }
        g_oTimer = setTimeout(function(){initData();},3000);
    }
    var oLog = Utils.Request.getTableInstance(NC.Logs);
    var oClient = Utils.Request.getTableInstance (NC.ClientStatus);
    var oAP = Utils.Request.getTableInstance (NC.APSummary);
    Utils.Request.getAll([oLog,oClient,oAP], myCallback,null,{showErrMsg:false}); 
}

function initPage(){
	var jForm = $("#"+FORM_NAME);
	$(".bar-child",jForm).on("click",function(){
		window.location = "#M_Dashboard"
	});
}

function _init(oPara)
{   
    initPage();
    initData();
}

function _destroy()
{
    Frame.Debuger.info(MODULE_NAME + " is destroyed.");
    if(g_oTimer)
    {
        clearTimeout(g_oTimer);
        g_oTimer = false;
    }
}

Utils.Pages.regModule(MODULE_NAME, {
    "init": _init, 
    "destroy": _destroy, 
    "widgets": ["Form"], 
    "utils":["Request"]
});
Frame.Debuger.info(MODULE_NAME + " is loaded.");
})( jQuery );

