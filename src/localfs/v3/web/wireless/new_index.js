/**
 * Created by Administrator on 2016/6/2.
 */
;(function ($)
{
    var MODULE_NAME = "wireless.new_index";
    var rc_info = "ws_ssid_rc",g_shopName,g_userName;
    var  g_PercentMax = 100;
    var g_SsidInfo = {},g_supportModelArr = [],hPending;

    var g_Limit = Frame.Permission.getCurPermission();   //分级分权

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }

    //删除旧的页面模板
    function delTheme(operateDel,oDate,isSyncSsid,delOnlyAuth)
    {

        var reqData =  {
            "storeId":FrameInfo.Nasid
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
            if(data.errorcode == "0"){
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
                        hPending(100);
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
               /*
                else if(operateDel)
                {

                }*/
            }
        }

        function themetemplateDelFail(){
            console.log("fail5");
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
    //删除旧的认证模板
    function delAuth(operateDel,oDate,isSyncSsid)
    {
        var reqData = {
            storeId:FrameInfo.Nasid
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
                    Frame.Msg.info("配置成功");
                    Utils.Base.refreshCurPage();
                }
                else if(operateDel == "delBoth")
                {
                    hPending.close(100)
                    Frame.Msg.info("配置成功");
                    Utils.Base.refreshCurPage();

                }
                else if(operateDel == "delSsid"&&isSyncSsid)
                {
                    synSSID(false,true);
                }
                else
                {
                    hPending.close(100);
                    Frame.Msg.info("配置成功");
                    Utils.Base.refreshCurPage();
                }
            }
        }

        function authcfgDelFail(){
            hPending.close(100);
            Frame.Msg.info("配置失败","error");
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
    //删除旧的
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
                    console.log("auto del pub")
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
            Frame.Msg.info(getRcText("CFG_FAIL"),"error");
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
                shopName: g_shopName,
                nasId:FrameInfo.Nasid
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
            Frame.Msg.info(getRcText("CFG_FAIL"),"error");
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
                isPublish: isPublish,
                nasId:FrameInfo.Nasid
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
            nasId:FrameInfo.Nasid
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
            var url =MyConfig.v2path+"/pubmng/modify";
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
                    else{
                        hPending.close(100);
                        Frame.Msg.info(getRcText("CFG_OK"));
                        Utils.Base.refreshCurPage();
                    }
                }

            }
            else
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("CFG_FAIL"),"error");
            }
        }

        function publishFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_FAIL"),"error");
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
                storeId:FrameInfo.Nasid,
                themeType:1,
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
                storeId:FrameInfo.Nasid,
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
        }

        function themeFail(err)
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_FAIL"),"error");
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

        if(oStData.auto_study_enable === "false")
        {
            oStData.unauthtime = 0;
        }

        if(oStData.auto_study_enable === "true")
        {
            oStData.unauthtime=oStData.impose_auth_time;
        }

        var authData={
            storeId:FrameInfo.Nasid,
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
            $("input[name='LoginWays']",$("#toggle_form")).each(
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
                Frame.Msg.info(getRcText("CFG_FAIL"),"error");
            }

        }

        function authcfgFail()
        {
            hPending.close(100);
            Frame.Msg.info(getRcText("CFG_FAIL"),"error");
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
                        //TODO 只是删除发布模板,且删除页面模板
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
                        //TODO 只是删除发布模板,且删除认证模板,且删页面模板
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
            }
        }

    }

    //显示SSID
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
                column:["SSID","AuthenType","LoginPage","LoginPageList","AuthCfgList","WeChartList","auto_study_enable", "impose_auth_time"]
            };
            var oStData = jFormSSID.form ("getTableValue", oTempTable);

            var time=Frame.DataFormat.getStringTime(new Date());

            var name = FrameInfo.Nasid+"_"+time;

            g_SsidInfo = oRowdata;

            hPending = Frame.Msg.pending(getRcText("CFG_senting"));

            authOperate(oStData,name);
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
            $("#freeCertification", jFormSSID).show();
            $("#auto_study_enable", jFormSSID).MCheckbox("setState",false);
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
                //认证模板
                if(!(authInfo.v3flag == false)||authInfo.v3flag == 1)
                {
                    oRowdata.AuthenType = "AT4";//选择认证模板
                    //无感知列消失
                    $("#freeCertification", jFormSSID).hide();
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

                    }
                    //无感知设置
                    if(authInfo.uamAuthParamList[4].authParamValue == "0")
                    {
                        $("#auto_study_enable", jFormSSID).MCheckbox("setState",false);
                        $(".Learn-MAC", jFormSSID).hide();
                    }
                    else
                    {
                        oRowdata.impose_auth_time = authInfo.uamAuthParamList[4].authParamValue;
                        $("#auto_study_enable").MCheckbox("setState",true);
                        $(".Learn-MAC", jFormSSID).show();
                    }
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
            }
            jFormSSID.form("updateForm",oRowdata);
        }
    }

    function  synSSID(isAddSsid,isDelSsid)
    {

        function synSuc(data)
        {
            console.log(data);
            if(data&&data.error_code=="0"){
                if(isAddSsid)
                {
                    if(typeof isAddSsid == "boolean")
                    {
                        hPending&&hPending.close&&hPending.close(100);
                        Frame.Msg.info(getRcText("ADD_SUCCESS"));
                        onCancelAddSsid();
                    }
                    else if(typeof isAddSsid == "object")
                    {
                        hPending&&hPending.close&&hPending.close(100);
                        Frame.Msg.info(data.error_message);
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
            type: "GEt",
            url:"/v3/ace/oasis/oasis-rest-shop/restshop/o2oportal/syncAc?acsn="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            onSuccess:synSuc,
            onFailed:synFail
        }
        Utils.Request.sendRequest(synOpt);
    }

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

    

    function refreshSSIDList(needListOpt)
    {
        var aAuthType = getRcText("AUTHEN_TYPE").split(",");
        var ssid_list = needListOpt.ssid_list || [];
        //新定义obj
        var obj = {};
        var ssidRefreshArr = [];
        ssid_list.forEach(function(ssid){
            var SSID_Id =  ssid.ssid;

            obj[SSID_Id] = {//设置初始值
                SSID: ssid.ssidName,
                SSID_Id:SSID_Id,
                sp_name: ssid.stName,
                AuthType: aAuthType[0]
            };
        });

        var pubmng_list =  needListOpt.publishList || [];

        pubmng_list.forEach(function(pubmng){
            if (!("ssidName" in pubmng)){
                delPublish(pubmng.name,false,false,false,null,true);
                return;
            }
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

        for (var a in obj){
            ssidRefreshArr.push(obj[a]);
        }
        $("#ssidList").SList ("refresh", ssidRefreshArr);

    }

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
                    if(!(loginPage.v3flag == false)||loginPage.v3flag == 1)
                    {
                        loginPageList.push(loginPage.themeName);
                    }
                })
                $("#LoginPageList").singleSelect("InitData",loginPageList);

                needListOpt.temepleteList = loginPageArr;
                refreshSSIDList(needListOpt);
            }


        }

        function queryTempleteListFail(err)
        {
            console.log(err);
        }

        var queryTempleteListOpt = {
            type: "GET",
            url: MyConfig.v2path+"/themetemplate/query?storeId="+FrameInfo.Nasid,
            dataType: "json",
            contentType: "application/json",
            onSuccess:queryTempleteListSuc,
            onFailed:queryTempleteListFail
        };

        Utils.Request.sendRequest(queryTempleteListOpt);
    }

    function queryAuthList(needListOpt)
    {
        function queryAuthListSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0){
                var auth_list = data.data||[];
                var authcfgList = [];
                auth_list.forEach(function(authcfg){
                    if(!(authcfg.v3flag == false)||authcfg.v3flag == 1){
                        authcfgList.push(authcfg.authCfgTemplateName);
                    }
                });
                $("#AuthCfgList").singleSelect("InitData",authcfgList);

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
            url: MyConfig.v2path+"/authcfg/query?storeId="+FrameInfo.Nasid,
            dataType: "json",
            contentType: "application/json",
            onSuccess:queryAuthListSuc,
            onFailed:queryAuthListFail
        };

        Utils.Request.sendRequest(queryAuthListOpt);

    }

    function queryPubList(needListOpt)
    {

        function queryPubListSuc(data) {
            console.log(data);
            if(data.errorcode == 0){
                needListOpt.publishList = data.data;
                queryAuthList(needListOpt);
            }else if(data.errorcode == 1006){ 
                Frame.Msg.info(getRcText("ERROR_CODE_1006"),"error");
            }else if(data.errorcode == 1007){ 
                Frame.Msg.info(getRcText("ERROR_CODE_1007"),"error");
            }
        }

        function queryPubListFail(err) {
            console.log(err);
        }
        var shopName = Utils.Device.deviceInfo.shop_name;
        var ownerName = FrameInfo.g_user.attributes.name
        var queryPubListOpt = {
            type: "GET",
            url: MyConfig.v2path+"/pubmng/query?shopName="+ownerName+"&nasId="+FrameInfo.Nasid,
            contentType: "application/json",
            dataType: "json",
	        // data:JSON.stringify({
	    	//     ownerName:FrameInfo.g_user.attributes.name,
		    //     shopName:shopName,
            //     nasId:FrameInfo.Nasid
	        // }),
            onSuccess:queryPubListSuc,
            onFailed:queryPubListFail
        }
        Utils.Request.sendRequest(queryPubListOpt);
    }

    //查询ssid列表
    function querySSidList()
    {

        var needsListOpt= {};

        function querySsidListSuc(data){
           console.log(data);
           var SSID_List = [];
            if(data.ssidList)
            {
                /*needsListOpt.ssid_list = data.ssid_list;
                queryPubList(needsListOpt);*/
                //过滤掉设备端创建没有SSIDName的信息 2016.09.22
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

        function querySsidListFail(err){
            console.log(err);
        }

        var querySsidListOpt = {
            type: "GET",
            url: "/v3/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            onSuccess:querySsidListSuc,
            onFailed:querySsidListFail
        }
        Utils.Request.sendRequest(querySsidListOpt);
    }

    function bingSSIDByAPgroup(stName)
    {
        var paramArr =[];

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
            if(data.communicateResult == "fail" ||data.serviceResult == "fail")
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

            if(data.communicateResult == "success" && data.serviceResult == "success")
            {
                //TODO 成功处理 最后同步ssid
                synSSID(true);
            }
        }

        function bingSSIDByAPgroupFail(err)
        {
            hPending.close(200);
            Frame.Msg.info(getRcText("ADD_FAIL"),"error")
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

    function portalEnable(stName)
    {

        function portalEnableSuc(data)
        {
            if(data.communicateResult == "fail" ||data.serviceResult == "fail")
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

            if(data.communicateResult == "success" && data.serviceResult == "success")
            {
                //TODO 成功处理
                bingSSIDByAPgroup(stName);
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

    function ssidAddAndUpdate()
    {
        var sStName = Frame.Util.generateID("st");//随机生成
        var oTempTable = {
            index:[],
            column:["ssid_name"]
        };

        var ssidInfo = $("#AddSsidForm").form ("getTableValue", oTempTable);
        var bStatus = 1;//使能
        var bHide = 0;//是否隐藏ssid
        var bEncrypt = 0;//加密套件
        var nMaxSendRatio = 0;//默认值
        var nmaxReceiveRatio = 0;//默认值

        var reqData = {
            devSN: FrameInfo.ACSN,
            configType : 0,
            cloudModule : "stamgr",
            deviceModule : "stamgr",
            method: "SSIDUpdate",
            param:[{
                stName: sStName ,
                ssidName: ssidInfo.ssid_name ,
                description: "1",//1,2,3分别表示服务类型
                status: bStatus,
                hideSSID: bHide,
                cipherSuite: bEncrypt,
                maxSendRatio: nMaxSendRatio,
                maxReceiveRatio: nmaxReceiveRatio
            }]

        };

        function SSIDUpdateSuc(data)
        {
            if(data.communicateResult == "fail" ||data.serviceResult == "fail")
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
               // Utils.Base.refreshCurPage();
                return;
            }

            if(data.communicateResult == "success" && data.serviceResult == "success")
            {
                //TODO 成功处理
                portalEnable(sStName);

            }
        }

        function SSIDUpdateFail(err)
        {
            console.log(err);
            hPending.close(200);
            Frame.Msg.info(getRcText("ADD_FAIL"),"error");
        }


        var SSIDUpdateOpt = {
            type: "POST",
            url: MyConfig.path+"/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(reqData),
            onSuccess:SSIDUpdateSuc,
            onFailed:SSIDUpdateFail
        }

        Utils.Request.sendRequest(SSIDUpdateOpt);

    }

    function getApModel()
    {
        var paramArr =[];
        $.each(g_supportModelArr,function(i,v){
            var paramObj = {};
            paramObj.apGroupName = "default-group";//默认default组
            paramObj.apModel = v.apmodel;
            paramArr.push(paramObj);
        });
        var reqData = {
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

        };

        if(paramArr.length > 0)
        {
            reqData.param = paramArr;
        }

        function getApModelSuc(data)
        {
            if(data.communicateResult == "fail" ||data.serviceResult == "fail")
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("LINK"),"error");
              /*  onCancelAddSsid();
                Utils.Base.refreshCurPage();*/
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
               /* onCancelAddSsid();
                Utils.Base.refreshCurPage();*/
                return;
            }

            if(data.communicateResult == "success" && data.serviceResult == "success")
            {
                //TODO 成功处理
                ssidAddAndUpdate();
            }
        }

        function getApModelFail(err)
        {
            hPending.close(200);
            Frame.Msg.info(getRcText("ADD_FAIL"),"error");
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
                    console.log("该设备版本不支持获取支持的model操作，请升级新版本");
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

    function onCfgAddSsid()
    {
        hPending = Frame.Msg.pending(getRcText("CFG_add_senting"));
        getApModel();
    }

    function onCancelAddSsid()
    {
        Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddSsidForm")));
    }


    function onAddSSID()
    {
        var addForm = $("#AddSsidForm");
        addForm.form("init", "add", {"title":getRcText("ADD_TITLE"), "btn_apply":onCfgAddSsid, "btn_cancel":onCancelAddSsid});
       //form初始化弹出添加框
        $("input[type=text]",$("#AddSsidForm")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $("#AddSsidForm").form("updateForm",{ssid_name: ""})

        Utils.Base.openDlg(null, null,{scope:$("#AddSsidDlg"), className:"modal-large"});
    }

    //删除
    function  SSIDDelete(stName,oData)
    {
        function SSIDDeleteSuc(data)
        {
            if(data.communicateResult == "fail" ||data.serviceResult == "fail")
            {
                hPending.close(100);
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
                hPending.close(100);
                Frame.Msg.info(getRcText("DEL_FAIL"),"error");
                Utils.Base.refreshCurPage();
                return;
            }

            if(data.communicateResult == "success" && data.serviceResult == "success")
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

    //将SSID从AP组中解绑
    function SSIDUnbindByAPGroup(stName,oData)
    {
        function SSIDUnbindByAPGroupSuc(data)
        {
            if(data.communicateResult == "fail" ||data.serviceResult == "fail")
            {
                hPending.close(100);
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
            if(i == 0)
            {
                hPending.close(100);
                Frame.Msg.info(getRcText("DEL_FAIL"),"error");
                Utils.Base.refreshCurPage();
                return;
            }

            if(data.communicateResult == "success" && data.serviceResult == "success")
            {
                //TODO 成功处理
                SSIDDelete(stName,oData);
            }
        }

        function SSIDUnbindByAPGroupFail(err)
        {
            console.log(err);
        }

        var paramArr =[];

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

        }

        function queryChatListFail(err)
        {
            console.log(err);
        }

        var queryChatListOpt = {
            type: "GET",
            url: MyConfig.v2path+"/weixinaccount/query?storeId="+FrameInfo.Nasid,
            dataType: "json",
            contentType: "application/json",
            onSuccess:queryChatListSuc,
            onFailed:queryChatListFail
        };

        Utils.Request.sendRequest(queryChatListOpt);
    }

    //分权分级
    function limit(){
        
        if(g_Limit.indexOf("CONFIG_WRITE") == -1){
            $($(".slist-toolbar-top .slist-button")[0]).css("display","none");
        }

    }

    function initData()
    {
        queryChatList();
        querySSidList();
        limit();

    }

    function initGrid()
    {
        var flag = false ;
        if(g_Limit.indexOf("CONFIG_WRITE") != -1){
            flag = true;  
        }

        var optSsid = {
            colNames: getRcText ("SSID_HEADER"),
            multiSelect: false,
            colModel: [
                {name:'SSID', datatype:"String"},
                {name:'AuthType', datatype:"String"}
            ],
            onToggle : {
                action : showSSID,
                jScope : $("#ssidToggle"),
                BtnDel : {
                    show : flag,
                    action : onDelSSID
                }
            },
            buttons:[
                {name: "add", action: onAddSSID},
                {name: "default",value:getRcText("SYN"),action: synSSID}
            ]
        };

        $("#ssidList").SList ("head", optSsid);

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

            if($(this).val() == "AT4")
            {
                $("#freeCertification", $("#toggle_form")).hide();
            }
            else if($(this).val() == "AT1"||$(this).val() == "AT2"||$(this).val() == "AT3")
            {
                $("#freeCertification", $("#toggle_form")).show();
            }

            if(!aContent) return true;
            aContent = aContent.split(",");
            for(var i=0;i<aContent.length;i++)
            {
                if(!aContent[i])continue;
                $(aContent[i]).show();
            };

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

    function initFrom()
    {

    }

    function _init ()
    {
        g_shopName = Utils.Device.deviceInfo.shop_name;
        g_userName = FrameInfo.g_user.attributes.name;
        initGrid();
        initData();
        initFrom();
        getSupportModel();
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_PercentMax = 100;
        g_SsidInfo = {};
        g_supportModelArr = [];
        hPending = "";
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form","MSelect"],
        "utils": ["Base","Device","Request"]
    });

}) (jQuery);
