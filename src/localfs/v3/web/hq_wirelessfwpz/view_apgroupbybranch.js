;(function ($)
{
    var MODULE_NAME = "hq_wirelessfwpz.view_apgroupbybranch";
    var quanJuAjaxUrl="000";

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("view_apgroup_rc", sRcId);
    }




    function initForm(){

        $("#guanbi").on("click", function(){
            //关闭dialog弹框,返回至主页面
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#apgroup_diag")));
        });
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
                {name: "apGroupName", datatype: "String"},
                {name: "description", datatype: "String"},
                {name: "totalApCnt", datatype: "String"},
                {name: "onlineApCnt", datatype: "String"}
                
            ]
        };
        $("#popList").SList ("head", optPop);
        $("#popList").SList("resize");        
    }

    // AJAX的url确定
    function initAjaxUrl(branchValue){
            
        var url=MyConfig.path+"/apmonitor/getApGroupInfoByBranch?devSN="+FrameInfo.ACSN+"&branchName="+branchValue;
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
                $("#popList").SList("refresh",{data:data.apGroupInfoList,total:data.totalCount});               
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

        quanJuAjaxUrl=initAjaxUrl(oPara.branchValue);

        initAjaxRequestOtherFirst();
        
    }

    function _destroy ()
    {   
        console.log("*******商业连锁总部//服务配置//弹框*******GO OUT>>>>");
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