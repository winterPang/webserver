(function ($)
{
    var MODULE_NAME = "dashboard.Flow_analysis";
    var g_aAllAppName = [];
    var g_aSend = [],g_aReceive = [];
    var g_aAppData=[];
    var g_aDownAppData=[];
    var g_aClientList=[];
    var g_oAppFlowLog={};
    var g_dataContext={};
    var g_EndTime,g_Date;

    /* function onclick */
    var g_aList = {};
    var g_date_onclick ={};
    var g_startTime = {};
    var g_endTime = {};
    var g_up = {};
    var g_down = {};

    /* function AppLog */
    var g_endtime_AppLog = {};
    var g_starttime_AppLog = {};
    var g_oRequest_AppLog = {};
    var g_aArry_AppLog = [];

    /* function initData */
    var g_date_initData = {};
    var g_startTime_initData = {};
    var g_endTime_initData = {};

    /* function get_initData_PostSuc */
    var g_up_initData_Post = {};

    var g_oAppName_AppUpSuc = {};

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("flow_analysis_rc", sRcName);
    }

    function drawApFlow(aAPList)                          /* 画AP速率echart */
    {
        var aName = [];
        var aUpData = [];
        var aUpData_Plus = [];
        var aDownData = [];
        var nMax = 0;                                       /* 坐标轴的最大显示数 */
        for (var i = 0; i < aAPList.length; i++)
        {
            if(!aAPList[i].transmitRate && !aAPList[i].receiveRate)  /* 判断接收速率和发送速率是否都不存在 */
            {
                aName.push(aAPList[i].apName);                      /* 如果有不存在的就画一个假数据 */
                aUpData.push(0);
                aUpData_Plus.push(0);
                aDownData.push(0);
            }else{                                                  /* 如果存在则处理 */
                aName.push(aAPList[i].apName);
                aUpData.push(aAPList[i].transmitRate);
                aUpData_Plus.push(-((aAPList[i].transmitRate)));
                aDownData.push(aAPList[i].receiveRate);
                nMax = Math.max(aAPList[i].transmitRate,aAPList[i].receiveRate,nMax);
            }
        }

        var nWidth = $("#ap_flow").parent().width()*0.99;
        var option = {
            height:"100%",
            grid: {
                x:25, y:20, x2:20, y2:25,
                borderColor: '#FFFFFF'
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "right",
                textStyle:{
                    color:'#617085',
                    fontSize:'12px'
                },
                data: getRcText("LEGEND").split(",")
            },
            tooltip : {
                show: true,
                trigger: 'axis',
                formatter:function(y,x){

                    var sTips = y[0][1] + "<br/>" + y[0][0] + ":" + Utils.Base.addComma(-y[0][2],"rate",1)+ "<br/>" +
                     y[1][0] + ":" + Utils.Base.addComma(y[1][2],"rate",1);
                            return sTips;
                },
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
                end : 70,
                zoomLock: true,
                orient: "vertical",
                width: 5,
                x: nWidth,
                backgroundColor:'#F7F9F8',
                fillerColor:'#bec6cf',
                handleColor:'#bec6cf',
                border:'none'
            },
            xAxis : [
                {
                    //    name : "Flow",
                    min:-nMax,
                    max:nMax,
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
                        textStyle:{color: '#617085', fontSize:"12px", width:2},
                        lineStyle :{color: '#617085', width: 1}
                    },
                    axisLabel : {
                        textStyle:{color: '#617085', fontSize:"12px", width:2},
                        formatter:function(nNum){
                            nNum = nNum < 0 ? -nNum : nNum;
                            return Utils.Base.addComma(nNum,'rate',1);      /* rate表示对速率操作，memory */
                        }
                    }
                }
            ],
            yAxis : [
                {
                    //    name: "APP",
                    type : 'category',
                    axisTick : {show: false},
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#617085', width: 1}
                    },
                    data : aName,
                    axisLabel : {
                        show:false
                    },
                    splitLine : {
                        show : false
                    }
                }
            ],
            series : [
                {
                    type:'bar',
                    data: aUpData_Plus,
                    name: getRcText("LEGEND").split(",")[0],
                    barCategoryGap: '40%',
                    stack:"kk",
                    itemStyle : {
                        normal: {
                            label : {
                                show: false
                            }
                        }
                    }
                },
                {

                    type:'bar',
                    data: aDownData,
                    name: getRcText("LEGEND").split(",")[1],
                    barCategoryGap: '40%',
                    stack:"kk",
                    itemStyle : {
                        normal: {
                            label : {
                                show: true,
                                position: 'insideLeft',
                                formatter: function(oData){
                                    return oData.name;
                                },
                                textStyle: {color:"#617085"}
                            }
                        }
                    }
                }
            ]
        };

        var oTheme = {
            color: ['#FFBB33','#CDDC39']
        };
        $("#ap_flow").echart("init", option, oTheme);
    }

    function get_apFlawDataSuc(data){
        var aAPList = data.apList || [];
        drawApFlow(aAPList);
    };

    function get_apFlawDataFail(){

    };

    function apFlawData()
    {
        var get_apFlawData = {
            url: MyConfig.path+"/apmonitor/web/aptraffic?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            onSuccess:get_apFlawDataSuc,
            onFailed:get_apFlawDataFail   
        };
        Utils.Request.sendRequest(get_apFlawData);
    }

    function mathSwitchIn(Bits)
    {
        var ss;
        if(Bits/1024/1024 < 1)
        {
            if(Bits/1024 < 1)
            {
                ss = Bits;
                return Bits;
            }
            else
            {
                ss = Math.round(Bits/1024);
                return ss;
            }
        }
        else
        {
            ss = Math.round(Bits/1024/1024);
            return ss;
        }
    }

    function inStatus(oInfo)
    {
        var sCode = "";
        var aStause = getRcText ("STATUS").split(",");
        switch(oInfo)
            {
                case "GigabitEthernet1/0/1":
                    sCode = aStause[0];
                    break;
                case "GigabitEthernet1/0/2":
                    sCode = aStause[1];
                    break;
                case "GigabitEthernet1/0/3":
                    sCode = aStause[2];
                    break;
                case "GigabitEthernet1/0/4":
                    sCode = aStause[3];
                    break;
                case "GigabitEthernet1/0/5":
                    sCode = aStause[4];
                    break;
                default:
                    sCode = "-"
                    break;
            }

        return sCode;
    }

    function drawLinePortFlow(aTemp)
    {
        var aName = [];
        var InBits = [];
        var OutBits = [];
        var nMax = 0;
        for(var i = 0; i < aTemp.length; i++)
        {
            aName.push(inStatus(aTemp[i].interfaceName));
            InBits.push(aTemp[i].speed_up);
            OutBits.push(-(aTemp[i].speed_down));
            nMax = Math.max(aTemp[i].speed_up,aTemp[i].speed_down,nMax);
        }
        var nWidth = $("#line_port_flow").parent().width()*0.99;
        var option = {
            height:"100%",
            grid: {
                x:25, y:20, x2:20, y2:25,
                borderColor: '#FFFFFF'
            },
            legend: {
                orient: "horizontal",
                y: 0,
                x: "right",
                textStyle:{
                    color:'#617085',
                    fontSize:'12px'
                },
                data: getRcText("LEGEND").split(",")
            },
            tooltip : {
                show: true,
                trigger: 'axis',
                formatter:function(y,x){
                            var sTips = y[0][1] + "<br/>" + y[0][0] + ":" + Utils.Base.addComma(y[0][2],"rate",1) + "<br/>" +
                             y[1][0] + ":" + Utils.Base.addComma(-y[1][2],"rate",1)
                            return sTips;
                        },

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
                show : false,
                realtime : true,
                start : 0,
                end : 100,
                zoomLock: true,
                orient: "vertical",
                width: 5,
                x: nWidth,
                backgroundColor:'#F7F9F8',
                fillerColor:'#bec6cf',
                handleColor:'#bec6cf',
                border:'none'
            },
            xAxis : [
                {
                    min:-nMax,
                    max:nMax,       /* 坐标轴显示的最大值 */
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
                        lineStyle :{color: '#617085', width: 1}
                    },
                    axisLabel : {
                        textStyle:{color: '#617085', fontSize:"12px", width:2},
                        formatter:function(nNum){                       /* 用来显示坐标轴的单位 */
                            nNum = nNum < 0 ? -nNum : nNum;
                            return Utils.Base.addComma(nNum,'rate',1);  /*rate是对速率的处理 memory是对kb的处理*/
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    axisTick : {show: false},
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#617085', width: 1}
                    },
                    data : aName,
                    axisLabel: {
                        show: false,
                    },
                    splitLine : {
                        show : false
                    }
                }
            ],
            series : [
                    {
                        
                        type:'bar',
                        data:InBits,
                        name: getRcText("LEGEND").split(",")[0],
                        barCategoryGap: '40%',
                        stack:"kk",
                        itemStyle : {
                            normal: {
                                label : {
                                    show: true, 
                                    position: 'insideLeft',
                                    formatter: function(oData){return oData.name;},
                                    textStyle: {color:"#617085"}
                                }
                            },
                            emphasis: {
                                label : {
                                    show: false,
                                    formatter: function(oData){return oData.name;},
                                    textStyle: {color:"#617085"}
                                }
                            }
                        }
                    },
                    {
                        
                        type:'bar',
                        data: OutBits,
                        name: getRcText("LEGEND").split(",")[1],
                        barCategoryGap: '40%',
                        stack:"kk",
                        itemStyle : {
                            normal: {
                                label : {
                                    show: false
                                }
                            }
                        }
                    }
            ]
        };
        var oTheme = {
            color: ['#69C4C5','#53B9E7']
        };
        $("#line_port_flow").echart("init", option, oTheme);
    }


    function get_DownDataSuc(downData)
    {
        g_down = downData.message || [];
        var aUpData=[];
        var aDownData=[];

        if(g_aList&&g_aList.name=='其他')
        {
            $("#usage").addClass("hide");
            return;
        }else{
            $("#usage").removeClass("hide");
            var name=g_aList?g_aList.name:"";

            for(var i= 0;i<g_up.length;i++)
            {
                if (g_up[i].APPName == name)
                {
                    var upData=[new Date(g_up[i].Time * 1000), g_up[i].PktBytes];
                    aUpData.push(upData);
                    if(aUpData.length==1)
                    {
                        upData=[new Date( g_up[i].Time * 1000-3600000 ), 0]
                        aUpData.push(upData);
                    }
                }
            }

            /* ADD by zhanglaiyu order element */
            if ( aUpData != "") 
            {
                aUpData.sort(function compare(a,b){

                    // return  a[0] > b[0];
                    if ( a[0] >= b[0] )
                    {
                        return 1;
                    }
                    else
                    {
                        return -1;
                    }
                });
            };

            for(var j= 0;j<g_down.length;j++)
            {
                if (g_down[j].APPName == name)
                {
                    var downData=[new Date(g_down[j].Time * 1000), g_down[j].PktBytes];
                    aDownData.push(downData);
                    if(aDownData.length==1)
                    {
                        downData=[new Date(g_down[j].Time * 1000-3600000), 0]
                        aDownData.push(downData);
                    }
                }
            }

            if ( aDownData != "") 
            {
                aDownData.sort(function compare(a,b){

                    // return  a[0] > b[0];
                    if ( a[0] >= b[0] )
                    {
                        return 1;
                    }
                    else
                    {
                        return -1;
                    }
                });
            };

        }

        var option = {
            width:'100%',
            height:200,
            title:{
                text:g_aList ? g_aList.name :g_aAllAppName[0],
                x:70
            },
            legend:{
                orient:"horizontal",
                y:10,
                x:"right",
                textStyle:{
                    color:"#617085",
                    fontSize:'14px'
                },
                data:getRcText("UP_DOWN").split(",")
            },
            tooltip : {
                show: true,
                trigger: 'item',
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#fff',
                        width: 0,
                        type: 'solid'
                    }
                },
                formatter:function(params) {
                    var time = params.value[0].toISOString().split(".")[0].split("T").toString();
                    if (params.value[1] < 0)
                        params.value[1] = -params.value[1];
                    var string = params.seriesName + "<br/>" + time + "<br/>" + Utils.Base.addComma(params.value[1], "memory");
                    return string;
                }
            },
            grid: {
                x: '60', y: '28',x2:'40',y2:'70',
                borderColor: '#FFF'
            },
            calculable: false,
            dataZoom:{
                show:true,
                start:0,
                end:100,
                y:176,
                height:16,
                fillerColor:'#69C4C5',
                handleColor:"#617085",
                backgroundColor:'#E6F5F6'
            },
            xAxis: [
                {
                    type: 'time',
                    //boundaryGap: false,
                    splitLine:{
                        show:false
                    },
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#617085', fontSize:"12px", width:2}
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#d4d4d4', width: 1}
                    },
                    axisTick :{
                        show:false,
                        lineStyle:{color:'#d4d4d4', width: 1}
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitLine:{
                        show:false,
                        lineStyle:{color:'#d4d4d4', width: 1}
                    },
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#617085', fontSize:"12px", width:2},
                        formatter:function (nNum){
                            nNum=nNum<0 ? -nNum : nNum;
                            return  Utils.Base.addComma(nNum,"memory");
                        }
                    },
                    axisLine  : {
                        show:false,
                        lineStyle :{color: '#d4d4d4', width: 1}
                    }
                }
            ],
            animation: false,
            series: [
                {
                    name : getRcText("UP_DOWN").split(",")[0],
                    symbol: "Circle",
                    type: 'line',
                    smooth: true,
                    showAllSymbol:true,
                    symbolSize:2,
                    itemStyle: {
                        normal:
                        {
                            areaStyle: {type: 'default'},
                            lineStyle:{width:0}
                        }
                    },
                    data:aUpData
                    //    data: aUpHis
                },
                {
                    name : getRcText("UP_DOWN").split(",")[1],
                    symbol: "Circle",
                    type: 'line',
                    smooth: true,
                    showAllSymbol:true,
                    symbolSize:2,
                    itemStyle: {normal: {areaStyle: {type: 'default'},lineStyle:{width:0}}},
                    data:aDownData
                    //    data: aDownHis
                }
            ]

        };
        if(g_aList.name == g_aAllAppName[0])
        {
            var oTheme = {
                color: ['#53B9E7','#A9DCF3']
            };
        }
        if(g_aList.name == g_aAllAppName[1])
        {
            var oTheme = {
                color: ['#31ADB4','#98D6C2']
            };
        }
        if(g_aList.name == g_aAllAppName[2])
        {
            var oTheme = {
                color: ['#69C4C5','#B4E1E1']
            };
        }
        if(g_aList.name == g_aAllAppName[3])
        {
            var oTheme = {
                color: ['#FFBB33','#FFDD99']
            };
        }
        if(g_aList.name == g_aAllAppName[4])
        {
            var oTheme = {
                color: ['#FF8800','#FFC37F']
            };
        }
        if(g_aList.name == g_aAllAppName[5])
        {
            var oTheme = {
                color: ['#CC324B','#E699A5']
            };
        }
        if(g_aList.name == g_aAllAppName[6])
        {
            var oTheme = {
                color: ['#E64C65','#F3A6B2']
            };
        }
        if(g_aList.name == g_aAllAppName[7])
        {
            var oTheme = {
                color: ['#D7DDE4','#DFE3E8']
            };
        }

        $("#usage").echart ("init", option,oTheme);

    };

    function get_DownDataFail()
    {

    };

    function onClick( aList )
    {
        g_aList = aList;
        g_date_onclick = new Date();
        g_startTime = g_date_onclick.setHours(0, 0, 0);
        g_endTime = g_date_onclick.setHours(24, 0, 0);

        function get_onClickSuc(upData)
        {
            g_up = upData.message || [];

            var get_DownData = {
                url: MyConfig.path+"/ant/read_dpi_app",
                dataType: "json",
                type: "POST",
                data: {
                    Method: 'GetLog',
                    Param: {
                        family: "0",
                        direct: "1",
                        ACSN: FrameInfo.ACSN,
                        StartTime: (g_startTime/1000).toFixed(0),
                        EndTime: (g_endTime/1000).toFixed(0)
                    },
                    Return: [
                        "DropPktBytes",
                        "Pkt",
                        "PktBytes",
                        "DropPkt",
                        "APPName",
                        "Time"
                    ]
                },
                onSuccess:get_DownDataSuc,
                onFailed:get_DownDataFail
            };
            Utils.Request.sendRequest(get_DownData);
        };

        function get_onClickFail(){

        };
        var get_onClick = {
            url: MyConfig.path+"/ant/read_dpi_app",
            dataType: "json",
            type: "POST",
            data: {
                Method: 'GetLog',
                Param: {
                    family: "0",
                    direct: "0",
                    ACSN: FrameInfo.ACSN,
                    StartTime: (g_startTime/1000).toFixed(0),
                    EndTime: (g_endTime/1000).toFixed(0)
                },
                Return: [
                    "DropPktBytes",
                    "Pkt",
                    "PktBytes",
                    "DropPkt",
                    "APPName",
                    "Time"
                ]
            },
            onSuccess:get_onClickSuc,
            onFailed:get_onClickFail
        };
        Utils.Request.sendRequest(get_onClick);

    }

    function drawAnalysisLine(name)
    {
        var aTimes=g_oAppFlowLog[name].aTimes;
        var aUserAppUP=[];
        var aUserAppDown=[];
        for(var i=0;i<g_oAppFlowLog[name].up.length;i++)
        {
            aUserAppUP.push([aTimes[i],g_oAppFlowLog[name].up[i].PktBytes]);
        }
        for(var i=0;i<g_oAppFlowLog[name].down.length;i++)
        {
            aUserAppDown.push([aTimes[i],g_oAppFlowLog[name].down[i].PktBytes]);
        }

        var option = {
            width:'100%',
            height:200,
            title:{
                text:name,
                x:70
            },
            legend:{
                orient:"horizontal",
                y:0,
                x:"right",
                textStyle:{
                    color:'#617085',
                    fontSize:'14px'
                },
                data:getRcText("UP_DOWN").split(",")
            },
            tooltip : {
                show: true,
                trigger: 'item',
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#fff',
                        width: 0,
                        type: 'solid'
                    }
                },
                formatter:function(params){
                    var time=params.value[0].toISOString().split(".")[0].split("T").toString();
                    if(params.value[1]<0)
                        param.value[1]=-params.valuep[1];
                    var string=params.seriesName+"<br/>"+time+"<br/>"+ Utils.Base.addComma(param.value[1],"memory");
                }
            },
            grid: {
                x: '10%', y: '40',x2:'40',y2:'70',
                borderColor: '#FFF'
            },
            calculable: false,
            dataZoom:{
                show:true,
                start:0,
                end:100,
                fillterColor:'#69C4C5',
                handleColor:"#617085",
                backgroundColor:'#E6F5F6'
            },
            xAxis: [
                {
                    type: 'time',
                    //boundaryGap: false,
                    splitLine:{
                        show:false
                    },
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#617085', fontSize:"12px", width:2}
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#d4d4d4', width: 1}
                    },
                    axisTick :{
                        show:false,
                        lineStyle:{color:'#d4d4d4', width: 1}
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitLine:{
                        show:false,
                        lineStyle:{color:'#d4d4d4', width: 1}
                    },
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#617085', fontSize:"12px", width:2},
                        formatter:function(nNum){
                            nNum=nNum<0 ? -nNum : nNum;
                            return Utils.Base.addComma(nNum,'memory');
                        }
                    },
                    axisLine  : {
                        show:false,
                        lineStyle :{color: '#d4d4d4', width: 1}
                    }
                }
            ],
            animation:false,
            series: [
                {
                    name : getRcText("UP_DOWN").split(",")[0],
                    symbol: "Circle",
                    type: 'line',
                    smooth: true,
                    showAllSymbol:true,
                    symbolSize:2,
                    itemStyle: {normal: {areaStyle: {type: 'default'},lineStyle:{width:0}}},
                    data:aUserAppUP
                },
                {
                    name : getRcText("UP_DOWN").split(",")[1],
                    symbol: "Circle",
                    type: 'line',
                    smooth: true,
                    showAllSymbol:true,
                    symbolSize:2,
                    itemStyle: {normal: {areaStyle: {type: 'default'},lineStyle:{width:0}}},
                    data:aUserAppDown
                }
            ]

        };

        if(name == g_aAllAppName[0])
        {
            var oTheme = {
                color: ['#53B9E7','#A9DCF3']
            };
        }
        if(name == g_aAllAppName[1])
        {
            var oTheme = {
                color: ['#31ADB4','#98D6C2']
            };
        }
        if(g_aList.name == g_aAllAppName[2])
        {
            var oTheme = {
                color: ['#69C4C5','#B4E1E1']
            };
        }
        if(name == g_aAllAppName[3])
        {
            var oTheme = {
                color: ['#FFBB33','#FFDD99']
            };
        }
        if(name == g_aAllAppName[4])
        {
            var oTheme = {
                color: ['#FF8800','#FFC37F']
            };
        }
        if(name == g_aAllAppName[5])
        {
            var oTheme = {
                color: ['#CC324B','#E699A5']
            };
        }
        if(name == g_aAllAppName[6])
        {
            var oTheme = {
                color: ['#E64C65','#F3A6B2']
            };
        }
        if(name == g_aAllAppName[7])
        {
            var oTheme = {
                color: ['#D7DDE4','#DFE3E8']
            };
        }
        $("#usage").echart ("init", option,oTheme);
    }



    function drawAnalysisPie(AppData)
    {
        var aUserAPPList=[];
        for(var i= 0;i<AppData.length;i++)
        {
            var a={
                name:AppData[i].APPName,
                value:parseFloat(AppData[i].PktBytes)+parseFloat(AppData[i].DropPktBytes)
            }
            aUserAPPList.push(a);
        }

        var aUserAPPList_Index =  aUserAPPList[0] || [];
        onClick( aUserAPPList_Index );

        var option = {
            height:220,
            tooltip : {
                show:true,
                trigger: 'item',
                formatter: "{b}<br/> {c} ({d}%)"
            },
            calculable : false,
            myLegend:{
                scope : "#anaylsis_pie-Legend",
                width: "40%",
                right: "10%",
                top: 0,
            },
            series : [
                {
                    name:'App flow anaylsis',
                    type:'pie',
                    radius : ['50%', '90%'],
                    center: ['25%', '45%'],
                    itemStyle : {
                        normal : {
                            label : {
                                position : 'inner',
                                formatter : function (a,b,c,d) {
                                    return ""
                                }
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                formatter : "{b}\n{d}%"
                            }
                        }
                    },
                    data:aUserAPPList
                }
            ]
            ,click:onClick
        };
        var oTheme = {
            color : ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4']
        };
        $("#anaylsis_pie").echart ("init", option,oTheme);
    }

    function getPieData(aAppflow)
    {
        var i;
        var oAllApp = {};
        var sumBytes= 0,sumDropBytes=0
        for(i = 0; i < aAppflow.length; i++)
        {
            var sName = aAppflow[i].APPName;
            if(!oAllApp[sName])
            {
                oAllApp[sName] = aAppflow[i];
            }
            else
            {
                oAllApp[sName].PktBytes = Number(oAllApp[sName].PktBytes) + Number(aAppflow[i].PktBytes);
                oAllApp[sName].DropPktBytes = Number(oAllApp[sName].DropPktBytes) + Number(aAppflow[i].DropPktBytes);
            }
        }
        var aRet=[],aTemp = [];
        for(key in oAllApp)
        {
            aTemp.push(oAllApp[key]);
        }
        aTemp = aTemp.sort(function(a,b){
            return b.PktBytes-a.PktBytes;
        });

        var max=aTemp.length>7 ? 7 :aTemp.length;
        for(i=0;i<max;i++)
        {
            g_aAllAppName.push(aTemp[i].APPName);
            sumBytes+=aTemp[i].PktBytes;
            sumDropBytes+=aTemp[i].DropPktBytes;
            aRet.push(aTemp[i]);
        }
        if(i==7)
        {
            aRet[7]={
                "APPName":getRcText("LABELS"),
                "PktBytes":sumBytes,
                "DropPktBytes":sumDropBytes
            };
        }

        for(i=7;i<aTemp.length;i++)
        {
            aRet[7].PktBytes=Number(aRet[7].PktBytes) + Number(aTemp[i].PktBytes);
            aRet[7].DropPktBytes=Number(aRet[7].DropPktBytes) + Number(aTemp[i].DropPktBytes);
        }
        return aRet;
    }

    function filterApp(aUserApp)
    {
        var first=[];
        first.push(aUserApp[0]);
        for(var  i=1;i<aUserApp.length;i++)
        {
            if(first.APPName==aUserApp[i].APPName)
            {
                var temp={
                    "APPName":first.APPName,
                    "PktBytes":first[i].PktBytes+aUserApp[i].PktBytes,
                    "DropPktBytes":first[i].DropPktBytes+aUserApp[i].DropPktBytes
                }
                first.push(temp);
            }else{
                first.push(aUserApp[i]);
            }

        }
        return first;
    }

    function get_down_initData_PostSuc( downData )
    {
        var down = downData.message || [];

        var aUserApp=[];
        for(var i= 0;i<g_up_initData_Post.length;i++)
        {
            var oUserApp=
            {
                "APPName":g_up_initData_Post[i].APPName,
                "PktBytes":g_up_initData_Post[i].PktBytes,
                "DropPktBytes":g_up_initData_Post[i].DropPktBytes
            }
            aUserApp.push(oUserApp);
        }

        for(var j=0;j<down.length;j++)
        {
            var oUserApp=
            {
                "APPName":down[j].APPName,
                "PktBytes":down[j].PktBytes,
                "DropPktBytes":down[j].DropPktBytes
            }
            aUserApp.push(oUserApp);
        }
        var aPieData = getPieData(aUserApp) || [];
        drawAnalysisPie(aPieData);
    };

    function get_down_initData_PostFail()
    {

    };

    function get_initData_PostSuc( upData )
    {
        g_up_initData_Post = upData.message || [];

        var get_down_initData_Post = {
            url: MyConfig.path+"/ant/read_dpi_app",
            dataType: "json",
            type: "POST",
            data: {
                Method: 'GetApp',
                Param: {
                    family: "0",
                    direct: "1",
                    ACSN: FrameInfo.ACSN,
                    StartTime: (g_starttime_initData/1000).toFixed(0),
                    EndTime: (g_endtime_initData/1000).toFixed(0)
                },
                Return: [
                    "DropPktBytes",
                    "Pkt",
                    "PktBytes",
                    "DropPkt",
                    "FirstTime",
                    "LastTime",
                    "APPName"
                ]
            },
            onSuccess: get_down_initData_PostSuc,
            onFailed: get_down_initData_PostFail
        };

        Utils.Request.sendRequest( get_down_initData_Post );

    };

    function get_initData_PostFail()
    {

    };

    function get_initData_GetSuc( data )
    {
        var adata=data.lan_list || [];

        drawLinePortFlow(adata);        
    };

    function get_initData_GetFail()
    {

    };

    function initData()
    {
        date = new Date();
        g_starttime_initData = date.setHours(0, 0, 0);
        g_endtime_initData = date.setHours(24, 0, 0);

        var get_initData_Post = {

            url: MyConfig.path+"/ant/read_dpi_app",
            dataType: "json",
            type: "POST",
            data: {
                Method: 'GetApp',
                Param: {
                    family: "0",
                    direct: "0",
                    ACSN: FrameInfo.ACSN,
                    StartTime: (g_starttime_initData/1000).toFixed(0),
                    EndTime: (g_endtime_initData/1000).toFixed(0)
                },
                Return: [
                    "DropPktBytes",
                    "Pkt",
                    "PktBytes",
                    "DropPkt",
                    "FirstTime",
                    "LastTime",
                    "APPName"
                ]
            },
            onSuccess: get_initData_PostSuc,
            onFailed: get_initData_PostFail
        };

        Utils.Request.sendRequest( get_initData_Post );

        var get_initData_Get = {

            url: MyConfig.path+"/devmonitor/web/laninfo?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json", 
            onSuccess:get_initData_GetSuc,
            onFailed:get_initData_GetFail           
        };
        Utils.Request.sendRequest( get_initData_Get );

        apFlawData();
        wirelessUpflow();
    }

    function get_dpi_appUpSuc( Data )
    {
        g_aSend = [];
        var upData = Data || [];

        if (upData.retCode !=0){
            return;
        }
        g_aAppData = upData.message;
        upData.message.forEach(function(oData){
            g_oAppName_AppUpSuc[oData.UserMAC] = oData.APPName;
        });

        getStationList();


    };

    function get_dpi_appUpFail()
    {

    };

    function getDpiApp_Upflow( direct )
    {

        var date = new Date();
        var startTime = date.setHours(0, 0, 0);
        var endTime = date.setHours(24, 0, 0);

        var get_dpi_app = {
            url: MyConfig.path+"/ant/read_dpi_app",//发送
            dataType: "json",
            type: "POST",
            data: {
                Method: 'GetApp',
                Param: {
                    family: "0",
                    direct: direct,
                    ACSN: FrameInfo.ACSN,
                    StartTime: (startTime/1000).toFixed(0),
                    EndTime: (endTime/1000).toFixed(0)
                },
                Return: [
                    "DropPktBytes",
                    "Pkt",
                    "PktBytes",
                    "DropPkt",
                    "FirstTime",
                    "LastTime",
                    "APPGroupName",
                    "APPName",
                    "UserMAC"
                ]
            },
            onSuccess: get_dpi_appUpSuc,
            onFailed: get_dpi_appUpFail
        };
        Utils.Request.sendRequest( get_dpi_app );
    }

    function get_dpi_appDownSuc( downData )
    {
        if (downData.retCode !=0){
            return;
        }
        var oAppName = {};
        g_aDownAppData = downData.message;
        g_aDownAppData.forEach(function(oData){
            oAppName[oData.UserMAC] = oData.APPName;
        });
        for(var i = 0; i < g_aClientList.length; i++)
        {
            var oData = g_aClientList[i];
            var oTempRecv = {
                clientMAC:oData.clientMAC,
                clientMode:oData.clientMode,
                clientBytes:oData.clientRxBytes || 0,
                clientPackets:oData.clientRxPackets || 0,
                clientRate:oData.clientRxRate || "0",
                AppType:oAppName[oData.clientMAC] || ""
            };
            
            g_aReceive.push(oTempRecv);
        }

        $("#wireless_list").SList ("refresh", g_aReceive);
        g_aReceive = [];
    };

    function get_dpi_appDownFail()
    {

    };

    function getDpiApp_Downflow (direct)
    {
        var date = new Date();
        var startTime = date.setHours(0, 0, 0);
        var endTime = date.setHours(24, 0, 0);

        var get_dpi_app = {
            url: MyConfig.path+"/ant/read_dpi_app",//发送
            dataType: "json",
            type: "POST",
            data: {
                Method: 'GetApp',
                Param: {
                    family: "0",
                    direct: direct,
                    ACSN: FrameInfo.ACSN,
                    StartTime: (startTime/1000).toFixed(0),
                    EndTime: (endTime/1000).toFixed(0)
                },
                Return: [
                    "DropPktBytes",
                    "Pkt",
                    "PktBytes",
                    "DropPkt",
                    "FirstTime",
                    "LastTime",
                    "APPGroupName",
                    "APPName",
                    "UserMAC"
                ]
            },
            onSuccess: get_dpi_appDownSuc,
            onFailed: get_dpi_appDownFail
        };
        Utils.Request.sendRequest( get_dpi_app );        
    };

    function get_stationlistSuc( data )
    {
        g_aClientList = data.clientList||[];
        for(var i = 0; i <g_aClientList.length; i++)
        {
            var oData = g_aClientList[i];
            var oTemp = {
                clientMAC:oData.clientMAC,
                clientMode:oData.clientMode,
                clientBytes:oData.clientTxBytes || 0,
                clientPackets:oData.clientTxPackets || 0,
                clientRate:oData.clientTxRate || "0",
                AppType:g_oAppName_AppUpSuc[oData.clientMAC] || ""
            };
            g_aSend.push(oTemp);
        }

        $("#wireless_list").SList ("refresh", g_aSend);
    };

    function get_stationlistFail()
    {

    };

    function getStationList()
    {

        var get_stationlist = {
            url: MyConfig.path+"/stamonitor/web/stationlist?devSN=" + FrameInfo.ACSN,
            type: "GET",
            dataType: "json",
            onSuccess: get_stationlistSuc,
            onFailed: get_stationlistFail            
        };
        Utils.Request.sendRequest( get_stationlist );   
    }

    function wirelessUpflow()
    {
        var direct = 0;
        getDpiApp_Upflow( direct );
    }

    function wirelessDownflow()
    {
        var direct = 1;
        getDpiApp_Downflow(direct);
    }

    function showWirelessInfo(sMac)
    {
        if(!sMac){
            return false;
        }
        $("#ssidTitle").html(getRcText ("TITLE_TERINFO") + sMac);
        var aWsMODE = getRcText("WIRELESSMODE").split(",");
        for(var i = 0; i < g_aClientList.length; i++)
        {
            var oclient={};
            $.extend(oclient, g_aClientList[i]);
            
            if(oclient.clientMAC == sMac)
            {
                var nMode;
                switch(oclient.clientRadioMode)
                {
                    case 1: nMode = 0; break;
                    case 2: nMode = 1; break;
                    case 4: nMode = 2; break;
                    case 8: nMode = 3; break;
                    case 16: nMode = 4; break;
                    case 64: nMode = 5; break;
                }
                if(nMode >= 0)
                {
                    oclient.clientRadioMode = aWsMODE[nMode];
                }
                if(oclient.clientIP == "0.0.0.0")
                {
                    oclient.clientIP = "";
                }
                if(oclient.clientIP == "::")
                {
                    oclient.clientIP = "";
                }
                Utils.Base.updateHtml($("#view_client_form"), oclient);
            }
        }

        Utils.Base.openDlg(null, {}, {scope:$("#TerminalInfoDlg"),className:"modal-super"});
    }

    function showFlowInfo(value)
    {
        if($("#btn_send").hasClass("active") == true)
        {
            aAllData = g_aAppData;
        }
        else
        {
            aAllData = g_aDownAppData;
        }
        var aType = [];
        var oGroup = {};
        var aAppname = value;
        var oAppGroupIndex={};
        aAllData.forEach(function(aAllData)
        {
            if((aAppname.indexOf(aAllData.UserMAC) != -1))
            {
                if(!oAppGroupIndex[aAllData.APPGroupName])
                {
                    oAppGroupIndex[aAllData.APPGroupName]=[];
                }
                oAppGroupIndex[aAllData.APPGroupName].push(aAllData.APPName);

            }
        })
        for(var name in oAppGroupIndex){
            var oTmp = {
                "AppCategory":name,
                "AppName":oAppGroupIndex[name].join(",")
            };
            aType.push(oTmp);
        }
        
        $("#flowdetail_list").SList ("refresh", aType);

        Utils.Base.openDlg(null, {}, {scope:$("#flowdetailDlg"),className:"modal-super"});  
    }

    function onDisDetail()
    {
        var sType = $(this).attr("cell");
        var MacAddress = $(this).attr("mac");
        if(sType == 0)
        {
            showWirelessInfo(this.innerHTML);
        }
        else
        {
            showFlowInfo(MacAddress);
        }
    }
    function initGrid()
    {
        var opt = {
                colNames: getRcText ("WIRELESS_HEADER"),
                showHeader: true,
                multiSelect : false ,
                pageSize:5,
                colModel: [
                    {name:'clientMAC', datatype:"String",formatter:showLink},
                    {name:'clientMode', datatype:"String"},
                    {name:'clientBytes', datatype:"String"},
                    {name:'clientPackets', datatype:"String"},
                    {name:'clientRate', datatype:"String"},
                    {name:'AppType', datatype:"String",formatter:showLink}
                ]
            };
        $("#wireless_list").SList ("head", opt);

        $("#wireless_list").on('click', 'a.list-link', onDisDetail);

        var opt = {
                colNames: getRcText ("FLOWDETAIL_HEADER"),
                showHeader: true,
                multiSelect : false ,
                colModel: [
                    {name:'AppCategory', datatype:"String"},
                    {name:'AppName', datatype:"String"}
                ]
            };
        $("#flowdetail_list").SList ("head", opt);
    }

    function showLink(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "";
        if("text" == type)
        {
            return value;
        }

        return '<a class="list-link" cell="'+cell+'"'+' mac="'+dataContext.clientMAC+'">'+value+'</a>'; 
    }

    function initForm()
    {
        $("#view_client_form").form("init", "edit", {"title":getRcText("TITLE_TERINFO"),"btn_apply": false,"btn_cancel":false});
        $("#flowdetail_form").form("init", "edit", {"title":getRcText("TITLE_FLOWINFO"),"btn_apply": false,"btn_cancel":false});
        $("#btn_send").on("click",function(){

            $(this).addClass('active');
            $("#btn_receive").removeClass('active');
            wirelessUpflow();
        });
        $("#btn_receive").on("click",function(){
            $(this).addClass('active');
            $("#btn_send").removeClass('active');
            wirelessDownflow();
        });

        g_oAppFlowLog={};

    }

    function _init()
    {
        initGrid();
        initData();
        initForm();
    }
    function _resize(jParent)
    {
    }

    function _destroy()
    {
        g_aAllAppName=[];
        g_oAppFlowLog={};
        g_aReceive = [];
        g_aSend = [];

         /* function onclick */
        g_aList = {};
        g_date ={};
        g_startTime = {};
        g_endTime = {};
        g_up = {};
        g_down = {};

        /* function AppLog */
        g_endtime_AppLog = {};
        g_starttime_AppLog = {};
        g_oRequest_AppLog = {};
        g_aArry_AppLog = [];

        /* function initData */
        g_date_initData = {};
        g_startTime_initData = {};
        g_endTime_initData = {};

        /* function get_initData_PostSuc */
        g_up_initData_Post = {};


        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","SList","Minput","Panel","Form"],
        "utils": [ "Device","Base" ,"Request"]
    });

}) (jQuery);
