;(function ($)
{
    var MODULE_NAME = "hq_branchesinfor.view_apgroup";

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("view_client_rc", sRcId);
    }




    function initForm(){

        $("#guanbi").on("click", function(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    
    function refreshApGrpList(oData)
    {
        var aShowData = [];
        for (var i = 0; i < oData.apGroupInfoList.length; i++)
        {
            aShowData.push({
                "apGroupName":oData.apGroupInfoList[i].apGroupName,
                "description":oData.apGroupInfoList[i].description,
                "onlineApCnt":oData.apGroupInfoList[i].onlineApCnt
            })
        }

        $("#popList").SList ("refresh", {data:aShowData, total:oData.totalCount});
    }

// {
//     "totalCount":"Number,AP组总数",
//     "leftCount":"Number,剩余数量",
//     "apGroupInfoList":[
//         {
//             "apGroupName":"String,AP组名",
//             "description":"String,AP组描述",
//             "onlineApCnt":"Number,在线AP数量"
//         }
//     ]
// }
                // {name: "ApGroupName", datatype: "String"},
                // {name: "Decrible", datatype: "String"},
                // {name: "OnlineApCount", datatype: "String"}

    function initGrid(sBrName){
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
                    url:MyConfig.path+"/apmonitor/getApGroupInfoByBranch?devSN="+FrameInfo.ACSN+"&branchName="+sBrName+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApGrpList,
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
                    url:MyConfig.path+"/apmonitor/getApGroupInfoByBranch?devSN="+FrameInfo.ACSN+"&branchName="+sBrName+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApGrpList,
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
                    url:MyConfig.path+"/apmonitor/getApGroupInfoByBranch?devSN="+FrameInfo.ACSN+"&branchName="+sBrName+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApGrpList,
                    onFailed:function()
                    {
                        console.log("Get ApGrpList by branch failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },             

            colModel: [
                {name: "apGroupName", datatype: "String"},
                {name: "description", datatype: "String"},
                {name: "onlineApCnt", datatype: "String"}
                // {name: "signalStrength", datatype: "Integer",formatter:jiaGong0},
                
                // {name: "clientTxRate", datatype:"Integer",formatter:jiaGong0},
                // {name: "clientRxRate", datatype: "Integer",formatter:jiaGong0},
                // {name: "onlineTime", datatype: "String",formatter:jiaGongonlineTime},
                // {name: "clientRadioMode", datatype: "String",formatter:jiaGongclientRadioMode},
                // {name: "clientMode", datatype: "String"},
                // {name: "clientChannel", datatype: "Integer",formatter:jiaGong0},
                // {name: "NegoMaxRate", datatype: "Double"}
                
            ]
        };
        $("#popList").SList ("head", optPop);
        $("#popList").SList("resize");        
    }

    function initData(sName){
        //@c need interface
        //$("#popList").SList ("refresh", [{"ApGroupName":"apgroup1", "Decrible":"Decrible1", "OnlineApCount":"33"}]);
        var valueOfskipnum=0;
        var valueOflimitnum=10;                

        //requestBody,如下
        var guoLvTiaoJian={"findoption":{},"sortoption":{}};

        //发送请求
        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/apmonitor/getApGroupInfoByBranch?devSN="+FrameInfo.ACSN+"&branchName="+sName+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(guoLvTiaoJian),
            onSuccess:refreshApGrpList,
            onFailed:function()
            {
                console.log("Get ApGrpList by branch failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
    }


    function _init (oPara)
    {
        initForm();
        initGrid(oPara.name);
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