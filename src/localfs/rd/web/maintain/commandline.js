;(function ($) {
    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE+".commandline";
    var g_showMsgHead = '<div class="backgroud-color col-xs-12">';
    var g_showMsgEnd = '</div>';
    var g_CmdView = "";
    var g_input = 0;
    var g_history = [];
    var g_currentPointer = 0;
    var g_date1 = 0;
    var g_date2 = 0;
    var g_count = 0;
    var g_handle = 0;
    var g_acSN = '';

    //confmgr下配置，3秒钟后开始打点（超时）
    function timeout()
    {
        function clock(){
            if(g_count == 0) //表示第一次打点
            {
                $("#command_line").append('<br/><span class="col-xs-12">.</span>');
                $("#command_line").parent().scrollTop(document.getElementById("command_line").scrollHeight);
            }
            else
            {
                $("#command_line span:last").append('.');
            }
            g_count++;

            if(g_count == 55){ //重新开始换行打点
                g_count = 0;
            }
        }

        //循环定时器每隔一秒钟打一个点
        g_handle = setInterval(clock,1000);
    }

    //清除循环定时器，停止打点
    function finishClock()
    {
        g_count = 0;
        $("#command_line").append('<br/>');
        clearInterval(g_handle);
        g_handle = 0;
    }

    //查询命令行历史记录
    function addToHistory(strCmd)
    {
        if(strCmd != "#")
        {
            g_history.push(strCmd);
            g_currentPointer = g_history.length;
        }
    }

    //下配置
    function sendCmdToDev(oMsg,oSuccess,oError)
    {
        addToHistory(oMsg);
        g_handle = setTimeout(timeout,3000);
        $.ajax({
            url:MyConfig.path+'/ant/confmgr',
            type:'post',
            dataType:'json',
            data:{
                configType : 0,
                devSN: g_acSN,
                deviceModule : "CMDPROXY",
                echo : 1,
                cmdProxy: oMsg,
                cfgTimeout:120000
            },
            timeout:30*1000,
            success: function(data){
                if(g_handle != 0)
                {
                    finishClock();
                }
                oSuccess(data);
            },
            error:function(e,status){

                if( status == 'timeout'){ //超时
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
                else
                {
                    if(g_handle != 0)
                    {
                        finishClock();
                    }
                    oError();
                }
            }
        });
    }


    //下配置请求成功
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

    //将设备返回的信息以特定的格式写入命令窗口中
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


    function initData()
    {
        //初始化页面，连接设备
        sendCmdToDev("#",setCmdView,onError);
    }

    function onError(){
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

                    var sCommand = getvalue("#command_line input:last");

                    if(!sCommand)
                    {
                        sCommand = "#";
                    }
                    sendCmdToDev(sCommand,receiveMsg,onError);
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


    function getvalue(oScope){
        return $(oScope).val();
    }


    //下配置成功
    function receiveMsg(aData){
        if(aData && (aData.communicateResult == "success"))
        {
            showMsg(aData.echoInfo);
            afterSend();
        }
        else
        {
            finishClock();
            $("#command_line").append("<div><span>Could not connect to device!</span></div>");
            afterSend();
        }
    }


    function initForm()
    {
        reBind();

        $(".warning-panel").on("click",function(e){
            $(".warning-panel").addClass('hide');
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

        //故障恢复
        $(".page-row .li-normalstyle").on("click", function(e) {
            var command = $(this).attr("command");
            if(g_handle != 0)
            {
                finishClock();
            }
            sendCmdToDev(command,receiveMsg,onError);
        });

        //更换设备
        $(".page-row .replace-dev").on("click", function(e) {
            $(".warning-panel").removeClass('hide');
            $("#command_line").empty();
            $("#command_line").append('<div class="col-xs-12">'+
                                        '<label class="backgroud-color">' +
                                            '[Connecting to device]' +
                                        '</label>' +
                                        '<input type="text" class="backgroud-color" disabled="disabled">' +
                                      '</div>');
            $("#filterAcsn").removeClass('hide');
            $("#Probe_Monitor").addClass('hide');

            if(g_handle != 0)
            {
                g_count = 0;
                clearInterval(g_handle);
                g_handle = 0;
            }
        });

        //使用telnet模式
        $(".page-row .replace-telnet").on("click", function(e) {
            /* 开启telnet,并重定向到telnet页面 */
            sendCmdToDev("system",setTelnet,onErrorText);
        });
    }

    function setTelnet(data){
        sendCmdToDev("telnet server enable",redirectTelnet,onErrorText);
    }
    function redirectTelnet(data){
        FrameInfo.devSN = g_acSN;
        Utils.Base.redirect ({np:"maintain.telnet"});
    }
    function onErrorText(){
        $("#command_line").append('<div><span>Set telnet server enable failed!</span></div>');
    }


    function webinit()
    {
        initData();
        $("#command_line input:last")[0].focus();
        initForm();
    }

    //创建命令行窗口右边列表
    function createList(){
        var commandList = {data:[{name:"基础信息",value:0,func:funca,
            data:[{name:"版本信息",value:1,param:"display version",func:funca},
                {name:"设备信息",value:2,param:"display device",func:funca},
                {name:"系统时间",value:3,param:"display clock",func:funca},
                {name:"配置信息",value:4,param:"display current-configuration",func:funca},
                {name:"接口信息",value:5,param:"display interface brief",func:funca},
                {name:"网络环境分析",value:6,param:"display wlan rrm-status ap all",func:funca},
                {name:"保存当前配置",value:17,param:"save",func:funca}
            ]},
            {name:"网络信息",func:funca,
                data:[{name:"绿洲云状态",value:7,param:"display cloud state",func:funca},
                    {name:"路由信息",value:8,param:"display ip routing-table",func:funca},
                    {name:"无线AP",value:9,param:"display wlan ap all",func:funca},
                    {name:"无线AP统计",value:10,param:"display wlan statistics ap all connect-history",func:funca},
                    {name:"无线Client",value:11,param:"display wlan client",func:funca},
                    {name:"无线Client统计",value:12,param:"display wlan statistics client",func:funca},
                    {name:"无线服务模板",value:13,param:"display wlan service-template",func:funca},
                    {name:"DHCP状态",value:14,param:"display dhcp server ip-in-use",func:funca}
                ]},
            {name:"监控信息",func:funca,
                data:[{name:"CPU使用率",value:15,param:"display cpu-usage",func:funca},
                    {name:"内存信息",value:16,param:"display memory",func:funca}
                ]}]
        };

        $(".antmenu").antmenu("init",commandList);
        g_input = $("#command_line input:last").parent().clone();
    }


    function funca(oparam){
        var command = $(oparam).attr("param");
        if(g_handle !=0) {
            $("#command_line").append('<br/><span class="col-xs-12">正在等待上个命令回复，按"故障恢复"键取消等待！</span>');
        }
        else{
            $("#command_line input:last").val(command);
            $("#command_line input:last").unbind().attr({disabled:"disabled"});
            sendCmdToDev(command,receiveMsg,onError);
        }

    }

    function _init(){
        if(FrameInfo.isReset == 'NO')
        {
            $("#filterAcsn").addClass('hide');
            $("#Probe_Monitor").removeClass('hide');
            createList();
            if(g_handle != 0)
            {
                g_count = 0;
                clearInterval(g_handle);
                g_handle = 0;
            }
            webinit();
        }

        $("#success").on("click",function(){
            var acSN = $("#ACSN").val();
            $("#ACSN").val("");
            if(acSN == ""){
                $("#errorMessage").html("设备序列号不能为空");
                $("#errorMessage").css("width","200px");
                $("#errorMessage").show();
                $("#ACSN").css("border","1px solid #a94442");
                $("#ACSN").addClass('warning');
                return;
            }

            //判断设备序列号是否存在
            $.ajax({
                url:MyConfig.path + "/devmonitor/web/system?devSN=" + acSN,
                type:'get',
                dataType:'json',
                success:function(data){
                    if(data.hasOwnProperty('errcode')){
                       $("#errorMessage").html("设备与云端断开连接或者设备号不存在");
                       $("#errorMessage").css("width","300px");
                       $("#errorMessage").show();
                       $("#ACSN").css("border","1px solid #a94442");
                       $("#ACSN").addClass('warning');
                    }
                    else{
                        $("#filterAcsn").addClass('hide');
                        $("#Probe_Monitor").removeClass('hide');

                        if(g_acSN == '')
                        {
                            createList();
                        }
                        g_acSN = acSN;
                        if(g_handle != 0)
                        {
                            g_count = 0;
                            clearInterval(g_handle);
                            g_handle = 0;
                        }
                        webinit();
                    }
                },
                error:function(){

                    Frame.Msg.error("查询设备序列号失败,请联系客服");
                }
            })
        });

        $('input[name=ACSN]').on("mousedown",function(){
            var value = $("#ACSN").hasClass('warning');
            if( value == true){
                $("#errorMessage").html("");
                $("#errorMessage").hide();
                $("#ACSN").css("border","1px solid #71858e");
                $("#ACSN").removeClass('warning');
            }
        });
    }


    function _destroy()
    {
        clearInterval(g_handle);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form","SList","Antmenu"],
        "utils":["Base"]
    });
})( jQuery );
