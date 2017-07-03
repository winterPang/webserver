(function ($) {
    
    var MODULE_NAME = "x_networkcfg.index";
    var g_sShopName = null;
    var g_signalLevel = 1;
    var g_wifiTime = null;
    var g_hInterval = null;

    var g_jWeChartAccountList = null;
    var g_jShopNameList = null;
    var g_oMiniBeiSsidCfg = null;
    var g_oMiniBetAuthCfg = null;
    var g_radio1open = 1;
    var g_radiostatus = null;
    var g_logObj = {};
    var hPending = null;
    var bHasNotBug = true;
     var compareAry = [];
    var old_ssid_list = [];
    var g_onLine = [];//存储在线下发失败的设备
    var flag= null;//为空就是第一次下发，否则就是再次下发失败的设备
    var g_appId = null;
    var g_devsn = [];
    var g_appSecret = null;
    var   ssid ;
    var urlFlag;
    var wifishoplist;
    var g_shopId; 
    function initserverAdress(){
        var ajax = {
            type: 'POST',
            url: MyConfig.path + "/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                "configType": 1,
                "sceneFlag": "true",
                "policy": "cloudFirst",
                "userName": FrameInfo.g_user.user,
                "shopName": g_sShopName,
                "nasId": FrameInfo.Nasid,
                "cfgTimeout": 120,
                "cloudModule": "xiaoxiaobeicfg",
                "deviceModule": "xiaoxiaobei",
                "method": "getAuthGlobalCfg",
                "param": [{
                    switch:"2",
                    nasId: FrameInfo.Nasid
                }]
            }),
            onSuccess: function(data){
                if ("result" in data && data.result instanceof Array){
                    document.getElementById("serverAdress").innerHTML = "<span>" + data.result[1].authHostname+"</span>";
                }
                else {
                    document.getElementById("serverAdress").innerHTML = "<span>" + N/A+"</span>";
                }
            },
            onFailed: function(data){
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(ajax);
    }
    /*服务器认证*/
    function testUrl(){
        $("#serverConform").attr('disabled','true');
       var name = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
       $("#serverCfg").keyup(function(){
           var  hostname=$("#serverCfg").val();
           var  hostnames =$("#serverAdress").text();
           if(hostname !=""){
               $("#serverNullTip").hide();
               if(name.test($("#serverCfg").val())){
                   if(hostname != hostnames){
                     $("#serverTip").hide();
                     $("#serverNullTip").hide();
                     $("#serverRepeatTip").hide();
                     $('#serverConform').removeAttr("disabled"); 
                   }
                   else{
                     $("#serverRepeatTip").show();
                     $("#serverTip").hide();
                     $("#serverNullTip").hide();
                     $("#serverConform").attr('disabled','true');
                   }                
               }else{
                   $("#serverTip").show();
                   $("#serverNullTip").hide();
                   $("#serverRepeatTip").hide();
                   $("#serverConform").attr('disabled','true');
                   return;
               }
           }
           else{
               urlFlag=true;
               $("#serverTip").hide();
               $("#serverNullTip").show();
               $("#serverRepeatTip").hide();
               $("#serverConform").attr('disabled','true');
           }
       });
    }
    function serverConform(){
             $("#serverTip").hide();
             $("#serverNullTip").hide();
             $("#serverRepeatTip").hide();
             $("#serverConform").on("click", function(){
                var  hostname=$("#serverCfg").val();
                var  hostnames =$("#serverAdress").text();
                serverCfg(hostname);
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#server_diag")));
            });
    }
    function closeXX(){
        $("#serverClose").on("click", function(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#server_diag")));
        });
    }
    function serverCfg(hostname){
        hPending = Frame.Msg.pending(getRcText("MSG_PENDING").split(",")[0]);
        if(flag=== null){
            flag= serverCfg;
            flag.args = arguments;
            var ajax = {
                type: 'POST',
                url: MyConfig.path + "/ant/confmgr",
                contentType: "application/json",
                dataType: "json",
                timeout: 150000,
                data: JSON.stringify({
                    "configType": 0,
                    "sceneFlag": "true",
                    "policy": "cloudFirst",
                    scenceType:2,
                    "userName": FrameInfo.g_user.user,
                    "shopName": g_sShopName,
                    "nasId": FrameInfo.Nasid,
                    "cfgTimeout": 120,
                    "cloudModule": "xiaoxiaobeicfg",
                    "deviceModule": "xiaoxiaobei",
                    "method": "AuthGlobal",
                    "param": [{
                        switchType:"2",
                        authHostname:hostname,
                        nasId: FrameInfo.Nasid
                    }]
                }),
                onSuccess: function(data){
                    initserverAdress();
                    fCheckCfgRet(data);
                },
                onFailed: function(data){

                }
            }
        }
        else{
            var ajax = {
                type: 'POST',
                url: MyConfig.path + "/ant/confmgr",
                contentType: "application/json",
                dataType: "json",
                timeout: 150000,
                data: JSON.stringify({
                    "configType": 0,
                    "sceneFlag": "true",
                   //"policy": "cloudFirst",
                    "devSN":g_onLine,
                    "scenceType":2,
                    "userName": FrameInfo.g_user.user,
                    "shopName": g_sShopName,
                    "nasId": FrameInfo.Nasid,
                    "cfgTimeout": 120,
                    "cloudModule": "xiaoxiaobeicfg",
                    "deviceModule": "xiaoxiaobei",
                    "method": "AuthGlobal",
                    "param": [{
                        switchType:"2",
                        authHostname:hostname,
                        nasId: FrameInfo.Nasid
                    }]
                }),
                onSuccess: function(data){
                    initserverAdress();
                    fCheckCfgRet(data)
                    //console.log(data);
                },
                onFailed: function(data){

                }
            }
        }
        Utils.Request.sendRequest(ajax);
    }
    function fCheckCfgRet(data) {
        g_onLine=[];
        if(data.serviceResult =="success") {
            var aErrList = [];
            for (var i = 0; i < data.deviceResults.length; i++) {
                if (data.deviceResults[i].reason == "Failed to set cfg to device.") {
                    var devFailList ={
                        devSN:data.deviceResults[i].devSN
                    };
                    if(g_onLine.indexOf(data.deviceResults[i].devSN)==-1){
                        g_onLine.push(data.deviceResults[i].devSN);//不重复的设备序列号
                    }
                    //if(data.deviceResults[i].communicateResult=="success") {
                    //    devFailList.devState = getRcText("STATE").split(",")[0];
                    //}
                    //else{
                    //    devFailList.devState = getRcText("STATE").split(",")[1];
                    //}
                    aErrList.push(devFailList);
                }
            }
            if (aErrList.length == 0) {
                Frame.Msg.info(getRcText("SUCCESS"));
                flag = null;
            }
            else {
                getStatus(g_onLine,aErrList,function(aErrOpt){
                    hPending.close();
                    $("#failList").SList("refresh", aErrOpt);
                    setTimeout(function(){
                        Utils.Base.openDlg(null, {}, {scope:$("#failcfgDlg"),className:"modal-large"});
                    },500);
                });
            }
        }
        else{
            Frame.Msg.info(getRcText("MSG_INFO2").split(",")[0],"error");
            flag = null;
        }
        g_devsn = [];
        for(var i=0;i<data.deviceResults.length;i++){
            g_devsn.push(data.deviceResults[i].devSN);
        }
        hPending.close();
        return;
    }

    function getStatus(g_onLine,aErrList,callback){
        var getDevStatusOpt = {
            type:"POST",
            url:"/base/getDevs",
            dataType:"json",
            timeout: 150000,
            data:{
                cfgTimeout:120,
                devSN:g_onLine
            },
            onSuccess:function(data){
                for(var i=0;i<aErrList.length;i++){
                    for(var j=0;j<data.detail.length;j++){
                        if(aErrList[i].devSN==data.detail[j].devSN){
                            aErrList[i].devState=getRcText("STATE").split(",")[data.detail[i].status]
                        }
                    }
                }
                callback(aErrList);

            },
            onFailed:function(){
             hPending&&hPending.close();
                console.log(error);
            }
        };
        Utils.Request.sendRequest(getDevStatusOpt);
    }

    function failConform(){
        $("#failConform").on("click", function(){
            flag&&flag.apply(null,flag.args);
            //flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    function closeMadle(){
        $("#failClose").on("click", function(){
            //关闭dialog弹框,返回至主页面
            flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    function closeX(){
        $("#closeX").on("click", function(){
            //关闭dialog弹框,返回至主页面
            flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    //function  initForm(){
    //    $("#failshop_form").form("init", "edit", {
    //        "title": getRcText("FAIL_CFGLIST"),
    //        "btn_apply":{
    //            enable:true,
    //            action:function () {
    //                flag&&flag(flag.args);
    //                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#failshop_form")));
    //            }
    //        },
    //        "onClose": function(){
    //            flag=null;
    //        },
    //        "btn_cancel": function(){
    //            flag=null;
    //            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#failshop_form")));
    //        }
    //    });
    //}
    function initFailDevGrid() {
        var opt = {
            colNames: getRcText("DEV_LIST"),
            showOperation: false,
            multiSelect: false,
            search: false,
            sortable: false,
            pageSize: 5,
            colModel: [
                {name: 'devSN', datatype: "String"}, //business_name branch_name
                {name: 'devState', datatype: "String"}, //business_name branch_name
            ]
        };
        $("#failList").SList("head", opt);
        var opt = {
            colNames: getRcText("ID_LIST"),
            showOperation: false,
            multiSelect: false,
            search: false,
            sortable: false,
            pageSize: 10,
            colModel: [
                {name: 'freeUrl', datatype: "String"}

            ]
        };
        $("#whiteSlist").SList("head", opt);
    }

    /*获取云端URL*/
    function getWhiteUrl(callback){
        //$.ajax({
        //    url:MyConfig.path + "/ant/confmgr",
        //    type: "POST",
        //    dataType: "json",
        //    timeout: 150000,
        //    ContentType:"application/json",
        //    data:{
        //        "cfgTimeout":120,
        //        "cloudModule":"xiaoxiaobeicfg",
        //        "configType":1,
        //        "deviceModule":"xiaoxiaobei",
        //        "sceneFlag":true,
        //        "method":"getAuthGlobalCfg",
        //        "nasId":FrameInfo.Nasid,
        //        "userName":FrameInfo.g_user.user,
        //        "shopName":Utils.Device.deviceInfo.shop_name,
        //        "policy":"cloudFirst",
        //        "param":[{
        //            "switchType":"3",
        //            "nasId":FrameInfo.Nasid
        //        }]
        //    },
        //    success:function(data){
        //        callback(data.result.authWhiteList);
        //    },
        //    error:function(err){
        //        hPending&&hPending.close();
        //        Frame.Msg.info(getRcText("MSG_INFO2").split(",")[2], "error");//失败
        //    }
        //});
        var ajax={
            url:MyConfig.path + "/ant/confmgr",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            ContentType:"application/json",
            data:{
                "cfgTimeout":120,
                "cloudModule":"xiaoxiaobeicfg",
                "configType":1,
                "deviceModule":"xiaoxiaobei",
                "sceneFlag":true,
                "method":"getAuthGlobalCfg",
                "nasId":FrameInfo.Nasid,
                "userName":FrameInfo.g_user.user,
                "shopName":Utils.Device.deviceInfo.shop_name,
                "policy":"cloudFirst",
                "param":[{
                    "switchType":"3",
                    "nasId":FrameInfo.Nasid
                }]
            },
            success:function(data){
                callback(data.result.authWhiteList);
            },
            error:function(err){
                hPending&&hPending.close();
                Frame.Msg.info(getRcText("MSG_INFO2").split(",")[2], "error");//失败
            }
        };
        Utils.Request.sendRequest(ajax);
    }

    /*获取白名单列表*/
    function scanWhiteList(){
        getWhiteUrl(function(data){
            var whiteArr=[];
            for(var i=0;i<data.length;i++){
                var singleWhiteList={
                    "freeUrl":data[i].freeUrl
                }
                whiteArr.push(singleWhiteList);
            }
            $("#whiteSlist").SList("refresh", whiteArr);
            Utils.Base.openDlg(null, {}, {scope:$("#whiteOpl"),className:"modal-super"});
        });
    }
    function addLog(logstr, onSuccess, onFailed) {
        var ajax = {
            type: 'POST',
            url: MyConfig.path + "/ant/logmgr",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                devSN: g_devsn,
                scenarioId:FrameInfo.Nasid,
                module: "web",
                method: "addLog",
                level: "info",
                message: logstr
            }),
            onSuccess: onSuccess,
            onFailed: onFailed
        }

        Utils.Request.sendRequest(ajax);
    }

    function addModifyLog() {

        for (var i in g_logObj) {
            var g_logObjadt = g_logObj[i];
            addLog(g_logObjadt, function (data, textStatus, jqXHR) {
                try {
                    if (!('retCode' in data)) {
                        throw (new Error('retCode is null'));
                    }
                    if (data.retCode == 0) {
                        console.log("addlog success;");
                    } else {
                        console.log(data.message);
                    }
                }
                catch (error) {
                    console.log(error);
                }
                finally {
                    g_logObj = {};
                }
            });
        }
    }

    function MiniBeiSsidCfg() {
        this.name = 'hahah';
        this.sp_manage_00 = null;
        this.sp_visitor_01 = null;
        this.sp_visitor_02 = null;
        this.sp_visitor_03 = null;
    }

    MiniBeiSsidCfg.prototype.GetSsidCfg = function (suc) {
        var option = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                "configType": 1,
                "sceneFlag": "true",
                "sceneType": 2,
                "userName": FrameInfo.g_user.user,
                "shopName": g_sShopName,
                "cfgTimeout": 60,
                "cloudModule": "xiaoxiaobeicfg",
                "deviceModule": "xiaoxiaobei",
                "nasId": FrameInfo.Nasid,
                "method": "GetSsisCfg",
                "param": [{
                    "userName": FrameInfo.g_user.user,
                    "sceneName": g_sShopName,
                    "nasId": FrameInfo.Nasid
                }]
            }),
            onSuccess: function (data) {
                if (!("result" in data && data.result instanceof Array)) {
                    Frame.Msg.info(getRcText("MSG_INFO1").split(",")[0],"error");
                    // "获取无线配置失败"
                    return;//获取的数据格式错误
                }
                var self = g_oMiniBeiSsidCfg;
                var aSsidCfg = data.result;
                aSsidCfg.forEach(function (service) {
                    self[service.spName] = service;
                });

                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        };
        Utils.Request.sendRequest(option);
    }

    MiniBeiSsidCfg.prototype.UpdateSsidCfg = function (spName, suc) {
        hPending = Frame.Msg.pending(getRcText("MSG_PENDING").split(",")[0]);
        // "正在下发配置"
        var args = arguments;
        getPlatFormType(function(type){
            var self_get = g_oMiniBeiSsidCfg;
            if(type == 'fail'){
                hPending&&hPending.close();
                Frame.Msg.info(getRcText("MSG_INFO1").split(",")[1],'error');
                // "无法获取设备的模式"
                return;
            }
            var option = {};
            if(flag===null){
                flag= g_oMiniBeiSsidCfg.UpdateSsidCfg;
                flag.args = args;
                if (type == 1){
                    option = {
                        "configType": 0,
                        "sceneFlag": "true",
                        "sceneType": 2,
                        "userName": FrameInfo.g_user.user,
                        "shopName": g_sShopName,
                        "policy": "cloudFirst",
                        "cfgTimeout": 120,
                        "cloudModule": "xiaoxiaobeicfg",
                        "deviceModule": "xiaoxiaobei",
                        "nasId": FrameInfo.Nasid,
                        "method": "SSIDUpdate",
                        "param": [
                            self_get[spName]
                        ]
                    }
                }else{
                    option = {
                        "configType": 0,
                        "sceneFlag": "true",
                        "sceneType": 1,
                        "userName": FrameInfo.g_user.user,
                        "shopName": g_sShopName,
                        "policy": "cloudFirst",
                        "cfgTimeout": 120,
                        "cloudModule": "xiaoxiaobeicfg",
                        "deviceModule": "stamgr",
                        "nasId": FrameInfo.Nasid,
                        "method": "SSIDUpdate",
                        "param": [{
                            "userName":  self_get[spName].userName,
                            "sceneName": self_get[spName].sceneName,
                            'stName'      :  self_get[spName].spName,
                            'ssidName'    :   self_get[spName].ssidName,
                            'description':   "1",
                            'status'      :   self_get[spName].status,
                            'hideSSID'    :   self_get[spName].hideSSID,
                            'akmMode'     :   self_get[spName].akmMode,
                            'cipherSuite' :    20,//self_get[spName].cipherSuite,
                            'securityIE'  :    3,//self_get[spName].securityIE,
                            'psk'         :   self_get[spName].psk,
                            'nasId': FrameInfo.Nasid
                        }]
                    };
                }
            }
            else{
                if (type == 1){
                    option = {
                        "configType": 0,
                        "sceneFlag": "true",
                        "sceneType": 2,
                        "userName": FrameInfo.g_user.user,
                        "shopName": g_sShopName,
                       // "policy": "cloudFirst",
                        "devSN":g_onLine,
                        "cfgTimeout": 120,
                        "cloudModule": "xiaoxiaobeicfg",
                        "deviceModule": "xiaoxiaobei",
                        "nasId": FrameInfo.Nasid,
                        "method": "SSIDUpdate",
                        "param": [
                            self_get[spName]
                        ]
                    }
                }else{
                    option = {
                        "configType": 0,
                        "sceneFlag": "true",
                        "sceneType": 1,
                        "userName": FrameInfo.g_user.user,
                        "shopName": g_sShopName,
                        //"policy": "cloudFirst",
                        "devSN":g_onLine,
                        "cfgTimeout": 120,
                        "cloudModule": "xiaoxiaobeicfg",
                        "deviceModule": "stamgr",
                        "nasId": FrameInfo.Nasid,
                        "method": "SSIDUpdate",
                        "param": [{
                            "userName":  self_get[spName].userName,
                            "sceneName": self_get[spName].sceneName,
                            'stName'      :  self_get[spName].spName,
                            'ssidName'    :   self_get[spName].ssidName,
                            'description':   "1",
                            'status'      :   self_get[spName].status,
                            'hideSSID'    :   self_get[spName].hideSSID,
                            'akmMode'     :   self_get[spName].akmMode,
                            'cipherSuite' :    20,//self_get[spName].cipherSuite,
                            'securityIE'  :    3,//self_get[spName].securityIE,
                            'psk'         :   self_get[spName].psk,
                            'nasId': FrameInfo.Nasid
                        }]
                    };
                }
            }
            var ajax = {
                type: "POST",
                url: MyConfig.path + "/ant/confmgr",
                contentType: "application/json",
                dataType: "json",
                timeout: 150000,//2.5min timeout
                data: JSON.stringify(option),
                onSuccess: function (data) {
                    if (!('serviceResult' in data)) {
                        hPending&&hPending.close();
                        Frame.Msg.info(getRcText("MSG_INFO1").split(",")[2],'error');
                        // "数据格式错误"
                        return; //数据格式错误
                    }
                    var self = g_oMiniBeiSsidCfg;//这里 比较勉强  只能用全局变量
                    //if("serviceResult" in data && data.serviceResult == "success"){
                    //    var datasuc = [];
                    //    for(i=0;i<data.deviceResults.length;i++){
                    //        datasuc.push(data.deviceResults[i].communicateResult);
                    //    }
                    //    if(datasuc.join('').indexOf("fail") == -1 ){
                    //        hPending.close();
                    //        Frame.Msg.info(getRcText("SUCCESS"));
                    //    }
                    //    else{
                    //        Frame.Msg.info(getRcText("FAIL_INFO"),"error");
                    //        hPending.close();
                    //    }
                    //}
                    //else{
                    //    hPending.close();
                    //    Frame.Msg.info(getRcText("MSG_INFO2").split(",")[2],"error");//失败
                    //}
                    fCheckCfgRet(data);
                    suc && suc.call(self, data);
                },
                onFailed: function (err) {
                    hPending&&hPending.close();
                    Frame.Msg.info(getRcText("MSG_INFO2").split(",")[0],'error');
                    // "下发配置失败"
                    return;
                }
            };
            
            Utils.Request.sendRequest(ajax);
            
        });
        
        return this;
    }

    function MiniBeiAuthCfg() {
        this.name = 'hahah';
        this.authCfg = null;
        this.template = null;
        this.pubMng = null;
        this.oWeChartAccount = {};
    }
    
    MiniBeiAuthCfg.prototype.initTemplate = function ( ssid,suc) {
        var option = {
            type: 'POST',
            url: MyConfig.path + '/initserver',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 300000,
            data: JSON.stringify({
                Method: 'initTemplate',
                //ownerName: FrameInfo.g_user.user,
                ownerName: FrameInfo.g_user.attributes.name,
                shopName: g_sShopName,
                devSN: FrameInfo.ACSN,
                nasID: FrameInfo.Nasid,
                ssid:ssid
            }),
            onSuccess: function (data) {
                var self = g_oMiniBetAuthCfg;
                if (!('errorcode' in data && data.errorcode == 0)) {
                    suc && suc.call(self, "");
                    return self;
                }
                var template = data.data;
                self.authCfg = template.authCfgGson;
                self.authCfg.ownerName = FrameInfo.g_user.user;
                self.template = template.template;
                self.pubMng = template.pubMng;
                self.pubMng.ownerName = FrameInfo.g_user.user;
                self.pubMng.nasId=FrameInfo.Nasid;
                suc && suc.call(self, data);
                g_shopId = template.authCfgGson.shopId;
                return self;
            },
            onFailed: function (err) {
                suc && suc.call(self, "");
                return self;
                hPending&&hPending.close();
            }
        };
        Utils.Request.sendRequest(option);
        return this;
    }

    MiniBeiAuthCfg.prototype.getWeChartAccounts = function (suc) {
        var option = {
            type: "GET",
            url: MyConfig.v2path + '/weixinaccount/query?storeId=' + FrameInfo.Nasid,
            dataType: 'json',
            onSuccess: function (data) {
                if (!('errorcode' in data && data.errorcode == 0)) {
                    return;
                }
                if (!('data' in data && Array.isArray(data.data))) {
                    return;
                }
                var self = g_oMiniBetAuthCfg;

                var aAccounts = data.data;
                aAccounts.forEach(function (acc) {
                    self.oWeChartAccount[acc.name] = new WeCharAccount(acc);
                });

                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        };
        Utils.Request.sendRequest(option);
    }

    MiniBeiAuthCfg.prototype.modifyAuthSetting = function (sCurWeChartAcc,shopId,suc) {
        var self = this;
        var option = {
            __obj__: self,
            type: 'POST',
            url: MyConfig.v2path + '/authcfg/modifybyv3flag',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify(//self.authCfg
            //weixinAccountName:sCurWeChartAcc,
            $.extend({},self.authCfg,{
                accountName:sCurWeChartAcc,
                shopId:shopId,
                v3flag:3,
            })
            ),
            onSuccess: function (data) { 
                if (!('errorcode' in data && data.errorcode == 0)) {
                    return;
                }
                Frame.Msg.info(getRcText("MSG_INFO2").split(",")[1]);//成功
                // '配置下发成功'
                var self = this.__obj__;//原型  accredDlg
                suc && suc.call(self, data);
               // Utils.Pages.closeWindow(Utils.Pages.getWindow($("#acc")));
                Utils.Pages.closeWindow(Utils.Pages.getWindow( $(".modal-scrollable #accredDlg")));
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }

    MiniBeiAuthCfg.prototype.modifyPubMng = function (suc) {
        var self = this;
        var option = {
            __obj__: self,
            type: "POST",
            url: MyConfig.v2path + '/pubmng/modifybyv3flag',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify(self.pubMng),
            onSuccess: function (data) {
                if (!('errorcode' in data && data.errorcode == 0)) {
                    return;
                }
                var self = this.__obj__;
                suc && suc.call(self, data);
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#acc")));
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }

    function WeCharAccount(obj) {
        if (!(obj && obj instanceof Object)) {
            return;
        }
        for (var name in obj) {
            this[name] = obj[name];
        }
        this.nasid = Utils.Device.deviceInfo.nas_id;
        this.oShopList = {};
        this.cUsedShopName = "";
    }
    
    WeCharAccount.prototype.getShopListFromTencent = function (suc) { 
        var self = this;
        var option = {
            __obj__: this,
            type: 'POST',
            url: MyConfig.v2path + '/wifiShop/getShoplist',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                appId: self.appId,
                nasid:self.nasid,
                appSecret: self.appSecret,
                begin: 0,
                limit: 100
            }),
            onSuccess: function (data) {
                if (!('errcode' in data && data.errcode == 0)){ 
                    return ;
                }
                var self = this.__obj__;
                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }
    
    WeCharAccount.prototype.getWifiShopListFromTencent = function (suc) {
        var self = this;
        
        var option = {
            __obj__: this,
            type: 'POST',
            url: MyConfig.v2path + '/wifiShop/getWifishoplist',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                nasid: FrameInfo.Nasid,
                appId: self.appId,
                //appSecret: self.appSecret,
                //pageindex: 1,
                //pagesize: 2,
                isAll:1
            }),
            onSuccess: function (data) {
                if (!('errcode' in data && data.errcode == 0)){
                    suc && suc.call(self, "");
                    return ;
                }
                else
                {
                    var self = this.__obj__;
                    var shopList = data.data.records;
                    shopList.forEach(function (shop){
                        self.oShopList[shop.shop_name] = shop;
                    });
                    suc && suc.call(self, data);
                }

            },
            onFailed: function (data) {
                var self = this.__obj__;
                suc && suc.call(self, "");
                hPending&&hPending.close();
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }

    WeCharAccount.prototype.getQrCode = function (ssid,wifiShop,suc) {
        var self = this;
        var option = {
            __obj__: this,
            type: 'POST',
            url: MyConfig.v2path + '/wifiConn/getQrCode',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                nasid: FrameInfo.Nasid,
                appId: self.appId,
                //appSecret: self.appSecret,
                shop_id: wifiShop,
                ssid: ssid,
                img_id: 0// 这里 先随便选一个二维码 
            }),
            onSuccess: function (data) {
                if (!("errcode" in data && data.errcode == 0)){
                    data = "failed";
                }
                var self = this.__obj__;
                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }
    
    WeCharAccount.prototype.updateShopInfo = function (wifiShopName) {
        if (wifiShopName == undefined) {
            return ;
        }
        var self = this;
        var wifiShopInfo = self.oShopList[wifiShopName];
        this.saveWifiShopToLvzhou(wifiShopInfo,function (data){
                                    ;
            });
        // 保存并更新 门店的信息
        self.getShopListFromTencent(function (data) {
            var shopList = data.business_list;
            var self = this;
            //var wifiShopName = self.name;
            var currentShop = null;

            // 从微信公众平台获取到  选中的门店
            for (var i = 0, len = shopList.length; i < len; i++) {
                var shop = shopList[i];
                if (shop.base_info.business_name == wifiShopName){
                    currentShop = shop.base_info;
                    break;
                }
            }

            if (currentShop == null) {
                return ;
            }
        });
        self.getWifishopSecretkey(wifiShopInfo,ssid, function (data){
            var secretkey = data.data.secretkey;
            wifiShopInfo.secretkey = secretkey;
            self.getWifiShopListFromTencent(function (data) {
                for(var i= 0;i<data.data.records.length;i++){
                    var jShopNameList = $(".modal-scrollable #shop-list");
                    if(data.data.records[i].shop_name == jShopNameList.val()){
                    var  shop_id = data.data.records[i].shop_id;
                    this.queryShopInfofromLvzhou(shop_id,function(data){
                        var oSign=false;
                        var shopSsidList = JSON.parse(data.data.ssid_list_json);
                        if(shopSsidList.length<99){
                            if(data != null){
                                oSign=true;
                                this.updateWifishopToLvzhou(wifiShopInfo,ssid,function (data){
                                            ;
                                });
                            }
                            if(!oSign){
                                this.saveWifiShopToLvzhou(wifiShopInfo,function (data){
                                    ;
                                });
                            }
                        }
                        else{
                            self.cleanWifishopToTencent(wifiShopInfo,ssid, function (data){
                                if( data.errcode != 0){
                                   
                                   return; 
                                }
                            });
                            this.deleteWifiShopFromLvzhou(wifiShopInfo, function(result){
                                this.saveWifiShopToLvzhou(wifiShopInfo,ssid, function (data){
                                        ;
                                });
                            });
                        }
                    });
                    }
                }
            })
        });
        }
    WeCharAccount.prototype.queryShopFromLvzhou = function (shopInfo, suc) { 
        var self = this;
        var option = {
            __obj__: this,
            type: 'POST',
            url: MyConfig.v2path + '/wifiShopDb/queryShop',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                appId: self.appId,
                //appSecret: self.appSecret,
                nasid: self.nasid,
                poi_id: shopInfo.poi_id,
                sid: shopInfo.sid
            }),
            onSuccess: function (data) {
                if (!('errcode' in data && data.errcode == 0)){
                    return ;
                }
                
                var self = this.__obj__;
                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }
    $('#frame_msg_pending').css('display','none');
    WeCharAccount.prototype.saveShopToLvzhou = function (shopInfo, suc) {  
        var self = this;
        var option = {
            __obj__: this,
            type: 'POST',
            url: MyConfig.v2path + '/wifiShopDb/saveShop',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                appId: self.appId,
                // sid:shopInfo.sid,
                appSecret: self.appSecret,
                nasid: self.nasid,
                base_info: shopInfo
            }),
            onSuccess: function (data){
                if (!("errcode" in data && data.errcode == 0)){
                    return;
                }
                
                var self = this.__obj__;
                
                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }
    
    WeCharAccount.prototype.deleteShopFromLvzhou = function (shopInfo, suc) {
        var self = this;
        var option = {
            __obj__: this,
            type: 'POST',
            url: MyConfig.v2path + '/wifiShopDb/deleteShop',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                appId: self.appId,
                appSecret: self.appSecret,
                nasid: self.nasid,
                poi_id: shopInfo.poi_id,
                sid: shopInfo.poi_id
            }),
            onSuccess: function (data){
                if (!("errcode" in data && data.errcode == 0)){
                    return;
                }
                
                var self = this.__obj__;
                
                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }
    //WeCharAccount.prototype.updateShopToLvzhou = function (shopInfo, suc) {
    //    var self = this;
    //    var option = {
    //        __obj__: self,
    //        type: 'POST',
    //        url: MyConfig.v2path + '/wifiShopDb/updateWifiShop',
    //        contentType: 'application/json',
    //        dataType: 'json',
    //        timeout: 150000,
    //        data: JSON.stringify({
    //            appId: self.appId,
    //            appSecret: self.appSecret,
    //            nasid: self.nasid,
    //            update_info: shopInfo
    //        }),
    //        onSuccess: function (data) {
    //            if (!("errcode" in data && data.errcode == 0)){
    //                return;
    //            }
    //
    //            var self = this.__obj__;
    //
    //            suc && suc.call(self, data);
    //        },
    //        onFailed: function (err) {
    //            hPending&&hPending.close();
    //            return;
    //        }
    //    }
    //    Utils.Request.sendRequest(option);
    //    return this;
    //}
    WeCharAccount.prototype.updateShopToLvzhou = function (shopInfo, suc) {
        var self = this;
        var option = {
            __obj__: self,
            type: 'POST',
            url: MyConfig.v2path + '/wifiShopDb/updateShop',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                appId: self.appId,
                appSecret: self.appSecret,
                nasid: self.nasid,
                update_info: shopInfo
            }),
            onSuccess: function (data) {
                if (!("errcode" in data && data.errcode == 0)){
                    return;
                }

                var self = this.__obj__;

                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }
    
    WeCharAccount.prototype.updateWifishopToTencent = function (wifiShop, suc) {
                var self = this;
                var option = {
                    __obj__: this,
                    type: 'POST',
                    url: MyConfig.v2path + '/wifiShop/updateWifishop',
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout: 150000,
                    data: JSON.stringify({
                        "appId": self.appId,
                        "shop_id": wifiShop.shop_id,
                        "nasid":self.nasid,
                        "sid":wifiShop.sid,
                       // "ssid":ssid,
                        "old_ssid":old_ssid_list
                    }),
                    onSuccess: function (data) {
                        if (!('errcode' in data && data.errcode == 0)){
                            return ;
                        }
                        var self = this.__obj__;
                        suc && suc.call(self, data);
                    },
                    onFailed: function (err) {
                        hPending&&hPending.close();
                        return;
                    }
                }
                Utils.Request.sendRequest(option);
        return this;
    }
    WeCharAccount.prototype.updateWifishopToLvzhou = function (wifiShop,ssid, suc) {
        if(old_ssid_list.indexOf(ssid) == -1){
            old_ssid_list.push(ssid);
        }
        var self = this;
        var option = {
            __obj__: this,
            type: 'POST',
            url: MyConfig.v2path + '/wifiShopDb/updateWifiShop',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                "appId": self.appId,
               // "shop_id": wifiShop.shop_id,
                "nasid":self.nasid,
               // "sid":wifiShop.sid,
                //"ssid":ssid,
                //"ssid": compareAry[i],
                //"ssid_list":old_ssid_list,
                "update_data": {
                    "sid": "",
                    "shop_id": wifiShop.shop_id,
                   // "shop_name": "北京凯雅娜美容(北京凯亚娜美容上地店)",
                    //"ssid": "kaiyana-shangdi",
                    "password": "123456789",
                    "ssid_list":old_ssid_list,
                }

                }),
            onSuccess: function (data) {
                if (!('errcode' in data && data.errcode == 0)){
                    return ;
                }
                var self = this.__obj__;
                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }
    WeCharAccount.prototype.getWifishopSecretkey = function (wifiShop,ssid, suc) {
        var self = this;
        var option = {
            __obj__: this,
            type: 'POST',
            url: MyConfig.v2path + '/wifiShop/getWifishopSecretkey',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                appId: self.appId,
                nasid:self.nasid,
                appSecret: self.appSecret,
                shop_id: wifiShop.shop_id,
                ssid:ssid,
                reset: false
            }),
            onSuccess: function (data) {
                if (!('errcode' in data && data.errcode == 0)){
                    return ;
                }

                var self = this.__obj__;
                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }
    WeCharAccount.prototype.cleanWifishopToTencent = function (wifiShop, suc) {
       var self = this;
       var option = {
           __obj__: this,
           type: 'POST',
           url: MyConfig.v2path + '/wifiShop/cleanWifishop',
           contentType: 'application/json',
           dataType: 'json',
           data: JSON.stringify({
               appId: self.appId,
               nasid:self.nasid,
               //appSecret: self.appSecret,
               shop_id: wifiShop.shop_id
           }),
           onSuccess: function (data) {
               if (!('errcode' in data && data.errcode == 0)){
                   //  if (data.errcode == 45009)
                   // {
                   // hPending = Frame.Msg.pending(getRcText("CONFIGLIMIT").split(",")[0]);
                   // hPending.close();
                   //  return ;
                   // }
                   return ;
               }
               var self = this.__obj__;
               suc && suc.call(self, data);
           },
           onFailed: function (err) {
               hPending.close();
               return;
           }
       }
       Utils.Request.sendRequest(option);
       return this;
    }


    
    WeCharAccount.prototype.getWifiShopListfromLvzhou = function (weixinAccountName,suc) {
        if(g_shopId == undefined){
            return;
        }
        var self = this;
        var option = {
            __obj__: self,
            type: 'GET',
            url:MyConfig.v2path + "/wifiShopDb/queryshopinfobyshopid?shopId="+g_shopId+"&nasId="+self.nasid,
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            // data: JSON.stringify({
            //     shop_id:self.shop_id,
            //     nasid: self.nasid
            // }),
            onSuccess: function (data) {
                if (!("errcode" in data && data.errcode == 0)){
                    suc && suc.call(self, "");
                    return ;
                }else if(data == ""){
                    suc && suc.call(self, []);
                    return ;
                }
                
                var self = this.__obj__;
                var shop = data.data;
                self.cUsedShopName = shop.shop_name;
                self.shopId = shop.shop_id;
                suc && suc.call(self, shop);
                var shopArr = JSON.parse(shop.ssid_list_json); 
                for(var i = 0;i<shopArr.length;i++){
                   if(shopArr.ssid == ssid){
                    $("#qrcode").show();
                    return;
                   }
                }         
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;       
    }
    
    WeCharAccount.prototype.queryShopInfofromLvzhou = function (shop_id,suc) {
        var self = this;
        var option = {
            __obj__: self,
            type: 'GET',
            url:MyConfig.v2path + "/wifiShopDb/queryshopinfobyshopid?shopId="+shop_id+"&nasId="+self.nasid,
            //url:MyConfig.v2path + '/wifiShopDb/queryshopinfobyshopid',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            // data: JSON.stringify({
            //     shop_id:shop_id,
            //     nasid: self.nasid
            // }),
            onSuccess: function (data) {
                if (!("errcode" in data && data.errcode == 0)){
                    data = "";
                }
                if(data.datas && data.datas.length != 0){
                    g_appId = data.datas[0].appId;
                    g_appSecret = data.datas[0].appSecret;
                }
                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;       
    }
    
    
    WeCharAccount.prototype.queryWifiShopfromLvzhou = function (wifiShopInfo, suc) {
        var self = this;
        var option = {
            __obj__: self,
            type: 'POST',
            url:MyConfig.v2path + '/wifiShopDb/queryWifiShop',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                appId: self.appId,
                appSecret: self.appSecret,
                nasid: self.nasid,
                shop_id: wifiShopInfo.shop_id,
                sid: wifiShopInfo.sid
            }),
            onSuccess: function (data) {
                if (!("errcode" in data && data.errcode == 0)){
                    return ;
                }
                
                var self = this.__obj__;
                
                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;       
    }
    
    WeCharAccount.prototype.saveWifiShopToLvzhou = function (wifiShopInfo, suc) {
        var self = this;
        var option = {
            __obj__: self,
            type: 'POST',
            url: MyConfig.v2path + '/wifiShopDb/saveWifiShop',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                appId: self.appId,
                appSecret: self.appSecret,
                nasid: self.nasid,
                data: wifiShopInfo
            }),
            onSuccess: function (data){
                if (!("errcode" in data && data.errcode == 0)){
                    return ;
                }
                
                var self = this.__obj__;
                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }
    
    WeCharAccount.prototype.deleteWifiShopFromLvzhou = function (wifiShopInfo, suc) {
        var self = this;
        var option = {
            __obj__: self,
            type: 'POST',
            url: MyConfig.v2path +'/wifiShopDb/deleteWifiShop',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                appId:self.appId,
                appSecret:self.appSecret,
                nasid: self.nasid,
                shop_id: wifiShopInfo.shop_id,
                sid: wifiShopInfo.sid
            }),
            onSuccess: function (data) {
                if (!("errcode" in data && data.errcode == 0)){
                    return ;
                }
                
                var self = this.__obj__;
                
                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
        return this;
    }
    
    //WeCharAccount.prototype.updateWifiShopToLvzhou = function (wifiShopInfo, suc) {
    //    var self = this;
    //    var option = {
    //        __obj__: self,
    //        type: 'POST',
    //        url: MyConfig.v2path + '/wifiShopDb/updateWifiShop',
    //        contentType: 'application/json',
    //        dataType: 'json',
    //        timeout: 150000,
    //        data: JSON.stringify({
    //            appId: self.appId,
    //            appSecret: self.appSecret,
    //            nasid: self.nasid,
    //            update_data: wifiShopInfo
    //        }),
    //        onSuccess: function (data){
    //            if (!("errcode" in data && data.errcode == 0)){
    //                return ;
    //            }
    //
    //            var self = this.__obj__;
    //            suc && suc.call(self, data);
    //        },
    //        onFailed: function (err) {
    //            hPending&&hPending.close();
    //            return;
    //        }
    //    }
    //    Utils.Request.sendRequest(option);
    //    return this;
    //}
    
    WeCharAccount.prototype.getShopListFromLvzhou = function (suc) {
        var self = this;
        var option = {
            __obj__: this,
            type: 'POST',
            url: MyConfig.v2path + '/wifiShopDb/queryShopList',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                appId: self.appId,
                appSecret: self.appSecret,
                nasid: self.nasid
            }),
            onSuccess: function (data) {
                if (!('errcode' in data && data.errcode == 0)) {
                    return;
                }

                if (!('base_infos' in data && Array.isArray(data.base_infos))) {
                    return;
                }
                var self = this.__obj__;

                shoplist = data.base_infos;
                shoplist.forEach(function (shop) {
                    self.oShopList[shop.business_name] = shop;
                });

                suc && suc.call(self, data);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(option);
    }
    
    function getSignalLevel(suc){
        var option = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                "configType": 1,
                "sceneFlag": "true",
                "sceneType": 2,
                "userName": FrameInfo.g_user.user,
                "shopName": g_sShopName,
                "nasId": FrameInfo.Nasid,
                "cfgTimeout": 60,
                "cloudModule": "xiaoxiaobeicfg",
                "deviceModule": "xiaoxiaobei",
                "method": "GetPowerLevel",
                "param": [{
                    "userName": FrameInfo.g_user.user,
                    "sceneName": g_sShopName,
                    "nasId": FrameInfo.Nasid
                }]
            }),
            onSuccess: function (data) {
                // if (!('errorcode' in data && data.errorcode == 0)) {
                //     return;
                // }
                var res = data.result.powerLevel;

                suc && suc.call(this, res);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        };
        Utils.Request.sendRequest(option);
        return this;
    }
    
    function updateSignalLevel(level) {

        hPending = Frame.Msg.pending(getRcText("MSG_PENDING").split(",")[1]);
        // "正在更新信号强度"
        if(flag===null){
            flag= updateSignalLevel;
            flag.args = arguments;
            var option = {
                type: 'POST',
                url: MyConfig.path + '/ant/confmgr',
                contentType: 'application/json',
                dataType: 'json',
                timeout: 150000,
                data: JSON.stringify({
                    devSN: FrameInfo.ACSN,
                    cloudModule: 'xiaoxiaobeicfg',
                    deviceModule: "xiaoxiaobei",
                    method: "PowerLevel",
                    userName: FrameInfo.g_user.user,
                    nasId: FrameInfo.Nasid,
                    shopName: g_sShopName,
                    sceneFlag: "true",
                    policy: "cloudFirst",
                    configType: 0,
                    cfgTimeout: 120,
                    param: [{
                        "userName": FrameInfo.g_user.user,
                        "sceneName": g_sShopName,
                        "radio": 1,
                        "nasId": FrameInfo.Nasid,
                        "powerLevel": level
                    }],
                }),
                onSuccess: function (data) {
                    fCheckCfgRet(data);
                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#sign")));
                    setSignalText(level);
                },
                onFailed: function (err) {
                    hPending&&hPending.close();
                    Frame.Msg.info(getRcText("MSG_INFO2").split(",")[2], "error");
                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#sign")));
                    return;
                }

            };
        }
        else{
            var option = {
                type: 'POST',
                url: MyConfig.path + '/ant/confmgr',
                contentType: 'application/json',
                dataType: 'json',
                timeout: 150000,
                data: JSON.stringify({
                    devSN: FrameInfo.ACSN,
                    cloudModule: 'xiaoxiaobeicfg',
                    deviceModule: "xiaoxiaobei",
                    method: "PowerLevel",
                    userName: FrameInfo.g_user.user,
                    nasId: FrameInfo.Nasid,
                    shopName: g_sShopName,
                    sceneFlag: "true",
                    //policy: "cloudFirst",
                    devSN:g_onLine,
                    configType: 0,
                    cfgTimeout: 120,
                    param: [{
                        "userName": FrameInfo.g_user.user,
                        "sceneName": g_sShopName,
                        "radio": 1,
                        "nasId": FrameInfo.Nasid,
                        "powerLevel": level
                    }],
                }),
                onSuccess: function (data) {
                    fCheckCfgRet(data);
                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#sign")));
                    setSignalText(level);
                },
                onFailed: function (err) {
                    hPending&&hPending.close();
                    Frame.Msg.info(getRcText("MSG_INFO2").split(",")[2], "error");
                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#sign")));
                    return;
                }

            };
        }

        Utils.Request.sendRequest(option);
        return this;
    }

    function getWifiTime(suc){
        var option = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                nasId: FrameInfo.Nasid,
                cfgTimeout: 120,
                cloudModule: 'xiaoxiaobeicfg',
                deviceModule: "xiaoxiaobei",
                method: "GetWiFiTimer",
                configType :1,
                param: [{
                    "userName": FrameInfo.g_user.user,
                    "nasId": FrameInfo.Nasid,
                    "sceneName": g_sShopName
                }],
            }),
            onSuccess: function (data) {
                // if (!('errorcode' in data && data.errorcode == 0)) {
                //     return;
                // }
                var res = data.result;

                suc && suc.call(this, res);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        };
        Utils.Request.sendRequest(option);
        return this;
    }
    
    function updateWifiTime(enable, starth, startm, stoph, stopm){
        hPending = Frame.Msg.pending(getRcText("MSG_PENDING").split(",")[2]);
        // "正在更新定时Wi-Fi信息"
        if(flag===null){
            flag= updateWifiTime;
            flag.args = arguments;
            var option = {
                type: 'POST',
                url: MyConfig.path + '/ant/confmgr',
                contentType: 'application/json',
                dataType: 'json',
                timeout: 150000,
                data: JSON.stringify({
                    devSN: FrameInfo.ACSN,
                    cloudModule: 'xiaoxiaobeicfg',
                    deviceModule: "xiaoxiaobei",
                    method: "WiFiTimerUpdate",
                    userName: FrameInfo.g_user.user,
                    nasId: FrameInfo.Nasid,
                    shopName: g_sShopName,
                    sceneFlag: "true",
                    policy: "cloudFirst",
                    configType :0,
                    cfgTimeout: 120,
                    param: [{
                        "userName": FrameInfo.g_user.user,
                        "sceneName": g_sShopName,
                        "enable":enable,
                        "starth":starth,
                        "startm":startm,
                        "stoph":stoph,
                        "stopm":stopm,
                        "nasId": FrameInfo.Nasid,
                        "period":"11111111"
                    }],
                }),
                onSuccess: function (data) {
                    fCheckCfgRet(data);
                    g_wifiTime = {'enable':enable, 'starth':starth, 'startm':startm, 'stoph':stoph, 'stopm':stopm};
                },
                onFailed: function (err) {
                    hPending&&hPending.close();
                    Frame.Msg.info(getRcText("MSG_INFO2").split(",")[2], "error");//失败
                    // '配置下发失败'
                    return;
                }
            };
        }
        else{
            var option = {
                type: 'POST',
                url: MyConfig.path + '/ant/confmgr',
                contentType: 'application/json',
                dataType: 'json',
                timeout: 150000,
                data: JSON.stringify({
                   // devSN: FrameInfo.ACSN,
                    cloudModule: 'xiaoxiaobeicfg',
                    deviceModule: "xiaoxiaobei",
                    method: "WiFiTimerUpdate",
                    userName: FrameInfo.g_user.user,
                    nasId: FrameInfo.Nasid,
                    shopName: g_sShopName,
                    sceneFlag: "true",
                    //policy: "cloudFirst",
                    devSN:g_onLine,
                    configType :0,
                    cfgTimeout: 120,
                    param: [{
                        "userName": FrameInfo.g_user.user,
                        "sceneName": g_sShopName,
                        "enable":enable,
                        "starth":starth,
                        "startm":startm,
                        "stoph":stoph,
                        "stopm":stopm,
                        "nasId": FrameInfo.Nasid,
                        "period":"11111111"
                    }],
                }),
                onSuccess: function (data) {
                    fCheckCfgRet(data);
                    g_wifiTime = {'enable':enable, 'starth':starth, 'startm':startm, 'stoph':stoph, 'stopm':stopm};
                },
                onFailed: function (err) {
                    hPending&&hPending.close();
                    Frame.Msg.info(getRcText("MSG_INFO2").split(",")[2], "error");//失败
                    // '配置下发失败'
                    return;
                }
            };
        }
        Utils.Request.sendRequest(option);
        return this;
    }

    //这里不想写插件  所以就先这样实现 到时候调用 call 或 apply 
    function toggleButton() {
        var self = this;
        if (self.hasClass("open")) {
            self.removeClass("open")
                .parents(("div[id][class='detail-content']"))
                .find(".bg-img").removeClass("wifi-open").addClass("wifi-close");
            //if (g_radiostatus == false)
            //{
            //    self.parents(("div[id][class='detail-content']"))
            //        .find(".bg-img").removeClass("wifi-open").addClass("wifi-close");
            //}
        }
        else {
            self.addClass("open")
            //if (g_radiostatus == true)
            //{
                self.parents(("div[id][class='detail-content']"))
                .find(".bg-img").removeClass("wifi-close").addClass("wifi-open");
           // }
        }
    }

    function setButtonStatus(status) {
        var self = this;
        if (status == "open" && !self.hasClass("open")) {
            toggleButton.call(self);
        }
        else if (status == "close" && self.hasClass("open")) {
            toggleButton.call(self);
        }
    }

    function getRcText(sRcName) {
        return Utils.Base.getRcString("index_rc", sRcName);
    }

    function setSignalText(data){
        
        var signalText = getRcText("SINGAL_TEXT").split(",")[0];
        // "穿墙"
        g_signalLevel = data;
        
        if(g_signalLevel == 1){
            signalText = getRcText("SINGAL_TEXT").split(",")[1];
            // "健康"
        }else if(g_signalLevel == 2){
            signalText = getRcText("SINGAL_TEXT").split(",")[2];
            // "均衡"
        }
        
        document.getElementById("signalStrength").innerHTML = "<span style='color:#dd716b'>" + signalText+"</span>";
    }
    
    function setWifiText(data){
        //g_wifiTime = data;
        
        var wifiContent = getRcText("WIFI_CONTENT").split(",")[0];
        // "当前处于wifi关闭时间"
        var wifiStatus = getRcText("WIFI_STATUS").split(",")[0];
        // "未启用"
        var curTime = new Date();
        var startTime = parseInt(g_wifiTime.starth)*60 + parseInt(g_wifiTime.startm);
        var endTime = parseInt(g_wifiTime.stoph)*60 + parseInt(g_wifiTime.stopm);
        var cTime = curTime.getHours()*60 + curTime.getMinutes();
        
        if (startTime >= endTime){
            endTime += 1440;
        }
        
        if (cTime <startTime){
            cTime += 1440;
        }
        
        if ((cTime >= startTime) && (cTime <= endTime)){
            wifiContent = getRcText("WIFI_CONTENT").split(",")[1];
            // "当前处于wifi开启时间"
        }
        
        if(g_wifiTime.enable == 1){
            wifiStatus = getRcText("WIFI_STATUS").split(",")[1];
            // "启用"
        }else{
            wifiContent = "";
        }
        
        document.getElementById("wifitext").innerHTML = wifiContent;
        document.getElementById("wifiTime").innerHTML = ""+getRcText("HTML_STR").split(",")[0]+"[<span style='color:#dd716b'>" + wifiStatus+"</span>]";
    // 定时Wi-Fi
}
    
    function initShopListShow(weixinAccountName){
        
       //hPending = Frame.Msg.pending(getRcText("MSG_PENDING1").split(",")[0]);
        // "正在获取微信门店列表"
        
        g_jWeChartAccountList.val(weixinAccountName);
        var wechartAcc = g_oMiniBetAuthCfg.oWeChartAccount[weixinAccountName];
        wechartAcc.getWifiShopListFromTencent(function (data) {
            var self = this;
            var dom = [];
            
            if (data == ""){
                hPending&&hPending.close();
                Frame.Msg.info(getRcText("MSG_INFO3").split(",")[0], 'error');
                // "获取微信门店列表失败"
                $("#qrcode").hide();
                g_jShopNameList.empty();
                bHasNotBug = false;
                return;
            }
            
            for (var shop in self.oShopList) {
                dom.push('<option>' + shop + '</option>');
            }
            g_jShopNameList.empty().append(dom.join(''));

            wechartAcc.getWifiShopListfromLvzhou(weixinAccountName, function(data){
                var self = this;
                var nCurNum = 0;
                
                if (data === ""){
                    hPending&&hPending.close();
                    Frame.Msg.info(getRcText("MSG_INFO3").split(",")[1], 'error');
                    // "无法获取当前门店信息，请重新配置"
                    g_jShopNameList.prepend("<option>"+getRcText("HTML_STR").split(",")[1]+"</option>");
                    // 请选择
                    g_jShopNameList.val(getRcText("SHOPNAMELIST_VAL").split(",")[0]);
                    // "请选择"
                    bHasNotBug = false;
                    return;
                }
                if(data.length === 0){
                    g_jShopNameList.prepend("<option>"+getRcText("HTML_STR").split(",")[1]+"</option>");
                    // 请选择
                    g_jShopNameList.val(getRcText("SHOPNAMELIST_VAL").split(",")[0]);
                    // "请选择"
                    bHasNotBug = false;
                    return;
                }
                bHasNotBug = true;
                g_jShopNameList.val(self.cUsedShopName);
                $("#qrcode").show();
                hPending&&hPending.close();
                //hPending = Frame.Msg.pending(getRcText("MSG_PENDING1").split(",")[1]);
                // "正在获取二维码"
                if (self.cUsedShopName == ""){
                    hPending&&hPending.close();
                   // Frame.Msg.info(getRcText("MSG_PENDING1").split(",")[3],"error");
                    g_jShopNameList.prepend("<option>"+getRcText("HTML_STR").split(",")[1]+"</option>");
                    // 请选择
                    g_jShopNameList.val(getRcText("SHOPNAMELIST_VAL").split(",")[0]);
                    $("#qrcode").hide();
                    return;
                }
                self.getQrCode(ssid,self.shopId, function (data) {
                    if (data != "failed") {
                        $("#qrcode" + " img").attr('src', data.data.qrcode_url);
                        $("#qrcode" + " span").text(ssid);
                        $("#qrcode" + " img").show();
                        $("#qrcode" + " span").show();
                    } else {
                        $("#qrcode" + " img").hide();
                        $("#qrcode" + " span").hide();
                    }
                    hPending && hPending.close();
                });
            });
            
        });
    }
    
    function getPlatFormType(callback) {
        var ajax = {
            type: 'POST',
            url: MyConfig.path + "/base/getDevPlatformType",
            contentType: "application/json",
            dataType: "json",
            timeout: 60000,
            data: JSON.stringify({
                devSN: FrameInfo.ACSN
            }),
            onSuccess: function (data) {
                if (data.retCode == 0){
                    callback(data.platformType);
                }else{
                    callback('fail');
                }
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                callback('fail');
            }
        }

        Utils.Request.sendRequest(ajax);
    }
    
    function initSsidCfg() {
        g_oMiniBeiSsidCfg = new MiniBeiSsidCfg();
        g_oMiniBeiSsidCfg.GetSsidCfg(function (data) {
            //配置
            var self = this;
            for (var spName in self) {
                var oSpName = self[spName];
                var jSpName = $("div[spName='" + spName + "']");
                jSpName.find(".ssidName").html(oSpName.ssidName);
                jSpName.find(".securityMode").html(getRcText("SECURITY_MODE").split(",")[oSpName.securityMode]);
                var jStatusBtn = jSpName.find(".status.openORclose");
                setButtonStatus.call(jStatusBtn, oSpName.status == 0 ? 'close' : 'open');
            }

            // 下发配置
            $(".detail-content .openORclose").click(function () {
                // if (this.id == "wifiBtn"){
                //     return;
                // }
                var jSelf = $(this);
                if (this.id == "roma"){
                    return;
                }
                if (this.id == "Radio_Config_Btn1"){
                    return;
                }
                if (this.id == "Radio_Config_Btn2"){
                    return;
                }
                var spName = jSelf.parents("div.detail-content").attr("spname");
                g_oMiniBeiSsidCfg[spName].status = jSelf.hasClass('open') ? 1 : 0;
                g_oMiniBeiSsidCfg.UpdateSsidCfg(spName, function (data) {

                    g_logObj.ssidStatuslog = getRcText("SSID_STATUS").split(",")[0] + jSelf.parents("div.detail-content").find('.ssidName').text() + getRcText("SSID_STATUS").split(",")[1] + (jSelf.hasClass('open') ? getRcText("SSID_STATUS").split(",")[2] : getRcText("SSID_STATUS").split(",")[3]);
                    // '修改''Wi-Fi开关状态为''开''关'
                    addModifyLog();
                });
            });

            //修改按钮
            $(".modifys").click(function () {
                var ssid = encodeURIComponent($(this).parents("div.detail-content").find("span.ssidName").html());
                var spName = $(this).parents("div.detail-content").attr("spName");
                Utils.Base.redirect({ np: $(this).attr("href"), "wifi-type": $(this).attr("wifi-type"), ssid: ssid, spName: spName });
            });
            //点击广告编辑
            $(".edit").click(function () {
                var ssid = encodeURIComponent($(this).parents("div.detail-content").find("span.ssidName").html());
                var spName = $(this).parents("div.detail-content").attr("spName");
                Utils.Base.redirect({ np: $(this).attr("href"), ssid: ssid });
            });
        });
    }
/*
Initializing authentication templates
*/

    function initAuthCfg() {
        $(".accreditation").off().click(function () {
            ssid = $(this).parent().siblings().children("span.ssidName").html();
            bHasModify = true;
            hPending = Frame.Msg.pending(getRcText("MSG_PENDING1").split(",")[2]);
            // "正在初始化认证模板"
            g_oMiniBetAuthCfg = new MiniBeiAuthCfg();
            g_oMiniBetAuthCfg
                .initTemplate(ssid,function (data) {
                    hPending&&hPending.close();
                    if (data == ""){
                        Frame.Msg.info(getRcText("MSG_INFO4").split(",")[1],"error");
                        // "认证模板初始化失败"
                        return;
                    }
                    $("#accredDlg .btn-apply").removeClass('disabled');
                    Utils.Base.openDlg(null, {}, { scope: $("#accredDlg"), className: "modal-super" });
                    g_jWeChartAccountList = $(".modal-scrollable #accountName");

                    var authCfg = this.authCfg;
                    var pubMng = this.pubMng;
                    if (authCfg.authType == 1) {
                        //一键认证
                        // $('div.button[authType="onekey"]').removeClass('closed');
                        // $('div.button[authType="message"]').addClass('closed');
                        $('div.auth[authType="onekey"]').addClass('open');
                        $('div.auth[authType="message"]').removeClass('open');
                        g_jWeChartAccountList.val(getRcText("SHOPNAMELIST_VAL").split(",")[1]);
                        // '关闭'
                        g_jShopNameList.empty().append("<option>"+getRcText("SHOPNAMELIST_VAL").split(",")[1]+"</option>");
                        // 关闭
                        $("#qrcode").hide();
                        bHasNotBug = true;
                    }
                    else {
                        $('div.auth[authType="onekey"]').removeClass('open');
                        if (authCfg.isEnableSms == 1) {
                            $('div.auth[authType="message"]').addClass('open');
                        }
                        else {
                            $('div.auth[authType="message"]').removeClass('open');
                        }
                        if (authCfg.isWeixinConnectWifi == 1 && authCfg.accountName) {
                            initShopListShow(authCfg.accountName);
                        }
                        else {
                            g_jWeChartAccountList.val(getRcText("SHOPNAMELIST_VAL").split(",")[1]);
                            // '关闭'
                            g_jShopNameList.empty().append("<option>"+getRcText("SHOPNAMELIST_VAL").split(",")[1]+"</option>");
                            // 关闭
                            //$("#qrcode").removeAttr('src');

                            $("#qrcode").hide();
                            bHasNotBug = true;
                        }
                    }
                })
                .getWeChartAccounts(function (data) {
                    var self = this;

                    var oAccount = self.oWeChartAccount;
                    var dom = [];
                    dom.push('<option>'+getRcText("SHOPNAMELIST_VAL").split(",")[1]+'</option>');
                    // 关闭
                    for (var accName in oAccount) {
                        dom.push('<option>' + accName + '</option>');
                    }
                    //g_jWeChartAccountList=$(".modal-scrollable #accountName");
                    g_jWeChartAccountList.empty().append(dom.join(''));
                })

            //setTimeout(function(){
            //    },1000);
            
            //Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#showDeviceDlg")));
            
        });

        //认证配置保存
        function onSubmitACC() { 
            var authCfg = g_oMiniBetAuthCfg.authCfg;
            var pubMng = g_oMiniBetAuthCfg.pubMng;
            var bHasModify = true;
            var jShopNameList = $(".modal-scrollable #shop-list");
            if (
                !($('div.auth[authType="onekey"]').hasClass('open'))&&
                !($('div.auth[authType="message"]').hasClass('open'))&&
                (g_jWeChartAccountList.val() == getRcText("SHOPNAMELIST_VAL").split(",")[1])){
                    // '关闭'
                    Frame.Msg.info(getRcText("MSG_INFO4").split(",")[2],"error");
                    // "认证配置不能为空"
                    return;
                }
                
            if (
                ($('div.auth[authType="onekey"]').hasClass('open'))
                ) {
                authCfg.authType = 1;//一键认证
                authCfg.isEnableSms = 0;//禁用短信认证
                authCfg.isWeixinConnectWifi = 0;//禁用微信连wifi
                authCfg.isEnableAccount = 0;//禁用固定账号
            }
            else {
                authCfg.authType = 2;//账号认证
                // 短信认证
                // authCfg.isEnableSms = $('div.button[authType="message"]').hasClass('closed') ? 0 : 1;
                authCfg.isEnableSms = $('div.auth[authType="message"]').hasClass('open') ? 1 : 0;

                //微信连wifi

                //这里有问题 如果名字就叫关闭 则无法配置
                //var sCurWeChartAcc = g_jWeChartAccountList.val();
                var sCurWeChartAcc = $(".modal-scrollable #accountName").val();
                if ((sCurWeChartAcc != getRcText("SHOPNAMELIST_VAL").split(",")[1])&&(bHasNotBug == true)) { 
                    // '关闭'
                    authCfg.isWeixinConnectWifi = 1;
                    authCfg.accountName = sCurWeChartAcc;

                    // 获取选择的门店
                    var sCurShopName = jShopNameList.val();
                    var oCurrWeChartAcc = g_oMiniBetAuthCfg.oWeChartAccount[sCurWeChartAcc];
                    oCurrWeChartAcc.updateShopInfo(sCurShopName);
                }
                else if ((sCurWeChartAcc == getRcText("SHOPNAMELIST_VAL").split(",")[1])&&(bHasNotBug == true)){
                    authCfg.isWeixinConnectWifi = 0;
                     $("#qrcode").hide();
                }
                else if(bHasNotBug == false){
                    Frame.Msg.info(getRcText("MSG_INFO4").split(",")[3],'error');
                    // "微信连Wi-Fi 认证配置有误"
                    bHasModify = false;
                }
            }
            
            if (bHasModify){ 
               //g_oMiniBetAuthCfg.modifyAuthSetting(sCurWeChartAcc).modifyPubMng();
               if(authCfg.isWeixinConnectWifi == 1){
                 oCurrWeChartAcc.getWifiShopListFromTencent(function (data) {
                  for(var i= 0;i<data.data.records.length;i++){
                     if(data.data.records[i].shop_name == jShopNameList.val()){
                     var  shop_id = data.data.records[i].shop_id;
                     setTimeout(function(){
                        g_oMiniBetAuthCfg.modifyAuthSetting(sCurWeChartAcc,shop_id);
                      },0);
                 }
                  }
               })
               }
               else{
                   g_oMiniBetAuthCfg.modifyAuthSetting(sCurWeChartAcc);
               }
            }
        }

        function onCancel(){
            
            g_jWeChartAccountList.val(getRcText("SHOPNAMELIST_VAL").split(",")[1]);
            // '关闭'
            g_jShopNameList.empty().append("<option>"+getRcText("SHOPNAMELIST_VAL").split(",")[1]+"</option>");
            // 关闭
            //$("#qrcode").removeAttr('src');
            
            $("#qrcode").hide();
            bHasNotBug = true;
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $(".modal-scrollable #accredDlg")));
        }

        $("#acc").form("init", "edit", { "title": getRcText("ADD_TITLE"), "btn_apply": { action: onSubmitACC, enable: true },
                       "btn_cancel": onCancel });
        //认证使能切换
        $('div.auth').click(function () {
            var self = $(this);
            if (
                // !self.hasClass('closed')
                self.hasClass('open')
                ) {
                // $('div.button').not(this).addClass('closed'); //关掉其他的按钮
                $('div.auth').not(this).removeClass('open');
                var authType = self.attr('authType');
                if (authType == 'onekey') {
                    g_jWeChartAccountList.val(getRcText("SHOPNAMELIST_VAL").split(",")[1]);
                    // '关闭'
                    g_jShopNameList.empty().append("<option>"+getRcText("SHOPNAMELIST_VAL").split(",")[1]+"</option>");
                    // 关闭
                    //$("#qrcode").removeAttr('src');
                    
                    $("#qrcode").hide();
                    bHasNotBug = true;
                }
            }
        });
    }
    
    function initSignalCfg() {
        var level = 0;
        $("#jiankang").click(function () {
            level = 1;
            $("#jiankang").removeClass('gray');
            $("#jiankang").addClass('gray2');
            $("#junheng").removeClass('gray2');
            $("#junheng").addClass('gray');
            $("#chuanqiang").removeClass('gray2');
            $("#chuanqiang").addClass('gray');
            $("#signMessage").html(getRcText("TIP1"));
        });
        $("#junheng").click(function () {
            level = 2;
            $("#jiankang").removeClass('gray2');
            $("#jiankang").addClass('gray');
            $("#junheng").removeClass('gray');
            $("#junheng").addClass('gray2');
            $("#chuanqiang").removeClass('gray2');
            $("#chuanqiang").addClass('gray');
            $("#signMessage").html(getRcText("TIP2"));
        });
        $("#chuanqiang").click(function () {
            level = 3;
            $("#jiankang").removeClass('gray2');
            $("#jiankang").addClass('gray');
            $("#junheng").removeClass('gray2');
            $("#junheng").addClass('gray');
            $("#chuanqiang").removeClass('gray');
            $("#chuanqiang").addClass('gray2');
            $("#signMessage").html(getRcText("TIP3"));
        });

        function onSubmitLevel() {
            updateSignalLevel(level);
        }
        
        $("#sign").form("init", "edit", { "title": getRcText("ADD_TITLE2"), "btn_apply": { action: onSubmitLevel, enable: true }});
        $("#signalStrength_btn").click(function () {
            if (g_signalLevel == 1) {
                $("#jiankang").removeClass('gray');
                $("#jiankang").addClass('gray2');
                $("#junheng").removeClass('gray2');
                $("#junheng").addClass('gray');
                $("#chuanqiang").removeClass('gray2');
                $("#chuanqiang").addClass('gray');
                $("#signMessage").html(getRcText("TIP1"));
            } else if (g_signalLevel == 2) {
                $("#jiankang").removeClass('gray2');
                $("#jiankang").addClass('gray');
                $("#junheng").removeClass('gray');
                $("#junheng").addClass('gray2');
                $("#chuanqiang").removeClass('gray2');
                $("#chuanqiang").addClass('gray');
                $("#signMessage").html(getRcText("TIP2"));
            } else {
                $("#jiankang").removeClass('gray2');
                $("#jiankang").addClass('gray');
                $("#junheng").removeClass('gray2');
                $("#junheng").addClass('gray');
                $("#chuanqiang").removeClass('gray');
                $("#chuanqiang").addClass('gray2');
                $("#signMessage").html(getRcText("TIP3"));
            }
                
            $("#signalDlg .btn-apply").removeClass('disabled');
            Utils.Base.openDlg(null, {}, { scope: $("#signalDlg"), className: "modal-large" });
        });
        
        getSignalLevel(function(data){
            
            setSignalText(data);
        });
    }
    
    function initWifiTime() {
        var enable = 0;
        var starth = 0;
        var startm = 0;
        var stoph = 0;
        var stopm = 0;
        
        $("#clocktime1 span").css({left:'130px'}); 
        $("#clocktime2 span").css({left:'130px'}); 
        //  $("#clocktime1").removeClass('disabled');
        //  $("input[type=text]").removeClass('disabled');
       
        
        $("#StartValidityDateTime1 span").click(function(){
            $("#comfire").removeClass("hidden");
        });
        
        $("#StartValidityDateTime2 span").click(function(){
            $("#comfire").removeClass("hidden");
        });
        
        $("#comfire").click(function(){
            onSubmitSign($(this));
            $("#comfire").addClass("hidden");
        });
        
        $("#wifiBtn").click(function(){
            onSubmitSign();
            $("#comfire").addClass("hidden");
        });
        //设置wifi时间
        function onSubmitSign(self) {
            enable = $("#wifiBtn").hasClass("open") ? 1 : 0;
            starth = $("#clocktime1").datetime("getTime").split(':')[0];
            startm = $("#clocktime1").datetime("getTime").split(':')[1];
            stoph = $("#clocktime2").datetime("getTime").split(':')[0];
            stopm = $("#clocktime2").datetime("getTime").split(':')[1];
            if((parseInt(starth) < parseInt(stoph)) ||(parseInt(starth)==parseInt(stoph) && parseInt(startm) < parseInt(stopm) ) ) {
            if(g_wifiTime != null){
                if ((g_wifiTime.enable == enable) &&
                    (g_wifiTime.starth == starth) &&
                    (g_wifiTime.startm == startm) &&
                    (g_wifiTime.stoph == stoph) &&
                    (g_wifiTime.stopm == stopm)){
                        return;
                    }
            }
            updateWifiTime(enable, starth, startm, stoph, stopm);
            }
            else{
                if(self){

                }else{
                    if($("#wifiBtn").hasClass("open"))
                    {
                        $("#wifiBtn").removeClass("open");
                    }
                    else
                    {
                        $("#wifiBtn").addClass("open");
                    }
                }
                 Frame.Msg.info(getRcText("WIFI_TIME"),'error');
                //hPending.close(10000);
            }
        }

        //$("#timeform").form("init", "edit", { "title": getRcText("ADD_TITLE3"), "btn_apply": { action: onSubmitSign, enable: true } });
        //$("#wifiTime").click(function () {
        function setclocktime(){
            if (g_wifiTime == null){
                return;    
            }
            
            enable = g_wifiTime.enable;
            starth = g_wifiTime.starth;
            startm = g_wifiTime.startm;
            stoph = g_wifiTime.stoph;
            stopm = g_wifiTime.stopm;

            $("#clocktime1").datetime("setTime", starth + ':' + startm);
            $("#clocktime2").datetime("setTime", stoph + ':' + stopm);
            if (enable != null) {
                enable == 1 ? $("#wifiBtn").addClass('open') : $("#wifiBtn").removeClass('open');
            } else {
                $("#wifiBtn").addClass('open');
            }
            
        }
        //});
        
        getWifiTime(function(data){
            // //setWifiText(data);
            g_wifiTime = data;
            // setWifiText(g_wifiTime);
            // g_hInterval = setInterval(function(){setWifiText(g_wifiTime);},1000);
            setclocktime();
        });
    

    }


    function roamCtrl(num){
        hPending = Frame.Msg.pending(getRcText("PENDING"));
        //$.ajax({
        //    url:MyConfig.path + "/ace/oasis/auth-data/o2oportal/authcfg/modifynosensationtime?storeId="+FrameInfo.Nasid+"&flag="+num,
        //    type: "GET",
        //    dataType: "json",
        //    timeout: 150000,
        //    contentType:"application/json",
        //
        //    success:function(data){
        //        console.log(data,"成功modifynosensationtime");
        //    },
        //    fail:function(err){
        //        console.log(err);
        //    }
        //});
        var ajax={
            url:MyConfig.path + "/ace/oasis/auth-data/o2oportal/authcfg/modifynosensationtime?storeId="+FrameInfo.Nasid+"&flag="+num,
            type: "GET",
            dataType: "json",
            timeout: 150000,
            contentType:"application/json",

            success:function(data){
                console.log(data,"成功modifynosensationtime");
            },
            fail:function(err){
                console.log(err);
            }
        };
        Utils.Request.sendRequest(ajax);
        if(flag===null){
            flag= roamCtrl;
            flag.args = arguments;
            //$.ajax({
            //    url:MyConfig.path + "/ant/confmgr",
            //    type: "POST",
            //    dataType: "json",
            //    timeout: 150000,
            //    ContentType:"application/json",
            //    data:{
            //        "cfgTimeout":120,
            //        "cloudModule":"xiaoxiaobeicfg",
            //        "configType":0,
            //        "deviceModule":"xiaoxiaobei",
            //        "sceneFlag":true,
            //        "method":"AuthGlobal",
            //        "devSN":"",
            //        "sceneType":2,
            //        "nasId":FrameInfo.Nasid,
            //        "userName":FrameInfo.g_user.user,
            //        "shopName":Utils.Device.deviceInfo.shop_name,
            //        "policy":"cloudFirst",
            //        "param":[{
            //            "switchType":"1",
            //            "mactrigger":num+"",
            //            "nasId":FrameInfo.Nasid
            //        }]
            //    },
            //    success:function(data){
            //        fCheckCfgRet(data);
            //
            //    },
            //    error:function(err){
            //        hPending&&hPending.close();
            //        Frame.Msg.info(getRcText("MSG_INFO2").split(",")[2], "error");//失败
            //    }
            //});
            var ajax={
                url:MyConfig.path + "/ant/confmgr",
                type: "POST",
                dataType: "json",
                timeout: 150000,
                ContentType:"application/json",
                data:{
                    "cfgTimeout":120,
                    "cloudModule":"xiaoxiaobeicfg",
                    "configType":0,
                    "deviceModule":"xiaoxiaobei",
                    "sceneFlag":true,
                    "method":"AuthGlobal",
                    "devSN":"",
                    "sceneType":2,
                    "nasId":FrameInfo.Nasid,
                    "userName":FrameInfo.g_user.user,
                    "shopName":Utils.Device.deviceInfo.shop_name,
                    "policy":"cloudFirst",
                    "param":[{
                        "switchType":"1",
                        "mactrigger":num+"",
                        "nasId":FrameInfo.Nasid
                    }]
                },
                success:function(data){
                    fCheckCfgRet(data);

                },
                error:function(err){
                    hPending&&hPending.close();
                    Frame.Msg.info(getRcText("MSG_INFO2").split(",")[2], "error");//失败
                }
            };
            Utils.Request.sendRequest(ajax);
        }else{
            //$.ajax({
            //    url:MyConfig.path + "/ant/confmgr",
            //    type: "POST",
            //    dataType: "json",
            //    timeout: 150000,
            //    ContentType:"application/json",
            //    data:{
            //        "cfgTimeout":120,
            //        "cloudModule":"xiaoxiaobeicfg",
            //        "configType":0,
            //        "deviceModule":"xiaoxiaobei",
            //        "sceneFlag":true,
            //        "method":"AuthGlobal",
            //        "devSN":g_onLine,
            //        "sceneType":2,
            //        "nasId":FrameInfo.Nasid,
            //        "userName":FrameInfo.g_user.user,
            //        "shopName":Utils.Device.deviceInfo.shop_name,
            //        "param":[{
            //            "switchType":"1",
            //            "mactrigger":num+"",
            //            "nasId":FrameInfo.Nasid
            //        }]
            //    },
            //    success:function(data){
            //        fCheckCfgRet(data);
            //    },
            //    error:function(err){
            //        hPending&&hPending.close();
            //        Frame.Msg.info(getRcText("MSG_INFO2").split(",")[2], "error");//失败
            //    }
            //});
            var ajax={
                url:MyConfig.path + "/ant/confmgr",
                type: "POST",
                dataType: "json",
                timeout: 150000,
                ContentType:"application/json",
                data:{
                    "cfgTimeout":120,
                    "cloudModule":"xiaoxiaobeicfg",
                    "configType":0,
                    "deviceModule":"xiaoxiaobei",
                    "sceneFlag":true,
                    "method":"AuthGlobal",
                    "devSN":g_onLine,
                    "sceneType":2,
                    "nasId":FrameInfo.Nasid,
                    "userName":FrameInfo.g_user.user,
                    "shopName":Utils.Device.deviceInfo.shop_name,
                    "param":[{
                        "switchType":"1",
                        "mactrigger":num+"",
                        "nasId":FrameInfo.Nasid
                    }]
                },
                success:function(data){
                    fCheckCfgRet(data);
                },
                error:function(err){
                    hPending&&hPending.close();
                    Frame.Msg.info(getRcText("MSG_INFO2").split(",")[2], "error");//失败
                }
            };
            Utils.Request.sendRequest(ajax);
        }
        return this;

    }

    /*获取漫游配置*/
    function getRoamCfg(){
        //console.log(9090909);
        //$.ajax({
        //    url:MyConfig.path + "/ant/confmgr",
        //    type: "POST",
        //    dataType: "json",
        //    timeout: 150000,
        //    ContentType:"application/json",
        //    data:{
        //        "cfgTimeout":120,
        //        "cloudModule":"xiaoxiaobeicfg",
        //        "configType":1,
        //        "deviceModule":"xiaoxiaobei",
        //        "sceneFlag":true,
        //        "method":"getAuthGlobalCfg",
        //        "devSN":"",
        //        "sceneType":2,
        //        "nasId":FrameInfo.Nasid,
        //        "userName":FrameInfo.g_user.user,
        //        "shopName":Utils.Device.deviceInfo.shop_name,
        //        "param":[{
        //            "switchtype":"1",
        //            "nasId":FrameInfo.Nasid
        //        }]
        //    },
        //    success:function(data){
        //        console.log(data,93939393);
        //        if(data.result[0]){
        //            if(data.result[0].mactrigger){
        //                $("#roma").addClass("open");
        //            }
        //        }else{
        //            console.log("getRoamCfg err");
        //        }
        //    },
        //    error:function(err){
        //
        //    }
        //});
        var ajax={
            url:MyConfig.path + "/ant/confmgr",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            ContentType:"application/json",
            data:{
                "cfgTimeout":120,
                "cloudModule":"xiaoxiaobeicfg",
                "configType":1,
                "deviceModule":"xiaoxiaobei",
                "sceneFlag":true,
                "method":"getAuthGlobalCfg",
                "devSN":"",
                "sceneType":2,
                "nasId":FrameInfo.Nasid,
                "userName":FrameInfo.g_user.user,
                "shopName":Utils.Device.deviceInfo.shop_name,
                "param":[{
                    "switchtype":"1",
                    "nasId":FrameInfo.Nasid
                }]
            },
            success:function(data){
                console.log(data,93939393);
                if(data.result[0]){
                    if(data.result[0].mactrigger){
                        $("#roma").addClass("open");
                    }
                }else{
                    console.log("getRoamCfg err");
                }
            },
            error:function(err){

            }
        };
        Utils.Request.sendRequest(ajax);
    }
/*漫游控制*/
    function roaming(){
        if($("#roaming .ctrl-btn").hasClass("open")){
            roamCtrl(1);
        }else{
            roamCtrl(0);
        }
    }
/*服务器地址认证*/    
    $("#serverModify").click(function () {
        $("#serverTip").hide();
        Utils.Base.openDlg(null, {}, {scope:$("#serverCfgDlg"),className:"modal-large"});
    });
    function initGlobalValue() {
        g_sShopName = Utils.Device.deviceInfo.shop_name;
        g_jWeChartAccountList = $("#accountName");//$('div.form-body:nth-child(1) > div.form-content > div:nth-child(3) > select');
        g_jShopNameList = $('select#shop-list');
    }

    function initEvent() {
        /*跳转*/
        $("#probeSwitch").click(function(){
            Utils.Base.redirect({ np: $(this).attr("href")});
        });
        $("#radioLink").click(function(){
            Utils.Base.redirect({ np: $(this).attr("href")});
        });
        $("#wirlessLink").on("click",function(){
            Utils.Base.redirect({ np: $(this).attr("href")});
        });
        //wifi开关按钮
        $(".openORclose").click(function () {
            toggleButton.call($(this));
        });
        /*白名单设置*/
        $("#whiteChange").click(function(){
            Utils.Base.redirect({ np: $(this).attr("href")});
        });
        /*白名单详情*/
        $("#listWhite").click(function(){
            scanWhiteList();
        });
        //微信公众号切换
        g_jWeChartAccountList.change(function () {
            if (this.value == getRcText("SHOPNAMELIST_VAL").split(",")[1]) {
                // '关闭'
                g_jShopNameList.empty().append("<option>"+getRcText("SHOPNAMELIST_VAL").split(",")[1]+"</option>");
                // 关闭
                $("#qrcode").removeAttr('src');
                return;
            }
            // $('div.button[authType="onekey"]').addClass('closed');// 关闭一键认证
            $('div.auth[authType="onekey"]').removeClass('open');
            var wechartAcc = g_oMiniBetAuthCfg.oWeChartAccount[this.value];

            initShopListShow(this.value);
        });
        
        //门店切换
        g_jShopNameList.change(function (data){
            var shopName = this.value;
            var wechartAcc = g_oMiniBetAuthCfg.oWeChartAccount[$(".modal-scrollable #accountName").val()];
            old_ssid_list = wechartAcc.oShopList[shopName].ssid_list.slice(0);
            $("#qrcode").removeAttr('src');
            if(old_ssid_list ==""){
                $("#qrcode").hide();
                return;
            } else {
                for( var i= 0;i<=old_ssid_list.length;i++){
                    bHasNotBug = true;
                   if(old_ssid_list.indexOf(ssid) != -1) {
                       wechartAcc.getQrCode( ssid,wechartAcc.oShopList[shopName].shop_id, function (data) {
                           //var self = this;
                           if (data != "failed") {
                               $("#qrcode" +  " img").attr('src', data.data.qrcode_url);
                               $("#qrcode" +  " span").text(ssid);
                               $("#qrcode" ).show();
                               $("#qrcode" ).show();
                           }
                           hPending&&hPending.close();
                       });
                   }
                    else{
                       $("#qrcode").hide();
                       return;
                   }
                }
            }
        });
        $("#roaming .ctrl-btn").on("click",function(){
            if($("#roaming .ctrl-btn").hasClass("open")){
                roamCtrl(1);
            }else{
                roamCtrl(0);
            }
            //roaming();
        });
    }

    function _init() {
        g_sShopName = Utils.Device.deviceInfo.shop_name;
        initserverAdress();
        serverConform();
        initGlobalValue();
        getRoamCfg();
        initEvent();
        initSsidCfg();
        initAuthCfg();
        initSignalCfg();
        initWifiTime();
       // initChannel();
        //initFenJiFenQuan();
        initFailDevGrid();
        failConform();
        closeMadle();
        closeX();
        closeXX();
        testUrl();

    }
    function initFenJiFenQuan()
    {
        //1 获取到数组
        var arrayShuZu= Frame.Permission.getCurPermission();
        //2 将数组作简洁处理
        var arrayShuZuNew=[];
        $.each(arrayShuZu,function(i,item){
            var itemNew=item.split('_')[1];
            arrayShuZuNew.push(itemNew);
        });
        //3 作具体的“显示、隐藏”处理
        if($.inArray("WRITE",arrayShuZuNew)==-1){
            //隐藏“写”的功能
            //写
            $(".hidemodify").css('display','none');
            $(".forbid").attr('disabled','true');
            $(".singleSelect").attr('disabled','true');
            $("#signalDlg .btn-apply").attr('disabled','true');
        }
    }
    function _destroy() {
        g_hInterval = null;
        hPending&&hPending.close();
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    function _resize() {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Minput", "SingleSelect", "Form", "DateTime","SList"],
        "utils": ["Base", "Request", 'Device']//添加device插件 会在插件加载完成后调用Utils.Device
    });

})(jQuery);