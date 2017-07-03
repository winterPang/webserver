;(function ($) {
    var MODULE_NAME = "hq_branchesinfor.localservice";
    var g_allInfor;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("summary_rc", sRcName).split(",");
    }

    function drawLocalACList()
    {
        var opt = {
            showHeader: true,
            multiSelect: false,
            pageSize:4,
            colNames: getRcText("LOCALAC_HEADER"),
            colModel: [
                { name: "ApGroup", datatype: "String"},
                { name: "hq_SSID", datatype: "String"},
                { name: "hq_BSSID", datatype: "String"},
                { name: "hq_localac", datatype: "String"},
                { name: "hq_BR", datatype: "String"},
                { name: "hq_locLog", datatype: "String"},
            ]
        };
        $("#localAC_slist").SList("head", opt);
        $("#localAC_slist").SList("refresh", [{'ApGroup':'HAHAHA', 'hq_SSID':'WAWAWA', 'hq_BSSID':'000-000-000-000', 'hq_localac':'0', 'hq_BR':'0', 'hq_locLog':'0'}]);
    }

    function initGrid()
    {
        drawLocalACList();
    }

    function _init()
    {
        // NC = Utils.Pages[MODULE_NC].NC; 
        initGrid();
        //initData();

    };

    function _destroy()
    {
        console.log("destory*******无线终端首页*******");
        Utils.Request.clearMoudleAjax(MODULE_NAME);        
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList"],
        "utils":["Request","Base"]
    });
})( jQuery );

