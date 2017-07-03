(function ($)
{
    var MODULE_BASE = "city_confmgr"
    var MODULE_NAME = MODULE_BASE+".confmgr";
    var g_AllRadio, g_WipsType,g_RowData;
    var oWIPS = 0;
    var oProbe = 0;
    var oNatDetect = 0;
    var oAPlist = 0;
    var g_ajaxResult = {};
    var g_configMgr = {};
    var g_apList = {};
    var g_resultSatus = {};
    var g_wait = 0;
    var strPath = MyConfig.path + '/ant';


    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("ws_ssid_rc", sRcName);
    }

    function onSuccess (argument) {
        Utils.Pages.closeWindow(Utils.Pages.getWindow($("#WipsSetForm")));
        initData();
    }
    function setConfig(strMethod,setParams,succssFunc,errorFunc)
    {
        var options = {
            url:strPath+'/confmgr',
            Type:"post",
            data:{
                cloudModule:"WIPS",
                deviceModule:'WIPS',
                configType:0,
                devSN:FrameInfo.ACSN,
                method:strMethod,
                param:setParams,
            }
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

    function func_success(adata)
    {
        judgeResult(adata, "wips");
        reInitdata();
    }
    function func_natdetect(adata)
    {
        judgeResult(adata, "natdetect");
        reInitdata();
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
        if( g_resultSatus.hasOwnProperty("wips") &&
            g_resultSatus.hasOwnProperty("natdetect")&&
            g_resultSatus.hasOwnProperty("probe"))
        {
            onSuccess();
            initData();
            g_wait.close();
            showMsg();
        }
    }
    function showMsg()
    {
        if((g_resultSatus.wips == 0) && (g_resultSatus.natdetect == 0))
        {
            Frame.Msg.info("配置成功！");
            return;
        }
        if((g_resultSatus.wips == 1) || (g_resultSatus.natdetect == 1))
        {
            Frame.Msg.error("主连接失败！");
            return;

        }
        if((g_resultSatus.wips == 2) || (g_resultSatus.natdetect == 2))
        {
            Frame.Msg.error("服务器端失败！");
            return;
        }
        if((g_resultSatus.wips == 3) || (g_resultSatus.natdetect == 3))
        {
            Frame.Msg.error("配置失败！");
            return;
        }
        g_resultSatus = {};
    }

    function onWipsSubmit()
    {
        g_resultSatus = {};
        var aData = g_RowData, aAll = g_AllRadio;
        var sType = Number($("input[name=WipsType]:checked").attr("value"));
        var sDetet = $("#NatDetect").MCheckbox("getState") ? "on" : "off";
        var sFlood = $("#Flood").MCheckbox("getState") ? "on" : "off";
        var sCtm = $("#CmtPhish").MCheckbox("getState") ? "on" : "off";
        var sPhish = $("#Phish").MCheckbox("getState") ? "on" : "off";
        var sProbe = $("#WT2").MCheckbox("getState") ? "on" : "off";


        var oDecAp = {}, oProAp = {}, oWipsAp = {};
        var aNatDetectSet = [];
        var aWipsSet = [];
        var aProbeSet = [];
        g_wait = Utils.Msg.wait(getRcText("WIPS_WAIT"));
        for(var i=0;i<aData.length;i++)
        {
            var ApTemp = aData[i].ApName + "--" + aData[i].RadioID;
            if(!oDecAp[aData[i].ApName])
            {
                oDecAp[aData[i].ApName] = {apName:aData[i].ApName, natDetectStatus:sDetet};
            }
            //if(!oProAp[ApTemp])
            if(g_configMgr[ApTemp].probeStatus != sProbe)
            {
                var temp= {apName:aData[i].ApName,radioID:aData[i].RadioID,
                    probeStatus:sProbe};
                aProbeSet.push(temp);
            }
            //if(!oWipsAp[ApTemp])
            if((g_configMgr[ApTemp].floodStatus != sFlood) ||
                (g_configMgr[ApTemp].phishStatus != sPhish) ||
                (g_configMgr[ApTemp].ctmPhishStatus != sCtm))
            {
                var temp = {apName:aData[i].ApName,radioID:aData[i].RadioID,
                    floodStatus:sFlood, phishStatus:sPhish, ctmPhishStatus:sCtm};
                aWipsSet.push(temp);
            }

        }
        for(var i in oDecAp)
        {
            aNatDetectSet.push(oDecAp[i]);
        }
        if(!aNatDetectSet.length)
        {
            g_resultSatus["natdetect"] = 0;
        }
        else
        {
            setConfig('apEnableNatDetect',aNatDetectSet,func_natdetect,func_error);
        }
        if(!aProbeSet.length)
        {
            g_resultSatus["probe"] = 0;
        }
        else
        {
            setConfig('probeEnable',aProbeSet,func_probe,func_error);
        }
        if(!aWipsSet.length)
        {
            g_resultSatus["wips"] = 0;
        }
        else
        {
            setConfig('radioConfigure',aWipsSet,func_success,func_error);
        }
    }

    function getRadioName(sId,sMode)
    {
        if(sMode == "2" || sMode == "5" || sMode == "7")
        {
            return "5Ghz("+sId+")";
        }

        return "2.4Ghz("+sId+")";
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

    function makeMap(aData)
    {
        var oMap = {};
        for(var i=0;i<aData.length;i++)
        {
            var sKey = aData[i].ApName + "--" +aData[i].RadioId;
            if(!oMap[sKey])
            {
                oMap[sKey] = aData[i].State == "enable" ? true : false;
            }
        }

        return oMap;
    }

    function initData(jScope)
    {
        function myCallback(oInfos)
        {
            var aWipsCfg = g_ajaxResult["wips"] || [];
            var aNatCfg = g_ajaxResult["natdetect"] || [];
            var aProbeCfg = g_ajaxResult["probe"] || [];
            var aApList = g_ajaxResult["aplist"] || [];
            for(var t = 0; t < aApList.length; t++)
            {
                var aradioList = aApList[t].radioList || [];
                g_apList[aApList[t].apName] = {};

                for(var n = 0; n < aradioList.length; n++)
                {
                    var sTmpName = aApList[t].apName + "--" + aradioList[n].radioId;
                    g_configMgr[sTmpName] = {
                        ApName : aApList[t].apName,
                        RadioID : aradioList[n].radioId,
                        RadioName : aradioList[n].radioMode,
                        RadioStatus:aradioList[n].radioStatus,
                        NatDetect : "0",
                        Wips:"0",
                        Probe : "0",
                        Flood : false,
                        Phish : false,
                        Ctm : false
                    }
                    g_apList[aApList[t].apName]["radio"+n] = {
                        RadioID : aradioList[n].radioId,
                        RadioName : aradioList[n].radioMode,
                        RadioStatus:aradioList[n].radioStatus,
                    };
                }

            }
            for(var i = 0; i < aWipsCfg.length; i++)
            {
                var strTmpName = aWipsCfg[i].apName + "--" + aWipsCfg[i].radioID;
                var oWipsCfg = aWipsCfg[i];
                if(g_configMgr.hasOwnProperty(strTmpName))
                {
                    g_configMgr[strTmpName].Flood = ((oWipsCfg.floodStatus == 'on')?true:false);
                    g_configMgr[strTmpName].Phish = ((oWipsCfg.phishStatus == 'on')?true:false);
                    g_configMgr[strTmpName].Ctm = ((oWipsCfg.ctmPhishStatus == 'on')?true:false);
                    if(g_configMgr[strTmpName].Flood || g_configMgr[strTmpName].Phish || g_configMgr[strTmpName].Ctm)
                    {
                        g_configMgr[strTmpName].Wips = "1";
                    }
                }
            }
            for(var j = 0; j < aNatCfg.length; j++)
            {
                if(g_apList.hasOwnProperty(aNatCfg[j].apName))
                {
                    for(var i in g_apList[aNatCfg[j].apName])
                    {
                        var strTmpName = aNatCfg[j].apName + "--" + g_apList[aNatCfg[j].apName][i].RadioID;
                        g_configMgr.hasOwnProperty(strTmpName) && (g_configMgr[strTmpName].NatDetect = ((aNatCfg[j].natDetectStatus == "on")?"1":"0"));

                    }
                }
            }
            for(var k = 0; k < aProbeCfg.length; k++){
                var strTmpName = aProbeCfg[k].apName + "--" + aProbeCfg[k].radioID;
                var oProbeCfg = aProbeCfg[k];

                g_configMgr[strTmpName] && (g_configMgr[strTmpName].Probe = ((oProbeCfg.probeStatus == 'on')?"1":"0"));

            }
            g_AllRadio = makeAllData();
            $("#WipsList").SList ("refresh", g_AllRadio);
        }
        function funcDealWips(adata)
        {
            g_ajaxResult["wips"] = adata.result;
            if(g_ajaxResult.natdetect && g_ajaxResult.aplist && g_ajaxResult.probe)
            {
                myCallback();
            }
        }
        function funcDealNatDetect(adata)
        {
            g_ajaxResult["natdetect"] = adata.result;
            if(g_ajaxResult.wips && g_ajaxResult.aplist && g_ajaxResult.probe)
            {
                myCallback();
            }
        }
        function funcDealAPlist(adata)
        {
            g_ajaxResult["aplist"] = adata.apList;
            if(g_ajaxResult.natdetect && g_ajaxResult.wips  && g_ajaxResult.probe)
            {
                myCallback();
            }
        }
        function funcDealProbe(adata)
        {
            g_ajaxResult["probe"] = adata.result;
            if(g_ajaxResult.natdetect && g_ajaxResult.wips && g_ajaxResult.aplist)
            {
                myCallback();
            }
        }

        g_ajaxResult = {};
        ajaxSendSingle(oWIPS,funcDealWips,onError);
        ajaxSendSingle(oNatDetect,funcDealNatDetect,onError);
        ajaxSendSingle(oProbe,funcDealProbe,onError);
        ajaxSendSingle(oAPlist,funcDealAPlist,onError);
    }
    var onError = function()
    {
        Frame.Msg.info("数据请求失败！","error");
    }

    function onOpenDlg(aRowData)
    {
        g_RowData = aRowData;
        Utils.Base.openDlg(null, {}, {scope:$("#WipsSetDlg"),className:"modal-super"});
        $("#WipsSetDlg .modal-footer a.btn-apply").removeClass("disabled");
    }

    function formatType(row, cell, value, columnDef, dataContext, type)
    {
        if(dataContext.Wips)
        {
            return '<a class="list-link" radio="'+dataContext.RadioID+'" ap="'+dataContext.ApName+'">'+g_WipsType[Number(dataContext.Wips)]+'</a>';
        }
        else
        {
            return g_WipsType[Number(dataContext.Wips)];
        }
    }

    function subCancel()
    {
        if(!$(".WipsBlock .warn-style.hide").length)
        {
            $(".form-group .warn-style").addClass("hide");
        }
    }

    function submitForm()
    {
        if($("#WT3:checked").length)
        {
            if($(".WipsBlock input:checked").length)
            {
                $(".form-group .warn-style").addClass("hide");
            }
            else
            {
                $(".form-group .warn-style").removeClass("hide");
                return false;
            }
        }
        onWipsSubmit();
        $('.head-check span').removeClass("checked");

        if(!$(".WipsBlock .warn-style.hide").length)
        {
            $(".form-group .warn-style").addClass("hide");
        }

    }

    function initGrid()
    {
        var opt = {
            colNames: getRcText ("LIST_TITLE"),
            showHeader: true,
            multiSelect: true,
            pageSize:10,
            colModel: [
                {name:'ApName', datatype:"String"},
                {name:'ApGroupName', datatype:"String"},
                {name:'RadioName', datatype:"String"},
                {name:'NatDetect', datatype:"Order",data:getRcText("ON_OFF")},
                {name:'WipsType', datatype:"Order",data:getRcText("ON_OFF"),formatter:formatType},
                {name:'Probe', datatype:"Order",data:getRcText("ON_OFF")}
            ],
            buttons:[
                {name:"default", enable:">0",value:getRcText ("EDIT_TITLE"),icon:"slist-add",action:onOpenDlg}
            ]
        };
        $("#WipsList").SList ("head", opt);

        $("#WipsTypeForm").form("init", "edit", {
            "title": getRcText("WIPS_TITLE"),
            "btn_apply":false,
            "btn_cancel":false,
            "btn_close":true
        });

        $("#WipsSetForm").form("init", "edit", {
            "title": getRcText("WIPS_TITLE"),
            "btn_apply":submitForm,
        });

        $("input[name=WipsType]").bind('change',function(){
            if(this.value == 2)
            {
                $(".WipsBlock").fadeIn(200);
            }
            else
            {
                $(".WipsBlock").fadeOut(200);
            }
        });

        $("#WipsList ").on('click','a.list-link', function(){
            var sAP = $(this).attr('ap');
            var sRadio = $(this).attr('radio');
            var aStr = getRcText("ON_OFF").split(",");
            var oInfor = {
                ApName : sAP
            };

            for(var i=0;i<g_AllRadio.length;i++)
            {
                if(g_AllRadio[i].ApName == sAP && g_AllRadio[i].RadioID == sRadio)
                {
                    oInfor.RadioName = g_AllRadio[i].RadioName;
                    oInfor.PhishState = g_AllRadio[i].Phish ? aStr[1] : aStr[0];
                    oInfor.CtmState = g_AllRadio[i].Ctm ? aStr[1] : aStr[0];
                    oInfor.FloodState = g_AllRadio[i].Flood ? aStr[1] : aStr[0];
                }
            }

            Utils.Base.updateHtml($("#WipsTypeForm"),oInfor);

            Utils.Base.openDlg(null, {}, {scope:$("#WipsTypeDlg"),className:"modal-small"});
        });

        $("#WT1,#WT2").on("click", function(e){
            if($(".form-group .warn-style:visible").length){
                $(".form-group .warn-style").addClass("hide");
            }
        });
        $(".WipsBlock").on("click", function(e){
            if($(".WipsBlock input:checked").length)
                $(".form-group .warn-style").addClass("hide");
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
        oWIPS = {
            url:strPath+'/confmgr',
            Type:"post",
            data:{
                cloudModule:"WIPS",
                deviceModule:'WIPS',
                configType:1,
                devSN:FrameInfo.ACSN,
                method:'radioGet',
                param:{
                    devSN:FrameInfo.ACSN,
                },

            }
        };
        oNatDetect = {
            url:strPath+'/confmgr',
            Type:"post",
            data:{
                cloudModule:"WIPS",
                deviceModule:'WIPS',
                configType:1,
                devSN:FrameInfo.ACSN,
                method:'natDetectGet',
                param:{
                    devSN:FrameInfo.ACSN,
                },
            }
        };
        oProbe = {
            url:strPath+'/confmgr',
            Type:"post",
            data:{
                cloudModule:"PROBE",
                deviceModule:'PROBE',
                configType:1,
                devSN:FrameInfo.ACSN,
                method:'probeGet',
                param:{
                    devSN:FrameInfo.ACSN,
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

        g_WipsType = getRcText("ON_OFF").split(",");
        initGrid();
        initData();
    }

    function _resize(jParent)
    {
    }

    function _destroy()
    {
		onError = function(){};
        g_AllRadio = null;
        g_WipsType = null;
        g_RowData = null;
        Utils.Request.clearMoudleAjax(MODULE_NAME);

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form"],
        "utils": ["Request","Base"],

    });

}) (jQuery);
