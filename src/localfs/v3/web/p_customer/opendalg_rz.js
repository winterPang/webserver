;(function ($)
{
    var MODULE_NAME = "p_customer.opendalg_rz";
    var rightLean="000";
    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("opendalg_rz_rc", sRcId);
    }
    function initForm(){
        $("#closethis").on("click", function(){
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag_rz")));
        });
    }
    function rowClientVendor(row, cell, value, columnDef, oRowData,sType){
        if(value==""){
            return getRcText ("VIEW_TITLE");
        }else{
            return ""+value+"";
        }
    }
    function initGrid(){
        var optPop = {
            colNames: getRcText ("POP_HEADER"),
            pageSize : 10,
            showHeader: true,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){
                var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
                var valueOflimitnum=pageSize;
                var guoLvTiaoJian={};
                var oSorterhaha={};
                $.extend(oSorterhaha,oSorter);
                if(oSorterhaha.isDesc==true){
                    oSorterhaha.isDesc=-1;
                }else if(oSorterhaha.isDesc==false){
                    oSorterhaha.isDesc=1;
                }
                var paiXuObject={};
                paiXuObject[oSorterhaha.name]=oSorterhaha.isDesc;
                var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};
                var whatList=$("#popList");
                initDLDataFunction(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            onSearch:function(oFilter,oSorter){
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var whatList=$("#popList");
                var oSorterhaha={};
                $.extend(oSorterhaha,oSorter);
                if(oSorterhaha.isDesc==true){
                    oSorterhaha.isDesc=-1;
                }else if(oSorterhaha.isDesc==false){
                    oSorterhaha.isDesc=1;
                }
                var paiXuObject={};
                paiXuObject[oSorterhaha.name]=oSorterhaha.isDesc;
                var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};
                initDLDataFunction(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            onSort:function(sName,isDesc){
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var whatList=$("#popList");
                var shunxu=isDesc;
                if(shunxu==true){
                    shunxu=-1;
                }else if(shunxu==false){
                    shunxu=1;
                }else{
                    console.log('here is try catch.');
                }
                var paiXuObject={};
                paiXuObject[sName]=shunxu;
                var guoLvTiaoJian={"findoption":{},"sortoption":paiXuObject};
                initDLDataFunction(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            colModel: [
                {name: "clientMAC", datatype: "String"},
                {name: "clientIP", datatype: "String"},
                {name: "clientVendor", datatype: "String",formatter:rowClientVendor},
                {name: "ApName", datatype: "String"},
                {name: "clientSSID", datatype: "String"}
            ]
        };
        $("#popList").SList ("head", optPop);
        $("#popList").SList("resize");
    }
    function initDLDataFunctionFirst(){
        var skipnum=0;
        var pagesize=10;
        var shaiXuan={"findoption":{},"sortoption":{}};
        var shaiXuan={};
        var whatList=$("#popList");
        initDLDataFunction(skipnum,pagesize,shaiXuan,whatList);
    }
    function initDLDataFunction(skipWhatData,meiYeShuJu,guoLvData,naGeList){
        var url=rightLean;
        var valueOfskipnum=skipWhatData;
        var valueOflimitnum=meiYeShuJu;
        var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;
        url=url+requestData;
        var requestDataPost={};
        $.extend(requestDataPost,guoLvData);
        function insensibleOK(data){
            if(!data.errcode)
            {
                var g_allInforbyAp=[];
                $.each(data.clientList.clientInfo,function(i,item){
                    g_allInforbyAp[i]={};
                    g_allInforbyAp[i].clientMAC=item.clientMAC;
                    g_allInforbyAp[i].clientIP=item.clientIP;
                    g_allInforbyAp[i].clientVendor=item.clientVendor;
                    g_allInforbyAp[i].ApName=item.ApName;
                    g_allInforbyAp[i].clientSSID=item.clientSSID;
                });
                $("#popList").SList("refresh",{data:g_allInforbyAp,total:data.clientList.count_total});
            }
            else{
            }
        }
        function insensibleFail(err){
            console.log("ajax request fail:"+err);
        }
        var insensible = {
            type:"POST",
            url:url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(requestDataPost),
            onSuccess:insensibleOK,
            onFailed:insensibleFail
        };
        Utils.Request.sendRequest(insensible);
    }
    function initData(aType, sName, type){
        if(type=="apgroup"){
            var url=MyConfig.path+"/stamonitor/getclientlist_bygroupandmode?devSN="+FrameInfo.ACSN;
            var valueOfapName=""+sName+"";
            var valueOfbandType="";
            if(aType == "band_5g"){
                valueOfbandType = "mode5G"
            }else if(aType == "band_2_4g"){
                valueOfbandType = "mode24G"
            }
            var requestData = "&group="+valueOfapName+"&mode="+valueOfbandType+"&auth=1";
            url=url+requestData;
        }else if(type=="ssid"){
            var url=MyConfig.path+"/stamonitor/getclientlist_byssidandmode?devSN="+FrameInfo.ACSN;
            var valueOfclientSSID=""+sName+"";
            var valueOfbandType="";
            if(aType == "band_5g"){
                valueOfbandType = "mode5G"
            }else if(aType == "band_2_4g"){
                valueOfbandType = "mode24G"
            }
            var requestData ="&ssid="+valueOfclientSSID+"&mode="+valueOfbandType+"&auth=1";
            url=url+requestData;
        }else if(type=="80211wirelessMode"){
            var url=MyConfig.path+"/stamonitor/getclientlist_bymodeorvendor?devSN="+FrameInfo.ACSN;
            var valueOfclientMode="802."+""+aType+"";
            var requestData = "&mode="+valueOfclientMode+"&auth=1";
            url=url+requestData;
        }else if(type=="MobileCompany"){
            var url=MyConfig.path+"/stamonitor/getclientlist_bymodeorvendor?devSN="+FrameInfo.ACSN;
            var valueOfclientVendor=""+aType+"";
            if(valueOfclientVendor == getRcText ("VIEW_TITLE")) {
                valueOfclientVendor='';
            }
            var requestData = "&vendor="+valueOfclientVendor+"&auth=1";
            url=url+requestData;
        }else{
            var url='tryCatch';
        }
        return url;
    }
    function _init (oPara)
    {
        initForm();
        initGrid();
        rightLean=initData(oPara.a,oPara.b,oPara.c);
        initDLDataFunctionFirst();
    }
    function _destroy ()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
        rightLean="";
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form","SList"],
        "utils": ["Request", "Base"]
    });
}) (jQuery);