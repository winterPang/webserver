/**
 * Created by Administrator on 2015/11/26.
 */
(function ($)
{
    var MODULE_NAME = "h_wireless1.index_wireless";
    var rc_info = "h_wireless_indexConfigure";
    var g_userName,g_shopName;
    var g_StINFO = {};
    var g_CheckAddSt = false;
    var g_fqfj_operateBtn = true;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }
    
    function synSSIDv3()
    {
        function synSSIDv3Suc(data)
        {
            // if(data.errCode == 0)
            // {
            //     Frame.Msg.info("同步成功");
            //     Utils.Base.refreshCurPage();
            // }else if (data.errCode == 7) {
            //     Frame.Msg.info("当前设备版本不支持,同步失败","error");
            //     Utils.Base.refreshCurPage();
            // }else{
            //     Frame.Msg.info("同步失败","error");
            //     Utils.Base.refreshCurPage();
            // }
            console.log(data);
            //调用v2同步接口
            synSSID();

        }

        function synSSIDv3Fail(err)
        {
            console.log(err);
            Frame.Msg.info("同步失败","error");
            //调用v2同步接口
            synSSID();
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

    function synSsidDisable()
    {
        
       $("#onlineuser_list>div>div>a:last").addClass("disabled");
       var i = 30;

       var setIntervalTime = setInterval(function(){
    
            $("#onlineuser_list>div>div>a:last").addClass("disabled");
            $("#onlineuser_list>div>div>a:last>span").text(i+"秒");
           
            if(i == 0)
            {
                clearInterval(setIntervalTime);
                $("#onlineuser_list>div>div>a:last>span").text("同步");
                $("#onlineuser_list>div>div>a:last").removeClass("disabled");
            }

            i--;

       },1000)
               
    }

    function  synSSID()
    {
        // function synSuc(data)
        // {
        //     // console.log(data);
        //     // if(data&&data.error_code=="0"){
        //     //     Frame.Msg.info(data.error_message);
        //         Utils.Base.refreshCurPage();
        //     // }
        //     // else{
        //     //     Frame.Msg.info(getRcText("SYN_FAILED"),"error");
        //     //     Utils.Base.refreshCurPage();
                
        //     // }

        // }

        // function synFail(err)
        // {
        //     // Frame.Msg.info(getRcText("SYN_FAILED"),"error");
        //     Utils.Base.refreshCurPage();
        // }
        Utils.Base.refreshCurPage();
        synSsidDisable();
        // var synOpt = {
        //     type: "GEt",
        //     url:MyConfig.v2path+"/syncAc?acsn="+FrameInfo.ACSN,
        //     dataType: "json",
        //     contentType: "application/json",
        //     onSuccess:synSuc,
        //     onFailed:synFail
        // }
        // Utils.Request.sendRequest(synOpt);

    }
    //编辑页面跳转
    function showAddUser(data)
    {
        var pubName = '', flag = 0;
       if(data[0].pubMngInfo)
       {
           flag = 1;
           pubName = data[0].pubMngInfo.name
       }
        var oUrlPara = {
            np: "h_wireless1.index_modify",
            stName: data[0].sp_name,
            flag:flag
        };
        if(flag===1)
        {
            oUrlPara.pubName = pubName;
        }
        Utils.Base.redirect(oUrlPara);
    }


    function delAuthTemeplate(authCfgTemplateName)
    {
        function delAuthTemeplateSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0)
            {
                Frame.Msg.info("删除成功，请同步后查看最新配置。");
            }
        }

        function delAuthTemeplateFail(err)
        {
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
        }

        var delAuthTemeplateOpt = {
            type: "post",
            url: v2path+"/authcfg/delete",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(
                {
                    ownerName:g_userName,
                    storeId:FrameInfo.Nasid,
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
                        Frame.Msg.info("删除成功，请同步后查看最新配置。");
                    }
                }
            }
        }

        function delThemeTemeplateFail(err)
        {
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
        }

        var delThemeTemeplateOpt = {
            type: "POST",
            url: v2path+"/themetemplate/delete",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "ownerName":g_userName,
                "storeId":FrameInfo.Nasid,
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
                    Frame.Msg.info("删除成功，请同步后查看最新配置。");
                }
            }
        }

        function getThemeTemplateInfoFail(err)
        {
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
        }

        var themeTempName = obj[0].pubMngInfo.themeTemplateName;
        var getThemeTemplateInfoOpt = {
            type: "GET",
            url: MyConfig.v2path+"/themetemplate/querybyname",
            dataType: "json",
            contentType: "application/json",
            data:{
                ownerName: g_userName,
                storeId:FrameInfo.Nasid,
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
            Frame.Msg.info("获取数据失败","error");
        }

        var delPublishOpt = {
            type: "POST",
            url: MyConfig.v2path+"/pubmng/delete",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                ownerName: g_userName,
                nasId:FrameInfo.Nasid,
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
            // if (("errorcode" in data) && (data.errorcode != 0))
            if((data.result)&&(data.result=="success")&&(data.communicateResult=="success")&&(data.serviceResult=="success"))
            {
                // onSyncStInfo(false);
                if (oData[0].pubMngInfo) 
                {
                    delPublish(oData[0].pubMngInfo.name, oData, true);
                }
                Frame.Msg.info("删除成功，请同步后查看最新配置。");
            }
            else 
            {
                Frame.Msg.info(getRcText("DEL_FAIL"), "error");
                return ;
            }

        }

        function SSIDDeleteFail(err)
        {
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
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

    function ssidUnbindByAP(oData,flag)
    {
        if (flag > 0) {
            var param = [];
            var aBindAp = oData[0].bindApList;

            aBindAp.forEach(function(bind){
                if (bind.isInherit == 0) {
                    var paramValue = {
                        apSN: bind.apSN,
                        radioId: bind.radioId,
                        stName: oData[0].sp_name
                    };
                    param.push(paramValue);
                };
            });

            function SSIDUnbindByAPSuc(data)
            {
                console.log(data);                
                if((data.result)&&(data.result=="success")&&(data.communicateResult=="success")&&(data.serviceResult=="success"))
                {
                    ssidUnbindByAPGroup(oData,oData[0].bindApGroupList.length);
                }else{
                    Frame.Msg.info("删除失败","error");
                }

            }

            function SSIDUnbindByAPFail(err)
            {
                console.log(err);
                Frame.Msg.info("删除失败","error");
            }

            var SSIDUnbindByAPOpt = {
                type: "POST",
                url: MyConfig.path + "/ant/confmgr",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    devSN: FrameInfo.ACSN,
                    configType: 0,
                    cloudModule: "stamgr",
                    deviceModule: "stamgr",
                    method: "SSIDUnbindByAP",
                    param: param
                }),
                onSuccess:SSIDUnbindByAPSuc,
                onFailed:SSIDUnbindByAPFail
            }

            Utils.Request.sendRequest(SSIDUnbindByAPOpt);
        }else{
            ssidUnbindByAPGroup(oData,oData[0].bindApGroupList.length);
        };
    }

    function ssidUnbindByAPGroup(oData,flag)
    {
        if (flag > 0) {
            var param = [];
            var aBindGroup = oData[0].bindApGroupList;

            aBindGroup.forEach(function(bind){
                var paramValue = {
                    apGroupName: bind.ApGroupName,
                    apModelName: bind.ApModel,
                    radioId: bind.radioId,
                    stName: oData[0].sp_name
                };
                param.push(paramValue);
            });

            function SSIDUnbindByAPGroupSuc(data)
            {
                console.log(data);
                if (data.communicateResult == "success" && data.serviceResult == "success")
                {
                    SSIDDelete(oData);
                }else {
                    Frame.Msg.info("删除失败","error");
                }

            }

            function SSIDUnbindByAPGroupFail(err)
            {
                console.log(err);
                Frame.Msg.info("删除失败","error");
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
        }else{
            SSIDDelete(oData);
        };
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
            Frame.Msg.info("获取数据失败","error");
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
        // getSupportModel(oData);
        if ((oData[0].bindApGroupList.length == 0)&&(oData[0].bindApList.length == 0)) {
            SSIDDelete(oData);
        }
        else{
            // ssidUnbindByAPGroup(oData,oData[0].bindApGroupList.length);
            ssidUnbindByAP(oData,oData[0].bindApList.length);
        }
    }

    function onSubmitBindSt()
    {
        var oTempTable = {
            index:[],
            column:["BindType"]
        };
        var sType = $("#BindStForm_choice").form ("getTableValue", oTempTable).BindType;
        
        // if (sType == "1"){
        //     Frame.Msg.info("当前设备版本不支持绑定到AP","error");
        //     return;
        // }

        //关闭弹窗
        Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#BindSt_choice")));
        
        //根据绑定方式处理
        if (sType == "2") { //绑定AP组
            $("#apgroup_list").SList("resize");
            // var BAPG_Form = $("#BindAP_Group_Form");
            // BAPG_Form.form("init", "edit", {"title":getRcText("BIND_APGroup")});
            // $(".modal-footer").hide();
            Utils.Base.openDlg(null, {}, {scope: $("#BindAP_Group"),className: "modal-super"});
        }else { //绑定AP
            $("#ap_list").SList("resize");
            Utils.Base.openDlg(null, {}, {scope: $("#BindAP"),className: "modal-super"});
        };
    }

    function onCancelBindSt()
    {
        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#BindStForm_choice")));
        Utils.Base.refreshCurPage();
    }

    function onGetssidID()
    {
        function querySsidListSuc(data){
            console.log(data);
            if(data.ssidList)
            {
                data.ssidList.forEach(function(oInfo){
                    if (oInfo.stName == g_StINFO.stName) {
                        g_StINFO.ssid = oInfo.ssid;
                        g_StINFO.ssid_name = oInfo.ssidName;
                    }
                });

                if(!g_StINFO.ssid){
                    setTimeout(onGetssidID,1500);
                }
            }
            else
            {
                Frame.Msg.info("获取数据错误","error");
            }

        }

        function querySsidListFail(err){
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
        }

        var querySsidListOpt = {//获取接口的数据信息
            type: "GET",
            url: MyConfig.path + "/ssidmonitor/getssidinfobrief?devSN=" + FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            onSuccess:querySsidListSuc,
            onFailed:querySsidListFail
        }
        Utils.Request.sendRequest(querySsidListOpt);
    }

    function onSyncV3StInfo()
    {
        function synSSIDv3Suc(data)
        {
            console.log(data);
            setTimeout(onGetssidID,3000);
            return;
            // if(data.errCode == 0)
            // {
            //     Frame.Msg.info("同步成功");
            //     Utils.Base.refreshCurPage();
            // }else{
            //     Frame.Msg.info("同步失败","error");
            //     Utils.Base.refreshCurPage();
            // }
        }

        function synSSIDv3Fail(err)
        {
            console.log(err);
            Frame.Msg.info("同步失败","error");
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

    function onSyncStInfo(flag)
    {
        // function syncSuc(data)
        // {
        //     console.log(data);
        //     if(data&&data.error_code=="0"){
        //         if (flag) {
                    
        //         };
                onSyncV3StInfo();
        //     }else{
        //         Frame.Msg.info(getRcText("SYN_FAILED"),"error");
        //     }

        // }

        // function syncFail(err)
        // {
        //     console.log(err);
        //     Frame.Msg.info(getRcText("GET_DATA_FAILED"),"error");
        // }

        // var syncOpt = {
        //     type: "GEt",
        //     url:MyConfig.v2path+"/syncAc?acsn="+FrameInfo.ACSN,
        //     dataType: "json",
        //     contentType: "application/json",
        //     onSuccess:syncSuc,
        //     onFailed:syncFail
        // }
        // Utils.Request.sendRequest(syncOpt);
    }

    function updateSsidInfo(oStData)
    {
        g_StINFO.stName = oStData.stName;

        function SSIDUpdateSuc(data)
        {
            if(data.reason=="main connection is not found")
            {
                Frame.Msg.info("添加失败:"+data.reason,"error");
                Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddSt")));
                return;
            }

            //新增服务模版成功，调用接口，同步v2数据库
            onSyncStInfo(true);
            
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddSt")));//第一个form关闭
            var bindForm = $("#BindStForm_choice");//准备初始化第二个form
            bindForm.form("init", "edit", {"title":getRcText("BIND"),"btn_apply": onSubmitBindSt,"btn_cancel":onCancelBindSt});
            Utils.Base.openDlg(null, null,{scope:$("#BindSt_choice"), className:"modal-large"});//打开第二个form

        }

        function SSIDUpdateFail(err)
        {
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
            
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#AddStForm")));
        }
        var SSIDUpdateOpt = {
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

        Utils.Request.sendRequest(SSIDUpdateOpt);
    }

    function onSubmitAddSt()
    {
        var stName=$("#stName").val();
        var ssidName=$("#ssidName").val();
        for(var i=0;i<stName.length;i++){
            if(stName.charAt(i)==" "){
                $("#kongstName_error").show();
                return;
            }
            if(!(stName.charAt(i)==" ")){
                $("#kongstName_error").hide();
               
            }
        }
        for(var i=0;i<ssidName.length;i++){
            if(ssidName.charAt(i)==" "){
                $("#kongSSID_error").show();
                return;
            }
            if(!(ssidName.charAt(i)==" ")){
                $("#kongSSID_error").hide();
            }
        }
        var oTempTable = {
            index:[],
            column:["stName","ssidName","status","cipherSuites"]
        };
        var oStData = $("#AddStForm").form("getTableValue", oTempTable);

        updateSsidInfo(oStData)

    }

    function onCancelAddSt()
    {
        $("input[type=text]",$("#AddStForm")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $("#AddStForm").form("updateForm",{
            stName: "",
            ssidName: "",
            status: 1
        })
        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddStForm")));
    }

    // add st
    function onAddSt()
    {   
        $("#kongstName_error").hide();
        $("#kongSSID_error").hide();
        if (!g_CheckAddSt) {
            Frame.Msg.error("该设备版本不支持添加操作，请升级新版本");
            return;
        };
        var addForm = $("#AddStForm");//第一个form
        addForm.form("init", "edit", {"title":getRcText("ADD_TITLE"), "btn_apply":onSubmitAddSt, "btn_cancel":onCancelAddSt});
        // $(".modal-footer").hide();
        Utils.Base.resetForm(addForm);
        Utils.Base.openDlg(null, null,{scope:$("#AddSt"), className:"modal-large"});
    }

    function onChecked(aRows)
    {
        if (aRows.length > 0) {
            return true;
        }
        return false;
    }

    function isPublishPubmnged(pubMngName,isPublish)
    {
        function isPublishPubmngedSuc(data)
        {
            if(data.errorcode == 0)
            {
                Frame.Msg.info("配置成功");

                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AuthCfgForm")));
                Utils.Base.refreshCurPage();

            }
        }

        function isPublishPubmngedFail(err)
        {
            Frame.Msg.info("配置失败","error");
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
                nasId:FrameInfo.Nasid,
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
            nasId:FrameInfo.Nasid,
        }
        if( needPubObj.weixinAccountName)
        {
            pubData.weixinAccountName = needPubObj.weixinAccountName;
        }

        if(sName == "add")
        {
            var url = MyConfig.v2path+"/pubmng/add";
            pubData.name = autoName;
            pubData.ssidName = g_StINFO.ssid_name;
            // pubData.ssidId = g_StINFO.ssid;//ID
            pubData.ssidIdV3 = g_StINFO.ssid;//ID
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
                        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AuthCfgForm")));
                        Utils.Base.refreshCurPage();
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

    function editAndaddTheme(sName, autoName, operatePub, needPubObj, delOperate) {
        if (sName == "add") {
            var url = MyConfig.v2path + "/themetemplate/add"
            var themeData = {
                ownerName: g_userName,
                storeId: FrameInfo.Nasid,
                themeName: autoName,
                v3flag: 0,
                description: "auto themeTemplate"
            };
            needPubObj.themeName = autoName;
        }

        function themeSuc(data) {
            console.log(data);
            if (data.errorcode == "0") {
                if (operatePub == "modify" || operatePub == "add") {
                    editAndAddPub(operatePub, autoName, needPubObj, delOperate);
                } else {
                    Frame.Msg.info("配置成功");
                    Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AuthCfgForm")));
                    Utils.Base.refreshCurPage();
                }
            } else {
                Frame.Msg.info("配置失败");
            }
        }

        function themeFail(err) {
            Frame.Msg.info("获取数据错误", "error");
            console.log(err);
        }
        var themeOpt = {
            type: "POST",
            url: url,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(themeData),
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
            $("input[name='LoginWays']",$("#AuthCfgForm")).each(
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

        function authcfgFail(err)
        {
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
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
        //新增的服务模版，新增绿洲认证配置
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
           Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AuthCfgForm")));
           Utils.Base.refreshCurPage();
        }
        
    }

    function onSubmitAuthCfg()
    {
        var oTempTable = {
            index:[],
            column:[
                "IDLE_CUT_FLOW","AuthenType","LoginPage","LoginPageList",
                "AuthCfgList","WeChartList","auto_study_enable", "impose_auth_time"
            ]
        };
        var oStData = $("#AuthCfgForm").form ("getTableValue", oTempTable);

        var time=Frame.DataFormat.getStringTime(new Date());
        var name = FrameInfo.Nasid+"_"+time;

        authOperate(oStData,name);
    }

    function onCancelAuthCfg()
    {
        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AuthCfgForm")));
        Utils.Base.refreshCurPage();
    }

    function openAuthCfgDlg()
    {
        var authForm = $("#AuthCfgForm");
        authForm.form("init", "edit", {"title":getRcText("AUTHCFG"), "btn_apply":onSubmitAuthCfg, "btn_cancel":onCancelAuthCfg});
        Utils.Base.resetForm(authForm);
        Utils.Base.openDlg(null, null,{scope:$("#AuthCfgDlg"), className:"modal-large"});
        onAdviceShow();
    }

    function onSsidBindAPGroup(aRowsDate)
    {
        var param = [];
        
        aRowsDate.forEach(function(oRow){
            oRow.modelList.forEach(function(oModel){
                var sNum = oModel.radioNum;
                for (var i = 1; i <= sNum; i++) {
                    var paramValue_tmp= {
                        apGroupName: oRow.apGroupName,
                        apModelName: oModel.model,
                        radioId: i,
                        stName: g_StINFO.stName
                    };
                    param.push(paramValue_tmp);
                } 
            });
        });

        function SsidBindAPGroupSuc(data)
        {
            console.log(data);
            if (data.communicateResult == "success" && data.serviceResult == "success")
            {
                //st成功绑定到ap组下apmodel
                Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#BindAP_Group")));
                openAuthCfgDlg();
            }

        }

        function SsidBindAPGroupFail(err)
        {
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
        }

        var SsidBindAPGroupOpt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDBindByAPGroup",
                param: param
            }),
            onSuccess:SsidBindAPGroupSuc,
            onFailed:SsidBindAPGroupFail
        }

        Utils.Request.sendRequest(SsidBindAPGroupOpt);
    }

    function onSsidBindAP(aRowsDate)
    {
        var param = [];
        
        aRowsDate.forEach(function(oRow){
            
            var sNum = oRow.radioNum;
            for (var i = 1; i <= sNum; i++) {
                var paramValue_tmp= {
                    apSN: oRow.apSN,
                    radioId: i,
                    stName: g_StINFO.stName
                };
                param.push(paramValue_tmp);
            } 

        });

        function SsidBindAPSuc(data)
        {
            console.log(data);
            if (data.errCode == "7") {
                Frame.Msg.info("当前设备版本不支持绑定到AP")
            };
            if (data.communicateResult == "success" && data.serviceResult == "success")
            {
                //st成功绑定到ap组下apmodel
                Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#BindAP")));
                openAuthCfgDlg();
            }

        }

        function SsidBindAPFail(err)
        {
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
        }

        var SsidBindAPOpt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDBindByAP",
                param: param
            }),
            onSuccess:SsidBindAPSuc,
            onFailed:SsidBindAPFail
        }

        Utils.Request.sendRequest(SsidBindAPOpt);
    }

    function showLink(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "0";

        if("text" == type)
        {
            return value;
        }
        // return '<a class="list-link" cell="'+cell+'"'+' BindType="'+dataContext.bindGroups+'">'+value+'</a>';

        //此处特殊需要，其他页面不以此做准
        if (columnDef.name == "bindAPGroupNum") {
            return '<a class="list-link" cell="'+cell+'"'+'ref="group" Groups="'+dataContext.bindGroups+'" stName="'+dataContext.sp_name+'">'+value+'</a>';        
        }
        if (columnDef.name == "bindAPsNum") {
            return '<a class="list-link" cell="'+cell+'"'+'ref="aps" Aps="'+dataContext.bindAps+'" stName="'+dataContext.sp_name+'">'+value+'</a>';        
        }

    }

    function onBindUnBindGroupsList(oInfo,stName)
    {

        function getAPGroupInfoSuc(data){
            console.log(data);
           
            var sUnbind = getRcText("UNBIND");
            var sBind = getRcText("BIND");
            data.apgroupList.forEach(function(apgroup){
                apgroup.STname = stName;
                if (oInfo[apgroup.apGroupName] == 1) {
                    apgroup.BindState = sBind;
                }else{
                    apgroup.BindState = sUnbind;
                }

            });
            Utils.Base.openDlg(null, {}, {scope: $("#bindApGroups"),className: "modal-super"});
            $("#apgroups_bindunbind_list").SList("refresh", data.apgroupList);
            $("#apgroups_bindunbind_list").SList("resize");
        }

        function getAPGroupInfoFail(err){
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
        }

        var getAPGroupInfoOpt = {//获取接口的数据信息
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getapgroupbindstcount",
            dataType: "json",
            contentType: "application/json",
            data:{
                devSN: FrameInfo.ACSN
            },
            onSuccess:getAPGroupInfoSuc,
            onFailed:getAPGroupInfoFail
        }
        Utils.Request.sendRequest(getAPGroupInfoOpt);
    }

    function onBindUnBindApsList(oInfo,stName)
    {

        function getAPsInfoSuc(data){
            console.log(data);
            var sBind = getRcText("BIND");
            var sUnbind = getRcText("UNBIND");
            var aList = [];

            data.apList.forEach(function(aps){
                if (aps.apSN.length > 0) {
                    aps.STname = stName;
                    if (oInfo[aps.apName] == 1) {
                        aps.BindState = sBind;
                    }else{
                        aps.BindState = sUnbind;
                    };
                    aList.push(aps);
                };
            });

            Utils.Base.openDlg(null, {}, {scope: $("#bindAps"),className: "modal-super"});
            $("#aps_bindunbind_list").SList("refresh", aList);
            $("#aps_bindunbind_list").SList("resize");
        }

        function getAPsInfoFail(err){
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
        }

        var getAPsInfoOpt = {//获取接口的数据信息
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getapbindstcount",
            dataType: "json",
            contentType: "application/json",
            data:{
                devSN: FrameInfo.ACSN
            },
            onSuccess:getAPsInfoSuc,
            onFailed:getAPsInfoFail
        }
        Utils.Request.sendRequest(getAPsInfoOpt);
    }

    function onDisDetail()
    {
        var stype = $(this).attr("ref");
        var stName = $(this).attr("stName");
        if (stype == "group") {
            //TODO
            var oBind = {};
            
            $(this).attr("Groups").split(',').forEach(function(a){
                oBind[a] = 1;
            });
            onBindUnBindGroupsList(oBind,stName);
        }
        if (stype == "aps") {
            //TODO
            var oBind = {};
            
            $(this).attr("Aps").split(',').forEach(function(a){
                oBind[a] = 1;
            });
            onBindUnBindApsList(oBind,stName);
        }
    }

    function onBindAPGroups(aRowsDate)
    {
        var param = [];
        
        aRowsDate.forEach(function(oRow){
            oRow.modelList.forEach(function(oModel){
                var sNum = oModel.radioNum;
                for (var i = 1; i <= sNum; i++) {
                    var paramValue_tmp= {
                        apGroupName: oRow.apGroupName,
                        apModelName: oModel.model,
                        radioId: i,
                        stName: oRow.STname
                    };
                    param.push(paramValue_tmp);
                } 
            });
        });

        function SsidBindAPGroupSuc(data)
        {
            console.log(data);
            if (data.communicateResult == "success" && data.serviceResult == "success")
            {
                //st成功绑定到ap组下apmodel
                Frame.Msg.info("配置成功，请手动同步后查看最新无线服务配置");
            }

        }

        function SsidBindAPGroupFail(err)
        {
            console.log(err);
            Frame.Msg.info("配置失败","error");
        }

        var SsidBindAPGroupOpt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDBindByAPGroup",
                param: param
            }),
            onSuccess:SsidBindAPGroupSuc,
            onFailed:SsidBindAPGroupFail
        }

        Utils.Request.sendRequest(SsidBindAPGroupOpt);
    }

    function onUnBindAPGroups(aRowsDate)
    {
        var param = [];
        
        aRowsDate.forEach(function(oRow){
            oRow.modelList.forEach(function(oModel){
                var sNum = oModel.radioNum;
                for (var i = 1; i <= sNum; i++) {
                    var paramValue_tmp= {
                        apGroupName: oRow.apGroupName,
                        apModelName: oModel.model,
                        radioId: i,
                        stName: oRow.STname
                    };
                    param.push(paramValue_tmp);
                } 
            });
        });

        function SSIDUnbindByAPGroupSuc(data)
        {
            console.log(data);
            if (data.communicateResult == "success" && data.serviceResult == "success")
            {
                Frame.Msg.info("配置成功，请手动同步后查看最新无线服务配置");
            }

        }

        function SSIDUnbindByAPGroupFail(err)
        {
            console.log(err);
            Frame.Msg.info("配置失败","error");
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

    function onQuitBindST()
    {
        Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#bindApGroups")));
        Utils.Base.refreshCurPage();
    }

    function onQuitBindAPs()
    {
        Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#bindAps")));
        Utils.Base.refreshCurPage();
    }

    function onBindAps(aRowsDate)
    {
        var param = [];
        
        aRowsDate.forEach(function(oRow){
            
            var sNum = oRow.radioNum;
            for (var i = 1; i <= sNum; i++) {
                var paramValue_tmp= {
                    apSN: oRow.apSN,
                    radioId: i,
                    stName: oRow.STname
                };
                param.push(paramValue_tmp);
            } 

        });

        function SsidBindAPSuc(data)
        {
            console.log(data);
            if (data.errCode == "7") {
                Frame.Msg.info("当前设备版本不支持绑定到AP")
            };
            if (data.communicateResult == "success" && data.serviceResult == "success")
            {
                Frame.Msg.info("配置成功，请手动同步后查看最新无线服务配置");
            }

        }

        function SsidBindAPFail(err)
        {
            console.log(err);
            Frame.Msg.info("配置失败","error");
        }

        var SsidBindAPOpt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDBindByAP",
                param: param
            }),
            onSuccess:SsidBindAPSuc,
            onFailed:SsidBindAPFail
        }

        Utils.Request.sendRequest(SsidBindAPOpt);
    }

    function onUnBindAps(aRowsDate)
    {
        var param = [];
        
        aRowsDate.forEach(function(oRow){
            
            var sNum = oRow.radioNum;
            for (var i = 1; i <= sNum; i++) {
                var paramValue_tmp= {
                    apSN: oRow.apSN,
                    radioId: i,
                    stName: oRow.STname
                };
                param.push(paramValue_tmp);
            } 

        });

        function SsidUnBindAPsSuc(data)
        {
            console.log(data);
            if (data.errCode == "7") {
                Frame.Msg.info("当前设备版本不支持绑定到AP")
            };
            if (data.communicateResult == "success" && data.serviceResult == "success")
            {
                Frame.Msg.info("配置成功，请手动同步后查看最新无线服务配置");
            }

        }

        function SsidUnBindAPsFail(err)
        {
            console.log(err);
            Frame.Msg.info("配置失败","error");
        }

        var SsidUnBindAPsOpt = {
            type: "POST",
            url: MyConfig.path + "/ant/confmgr",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                configType: 0,
                cloudModule: "stamgr",
                deviceModule: "stamgr",
                method: "SSIDUnbindByAP",
                param: param
            }),
            onSuccess:SsidUnBindAPsSuc,
            onFailed:SsidUnBindAPsFail
        }

        Utils.Request.sendRequest(SsidUnBindAPsOpt);
    }

    function initGrid()
    {
        var oSListHead = { //初始化表头信息，并且写出具体字段，字段值和ajax返回的值要对应上
            height: "70",
            showHeader: true,
            // showOperation: true,
            showOperation: g_fqfj_operateBtn,            
            multiSelect: false,
            pageSize: 10,
            colNames: getRcText("ALLAP_HEADER2"),
            colModel: [
                {name: "sp_name",datatype: "String",width: 80} 
                ,{name: "ssid_name",datatype: "String",width: 80} 
                ,{name: "AuthType",datatype: "String",width: 80}
                ,{name: "status",datatype: "String",width: 80}
                ,{name: "bindAPGroupTmp",datatype: "String",width: 80}
                // ,{name: "bindAPsNum",datatype: "String",width: 80,formatter:showLink}
                // ,{name: "bindAPGroupNum",datatype: "String",width: 80,formatter:showLink}
            ],
            buttons: [
                // {
                //     name: "add",
                //     action: onAddSt
                // },
                {
                    name: "default",
                    value: getRcText("SYN"),
                    action: synSSIDv3
                },
                {
                    name: "edit",
                    action: showAddUser
                }, {
                    name: "delete",
                    action: Utils.Msg.deleteConfirm(onDelSSID)
                }
            ]
        };
        $("#onlineuser_list").SList("head", oSListHead);
        $("#onlineuser_list").on('click','a.list-link',onDisDetail);

        //添加服务模版时，绑定ap组列表
        var oApGroupHead = { 
            height: "70",
            showHeader: true,
            showOperation: false,
            multiSelect: true,
            pageSize: 10,
            colNames: getRcText("BIND_AP_GROUP"),
            colModel: [
                {name: "apGroupName",datatype: "String"}, 
                {name: "BindState",datatype: "String"}
            ],
            buttons: [
                {name: "default",value: getRcText("NEXT"),action: onSsidBindAPGroup,enable:onChecked},
            ]
        };
        $("#apgroup_list").SList("head", oApGroupHead);

        //添加服务模版时，绑定ap列表
        var oApHead = { 
            height: "70",
            showHeader: true,
            showOperation: false,
            multiSelect: true,
            pageSize: 10,
            colNames: getRcText("BIND_AP"),
            colModel: [
                {name: "apName",datatype: "String"}, 
                {name: "apSN",datatype: "String"},
                {name: "BindState",datatype: "String"}
            ],
            buttons: [
                {name: "default",value: getRcText("NEXT"),action: onSsidBindAP,enable:onChecked},
            ]
        };
        $("#ap_list").SList("head", oApHead);

        //服务模版列表修改绑定ap组
        var oApGroupsHead = { 
            height: "70",
            showHeader: true,
            showOperation: false,
            multiSelect: true,
            pageSize: 10,
            colNames: getRcText("BIND_AP_GROUP"),
            colModel: [
                {name: "apGroupName",datatype: "String"}, 
                {name: "BindState",datatype: "String"}
            ],
            buttons: [
                {name: "default",value: getRcText("BIND"),action: onBindAPGroups,enable:onChecked},
                {name: "default",value: getRcText("UBIND"),action: onUnBindAPGroups,enable:onChecked},
                {name: "default",value: getRcText("QUIT"),action: onQuitBindST}
            ]
        };
        $("#apgroups_bindunbind_list").SList("head", oApGroupsHead);

        //服务模版列表修改绑定ap
        var oApsHead = { 
            height: "70",
            showHeader: true,
            showOperation: false,
            multiSelect: true,
            pageSize: 10,
            colNames: getRcText("BIND_AP"),
            colModel: [
                {name: "apName",datatype: "String"}, 
                {name: "apSN",datatype: "String"},
                {name: "BindState",datatype: "String"}
            ],
            buttons: [
                {name: "default",value: getRcText("BIND"),action: onBindAps,enable:onChecked},
                {name: "default",value: getRcText("UBIND"),action: onUnBindAps,enable:onChecked},
                {name: "default",value: getRcText("QUIT"),action: onQuitBindAPs}
            ]
        };
        $("#aps_bindunbind_list").SList("head", oApsHead);
    }

    function getBindInfo(aDate,sType)
    {
        var oInfo = {};
        if (sType == 'group') {
            aDate.forEach(function(date){
                oInfo[date.ApGroupName] = 1;
            });
        }else{
            aDate.forEach(function(date){
                oInfo[date.ApName] = 1;
            });
        };

        return Object.keys(oInfo);
    }

   //刷新slist无线配置
    function refreshSSIDList(needListOpt)
    {
        var aAuthType = getRcText("AUTHEN_TYPE").split(",");
        var aSTATUS = getRcText("STATUS").split(','); //,使能,去使能
        var ssid_list = needListOpt.ssid_list || [];//这里是准备刷新到页面上的数据
        //新定义obj
        var obj = {};
        var ssidRefreshArr = [];

        ssid_list.forEach(function(ssid){
            var SSID_Id =  ssid.ssid;

            obj[SSID_Id] = {//设置初始值
                ssid_name: ssid.ssidName,
                SSID_Id:SSID_Id,
                status :aSTATUS[ssid.status],
                sp_name: ssid.stName,
                AuthType: aAuthType[0],
                bindAPGroupTmp:"default-group",
                bindApGroupList:[],
                bindApList:[],
                bindAPGroupNum:0,
                bindAPsNum:0
            };
        });

        var V3ssidList = needListOpt.ssidV3Info || [];

        V3ssidList.forEach(function(V3ssid){
            for(var k in obj){
                if (obj[k].sp_name == V3ssid.stName) {
                    obj[k].bindApGroupList = V3ssid.bindApGroupList;
                    obj[k].bindApList = V3ssid.bindApList;
                    obj[k].vlanId = V3ssid.vlanId;

                    var abindGroups = getBindInfo(V3ssid.bindApGroupList,'group');
                    var abindAps = getBindInfo(V3ssid.bindApList,'ap');
                    
                    obj[k].bindGroups = abindGroups.join(",");
                    obj[k].bindAps = abindAps.join(",");
                    obj[k].bindAPGroupNum = abindGroups.length || 0;
                    obj[k].bindAPsNum = abindAps.length || 0;

                }
            };
        });

        var pubmng_list =  needListOpt.publishList || [];

        pubmng_list.forEach(function(pubmng){
            if (!("ssidName" in pubmng)){
                delPublish(pubmng.name);
                return;
            }
            if (!(pubmng.ssidIdV3 in obj)){
                delPublish(pubmng.name);
                return;
            }
            //未发布的发布模板
            if (pubmng.isPublished == 0){
                delPublish(pubmng.name);
                return;
            }

            //这里是个分割点，上面的代码是删除各种认证模板，发布模板，页面模板的，下面是用来slist显示用


            var ssid_id = pubmng.ssidIdV3;
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

    //查询页面模板
    function queryThemeTempleteList()
    {
        function queryTempleteListSuc(data)
        {
            console.log(data);
            if(data.errorcode == 0)
            {
                var loginPageList = [];
                data.data.forEach(function(loginPage){
                    if(!(loginPage.v3flag == false)||loginPage.v3flag == 1)
                    {
                        loginPageList.push(loginPage.themeName);
                    }
                    
                });
                $("#LoginPageList").singleSelect("InitData",loginPageList);
            }
        }

        function queryTempleteListFail(err)
        {
            Frame.Msg.info("获取数据错误","error");
            console.log(err);
        }

        var queryTempleteListOpt = {
            type: "GET",
            url: MyConfig.v2path+"/themetemplate/query",
            dataType: "json",
            contentType: "application/json",
            data:{
                ownerName:g_userName,
                storeId:FrameInfo.Nasid,    
            },
            onSuccess:queryTempleteListSuc,
            onFailed:queryTempleteListFail
        };

        Utils.Request.sendRequest(queryTempleteListOpt);
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

                var authcfgList = [];
                data.data.forEach(function(authcfg){
                    if(!(authcfg.v3flag == false)||authcfg.v3flag == 1){
                        authcfgList.push(authcfg.authCfgTemplateName);
                    }
                });
                $("#AuthCfgList").singleSelect("InitData",authcfgList);
            }
        }

        function queryAuthListFail(err)
        {
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
            // var oUrlPara = {
            //     np: "h_wireless1.index_wireless"
            // };
            // Utils.Base.redirect(oUrlPara);
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
            // console.log(err);
            Frame.Msg.info("获取数据失败","error");
            console.log(err);
        }
        var queryPubListOpt = {
            type: "GET",
            url: MyConfig.v2path+"/pubmng/query",
            dataType: "json",
            contentType: "application/json",
            data: {
                "ownerName":g_userName,
                "nasId": FrameInfo.Nasid
            },
            onSuccess:queryPubListSuc,
            onFailed:queryPubListFail
        }
        Utils.Request.sendRequest(queryPubListOpt);
    }

    //查询V3ssid列表
    function queryV3SSIdList(needsListOpt)//这个是v3接口的信息/ssidmonitor/getssidlist
    {
        function queryV3SSIdListSuc(data){
            console.log(data);
            if(data.ssidList)
            {
                needsListOpt.ssidV3Info = data.ssidList;
                queryPubList(needsListOpt);
            }
            else
            {
                Frame.Msg.info("获取数据错误","error");
                console.error("getssidinfobrief(2",data);
            }

        }

        function queryV3SSIdListFail(err){
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
        }

        var queryV3SSIdListOpt = {
            url: MyConfig.path + "/ssidmonitor/getssidinfobrief?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess:queryV3SSIdListSuc,
            onFailed:queryV3SSIdListFail
        }
        Utils.Request.sendRequest(queryV3SSIdListOpt);
    }


    //查询ssid列表
    function querySSidList(){

        var needsListOpt= {};

        function querySsidListSuc(data){
            console.log(data);
            if(data.ssidList)
            {
                needsListOpt.ssid_list = data.ssidList;
                
                queryV3SSIdList(needsListOpt);
            }
            else
            {
                Frame.Msg.info("获取数据错误","error");
                console.error("getssidinfobrief(1",data);
            }

        }

        function querySsidListFail(err){
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
        }

        var querySsidListOpt = {//获取接口的数据信息
           
            type: "GET",
            url: MyConfig.path + "/ssidmonitor/getssidinfobrief?devSN=" + FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",            
            onSuccess:querySsidListSuc,
            onFailed:querySsidListFail
        }
        Utils.Request.sendRequest(querySsidListOpt);
    }

    function getAPGroupInfo()
    {

        function getAPGroupInfoSuc(data){
            console.log(data);
            if ((data.apgroupList.length != 0) && (data.apgroupList[0].modelList)) {
                g_CheckAddSt = true;
            };
            var sUnbind = getRcText("UNBIND");
            data.apgroupList.forEach(function(apgroup){
                apgroup.BindState = sUnbind;
            });
            $("#apgroup_list").SList("refresh", data.apgroupList);

        }

        function getAPGroupInfoFail(err){
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
        }

        var getAPGroupInfoOpt = {//获取接口的数据信息
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getapgroupbindstcount",
            dataType: "json",
            contentType: "application/json",
            data:{
                devSN: FrameInfo.ACSN
            },
            onSuccess:getAPGroupInfoSuc,
            onFailed:getAPGroupInfoFail
        }
        Utils.Request.sendRequest(getAPGroupInfoOpt);
    }

    function getAPInfo()
    {

        function getAPInfoSuc(data){
            console.log(data);
            if (data.apList.length != 0) {
                g_CheckAddSt = true;
            };
            var aList = [];
            var sUnbind = getRcText("UNBIND");
            data.apList.forEach(function(aps){
                if (aps.apSN.length > 0) {
                    aps.BindState = sUnbind;
                    aList.push(aps);
                };
            });
            $("#ap_list").SList("refresh",aList);

        }

        function getAPInfoFail(err){
            console.log(err);
            Frame.Msg.info("获取数据失败","error");
        }

        var getAPInfoOpt = {//获取接口的数据信息
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getapbindstcount",
            dataType: "json",
            contentType: "application/json",
            data:{
                devSN: FrameInfo.ACSN
            },
            onSuccess:getAPInfoSuc,
            onFailed:getAPInfoFail
        }
        Utils.Request.sendRequest(getAPInfoOpt);
    }

    //查询出所有微信公众号
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
            Frame.Msg.info("获取数据错误","error");
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

    function initData()
    {
        
        // getAPGroupInfo();
        querySSidList();
        // getAPInfo();
        // queryThemeTempleteList();
        // queryChatList();


    }

    function onAdviceShow()
    {
        var oTempTable = {
            index:[],
            column:["AuthenType","LoginPage"]
        };
        var oStData = $("#AuthCfgForm").form ("getTableValue", oTempTable);
        var sAuthType = oStData.AuthenType || "AT1";
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

    function initForm()
    {
        $("input[name=AuthenType], input[name=LoginPage],input[name=cipherSuites]").bind("change", function() {
            var aContent = $(this).attr("content");
            var sCtrlBlock = $(this).attr("ctrlBlock") || "";
            $(sCtrlBlock).hide();

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

        $("input[type=radio][name=AuthenType],input[type=radio][name=LoginPage]").on("click",function(){
            onAdviceShow();
        });

        //添加ST中绑定到AP的list关闭按钮事件
        $("#close_BAPs").on('click',function(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#BindAP")));
            Utils.Base.refreshCurPage();
            return;
        });

        //添加ST中绑定到APGroup的list关闭按钮事件
        $("#close_BAPGroup").on('click',function(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#BindAP_Group")));
            Utils.Base.refreshCurPage();
            return;
        });

    }

    function _init ()
    {
        g_shopName = Utils.Device.deviceInfo.shop_name;
        g_userName = FrameInfo.g_user.attributes.name;
        initFenJiFenQuan();

        initGrid();//刷表头
        initData();
        initForm();

        initFenJiFenQuan();
    }

    function initFenJiFenQuan()
    {
        //1 获取到数组
        var arrayShuZu=[];
        arrayShuZu=Frame.Permission.getCurPermission();
        
        //2 将数组作简洁处理
        var arrayShuZuNew=[];
        $.each(arrayShuZu,function(i,item){
            var itemNew=item.split('_')[1];
            arrayShuZuNew.push(itemNew);
        });
        // console.log(arrayShuZuNew);

        //3 作具体的“显示、隐藏”处理        
        if($.inArray("WRITE",arrayShuZuNew)==-1){
            //隐藏“写”的功能
            //写
            g_fqfj_operateBtn=false;
        }

    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_CheckAddSt = null;
        g_StINFO = {};
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Minput", "SList", "Form", "SingleSelect", "MSelect"],
        "utils": ["Base","Request", "Device"]
    });
}) (jQuery);

