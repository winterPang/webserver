/**
 * clientlist.js
 */
;(function ($){
    var MODULE_BASE = "hq_apinfo",
        MODULE_NAME = MODULE_BASE+".aplist",
        
        g_jMList = null,
        g_jMListSP = null,
        g_jMListTJ = null;
    
        var v2path = MyConfig.v2path;
        var branchReqValueReceive="";


    function getRcText (sRcId){
        return Utils.Base.getRcString ("clients_rc", sRcId);
    }



    //返回至首页面
    function fanHui(){
         Utils.Base.redirect ({np:"hq_apinfo.index"});
         return false;         
    }

    // 5张表，切换显示
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
          
    }

    function yonghuInfo(){
        g_jMList.hide();
        g_jMListSP.hide();
        g_jMListTJ.hide();
       
        
        $("#clients_list_yh").show();
        $("#clients_list_yh").SList("resize");     
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
        }else if(biaoShiIndex=="shepin"){
            initData("quanbu");
        }else if(biaoShiIndex=="tongji"){
            initData("quanbu");
        }else if(biaoShiIndex=="yonghu"){
            initData("quanbu");
        }else{
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
        
        var exportOpt = {
            url: "/v3/fs/exportApsList",
            type: "POST",
            contentType:"application/json",
            dataType: "json",
            data:JSON.stringify({
                devSN: FrameInfo.ACSN,
                branch: branchReqValueReceive.slice(8)
            }),
            onSuccess: exportSuc,
            onFailed: exportFail
        };

        Utils.Request.sendRequest(exportOpt);
    }


    // 筛选条件声明
    function shengMing_sstj(){
        if(branchReqValueReceive==""){
            $("#shengMing_all").hide();

        }else if(branchReqValueReceive!=""){
            $("#shengMing_all").show();
            $("#shengMing_branchValue").html(branchReqValueReceive.slice(8));

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
                {name: "apName", datatype: "String",formatter:showLink},
                {name: "apModel", datatype: "String"},
                {name: "apSN", datatype: "String"},
                {name: "apGroupName", datatype: "String"},
                {name: "branchName", datatype: "String"},
                {name: "macAddr", datatype: "String"},
                {name: "ipv4Addr", datatype: "String"},
                {name: "ipv6Addr", datatype: "String"}
                     
            ], buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow}                     
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
                // ,formatter:showLink
                {name: "apName", datatype: "String",width:""},
                {name: "apModel", datatype: "String",width:""},
                {name: "radio", datatype: "String"},
                {name: "radioChannel", datatype: "String",width:""},
                {name: "radioPower", datatype: "String"}
                     
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
                {name: "apName", datatype: "String",formatter:showLink},
                {name: "macAddr", datatype: "String"},
                {name: "ipv4Addr", datatype: "String"},
                {name: "ipv6Addr", datatype: "String"},
                {name: "onlineTime", datatype: "String"}
                     
            ], buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh},
                {name: "default", value:getRcText ("EXPORT_LOG"), action:exportNow}
                  
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

                {name: "apName", datatype: "String",formatter:showLink},
                {name: "client5GNum", datatype: "String"},
                {name: "client24GNum", datatype: "String"}
                
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
           
        //返回上一页
        $("#return").on('click', fanHui);

        //切换表
        $("#jiben").on('click', jibenInfo);
        $("#shepin").on('click', shepinInfo);
        $("#tongji").on('click', tongjiInfo);
        $("#yonghu").on('click', yonghuInfo);

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

                        g_jMList.SList("refresh",{data:data.apList,total:data.count_total});
                    
                    }else if(naGeList==1){

                        // g_jMListSP.SList("refresh",{data:data.apList,total:data.count_total});
                    
                    }else if(naGeList==2){

                        g_jMListTJ.SList("refresh",{data:data.apList,total:data.count_total});
                    
                    }else if(naGeList==3){

                        $("#clients_list_yh").SList("refresh",{data:data.apList,total:data.count_total});
                    
                    }else if(naGeList=="quanbu"){

                        // g_jMListSP.SList("refresh",{data:data.apList,total:data.count_total});
                        g_jMList.SList("refresh",{data:data.apList,total:data.count_total});
                        g_jMListTJ.SList("refresh",{data:data.apList,total:data.count_total});
                        $("#clients_list_yh").SList("refresh",{data:data.apList,total:data.count_total});
                    
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

            
            var url=MyConfig.path+"/apmonitor/getaplist_page?devSN="+FrameInfo.ACSN+branchReqValueReceive;
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


            // Utils.Request.sendRequest(stationlist);

            //射频信息，单独发请求[2016/08/17 周三]
            function station3listOK(data){
                // if(data.errorcode == 0)
                if(!data.errcode)
                {
                    //给哪个list刷数据
                    if(naGeList==0){
                    
                    }else if(naGeList==1){

                        g_jMListSP.SList("refresh",{data:data.radioList,total:data.totalCount});
                    
                    }else if(naGeList==2){
                    
                    }else if(naGeList==3){
                    
                    }else if(naGeList=="quanbu"){
                        g_jMListSP.SList("refresh",{data:data.radioList,total:data.totalCount});                    
                    }else{
                        console.log('here is try catch.');
                    }
                    
                }else{
                    console.log('请求失败');
                }
            }


            function station3listFail(err){
                console.log("ajax request fail:"+err);
            }

            
            var url3=MyConfig.path+"/apmonitor/getRadioListByPage?devSN="+FrameInfo.ACSN+branchReqValueReceive;
            var requestData3 ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum;
            url3=url3+requestData3;

            var stationlist3 = {
                type:"POST",
                url:url3,
                contentType:"application/json",
                dataType:"json",
                data:JSON.stringify(requestDataPost),
                onSuccess:station3listOK,
                onFailed:station3listFail
            };


            // Utils.Request.sendRequest(stationlist3);

            //发请求
            if(naGeList==0||naGeList==2||naGeList==3){
                Utils.Request.sendRequest(stationlist);

            }else if(naGeList==1){
                Utils.Request.sendRequest(stationlist3);

            }else if(naGeList=="quanbu"){
                Utils.Request.sendRequest(stationlist);
                Utils.Request.sendRequest(stationlist3);
            }
    }





        
    function _init(oPara){
        // NC = Utils.Pages[MODULE_NC].NC;

        var oPara = Utils.Base.parseUrlPara();        
        branchReqValueReceive=oPara.branchReqValueSend;

        initForm();

        g_jMList = $ ("#clients_list");
        g_jMListSP = $ ("#clients_list_sp");
        g_jMListTJ = $ ("#clients_list_tj");

        // 5个表，第一个radio按钮选中
        $("input[name='sanzhong-info'][id='jiben']",$("#anniumen")).click();

        // 5个表，第一张表选中
        jibenInfo();

        shengMing_sstj();
        initGrid ();

        initData("quanbu");
        

    }

    function _destroy(){
        g_jMList = null;
        g_jMListSP = null;
        g_jMListTJ = null;

        console.log("*******商业连锁总部//AP信息//AP跳转页*******GO OUT>>>>");
        Utils.Request.clearMoudleAjax(MODULE_NAME);        
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Minput","Form"],
        "utils": ["Request", "Base"]
        
    });
})(jQuery);
