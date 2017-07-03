/**
 * Created by Administrator on 2016/5/30.
 */
(function($){
    var MODULE_NAME = "hq_customer.clienthist";

    var branchReqValueReceive="";
    var authReqValueReceive="";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("user_rc", sRcName);
    }

    // 筛选条件声明
    function shengMing_sstj(){
        if(branchReqValueReceive==""&&authReqValueReceive==""){
            $("#shengMing_all").hide();

        }else if(branchReqValueReceive!=""&&authReqValueReceive!=""){
            $("#shengMing_all").show();
            $("#shengMing_branchValue").html(branchReqValueReceive.slice(8));

        }else if(branchReqValueReceive!=""&&authReqValueReceive==""){
            $("#shengMing_all").show();
            $("#shengMing_branch").show();
            $("#shengMing_2or1").hide();
            $("#shengMing_portal").hide();
             $("#shengMing_branchValue").html(branchReqValueReceive.slice(8));

        }else if(branchReqValueReceive==""&&authReqValueReceive!=""){
            $("#shengMing_all").show();
            $("#shengMing_branch").hide();
            $("#shengMing_2or1").hide();
            $("#shengMing_portal").show();
                    
        }else{
            console.log('try catch ;');
        }
    }

    // draw列表
    function initUserGrid ()
    {
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

                
                initUserData_Ajax(valueOfskipnum,valueOflimitnum,guoLvTiaoJian);
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
                initUserData_Ajax(valueOfskipnum,valueOflimitnum,guoLvTiaoJian);
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
                initUserData_Ajax(valueOfskipnum,valueOflimitnum,guoLvTiaoJian);
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

    // 初始情况下，准备请求参数
    function initUserData(){
        var skipnum=0;
        var pagesize=10;
        var shaiXuan={"findoption":{},"sortoption":{}};
        
        initUserData_Ajax(skipnum,pagesize,shaiXuan);
    }

    // AJAX请求
    function initUserData_Ajax(skipWhatData,meiYeShuJu,guoLvData){

        var valueOfskipnum=skipWhatData;
        var valueOflimitnum=meiYeShuJu;        

        var requestDataPost={};
        $.extend(requestDataPost,guoLvData);
        

   

            function newLXlistlistOK(data){
                // if(data.errorcode == 0)
                if(!data.errcode)
                {
                    //给哪个list刷数据
                    $("#HistoryList").SList("refresh",{data:data.clientList.clientInfo,total:data.clientList.count_total});
                                        
                }else{
                    console.log('返回值：errorInfo');
                }
            }


            function newLXlistlistFail(err){
                console.log("ajax request fail:"+err);
            }

            
            var url=MyConfig.path+"/stamonitor/getclientlistbycondition?devSN="+FrameInfo.ACSN+"&reqType=history"+branchReqValueReceive+authReqValueReceive;
            var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;
            url=url+requestData;

            var newLXlist = {
                type:"POST",
                // type:"GET",

                url:url,
                contentType:"application/json",
                dataType:"json",

                data:JSON.stringify(requestDataPost),

                onSuccess:newLXlistlistOK,
                onFailed:newLXlistlistFail
            };


            Utils.Request.sendRequest(newLXlist);

    }


    function _init (oPara)
    {
        var oPara = Utils.Base.parseUrlPara();        
        branchReqValueReceive=oPara.branchReqValueSend;
        authReqValueReceive=oPara.authReqValueSend;

        shengMing_sstj();
        initUserGrid();
        initUserData();        

        $("#iBack").click(function(){
            Utils.Base.redirect({ np: "hq_customer.customer",branchReqValueWBGZ:branchReqValueReceive,authReqValueWBGZ:authReqValueReceive});
        });
    }

    function _destroy()
    {
        console.log("*******商业连锁总部//宾客信息//历史明细*******GO OUT>>>>");
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","SingleSelect","Minput","Form"],
        "utils": ["Base","Request", "Msg"]
    });
})(jQuery);
