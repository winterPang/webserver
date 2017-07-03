;(function ($) {
    var MODULE_BASE = "commandline"
    var MODULE_NAME = MODULE_BASE+".commandline";
    var g_oCommandLine = "";
    var g_newName = "<H3C>";
    var g_showMsgHead = '<div class="backgroud-color col-xs-12">';
    var g_showMsgEnd = '</div>';
    var strPath = MyConfig.path + '/ant';
    var g_CmdView = "";
    var g_input = 0;
    var g_allCmds = [];
    var g_history = [];
    var g_currentPointer = 0;
    var g_date1 = 0;
    var g_date2 = 0;
    var g_count = 0;
    var g_handle = 0;
    var g_command = {};

    function timeout()
    {
        function aaa(){
            if(g_count == 0)
            {
                $("#command_line").append('<br/><span class="col-xs-12">.</span>');
                $("#command_line").parent().scrollTop(document.getElementById("command_line").scrollHeight);
            }
            else{
                $("#command_line span:last").append('.');
            }
            g_count++;
            if(g_count == 55){
                g_count = 0;
            }
        }
        g_handle = setInterval(aaa,1000);
    }

    function finishClock()
    {
        g_count = 0;
        $("#command_line").append('<br/>');
        clearInterval(g_handle);
        g_handle = 0;
    }
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("wips_rc", sRcName);
    }
    function addToHistory(strCmd)
    {
        if(strCmd !="#")
        {
            g_history.push(strCmd);
            g_currentPointer = g_history.length;
        }
    }
    function ajaxSendMsg(oMsg,oSuccess,oError)
    {
        addToHistory(oMsg.data.cmdProxy);
        var ajaxMsg = {
            url:oMsg.url,
            dataType: "json",
            type:oMsg.Type,
            data:oMsg.data,
            onSuccess: function(adoc){
                if(g_handle != 0)
                {
                    finishClock();
                }
                oSuccess(adoc);
            },
            onFailed:function(e){
                if(g_handle != 0)
                {
                    finishClock();
                }
                oError(e);
            },
            timeout:2*60*1000,
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    //ajaxTimeoutTest.abort();
                    $("#command_line").append('<div><span>Request time out!</span></div>');

                    if(g_handle != 0)
                    {
                        finishClock();
                    }
                    if(g_CmdView)
                    {
                        afterSend();
                    }
                }
            }
        };
        g_handle = setTimeout(timeout,3000);
        Utils.Request.sendRequest(ajaxMsg);
    }

    function judgeResultViews(sViewName)
    {
        var reg1 = /^\[.*\]$/;
        var reg2 = /^<.*>$/;
        if(reg2.test(sViewName) || reg1.test(sViewName) || (sViewName == "#") || (sViewName == "*") )
        {
            return true;
        }
        return false;
    }

    function setCmdView(aData)
    {
        if(aData && (aData.communicateResult == "success"))
        {
            $("#command_line label:first").text("Connect to device success!");
            showMsg(aData.echoInfo);
            afterSend();
        }
        else{
            $("#command_line label:first").text("Could not connect to device!");
            $("#command_line input:first").unbind().attr({disabled:"disabled"});
        }
    }

    function checkQuit()
    {
        var sCmd = $("#command_line input:last").val();
        if(sCmd.indexOf("?") != -1)
        {
            afterSend();
            return true;
        }
        var reg = /(^\s*)|(\s*$)/g;
        var regViews = /^<.*>$/;
        sCmd.replace(reg, sCmd);
        sCmd = $.trim(sCmd);
        if((regViews.test(g_CmdView)) && ((sCmd == "q") || (sCmd == "qu") || (sCmd == "qui") || (sCmd == "quit") || (sCmd == "bash") || (sCmd == "bas")))
        {
            afterSend();
            return true;
        }
        if( sCmd == "")
        {
            afterSend();
            return true;
        }
        return false;
    }

    function reBind()
    {
        $("#command_line input:last").on("keydown",function(e){
            var curkey = e.which;

            switch (curkey)
            {
                case 13:
                {
                    $("#command_line input:last").unbind().attr({disabled:"disabled"});
                    if(checkQuit())
                    {
                        break;
                    }
                    sendcmd(g_oCommandLine);
                    break;
                }
                case 38:
                {
                    if(g_history.length && (g_currentPointer > 0))
                    {
                        g_currentPointer--;
                        $("#command_line input:last").val(g_history[g_currentPointer]);
                    }
                    break;
                }
                case 40:
                {
                    if(g_history.length && (g_currentPointer < g_history.length - 1))
                    {
                        g_currentPointer++;
                        $("#command_line input:last").val(g_history[g_currentPointer]);
                    }
                    break;
                }

            }
        });

    }
    function sendAllCmd(adata)
    {

        if(g_allCmds.length)
        {

            if(adata)
            {
                receiveMsg(adata);
            }
            else{
                if($("#command_line input:last:disabled").length)
                {

                    return;
                }
            }
            var cmdOfSend = g_allCmds.shift();
            g_oCommandLine.data.cmdProxy = cmdOfSend;
            $("#command_line input:last").val(cmdOfSend);
            $("#command_line input:last").unbind().attr({disabled:"disabled"});

            if(checkQuit())
            {
                sendAllCmd();
                return;
            }

            ajaxSendMsg(g_oCommandLine,sendAllCmd,onError);
        }
        else if(adata){
            receiveMsg(adata);
        }
    }

    function onSubmit()
    {
        g_allCmds = $("#large_textarea").val().split("\n");
        sendAllCmd();
        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#largeCmdSetForm")));
    }
    function sendcmd(aData)
    {
        var sCommand = getvalue("#command_line input:last");
        var temp = 0;
        if(sCommand)
        {
            g_oCommandLine.data.cmdProxy = sCommand;
        }
        else{
            g_oCommandLine.data.cmdProxy = "#";
        }
        ajaxSendMsg(aData,receiveMsg,onError);
    }
    function getvalue(oScope){
        return $(oScope).val();
    }
    function receiveMsg(aData){
        if(aData && (aData.communicateResult == "success"))
        {
            showMsg(aData.echoInfo);
            afterSend();
        }
        else{
            finishClock();
            $("#command_line").append("<div><span>Could not connect to device!</span></div>");
            afterSend();
        }
    }
    function showMsg(sData)
    {
        try{
            if(sData.length)
            {
                var reg = /\r/g;
                sData = sData.replace(reg, "");
                sData = sData.replace(/ /g, '&nbsp;');
                sData = sData.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
                var aCmdLine = sData.split("\n");
                while((aCmdLine[aCmdLine.length - 1] == "\n") ||
                !aCmdLine[aCmdLine.length - 1] ||
                (aCmdLine[aCmdLine.length - 1] == aCmdLine[aCmdLine.length - 2])||
                (aCmdLine[aCmdLine.length - 1] == "")||(aCmdLine[aCmdLine.length - 1] == "\r\n") )
                {
                    aCmdLine.pop();
                    if(!aCmdLine.length)
                    {
                        break;
                    }
                }
                if(judgeResultViews(aCmdLine[aCmdLine.length - 1]))
                {
                    g_CmdView = aCmdLine[aCmdLine.length - 1];
                    aCmdLine.pop();
                }

                var newDiv = g_showMsgHead ;

                while(aCmdLine.length &&
                    (aCmdLine[0].match( /^<.*>/) ||
                    aCmdLine[0].match(/^\[.*\]/) ||
                    aCmdLine[0] == "#" ||
                    aCmdLine[0] == g_history[g_history.length - 1].replace(/ /g, '&nbsp;').replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")))
                {
                    aCmdLine.shift();
                }
                while(aCmdLine[aCmdLine.length - 1] == "")
                {
                    aCmdLine.pop();
                }
                for(var i = 0;i < aCmdLine.length; i++)
                {
                    if(i == 0)
                    {
                        newDiv = newDiv + aCmdLine[i];
                        continue;
                    }
                    newDiv = newDiv + "<br\/>" + aCmdLine[i];
                }
                newDiv = newDiv + g_showMsgEnd;

                $("#command_line").append(newDiv);
            }
        }
        catch(e)
        {

        }
    }
    function afterSend(){
        var newDiv = g_input.children().first().text(g_CmdView);
        g_input.children().last().removeAttr("disabled");
        $("#command_line").append(g_input.clone());
        reBind();
        $("#command_line input:last")[0].focus();
    }
    function onError(){
    }

    function initdata()
    {
        g_oCommandLine.data.cmdProxy = "#";
        ajaxSendMsg(g_oCommandLine,setCmdView,onError);
    }
    function initform()
    {
        reBind();
        $(".warning-panel").on("click",function(e){
            $(".warning-panel").remove();
        });

        $("#window_command").on("mousedown",function(e){
            g_date1 = new Date();
         });
        $("#window_command").on("mouseup",function(e){
            g_date2 = new Date();
            if(g_date2-g_date1 < 200)
            {
                $("#command_line input:last")[0].focus();
            }
        });
        $("#command_line").on("keydown",function(e){
            var curkey = e.which;
            if(curkey == 9)
            {
                return false;
            }
        });
        $("#button_largeset").on("click",function(e){
            Utils.Base.openDlg(null, {}, {scope:$("#largeCmdSetDlg"),className:"modal-super"});
        });
        $("#largeCmdSetForm").form("init", "edit", {
            "title": getRcText("COMMAND-LINE-BATCH-ISSUED"),
            "btn_apply":onSubmit
        });


        $("#button_help,#tip_icon").on("click", function(e){
            $("#tip_icon").toggleClass("on").toggleClass("off");
            $("#help_message").toggleClass("on");
        });
        $(".page-row .li-normalstyle").on("click", function(e) {
            var command = $(this).attr("command");
            if(g_handle != 0)
            {
                finishClock();
            }
            g_oCommandLine.data.cmdProxy = command;
            ajaxSendMsg(g_oCommandLine,receiveMsg,onError);



        });
        $(".telnet-switch input").on("click",function(){
            Utils.Base.redirect ({np:"commandline.telnet"});

        });
    }
    function _init()
    {
       // Utils.Base.openDlg(null, {}, {scope:$("#warnnigDlg"),className:"modal-super"});
        var funca = function(oparam){
            var command = $(oparam).attr("param");
            if(g_handle !=0) {
                $("#command_line").append("<br/><span class='col-xs-12'>" + getRcText("ERROR-TEXT") + "</span>");
            }
            else{
                g_allCmds = [];
                g_allCmds.push(command);
                sendAllCmd();
            }

        };

        var aBasicInfo = getRcText("BASIC-INFO").split(",");
        var aNetworkInfo = getRcText("NETWORK-INFO").split(",");
        var aMonitorInfo = getRcText("MONITOR-INFO").split(",");

        g_command = {data:[{name:aBasicInfo[0],value:0,func:funca,
            data:[{name:aBasicInfo[1],value:1,param:"display version",func:funca},
                {name:aBasicInfo[2],value:2,param:"display device",func:funca},
                {name:aBasicInfo[3],value:3,param:"display clock",func:funca},
                {name:aBasicInfo[4],value:4,param:"display current-configuration",func:funca},
                {name:aBasicInfo[5],value:5,param:"display interface brief",func:funca},
                {name:aBasicInfo[6],value:6,param:"display wlan rrm-status ap all",func:funca},
                {name:aBasicInfo[7],value:17,param:"save",func:funca}
            ]},
            {name:aNetworkInfo[0],func:funca,
                data:[{name:aNetworkInfo[1],value:7,param:"display cloud state",func:funca},
                    {name:aNetworkInfo[2],value:8,param:"display ip routing-table",func:funca},
                    {name:aNetworkInfo[3],value:9,param:"display wlan ap all",func:funca},
                    {name:aNetworkInfo[4],value:10,param:"display wlan statistics ap all connect-history",func:funca},
                    {name:aNetworkInfo[5],value:11,param:"display wlan client",func:funca},
                    {name:aNetworkInfo[6],value:12,param:"display wlan statistics client",func:funca},
                    {name:aNetworkInfo[7],value:13,param:"display wlan service-template",func:funca},
                    {name:aNetworkInfo[8],value:14,param:"display dhcp server ip-in-use",func:funca}
                ]},
            {name:aMonitorInfo[0],func:funca,
                data:[{name:aMonitorInfo[1],value:15,param:"display cpu-usage",func:funca},
                    {name:aMonitorInfo[2],value:16,param:"display memory",func:funca}
                ]}],
            //footer:{show:true, content:"故障恢复"},
            //search:{show:true, content:"常用命令"}

        };
        $(".antmenu").antmenu("init",g_command);
        g_oCommandLine = {
            url:strPath+'/confmgr',
            Type:"post",
            data:{
                configType : 0,
                devSN:FrameInfo.ACSN,
                deviceModule : "CMDPROXY",
                echo : 1,
                cmdProxy:"#",
                cfgTimeout:120,
            }
        };
        g_input = $("#command_line input:last").parent().clone();
        initdata();
        $("#command_line input:last")[0].focus();
        initform();


    }
    function _destroy()
    {
        clearInterval(g_handle);
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form","SList","Minput","Antmenu"],
        "utils":["Request","Base"],
    });
})( jQuery );
