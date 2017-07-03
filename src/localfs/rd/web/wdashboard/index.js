(function ($)
{
var MODULE_NAME = "WDashboard.index";

function navTabsChange()
{
    var sTarget = $(this).attr("href");
    var sModule = "WDashboard." + sTarget.substring(1);    
    Utils.Pages.loadModule (sModule, null, $(sTarget));
}

function initForm()
{
    var sId = Utils.Base.parseUrlPara().ID || 3;
    var jPage = $("#detail_page .nav-tabs li a");
    $("#detail_page .nav-tabs li a").on("show", navTabsChange);
    $(jPage[sId]).tab("show");
}

/*function initData ()
{
    function myCallback (oInfo)
    {
        var oAPData = Utils.Request.getTableRows (NC.APSummary, oInfo)[0] || {};
        var aClientStatus = Utils.Request.getTableRows (NC.ClientStatus, oInfo);

        var oAll = {};
        oAll.CountAp = -(-oAPData.RunApNum - oAPData.OfflineApNum - oAPData.UnhealthyApNum);
        oAll.CountSSID = aClientStatus.length;
        oAll.CountClient = 0;
        for(var i=0;i<oAll.CountSSID;i++)
        {
            oAll.CountClient += parseInt(aClientStatus[i].ClientNumber);
        }
        Utils.Base.updateHtml($("#detail_page"),oAll);
    }

    var oAPSummary = Utils.Request.getTableInstance (NC.APSummary);
    var oClientStatus = Utils.Request.getTableInstance (NC.ClientStatus);
    Utils.Request.getAll ([oAPSummary,oClientStatus], myCallback);
}*/

function _init()
{

    initForm();
   // initData();
};

function _destroy()
{
    var aChildMode = [
        'WDashboard.aps_detail',
        'WDashboard.ssid_detail',
        'WDashboard.client_detail',
        'WDashboard.utilization_detail'
    ];
    for(var i=0;i<aChildMode.length;i++)
    {
        Utils.Pages.destroy(aChildMode[i]);
    }
}

Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "widgets": [],
    "utils": []
});
}) (jQuery);
