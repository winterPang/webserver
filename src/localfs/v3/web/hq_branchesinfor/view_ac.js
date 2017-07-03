;(function ($)
{
    var MODULE_NAME = "hq_branchesinfor.view_ac";
    var quanJuBianLiangWhatType="000";

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("view_client_rc", sRcId);
    }

    function initForm(){

        $("#guanbi").on("click", function(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }

    function initGrid(){
        var optPop = {
            colNames: getRcText ("POP_HEADER"),
            pageSize : 10,
            showHeader: true,         
            colModel: [
                {name: "localACSN", datatype: "String"},
                {name: "localACModel", datatype: "String"},
                {name: "bootVersion", datatype: "String"},
                {name: "softVersion", datatype: "String"}
            ]
        };
        $("#popList").SList ("head", optPop);
        $("#popList").SList("resize");        
    }

    function sendReq2getACInfo(sType, sUrl, oData, pfSuccess, pfFailed)
    {
        //var url=MyConfig.path+"/stamonitor/stationlist_page?devSN="+FrameInfo.ACSN;
        //var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;
        //url=url+requestData;
        var stationlist = {
            type:sType,
            url:sUrl,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(oData),
            onSuccess:pfSuccess,
            onFailed:pfFailed
        };

        Utils.Request.sendRequest(stationlist);
    }

    function refreshACInfoList(aData)
    {
        var aShowData = [];
        var aAcList = aData.localACList;

        for (var i = 0; i < aAcList.length; i++)
        {
            aShowData.push(
                {
                    "localACSN":aAcList[i].localACSN,
                    "localACModel":aAcList[i].localACModel,
                    "bootVersion":aAcList[i].bootVersion,
                    "softVersion":aAcList[i].softVersion
                }
            );
        }

        $("#popList").SList ("refresh", aShowData);
    }

    function initData(sName){
        //@c need interface
        var sACInfoUrl = MyConfig.path+"/apmonitor/getLocalACListByBranch?devSN="+FrameInfo.ACSN+"&branchName="+sName;    
        sendReq2getACInfo("Get", sACInfoUrl, {}, refreshACInfoList, function(){console.log("getACInfo failed")});
        //$("#popList").SList ("refresh", [{"XuLieHao":"SN888", "XingHao":"wx3000", "LeiXing":"type1", "Boot":"1.1.1", "Software":"B64d011"}]);
    }

    function _init (oPara)
    {
        initForm();
        initGrid(); 
        initData(oPara.name);
    }

    function _destroy ()
    {   
        Utils.Request.clearMoudleAjax(MODULE_NAME);     
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form","SList"],
        "utils": ["Request", "Base"]
    });
}) (jQuery);