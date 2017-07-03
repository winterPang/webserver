define(['utils', 'jquery', 'angular-ui-router', 'frame/directive/siteDevPicker' /*, 'filesystem/libs/oasis-select'*/ ], function(Utils, $scope) {
    return ['$scope', '$http', '$state', function($scope, $http) {
        var g_oCommandLine = "";
        var g_showMsgHead = '<div class="backgroud-color col-xs-12">';
        var g_showMsgEnd = '</div>';
        var g_CmdView = "";
        var g_input = 0;
        var g_allCmds = [];
        var g_history = [];
        var g_currentPointer = 0;
        var g_date1 = 0;
        var g_date2 = 0;
        var g_count = 0;
        var g_handle = 0;
        var g_strACSN = $scope.sceneInfo.sn;
        $scope.regiondata = [{ id: 1, name: '东电' }, { id: 2, name: '龙冠' }, { id: 3, name: '杭州' }];
        $scope.devicedata = [{ id: 1, name: '设备1' }, { id: 2, name: '常用设备' }, { id: 3, name: '备用设备' }];
        var g_oConfmgrUrl = Utils.getUrl('POST', '', '/ant/confmgr', '/init/commandline5/confmgr.json');
        var g_oCommandLine = {
            url: g_oConfmgrUrl.url,
            method: g_oConfmgrUrl.method,
            data: {
                configType: 0,
                devSN: g_strACSN,
                deviceModule: "CMDPROXY",
                echo: "1", //回显标示
                cmdProxy: "#",
                cfgTimeout: 120,
            }
        };

        //telnet是否开启
        $scope.drsValueIsEnable = false;
        //警告框的显示
        $scope.b_warning_show = true;
        //常用命令
        $scope.baseInfo = false;
        $scope.networkInfo = false;
        $scope.monitorInfo = false;
        $scope.base = '+';
        $scope.network = '+';
        $scope.monitor = '+';
        $scope.isBaseOpen = false;
        $scope.isNetOpen = false;
        $scope.isMonOpen = false;

        $scope.showWarning = function() {
                $scope.b_warning_show = !$scope.b_warning_show;
            }
            //开关，点击时触发此方法
        $scope.drsValueChange = function() {
            $scope.drsValueIsEnable = !$scope.drsValueIsEnable;
        };

        $scope.showCmd = function(strInfoFlag) {
            switch (strInfoFlag) {
                case "baseInfo":
                    {
                        $scope.baseInfo = !$scope.baseInfo;
                        $scope.networkInfo = false;
                        $scope.monitorInfo = false;
                        break;
                    }
                case "networkInfo":
                    {
                        $scope.baseInfo = false;
                        $scope.networkInfo = !$scope.networkInfo;
                        $scope.monitorInfo = false;
                        break;
                    }
                case "monitorInfo":
                    {
                        $scope.baseInfo = false;
                        $scope.networkInfo = false;
                        $scope.monitorInfo = !$scope.monitorInfo;
                        break;
                    }
                default:
                    {
                        break;
                    }
            }

            $scope.base = $scope.baseInfo ? 'x' : '+';
            $scope.network = $scope.networkInfo ? 'x' : '+';
            $scope.monitor = $scope.monitorInfo ? 'x' : '+';
            $scope.isBaseOpen = $scope.baseInfo;
            $scope.isNetOpen = $scope.networkInfo;
            $scope.isMonOpen = $scope.monitorInfo;
        }

        function timeout() {
            function timeCallback() {
                if (g_count == 0) {
                    $("#command_line").append('<br/><span class="col-xs-12">.</span>');
                    $("#command_line").parent().scrollTop(document.getElementById("command_line").scrollHeight);
                } else {
                    $("#command_line span:last").append('.');
                }

                g_count++;
                if (g_count == 55) {
                    g_count = 0;
                }
            }
            g_handle = setInterval(timeCallback, 1000);
        }

        function addToHistory(strCmd) {
            if (strCmd != "#") {
                g_history.push(strCmd);
                g_currentPointer = g_history.length;
            }
        }

        function finishClock() {
            g_count = 0;

            $("#command_line").append('<br/>');
            clearInterval(g_handle);
            g_handle = 0;
        }

        function judgeResultViews(sViewName) {
            var reg1 = /^\[.*\]$/;
            var reg2 = /^<.*>$/;

            if (reg2.test(sViewName) || reg1.test(sViewName) || (sViewName == "#") || (sViewName == "*")) {
                return true;
            }

            return false;
        }

        function showMsg(sData) {
            try {
                if (sData.length) {
                    var reg = /\r/g;
                    sData = sData.replace(reg, "");
                    sData = sData.replace(/ /g, '&nbsp;');
                    sData = sData.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
                    var aCmdLine = sData.split("\n");
                    while ((aCmdLine[aCmdLine.length - 1] == "\n") ||
                        !aCmdLine[aCmdLine.length - 1] ||
                        (aCmdLine[aCmdLine.length - 1] == aCmdLine[aCmdLine.length - 2]) ||
                        (aCmdLine[aCmdLine.length - 1] == "") || (aCmdLine[aCmdLine.length - 1] == "\r\n")) {
                        aCmdLine.pop();
                        if (!aCmdLine.length) {
                            break;
                        }
                    }

                    if (judgeResultViews(aCmdLine[aCmdLine.length - 1])) {
                        g_CmdView = aCmdLine[aCmdLine.length - 1];
                        aCmdLine.pop();
                    }

                    var newDiv = g_showMsgHead;

                    while (aCmdLine.length &&
                        (aCmdLine[0].match(/^<.*>/) ||
                            aCmdLine[0].match(/^\[.*\]/) ||
                            aCmdLine[0] == "#" ||
                            aCmdLine[0] == g_history[g_history.length - 1].replace(/ /g, '&nbsp;').replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;"))) {
                        aCmdLine.shift();
                    }
                    while (aCmdLine[aCmdLine.length - 1] == "") {
                        aCmdLine.pop();
                    }

                    for (var i = 0; i < aCmdLine.length; i++) {
                        if (i == 0) {
                            newDiv = newDiv + aCmdLine[i];
                            continue;
                        }
                        newDiv = newDiv + "<br\/>" + aCmdLine[i];
                    }
                    newDiv = newDiv + g_showMsgEnd;

                    $("#command_line").append(newDiv);
                }
            } catch (e) {

            }
        }

        function checkQuit() {
            var sCmd = $("#command_line input:last").val();
            var reg = /(^\s*)|(\s*$)/g;
            var regViews = /^<.*>$/;

            if (sCmd.indexOf("?") != -1) {
                afterSend();
                return true;
            }

            sCmd.replace(reg, sCmd);
            sCmd = $.trim(sCmd);

            if ((regViews.test(g_CmdView)) && ((sCmd == "q") || (sCmd == "qu") || (sCmd == "qui") || (sCmd == "quit") || (sCmd == "bash") || (sCmd == "bas"))) {
                afterSend();
                return true;
            }

            if (sCmd == "") {
                afterSend();
                return true;
            }

            return false;
        }

        function receiveMsg(aData) {
            if (aData && (aData.communicateResult == "success")) {
                showMsg(aData.echoInfo);
                afterSend();
            } else {
                finishClock();
                $("#command_line").append("<div><span>Could not connect to device!</span></div>");
                afterSend();
            }
        }

        function sendcmd() {
            var sCommand = $("#command_line input:last").val();

            if (sCommand) {
                g_oCommandLine.data.cmdProxy = sCommand;
            } else {
                g_oCommandLine.data.cmdProxy = "#";
            }

            httpSendMsg(g_oCommandLine, receiveMsg);
        }

        function sendAllCmd(adata) {
            if (g_allCmds.length) {
                if (adata) {
                    receiveMsg(adata);
                } else {
                    if ($("#command_line input:last:disabled").length) {
                        return;
                    }
                }
                var cmdOfSend = g_allCmds.shift();
                g_oCommandLine.data.cmdProxy = cmdOfSend;
                $("#command_line input:last").val(cmdOfSend);
                $("#command_line input:last").unbind().attr({ disabled: "disabled" });

                if (checkQuit()) {
                    sendAllCmd();
                    return;
                }

                httpSendMsg(g_oCommandLine, receiveMsg);
            } else if (adata) {
                receiveMsg(adata);
            }
        }

        $scope.mouseEvent = function(strTmp) {
            if ("down" == strTmp) {
                g_date1 = new Date();
            } else {
                g_date2 = new Date();

                if (g_date2 - g_date1 < 200) {
                    $("#command_line input:last")[0].focus();
                    // document.getElementsById('window_command')[0].scrollTop = 0;
                }
            }
        }

        $scope.commonCommands = function(strCmd) {
            g_allCmds = [];
            g_allCmds.push(strCmd);
            sendAllCmd();
        }

        $scope.recovery = function() {
            var command = "reset csm command proxy channel";
            if (g_handle != 0) {
                finishClock();
            }
            g_oCommandLine.data.cmdProxy = command;
            httpSendMsg(g_oCommandLine, receiveMsg);
        }

        function keyDownEvent(e) {
            var nKey = e.keyCode;

            switch (nKey) {
                case 9:
                    {
                        break;
                    }
                case 38:
                    {
                        if (g_history.length && (g_currentPointer > 0)) {
                            g_currentPointer--;
                            $("#command_line input:last").val(g_history[g_currentPointer]);
                        }
                        break;
                    }
                case 40:
                    {
                        if (g_history.length && (g_currentPointer < g_history.length)) {
                            g_currentPointer++;
                            $("#command_line input:last").val(g_history[g_currentPointer]);
                        }

                        if (g_currentPointer == g_history.length) {
                            $("#command_line input:last").val("");
                        }
                        break;
                    }
            }
        }

        function keyUpEvent(e) {
            var nKey = e.keyCode;

            switch (nKey) {
                case 13:
                    {
                        $("#command_line input:last").unbind().attr({ disabled: "disabled" });
                        if (!checkQuit()) {
                            sendcmd();
                        }
                        break;
                    }
                case 38:
                    {
                        var strVal = $("#command_line input:last").val();

                        if (strVal) {
                            $("#command_line input:last").val(strVal + "a"); //先改变值
                            $("#command_line input:last").val(strVal); //再恢复原值,如果没有改变值,直接这么写,光标还是不会发生变化
                        }
                        break;
                    }
            }
        }

        $("#window_command").delegate("#command_line input:last", "keyup", function(e) {
            keyUpEvent(e);
        });
        $("#window_command").delegate("#command_line input:last", "keydown", function(e) {
            keyDownEvent(e);
        });

        function afterSend() {
            var newDiv = g_input.children().first().text(g_CmdView);
            g_input.children().last().removeAttr("disabled");
            $("#command_line").append(g_input.clone());
            $("#mine_field").delegate(" .mine", 'click', function() {});
            $("#command_line input:last")[0].focus();
        }

        function setCmdView(oData) {
            if (oData && (oData.communicateResult == "success")) {
                $("#command_line label:first").text("Connect to device success!");
                showMsg(oData.echoInfo);
                afterSend();
            } else {
                $("#command_line label:first").text("Could not connect to device!");
                $("#command_line input:first").unbind().attr({ disabled: "disabled" });
            }
        }

        function httpSendMsg(oMsg, oSuccess) {
            addToHistory(oMsg.data.cmdProxy);
            $http({
                url: oMsg.url,
                method: oMsg.method,
                data: oMsg.data
            }).success(function(data, header, config, status) {
                if (g_handle != 0) {
                    finishClock();
                }
                oSuccess(data);
            }).error(function(data, header, config, status) {
                console.log("Show attack information list error!");
            });

            g_handle = setTimeout(timeout, 3000);
        }

        function initdata() {
            g_oCommandLine.data.cmdProxy = "#";
            httpSendMsg(g_oCommandLine, setCmdView);
        }

        function init() {
            g_input = $("#command_line input:last").parent().clone();
            initdata();
            $("#command_line input:last")[0].focus();
        }

        init();

        $scope.shopInfo = {};
        $scope.changeSite = function() {
            console.log(arguments);
        }
    }];
});