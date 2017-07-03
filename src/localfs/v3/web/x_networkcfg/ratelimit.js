/**
 * Created by Administrator on 2016/3/22.
 */
(function($) {
    var MODULE_NAME = "x_networkcfg.ratelimit";
    // 获取wifi场景名称
    var g_sShopName = null;
    var Ratio = null;
    var hPending = null;
    var g_onLine = [];//存储在线下发失败的设备
    var flag= null;//为空就是第一次下发，否则就是再次下发失败的设备
    function getRcText(sRcName) {
        return Utils.Base.getRcString("x_ratelimit_rc", sRcName);
    }
    function failConform(){
        $("#failConform").on("click", function(){
            flag&&flag.apply(null,flag.args);
            //flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    function getStatus(g_onLine,aErrList,callback){
        var getDevStatusOpt = {
            type:"POST",
            url:"/base/getDevs",
            dataType:"json",
            timeout: 150000,
            data:{
            
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
                console.log(g_onLine,data,aErrList,888888);
                callback(aErrList);

            },
            onFailed:function(){
             hPending&&hPending.close();
                console.log(error);
            }
        };
        Utils.Request.sendRequest(getDevStatusOpt);
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
    function initFailDevGrid() {
        var opt = {
            colNames: getRcText("DEV_LIST"),
            showOperation: false,
            pageSize: 5,
            multiSelect: false,
            search: false,
            sortable: false,
            colModel: [
                {name: 'devSN', datatype: "String"}, //business_name branch_name
                {name: 'devState', datatype: "String"}, //business_name branch_name
            ]
        };
        $("#failList").SList("head", opt);
    }
    // 获取Qos相关配置
    function GetQoSCfg(onSuccess) {
        var ajax = {
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
                "cfgTimeout": 10,
                "cloudModule": "xiaoxiaobeicfg",
                "deviceModule": "xiaoxiaobei",
                "method": "GetScenariosCfg",
                "param": [{
                    "userName": FrameInfo.g_user.user,
                    "nasId": FrameInfo.Nasid,
                    "sceneName": g_sShopName,
                    "type": 2
                }]
            }),
            onFailed: function (err) {
                console.log(err);
            },
            onSuccess: onSuccess
        }
        Utils.Request.sendRequest(ajax);
    }
    // 下发配置
    function QoSCfgUpdate(qosEnable, totalBand, guestRatio,onSuccess) {
        hPending = Frame.Msg.pending(getRcText("CONFIG_QOS"));
       if(flag===null){
           flag=QoSCfgUpdate;
           flag.args = arguments;
           var ajax = {
               type: "POST",
               url: MyConfig.path + "/ant/confmgr",
               contentType: "application/json",
               dataType: "json",
               timeout: 150000,
               data: JSON.stringify({
                   "configType": 0,
                   "sceneFlag": "true",
                   "sceneType": 2,
                   "userName": FrameInfo.g_user.user,
                   "shopName": g_sShopName,
                   "cfgTimeout": 120,
                   "nasId": FrameInfo.Nasid,
                   //"cfgRetry": 2,
                   "cloudModule": "xiaoxiaobeicfg",
                   "deviceModule": "xiaoxiaobei",
                   "method": 'QoSCfgUpdate',//"ScenariosUpdate",
                   "policy": "cloudFirst",
                   "param": [{
                       "userName": FrameInfo.g_user.user,
                       "nasId": FrameInfo.Nasid,
                       "type": "2",
                       "sceneName": g_sShopName,
                       "qosEnable": qosEnable,
                       "downBandwidth": totalBand,
                       "guestRatio": guestRatio,
                       "guestMode": 0
                   }]
               }),
               onSuccess:onSuccess,
               onFailed: function () {
                   hPending.close();
                   console.log("failed to update qos");
               }
           }
       }
        else{
           var ajax = {
               type: "POST",
               url: MyConfig.path + "/ant/confmgr",
               contentType: "application/json",
               dataType: "json",
               timeout: 150000,
               data: JSON.stringify({
                   "configType": 0,
                   "sceneFlag": "true",
                   "sceneType": 2,
                   "userName": FrameInfo.g_user.user,
                   "shopName": g_sShopName,
                   "cfgTimeout": 120,
                   "nasId": FrameInfo.Nasid,
                   //"cfgRetry": 2,
                   "cloudModule": "xiaoxiaobeicfg",
                   "deviceModule": "xiaoxiaobei",
                   "method": 'QoSCfgUpdate',//"ScenariosUpdate",
                   //"policy": "cloudFirst",
                   "devSN":g_onLine,
                   "param": [{
                       "userName": FrameInfo.g_user.user,
                       "nasId": FrameInfo.Nasid,
                       "type": "2",
                       "sceneName": g_sShopName,
                       "qosEnable": qosEnable,
                       "downBandwidth": totalBand,
                       "guestRatio": guestRatio,
                       "guestMode": 0
                   }]
               }),
               onSuccess:onSuccess,
               onFailed: function () {
                   hPending.close();
                   console.log("failed to update qos");
               }
           }
       }


        Utils.Request.sendRequest(ajax);
    }
    var isGragingSlider = false;
    function initGrid() {
        function initSlider() {
            jQuery("#Slider1").slider({
                from: 0,
                to: 100,
                step: 5,
                dimension: '%',
                smooth: true,
                limits: true,
                skin: 'plastic',
                scale: ['0', '|', '10', '|', '20', '|', '30', '|', '40', '|', '50', '|', '60', '|', '70', '|', '80', '|', '90', '|', '100']
            });
        }
        initSlider();

        var totalBand = $("#totalBand");
        totalBand.change(function(){
            var thisval = $(this).val()-0;
            var ratio = $("#Slider1").slider('value')/100;
            var totalBand1 = parseInt((thisval*ratio).toFixed(2));
            var totalBand2 = parseInt((thisval - (totalBand1-0)).toFixed(2));
            $("#bussinessWifi").html(totalBand2);
            $("#manageWifi").html(totalBand1);
            // $("#manageWifi").html(totalBand2);

        });

       
        var slider = $('.limit-slider')[0];
        // .jslider .jslider-pointer
        $('.jslider .jslider-pointer')[0].onmousedown = function () {
            isGragingSlider = true;
        };
        slider.onmouseup  = function(){
            if(isGragingSlider == true){
                isGragingSlider = false;
                var totalBand = $('#totalBand').val()-0;
                var ratio = $("#Slider1").slider('value')/100;
                var totalBand1 = parseInt((totalBand*ratio).toFixed(2));
                var totalBand2 = parseInt((totalBand - (totalBand1-0)).toFixed(2));
                $("#bussinessWifi").html(totalBand2);
                $("#manageWifi").html(totalBand1);
                // $("#manageWifi").html(totalBand2);
            };   
        };
     
    

        // 点击开关按钮
        $(".openORclose").click(function(event) {
            var self = $(this);
            event.stopPropagation();
            // 点击关闭按钮
            if (self.hasClass("open")) {
                self.removeClass("open");
            }
            else {
                // 点击开启
                self.addClass("open");
            }
        });

        // 点击确定按钮
        $("#ok").click(function() {            
            var qosEnable = $(".openORclose").hasClass("open") ? 1 : 0;
            var totalBand = $("#totalBand").val();
            var guestRatio =1-(( $("#Slider1").slider("value")-0)/100);//商业Wi-Fi的比例
            var ratio = $("#Slider1").slider('value')/100;
            if (totalBand == 0) {
                $("label[class=info-explain][for='limit'] span").text(getRcText("PROMPT_INFO").split(",")[0]).css({ "color": "red" });
                // "整体带宽不能为0"
                if (ratio == 0) {
                $("label[class=info-explain][for='limit1'] span").text(getRcText("PROMPT_INFO").split(",")[1]).css({ "color": "red" });
                // "商业Wi-Fi不能为0Mbps"
                    return;
                } else {
                    $("label[class=info-explain][for='limit1'] span").text("");
                }
                if(ratio == 1){
                    $("label[class=info-explain][for='limit1'] span").text(getRcText("PROMPT_INFO").split(",")[2]).css({ "color": "red" });
                }
                return;
            } else {
                $("label[class=info-explain][for='limit'] span").text("");
                if(ratio == 1){
                    $("label[class=info-explain][for='limit1'] span").text(getRcText("PROMPT_INFO").split(",")[2]).css({ "color": "red" });
                    return;
                }
                if (ratio == 0) {
                $("label[class=info-explain][for='limit1'] span").text(getRcText("PROMPT_INFO").split(",")[1]).css({ "color": "red" });
                // "商业Wi-Fi不能为0Mbps"
                    return;
                } else {
                    $("label[class=info-explain][for='limit1'] span").text("");
                }
            }
            
            //Frame.Msg.info(getRcText("CONFIG_QOS"));
            QoSCfgUpdate(qosEnable, totalBand, guestRatio,function (data, textStatus, jqXHR) {
                g_onLine=[];
                if(data.serviceResult =="success") {
                    var aErrList = [];
                    for (var i = 0; i < data.deviceResults.length; i++) {
                        if (data.deviceResults[i].reason == "Failed to set cfg to device.") {
                            var devFailList ={
                                devSN:data.deviceResults[i].devSN
                            };
                            devFailList.devSN = data.deviceResults[i].devSN;
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
                        Frame.Msg.info(getRcText("CONFIG_SUCCESS"));
                        flag = null;
                    }
                    else {
                        getStatus(g_onLine,aErrList,function(aErrOpt){
                            hPending&&hPending.close();
                            setTimeout(function(){
                                Utils.Base.openDlg(null, {}, {scope:$("#failcfgDlg"),className:"modal-large"});
                            },500);
                            $("#failList").SList("refresh", aErrOpt);
                        });
                    }
                }
                else{
                    Frame.Msg.info(getRcText("MSG_INFO2").split(",")[0],"error");
                    flag = null;
                }
                hPending&&hPending.close();
                return;
                //if (data.serviceResult =="success") {
                //    var aErrList = [];
                //    for (var i = 0; i < data.deviceResults.length; i++) {
                //        if ((data.deviceResults[i].communicateResult != "success") || (data.deviceResults[i].deviceResult.result != "success")) {
                //            aErrList.push(data.deviceResults[i].devSN);
                //        }
                //    }
                //    if (aErrList.length == 0) {
                //        Frame.Msg.info(getRcText("CONFIG_SUCCESS"));
                //    }
                //    else {
                //        Frame.Msg.info(getRcText("FAIL_INFO") + aErrList.join(", "),"error");
                //    }
                //}
                //else{
                //    Frame.Msg.info(getRcText("CONFIG_ERROR"),"error");
                //}
                //hPending.close();
                //return;


            });
        });

        // 点击取消按钮
        $("#cancel").click(function() {
            initData();
        });
    }
    
    function initData() {
        g_sShopName = Utils.Device.deviceInfo.shop_name;

        GetQoSCfg(function (data, textStatus, jqXHR) {
            console.log(data);
            if (!("result" in data)) {
                // if (!("result" in data && data.result instanceof Array)) {
                console.log("get qos config error");
                return;
            }
            var config = data.result;
            var guest_radio = null;
            if (config.guestRatio >= 0 && config.guestRatio <= 1) { 
                guest_radio = config.guestRatio;
            } else {
                guest_radio = 0;
            }
            if (config.qosEnable != null) {
                config.qosEnable == 1 ? $(".openORclose").addClass('open') : $(".openORclose").removeClass('open');
            } else {
                $(".openORclose").addClass('open');
            }

            guest_radio = 1 - guest_radio;
            $("#Slider1").slider('value', guest_radio * 100);
            $("#totalBand").val(config.downBandwidth);
            var ratio = $("#Slider1").slider('value') / 100;
            // var totalBand1 = parseInt((config.downBandwidth * ratio).toFixed(2));
            // var totalBand2 = parseInt((config.downBandwidth - (totalBand1 - 0)).toFixed(2));
            // var totalBand2 =  (config.totalBand*(1-ratio)).toFixed(2);
            var totalBand1 = parseInt((config.downBandwidth - (totalBand1 - 0)).toFixed(2));
            var totalBand2 = parseInt((config.downBandwidth * ratio).toFixed(2)); 
            $("#bussinessWifi").html(totalBand1);
            $("#manageWifi").html(totalBand2);
        });
            

        Ratio = $("#Slider1").slider().getValue()/100;
    }

    function _init() {
        initGrid();
        initData();
        initFenJiFenQuan();
        initFailDevGrid();
        failConform();
        closeMadle();
        closeX();
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
        if($.inArray("WRITE",arrayShuZuNew) ==-1){
            //隐藏“写”的功能
            //写
            $(".hidemodify").css('display','none');
            $(".forbid").attr('disabled','true');
            // $(".singleSelect").attr('disabled','true');
        }
    }
    function _destroy() {
        Ratio = null;
        hPending&&hPending.close();
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Minput","SList","Form"],
        "utils": ["Base","Request","Device"],
        "libs": ["slider.jquery_slider_min"]

    });
})(jQuery);

