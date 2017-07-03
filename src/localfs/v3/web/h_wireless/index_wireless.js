/**
 * Created by Administrator on 2015/11/26.
 */
(function ($)
{
    var MODULE_NAME = "h_wireless.index_wireless";
    var rc_info = "h_wireless_indexConfigure";
    var g_userName,g_shopName;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }

    function  synSSID(params)
    {
        function synSuc(data)
        {
            console.log(data);
            if(data&&data.error_code=="0"){

                if(params == true){
                    Utils.Base.refreshCurPage();
                }else{
                    Frame.Msg.info(data.error_message);
                }

            }else{
                Frame.Msg.info("同步失败","error");
            }

        }

        function synFail(err)
        {
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
    //编辑页面跳转
    function showAddUser(data)
    {
       //  var pubName = '', flag = 0;
       // if(data[0].pubMngInfo)
       // {
       //     flag = 1;
       //     pubName = data[0].pubMngInfo.name
       // }
       //  var oUrlPara = {
       //      np: "h_wireless.index_modify",
       //      stName: data[0].sp_name,
       //      ssidName: data[0].ssid_name,
       //      status: data[0].status,
       //      authType:data[0].AuthType
       //      flag:flag
       //  };
       //  if(flag===1)
       //  {
       //      oUrlPara.pubName = pubName;
       //  }
       //  Utils.Base.redirect(oUrlPara);
        var oUrlPara = {
            np: "h_wireless.index_modify",
            stName: data[0].sp_name,
            ssidName: data[0].ssid_name,
            // status: data[0].status,
            ssidId:data[0].SSID_Id,
            authType:data[0].AuthType
        };
        Utils.Base.redirect(oUrlPara);
    }


    function delAuthTemeplate(authCfgTemplateName)
    {
        function delAuthTemeplateSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0)
            {
                Frame.Msg.info("删除成功");
            }
        }

        function delAuthTemeplateFail(err)
        {
            console.log(err);
        }

        var delAuthTemeplateOpt = {
            type: "post",
            url: v2path+"/authcfg/delete",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(
                {
                    ownerName:g_userName,
                    "authCfgTemplateName":authCfgTemplateName
                }),
            onSuccess:delAuthTemeplateSuc,
            onFailed:delAuthTemeplateFail
        }

        Utils.Request.sendRequest(delAuthTemeplateOpt);
    }

    function delThemeTemeplate(obj)
    {
        function delThemeTemeplateSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0)
            {
                var authInfo =obj[0].authInfo;
                if(authInfo)
                {
                    if(authInfo.v3flag == 0)
                    {
                        delAuthTemeplate(authInfo.authCfgTemplateName);
                        return ;
                    }
                    else
                    {
                        Frame.Msg.info("删除成功");
                    }
                }
            }
        }

        function delThemeTemeplateFail(err)
        {
            console.log(err);
        }

        var delThemeTemeplateOpt = {
            type: "POST",
            url: v2path+"/themetemplate/delete",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "ownerName":g_userName,
                "themeName": oData.themeName
            }),
            onSuccess:delThemeTemeplateSuc,
            onFailed:delThemeTemeplateFail
        }

        Utils.Request.sendRequest(delThemeTemeplateOpt);
    }

    function getThemeTemplateInfo(obj)
    {
        function getThemeTemplateInfoSuc(data)
        {
            if(data.errorcode == 0)
            {
                var themeInfo = data.data;

                if(themeInfo.v3flag == 0)
                {
                    delThemeTemeplate(authInfo);
                }
                else
                {
                    Frame.Msg.info("删除成功");
                }
            }
        }

        function getThemeTemplateInfoFail(err)
        {
            console.log(err);
        }

        var themeTempName = obj[0].pubMngInfo.themeTemplateName;
        var getThemeTemplateInfoOpt = {
            type: "GET",
            url: MyConfig.v2path+"/themetemplate/querybyname",
            dataType: "json",
            contentType: "application/json",
            data:{
                ownerName: g_userName,
                themeName: themeTempName
            },
            onSuccess:getThemeTemplateInfoSuc,
            onFailed:getThemeTemplateInfoFail
        }

        Utils.Request.sendRequest(getThemeTemplateInfoOpt);
    }

    function delPublish(pubMngName,obj,isFlag)
    {

        function delPublishSuc(data)
        {
            console.log(data);
            if(isFlag){
                getThemeTemplateInfo(obj);
            }
        }

        function delPublishFail(err)
        {
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

    function SSIDDelete(oData) {

        function SSIDDeleteSuc(data)
        {
            console.log(data);
            if (("errorcode" in data) && (data.errorcode != 0))
            {
                Frame.Msg.info(getRcText("DEL_FAIL"), "error");
                return ;
            }
            else
            {
               if(oData[0].pubMngInfo)
               {
                   delPublish(oData[0].pubMngInfo.name,oData,true);
               }
            }

        }

        function SSIDDeleteFail(err)
        {
            console.log(err);
        }

        var SSIDDeleteOpt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDDelete",
                param: [{
                    stName: oData[0].sp_name
                }]
            }),
            onSuccess:SSIDDeleteSuc,
            onFailed:SSIDDeleteFail
        }

        Utils.Request.sendRequest(SSIDDeleteOpt);
    }

    function ssidUnbindByAPGroup(oData,apModelList)
    {
        var param = [];
        for(var i = 0;i < apModelList.length;i++){
            var paramValue_1= {
                apGroupName: "default-group",
                apModelName: apModelList[i],
                radioId: 1,
                stName: oData[0].sp_name,
                vlanId: 1
            }
            var paramValue_2= {
                apGroupName: "default-group",
                apModelName: apModelList[i],
                radioId: 2,
                stName: oData[0].sp_name,
                vlanId: 1
            }
            param.push(paramValue_1);
            param.push(paramValue_2);
        }

        function SSIDUnbindByAPGroupSuc(data)
        {
            console.log(data);
            if (data.communicateResult == "success" && data.serviceResult == "success")
            {
                SSIDDelete(oData[0].sp_name);
            }

        }

        function SSIDUnbindByAPGroupFail(err)
        {
            console.log(err);
        }

        var SSIDUnbindByAPGroupOpt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDUnbindByAPGroup",
                param: param
            }),
            onSuccess:SSIDUnbindByAPGroupSuc,
            onFailed:SSIDUnbindByAPGroupFail
        }

        Utils.Request.sendRequest(SSIDUnbindByAPGroupOpt);
    }

    function getSupportModel(oData)
    {
        function getSupportModelSuc(data)
        {
            console.log(data);
            if(data.apModelList){
                if(data.apModelList.length > 0)
                {
                    ssidUnbindByAPGroup(oData,data.apModelList);
                }
                else{
                    Frame.Msg.error("该设备版本不支持删除操作，请升级新版本");
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



    //删除操作
    function onDelSSID(oData)
    {
        getSupportModel(oData);
    }

    function initGrid()
    {
        var oSListHead = { //初始化表头信息，并且写出具体字段，字段值和ajax返回的值要对应上
            height: "70",
            showHeader: true,
            showOperation: true,
            multiSelect: false,
            pageSize: 10,
            colNames: getRcText("ALLAP_HEADER2"),
            colModel: [{
                name: "sp_name",
                datatype: "String",
                width: 80
            }, {
                name: "ssid_name",
                datatype: "String",
                width: 80
            }, {
                name: "AuthType",
                datatype: "String",
                width: 80
            },{
                name: "status",
                datatype: "String",
                width: 80
            },{
                    name: "bindAPGroup",
                    datatype: "String",
                    width: 80
                }
            ],
            buttons: [
                {
                    name: "default",
                    value: getRcText("SYN"),
                    action: synSSID
                },
                {
                    name: "edit",
                    action: showAddUser
                }, {
                    name: "delete",
                    action: Utils.Msg.deleteConfirm(onDelSSID),
                    enable: 1
                }
            ]
        };
        $("#onlineuser_list").SList("head", oSListHead);
    }


   //刷新slist无线配置
    function refreshSSIDList(needListOpt)
    {
        var aAuthType = getRcText("AUTHEN_TYPE").split(",");
        var aSTATUS = getRcText("STATUS").split(','); //,使能,去使能
        var ssid_list = needListOpt.ssid_list || [];
        //新定义obj
        var obj = {};
        var ssidRefreshArr = [];

        ssid_list.forEach(function(ssid){
            var SSID_Id =  ssid.ssid;

            obj[SSID_Id] = {//设置初始值
                ssid_name: ssid.ssid_name,
                SSID_Id:SSID_Id,
                status :aSTATUS[ssid.status],
                bindAPGroup:"default-group",
                sp_name: ssid.sp_name,
                AuthType: aAuthType[0]
            };
        });

        var pubmng_list =  needListOpt.publishList || [];

        pubmng_list.forEach(function(pubmng){
            if (!("ssidName" in pubmng)){
                delPublish(pubmng.name);
                return;
            }
            if (!(pubmng.ssidId in obj)){
                delPublish(pubmng.name);
                return;
            }
            //未发布的发布模板
            if (pubmng.isPublished == 0){
                delPublish(pubmng.name);
                return;
            }
            var ssid_id = pubmng.ssidId;
            obj[ssid_id].pubMngInfo = pubmng;

            needListOpt.authList.forEach(function(authInfo){
                if(authInfo.authCfgTemplateName == pubmng.authCfgName)
                {
                    obj[ssid_id].AuthType = aAuthType[authInfo.authType];//slist 显示用
                    obj[ssid_id].authInfo = authInfo;
                }
            })

        });

        for (var a in obj){
            ssidRefreshArr.push(obj[a]);
        }
        $("#onlineuser_list").SList ("refresh", ssidRefreshArr);

    }

    //查询认证模板
    function queryAuthList(needListOpt)
    {
        function queryAuthListSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0){
                needListOpt.authList = data.data;
                refreshSSIDList(needListOpt);
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

    //查询发布模板列表
    function queryPubList(needListOpt)
    {

        function queryPubListSuc(data) {
            console.log(data);
            if(data.errorcode == 0){
                needListOpt.publishList = data.data;
                queryAuthList(needListOpt);
            }
        }

        function queryPubListFail(err) {
            console.log(err);
        }
        var queryPubListOpt = {
            type: "GET",
            url: MyConfig.v2path+"/pubmng/query?ownerName="+g_userName+"&shopName="+g_shopName,
            dataType: "json",
            contentType: "application/json",
            onSuccess:queryPubListSuc,
            onFailed:queryPubListFail
        }
        Utils.Request.sendRequest(queryPubListOpt);
    }

    //查询ssid列表
    function querySSidList(){

        var needsListOpt= {};

        function querySsidListSuc(data){
            console.log(data);
            if(data.ssid_list)
            {
                needsListOpt.ssid_list = data.ssid_list;
                queryPubList(needsListOpt);
            }
            else
            {
                Frame.Msg.info("获取数据错误","error");
            }

        }

        function querySsidListFail(err){
            console.log(err);
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

    function initData()
    {
        querySSidList();
    }

    function initForm()
    {

    }

    function _init ()
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

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList"],
        "utils": ["Base","Request", "Device"]
    });
}) (jQuery);

