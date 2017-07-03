/* global Frame */
/* global FrameInfo */
/**
 * Created by Administrator on 2015/11/26.
 */
(function ($)
{
    var MODULE_NAME = "p_serviceset.index";
    var MODULE_BASE ="p_serviceset";
    var g_Radios, g_PercentMax = 100;
    g_aAPlist = [];
    oapname_SN = {};
    
    // 对Date的扩展，将 Date 转化为指定格式的String   
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
    // 例子：   
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
    Date.prototype.format = function(fmt)   { //author: meizz   
        var o = {   
            "M+" : this.getMonth()+1,                 //月份   
            "d+" : this.getDate(),                    //日   
            "h+" : this.getHours(),                   //小时   
            "m+" : this.getMinutes(),                 //分   
            "s+" : this.getSeconds(),                 //秒   
            "q+" : Math.floor((this.getMonth()+3)/3), //季度   
            "S"  : this.getMilliseconds()             //毫秒   
        };   
        if(/(y+)/.test(fmt))   
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
        for(var k in o)   
            if(new RegExp("("+ k +")").test(fmt))   
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
        return fmt;   
    }
   

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName).split(",");
    }
    
    function getDeviceInfo(){
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/getDeviceInfo",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "tenant_name": FrameInfo.g_user.attributes.name,
                "dev_snlist":[FrameInfo.ACSN]
            })
        });
    }
    
    //添加发布模版
    function addPubMng(pubMngName, shopName, ssidName, WeChart, authCfg, loginPage){
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/pubmng/add",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                ownerName: FrameInfo.g_user.attributes.name,
                name: pubMngName||"",
                shopName: shopName||"",
                ssidName: ssidName||"",
                weixinAccountName: WeChart||"",
                authCfgName: authCfg||"",
                themeTemplateName: loginPage||""
            })
        });
    }
    //修改发布模版
    function modPubMng(pubMngName, WeChart, authCfgName, loginPage,unauthtime){
        var date = new Date();
        var shopName = Utils.Device.deviceInfo.shop_name;
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/pubmng/modify",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                ownerName: FrameInfo.g_user.attributes.name,
                name: pubMngName,
                shopName: shopName,
                weixinAccountName: WeChart,
                authCfgName: authCfgName,
                themeTemplateName: loginPage,
                description: "modified at "+date.format("yyyy-MM-dd hh:mm:ss"),
                 uamAuthParamList:[
                    {authParamName:"NO_SENSATION_TIME",authParamValue:unauthtime},
                    {authParamName:"ONLINE_MAX_TIME",authParamValue:21600},
                    {authParamName:"URL_AFTER_AUTH",authParamValue:""},
                    {authParamName:"IDLE_CUT_TIME",authParamValue:30},
                    {authParamName:"IDLE_CUT_FLOW",authParamValue:10240}
                ]
            })
        });
    }
    //删除发布模版
    function delPubMng(pubMngName){
        var shopName = Utils.Device.deviceInfo.shop_name;
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/pubmng/delete",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                ownerName: FrameInfo.g_user.attributes.name,
                name: pubMngName||"",
                shopName: shopName
            })
        });
    }
    //发布 发布模版
    function PublishPubMng(pubMngName, isPublish){
        var shopName = Utils.Device.deviceInfo.shop_name;
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/pubmng/publish",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                ownerName: FrameInfo.g_user.attributes.name,
                name: pubMngName||"",
                shopName: shopName,
                isPublish: isPublish //true or false
            })
        })
    }
    
    //创建页面模版
    function addLoginPage(themeName){
        var date = new Date(); 
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/themetemplate/add",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                ownerName: FrameInfo.g_user.attributes.name,
                themeName: themeName,
                description: "modified at "+date.format("yyyy-MM-dd hh:mm:ss")  
            })
        });
    }
    //创建认证模版
    function addAuthPub(authPubName, authType, enableMsg, enableWeChart, enableAccount,enableWechatWifI, nauthParamValue){
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/authcfg/add",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                ownerName: FrameInfo.g_user.attributes.name,
                authCfgTemplateName: authPubName,
                authType: authType,
                isEnableSms: enableMsg,
                isEnableWeixin: enableWeChart,
                isWeixinConnectWifi:enableWechatWifI,
                isEnableAli: 0,
                isEnableAccount: enableAccount,
                isEnableQQ: 0,
                uamAuthParamList: [
                    {authParamName: "ONLINE_MAX_TIME", authParamValue: "21600"},
                    {authParamName: "URL_AFTER_AUTH", authParamValue: ""},
                    {authParamName: "IDLE_CUT_TIME", authParamValue: "30"},
                    {authParamName: "IDLE_CUT_FLOW", authParamValue: "10240"},
                    {authParamName: "NO_SENSATION_TIME", authParamValue: nauthParamValue}
                ]
            })
        });
    }
    
    //显示SSID
    function showSSID(oRowdata, sName){
        function onCancel()
        {
            console.log("finish")
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            return true;
        }
        // function operatePubMng(loginPage, authCfg){//3.选登录模板 更改发布模板 
        //     if (!oRowdata.pubMngName||!("pubMngName" in oRowdata)){//发布模板不存在 创建发布模板
        //         getDeviceInfo().done(function(data, textStatus, jqXHR){
        //             if (data.dev_list.length <= 0){
        //                 return ;//无法获取场所列表
        //             }
        //             var shopName = data.dev_list[0].shop_name;
        //             addPubMng(name, shopName, ssidName, WeChart, authCfg, loginPage).done(function(data, textStatus, jqXHR){
        //                 if (("errorcode" in data) && (data.errorcode != 0)){
        //                     return;
        //                 }
        //                 oRowdata.pubMngName = name;
        //                 oRowdata.WeChartList = WeChart;
        //                 oRowdata.AuthCfgList = authCfg;
        //                 oRowdata.LoginPageList = loginPage;
        //                 isPublishPubMng(name, true)
        //                     .done(function(data, textStatus, jqXHR){
        //                         if (("errorcode" in data) && (data.errorcode != 0)){
        //                             return;//发布失败
        //                         }
        //                         Frame.Msg.info(getRcText("PUB_SUCC"));//发布成功
        //                     });
        //                 onSuccess();
        //             });
        //         });
        //     }
        //     else {//修改发布模板
        //         var pubMng = oRowdata.pubMngName;
        //         modPubMng(pubMng, WeChart, authCfg, loginPage).done(function(data, textStatus, jqXHR){
        //             if (("errorcode" in data) && (data.errorcode != 0)){
        //                 return; 
        //             }
        //             isPublishPubMng(pubMng, false).done(function(data, textStatus, jqXHR){
        //                 if (("errorcode" in data) && (data.errorcode != 0)){
        //                      return;
        //                 }
        //                 isPublishPubMng(pubMng, true).done(function(data, textStatus, jqXHR){
        //                     if (("errorcode" in data) && (data.errorcode != 0)){
        //                         return ;
        //                     }
        //                     Frame.Msg.info(getRcText("PUB_SUCC"));//发布成功
        //                     onSuccess();
        //                 })
        //             });
        //         });
        //     }
        // }

        function onSuccess(){
                if(sName == "edit")
                {
                    Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                }
                Utils.Base.refreshCurPage();
        }

        function onSubmitSSID(){

            function operatePubMng(loginPage, authCfg){//3.选登录模板 更改发布模板 
                if (!oRowdata.pubMngName||!("pubMngName" in oRowdata)){//发布模板不存在 创建发布模板
                    getDeviceInfo().done(function(data, textStatus, jqXHR){
                        if (data.dev_list.length <= 0){
                            return ;//无法获取场所列表
                        }
                        var shopName = data.dev_list[0].shop_name;
                        addPubMng(name, shopName, ssidName, WeChart, authCfg, loginPage).done(function(data, textStatus, jqXHR){
                            if (("errorcode" in data) && (data.errorcode != 0)){
                                return;
                            }
                            oRowdata.pubMngName = name;
                            oRowdata.WeChartList = WeChart;
                            oRowdata.AuthCfgList = authCfg;
                            oRowdata.LoginPageList = loginPage;
                            PublishPubMng(name, true)
                                .done(function(data, textStatus, jqXHR){
                                    if (("errorcode" in data) && (data.errorcode != 0)){
                                        return;//发布失败
                                    }
                                    Frame.Msg.info(getRcText("PUB_SUCC"));//发布成功
                                    onSuccess();
                                });
                            
                        });
                    });
                }
                else {//修改发布模板
                    var pubMng = oRowdata.pubMngName;
                    modPubMng(pubMng, WeChart, authCfg, loginPage,unauthtime).done(function(data, textStatus, jqXHR){
                        if (("errorcode" in data) && (data.errorcode != 0)){
                            return; 
                        }
                        if(oRowdata.isPublished == 0)
                        {
                            PublishPubMng(pubMng, true).done(function(data, textStatus, jqXHR){
                                if (("errorcode" in data) && (data.errorcode != 0)){
                                    return;
                                }
                                Frame.Msg.info(getRcText("PUB_SUCC"));//发布成功
                                onSuccess();
                            });
                        }
                        else if(oRowdata.isPublished == 1)
                        {
                            Frame.Msg.info(getRcText("PUB_SUCC"));//发布成功
                            onSuccess();
                        }

                    });
                }
            }
            var date = new Date(); 
            var authType = $("input[name=AuthenType]:checked").attr("id");
            var loginType = $("input[name=LoginPage]:checked").attr("id");
            var WeChart = $("#WeChartList").val();
            var ssidName = oRowdata.SSID || $("#SSID",jFormSSID).val();
            var authCfg = $("#AuthCfgList").val();
            var loginPage = $("#LoginPageList").val();
            var time=Frame.DataFormat.getStringTime(new Date());
            var unauthtime = $("#auto_study_enable").attr("checked") ? $("#impose_auth_time").val() : "0";
            // console.log("time:::"+time);
            var name = "";
            if(ssidName.length>15){
                name = ssidName.replace(/\s+/g,"").slice(0,15);
            }else{
                name = ssidName;
            }
             name =name+time;

            if (authType == "AT1"){//1.不认证 删除发布模板 取消发布
                if (!("pubMngName" in oRowdata)){//发布模板不存在
                    Frame.Msg.info(getRcText("DEL_PUB_SUCC"));
                    onSuccess();
                    return ;
                }
                delPubMng(oRowdata.pubMngName).done(function(data, textStatus, jqXHR){
                    if (("errorcode" in data) && (data.errorcode != 0)){
                        Frame.Msg.info(getRcText("DEL_AUTH_FAIL"),"error");//失败哦
                        onSuccess();
                    }
                    Frame.Msg.info(getRcText("DEL_PUB_SUCC"));//发布成功
                    onSuccess();
                })
            }
            else if ((authType == "AT2") || (authType == "AT3")){//2.gm 创建新的登录模板
                var authType = (authType == "AT2" ? 1 : 2);//at2 一键上网 at3 账号登陆
                var enableMsg = ($("#Message").is(":checked") ? 1 : 0);
                var enableWeChart = ($("#WeChart").is(":checked") ? 1 : 0);
                var enableAccount = ($("#FixAccount").is(":checked") ? 1 : 0);
                var enableWechatWifI = ($("#isWeChatWifi").is(":checked") ? 1 : 0);
                var nauthParamValue = $("#auto_study_enable").MCheckbox("getState") ? $("#impose_auth_time",jFormSSID).val() : "0";

                addAuthPub(name, authType, enableMsg, enableWeChart, enableAccount,enableWechatWifI, nauthParamValue).done(function(data, textStatus, jqXHR){
                    if (("errorcode" in data) && (data.errorcode != 0)){
                        return ;
                    }
                    authCfg = name;
                    if (loginType == "LP4"){
                        operatePubMng(loginPage, authCfg);
                    }
                    else {
                        //创建新的页面模板
                        addLoginPage(name).done(function(data, textStatus, jqXHR){
                            if (("errorcode" in data) && (data.errorcode != 0)){
                                return ;
                            }
                            loginPage = name;
                            operatePubMng(loginPage, authCfg);
                        })
                    } 
                }); 
            }
            else if (authType == "AT4"){
                if (loginType == "LP4"){
                    operatePubMng(loginPage, authCfg);
                }
                else {
                    //创建新的页面模板
                    addLoginPage(name).done(function(data, textStatus, jqXHR){
                        if (("errorcode" in data) && (data.errorcode != 0)){
                            return ;
                        }
                        loginPage = name;
                        operatePubMng(loginPage, authCfg);
                    })
                } 
            }
            //onSuccess();
        }

        var jFormSSID = $("#toggle_form"), sType, sStName;
        var CurrentPercent = oRowdata || {};
        CurrentPercent = CurrentPercent.Percent || 0;
        CurrentPercent = g_PercentMax + CurrentPercent*1;
        $("#percentMax").html(CurrentPercent);
        $("#Percent").attr("max",CurrentPercent);
        CurrentPercent >= 1 ? $("#Percent_Block").show() : $("#Percent_Block").hide();
        if(sName == "add") //Add
        {
            sType = "create";
            sStName = Frame.Util.generateID("ST");
            var jDlg = $("#AddSsidDlg");
            if(jDlg.children().length)
            {
                $("#ssidToggle").show().insertAfter($(".modal-header",jDlg));
            }
            else
            {
                $("#ssidToggle").show().appendTo(jDlg);
            }
            $("#SSID",jFormSSID).attr("readonly",false);
            jFormSSID.form("init", "edit", {"title":getRcText("ADD_TITLE"),"btn_apply": onSubmitSSID});
            jFormSSID.form("updateForm",{
                SSID : "",
                StType : "1",
                UserIsolation : "false"
            });
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
        }
        else //Edit
        {
            sType = "merge";
            sStName = oRowdata.Name;

            jFormSSID.form ("init", "edit", {"btn_apply": onSubmitSSID, "btn_cancel":onCancel});
            
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            if(oRowdata.auto_study_enable == false)
            {
                $("#auto_study_enable", jFormSSID).MCheckbox("setState",false);
                $(".Learn-MAC", jFormSSID).hide();
            }
            else
            {
                $("#auto_study_enable").MCheckbox("setState",true);
                $(".Learn-MAC", jFormSSID).show();
            }
        }
    }
    //删除SSID
    function deleteSSID(sDevsn, spname)
    {
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/deleteSSID",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                user_name:FrameInfo.g_user.attributes.name,
                dev_sn:sDevsn,
                sp_name: spname
            })
        })
    }
    //获取SSID关联的AP以及AP下的radio
    function getSSIDBindingInfo(sDevsn, spname)
    {
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/getSSIDBindingInfo",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                user_name:FrameInfo.g_user.attributes.name,
                dev_sn:sDevsn,
                sp_name: spname
            })
        })
    }
    //将SSID从AP上解绑
    function unbindSSIDFromAp(sDevsn, spname, ap_sn)
    {
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/unbindSSIDFromAp",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                user_name:FrameInfo.g_user.attributes.name,
                dev_sn:sDevsn,
                ap_sn:ap_sn,
                sp_name: spname
            })
        })
    }
    //获取SSIDList
    function loginSSIDList(){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                configType : 1,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method : "SSidListGet",
                param : {devSN:FrameInfo.ACSN}
            })
        })
    }
    //将SSID从AP组中解绑
    function SSIDUnbindByAPGroup(stName){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method : "SSIDUnbindByAPGroup",
                param : [
                {
                    apGroupName:"default-group",
                    apModelName:"WAP712",
                    radioId : 1,
                    stName : stName,
                    vlanId  : 1  
                },
                {
                    apGroupName:"default-group",
                    apModelName:"WTU430",
                    radioId : 1,
                    stName : stName,
                    vlanId  : 1 
                },
                {   
                    apGroupName:"default-group",
                    apModelName:"WAP712",
                    radioId:2,
                    stName : stName,
                    vlanId  : 1

                },
                {   
                    apGroupName:"default-group",
                    apModelName:"WTU430",
                    radioId:2,
                    stName : stName,
                    vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722E",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722E",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722S",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722S",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712C",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712C",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    }
                ]

            })
        }); 
    }
    //删除
    function  SSIDDelete(stName){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method : "SSIDDelete",
                param : [
                    {stName: stName}
                ]

            })
        }); 
    }

    function onDelSSID(oData)
    {
        getSSIDInfo().done(function(data, textStatus, jqXHR){
        if(!data)
            {
                return;
            }
        var stNameList = {}
        var ssidName = oData.SSID;
        var ssidList = data.ssid_list;
        $.each(ssidList,function(key,value){
            stNameList[value.ssid_name] = value.sp_name;
        });
        var stName = stNameList[ssidName];
        SSIDUnbindByAPGroup(stName).done(function(data, textStatus, jqXHR){
            if(data.communicateResult == "success" && data.serviceResult == "success")
            {
                SSIDDelete(stName).done(function(data, textStatus, jqXHR){
                   if (("errorcode" in data) && (data.errorcode != 0)){
                        Frame.Msg.info(getRcText("DEL_FAIL"),"error");
                        return;
                    } 
                    else
                    {
                        queryPubMng().done(function(data, textStatus, jqXHR){
                            if(("errorcode" in data) && (data.errorcode != 0)){
                                return;
                            }else if(data.data.length >0 && data.errorcode ==0)
                                {
                                    var pubmng_list = data.data;
                                    for(var i=0;i<pubmng_list.length;i++)
                                    {
                                        if(pubmng_list[i].name && pubmng_list[i].ssidName == ssidName && pubmng_list[i].isPublished=="1")
                                        {
                                            PublishPubMng(pubmng_list[i].name, false)
                                                .done(function(data, textStatus, jqXHR){
                                                    if (data.errorcode==0)
                                                    {
                                                        delPubMng(pubmng_list[i].name).done(function(data, textStatus, jqXHR){
                                                            if (("errorcode" in data) && (data.errorcode != 0)){
                                                                Frame.Msg.info(getRcText("DEL_FAIL"),"error");//失败哦
                                                                onSuccess();
                                                            }
                                                            Frame.Msg.info(getRcText("DEL_SUCCESS"));
                                                            synSSID();//发布成功
                                                            // onSuccess();
                                                        })
                                                    }
                                                    // Frame.Msg.info(getRcText("PUB_SUCC"));//发布成功
                                                    // onSuccess();
                                                });
                                        }else if(pubmng_list[i].ssidName == ssidName || pubmng_list[i].isPublished=="0" ){
                                            Frame.Msg.info(getRcText("DEL_SUCCESS"));
                                            synSSID();
                                        }
                                    }
                                }
                            else{
                                Frame.Msg.info(getRcText("DEL_SUCCESS"));
                                synSSID();
                            }
                        })
                    }
                })
            }
            else{
                Frame.Msg.info(getRcText("LINK_delete"),"error");
                Utils.Base.refreshCurPage();
                return; 
            }
        })
        
    })
    }

    function getSSIDInfo(){
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/getSSIDInfo",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                tenant_name: FrameInfo.g_user.attributes.name,
                dev_snlist: [FrameInfo.ACSN+""]
            })
        });
    }
    //查询发布管理
    function queryPubMng(data, textStatus, jqXHR){
        // console.log(data);
        var shopName = Utils.Device.deviceInfo.shop_name;
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path+"/pubmng/query?ownerName="+FrameInfo.g_user.attributes.name+"&shopName="+shopName,
            dataType: "json",
            contentType: "application/json"
        });
    }
    
    function queryAuthCfg(){
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path+"/authcfg/query?ownerName="+FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json"
        })
    }
    
    function queryLoginPage(){
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path+"/themetemplate/query?ownerName="+FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json",
        })
    }
    
    function queryWeChat(){
        return $.ajax({
            type: "GET",
            url: MyConfig.v2path+"/weixinaccount/query?ownerName="+FrameInfo.g_user.attributes.name,
            dataType: "json",
            contentType: "application/json",
        });
    }
    
    function refreshSSIDList(obj){
        var arr = [
            {
                 "AuthCfgList": "111120160606145335397"
                ,"AuthType": "一键上网"
                ,"AuthenType": "AT4"
                ,"LoginPage": "LP4"
                ,"LoginPageList": "111120160606145335397"
                ,"SSID": "1111"
                ,"WeChartList": undefined
                ,"authCfgName": "111120160606145335397"
                ,"auto_study_enable": false
                ,"isPublished": 0
                ,"loginPage": "111120160606145335397"
                ,"pubMngName": "111120160606145335397"
                ,"shopName": undefined
                ,"sp_name": "it52h"
                ,"ssidName": "1111"
                ,"ssid_name":"asdf"
                ,"status":"使能"
                ,"bindAP":"10"
                ,"bindAPGroup":"2"
            }
        ];
        // for (var a in obj){
        //     arr.push(obj[a]);
        // }
        $("#ssidList").SList ("refresh", arr);
    }
    
    function initData(jScope){
        //getSSIDInfo().done(queryPubmng).done(queryAuthCfg);
        var aAuthType = getRcText("AUTHEN_TYPE");
        var obj = {};
        //获取认证模板
        queryAuthCfg().done(function(data, textStatus, jqXHR){
            if (("errorcode" in data) && (data.errorcode != 0)){
                return;
            }
            var auth_list = data.data;
            var authcfgList = [];
            auth_list.forEach(function(authcfg){
                authcfgList.push(authcfg.authCfgTemplateName);
            });
            $("#AuthCfgList").singleSelect("InitData",authcfgList);

            getSSIDInfo().done(function(data, textStatus, jqXHR){
                if (!data){
                    return;
                }
                var ssid_list = data.ssid_list || [];
                ssid_list.forEach(function(ssid){
                    var SSID = ssid.ssid_name || ssid.ssid;
                    obj[SSID] = {//设置初始值
                        SSID: SSID,
                        sp_name: ssid.sp_name,
                        AuthenType: "AT1",//不认证
                        LoginPage: "LP1", //简约
                        AuthType:aAuthType[0]
                    };
                });

                queryPubMng().done(function(data, textStatus, jqXHR){
                    if (("errorcode" in data) && (data.errorcode != 0)){
                        return;
                    }
                    var pubmng_list = data.data || [];
                    pubmng_list.forEach(function(pubmng){
                        if (!("ssidName" in pubmng)){
                            delPubMng(pubmng.name).done(function(data){
                                console.log("delet other pubmng")
                            });
                            return;
                        }
                        if (!(pubmng.ssidName in obj)){
                            delPubMng(pubmng.name).done(function(data){
                                console.log("delet other pubmng")
                            });
                            return;
                        }

                        //这里应该可以优下
                        var ssid = pubmng.ssidName;//obj[pubmng.ssidName];
                        obj[ssid].pubMngName = pubmng.name;
                        obj[ssid].isPublished = pubmng.isPublished;
                        obj[ssid].shopName = pubmng.shopname;
                        obj[ssid].ssidName = pubmng.ssidName;
                        obj[ssid].WeChartList = pubmng.weixinAccountName;
                        obj[ssid].authCfgName = pubmng.authCfgName;
                        obj[ssid].loginPage = pubmng.themeTemplateName;
                        //====for show===
                        obj[ssid].AuthenType = "AT" + (pubmng.authCfgName?4:0);//认证模板
                        obj[ssid].AuthCfgList = pubmng.authCfgName;
                        obj[ssid].LoginPage = pubmng.themeTemplateName?"LP4":"LP1"//页面模板
                        obj[ssid].LoginPageList = pubmng.themeTemplateName;
                        //====for show===
                        auth_list.forEach(function(authmsg){
                            if(authmsg.authCfgTemplateName == pubmng.authCfgName)
                            {
                                obj[ssid].AuthType = aAuthType[authmsg.authType];//slist 显示用
                                if(authmsg.uamAuthParamList[4].authParamValue == "0")
                                {
                                    obj[ssid].auto_study_enable = false;
                                }
                                else
                                {
                                    obj[ssid].auto_study_enable = true;
                                    obj[ssid].impose_auth_time = authmsg.uamAuthParamList[4].authParamValue;
                                }

                            }
                        })
                    });
                    refreshSSIDList(obj);
                })
            })
        });

        //微信公众号列表初始化
        queryWeChat().done(function(data, textStatus, jqXHR){
            if (("errorcode" in data) && (data.errorcode != 0)){
                return;
            }
            var WeChartList = [];
            var WeChartArr = data.data || [];
            WeChartArr.forEach(function(WeChartAccount){
                WeChartList.push(WeChartAccount.name)
            });
            $("#WeChartList").singleSelect("InitData",WeChartList);  
        })
        //发布模板列表初始化
        queryLoginPage().done(function(data, textStatus, jqXHR){
            if (("errorcode" in data) && (data.errorcode != 0)){
                return;
            }
            var loginPageList = [];
            var loginPageArr = data.data || [];
            loginPageArr.forEach(function(loginPage){
                loginPageList.push(loginPage.themeName);
            })
            $("#LoginPageList").singleSelect("InitData",loginPageList);
        })
    }

    function addSSIDtoAC(sSSID_name,bStatus, bHide, bEncrypt,bPortal, nUpload, nDownload, sDevSnName, sPassword)
    {
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/addSSIDToAc",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                user_name: FrameInfo.g_user.attributes.name,
                dev_sn: sDevSnName || "",
                ssid_name: sSSID_name || "",
                password: sPassword,
                hiding: bHide,
                policy_status: bStatus,
                encrypt_status: bEncrypt,
                portal_policy_status: bPortal,
                upload_rate: nUpload || "0",
                download_rate: nDownload || "0"
            })
        });
    }

    function getDevStatus(sDevSnName){
        return $.ajax({
            type:"POST",
            url:MyConfig.v2path+"/getDevStatus",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                tenant_name:FrameInfo.g_user.attributes.name,
                dev_snlist:[sDevSnName]
            })
        });
    }


    function getAPInfos(){
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/getApInfosInAC",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                tenant_name: FrameInfo.g_user.attributes.name,
                dev_snlist: [FrameInfo.ACSN]
            })
        });
    }

    function bindSSIDtoAP(sDevSnName,ap_sn,spName)
    {
        return $.ajax({
            type: "POST",
            url: MyConfig.v2path+"/bindToApList",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                user_name: FrameInfo.g_user.attributes.name,
                dev_sn: sDevSnName || "",
                ap_snlist: ap_sn,
                sp_name:spName
            })
        });
    }

    function getApModel(){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "apmgr",
                deviceModule : "apmgr",
                method : "AddApGroupModel",
                param : [{apGroupName:"default-group",apModel:"WTU430"},
                        {apGroupName:"default-group",apModel:"WAP712"},
                    {apGroupName:"default-group",apModel:"WAP722"},
                    {apGroupName:"default-group",apModel:"WAP722E"},
                    {apGroupName:"default-group",apModel:"WAP722S"},
                    {apGroupName:"default-group",apModel:"WAP712C"}]

            })
        });  
    }
    function getRandomString(len) {  
        len = len || 32;  
        var $chars = 'abcdefhijkmnprstwxyz2345678';  
        var maxPos = $chars.length;  
        var pwd = '';  
        for (i = 0; i < len; i++) {  
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));  
        }  
        return pwd;  
    } 
    function portalEnable_1(stName){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "portal",
                deviceModule : "portal",
                method : "setSimpleConfig",
                param : [
                        {
                            stname:stName,
                            enable:1,
                            webserver:"lvzhou-server",
                            domain:"cloud"
                        }]

            })
        });  
    }
    function SSIDUpdate_2(sStName,sSSID_name,bStatus,bHide,bEncrypt,nMaxSendRatio,nmaxReceiveRatio)
    {
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method: "SSIDUpdate",
                param:[{
                    stName: sStName || "",
                    ssidName: sSSID_name || "",
                    description: "1",
                    status: bStatus,
                    hideSSID: bHide,
                    cipherSuite: bEncrypt,
                    maxSendRatio: nMaxSendRatio,
                    maxReceiveRatio: nmaxReceiveRatio
                }]
               
            })
        })


    }
    function bingSSIDByAPgroup(stName){
        return $.ajax({
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN : FrameInfo.ACSN,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method : "SSIDBindByAPGroup",
                param :[ 
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712",
                        radioId         :   1,
                        stName       :   stName,
                        vlanId:1
                     },
                     {
                        apGroupName:"default-group",
                        apModelName:"WTU430",
                        radioId         :   1,
                        stName       :   stName,
                         vlanId:1
                     },
                     {
                        apGroupName:"default-group",
                        apModelName:"WAP712",
                        radioId         :   2,
                        stName       :   stName,
                         vlanId:1
                     },
                     {
                        apGroupName:"default-group",
                        apModelName:"WTU430",
                        radioId         :   2,
                        stName       :   stName,
                         vlanId:1
                     },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722E",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722E",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722S",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP722S",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712C",
                        radioId : 1,
                        stName : stName,
                        vlanId  : 1
                    },
                    {
                        apGroupName:"default-group",
                        apModelName:"WAP712C",
                        radioId:2,
                        stName : stName,
                        vlanId  : 1

                    }
                 ]
            })
        });  
    }            
    function onCfgAddSsid()
    {
        getApModel().done(function(data, textStatus, jqXHR){
            if(data.communicateResult == "fail" ||data.serviceResult == "fail"){
                onCancelAddSsid();
                Frame.Msg.info(getRcText("LINK"),"error");
                Utils.Base.refreshCurPage();
                return;
            }
            var i = 0 ;
            $.each(data.deviceResult,function(key,v){
                if(v.result&& v.result == "success"){
                    i++;
                }
            })
            if(i == 0){
                onCancelAddSsid();
                Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                Utils.Base.refreshCurPage();
                return;
            }
            var stName = getRandomString(5);
            if(data.communicateResult == "success" && data.serviceResult == "success")
            {
                var addForm = $("#AddSsidForm");
                var sStName = stName;
                var sSSID_name = $("#ssid_name", addForm).val().trim();
                if(sSSID_name == ""){
                    Frame.Msg.info(getRcText("ADD_NULL_SSID"),"error");
                    return ;
                }
                // var bStatus = Number($(":input[name=status]", addForm).MRadio("getValue"));
                var bStatus = 1;
                // var bHide = Number($(":input[name=hideSSID]", addForm).MRadio("getValue"));
                var bHide = 0;
                // var bEncrypt =Number($(":input[name=cipherSuite]", addForm).MRadio("getValue"));
                var bEncrypt = 0;
                // var portal = Number($(":input[name=portal_policy_status]", addForm).MRadio("getValue"));
                var portal = 1;
                // var nMaxSendRatio = Number($("#maxSendRatio", addForm).val());
                var nMaxSendRatio = 0;
                // var nmaxReceiveRatio = Number($("#maxReceiveRatio", addForm).val());
                var nmaxReceiveRatio = 0;
                if(portal == 0)
                {
                    portalEnable_0(sStName).done(function(data, textStatus, jqXHR){
                         if(("errorcode" in data) && (data.errorcode != 0)){
                            return;
                        }                       
                    })
                    
                }
                else
                {
                    portalEnable_1(sStName).done(function(data, textStatus, jqXHR){
                         if(data.communicateResult == "fail" && data.serviceResult == "fail"){
                             onCancelAddSsid();
                            Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                            return;
                        } 
                    })
                }
                if(bEncrypt == "16")
                {
                    var sPsk = $("#psk", addForm).val();
                    var bMode = 1;
                    var bSecurity = 1;
                    
                    SSIDUpdate(sStName,sSSID_name,bStatus, bHide, bEncrypt,sPsk, bMode, bSecurity,
                    nMaxSendRatio, nmaxReceiveRatio).done(function(data, textStatus, jqXHR){
                    if(data.communicateResult == "success" && data.serviceResult == "success")
                        bingSSIDByAPgroup(stName).done(function(data, textStatus, jqXHR){
                            var j = 0 ;
                            $.each(data.deviceResult,function(key,v){
                                if(v.result&& v.result == "success"){
                                    j++;
                                }
                            })
                            if(j == 0){
                                onCancelAddSsid();
                                Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                                Utils.Base.refreshCurPage();
                                return;
                            }

                            if(data.communicateResult == "success" && data.serviceResult == "success")
                            {
                                onCancelAddSsid();
                                Frame.Msg.info(getRcText("ADD_SUCCESS"));
                                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
                                Utils.Base.refreshCurPage();
                            }

                        })
                    })
                }
                else
                {
                    SSIDUpdate_2(sStName,sSSID_name,bStatus, bHide, bEncrypt,nMaxSendRatio,nmaxReceiveRatio).done(function(data, textStatus, jqXHR){
                        if(data.communicateResult == "success" && data.serviceResult == "success"
                            &&data.deviceResult[0].result == "success" )
                        {
                            if(!data.deviceResult[0].errMsg ==""){
                                onCancelAddSsid();
                                Frame.Msg.info(getRcText("ADD_Limit"),"error");
                                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
                                // Utils.Base.refreshCurPage();
                                return;
                            }
                            bingSSIDByAPgroup(stName).done(function(data, textStatus, jqXHR){
                                if(data.communicateResult == "success" && data.serviceResult == "success")
                                {
                                    onCancelAddSsid();
                                    Frame.Msg.info(getRcText("ADD_SUCCESS"));
                                    synSSID();
                                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
                                    //Utils.Base.refreshCurPage();
                                }else{
                                    onCancelAddSsid();
                                    Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
                                    Utils.Base.refreshCurPage();
                                }

                            })
                        }
                        else{
                            onCancelAddSsid();
                            Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
                            Utils.Base.refreshCurPage();
                        }
                    })
                }
                

               
            }
        }) 
    }    
    function onCancelAddSsid()
    {
        $("input[type=text]",$("#AddSsidForm")).each(function() {
                Utils.Widget.setError($(this),"");
        });
        $("#AddSsidForm").form("updateForm",{
            ssid_name: "",
            password: "",
            hiding: 0,
            policy_status: 0,
            encrypt_status: 0,
            portal_policy_status: 0,
            upload_rate: "",
            download_rate: ""
        })
        Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddSsidForm")));
    }

    function showLinkAP(row, cell, value, columnDef, dataContext, type) {
        value = value || "";

        if ("text" == type) {
            return value;
        }
        return '<a class="list-link" type="apName" cell="' + cell + '"' + ' ApName="' + dataContext.sp_name + '">' + value + '</a>';

    }

    function showLinkAPGroup(row, cell, value, columnDef, dataContext, type) {
        value = value || "";

        if ("text" == type) {
            return value;
        }
        return '<a class="list-link" type="apGroup" cell="' + cell + '"' + ' ApName="' + dataContext.sp_name + '">' + value + '</a>';

    }

    function onDisDetailAP() {
        var ApNames = $(this).attr("ApName");
        var type = $(".list-link").attr("type");
        if ($(this).attr("type") == "apName") {
            // var oData = g_oTableData[ApNames];
            // $("#flowdetail_listAP").SList("resize");
            // // showWirelessInfo(oData);
            // Utils.Base.updateHtml($("#view_client_form"), oData);
            var shuju=[
                   {
                    "apName":"ap1",
                    "apModel":"20-12-15A",
                    "apSN":"WA2158",
                    "apGroupName":"否"
                   
                   },
                   {
                    "apName":"ap2",
                    "apModel":"20-12-15B",
                    "apSN":"WA0547",
                    "apGroupName":"否"
                   }
            ];
            $("#flowdetail_listAP").SList ("refresh", shuju);
            Utils.Base.openDlg(null, {}, {scope: $("#TerminalInfoDlgAP"),className: "modal-super"});
        } else {
            $("#ssidList").on('click', 'a.list-link', onDisDetailAPGroup);
        }

    }

    function onDisDetailAPGroup() {
        var ApNames = $(this).attr("ApName");
        var type = $(".list-link").attr("type"); //永远返回apName
        if ($(this).attr("type") == "apGroup") {
            // var oData = g_oTableData[ApNames];
            // $("#flowdetail_listAPGroup").SList("resize");
            // Utils.Base.updateHtml($("#view_client_form1"), oData);
             var apGroupshuju=[
                   {
                    "apName":"apGroup1",
                    "apGroupName":"否"
                    },
                    {
                    "apName":"apGroup2",
                    "apGroupName":"否"
                    }
            ];
            $("#flowdetail_listAPGroup").SList ("refresh", apGroupshuju);
            Utils.Base.openDlg(null, {}, {scope: $("#TerminalInfoDlgAPGroup"),className: "modal-super"});
        } else {
            $("#ssidList").on('click', 'a.list-link', onDisDetailAP);
        }
    }

    function onAddSSID()
    {
        var addForm = $("#AddSsidForm");
        addForm.form("init", "edit", {"title":getRcText("ADD_TITLE"), "btn_apply":onCfgAddSsid, "btn_cancel":onCancelAddSsid});
        Utils.Base.openDlg(null, null,{scope:$("#AddSsidDlg"), className:"modal-large"});
    }
    function deleteSSID(){

    }

    function synSSID(){
       // alert("异步请求成功");
        $.ajax({
            type: "GEt",
            url:MyConfig.v2path+"/syncAc?acsn="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            success:function(data){
               if(data&&data.error_code=="0"){
                    Utils.Base.refreshCurPage();
               }else{
                    Frame.Msg.info("同步失败","error");
                }
            },
            error:function(err){

            }

        })
    }

    function showAddUser(data) { //修改按钮
            //alert(1);
            var oUrlPara = {
                np: MODULE_BASE + ".detailinfo",
            };
             Utils.Base.redirect(oUrlPara);
    }

    function onDelSSID(){

    }

    function addblackShow(aRows) {
        // var bAddtoBlackshow = false;
        // if (aRows.length > 0) {
        //     for (var i = 0; i < aRows.length; i++) {
        //         if (aRows[i].isBlackUser == true) {
        //             return false;
        //         }
        //     }
        //     return true;
        // }
        // return bAddtoBlackshow;
    }

    function bindAP(data) {
        // for (var i = 0; i < data.length; i++) {
        //     data[i].apGroupName = "是";
        //     if (data[i].apGroupName = "是") {
        //         Frame.Msg.info("配置成功");
        //     } else {
        //         Frame.Msg.error(data.errormsg);
        //     }
        // };

        // $("#flowdetail_listAP").SList("refresh");
        // $("#TerminalInfoDlgAP").modal("hide");
    }

    function bindAPGroup(data) {
        // for (var i = 0; i < data.length; i++) {
        //     data[i].apGroupName = "是";
        //     if (data[i].apGroupName = "是") {
        //         Frame.Msg.info("配置成功");
        //     } else {
        //         Frame.Msg.error(data.errormsg);
        //     }
        // };

        // $("#flowdetail_listAPGroup").SList("refresh");
        // $("#TerminalInfoDlgAPGroup").modal("hide");
    }

    function unbindAPGroup(data) {
        // for (var i = 0; i < data.length; i++) {
        //     if (data[i].apGroupName = "是") {
        //         data[i].apGroupName = "否";
        //         Frame.Msg.info("配置成功");
        //     }
        // };

        // $("#flowdetail_listAPGroup").SList("refresh");
        // $("#TerminalInfoDlgAPGroup").modal("hide");
    }

     function cancelAllAP() {
        $("#TerminalInfoDlgAP").modal("hide"); //让弹窗消失的按钮
    }

    function cancelAllAPGroup() {
        $("#TerminalInfoDlgAPGroup").modal("hide"); //让弹窗消失的按钮
    }

    function initGrid()
    {
        var optSsid = {
            colNames: getRcText ("ALLAP_HEADER2"),
            multiSelect: false,
            showOperation: true,
            multiSelect: true,
            colModel: [
                {name: "sp_name",datatype: "String",width: 80}, 
                {name: "ssid_name",datatype: "String",width: 80},
                {name: "AuthType",datatype: "String",width: 80}, 
                {name: "status",datatype: "String",width: 80}, 
                {name: "bindAP",datatype: "String",width: 80,formatter: showLinkAP}, 
                {name: "bindAPGroup",datatype: "String",width: 80,formatter: showLinkAPGroup}
            ],
            // onToggle : {
            //     action : showSSID,
            //     jScope : $("#ssidToggle"),
            //     BtnDel : {
            //         show : true,
            //         action : onDelSSID
            //     }
            // },
            buttons:[
                {name: "add", action: onAddSSID},
                {name: "del",value: "删除",action: deleteSSID,enable: 1},
                {name: "default",value:getRcText("SYN"),action: synSSID},
                {name: "edit",action: showAddUser}, 
                {name: "delete",action: Utils.Msg.deleteConfirm(onDelSSID),enable: 1}
            ]
        };

        var oSListAP = {
            height: "70",
            showHeader: true,
            multiSelect: true,
            pageSize: 5,
            colNames: getRcText("ALLAP_HEADER3"),
            colModel: [
                {name: "apName",datatype: "String"}, 
                {name: "apModel",datatype: "String"}, 
                // {name: "apSN",datatype: "String"}, 
                {name: "apGroupName",datatype: "String"}
            ],
            buttons: [{
                name: "bind",
                value: "绑定",
                enable: addblackShow,
                action: bindAP
            }, {
                name: "unBind",
                value: "去绑定",
                enable: addblackShow,
                action: unbindAPGroup
            }, {
                name: "cancel",
                value: "取消",
                enable: true,
                action: cancelAllAP
            }]
        };

        var oSListAPGroup = {
            height: "70",
            showHeader: true,
            multiSelect: true,
            pageSize: 5,
            colNames: getRcText("ALLAP_HEADER4"),
            colModel: [
                {name: "apName",datatype: "String"}, 
                {name: "apModel",datatype: "String"},
                {name: "apGroupName",datatype: "String"}
            ],
            buttons: [{
                name: "bind",
                value: "绑定",
                enable: addblackShow,
                action: bindAPGroup
            }, {
                name: "unBind",
                value: "去绑定",
                enable: addblackShow,
                action: unbindAPGroup
            }, {
                name: "cancel",
                value: "取消",
                enable: true,
                action: cancelAllAPGroup
            }]
        };

        $("#ssidList").SList ("head", optSsid);
        $("#flowdetail_listAP").SList("head", oSListAP);
        $("#flowdetail_listAPGroup").SList("head", oSListAPGroup);
        $("#ssidList").on('click', 'a.list-link', onDisDetailAP);
        $("#ssidList").on('click', 'a.list-link', onDisDetailAPGroup);

        $("#view_client_form").form("init", "edit", {"title": getRcText("APGROUP"),"btn_apply": false,"btn_cancel": false});
        $("#view_client_form1").form("init", "edit", {"title": getRcText("TERINFO"),"btn_apply": false,"btn_cancel": false});

        $("input[name=StType],input[name=AccPwdStaff]").bind("change",function(){
            var aContent = $(this).attr("content");
            var sCtrlBlock = $(this).attr("ctrlBlock") || "";
            $(sCtrlBlock).hide();
    
            if(!aContent) return true;
    
            aContent = aContent.split(",");
            for(var i=0;i<aContent.length;i++)
            {
                if(!aContent[i])continue;
                $(aContent[i]).show();
            }
            $("input[name=AccPwdCorpo]").MRadio("setValue",'2',true);
            $("input[name=AccPwdStaff]").MRadio("setValue",'2');
        });
        
        $(".switch,#impose_auth").bind("minput.changed",function(e,data){
            var sClass = $(this).attr("ctrlBlock");
            this.checked ? $(sClass).show() : $(sClass).hide() ;
        });

        $("input[name=AuthenType], input[name=LoginPage]").bind("change",function(){
            var aContent = $(this).attr("content");
            var sCtrlBlock = $(this).attr("ctrlBlock") || "";
            $(sCtrlBlock).hide();
            if(!aContent) return true;
            aContent = aContent.split(",");
            for(var i=0;i<aContent.length;i++)
            {
                if(!aContent[i])continue;
                $(aContent[i]).show();
            }
        });
        
        $("#impose_auth_time").bind("change", function(){
           var value = $(this).val();
           if (value > 30){
               $(this).val(30);
           }
           else if (value < 1){
               $(this).val(1)
           }
        });   
    }
    
    function initFrom(){
        $("#simpledraw").on("click",function(){
            Frame.Util.openpage(
                {
                    pageURL:"/o2o/uam/theme/20151202174326/draw.xhtml?templateId=1066&type=1",
                    height:"500px",
                    hotkeys:"no"
                })
        });
    }
    function _init ()
    {
        initGrid();
        initData();
        initFrom();
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_PercentMax = 100;
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form","MSelect"],
        "utils": ["Base","Device"]
    });

}) (jQuery);
