;(function ($)
{
    var MODULE_NAME = "h_stamgrclients.view_client";
    var quanJuBianLiangWhatType="000";

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("view_client_rc", sRcId);
    }




    function initForm(){

        $("#guanbi").on("click", function(){
            //    //停止ajax请求                 
             //    var xhr = $.ajax({
             //        type:"GET",
             //        url:xhrMine,
             //        contentType:"application/json",
             //        dataType:"json"
             //    });
             //    xhr.abort();

            //关闭dialog弹框,返回至主页面
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#client_diag")));
        });
    }


    function jiaGongclientVendor(row, cell, value, columnDef, oRowData,sType){
         if(value==""){
            return "未知";
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

                var whatList=$("#popList");
                initDLDataFunction(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },  
            onSearch:function(oFilter,oSorter){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var whatList=$("#popList");
                
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
                initDLDataFunction(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            onSort:function(sName,isDesc){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;                
                var whatList=$("#popList");

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
                initDLDataFunction(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },             

            colModel: [
                {name: "clientMAC", datatype: "String"},
                {name: "clientIP", datatype: "String"},
                // {name: "clientName", datatype: "String"},
                {name: "clientVendor", datatype: "String",formatter:jiaGongclientVendor},
                {name: "ApName", datatype: "String"},
                {name: "clientSSID", datatype: "String"}
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


    function initDLDataFunctionFirst(){
        //dangqianyeshujuyoujitiao000000000000
        var skipnum=0;
        var pagesize=10;
        var shaiXuan={"findoption":{},"sortoption":{}};
        
        var whatList=$("#popList");
        initDLDataFunction(skipnum,pagesize,shaiXuan,whatList);
    }


    function initDLDataFunction(skipWhatData,meiYeShuJu,guoLvData,naGeList){

        //准备请求参数urlPara
        var url=quanJuBianLiangWhatType;

        var valueOfskipnum=skipWhatData;
        var valueOflimitnum=meiYeShuJu;           
        var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;
        
        url=url+requestData; 

        //准备请求参数requestBody
        var requestDataPost={};
        $.extend(requestDataPost,guoLvData); 

        function buzhidaoshinageOK(data){
            // if(data.errorcode == 0)
            if(!data.errcode)
            {                              
                $("#popList").SList("refresh",{data:data.clientList,total:data.count_total});               
            }
            else{   
                console.log('请求失败');                   
            }
        }

        function buzhidaoshinageFail(err){
            console.log("ajax request fail:"+err);
        }
        //开始发送ajax请求
        var buzhidaoshinage = {
            type:"POST",
            url:url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(requestDataPost),
            onSuccess:buzhidaoshinageOK,
            onFailed:buzhidaoshinageFail
        };

        Utils.Request.sendRequest(buzhidaoshinage);              
    }

    function initData(aType, sName, type){

            if(type=="ap"){
                var url=MyConfig.path+"/stamonitor/getclientstatisticbyap_detail?devSN="+FrameInfo.ACSN;

                var valueOfapName=""+sName+"";
                var valueOfbandType=""+aType+"";
                var requestData = "&apName="+valueOfapName+"&bandType="+valueOfbandType;  
                
                url=url+requestData; 
                             
            }else if(type=="ssid"){
                var url=MyConfig.path+"/stamonitor/getclientstatisticbyssid_detail?devSN="+FrameInfo.ACSN;
                
                var valueOfclientSSID=""+sName+"";
                var valueOfbandType=""+aType+"";
                var requestData ="&clientSSID="+valueOfclientSSID+"&bandType="+valueOfbandType;                
                
                url=url+requestData; 

            }else if(type=="80211wirelessMode"){
                var url=MyConfig.path+"/stamonitor/getclientstatisticbymode_detail?devSN="+FrameInfo.ACSN;
                
                var valueOfclientMode=""+aType+"";
                var requestData = "&clientMode="+valueOfclientMode;  
                
                url=url+requestData;

            }else if(type=="MobileCompany"){
                var url=MyConfig.path+"/stamonitor/getclientstatisticbybyod_detail?devSN="+FrameInfo.ACSN;
                
                var valueOfclientVendor=""+aType+"";                
                if(valueOfclientVendor=="未知") {
                    valueOfclientVendor='';
                } 
                var requestData = "&clientVendor="+valueOfclientVendor;
                
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

        quanJuBianLiangWhatType=initData(oPara.a,oPara.b,oPara.c);

        initDLDataFunctionFirst();
        
    }

    function _destroy ()
    {   
        console.log("destory*******无线终端弹框*******");
        Utils.Request.clearMoudleAjax(MODULE_NAME); 

        quanJuBianLiangWhatType="";      
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form","SList"],
        "utils": ["Request", "Base"]
    });
}) (jQuery);