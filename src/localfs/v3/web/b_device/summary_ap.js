(function ($){

    var MODULE_BASE = "b_device";
    var MODULE_NAME = MODULE_BASE + ".summary_ap";
    var MODULE_RC   = "apinfo_rc";
    var MODULE_NP_APLIST = MODULE_BASE + ".ap_detail";
    var aType2;//假数据
    //var oInfor = {};

    function getRcText(sRcName){
        return Utils.Base.getRcString(MODULE_RC, sRcName);
    }

    function draw(){
        var optGroup = {
            height:280,
            showHeader: true,
            multiSelect: false,
            pageSize : 5,
            colNames: getRcText ("GROUP_HEADER"),
            colModel: [
                 {name: "DeviceGroupName", datatype: "String"},
                 {name: "DeviceCount", datatype: "Interger"}
                 //{name: "ApGroupName", datatype: "String"},
                 //{name: "ApCount", datatype: "Interger"}
            ]

        };
        $("#DevGroup_list").SList ("head", optGroup);
        $("#DevGroup_list").SList("refresh",[{"DeviceGroupName":"h3c","DeviceCount":"100"}]);

        var optGroup1 = {
            height:280,
            showHeader: true,
            multiSelect: false,
            pageSize : 5,
            colNames: getRcText ("APGROUP_HEADER"),
            colModel: [
                {name: "DeviceName", datatype: "String"},
                {name: "DeviceCount", datatype: "Interger"}
            ]

        };
        $("#Device_list").SList ("head", optGroup1);
        $("#Device_list").SList("refresh",[{"DeviceName":"h3c","DeviceCount":"200"}]);


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
        $("#ApBasedSsid_list").SList ("head", optSSID);

        
        // ---------------------------用ajax获取真实数据-------------------------------------------------

            //// --ap在线数目
            //$.ajax({
            //    url: MyConfig.path +'/apmonitor/getApCountByStatus?devSN='+ FrameInfo.ACSN,
            //    type: "GET",
            //    dataType: "json",
            //    contentType: "application/json",
            //}).done(function(data){
            //    if('{"errcode":"illegal access"}' == data){
            //        alert("没有权限")
            //    }
            //    else{
            //        $("#online").html(data.ap_statistic.online+'');
            //        $("#offline").html(data.ap_statistic.offline+'');
            //        $("#unhealthy").html(data.ap_statistic.other+'');
            //    }
            //
            //    // alert(data.apList.length )
            //    // debugger
            //})
            //.fail()
            //.always();


            // --ap型号
            // $.ajax({
            //     url: MyConfig.path +'/apmonitor/getApCountByModel?devSN='+ FrameInfo.ACSN,
            //     type: "GET",
            //     dataType: "json",
            //     contentType: "application/json",
            // }).done(function(data){
            //     if('{"errcode":"illegal access"}' == data){
            //         // alert("没有权限")
            //         return;
            //     }
            //     else{
            //         var names = [];
            //         $.each(data.apList,function(index,oData){
            //            names.push(oData.ApModel);
            //         });
            //         var values = [];
            //         $.each(data.apList,function(index,oData){
            //            values.push({name:oData.ApModel,value:oData.ApCount});
            //         });
            //         APModel_bar(names,values);
            //     }

                // alert(data.apList.length )
                // debugger
            // })
            // .fail()
            // .always();


            // --ap组
            //$.ajax({
            //    url: MyConfig.path +'/apmonitor/getApCountByGroup?devSN='+ FrameInfo.ACSN,
            //    type: "GET",
            //    dataType: "json",
            //    contentType: "application/json",
            //}).done(function(data){
            //    if('{"errcode":"illegal access"}' == data){
            //        alert("没有权限")
            //    }else{
            //        $("#ApGroup_list").SList ("refresh", data.apList);
            //    }
            //
            //    // alert(data.apList.length )
            //    // debugger
            //})
            //.fail()
            //.always();


            // --SSID
            //$.ajax({
            //    url: MyConfig.path +'/apmonitor/getApCountBySsid?devSN='+ FrameInfo.ACSN,
            //    type: "GET",
            //    dataType: "json",
            //    contentType: "application/json",
            //}).done(function(data){
            //    if('{"errcode":"Invalid request"}' == data ||('{"errcode":"illegal access"}' == data)){
            //        alert("没有权限")
            //    }
            //    else{
            //        $("#ApBasedSsid_list").SList ("refresh", data);
            //    }
            //
            //    // alert(data.apList.length )
            //    // debugger
            //})
            //.fail()
            //.always();


            //// --ap类型
            //$.ajax({
            //    url: MyConfig.path +'/apmonitor/getApCountByMethod?devSN='+ FrameInfo.ACSN,
            //    type: "GET",
            //    dataType: "json",
            //    contentType: "application/json",
            //}).done(function(data){
            //    if('{"errcode":"Invalid request"}' == data ||('{"errcode":"illegal access"}' == data)){
            //        alert("没有权限")
            //    }
            //    else{
            //        var datas = data.apList;
            //        var aType2 = [
            //            {value:datas[0].ApCount, name:'在线的手工AP'},
            //            {value:datas[1].ApCount, name:'自动AP'},
            //            {value:datas[2].ApCount, name:'离线的手工AP'},
            //            {value:datas[3].ApCount, name:'未认证的AP'}
            //        ];
            //        ApType_pie(aType2);
            //    }
            //
            //    // alert(data.apList.length )
            //    // debugger
            //})
            //.fail()
            //.always();


            // --终端数
            // $.ajax({
            //     url: MyConfig.path +'/stamonitor/getapstaticbyclientnum?devSN='+ FrameInfo.ACSN,
            //     type: "GET",
            //     dataType: "json",
            //     contentType: "application/json",
            // }).done(function(data){
            //     if('{"errcode":"Invalid request"}' == data ||('{"errcode":"illegal access"}' == data)){
            //         // alert("没有权限")
            //         return;
            //     }
            //     else{
            //         var datas = data.statistics;
            //         var type = [
            //             {name:"1~10",value : datas[0].count},
            //             {name:"11~20",value : datas[1].count},
            //             {name:"21~40",value : datas[2].count},
            //             {name:"41~60",value : datas[3].count},
            //             {name:"61~80",value : datas[4].count},
            //             {name:"81~100",value : datas[5].count},
            //             {name:"101以上",value : datas[6].count}
            //         ];
            //         terminal(type);
            //     }

                // alert(data.apList.length )
                // debugger
            // })
            // .fail()
            // .always();
        // -----------------------------------------------------------------------

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
        draw();

    }

    function initForm(){
        
    }

    function terminal(aData){
       var dataStyle = { 
                normal: {
                    label : {
                        show: true,
                        position: 'outer',
                        formatter: '{d}%'
                    },
                    labelLine:{
                        show:true
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
                x : 'left',
                padding: 62,
                data:['1~10','11~20','21~40','41~60','61~80','81~100','101以上']
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true, 
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 100
                            }
                        }
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : '65%',
                    center: ['65%', '60%'],
                    itemStyle : dataStyle,
                    data:aData
                }
            ]
        };
        var oTheme={
                color: ['#4FC4F6','#4ec1b2','#78CEC3','#F2BC98','#FBCEB1','#FE808B','#FF9C9E','#89DBFB']   
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


    function _init(){
        
        $(".js-apinfo .js-aplist").click(function(){                
            Utils.Base.redirect({np:MODULE_NP_APLIST});
            return false;
        });

        initData();
        initForm();
        var aType3 = [
            {name:"1~10",value : 100},
            {name:"11~20",value : 23},
            {name:"21~40",value : 34},
            {name:"41~60",value : 50},
            {name:"61~80",value : 65},
            {name:"81~100",value : 23},
            {name:"101以上",value : 56}
        ];
        terminal(aType3);
        var yData = ['WA2620','WA4330-ACN','WA4320-ACN','WA3620i-ACN','WA2612'];
        var seriesData = [120,520,320,720,100];
        APModel_bar(yData,seriesData);
    }
    function _resize (jParent)
    {
    }

    function _destroy()
    {
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Minput","SList"],
        "utils": ["Base", "Device"]

    });

}) (jQuery);;