/**
 * clientlist.js
 */
;(function ($){
	var MODULE_BASE = "hq_customer",
		MODULE_NAME = MODULE_BASE+".clients",

        g_jMList = null,
        g_jMListSP = null,
        g_jMListTJ = null;
    
        var v2path = MyConfig.v2path;
        
        var branchReqValueReceive="";
        var authReqValueReceive="";


    function getRcText (sRcId){
        return Utils.Base.getRcString ("clients_rc", sRcId);
    }



    //返回至首页面
    function fanHui(){
         Utils.Base.redirect ({np:"hq_customer.customer",branchReqValueWBGZ:branchReqValueReceive,authReqValueWBGZ:authReqValueReceive});
         return false;         
    }

    // 5张表，切换显示
    function jibenInfo(){
        g_jMList.show();
        g_jMList.SList("resize");

        g_jMListSP.hide();
        g_jMListTJ.hide();
        $("#clients_list_yh").hide();
        $("#clients_list_lx").hide();
    }
    
    function shepinInfo(){
        g_jMList.hide();

        g_jMListSP.show();
        g_jMListSP.SList("resize");

        g_jMListTJ.hide();
        $("#clients_list_yh").hide();
        $("#clients_list_lx").hide();
    }

    function tongjiInfo(){
        g_jMList.hide();
        g_jMListSP.hide();

        g_jMListTJ.show();  
        g_jMListTJ.SList("resize");  

        $("#clients_list_yh").hide(); 
        $("#clients_list_lx").hide();  
    }

    function yonghuInfo(){
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

    // 为弹框，准备object数据
    function onViewClient1(){
        var arowdata = $(this).attr("lala");

        var arowdataobject={};
        arowdataobject=JSON.parse(arowdata);

        onViewClient(arowdataobject);
    }

    // 将“详情弹框”弹出来
    function onViewClient(aRowData){

        //在弹出框中刷数据
        var data = {};
        $.extend(data,aRowData);    

        //处理“终端厂商”字段
        if(data.clientVendor==""){
            data.clientVendor="其它";
        }  

        //处理“clientRadioMod”字段
        //1-,2-,4-,8-,16 -,64-
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

        //显示弹出框
        Utils.Base.openDlg(null, {}, {scope:$("#flowdetailDlg"),className:"modal-super"});       
    }

    // 列表的字段加工
    function jiaGongclientVendor(row, cell, value, columnDef, oRowData,sType){
        if(value==""){
            return "未知";
        }else{
            return ""+value+"";
        }        
    }

    function jiaGong0(row, cell, value, columnDef, oRowData,sType){    
        return ""+value+"";
    }

    function transferTime(row, cell, value, columnDef, oRowData,sType){

        //给认证时间，进行转换
        if(value){
            if(value=="N/A"){
                return value;

                // var newValue=(new Date(1123459200000)).Format("yyyy/MM/dd hh:mm:ss");        
                // var newValue=(new Date(1123459200000)).toUTCString();        
                // var newValue=(JSON.stringify(new Date(1123459200000)));

                // return newValue;
            }else{
                // var newValue=(new Date(value)).Format("yyyy/MM/dd hh:mm:ss");        
                return value;
            }
        }else if(!value){
            return '无';
        }else{
            console.log('here is try catch.');
        }
    }

    function jiaGongclientRadioMode(row, cell, value, columnDef, oRowData,sType){ 
        //1-,2-,4-,8-,16 -,64-
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

        // var lalaValue=JSON.stringify(dataContext).replace(/\"/g, "");
        var lalaValue=JSON.stringify(dataContext);
        
        return "<a lala='"+lalaValue+"' class='list-link'>"+value+"</a>";               
    }



    // 列表的刷新功能
    function Fresh(){
        // //刷新整个页面
        // Utils.Base.refreshCurPage(); 
        
        // //刷新当前radio部分
        var biaoShiIndex=$("input[name='sanzhong-info']:checked",$("#anniumen")).attr("id");
        
        if(biaoShiIndex=="jiben"){   
            initData("quanbu");
            initData_newLX();
        }else if(biaoShiIndex=="shepin"){
            initData("quanbu");
            initData_newLX();
        }else if(biaoShiIndex=="tongji"){
            initData("quanbu");
            initData_newLX();
        }else if(biaoShiIndex=="yonghu"){
            initData("quanbu");
            initData_newLX();
        }else if(biaoShiIndex=="newOutline"){
            initData("quanbu");
            initData_newLX();
        }
        // else if(biaoShiIndex=="新表"){
        //     initDataXXX(XXX);
        // }
        else{
            console.log('try catch');
        }

    }

    // 列表的导出功能
    function exportNow(){

        function exportSuc(data){
            // if(data.errorcode == 0)
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


        if(authReqValueReceive.slice(6)==""){
            var exportOpt = {
                url: "/v3/fs/exportClientsListbyCondition",
                type: "POST",
                dataType: "json",
                data: {
                    devSN: FrameInfo.ACSN,
                    branch: branchReqValueReceive.slice(8)
                },
                onSuccess: exportSuc,
                onFailed: exportFail
            };  
        }else{
            var exportOpt = {
                url: "/v3/fs/exportClientsListbyCondition",
                type: "POST",
                dataType: "json",
                data: {
                    devSN: FrameInfo.ACSN,
                    auth: authReqValueReceive.slice(6),
                    branch: branchReqValueReceive.slice(8)
                },
                onSuccess: exportSuc,
                onFailed: exportFail
            };            
        }


        

        Utils.Request.sendRequest(exportOpt);
    }

    // 列表的批量踢下线功能
    function kickOut_AllOperation(){

        function kickOut_AllSuc(data){
            // //提示
            // var faillength=data.data.failed.length;
            // var successlength=data.data.success.length;
            // if(faillength!=0){
            //     Frame.Msg.info("此次操作，有未成功踢走的用户！","error");
            // }

            // 需要我刷新list吗
            Fresh();

            Frame.Msg.info("批量注销用户成功，稍后请刷新页面！");
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
                       "branchName":branchReqValueReceive.slice(8),
                        "userMacAddr": [] 
                    }
                ]
                
            }),
            onSuccess: kickOut_AllSuc,
            onFailed: kickOut_AllFail
        };

        Utils.Request.sendRequest(kickOut_AllOpt);
    }

    // 列表的自定义踢下线功能
    function KICKOUT_renzhengOperation(odata){
        function kickOut_renzhengSuc(data){

            // //提示
            // var faillength=data.data.failed.length;
            // var successlength=data.data.success.length;
            // if(faillength!=0){
            //     Frame.Msg.info("此次操作，有未成功踢走的用户！","error");
            // }

            // 需要我刷新list吗
            Fresh();

            Frame.Msg.info("注销用户成功，稍后请刷新页面！");

        }

        function kickOut_renzhengFail(error){
          console.log('kickOut_renzheng failed: ' + error);  
        }
        
        //准备data数组
        var dataArray=[];
        $.each(odata,function(i,item){            
            dataArray.push(item.clientMAC);            
        });



        var kickOut_renzhengOpt = {
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
                       "branchName":branchReqValueReceive.slice(8),
                        "userMacAddr": dataArray 
                    }
                ]
            }),
            onSuccess: kickOut_renzhengSuc,
            onFailed: kickOut_renzhengFail
        };

        Utils.Request.sendRequest(kickOut_renzhengOpt);
    }

    function KICKOUT_lixianrenzhengOperation(odata){
        function kickOut_renzhengSuc(data){

            // //提示
            // var faillength=data.data.failed.length;
            // var successlength=data.data.success.length;
            // if(faillength!=0){
            //     Frame.Msg.info("此次操作，有未成功踢走的用户！","error");
            // }

            // 需要我刷新list吗
            Fresh();

            Frame.Msg.info("清除在线状态成功，稍后请刷新页面！");

        }

        function kickOut_renzhengFail(error){
          console.log('kickOut_renzheng failed: ' + error);  
        }
        
        //准备data数组
        var dataArray=[];
        $.each(odata,function(i,item){
            dataArray.push(item.UserMac);            
        });



        var kickOut_renzhengOpt = {
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
                       "branchName":branchReqValueReceive.slice(8),
                        "userMacAddr": dataArray 
                    }
                ]
            }),
            onSuccess: kickOut_renzhengSuc,
            onFailed: kickOut_renzhengFail
        };

        Utils.Request.sendRequest(kickOut_renzhengOpt);
    }

    function shiFouYiXuanZe(odata){
        if(odata.length==0){
            return false;
        }else{
            return true;           
        }
    }    

    //是否隐藏第5张表
    function hide_fiveList(){
        if(branchReqValueReceive==""){
            $("#teshufive",$("#anniumen")).show();
        }else if(branchReqValueReceive!=""){
            $("#teshufive",$("#anniumen")).hide();
        }
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

                var whatList=0;
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },  
            onSearch:function(oFilter,oSorter){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var whatList=0;
                
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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            onSort:function(sName,isDesc){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;                
                var whatList=0;

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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },                    
            colModel: [
                {name: "clientMAC", datatype: "String",formatter:showLink},
                {name: "clientIP", datatype: "String"},
                // {name: "clientName", datatype: "String"},
                {name: "clientVendor", datatype: "String",formatter:jiaGongclientVendor},
                {name: "ApName", datatype: "String"},
                {name: "clientSSID", datatype: "String"}
                // {name: "signalStrength", datatype: "Integer",formatter:jiaGong0},
                // // {name: "PowerSaveMod", datatype: "Integer"},
                // {name: "clientTxRate", datatype:"Integer",formatter:jiaGong0},
                // {name: "clientRxRate", datatype: "Integer",formatter:jiaGong0},
                // // {name: "onlineTime", datatype: "Integer"},
                // {name: "clientRadioMode", datatype: "String",formatter:jiaGongclientRadioMode},
                // {name: "clientMode", datatype: "String"},
                // {name: "clientChannel", datatype: "Integer",formatter:jiaGong0},
                // {name: "NegoMaxRate", datatype: "Double"}

                // {name: "clientTxPackets", datatype: "Integer",formatter:jiaGong0},
                // {name: "clientRxPackets", datatype: "Integer",formatter:jiaGong0},
                // {name: "clientTxBytes", datatype: "Integer",formatter:jiaGong0},
                // {name: "clientRxBytes", datatype: "Integer",formatter:jiaGong0}
                     
            ], buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow},
                {name: "default", value:getRcText ("KICKOUT_renzheng"), enable:shiFouYiXuanZe,action:KICKOUT_renzhengOperation},
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

                var whatList=1;
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },  
            onSearch:function(oFilter,oSorter){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var whatList=1;
                
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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            onSort:function(sName,isDesc){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;                
                var whatList=1;

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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },                       
            colModel: [
                {name: "clientMAC", datatype: "String",width:"",formatter:showLink},
                {name: "clientIP", datatype: "String",width:""},
                // {name: "clientName", datatype: "String"},
                // {name: "clientVendor", datatype: "String",formatter:jiaGongclientVendor},
                {name: "ApName", datatype: "String",width:""},
                // {name: "clientSSID", datatype: "String"},
                // {name: "signalStrength", datatype: "Integer",formatter:jiaGong0},
                // {name: "PowerSaveMod", datatype: "Integer"},
                // {name: "clientTxRate", datatype:"Integer",formatter:jiaGong0},
                // {name: "clientRxRate", datatype: "Integer",formatter:jiaGong0},
                // {name: "onlineTime", datatype: "Integer"},
                {name: "clientRadioMode", datatype: "String",width:"",formatter:jiaGongclientRadioMode},
                {name: "clientMode", datatype: "String",width:""},
                {name: "clientChannel", datatype: "Integer",width:"",formatter:jiaGong0},
                {name: "NegoMaxRate", datatype: "Double",width:""}

                // {name: "clientTxPackets", datatype: "Integer",formatter:jiaGong0},
                // {name: "clientRxPackets", datatype: "Integer",formatter:jiaGong0},
                // {name: "clientTxBytes", datatype: "Integer",formatter:jiaGong0},
                // {name: "clientRxBytes", datatype: "Integer",formatter:jiaGong0}
                     
            ], buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow},
                {name: "default", value:getRcText ("KICKOUT_renzheng"), enable:shiFouYiXuanZe,action:KICKOUT_renzhengOperation},
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

                var whatList=2;
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },  
            onSearch:function(oFilter,oSorter){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var whatList=2;
                
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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            onSort:function(sName,isDesc){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;                
                var whatList=2;

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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },                  
            colModel: [
                {name: "clientMAC", datatype: "String",formatter:showLink},
                {name: "clientIP", datatype: "String"},
                // {name: "clientName", datatype: "String"},
                // {name: "clientVendor", datatype: "String",formatter:jiaGongclientVendor},
                {name: "ApName", datatype: "String"},
                // {name: "clientSSID", datatype: "String"},
                // {name: "signalStrength", datatype: "Integer",formatter:jiaGong0},
                // {name: "PowerSaveMod", datatype: "Integer"},
                {name: "clientTxRate", datatype:"Integer",formatter:jiaGong0},
                {name: "clientRxRate", datatype: "Integer",formatter:jiaGong0},
                // {name: "onlineTime", datatype: "Integer"},
                // {name: "clientRadioMode", datatype: "String",formatter:jiaGongclientRadioMode},
                // {name: "clientMode", datatype: "String"},
                // {name: "clientChannel", datatype: "Integer",formatter:jiaGong0},
                // {name: "NegoMaxRate", datatype: "Double"}

                // {name: "clientTxPackets", datatype: "Integer",formatter:jiaGong0},
                // {name: "clientRxPackets", datatype: "Integer",formatter:jiaGong0},
                // {name: "clientTxBytes", datatype: "Integer",formatter:jiaGong0},
                // {name: "clientRxBytes", datatype: "Integer",formatter:jiaGong0}
                     
            ], buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow},
                {name: "default", value:getRcText ("KICKOUT_renzheng"), enable:shiFouYiXuanZe,action:KICKOUT_renzhengOperation},
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

                var whatList=3;
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },  
            onSearch:function(oFilter,oSorter){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;
                var whatList=3;
                
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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },
            onSort:function(sName,isDesc){
                //dangqianyeshujuyoujitiao000000000000
                var valueOfskipnum=0;
                var valueOflimitnum=10;                
                var whatList=3;

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
                initDLData(valueOfskipnum,valueOflimitnum,guoLvTiaoJian,whatList);
            },      
            colModel: [   

                {name: "clientMAC", datatype: "String",formatter:showLink},
                {name: "clientSSID", datatype: "String"},
                {name: "portalUserName", datatype: "String"},                
                {name: "portalAuthType", datatype: "String"},
                {name: "portalOnlineTime", datatype: "String",formatter:transferTime}               
                // {name: "clientVendor", datatype: "String",formatter:jiaGongclientVendor},
                
            ], buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow},
                {name: "default", value:getRcText ("KICKOUT_renzheng"), enable:shiFouYiXuanZe,action:KICKOUT_renzhengOperation},
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

                
                initDLData_newLX(valueOfskipnum,valueOflimitnum,guoLvTiaoJian);
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
                initDLData_newLX(valueOfskipnum,valueOflimitnum,guoLvTiaoJian);
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
                initDLData_newLX(valueOfskipnum,valueOflimitnum,guoLvTiaoJian);
            },      
            colModel: [   

                {name: "UserMac", datatype: "String"},
                {name: "UserIP", datatype: "String"},
                {name: "UserName", datatype: "String"},                
                {name: "AuthTypeStr", datatype: "String"},
                {name: "OnlineTime", datatype: "String",formatter:transferTime}               
                // {name: "clientVendor", datatype: "String",formatter:jiaGongclientVendor},
                
            ], buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("KICKOUT_lixian"), enable:shiFouYiXuanZe,action:KICKOUT_lixianrenzhengOperation},
                {name: "default", value:getRcText ("KICKOUT_ALL"), action:kickOut_AllOperation}
            ]
        };
        $("#clients_list_lx").SList ("head", optonlineuser);
    }

    function initForm()
    {
        //弹框FORM初始化
        $("#flowdetail_form").form("init", "edit", {"title":getRcText("TITLE_FLOWINFO"),"btn_apply": false});
        $("#renzhengdetail_form").form("init", "edit", {"title":getRcText("TITLE_RenZhengINFO"),"btn_apply": false});
           
        //返回上一页
        $("#return").on('click', fanHui);

        //切换表
        $("#jiben").on('click', jibenInfo);
        $("#shepin").on('click', shepinInfo);
        $("#tongji").on('click', tongjiInfo);
        $("#yonghu").on('click', yonghuInfo);
        $("#newOutline").on('click', newOutlineInfo);

        //详情弹框，触发
        $("#clients_list").on('click', 'a.list-link', onViewClient1);
        $("#clients_list_sp").on('click', 'a.list-link', onViewClient1);
        $("#clients_list_tj").on('click', 'a.list-link', onViewClient1);
        $("#clients_list_yh").on('click', 'a.list-link', onViewClient1);
    }   

    // 前4个表，初始情况下，准备请求参数
    function initData(whatList){
        //dangqianyeshujuyoujitiao000000000000
        var skipnum=0;
        var pagesize=10;
        var shaiXuan={"findoption":{},"sortoption":{}};
        
        var whatList=whatList;
        initDLData(skipnum,pagesize,shaiXuan,whatList);
    }

    // 前4个表，AJAX请求
    function initDLData(skipWhatData,meiYeShuJu,guoLvData,naGeList){

        var valueOfskipnum=skipWhatData;
        var valueOflimitnum=meiYeShuJu;        

        var requestDataPost={};
        $.extend(requestDataPost,guoLvData);
        

        //基本信息、射频信息、统计信息
        // //清空数据
        // g_jMList.SList("refresh",[]);
        // g_jMListSP.SList("refresh",[]);
        // g_jMListTJ.SList("refresh",[]);
        // $("#clients_list_yh").SList("refresh",[]);

            function stationlistOK(data){
                // if(data.errorcode == 0)
                if(!data.errcode)
                {
                    //给哪个list刷数据
                    if(naGeList==0){

                        g_jMList.SList("refresh",{data:data.clientList.clientInfo,total:data.clientList.count_total});
                    
                    }else if(naGeList==1){

                        g_jMListSP.SList("refresh",{data:data.clientList.clientInfo,total:data.clientList.count_total});
                    
                    }else if(naGeList==2){

                        g_jMListTJ.SList("refresh",{data:data.clientList.clientInfo,total:data.clientList.count_total});
                    
                    }else if(naGeList==3){

                        $("#clients_list_yh").SList("refresh",{data:data.clientList.clientInfo,total:data.clientList.count_total});
                    
                    }else if(naGeList=="quanbu"){

                        g_jMListSP.SList("refresh",{data:data.clientList.clientInfo,total:data.clientList.count_total});
                        g_jMList.SList("refresh",{data:data.clientList.clientInfo,total:data.clientList.count_total});
                        g_jMListTJ.SList("refresh",{data:data.clientList.clientInfo,total:data.clientList.count_total});
                        $("#clients_list_yh").SList("refresh",{data:data.clientList.clientInfo,total:data.clientList.count_total});
                    
                    }else{
                        console.log('here is try catch.');
                    }
                    
                }else{
                    console.log('请求失败');
                }
            }


            function stationlistFail(err){
                console.log("ajax request fail:"+err);
            }

            
            var url=MyConfig.path+"/stamonitor/getclientverbose_page?devSN="+FrameInfo.ACSN+branchReqValueReceive+authReqValueReceive;
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

    // 第5个表，初始情况下，准备请求参数
    function initData_newLX(){
        //dangqianyeshujuyoujitiao000000000000
        var skipnum=0;
        var pagesize=10;
        var shaiXuan={"findoption":{},"sortoption":{}};
        
        initDLData_newLX(skipnum,pagesize,shaiXuan);
    }

    // 第5个表，AJAX请求
    function initDLData_newLX(skipWhatData,meiYeShuJu,guoLvData){

        var valueOfskipnum=skipWhatData;
        var valueOflimitnum=meiYeShuJu;        

        var requestDataPost={};
        $.extend(requestDataPost,guoLvData);
        

   

            function newLXlistlistOK(data){
                // if(data.errorcode == 0)
                if(!data.errcode)
                {
                    //给哪个list刷数据
                    $("#clients_list_lx").SList("refresh",{data:data.userList,total:data.count_total});
                                        
                }else{
                    console.log('请求失败');
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



        
    function _init(oPara){
        // NC = Utils.Pages[MODULE_NC].NC;

        var oPara = Utils.Base.parseUrlPara();        
        branchReqValueReceive=oPara.branchReqValueSend;
        authReqValueReceive=oPara.authReqValueSend;


        initForm();

        g_jMList = $ ("#clients_list");
        g_jMListSP = $ ("#clients_list_sp");
        g_jMListTJ = $ ("#clients_list_tj");

        // 5个表，第一个radio按钮选中
        $("input[name='sanzhong-info'][id='jiben']",$("#anniumen")).click();

        // 5个表，第一张表选中
        jibenInfo();

        // 是否隐藏第5张表
        hide_fiveList();

        shengMing_sstj();
        initGrid ();

        initData("quanbu");
        initData_newLX();

    }




    function _destroy(){
        g_jMList = null;
        g_jMListSP = null;
        g_jMListTJ = null;

        console.log("*******商业连锁总部//宾客信息//client跳转页*******GO OUT>>>>");
        Utils.Request.clearMoudleAjax(MODULE_NAME);        
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Minput","Form"],
        "utils": ["Request", "Base"]
        
    });
})(jQuery);
