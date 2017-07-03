/**
 * Created by kf6415 & kf6100 on 2016/7/11.
 */
;(function ($) {
    var MODULE_BASE = "a_dataanalysis";
    var MODULE_NAME = MODULE_BASE+".specificarea";

    var dealEvent   = {
        nowState : {},
        scope    : "",
        currentid:"",
        init: function(){
            var jscope = $(".probe-choice");
            //alert(jscope.length);此处的长度是1
            for(var i = 0; i < jscope.length; i++)
            {
                dealEvent.nowState[jscope[i].getAttribute("id")] = 1;
            }
        },
        liOnClick: function(e){
            var scope = $(this);
            var pre = dealEvent.nowState[dealEvent.currentid];
            if(scope.val() == dealEvent.nowState[dealEvent.currentid])
            {
                $(".choice-show", dealEvent.scope).removeClass("height-change");
                return false;
            }
            else
            {
                dealEvent.nowState[dealEvent.currentid] = scope.val();
                $(".current-state", dealEvent.scope).text(scope.text());
                $(".choice-show", dealEvent.scope).removeClass("height-change");
                changeFloorData(pre, dealEvent.nowState[dealEvent.currentid]);
            }
            $("#body_over").addClass("hide");

            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});

        },
        inputClick:function(e){
            if($("#body_over").hasClass("hide"))
            {
                dealEvent.currentid = $(this).closest(".probe-choice").attr("id");
                dealEvent.scope = "#" + dealEvent.currentid;
                $("#body_over").removeClass("hide");
                $(".choice-show", dealEvent.scope).addClass("height-change");
            }
            else
            {
                $("#body_over").addClass("hide");
                $(".choice-show", dealEvent.scope).removeClass("height-change");
            }

            return false;
        },
        blackClick:function(e){
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).hasClass("height-change") && $(".choice-show", dealEvent.scope).removeClass("height-change");
        },
        searchClick:function(e){
            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text($(".probe-input").val());
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid],parm:$(".probe-input").val()});
        }
    };

    function initForm()
    {
        $(".choice-head").click(dealEvent.inputClick);
        $(".choice-show li").click(dealEvent.liOnClick);
        $("#body_over").click(dealEvent.blackClick);
        $(".probesearch-icon").click(dealEvent.searchClick);
        $("#probe_timechoice").click(dealEvent.timeClick);
        $("#daterange").on("inputchange.datarange",dealEvent.dateChange);
    }

    //hot map start
    var heatDataFloorOne = [];
    var heatDataFloorTwo = [];
    var heatDataFloorThree = [];
    function initHotMapData()
    {
        heatDataFloorOne[0] = [300, 100, 0.5];
        heatDataFloorOne[1] = [100, 200, 1];
        heatDataFloorOne[2] = [100, 201, 0.3];
        heatDataFloorOne[2] = [101, 203, 0.3];
        heatDataFloorOne[2] = [106, 204, 0.3];
        heatDataFloorOne[2] = [99, 205, 0.3];
        heatDataFloorOne[2] = [115, 206, 0.5];

        heatDataFloorTwo[0] = [400, 200, 0.6];
        heatDataFloorTwo[1] = [500, 300, 0.7];

        heatDataFloorThree[0] = [100, 400, 0.7];
        heatDataFloorThree[1] = [300, 250, 0.8];
    }

    function showHotMap(tempHeatData){
        var dom = document.getElementById("dayHotMap");
        var hotMapChart = echarts.init(dom);
        var hotMapOption = {
            series : []
        };

        var hotMapSeries = {
            type : 'heatmap',
            hoverable : false,
            data:tempHeatData
        };

        hotMapChart.setOption(hotMapOption);
        hotMapChart.setOption({series:[hotMapSeries]});
    }
    //hot map end

    //realtime start
    var posGrid;
    var posTooltip;
    var posxAxis;
    var posyAxis;
    var posSchemaType;
    var posItemStyle;
    var posToolTipType;
    var posDataAP;
    var posDataClient;
    var posOption;
    var posChart;

    function initEcharOptionCommonData()
    {
        posSchemaType = {
            schemaAp : [
                {name: 'X', index: 0, text: 'AP坐标'},
                {name: 'Y', index: 1, text: 'AP坐标'},
                {name: 'APName', index: 2, text: 'APName'},
                {name: 'APModel', index: 3, text: 'APModel'},
                {name: 'SerialID', index: 4, text: 'SerialID'},
                {name: 'MacAddr', index: 5, text: 'MacAddr'}
            ],
            schemaClient : [
                {name: 'X', index: 0, text: '坐标'},
                {name: 'Y', index: 1, text: '坐标'},
                {name: 'ClientName', index: 2, text: '名字'},
                {name: 'ClientModel', index: 3, text: '手机型号'}
            ]
        };

        posGrid = {
            x: '0%',
            y: '0%',
            width: '100%',
            height: '100%'
        };

        posTooltip = {
            padding: 10,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            formatter: function (obj) {
                var value = obj.value;
                if(obj.series.toolTipType == posToolTipType.ap)
                {
                    return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                        + obj.seriesName
                        + '</div>'
                        + posSchemaType.schemaAp[0].text + '：' + '(' + value[0] + ',' + value[1] + ')' + '<br>'
                        + posSchemaType.schemaAp[2].text + '：' + value[2] + '<br>'
                        + posSchemaType.schemaAp[3].text + '：' + value[3] + '<br>'
                        + posSchemaType.schemaAp[4].text + '：' + value[4] + '<br>'
                        + posSchemaType.schemaAp[5].text + '：' + value[5] + '<br>';
                }
                else if(obj.series.toolTipType == posToolTipType.client)
                {
                    return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                        + obj.seriesName
                        + '</div>'
                        + posSchemaType.schemaClient[0].text + '：' + '(' + value[0] + ',' + value[1] + ')' + '<br>'
                        + posSchemaType.schemaClient[2].text + '：' + value[2] + '<br>'
                        + posSchemaType.schemaClient[3].text + '：' + value[3] + '<br>';
                }
            }
        };

        posxAxis = {
            show:false,
            type: 'value',
            name: 'x',
            nameGap: 16,
            nameTextStyle: {
                color: '#fff',
                fontSize: 14
            },
            max: 844,
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#777'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#777'
                }
            },
            axisLabel: {
                formatter: '{value}',
                textStyle: {
                    color: '#fff'
                }
            }
        };

        posyAxis = {
            show:false,
            type: 'value',
            name: 'y',
            nameLocation: 'end',
            nameGap: 20,
            nameTextStyle: {
                color: '#fff',
                fontSize: 16
            },
            axisLine: {
                lineStyle: {
                    color: '#777'
                }
            },
            axisTick: {
                lineStyle: {
                    color: '#777'
                }
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            }
        };

        posItemStyle = {
            normal: {
                opacity: 1.0,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(255, 255, 0, 1.0)'
            }
        };

        posToolTipType = {client:0,ap:1};

        posDataAP = [
            [10,505,1, "WA2620",'123123','111-222'],
            [210,309,2, "WA2620",'123123','111-222'],
            [410,154,3, "WA2620",'123123','111-222'],
            [830,444,4, "WA2620",'123123','111-222'],
            [700,244,5, "WA2620",'123123','111-222'],
            [510,442,6, "WA2620",'123123','111-222']
        ];
        posDataClient = [
            [270,108,'chenying',12580],
            [330,109,'agui',12580],
            [355,207,'xiaohei',12580],
            [500,240,'zhujie',12580],
            [600,238,'weijie',12580],
            [680,307,'xiqing',12580]
        ];

        posOption = {
            color: [
                'red', 'fuchsia'
            ],
            grid: posGrid,
            tooltip: posTooltip,
            xAxis:posxAxis ,
            yAxis: posyAxis,
            series: [
                {
                    name: 'AP信息',
                    type: 'scatter',
                    itemStyle: posItemStyle,
                    symbolSize: 10,
                    toolTipType: posToolTipType.ap,
                    data: posDataAP
                },
                {
                    name: 'Client信息',
                    type: 'scatter',
                    symbol:'circle',
                    itemStyle: posItemStyle,
                    symbolSize: 7,
                    toolTipType: posToolTipType.client,
                    data: posDataClient
                }
            ]
        };
    }

    function createClientData()
    {
        var i = parseInt(10 * Math.random());

        if(i >= 5)
        {
            posDataClient[0][0] -= 10;
            posDataClient[0][1] -= 10;
            posDataClient[1][0] += 10;
            posDataClient[1][1] += 10;
            posDataClient[2][0] -= 10;
            posDataClient[2][1] -= 10;
            posDataClient[3][0] += 10;
            posDataClient[3][1] += 10;
            posDataClient[4][0] -= 10;
            posDataClient[4][1] += 10;
            posDataClient[5][0] += 10;
            posDataClient[5][1] += 10;
        }
        else
        {
            posDataClient[0][0] += 10;
            posDataClient[0][1] += 10;
            posDataClient[1][0] -= 10;
            posDataClient[1][1] -= 10;
            posDataClient[2][0] += 10;
            posDataClient[2][1] -= 10;
            posDataClient[3][0] += 10;
            posDataClient[3][1] -= 10;
            posDataClient[4][0] += 10;
            posDataClient[4][1] -= 10;
            posDataClient[5][0] -= 10;
            posDataClient[5][1] -= 10;
        }
    }

    function getPosClientData()
    {
        createClientData();

        var series = {
            name: 'Client信息',
            type: 'scatter',
            itemStyle: posItemStyle,
            symbolSize:7,
            symbol:'circle',
            z:4,
            toolTipType:posToolTipType.client,
            data: posDataClient
        };

        posChart.setOption({series:[{},series]});
    }

    function initPosEchart()
    {
        posChart =  echarts.init(document.getElementById("ap"));
        posChart.setOption(posOption,false);
        setInterval(getPosClientData,3000);
    }
    //realtime end

    //path start
    var pathOption = null;
    var pathToolTipType = null;
    var pathSchemaType = null;
    var pathItemStyle = null;
    var pathTooltip = null;
    var pathAPSeries = null;
    var pathClientSeries = null;
    var pathClientLineSeries = null;
    var dataLine = [];
    var dataLineAxis = [];
    var dataLinePoint = [];
    var myChart = null;

    var totalUerPathApData = null;
    var dataClients = null;

    var dataClientsFloorTwo = null;
    var dataClientsFloorThree = null;
    var totalDataClient = null;

    function initPathOptionCommonData()
    {
        //显示的提示框类型
        pathToolTipType = {client:0, ap:1, markline:2};

        //提示框输出的结构
        pathSchemaType = {
            schemaAp : [
                {name: 'X', index: 0, text: 'AP坐标'},
                {name: 'Y', index: 1, text: 'AP坐标'},
                {name: 'APName', index: 2, text: 'APName'},
                {name: 'APModel', index: 3, text: 'APModel'},
                {name: 'SerialID', index: 4, text: 'SerialID'},
                {name: 'MacAddr', index: 5, text: 'MacAddr'}
            ],
            schemaClient : [
                {name: 'X', index: 0, text: '坐标'},
                {name: 'Y', index: 1, text: '坐标'},
                {name: 'time', index:2, text:'时间'},
                {name: 'ClientName', index: 3, text: '名字'},
                {name: 'ClientModel', index: 4, text: '手机型号'},
                {name: 'ClientMac', index: 5, text: 'Mac地址'}
            ]
        };

        //点的样式
        pathItemStyle = {
            normal: {
                opacity: 1,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            emphasis : {
                opacity: 1
            }
        };

        pathTooltip = {             //提示框组件
            padding: 10,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            formatter: function (obj) {
                var value = obj.value;
                if(obj.series.toolTipType == pathToolTipType.ap)
                {
                    return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                        + obj.seriesName
                        + '</div>'
                        + pathSchemaType.schemaAp[0].text + '：' + '(' + value[0] + ',' + value[1] + ')' + '<br>'
                        + pathSchemaType.schemaAp[2].text + '：' + value[2] + '<br>'
                        + pathSchemaType.schemaAp[3].text + '：' + value[3] + '<br>'
                        + pathSchemaType.schemaAp[4].text + '：' + value[4] + '<br>'
                        + pathSchemaType.schemaAp[5].text + '：' + value[5] + '<br>';
                }
                else if(obj.series.toolTipType == pathToolTipType.client)
                {
                    return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                        + obj.seriesName
                        + '</div>'
                        + pathSchemaType.schemaClient[0].text + '：' + '(' + value[0] + ',' + value[1] + ')' + '<br>'
                        + pathSchemaType.schemaClient[2].text + '：' + value[2] + '<br>'
                        + pathSchemaType.schemaClient[3].text + '：' + value[3] + '<br>'
                        + pathSchemaType.schemaClient[4].text + '：' + value[4] + '<br>'
                        + pathSchemaType.schemaClient[5].text + '：' + value[5] + '<br>';
                }
            }
        };

        pathOption = {
            color: [
                'red', 'fuchsia'
            ],
            grid: {
                x: '0',
                x2: '0',
                y: '0',
                y2: '0'
            },
            tooltip: pathTooltip,
            xAxis: {
                type: 'value',
                max: 800,
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                max: 400,
                splitLine: {
                    show: false
                }
            },
            animation :false,
            series: []
        };

        //假的ap数据
        var dataApFloorOne = [
            [390, 130, "AP1", "WA2620", "123456789", "1234-5678-8910"],
            [280, 350, "AP2", "WA4320i", "123456789i", "1234-5678-2222"],
            [550, 220, "AP3", "WA4320i", "123456789i", "1234-5678-2222"]
        ];
        var dataApFloorTwo = [
            [200, 110, "AP1", "WA5510", "123456789", "1234-5678-8910"],
            [120, 250, "AP2", "WA5510", "123456789i", "1234-5678-2222"],
            [600, 320, "AP3", "WA5510", "123456789i", "1234-5678-2222"]
        ];
        var dataApFloorThree = [
            [330, 110, "AP1", "WA3000", "123456789", "1234-5678-8910"],
            [270, 250, "AP2", "WA3000", "123456789i", "1234-5678-2222"],
            [430, 320, "AP3", "WA3000", "123456789i", "1234-5678-2222"]
        ];

        //假的client数据
        var dataClient = [
            [7, 155, "8:30", "小明", "iphone", "1234-5678-8910"],
            [15, 200, "9:45", "小明", "iphone", "1234-5678-8910"],
            [32, 220, "10:01", "小明", "iphone", "1234-5678-8910"],
            [38, 234, "10:23", "小明", "iphone", "1234-5678-8910"],
            [55, 268, "10:52", "小明", "iphone", "1234-5678-8910"],
            [95, 256, "11:02", "小明", "iphone", "1234-5678-8910"]
        ];

        var dataClient2 = [
            [40, 80, "9:00", "天天", "iphone", "abcd-1234-90eb"],
            [100, 120, "10:01", "天天", "iphone", "abcd-1234-90eb"],
            [130, 150, "11:00", "天天", "iphone", "abcd-1234-90eb"]
        ];

        var dataClient3 = [
            [300, 80, "9:00", "阿桂", "lenovo", "abcd-1234-90eb"],
            [420, 120, "10:01", "阿桂", "lenovo", "abcd-1234-90eb"],
            [200, 150, "12:00", "阿桂", "lenovo", "abcd-1234-90eb"],
            [600, 180, "13:00", "阿桂", "lenovo", "abcd-1234-90eb"]
        ];

        var dataClient1FloorTwo = [
            [17, 175, "8:30", "小明", "iphone", "1234-5678-8910"],
            [25, 220, "9:45", "小明", "iphone", "1234-5678-8910"],
            [42, 240, "10:01", "小明", "iphone", "1234-5678-8910"],
            [48, 254, "10:23", "小明", "iphone", "1234-5678-8910"],
            [65, 288, "10:52", "小明", "iphone", "1234-5678-8910"],
            [105, 276, "11:02", "小明", "iphone", "1234-5678-8910"]
        ];
        var dataClient2FloorTwo = [
            [123, 180, "8:30", "小红", "iphone", "1234-5678-8910"],
            [130, 225, "9:45", "小红", "iphone", "1234-5678-8910"],
            [147, 245, "10:01", "小红", "iphone", "1234-5678-8910"],
            [153, 220, "10:23", "小红", "iphone", "1234-5678-8910"],
            [170, 293, "10:52", "小红", "iphone", "1234-5678-8910"],
            [210, 381, "11:02", "小红", "iphone", "1234-5678-8910"]
        ];
        var dataClient3FloorTwo = [
            [327, 185, "8:30", "小黑", "iphone", "1234-5678-8910"],
            [285, 230, "9:45", "小黑", "iphone", "1234-5678-8910"],
            [352, 250, "10:01", "小黑", "iphone", "1234-5678-8910"],
            [268, 264, "10:23", "小黑", "iphone", "1234-5678-8910"],
            [375, 325, "10:52", "小黑", "iphone", "1234-5678-8910"],
            [450, 286, "11:02", "小黑", "iphone", "1234-5678-8910"]
        ];
        var dataClient4FloorTwo = [
            [332, 155, "8:30", "大黄", "iphone", "1234-5678-8910"],
            [340, 200, "9:45", "大黄", "iphone", "1234-5678-8910"],
            [457, 220, "10:01", "大黄", "iphone", "1234-5678-8910"],
            [463, 234, "10:23", "大黄", "iphone", "1234-5678-8910"],
            [480, 268, "10:52", "大黄", "iphone", "1234-5678-8910"],
            [520, 256, "11:02", "大黄", "iphone", "1234-5678-8910"]
        ];
        var dataClient1FloorThree = [
            [27, 185, "8:30", "小一", "iphone", "1234-5678-8910"],
            [35, 230, "9:45", "小一", "iphone", "1234-5678-8910"],
            [52, 250, "10:01", "小一", "iphone", "1234-5678-8910"],
            [58, 264, "10:23", "小一", "iphone", "1234-5678-8910"],
            [75, 298, "10:52", "小一", "iphone", "1234-5678-8910"],
            [115, 286, "11:02", "小一", "iphone", "1234-5678-8910"]
        ];
        var dataClient2FloorThree = [
            [200, 185, "8:30", "小二", "iphone", "1234-5678-8910"],
            [250, 230, "9:45", "小二", "iphone", "1234-5678-8910"],
            [230, 250, "10:01", "小二", "iphone", "1234-5678-8910"],
            [260, 264, "10:23", "小二", "iphone", "1234-5678-8910"],
            [270, 298, "10:52", "小二", "iphone", "1234-5678-8910"],
            [290, 286, "11:02", "小二", "iphone", "1234-5678-8910"]
        ];
        var dataClient3FloorThree = [
            [310, 185, "8:30", "小三", "iphone", "1234-5678-8910"],
            [340, 230, "9:45", "小三", "iphone", "1234-5678-8910"],
            [280, 250, "10:01", "小三", "iphone", "1234-5678-8910"],
            [390, 264, "10:23", "小三", "iphone", "1234-5678-8910"],
            [400, 298, "10:52", "小三", "iphone", "1234-5678-8910"],
            [420, 286, "11:02", "小三", "iphone", "1234-5678-8910"]
        ];
        var dataClient4FloorThree = [
            [380, 185, "8:30", "小四", "iphone", "1234-5678-8910"],
            [410, 230, "9:45", "小四", "iphone", "1234-5678-8910"],
            [432, 250, "10:01", "小四", "iphone", "1234-5678-8910"],
            [450, 264, "10:23", "小四", "iphone", "1234-5678-8910"],
            [460, 298, "10:52", "小四", "iphone", "1234-5678-8910"],
            [475, 286, "11:02", "小四", "iphone", "1234-5678-8910"]
        ];

        totalUerPathApData = [dataApFloorOne, dataApFloorTwo, dataApFloorThree];

        dataClients = [dataClient, dataClient2, dataClient3];
        dataClientsFloorTwo = [dataClient1FloorTwo, dataClient2FloorTwo, dataClient3FloorTwo, dataClient4FloorTwo];
        dataClientsFloorThree = [dataClient1FloorThree, dataClient2FloorThree, dataClient3FloorThree, dataClient4FloorThree];
        totalDataClient = [dataClients, dataClientsFloorTwo, dataClientsFloorThree];
    }

//构造ap的Series数据
    function setUserPathAPSeries(dataAP)
    {
        pathAPSeries = {
            name: 'AP信息',
            type: 'scatter',
            color:'#FF0000',
            toolTipType: pathToolTipType.ap,
            itemStyle: pathItemStyle,
            symbolSize: 17,
            data: dataAP
        };
    }
    //构造client的Series数据
    function setUserPathClientSeries(dataClient)
    {
        pathClientSeries = null;
        pathClientSeries = {
            name: 'Client信息',
            type: 'scatter',
            toolTipType: pathToolTipType.client,
            color: '#68228B',
            z:4,
            symbol:'circle',
            itemStyle: pathItemStyle,
            symbolSize: 1,
            data:dataClient
        };
    }

    //画线的数据
    function createLineAxes(dataClient, aLineAxes){
        for(var i= 0; i<dataClient.length-1; i++)
        {
            aLineAxes[i] = [
                {symbolSize: 0.5,xAxis:dataClient[i][0], yAxis: dataClient[i][1]},
                {symbolSize: 2,xAxis:dataClient[i+1][0], yAxis: dataClient[i+1][1]}
            ];
        }
    }

    function setUserPathLineSeries(dataMarkLine, aLineAxes)
    {
        pathClientLineSeries = null;
        pathClientLineSeries = {
            name: 'LineTwo',
            type: 'scatter',
            symbol:'circle',
            tooltip:{
                show:false
            },
            symbolSize: 3,
            itemStyle: pathItemStyle,
            data: dataMarkLine,
            markLine: {
                smooth:true,
                data: aLineAxes
            }
        };
    }

    function drawPathLine(dataClient)
    {
        var dataMarkLine = [];
        var aLineAxes = [];

        //构造画line需要的data数据
        for (var t=0; t<dataClient.length; t++)
        {
            dataMarkLine[t] = [dataClient[t][0],dataClient[t][1]]
        }
        createLineAxes(dataClient, aLineAxes);
        dataLine = dataLine.concat(dataMarkLine);
        dataLineAxis = dataLineAxis.concat(aLineAxes);
    }

    //共同的往option中添加series的函数
    function addUserPathCommonSeries()
    {
        var dom = document.getElementById("userTrace");
        myChart = echarts.init(dom);

        setUserPathAPSeries(totalUerPathApData[0]);

        for(var i=0; i<dataClients.length;i++)
        {
            dataLinePoint = dataLinePoint.concat(dataClients[i]);
            drawPathLine(dataClients[i]);
        }

        setUserPathClientSeries(dataLinePoint);
        setUserPathLineSeries(dataLine, dataLineAxis);

        myChart.setOption(pathOption);
        myChart.setOption({series:[pathAPSeries, pathClientSeries, pathClientLineSeries]});
    }

    //用户轨迹右边的框
    function getRcText(sRcName) {
        return Utils.Base.getRcString("macaddr_infor_rc", sRcName);
    }
    function initMacList()
    {
        var opt = {
            colNames: getRcText("MAC_LABELS"),
            showHeader: true,
            multiSelect: false,
            pageSize:5,
            colModel: [
                { name: 'name', datatype: "String", formatter: showSum1},
                { name: 'mac', datatype: "String"}
            ]
        };
        $("#macaddr_info_list").SList("head", opt);
    }
    function showSum1(row, cell, value, columnDef, dataContext, type){
        value = value || "";

        if("text" == type)
        {
            return value;
        }
        return '<a class="list-link" id="customerName" index="'+ dataContext.index + '">' + dataContext.name + '</a>';
    }

    function changeTrace()
    {
        var index = $(this).attr("index");
        pathClientSeries = null;
        pathClientLineSeries = null;
        dataLine = [];
        dataLineAxis = [];
        dataLinePoint = [];

        dataLinePoint = dataLinePoint.concat(totalDataClient[currentFloor][index]);

        setUserPathClientSeries(dataLinePoint);
        drawPathLine(totalDataClient[currentFloor][index]);
        setUserPathLineSeries(dataLine, dataLineAxis);

        myChart.setOption(pathOption, true);
        myChart.setOption({series: [pathAPSeries, pathClientSeries, pathClientLineSeries]});
    }

    var currentFloor = 0;
    function fillMacData(tempClientData, index)
    {
        var MacList = [];
        var i = 0;

        for(i = 0; i<tempClientData.length; i++)
        {
            MacList[i] = {name:tempClientData[i][0][3], mac:tempClientData[i][0][5], index:i};
        }

        currentFloor = index;
        $("#macaddr_info_list").SList("refresh", MacList);
    }
    //用户轨迹右边的框end

    function changeFloorData(pre, now){
        //pre 之前的楼层 1,2,3   now当前的楼层1,2,3
        var floorOne = ["dayHotMapOne", "realOne", "pathOne"];
        var floorTwo = ["dayHotMapTwo", "realOne", "pathOne"];
        var floorThree = ["dayHotMapThree", "realOne", "pathOne"];
        var total = [floorOne, floorTwo, floorThree];
        dataLine = [];
        dataLineAxis = [];
        dataLinePoint = [];

        $("#dayHotMap").removeClass(total[pre-1][0]);
        $("#dayHotMap").addClass(total[now-1][0]);

        var totalHeatMapData = [heatDataFloorOne, heatDataFloorTwo, heatDataFloorThree];
        showHotMap(totalHeatMapData[now-1]);

        myChart.clear();
        myChart.setOption(pathOption);

        setUserPathAPSeries(totalUerPathApData[now-1]);
        for(var i=0; i<totalDataClient[now-1].length;i++)
        {
            dataLinePoint = dataLinePoint.concat(totalDataClient[now-1][i]);
            drawPathLine(totalDataClient[now-1][i]);
        }

        setUserPathClientSeries(dataLinePoint);
        setUserPathLineSeries(dataLine, dataLineAxis);
        myChart.setOption({series:[pathAPSeries, pathClientLineSeries, pathClientSeries]});
        //得到ap数据画ap
        fillMacData(totalDataClient[now-1], now-1);
    }

    function initClickEvent()
    {
        $("#macaddr_info_list").on('click', '#customerName', changeTrace);

        $("#backtobmap").click(function(){
            Utils.Base.redirect({ np: "a_dataanalysis.positionanalysis"});
        });
    }

    function _init()
    {
        initEcharOptionCommonData();
        initPosEchart();

        initPathOptionCommonData();
        addUserPathCommonSeries();

        initHotMapData();
        showHotMap(heatDataFloorOne);

        initMacList();
        fillMacData(totalDataClient[0], 0);

        dealEvent.init();
        initForm();
        initClickEvent();
    }

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Echart", "SingleSelect", "Form", "SList", "DateRange"],
        "utils":["Request", "Base"]
    });
})( jQuery );
