;(function ($) {
    var MODULE_NAME = "hq_branchesinfor.localservice";
    var g_IsGlobal = true;
    var g_sBrName = '';
    var g_STName = "";
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("summary_rc", sRcName).split(",");
    }

    function showClient(row, cell, value, columnDef, oRowData,sType)
    {
        var nIndex = cell;

        if(sType == "text"||value=="0")
        {
            return value;
        }

        return '<a class="link" href="" bssid='+oRowData.stName+' index="'+nIndex+'" style="color: #008aea;">'+ value +'</a>';
    }

    function drawServerList()
    {
        var opt = {
            showHeader: true,
            multiSelect: false,
            pageSize:10,
            colNames: getRcText("LOCALAC_HEADER"),
		    // asyncPaging :true,
            // onPageChange:function(pageNum,pageSize,oFilter,oSorter){
            //     var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
            //     var valueOflimitnum=pageSize;
            //     var url = "";
            //     var oFilterOpt={};
            //     //升序1、降序-1
            //     var oSorterhaha={};
            //     $.extend(oSorterhaha,oSorter);
            //     if(oSorterhaha.isDesc==true){
            //         oSorterhaha.isDesc=-1;
            //     }else if(oSorterhaha.isDesc==false){
            //         oSorterhaha.isDesc=1;
            //     }      

            //     //sortoption对象，如下
            //     var paiXuObject={};
            //     paiXuObject[oSorterhaha.name]=oSorterhaha.isDesc;          

            //     //requestBody,如下
            //     var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};
            //     if (g_IsGlobal == true)
            //     {
            //         url = MyConfig.path+"/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN+"&skipnum=0&limitnum=10";;
            //     }
            //     else
            //     {
            //         url = MyConfig.path+"/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN+"&branch="+g_sBrName+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum
            //     }

            //     var oDataOpt = {
            //         type:"GET",
            //         url:url,
            //         contentType:"application/json",
            //         dataType:"json",
            //         //data:JSON.stringify(guoLvTiaoJian),
            //         onSuccess:refreshServiceList,
            //         onFailed:function()
            //         {
            //             console.log("Get ApGrpList by branch failed.");
            //         }
            //     };

            //     Utils.Request.sendRequest(oDataOpt);
            // },  
            // onSearch:function(oFilter,oSorter){
            //     //dangqianyeshujuyoujitiao000000000000
            //     var valueOfskipnum=0;
            //     var valueOflimitnum=10;
            //     var url;
            //     //升序1、降序-1
            //     var oSorterhaha={};
            //     $.extend(oSorterhaha,oSorter);
            //     if(oSorterhaha.isDesc==true){
            //         oSorterhaha.isDesc=-1;
            //     }else if(oSorterhaha.isDesc==false){
            //         oSorterhaha.isDesc=1;
            //     }      

            //     //sortoption对象，如下
            //     var paiXuObject={};
            //     paiXuObject[oSorterhaha.name]=oSorterhaha.isDesc;          

            //     //requestBody,如下
            //     var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};                
            //     if (g_IsGlobal == true)
            //     {
            //         url = MyConfig.path+"/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN+"&skipnum=0&limitnum=10";;
            //     }
            //     else
            //     {
            //         url = MyConfig.path+"/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN+"&branch="+g_sBrName+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum
            //     }
            //     //发送请求
            //     var oDataOpt = {
            //         type:"GET",
            //         url:url,
            //         contentType:"application/json",
            //         dataType:"json",
            //         //data:JSON.stringify(guoLvTiaoJian),
            //         onSuccess:refreshServiceList,
            //         onFailed:function()
            //         {
            //             console.log("Get ApGrpList by branch failed.");
            //         }
            //     };

            //     Utils.Request.sendRequest(oDataOpt);
            // },
            // onSort:function(sName,isDesc){
            //     //dangqianyeshujuyoujitiao000000000000
            //     var valueOfskipnum=0;
            //     var valueOflimitnum=10;                
            //     var url;
            //     //升序1、降序-1
            //     var shunxu=isDesc;
            //     if(shunxu==true){
            //         shunxu=-1;
            //     }else if(shunxu==false){
            //         shunxu=1;
            //     }else{
            //         console.log('here is try catch.');
            //     }

            //     //sortoption对象，如下                
            //     var paiXuObject={};
            //     paiXuObject[sName]=shunxu;

            //     //requestBody,如下
            //     var guoLvTiaoJian={"findoption":{},"sortoption":paiXuObject};
            //     if (g_IsGlobal == true)
            //     {
            //         url = MyConfig.path+"/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN+"&skipnum=0&limitnum=10";;
            //     }
            //     else
            //     {
            //         url = MyConfig.path+"/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN+"&branch="+g_sBrName+"&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum
            //     }
            //     //发送请求
            //     var oDataOpt = {
            //         type:"GET",
            //         url:url,
            //         contentType:"application/json",
            //         dataType:"json",
            //         //data:JSON.stringify(guoLvTiaoJian),
            //         onSuccess:refreshServiceList,
            //         onFailed:function()
            //         {
            //             console.log("Get ApGrpList by branch failed.");
            //         }
            //     };

            //     Utils.Request.sendRequest(oDataOpt);
            // },             

            colModel: [
                { name: "stName", datatype: "String"},
                { name: "ssidName", datatype: "String"},
                { name: "ApCnt", datatype: "String",formatter:showClient},
                { name: "ApGroupCnt", datatype: "String",formatter:showClient},
                { name: "clientCount", datatype: "String",formatter:showClient}
            ]
        };
        $("#server_slist").SList("head", opt);
        //$("#server_slist").SList("refresh", [{"serverName":"wocaca","SSID":"cacawo","APNum":3,"APGroupNum":1,"clientCount":55}]);
    }

    function drawAPList()
    {
        var opt = {
            showHeader: true,
            multiSelect: false,
            pageSize:10,
            colNames: getRcText("APLIST_HEADER"),
		    asyncPaging :true,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){
                var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
                var valueOflimitnum=pageSize;
                var url = "";
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

                if (g_sBrName)
                {
                    oFilter.branch = g_sBrName;
                }

                //requestBody,如下
                var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};

                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/ssidmonitor/getstbindlist?devSN="+FrameInfo.ACSN+"&stName="+g_STName+"&skipnum=0&limitnum=10",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApList,
                    onFailed:function()
                    {
                        console.log("Get services failed.");
                    }
                };

                //CC@temp
                Utils.Request.sendRequest(oDataOpt);
            },  
            onSearch:function(oFilter,oSorter){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var url;
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

                if (g_sBrName)
                {
                    oFilter.branch = g_sBrName;
                }

                //requestBody,如下
                var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};      

                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/ssidmonitor/getstbindlist?devSN="+FrameInfo.ACSN+"&stName="+g_STName+"&skipnum=0&limitnum=10",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApList,
                    onFailed:function()
                    {
                        console.log("Get services failed.");
                    }
                };

                //CC@temp
                Utils.Request.sendRequest(oDataOpt);
            },
            onSort:function(sName,isDesc){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;                
                var url;
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
              if (g_sBrName)
                {
                    oFilter.branch = g_sBrName;
                }

                //requestBody,如下
                var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};      
                          
                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/ssidmonitor/getstbindlist?devSN="+FrameInfo.ACSN+"&stName="+g_STName+"&skipnum=0&limitnum=10",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApList,
                    onFailed:function()
                    {
                        console.log("Get services failed.");
                    }
                };

                //CC@temp
                Utils.Request.sendRequest(oDataOpt);
            },             

            colModel: [
                { name: "macAddr", datatype: "String"},
                { name: "ipv4Addr", datatype: "String"},
                { name: "apName", datatype: "String"}
            ]
        };
        $("#ap_list").SList("head", opt);
        $("#ap_list").SList("refresh");
        //$("#server_slist").SList("refresh", [{"serverName":"wocaca","SSID":"cacawo","APNum":3,"APGroupNum":1,"clientCount":55}]);
    }

    function drawAPGroupList()
    {
        var opt = {
            showHeader: true,
            multiSelect: false,
            pageSize:10,
            colNames: getRcText("APGROUPLIST_HEADER"),
		    asyncPaging :true,
            onPageChange:function(pageNum,pageSize,oFilter,oSorter){
                var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
                var valueOflimitnum=pageSize;
                var url = "";
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

                if (g_sBrName)
                {
                    oFilter.branch = g_sBrName;
                }

                //requestBody,如下
                var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};

                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/ssidmonitor/getstbindlist?devSN="+FrameInfo.ACSN+"&stName="+g_STName+"&skipnum=0&limitnum=10",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApGroupList,
                    onFailed:function()
                    {
                        console.log("Get services failed.");
                    }
                };

                //CC@temp
                Utils.Request.sendRequest(oDataOpt);
            },  
            onSearch:function(oFilter,oSorter){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var url;
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

                if (g_sBrName)
                {
                    oFilter.branch = g_sBrName;
                }

                //requestBody,如下
                var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};      

                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/ssidmonitor/getstbindlist?devSN="+FrameInfo.ACSN+"&stName="+g_STName+"&skipnum=0&limitnum=10",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApGroupList,
                    onFailed:function()
                    {
                        console.log("Get services failed.");
                    }
                };

                //CC@temp
                Utils.Request.sendRequest(oDataOpt);
            },
            onSort:function(sName,isDesc){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;                
                var url;
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
              if (g_sBrName)
                {
                    oFilter.branch = g_sBrName;
                }

                //requestBody,如下
                var guoLvTiaoJian={"findoption":oFilter,"sortoption":paiXuObject};      
                          
                var oDataOpt = {
                    type:"POST",
                    url:MyConfig.path+"/ssidmonitor/getstbindlist?devSN="+FrameInfo.ACSN+"&stName="+g_STName+"&skipnum=0&limitnum=10",
                    contentType:"application/json",
                    dataType:"json",
                    data:JSON.stringify(guoLvTiaoJian),
                    onSuccess:refreshApGroupList,
                    onFailed:function()
                    {
                        console.log("Get services failed.");
                    }
                };

                //CC@temp
                Utils.Request.sendRequest(oDataOpt);
            },             

            colModel: [
                { name: "apGroupName", datatype: "String"},
                { name: "description", datatype: "String"}
            ]
        };
        $("#apgroup_list").SList("head", opt);
        $("#apgroup_list").SList("refresh");
        //$("#server_slist").SList("refresh", [{"serverName":"wocaca","SSID":"cacawo","APNum":3,"APGroupNum":1,"clientCount":55}]);
    }

    function initGrid()
    {
        drawServerList();
        drawAPList();
        drawAPGroupList();
    }

    function refreshBrList(oData)
    {
        var aShowData = [];
        for (var i = 0; i < oData.branchList.length; i++)
        {
            aShowData.push(oData.branchList[i].branchName);
        }

        $("#branchSelect").singleSelect("InitData", aShowData, {allowClear:false});
    }
