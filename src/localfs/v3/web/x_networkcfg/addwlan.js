(function($) {
    var MODULE_NAME = "x_networkcfg.addwlan";
    var g_sShopName = null;
    var IsValidText = [true,true];
    var g_logObj = {};
    // var old_ssid_status = null;
    // var old_hide_ssid = null;
    // var old_securityMode = null;
    var g_SpName = [];
    //var g_IschangeWiFiName = null;
    var g_hPending = null;
    var g_curWifiInfo = null; //当前wifi信息
    var g_oldssid;
    var g_devsn = [];
    var g_onLine = [];//存储在线下发失败的设备
    var flag= null;//为空就是第一次下发，否则就是再次下发失败的设备
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.format = function(fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    function getRcText(sRcName) {
        return Utils.Base.getRcString("addwlan_rc", sRcName);
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

            }
        };
        Utils.Request.sendRequest(getDevStatusOpt);
    }
    function failConform(){
        $("#failConform").on("click", function(){
            flag&&flag.apply(null,flag.args);
            //flag=null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    function closeMadle(){
        $("#closeMadle").on("click", function(){
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
    //获取url中的参数
    function getUrlParam(name) {
        // var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        // var r = window.location.hash.substr(1).match(reg);  //匹配目标参数
        // if (r != null) return unescape(r[2]); return null; //返回参数值
        var para = Utils.Base.parseUrlPara()||[];
        return para[name];
    }
    function setOKButtom(){
        if (IsValidText[0] && IsValidText[1]){
            $("#ok").removeAttr('disabled');
        }else{
            $("#ok").attr('disabled','');
        }
    }

    function initGrid() {
        //get param
        // var hash = window.location.hash;
        // 获取地址栏参数后进行判断
       // $("span.head_show").html(getUrlParam("ssid"));
        setOKButtom();
        var wifiType = getUrlParam("wifi-type");
        var jText = $("#text");
        var jPassword = $("#password");
        if (wifiType == "manage-wifi") {
            //管理wifi添加固定密码
            var ssid = decodeURIComponent(getUrlParam("ssid"));
            $("#head_show").empty().html(ssid);
            // $("#password").val("123456");
            $("#password").val("123456789");
            $("#servername").empty().html(getRcText("Wi-Fi_NAME").split(",")[0]);
            // "内部Wi-Fi"
            $("#displayssid").css('display', "block");
            $("#manageWifi").removeClass('hide');
            $("#businessWifi").addClass('hide');
        }
        else {
            var ssid = decodeURIComponent(getUrlParam("ssid"));
            $("#head_show").empty().html(ssid);
            $("#servername").empty().html(getRcText("Wi-Fi_NAME").split(",")[1]);
            // "商业Wi-Fi"
            $("#displayssid").css('display', "none");
            $("#password").val("123456789");
            $("div.sureandcancel").css("margin-top", "235px");
            $("#manageWifi").addClass('hide');
            $("#businessWifi").removeClass('hide');
        }

        $("#cancel").click(function() {
            Utils.Base.redirect({ np: "x_networkcfg.index" },'X_xNetworkCfg');
        });

        // $("#custom").click(function() {
        //     $("#input").show();
        // });

        // $("#default").click(function() {
        //     $("#input").hide();
        // });

        // $("#video").click(function() {
        //     $("#input").hide();
        // });

        // $("#game").click(function() {
        //     $("#input").hide();
        // });
        // $("#internet").click(function() {
        //     $("#input").hide();
        // });

        $("#remove_secret").click(function() {
            $("#pass").hide();
        });

        $("#add_secret").click(function() {
            $("#pass").show();
            if($("#password").val() == ""){
                $("#ok").attr('disabled','');
            }
        });
        //add_secret

        $("span.head_show").click(function() {
            var ssid = $(this).html();
            if ($("span.head_show input").length == 0) {
                $(this).html("").append("<input type='text' style='width: 250px; height:50px;'/>");
                $("span.head_show input").val(ssid);

            }
            event.stopPropagation();
        });
        // $("#select").change(function() {
        //     var type = $("#select").val();
        //     if (type === 'set') {
        //         $("#input").show();
        //     }
        //     else {
        //         $("#input").hide();
        //     }
        // });
        var limit_msg=getRcText("LIMIT_MSG").split(',');
        $("#modify").click(function() {
            IsValidText[0] = false;
            setOKButtom();
            var ssid = $('#head_show').text();
            $('#head_show').hide();
            $("#modify").hide();
            $('#ssid').val(ssid);
            $('#ssid').show();
            $("#infoExplain1").show(); 
            $("#ssid").focus();
            $("label[class~=info-explain][for='ssid']").removeClass('hide').children().text(limit_msg[0]+limit_msg[1]+limit_msg[2]).css({ "color": "#9da9b8" });
            // "长度不能超过32位，且不能包含% # &和空格"
            event.stopPropagation();
        });
        // $("input").click(function() {
        //     event.stopPropagation();
        // });

        $("#switch").click(function(){
            if($(this).hasClass('show_word'))
            {
                $(this).removeClass('show_word');
                jText.hide();
                jPassword.show();
                jPassword.val(jText.val());
            }
            else{
                $(this).addClass('show_word');
                jText.show();
                jPassword.hide();
                jText.val(jPassword.val());
            }
        });
        $("#text").click(function(){
            IsValidText[1] = false;
            setOKButtom(); 
        });
        $("#password").click(function(){
            IsValidText[1] = false;
            setOKButtom(); 
        });

        $("#text").keyup(function(){

            var length = this.value.length;
            var keyValue=event.which;
            //四个方向键的键值
            if(keyValue<=40 && keyValue>=37){
                return;
            }else{
                if (this.value != this.value.replace(/[\u4e00-\u9fa5]|\s/g,'')){
                    
                    this.value=this.value.replace(/[\u4e00-\u9fa5]|\s/g,'');
                }
            }
            // this.value=this.value.replace(/\s/g,'');
            //var replaceLength = this.value.length;

            $("#password").val($("#text").val());

        });

        $("#password").keyup(function(){

            var length = this.value.length;
            var keyValue=event.which;
            //四个方向键的键值
            if(keyValue<=40 && keyValue>=37){
                return;
            }else{
                if (this.value != this.value.replace(/[\u4e00-\u9fa5]|\s/g,'')){
                    
                    this.value=this.value.replace(/[\u4e00-\u9fa5]|\s/g,'');
                }
           }
            // this.value=this.value.replace(/[\W]/g,'');            
            //var replaceLength = this.value.length;

            $("#text").val($("#password").val());

        });

        $("#password").blur(function(event) {
            // 判断密码个数
            var psw_length = $(this).val().length;
            if ($("#password").val() == "") {
                $("label[class=info-explain][for='password'] span").text(limit_msg[3]).css({ "color": "red" });
                // "请输入密码"
                IsValidText[1] = false;
            } else if (psw_length < 8 || psw_length > 32) {
                $("label[class=info-explain][for='password'] span").text(limit_msg[4]+limit_msg[5]).css({ "color": "red" });
                // "密码长度为8-32位,请重新输入"
                event.stopPropagation();
                IsValidText[1] = false;
            } else {
                $("label[class=info-explain][for='password'] span").text(limit_msg[6]).css({ "color": "#9da9b8" });
                // "8-32字符"
                event.stopPropagation();
                IsValidText[1] = true;
            }
            setOKButtom();
        })

        $("#text").blur(function(event) {
            // 判断密码个数
            var res1 =/\s/g;
            var psw_length = $(this).val().length;
            if ($("#text").val() == "") {
                $("label[class=info-explain][for='password'] span").text(limit_msg[3]).css({ "color": "red" });
                // "请输入密码"
                IsValidText[1] = false;
            } else if ( res1.test($("#text").val())||psw_length < 8 || psw_length > 32) {
                $("label[class=info-explain][for='password'] span").text(limit_msg[4]+limit_msg[5]).css({ "color": "red" });
                // "密码长度为8-32位,请重新输入"
                event.stopPropagation();
                IsValidText[1] = false;
            } else {
                $("label[class=info-explain][for='password'] span").text(limit_msg[6]).css({ "color": "#9da9b8" });
                // "8-32字符"
                event.stopPropagation();
                IsValidText[1] = true;
            }
            setOKButtom();
        })

        // ssid_check = function() {
        //     var res = 0;
        //     var self_val =  $("#ssid").val();
        //     var i,sum;
        //     sum = 0;
        //     for (i=0;i<self_val.length;i++){
        //         if ((self_val.charCodeAt(i)>=0) && (self_val.charCodeAt(i)<=255)) {
        //             sum=sum+1;
        //         }else {
        //             sum=sum+3;
        //         }
        //     }

        //     if(self_val =='' || self_val.length == 0){
        //         $("label[class~=info-explain][for='ssid']").removeClass('hide').children().text(getRcText("Wi-Fi_NAME_MSG").split(",")[0]).css({ "color": "red" });
        //         // "请输入Wi-Fi名称"
        //         res = -1;
        //     }else  if((self_val.search(/^\s+$/)<0 && self_val.search(/^[^\%\#\&\ ]{1,32}/)>=0) && (sum <=32 )){
        //         if (g_SpName.indexOf(self_val) != -1){
        //             $("label[class~=info-explain][for='ssid']").removeClass('hide').children().text(getRcText("Wi-Fi_NAME_MSG").split(",")[1]).css({ "color": "red" });
        //             // "该Wi-Fi 名称已经存在"
        //             res =  -1;
        //         }
        //         else{
        //             // g_logObj.ssidNamelog = getRcText("SSID_NAME_LOG").split(",")[0] + getUrlParam("ssid") + getRcText("SSID_NAME_LOG").split(",")[1] + self_val;
        //             // // '修改''Wi-Fi名称为'
        //             var ssid = $("#ssid").val();
        //             $("#head_show").empty().html(ssid);
        //             $('#head_show').show();
        //             $("#modify").show();
        //             $('#ssid').hide();
        //             $("label[class~=info-explain][for='ssid']").addClass('hide').hide();
        //             //$("#infoExplain1").hide();

        //             res =  0;
        //         }
        //     }else{
        //         $("label[class~=info-explain][for='ssid']").removeClass('hide').children().text(getRcText("LIMIT_MSG").split(",")[0]).css({ "color": "red" });
        //         // "长度不能超过32位，且不能包含% # &和空格"
        //         res = -1;
        //     }

        //     if (res == 0){
        //         IsValidText[0] = true;
        //     }

        //     setOKButtom();

        //     return res;
        // }



          ssid_check = function() {
            var res1 =/^[\s　]|[ ]$/gi;
            //var res1 =/[ ]$/gi;
            var res2 = /[\%\#\&\"\<\?\/\'\/]/;
            var res = 0;
            var self_val =  $("#ssid").val();
            var i,sum;
            sum = 0;
            for (i=0;i<self_val.length;i++){
                if ((self_val.charCodeAt(i)>=0) && (self_val.charCodeAt(i)<=255)) {
                    sum=sum+1;
                }else {
                    sum=sum+3;
                }
            }
            var WiFi_msg=getRcText("Wi-Fi_NAME_MSG").split(",");
            if(self_val =='' || self_val.length == 0){
                $("label[class~=info-explain][for='ssid']").removeClass('hide').children().text(WiFi_msg[0]).css({ "color": "red" });
                // "请输入Wi-Fi名称"
                res = -1;
            }
                else  if( !res1.test(self_val) && !res2.test(self_val) && sum <=32 && sum >=1)
            {
                if (g_SpName.indexOf(self_val) != -1){
                    $("label[class~=info-explain][for='ssid']").removeClass('hide').children().text(WiFi_msg[1]).css({ "color": "red" });
                    // "该Wi-Fi 名称已经存在"
                    res =  -1;
                }
                else{
                    // g_logObj.ssidNamelog = getRcText("SSID_NAME_LOG").split(",")[0] + getUrlParam("ssid") + getRcText("SSID_NAME_LOG").split(",")[1] + self_val;
                    // // '修改''Wi-Fi名称为'

                var ssid = $("#ssid").val();
                $("#head_show").empty().html(ssid);
                $('#head_show').show();
                $("#modify").show();
                $('#ssid').hide();
                $("label[class~=info-explain][for='ssid']").addClass('hide').hide();
                //$("#infoExplain1").hide();
                
                    res =  0;
                }
            }else{
                $("label[class~=info-explain][for='ssid']").removeClass('hide').children().text(limit_msg[0]+limit_msg[1]+limit_msg[2]).css({ "color": "red" });
                // "长度不能超过32位，且不能包含% # &和空格"
                res = -1;
            }
            if (res == 0){
                IsValidText[0] = true;
            }
            setOKButtom();
            return res;
        }

        $("#ssid").blur(ssid_check);

        $("input[name='ssid-status']").change(function() {
            var self = $(this);
            var new_ssid_Status = null;

            if (self.val() == 0) {
                new_ssid_Status = getRcText("SSID_STATUS").split(",")[0]
                // '关闭'
            } else {
                new_ssid_Status = getRcText("SSID_STATUS").split(",")[1]
                // '开启'
            }
            g_logObj.ssidStatuslog = getRcText("SSID_NAME_LOG").split(",")[0] + getUrlParam("ssid") + getRcText("SSID_NAME_LOG").split(",")[2] + new_ssid_Status;
            // '修改''服务状态为'

        });
        $("input[name='hide_ssid']").change(function() {
            var self = $(this);
            //g_logObj.hidessid = self.val();
            var new_hide_ssid = null;
            if (self.val() == 0) {
                new_hide_ssid = getRcText("YES_OR_NO").split(",")[0]
                // '否'
            } else {
                new_hide_ssid = getRcText("YES_OR_NO").split(",")[1]
                // '是'
            }
            g_logObj.hidessidlog = getRcText("HIDE_SSID_LOG").split(",")[0] + getUrlParam("ssid") + getRcText("HIDE_SSID_LOG").split(",")[1] + new_hide_ssid;
            // '修改''是否隐藏SSID为'
        });
        $("input[name='securityMode']").change(function() {
            var self = $(this);
            var new_securityMode = null;
            if (self.val() == 0) {
                new_securityMode = getRcText("YES_OR_NO").split(",")[0]
                // '否'
            } else {
                new_securityMode = getRcText("YES_OR_NO").split(",")[1]
                // '是'
            }
            g_logObj.securityModelog = getRcText("SECURITY_MODE_LOG").split(",")[0] + getUrlParam("ssid") + getRcText("SECURITY_MODE_LOG").split(",")[1] + new_securityMode;
            // '修改''加密服务为'
        });

        $("#ok").click(function(event) {
            event.stopPropagation();
            //postwlan();
            g_hPending = Frame.Msg.pending(getRcText("PENDING"));
            //商业wifi且修改了ssid名称 是否使能微信连wifi认证
            ExistWeiChatAndConfig(function (IsResult) {
                if(IsResult){
                    g_hPending&&g_hPending.close();
                    Frame.Msg.info(getRcText("CLOSE_WEIXING_INFO"),"error");
                    // "需先关闭认证模版中的微信连Wi-Fi"
                }else{
                    
                    sendCfg(function (result) {
                        if(result == 0){
                            Frame.Msg.info(getRcText("SUCCESS"));
                            g_hPending&&g_hPending.close();
                            
                            Utils.Base.redirect({np: "x_networkcfg.index"},'X_xNetworkCfg');
                        }else{
                            Frame.Msg.info(getRcText("FAILD"),"error");
                            g_hPending&&g_hPending.close();
                }
                    });
            }
            });
             var newssid = $("#ssid").val();
            if(newssid!=""&&g_oldssid != newssid){
              // g_hPending = Frame.Msg.pending(getRcText("SSID_INFO"));
              // window.setTimeout("g_hPending.close()",10000);
              $("#ss").removeClass("ssidinfos");
              $("#ss").css("color","red");
            }
           
        });
            }

    function sendCfg(cBack) {
            // var isSuccess = true;
            // if ($("input[name='securityMode']").MRadio("getValue") == 1) {
            //     var psw_length = $("#password").val().length;
            //     if ($("#password").val() == "") {
            //         $("label[class=info-explain][for='password'] span").text(getRcText("LIMIT_MSG").split(",")[1]).css({ "color": "red" });
            //         // "请输入密码"
            //         isSuccess = false;
            //     } else if (psw_length < 8 || psw_length > 32) {
            //         console.log(psw_length);
            //         $("label[class=info-explain][for='password'] span").text(getRcText("LIMIT_MSG").split(",")[2]).css({ "color": "red" });
            //         // "密码长度为8-32位,请重新输入"
            //         event.stopPropagation();
            //         isSuccess = false;
            //     }
            // }
            // if($('#ssid').is(":visible")){
            //     isSuccess = false;
            // }
            var newDate = {ssidName: $("#head_show").html(),
                            status: parseInt($("input[name='ssid-status']").MRadio("getValue")),
                            hideSSID: parseInt($("input[name='hide_ssid']").MRadio("getValue")),
                            securityMode: parseInt($("input[name='securityMode']").MRadio("getValue")),
                            psk: $("input[name='securityMode']").MRadio("getValue") == "1"?$("#password").val():""};
            if(setLogAndCompare(newDate)){
                UpdateSsid(newDate, function(data, textStatus, jqXHR) {
                    g_onLine = [];
                    if(data.serviceResult =="success") {
                        //  initForm();
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
                                aErrList.push(devFailList);
                            }
                        }
                        if (aErrList.length == 0) {
                            cBack(0);
                            flag = null;
                        }
                        else {
                            if(g_onLine === null){
                                $("#tip").css("display","block");
                            }
                            else{
                                $("#tip").css("display","none");
                            }
                            getStatus(g_onLine,aErrList,function(aErrOpt){
                                g_hPending&&g_hPending.close();
                                setTimeout(function(){
                                    Utils.Base.openDlg(null, {}, {scope:$("#failcfgDlg"),className:"modal-large"});
                                },500);
                                $("#failList").SList("refresh", aErrOpt);
                            });
                        }
                    }
                    else{
                        cBack(1);
                        flag = null;
                    }
                     g_devsn = [];
                    for(var i=0;i<data.deviceResults.length;i++){
                        g_devsn.push(data.deviceResults[i].devSN);
                    }
                    for (var i in g_logObj) {
                        var date = new Date();
                        var g_logObjadt = g_logObj[i];

                        addLog(g_logObjadt, function (data, textStatus, jqXHR) {
                            g_logObj={};
                            try {
                                if (!('retCode' in data)) {
                                    throw (new Error('retCode is null'));
                                }
                                if (data.retCode == 0) {
                                    console.log("addlog success;");
                                } else {
                                    console.log(data.message);
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        });
                    }
                    g_hPending&&g_hPending.close();
                    return;
                        //if (!('serviceResult' in data_ssid)){
                        //     throw (new Error('serviceResult is null'));
                        //}
                        //if(data_ssid.serviceResult == "fail"){
                        //    // g_hPending.close();
                        //    // Frame.Msg.info(getRcText("FAILD"));
                        //    cBack(1);
                        //}
                        //else{
                        //    if (!('deviceResults' in data_ssid)){
                        //        throw (new Error('deviceResults is null'));
                        //    }
                        //    for (var i in g_logObj) {
                        //        var date = new Date();
                        //        var g_logObjadt = g_logObj[i];
                        //
                        //        addLog(g_logObjadt, function (data, textStatus, jqXHR) {
                        //            g_logObj={};
                        //            try {
                        //                if (!('retCode' in data)) {
                        //                    throw (new Error('retCode is null'));
                        //                }
                        //        if (data.retCode == 0) {
                        //            console.log("addlog success;");
                        //        } else {
                        //            console.log(data.message);
                        //                }
                        //            } catch (error) {
                        //                console.log(error);
                        //            }
                        //        });
                        //    }
                        //
                        //    cBack(0);
                        //}
                },function () {
                    cBack(1);
                    //Frame.Msg.info(getRcText("FAILD"),"error");
                    // 配置失败
                    g_hPending&&g_hPending.close();
                });
            }else{
                //没有变化，直接返回成功
                cBack(0);
                //Frame.Msg.info(getRcText("SUCCESS"));
            }
    }
    function ExistWeiChatAndConfig(cBack) {
        if((getUrlParam("spName") == "sp_manage_00")||
            (g_curWifiInfo.ssidName == $("#head_show").html())){
                cBack(false);
                return;
        }
        var newSsid = $("#ssid").val();
        var option = {
            type: 'POST',
            url: MyConfig.path + '/initserver',
            contentType: 'application/json',
            dataType: 'json',
            timeout: 150000,
            data: JSON.stringify({
                Method: 'modifyPubMng',
                //ownerName: FrameInfo.g_user.user,
                ownerName: FrameInfo.g_user.attributes.name,
                shopName: g_sShopName,
                devSN: FrameInfo.ACSN,
                nasID: FrameInfo.Nasid,
                ssid:g_oldssid,
                newSsid:newSsid
            }),
            onSuccess: function (data) {
                //data.data.authCfgGson.ownerName = FrameInfo.g_user.user;
                //判断是否是微信连接 是则置0 否则不操作
                if (data.errorcode == 0){
                    //if(data.data.authCfgGson.isWeixinConnectWifi == 1){
                        cBack(false);
                    //}else{
                       // cBack(false);
                    //}
                }
                else{
                    cBack(true);
                }
            },
            onFailed: function (err) {
                g_hPending&&g_hPending.close();
                Frame.Msg.info(getRcText("GET_FAIL"),"error");
               // Frame.Msg.info("获取配置失败请重新操作","error");
                return;
            }
        };
        Utils.Request.sendRequest(option);//下发配置
    }

    function addLog(logstr,onSuccess,onFailed) {
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
           onSuccess:onSuccess,
           onFailed:onFailed
        }

        Utils.Request.sendRequest(ajax);
    }
    
    function getPlatFormType(callback) {
        var ajax = {
            type: 'POST',
            url: MyConfig.path + "/base/getDevPlatformType",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
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
                callback('fail');
                g_hPending&&g_hPending.close();
            }
        }

        Utils.Request.sendRequest(ajax);
    }
    function setLogAndCompare(newDate) {
        // '修改''Wi-Fi名称为'
        var hasChange = false;
        if(g_curWifiInfo.ssidName != newDate.ssidName){
            g_logObj.ssidNamelog = getRcText("SSID_NAME_LOG").split(",")[0] + g_curWifiInfo.ssidName + getRcText("SSID_NAME_LOG").split(",")[1] + newDate.ssidName;
            hasChange = true;
        }
        // '修改''服务状态为'
        if(g_curWifiInfo.status != newDate.status){
            g_logObj.ssidStatuslog = getRcText("SSID_NAME_LOG").split(",")[0] + g_curWifiInfo.ssidName + getRcText("SSID_NAME_LOG").split(",")[2] + (newDate.status == 1? "开启":"关闭");
            hasChange = true;
        }
        // '修改''是否隐藏SSID为'
        if(g_curWifiInfo.hideSSID != newDate.hideSSID){
           g_logObj.hidessidlog = getRcText("HIDE_SSID_LOG").split(",")[0] + g_curWifiInfo.ssidName + getRcText("HIDE_SSID_LOG").split(",")[1] + (newDate.hideSSID == 1 ?"是":"否");
           hasChange = true; 
        }
        // '修改''加密服务为'
        if(g_curWifiInfo.securityMode != newDate.securityMode){
            g_logObj.securityModelog = getRcText("SECURITY_MODE_LOG").split(",")[0] + g_curWifiInfo.ssidName + getRcText("SECURITY_MODE_LOG").split(",")[1] + (newDate.securityMode == 1?"加密":"不加密");
            hasChange = true;
        }
        if(g_curWifiInfo.psk != newDate.psk){
           hasChange = true; 
        }
        return hasChange;
    }

    function UpdateSsid(newDate, onSuccess,onFailed) {
        g_hPending = Frame.Msg.pending(getRcText("PENDING"));
        var args = arguments;
        getPlatFormType(function (type) {
            if(type == 'fail'){
                Frame.Msg.info(getRcText("MSG_INFO"),'error');
                // "无法获取设备的模式"
                onFailed();
                return;
            }
            var option = {};
            if(flag===null){
                flag=UpdateSsid;
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
                        //"cfgRetry": 2,
                        "cloudModule": "xiaoxiaobeicfg",
                        "deviceModule": "xiaoxiaobei",
                        "nasId": FrameInfo.Nasid,
                        "method": "SSIDUpdate",
                        "param": [{
                            "userName": FrameInfo.g_user.user,
                            "sceneName": g_sShopName,
                            "spName": getUrlParam("spName"),
                            "nasId": FrameInfo.Nasid,
                            "ssidName": newDate.ssidName,
                            "status": newDate.status,
                            "hideSSID": newDate.hideSSID,
                            "maxClients": 128,
                            "securityMode": newDate.securityMode,
                            "psk": newDate.psk,
                            "upSpeedLimit": 83886080,
                            "downSpeedLimit": 83886080,
                            "bDefaultSsid": 1,
                            "serviceType": 0,
                            "portalType": 1
                        }]
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
                        //"cfgRetry": 2,
                        "cloudModule": "xiaoxiaobeicfg",
                        "deviceModule": "stamgr",
                        "nasId": FrameInfo.Nasid,
                        "method": "SSIDUpdate",
                        "param": [{
                            "userName": FrameInfo.g_user.user,
                            "sceneName": g_sShopName,
                            'stName'      :   getUrlParam("spName"),
                            'ssidName'    :  newDate.ssidName,
                            "nasId": FrameInfo.Nasid,
                            'description':   "1",
                            'status'      :   newDate.status,
                            'hideSSID'    :   newDate.hideSSID,
                            'akmMode'     :   newDate.securityMode,
                            'cipherSuite' :    20,
                            'securityIE'  :    3,
                            'psk'         :    newDate.psk
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
                        //"policy": "cloudFirst",
                        "devSN":g_onLine,
                        "cfgTimeout": 120,
                        //"cfgRetry": 2,
                        "cloudModule": "xiaoxiaobeicfg",
                        "deviceModule": "xiaoxiaobei",
                        "nasId": FrameInfo.Nasid,
                        "method": "SSIDUpdate",
                        "param": [{
                            "userName": FrameInfo.g_user.user,
                            "sceneName": g_sShopName,
                            "spName": getUrlParam("spName"),
                            "nasId": FrameInfo.Nasid,
                            "ssidName": newDate.ssidName,
                            "status": newDate.status,
                            "hideSSID": newDate.hideSSID,
                            "maxClients": 128,
                            "securityMode": newDate.securityMode,
                            "psk": newDate.psk,
                            "upSpeedLimit": 83886080,
                            "downSpeedLimit": 83886080,
                            "bDefaultSsid": 1,
                            "serviceType": 0,
                            "portalType": 1
                        }]
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
                        //"cfgRetry": 2,
                        "cloudModule": "xiaoxiaobeicfg",
                        "deviceModule": "stamgr",
                        "nasId": FrameInfo.Nasid,
                        "method": "SSIDUpdate",
                        "param": [{
                            "userName": FrameInfo.g_user.user,
                            "sceneName": g_sShopName,
                            'stName'      :   getUrlParam("spName"),
                            'ssidName'    :  newDate.ssidName,
                            "nasId": FrameInfo.Nasid,
                            'description':   "1",
                            'status'      :   newDate.status,
                            'hideSSID'    :   newDate.hideSSID,
                            'akmMode'     :   newDate.securityMode,
                            'cipherSuite' :    20,
                            'securityIE'  :    3,
                            'psk'         :    newDate.psk
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
                onSuccess:onSuccess,
                onFailed:onFailed
            }

            Utils.Request.sendRequest(ajax);
        });
        
    }
    function initData() {
        g_sShopName = Utils.Device.deviceInfo.shop_name;
        g_logObj = {};
        
        function GetSsisCfg(onSuccess) {
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
                    "nasId": FrameInfo.Nasid,
                    // "cfgTimeout": 10,
                    "cfgTimeout": 120,
                    "cloudModule": "xiaoxiaobeicfg",
                    "deviceModule": "xiaoxiaobei",
                    "method": "GetSsisCfg",
                    "param": [{
                        "userName": FrameInfo.g_user.user,
                        "nasId": FrameInfo.Nasid,
                        "sceneName": g_sShopName
                    }]
                }),
                onSuccess: onSuccess,
                onFailed: function () {
                    g_hPending&&g_hPending.close();
                    console.log("failed to get ssid cfg");
                }
            }
            Utils.Request.sendRequest(ajax);
        }
        
        var cur_SpName = getUrlParam("spName");
   
        GetSsisCfg( function (data, textStatus, jqXHR) {
            
                var serviceResult = ("serivceResult" in data) ? data.serivceResult : data.result;
                
                //g_IschangeWiFiName = getUrlParam("ssid");
                
                for (var i = 0; i < serviceResult.length; i++) {
                    if (serviceResult[i].spName == cur_SpName) {
                        g_curWifiInfo = serviceResult[i];
                    }else {
                        g_SpName.push(serviceResult[i].ssidName);
                    }
                }

                if (!(('hideSSID', 'securityMode', 'status', 'hideSSID', 'securityMode', 'psk') in g_curWifiInfo)) {
                    g_curWifiInfo = null;
                    Utils.Base.redirect({np: "x_networkcfg.index"},'X_xNetworkCfg');
                    throw (new Error('data absend'));
                }
                g_oldssid = g_curWifiInfo.ssidName;
                $("span.head_show").html(g_curWifiInfo.ssidName);
                $("input[name='ssid-status']").MRadio("setValue", g_curWifiInfo.status);
                $("input[name='hide_ssid']").MRadio("setValue", g_curWifiInfo.hideSSID);
                $("#password").val((g_curWifiInfo.psk == "N/A")?"":g_curWifiInfo.psk);
                $("input[name='securityMode']").MRadio("setValue", g_curWifiInfo.securityMode);
                if (g_curWifiInfo.securityMode == 0) {
                    $("#pass").hide();
                }else{
                    $("#pass").show();
                }

        });
    }

    function _init() {
        initGrid();
        initData();
        initFailDevGrid();
        failConform();
        closeMadle();
        closeX();
    }

    function _destroy() {
        g_SpName = [];
        g_hPending&&g_hPending.close();
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    function _resize() {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList", "SingleSelect", "Minput", "Form", "MSelect"],
        "utils": ["Base","Request", 'Device']
    });

})(jQuery);