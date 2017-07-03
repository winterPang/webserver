;(function ($) {
    var MODULE_BASE = "b_commandline"
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
    var g_data = null;

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
        $.ajax({
            url:oMsg.url,
            dataType: "json",
            type:oMsg.Type,
            data:oMsg.data,
            success: oSuccess,
            error:oError
        });

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
            return ture;
        }
        var reg = /(^\s*)|(\s*$)/g;
        var regViews = /^<.*>$/;
        sCmd.replace(reg, sCmd);
        if((regViews.test(g_CmdView)) && ((sCmd == "q") || (sCmd == "qu") || (sCmd == "qui") || (sCmd == "quit") || (sCmd == "bash") || (sCmd == "bas")))
        {
            afterSend();
            return ture;
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
            var cmdOfSend = g_allCmds.shift();
            g_oCommandLine.data.cmdProxy = cmdOfSend;
            $("#command_line input:last").val(cmdOfSend).unbind();

            if(adata)
            {
                receiveMsg(adata);
            }
            else{

            }
            ajaxSendMsg(g_oCommandLine,sendAllCmd,onError);
        }
        else{
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
        if(sCommand)
        {
            g_oCommandLine.data.cmdProxy = sCommand;
        }
        else{
            g_oCommandLine.data.cmdProxy = "#";
        }
        ajaxSendMsg(aData,receiveMsg,onError);
        $.ajax({url:strPath + '/logmgr',
            dataType:"json",
            type:"post",
            data:{method:"addLog",
                devSN:FrameInfo.ACSN, //string,设备SN号
                module : getRcText("MOUDEL_NAME"), //string,可选
                level : getRcText("WARN_NORMAL"), //string,可选
                message:g_oCommandLine.data.cmdProxy //string,日志内容
            },
            timeout:100

        });
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
            Utils.Base.showError("链接失败！");
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
                while(aCmdLine[aCmdLine.length - 1] == "\n" ||
                !aCmdLine[aCmdLine.length - 1] ||
                (aCmdLine[aCmdLine.length - 1] == aCmdLine[aCmdLine.length - 2]) )
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

                if(aCmdLine.length &&
                    (aCmdLine[0].match( /^<.*>/) ||
                    aCmdLine[0].match(/^\[.*\]/) ||
                    aCmdLine[0] == "#" ||
                    aCmdLine[0] == g_history[g_history.length - 1].replace(/ /g, '&nbsp;').replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")))
                {
                    aCmdLine.shift();
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
    function onError(){}

    function initdata()
    {
        g_oCommandLine.data.cmdProxy = "#";
        ajaxSendMsg(g_oCommandLine,setCmdView,onError);

        //sendcmd(g_oCommandLine);
    }
    function initform()
    {
        reBind();
        $(".warning-panel").on("click",function(e){
            $(".warning-panel").remove();
            $("#command_line input:last")[0].focus();

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
            "title": "命令行批量下发",
            "btn_apply":onSubmit
        });
    }
    function _init()
    {
        g_data = Utils.Base.parseUrlPara();
       // Utils.Base.openDlg(null, {}, {scope:$("#warnnigDlg"),className:"modal-super"});

        g_oCommandLine = {
            url:strPath+'/confmgr',
            Type:"post",
            data:{
                configType : 0,
                devSN:FrameInfo.ACSN,
                deviceModule : "CMDPROXY",
                echo : 1,
                cmdProxy:"#"
            }
        };
        g_input = $("#command_line input:last").parent().clone();
        initdata();
        $("#command_line input:last")[0].focus();
        initform()
    }
    function _destroy()
    {
        g_data = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form","SList","Minput"],
        "utils":["Request","Base"],
    });
})( jQuery );
