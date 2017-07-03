;(function ($){
    var MODULE_BASE = "p_apinfo";
    var MODULE_NAME = MODULE_BASE + ".index";
    var MODULE_RC   = "apinfo_rc";
    var MODULE_NP_APLIST = MODULE_BASE + ".ap_detail";
    var oInfor = {};
    var SKIP=0;
    var LIMIT=10;
    var apGroupNameOfClick = "";
    var typeIndex = "";
    var clientNumLeft,clientNumRight;
    function getRcText(sRcName){
        return Utils.Base.getRcString(MODULE_RC, sRcName);
    }
    // var aStatus = getRcText("ap_type").split(',');
    function Fresh(){
        Utils.Base.refreshCurPage();
    }
    
    function initData(){

        // --ap在线数目
        function getAPCountDataSuc(data){
            if('{"errcode":"Invalid request"}' == data){
                // alert("没有权限")
            }
            else{
                $("#online").html(data.ap_statistic.online+'');
                $("#offline").html(data.ap_statistic.offline+'');
                $("#unhealthy").html(data.ap_statistic.other+'');
            }
        }

        function getApCountDataFail(err){
            
        }

        var apCount = {
            url: MyConfig.path +'/apmonitor/getApCountByStatus?devSN='+ FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess:getAPCountDataSuc,
            onFailed:getApCountDataFail
        }

        Utils.Request.sendRequest(apCount);
        // --ap型号
        function getAPModelDataSuc(data){
            if('{"errcode":"Invalid request"}' == data){
                // alert("没有权限")
            }
            else{
                var names = [];
                // var data = {
                //     apList: [
                //     {ApModel: "WA3620i-AGN", ApCount: 1}, 
                //     {ApModel: "WA2612", ApCount: 1}]
                // };
                $.each(data.apList,function(index,oData){ 
                   names.push(oData.ApModel);
                });  
                var values = [];
                $.each(data.apList,function(index,oData){ 
                   values.push({name:oData.ApModel,value:oData.ApCount});
                });
                APModel_bar(names,values);
            }
        }

        function getApModelDataFail(err){
            
        }
        var apModel = {
            url: MyConfig.path +'/apmonitor/getApCountByModel?devSN='+ FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess:getAPModelDataSuc,
            onFailed:getApModelDataFail
        }

        Utils.Request.sendRequest(apModel);
        // getAPModelDataSuc();

        // --ap组
        function getAPGroupDataSuc(data){
            if('{"errcode":"Invalid request"}' == data){
                // alert("没有权限")
            }
            else{
                $("#ApGroup_list").SList ("refresh", data.apList);               
            }
        }

        function getApGroupDataFail(err){
            
        }

        var apGroup = {
            url: MyConfig.path +'/apmonitor/getApCountByGroup?devSN='+ FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess:getAPGroupDataSuc,
            onFailed:getApGroupDataFail
        }

        Utils.Request.sendRequest(apGroup);
        // --SSID
        function getSSidSDataSuc(data){
            if('{"errcode":"Invalid request"}' == data){
                // alert("没有权限")
            }
            else{
                $("#ApBasedSsid_list").SList ("refresh", data);
            }
        }

        function getSSidSDataFail(err){
            
        }

        var ssid = {
            url: MyConfig.path +'/apmonitor/getApCountBySsid?devSN='+ FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess:getSSidSDataSuc,
            onFailed:getSSidSDataFail
        }

        Utils.Request.sendRequest(ssid);
        // --ap类型
        function getApTypeDataSuc(data){
            if('{"errcode":"Invalid request"}' == data){
                // alert("没有权限")
            }
            else{
                if(data.apList.length==0 || (data.apList[0].ApCount+data.apList[1].ApCount+data.apList[2].ApCount+data.apList[3].ApCount == 0)){
                    drawEmptyPie($("#ApType_pie"));
                    return;
                }
                else{
                    var datas = data.apList;
                    var aType2 = [
                        {name:getRcText("APOFDATA").split(',')[0],value:(datas[0].ApCount==0)?undefined:datas[0].ApCount},
                        {name:getRcText("APOFDATA").split(',')[1],value:(datas[1].ApCount==0)?undefined:datas[1].ApCount},
                        {name:getRcText("APOFDATA").split(',')[2],value:(datas[2].ApCount==0)?undefined:datas[2].ApCount},
                        {name:getRcText("APOFDATA").split(',')[3],value:(datas[3].ApCount==0)?undefined:datas[3].ApCount}
                    ];
                    ApType_pie(aType2);
                }
            }
        }

        function getApTypeDataFail(err){
            
        }

        var apType = {
            url: MyConfig.path +'/apmonitor/getApCountByMethod?devSN='+ FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess:getApTypeDataSuc,
            onFailed:getApTypeDataFail
        }

        Utils.Request.sendRequest(apType);

        function getClientDataSuc(data){
            if('{"errcode":"Invalid request"}' == data){
                // alert("没有权限")
            }

            else{
                if(data.totalCount==0){
                    drawEmptyPie($("#According_client"));
                    return;
                }
                else{
                    var datas = data.statistics;
                    var type = [
                        {name:"0",value : (datas[0].count==0)?undefined:datas[0].count},
                        {name:"1~10",value : (datas[1].count==0)?undefined:datas[1].count},
                        {name:"11~20",value : (datas[2].count==0)?undefined:datas[2].count},
                        {name:"21~40",value : (datas[3].count==0)?undefined:datas[3].count},
                        {name:"41~60",value : (datas[4].count==0)?undefined:datas[4].count},
                        {name:"61~80",value : (datas[5].count==0)?undefined:datas[5].count},
                        {name:"81~100",value : (datas[6].count==0)?undefined:datas[6].count},
                        {name:getRcText("UP"),value : (datas[7].count==0)?undefined:datas[7].count}
                    ];
                    terminal(type);
                }
            }
        }

        function getClientDataFail(err){
            
        }

        var clientNum = {
            url: MyConfig.path +'/stamonitor/getapstaticbyclientnum?devSN='+ FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            contentType: "application/json",
            onSuccess:getClientDataSuc,
            onFailed:getClientDataFail
        }
        Utils.Request.sendRequest(clientNum);
    }
//-----------------------------------------------------------------基于ap组的表头

    function initForm(){
        var optGroup = {
            height:280,
            showHeader: true,
            multiSelect: false,
            pageSize : 4,
            colNames: getRcText ("GROUP_HEADER"),
            colModel: [
                {name: "ApGroupName", datatype: "String"},
                {name: "ApCount", datatype: "Interger",formatter:showNum}
            ]
        };
        $("#ApGroup_list").SList ("head", optGroup);
        $("#ApGroup_list").SList("resize");
//------------------------------------------------------------------基于AP组弹出框调用的函数

        function initDLData(pageNum,valueOfskipnum,valueOflimitnum,postOfData,apGroupName){           
            function getApListSuc(data){           
                $("#onlineuser_list").SList ("refresh", {total:data.totalCntInGrp,pageNum:pageNum,data:data.apList});
            }
            function getApListFail(err){
                
            }            
            var url=MyConfig.path+"/apmonitor/aplistbygroup?devSN="+FrameInfo.ACSN;
            var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum+"&apGroupName="+apGroupName;
            url=url+requestData;
            var ApListOpt = {
                type:"POST",
                url:url,
                contentType:"application/json",
                dataType:"json",
                data:JSON.stringify(postOfData),
                onSuccess:getApListSuc,
                onFailed:getApListFail
            };
            Utils.Request.sendRequest(ApListOpt);
        }
//----------------------------------------------------------------------------------------点击AP组后弹出的数据

        $("#ApGroup_list").on("click","a",function (){
            apGroupNameOfClick = $(this).attr("ApGroupName");
            var pageNum = 1;
            var postOfData = {
                findoption: {},
                sortoption: {}
            }
            initDLData(pageNum, SKIP, LIMIT, postOfData, apGroupNameOfClick);
            Utils.Base.openDlg(null, {}, {scope:$("#ap_diag"),className:"modal-super dashboard"});
            return false;
        });
//------------------------------------------------------------------------------------基于AP组的彈出框 的表头
        var oSListOptions3 = {
            height:"70",
            showHeader: true,
            asyncPaging: true,
            // showOperation: true,
            pageSize : 10,
            colNames: getRcText ("ALLAP_HEADER3"),
            onPageChange:function(pageNum, pageSize, oFilter, oSorter){
                var valueOfskipnum=(parseInt(pageNum - 1))*(parseInt(pageSize));
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
                initDLData(pageNum, valueOfskipnum, valueOflimitnum, postOfData, apGroupNameOfClick);
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

                initDLData(pageNum, SKIP, LIMIT, postOfData, apGroupNameOfClick);
            },
            onSort:function(sName,isDesc){
                var pageNum = 1;
                var postOfData = {
                    sortoption: {}
                }  
                postOfData.sortoption[sName] = isDesc ? -1 : 1;
                initDLData(pageNum, SKIP, LIMIT, postOfData, apGroupNameOfClick);
            }, 
            colModel: [
                {name: "apName", datatype: "String", width:80}
                ,{name: "apModel", datatype: "String", width:80}
                ,{name: "apSN", datatype: "String", width:80}
                ,{name: "macAddr", datatype: "String", width:80}
            ]
        };

       
        $("#onlineuser_list").SList ("head", oSListOptions3);      

        var optSSID = {
            colNames: getRcText ("SSID_HEADER"),
            showHeader: true,
            pageSize:4,
            colModel: [
                {name:'SSID', datatype:"String"},
                {name:'APNum5', datatype:"String"},
                {name:'APNum2', datatype:"String"}
            ]
        };
        $("#ApBasedSsid_list").SList("head", optSSID);
//--------------------------------------------------------------------------------------基于终端数 弹框的表头
        var optendnum_diag = {
            height:280,
            showHeader: true,
            asyncPaging:true, 
            multiSelect: false,
            pageSize : 10,
            colNames: getRcText ("endnum_diag_header"),
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
                initClientData(pageNum, valueOfskipnum, valueOflimitnum, postOfData, clientNumLeft, clientNumRight);
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
                initClientData(pageNum, SKIP, LIMIT, postOfData, clientNumLeft, clientNumRight);
            },
            onSort:function(sName,isDesc){
                var pageNum = 1;
                var postOfData = {
                    sortoption: {}
                }  
                postOfData.sortoption[sName] = isDesc ? -1 : 1;
                initClientData(pageNum, SKIP, LIMIT, postOfData, clientNumLeft, clientNumRight);
            },
            colModel: [
                 {name: "apName", datatype: "String"},
                 {name: "apModel", datatype: "String"},
                 {name: "clientCount", datatype: "String"}
            ]
        }
        $("#endnumPopList").SList("head",optendnum_diag).SList("resize");
// -------------------------------------------------------------------------------------基于ap类型 弹窗的表头
        var optendtype_diag = {
            height:280,
            showHeader: true,
            asyncPaging:true, 
            multiSelect: false,
            pageSize : 10,
            colNames: getRcText ("ap_diag_header"),
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
                initTypeData(pageNum,valueOfskipnum,valueOflimitnum,postOfData,typeIndex);
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
                initTypeData(pageNum, SKIP, LIMIT, postOfData, typeIndex);
            },
            onSort:function(sName,isDesc){
                var pageNum = 1;
                var postOfData = {
                    sortoption: {}
                }  
                postOfData.sortoption[sName] = isDesc ? -1 : 1;
                initTypeData(pageNum, SKIP, LIMIT, postOfData, typeIndex);
            }, 
            colModel: [
                 {name: "apName", datatype: "String"},
                 {name: "apModel", datatype: "String"},
                 // {name: "apType", datatype: "String"}
            ]
        };
        $("#endtypePopList").SList("head",optendtype_diag);
        $("#endtypePopList").SList("resize");
    }

    function showNum(row, cell, value, columnDef, oRowData,sType)
    {

        var nIndex = -1;
        var sName = oRowData.ApGroupName;

        if(!sName)
        {
            nIndex = 1;
            sName = oRowData.SSID;
        }

        nIndex += cell;

        if(sType == "text")
        {
            return value;
        }

        return '<a href="'+sName+'" index="'+nIndex+'" style="color: #69c4c5;"'+'ApGroupName="'+sName+'">'+ value +'</a>';
    }
