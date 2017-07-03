;(function ($)
{
    var MODULE_NAME = "hq_branchesinfor.view_log";
    var quanJuBianLiangWhatType="000";
    var g_oPara = null;

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("view_log_rc", sRcId);
    }

    function initForm()
    {
        $("#log_close").on("click", function(){
            Utils.Base.redirect ({np:"hq_branchesinfor.localservice"});
        });
    }
// {
//     "clientList":[
//         {
//             "count_total":"Number, 查询总数",
//             "count_left":"Number,  剩余未查询数",
//             "clientInfo":[
//                 {
//                     "clientMAC":"String, 终端MAC地址",
//                     "clientIP":"String, 终端IP地址",
//                     "clientVendor":"String, 终端厂商",
//                     "ApName":"String, 终端所在AP名",
//                     "onlineTime":"Number, 终端在线时长",
//                     "portalAuthType":"String, 终端认证类型"
//                 }
//             ]
//         }
//     ]
// }
    function refreshLogList(oData)
    {
        var aShowData = [];
        for (var i = 0; i < oData.clientList.clientInfo.length; i++)
        {
            var oClientData = oData.clientList.clientInfo[i];
            aShowData.push({
                "clientMAC":oClientData.clientMAC,
                "clientIP":oClientData.clientIP,
                "portalAuthType":oClientData.portalAuthType,
                "onlineTime":oClientData.onlineTime,
            });
        }
        $("#logList").SList ("refresh", {data:aShowData, total:oData.count_total});
    }

    function initGrid(sBssid){
        var optPop = {
            colNames: getRcText ("LOG_HEADER"),
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
                    url:MyConfig.path+"/stamonitor/getclientinfo_bystname?devSN="+FrameInfo.ACSN+"&clientSTName="+g_oPara.bssid+(g_oPara.brName?("&branch="+g_oPara.brName):"")+"&skipnum=0&limitnum=10",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshLogList,
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
                    url:MyConfig.path+"/stamonitor/getclientinfo_bystname?devSN="+FrameInfo.ACSN+"&clientSTName="+g_oPara.bssid+(g_oPara.brName?("&branch="+g_oPara.brName):"")+"&skipnum=0&limitnum=10",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshLogList,
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
                    url:MyConfig.path+"/stamonitor/getclientinfo_bystname?devSN="+FrameInfo.ACSN+"&clientSTName="+g_oPara.bssid+(g_oPara.brName?("&branch="+g_oPara.brName):"")+"&skipnum=0&limitnum=10",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshLogList,
                    onFailed:function()
                    {
                        console.log("Get client list by branch failed.");
                    }
                };

                Utils.Request.sendRequest(oDataOpt);
            },             

            colModel: [
                {name: "clientMAC", datatype: "String"},
                {name: "clientIP", datatype: "String"},
                {name: "portalAuthType", datatype: "String"},
                {name: "onlineTime", datatype: "String"},     
            ]
        };
        $("#logList").SList ("head", optPop);
        //$("#logList").SList("resize");        
    }

    function initData(){
        //@c need interfac
        //发送请求
        var guoLvTiaoJian={"findoption":{},"sortoption":{}};
        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/stamonitor/getclientinfo_bystname?devSN="+FrameInfo.ACSN+"&clientSTName="+g_oPara.bssid+(g_oPara.brName?("&branch="+g_oPara.brName):"")+"&skipnum=0&limitnum=10",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(guoLvTiaoJian),
            onSuccess:refreshLogList,
            onFailed:function()
            {
                console.log("Get client list by branch failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
        //$("#logList").SList ("refresh", [{"ClientMac":"110-110-110-110", "ClientIp":"4.4.4.4", "SSID":"big_banana", "BSSID":"111-111-111-111"}]);
    }

    function _init ()
    {
        g_oPara = Utils.Base.parseUrlPara();
        initForm();
        initGrid();
        initData();
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