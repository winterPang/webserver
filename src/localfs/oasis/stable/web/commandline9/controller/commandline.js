define(['utils', 'jquery', 'echarts', 'bootstrap-daterangepicker', 'angular-ui-router', 'css!bootstrap_daterangepicker_css'], function (Utils, $scope, echarts) {
    return ['$scope', '$http', '$alertService', '$state', '$timeout', function ($scope, $http, FRAME, $state, $timeout) {
        var g_oCommandLine = "";
        var g_newName = "<WX3520H>";
        var g_showMsgHead = '<div class="backgroud-color col-xs-12">';
        var g_showMsgEnd = '</div>';
        // var strPath = MyConfig.path + '/ant';
        var strPath ='/ant';
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
        var array=[];
        var deviseAlmData={};
        var deviseDevData={};
        var dev;
        var commHtml=$("#command_line").html();
        $scope.devSnList=[];
        $scope.alimsOptions={//别名
            sId: 'alimsO'   
        }
        $scope.devOptions={
            sId: 'devSnSelct',
            allowClear: false
        }
//userName:$scope.userInfo.user,
//nasId:$scope.sceneInfo.nasid,
        var g_oConfmgrUrl = Utils.getUrl('POST', '', '/ant/confmgr', '/init/commandline5/confmgr.json');
        //var g_strACSN = $scope.sceneInfo.sn;
        var g_strACSN ;
        //var g_strACSN = "210235A1JNB161000011";
        var URL_GET_DEV_LIST = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/%d';

        g_oCommandLine = {
            url: g_oConfmgrUrl.url,
            method: g_oConfmgrUrl.method,
            data:{
                configType: 0,
                devSN: g_strACSN,
                deviceModule: "CMDPROXY",
                echo: "1", //回显标示
                cmdProxy: "#",
                cfgTimeout: 120,
            }
        };
        $scope.byapData=false;
        $scope.btnStatus=false;
        $scope.modelIndex=false;
        
        
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
//userName:$scope.userInfo.user,
//nasId:$scope.sceneInfo.nasid,
        var map={
            set:function (a,key,value){
                    if(a[key]){
                        a[key]=a[key]+','+value;
                    }else{
                        a[key]=value;
                    }
                },
            get:function(a,key){
                if(a[key].indexOf(',')==-1){
                    return a[key]
                }else{
                    return a[key].split(',');
                }
            }    
        }

        // var allDevSnList = [];  //  所有的SN
        // $scope.aliasList = []; //  所以的Alias
        // $scope.aliasObj = {};
        // $scope.devSnList = [];
        // $scope.devSnObj = {};
        // $http.get(sprintf(URL_GET_DEV_LIST, $scope.sceneInfo.nasid))
        //     .success(function (data) {  
        //         if (data.data && data.code == "0") {
        //             // 别名下拉框
        //             // data.data
        //             $.each(data.data, function (i, d) {
        //                 $.each(d.devices, function (j, dev) {
        //                     $scope.aliasList.push(dev.devAlias);
        //                     if (!$scope.aliasObj[dev.devAlias]) {
        //                         $scope.aliasObj[dev.devAlias] = [];
        //                     }
        //                     $scope.aliasObj[dev.devAlias].push(dev.devSn);
        //                     $scope.devSnList.push(dev.devSn);
        //                     $scope.devSnObj[dev.devSn] = dev.devAlias;
        //                 });
        //             });
        //             allDevSnList = [].concat($scope.devSnList);
        //         } else {
        //             FRAME.noticeDanger(data.message);
        //         }
        //     })

        //     .error(function(){
        //         FRAME.noticeDanger(getRcString('retry'));
        // });

        // /**
        //  *  设置SN
        //  * @param flag  时候有Alias
        //  * @return {Function}
        //  */
        // function setSnValue(flag) { 
        //     return function () {
        //         $scope.$broadcast('val#alimsO', function (v) { 
        //             $scope.devSnList = flag ? [].concat($scope.aliasObj[v]) : [].concat(allDevSnList);

        //             if($scope.devSnList.length==1){
        //                 $timeout(function () {
        //                     $scope.apData = $scope.devSnList[0];   
        //                     //$scope.btnStatus=false;
        //                     g_strACSN=$scope.apData;
        //                     g_oCommandLine.data.devSN=$scope.apData; 
        //                     httpSendMsg(g_oCommandLine, setCmdView);
        //                 // $scope.$broadcast('val#apDataO', [$scope.devSnList[0]]);
        //                 });        
        //             }   
        //         });
        //     };
        // }

        // function setAliasValue() {
        //     $scope.$broadcast('val#apDataO', function (v) {
        //         $scope.$broadcast('val#alimsO', [$scope.devSnObj[v]]);
        //     });
        //     //$scope.btnStatus=false;    
        //     g_strACSN=$scope.apData;
        //     g_oCommandLine.data.devSN=$scope.apData;
        //     httpSendMsg(g_oCommandLine, setCmdView);
        // }

        // $scope.$on('select2:select#alimsO', setSnValue(true));
        // $scope.$on('select2:unselect#alimsO', setSnValue(false));
        // $scope.$on('select2:select#apDataO', setAliasValue);
        // $scope.$on('select2:unselect#apDataO', setAliasValue);

    
        // $scope.$watch('apData',function(){
        //     if($scope.apData){
        //         $scope.byapData=true;
        //         $scope.modelIndex=true;
        //     }else{
        //         $scope.byapData=false;
        //         $scope.modelIndex=false;
        //     }
        // });
        $http.get(sprintf(URL_GET_DEV_LIST, $scope.sceneInfo.nasid))
            .success(function (data) {
                if((data.code==0)&&(data.data[0].devices)){
                    $.each(data.data[0].devices,function(i,value){
                        $scope.devSnList.push(value.devAlias);
                        deviseDevData[value.devAlias]=value.devSn;
                    });
                }else{
                   FRAME.noticeDanger(getRcString('retry')); 
                } 
            })
            .error(function(){
                FRAME.noticeDanger(getRcString('retry'));
        });
        $scope.$on('select2:select#devSnSelct',getDevSn);
        $scope.$watch('dev',function(){
            if($scope.dev){
                $scope.byapData=true;
                $scope.modelIndex=true;
            }else{
                $scope.byapData=false;
                $scope.modelIndex=false;
            }
        });
        $scope.showWarning = function () {
            $scope.b_warning_show = !$scope.b_warning_show;
        }
        //开关，点击时触发此方法
        $scope.drsValueChange = function (a) {
            if(a){

            }else{
                $scope.drsValueIsEnable = !$scope.drsValueIsEnable; 
                $state.go("scene.content.maintenance.telnet9");
            }           
        };
        $scope.showCmd = function(strInfoFlag) {
            switch(strInfoFlag) {
                case "baseInfo": {
                    $scope.baseInfo = !$scope.baseInfo;
                    $scope.networkInfo = false;
                    $scope.monitorInfo = false;
                    break;
                }
                case "networkInfo": {
                    $scope.baseInfo = false;
                    $scope.networkInfo = !$scope.networkInfo;
                    $scope.monitorInfo = false;
                    break;
                }
                case "monitorInfo": {
                    $scope.baseInfo = false;
                    $scope.networkInfo = false;
                    $scope.monitorInfo = !$scope.monitorInfo;
                    break;
                }
                default: {
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
        function getDevSn(){
            //var a=$scope.dev;
            g_history=[];
            clearInterval(g_handle);
            g_handle=0;
            var sn=deviseDevData[$scope.dev];
            g_strACSN=sn;
            g_oCommandLine.data.devSN=sn;
            g_oCommandLine.data.cmdProxy="#";
            g_allCmds=[];
            $("#command_line").html(commHtml);
            httpSendMsg(g_oCommandLine, setCmdView);
        }
        function getRcString(attrName){
            return Utils.getRcString("commandline_rc",attrName);
        }

        function timeout() {
            function timeCallback() {
                if(g_count == 0) {
                    $("#command_line").append('<br/><span class="col-xs-12">.</span>');
                    $("#command_line").parent().scrollTop(document.getElementById("command_line").scrollHeight);
                }
                else {
                    $("#command_line span:last").append('.');
                }

                g_count++;
                if(g_count == 55) {
                    g_count = 0;
                }
            }
            g_handle = setInterval(timeCallback, 1000);
        }

        function addToHistory(strCmd) {
            if(strCmd != "#") {
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

            if(reg2.test(sViewName) || reg1.test(sViewName) || (sViewName == "#") || (sViewName == "*") ) {
                return true;
            }

            return false;
        }

        function showMsg(sData) {
            try {
                if(sData.length) {
                    var reg = /\r/g;
                    sData = sData.replace(reg, "");
                    sData = sData.replace(/ /g, '&nbsp;');
                    sData = sData.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
                    var aCmdLine = sData.split("\n");
                    while ((aCmdLine[aCmdLine.length - 1] == "\n") || !aCmdLine[aCmdLine.length - 1] ||
                    (aCmdLine[aCmdLine.length - 1] == aCmdLine[aCmdLine.length - 2]) ||
                    (aCmdLine[aCmdLine.length - 1] == "") || (aCmdLine[aCmdLine.length - 1] == "\r\n")) {
                        aCmdLine.pop();
                        if (!aCmdLine.length) {
                            break;
                        }
                    }

                    if(judgeResultViews(aCmdLine[aCmdLine.length - 1])) {
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
            }
            catch(e) {
                console.log("e",e);
            }
        }

        function checkQuit() {
            var sCmd = $("#command_line input:last").val();
            var reg = /(^\s*)|(\s*$)/g;
            var regViews = /^<.*>$/;

            if(sCmd.indexOf("?") != -1) {
                afterSend();
                return true;
            }
            
            sCmd.replace(reg, sCmd);
            sCmd = $.trim(sCmd);

            if((regViews.test(g_CmdView)) && ((sCmd == "q") || (sCmd == "qu") || (sCmd == "qui") || (sCmd == "quit") || (sCmd == "bash") || (sCmd == "bas"))) {
                afterSend();
                return true;
            }

            if( sCmd == "") {
                afterSend();
                return true;
            }

            return false;
        }

        function receiveMsg(aData) {
            if(aData && (aData.communicateResult == "success")) {
                showMsg(aData.echoInfo);
                afterSend();
            }
            else { 
                finishClock();
                $("#command_line").append("<div><span>Could not connect to device!</span></div>");
                afterSend();
            }
        }

        function sendcmd() {
            var sCommand = $("#command_line input:last").val(); 

            if(sCommand) {
                g_oCommandLine.data.cmdProxy = sCommand;
            }
            else {
                g_oCommandLine.data.cmdProxy = "#";
            }

            httpSendMsg(g_oCommandLine, receiveMsg);
        }

        function sendAllCmd(adata) {  
            if(g_allCmds.length) { 
                if(adata) {
                    receiveMsg(adata);
                }
                else { 
                    if($("#command_line input:last:disabled").length) { 
                        return;
                    }
                } 
                var cmdOfSend = g_allCmds.shift();
                g_oCommandLine.data.cmdProxy = cmdOfSend;
                $("#command_line input:last").val(cmdOfSend);
                $("#command_line input:last").unbind().attr({disabled:"disabled"});

                if(checkQuit()) {
                    sendAllCmd();
                    return;
                }

                httpSendMsg(g_oCommandLine, receiveMsg);
            }
            else if(adata){
                receiveMsg(adata);
            }
        }

        $scope.mouseEvent = function(strTmp) {
            if("down" == strTmp) {
                g_date1 = new Date();
            }
            else {
                g_date2 = new Date();

                if(g_date2 - g_date1 < 200) {
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
            if(g_handle != 0) {
                finishClock();
            }
            g_oCommandLine.data.cmdProxy = command;
            httpSendMsg(g_oCommandLine, receiveMsg);
        }

        function keyUpEvent(event) {
            var nKey = event.keyCode;

            switch (nKey) {
                case 9: {
                    break;
                }
                case 13: {
                    $("#command_line input:last").unbind().attr({disabled:"disabled"});
                    if(!checkQuit()) {
                        sendcmd();
                    }
                    break;
                }
                case 38: {
                    if(g_history.length && (g_currentPointer > 0)) {
                        g_currentPointer--;
                        $("#command_line input:last").val(g_history[g_currentPointer]);
                    }
                    break;
                }
                case 40: {
                    if(g_history.length && (g_currentPointer < g_history.length - 1)) {
                        g_currentPointer++;
                        $("#command_line input:last").val(g_history[g_currentPointer]);
                    }
                    break;
                } 
            }
        }

        $("#window_command").delegate("#command_line input:last", "keyup", function(e) {
            keyUpEvent(e);
        });

        function afterSend() {
            var newDiv = g_input.children().first().text(g_CmdView);
            g_input.children().last().removeAttr("disabled");
            $("#command_line").append(g_input.clone());
            $("#mine_field").delegate(" .mine",'click',function(){});
            $("#command_line input:last")[0].focus();
        }

        function setCmdView(oData) {
            if(oData && (oData.communicateResult == "success")) {

                $("#command_line label:first").text("Connect to device success!");
                showMsg(oData.echoInfo);
                afterSend();
            }
            else {
                $("#command_line label:first").text("Could not connect to device!");
                $("#command_line input:first").unbind().attr({disabled:"disabled"});
            }
        }

        function httpSendMsg(oMsg, oSuccess) { 
            addToHistory(oMsg.data.cmdProxy);
            $http({
                url: oMsg.url, 
                method: oMsg.method,
                data: oMsg.data
            }).success(function(data,header,config,status) {  
                if(g_handle != 0) {
                    finishClock();
                }
                oSuccess(data);
            }).error(function(data,header,config,status) { 
                console.log("Show attack information list error!");
            });

            g_handle = setTimeout(timeout,3000);
        }

        function initdata() {
            g_oCommandLine.data.cmdProxy = "#";
            //httpSendMsg(g_oCommandLine, setCmdView);
        }

        function init() {
            g_input = $("#command_line input:last").parent().clone().css('background-color','#000');
            
            initdata();
            
            $("#command_line input:last")[0].focus();
        }

        init();
    }];
});