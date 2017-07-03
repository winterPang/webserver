;(function ($) {
var MODULE_NAME = "WDashboard.Syslog";
    var oSysLog = [{"Index":"0","Time":"2010-12-31T21:02:52","Group":"WEB","Digest":"LOGIN","Severity":"5","Content":"Protocol(1001)=Reserved;SrcIPAddr(1003)=12.0.0.2;SrcPort(1004)=0;NatSrcIPaddr(1005)=21.0.0.13;NatSrcPort(1006)=0;NatSrcPort(1007)=0;NatSrcPort(1008)=0;NatSrcPort(1009)=0;NatSrcPort(1010)=0;NatSrcPort(1044)=0;NatSrcPort(1046)=0;NatSrcPort(1045)=0;NatSrcPort(1047)=0;NatSrcPort(1042)=0;NatSrcPort(1043)=0;NatSrcPort(1040)=0;NatSrcPort(1041)=0;BeginTime_e(1013)=05222014022916;EndTime_e(1014)=;Event(1048)=(8)Session cretead;"}
        ,{"Index":"1","Time":"2010-12-31T21:01:14","Group":"WEB","Digest":"LOGIN","Severity":"0","Content":"<script>alert(document.cookie)</script>"}
        ,{"Index":"2","Time":"2010-12-31T21:01:07","Group":"WEB","Digest":"LOGOUT","Severity":"0","Content":"admin logged out from 192.168.100.130"}
        ,{"Index":"3","Time":"2010-12-31T21:00:49","Group":"WEB","Digest":"LOGIN","Severity":"3","Content":"admin logged in from 192.168.100.130"}
        ,{"Index":"4","Time":"2010-12-31T21:00:11","Group":"SHELL","Digest":"SHELL_CMD","Severity":"4","Content":"-Line=vty1-IPAddr=192.168.100.130-User=**; Command is bash"}
        ,{"Index":"10996","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"FortyGigE2/0/49: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10997","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"Ten-GigabitEthernet2/0/2: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10998","Time":"2010-12-31T19:03:19","Group":"SCMD","Digest":"JOBINFO","Severity":"6","Content":"The service TELNET receive a duplicate event in status running, ignore it."}
        ,{"Index":"10999","Time":"2010-12-31T19:03:02","Group":"OPTMOD","Digest":"MODULE_IN","Severity":"4","Content":"FortyGigE2/0/49: The transceiver is STACK_QSFP_PLUS."}
        ,{"Index":"5","Time":"2010-12-31T21:01:14","Group":"WEB","Digest":"LOGIN","Severity":"1","Content":"<script>alert(document.cookie)</script>"}
        ,{"Index":"6","Time":"2010-12-31T21:01:07","Group":"WEB","Digest":"LOGOUT","Severity":"0","Content":"admin logged out from 192.168.100.130"}
        ,{"Index":"7","Time":"2010-12-31T21:00:49","Group":"WEB","Digest":"LOGIN","Severity":"3","Content":"admin logged in from 192.168.100.130"}
        ,{"Index":"8","Time":"2010-12-31T21:00:11","Group":"SHELL","Digest":"SHELL_CMD","Severity":"4","Content":"-Line=vty1-IPAddr=192.168.100.130-User=**; Command is bash"}
        ,{"Index":"1996","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"FortyGigE2/0/49: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"1997","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"Ten-GigabitEthernet2/0/2: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"1998","Time":"2010-12-31T19:03:19","Group":"SCMD","Digest":"JOBINFO","Severity":"6","Content":"The service TELNET receive a duplicate event in status running, ignore it."}
        ,{"Index":"1","Time":"2010-12-31T21:01:14","Group":"WEB","Digest":"LOGIN","Severity":"1","Content":"<script>alert(document.cookie)</script>"}
        ,{"Index":"2","Time":"2010-12-31T21:01:07","Group":"WEB","Digest":"LOGOUT","Severity":"2","Content":"admin logged out from 192.168.100.130"}
        ,{"Index":"3","Time":"2010-12-31T21:00:49","Group":"WEB","Digest":"LOGIN","Severity":"3","Content":"admin logged in from 192.168.100.130"}
        ,{"Index":"4","Time":"2010-12-31T21:00:11","Group":"SHELL","Digest":"SHELL_CMD","Severity":"4","Content":"-Line=vty1-IPAddr=192.168.100.130-User=**; Command is bash"}
        ,{"Index":"10996","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"FortyGigE2/0/49: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10997","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"Ten-GigabitEthernet2/0/2: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10998","Time":"2010-12-31T19:03:19","Group":"SCMD","Digest":"JOBINFO","Severity":"6","Content":"The service TELNET receive a duplicate event in status running, ignore it."}
        ,{"Index":"1","Time":"2010-12-31T21:01:14","Group":"WEB","Digest":"LOGIN","Severity":"1","Content":"<script>alert(document.cookie)</script>"}
        ,{"Index":"2","Time":"2010-12-31T21:01:07","Group":"WEB","Digest":"LOGOUT","Severity":"2","Content":"admin logged out from 192.168.100.130"}
        ,{"Index":"3","Time":"2010-12-31T21:00:49","Group":"WEB","Digest":"LOGIN","Severity":"3","Content":"admin logged in from 192.168.100.130"}
        ,{"Index":"4","Time":"2010-12-31T21:00:11","Group":"SHELL","Digest":"SHELL_CMD","Severity":"4","Content":"-Line=vty1-IPAddr=192.168.100.130-User=**; Command is bash"}
        ,{"Index":"10996","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"FortyGigE2/0/49: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10997","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"Ten-GigabitEthernet2/0/2: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10998","Time":"2010-12-31T19:03:19","Group":"SCMD","Digest":"JOBINFO","Severity":"6","Content":"The service TELNET receive a duplicate event in status running, ignore it."}
        ,{"Index":"1","Time":"2010-12-31T21:01:14","Group":"WEB","Digest":"LOGIN","Severity":"1","Content":"<script>alert(document.cookie)</script>"}
        ,{"Index":"2","Time":"2010-12-31T21:01:07","Group":"WEB","Digest":"LOGOUT","Severity":"2","Content":"admin logged out from 192.168.100.130"}
        ,{"Index":"3","Time":"2010-12-31T21:00:49","Group":"WEB","Digest":"LOGIN","Severity":"3","Content":"admin logged in from 192.168.100.130"}
        ,{"Index":"4","Time":"2010-12-31T21:00:11","Group":"SHELL","Digest":"SHELL_CMD","Severity":"4","Content":"-Line=vty1-IPAddr=192.168.100.130-User=**; Command is bash"}
        ,{"Index":"10996","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"FortyGigE2/0/49: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10997","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"Ten-GigabitEthernet2/0/2: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10998","Time":"2010-12-31T19:03:19","Group":"SCMD","Digest":"JOBINFO","Severity":"6","Content":"The service TELNET receive a duplicate event in status running, ignore it."}
        ,{"Index":"1","Time":"2010-12-31T21:01:14","Group":"WEB","Digest":"LOGIN","Severity":"1","Content":"<script>alert(document.cookie)</script>"}
        ,{"Index":"2","Time":"2010-12-31T21:01:07","Group":"WEB","Digest":"LOGOUT","Severity":"2","Content":"admin logged out from 192.168.100.130"}
        ,{"Index":"3","Time":"2010-12-31T21:00:49","Group":"WEB","Digest":"LOGIN","Severity":"3","Content":"admin logged in from 192.168.100.130"}
        ,{"Index":"4","Time":"2010-12-31T21:00:11","Group":"SHELL","Digest":"SHELL_CMD","Severity":"4","Content":"-Line=vty1-IPAddr=192.168.100.130-User=**; Command is bash"}
        ,{"Index":"10996","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"FortyGigE2/0/49: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10997","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"Ten-GigabitEthernet2/0/2: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10998","Time":"2010-12-31T19:03:19","Group":"SCMD","Digest":"JOBINFO","Severity":"6","Content":"The service TELNET receive a duplicate event in status running, ignore it."}
        ,{"Index":"1","Time":"2010-12-31T21:01:14","Group":"WEB","Digest":"LOGIN","Severity":"1","Content":"<script>alert(document.cookie)</script>"}
        ,{"Index":"2","Time":"2010-12-31T21:01:07","Group":"WEB","Digest":"LOGOUT","Severity":"2","Content":"admin logged out from 192.168.100.130"}
        ,{"Index":"3","Time":"2010-12-31T21:00:49","Group":"WEB","Digest":"LOGIN","Severity":"3","Content":"admin logged in from 192.168.100.130"}
        ,{"Index":"4","Time":"2010-12-31T21:00:11","Group":"SHELL","Digest":"SHELL_CMD","Severity":"4","Content":"-Line=vty1-IPAddr=192.168.100.130-User=**; Command is bash"}
        ,{"Index":"10996","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"FortyGigE2/0/49: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10997","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"Ten-GigabitEthernet2/0/2: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10998","Time":"2010-12-31T19:03:19","Group":"SCMD","Digest":"JOBINFO","Severity":"6","Content":"The service TELNET receive a duplicate event in status running, ignore it."}
        ,{"Index":"1","Time":"2010-12-31T21:01:14","Group":"WEB","Digest":"LOGIN","Severity":"1","Content":"<script>alert(document.cookie)</script>"}
        ,{"Index":"2","Time":"2010-12-31T21:01:07","Group":"WEB","Digest":"LOGOUT","Severity":"2","Content":"admin logged out from 192.168.100.130"}
        ,{"Index":"3","Time":"2010-12-31T21:00:49","Group":"WEB","Digest":"LOGIN","Severity":"3","Content":"admin logged in from 192.168.100.130"}
        ,{"Index":"4","Time":"2010-12-31T21:00:11","Group":"SHELL","Digest":"SHELL_CMD","Severity":"4","Content":"-Line=vty1-IPAddr=192.168.100.130-User=**; Command is bash"}
        ,{"Index":"10996","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"FortyGigE2/0/49: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10997","Time":"2010-12-31T19:03:19","Group":"OPTMOD","Digest":"PHONY_MODULE","Severity":"4","Content":"Ten-GigabitEthernet2/0/2: This transceiver is NOT sold by H3C. H3C therefore shall NOT guarantee the normal function of the device or assume the maintenance responsibility thereof!"}
        ,{"Index":"10998","Time":"2010-12-31T19:03:19","Group":"SCMD","Digest":"JOBINFO","Severity":"6","Content":"The service TELNET receive a duplicate event in status running, ignore it."}
        ,{"Index":"1","Time":"2010-12-31T21:01:14","Group":"WEB","Digest":"LOGIN","Severity":"0","Content":"<script>alert(document.cookie)</script>"}
        ,{"Index":"2","Time":"2010-12-31T21:01:07","Group":"WEB","Digest":"LOGOUT","Severity":"2","Content":"admin logged out from 192.168.100.130"}
        ,{"Index":"3","Time":"2010-12-31T21:00:49","Group":"WEB","Digest":"LOGIN","Severity":"3","Content":"admin logged in from 192.168.100.130"}
        ,{"Index":"4","Time":"2010-12-31T21:00:11","Group":"SHELL","Digest":"SHELL_CMD","Severity":"4","Content":"-Line=vty1-IPAddr=192.168.100.130-User=**; Command is bash"}
    ];

    function getRcText(sRcId)
    {
        return Utils.Base.getRcString("app_syslog_rc", sRcId);
    }
    function initForm(){
       /* $("#submit_scan").on("click",function()
        {
            Utils.Base.redirect ({np:$(this).attr("href")});
            return false;
        });*/
        $("#refresh_logs").on("click", loadEnd);
    }

	function _init()
	{
        initForm();
        loadEnd();
	}

	function bindLevel(jLevel)
	{
	    $(".syslog-info",jLevel).bind("click", function(){    	
			var nValue = $(".number",$(this)).attr("value");
            if ((nValue == "0"))
            {
               // alert(0);
                getEmergencyData();
            }
            else if (nValue == "1")
            {
               // alert(1);
            	getAlertData();
            }
            else if(nValue == "2")
            {
               // alert(2);
            	getCriticalData();
            }
            else if(nValue == "3")
            {
               // alert(3);
            	getErrorData();
            }
            else
            {
                alert("other");
               // getAllCurrentData();
            }
            $(".sys-logs").show();
            return false;
			});

	}
    function buildSeverityCol(nLevel)
    {
        var sStr,sLevel,sClass;
 		switch (nLevel)
		{
            case 0:
            {
                sLevel = getRcText("level_0");
                sClass="emergency-icon";
            }          
            break;
            case 1:
            {
                sLevel = getRcText("level_1");
                sClass="emergency-icon";
            }
            break;
            case 2:
            {
                sLevel = getRcText("level_2");
                sClass="critical-icon";
            }
            break;
            case 3:
            {
                sLevel = getRcText("level_3");
                sClass="critical-icon";
            }
            break;
            case 4:
            {
                sLevel = getRcText("level_4");
                sClass="warning-icon";
            }
            break;
            case 5:
            {
                sLevel = getRcText("level_5");
                sClass="warning-icon";
            }
            break;
            case 6:
            {
                sLevel = getRcText("level_6");
                sClass="info-icon";
            }
            break;
            case 7:
            {
                sLevel = getRcText("level_7");
                sClass="info-icon";
            }
            break;
          default:
            break;
		}       
      	sStr = '<td class="syslog-level"><i class="syslog-container '+sClass+'"></i><span>'+sLevel+'</span></td>';
        return sStr;
    }
    function onShowDlg(aData)
    {
        if(0 == aData.length)
        {
            return;
        }
        function createHeder(jDlg)
        {
            var jDlgHeader = $('<div class="modal-header"></div>');
            $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>').appendTo(jDlgHeader);
            $('<h3 class="modal-title">'+getRcText("HEADER_SYSLOG")+'</h3>').appendTo(jDlgHeader);
            jDlgHeader.appendTo (jDlg);
        }
        function createFooter (jDlg)
        {

            var jFooter = $("<div class='modal-footer form-actions'></div>");
            $("<a class='btn btn-primary' dlgtype='Close' data-dismiss='modal'><i class='icon-close'></i>"+$.MyLocale.Buttons.CLOSE+"</a>").appendTo(jFooter);
            $("<a class='btn btn-orange' id='ViewDetail'><i class='icon-close'></i>"+getRcText("VIEW_DETAILS")+"</a>").appendTo(jFooter);
            jFooter.appendTo(jDlg);
        } 
        function initDlg(jDlg)
        {
            $("#ViewDetail",jDlg).on("click",function(){                
                Utils.Pages.closeWindow(Utils.Pages.getWindow(jDlg));
                Utils.Base.redirect({np:"syslog.syslog"});
                return false;
            });
        }      
        function createBody (jDlg)
        {
            var jDlgBody = $('<div class="modal-body"></div>').appendTo (jDlg);
            createTable(jDlgBody,aData);
        }
        
        var jDlg = $('<div></div>');

        createHeder (jDlg);
        createBody (jDlg);
        createFooter (jDlg);
        jDlg.appendTo($("body")); 
        initDlg(jDlg); 
        Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super dashboard"});
        
    };
	function createTable(jDlgBody,aData)
    {
       var aHtml = ['<table class="table table-bordered syslog">'];
      
       for(var row=0; row<aData.length; row++)
        {
            aHtml.push("<tr>");

				aHtml.push(buildSeverityCol(parseInt(aData[row].Severity)));
		        var sValue = Utils.Base.encode(aData[row].Content);
		        var sTime = aData[row].Time.replace('T', ' ');
		        aHtml.push("<td><p>" + sValue + "</p><span>" + sTime + "</span></td>");
            aHtml.push("</tr>");
        }

        aHtml.push("</table>");
        jDlgBody.append(aHtml.join(' '));
    }
    function statStatus(aData)
    {
        var nTotal = aData.length;
        var nEmerg = 0;    /*0*/
        var nCritical = 0; /*2*/
        var nError = 0;    /*3*/
        var nAlert = 0;    /*1*/
        for(var i=0;i<aData.length;i++)
        {
     		switch (parseInt(aData[i].Severity))
    		{
                case 0:
                case 1:
                {
                    nEmerg++;
                    break;                    
                }
                case 2:
                case 3:
                {
                    nAlert++;
                    break;
                }
                case 4:
                case 5:
                {
                    nCritical++;
                    break;
                }
                case 6:
                case 7:
                {
                    nError++;
                    break;
                }
                default:
                    break;
    		}              
        }
        if(0 == nTotal)
        {
            $("#total .number").addClass("bg-dark");
        }
        $("#total .number").html(nTotal);
        if(nEmerg > 0)
        {
            $("#emergency .syslog-info").removeClass("bg-grey");
            $("#emergency .syslog-info").addClass("bg-emergency");
        }
        else
        {
            $("#emergency .syslog-info").addClass("bg-grey");
        }
        $("#emergency .number").html(nEmerg);
        if(nCritical > 0)
        {
            $("#critical .syslog-info").removeClass("bg-grey");
            $("#critical .syslog-info").addClass("bg-warning");
        }
        else
        {
            $("#critical .syslog-info").addClass("bg-grey");
        }
        $("#critical .number").html(nCritical);
        if(nError > 0)
        {
            $("#error .syslog-info").removeClass("bg-grey");
            $("#error .syslog-info").addClass("bg-info");
        }
        else
        {
            $("#error .syslog-info").addClass("bg-grey");
        }
        $("#error .number").html(nError);
        if(nAlert > 0)
        {
            $("#alert .syslog-info").removeClass("bg-grey");
            $("#alert .syslog-info").addClass("bg-critical");
        }
        else
        {
            $("#alert .syslog-info").addClass("bg-grey");
        }
        $("#alert .number").html(nAlert);

    }
	function loadEnd(jParent)
	{
		bindLevel($("#level"));
		getAllData();
 	}
    function getAllData()
    {
            var aData = oSysLog || [];
            statStatus(aData);
    }
    function getEmergencyData()
    {

         //   var aSysLog = Utils.Request.getTableRows(NC.Logs, oInfos) || [];
            var aData = [];
            $.each(oSysLog, function(index, oSysLog){
                if(oSysLog.Severity == 0 || oSysLog.Severity == 1)
                {
                    aData.push(oSysLog);
                }
            });
            onShowDlg(aData);

    }
    function getAlertData()
    {
      /*  function myAlertCallback(oInfos)
        {
            var aSysLog = Utils.Request.getTableRows(NC.Logs, oInfos) || [];*/
            var aData = [];
            $.each(oSysLog, function(index, oSysLog){
                if(oSysLog.Severity == 2 || oSysLog.Severity == 3)
                {
                    aData.push(oSysLog);
                }
            });
            onShowDlg(aData);
       /* }
        var oLog = Utils.Request.getTableInstance(NC.Logs);
        oLog.addMatchFilter({"Severity" : "notMore:"+ 3});
        
        Utils.Request.getAll([oLog], myAlertCallback); */
    }
    function getCriticalData()
    {
       /* function myCriticalCallback(oInfos)
        {
            var oSysLog = Utils.Request.getTableRows(NC.Logs, oInfos);*/
            var aData = [];
            for (var i=0;i<oSysLog.length;i++)
            {
                if((4==oSysLog[i].Severity)||(5==oSysLog[i].Severity))
                {
                    aData.push(oSysLog[i]);
                }
            }

            onShowDlg(aData);
            
       /* }
        var oLog = Utils.Request.getTableInstance(NC.Logs);
        oLog.addMatchFilter({"Severity" : "notLess:"+ 4});
        oLog.addMatchFilter({"Severity" : "notMore:"+ 5});
        Utils.Request.getAll([oLog], myCriticalCallback); */
    }
    function getErrorData()
    {
        /*function myCallback(oInfos)
        {
            var aSysLog = Utils.Request.getTableRows(NC.Logs, oInfos) || [];*/
            var aData = [];
            $.each(oSysLog, function(index, oSysLog){
                if(oSysLog.Severity >=6)
                {
                    aData.push(oSysLog);
                }
            });
            onShowDlg(aData);
           
       /* }
        var oLog = Utils.Request.getTableInstance(NC.Logs);
        oLog.addMatchFilter({"Severity" : "notLess:"+ 6});
        Utils.Request.getAll([oLog], myCallback); */
    }
    function _destroy()
    {

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
    "utils":[]
   // "subModules":[MODULE_NC]
});

})( jQuery );

