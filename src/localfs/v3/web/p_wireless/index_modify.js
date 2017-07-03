(function($) {
    var MODULE_NAME ="h_wireless1.index_modify";
    var MODULE_RC = "h_wireless_indexModifys";
    var g_oPara,g_shopName,g_userName;
    var jFormSSID ;
    var g_SSidInfo = {};
    var hPending = null;
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(MODULE_RC, sRcName);
    }

    function getAkmModeType(oSsid)
    {
        if(!oSsid.akmModeStr){
            var type = oSsid.akmMode == 2 ? 1 : 0;
            return type;
        }else{
            switch(oSsid.akmModeStr){
                case "PSK":
                    return 1;
                case "DOT1X":
                    return 0;
                default :
                    return 0;
            };
        };
    }

    function refreshSSidInfo(needsListOpt)
    {
        var formInitObj = {
            stName:g_oPara.stName,
            ssidName:needsListOpt.ssidInfo.ssid_name,
            status:needsListOpt.ssidInfo.status,
            cipherSuites:getAkmModeType(needsListOpt.ssidV3Info) || 0,
            IDLE_CUT_FLOW:"ssssss",

            AuthenType:"AT1",//认证方式初始化
            LoginPage:"LP1"//页面模板初始化
        };

        if(needsListOpt.pubInfo&&needsListOpt.authInfo&&needsListOpt.themeInfo)
        {
            var authInfo = needsListOpt.authInfo;
            var temeplateInfo =needsListOpt.themeInfo;
            var pubMngInfo = needsListOpt.pubInfo;
            //认证模板 排除authInfo.v3flag == 0；情况
            if(!(authInfo.v3flag == false)||authInfo.v3flag == 1)
            {
                formInitObj.AuthenType = "AT4";//选择认证模板
                //无感知列消失
                $("#freeCertification", jFormSSID).hide();
            }
            else if(authInfo.v3flag == 0)
            {
                if(authInfo.authType == 1){
                    formInitObj.AuthenType = "AT2";//一键上网
                }
                else if(authInfo.authType == 2)
                {
                    formInitObj.AuthenType = "AT3";//账号登录
                    if(authInfo.isEnableSms == 1)
                    {
                        $("#Message + span",jFormSSID).addClass("checked");
                    }

                    if(authInfo.isEnableWeixin== 1)
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

                }
                //无感知设置
                if(authInfo.uamAuthParamList[4].authParamValue == "0")
                {
                    $("#auto_study_enable", jFormSSID).MCheckbox("setState",false);
                    $(".Learn-MAC", jFormSSID).hide();
                }
                else
                {
                    formInitObj.impose_auth_time = authInfo.uamAuthParamList[4].authParamValue;
                    $("#auto_study_enable").MCheckbox("setState",true);
                    $(".Learn-MAC", jFormSSID).show();
                }
            }
            //页面模板 temeplateInfo.v3flag ==undefined
            if(!(temeplateInfo.v3flag == false)||temeplateInfo.v3flag == 1)
            {
                formInitObj.LoginPage = "LP4";//页面模板
            }
            else if(temeplateInfo.v3flag == 0)
            {
                formInitObj.LoginPage = "LP1";//简约
            }
            //发布模板
            formInitObj.AuthCfgList = pubMngInfo.authCfgName;
            formInitObj.LoginPageList = pubMngInfo.themeTemplateName;
            formInitObj.WeChartList = pubMngInfo.weixinAccountName;
        }
        g_SSidInfo.oldFormInfo = formInitObj;
        g_SSidInfo.needsListOpt = needsListOpt;

        var oStInfo = {
            "stName":formInitObj.stName,
            "ssidName":formInitObj.ssidName
        }

        jFormSSID.form("updateForm", formInitObj);
        Utils.Base.updateHtml(jFormSSID,oStInfo);

        //无线服务名称过长进行的换行操作
        function toBreakWord(intLen){ 
            var obj=document.getElementById("stName");//文字内容所在容器的id 
            var strContent=obj.innerHTML; 
            var strTemp=""; 
            while(strContent.length>intLen){ 
            strTemp+=strContent.substr(0,intLen)+"<br />"; 
            strContent=strContent.substr(intLen,strContent.length); 
            } 
            strTemp+=strContent; 
            obj.innerHTML=strTemp; 
            } 
        toBreakWord(32);
         
        onAdviceShow();

        hPending.close();
    }

    function synSSIDv3()
    {
        function synSSIDv3Suc(data)
        {
            if(data.errCode == 0)
            {
              var oUrlPara = {
                np: "h_wireless1.index_wireless"
                };
                Utils.Base.redirect(oUrlPara);
            }else{
                Frame.Msg.info("自动同步失败,请手动同步","error");
                hPending.close();
                var oUrlPara = {
                    np: "h_wireless1.index_wireless"
                };
                Utils.Base.redirect(oUrlPara);
            }


        }

        function synSSIDv3Fail(err)
        {
            Frame.Msg.info("自动同步失败","error");
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
        }

        var synSSIDv3 = {
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
                param:[{
                        
                }]
            }),
            onSuccess:synSSIDv3Suc,
            onFailed:synSSIDv3Fail
        };

        Utils.Request.sendRequest(synSSIDv3);
    }

    function  synSSID()
    {
        function synSuc(data)
        {
            console.log(data);
            if(data&&data.error_code=="0"){
                    synSSIDv3();
                    // Utils.Base.refreshCurPage();
            }
            else{
                Frame.Msg.info("自动同步失败,请手动同步","error");
                var oUrlPara = {
                    np: "h_wireless1.index_wireless"
                };
                Utils.Base.redirect(oUrlPara);
            }
        }

        function synFail(err)
        {
            Frame.Msg.info("自动同步失败,请手动同步","error");
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
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





    function queryThemeTempleteList(needsListOpt)//查询页面模板
    {
        function queryTempleteListSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0)
            {
                var loginPageList = [];
                var loginPageObj =  {};
                data.data.forEach(function(loginPage){
                    if(!(loginPage.v3flag == false)||loginPage.v3flag == 1)
                    {
                        loginPageList.push(loginPage.themeName);
                    }
                    if(g_oPara.flag == 1&&loginPage.themeName == needsListOpt.pubInfo.themeTemplateName)
                    {
                        loginPageObj = loginPage;
                    }
                })
                $("#LoginPageList").singleSelect("InitData",loginPageList);
                if(g_oPara.flag == 1)
                {
                    needsListOpt.themeInfo =loginPageObj;
                }
                refreshSSidInfo(needsListOpt);
            }


        }

        function queryTempleteListFail(err)
        {
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
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

    function queryAuthList(needsListOpt)//查询认证模板
    {
        function queryAuthListSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0){
                var authObj = {};
                var authcfgList = [];
                data.data.forEach(function(authcfg){
                    if(!(authcfg.v3flag == false)||authcfg.v3flag == 1){
                        authcfgList.push(authcfg.authCfgTemplateName);
                    }
                    if(g_oPara.flag == 1&&authcfg.authCfgTemplateName == needsListOpt.pubInfo.authCfgName)
                    {
                        authObj = authcfg;
                    }
                });
                $("#AuthCfgList").singleSelect("InitData",authcfgList);
                if(g_oPara.flag == 1)
                {
                    needsListOpt.authInfo = authObj;
                }
                queryThemeTempleteList(needsListOpt);//查询页面模板
            }
        }

        function queryAuthListFail(err)
        {
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
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

    function getPubInfo(needsListOpt)
    {
        function getPubInfoSuc(data){
            console.log(data);
            if(data.errorcode == 0)
            {
                needsListOpt.pubInfo =data.data;
                queryAuthList(needsListOpt);
            }
        }

        function getPubInfoFail(err){
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
        }

        var getPubInfoOpt = {
            url: MyConfig.v2path + "/pubmng/querybyname",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            data:{
                ownerName:g_userName,
                shopName:g_shopName,
                name:g_oPara.pubName
            },
            onSuccess:getPubInfoSuc,
            onFailed:getPubInfoFail
        }
        Utils.Request.sendRequest(getPubInfoOpt);
    }

    //查询v3的ssid列表
    function queryV3SSIdList(needsListOpt)//这个是v3接口的信息/ssidmonitor/getssidlist
    {
        function queryV3SSIdListSuc(data){
            console.log(data);
            if(data.ssidList)
            {
                // $.each(data.ssidList,function(i,ssid) {
                //     if(g_oPara.stName == ssid.stName){
                //         needsListOpt.ssidV3Info = ssid ;
                //     }
                // })
                needsListOpt.ssidV3Info = data.ssidList[0];
                if(g_oPara.flag == 1)//下面的判断怎么说都会走到queryAuthList这里
                {
                    getPubInfo(needsListOpt);
                }
                else if(g_oPara.flag == 0)
                {
                    queryAuthList(needsListOpt);
                   // refreshSSidInfo(needsListOpt);
                }

            }
            else
            {
                Frame.Msg.info("获取数据错误","error");
            }

        }

        function queryV3SSIdListFail(err){
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
        }

        var queryV3SSIdListOpt = {
            url: MyConfig.path + "/ssidmonitor/getssidlist?devSN=" + FrameInfo.ACSN +"&stName=" + g_oPara.stName,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess:queryV3SSIdListSuc,
            onFailed:queryV3SSIdListFail
        }
        Utils.Request.sendRequest(queryV3SSIdListOpt);
    }

    function querySSidList(){//这个是v2接口的信息/getSSIDInfo

        var needsListOpt= {};

        function querySsidListSuc(data){
            console.log(data);
            if(data.ssid_list)
            {
                $.each(data.ssid_list,function(i,ssid) {
                    if(g_oPara.stName == ssid.sp_name){
                        needsListOpt.ssidInfo = ssid;
                    }
                })
                queryV3SSIdList(needsListOpt);
            }
            else
            {
                Frame.Msg.info("获取数据错误","error");
            }

        }

        function querySsidListFail(err){
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
        }

        var querySsidListOpt = {
            type: "POST",
            url: MyConfig.v2path+"/getSSIDInfo",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                tenant_name: g_userName,
                dev_snlist: [FrameInfo.ACSN]
            }),
            onSuccess:querySsidListSuc,
            onFailed:querySsidListFail
        }
        Utils.Request.sendRequest(querySsidListOpt);
    }

    function queryChatList()//查询出所有微信公众号
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

        }

        function queryChatListFail(err)
        {
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
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
        queryChatList();//查询出所有微信公众号,在这里没有将数据刷到input框中
        querySSidList();
    }

    function refreshPage(flag,pubName)
    {
        var oUrlPara = {
            np: "h_wireless1.index_modify",
            stName: g_oPara.stName,
            flag:flag
        };
        if(flag===1)
        {
            oUrlPara.pubName = pubName;
        }
        Utils.Base.redirect(oUrlPara);

    }

    //删除旧的页面模板
    function delTheme(operateDel)
    {
        function themetemplateDelSuc(data){
            console.log(data);
            if(data.errorcode == "0"){
                if(operateDel == "delOldTheme")
                {
                    Frame.Msg.info("配置成功");
                    // Utils.Base.refreshCurPage();
                    synSSID();
                    // Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                }
                else if(operateDel == "delBoth")
                {
                    delAuth(operateDel);

                }else if(operateDel)
                {
                    delAuth();
                }
            }
        }

        function themetemplateDelFail(){
            Frame.Msg.info("获取数据错误","error");
            console.log("fail5");
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
        }

        var themetemplateDelOpt = {
            type: "POST",
            url: MyConfig.v2path+"/themetemplate/delete",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "ownerName":g_userName,
                "themeName": g_SSidInfo.needsListOpt.pubInfo.themeTemplateName
            }),
            onSuccess: themetemplateDelSuc,
            onFailed: themetemplateDelFail
        }

        Utils.Request.sendRequest(themetemplateDelOpt);
    }
    //删除旧的认证模板
    function delAuth(operateDel)
    {
        function authcfgDelSuc(data){
            console.log(data);
            if(data.errorcode == 0)
            {
                if(operateDel == "delOldAuth")
                {
                    Frame.Msg.info("配置成功");
                    // Utils.Base.refreshCurPage();
                    // Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                    synSSID();
                }
                else if(operateDel == "delBoth")
                {
                    Frame.Msg.info("配置成功");
                    // Utils.Base.refreshCurPage();
                    // Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                    synSSID();
                }
                else
                {
                    Frame.Msg.info("配置成功");
                    synSSID();
                    
                }
            }
        }

        function authcfgDelFail(){
            Frame.Msg.info("获取数据错误","error");
            console.log("fail4");
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
        }

        var authcfgDelOpt = {
            type: "post",
            url: MyConfig.v2path+"/authcfg/delete",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                ownerName:g_userName,
                "authCfgTemplateName":g_SSidInfo.needsListOpt.pubInfo.authCfgName
            }),
            onSuccess: authcfgDelSuc,
            onFailed: authcfgDelFail
        };

        Utils.Request.sendRequest(authcfgDelOpt);

    }
    //删除旧的
    function delPublish(pubMngName,isDelTheme,isDelAuth)
    {
        function delPublishSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0)
            {
                if(isDelTheme)
                {
                    delTheme(isDelAuth);
                }
                else
                {
                    synSSID();
                    // refreshPage(0);
                    // var oUrlPara = {
                    //     np: "h_wireless1.index_wireless"
                    // };
                    // Utils.Base.redirect(oUrlPara);
                }
            }
        }

        function delPublishFail(err)
        {
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
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
                Frame.Msg.info("配置成功");
                synSSID();
                // refreshPage(1,pubMngName);

            }
            // var oUrlPara = {
            // np: "h_wireless1.index_wireless"
            // };
            // Utils.Base.redirect(oUrlPara);
        }

        function isPublishPubmngedFail(err)
        {
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
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
            pubData.ssidName = g_SSidInfo.needsListOpt.ssidInfo.ssid_name;
            pubData.ssidId = g_SSidInfo.needsListOpt.ssidInfo.ssid;//ID
            pubData.description = "add autoName publishTemplate"
        }
        else
        {
            var url =MyConfig.v2path+"/pubmng/modify";
            pubData.name = g_SSidInfo.needsListOpt.pubInfo.name;
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
                    else{
                        Frame.Msg.info("配置成功");
                        // Utils.Base.refreshCurPage();
                        synSSID();
                        // Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                    }
                }

            }
            else
            {
                Frame.Msg.info("配置失败","error");
            }
        }

        function publishFail(err)
        {
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
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
    //下面是设置了v3flag的值为0
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
                themeName:g_SSidInfo.needsListOpt.themeInfo.themeName
               };
           needPubObj.themeName = g_SSidInfo.needsListOpt.themeInfo.themeName;
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
                    Frame.Msg.info("配置成功");
                    // Utils.Base.refreshCurPage();
                    synSSID();
                    // Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                }
           }
           else{
                Frame.Msg.info("配置失败");    
           }
       }

       function themeFail(err)
       {
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
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

        if(oStData.auto_study_enable === "false")
        {
            oStData.unauthtime = 0;
        }

        if(oStData.auto_study_enable === "true")
        {
            oStData.unauthtime=oStData.impose_auth_time;
        }
        var authData={
            ownerName:g_userName,
            authType:1,
            isEnableSms:0,
            isEnableWeixin:0,
            isEnableAccount:0,
            isWeixinConnectWifi:0,
            isEnableAli:0,
            isEnableQQ:0,
            uamAuthParamList:[
                {authParamName:"ONLINE_MAX_TIME",authParamValue:21600},
                {authParamName:"URL_AFTER_AUTH",authParamValue:""},
                {authParamName:"IDLE_CUT_TIME",authParamValue:30},
                {authParamName:"IDLE_CUT_FLOW",authParamValue:10240},
                {authParamName:"NO_SENSATION_TIME",authParamValue:oStData.unauthtime}
            ]
        };

        if(oStData.AuthenType == "AT3")
        {
            authData.authType = 2;//固定认证
            $("input[name='LoginWays']",jFormSSID).each(
                function(){
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
            var url = MyConfig.v2path+"/authcfg/add"
            authData.authCfgTemplateName = autoName;
            authData.v3flag = 0;
            needPubObj.authCfgTemplateName = autoName;
        }
        else
        {
            var url =MyConfig.v2path+"/authcfg/modify"
            authData.v3flag = 0;
            authData.authCfgTemplateName = g_SSidInfo.needsListOpt.authInfo.authCfgTemplateName;
            needPubObj.authCfgTemplateName = g_SSidInfo.needsListOpt.authInfo.authCfgTemplateName;
        }

        if(oStData.WeChartList)
        {
            needPubObj.weixinAccountName = oStData.WeChartList;
        }

        function authcfgSuc(data)
        {
            console.log(data);
            if(data.errorcode==1112){
                Frame.Msg.info("请选择账号登录下的至少一种认证方式");
            };
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

        }

        function authcfgFail()
        {
            Frame.Msg.info("获取数据错误","error");
            console.log("fail1");
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
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
       
        if(g_SSidInfo.needsListOpt.pubInfo)//之前有发布模板
        {
            //不用关心页面模板，只是删除发布模板功能
            if(oStData.AuthenType == "AT1")
            {
                //删除发布模板,不删除认证模认证模板【v3flag = 1||v3flag不存在】
                if(g_SSidInfo.oldFormInfo.AuthenType == "AT4")
                {
                    if(g_SSidInfo.oldFormInfo.LoginPage == "LP4")
                    {
                        //TODO 只是删除发布模板
                        delPublish(g_SSidInfo.needsListOpt.pubInfo.name);
                    }
                    else if(g_SSidInfo.oldFormInfo.LoginPage == "LP1")
                    {
                        //TODO 只是删除发布模板,且删除页面模板
                        delPublish(g_SSidInfo.needsListOpt.pubInfo.name,true);
                    }
                }
                //删除认证模板【v3flage = 0】
                else if(g_SSidInfo.oldFormInfo.AuthenType == "AT2"||g_SSidInfo.oldFormInfo.AuthenType == "AT3")
                {
                    if(g_SSidInfo.oldFormInfo.LoginPage == "LP4")
                    {
                        //TODO 只是删除发布模板,且删除认证模板
                        delPublish(g_SSidInfo.needsListOpt.pubInfo.name,false,true);
                    }
                    else if(g_SSidInfo.oldFormInfo.LoginPage == "LP1")
                    {
                        //TODO 只是删除发布模板,且删除认证模板,且删页面模板
                        delPublish(g_SSidInfo.needsListOpt.pubInfo.name,true,true);
                    }
                }

            }
            //新增或修改认证模板
            else if(oStData.AuthenType == "AT2"||oStData.AuthenType == "AT3")
            {
                //添加认证模板（auto）
                if(g_SSidInfo.oldFormInfo.AuthenType == "AT4")
                {
                    if(g_SSidInfo.oldFormInfo.LoginPage == "LP4")
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
                    else if(g_SSidInfo.oldFormInfo.LoginPage == "LP1")
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
                else if(g_SSidInfo.oldFormInfo.AuthenType == "AT2"||g_SSidInfo.oldFormInfo.AuthenType == "AT3")
                {
                    if(g_SSidInfo.oldFormInfo.LoginPage == "LP4")
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
                    else if(g_SSidInfo.oldFormInfo.LoginPage == "LP1")
                    {

                        if(oStData.LoginPage == "LP1")
                        {
                            //TODO 修改认证模板，修改页面模板,发布模板直接生效
                            editAndaddAuth(oStData,"modify",autoName,"modify");
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

                if(g_SSidInfo.oldFormInfo.AuthenType == "AT4")
                {
                    if(g_SSidInfo.oldFormInfo.LoginPage == "LP4")
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
                    else if(g_SSidInfo.oldFormInfo.LoginPage == "LP1")
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
                else if(g_SSidInfo.oldFormInfo.AuthenType == "AT2"||g_SSidInfo.oldFormInfo.AuthenType == "AT3")
                {
                    if(g_SSidInfo.oldFormInfo.LoginPage == "LP4")
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
                    else if(g_SSidInfo.oldFormInfo.LoginPage == "LP1")
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
               Frame.Msg.info("配置成功");
               synSSID();
               // Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
            }
        }
        
    }

    function updateSsidInfo(oStData)
    {
        function SSIDUpdateSuc(data)
        {
            if(data.reason=="main connection is not found")
            {
                Frame.Msg.info(getRcText("MAINLINK"),"error");
                history.back();
                return;
            }

            var time=Frame.DataFormat.getStringTime(new Date());
            var name = FrameInfo.Nasid+"_"+time;

            authOperate(oStData,name);

        }

        function SSIDUpdateFail(err)
        {
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
            hPending.close();
            var oUrlPara = {
                np: "h_wireless1.index_wireless"
            };
            Utils.Base.redirect(oUrlPara);
        }
        var themetemplateDelOpt = {
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN:FrameInfo.ACSN,
                module : "stamgr",
                method : "SSIDUpdate",
                configType:0,
                cloudModule:"stamgr",
                deviceModule:"stamgr",
                param:[{
                        stName:oStData.stName,
                        ssidName:oStData.ssidName,
                        status:parseInt(oStData.status)
                }]
            }),
            onSuccess: SSIDUpdateSuc,
            onFailed: SSIDUpdateFail
        }

        Utils.Request.sendRequest(themetemplateDelOpt);
    }

    function onSubmit()
    {
        var oTempTable = {
            index:[],
            column:["stName","ssidName","status","cipherSuites","IDLE_CUT_FLOW",
                "AuthenType","LoginPage","LoginPageList","AuthCfgList","WeChartList",
                "auto_study_enable", "impose_auth_time"]
        };
        var oStData = jFormSSID.form ("getTableValue", oTempTable);

        updateSsidInfo(oStData);  //更新SSID      
        
    }

    function onCancle()
    {
        var oUrlPara = {
            np: "h_wireless1.index_wireless"
        };
        Utils.Base.redirect(oUrlPara);
    }

    function onAdviceShow()
    {
        var oTempTable = {
            index:[],
            column:["AuthenType","LoginPage"]
        };
        var oStData = jFormSSID.form ("getTableValue", oTempTable);
        var sAuthType = oStData.AuthenType || "";
        var sLogin = oStData.LoginPage || "";

        if (sAuthType == 'AT1')
        {
            $("#denglu").hide();
            $("#weixinPub").hide();
            $("#freeCertification").hide();
        }
        else if(sAuthType == 'AT4')
        {
            $("#denglu").show();
            $("#weixinPub").show();
            $("#freeCertification").hide();
        }
        else
        {
            $("#denglu").show();
            $("#weixinPub").show();
            $("#freeCertification").show();
        }

        if (sLogin == 'LP1') 
        {
            $("#LoginPageSelect").hide();
        }

    }

    function initForm() {

        //下面这句话是为了让按钮点击和关闭的时候能把下面的东西去掉
        $(".switch,#impose_auth").bind("minput.changed", function(e, data) {
            var sClass = $(this).attr("ctrlBlock");
            this.checked ? $(sClass).show() : $(sClass).hide();
        });
        //下面这句话是让你选择模板的时候能把隐藏的各项全拿出来
        $("input[name=AuthenType], input[name=LoginPage],input[name=cipherSuites]").bind("change", function() {
            var aContent = $(this).attr("content");
            var sCtrlBlock = $(this).attr("ctrlBlock") || "";
            $(sCtrlBlock).hide();

            // if($(this).val() == "AT4")
            // {
            //     $("#freeCertification", $("#toggle_form")).hide();
            // }
            // else if($(this).val() == "AT1"||$(this).val() == "AT2"||$(this).val() == "AT3")
            // {
            //     $("#freeCertification", $("#toggle_form")).show();
            // }

            if (!aContent) return true;
            aContent = aContent.split(",");
            for (var i = 0; i < aContent.length; i++) {
                if (!aContent[i]) continue;
                $(aContent[i]).show();
            };

        });

        $("#impose_auth_time").bind("change", function() {
            var value = $(this).val();
            if (value > 30) {
                $(this).val(30);
            } else if (value < 1) {
                $(this).val(1)
            }
        });

        $("#ensure").on("click" ,onSubmit);

        $("#cancel").on("click" ,onCancle);

        $("input[type=radio][name=AuthenType],input[type=radio][name=LoginPage]").on("click",function(){
            onAdviceShow();
        });
    }

    function initGrid()
    {
        jFormSSID.form("init","update");
    }

    function _init()
    {
        g_oPara = Utils.Base.parseUrlPara();
        g_shopName = Utils.Device.deviceInfo.shop_name;
        g_userName = FrameInfo.g_user.attributes.name;
        jFormSSID = $("#toggle_form");
        initGrid();
        initForm();
        hPending = Frame.Msg.pending(getRcText("PENDING"));
        initData();
    }

    function _resize(jParent)
    {}

    function _destroy() {
        console.log("destory**************");
        g_oPara = "";
        g_shopName="";
        g_userName="";
        jFormSSID ="";
        hPending.close();
        g_SSidInfo={};
        hPending = null;
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Minput", "SList", "Form", "SingleSelect", "MSelect"],
        "utils": ["Base","Request","Device"],
    });

})(jQuery);;