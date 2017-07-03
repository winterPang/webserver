(function ($){

    var MODULE_BASE = "city_apinfo";
    var MODULE_NAME = MODULE_BASE + ".index";
    var MODULE_RC   = "apinfo_rc";
    var MODULE_NP_APLIST = MODULE_BASE + ".aplist";
    var oInfor = {};

    function getRcText(sRcName){
        return Utils.Base.getRcString(MODULE_RC, sRcName);
    }

   
    function Fresh(){
        Utils.Base.refreshCurPage();
    }
    /*function Fresh(){
        return $.ajax({
            type: "GEt",
            url:MyConfig.v2path+"/syncAc?acsn="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            success:function(data){
                if(data&&data.error_code=="0"){
                    Utils.Base.refreshCurPage();
                }else{
                    Frame.Msg.info(data.error_message);
                }
            },
            error:function(err){

            }

        })
    }*/


    function initData(){

        // --ap在线数目
            function getAPCountDataSuc(data){
                if('{"errcode":"Invalid request"}' == data){
                    alert("没有权限")
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
                    alert("没有权限")
                }
                else{
                    var names = [];
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
        // --ap组
            function getAPGroupDataSuc(data){
                if('{"errcode":"Invalid request"}' == data){
                    alert("没有权限")
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
                    alert("没有权限")
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
                    alert("没有权限")
                }
                else{
                    if(data.apList.length==0){
                        drawEmptyPie($("#ApType_pie"));
                        return;
                    }
                    else{
                        var datas = data.apList;
                        var aType2 = [
                            {name:'在线的手工AP',value:(datas[0].ApCount==0)?undefined:datas[0].ApCount},
                            {name:'自动AP',value:(datas[1].ApCount==0)?undefined:datas[1].ApCount},
                            {name:'离线的手工AP',value:(datas[2].ApCount==0)?undefined:datas[2].ApCount},
                            {name:'未认证的AP',value:(datas[3].ApCount==0)?undefined:datas[3].ApCount}
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
        // --终端数
            function getClientDataSuc(data){
                if('{"errcode":"Invalid request"}' == data){
                    alert("没有权限")
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
                            {name:"101以上",value : (datas[7].count==0)?undefined:datas[7].count}
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
        // draw();

    }

    function initForm(){
        var optGroup = {
            height:280,
            showHeader: true,
            multiSelect: false,
            pageSize : 5,
            colNames: getRcText ("GROUP_HEADER"),
            colModel: [
                 {name: "ApGroupName", datatype: "String"},
                 {name: "ApCount", datatype: "Interger"},
                {name: "location", datatype: "String"}
            ]

        };
        $("#ApGroup_list").SList ("head", optGroup);

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
    }

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
            // legend: {
            //     orient : 'horizontal',
            //     x : '50%',
            //     y :'18%',
            //     data:['0','1~10','','11~20','21~40','','41~60','61~80','','81~100','101以上'],
            //     itemWidth:60
            // },
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : ['37%','55%'],
                    center: ['25%', '35%'],
                    itemStyle : dataStyle,
                    data:aData
                }
            ],
            click: onClickPie
        };
        function onClickPie (oPiece) 
        {
        // $.ajax({
        //     url:MyConfig.path+"/devmonitor/statistic_bymode_detail",
        //     type: "GET",
        //     dataType: "json",
        //     data:{
        //         devMode:oPiece.name,
        //         skipnum:0,
        //         limitnum:100000
        //     },
        //     success: function(data){
        //         var all=getModeList(data.acList);
        //         $("#ByModePopList").SList("refresh",all);
        //         Utils.Base.openDlg(null, {}, {scope:$("#ByModePop_diag"),className:"modal-super dashboard"});
        //         return false;
        //     },
        //     error: function(){
               
        //     }
        // });
            var all = {};
            $("#endnumPopList").SList("refresh",all);
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
// 基于ap类型
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
            // legend: {
            //     orient : 'vertical',
            //     x :'65%',
            //     y:'18%',
            //     // padding: 260,
            //     data:['在线的手工AP','自动AP','离线的手工AP','未认证的AP']
            // },
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : ['37%','55%'],
                    center: ['25%', '35%'],
                    itemStyle : dataStyle,
                    data:aInData
                }
            ]
            ,click: onClickChannelPie 
        };
        function onClickChannelPie (oPiece) 
    {
        // $.ajax({
        //     url:MyConfig.path+"/devmonitor/statistic_bymode_detail",
        //     type: "GET",
        //     dataType: "json",
        //     data:{
        //         devMode:oPiece.name,
        //         skipnum:0,
        //         limitnum:100000
        //     },
        //     success: function(data){
        //         var all=getModeList(data.acList);
        //         $("#ByModePopList").SList("refresh",all);
        //         Utils.Base.openDlg(null, {}, {scope:$("#ByModePop_diag"),className:"modal-super dashboard"});
        //         return false;
        //     },
        //     error: function(){
               
        //     }
        // });
        var all =[];
        $("#endtypePopList").SList("refresh",all);
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
                    center: ['65%', '55%'],
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

        $("#apinfo_lotSelt").singleSelect("InitData", ["北京市", "东城区", "西城区", "宣武区","崇文区","朝阳区", "海淀区", "昌平区", "丰台区", "石景山区", "门头沟区"]);

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
        "widgets": ["Echart","Minput","SList","Form","SingleSelect"],
        "utils": ["Base", "Request"]

    });

}) (jQuery);;