//-----------------------------------------------------------------------点击基于终端数饼图后所调用的函数
    function initClientData(pageNum, valueOfskipnum, valueOflimitnum, postOfData, clientNumLeft, clientNumRight){        
        function getApTypeSuc(data){
            // console.log(data);
            var apClientData =[];
            $.each(data.apList,function(index,iDate){
               var apClientDataCreate = {};
                apClientDataCreate.apName = iDate.apName;
                apClientDataCreate.apModel = iDate.apModel;
                apClientDataCreate.clientCount = iDate.clientCount;
                apClientData.push(apClientDataCreate);
            });
            $("#endnumPopList").SList("refresh",{total:data.totalCount,pageNum:pageNum,data:apClientData});
        }
        function getApTypeFail(err){
            
        }            
        var url=MyConfig.path+"/apmonitor/getapstaticbyclientnumforaplist?devSN="+FrameInfo.ACSN;
        var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum+"&clientNumLeft="+clientNumLeft+"&clientNumRight="+clientNumRight;
        url=url+requestData;

        var ApTypeList = {
            type:"POST",
            url:url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(postOfData),
            onSuccess:getApTypeSuc,
            onFailed:getApTypeFail
        };

        Utils.Request.sendRequest(ApTypeList);
    }
//-----------------------------------------------------------------------基于终端数 饼图
    function terminal(aData){
       var dataStyle = { 
                normal: {
                    label : {
                        show: false,
                        position: 'inner',
                        formatter: '{d}%'
                    },
                    labelLine:{
                        show:false
                    },
                    borderColor:'#FFF',
                    borderWidth:1
                }
            };
        var option = {
            height:245,
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
               orient : 'vertical',
      	       x:'10%',
               y:'18%',
               data:['0','1~10','11~20','21~40','','41~60','61~80','81~100','101以上']
            },
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : ['37%','55%'],
                    center: ['50%', '35%'],
                    itemStyle : dataStyle,
                    data:aData
                }
            ],
            click: onClickPie            //------------------------------------点击基于终端数饼图 所调用的函数
        };
        function onClickPie (oPiece) 
        {
            // console.log(oPiece);
            $(".info-tip a.ap_client_name").text(oPiece.name);
            $(".info-tip a.ap_client_num").text(oPiece.value);
            var rangeOfNum = {
                "0" : [0,0],
                "1~10":[1,10],
                "11~20":[11,20],
                "21~40":[21,40],
                "41~60":[41,60],
                "61~80":[61,80],
                "81~100":[81,100],
                "101以上":[101,-1]
            }
            var pageNum = 1;
            var postOfData = {
                findoption: {},
                sortoption: {}
            };
            clientNumLeft = rangeOfNum[oPiece.name][0];
            clientNumRight = rangeOfNum[oPiece.name][1];
            initClientData(pageNum, SKIP, LIMIT, postOfData, clientNumLeft, clientNumRight);
            $(".info-tip").css({
                color:"#4ec1b2",
                fontSize:"15px",
                margin:"13px 0 -6px 22px"
            });
            Utils.Base.openDlg(null, {}, {scope:$("#endnum_diag"),className:"modal-super dashboard"});
        }
        var oTheme={
                color: ['#E7E7E9','#4fcff6','#78cec3','#4EC1B2','#fbceb1','#f9ab77','#ff9c9e','#fe808b']   
        };
        //oTheme.color.reverse();
        $("#According_client").echart("init", option,oTheme);
    }

    function APModel_bar(aModels,aModelData){
        var nEnd = parseInt(700/aModels.length)-1;
        var nWidth = $("#APModel_bar").parent().width()*0.95;
        
        var opt = {
                color: ['#4ec1b2'],
                width: nWidth,
                height: 284,
                grid: {
                    x:40, y:0, x2:80, y2:25,
                    borderColor: 'rgba(0,0,0,0)'
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer:{
                        type : 'line',
                        lineStyle : {
                          color: '#fff',
                          width: 0,
                          type: 'solid'
                        }
                    }
                },
                calculable : false,
                dataZoom : {
                    show : true,
                    realtime : true,
                    start : 0,
                    zoomLock: true,
                    orient: "vertical",
                    width: 10,
                    x: nWidth-10,
                    end: nEnd,
                    backgroundColor:'#F7F9F8',
                    fillerColor:'#BEC7CE',
                    handleColor:'#BEC7CE'
                },
                xAxis : [
                    {
                        type : 'value',
                        splitLine : {
                            show:false,
                            lineStyle: {
                                color: '#373737',
                                type: 'solid',
                                width: 1
                            }
                        },
                        splitArea : {
                            areaStyle : {
                                color: '#174686'
                            }
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#373737', width: 1}
                        }
                    }
                ],
                yAxis : [
                    {
                        show: true,
                        type : 'category',
                        boundaryGap : true,
                        data : aModels,
                        axisLabel:{
                            show:false,
                            textStyle: {color:"#80878c"}
                        },
                        splitLine : {
                            show:false
                        },
                        splitArea : {
                            areaStyle : {
                                color: '#174686'
                            }
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#373737', width: 1}
                        }
                    }
                ],
                series : [
                    {
                        type:'bar',
                        data: aModelData,
                        itemStyle : { 
                            normal: {
                                label : {
                                    show: true, 
                                    position: 'insideLeft',
                                    formatter: function(x, y, val){
                                        return x.name;
                                    },
                                    textStyle: {color:"#000"}
                                }
                            },
                            emphasis: {
                                label : {
                                    show: true,
                                    formatter: function(x, y, val){
                                        return x.name;
                                    },
                                    textStyle: {color:"#000"}
                                }
                            }
                        }
                    }
                ]
        };
        $("#APModel_bar").echart("init", opt);
    }