// {
//     "branchList":[
//         {
//             "branchName":"String",
//             "branchType":"Number",
//             "managePermmit":"Number(0---无本地管理权限，1---有本地管理权限)",
//             "localACCount":"Number",
//             "apGroupCount":"Number",
//             "apCount":"Number",
//             "clientCount":"Number"
//         }
//     ]
// }

    function initSelect()
    {
        //@c need interface
        //var aData = [{"val" : "01", "show" : "branch01"}, {"val" : "02", "show" : "branch02"}, {"val" : "02", "show" : "branch02"}];
        //发送请求
        var oDataOpt = {
            type:"Get",
            url:MyConfig.path+"/apmonitor/getBranchList?devSN="+FrameInfo.ACSN,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({}),
            onSuccess:refreshBrList,
            onFailed:function()
            {
                console.log("Get ApGrpList by branch failed.");
            }
        };

        Utils.Request.sendRequest(oDataOpt);
    }

    function changeChecked(){
        $("#branchSelectu").css("display","none");
        $("#ap_group").bind("click", function ()
        {
            g_IsGlobal = true;
            g_sBrName = "";
            $("#branchSelectu").css("display","none");
            //@c need interface
            //刷新全局数据
            initData("");
        });

        $("#ap").bind("click", function ()
        {
            if("#ap:checked")
            {
                initSelect();

                g_sBrName = $("#branchSelect").singleSelect("getSelectedData").value;
                //需要根据分支名字，刷新数据
                if (g_sBrName)
                {
                    initData(g_sBrName);
                }
                g_IsGlobal = false;
                $("#branchSelectu").css("display","inline-block");
            }
        });
    }

    function refreshServiceList(oData)
    {
        var aShowData = [];
        for (var i = 0; i < oData.ssidList.length; i++)
        {
            aShowData.push({
                "stName":oData.ssidList[i].stName,
                "ssidName":oData.ssidList[i].ssidName,
                "ApCnt":oData.ssidList[i].ApCnt,
                "ApGroupCnt":oData.ssidList[i].ApGroupCnt,
                "clientCount":oData.ssidList[i].clientCount
            });
        }
        $("#server_slist").SList("refresh", aShowData);
    }
                // { name: "stName", datatype: "String"},
                // { name: "ssidName", datatype: "String"},
                // { name: "ApCnt", datatype: "String",formatter:showClient},
                // { name: "ApGroupCnt", datatype: "String",formatter:showClient},
                // { name: "clientCount", datatype: "String",formatter:showClient}

    function initData(sBrName)
    {
        //@c need interface
        //初始化为全局
        var sUrl = null;
        if (sBrName == "")
        {
            sUrl = MyConfig.path+"/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN;
        }
        else
        {
            sUrl = MyConfig.path+"/ssidmonitor/getssidinfobrief?devSN="+FrameInfo.ACSN+"&branch="+g_sBrName;
        }

        var oDataOpt = {
            type:"GET",
            url:sUrl,
            contentType:"application/json",
            dataType:"json",
            //data:JSON.stringify({findoption:{},sortoption:{}}),
            onSuccess:refreshServiceList,
            onFailed:function()
            {
                console.log("Get services failed.");
            }
        };

        //CC@temp
        Utils.Request.sendRequest(oDataOpt);
       // $("#server_slist").SList("refresh", [{'ApGroup':'apgroup1','hq_SSID':'big_banana','hq_BSSID':'119-119-119-119','hq_localac':'ac1','hq_BR':'br1','hq_locLog':5}]);
    }

    function refreshApList(oData)
    {
        $("#ap_list").SList("refresh", {data:oData.stBindList.bindApList, total:oData.stBindList.apTotalCnt});
    }

    function refreshApGroupList(oData)
    {
        $("#apgroup_list").SList("refresh", {data:oData.stBindList.bindApGroupList, total:oData.stBindList.apGrpTotalCnt});
    }

    function getApList(sSTName, sBrName)
    {
        var oPostData = {findoption:{},sortoption:{}};
        if (sBrName)
        {
            oPostData = {findoption:{"branch":sBrName},sortoption:{}}
        }
        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/ssidmonitor/getstbindlist?devSN="+FrameInfo.ACSN+"&stName="+sSTName+"&skipnum=0&limitnum=10",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(oPostData),
            onSuccess:refreshApList,
            onFailed:function()
            {
                console.log("Get services failed.");
            }
        };

        //CC@temp
        Utils.Request.sendRequest(oDataOpt);
    }

    function getApGroupList(sSTName, sBrName)
    {
        var oPostData = {findoption:{},sortoption:{}};
        if (sBrName)
        {
            oPostData = {findoption:{"branch":sBrName},sortoption:{}}
        }
        var oDataOpt = {
            type:"POST",
            url:MyConfig.path+"/ssidmonitor/getstbindlist?devSN="+FrameInfo.ACSN+"&stName="+sSTName+"&skipnum=0&limitnum=10",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(oPostData),
            onSuccess:refreshApGroupList,
            onFailed:function()
            {
                console.log("Get services failed.");
            }
        };

        //CC@temp
        Utils.Request.sendRequest(oDataOpt);
    }

    function initForm()
    {
        changeChecked();

        $("#branchSelect").on("change", function(e)
        {
            console.log(e.val);
            //@c need interface
            g_sBrName = e.val;
            //需要根据分支名字，刷新数据
            initData(e.val);
        });

        $("#server_slist").on('click','a',function(){
            if($(this).html() != 0)
            {
                if ($(this).attr('index') == 4)
                {
                    Utils.Base.redirect ({np:"hq_branchesinfor.view_log", flag:1, bssid:$(this).attr("bssid"), brName:g_sBrName});
                }
                else if($(this).attr('index') == 2)
                {
                    console.log("22222");
                    Utils.Base.openDlg(null, {}, {scope:$("#ap_info"),className:"modal-super"});
                    g_STName = $(this).attr("bssid");
                    getApList($(this).attr("bssid"), g_sBrName);
                    $("#ap_list").SList("refresh");
                }
                else if($(this).attr('index') == 3)
                {
                    console.log("33333");
                    Utils.Base.openDlg(null, {}, {scope:$("#apgroup_info"),className:"modal-super"});
                    g_STName = $(this).attr("bssid");
                    getApGroupList($(this).attr("bssid"), g_sBrName);
                    $("#apgroup_list").SList("refresh");
                }
            }
            return false;
        });
    }

    function _init()
    {
        // NC = Utils.Pages[MODULE_NC].NC; 
        g_sBrName = "";
        initGrid();
        initData("");
        initForm();
        initSelect();   
    };

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);        
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "widgets": ["SList","SingleSelect","Minput"],
        "utils":["Request","Base"]
    });
})( jQuery );

