(function ($)
{
    var MODULE_NAME = "h_auth.authcfg";
    var v2path = MyConfig.v2path;
    var username =MyConfig.username;
    var password = MyConfig.password;
    var g_PercentMax = 100;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }
    function showAUth(oRowdata, sName){
        function onCancel()
        {
            if(oRowdata.authType == 1||oRowdata.authType==getRcText ("AUTH_Status").split(",")[1]){
                oRowdata.authType = 1;
                $("#other_auth").addClass("hide");
            }else{
                oRowdata.authType = 2;
                $("#other_auth").removeClass("hide");
            }
            if(oRowdata.isEnableAccount==0||oRowdata.isEnableAccount==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableAccount = 0;
            }else{
                oRowdata.isEnableAccount = 1;
            }
            if(oRowdata.isEnableSms==0||oRowdata.isEnableSms==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableSms = 0;
            }else{
                oRowdata.isEnableSms = 1
            }
            if(oRowdata.isEnableWeixin==0||oRowdata.isEnableWeixin==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableWeixin = 0;
            }else{
                oRowdata.isEnableWeixin = 1;
            }
            if(oRowdata.nosension=="0"){
                oRowdata.feelauth = "0";
                $("#anthTime").addClass("hide");
            }else{
                oRowdata.feelauth = "1";
                oRowdata.unauthtime = oRowdata.nosension;
                $("#anthTime").removeClass("hide");
            }
            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            return false;
        }

        function onSubmitSSID()
        {
            function onSuccess(){
                if(sName == "add")
                {
                    Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
                }
                Utils.Base.refreshCurPage();
                // authListData();
            }
            var oTempTable = {
                index:[],
                column:["authCfgTemplateName","authType","isEnableSms","isEnableWeixin","isEnableAccount","feelauth","unauthtime"]
            };
            var oStData = jFormSSID.form ("getTableValue", oTempTable);
            var authData={
                ownerName:FrameInfo.g_user.attributes.name,
                isEnableAli:0,
                isEnableQQ:0,
                uamAuthParamList:[
                    {authParamName:"ONLINE_MAX_TIME",authParamValue:"21600"},
                    {authParamName:"URL_AFTER_AUTH",authParamValue:""},
                    {authParamName:"IDLE_CUT_TIME",authParamValue:"30"},
                    {authParamName:"IDLE_CUT_FLOW",authParamValue:"10240"},
                    {authParamName:"NO_SENSATION_TIME",authParamValue:"7"}
                ]
            };
            if(oStData.unauthtime && oStData.unauthtime.charAt(0) == '0' && oStData.unauthtime.length == 2)
            {
                oStData.unauthtime = oStData.unauthtime.charAt(1);
            }
            if(oStData.feelauth==0){
                authData.uamAuthParamList[4].authParamValue="0";
                delete oStData.feelauth;
            }
            if(oStData.feelauth==1&&oStData.unauthtime){
                authData.uamAuthParamList[4].authParamValue=oStData.unauthtime;
                delete oStData.feelauth;
                delete oStData.unauthtime;
            }
            if(oStData.authType=="1"){
                oStData.isEnableSms =0;
                oStData.isEnableAccount=1;
                oStData.isEnableWeixin=0;
            }

            var url=v2path;
            if(sName == "add"){
                url +="/authcfg/add"
            }else{
                url +="/authcfg/modify"
                /* authData.isEnableWeixin=oStData.isEnableWeixin;
                 delete oStData.isEnableWeixin;*/
            }
            var requestData= $.extend(authData,oStData);
            $.ajax({
                type: "post",
                url: url,
                contentType:"application/json",
                dataType:"json",
                data:JSON.stringify(requestData),
                //username:username,
                //password:password,
                success:function(data){
                    if(data.errorcode == 1105)
                    {
                        Frame.Msg.info("该认证模板已存在");
                        return;
                    }
                    if(data.errorcode==0){
                        onSuccess();
                        Frame.Msg.info("配置成功");
                    }
                    else{
                        Frame.Msg.info(data.errorcode);
                    }
                },
                error:function(err){
                    //TODO ajax下发错误处理
                    //   Frame.Msg.error("出错了");
                }

            })
        }
        var jFormSSID = $("#toggle_form");
        if(sName == "add") //Add
        {
            var jDlg = $("#AddAuthTempDlg");
            if(jDlg.children().length)
            {
                $("#authToggle").show().insertAfter($(".modal-header",jDlg));
            }
            else
            {
                $("#authToggle").show().appendTo(jDlg);
            }

            jFormSSID.form("init", "edit", {"title":getRcText("ADD_TITLE"),"btn_apply": onSubmitSSID});
            $("#authname",jFormSSID).removeAttr("disabled");
            $("#anthTime").removeClass("hide");
            $("#other_auth").addClass("hide");
            jFormSSID.form("updateForm",{
                authCfgTemplateName : "",
                authType : "1",
                isEnableSms:"0",
                isEnableWeixin:"0",
                isEnableAccount:"1",
                feelauth:"1",
                unauthtime:"7"
            });
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
            Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
        }
        else //Edit
        {
            jFormSSID.form ("init", "edit", {"btn_apply": onSubmitSSID, "btn_cancel":onCancel});
            $("#authname",jFormSSID).attr("disabled","disabled");
            if(oRowdata.authType == 1||oRowdata.authType==getRcText ("AUTH_Status").split(",")[1]){
                oRowdata.authType = 1;
                $("#other_auth").addClass("hide");
            }else{
                oRowdata.authType = 2;
                $("#other_auth").removeClass("hide");
            }
            if(oRowdata.isEnableAccount==0||oRowdata.isEnableAccount==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableAccount = 0;
            }else{
                oRowdata.isEnableAccount = 1;
            }
            if(oRowdata.isEnableSms==0||oRowdata.isEnableSms==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableSms = 0;
            }else{
                oRowdata.isEnableSms = 1
            }
            if(oRowdata.isEnableWeixin==0||oRowdata.isEnableWeixin==getRcText ("AUTH_Status").split(",")[0]){
                oRowdata.isEnableWeixin = 0;
            }else{
                oRowdata.isEnableWeixin = 1;
            }
            if(oRowdata.nosension=="0"){
                oRowdata.feelauth = "0";
                $("#anthTime").addClass("hide");
            }else{
                oRowdata.feelauth = "1";
                oRowdata.unauthtime = oRowdata.nosension;
                $("#anthTime").removeClass("hide");
            }

            jFormSSID.form("updateForm",oRowdata);
            $("input[type=text]",jFormSSID).each(function(){
                Utils.Widget.setError($(this),"");
            });
        }
    }
    function onDelSSID(oData)
    {
        $.ajax({
            type: "post",
            url: v2path+"/authcfg/delete",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({ownerName:FrameInfo.g_user.attributes.name,"authCfgTemplateName":oData.authCfgTemplateName}),
            //username:username,
            //password:password,
            success:function(data){
                if(data.errorcode == "1109")
                {
                    Frame.Msg.error("该认证模板已经被绑定，不能删除");
                }else if(data.errorcode == "0") {
                    Frame.Msg.info("删除成功");
                }else{
                    Frame.Msg.info(data.errormsg||"删除失败");
                }
                Utils.Base.refreshCurPage();
                // authListData();
            },
            error:function(err){
                //TODO ajax下发错误处理
                // alert("suc"+data);
            }

        })
    }
    function initData()
    {
        var authdata  = [];
        $.ajax({
            type: "GET",
            url: v2path+"/authcfg/query",
            contentType:"application/json",
            dataType:"json",
            data:{"ownerName":FrameInfo.g_user.attributes.name},
            //username:username,
            //password:password,
            success:function(data){
                //  alert("suc"+data);
                //  alert(JSON.stringify(data));
                if(data.errorcode == 0){
                    $.each(data.data,function(key,value){
                        var authTemplate={}
                        authTemplate.authCfgTemplateName=value.authCfgTemplateName;
                        if(value.authType==1){
                            authTemplate.authType = getRcText ("AUTH_Status").split(",")[1];
                        }else{
                            authTemplate.authType = getRcText ("AUTH_Status").split(",")[0];
                        }
                        authTemplate.isEnableSms=getRcText ("AUTH_Status").split(",")[value.isEnableSms];
                        authTemplate.isEnableWeixin=getRcText ("AUTH_Status").split(",")[value.isEnableWeixin];
                        authTemplate.isEnableAccount=getRcText ("AUTH_Status").split(",")[value.isEnableAccount];
                        authTemplate.nosension=value.uamAuthParamList[0].authParamValue;
                        authdata.push(authTemplate);
                    })
                    $("#authList").SList ("refresh", authdata);
                }else {
                    //TODO errorcode处理
                    //   Frame.Msg.error("查询数据异常");

                }
            },
            error:function(err){
                // Frame.Msg.error(JSON.stringify(err));
            }
        });
    }
    function initGrid()
    {
        var optauth = {
            colNames: getRcText ("SSID_HEADER"),
            multiSelect: false,
            colModel: [
                {name:'authCfgTemplateName', datatype:"String"},
                {name:'authType', datatype:"String"},
                {name:'isEnableSms', datatype:"String"},
                {name:'isEnableWeixin', datatype:"String"},
                {name:'isEnableAccount', datatype:"String"}
            ],
            onToggle : {
                action : showAUth,
                jScope : $("#authToggle"),
                BtnDel : {
                    show : true,
                    action : onDelSSID
                }
            },
            buttons:[
                {name: "add", action: showAUth}
            ]
        };
        $("#authList").SList ("head", optauth);
    }
    function initForm(){
        $("#feelauth1").on("click",function(){
            $(this).attr("checked","true");
            $("#anthTime").removeClass("hide");
        })
        $("#feelauth2").on("click",function(){
            $(this).attr("checked","true");
            $("#anthTime").addClass("hide");
        })
        $("#authType2").on("click",function(){
            $(this).attr("checked","true");
            $("#other_auth").removeClass("hide");
        })
        $("#authType1").on("click",function(){
            $(this).attr("checked","true");
            $("#other_auth").addClass("hide");
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
        g_PercentMax = 100;
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form"],
        "utils": ["Base"]
    });
}) (jQuery);