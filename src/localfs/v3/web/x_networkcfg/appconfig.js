(function ($){
    
    var MODULE_BASE = "x_networkcfg"
    var MODULE_NAME = MODULE_BASE+".appconfig";
    var g_AllRadio, g_WipsType,g_RowData;
    // var oWIPS = 0;
    var oProbe = 0;
    // var oNatDetect = 0;
    var oAPlist = 0;
    var g_ajaxResult = {};
    var g_configMgr = {};
    // var g_apList = {};
    var g_resultSatus = {};
    var g_wait = 0;
    var strPath = MyConfig.path + '/ant';
    var hPending = null;
    var g_sShopName = null;
    var drsStatus = null;
    var probeStatus = null;
    var g_onLine = [];//存储在线下发失败的设备
    var flag= null;//为空就是第一次下发，否则就是再次下发失败的设备
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }

    function fCheckCfgRet(data) {
        g_onLine = [];
        if(data.serviceResult =="success") {
            var aErrList = [];
            for (var i = 0; i < data.deviceResults.length; i++) {
                if (data.deviceResults[i].reason == "Failed to set cfg to device.") {
                    var devFailList ={
                        devSN:data.deviceResults[i].devSN
                    };
                    if(g_onLine.indexOf(data.deviceResults[i].devSN)==-1){
                        g_onLine.push(data.deviceResults[i].devSN);//不重复的设备序列号
                    }
                    aErrList.push(devFailList);
                }
            }
            if (aErrList.length == 0) {
                // if(statue == "on"){
                //     $("#Drsid").MCheckbox("setState",true);
                //     Frame.Msg.info(TipMsg+getRcText("MSG_INFO").split(",")[1]);
                //     // "成功"
                // }
                // else{
                //     $("#Drsid").MCheckbox("setState",false);
                //     Frame.Msg.info(TipMsg+getRcText("MSG_INFO").split(",")[1]);
                //     // "成功"
                // }
                Frame.Msg.info(getRcText("PROBE_SATUS_MSG").split(",")[0]);
                flag = null;
            }
            else {
                //hPending.close();
                //configflag = 1;
                getStatus(g_onLine,aErrList,function(aErrOpt){
                    hPending&&hPending.close();
                    setTimeout(function(){
                        $(".btn").removeClass("hide");
                        Utils.Base.openDlg(null, {}, {scope:$("#failcfgDlg"),className:"modal-large"});
                    },500);
                    $("#failList").SList("refresh", aErrOpt);
                    //$("#Drsid").MCheckbox("setState",true);
                    //$(".form-actions").hide();
                });
            }
        }
        else{
            configflag = 1;
            //Frame.Msg.info(TipMsg+getRcText("MSG_INFO").split(",")[0],"error");
            // "失败"
            $("#Drsid").MCheckbox("setState",false);
            $(".form-actions").hide();
            return false;
            flag = null;
        }
        hPending&&hPending.close();
        return;
    }

    function getStatus(g_onLine,aErrList,callback){
        var getDevStatusOpt = {
            type:"POST",
            url:"/base/getDevs",
            dataType:"json",
            timeout: 150000,
            data:{
                devSN:g_onLine
            },
            onSuccess:function(data){
                for(var i=0;i<aErrList.length;i++){
                    for(var j=0;j<data.detail.length;j++){
                        if(aErrList[i].devSN==data.detail[j].devSN){
                            aErrList[i].devState=getRcText("STATE").split(",")[data.detail[i].status]
                        }
                    }
                }
                callback(aErrList);

            },
            onFailed:function(){
              hPending&&hPending.close();
                console.log(error);
            }
        };
        Utils.Request.sendRequest(getDevStatusOpt);
    }

    function failConform(){
        $("#failConform").on("click", function(){
            //$(".form-actions").hide();
            flag&&flag.apply(null,flag.args);
            //flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    function closeMadle(){
        $("#failClose").on("click", function(){
            //$(".form-actions").hide();
            //关闭dialog弹框,返回至主页面
            flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    function closeX(){
        $("#closeX").on("click", function(){
            //$(".form-actions").hide();
            //关闭dialog弹框,返回至主页面
            flag = null;
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    //function  initForm(){
    //    $("#failshop_form").form("init", "edit", {
    //        "title": getRcText("FAIL_CFGLIST"),
    //        "btn_apply":{
    //            enable:true,
    //            action:function () {
    //                flag&&flag(flag.args);
    //                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#failshop_form")));
    //            }
    //        },
    //        "onClose": function(){
    //            flag=null;
    //        },
    //        "btn_cancel": function(){
    //            flag=null;
    //            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#failshop_form")));
    //        }
    //    });
    //}
    function initFailDevGrid() {
        var opt = {
            colNames: getRcText("DEV_LIST"),
            showOperation: false,
            multiSelect: false,
            search: false,
            sortable: false,
            pageSize: 5,
            colModel: [
                {name: 'devSN', datatype: "String"}, //business_name branch_name
                {name: 'devState', datatype: "String"}, //business_name branch_name
            ]
        };
        $("#failList").SList("head", opt);
    }

    function onSuccess (argument) {
        //Utils.Pages.closeWindow(Utils.Pages.getWindow($("#WipsSetForm")));
        initData();
    }
    
    function setConfig(strMethod,setParams,succssFunc,errorFunc)
    {
        var options = {
            url:strPath+'/confmgr',
            Type:"post",
            timeout: 150000,
            data:{
                cloudModule:"WIPS",
                deviceModule:'WIPS',
                configType:0,
                cfgTimeout: 120,
                devSN:FrameInfo.ACSN,
                nasId: FrameInfo.Nasid,
                method:strMethod,
                param:setParams
            },
            //onSuccess:succssFunc,
            //onFailed:errorFun
        };
        if("probeEnable" == strMethod)
        {
            options.data.cloudModule = "PROBE";
            options.data.deviceModule = "PROBE";
        }
        ajaxSendSingle(options,succssFunc,errorFunc);
    }

    
    function judgeResult(adata,modules)
    {
        for(var i in adata){
            if((i == "communicateResult") && (adata[i] == "fail"))
            {
                g_resultSatus[modules] = 1;
                return false;
            }
            if((i == "serviceResult") && (adata[i] == "fail"))
            {
                g_resultSatus[modules] = 2;
                return false;
            }
            if(i == "deviceResult")
            {
                for(var j = 0; j < adata[i].length; j++)
                {
                    if(adata[i][j].result == "fail")
                    {
                        g_resultSatus[modules] = 3;
                        return false;
                    }
                }
            }
        }
        g_resultSatus[modules] = 0;
        return true;
    }

    function func_probe(adata)
    {
        judgeResult(adata, "probe");
        reInitdata();
    }
    
    function func_error()
    {
        g_wait.close();
    }
    
    function reInitdata()
    {
        if(g_resultSatus.hasOwnProperty("probe"))
        {
            //onSuccess();
            getProbedata();
            g_wait.close();
            showMsg();
        }
    }
    
    function showMsg()
    {
        if(g_resultSatus.probe == 0)
        {
            Frame.Msg.info(getRcText("PROBE_SATUS_MSG").split(",")[0]);
            // "配置成功！"
            return;
        }
        
        if(g_resultSatus.probe == 1)
        {
            Frame.Msg.info(getRcText("PROBE_SATUS_MSG").split(",")[1],"error");
            // "主连接失败！"
            return;

        }
        if(g_resultSatus.probe == 2)
        {
            Frame.Msg.info(getRcText("PROBE_SATUS_MSG").split(",")[2],"error");
            // "服务器端失败！"
            return;
        }
        if(g_resultSatus.probe == 3) 
        {
            Frame.Msg.info(getRcText("PROBE_SATUS_MSG").split(",")[3],"error");
            // "配置失败！"
            return;
        }
        g_resultSatus = {};
    }

    function makeAllData()
    {
        var aAll = [];
        for(var strName in g_configMgr)
        {
            aAll.push(g_configMgr[strName]);
        }

        return aAll;
    }
    
    function getDrsdata(){
        $.ajax({
            url:MyConfig.path+'/ant/confmgr',
            dataType:"json",
            type:"post",
            timeout: 150000,
            data:{
                cloudModule:"DRS",
                deviceModule:"DRS",
                cfgTimeout: 120,
                configType:1,
                subMsgType: 0,
                devSN:FrameInfo.ACSN,
                nasId: FrameInfo.Nasid,
                method:"drsGet",
                param:{
                    devSN:FrameInfo.ACSN,
                    nasId: FrameInfo.Nasid
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
                drsStatus = $("#Drsid").MCheckbox("getState");
            },
            error:function(){
                Utils.Base.showError('<li>'+(getRcText("ERRTIP").split(",")[0])+'</li>');
            }

        });    
    }
    
    function setDrsdata()
    {
        hPending = Frame.Msg.pending(getRcText("CONGFG"));
        var TipMsg = "";
        var configflag = 0;//判断如果返回失败置一 然后获取数据库
        if($("#Drsid").MCheckbox("getState"))
        {
            $("#Drsid").MCheckbox("setState",true);
            var statue  = "on";
            TipMsg = getRcText("TIP_MSG").split(",")[0];
            // "开启应用分析功能"
        }else{
            $("#Drsid").MCheckbox("setState",false);
            var statue  = "off";
            TipMsg = getRcText("TIP_MSG").split(",")[1];
            // "关闭应用分析功能"
        }
        if(flag===null){
            flag= setDrsdata;
            flag.args = arguments;
            $.ajax({
                url: MyConfig.path + '/ant/confmgr',
                dataType: "json",
                timeout: 150000,//2.5min timeout
                type: "post",
                data: {
                    cloudModule: "DRS",
                    deviceModule: "DRS",
                    subMsgType:0,
                    configType: 0,
                    cfgTimeout: 120,
                    //cfgRetry: 2,
                    //devSN: FrameInfo.ACSN,
                    sceneFlag:"true",
                    userName:FrameInfo.g_user.user,
                    shopName:g_sShopName,
                    method: "drsEnable",
                    nasId: FrameInfo.Nasid,
                    policy: "cloudFirst",
                    param: {
                        devSN:FrameInfo.ACSN,
                        //nasId: FrameInfo.Nasid,
                        status:statue,
                        family:"0"
                    },
                },
                success:function(data){
                    fCheckCfgRet(data);
                },
                error:function(){
                    hPending&&hPending.close();
                    Frame.Msg.info(TipMsg+getRcText("MSG_INFO").split(",")[0],"error");
                    return;
                    // "失败"
                }
            });
        }
        else{
            $.ajax({
                url: MyConfig.path + '/ant/confmgr',
                dataType: "json",
                timeout: 150000,//2.5min timeout
                type: "post",
                data: {
                    cloudModule: "DRS",
                    deviceModule: "DRS",
                    subMsgType:0,
                    configType: 0,
                    cfgTimeout: 120,
                    //cfgRetry: 2,
                    //devSN: FrameInfo.ACSN,
                    sceneFlag:"true",
                    userName:FrameInfo.g_user.user,
                    shopName:g_sShopName,
                    devSN:g_onLine,
                    method: "drsEnable",
                    nasId: FrameInfo.Nasid,
                    param: {
                        devSN:FrameInfo.ACSN,
                        //nasId: FrameInfo.Nasid,
                        status:statue,
                        family:"0"
                    },
                },
                success:function(data){
                    fCheckCfgRet(data);
                    /*如果配置失败 则重新去数据库*/
                    //if(configflag == 1)
                    //{
                    //    $.ajax({
                    //        url:MyConfig.path+'/ant/confmgr',
                    //        dataType:"json",
                    //        type:"post",
                    //        data:{
                    //            cloudModule:"DRS",
                    //            deviceModule:"DRS",
                    //            configType:1,
                    //            subMsgType: 0,
                    //            cfgTimeout: 120,
                    //            devSN:FrameInfo.ACSN,
                    //            method:"drsGet",
                    //            param:{
                    //                devSN:FrameInfo.ACSN,
                    //                nasId: FrameInfo.Nasid
                    //            },
                    //            result:["status"]
                    //        },
                    //        success:function(data)
                    //        {
                    //            var drsResult = data.result || "";
                    //            for(var i=0;i<drsResult.length;i++)
                    //            {
                    //                if(drsResult[i].status == "on")
                    //                {
                    //                    $("#Drsid").MCheckbox("setState",true);
                    //                }
                    //                if(drsResult[i].status == "off")
                    //                {
                    //                    $("#Drsid").MCheckbox("setState",false);
                    //                }
                    //            }
                    //        },
                    //        error:function(){
                    //            Utils.Base.showError('<li>'+(getRcText("ERRTIP").split(",")[0])+'</li>');
                    //        }
                    //    });
                    //    return;
                    //}
                    //
                    //if(statue == "on")
                    //{
                    //    $("#Drsid").MCheckbox("setState",true);
                    //    //Frame.Msg.info(TipMsg+getRcText("MSG_INFO").split(",")[1]);
                    //    // "成功"
                    //}
                    //else{
                    //    $("#Drsid").MCheckbox("setState",false);
                    //    //Frame.Msg.info(TipMsg+getRcText("MSG_INFO").split(",")[1]);
                    //    // "成功"
                    //}
                    //$("#DrsBtn .form-actions").hide();
                    //drsStatus = $("#Drsid").MCheckbox("getState");
                },
                error:function(){
                    hPending&&hPending.close();
                    Frame.Msg.info(TipMsg+getRcText("MSG_INFO").split(",")[0],"error");
                    return;
                    // "失败"
                }
            });
        }
        if(configflag == 1)
        {
            $.ajax({
                url:MyConfig.path+'/ant/confmgr',
                dataType:"json",
                timeout: 150000,
                type:"post",
                data:{
                    cloudModule:"DRS",
                    deviceModule:"DRS",
                    configType:1,
                    subMsgType: 0,
                    cfgTimeout: 120,
                    devSN:FrameInfo.ACSN,
                    nasId: FrameInfo.Nasid,
                    method:"drsGet",
                    param:{
                        devSN:FrameInfo.ACSN,
                        nasId: FrameInfo.Nasid
                    },
                    result:["status"]
                },
                success:function(data)
                {
                    var drsResult = data.result || "";
                    for(var i=0;i<drsResult.length;i++)
                    {
                        if(drsResult[i].status == "on")
                        {
                            $("#Drsid").MCheckbox("setState",true);
                        }
                        if(drsResult[i].status == "off")
                        {
                            $("#Drsid").MCheckbox("setState",false);
                        }
                    }
                },
                error:function(){
                    Utils.Base.showError('<li>'+(getRcText("ERRTIP").split(",")[0])+'</li>');
                }
            });
            return;
        }

        //if(statue == "on")
        //{
        //    $("#Drsid").MCheckbox("setState",true);
        //    //Frame.Msg.info(TipMsg+getRcText("MSG_INFO").split(",")[1]);
        //    // "成功"
        //}
        //else{
        //    $("#Drsid").MCheckbox("setState",false);
        //    //Frame.Msg.info(TipMsg+getRcText("MSG_INFO").split(",")[1]);
        //    // "成功"
        //}
        //$("#DrsBtn .form-actions").hide();
        //drsStatus = $("#Drsid").MCheckbox("getState");
    }
    
    function DrsonCancel(){
        $("#Drsid").MCheckbox("setState",drsStatus);
        $("#DrsBtn .form-actions").hide();
        Frame.Msg.info(getRcText("MSG_INFO").split(",")[2]);
        // "已取消"
    }
    
    function getProbedata(){
        
        function myCallback(oInfos)
        {
            var aProbeCfg = g_ajaxResult["probe"] || [];
            var aApList = g_ajaxResult["aplist"] || [];
            for(var t = 0; t < aApList.length; t++)
            {
                var aradioList = aApList[t].radioList || [];
                // g_apList[aApList[t].apName] = {};

                for(var n = 0; n < aradioList.length; n++)
                {
                    var sTmpName = aApList[t].apName + "--" + aradioList[n].radioId;
                    g_configMgr[sTmpName] = {
                        ApName : aApList[t].apName,
                        RadioID : aradioList[n].radioId,
                        RadioName : aradioList[n].radioMode,
                        RadioStatus:aradioList[n].radioStatus,
                        Probe : "0",
                    }
                    // g_apList[aApList[t].apName]["radio"+n] = {
                    //     RadioID : aradioList[n].radioId,
                    //     RadioName : aradioList[n].radioMode,
                    //     RadioStatus:aradioList[n].radioStatus,
                    // };
                }

            }
            
            for(var k = 0; k < aProbeCfg.length; k++){
                var strTmpName = aProbeCfg[k].apName + "--" + aProbeCfg[k].radioID;
                var oProbeCfg = aProbeCfg[k];

                g_configMgr[strTmpName] && (g_configMgr[strTmpName].Probe = ((oProbeCfg.probeStatus == 'on')?"1":"0"));

            }
            g_AllRadio = makeAllData();
            //$("#WipsList").SList ("refresh", g_AllRadio);
            
            $("#Probeid").MCheckbox("setState",false);
            for(var i=0;i<g_AllRadio.length;i++)
            {
                if(g_AllRadio[i].Probe == "1")
                {
                    $("#Probeid").MCheckbox("setState",true);
                }
            }
            
            probeStatus = $("#Probeid").MCheckbox("getState");
        }
        
        function funcDealAPlist(adata)
        {
            g_ajaxResult["aplist"] = adata.apList;
            if(g_ajaxResult.probe)
            {
                myCallback();
            }
        }
        
        function funcDealProbe(adata)
        {
            g_ajaxResult["probe"] = adata.result;
            if(g_ajaxResult.aplist)
            {
                myCallback();
            }
        }

        g_ajaxResult = {};
        ajaxSendSingle(oProbe,funcDealProbe,onError);
        ajaxSendSingle(oAPlist,funcDealAPlist,onError);
    }
    
    function setProbeData(){
        g_resultSatus = {};
        var aAll = g_AllRadio;
        var sProbe = $("#Probeid").MCheckbox("getState") ? "on" : "off";

        var oProAp = {};
        var aProbeSet = [];
        g_wait = Frame.Msg.pending(getRcText("WIPS_WAIT"));
        for(var i=0; i<aAll.length; i++)
        {
            var ApTemp = aAll[i].ApName + "--" + aAll[i].RadioID;
          
            if(g_configMgr[ApTemp].probeStatus != sProbe)
            {
                var temp= {apName:aAll[i].ApName, radioID:aAll[i].RadioID,
                    probeStatus:sProbe};
                aProbeSet.push(temp);
            }
        }
        
        if(!aProbeSet.length)
        {
            g_resultSatus["probe"] = 0;
        }
        else
        {
            setConfig('probeEnable',aProbeSet,func_probe,func_error);
        }
    
    }
    
    function ProbeonCancel(){
        $("#Probeid").MCheckbox("setState",probeStatus);
        $("#ProbeBtn .form-actions").hide();
        //Frame.Msg.info("已取消");
        Frame.Msg.info(getRcText("CANCEL"));
    }
    
    function initForm()
    {
        $("#DrsidForm").form("init","edit",{"btn_apply":setDrsdata,"btn_cancel":DrsonCancel});
        $("#DrsidForm").change(function(){
            $("#DrsBtn .form-actions").show();
            $("#DrsidForm .form-actions").get(0).style.display = 'none'
        });
        
        $("#ProbeForm").form("init","edit",{"btn_apply":setProbeData,"btn_cancel":ProbeonCancel});
        $("#ProbeForm").change(function(){
            $("#ProbeBtn .form-actions").show();
        });
        
        $(".btn").addClass("hide");
    }
    
    function initData(jScope)
    {
        getProbedata();
        
        getDrsdata();
    }
    
    var onError = function()
    {
        //Frame.Msg.info("数据请求失败！","error");
        Frame.Msg.info(getRcText("FAILD"),"error");
    }

    // function onOpenDlg(aRowData)
    // {
    //     g_RowData = aRowData;
    //     Utils.Base.openDlg(null, {}, {scope:$("#WipsSetDlg"),className:"modal-super"});
    //     $("#WipsSetDlg .modal-footer a.btn-apply").removeClass("disabled");
    // }

    // function submitForm()
    // {
    //     onWipsSubmit();

    // }

    function initGrid()
    {
        $("#Probeid").on("click", function(e){
            if($(".form-group .warn-style:visible").length){
                $(".form-group .warn-style").addClass("hide");
            }
        });
    }
    
    function ajaxSendSingle(aData, onSuccess, onError)
    {
        var successFun = 0;

        if(typeof(onSuccess) == "function")
        {
            successFun = onSuccess;
        }
        else if(typeof(onSuccess) ==  "object")
        {
            successFun = function(adata){
                setConfig(onSuccess.strMethod, onSuccess.setParams, onSuccess.succssFunc, onSuccess.errorFunc);
            }
        }
        var ajaxMsg = {
            url:aData.url,
            dataType: "json",
            type:aData.Type,
            data:aData.data,
            success: successFun,
            error:onError
        };
        Utils.Request.sendRequest(ajaxMsg);


    }

    function _init ()
    {
        oProbe = {
            url:strPath+'/confmgr',
            Type:"post",
            data:{
                cloudModule:"PROBE",
                deviceModule:'PROBE',
                configType:1,
                cfgTimeout: 120,
                devSN:FrameInfo.ACSN,
                method:'probeGet',
                param:{
                    devSN:FrameInfo.ACSN,
                    nasId: FrameInfo.Nasid,
                },
            }
        };
        oAPlist = {
            url:MyConfig.path+'/apmonitor/web/aplist',
            Type:"get",
            data:{
                devSN:FrameInfo.ACSN,
            }
        };
        g_sShopName = Utils.Device.deviceInfo.shop_name;
        initForm();
        initGrid();
        initData();
        initFenJiFenQuan();
        initFailDevGrid();
        failConform();
        closeMadle();
        closeX();
    }
    function initFenJiFenQuan()
    {
        //1 获取到数组
        var arrayShuZu= Frame.Permission.getCurPermission();
        //2 将数组作简洁处理
        var arrayShuZuNew=[];
        $.each(arrayShuZu,function(i,item){
            var itemNew=item.split('_')[1];
            arrayShuZuNew.push(itemNew);
        });
        //3 作具体的“显示、隐藏”处理
        if($.inArray("WRITE",arrayShuZuNew) ==-1){
            //隐藏“执行”的功能
            //执行
            $(".hidemodify").css('display','none');
            $(".forbid").attr('disabled','true');
            // $(".singleSelect").attr('disabled','true');
        }
        //if($.inArray("EXEC",arrayShuZuNew) ==-1){
        //    //隐藏“执行”的功能
        //    //执行
        //    $(".hidemodify").css('display','none');
        //    $(".forbid").attr('disabled','true');
        //    // $(".singleSelect").attr('disabled','true');
        //}
    }
    function _resize(jParent)
    {
    }

    function _destroy()
    {
		onError = function(){};
        g_AllRadio = null;
        Utils.Request.clearMoudleAjax(MODULE_NAME);

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form"],
        "utils": ["Request","Base","Device"],

    });

}) (jQuery);
