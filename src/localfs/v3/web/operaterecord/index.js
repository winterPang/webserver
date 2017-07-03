(function ($)
{
    var MODULE_NAME = "operaterecord.index";
    var rc_info = "ws_ssid_rc";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }

    function initGrid()
    {
       
    }

    function reboot(params)
    {
        function rebootSuc(data)
        {
            console.log("success");
            if(data.retCode == 0)
            {
               Frame.Msg.info(getRcText("reboot"),"ok");   
            }
            else if(data.retCode == 1)
            {
               Frame.Msg.info(getRcText("save_fali"),"error"); 
            }
            else if(data.retCode == 2)
            {
               Frame.Msg.info(getRcText("reboot_fail"),"error"); 
            }
            else if(data.retCode == 3)
            {
               Frame.Msg.info(getRcText("main_unfind"),"error"); 
            }
            else if(data.retCode == 4)
            {
               Frame.Msg.info(getRcText("deficiecy"),"error"); 
            }
            else
            {
                Frame.Msg.info(getRcText("reboot_fail"),"error"); 
            }
        }

        function rebootFail(data)
        {
            Frame.Msg.info(getRcText("reboot_fail"),"error");
        }
        var rebootData = {
                devSN:FrameInfo.ACSN,
                saveConfig: 0,
            }

        var rebootOpt = {
            url: MyConfig.path+"/base/resetDev",
            contentType:"application/json",
            dataType: "json",
            type:"post",
            data:JSON.stringify(rebootData),
            onSuccess: rebootSuc,
            onFailed: rebootFail
        }
        Utils.Request.sendRequest(rebootOpt);
    }

    function rebootSave(params)
    {
        function rebootSaveSuc(data)
        {
            console.log("success");
            if(data.retCode == 0)
            {
               Frame.Msg.info(getRcText("rebootSave"),"ok");   
            }
            else if(data.retCode == 1)
            {
               Frame.Msg.info(getRcText("save_fali"),"error"); 
            }
            else if(data.retCode == 2)
            {
               Frame.Msg.info(getRcText("reboot_fail"),"error"); 
            }
            else if(data.retCode == 3)
            {
               Frame.Msg.info(getRcText("main_unfind"),"error"); 
            }
            else if(data.retCode == 4)
            {
               Frame.Msg.info(getRcText("deficiecy"),"error"); 
            }
            else
            {
                Frame.Msg.info(getRcText("reboot_fail"),"error"); 
            }

        }

        function rebootSaveFail(data)
        {
            Frame.Msg.info(getRcText("reboot_fail"),"error");
        }
        var rebootSaveData = {
                devSN:FrameInfo.ACSN,
                saveConfig: 1,
            }

        var rebootSaveOpt = {
            url: MyConfig.path+"/base/resetDev",
            contentType:"application/json",
            dataType: "json",
            type:"post",
            data:JSON.stringify(rebootSaveData),
            onSuccess: rebootSaveSuc,
            onFailed: rebootSaveFail
        }
        Utils.Request.sendRequest(rebootSaveOpt);
    }

    function disconnectMainLink()
    {
        function disconnectMainLinkSuc(data)
        {
            console.log("success");
            if(data.retCode == 0)
            {
               Frame.Msg.info(getRcText("success"));   
            }
            else
            {
                Frame.Msg.info(getRcText("fali"),"error"); 
            }
            
        }

        function disconnectMainLinkFail(data)
        {
            Frame.Msg.info(getRcText("fali"),"error");
        }
        var disconnectMainLinkOpt = {
            url: MyConfig.path+"/base/resetConnection",
            dataType: "json",
            contentType:"application/json",
            type:"post",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
            }),
            onSuccess: disconnectMainLinkSuc,
            onFailed: disconnectMainLinkFail 

        }
        Utils.Request.sendRequest(disconnectMainLinkOpt);
    }

    function initData()
    {
        
    }

    function initForm()
    {
        $("button").bind("click", function(){
            var btn_value = $(this).val();

            if(btn_value == "btnSave")
            {
                rebootSave();
            }
            else if(btn_value == "btnReboot")
            {
                reboot();
            }
            else if(btn_value == "btnDisconnect")
            {
                disconnectMainLink();   
            }
        })
    }

    function _init ()
    {
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
        "widgets": ["SList","DateTime","EditTable"],
        "utils": ["Base","Request"]
    });
}) (jQuery);