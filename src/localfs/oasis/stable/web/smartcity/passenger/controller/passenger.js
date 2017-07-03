define([ "utils","echarts"], function (Utils,echarts) {
    return ["$scope", "$http", "$interval", "$state", function ($scope, $http, $interval, $state) {


    var MODULE_NAME = "city_passenger.passenger";

    function getRcText(sRcName)
    {
        return Utils.getRcString("passenger_rc", sRcName).split(",");
    }
    function getDoubleStr(num) {
        return num >= 10 ? num : "0" + num;
    }
    function drawRegionalPassengerBar()
    {
        option = {
            height:300,
            title : {
                text: '区域人流变化',
                textStyle:{fontSize:12}
            },
            tooltip : {
                trigger: 'axis',
                formatter: function (params){
                    return params.name + '<br/>'
                        + params.seriesName + ' : ' + params.value[1]
                }
            },
            legend: {
                data:['人员总数','关联人数','新增人员','新增关联人数']
            },
            calculable : false,
            /*dataZoom: {
                show: true,
                start : 0,
                end: 50,
                height : 20,
                zoomLock: true,
            },*/
            xAxis : [
                {
                    type : 'time',
                    splitNumber:14,
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#617085', fontSize: "12px"},
                        formatter: function (data) {
                            return getDoubleStr(data.getHours()) + ":" + getDoubleStr(data.getMinutes());
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name: '人员总数',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: (function () {
                        var d = [];
                        var len = 0;
                        var now = new Date();
                        var value;
                        while (len++ < 14) {
                            d.push([
                                new Date(2016, 6, 11, 8,0, len * 3600),
                                (Math.random() * 3000)
                            ]);
                        }
                        return d;
                    })()
                },
                {
                    name:'关联人数',
                    type:'line',
                    smooth:true,
                    symbol:'circle',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: (function () {
                        var d = [];
                        var len = 0;
                        var now = new Date();
                        var value;
                        while (len++ < 14) {
                            d.push([
                                new Date(2016, 6, 11, 8,0, len * 3600),
                                (Math.random() * 3000)
                            ]);
                        }
                        return d;
                    })()
                },
                {
                    name:'新增人员',
                    type:'line',
                    smooth:true,
                    symbol:'circle',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: (function () {
                        var d = [];
                        var len = 0;
                        var now = new Date();
                        var value;
                        while (len++ < 14) {
                            d.push([
                                new Date(2016, 6, 11, 8,0, len * 3600),
                                (Math.random() * 3000)
                            ]);
                        }
                        return d;
                    })()
                },
                {
                    name:'新增关联人数',
                    type:'line',
                    smooth:true,
                    symbol:'circle',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: (function () {
                        var d = [];
                        var len = 0;
                        var now = new Date();
                        var value;
                        while (len++ < 14) {
                            d.push([
                                new Date(2016, 6, 11, 8,0, len * 3600),
                                (Math.random() * 3000)
                            ]);
                        }
                        return d;
                    })()
                }
            ]
        };

        var passengerChart = echarts.init(document.getElementById("passenger_bar"));
        passengerChart.setOption(option);
    }
    function drawAccessTime()
    {
        var option = {
            height:300,
            calculable : false,
            title : {
                text: '7-6日 驻留时间统计',
                x:'right',
                y:'bottom',
                textStyle:{fontSize:14}
            },
            click: function(oInfo){
                if(oInfo.seriesIndex != 7)
                {
                    option.title.text = oInfo.name + '日 驻留时间统计';
                    option.series[7].data = [
                        {value:320, name:'半小时以内'},
                        {value:120, name:'1-2小时'},
                        {value:900, name:'3-4小时'},
                        {value:102, name:'5-6小时'},
                        {value:102, name:'7-8小时'},
                        {value:102, name:'9-10小时'},
                        {value:102, name:'10小时以上'}];
                    $("#staytime_bar").echart("init", option);
                }
            },
            legend: {
                data:['半小时以内','1-2小时','3-4小时','5-6小时','7-8小时','9-10小时','10小时以上']
            },

            tooltip : {
                formatter: function (params){
                    return params.seriesName   + '<br/>'
                        + params.name + '日 : ' + params.value +'人'
                }
            },
            xAxis : [
                {
                    type : 'category',
                    splitLine : {show : false},
                    name:'日期',
                    data : ['6-30','7-1','7-2','7-3','7-4','7-5','7-6']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:'人数',
                }
            ],
            grid:{x2:400},
            series : [
                {
                    name:'半小时以内',
                    type:'bar',

                    tooltip : {trigger: 'item'},
                    itemStyle : {
                        normal: {
                            barBorderRadius:2,
                            color:'#FE8463'
                        },
                    },
                    stack: '时间',
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name:'1-2小时',
                    type:'bar',
                    itemStyle : {
                        normal: {
                            barBorderRadius:2,
                            color:'#F4E001'
                        }
                    },
                    tooltip : {trigger: 'item'},
                    stack: '时间',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'3-4小时',
                    type:'bar',
                    tooltip : {trigger: 'item'},
                    itemStyle : {
                        normal: {
                            barBorderRadius:2,
                            color:'#C6E579'
                        }
                    },
                    stack: '时间',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'5-6小时',
                    type:'bar',
                    tooltip : {trigger: 'item'},
                    itemStyle : {
                        normal: {
                            barBorderRadius:2,
                            color:'#60C0DD'
                        }
                    },
                    stack: '时间',
                    data:[150, 232, 201, 154, 190, 330, 410]
                },
                {
                    name:'7-8小时',
                    type:'bar',

                    tooltip : {trigger: 'item'},
                    itemStyle : {
                        normal: {
                            barBorderRadius:2,
                            color:'#F3A43B'
                        }
                    },
                    stack: '时间',
                    data:[320, 332, 301, 334, 390, 330, 320]
                },
                {
                    name:'9-10小时',
                    type:'bar',
                    tooltip : {trigger: 'item'},
                    itemStyle : {
                        normal: {
                            barBorderRadius:2,
                            color:'#FAD860'
                        }
                    },
                    stack: '时间',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'10小时以上',
                    type:'bar',
                    tooltip : {trigger: 'item'},
                    itemStyle : {
                        normal: {
                            barBorderRadius:2,
                            color:'#9BCA63'
                        }
                    },
                    stack: '时间',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },

                {
                    type:'pie',
                    title : {
                        text: '7-6日',
                        x:'right',
                        y:'bottom',
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    center: ['82%','50%'],
                    radius : [0, 70],
                    itemStyle :　{
                        normal : {
                            labelLine : {
                                length : 20
                            }
                        }
                    },
                    data:[
                        {value:320, name:'半小时以内'},
                        {value:120, name:'1-2小时'},
                        {value:220, name:'3-4小时'},
                        {value:102, name:'5-6小时'},
                        {value:102, name:'7-8小时'},
                        {value:102, name:'9-10小时'},
                        {value:102, name:'10小时以上'}
                    ]
                }
            ]
        };

        var staytimeChart = echarts.init(document.getElementById("staytime_bar"));
        staytimeChart.setOption(option);


    }
    function drawRegionalPassengerBarByWeek()
    {
        var d = [], c = [], b = [],a = [];
        var len = 0;
        var value;
        while (len++ < 7) {
            d.push([
                new Date(2016, 6, 4, len * 24,0,0),
                (Math.random() * 3000)
            ]);
            c.push([
                new Date(2016, 6, 4, len * 24,0,0),
                (Math.random() * 3000)
            ]);
            b.push([
                new Date(2016, 6, 4, len * 24,0,0),
                (Math.random() * 3000)
            ]);
            a.push([
                new Date(2016, 6, 4, len * 24,0,0),
                (Math.random() * 3000)
            ]);
        }
        option = {
            height:300,
            title : {
                text: '区域人流变化',
                textStyle:{fontSize:12}
            },
            tooltip : {
                trigger: 'axis',
                formatter: function (params){
                    return params.name + '<br/>'
                        + params.seriesName + ' : ' + params.value[1]
                }
            },
            legend: {
                data:['人员总数','关联人数','新增人员','新增关联人数']
            },
            calculable : false,
            /*dataZoom: {
                show: true,
                start : 0,
                end: 50,
                height : 20,
                zoomLock: true,
            },*/
            xAxis : [
                {
                    type : 'time',
                    splitNumber: d.length,
                    axisLabel: {
                        show: true,
                        textStyle: {color: '#617085', fontSize: "12px"},
                        formatter: function (data) {
                            console.log(data);
                            return (data.getMonth() + 1) + "-" + data.getDate();
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name: '人员总数',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: d
                },
                {
                    name:'关联人数',
                    type:'line',
                    smooth:true,
                    symbol:'circle',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: c
                },
                {
                    name:'新增人员',
                    type:'line',
                    smooth:true,
                    symbol:'circle',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: b
                },
                {
                    name:'新增关联人数',
                    type:'line',
                    smooth:true,
                    symbol:'circle',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: a
                }
            ]
        };

        var passengerChart = echarts.init(document.getElementById("passenger_bar"));
        passengerChart.setOption(option);


    }
    function drawRegionalPassengerBarByMonth()
    {
        var d = [], c = [], b = [],a = [];
        var len = 0;
        var value;
        while (len++ < 30) {
            d.push([
                new Date(2016, 5, 11, len * 24,0,0),
                (Math.random() * 3000)
            ]);
            c.push([
                new Date(2016, 5, 11, len * 24,0,0),
                (Math.random() * 3000)
            ]);
            b.push([
                new Date(2016, 5, 11, len * 24,0,0),
                (Math.random() * 3000)
            ]);
            a.push([
                new Date(2016, 5, 11, len * 24,0,0),
                (Math.random() * 3000)
            ]);
        }
        option = {
            height:300,
            title : {
                text: '区域人流变化',
                textStyle:{fontSize:12}
            },
            tooltip : {
                trigger: 'axis',
                formatter: function (params){
                    return params.name + '<br/>'
                        + params.seriesName + ' : ' + params.value[1]
                }
            },
            legend: {
                data:['人员总数','关联人数','新增人员','新增关联人数']
            },
            calculable : false,
            /*dataZoom: {
             show: true,
             start : 0,
             end: 50,
             height : 20,
             zoomLock: true,
             },*/
            xAxis : [
                {
                    type : 'time',
                    splitNumber: d.length,
                    axisLabel: {
                        show: true,
                        rotate:45,
                        textStyle: {color: '#617085', fontSize: "12px"},
                        formatter: function (data) {
                            console.log(data);
                            return (data.getMonth() + 1) + "-" + data.getDate();
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name: '人员总数',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    showAllSymbol:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: d
                },
                {
                    name:'关联人数',
                    type:'line',
                    smooth:true,
                    symbol:'circle',
                    showAllSymbol:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: c
                },
                {
                    name:'新增人员',
                    type:'line',
                    smooth:true,
                    symbol:'circle',
                    showAllSymbol:true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: b
                },
                {
                    name:'新增关联人数',
                    type:'line',
                    smooth:true,
                    showAllSymbol:true,
                    symbol:'circle',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data: a
                }
            ]
        };

        var passengerChart = echarts.init(document.getElementById("passenger_bar"));
        passengerChart.setOption(option);


    }

    $scope.daysClick = function () {
        $("div a.time-link").removeClass("active");
        $(this).addClass("active");
        drawRegionalPassengerBar();
    }

    $scope.weeksClick = function () {
        $("div a.time-link").removeClass("active");
        $(this).addClass("active");
        drawRegionalPassengerBarByWeek();
    }

    $scope.monthsClick = function () {
        $("div a.time-link").removeClass("active");
        $(this).addClass("active");
        drawRegionalPassengerBarByMonth();
    }

    function initForm()
    {
        var jForm = $("#city_passenger");
        $("#city_return",jForm).on("click",function()
        {
            $state.go('^.detail');
            return false;
        });
    }


    function initGrid()
    {

    }

    function _init()
    {
        initForm();
        drawRegionalPassengerBar();
        drawAccessTime();
    }
    _init();


}];
});

