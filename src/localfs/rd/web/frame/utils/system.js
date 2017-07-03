;(function($)
{
    var UTILNAME = "System";
    //var NC = Utils.Pages["Frame.NC"].NC_System;
        
    var g_oTimer;
    var g_startTime, g_nDevTime;

    function parseTime(nTime)
    {
        var nDay, nHours, nMinutes, nSeconds;

        var nTemp = nTime;
        nSeconds = parseInt(nTemp%60);

        nTemp = nTemp/60;
        nMinutes = parseInt(nTemp%60);
        
        nTemp = nTemp/60;
        nHours = parseInt(nTemp%24);

        nDay = parseInt(nTemp/24);

        return {day: nDay, houre: nHours, minutes: nMinutes, seconds: nSeconds};
    }

    function updateHtml (oTime)
    {
        var sFormat = $.MyLocale.CUR_DATETIME;
        if (!sFormat)
        {
            // the resource string is not loaded, ignore
            return;
        }

        var h = getDoubleStr (oTime.houre);
        var m = getDoubleStr (oTime.minutes);
        var s = getDoubleStr (oTime.seconds);
        var sText = Utils.Base.sprintf(sFormat, oTime.day, h, m, s);
        $(".devices-time").html(sText);
    }

function getDoubleStr(num)
{
    return num >=10 ? num : "0"+num;
}

function startTimer()
{
    function updateTime()
    {
        var oDate = new Date();
        var nCurTime = (oDate - g_startTime)/1000 + g_nDevTime;
        var oDevTime = parseTime (nCurTime);
        updateHtml (oDevTime);
        return true;
    };

    g_oTimer =  setInterval(updateTime, 1000);
}
function setDeviceImg (sDevname,sSysoid)
{
    function getDeviceImg()
    {
    	$.ajax({
    		url: sImg,
    		success: function()
    		{
			    jDeviceBg.attr("src",sImg);
    		},
    		error: function()
    		{
    		    $(".page-sidebar .device-wrap").remove();
    		}
    	});
    }

    var jDevname = $("#devicename");
    jDevname.html(sDevname);
    jDevname.attr("title",sDevname);
    
    var jDeviceBg =$(".page-sidebar .device-wrap .device-dis");
    var sImg = Frame.Util.getPathUrl('webpanel/')+sSysoid+'.png';
    //getDeviceImg();
}


    // ajax¥ÌŒÛ¥¶¿Ì
    function onAjaxErr()
    {
        var sProtocal = window.location.protocol.replace(":", "").toUpperCase();
        var sMsg = PageText[PageText.curLang]["net_err"].replace("%s", sProtocal);
        alert(sMsg);
    }


    function getDynUrl(sUrl)
    {
        return  "../../wnm/" + sUrl;
    }

function getSystemInfo()
{
   /* function getMaster(oInfos)
    {
        var aPhysicalEntities = Utils.Request.mergeRequestTables(
            [NC.PhysicalEntities, NC.DeviceBoards], 
            oInfos, 
            [
                {src:NC.DeviceBoards, column:["PhysicalIndex"], dest:NC.PhysicalEntities}
            ],
            true
        );

        return aPhysicalEntities[0] || Utils.Request.getTableRows(NC.PhysicalEntities, oInfos)[0];
    }*/


    $.ajax({
        url: getDynUrl("oMaster.json"),
        dataType: "json",
        type:"get",
        success: function (oMaster)
        {
            alert("oMaster"+JSON.stringify(oMaster));
            if (oMaster)
            {
                var sDeviceType = oMaster.Model || oMaster.Name;
                var sDeviceSysoid = oMaster.VendorType;
                setDeviceImg (sDeviceType,sDeviceSysoid);
            }
        },
        error: onAjaxErr
    });

    $.ajax({
        url: getDynUrl("aBase.json"),
        dataType: "json",
        type:"get",
        success: function (aBase)
        {
            alert("oMaster"+JSON.stringify(aBase));
            if(!aBase)return ;
            alert("oMaster"+aBase.HostName);
            var sSysname = aBase.HostName;
            var jSysname = $(".devices .devices-sysname #sysname");
            jSysname.html(sSysname);
            jSysname.attr("title",sSysname);
            Frame.set("sysname",sSysname);

            g_startTime = new Date();
            g_nDevTime = parseInt (aBase.Uptime);

            var oDevTime = parseTime (g_nDevTime);
            updateHtml (oDevTime);

            startTimer ();
        },
        error: onAjaxErr
    });

  /*  function myCallback(oInfos)
    {
        var oMaster = getMaster(oInfos);
        if (oMaster)
        {
            var sDeviceType = oMaster.Model || oMaster.Name;
            var sDeviceSysoid = oMaster.VendorType;
            setDeviceImg (sDeviceType,sDeviceSysoid);
        }

        var aBase = Utils.Request.getTableRows(NC.DeviceBase, oInfos);
        if(aBase.length == 0)return ;
        var sSysname = aBase[0].HostName;
        var jSysname = $(".devices .devices-sysname #sysname");
        jSysname.html(sSysname);
        jSysname.attr("title",sSysname);
        Frame.set("sysname",sSysname);

        g_startTime = new Date();
        g_nDevTime = parseInt (aBase[0].Uptime);

        var oDevTime = parseTime (g_nDevTime);
        updateHtml (oDevTime);

        startTimer ();
    }  

    var aRequestTable = [];

    var oBase = Utils.Request.getTableInstance(NC.DeviceBase);
    aRequestTable.push (oBase);

    var oBoard = Utils.Request.getTableInstance(NC.DeviceBoards);
    oBoard.addFilter({"Role":"2"});
    aRequestTable.push (oBoard);

    var oPhysicalEntities = Utils.Request.getTableInstance(NC.PhysicalEntities);
    oPhysicalEntities.addFilter({"Class":"3"});
    aRequestTable.push (oPhysicalEntities);

    Utils.Request.getAll(aRequestTable, {onSuccess: myCallback, menu:"FRAME", name:"system"});*/
}

function loadJSFiles(aFiles)
{
    for (var i = 0; i < aFiles.length; i++)
    {
        var sJsFile = Frame.Util.getPathUrl(aFiles[i]);
        $.loadScript(sJsFile);
    }
}


    function onSystemInfo()
    {
       // getSystemInfo ();
        
      /*  Frame.Server.get("idletime", function()
        {
            Frame.keepAlive.init();
        }, 10);
       */
        //setInterval(getSystemInfo, 3000);
        
    }


    Utils.loadUtil(["Request"], onSystemInfo);
})(jQuery);
