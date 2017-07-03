;(function ($) {
    var MODULE_NAME = "hq_branchesinfor.branchesinfor";
    var g_allInfor;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("summary_rc", sRcName).split(",");
    }

    function showClient(row, cell, value, columnDef, oRowData,sType)
    {
        var nIndex = cell;

        if(sType == "text"||value=="0")
        {
            return value;
        }

        return '<a class="link" href="" brname='+oRowData.BranchName+' index="'+nIndex+'" style="color: #008aea;">'+ value +'</a>';
    }

    function sendReq2getBranchesInfo(sType, sUrl, oData, pfSuccess, pfFailed)
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

    function getTotalData()
    {
        //@c need interface
        var sBrTotalUrl = MyConfig.path+"/apmonitor/getBranchCount?devSN="+FrameInfo.ACSN;       
        sendReq2getBranchesInfo("Get", sBrTotalUrl, {}, function(data){$('#br_total').html(data.branchCount);}, function(){console.log("getBranchCount failed")});
        
        var sLACTotalUrl = MyConfig.path+"/apmonitor/getLocalACBranchCount?devSN="+FrameInfo.ACSN;
        sendReq2getBranchesInfo("Get", sLACTotalUrl, {}, function(data){$('#local_total').html(data.count);}, function(){console.log("getLocalACCount failed")});
        
        var sLACTotalUrl = MyConfig.path+"/apmonitor/getLocalManageBranchCount?devSN="+FrameInfo.ACSN;
        sendReq2getBranchesInfo("Get", sLACTotalUrl, {}, function(data){$('#manage_total').html(data.localManageCnt);}, function(){console.log("getlocalManageCnt failed")});
    }

    function GetData2refreshBrList(aData)
    {
        var aShowData = [];

        for (var i = 0; i < aData.branchList.length; i++)
        {
            var oDataInfo = aData.branchList[i];
            aShowData.push({
                "BranchName":oDataInfo.branchName,
                "LocalAC":oDataInfo.localACCount,
                "ApGroup":oDataInfo.apGroupCount,
                "APs":oDataInfo.apCount,
                "Clients":oDataInfo.clientCount
            });
        }
         $('#byApList').SList("refresh", aShowData);
    }

    function getBranchesInfo()
    {
        //@c need interface
        //var tempData = [{"BranchName":"br1","LocalAC":1,"ApGroup":7,"APs":30,"Clients":95},{"BranchName":"br2","LocalAC":0,"ApGroup":11,"APs":46,"Clients":177}];
        //$('#byApList').SList("refresh", tempData);
         var sBrInfoUrl = MyConfig.path+"/apmonitor/getBranchList?devSN="+FrameInfo.ACSN;       
         sendReq2getBranchesInfo("Get", sBrInfoUrl, {}, GetData2refreshBrList, function(){console.log("getBranchInfo failed")});
    }

    function initData()
    {
        getTotalData();
        getBranchesInfo();
    } 

    function initForm()
    {
        $("#byApList").on('click','a',function(){
            var manyPages=["","hq_branchesinfor.view_ac","hq_branchesinfor.view_apgroup","hq_branchesinfor.view_aps","hq_branchesinfor.view_allclient"];
            if($(this).html() != 0)
            {
                Utils.Base.openDlg(manyPages[$(this).attr("index")],{"type":1, "name":$(this).attr("brname")},{scope:$("#maoxian"), className:"modal-super dashboard"});
            }
            return false;
        });
    }

    function drawBrList()
    {
        var optAp = {
            colNames: getRcText ("AP_HEADER"),
            pageSize : 5,
            showHeader: true,
            // showOperation:true,
            //asyncPaging:true,
            colModel: [
                {name: "BranchName", datatype: "String"},
                {name: "LocalAC", datatype: "String",formatter:showClient},
                {name: "ApGroup", datatype: "String",formatter:showClient},
                {name: "APs", datatype: "String",formatter:showClient},
                {name: "Clients", datatype: "String",formatter:showClient}
            ]

        };
        $("#byApList").SList ("head", optAp);
    }

    function initGrid()
    {
        drawBrList();
    }

    function showDetail(aRowData){
        //显示弹出框
        Utils.Base.openDlg(null, {}, {scope:$("#flowdetailDlg"),className:"modal-super"}); 
    }

    function _init()
    {
        initGrid();
        initForm();
        initData();
    };

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);        
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList","Echart","Form"],
        "utils":["Request","Base"]
    });
})( jQuery );

