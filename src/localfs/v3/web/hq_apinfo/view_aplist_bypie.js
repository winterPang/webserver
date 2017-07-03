;(function ($)
{
    var MODULE_NAME = "hq_apinfo.view_aplist_bypie";
    var quanJuAjaxUrl="000";

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("view_ap_rc", sRcId);
    }




    function initForm(){

        $("#guanbi").on("click", function(){
            //关闭dialog弹框,返回至主页面
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#ap_diag")));
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
                {name: "macAddr", datatype: "String"},
                {name: "ipv4Addr", datatype: "String"},
                // {name: "clientName", datatype: "String"},
                {name: "ipv6Addr", datatype: "String",formatter:jiaGongclientVendor},
                {name: "apName", datatype: "String"},
                {name: "apType", datatype: "String"}
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

    // AJAX的url确定
    function initAjaxUrl(whichurl, canshuValueSend, branchReqValueSend){
      
            if(whichurl=="clientPie"){
                var url=MyConfig.path+"/apmonitor/getapstaticbyclientnumforaplist?devSN="+FrameInfo.ACSN+branchReqValueSend;
                
                var clientNumLeftValue=0;
                var clientNumRightValue=0;
                
                //看看是哪一种特定的终端数范围
                if(canshuValueSend==0){
                    clientNumLeftValue=0;
                    clientNumRightValue=0;
                }else if(canshuValueSend==1){
                    clientNumLeftValue=1;
                    clientNumRightValue=10;
                }else if(canshuValueSend==2){
                    clientNumLeftValue=11;
                    clientNumRightValue=20;
                }else if(canshuValueSend==3){
                    clientNumLeftValue=21;
                    clientNumRightValue=40;
                }else if(canshuValueSend==4){
                    clientNumLeftValue=41;
                    clientNumRightValue=60;
                }else if(canshuValueSend==5){
                    clientNumLeftValue=61;
                    clientNumRightValue=80;
                }else if(canshuValueSend==6){
                    clientNumLeftValue=81;
                    clientNumRightValue=100;
                }else if(canshuValueSend==7){
                    clientNumLeftValue=100;
                    clientNumRightValue=-1;
                } 

                var requestData ="&clientNumLeft="+clientNumLeftValue+"&clientNumRight="+clientNumRightValue;                
                
                url=url+requestData;
            }else if(whichurl=="methodPie"){
                var url=MyConfig.path+"/apmonitor/getApCountByMethodForApList?devSN="+FrameInfo.ACSN+branchReqValueSend;

                var CreateMethodValue=""+parseInt(canshuValueSend+1)+"";
                var requestData = "&CreateMethod="+CreateMethodValue;  
                
                url=url+requestData;
            }else{
                var url='tryCatch';
                console.log('catch......');
            }

            return url;
    }

    // AJAX的requestOther确定，页面最初始
    function initAjaxRequestOtherFirst(){
        //dangqianyeshujuyoujitiao000000000000
        var skipnum=0;
        var pagesize=10;
        var shaiXuan={"findoption":{},"sortoption":{}};
        
        var whatList=$("#popList");
        initDLDataFunction(skipnum,pagesize,shaiXuan,whatList);
    }

    // AJAX请求
    function initDLDataFunction(skipWhatData,meiYeShuJu,guoLvData,naGeList){

        //准备请求参数urlPara
        var url=quanJuAjaxUrl;

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
                $("#popList").SList("refresh",{data:data.apList,total:data.totalCount});               
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
            // type:"GET",

            url:url,
            // url:"/v3/stamonitor/getclientlist_byssidandmode?devSN=210235A1JNB161000011&ssid=portal&mode=mode24G",
            
            contentType:"application/json",
            dataType:"json",

            data:JSON.stringify(requestDataPost),

            onSuccess:buzhidaoshinageOK,
            onFailed:buzhidaoshinageFail
        };

        Utils.Request.sendRequest(buzhidaoshinage);              
    }







    function _init (oPara)
    {
        initForm();
        initGrid();

        quanJuAjaxUrl=initAjaxUrl(oPara.whichurl,oPara.canshuValueSend,oPara.branchReqValueSend);

        initAjaxRequestOtherFirst();
        
    }

    function _destroy ()
    {   
        console.log("*******商业连锁总部//AP信息//by_Pie_弹框*******GO OUT>>>>");
        Utils.Request.clearMoudleAjax(MODULE_NAME); 

        quanJuAjaxUrl="";      
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form","SList"],
        "utils": ["Request", "Base"]
    });
}) (jQuery);