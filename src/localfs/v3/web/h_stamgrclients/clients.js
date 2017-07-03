/**
 * clientlist.js
 */
;(function ($){
	var MODULE_BASE = "h_stamgrclients",
		MODULE_NAME = MODULE_BASE+".clients",
		g_jMList = null,
        g_jMListSP = null,
        g_jMListTJ = null;
    var v2path = MyConfig.v2path;


Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}



    function getRcText (sRcId){
        return Utils.Base.getRcString ("clients_rc", sRcId);
    }


    function onViewClient1(){
        var arowdata = $(this).attr("lala");

        var arowdataobject={};
        arowdataobject=JSON.parse(arowdata);

        onViewClient(arowdataobject);
    }


    // function onViewClientRenZheng(){
    //     var arowdata = $(this).attr("lala");

    //     var arowdataobject={};
    //     arowdataobject=JSON.parse(arowdata);

    //     Utils.Base.updateHtml($("#renzhengdetail_form"), arowdataobject);  

    //     //显示弹出框
    //     Utils.Base.openDlg(null, {}, {scope:$("#renzhengdetailDlg"),className:"modal-super"});       
    
    // }



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

    function fanHui(){
        //返回至首页面         
         Utils.Base.redirect ({np:"h_stamgrclients.m_clients"});
         return false;         
    }

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
        
        var exportOpt = {
            url: "/v3/fs/exportClientsList",
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

        function kickOut_AllSuc(data){
            // //提示
            // var faillength=data.data.failed.length;
            // var successlength=data.data.success.length;
            // if(faillength!=0){
            //     Frame.Msg.info("此次操作，有未成功踢走的用户！","error");
            // }

            if(data.errorcode==0){
                // 需要我刷新list吗
                Fresh();

                Frame.Msg.info("批量注销用户，成功！");       
            }else{
                Frame.Msg.info("批量注销用户，失败！","error"); 
            }
        }

        function kickOut_AllFail(error){
            Frame.Msg.info("批量注销用户，失败！","error");             
        }
        
        var kickOut_AllOpt = {
            type: "POST",
            url: v2path+"/onlineuser/kickoutAll",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                "ownerName":FrameInfo.g_user.attributes.name,
                "nasId":FrameInfo.Nasid
            }),
            onSuccess: kickOut_AllSuc,
            onFailed: kickOut_AllFail
        };

        Utils.Request.sendRequest(kickOut_AllOpt);
    }


    function KICKOUT_renzhengOperation(odata){
        function kickOut_renzhengSuc(data){

            // //提示
            // var faillength=data.data.failed.length;
            // var successlength=data.data.success.length;
            // if(faillength!=0){
            //     Frame.Msg.info("此次操作，有未成功踢走的用户！","error");
            // }

            if(data.errorcode==0){
                // 需要我刷新list吗
                Fresh();

                Frame.Msg.info("注销用户，成功！");       
            }else{
                Frame.Msg.info("注销用户，失败！","error"); 
            }

        }

        function kickOut_renzhengFail(error){
            Frame.Msg.info("注销用户，失败！","error");             
        }
        
        //准备data数组
        var dataArray=[];
        $.each(odata,function(i,item){
            dataArray[i]={};
            dataArray[i].userIp=item.clientIP;
            dataArray[i].userName=item.portalUserName;
            dataArray.push(dataArray[i]);            
        });



        var kickOut_renzhengOpt = {
            type: "POST",
            url: v2path+"/onlineuser/kickout",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                "ownerName":FrameInfo.g_user.attributes.name,
                "nasId":FrameInfo.Nasid,
                "storeName": Utils.Device.deviceInfo.shop_name,
                data:dataArray
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

            if(data.errorcode==0){
                // 需要我刷新list吗
                Fresh();

                Frame.Msg.info("清除在线状态，成功！");       
            }else{
                Frame.Msg.info("清除在线状态，失败！","error"); 
            }

        }

        function kickOut_renzhengFail(error){
          Frame.Msg.info("清除在线状态，失败！","error");  
        }
        
        //准备data数组
        var dataArray=[];
        $.each(odata,function(i,item){
            dataArray[i]={};
            dataArray[i].userIp=item.UserIP;
            dataArray[i].userName=item.UserName;
            dataArray.push(dataArray[i]);            
        });



        var kickOut_renzhengOpt = {
            type: "POST",
            url: v2path+"/onlineuser/kickout",
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify({
                "ownerName":FrameInfo.g_user.attributes.name,
                "nasId":FrameInfo.Nasid,
                "storeName": Utils.Device.deviceInfo.shop_name,
                data:dataArray
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
           
        //
        $("#return").on('click', fanHui);

        //3个radio按钮
        $("#jiben").on('click', jibenInfo);
        $("#shepin").on('click', shepinInfo);
        $("#tongji").on('click', tongjiInfo);
        $("#yonghu").on('click', yonghuInfo);
        $("#newOutline").on('click', newOutlineInfo);

        //链接的click事件
        $("#clients_list").on('click', 'a.list-link', onViewClient1);
        $("#clients_list_sp").on('click', 'a.list-link', onViewClient1);
        $("#clients_list_tj").on('click', 'a.list-link', onViewClient1);
        $("#clients_list_yh").on('click', 'a.list-link', onViewClient1);
    }   


    function initData(whatList){
        //dangqianyeshujuyoujitiao000000000000
        var skipnum=0;
        var pagesize=10;
        var shaiXuan={"findoption":{},"sortoption":{}};
        
        var whatList=whatList;
        initDLData(skipnum,pagesize,shaiXuan,whatList);
        initData_newLX(); /* 2016.11.22 初始化刷新离线列表 */
    }


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
                pendingDlg.close(100); /* 2016.11.22 添加 正在接受数据提示框 */
                // if(data.errorcode == 0)
                if(!data.errcode)
                {
                    //给哪个list刷数据
                    if(naGeList==0){

                        g_jMList.SList("refresh",{data:data.clientList,total:data.count_total});
                    
                    }else if(naGeList==1){

                        g_jMListSP.SList("refresh",{data:data.clientList,total:data.count_total});
                    
                    }else if(naGeList==2){

                        g_jMListTJ.SList("refresh",{data:data.clientList,total:data.count_total});
                    
                    }else if(naGeList==3){

                        $("#clients_list_yh").SList("refresh",{data:data.clientList,total:data.count_total});
                    
                    }else if(naGeList=="quanbu"){

                        g_jMListSP.SList("refresh",{data:data.clientList,total:data.count_total});
                        g_jMList.SList("refresh",{data:data.clientList,total:data.count_total});
                        g_jMListTJ.SList("refresh",{data:data.clientList,total:data.count_total});
                        $("#clients_list_yh").SList("refresh",{data:data.clientList,total:data.count_total});
                    
                    }else{
                        console.log('here is try catch.');
                    }
                    
                }else{
                    console.log('请求失败');
                }
            }


            function stationlistFail(err){
                pendingDlg.close(100); /* 2016.11.22 添加 正在接受数据提示框 */
                console.log("ajax request fail:"+err);
            }

            
            var url=MyConfig.path+"/stamonitor/stationlist_page?devSN="+FrameInfo.ACSN;
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
            var pendingDlg = Frame.Msg.pending("正在接收数据"); /* 2016.11.22 添加 正在接受数据提示框 */

    }


    function initData_newLX(){
        //dangqianyeshujuyoujitiao000000000000
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



        
    function _init(){
        // NC = Utils.Pages[MODULE_NC].NC;
        initForm();

        g_jMList = $ ("#clients_list");
        g_jMListSP = $ ("#clients_list_sp");
        g_jMListTJ = $ ("#clients_list_tj");

        $("input[name='sanzhong-info'][id='jiben']",$("#anniumen")).click();
        jibenInfo();

        initGrid ();

        initData("quanbu");
        
        initFenJiFenQuan();

    }

    function initFenJiFenQuan()
    {
        //1 获取到数组
        var arrayShuZu=[];
        arrayShuZu=Frame.Permission.getCurPermission();
        
        //2 将数组作简洁处理
        var arrayShuZuNew=[];
        $.each(arrayShuZu,function(i,item){
            var itemNew=item.split('_')[1];
            arrayShuZuNew.push(itemNew);
        });
        // console.log(arrayShuZuNew);

        //3 作具体的“显示、隐藏”处理
        if($.inArray("EXEC",arrayShuZuNew)==-1){
            //隐藏“执行”的功能
            //执行
            ($(".slist-button[title='"+getRcText("EXPORT_LOG")+"']")) .css('display','none');
            ($(".slist-button[title='"+getRcText("KICKOUT_renzheng")+"']")) .css('display','none');
            ($(".slist-button[title='"+getRcText("KICKOUT_ALL")+"']")) .css('display','none');
            ($(".slist-button[title='"+getRcText("KICKOUT_lixian")+"']")) .css('display','none');
                
        }

        if($.inArray("WRITE",arrayShuZuNew)==-1){
            //隐藏“写”的功能
            //写（无）
        }
    }

    function _destroy(){
        g_jMList = null;
        g_jMListSP = null;
        g_jMListTJ = null;

        console.log("destory******无线终端跳转页********");
        Utils.Request.clearMoudleAjax(MODULE_NAME);        
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Minput","Form"],
        "utils": ["Request", "Base","Device"]
        
    });
})(jQuery);
