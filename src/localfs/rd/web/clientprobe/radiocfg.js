;(function ($) {
    var MODULE_BASE = "clientprobe"
    var MODULE_NAME = MODULE_BASE+".radiocfg";
   /* var NC, MODULE_NC = MODULE_BASE+".NC";*/
    var g_jMList = $("#Probe_Editlist");

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("Probe_rc", sRcName);
    }


    function onEnableApCfg(aRowData)
    {
        var aData = aRowData;
        //var oRadioConfig = Utils.Request.getTableInstance(NC.ProbeRadioConfigures);
        //for (var i = 0; i < aData.length; i++)
        //{
        //    oRadioConfig.addRows({ApName:aData[i].ApName,RadioId:((aData[i].RadioId.length > 1)?aData[i].RadioId.slice(-2,-1):aData[i].RadioId),State:"enable"});
        //}
        //
        //Utils.Request.set("merge",[oRadioConfig], {onSuccess:initData, scope:g_jMList});
    }

    function onDisableApCfg(aRowData)
    {
        var aData = aRowData;
        //var oRadioConfig = Utils.Request.getTableInstance(NC.ProbeRadioConfigures);
        //for (var i = 0; i < aData.length; i++)
        //{
        //    oRadioConfig.addRows({ApName:aData[i].ApName,RadioId:((aData[i].RadioId.length > 1)?aData[i].RadioId.slice(-2,-1):aData[i].RadioId),State:"disable"});
        //}
        //
        //Utils.Request.set("merge",[oRadioConfig], {onSuccess:initData, scope:g_jMList});
    }
    
    function initGrid()
    {
        var opt = {
            multiSelect: true,
            colNames: getRcText("LIST_HEADER"),
            colModel:[
                {name:"ApName", datatype:"String",editor:false},
                {name:"RadioId", datatype:"String",editor:false},
                {name:"State", datatype:"String"}
            ],
            buttons:[
                {name: "add", enable: false},
                {name: "delete", enable: false},
                {name: "edit", enable: false},
                {name:"Enable",value:getRcText ("ENABLE"),enable:">0",mode:Frame.Button.Mode.ENABLE1,action:onEnableApCfg},
                {name:"Disable", value:getRcText ("DISABLE"), enable:">0", mode:Frame.Button.Mode.DISABLE1, action:onDisableApCfg}
            ]
        };
    
        $("#Probe_Editlist").mlist("head", opt);
    }
   /* function onAjaxErr()
    {
        var sProtocal = window.location.protocol.replace(":", "").toUpperCase();
        var sMsg = PageText[PageText.curLang]["net_err"].replace("%s", sProtocal);
        alert(sMsg);
    }
    function getDynUrl(sUrl)
    {
        return  "../../wnm/" + sUrl;
    }*/

    function initData()
    {
        /*var strChoice = $(this).attr("id");
        var status=getRcText ("STATUS").split(",");
        var data=JSON.parse(getRcText ("DATA"));
        for(var i= 0;i<data.oApCfg.length;i++){
            data.oApCfg[i].State=status[data.oApCfg[i].State];
        }

        $("#Probe_Editlist").mlist("refresh", data.oApCfg);*/

           $.ajax({
            url:getDynUrl("radiocfg.json"),
            dataType: "json",
            type:"get",
            success: function (data)
            {
                var status=getRcText ("STATUS").split(",");

                for(var i= 0;i<data.oApCfg.length;i++){
                    data.oApCfg[i].State=status[data.oApCfg[i].State];
                }

                $("#Probe_Editlist").mlist("refresh", data.oApCfg);
            },
            error: onAjaxErr
        });

/*
        function myCallback(oInfos)
        {
            var aProbeRadioCfg = Utils.Request.getTableRows(NC.ProbeRadioConfigures, oInfos) || [];
            var aRadioOfRunAP = Utils.Request.getTableRows(NC.RadioOfRunAP, oInfos) || [];
            var oApCfg = [];
            $.each(aRadioOfRunAP,function(index, oAp){
                var aAP = $.grep(aProbeRadioCfg, function(oCfg, index){
                    return oCfg.ApName == oAp.ApName && oCfg.RadioId == oAp.RadioID;
                });
                if(aAP.length)
                {
                    oApCfg.push({"ApName":oAp.ApName, "RadioId":Utils.AP.radioDisplay(oAp.Mode, oAp.RadioID), "State":aAP[0].State=="enable"? getRcText ("ENABLE") : getRcText ("DISABLE")});
                }
                else
                {
                     oApCfg.push({"ApName":oAp.ApName, "RadioId":Utils.AP.radioDisplay(oAp.Mode, oAp.RadioID), "State":getRcText ("DISABLE")});   
                }

            });
           /!* $.each(aProbeRadioCfg, function(index, oCfg){
                oCfg.State = oCfg.State=="enable"? getRcText ("ENABLE") : getRcText ("DISABLE");
                for(var i=0; i<aRadioOfRunAP.length; i++)
                {
                    if (aRadioOfRunAP[i].ApName==oCfg.ApName && aRadioOfRunAP[i].RadioID==oCfg.RadioId) 
                    {
                        oCfg.RadioId = Utils.AP.radioDisplay(aRadioOfRunAP[i].Mode, oCfg.RadioId);
                        break;
                    }
                }
            });*!/
            $("#Probe_Editlist").mlist("refresh", oApCfg);

        }

        var oProbeRadioCfg = Utils.Request.getTableInstance(NC.ProbeRadioConfigures); 
        var oRadioOfRunAP = Utils.Request.getTableInstance(NC.RadioOfRunAP); 
        Utils.Request.getAll([oProbeRadioCfg, oRadioOfRunAP], myCallback);*/
    }

    function _init()
    {
      //  NC = Utils.Pages[MODULE_NC].NC;
        initGrid();
        initData();
        $(".mlist .mlist-status-bar:last-child").css({"margin-top":"25px"});
    }

    function _destroy()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["Mlist","Form"], 
        "utils":["Base"]
       // "subModules":[MODULE_NC]
    });
})( jQuery );

