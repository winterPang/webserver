(function($) {
    var MODULE_BASE = "h_wireless";
    var MODULE_NAME = MODULE_BASE + ".index_modify";
    var MODULE_RC = "h_wireless_indexModifys";
    var g_oPara;
    var g_Radios, g_PercentMax = 100;
    g_aAPlist = [];
    oapname_SN = {};
    var obj = {};
    var g_st = {};
    // var sStName = Frame.Util.generateID("ST");
    function getRcText(sRcName) {
        return Utils.Base.getRcString(MODULE_RC, sRcName);
    }
    Date.prototype.format = function(fmt) { //author: meizz   
        var o = {
            "M+": this.getMonth() + 1, //月份   
            "d+": this.getDate(), //日   
            "h+": this.getHours(), //小时   
            "m+": this.getMinutes(), //分   
            "s+": this.getSeconds(), //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    //创建页面模版
    function addLoginPage(themeName) {
        var date = new Date();
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path + "/themetemplate/add",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                ownerName: FrameInfo.g_user.attributes.name,
                themeName: themeName,
                description: "modified at " + date.format("yyyy-MM-dd hh:mm:ss")
            })
        });
    }
    //同步请求接口
    function synSSID() {
        // alert("异步请求成功");
        $.ajax({
            type: "get",
            url: MyConfig.v2path + "/syncAc?acsn=" + FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            success: function(data) {
                if (data && data.error_code == "0") {
                    showSSID(obj[g_oPara.stName],"edit");
                   
                } else {
                    Frame.Msg.info("同步失败", "error");
                }
            },
            error: function(err) {

            }

        })
    }

    //显示SSID
    function showSSID(oRowdata, sName) {//拿到点击的那一行数据
        function onCancel() {
            console.log("finish")
            jFormSSID.form("updateForm", oRowdata);
            $("input[type=text]", jFormSSID).each(function() {
                Utils.Widget.setError($(this), "");
            });
            return true;
        }

        function onSuccess() {
            if (sName == "edit") {

                Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
               
            }
            
            Utils.Base.refreshCurPage();
        }

        function onSubmitSSID() {
            function operatePubMng(loginPage, authCfg) { //3.选登录模板 更改发布模板 
                // oRowdata.pubMngName=ssidName;
                if (!oRowdata.pubMngName || !("pubMngName" in oRowdata)) { //发布模板不存在 创建发布模板
                    getDeviceInfo().done(function(data, textStatus, jqXHR) {
                        if (data.dev_list.length <= 0) {
                            return; //无法获取场所列表
                        }
                        var shopName = data.dev_list[0].shop_name;
                        //添加发布模版
                        addPubMng(name, shopName, ssidName, WeChart, authCfg, loginPage).done(function(data, textStatus, jqXHR) {
                            if (("errorcode" in data) && (data.errorcode != 0)) {
                                return;
                            }
                            oRowdata.pubMngName = name;
                            oRowdata.WeChartList = WeChart;
                            oRowdata.AuthCfgList = authCfg;
                            oRowdata.LoginPageList = loginPage;
                            //发布 发布模版
                            PublishPubMng(name, true)
                                .done(function(data, textStatus, jqXHR) {
                                    //在这里进行判断，如果以前有发布模板并且已经发布了的话，那么就要先用SSID把原来的发布
                                    //模板删除，然后再添加发布模板
                                    if (("errorcode" in data) && (data.errorcode != 0)) {
                                        return; //发布失败
                                    }
                                    Frame.Msg.info(getRcText("PUB_SUCC")); //发布成功
                                    onSuccess();
                                });
                        });
                    });
                } else { //修改发布模板
                    var pubMng = oRowdata.pubMngName;
                    //修改发布模版
                    modPubMng(pubMng, WeChart, authCfg, loginPage).done(function(data, textStatus, jqXHR) {
                        if (("errorcode" in data) && (data.errorcode != 0)) {
                            return;
                        }
                        getDeviceInfo().done(function(data, textStatus, jqXHR) {
                        if (data.dev_list.length <= 0) {
                            return; //无法获取场所列表
                        }
                        var shopName = data.dev_list[0].shop_name;
                        //添加发布模版
                        addPubMng(name, shopName, ssidName, WeChart, authCfg, loginPage).done(function(data, textStatus, jqXHR) {
                            if (("errorcode" in data) && (data.errorcode != 0)) {
                                return;
                            }
                            oRowdata.pubMngName = name;
                            oRowdata.WeChartList = WeChart;
                            oRowdata.AuthCfgList = authCfg;
                            oRowdata.LoginPageList = loginPage;
                            //发布 发布模版
                            PublishPubMng(name, true)
                                .done(function(data, textStatus, jqXHR) {
                                    if (("errorcode" in data) && (data.errorcode != 0)) {
                                        return; //发布失败
                                    }
                                    Frame.Msg.info(getRcText("PUB_SUCC")); //发布成功
                                    onSuccess();
                                });
                        });
                    });
                        //发布 发布模版
                        PublishPubMng(pubMng, true).done(function(data, textStatus, jqXHR) {
                            if (("errorcode" in data) && (data.errorcode != 0)) {
                                return;
                            }
                            Frame.Msg.info(getRcText("PUB_SUCC")); //发布成功
                            onSuccess();
                        });
                    });
                }
            }
            var date = new Date();
            var authType = $("input[name=AuthenType]:checked").attr("id"); //AT1 认证方式
            var loginType = $("input[name=LoginPage]:checked").attr("id"); //LP1 登录页面
            var WeChart = $("#WeChartList").val(); //微信公众号
            var ssidName = $("#apModel", jFormSSID).val();
            var authCfg = $("#AuthCfgList").val(); //选择认证模板
            var loginPage = $("#LoginPageList").val(); //选择页面模板
            var cipherSuite = $("#cipherSuite").val();
            //var securityIE = $("#securityIE").val();
            var time = Frame.DataFormat.getStringTime(new Date());
            // console.log("time:::"+time);
            var name = "";
            if (ssidName.length > 15) {
                name = ssidName.replace(/\s+/g, "").slice(0, 15);
            } else {
                name = ssidName;
            }
            name = name + time;

            if (authType == "AT1") { //1.不认证 删除发布模板 取消发布
                if (!("pubMngName" in oRowdata)) { //发布模板不存在
                    Frame.Msg.info(getRcText("DEL_PUB_SUCC"));
                    onSuccess();
                    return;
                }
                // delPubMng(oRowdata.pubMngName).done(function(data, textStatus, jqXHR) {
                //     if (("errorcode" in data) && (data.errorcode != 0)) {
                //         Frame.Msg.info(getRcText("DEL_AUTH_FAIL"), "error"); //失败哦
                //         onSuccess();
                //     }
                //     Frame.Msg.info(getRcText("DEL_PUB_SUCC")); //发布成功
                //     onSuccess();
                // })
            } else if ((authType == "AT2") || (authType == "AT3")) { //2.gm 创建新的登录模板
                var authType = (authType == "AT2" ? 1 : 2); //at2 一键上网 at3 账号登陆
                var enableMsg = ($("#Message").is(":checked") ? 1 : 0);
                var enableWeChart = ($("#WeChart").is(":checked") ? 1 : 0);
                var enableAccount = ($("#FixAccount").is(":checked") ? 1 : 0);
                var enableWechatWifI = ($("#isWeChatWifi").is(":checked") ? 1 : 0);
                var nauthParamValue = $("#auto_study_enable").MCheckbox("getState") ? $("#impose_auth_time", jFormSSID).val() : "0";
                //增加认证模板
                addAuthPub(name, authType, enableMsg, enableWeChart, enableAccount, enableWechatWifI, nauthParamValue).done(function(data, textStatus, jqXHR) {
                    if (("errorcode" in data) && (data.errorcode != 0)) {
                        return;
                    }
                    authCfg = name;
                    if (loginType == "LP4") {
                        operatePubMng(loginPage, authCfg); //选登录模板 更改发布模板
                    } else {
                        //创建新的页面模板
                        addLoginPage(name).done(function(data, textStatus, jqXHR) {
                            if (("errorcode" in data) && (data.errorcode != 0)) {
                                return;
                            }
                            loginPage = name;
                            operatePubMng(loginPage, authCfg); //选登录模板 更改发布模板
                        })
                    }
                });
                    } else if (authType == "AT4") {
                        if (loginType == "LP4") {
                            operatePubMng(loginPage, authCfg); //选登录模板 更改发布模板
                        } else {
                            //创建新的页面模板
                            addLoginPage(name).done(function(data, textStatus, jqXHR) {
                                if (("errorcode" in data) && (data.errorcode != 0)) {
                                    return;
                                }
                                loginPage = name;
                                operatePubMng(loginPage, authCfg);
                            })
                        }
                    }
        }
        var jFormSSID = $("#toggle_form"),sType, sStName;
        var CurrentPercent = oRowdata || {};
        CurrentPercent = CurrentPercent.Percent || 0;
        CurrentPercent = g_PercentMax + CurrentPercent * 1;
        // $("#percentMax").html(CurrentPercent);
        // $("#Percent").attr("max", CurrentPercent);
        // CurrentPercent >= 1 ? $("#Percent_Block").show() : $("#Percent_Block").hide();
        if (sName == "add") //Add
        {
            sType = "create";
            var sStName = Frame.Util.generateID("ST");
            var jDlg = $("#AddSsidDlg");
            if (jDlg.children().length) {
                $("#ssidToggle").show().insertAfter($(".modal-header", jDlg));
            } else {
                $("#ssidToggle").show().appendTo(jDlg);
            }
            $("#SSID", jFormSSID).attr("readonly", false);
            jFormSSID.form("init", "edit", {
                "title": getRcText("ADD_TITLE"),
                "btn_apply": onSubmitSSID
            });
            jFormSSID.form("updateForm", {
                SSID: "",
                StType: "1",
                UserIsolation: "false"
            });
            $("input[type=text]", jFormSSID).each(function() {
                Utils.Widget.setError($(this), "");
            });
            Utils.Base.openDlg(null, {}, {
                scope: jDlg,
                className: "modal-super"
            });
        } else //Edit
        {
            sType = "merge";
            var sStName = oRowdata.Name;
            onSubmitSSID();
            // onCancel();
            
            $("input[type=text]", jFormSSID).each(function() {
                Utils.Widget.setError($(this), "");
            });
            if (oRowdata.auto_study_enable == false) {
                $("#auto_study_enable", jFormSSID).MCheckbox("setState", false);
                $(".Learn-MAC", jFormSSID).hide();
            } else {
                $("#auto_study_enable").MCheckbox("setState", true);
                $(".Learn-MAC", jFormSSID).show();
            }
        }
    }

        function getDeviceInfo() {
            return $.ajax({
                type: "POST",
                url: MyConfig.v2path + "/getDeviceInfo",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "tenant_name": FrameInfo.g_user.attributes.name,
                    "dev_snlist": [FrameInfo.ACSN]
                })
            });
        }

        //添加发布模版
        function addPubMng(pubMngName, shopName, ssidName, WeChart, authCfg, loginPage) {
            return $.ajax({
            type: "POST",
            url: MyConfig.v2path + "/pubmng/add",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                ownerName: FrameInfo.g_user.attributes.name,
                name: pubMngName || "",
                shopName: shopName || "",
                ssidName: ssidName || "",
                weixinAccountName: WeChart || "",
                authCfgName: authCfg || "",
                themeTemplateName: loginPage || ""
            })
        });
        }
        //修改发布模版
        function modPubMng(pubMngName, WeChart, authCfgName, loginPage) {
            var date = new Date();
            var shopName = Utils.Device.deviceInfo.shop_name;
            return $.ajax({
                type: "POST",
                url: MyConfig.v2path + "/pubmng/modify",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    ownerName: FrameInfo.g_user.attributes.name,
                    name: pubMngName,
                    shopName: shopName,
                    weixinAccountName: WeChart,
                    authCfgName: authCfgName,
                    themeTemplateName: loginPage,
                    description: "modified at " + date.format("yyyy-MM-dd hh:mm:ss")
                })
            });
        }
        // //删除发布模版
        // function delPubMng(pubMngName) {
        //     var shopName = Utils.Device.deviceInfo.shop_name;
        //     return $.ajax({
        //         type: "POST",
        //         url: MyConfig.v2path + "/pubmng/delete",
        //         dataType: "json",
        //         contentType: "application/json",
        //         data: JSON.stringify({
        //             ownerName: FrameInfo.g_user.attributes.name,
        //             name: pubMngName || "",
        //             shopName: shopName
        //         })
        //     });
        // }
        //发布 发布模版
        function PublishPubMng(pubMngName, isPublish) {
            var shopName = Utils.Device.deviceInfo.shop_name;
            return $.ajax({
                type: "POST",
                url: MyConfig.v2path + "/pubmng/publish",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    ownerName: FrameInfo.g_user.attributes.name,
                    name: pubMngName || "",
                    shopName: shopName,
                    isPublish: isPublish //true or false
                })
            })
        }
        //增加认证模版
        function addAuthPub(authPubName, authType, enableMsg, enableWeChart, enableAccount, enableWechatWifI, nauthParamValue) {
            return $.ajax({
                type: "POST",
                url: MyConfig.v2path + "/authcfg/add",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    ownerName: FrameInfo.g_user.attributes.name,
                    authCfgTemplateName: authPubName,
                    authType: authType,
                    isEnableSms: enableMsg,
                    isEnableWeixin: enableWeChart,
                    isWeixinConnectWifi: enableWechatWifI,
                    isEnableAli: 0,
                    isEnableAccount: enableAccount,
                    isEnableQQ: 0,
                    uamAuthParamList: [{
                        authParamName: "ONLINE_MAX_TIME",
                        authParamValue: "21600"
                    }, {
                        authParamName: "URL_AFTER_AUTH",
                        authParamValue: ""
                    }, {
                        authParamName: "IDLE_CUT_TIME",
                        authParamValue: "30"
                    }, {
                        authParamName: "IDLE_CUT_FLOW",
                        authParamValue: "10240"
                    }, {
                        authParamName: "NO_SENSATION_TIME",
                        authParamValue: nauthParamValue
                    }]
                })
            });
        }
    function queryAuthCfg() {
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path + "/authcfg/query?ownerName=" + FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json"
        })
    }

    function queryWeChat() {
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path + "/weixinaccount/query?ownerName=" + FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json",
        });
    }

    function queryLoginPage() {
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path + "/themetemplate/query?ownerName=" + FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json",
        })
    }
    function getSSIDList() {
        return $.ajax({
            url: MyConfig.path + "/ssidmonitor/getssidlist?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            contentType: "application/json"

        });
    }
    function getSSIDInfo() {
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path + "/getSSIDInfo",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                tenant_name: FrameInfo.g_user.attributes.name,
                dev_snlist: [FrameInfo.ACSN + ""]
            })
        });
    }
    //查询发布管理
    function queryPubMng(data, textStatus, jqXHR) {
        // console.log(data);
        var shopName = Utils.Device.deviceInfo.shop_name;
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path + "/pubmng/query?ownerName=" + FrameInfo.g_user.attributes.name + "&shopName=" + shopName,
            dataType: "json",
            contentType: "application/json"
        });
    }
    var aStatus = getRcText("STATUS").split(',');//,使能,去使能
    var aAkmMode = getRcText("AKMMODE").split(',');//否,是"
    function updataSSID(){
        return $.ajax({
            type:"post",
            url:MyConfig.path+"/ant/confmgr",
            dataType:"json",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                module : "stamgr",
                method : "SSIDUpdate",
                configType:0,
                cloudModule:"stamgr",
                deviceModule:"stamgr",
                param:[{
                        stName: g_oPara.stName,
                        ssidName:g_oPara.ssidName,
                        akmMode:aAkmMode.indexOf($("#cipherSuite div div span.checked").parent().next().text()),
                        status:aStatus.indexOf($("#status div div span.checked").prev()[0].value),
                        // cipherSuite:0,
                        psk:$("#restByte").val()
                }]
            })
        })
    }
    function initData() {
        $("#apName").val(g_oPara.stName);
        $("#apModel").val(g_oPara.ssidName);
        var aAuthType = getRcText("AUTHEN_TYPE").split(",");
        var aCIPHERSUITE = getRcText("CIPHERSUITE").split(",");
        //var aSECURITYIE = getRcText("SECURITYIE").split(",");
        //查询认证模板的接口用来获取认证模板 选择认证模板
        queryAuthCfg().done(function(data, textStatus, jqXHR) {
            if (("errorcode" in data) && (data.errorcode != 0)) {
                return;
            }
            var auth_list = data.data;
            var authcfgList = [];
                auth_list.forEach(function(authcfg) {
                    authcfgList.push(authcfg.authCfgTemplateName);
                });
                $("#AuthCfgList").singleSelect("InitData", authcfgList);
            
            getSSIDList().done(function(data, textStatus, jqXHR) {
                if (!data) {
                    return;
                }
                var ssid_list = data.ssidList || [];
                ssid_list.forEach(function(ssid) {
                    var SSID = ssid.stName;
                    if(g_oPara.stName==SSID){
                        obj[SSID] = { 
                            SSID: ssid.ssidName,
                            status:ssid.status,
                            akmMode:ssid.akmMode,
                            st_Name: ssid.stName,
                            AuthenType: "AT1", //不认证
                            LoginPage: "LP1", //简约
                            AuthType: g_oPara.authType,//这里的值应该是上个页面传过来的，不能写死
                            authCfgTemplateName:"",
                            themeTemplateName:""
                        };
                        
                    }
                });
               

                //查询发布管理,这里是把返回的数据传到slist列表上
                queryPubMng().done(function(data, textStatus, jqXHR) {
                    if (("errorcode" in data) && (data.errorcode != 0)) {
                        return;
                    }
                    var pubmng_list = data.data || [];
                    pubmng_list.forEach(function(pubmng) {
                        if(obj[g_oPara.stName].SSID==pubmng.ssidName){
                            obj[g_oPara.stName].authCfgTemplateName=pubmng.authCfgName;
                            obj[g_oPara.stName].themeTemplateName=pubmng.themeTemplateName;
                        }
                        auth_list.forEach(function(authmsg) {
                            if(obj[g_oPara.stName].authCfgTemplateName==authmsg.authCfgTemplateName){
                                //$("#AuthCfgList option[value="+obj[g_oPara.stName].authCfgTemplateName+"]").attr("selected","true");
                                $("#AuthCfgList").singleSelect("value",obj[g_oPara.stName].authCfgTemplateName);
                                 $("#LoginPageList").singleSelect("value",obj[g_oPara.stName].themeTemplateName);
                            }
                            if (authmsg.authCfgTemplateName == pubmng.authCfgName) {
                                obj[g_oPara.stName].AuthType = aAuthType[authmsg.authType]; //slist 显示用
                                if (authmsg.uamAuthParamList[0].authParamValue == "0") {
                                    obj[g_oPara.stName].auto_study_enable = false;
                                } else {
                                    obj[g_oPara.stName].auto_study_enable = true;
                                    obj[g_oPara.stName].impose_auth_time = authmsg.uamAuthParamList[0].authParamValue;
                                }

                            }
                        })
                    });

                })
                if(1 == obj[g_oPara.stName].status){
                    $("#status span.radio-icon:first").addClass("checked");
                    $("#status span.radio-icon:last").removeClass("checked");
                }
                else
                {   
                    $("#status span.radio-icon:first").removeClass("checked");
                    $("#status span.radio-icon:last").addClass("checked");
                }
                if(obj[g_oPara.stName].AuthType=="不认证"||obj[g_oPara.stName].AuthType==" "){
                    $("#authTypes div:first div:first div span").addClass("checekd").siblings().removeClass("checked");
                }
                else if(obj[g_oPara.stName].AuthType=="一键上网"||obj[g_oPara.stName].AuthType=="账号认证")
                {
                    $("#authTypes div:first div:first div span").removeClass("checked");
                    $("#WeixinBlock div:first span").addClass("checked").siblings().removeClass("checked");
                    $("#ModelSelect").css("display","block");  
                    $("#denglu div:first div:first div:first div span").removeClass("checked")
                    $("#yemian div:first span").addClass("checked")
                    $("#LoginPageSelect").css("display","block");
                }
                if(obj[g_oPara.stName].akmMode==0){
                    $("#cipherSuite div div:first span").addClass("checked");
                    $("#cipherSuite div div:last span").removeClass("checked");
                }else {
                    $("#cipherSuite div div:last span").addClass("checked");
                    $("#cipherKey_out").css("display","block");
                    $("#cipherKey_out #restByte").text("******");
                    $("#cipherSuite div div:first span").removeClass("checked");
                }
            });
        });
        //查询微信公众号的接口   微信公众号列表初始化 获取数据
        queryWeChat().done(function(data, textStatus, jqXHR) {
                if (("errorcode" in data) && (data.errorcode != 0)) {
                    return;
                }
                var WeChartList = [];
                var WeChartArr = data.data || [];
                WeChartArr.forEach(function(WeChartAccount) {
                    WeChartList.push(WeChartAccount.name)
                });
                $("#WeChartList").singleSelect("InitData", WeChartList);
        })
        // 查询页面模板的接口 发布模板列表初始化 选择页面模板列表的初始化
        queryLoginPage().done(function(data, textStatus, jqXHR) {
            if (("errorcode" in data) && (data.errorcode != 0)) {
                return;
            }
            var loginPageList = [];
            var loginPageArr = data.data || [];
            loginPageArr.forEach(function(loginPage) {
                loginPageList.push(loginPage.themeName);
            })
            $("#LoginPageList").singleSelect("InitData", loginPageList);
        })

        $("#ensure").click(function(){
            updataSSID().done(function(data, textStatus, jqXHR) {
                synSSID();//在这里调用了showssid()方法
                // if (data.communicateResult == "success" && data.serviceResult == "success") {
                //     if (!data.deviceResult[0].errMsg == "") {
                        
                //         return;
                //     }
                // }
            })

            $("#ensure").attr("disabled","disabled");
            if($("#cipherSuite input:last").attr("checked")){
                if($("#restByte").val()==""){
                    $("#restByte").addClass("text-error");
                    $("#restByte_error").css("display","inline-block");
                    $("#ensure").removeAttr("disabled");
                    $("#ensure").attr("enabled","enabled");
                    return;
                }
            }else{
                $("#ensure").removeAttr("disabled");
            }

             
        });
        $("#cancel").click(function(){
             history.back();
        })
        
    }

    function initForm() {
        $("input[name=StType],input[name=AccPwdStaff]").bind("change", function() {
            var aContent = $(this).attr("content");
            var sCtrlBlock = $(this).attr("ctrlBlock") || "";
            $(sCtrlBlock).hide();

            if (!aContent) return true;

            aContent = aContent.split(",");
            for (var i = 0; i < aContent.length; i++) {
                if (!aContent[i]) continue;
                $(aContent[i]).show();
            }
            $("input[name=AccPwdCorpo]").MRadio("setValue", '2', true);
            $("input[name=AccPwdStaff]").MRadio("setValue", '2');
        });
        //下面这句话是为了让按钮点击和关闭的时候能把下面的东西去掉
        $(".switch,#impose_auth").bind("minput.changed", function(e, data) {
            var sClass = $(this).attr("ctrlBlock");
            this.checked ? $(sClass).show() : $(sClass).hide();
        });
        //下面这句话是让你选择模板的时候能把隐藏的各项全拿出来
        $("input[name=AuthenType], input[name=LoginPage]").bind("change", function() {
            var aContent = $(this).attr("content");
            var sCtrlBlock = $(this).attr("ctrlBlock") || "";
            $(sCtrlBlock).hide();
            if (!aContent) return true;
            aContent = aContent.split(",");
            for (var i = 0; i < aContent.length; i++) {
                if (!aContent[i]) continue;
                $(aContent[i]).show();
            }
        });

        $("#impose_auth_time").bind("change", function() {
            var value = $(this).val();
            if (value > 30) {
                $(this).val(30);
            } else if (value < 1) {
                $(this).val(1)
            }
        });

    }

    function initGrid() {
        // $("#securityIE").css("display","none");
        $("#cipherKey_out").css("display","none");
        $("#cipherSuite_true").click(function(){
            // $("#securityIE").css("display","block");
            $("#cipherKey_out").css("display","block"); 
        });

        $("#cipherSuite_false").click(function(){
            // $("#securityIE").css("display","none");
            $("#cipherSuite_right").html("是否加密"); 
            $("#cipherKey_out").css("display","none"); 
        })
        $("#restByte").blur(function(){
            if($("#restByte").val()==""){
                $("#restByte").addClass("text-error");
                $("#restByte_error").css("display","inline-block");
            }

        })
        $("#restByte").focus(function(){
                $("#restByte").removeClass("text-error");
                $("#restByte_error").css("display","none");

        })
    }

    function _init() {
        $("#status span.radio-icon:first").removeClass("checked");
        $("#status span.radio-icon:last").removeClass("checked");

        g_oPara = Utils.Base.parseUrlPara();
        initGrid();
        initForm();
        initData();
    }

    function _resize(jParent) {}

    function _destroy() {
        console.log("destory**************");
        var obj = {};
        // Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Minput", "SList", "Form", "SingleSelect", "MSelect"],
        "utils": ["Base","Request","Device"],
    });

})(jQuery);;