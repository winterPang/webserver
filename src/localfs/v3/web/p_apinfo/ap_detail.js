/**
 * clientlist.js
 */
;(function ($){
    var MODULE_BASE = "p_apinfo",
        MODULE_NAME = MODULE_BASE+".ap_detail",
        g_jMList = null,
        g_jMListSP = null,
        g_jMListTJ = null;
    var v2path = MyConfig.v2path;
    // var g_oTableData = [];
    var SKIP=0;
    var LIMIT=10;

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

    function datatime (argument) {
        
        var day  = parseInt(argument/86400);
        var temp = argument%86400;
        var hour = parseInt(temp/3600);
        temp = argument%3600;
        var mini = parseInt(temp/60);
        var sec  = argument%60;
        if (hour < 10)
        {
            var sDatatime = day+":0"+hour;
        }
        else
        {
            var sDatatime = day+":"+hour;
        }
        if (mini < 10)
        {
             sDatatime = sDatatime+":0"+mini;
        } else 
        {
             sDatatime = sDatatime+":"+mini;
        }
        if (sec < 10)
        {
            sDatatime = sDatatime+":0"+sec;
        } else 
        {
            sDatatime = sDatatime+":"+sec;
        }
        return sDatatime;
    }

    function showRadio5(obj)
    {
        var sRadio = 0;
        $.each(obj,function(index,oDate){
            (oDate.radioMode == "5G")? sRadio++:sRadio;       
        });
        return sRadio;
    }
    function showRadio2(obj)
    {
        var sRadio = 0;
         $.each(obj,function(index,oDate){
            (oDate.radioMode == "2.4G")? sRadio++:sRadio; 
        });
        return sRadio;
    }

    function Traffic(up,down)
    {            
        return parseInt(up)+'/'+parseInt(down);
    }

    function onLineTime(num){
        var time = (num.status == 1)? datatime(num.onlineTime) :
                ((num.status == 2)? aStatus[num.status] : getRcText ("ALOAD"));
        return time ;
    }

    var aStatus = getRcText("STATUS").split(',');

    function onViewClient1(){
        var arowdata = $(this).attr("lala");

        var arowdataobject={};
        arowdataobject=JSON.parse(arowdata);

        onViewClient(arowdataobject);
    }

    function onViewClient(aRowData){

        //在弹出框中刷数据
        var data = {};
        $.extend(data,aRowData);    

        //处理“终端厂商”字段
        if(data.clientVendor==""){
            data.clientVendor=getRcText ("OTHER");
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
            // return "未知";
            return getRcText("WEIZHI");
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
            // return '无';
            return getRcText("NULL");
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
         Utils.Base.redirect ({np:"p_apinfo.index"});
         return false;         
    }

    function jibenInfo(){
        g_jMList.show();
        g_jMList.SList("resize");

        g_jMListSP.hide();
        g_jMListTJ.hide();
        $("#clients_list_yh").hide();
    }
    
    function shepinInfo(){
        g_jMList.hide();

        g_jMListSP.show();
        g_jMListSP.SList("resize");

        g_jMListTJ.hide();
        $("#clients_list_yh").hide();
    }

    function tongjiInfo(){
        g_jMList.hide();
        g_jMListSP.hide();

        g_jMListTJ.show();  
        g_jMListTJ.SList("resize");  

        $("#clients_list_yh").hide(); 
        // $("#clients_list_lx").hide();
        // g_jMListTJ.SList("refresh",g_oTableData);  
    }

    function yonghuInfo(){
        g_jMList.hide();
        g_jMListSP.hide();
        g_jMListTJ.hide();
        // $("#clients_list_lx").hide();        
        $("#clients_list_yh").show();
        $("#clients_list_yh").SList("resize");
        // g_jMListYH.SList("refresh",g_oTableData);     
    }

    function newOutlineInfo(){
        g_jMList.hide();
        g_jMListSP.hide();
        g_jMListTJ.hide();        
        $("#clients_list_yh").hide();
        // $("#clients_list_lx").show();
        // $("#clients_list_lx").SList("resize");     
    }


    function Fresh(){
        // 刷新整个页面
        Utils.Base.refreshCurPage(); 
        
        //刷新当前radio部分
        // var biaoShiIndex=$("input[name='sanzhong-info']:checked",$("#anniumen")).attr("id");
        // if(biaoShiIndex=="jiben"){ 

        //     initData(biaoShiIndex);

        // }else if(biaoShiIndex=="shepin"){

        //     initData(biaoShiIndex);

        // }else if(biaoShiIndex=="tongji"){

        //     initData(biaoShiIndex);

        // }else if(biaoShiIndex=="yonghu"){

        //     initData(biaoShiIndex);

        // }else if(biaoShiIndex=="newOutline"){

        //     initData(biaoShiIndex);

        // }else{
        //     console.log('try catch');
        // }
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
            url: "/v3/fs/exportApsList",
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

    function shiFouYiXuanZe(odata){
        if(odata.length==0){
            return false;
        }else{
            return true;           
        }
    }
//--------------------------------------------------------------------------刷数据所调用的函数

    function initDLData(pageNum, valueOfskipnum, valueOflimitnum, postOfData, ListOfName){            
        function stationlistOK(data){
            //给哪个list刷数据
            console.log(data);
            if(ListOfName=="jiben"){
                var resfrsh = [];
                $.each(data.apList,function(index,iDate){
                    iDate.apName = iDate.apName;
                    iDate.apModel = iDate.apModel;
                    iDate.apSN = iDate.apSN;
                    iDate.apGroupName = iDate.apGroupName;
                    iDate.macAddr = iDate.macAddr;
                    iDate.ipv4Addr = iDate.ipv4Addr;
                    resfrsh.push(iDate);
                });

                g_jMList.SList("refresh", {total:data.count_total,pageNum:pageNum,data:resfrsh});

            }else if(ListOfName=="shepin"){
                var resfrsh = [];
                $.each(data.apList,function(index,iDate1){

                    $.each(data.apList[index].radioList,function(index,iDate2){

                        var  iDate = {};
                        iDate.apName = iDate1.apName;
                        iDate.apModel = iDate1.apModel;
                        iDate.apSN = iDate1.apSN;
                        iDate.radioId = iDate2.radioId;
                        iDate.radioChannel = iDate2.radioChannel;
                        iDate.radioPower = iDate2.radioPower;
                        resfrsh.push(iDate);
                    });
                });   
                g_jMListSP.SList("refresh",{total:data.count_total,pageNum:pageNum,data:resfrsh});
            
            }else if(ListOfName=="tongji"){

                var resfrsh = [];
                $.each(data.apList,function(index,iDate2){

                        var  iDate = {};
                        iDate.apName = iDate2.apName;
                        iDate.apModel = iDate2.apModel;
                        iDate.apSN = iDate2.apSN;
                        iDate.onlineTime = onLineTime(iDate2);
                        iDate.macAddr = iDate2.macAddr;
                        iDate.ipv4Addr = iDate2.ipv4Addr;
                        resfrsh.push(iDate);
                });   
                g_jMListTJ.SList("refresh",{total:data.count_total,pageNum:pageNum,data:resfrsh});
            
            }else if(ListOfName=="yonghu"){

                var resfrsh = [];
                $.each(data.apList,function(index,iDate3){
                    var  iDate = {};
                    iDate.apName = iDate3.apName;
                    iDate.apModel = iDate3.apModel;
                    iDate.apSN = iDate3.apSN;
                    iDate.clientCount5 = showRadio5(iDate3.radioList);
                    iDate.clientCount2 = showRadio2(iDate3.radioList);
                    resfrsh.push(iDate);
                });   
                $("#clients_list_yh").SList("refresh",{total:data.count_total,pageNum:pageNum,data:resfrsh});
            }

        }

        function stationlistFail(err){
            
        }
        
        var url=MyConfig.path+"/apmonitor/app/aplist_page?devSN="+FrameInfo.ACSN;
        var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;
        url=url+requestData;

        var stationlist = {
            type:"POST",
            url:url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(postOfData),
            onSuccess:stationlistOK,
            onFailed:stationlistFail
        };

        Utils.Request.sendRequest(stationlist);
    }
//-------------------------------------------------------------------------------表头    
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
                var postOfData = {
                    findoption: {},
                    sortoption: {}
                }
                if( oFilter ) {
                    postOfData.findoption = oFilter;
                }    
                if( oSorter ) {
                    postOfData.sortoption[oSorter.name] = oSorter.isDesc ? -1 : 1;
                }
                var ListOfName="jiben";
                initDLData(pageNum, valueOfskipnum, valueOflimitnum, postOfData, ListOfName);
            },  
            onSearch:function(oFilter,oSorter){
                var pageNum = 1;
                var postOfData = {
                    findoption: {},
                    sortoption: {}
                }
                if( oFilter ) {
                    postOfData.findoption = oFilter;
                }    
                if( oSorter ) {
                    postOfData.sortoption[oSorter.name] = oSorter.isDesc ? -1 : 1;
                }
                var ListOfName="jiben";
                initDLData(pageNum, SKIP, LIMIT, postOfData, ListOfName);
            },
            onSort:function(sName,isDesc){
                var pageNum = 1;
                var postOfData = {
                    sortoption: {}
                }  
                postOfData.sortoption[sName] = isDesc ? -1 : 1;
                var ListOfName="jiben";
                initDLData(pageNum, SKIP, LIMIT, postOfData, ListOfName);
            },                   
            colModel: [
                // {name: "apName", datatype: "String",formatter:showLink},
                {name: "apName", datatype: "String"},
                {name: "apModel", datatype: "String"},
                {name: "apSN", datatype: "String",formatter:jiaGongclientVendor},
                {name: "apGroupName", datatype: "String"},
                {name: "macAddr", datatype: "String"},
                {name: "ipv4Addr", datatype: "String",formatter:jiaGongclientVendor},
                // {name: "ApName", datatype: "String"}
                // {name: "clientSSID", datatype: "String"}

            ], buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow}
                // {name: "default", value:getRcText ("KICKOUT_renzheng"), enable:shiFouYiXuanZe,action:KICKOUT_renzhengOperation},
                // {name: "default", value:getRcText ("KICKOUT_ALL"), action:kickOut_AllOperation}
                     
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
                var postOfData = {
                    findoption: {},
                    sortoption: {}
                }
                if( oFilter ) {
                    postOfData.findoption = oFilter;
                }    
                if( oSorter ) {
                    postOfData.sortoption[oSorter.name] = oSorter.isDesc ? -1 : 1;
                }
                var ListOfName="shepin";
                initDLData(pageNum, valueOfskipnum, valueOflimitnum, postOfData, ListOfName);
            },  
            onSearch:function(oFilter,oSorter){
                var pageNum = 1;
                var postOfData = {
                    findoption: {},
                    sortoption: {}
                }
                if( oFilter ) {
                    postOfData.findoption = oFilter;
                }    
                if( oSorter ) {
                    postOfData.sortoption[oSorter.name] = oSorter.isDesc ? -1 : 1;
                }
                var ListOfName="shepin";
                initDLData(pageNum, SKIP, LIMIT, postOfData, ListOfName);
            },
            onSort:function(sName,isDesc){
                var pageNum = 1;
                var postOfData = {
                    sortoption: {}
                }  
                postOfData.sortoption[sName] = isDesc ? -1 : 1;
                var ListOfName="shepin";
                initDLData(pageNum, SKIP, LIMIT, postOfData, ListOfName);
            },                       
            colModel: [
                // {name: "apName", datatype: "String",width:"",formatter:showLink},
                {name: "apName", datatype: "String"},
                {name: "apModel", datatype: "String",width:""},
                {name: "apSN", datatype: "String",width:""},
                {name: "radioId", datatype: "String",width:""},
                {name: "radioChannel", datatype: "Integer",width:"",formatter:jiaGong0},
                {name: "radioPower", datatype: "Double",width:""}
            ], buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow}
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
                var postOfData = {
                    findoption: {},
                    sortoption: {}
                }
                if( oFilter ) {
                    postOfData.findoption = oFilter;
                }    
                if( oSorter ) {
                    postOfData.sortoption[oSorter.name] = oSorter.isDesc ? -1 : 1;
                }
                var ListOfName="tongji";
                initDLData(pageNum, valueOfskipnum, valueOflimitnum, postOfData, ListOfName);
            },  
            onSearch:function(oFilter,oSorter){
                var pageNum = 1;
                var postOfData = {
                    findoption: {},
                    sortoption: {}
                }
                if( oFilter ) {
                    postOfData.findoption = oFilter;
                }    
                if( oSorter ) {
                    postOfData.sortoption[oSorter.name] = oSorter.isDesc ? -1 : 1;
                }
                var ListOfName="tongji";
                initDLData(pageNum, SKIP, LIMIT, postOfData, ListOfName);
            },
            onSort:function(sName,isDesc){
                var pageNum = 1;
                var postOfData = {
                    sortoption: {}
                }  
                postOfData.sortoption[sName] = isDesc ? -1 : 1;
                var ListOfName="tongji";
                initDLData(pageNum, SKIP, LIMIT, postOfData, ListOfName);
            },                  
            colModel: [
                // {name: "apName", datatype: "String",formatter:showLink},
                {name: "apName", datatype: "String"},
                {name: "apModel", datatype: "String"},
                {name: "apSN", datatype: "String"},
                {name: "onlineTime", datatype:"Integer",formatter:jiaGong0},
                {name: "macAddr", datatype: "Integer",formatter:jiaGong0},
                {name: "ipv4Addr", datatype: "Integer"}
            ], buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action: exportNow}                  
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
                var postOfData = {
                    findoption: {},
                    sortoption: {}
                }
                if( oFilter ) {
                    postOfData.findoption = oFilter;
                }    
                if( oSorter ) {
                    postOfData.sortoption[oSorter.name] = oSorter.isDesc ? -1 : 1;
                }
                var ListOfName="yonghu";
                initDLData(pageNum, valueOfskipnum, valueOflimitnum, postOfData, ListOfName);
            },  
            onSearch:function(oFilter,oSorter){
                var pageNum = 1;
                var postOfData = {
                    findoption: {},
                    sortoption: {}
                }
                if( oFilter ) {
                    postOfData.findoption = oFilter;
                }    
                if( oSorter ) {
                    postOfData.sortoption[oSorter.name] = oSorter.isDesc ? -1 : 1;
                }
                var ListOfName="yonghu";
                initDLData(pageNum, SKIP, LIMIT, postOfData, ListOfName);
            },
            onSort:function(sName,isDesc){
                var pageNum = 1;
                var postOfData = {
                    sortoption: {}
                }  
                postOfData.sortoption[sName] = isDesc ? -1 : 1;
                var ListOfName="yonghu";
                initDLData(pageNum, SKIP, LIMIT, postOfData, ListOfName);
            },      
            colModel: [   

                // {name: "apName", datatype: "String",formatter:showLink},
                {name: "apName", datatype: "String"},
                {name: "apModel", datatype: "String"},
                {name: "apSN", datatype: "String"},                
                {name: "clientCount5", datatype: "String"},
                {name: "clientCount2", datatype: "String",formatter:transferTime}               
                // {name: "clientVendor", datatype: "String",formatter:jiaGongclientVendor},
                
            ], buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow}
            ]
        };
        $("#clients_list_yh").SList ("head", optonlineuser); 
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

    function initData(ListOfName){
        var skipnum=0;
        var pagesize=10;
        var pageNum = 1;
        var postOfData = {
            findoption: {},
            sortoption: {}
        }
        initDLData(pageNum, skipnum, pagesize, postOfData, ListOfName);
    }
        
    function _init(oPara){
        // NC = Utils.Pages[MODULE_NC].NC;
        // initGrid ();
        g_jMList = $ ("#clients_list");
        g_jMListSP = $ ("#clients_list_sp");
        g_jMListTJ = $ ("#clients_list_tj");
        g_jMListYH = $("#clients_list_yh");
        $("input[name='sanzhong-info'][id='jiben']",$("#anniumen")).click();
        $("input[name='sanzhong-info']",$("#anniumen")).click(function(){
            var biaoShiIndex=$("input[name='sanzhong-info']:checked",$("#anniumen")).attr("id");
            if(biaoShiIndex=="jiben"){   
                initData(biaoShiIndex);
                // initData_newLX();
            }else if(biaoShiIndex=="shepin"){
                initData(biaoShiIndex);
                // initData_newLX();
            }else if(biaoShiIndex=="tongji"){
                initData(biaoShiIndex);
                // initData_newLX();
            }else if(biaoShiIndex=="yonghu"){
                initData(biaoShiIndex);
                // initData_newLX();
            }else if(biaoShiIndex=="newOutline"){
                initData(biaoShiIndex);
                // initData_newLX();
            }
        });
        initData("jiben");
        // jibenInfo();
        initGrid ();
        initForm();
        jibenInfo();        
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
        "widgets": ["SList","Minput","Form","MSelect"],
        "utils": ["Request", "Base","Device"]
        
    });
})(jQuery);
