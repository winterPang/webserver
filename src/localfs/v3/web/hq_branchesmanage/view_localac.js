(function ($)
{
    var MODULE_NAME = "hq_branchesmanage.view_localac";
    
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }

    function successRecvAddLocalAC(oData)
    {
        var bCheckFlag = true;
        if (oData.communicateResult != "success")
        {
            bCheckFlag = false;
        }
        // if (oData.deviceResult[0].result != "success")
        // {
        //     bCheckFlag = false;
        // }
        if (oData.result != "success")
        {
            bCheckFlag = false;
        }
        if (oData.serviceResult != "success")
        {
            bCheckFlag = false;
        }
        if (bCheckFlag = true)
        {
            Frame.Msg.info("添加AC成功");
        }
        else
        {
            Frame.Msg.info("添加AC失败","error");
        }

        onSyncAC();
    }

    function sendAddAcMsg(oData)
    {
//         {
//     "addLocalAC":"BOOL,为true时表示可以创建本地AC",
//     "localACNameFlag":"BOOL,为true时表示本地AC名称没有重复",
//     "localACSNFlag":"BOOL,为true时表示本地AC序列号没有重复"
// }
        if (oData.addLocalAC !=true)
        {
            if (oData.localACNameFlag != true)
            {
                Frame.Msg.info("AC名重复","error");
            }
            if (oData.localACSNFlag != true)
            {
                Frame.Msg.info("ACSN重复","error");
            }
            return;
        }
        var oCreateACOpt = {
            type:"POST",
            url:MyConfig.path+"/ant/confmgr", 
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                configType:0,
                cloudModule:"apmgr",
                deviceModule:"apmgr",
                method:"AddLocalAC",
                param:[{
                    "acSN":FrameInfo.ACSN,
                    "localACName":$('#Lac_Name_v').val(),
                    "localACModel":$('#modeSelect').singleSelect("getSelectedData").value,
                    "localACSN":$('#Lac_SN_v').val()
                }]
            }),
            onSuccess:successRecvAddLocalAC,
            onFailed:function()
            {
                console.log("Send Add Br req Failed");
            }
        };
        Utils.Request.sendRequest(oCreateACOpt);

        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#AddLacForm_v")));
    }

    function formSubmit()
    {

        // /apmonitor/getLocalACAddFlag
        var oCheckOpt = {
            type:"POST",
            url:MyConfig.path+"/apmonitor/getLocalACAddFlag?devSN="+FrameInfo.ACSN+"&localACName="+$('#Lac_Name_v').val()+"&localACSN="+$('#Lac_SN_v').val(), 
            contentType:"application/json",
            dataType:"json",
            onSuccess:sendAddAcMsg,
            onFailed:function()
            {
                console.log("Send Add Br req Failed");
            }
        }
        Utils.Request.sendRequest(oCheckOpt);
    }

    function onSyncAC()
    {
        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/ant/confmgr",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                "devSN":FrameInfo.ACSN,
                "configType":0,
                "cloudModule":"apmgr",
                "deviceModule":"apmgr",
                "method":"SyncLocalAC"
            }),
            onSuccess:function()
            {
                Utils.Base.refreshCurPage();
                console.log("hahahahaha")
            },
            onFailed:function()
            {
                console.log("check Local ac failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
    }

    function initForm()
    {
        $("#AddLacForm_v").form("init", "edit", {title : getRcText("ADDLAC_TITLE"),"btn_apply": formSubmit});
        $("#modeSelect").singleSelect("InitData",["ICG3000","ICG5000","MSR26-30","MSR2600","MSR36-10","MSR36-20","MSR36-40","MSR36-60","MSR3600","MSR3620","MSR8100","MSR810P10","S5560","WX2510H","WX2510H-F","WX2540H","WX2540H-F","WX2560H","WX3010E","WX3010H-L","WX3010H-X","WX3024E","WX3024H-L","WX3510H","WX3520H","WX3520H-F","WX3540H","WX5510E"]);
    }
    
    function _init ()
    {
        initForm();
    }

    function _resize(jParent)
    {

    }

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Form","SingleSelect"],
        "utils": ["Request","Base"],

    });

}) (jQuery);