;(function ($)
{
    var MODULE_NAME = "hq_branchesinfor.view_allclient";

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("view_client_rc", sRcId);
    }

    function initForm(){

        $("#guanbi").on("click", function(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }
    
    function refreshClientList(oData)
    {
        console.log(oData);
        var aShowData = [];
        var aClientData = oData.clientList.clientInfo;
        for (var i = 0; i < aClientData.length; i++)
        {
            aShowData.push({
                "clientMAC":aClientData[i].clientMAC,
                "clientMode":aClientData[i].clientMode,
                "clientVendor":aClientData[i].clientVendor,
                "clientName":aClientData[i].clientName
            })
        }

        $("#popList").SList ("refresh", {data:aShowData, total:oData.clientList.count_total});
    }

                // {name: "clientMAC", datatype: "String"},
                // {name: "clientMode", datatype: "String"},
                // {name: "clientVendor", datatype: "String"},
                // {name: "clientName", datatype: "String"},  

    function initGrid(sBrName){
        var optPop = {
            colNames: getRcText ("POP_HEADER"),
            pageSize : 10,
            showHeader: true,
            asyncPaging:true, 
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){
                var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
                var valueOflimitnum=pageSize;

                var guoLvTiaoJian={};
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
                    url:MyConfig.path+"/stamonitor/getclientverbose_page?devSN="+FrameInfo.ACSN+"&branch="+sBrName+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshClientList,
                    onFailed:function()
                    {
                        console.log("Get client list by branch failed.");
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
                    url:MyConfig.path+"/stamonitor/getclientverbose_page?devSN="+FrameInfo.ACSN+"&branch="+sBrName+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshClientList,
                    onFailed:function()
                    {
                        console.log("Get client list by branch failed.");
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
                    url:MyConfig.path+"/stamonitor/getclientverbose_page?devSN="+FrameInfo.ACSN+"&branch="+sBrName+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshClientList,
                    onFailed:function()
                    {
                        console.log("Get client list by branch failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },             

            colModel: [
                {name: "clientMAC", datatype: "String"},
                {name: "clientMode", datatype: "String"},
                {name: "clientVendor", datatype: "String"},
                {name: "clientName", datatype: "String"},    
            ]
        };

        $("#popList").SList ("head", optPop);
        $("#popList").SList("resize");       
    }

    function initData(sBrName){
        //@c need interface
        //$("#popList").SList ("refresh", [{"clientMAC":"110-110-110-110", "radioType":"11an", "client_f":"H3C", "client_type":"PC"}]);
        //dangqianyeshujuyoujitiao000000000000
        var valueOfskipnum=0;
        var valueOflimitnum=10;                

        //requestBody,如下
        var guoLvTiaoJian={"findoption":{},"sortoption":{}};

        //发送请求
        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/stamonitor/getclientverbose_page?devSN="+FrameInfo.ACSN+"&branch="+sBrName+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(guoLvTiaoJian),
            onSuccess:refreshClientList,
            onFailed:function()
            {
                console.log("Get client list by branch failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
    }

    function _init (oPara)
    {
        initForm();
        initGrid(oPara.name);
        initData(oPara.name)
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