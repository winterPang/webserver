;(function ($) {
    var MODULE_NAME = "city_passenger.index";
    var colorList = [
        '#ff7f50','#87cefa','#da70d6','#32cd32','#6495ed'
    ];

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("passenger_rc", sRcName).split(",");
    }
    var dataMap =
    {
        passengerData:{
            7:[
                {name:"回龙观",value:3000},
                {name:"望京",value:1000},
                {name:"五道口",value:2400},
                {name:"西单",value:1800},
                {name:"CBD商圈",value:800},
                {name:"王府井",value:1600},
                {name:"天通苑",value:2000},
                {name:"三里屯",value:1100},
                {name:"天宫院",value:1030},
                {name:"环球影城",value:200},
                {name:"奥体",value:3600},
                {name:"西直门",value:4000}
            ],
            8:[
                {name:"回龙观",value:3200},
                {name:"望京",value:1300},
                {name:"五道口",value:2600},
                {name:"西单",value:1900},
                {name:"CBD商圈",value:900},
                {name:"王府井",value:1800},
                {name:"天通苑",value:1200},
                {name:"三里屯",value:1180},
                {name:"天宫院",value:1130},
                {name:"环球影城",value:180},
                {name:"奥体",value:3500},
                {name:"西直门",value:7000}
            ]
        },
        passengerWeekData:{
            7:[
                {name:"回龙观",value:5000},
                {name:"望京",value:3000},
                {name:"五道口",value:2900},
                {name:"西单",value:6500},
                {name:"CBD商圈",value:1200},
                {name:"王府井",value:4200},
                {name:"天通苑",value:5200},
                {name:"三里屯",value:6700},
                {name:"天宫院",value:2000},
                {name:"环球影城",value:800},
                {name:"奥体",value:3000},
                {name:"西直门",value:9000}
            ],
            8:[
                {name:"回龙观",value:5100},
                {name:"望京",value:3100},
                {name:"五道口",value:3000},
                {name:"西单",value:6600},
                {name:"CBD商圈",value:1300},
                {name:"王府井",value:4300},
                {name:"天通苑",value:5300},
                {name:"三里屯",value:6800},
                {name:"天宫院",value:2100},
                {name:"环球影城",value:900},
                {name:"奥体",value:3100},
                {name:"西直门",value:9100}
        ]
    },
        passengerHistoryData:{
            7:[
                {name:"回龙观",value:5100},
                {name:"望京",value:3100},
                {name:"五道口",value:3000},
                {name:"西单",value:6600},
                {name:"CBD商圈",value:1300},
                {name:"王府井",value:4300},
                {name:"天通苑",value:5300},
                {name:"三里屯",value:6800},
                {name:"天宫院",value:2100},
                {name:"环球影城",value:900},
                {name:"奥体",value:3100},
                {name:"西直门",value:9100}
            ],
            8:[
                {name:"回龙观",value:5100},
                {name:"望京",value:3100},
                {name:"五道口",value:3000},
                {name:"西单",value:6600},
                {name:"CBD商圈",value:1300},
                {name:"王府井",value:4300},
                {name:"天通苑",value:5300},
                {name:"三里屯",value:6800},
                {name:"天宫院",value:2100},
                {name:"环球影城",value:900},
                {name:"奥体",value:3100},
                {name:"西直门",value:9100}
            ]
        },

    }
    function compare(Name) {
        return function (object1, object2) {
            var value1 = object1[Name];
            var value2 = object2[Name];
            if (value2 < value1) {
                return -1;
            }
            else if (value2 > value1) {
                return 1;
            }
            else {
                return 0;
            }
        }
    }
    function drawScenicBar()
    {
        var option = {
            height:300,
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params){
                    return params[0].name + '<br/>'
                        + params[0].seriesName + ' : ' + (params[1].value + params[0].value + '<br/>'
                        + params[1].seriesName + ' : ' + params[1].value + '<br/>');
                }
            },
            legend: {
                selectedMode:false,
                data:['关联人数', '总人数']
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['奥森','故宫','天坛','颐和园','北海公园','国家博物馆']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    boundaryGap: [0, 0.1],
                    name : "人数"
                }
            ],
            series : [
                {
                    name:'关联人数',
                    type:'bar',
                    stack: 'sum',
                    barCategoryGap: '50%',
                    itemStyle: {
                        normal: {
                            color: 'tomato',
                            barBorderColor: 'tomato',
                            barBorderWidth: 6,
                            barBorderRadius:0,
                            label : {
                                show: true, position: 'insideTop'
                            }
                        }
                    },
                    data:[260, 200, 220, 120, 100, 80]
                },
                {
                    name:'总人数',
                    type:'bar',
                    stack: 'sum',
                    itemStyle: {
                        normal: {
                            color: '#fff',
                            barBorderColor: 'tomato',
                            barBorderWidth: 6,
                            barBorderRadius:0,
                            label : {
                                show: true,
                                position: 'top',
                                formatter: function (params) {
                                    for (var i = 0, l = option.xAxis[0].data.length; i < l; i++) {
                                        if (option.xAxis[0].data[i] == params.name) {
                                            return option.series[0].data[i] + params.value;
                                        }
                                    }
                                },
                                textStyle: {
                                    color: 'tomato'
                                }
                            }
                        }
                    },
                    data:[40, 80, 50, 80,80, 70]
                }
            ]
        };
        $("#scenic_bar").echart("init", option);

    }

    function drawRegionalPassengerBar()
    {
        var zoomEnd = parseInt(1000/dataMap.passengerData['7'].length)-1;
        var itemStyle = {
            normal: {
                barBorderRadius:5,
                color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                        '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                        '#60C0DD', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                    ];
                    return  colorList[params.seriesIndex] ;
                }
            }
        };

        var x = dataMap.passengerHistoryData['7'].sort(compare('value'));
        var xData = new Array;
        var name;
        for(i in x)
        {
            xData.push(x[i].name);
            if(x[i].value > 100000)
            {
                x[i].value =x[i].value / 10000;
            }

        }
        if(x[0].value > 100000)
        {
            name ='万人'
        }
        else
        {
            name ='人数'
        }
        var option = {
            height:300,

            timeline:{
                type:'number',
                data:[
                    '7:00','8:00','9:00','10:00','11:00',
                    '12:00','13:00','14:00','15:00','16:00'
                ],
                controlPosition:'none',
                lineStyle:{type:'dotted',color:'#26C0C0'},
                autoPlay : false,
                playInterval : 1000,
                y2:20
            },

            click: function(oInfo){
                Utils.Base.redirect({np:"city_passenger.passenger"});
            },
            options:[
                {
                    color: ['#4ec1b2'],

                    tooltip : {'trigger':'axis'},
                    calculable : false,

                    grid : {'y':30,'y2':100,x2:50},
                    xAxis : [{
                        'type':'category',
                        axisTick:{show:false},
                        splitNumber: 8,
                        'axisLabel':{show:true,'interval':0},
                        'data':xData
                    }],
                    legend : {
                        'data':['历史访客数量','一周访客数量','当日访客数量'],
                    },
                    dataZoom : {
                        show : true,
                        start : 0,
                        zoomLock: true,
                        orient: "horizontal",
                        height:10,
                        end: 80,
                        backgroundColor:'#F7F9F8',
                        fillerColor:'#BEC7CE',
                        handleColor:'#BEC7CE',
                        bottom: 0,
                    },
                    yAxis : [
                        {
                            'type':'value',
                            'name':name
                        }
                    ],
                    series : [
                        {
                            'name':'历史访客数量',
                            'type':'bar',
                            itemStyle: itemStyle,
                            'data': dataMap.passengerHistoryData['7']
                        },
                        {
                            'name':'一周访客数量',
                            'type':'bar',
                            itemStyle: itemStyle,
                            'data': dataMap.passengerWeekData['8']
                        },
                        {
                            'name':'当日访客数量',
                            'type':'bar',
                            itemStyle: itemStyle,
                            'data': dataMap.passengerData['7']
                        }
                    ]
                },
                {
                    series : [
                        {'data': dataMap.passengerData['8']},
                        {'data': dataMap.passengerWeekData['7']},
                        {'data': dataMap.passengerHistoryData['8']}
                    ]
                },
                {
                    series : [
                        {'data': dataMap.passengerData['7']},
                        {'data': dataMap.passengerWeekData['7']},
                        {'data': dataMap.passengerHistoryData['8']}
                    ]
                },
                {
                    series : [
                        {'data': dataMap.passengerData['8']},
                        {'data': dataMap.passengerWeekData['7']},
                        {'data': dataMap.passengerHistoryData['8']}
                    ]
                },
                {
                    series : [
                        {'data': dataMap.passengerData['7']},
                        {'data': dataMap.passengerWeekData['7']},
                        {'data': dataMap.passengerHistoryData['8']}
                    ]
                },
                {
                    series : [
                        {'data': dataMap.passengerData['8']},
                        {'data': dataMap.passengerWeekData['7']},
                        {'data': dataMap.passengerHistoryData['8']}
                    ]
                },
                {
                    series : [
                        {'data': dataMap.passengerData['7']},
                        {'data': dataMap.passengerWeekData['7']},
                        {'data': dataMap.passengerHistoryData['8']}
                    ]
                },
                {
                    series : [
                        {'data': dataMap.passengerData['8']},
                        {'data': dataMap.passengerWeekData['7']},
                        {'data': dataMap.passengerHistoryData['8']}
                    ]
                },
                {
                    series : [
                        {'data': dataMap.passengerData['7']},
                        {'data': dataMap.passengerWeekData['7']},
                        {'data': dataMap.passengerHistoryData['8']}
                    ]
                },
                {
                    series : [
                        {'data': dataMap.passengerData['8']},
                        {'data': dataMap.passengerWeekData['7']},
                        {'data': dataMap.passengerHistoryData['8']}
                    ]
                }
            ]
        };
        $("#regional_bar").echart("init", option);

    }
    function initData()
    {

    }


    function initForm()
    {

    }


    function initGrid()
    {

    }

    function _init()
    {
        drawRegionalPassengerBar();
        drawScenicBar();
    }

    function _destroy()
    {
        console.log("*******destory*******");
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","SingleSelect"],
        "utils":["Request","Base"]
    });
})( jQuery );