// 点击 基于ap类型后所调用的接口---------------------------------------基于ap类型弹出接口
function initTypeData(pageNum, valueOfskipnum, valueOflimitnum, postOfData, typeIndex){        
        function getApTypeSuc(data){
            // console.log(data);
            var apTypeData =[];
            $.each(data.apList,function(index,iDate){
               var apTypeDataCreate = {};
                apTypeDataCreate.apName = iDate.apName;
                apTypeDataCreate.apModel = iDate.apModel;
                apTypeData.push(apTypeDataCreate);
               $("#endtypePopList").SList("refresh",{total:data.totalCount,pageNum:pageNum,data:apTypeData});
            });
        }
        function getApTypeFail(err){
            
        }            
        var url=MyConfig.path+"/apmonitor/getApCountByMethodForApList?devSN="+FrameInfo.ACSN;
        var requestData ="&skipnum="+valueOfskipnum+"&limitnum="+valueOflimitnum+"&CreateMethod="+typeIndex;
        url=url+requestData;

        var ApTypeList = {
            type:"POST",
            url:url,
            contentType:"application/json",
            dataType:"json",
            data:JSON.stringify(postOfData),
            onSuccess:getApTypeSuc,
            onFailed:getApTypeFail
        };

        Utils.Request.sendRequest(ApTypeList);
    }
