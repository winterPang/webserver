(function ($)
{
    var MODULE_NAME = "wireless.demo_index";
    var rc_info = "ws_ssid_rc", g_shopName, g_userName;
    var g_SsidInfo = {}; //toggle slist 获取打开一行内的
    var g_authcfgList = []; // 所有已有的认证模板
    var g_loginPageList = [];// 已有的页面模板
    var g_addSsidName; // 增加服务 用户输入的ssid_name
    var g_description; // 增加服务 用户选择的服务类型
    var g_name; //用作模板名称 保证唯一
    var g_supportModelArr;
    var g_WeChartList;
    var g_addSsidInfo; // 添加完成增加服务页面，同步后，获取的所有ssid 信息
    var hPending, pending;
    var g_StName;  

    function regDay(str)
    {
        var reg = /^([0-9]|[12][0-9]|30)$/; 
        return reg.test(str);
    }

    function password(str)
    {
        var reg = /^\w{8,63}$/;  
        return reg.test(str);
    }

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }

    function onCancelAddSsidCfg()
    {
        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidCfg")));
    }

    //发布 v2
    function isAddPublish(isPublish)
    {
        function isAddPublishSuc(data)
        {
            if(data.errorcode == 0)
            {
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidCfg")));
                //hPending.close(100);
                Frame.Msg.info(getRcText("CFG_OK"));
                addSynSSID();
            }
        }

        function isAddPublishFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_ONLYFAIL"),"error");
            console.log(err);

        }

        var isAddPublishOpt = {
            type: "POST",
            url: MyConfig.v2path + "/pubmng/publish",
            dataType: "json",
            contentType: "application/json",
            shopName:g_shopName,
            data: JSON.stringify({
                ownerName: g_userName,
                name: g_name,
                shopName: g_shopName,
                isPublish: true
            }),
            onSuccess: isAddPublishSuc,
            onFailed: isAddPublishFail
        }

        Utils.Request.sendRequest(isAddPublishOpt);
    }
    
    //增加发布模板 v2
    function addPub(addPublishOpt)
    {
        var pubData = {
            ownerName:g_userName,
            shopName:g_shopName,
            authCfgName:addPublishOpt.authCfgTemplateName,
            themeTemplateName:addPublishOpt.themeName,
        }

        if(addPublishOpt.addWeChartList)
        {
            pubData.weixinAccountName = addPublishOpt.addWeChartList;
        }

        var ssidIDOpt = {};

        g_addSsidInfo.forEach(function(ssid){
            
            var ssidName = ssid.ssidName;
            var add_SSID_List = ssid;

            if(add_SSID_List.stName == g_StName)
            {
                ssidIDOpt.ssidId = add_SSID_List.ssid;
            }
        })

        var url = MyConfig.v2path+"/pubmng/add";
        pubData.name = g_name;
        pubData.ssidName = g_addSsidName;
        pubData.ssidIdV3 = ssidIDOpt.ssidId;//ID
        pubData.description = "add autoName publishTemplate"
        
        function publishSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0)
            {
                isAddPublish(true);
            }
            else
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("CFG_ONLYFAIL"),"error");
            }
        }

        function publishFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_ONLYFAIL"),"error");
            console.log(err);
        }

        var pubOpt = {
            type: "POST",
            url: url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(pubData),
            onSuccess: publishSuc,
            onFailed: publishFail
        }

        Utils.Request.sendRequest(pubOpt);
    }

    //增加页面模板 v2
    function addTheme(addPublishOpt)
    {
        var url = MyConfig.v2path+"/themetemplate/add"
            var themeData = {
                ownerName:g_userName,
                themeName:g_name,
                v3flag:0,
                description:"auto themeTemplate"
            };
        addPublishOpt.themeName = g_name;

        function addThemeSuc(data)
        {
            console.log(data);
            if(data.errorcode == "0")
            {
                addPub(addPublishOpt);      
            }
        }

        function addThemeFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_ONLYFAIL"),"error");
            console.log(err);
        }
        var addThemeOpt = {
            type: "POST",
            url: url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(themeData),
            onSuccess: addThemeSuc,
            onFailed: addThemeFail
        }

        Utils.Request.sendRequest(addThemeOpt);
    }

    //增加认证模板 v2
    function addAuthCfg(ssidAuthInfo)
    {
        var addPublishOpt = {};
        if(ssidAuthInfo.addWeChartList)
        {
            addPublishOpt.addWeChartList = ssidAuthInfo.addWeChartList;
        }
          
        if(!ssidAuthInfo.add_ONLINE_MAX_TIME)
        {
            ssidAuthInfo.add_ONLINE_MAX_TIME = 360;     
        }

        ssidAuthInfo.add_URL_AFTER_AUTH = ssidAuthInfo.add_URL_AFTER_AUTH || "";   //如果获取不到url就下发一个空字符串
        
        if( !ssidAuthInfo.add_IDLE_CUT_TIME) 
        {
            ssidAuthInfo.add_IDLE_CUT_TIME = 30;
        }

        if(!ssidAuthInfo.add_IDLE_CUT_FLOW)
        {
            ssidAuthInfo.add_IDLE_CUT_FLOW = 10240;       
        }

        if( ssidAuthInfo.add_IDLE_CUT_TIME == 0)  //如果切断时长为0，则将切断流量置为默认值。
        {
            ssidAuthInfo.add_IDLE_CUT_FLOW = 10240;
        } 

        if(!ssidAuthInfo.add_unauthtime )   /* 解决添加认证模板时不成功的问题。因为这个字段获取不到所以添加判断 */
        {
            ssidAuthInfo.add_unauthtime = 7;
        }
        
        if(ssidAuthInfo.add_feelauth==0)
        {
            ssidAuthInfo.add_unauthtime = 0;
        }

        var authData = {
            ownerName:g_userName,
            authCfgTemplateName:g_name,
            authType:1,
            isEnableSms:0,
            isEnableWeixin:0,
            isEnableAccount:0,
            isWeixinConnectWifi:0,
            isEnableAli:0,
            isEnableQQ:0,
            v3flag:0,
            uamAuthParamList:[
                {authParamName:"ONLINE_MAX_TIME",authParamValue:ssidAuthInfo.add_ONLINE_MAX_TIME*60},
                {authParamName:"URL_AFTER_AUTH",authParamValue:ssidAuthInfo.add_URL_AFTER_AUTH},
                {authParamName:"IDLE_CUT_TIME",authParamValue:ssidAuthInfo.add_IDLE_CUT_TIME},
                {authParamName:"IDLE_CUT_FLOW",authParamValue:ssidAuthInfo.add_IDLE_CUT_FLOW},
                {authParamName:"NO_SENSATION_TIME",authParamValue:ssidAuthInfo.add_unauthtime}
            ]
        };

        addPublishOpt.authCfgTemplateName = g_name; 
        
        if ( ssidAuthInfo.authCfgTemplateName != "")
        {
            ssidAuthInfo.authCfgTemplateName = ssidAuthInfo.authCfgTemplateName;
        };

        if(ssidAuthInfo.addAuthenType == "AT3")
        {
            authData.authType = 2;
            if(ssidAuthInfo.addMessage = "true"){
                authData.isEnableSms = 1;    
            }
            if(ssidAuthInfo.addWeChart = "true")
            {
                authData.isEnableWeixin = 1;   
            }
            if(ssidAuthInfo.addFixAccount = "true")
            {
                authData.isEnableAccount = 1;   
            }
            if(ssidAuthInfo.addisWeChatWifi = "true")
            {
                authData.isWeixinConnectWifi = 1;   
            }
        }
        
        function addAuthCfgSuc(data)
        {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidCfg")));
            if(ssidAuthInfo.addLoginPage == "LP4")
            {
                addPublishOpt.themeName = ssidAuthInfo.addLoginPageList;
                addPub(addPublishOpt);
            }
            else if(ssidAuthInfo.addLoginPage == "LP1")
            {
                addTheme(addPublishOpt);
            }
        }

        function addAuthCfgFail()
        {
            console.log("fail");

        }

        var addAuthCfgOpt = {
            type: "POST",
            url: MyConfig.v2path + "/authcfg/add",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(authData),
            onSuccess: addAuthCfgSuc,
            onFailed: addAuthCfgFail
        }

        Utils.Request.sendRequest(addAuthCfgOpt);
    }
 
    //添加页面——认证配置
    function onAddSsidAuth()
    {
        //Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidCfg")));
        var oTempTable = {
            index:[],
            column:["addLoginPage", "addAuthenType", "add_impose_auth_time", "addWeChartList","add_feelauth","add_unauthtime",
                    "add_ONLINE_MAX_TIME","add_URL_AFTER_AUTH","add_IDLE_CUT_TIME","add_IDLE_CUT_FLOW",
                    "addMessage", "addWeChart", "addFixAccount", "addisWeChatWifi", "addLoginPageList","addAuthCfgList"]
        };
        var ssidAuthInfo = $("#AddSsidCfg").form ("getTableValue", oTempTable);//认证配置页面 用户输入的信息
        
        var addPublishOpt = {};

        if(ssidAuthInfo.addWeChartList)
        {
            addPublishOpt.addWeChartList = ssidAuthInfo.addWeChartList;
        }

        if(ssidAuthInfo.addAuthenType == "AT2" || ssidAuthInfo.addAuthenType == "AT3")
        {
            addAuthCfg(ssidAuthInfo);       
        } 
        else if(ssidAuthInfo.addAuthenType == "AT4")
        { 
            addPublishOpt.authCfgTemplateName = ssidAuthInfo.addAuthCfgList;
           
            if(ssidAuthInfo.addLoginPage == "LP4")
            {
                addPublishOpt.themeName = ssidAuthInfo.addLoginPageList;
                addPub(addPublishOpt);
            }
            else if(ssidAuthInfo.addLoginPage == "LP1")
            {
                addTheme(addPublishOpt);
            }       
        }
        else
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_OK"));  
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidCfg")));
            Utils.Base.refreshCurPage();
        }    
    }
    
    //获取SSID信息 v3
    function getSSIDInfo(ssidInfo, stName)
    {
        Pending.close(100);

        function getSSIDInfoSuc(data)
        {
            console.log("success")
            g_addSsidInfo = data.ssidList;

            if(ssidInfo.SSIDSFG == "1")
            {
                hPending.close(100);
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
                Utils.Base.refreshCurPage();
                //return;
            }
            else
            {
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
                var addForm = $("#AddSsidCfg"); 
                addForm.form("init", "edit", {"title":getRcText("ADD_WifiSerAuth")
                    ,"btn_apply":onAddSsidAuth
                    ,"btn_cancel":onCancelAddSsidCfg});
                Utils.Base.openDlg(null, null, {scope:$("#AddSsidDlgCfg"), className:"modal-large"} );    
            } 

        }

        function getSSIDInfoFail()
        {

        }

        var getSSIDInfoOpt = {
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN,
            contentType:"application/json",
            dataType:"json",
            onSuccess: getSSIDInfoSuc,
            onFailed: getSSIDInfoFail
        }

        Utils.Request.sendRequest(getSSIDInfoOpt);

    }
    
    //同步v3
    function  addSynSSIDV3(ssidInfo,stName)
    {

        function synSuc(data)
        {
            if(data.communicateResult == "fail")
            {
                hPending.close(200);
                Frame.Msg.info(getRcText("LINK"),"error");
               // Utils.Base.refreshCurPage();
                return;
            }

            var i = 0 ;
            $.each(data.deviceResult,function(key,v){
                if(v.result&& v.result == "success"){
                    i++;
                }
            })
            if(i == 0){
                hPending.close(200);
                Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                //Utils.Base.refreshCurPage();
                return;
            }

            if(data.result == "success" && data.serviceResult == "success")
            {
                if(data.errCode=="0")
                {
                    if(ssidInfo)
                    {
                        Pending = Frame.Msg.pending(getRcText("CFG_add_senting"));
                        getSSIDInfo(ssidInfo,stName);     
                    }
                    else
                    {
                        Utils.Base.refreshCurPage();    
                    }                 
                }
                else
                {
                    Frame.Msg.info(getRcText("SYN_FAIL"),"error"); 
                    Utils.Base.refreshCurPage();    
                }                 
            }

            
        }


        function synFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("SYN_FAIL"),"error");
            console.log(err);
        }
        var synOpt = {
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN:FrameInfo.ACSN,
                module : "stamgr",
                method : "SyncSSIDList",
                configType:0,
                cloudModule:"stamgr",
                deviceModule:"stamgr",
                param:[{}]
            }),
            onSuccess:synSuc,
            onFailed:synFail
        }
        Utils.Request.sendRequest(synOpt);
    }
    
    // 添加页面时同步到设备 v2
    function  addSynSSID(ssidInfo,stName)
    {

        function synSuc(data)
        {
            if(data.error_code == 0)
            {
                console.log(data);
                addSynSSIDV3(ssidInfo,stName);   
            }
            
        }


        function synFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("SYN_FAIL"),"error");
            console.log(err);
        }

        var synOpt = {
            type: "GEt",
            url:MyConfig.v2path+"/syncAc?acsn="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            onSuccess:synSuc,
            onFailed:synFail
        }
        Utils.Request.sendRequest(synOpt);
    }
   
    //绑定SSID "AP组" v3
    function bingSSIDByAPgroup(ssidInfo, stName)
    {
        var paramArr =[];
        
        if(g_supportModelArr)
        {
            $.each(g_supportModelArr,function(i,v) {
                var paramObj_1 = {};
                var paramObj_2 = {};
                paramObj_1.apGroupName = "default-group";//默认default组
                paramObj_1.apModelName = v.apmodel;
                paramObj_1.radioId = 1;
                paramObj_1.stName = stName;
                paramObj_1.vlanId  =  1;
                paramObj_2.apGroupName = "default-group";//默认default组
                paramObj_2.apModelName = v.apmodel;
                paramObj_2.radioId = 2;
                paramObj_2.stName = stName;
                paramObj_2.vlanId  =  1;

                paramArr.push(paramObj_1);
                paramArr.push(paramObj_2);
            });   
        }
        

        var reqData = {
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
        };

        if(paramArr.length > 0)
        {
            reqData.param = paramArr;
        }

        function bingSSIDByAPgroupSuc(data)
        {
            if(data.communicateResult == "fail")
            {
                hPending.close(200);
                Frame.Msg.info(getRcText("LINK"),"error");
               // Utils.Base.refreshCurPage();
                return;
            }

            var i = 0 ;
            $.each(data.deviceResult,function(key,v){
                if(v.result&& v.result == "success"){
                    i++;
                }
            })
            if(i == 0){
                hPending.close(200);
                Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                //Utils.Base.refreshCurPage();
                return;
            }

            if(data.errCode == 0 && data.result == "success" && data.serviceResult == "success")
            {
                addSynSSID(ssidInfo,stName);                 
            }
            else
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                return; 
            }
        }

        function bingSSIDByAPgroupFail(err)
        {
            hPending.close(200);
            Frame.Msg.info(getRcText("DEL_FAIL"),"error")
            console.log(err);
        }

        var bingSSIDByAPgroupOpt = {
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(reqData),
            onSuccess:bingSSIDByAPgroupSuc,
            onFailed:bingSSIDByAPgroupFail
        }

        Utils.Request.sendRequest(bingSSIDByAPgroupOpt);
    }

    // 使能云端认证 v3
    function portalEnable(ssidInfo, stName)
    {

        function portalEnableSuc(data)
        {
            if(data.communicateResult == "fail" )
            {
                hPending.close(200);
                Frame.Msg.info(getRcText("LINK"),"error");
                //Utils.Base.refreshCurPage();
                return;
            }

            var i = 0 ;
            $.each(data.deviceResult,function(key,v){
                if(v.result&& v.result == "success"){
                    i++;
                }
            })
            if(i == 0){
                hPending.close(200);
                Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                //Utils.Base.refreshCurPage();
                return;
            }

            if(data.errCode == 0 && data.result == "success" && data.serviceResult == "success")
            {
                //TODO 成功处理
                bingSSIDByAPgroup(ssidInfo, stName);
            }
            else
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                return;     
            }
        }

        function portalEnableFail(err)
        {
            hPending.close(200);
            Frame.Msg.info(getRcText("ADD_FAIL"));
            console.log(err);
        }

        var reqData = {
            devSN : FrameInfo.ACSN,
            configType : 0,
            cloudModule : "portal",
            deviceModule : "portal",
            method : "setSimpleConfig",
            param :
                [
                    {
                        stname:stName,
                        enable:1,
                        webserver:"lvzhou-server",
                        domain:"cloud"
                    }
                ]

        };

        var portalEnableOpt = {
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(reqData),
            onSuccess:portalEnableSuc,
            onFailed:portalEnableFail
        }

        Utils.Request.sendRequest(portalEnableOpt);

    }

    //增加SSID v3
    function updateSsid()
    {
        g_StName = Frame.Util.generateID("st");//随机生成
        var oTempTable = {
            index:[],
            column:["ssid_name", "addStType", "SSIDSFG","addPskPassPhraseKey","addAPC"],
        };
        var ssidInfo = $("#AddSsidForm").form ("getTableValue", oTempTable);// 增加服务页面 用户输入的信息
        g_addSsidName = ssidInfo.ssid_name.replace(/(^\s*)|(\s*$)/g,""); // 增加服务 用户输入的ssid_name
        g_description = ssidInfo.addStType; // 增加服务 用户选择的服务类型

        if(!password(ssidInfo.addPskPassPhraseKey))
        {
            Utils.Widget.setError($("#PskPassPhraseText"),getRcText("password_err"));
            hPending.close(100);
            return false;
        }
        
        var reqData = {};

        if(ssidInfo.addAPC == "1")
        {
            reqData = {
                devSN: FrameInfo.ACSN,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method: "SSIDUpdate",
                param:[{
                    stName: g_StName,
                    status: 1,
                    akmMode: 1,
                    cipherSuite: 20,
                    securityIE: 3,
                    psk: ssidInfo.addPskPassPhraseKey,
                    ssidName: g_addSsidName,
                    description: ssidInfo.addStType,
                }]
            }
        }
        else
        {
            reqData = {
                devSN: FrameInfo.ACSN,
                configType : 0,
                cloudModule : "stamgr",
                deviceModule : "stamgr",
                method: "SSIDUpdate",
                param:[{
                    stName: g_StName,
                    status: 1,
                    ssidName: g_addSsidName,
                    description: ssidInfo.addStType,
                }]
            }   
        }
        

        function updateSsidSuc(data)
        {
            if(data.communicateResult == "fail" )
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("LINK"),"error");
                return;
            }
            if(data.deviceResult[0].result == "fail")
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("ADD_Limit"),"error");
                return;   
            }

            if(data.errCode == 0 && data.result == "success" && data.serviceResult == "success")
            {
                //TODO 成功处理
                portalEnable(ssidInfo, g_StName);
            }
            else
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                return;    
            }
           
        }

        function updateSsidFail()
        {
            console.log("fail");
        }

        var updateSsidOpt = {
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(reqData),
            onSuccess: updateSsidSuc,
            onFailed: updateSsidFail
        }

        Utils.Request.sendRequest(updateSsidOpt);  
    }
    
    //AP组下配置ApModel  v3
    function getApModel()
    {
        var paramArr =[];
        if(g_supportModelArr)
        {
            $.each(g_supportModelArr,function(i,v){
                var paramObj = {};
                paramObj.apGroupName = "default-group";//默认default组
                paramObj.apModel = v.apmodel;
                paramArr.push(paramObj);
            });    
        }
        
        var reqData = {
            devSN : FrameInfo.ACSN,
            configType : 0,
            cloudModule : "apmgr",
            deviceModule : "apmgr",
            method : "AddApGroupModel",
            param : [
                {apGroupName:"default-group", apModel:"WTU430"},
                {apGroupName:"default-group", apModel:"WAP712"},
                {apGroupName:"default-group", apModel:"WAP722"},
                {apGroupName:"default-group", apModel:"WAP722E"},
                {apGroupName:"default-group", apModel:"WAP722S"},
                {apGroupName:"default-group", apModel:"WAP712C"}
            ]

        };

        if(paramArr.length > 0)
        {
            reqData.param = paramArr;
        }

        function getApModelSuc(data)
        {
            if(data.communicateResult == "fail")
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("LINK"),"error");
                return;
            }

            var i = 0 ;
            $.each(data.deviceResult,function(key,v){
                if(v.result&& v.result == "success"){
                    i++;
                }
            })

            if(i == 0)
            {
                hPending.close(200);
                Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                return;
            }

            if(data.errCode == 0 && data.result == "success" 
                && data.serviceResult == "success")
            {
                //TODO 成功处理
                updateSsid();
            }
	    else
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                return;     
            }
        }

        function getApModelFail(err)
        {
            hPending.close(200);
            Frame.Msg.info(getRcText("ADD_FAIL"),"error");
            onCancelAddSsid();
            console.log(err);
        }

        var getApModelOpt = {
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(reqData),
            onSuccess:getApModelSuc,
            onFailed:getApModelFail
        }

        Utils.Request.sendRequest(getApModelOpt);

    }

    //添加页面——增加服务
    function onCfgAddSsid(data)
    {
        hPending = Frame.Msg.pending(getRcText("CFG_senting"));
        var time=Frame.DataFormat.getStringTime(new Date());
        g_name = FrameInfo.Nasid+"_"+time; //用作模板名称 保证唯一
        getApModel();
    }

    function onAddSSID()
    {
        var addForm = $("#AddSsidForm");
        addForm.form("init", "edit", {"title":getRcText("ADD_TITLE")
               , "btn_apply":onCfgAddSsid
               , "btn_cancle":onCancelAddSsid});
        
         $("#AddSsidForm").form("updateForm",{
                ssid_name :"",
                PskPassPhraseKey:"",

        });
        Utils.Base.openDlg(null, null, {scope:$("#AddSsidDlg"), className:"modal-large"});
    }

    function onCancelAddSsid()
    {
        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddSsidForm")));
    }

    //获取设备支持的AP v3  g_supportModelArr
    function getSupportModel()
    {
        function getSupportModelSuc(data)
        {
            console.log(data);
            if(data.apModelList){
                if(data.apModelList.length > 0)
                {
                    g_supportModelArr = data.apModelList;
                }
                else{
                    console.log(getRcText("NO_support"));
                }

            }
        }

        function getSupportModelFail(err)
        {
            console.log(err);
        }

        var getSupportModelOpt = {
            type: "GET",
            url: MyConfig.path+"/apmonitor/getapmodellist?devSN="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            onSuccess:getSupportModelSuc,
            onFailed:getSupportModelFail
        }

        Utils.Request.sendRequest(getSupportModelOpt);
    }
    
    function  synSSIDV3(isAddSsid,isDelSsid)
    {

        function synSuc(data)
        {
            console.log(data);
            if(data&&data.errCode=="0"){
                if(isAddSsid)
                {
                    if(typeof isAddSsid == "boolean")
                    {
                        hPending.close(100);
                        Frame.Msg.info(getRcText("ADD_SUCCESS"));
                        onCancelAddSsid();
                    }
                    else if(typeof isAddSsid == "object")
                    {
                        //hPending.close(100);
                        Frame.Msg.info(getRcText("syn_suc"));
                        synSsidDisable();
                    }

                }
                else if(isDelSsid)
                {
                    hPending.close(100);
                    Frame.Msg.info(getRcText("DEL_SUCCESS"));
                }

                Utils.Base.refreshCurPage();
            }
            else
            {
                if(isAddSsid)
                {
                    if(typeof isAddSsid == "boolean")
                    {
                        hPending.close(100);
                        Frame.Msg.info(getRcText("add_syn_fail"),"error");
                        onCancelAddSsid();
                        Utils.Base.refreshCurPage();
                    }
                    else if(typeof isAddSsid == "object")
                    {
                        
                       // Utils.Base.refreshCurPage();
                        Frame.Msg.info(getRcText("SYN_FAIL"),"error");
                        initData();
                        synSsidDisable();
                    }

                }
                else if(isDelSsid)
                {
                    hPending.close(100);
                    Frame.Msg.info(getRcText("del_syn_fail"),"error");
                }

            }

        }


        function synFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("SYN_FAIL"),"error");
            console.log(err);
        }

        var synOpt = {
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN:FrameInfo.ACSN,
                module : "stamgr",
                method : "SyncSSIDList",
                configType:0,
                cloudModule:"stamgr",
                deviceModule:"stamgr",
                param:[{}]
            }),
            onSuccess:synSuc,
            onFailed:synFail
        }
        Utils.Request.sendRequest(synOpt);
    }

    //同步 v2
    function  synSSID(isAddSsid,isDelSsid)
    {

        function synSuc(data)
        {
            console.log(data);
            synSSIDV3(isAddSsid,isDelSsid);

        }


        function synFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("SYN_FAIL"),"error");
            console.log(err);
        }

        var synOpt = {
            type: "GEt",
            url:MyConfig.v2path+"/syncAc?acsn="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            onSuccess:synSuc,
            onFailed:synFail
        }
        Utils.Request.sendRequest(synOpt);
    }

    //点击同步后，按钮置灰30s
    function synSsidDisable()
    {
        
       $("#ssidList>div>div>a:last").addClass("disabled");
       var i = 30;

       var setIntervalTime = setInterval(function(){
    
            $("#ssidList>div>div>a:last").addClass("disabled");
            $("#ssidList>div>div>a:last>span").text(i+getRcText("second"));
           
            if(i == 0)
            {
                clearInterval(setIntervalTime);
                $("#ssidList>div>div>a:last>span").text(getRcText("syn"));
                $("#ssidList>div>div>a:last").removeClass("disabled");
            }

            i--;

       },1000)
               
    }

    //Toggle slist

    //删除旧的页面模板 v2
    function delTheme(operateDel,oDate,isSyncSsid,delOnlyAuth)
    {

        var reqData =  {
            "ownerName":g_userName
        };

        if(operateDel == "delSsid" && oDate)
        {
            reqData.themeName = oDate.pubMngInfo.themeTemplateName
        }
        else
        {
            reqData.themeName = g_SsidInfo.pubMngInfo.themeTemplateName;
        }

        function themetemplateDelSuc(data){
            console.log(data);
            if(data.errorcode == 0){
                if(delOnlyAuth)
                {
                    if(operateDel == "delSsid"&&isSyncSsid)
                    {
                        delAuth("delSsid",oDate,isSyncSsid);
                    }
                    else
                    {
                        delAuth();
                    }
                }
                else
                {
                    if(operateDel == "delOldTheme")
                    {
                        hPending.close(100);
                        Frame.Msg.info(getRcText("CFG_OK"));
                        Utils.Base.refreshCurPage();
                    }
                    else if(operateDel == "delBoth")
                    {
                        delAuth(operateDel);
                    }
                    else if(operateDel == "delSsid"&&isSyncSsid)
                    { 
                        synSSID(false,true);
                    }
                    else
                    {
                        hPending.close(100);
                        Frame.Msg.info(getRcText("CFG_OK"));
                        Utils.Base.refreshCurPage();
                    }
                }
            }
        }

        function themetemplateDelFail(){
            console.log("fail");
            hPending.close(100)
            Frame.Msg.info(getRcText("CFG_Fail"),"error");
        }

        var themetemplateDelOpt = {
            type: "POST",
            url: MyConfig.v2path+"/themetemplate/delete",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(reqData),
            onSuccess: themetemplateDelSuc,
            onFailed: themetemplateDelFail
        }

        Utils.Request.sendRequest(themetemplateDelOpt);
    }

    //删除旧的认证模板 v2
    function delAuth(operateDel,oDate,isSyncSsid)
    {
        var reqData = {
            ownerName:g_userName
        }
        if(operateDel == "delSsid" && oDate)
        {
            reqData.authCfgTemplateName = oDate.pubMngInfo.authCfgName
        }
        else
        {
            reqData.authCfgTemplateName = g_SsidInfo.pubMngInfo.authCfgName;
        }

        function authcfgDelSuc(data){
            console.log(data);
            if(data.errorcode == 0)
            {
                if(operateDel == "delOldAuth")
                {
                    hPending.close(100);
                    Frame.Msg.info(getRcText("CFG_OK"));
                    Utils.Base.refreshCurPage();
                }
                else if(operateDel == "delBoth")
                {
                    hPending.close(100)
                    Frame.Msg.info(getRcText("CFG_OK"));
                    Utils.Base.refreshCurPage();

                }
                else if(operateDel == "delSsid"&&isSyncSsid)
                {
                    synSSID(false,true);
                }
                else
                {
                    hPending.close(100);
                    Frame.Msg.info(getRcText("CFG_OK"));
                    Utils.Base.refreshCurPage();
                }
            }
        }

        function authcfgDelFail()
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_ONLYFAIL"),"error");
            console.log("fail4");
        }

        var authcfgDelOpt = {
            type: "post",
            url: MyConfig.v2path+"/authcfg/delete",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(reqData),
            onSuccess: authcfgDelSuc,
            onFailed: authcfgDelFail
        };

        Utils.Request.sendRequest(authcfgDelOpt);
    }

    //删除旧的发布模板 v2
    function delPublish(pubMngName,isDelTheme,isDelAuth,isSyncSsid,oData,isAuto)
    {
        function delPublishSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0)
            {
                if(isDelTheme&&!isDelAuth)
                {

                    if(isSyncSsid)
                    {
                        delTheme("delSsid",oData,isSyncSsid);
                    }
                    else
                    {
                        delTheme();
                    }
                }
                else if(!isDelTheme&&isDelAuth)
                {
                    if(isSyncSsid)
                    {
                        delAuth("delSsid",oData,isSyncSsid);
                    }
                    else
                    {
                        delAuth();
                    }

                }
                else if(isDelTheme&&isDelAuth)
                {
                    if(isSyncSsid)
                    {
                        delTheme("delSsid",oData,isSyncSsid,isDelAuth);
                    }
                    else
                    {
                        delTheme("",null,isSyncSsid,isDelAuth);
                    }
                }
                else if(!oData&&isSyncSsid)//只是删除ssid时只选择删除发布模板
                {
                    synSSID(false,true);
                }
                else if(isAuto)
                {
                    hPending.close(100);
                    console.log("auto del pub");
                }
                else
                {
                    hPending.close(100);
                    Frame.Msg.info(getRcText("CFG_OK"));
                    Utils.Base.refreshCurPage();
                }
            }
        }

        function delPublishFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_ONLYFAIL"),"error");
            console.log(err);
        }

        var delPublishOpt = {
            type: "POST",
            url: MyConfig.v2path+"/pubmng/delete",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                ownerName: g_userName,
                name: pubMngName||"",
                shopName: g_shopName
            }),
            onSuccess:delPublishSuc,
            onFailed:delPublishFail
        }

        Utils.Request.sendRequest(delPublishOpt);
    }

    function isPublishPubmnged(pubMngName,isPublish)
    {
        function isPublishPubmngedSuc(data)
        {
            if(data.errorcode == 0)
            {
                hPending.close(100);

                Frame.Msg.info(getRcText("CFG_OK"));

                Utils.Base.refreshCurPage();
            }
        }

        function isPublishPubmngedFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_ONLYFAIL"),"error");
            console.log(err);

        }

        var isPublishPubmngedOpt = {
            type: "POST",
            url: MyConfig.v2path + "/pubmng/publish",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                ownerName: g_userName,
                name: pubMngName,
                shopName: g_shopName,
                isPublish: isPublish
            }),
            onSuccess: isPublishPubmngedSuc,
            onFailed: isPublishPubmngedFail
        }

        Utils.Request.sendRequest(isPublishPubmngedOpt);
    }

    function editAndAddPub(sName,autoName,needPubObj,operateDel)
    {
        var pubData = {
            ownerName:g_userName,
            shopName:g_shopName,
            authCfgName:needPubObj.authCfgTemplateName,
            themeTemplateName:needPubObj.themeName,
        }
        if( needPubObj.weixinAccountName)
        {
            pubData.weixinAccountName = needPubObj.weixinAccountName;
        }

        if(sName == "add")
        {
            var url = MyConfig.v2path+"/pubmng/add";
            pubData.name = autoName;
            pubData.ssidName = g_SsidInfo.SSID;
            pubData.ssidIdV3 = g_SsidInfo.SSID_Id;//ID
            pubData.description = "add autoName publishTemplate"
        }
        else
        {
            var url = MyConfig.v2path+"/pubmng/modify";
            pubData.name = g_SsidInfo.pubMngInfo.name;
            pubData.description = "modify autoName publishTemplate"
        }

        function publishSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0)
            {
                if(sName == "add")
                {
                    isPublishPubmnged(autoName,true);
                }
                else
                {
                    if(operateDel == "delOldTheme")
                    {
                        //删除旧的页面模板 
                        delTheme(operateDel);
                    }
                    else if(operateDel == "delOldAuth")
                    {
                        delAuth(operateDel)
                    }
                    else if(operateDel == "delBoth")
                    {
                        delTheme(operateDel);
                    }
                    else
                    {
                        hPending.close(100);
                        Frame.Msg.info(getRcText("CFG_OK"));
                        Utils.Base.refreshCurPage();
                    }
                }
            }
            else
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("CFG_ONLYFAIL"),"error");
            }
        }

        function publishFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_ONLYFAIL"),"error");
            console.log(err);
        }

        var pubOpt = {
            type: "POST",
            url: url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(pubData),
            onSuccess: publishSuc,
            onFailed: publishFail
        }

        Utils.Request.sendRequest(pubOpt);
    }

    function editAndaddTheme(sName,autoName,operatePub,needPubObj,delOperate)
    {
        if(sName == "add"){
            var url = MyConfig.v2path+"/themetemplate/add"
            var themeData = {
                ownerName:g_userName,
                themeName:autoName,
                v3flag:0,
                description:"auto themeTemplate"
            };
            needPubObj.themeName = autoName;
        }
        else
        {
            var url =MyConfig.v2path+"/themetemplate/modify"
            var themeData = {
                ownerName:g_userName,
                v3flag:0,
                themeName:g_SsidInfo.temeplateInfo.themeName
            };
            needPubObj.themeName = g_SsidInfo.temeplateInfo.themeName;
        }

        function themeSuc(data)
        {
            console.log(data);
            if(data.errorcode == "0")
            {
                if(operatePub == "modify"||operatePub == "add")
                {
                    editAndAddPub(operatePub,autoName,needPubObj,delOperate);
                }
                else
                {
                    hPending.close(100);
                    Frame.Msg.info(getRcText("CFG_OK"));
                    Utils.Base.refreshCurPage();

                }
                
            }
            else
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("CFG_ONLYFAIL"));
                Utils.Base.refreshCurPage();
            }
        }

        function themeFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_ONLYFAIL"),"error");
            console.log(err);
        }
        var themeOpt = {
            type: "POST",
            url: url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(themeData),
            onSuccess: themeSuc,
            onFailed: themeFail
        }

        Utils.Request.sendRequest(themeOpt);
    }

    function editAndaddAuth(oStData,sName,autoName,operateTheme,operatePub,operateDel)
    {
        var needPubObj = {};
        if(g_SsidInfo.AuthenType == "AT1")
        {
            oStData.ONLINE_MAX_TIME = oStData.ONLINE_MAX_TIME || 360;  
            oStData.URL_AFTER_AUTH = oStData.URL_AFTER_AUTH || ""; 
            oStData.IDLE_CUT_TIME = oStData.IDLE_CUT_TIME || 30; 
            oStData.IDLE_CUT_FLOW = oStData.IDLE_CUT_FLOW || 10240; 
            oStData.unauthtime = oStData.unauthtime || 7;
        }
        else
        {
            if(!oStData.ONLINE_MAX_TIME)
            {
                oStData.ONLINE_MAX_TIME = g_SsidInfo.authInfo.uamAuthParamList[0].authParamValue/60 || 360; //让在线时长和闲置切断时长的单位一置      
            }

            if(!oStData.URL_AFTER_AUTH)
            {
                oStData.URL_AFTER_AUTH = g_SsidInfo.authInfo.uamAuthParamList[1].authParamValue || ""; //让在线时长和闲置切断时长的单位一置      
            }
        
            if( !oStData.IDLE_CUT_TIME) 
            {
                oStData.IDLE_CUT_TIME = g_SsidInfo.authInfo.uamAuthParamList[2].authParamValue || 30;
            }

            if(!oStData.IDLE_CUT_FLOW)
            {
                oStData.IDLE_CUT_FLOW = g_SsidInfo.authInfo.uamAuthParamList[3].authParamValue || 10240;       
            }

            if( oStData.IDLE_CUT_TIME == 0)  //如果切断时长为0，则将切断流量置为默认值。
            {
                oStData.IDLE_CUT_FLOW = 10240;
            } 

            if(!oStData.unauthtime )   /* 解决添加认证模板时不成功的问题。因为这个字段获取不到所以添加判断 */
            {
                oStData.unauthtime = g_SsidInfo.authInfo.uamAuthParamList[4].authParamValue || 7;
            }

            if(oStData.feelauth==0)
            {
                oStData.unauthtime = 0;
            }

        } 

        var authData = {
            ownerName:g_userName,
            authType:1,
            isEnableSms:0,
            isEnableWeixin:0,
            isEnableAccount:0,
            isWeixinConnectWifi:0,
            isEnableAli:0,
            isEnableQQ:0,
            uamAuthParamList:[
                {authParamName:"ONLINE_MAX_TIME",authParamValue:oStData.ONLINE_MAX_TIME*60},
                {authParamName:"URL_AFTER_AUTH",authParamValue:oStData.URL_AFTER_AUTH},
                {authParamName:"IDLE_CUT_TIME",authParamValue:oStData.IDLE_CUT_TIME},
                {authParamName:"IDLE_CUT_FLOW",authParamValue:oStData.IDLE_CUT_FLOW},
                {authParamName:"NO_SENSATION_TIME",authParamValue:oStData.unauthtime}
            ]
        };   

        if(oStData.AuthenType == "AT3")
        {
            //固定认证(账号登录)
            authData.authType = 2;
            $("input[name='LoginWays']",$("#toggle_form")).each(
                function()
                {
                    if($(this).next().hasClass("checked"))
                    {
                        if($(this).val()==1)
                        {
                            authData.isEnableSms = 1;
                        }
                        else if($(this).val()==2)
                        {
                            authData.isEnableWeixin = 1;
                        }
                        else if($(this).val()==3)
                        {
                            authData.isEnableAccount = 1;
                        }
                        else if($(this).val()==4)
                        {
                            authData.isWeixinConnectWifi = 1;
                        }
                    }
                }
            )
        }

        if(sName == "add")
        {
            var url = MyConfig.v2path + "/authcfg/add"
            authData.authCfgTemplateName = autoName;
            authData.v3flag = 0;
            needPubObj.authCfgTemplateName = autoName;
        }
        else
        {
            var url = MyConfig.v2path + "/authcfg/modify"
            authData.v3flag = 0;
            authData.authCfgTemplateName = g_SsidInfo.authInfo.authCfgTemplateName;
            needPubObj.authCfgTemplateName = g_SsidInfo.authInfo.authCfgTemplateName;
        }

        if(oStData.WeChartList)
        {
            needPubObj.weixinAccountName = oStData.WeChartList;
        }

        function authcfgSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0)
            {
                if(operateTheme == "add")
                {
                    editAndaddTheme(operateTheme,autoName,operatePub,needPubObj);
                }
                else if(operateTheme == "selected")
                {
                    needPubObj.themeName = oStData.LoginPageList;
                    editAndAddPub(operatePub,autoName,needPubObj,operateDel);
                }
                else if(operateTheme == "modify")
                {
                    editAndaddTheme(operateTheme,autoName,operatePub,needPubObj);
                }
            }
            else
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("CFG_ONLYFAIL"),"error");
            }
        }

        function authcfgFail()
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_ONLYFAIL"),"error");
            console.log("fail1");
        }

        var authcfgOpt = {
            type: "POST",
            url: url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(authData),
            onSuccess: authcfgSuc,
            onFailed: authcfgFail
        }

        Utils.Request.sendRequest(authcfgOpt);
    }
    

    function authOperate(oStData,autoName)
    {
        if(g_SsidInfo.pubMngInfo)//之前有发布模板
        {
            //不用关心页面模板，只是删除发布模板功能
            if(oStData.AuthenType == "AT1")
            {
                //删除发布模板,不删除认证模认证模板【v3flag = 1||v3flag不存在】
                if(g_SsidInfo.AuthenType == "AT4")
                {
                    if(g_SsidInfo.LoginPage == "LP4")
                    {
                        //TODO 只是删除发布模板
                        delPublish(g_SsidInfo.pubMngInfo.name);
                    }
                    else if(g_SsidInfo.LoginPage == "LP1")
                    {
                        //TODO 删除发布模板,且删除页面模板
                        delPublish(g_SsidInfo.pubMngInfo.name,true);
                    }
                }
                //删除认证模板【v3flage = 0】
                else if(g_SsidInfo.AuthenType == "AT2"||g_SsidInfo.AuthenType == "AT3")
                {
                    if(g_SsidInfo.LoginPage == "LP4")
                    {
                        //TODO 只是删除发布模板,且删除认证模板
                        delPublish(g_SsidInfo.pubMngInfo.name,false,true);
                    }
                    else if(g_SsidInfo.LoginPage == "LP1")
                    {
                        //TODO 删除发布模板,且删除认证模板,且删页面模板
                        delPublish(g_SsidInfo.pubMngInfo.name,true,true);
                    }
                }

            }
            //新增或修改认证模板
            else if(oStData.AuthenType == "AT2"||oStData.AuthenType == "AT3")
            {
                //添加认证模板（auto）
                if(g_SsidInfo.AuthenType == "AT4")
                {
                    if(g_SsidInfo.LoginPage == "LP4")
                    {
                        if(oStData.LoginPage == "LP1")
                        {
                            //TODO 增加认证模板，增加页面模板，修改发布模板
                            editAndaddAuth(oStData,"add",autoName,"add","modify");

                        }
                        else if(oStData.LoginPage == "LP4")
                        {
                            //TODO 增加认证模板，选择已有页面模板，修改发布模板
                            editAndaddAuth(oStData,"add",autoName,"selected","modify");
                        }


                    }
                    else if(g_SsidInfo.LoginPage == "LP1")
                    {
                        if(oStData.LoginPage == "LP1")
                        {
                            //TODO 增加认证模板，修改页面模板，修改发布模板
                            editAndaddAuth(oStData,"add",autoName,"modify","modify");
                        }
                        else if(oStData.LoginPage == "LP4")
                        {
                            //TODO 增加认证模板，选择已有页面模板，修改发布模板，删除旧的页面模板【v3flag=0】
                            editAndaddAuth(oStData,"add",autoName,"selected","modify","delOldTheme");
                        }
                    }
                }
                //修改认证模板
                else if(g_SsidInfo.AuthenType == "AT2"||g_SsidInfo.AuthenType == "AT3")
                {
                    if(g_SsidInfo.LoginPage == "LP4")
                    {
                        if(oStData.LoginPage == "LP1")
                        {
                            //TODO 修改认证模板，新增页面模板，修改发布模板，
                            editAndaddAuth(oStData,"modify",autoName,"add","modify");
                        }
                        else if(oStData.LoginPage == "LP4")
                        {
                            //TODO 修改认证模板，选择已有页面模板，修改发布模板
                            editAndaddAuth(oStData,"modify",autoName,"selected","modify");
                        }
                    }
                    else if(g_SsidInfo.LoginPage == "LP1")
                    {

                        if(oStData.LoginPage == "LP1")
                        {
                            //TODO 修改认证模板，修改页面模板,发布模板直接生效
                            editAndaddAuth(oStData,"modify",autoName,"modify","modify");
                        }
                        else if(oStData.LoginPage == "LP4")
                        {
                            //TODO 修改认证模板，选择已有页面模板，修改发布模板，删除旧的页面模板【v3flag=0】                            //TODO 增加认证模板，选择已有页面模板，修改发布模板，删除旧的页面模板【v3flag=0】
                            editAndaddAuth(oStData,"modify",autoName,"selected","modify","delOldTheme");
                        }
                    }
                }

            }
            //选择已有认证模板
            else if(oStData.AuthenType == "AT4")
            {
                var  needPubObj = {};
                needPubObj.authCfgTemplateName = oStData.AuthCfgList;//选择已有认证模板

                if(oStData.WeChartList)
                {
                    needPubObj.weixinAccountName = oStData.WeChartList;
                }

                if(g_SsidInfo.AuthenType == "AT4")
                {
                    if(g_SsidInfo.LoginPage == "LP4")
                    {
                        if(oStData.LoginPage == "LP1")
                        {
                            //TODO 选择已有认证模板，新增页面模板，修改发布模板
                            editAndaddTheme("add",autoName,"modify",needPubObj);
                        }
                        else if(oStData.LoginPage == "LP4")
                        {
                            //TODO 选择已有认证模板 选择已有页面模板，修改发布模板
                            needPubObj.themeName = oStData.LoginPageList;//选择已有页面模板
                            editAndAddPub("modify",autoName,needPubObj);
                        }
                    }
                    else if(g_SsidInfo.LoginPage == "LP1")
                    {
                        if(oStData.LoginPage == "LP1")
                        {
                            //TODO 选择已有认证模板，修改页面模板，修改发布模板
                            editAndaddTheme("modify",autoName,"modify",needPubObj);
                        }
                        else if(oStData.LoginPage == "LP4")
                        {
                            //TODO 选择已有认证模板 选择已有页面模板，修改发布模板,删除旧的页面模板【v3flag=0】
                            needPubObj.themeName = oStData.LoginPageList;//选择已有页面模板
                            editAndAddPub("modify",autoName,needPubObj,"delOldTheme");
                        }
                    }
                }
                //选择已有认证模板,最后需要删除旧的认证模板
                else if(g_SsidInfo.AuthenType == "AT2"||g_SsidInfo.AuthenType == "AT3")
                {
                    if(g_SsidInfo.LoginPage == "LP4")
                    {
                        if(oStData.LoginPage == "LP1")
                        {
                            //TODO 选择已有认证模板，新增页面模板，修改发布模板,删除旧的认证模板【v3flag=0】
                            editAndaddTheme("add",autoName,"modify",needPubObj,"delOldAuth");
                        }
                        else if(oStData.LoginPage == "LP4")
                        {
                            //TODO 选择已有认证模板 选择已有页面模板，修改发布模板,,删除旧的认证模板【v3flag=0】
                            needPubObj.themeName = oStData.LoginPageList;//选择已有页面模板
                            editAndAddPub("modify",autoName,needPubObj,"delOldAuth");
                        }
                    }
                    else if(g_SsidInfo.LoginPage == "LP1")
                    {
                        if(oStData.LoginPage == "LP1")
                        {
                            //TODO 选择已有认证模板，修改页面模板，修改发布模板,删除旧的认证模板【v3flag=0】
                            editAndaddTheme("modify",autoName,"modify",needPubObj,"delOldAuth");
                        }
                        else if(oStData.LoginPage == "LP4")
                        {
                            //TODO 选择已有认证模板 选择已有页面模板，修改发布模板,删除旧的页面模板【v3flag=0】,删除旧的认证模板【v3flag=0】
                            needPubObj.themeName = oStData.LoginPageList;//选择已有页面模板
                            editAndAddPub("modify",autoName,needPubObj,"delBoth");
                        }
                    }
                }
            }
        }
        else
        {
            if(oStData.AuthenType == "AT3"||oStData.AuthenType == "AT2")
            {
                if(oStData.LoginPage == "LP1")
                {
                    //TODO 添加认证，添加页面（auto）,添加发布模板，发布
                    editAndaddAuth(oStData,"add",autoName,"add","add");
                }
                else if(oStData.LoginPage == "LP4")
                {
                    //TODO 添加认证，选择已有的页面模板（auto）,添加发布模板，发布
                    editAndaddAuth(oStData,"add",autoName,"selected","add");
                }
            }
            else if(oStData.AuthenType == "AT4")
            {
                var  needPubObj = {};
                needPubObj.authCfgTemplateName = oStData.AuthCfgList;//选择已有认证模板

                if(oStData.WeChartList)
                {
                    needPubObj.weixinAccountName = oStData.WeChartList;
                }

                if(oStData.LoginPage == "LP4")
                {
                    //TODO 选择有的认证，添加页面（auto）添加发布模板，发布
                    needPubObj.themeName = oStData.LoginPageList;//选择已有页面模板
                    editAndAddPub("add",autoName,needPubObj);
                }
                else if(oStData.LoginPage == "LP1")
                {
                    //TODO 选择已有的认证模板，新增页面模板，添加发布模板，发布
                    editAndaddTheme("add",autoName,"add",needPubObj);

                }
            }
            else if(oStData.AuthenType == "AT1")
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("CFG_OK"));
                Utils.Base.refreshCurPage();
            }
        }
    }
    
    //旧接口修改ssid，需要重新下配置，否则会下默认配置
    function updateSsidInfo(oStData,autoName)
    {
        if(!password(oStData.PskPassPhraseKey))
        {
            Utils.Widget.setError($("#PskPassPhraseText_toggle"),getRcText("password_err"));
            hPending.close(100);
            return false;
        }
        var reqData = {};
        reqData = {
            devSN: FrameInfo.ACSN,
            configType : 0,
            cloudModule : "stamgr",
            deviceModule : "stamgr",
            method: "SSIDUpdate",
            param:[{
                stName: g_SsidInfo.ssidObj.stName,
                status: 1,
                akmMode: 1,
                cipherSuite: 20,
                securityIE: 3,
                psk: oStData.PskPassPhraseKey,
                ssidName: g_SsidInfo.ssidObj.ssidName,
            }]
        }

        if(oStData.StType)
        {
           reqData.param[0].description = oStData.StType;
        }
        else
        {
           reqData.param[0].description = g_SsidInfo.description;
        }
        
        function updateSsidSuc(data)
        {
            if(data.communicateResult == "fail" )
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("LINK"),"error");
                return;
            }
            if(data.deviceResult[0].result == "fail")
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("ADD_Limit"),"error");
                return;   
            }

            if(data.errCode == 0 && data.result == "success" && data.serviceResult == "success")
            {
                authOperate(oStData, autoName);
            }
            else
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                return;    
            }
           
        }

        function updateSsidFail()
        {
            console.log("fail");
        }

        var updateSsidOpt = {
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(reqData),
            onSuccess: updateSsidSuc,
            onFailed: updateSsidFail
        }

        Utils.Request.sendRequest(updateSsidOpt);  
    }

    //修改SSID 只能修改 v3
    function updateSsidOne(oStData,autoName)
    {
        var reqData = {
            devSN: FrameInfo.ACSN,
            configType : 0,
            cloudModule : "stamgr",
            deviceModule : "stamgr",
            method: "SSIDUpdateOne",
            param:[{
                stName: g_SsidInfo.ssidObj.stName,
            }]
        };
        
        if(oStData.StType)
        {
           reqData.param[0].description = oStData.StType;
        }
        if(oStData.PskPassPhraseKey)
        {
            reqData.param[0].psk = oStData.PskPassPhraseKey;
        }

        if(!password(oStData.PskPassPhraseKey))
        {
            Utils.Widget.setError($("#PskPassPhraseText_toggle"),getRcText("password_err"));
            hPending.close(100);
            return false;
        }

        function updateSsidSuc(data)
        {
            if(data.errCode==7 && data.reason == "stamgr data process method is unknown")
            {
                    //旧接口：密钥不允许为空
                    if((oStData.cipher == "1") && (!oStData.shared_key))
                    {
                        Frame.Msg.info(getRcText("shared_key_ziduan"),"error");
                        hPending.close(100);
                        return;
                    //旧接口：可能丢配置
                    }
                    else
                    {
                        Frame.Msg.confirm(getRcText("LoseConfig"),function(){
                            hPending.close(100);
                            updateSsidInfo(oStData,autoName);
                            return;
                        });
                    }

            }
            else
            {
                if(data.errCode!=0)
                {//新接口失败
                    Frame.Msg.info(getRcText("ADD_FAIL"),"error");
                    hPending.close(100);
                    return; 
                }
                else 
                {//新接口成功
                    authOperate(oStData, autoName);
                }

            }
            // console.log("success");           
            // authOperate(oStData, autoName);  
        }

        function updateSsidFail()
        {
            console.log("fail");
        }

        var updateSsidOpt = {
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(reqData),
            onSuccess: updateSsidSuc,
            onFailed: updateSsidFail
        }

        Utils.Request.sendRequest(updateSsidOpt);  
    }

    function showSSID(oRowdata, sName)
    {
        function onCancel()
        {
            console.log("finish")

            jFormSSID.form("updateForm",oRowdata);

            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });

            return true;    
        }

        function onSubmitSSID()
        {
            var oTempTable = {
                index:[],
                column:["AuthenType","LoginPage","LoginPageList","AuthCfgList","WeChartList",
                "feelauth1","impose_auth_time","feelauth","unauthtime","ONLINE_MAX_TIME",
                "URL_AFTER_AUTH","IDLE_CUT_TIME","IDLE_CUT_FLOW","SSID", "StType","PskPassPhraseKey"]
            };
            var oStData = jFormSSID.form ("getTableValue", oTempTable);

            var time=Frame.DataFormat.getStringTime(new Date());

            var name = FrameInfo.Nasid+"_"+time;

            g_SsidInfo = oRowdata;//toggle slist 获取打开一行内的 

            hPending = Frame.Msg.pending(getRcText("CFG_senting"));

            updateSsidOne(oStData, name);
            
        }

        var jFormSSID = $("#toggle_form");
        if(sName == "add") //Add
        {

        }
        else //Edit
        {
            jFormSSID.form ("init", "edit", {"btn_apply": onSubmitSSID, "btn_cancel":onCancel});

            //初始化特效
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            $("#feelauth1", jFormSSID).MCheckbox("setState",false);
            $(".Learn-MAC", jFormSSID).hide();
            $('input[name = "LoginWays"]').each(function()
            {
                //span 选中状态清空
                $(this).next().removeClass('checked');
            });

            if(oRowdata.pubMngInfo&&oRowdata.authInfo&&oRowdata.temeplateInfo)
            {
                var authInfo = oRowdata.authInfo;
                var temeplateInfo =oRowdata.temeplateInfo;
                var pubMngInfo = oRowdata.pubMngInfo;
                var ssidListInfo = oRowdata.ssidListInfo;
                //认证模板
                if(!(authInfo.v3flag == false)||authInfo.v3flag == 1)
                {
                    oRowdata.AuthenType = "AT4";//选择认证模板
                    //无感知列消失 
                    $("#advanceBtn").addClass("hide");   
                          
                }
                else if(authInfo.v3flag == 0)
                {
                    if(authInfo.authType == 1){
                        oRowdata.AuthenType = "AT2";//一键上网
                    }
                    else if(authInfo.authType == 2)
                    {
                        oRowdata.AuthenType = "AT3";//账号登录
                        if(authInfo.isEnableSms == 1)
                        {
                            $("#Message + span",jFormSSID).addClass("checked");
                        }

                        if(authInfo.isEnableWeixin == 1)
                        {
                            $("#WeChart + span",jFormSSID).addClass("checked");
                        }
                        if(authInfo.isEnableAccount == 1)
                        {
                            $("#FixAccount + span",jFormSSID).addClass("checked");
                        }
                        if(authInfo.isWeixinConnectWifi == 1)
                        {
                            $("#isWeChatWifi + span",jFormSSID).addClass("checked");
                        }

                        $("#advanceBtn").removeClass("hide");  

                    }

                    if(authInfo.uamAuthParamList[4].authParamValue == "0")
                    {
                        $("#feelauth2").click();
                        
                    }
                    else
                    {
                        $("#feelauth1").click();
                        
                    }
                   
                    // 高级设置
                    oRowdata.ONLINE_MAX_TIME = authInfo.uamAuthParamList[0].authParamValue/60;
                    oRowdata.URL_AFTER_AUTH = authInfo.uamAuthParamList[1].authParamValue;
                    oRowdata.IDLE_CUT_TIME = authInfo.uamAuthParamList[2].authParamValue;
                    oRowdata.IDLE_CUT_FLOW = authInfo.uamAuthParamList[3].authParamValue;
                    oRowdata.unauthtime = authInfo.uamAuthParamList[4].authParamValue;
                    
                }

                //页面模板
                if(!(temeplateInfo.v3flag == false)||temeplateInfo.v3flag == 1)
                {
                    oRowdata.LoginPage = "LP4";//页面模板
                }
                else if(temeplateInfo.v3flag == 0)
                {
                    oRowdata.LoginPage = "LP1";//简约
                }

                //发布模板
                oRowdata.AuthCfgList = pubMngInfo.authCfgName;
                oRowdata.LoginPageList = pubMngInfo.themeTemplateName;
                oRowdata.WeChartList = pubMngInfo.weixinAccountName;
            }
            else//默认如果ssid没有与发布模板有关系。默认显示现象
            {
                oRowdata.AuthenType = "AT1";//选择认证模板
                oRowdata.LoginPage = "LP1";//简约
                oRowdata.StType = "STT1";
            }
            if(oRowdata.ssidObj)
            {
                oRowdata.StType = oRowdata.ssidObj.description;
                oRowdata.SSID = oRowdata.ssidObj.ssidName;
                
                
            }
            jFormSSID.form("updateForm",oRowdata);
        }        
    }

    //删除SSID v3
    function SSIDDelete(stName,oData)
    {
        function SSIDDeleteSuc(data)
        {
            if(data.communicateResult == "fail")
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("LINK_delete"),"error");
                //Utils.Base.refreshCurPage();
                return;
            }

            var i = 0 ;
            $.each(data.deviceResult,function(key,v){
                if(v.result&& v.result == "success"){
                    i++;
                }
            })
            if(i == 0){
                hPending.close(100);
                Frame.Msg.info(getRcText("DEL_FAIL"),"error");
                //Utils.Base.refreshCurPage();
                return;
            }

            if(data.errCode == 0 && data.result == "success" && data.serviceResult == "success")
            {
                //TODO 成功处理
                if(oData.AuthenType == "AT1")
                {
                    //Todo 调用同步接口
                    synSSID(false,true)
                }
                else if(oData.AuthenType == "AT2"||oData.AuthenType == "AT3")
                {
                    //Todo 删除发布模板 且删除认证模板【自建】
                    if(oData.LoginPage == "LP1")
                    {
                        delPublish(oData.pubMngInfo.name,true,true,true,oData);
                    }
                    else
                    {
                        delPublish(oData.pubMngInfo.name,false,true,true,oData);
                    }

                }
                else if(oData.AuthenType == "AT4")
                {
                    //Todo 删除发布模板 且不删除认证模板【手动】
                    if(oData.LoginPage == "LP1")
                    {
                        delPublish(oData.pubMngInfo.name,true,false,true,oData);
                    }
                    else
                    {
                        delPublish(oData.pubMngInfo.name,false,false,true);
                    }
                }

            }
            else
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("DEL_FAIL"),"error");s
                //Utils.Base.refreshCurPage();
                return;
            }
        }

        function SSIDDeleteFail(err)
        {
            console.log(err);
        }

        var reqData = {
            devSN : FrameInfo.ACSN,
            configType : 0,
            cloudModule : "stamgr",
            deviceModule : "stamgr",
            method : "SSIDDelete",
            param : [
                {stName: stName}
            ]

        };

        var SSIDDeleteOpt = {
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(reqData),
            onSuccess:SSIDDeleteSuc,
            onFailed:SSIDDeleteFail
        }

        Utils.Request.sendRequest(SSIDDeleteOpt);

    }

    //将SSID从AP组中解绑v3
    function SSIDUnbindByAPGroup(stName,oData)
    {
        function SSIDUnbindByAPGroupSuc(data)
        {
            if(data.communicateResult == "fail")
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("LINK_delete"),"error");
                //Utils.Base.refreshCurPage();
                return;
            }

            var i = 0 ;
            $.each(data.deviceResult,function(key,v){
                if(v.result&& v.result == "success"){
                    i++;
                }
            })

            if(i == 0)
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("DEL_FAIL"),"error");
                //Utils.Base.refreshCurPage();
                return;
            }

            if(data.errCode == 0 && data.result == "success" && data.serviceResult == "success")
            {
                //TODO 成功处理
                SSIDDelete(stName,oData);
            }
            else
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("DEL_FAIL"),"error");s
                //Utils.Base.refreshCurPage();
                return;
            }
        }

        function SSIDUnbindByAPGroupFail(err)
        {
            console.log(err);
        }

        var paramArr =[];
        if(g_supportModelArr)
        {
            $.each(g_supportModelArr,function(i,v) {
                var paramObj_1 = {};
                var paramObj_2 = {};
                paramObj_1.apGroupName = "default-group";//默认default组
                paramObj_1.apModelName = v.apmodel;
                paramObj_1.radioId = 1;
                paramObj_1.stName = stName;
                paramObj_1.vlanId  =  1;
                paramObj_2.apGroupName = "default-group";//默认default组
                paramObj_2.apModelName = v.apmodel;
                paramObj_2.radioId = 2;
                paramObj_2.stName = stName;
                paramObj_2.vlanId  =  1;

                paramArr.push(paramObj_1);
                paramArr.push(paramObj_2);
            });    
        }

        var reqData = {
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

        };

        if(paramArr.length > 0)
        {
            reqData.param = paramArr;
        }

        var SSIDUnbindByAPGroupOpt = {
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(reqData),
            onSuccess:SSIDUnbindByAPGroupSuc,
            onFailed:SSIDUnbindByAPGroupFail
        }

        Utils.Request.sendRequest(SSIDUnbindByAPGroupOpt);

    }
    
    function onDelSSID(oData)
    {
        console.log(oData);
        hPending = Frame.Msg.pending(getRcText("CFG_dell_senting"));
        SSIDUnbindByAPGroup(oData.sp_name,oData);
    }

    function initGrid()
    {
        var optSsid = {
            colNames: getRcText("SSID_HEADER"),
            multiSelect: false,
            colModel: [
                {name:"SSID", datatype:"String"},
                {name:"AuthType", datatype:"String"}
            ],
            onToggle: {
                action:showSSID,
                jScope:$("#ssidToggle"),
                BtnDel:{
                    show:true,
                    action:onDelSSID
                }

            },
            buttons: [
                {name:"add", action:onAddSSID},
                {name:"default", value:getRcText("SYN"),action: synSSID}
            ]
        };
        $("#ssidList").SList("head", optSsid);
    }

    //刷Slist

    //刷新列表
    function refreshSSIDList(needListOpt)
    {  
        var aAuthType = getRcText("AUTHEN_TYPE").split(",");
        var ssid_list = needListOpt.ssid_list || [];
        var ssid_VList = needListOpt.ssidList || [];
        //新定义obj
        var obj = {};
        var ssidRefreshArr = [];
        ssid_list.forEach(function(ssid){
            var SSID_Id =  ssid.ssid;
            
            //设置初始值
            obj[SSID_Id] = {
                SSID: ssid.ssidName,
                SSID_Id:SSID_Id,
                sp_name: ssid.stName,
                AuthType: aAuthType[0]
            };

            ssid_VList.forEach(function(ssidListInfo){
                if(ssid.stName == ssidListInfo.stName ){
                    obj[SSID_Id].ssidObj = ssidListInfo;
                }
            })

        });

        var pubmng_list =  needListOpt.publishList || [];

        pubmng_list.forEach(function(pubmng){
            // if (!("ssidName" in pubmng)){
            //     delPublish(pubmng.name,false,false,false,null,true);
            //     return;
            // }
            if (!(pubmng.ssidIdV3 in obj)){
                delPublish(pubmng.name,false,false,false,null,true);
                return;
            }
            var ssid_id = pubmng.ssidIdV3;
            obj[ssid_id].pubMngInfo = pubmng;

            needListOpt.authList.forEach(function(authInfo){
                if(authInfo.authCfgTemplateName == pubmng.authCfgName)
                {
                    obj[ssid_id].AuthType = aAuthType[authInfo.authType];//slist 显示用
                   
                    obj[ssid_id].authInfo = authInfo;
                }
            })
            needListOpt.temepleteList.forEach(function(temeplateInfo){
                if(temeplateInfo.themeName == pubmng.themeTemplateName)
                {
                    obj[ssid_id].temeplateInfo = temeplateInfo;
                }
            })   
        });

        for(var a in obj){
            ssidRefreshArr.push(obj[a]);
        }
        
        $("#ssidList").SList("refresh", ssidRefreshArr);
    }

    //查询ssid服务类型 v3
    function getSsidList(needListOpt)
    {
        function getSsidListSuc(data)
        {
            
            needListOpt.ssidList = data.ssidList;    
            refreshSSIDList(needListOpt);
        }

        function getSsidListFail()
        {

        }
        var getSsidListOpt = {
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getssidlist?devSN="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            onSuccess:getSsidListSuc,
            onFailed:getSsidListFail
        };

        Utils.Request.sendRequest(getSsidListOpt);

    }

    //查询页面模板v2
    function queryTempleteList(needListOpt)
    {
        function queryTempleteListSuc(data)
        {
            console.log(data);

            if(data.errorcode == 0)
            {
                var loginPageList = [];
                var loginPageArr = data.data || [];
                loginPageArr.forEach(function(loginPage){
                    //!(loginPage.v3flag == false)是为了兼容之前的数据，因为之前没有v3flag这个字段
                    //需要显示v3flag == 1的字段和v3flag为undefined的
                    if(!(loginPage.v3flag == false)||loginPage.v3flag == 1)
                    {
                        loginPageList.push(loginPage.themeName);
                    }
                })
                $("#LoginPageList").singleSelect("InitData",loginPageList);
                $("#addLoginPageList").singleSelect("InitData",loginPageList);
                var g_loginPageList = loginPageList;// 已有的页面模板

                needListOpt.temepleteList = loginPageArr
                getSsidList(needListOpt);
                
            }
        }

        function queryTempleteListFail(err)
        {
            console.log(err);
        }

        var queryTempleteListOpt = {
            type: "GET",
            url: MyConfig.v2path+"/themetemplate/query?ownerName="+g_userName,
            dataType: "json",
            contentType: "application/json",
            onSuccess:queryTempleteListSuc,
            onFailed:queryTempleteListFail
        };

        Utils.Request.sendRequest(queryTempleteListOpt);
    }

    //查询认证模板v2
    function queryAuthList(needListOpt)
    {
        function queryAuthListSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0){
                var auth_list = data.data||[];
                g_authcfgList = [];// 所有已有的认证模板
                auth_list.forEach(function(authcfg){
                    if(!(authcfg.v3flag == false)||authcfg.v3flag == 1)
                    {
                        g_authcfgList.push(authcfg.authCfgTemplateName);
                    }
                });
                $("#AuthCfgList").singleSelect("InitData",g_authcfgList);
                $("#addAuthCfgList").singleSelect("InitData",g_authcfgList);

                needListOpt.authList = auth_list;
                queryTempleteList(needListOpt);
            }
        }

        function queryAuthListFail(err)
        {
            console.log(err);
        }

        var queryAuthListOpt = {
            type: "GET",
            url: MyConfig.v2path+"/authcfg/query?ownerName="+g_userName,
            dataType: "json",
            contentType: "application/json",
            onSuccess:queryAuthListSuc,
            onFailed:queryAuthListFail
        };

        Utils.Request.sendRequest(queryAuthListOpt);
    }
    
    //查询发布模板v2
    function queryPubList(needListOpt)
    {

        function queryPubListSuc(data) 
        {
            console.log(data);
            if(data.errorcode == 0){
                needListOpt.publishList = data.data;
                queryAuthList(needListOpt);
            }
        }

        function queryPubListFail(err) 
        {
            console.log(err);
        }
        var queryPubListOpt = {
            type: "GET",
            url: MyConfig.v2path+"/pubmng/query",
            dataType: "json",
        data:{
            ownerName:FrameInfo.g_user.attributes.name,
            shopName:g_shopName},
            contentType: "application/json",
            onSuccess:queryPubListSuc,
            onFailed:queryPubListFail
        }
        Utils.Request.sendRequest(queryPubListOpt);
    }

    //查询ssid列表v3
    function querySSidList()
    {
        var needsListOpt= {};

        function querySsidListSuc(data)
        {
            console.log(data);
            var SSID_List = [];
            if(data.ssidList)
            {               
                //过滤掉设备端创建没有SSIDName的信息     
               data.ssidList.forEach(function(ssidListInfo){
                    if(ssidListInfo.ssidName)
                    {
                        SSID_List.push(ssidListInfo);   
                    }
                })
                needsListOpt.ssid_list = SSID_List;
                queryPubList(needsListOpt);
            }
            else
            {
                Frame.Msg.info(getRcText("DATA_error"),"error");
            }
        }

        function querySsidListFail(err)
        {
            console.log(err);
        }

        var querySsidListOpt = {
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            onSuccess:querySsidListSuc,
            onFailed:querySsidListFail
        }
        Utils.Request.sendRequest(querySsidListOpt);
    }

    //查询微信v2
    function queryChatList()
    {
        function queryChatListSuc(data)
        {
            console.log(data);
            var WeChartList = [];
            var WeChartArr = data.data || [];
            if(data.errorcode == 0)
            {
                WeChartArr.forEach(function(WeChartAccount){
                    WeChartList.push(WeChartAccount.name)
                });
            }
            $("#WeChartList").singleSelect("InitData",WeChartList);
            $("#addWeChartList").singleSelect("InitData",WeChartList);

            g_WeChartList = WeChartList;

        }

        function queryChatListFail(err)
        {
            console.log(err);
        }

        var queryChatListOpt = {
            type: "GET",
            url: MyConfig.v2path+"/weixinaccount/query?ownerName="+g_userName,
            dataType: "json",
            contentType: "application/json",
            onSuccess:queryChatListSuc,
            onFailed:queryChatListFail
        };

        Utils.Request.sendRequest(queryChatListOpt);
    }
   
    function initData()
    {
        queryChatList();  
        querySSidList();
        getSupportModel();
    }

    function initForm()
    {
        $("#advanceBtn,#add_advanceBtn").click(function () {
            $("#advanced_details,#add_advanced_details").toggle();
            $("#AdvanceClose,#add_AdvanceClose").toggleClass("advan_set3");
            return false;
        });

        $("input[name=addAuthenType], input[name=addLoginPage], input[name=AuthenType], input[name=LoginPage]").bind("change",function(){
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

        $("#add_feelauth1,#feelauth1").on("click",function(){
            //$(this).attr("checked","true");
            $("#anthTime,#add_anthTime").removeClass("hide");
            $("#anthTime").removeAttr("style","display");
        });

        $("#add_feelauth2,#feelauth2").on("click",function(){
            //$(this).attr("checked","true");
            $("#anthTime,#add_anthTime").addClass("hide");
           
        });
        
        $("#addAT4, #AT4").on("click", function(){
            $("#add_advanceBtn,#advanceBtn").addClass("hide");
            $("#add_advanced_details,#advanced_details").hide();    
        })

        $("#addAT1, #AT1, #addAT2, #AT2, #addAT3, #AT3").on("click", function(){
            $("#add_advanceBtn,#advanceBtn").removeClass("hide");    
        })

        $("#addAPC2").on("click", function(){
            $("#PwdBlock1").addClass("hide");
        })

        $("#addAPC1").on("click", function(){
            $("#PwdBlock1").removeClass("hide");  
        })
    }

    function _init()
    {
        g_shopName = Utils.Device.deviceInfo.shop_name;
        g_userName = FrameInfo.g_user.attributes.name;
        initGrid();
        initData();
        initForm();
    }

    function _resize(jParent)
    {

    }

    function _destroy()
    {
        g_SsidInfo = {};
        g_authcfgList = []; 
        g_loginPageList = [];
        g_addSsidName = "";
        g_description = ""; 
        g_WeChartList = [];
        g_addSsidInfo = {};
        hPending = "", pending = "";
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList", "Form", "SingleSelect", "Minput", "MSelect" ],
        "utils": ["Base", "Request", "Device"]
    });
}) (jQuery);
