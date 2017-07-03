;(function ($){
	var MODULE_BASE = "p_customer",
		MODULE_NAME = MODULE_BASE+".clients",
		g_jMList = null,
        g_jMListSP = null,
        g_jMListTJ = null;
    var v2path = MyConfig.v2path;
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    function getRcText (sRcId){
        return Utils.Base.getRcString ("clients_rc", sRcId);
    }
    function onViewClient(){
        var arowdata = $(this).attr("lala");
        var arowdataobject={};
        arowdataobject=JSON.parse(arowdata);
        viewClient(arowdataobject);
    }
    function viewClient(aRowData){
        var data = {};
        $.extend(data,aRowData);
        if(data.clientVendor==""){
            data.clientVendor=getRcText ("OTHER");
        }
        if(data.clientRadioMode==1){
            data.clientRadioMode= "802.11b";
        }else if(data.clientRadioMode==2){
            data.clientRadioMode= "802.11a";
        }else if(data.clientRadioMode==4){
            data.clientRadioMode= "802.11g";
        }else if(data.clientRadioMode==8){
            data.clientRadioMode= "802.11gn";
        }else if(data.clientRadioMode==16){
            data.clientRadioMode= "802.11an";
        }else if(data.clientRadioMode==64){
            data.clientRadioMode= "802.11ac";
        }else{
            data.clientRadioMode= "BuKeNeng";
        }
        Utils.Base.updateHtml($("#flowdetail_form"), data);
        Utils.Base.openDlg(null, {}, {scope:$("#flowdetailDlg"),className:"modal-super"});       
    }
    function rowClientVendor(row, cell, value, columnDef, oRowData,sType){
        if(value==""){
            return getRcText ("BUTTON_CANCEL");
        }else{
            return ""+value+"";
        }        
    }
    function machine(row, cell, value, columnDef, oRowData,sType){
        return ""+value+"";
    }
    function transferTime(row, cell, value, columnDef, oRowData,sType){
        if(value){
            if(value=="N/A"){
                return value;
            }else{
                return value;
            }
        }else if(!value){
            return getRcText ("USER_TYPE");
        }else{
            console.log('here is try catch.');
        }
    }
    function processMode(row, cell, value, columnDef, oRowData,sType){
        if(value==1){
            return "802.11b";
        }else if(value==2){
            return "802.11a";
        }else if(value==4){
            return "802.11g";
        }else if(value==8){
            return "802.11gn";
        }else if(value==16){
            return "802.11an";
        }else if(value==64){
            return "802.11ac";
        }else{
            return "BuKeNeng";
        }
    }
    function showLink(row, cell, value, columnDef, dataContext, type){
        if(type == "text")
        {
            return value;
        }
        var lalaValue=JSON.stringify(dataContext);
        return "<a lala='"+lalaValue+"' class='list-link'>"+value+"</a>";               
    }
    function getBack(){
         Utils.Base.redirect ({np:"p_customer.customer"});
         return false;         
    }
    function basicInfo(){
        g_jMList.show();
        g_jMList.SList("resize");
        g_jMListSP.hide();
        g_jMListTJ.hide();
        $("#clients_list_yh").hide();
        $("#clients_list_lx").hide();
    }
    function radioInfo(){
        g_jMList.hide();
        g_jMListSP.show();
        g_jMListSP.SList("resize");
        g_jMListTJ.hide();
        $("#clients_list_yh").hide();
        $("#clients_list_lx").hide();
    }
    function statisticsInfo(){
        g_jMList.hide();
        g_jMListSP.hide();
        g_jMListTJ.show();  
        g_jMListTJ.SList("resize");
        $("#clients_list_yh").hide(); 
        $("#clients_list_lx").hide();  
    }
    function userInfo(){
        g_jMList.hide();
        g_jMListSP.hide();
        g_jMListTJ.hide();
        $("#clients_list_lx").hide();
        $("#clients_list_yh").show();
        $("#clients_list_yh").SList("resize");     
    }
    function newOutlineInfo(){
        g_jMList.hide();
        g_jMListSP.hide();
        g_jMListTJ.hide();        
        $("#clients_list_yh").hide();
        $("#clients_list_lx").show();
        $("#clients_list_lx").SList("resize");     
    }
    function Fresh(){
        Utils.Base.refreshCurPage();
    }
    function exportNow(){
        function exportSuc(data){
            if(data.retCode==0)
            {
                $("#exportFile").get(0).src = data.fileName;
            }else{
                console.log('here is try catch.');
            }
        }
        function exportFail(error){
          console.log('Export log file failed: ' + error);  
        }
        var exportOpt = {
            url: "/v3/fs/exportClientsListbyCondition",
            type: "POST",
            dataType: "json",
            data: {
                devSN: FrameInfo.ACSN
            },
            onSuccess: exportSuc,
            onFailed: exportFail
        };
        Utils.Request.sendRequest(exportOpt);
    }
    function kickOut_AllOperation(){
        function kickOut_AllSuc(){
            Frame.Msg.info(getRcText ("LIST_QOSMODE"));
        }
        function kickOut_AllFail(error){
          console.log('kickOut_All failed: ' + error);  
        }
        var kickOut_AllOpt = {
            type: "POST",
            url: "/v3/ant/confmgr",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                configType:0,
                devSN:FrameInfo.ACSN,
                cfgTimeout:5,
                cloudModule:'portal',
                deviceModule:'portal',
                policy:'cloudFirst',
                method:'DeleteUser',
                param:[
                    {
                        "branchName":"",
                        "userMacAddr": []
                    }
                ]
            }),
            onSuccess: kickOut_AllSuc,
            onFailed: kickOut_AllFail
        };
        Utils.Request.sendRequest(kickOut_AllOpt);
    }
    function cancellationSingle(odata){
        function kickOut_singleSuc(){
            Frame.Msg.info(getRcText ("SEC_TYPE"));
        }
        function kickOut_singleFail(error){
          console.log('kickOut_renzheng failed: ' + error);  
        }
        var dataArray=[];
        $.each(odata,function(i,item){
            dataArray.push(item.clientMAC);
        });
        var kickOut_singleOpt = {
            type: "POST",
            url: "/v3/ant/confmgr",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                configType:0,
                devSN:FrameInfo.ACSN,
                cfgTimeout:5,
                cloudModule:'portal',
                deviceModule:'portal',
                policy:'cloudFirst',
                method:'DeleteUser',
                param:[
                    {
                        "branchName":"",
                        "userMacAddr": dataArray
                    }
                ]
            }),
            onSuccess: kickOut_singleSuc,
            onFailed: kickOut_singleFail
        };
        Utils.Request.sendRequest(kickOut_singleOpt);
    }
    function cancellation(odata){
        if(odata.length==0){
            return false;
        }else{
            return true;           
        }
    }    
    function initGrid ()
    {
        var opt = {
            colNames: getRcText("LIST_HEADER"),
            showOperation:false,
            pageSize:10,  
            asyncPaging:true, 
            multiSelect:true,
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
                var whatList=0;
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },  
            onSearch:function(oFilter,oSorter){
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var whatList=0;
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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            onSort:function(sName,isDesc){
                var valueOfskipnum=0;
                var valueOflimitnum=10;                
                var whatList=0;
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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },                    
            colModel: [
                {name: "clientMAC", datatype: "String",formatter:showLink},
                {name: "clientIP", datatype: "String"},
                {name: "clientVendor", datatype: "String",formatter:rowClientVendor},
                {name: "ApName", datatype: "String"},
                {name: "clientSSID", datatype: "String"}
            ],
            buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow},
                {name: "default", value:getRcText ("KICKOUT_renzheng"), enable:cancellation,action:cancellationSingle},
                {name: "default", value:getRcText ("KICKOUT_ALL"), action:kickOut_AllOperation}
            ]
        };
        g_jMList.SList ("head", opt);
        var optsp = {
            colNames: getRcText("LIST_HEADER_SP"),
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
                var whatList=1;
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },  
            onSearch:function(oFilter,oSorter){
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var whatList=1;
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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            onSort:function(sName,isDesc){
                var valueOfskipnum=0;
                var valueOflimitnum=10;                
                var whatList=1;
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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },                       
            colModel: [
                {name: "clientMAC", datatype: "String",width:"",formatter:showLink},
                {name: "clientIP", datatype: "String",width:""},
                {name: "ApName", datatype: "String",width:""},
                {name: "clientRadioMode", datatype: "String",width:"",formatter:processMode},
                {name: "clientMode", datatype: "String",width:""},
                {name: "clientChannel", datatype: "Integer",width:"",formatter:machine},
                {name: "NegoMaxRate", datatype: "Double",width:""}
            ],
            buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow},
                {name: "default", value:getRcText ("KICKOUT_renzheng"), enable:cancellation,action:cancellationSingle},
                {name: "default", value:getRcText ("KICKOUT_ALL"), action:kickOut_AllOperation}
            ]
        };
        g_jMListSP.SList ("head", optsp);
        var opttj = {
            colNames: getRcText("LIST_HEADER_TJ"),
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
                var whatList=2;
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },  
            onSearch:function(oFilter,oSorter){
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var whatList=2;
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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            onSort:function(sName,isDesc){
                var valueOfskipnum=0;
                var valueOflimitnum=10;                
                var whatList=2;
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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },                  
            colModel: [
                {name: "clientMAC", datatype: "String",formatter:showLink},
                {name: "clientIP", datatype: "String"},
                {name: "ApName", datatype: "String"},
                {name: "clientTxRate", datatype:"Integer",formatter:machine},
                {name: "clientRxRate", datatype: "Integer",formatter:machine},
            ],
            buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow},
                {name: "default", value:getRcText ("KICKOUT_renzheng"), enable:cancellation,action:cancellationSingle},
                {name: "default", value:getRcText ("KICKOUT_ALL"), action:kickOut_AllOperation}
            ]
        };
        g_jMListTJ.SList ("head", opttj);
        var optonlineuser = {
            colNames: getRcText("LIST_HEADER_YH"),
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
                var whatList=3;
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },  
            onSearch:function(oFilter,oSorter){
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var whatList=3;
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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            onSort:function(sName,isDesc){
                var valueOfskipnum=0;
                var valueOflimitnum=10;                
                var whatList=3;
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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },      
            colModel: [
                {name: "clientMAC", datatype: "String",formatter:showLink},
                {name: "clientSSID", datatype: "String"},
                {name: "portalUserName", datatype: "String"},                
                {name: "portalAuthType", datatype: "String"},
                {name: "portalOnlineTime", datatype: "String",formatter:transferTime}
            ],
            buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow},
                {name: "default", value:getRcText ("KICKOUT_renzheng"), enable:cancellation,action:cancellationSingle},
                {name: "default", value:getRcText ("KICKOUT_ALL"), action:kickOut_AllOperation}
            ]
        };
        $("#clients_list_yh").SList ("head", optonlineuser);
        var optonlineuser = {  
            colNames: getRcText("LIST_HEADER_LX"),
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
                initDLData_newLX(valueOfskipnum,valueOflimitnum,guoLvTiaoJian);
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
                initDLData_newLX(valueOfskipnum,valueOflimitnum,guoLvTiaoJian);
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
                initDLData_newLX(valueOfskipnum,valueOflimitnum,guoLvTiaoJian);
            },      
            colModel: [
                {name: "UserMac", datatype: "String"},
                {name: "UserIP", datatype: "String"},
                {name: "USerName", datatype: "String"},                
                {name: "AuthTypeStr", datatype: "String"},
                {name: "OnlineTime", datatype: "String",formatter:transferTime}
            ],
            buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("KICKOUT_lixian"), enable:cancellation,action:cancellationSingle},
                {name: "default", value:getRcText ("KICKOUT_ALL"), action:kickOut_AllOperation}
            ]
        };
        $("#clients_list_lx").SList ("head", optonlineuser);
    }
    function initForm()
    {
        $("#flowdetail_form").form("init", "edit", {"title":getRcText("TITLE_FLOWINFO"),"btn_apply": false});
        $("#renzhengdetail_form").form("init", "edit", {"title":getRcText("TITLE_RenZhengINFO"),"btn_apply": false});
        $("#return").on('click', getBack);
        $("#jiben").on('click', basicInfo);
        $("#shepin").on('click', radioInfo);
        $("#tongji").on('click', statisticsInfo);
        $("#yonghu").on('click', userInfo);
        $("#newOutline").on('click', newOutlineInfo);
        $("#clients_list").on('click', 'a.list-link', onViewClient);
        $("#clients_list_sp").on('click', 'a.list-link', onViewClient);
        $("#clients_list_tj").on('click', 'a.list-link', onViewClient);
        $("#clients_list_yh").on('click', 'a.list-link', onViewClient);
    }
    function initData(whatList){
        var skipnum=0;
        var pagesize=10;
        var shaiXuan={"findoption":{},"sortoption":{}};
        var whatList=whatList;
        initDLData(skipnum,pagesize,shaiXuan,whatList);
    }
    function initDLData(skipWhatData,meiYeShuJu,guoLvData,naGeList){
        var valueOfskipnum=skipWhatData;
        var valueOflimitnum=meiYeShuJu;
        var requestDataPost={};
        $.extend(requestDataPost,guoLvData);
            function stationlistOK(data){
                if(!data.errcode)
                {
                    if(naGeList==0){
                        var BasicInfoSlist = [];
                        $.each(data.clientList.clientInfo ,function(i,item){
                            BasicInfoSlist[i] = {};
                            BasicInfoSlist[i].clientMAC = item.clientMAC;
                            BasicInfoSlist[i].clientIP = item.clientIP;
                            BasicInfoSlist[i].clientVendor = item.clientVendor;
                            BasicInfoSlist[i].ApName = item.ApName;
                            BasicInfoSlist[i].clientSSID = item.clientSSID;
                        });
                        g_jMList.SList("refresh",{data:BasicInfoSlist,total:data.clientList.count_total});
                    }else if(naGeList==1){
                        var RadioInfoSlist = [];
                        $.each(data.clientList.clientInfo,function(i,item){
                            RadioInfoSlist[i] = {};
                            RadioInfoSlist[i].clientMAC = item.clientMAC;
                            RadioInfoSlist[i].clientIP = item.clientIP;
                            RadioInfoSlist[i].ApName = item.ApName;
                            RadioInfoSlist[i].clientRadioMode = item.clientRadioMode;
                            RadioInfoSlist[i].clientMode = item.clientMode;
                            RadioInfoSlist[i].clientChannel = item.clientChannel;
                            RadioInfoSlist[i].NegoMaxRate = item.NegoMaxRate;
                        });
                        g_jMListSP.SList("refresh",{data:RadioInfoSlist,total:data.clientList.count_total});
                    }else if(naGeList==2){
                        var StatisticsInfoSlist = [];
                        $.each(data.clientList.clientInfo,function(i,item){
                            StatisticsInfoSlist[i] = {};
                            StatisticsInfoSlist[i].clientMAC = item.clientMAC;
                            StatisticsInfoSlist[i].clientIP = item.clientIP;
                            StatisticsInfoSlist[i].ApName = item.ApName;
                            StatisticsInfoSlist[i].clientTxRate = item.clientTxRate;
                            StatisticsInfoSlist[i].clientRxRate = item.clientRxRate;
                        });
                        g_jMListTJ.SList("refresh",{data:StatisticsInfoSlist,total:data.clientList.count_total});
                    }else if(naGeList==3){
                        var UserInfoSlist = [];
                        $.each(data.clientList.clientInfo,function(i,item){
                            UserInfoSlist[i] = {};
                            UserInfoSlist[i].clientMAC = item.clientMAC;
                            UserInfoSlist[i].clientSSID = item.clientSSID;
                            UserInfoSlist[i].portalUserName = item.portalUserName;
                            UserInfoSlist[i].portalAuthType = item.portalAuthType;
                            UserInfoSlist[i].portalOnlineTime = item.portalOnlineTime;
                        });
                        $("#clients_list_yh").SList("refresh",{data:UserInfoSlist,total:data.clientList.count_total});
                    }else
                    if(naGeList=="quanbu"){
                        var AllInfoSlist = [];
                        $.each(data.clientList.clientInfo,function(i,item){
                            AllInfoSlist[i] = {};
                            AllInfoSlist[i].clientMAC = item.clientMAC;
                            AllInfoSlist[i].clientIP = item.clientIP;
                            AllInfoSlist[i].clientVendor = item.clientVendor;
                            AllInfoSlist[i].ApName = item.ApName;
                            AllInfoSlist[i].clientSSID = item.clientSSID;
                            AllInfoSlist[i].clientRadioMode = item.clientRadioMode;
                            AllInfoSlist[i].clientMode = item.clientMode;
                            AllInfoSlist[i].clientChannel = item.clientChannel;
                            AllInfoSlist[i].NegoMaxRate = item.NegoMaxRate;
                            AllInfoSlist[i].clientTxRate = item.clientTxRate;
                            AllInfoSlist[i].clientRxRate = item.clientRxRate;
                            AllInfoSlist[i].portalUserName = item.portalUserName;
                            AllInfoSlist[i].portalAuthType = item.portalAuthType;
                            AllInfoSlist[i].portalOnlineTime = item.portalOnlineTime;
                        });
                        g_jMListSP.SList("refresh",{data:AllInfoSlist,total:data.clientList.count_total});
                        g_jMList.SList("refresh",{data:AllInfoSlist,total:data.clientList.count_total});
                        g_jMListTJ.SList("refresh",{data:AllInfoSlist,total:data.clientList.count_total});
                        $("#clients_list_yh").SList("refresh",{data:AllInfoSlist,total:data.clientList.count_total});
                    }else{
                        console.log('here is try catch.');
                    }
                }else{
                }
            }
            function stationlistFail(err){
                console.log("ajax request fail:"+err);
            }
            var url=MyConfig.path+"/stamonitor/getclientverbose_page?devSN="+FrameInfo.ACSN;
            var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;
            url=url+requestData;
            var stationlist = {
                type:"POST",
                url:url,
                contentType:"application/json",
                dataType:"json",
                data:JSON.stringify(requestDataPost),
                onSuccess:stationlistOK,
                onFailed:stationlistFail
            };
            Utils.Request.sendRequest(stationlist);
    }
    function initData_newLX(){
        var skipnum=0;
        var pagesize=10;
        var shaiXuan={"findoption":{},"sortoption":{}};
        initDLData_newLX(skipnum,pagesize,shaiXuan);
    }
    function initDLData_newLX(skipWhatData,meiYeShuJu,guoLvData){
        var valueOfskipnum=skipWhatData;
        var valueOflimitnum=meiYeShuJu;
        var requestDataPost={};
        $.extend(requestDataPost,guoLvData);
            function newLXlistlistOK(data){
                if(!data.errcode)
                {
                    var OfflineList = [];
                    $.each(data.userList,function(i,item){
                        OfflineList[i] = {};
                        OfflineList[i].UserMac = item.UserMac;
                        OfflineList[i].UserIP = item.UserIP;
                        OfflineList[i].USerName = item.UserName;
                        OfflineList[i].AuthTypeStr = item.AuthTypeStr;
                        OfflineList[i].OnlineTime = item.OnlineTime;
                    });
                    $("#clients_list_lx").SList("refresh",{data:OfflineList,total:data.count_total});
                }else{
                }
            }
            function newLXlistlistFail(err){
                console.log("ajax request fail:"+err);
            }
            var url=MyConfig.path+"/portalmonitor/portalonlineuserlist?devSN="+FrameInfo.ACSN;
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
    function _init(){
        initForm();
        g_jMList = $ ("#clients_list");
        g_jMListSP = $ ("#clients_list_sp");
        g_jMListTJ = $ ("#clients_list_tj");
        $("input[name='sanzhong-info'][id='jiben']",$("#anniumen")).click();
        basicInfo();
        initGrid ();
        initData("quanbu");
        initData_newLX();
    }
    function _destroy(){
        g_jMList = null;
        g_jMListSP = null;
        g_jMListTJ = null;
        Utils.Request.clearMoudleAjax(MODULE_NAME);        
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Minput","Form"],
        "utils": ["Request", "Base","Device"]
    });
})(jQuery);
