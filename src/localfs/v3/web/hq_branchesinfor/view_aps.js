;(function ($)
{
    var MODULE_NAME = "hq_branchesinfor.view_aps";
    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("view_client_rc", sRcId);
    }

// {
//     "totalCount":"Number,AP总数",
//     "leftCount":"Number,剩余数量",
//     "apList":[
//         {
//             "apName":"String,AP名",
//             "apSN":"String",
//             "macAddr":"String,MAC地址",
//             "clientCount":"Number,客户端数量"
//         }
//     ]
// }
                // {name: "ApName", datatype: "String", width : 200},
                // {name: "ApSN", datatype: "String", width : 200},
                // {name: "ApMac", datatype: "String", width : 200},
                // {name: "ClientNum", datatype: "String", width : 200}
    function refreshApList(oData)
    {
        var aShowData = [];
        for (var i = 0; i < oData.apList.length; i++)
        {
            aShowData.push({
                "apName":oData.apList[i].apName,
                "apSN":oData.apList[i].apSN,
                "macAddr":oData.apList[i].macAddr,
                "clientCount":oData.apList[i].clientCount
            })
        }

        $("#popList").SList ("refresh", {data:aShowData, total:oData.totalCount});
    }

    function initGrid(oPara){
        var sUrl = null;
        if (oPara.type == 1)
        {
            sUrl = MyConfig.path+"/apmonitor/getApListPageByBranch?devSN="+FrameInfo.ACSN+"&branchName="+oPara.name;
        }
        else
        {
            sUrl = MyConfig.path+"/apmonitor/getApListPageByLocalAC?devSN="+FrameInfo.ACSN+"&localACName="+oPara.name;    
        }
        var optPop = {
            colNames: getRcText ("POP_HEADER"),
            pageSize : 10,
            showHeader: true,
            asyncPaging:true, 
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){
                var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
                var valueOflimitnum=pageSize;

                var oFilterOpt={};
                //升序1、降序-1
                var oSorterhaha={};
                $.extend(oSorterhaha,oSorter);
                if(oSorterhaha.isDesc==true){
                    oSorterhaha.isDesc=-1;
                }else if(oSorterhaha.isDesc==false){
                    oSorterhaha.isDesc=1;
                }      

                //sortoption对象，如下
                var paiXuObject={};
                paiXuObject[oSorterhaha.name]=oSorterhaha.isDesc;          

                //requestBody,如下
                var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};

                var oDataOpt = {
                    type:"POST",
                    url:sUrl+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApList,
                    onFailed:function()
                    {
                        console.log("Get ApGrpList by branch failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },  
            onSearch:function(oFilter,oSorter){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                
                //升序1、降序-1
                var oSorterhaha={};
                $.extend(oSorterhaha,oSorter);
                if(oSorterhaha.isDesc==true){
                    oSorterhaha.isDesc=-1;
                }else if(oSorterhaha.isDesc==false){
                    oSorterhaha.isDesc=1;
                }      

                //sortoption对象，如下
                var paiXuObject={};
                paiXuObject[oSorterhaha.name]=oSorterhaha.isDesc;          

                //requestBody,如下
                var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};                

                //发送请求
                var oDataOpt = {
                    type:"POST",
                    url:sUrl+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApList,
                    onFailed:function()
                    {
                        console.log("Get ApGrpList by branch failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },
            onSort:function(sName,isDesc){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;                

                //升序1、降序-1
                var shunxu=isDesc;
                if(shunxu==true){
                    shunxu=-1;
                }else if(shunxu==false){
                    shunxu=1;
                }else{
                    console.log('here is try catch.');
                }

                //sortoption对象，如下                
                var paiXuObject={};
                paiXuObject[sName]=shunxu;

                //requestBody,如下
                var guoLvTiaoJian={"findoption":{},"sortoption":paiXuObject};

                //发送请求
                var oDataOpt = {
                    type:"POST",
                    url:sUrl+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApList,
                    onFailed:function()
                    {
                        console.log("Get ApGrpList by branch failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },             

             
            colModel: [
                {name: "apName", datatype: "String", width : 200},
                {name: "apSN", datatype: "String", width : 200},
                {name: "macAddr", datatype: "String", width : 200},
                {name: "clientCount", datatype: "String", width : 200}
            ]
        };
        $("#ap_guanbi").on("click", function(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
        $("#popList").SList ("head", optPop);
        $("#popList").SList ("resize");  
           
    }

    function initData(oPara)
    {
        var sUrl = null;
        console.log(oPara.type+" : "+oPara.name);
        if (oPara.type == 1)
        {
            sUrl = MyConfig.path+"/apmonitor/getApListPageByBranch?devSN="+FrameInfo.ACSN+"&branchName="+oPara.name+"&skipnum=0&limitnum=10";
        }
        else
        {
            sUrl = MyConfig.path+"/apmonitor/getApListPageByLocalAC?devSN="+FrameInfo.ACSN+"&localACName="+oPara.name+"&skipnum=0&limitnum=10";
        }
        //@c need interface
        var guoLvTiaoJian={"findoption":{},"sortoption":{}};

        //发送请求
        var oDataOpt = {
            type:"POST",
            url:sUrl,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(guoLvTiaoJian),
            onSuccess:refreshApList,
            onFailed:function()
            {
                console.log("Get ApGrpList by branch failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
        //$("#popList").SList ("refresh", [{"ApName":"APcaca", "ApSN":"SN110", "ApMac":"110-110-110-110", "ClientNum":"29"}]);
    }

    function _init (oPara)
    {
        initGrid(oPara);
        initData(oPara);
        
    }

    function _destroy ()
    {   
        Utils.Request.clearMoudleAjax(MODULE_NAME); 
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList"],
        "utils": ["Request", "Base"]
    });
}) (jQuery);