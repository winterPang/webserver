;(function($){
    var MODULE_NAME = "b_wireset.apply_config";
    var oapList = {};
    var oapConfig = {};
    /*yuzhiqiang的drs配置下发*/
    function setDrsdata()
    {
        var TipMsg = "";
        if($("#Drsid").MCheckbox("getState"))
        {
            $("#Drsid").MCheckbox("setState",true);
            var statue  = "on";
            TipMsg = "开启应用分析功能";
        }else{
            $("#Drsid").MCheckbox("setState",false);
            var statue  = "off";
            TipMsg = "关闭应用分析功能";
        }
        $.ajax({
            url: MyConfig.path + '/ant/confmgr',
            dataType: "json",
            type: "post",
            data: {
                cloudModule: "DRS",
                deviceModule: "DRS",
                subMsgType:0,
                configType: 0,
                devSN: FrameInfo.ACSN,
                method: "drsUpdate",
                param: {
                    devSN:FrameInfo.ACSN,
                    status:statue,
                    family:"0"
                }
            },
            success:function(data){
                if("fail" == data.communicateResult)
                {
                    Frame.Msg.info(TipMsg+"失败");
                    $("#Drsid").MCheckbox("setState",boolCancel);
                    $(".form-actions").hide();
                    return false;
                }
                for(i=0;i<data.deviceResult.length;i++) {
                    if ("fail" == data.deviceResult[i].result) {
                        Frame.Msg.info(TipMsg+"失败");
                        $("#Drsid").MCheckbox("setState",boolCancel);
                        $(".form-actions").hide();
                        return false;
                    }
                }
                if("fail"  == data.serviceResult){
                    Frame.Msg.info(TipMsg+"失败");
                    $("#Drsid").MCheckbox("setState",boolCancel);
                    $(".form-actions").hide();
                    return false;
                }

                if(statue == "on")
                {
                    $("#Drsid").MCheckbox("setState",true);
                }
                else{
                    $("#Drsid").MCheckbox("setState",false);
                }
                $("#DrsBtn .form-actions").hide();
            },
            error:function(){
                Frame.Msg.info(TipMsg+"失败");
            }
        });
    }
    function setdata()
    {
        var TipMsg = "";
        if($("#Cupid").MCheckbox("getState"))
        {
            $("#Cupid").MCheckbox("setState",true);
            oapConfig.Status = "on";
            TipMsg = "开启无线定位功能";
        }else{
            $("#Cupid").MCheckbox("setState",false);
            oapConfig.Status = "off";
            TipMsg = "关闭无线定位功能";
        }

        $.ajax({
            url: MyConfig.path + '/ant/confmgr',
            dataType: "json",
            type: "post",
            data: {
                cloudModule: "wloc",
                deviceModule: "wloc",
                subMsgType:0,
                configType: 0,
                devSN: FrameInfo.ACSN,
                method: "globalStatusSet",
                param: [oapConfig]
            },
            success:function(data){
                if("fail" == data.communicateResult)
                {
                    Frame.Msg.info(TipMsg+"失败");
                    $("#Cupid").MCheckbox("setState",boolCancel);
                    $(".form-actions").hide();
                    return false;
                }
                for(i=0;i<data.deviceResult.length;i++) {
                    if ("fail" == data.deviceResult[i].result) {
                        Frame.Msg.info(TipMsg+"失败");
                        $("#Cupid").MCheckbox("setState",boolCancel);
                        $(".form-actions").hide();
                        return false;
                    }
                }
                if("fail"  == data.serviceResult){
                    Frame.Msg.info(TipMsg+"失败");
                    $("#Cupid").MCheckbox("setState",boolCancel);
                    $(".form-actions").hide();
                    return false;
                }
                tipinit();
                $(".form-actions").hide();
            },
            error:function(){
                Frame.Msg.info(TipMsg+"失败");
            }
        });
    }

    function tipinit()
    {
        oapConfig = {};
        $.ajax({
            url:MyConfig.path+'/ant/confmgr',
            dataType:"json",
            type:"post",
            data:{
                cloudModule:"wloc",
                deviceModule:"wloc",
                configType:1,
                subMsgType: 0,
                devSN:FrameInfo.ACSN,
                method:"globalStatusGet",
                param:{
                    devSN:FrameInfo.ACSN
                },
                result:["Status"]
            },
            success:function(data)
            {
                var apList = data.result || "";
                if(apList === "")
                {
                    Frame.Msg.info("暂无AP");
                    $("#Cupid").MCheckbox("setState",false);
                }else {
                    $("#Cupid").MCheckbox("setState", false);
                    $.each(apList, function (i, item) {
                        oapList.Status = item.Status;
                        if (item.Status == "on") {
                            $("#Cupid").MCheckbox("setState", "true");
                            Frame.Msg.info("开启无线定位功能成功");
                            boolCancel = $("#Cupid").MCheckbox("getState");
                        }else{
                            Frame.Msg.info("关闭无线定位功能成功");
                            boolCancel = $("#Cupid").MCheckbox("getState");
                        }
                    });

                }

            },
            error:function(){
                Utils.Base.showError('<li>'+(getRcText("ERRTIP").split(",")[0])+'</li>');
            }

        });
    }
    function initdata()
    {
        oapConfig = {};
        $.ajax({
            url:MyConfig.path+'/ant/confmgr',
            dataType:"json",
            type:"post",
            data:{
                cloudModule:"wloc",
                deviceModule:"wloc",
                configType:1,
                subMsgType: 0,
                devSN:FrameInfo.ACSN,
                method:"globalStatusGet",
                param:{
                    devSN:FrameInfo.ACSN
                },
                result:["Status"]
            },
            success:function(data)
            {
                var apList = data.result || "";
                $("#Cupid").MCheckbox("setState",false);
                $.each(apList,function(i,item){
                    oapList.Status = item.Status;
                    if(item.Status == "on"){
                        $("#Cupid").MCheckbox("setState","true");
                    }
                });
                boolCancel = $("#Cupid").MCheckbox("getState");
            },
            error:function(){
                Utils.Base.showError('<li>'+(getRcText("ERRTIP").split(",")[0])+'</li>');
            }

        });
        /*yuzhiqiang的drs 配置*/
        $.ajax({
            url:MyConfig.path+'/ant/confmgr',
            dataType:"json",
            type:"post",
            data:{
                cloudModule:"DRS",
                deviceModule:"DRS",
                configType:1,
                subMsgType: 0,
                devSN:FrameInfo.ACSN,
                method:"drsGet",
                param:{
                    devSN:FrameInfo.ACSN
                },
                result:["status"]
            },
            success:function(data)
            {
                var drsResult = data.result || "";
                $("#Drsid").MCheckbox("setState",false);
                for(var i=0;i<drsResult.length;i++)
                {
                    if(drsResult[i].status == "on")
                    {
                        $("#Drsid").MCheckbox("setState","true");
                    }
                }
            },
            error:function(){
                Utils.Base.showError('<li>'+(getRcText("ERRTIP").split(",")[0])+'</li>');
            }

        });

    }
    var boolCancel;
    function onCancel(){
        $("#Cupid").MCheckbox("setState",boolCancel);
        $(".form-actions").hide();
        Frame.Msg.info("已取消");
    }
    /*yuzhiqiang配置取消*/
    function DrsonCancel(){
        $("#Drsid").MCheckbox("setState",boolCancel);
        $("#DrsBtn .form-actions").hide();
        Frame.Msg.info("已取消");
    }
    function initForm()
    {
        $("#CupidForm").form("init","edit",{"btn_apply":setdata,"btn_cancel":onCancel});
        $(".btn").addClass("hide");
        $("#CupidForm").change(function(){
            $(".form-actions").show();
        });

        /*yuzhiqiang的drs配置*/
        $("#DrsidForm").form("init","edit",{"btn_apply":setDrsdata,"btn_cancel":DrsonCancel});
        $(".btn").addClass("hide");
        $("#DrsidForm").change(function(){
            $("#DrsBtn .form-actions").show();
        });

    }
    function _init()
    {
        initForm();
        initdata();
    }

    function _destroy()
    {
        oapList = {};
        oapConfig = {};

    }

    Utils.Pages.regModule(MODULE_NAME,{
       "init":_init,
        "destroy":_destroy,
        "widgets":["Form","Minput","Switch"],
        "utils" :["Base"]
    });

})(jQuery);