// 基于ap类型--------------------------------------------------------------------基于ap类型------
        // var apOfData = 
    function ApType_pie(aInData)
    {
        var dataStyle = { 
                normal: {
                    label : {
                        show: false,
                        position: 'inner',
                        formatter: '{d}%'
                    },
                    labelLine:{
                        show:false
                    },
                    borderColor:'#FFF',
                    borderWidth:1
                }
            };

        var option = {
            height:245,
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x :'10%',
                y:'18%',
                padding: 260,
                // data:['在线的手工AP','自动AP','离线的手工AP','未认证的AP']
                data: getRcText("APOFDATA").split(',')
            },
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : ['37%','55%'],
                    center: ['50%', '35%'],
                    itemStyle : dataStyle,
                    data:aInData
                }
            ]
            ,click: onClickChannelPie  //-------------------------点击 基于ap类型饼图所调用的函数
        };
        function onClickChannelPie (oPiece) 
        {
            // console.log(oPiece);
            $(".info-tip a.ap_type_value").text(oPiece.name);
            $(".info-tip a.ap_type_num").text(oPiece.value);
            typeIndex = option.legend.data.indexOf(oPiece.name) + 1;
            var pageNum = 1;
            var postOfData = {
                findoption: {},
                sortoption: {}
            }        
            $(".info-tip").css({
                color:"#4ec1b2",
                fontSize:"15px",
                margin:"13px 0 -6px 22px"
            });
            initTypeData(pageNum, SKIP, LIMIT, postOfData, typeIndex);
            Utils.Base.openDlg(null, {}, {scope:$("#endtype_diag"),className:"modal-super dashboard"});
        }
        var oTheme={
            color: ['#4EC1B2','#78CEC3','#D2D2D2','#E7E7E9','#ABD6F5','#86C5F2','#63B4EF','#3DA0EB','#1683D3','#136FB3']     
        };
        $("#ApType_pie").echart ("init", option,oTheme);
        // var appendTohtml = [
        //     '<div class="text-style"><div ',
        //     '><span style="font-size: 23px;display: block;float: left;margin-left: 2px;">',
        //     '终端类型',
        //     '</span>',
        //     '</div></div>'
        //     ].join(" ");
        // $(appendTohtml).appendTo($("#ApType_pie"));
    }
    //---------当没有数据时显示的灰色饼图
    function drawEmptyPie(jEle)
    {
        var option = {
            height:245,
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : '65%',
                    center: ['25%', '35%'],
                    itemStyle: {
                        normal: {
                            // borderColor:"#FFF",
                            // borderWidth:1,
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner"
                            }
                        }
                    },
                    data: [{name:'N/A',value:1}]
                }
            ]
        };
        var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
        
        jEle.echart("init", option,oTheme);
    }

    function _init(){
        
        $(".js-apinfo .js-aplist").click(function(){                
            Utils.Base.redirect({np:MODULE_NP_APLIST});
            return false;
        });

        initForm();
        initData();
        // ApType_pie(aType2);
        // terminal(aType3);
        // APModel_bar(yData,seriesData);
    }
    function _resize (jParent)
    {
    }

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Minput","SList","Form"],
        "utils": ["Base", "Request"]

    });

}) (jQuery);;