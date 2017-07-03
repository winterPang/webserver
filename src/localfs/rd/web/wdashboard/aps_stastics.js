;(function ($){
    var MODULE_NAME = "WDashboard.aps_stastics"
		g_jMList 	= null,
		NC 			= null,
		MODULE_NC 	= "WDashboard.NC",
		ID_DOM_MLIST= "aps_unhealthy_list";
	
    function getRcText (sRcId){
        return Utils.Base.getRcString ("aps_unhealthy_rc", sRcId);
    }
	
    function onEditAllAPs (aRowData){
        var oSelData = aRowData[0];
        var oUrlPara = {
            type: "edit",
            np: "APs.add_AllAps",
            Name: oSelData["Name"]
        };

        Utils.Base.redirect (oUrlPara);
    }
	
    function onOpenAllAPs(){
        var oUrlPara = {
            type: "add",
            np: "APs.add_AllAps"
        };
        Utils.Base.redirect (oUrlPara);
    }

    function onDelAllAPs(aRowData){
        var oOutRules = Utils.Request.getTableInstance (NC.OutRules);
        var aData = [];
        oOutRules.addRows (aData);
        Utils.Request.set ("remove", [oOutRules], {onSuccess: initData, scope: g_jMList});
        return false;
    }

    function checkRestEnable(aRows){
		return !!aRows.length;
    }

    function onRest (aRows)
    {
        var oAllAPs = Utils.Request.getTableInstance (NC.AllAPs);
        for (var i = 0; i < aRows.length; i ++){
            var oData = {Name: aRows.Name};
            oAllAPs.addRows (oData);
        }
        Utils.Request.set ("merge", oAllAPs, initData);
    }

    function checkAddToGroupEnable(aRows){
		return !!aRows.length;
    }

    function checkAViewInfoEnable (aRows)
    {
        if (aRows.length == 1)
        {
            return true;
        }
        return false;
    }

    function onAddToGroup (aRows)
    {
        var aId = [];
        $.each (aRows, function (nIndex, oAps)
        {
            aId.push (oAps["Name"]);
        });
        var oUrlPara = {
            type: "edit",
            np: "APs.add_APToGroup",
            sId: aId.join (".")
        };
        Utils.Base.redirect (oUrlPara);
    }

    function onViewInfo (aRows)
    {
        var oUrlPara = {
            type: "show-only",
            np: "APs.View_APInfo",
            name: aRows[0]["Name"]
        };
        Utils.Base.redirect (oUrlPara);
    }

    function onClear (aRows)
    {
        var oAutoAPs = Utils.Request.getTableInstance (NC.AutoAPs);
        for (var i = 0; i < aRows.length; i ++)
        {
            var oData = {Name: aRows.Name};
            oAutoAPs.addRows (oData);
        }
        Utils.Request.set ("merge", oAutoAPs, initData);
    }


    function initGrid ()
    {
        var aTitle = getRcText("HEAD_TITLE").split(",");
        var nIndex = Utils.Base.parseUrlPara().nIndex;
        $("#headTitle").text(aTitle[nIndex]);
        var opt = {
            multiSelect: true,
            colNames: getRcText ("LIST_HEADER"),
            colModel: [
                {name: "Name", datatype: "String"},
                {name: "Model", datatype: "Order", data: getRcText ("MODEL").split (",")},
                {name: "Type", datatype: "Order", data: getRcText ("TYPE").split (",")},
                {name: "Status", datatype: "Order", data: getRcText ("STATUS").split (",")},
                {name: "IPAddress", datatype: "String"},
                {name: "SerialId", datatype: "String"},
                {name: "Radios", datatype: "String"},
                {name: "clientNum", datatype: "Integer"},
                {name: "GroupName", datatype: "String"},
                {name: "OnlineTime", datatype: "String"}
            ], buttons: [
                {name: "add", action: onOpenAllAPs},
                {name: "edit", action: onEditAllAPs},
                {name: "delete", action: Utils.Msg.deleteConfirm (onDelAllAPs)} ,
                {name: "clear", value: $.MyLocale.Buttons.CLEAR, mode: Frame.Button.Mode.CLEAR, enable: true, action: onClear},
                {name: "reset", value: getRcText ("BTN_REST"), description: getRcText ("BTN_REST"), mode: Frame.Button.Mode.RESET, enable: checkRestEnable, action: onRest},
                {name: "addAPToGroup", value: getRcText ("BTN_ADD_GROUP"), description: getRcText ("BTN_ADD_GROUP"), mode: Frame.Button.Mode.ADDGROUP, enable: checkAddToGroupEnable, action: onAddToGroup},
                {name: "ViewInfor", value: getRcText ("BIN_VIEW_INFO"), description: getRcText ("BIN_VIEW_INFO"), mode: Frame.Button.Mode.INFO, enable: checkAViewInfoEnable, action: onViewInfo}
            ]
        };
        g_jMList.mlist ("head", opt);
    }


    function initData(){
        function myCallback (oInfo){
            var aAllAPs = Utils.Request.getTableRows (NC.AllAP, oInfo);
            g_jMList.mlist ("refresh", aAllAPs);
        }

        var aReqTable = [];
        var oAllAPs = Utils.Request.getTableInstance (NC.AllAP);
        aReqTable.push (oAllAPs);
        Utils.Request.getAll (aReqTable, myCallback);
    }

    function _init(){
        NC = Utils.Pages[MODULE_NC].NC;
        g_jMList = $ ("#" + ID_DOM_MLIST);
        initGrid ();
        initData ();
    }

    function _destroy(){g_jMList = null;}

    Utils.Pages.regModule(MODULE_NAME, {
        "init"		: _init,
        "destroy"	: _destroy,
        "widgets"	: ["Mlist"],
        "utils"		: ["Request", "Base"],
        "subModules": [MODULE_NC]
    });
}) (jQuery);