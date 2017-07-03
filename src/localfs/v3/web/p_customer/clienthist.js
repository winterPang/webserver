;(function($){
    var MODULE_NAME = "p_customer.clienthist";
    var authReqValueReceive="";
    function getRcText(sRcName){
        return Utils.Base.getRcString("user_rc", sRcName);
    }
    function getHistoryInfo(skipWhatData,meiYeShuJu,guoLvData){
        var valueOfskipnum=skipWhatData;
        var valueOflimitnum=meiYeShuJu;
        var requestDataPost={};
        $.extend(requestDataPost,guoLvData);
            function newLXlistlistOK(data){
                if(!data.errcode){
                    var g_allInforbyAp=[];
                    $.each(data.clientList.clientInfo,function(i,item){
                        g_allInforbyAp[i]={};
                        g_allInforbyAp[i].clientMAC=item.clientMAC;
                        g_allInforbyAp[i].clientIP=item.clientIP;
                        g_allInforbyAp[i].upLineTime=item.upLineDate;
                        g_allInforbyAp[i].onlineTime=item.onlineTime;
                    });
                    $("#HistoryList").SList("refresh",{data:g_allInforbyAp,total:data.clientList.count_total});
                }else{
                }
            }
            function newLXlistlistFail(err){
                console.log("ajax request fail:"+err);
            }
            var url=MyConfig.path+"/stamonitor/getclientlistbycondition?devSN=210235A1JNB161000011&reqType=history"+authReqValueReceive;
            var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;
            url=url+requestData;
            var newLXlist = {
                type:"POST",
                url:url,
                contentType:"application/json",
                dataType:"json",
                data:JSON.stringify(requestDataPost),
                onSuccess:newLXlistlistOK,
                onFailed:newLXlistlistFail
            };
            Utils.Request.sendRequest(newLXlist);
    }
    function initData(){
        var skipnum=0;
        var pagesize=10;
        var shaiXuan={"findoption":{},"sortoption":{}};
        getHistoryInfo(skipnum,pagesize,shaiXuan);
    }
    function initGrid (){
        var optonlineuser = {  
            colNames: getRcText("Visitor_LIST_HEADER"),
            showOperation:false,
            pageSize:10,     
            asyncPaging:true,
            multiSelect: true,
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
                getHistoryInfo(valueOfskipnum,valueOflimitnum,guoLvTiaoJian);
            },  
            onSearch:function(oFilter,oSorter){
                var valueOfskipnum=0;
                var valueOflimitnum=10;
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
                getHistoryInfo(valueOfskipnum,valueOflimitnum,guoLvTiaoJian);
            },
            onSort:function(sName,isDesc){
                var valueOfskipnum=0;
                var valueOflimitnum=10;
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
                getHistoryInfo(valueOfskipnum,valueOflimitnum,guoLvTiaoJian);
            },      
            colModel: [   
                {name:"clientMAC", datatype:"String"},
                {name:"clientIP", datatype:"String"},
                {name:"upLineTime", datatype:"String"},
                {name:"onlineTime", datatype:"String"}
            ]
        };
        $("#HistoryList").SList ("head", optonlineuser);
    }
    function _init (){
        initData();
        initGrid();
        $("#hBack").click(function(){
            Utils.Base.redirect({ np: "p_customer.customer"});
        });
    }
    function _destroy(){
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","SingleSelect","Minput","Form"],
        "utils": ["Request", "Base"]
    });
})(jQuery);