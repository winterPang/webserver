;(function ($) {
    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".main";

    function getRcText(sRcName){
        return getRcString("rc", sRcName);
    }

    function getRcString(sRcId, sRcName){
        return $("#"+sRcId).attr(sRcName) || "";
    }

    /*
     折线图
     */

    function drawLine(){
        require(
            [
                'echarts',
                'echarts/chart/line' // 按需加载使用的图形模块
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = require('echarts').init(document.getElementById('legend'));
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['未修复','每日新增']
                    },
                    toolbox: {
                        show : false,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : ['周一','周二','周三','周四','周五','周六','周日']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'未修复',
                            type:'line',
                            stack: '总量',
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:[12, 13, 15, 17, 22, 22, 25]
                        },
                        {
                            name:'每日新增',
                            type:'line',
                            stack: '总量',
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:[1, 2, 2, 5, 0, 3, 3]
                        }
                    ]
                };

                var oTheme = {
                    color : ['yellow','#red']
                };
                // 为echarts对象加载数据
                myChart.setOption(option);
                //$("#legend").echart("init", option, oTheme);
            }
        )
    };


    /*
     柱状图（横向）
     */

    function drawRate(){
        // 使用
        require(
            [
                'echarts',
                'echarts/chart/bar', // 按需加载使用的图形模块
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('rate'));

                var option;
                option = {
                    title: {
                        subtext: '',
                        x: 'center',
                        y: "60"
                    },

                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line',
                            lineStyle: {
                                color: '#fff',
                                width: 0,
                                type: 'solid'
                            }
                        }
                    },
                    calculable: false,
                    grid: {
                        x: 80, y: 40, x2: 80, y2: 25,
                        borderColor: '#fff'
                    },
                    xAxis: [
                        {
                            name: "局点分布",
                            splitLine: false,
                            axisLabel: {
                                show: true,
                                textStyle: {color: '#617085', fontSize: "12px", width: 2}
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {color: '#617085', width: 1}
                            },
                            type: 'value'
                        }
                    ],
                    yAxis: [
                        {
                            type: 'category',
                            data: ['中医药大学', '物美超市', '左岸咖啡', '海底捞', '中国移动', '阿里巴巴', '公共WIFI', '黄龙体育中心', '华三', '华三', '华三']
                        }
                    ],
                    series: [
                        {
                            data: [2, 3, 4, 3, 2, 3, 4, 3, 4, 3, 2],
                            name: "yistLine",
                            type: 'bar',
                            barCategoryGap: '40%',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        position: 'insideRight',
                                        formatter: '{c}'
                                    },
                                    color: "red",

                                },
                            },
                        },

                    ]
                };
                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        )
    };


    /*
     柱状图（竖向）
     */

    function drawBar(){
        // 使用
        require(
            [
                'echarts',
                'echarts/chart/bar', // 按需加载使用的图形模块
            ],
            function drawBar (ec){
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('bar'));
                var option;
                option = {
                    title: {
                        subtext: '',
                        x: 'center',
                        y: "60"
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        axisPointer: {
                            lineStyle: {
                                width: 0
                            }
                        }
                    },
                    calculable: false,
                    grid: {
                        x: 40, y: 20, x2: 50, y2: 25,
                        borderColor: '#fff'
                    },
                    xAxis: [
                        {
                            name: "",
                            boundaryGap: true,
                            splitLine: false,
                            axisLine: {
                                show: true,
                                lineStyle: {color: '#9da9b8', width: 1}
                            },
                            axisTick: {show: false},
                            axisLabel: {
                                show: true,
                                textStyle: {color: '#9da9b8', fontSize: "12px", width: 2},
                                formatter: function (value) {
                                    return value;
                                },
                                interval: 0
                            },

                            // axisTick:"item",
                            type: 'category',
                            data: ['apmgr', 'stamgr', 'wmesh', 'portal', 'bonjour', 'APP', 'WIPS', 'RRM', 'dot11', 'wlanfw']
                        }
                    ],
                    yAxis: [
                        {
                            name: "异常次数",
                            splitLine: false,
                            axisLabel: {
                                show: true,
                                textStyle: {color: '#9da9b8', fontSize: "12px", width: 2}
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {color: '#9da9b8', width: 1}
                            },
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: "yistLine",
                            type: 'bar',
                            barCategoryGap: '40%',
                            data: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5],
                            itemStyle: {
                                normal: {
                                    color: function (value){ return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6); },
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{c}'
                                    },
                                }
                            }
                        }
                    ]
                };

                // $("#bar").echart("init", option, oTheme.color);


                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        )
    };



    /*
     散点图
     */

    function drawScatter(){
        // 使用
        require(
            [
                'echarts',
                'echarts/chart/scatter' //按需加载使用的图形模块
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('scatter'));
                var option = {
                    title : {
                        subtext : ''
                    },
                    tooltip : {
                        show:true,
                        trigger: 'axis',
                        axisPointer:{
                            show: true,
                            type : 'cross',
                            lineStyle: {
                                type : 'dashed',
                                width : 1
                            }
                        }
                    },
                    toolbox: {
                        show : false,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    dataZoom: {
                        show: true,
                        start : 30,
                        end : 70
                    },
                    legend : {
                        data : ['未修复']
                    },
                    dataRange: {
                        min: 0,
                        max: 100,
                        orient: 'horizontal',
                        y: 30,
                        x: 'center',
                        //text:['高','低'],           // 文本，默认为数值文本
                        color:['lightgreen','orange'],
                        splitNumber: 5
                    },
                    xAxis : [
                        {
                            type : 'category',
                            axisLabel: {
                                formatter : function(v) {
                                    return '1/' + v
                                }
                            },
                            data : function (){
                                var list = [];
                                var len = 0;
                                while (len++ < 30) {
                                    list.push(len);
                                }
                                return list;
                            }()
                        }
                    ],
                    yAxis : [
                        {
                            type : 'category',
                            axisLabel: {
                                formatter : function(v) {
                                    return 'B64D00' + v
                                }
                            },
                            data : function (){
                                var list = [];
                                var len = 0;
                                while (len++ < 5) {
                                    list.push(len);
                                }
                                return list;
                            }()
                        }
                    ],
                    animation: false,
                    series : [
                        {
                            name:'未修复',
                            type:'scatter',
                            tooltip : {
                                trigger: 'item',
                                formatter : function (params) {
                                    return params.seriesName + ' （'  + '1/' + params.value[0] + '）<br/>'
                                        + 'B64D00'+params.value[1] + ', '
                                        + params.value[2];
                                },
                                axisPointer:{
                                    show: true
                                }
                            },
                            symbolSize: function (value){
                                return Math.round(value[2]);
                            },
                            data: (function () {
                                var d = [];
                                var len = 0;
                                var value;
                                while (len++ < 30) {
                                    d.push([
                                        len,
                                        len%5,
                                        (Math.random()*10).toFixed() - 0
                                    ]);
                                    d.push([
                                        len,
                                        len%5+2,
                                        (Math.random()*10).toFixed() - 0
                                    ]);
                                }
                                return d;
                            })()
                        }
                    ]
                };
                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        )
    };


    /*
     饼状图
     */

    function drawPie(){
        //使用
        require(
            [
                'echarts',
                'echarts/chart/pie' // 按需加载使用的图形模块
            ],
            function drawPie(ec) {
                var aType = getRcText("APPINFO").split(",");
                var atempData = [{name:aType[0],value:3},
                    {name:aType[1],value:5},
                    {name:aType[2],value:3},
                    {name:aType[3],value:5},
                    {name:aType[4],value:6},
                    {name:aType[5],value:4},
                    {name:aType[6],value:4},
                    {name:aType[7],value:6}];
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('terminaltype'));
                var option = {
                    height:"80%",
                    tooltip : {
                        show:true,
                        trigger: 'item',
                        formatter: "{b}<br/> {c} ({d}%)"
                    },
                    calculable : false,
                    series : [
                        {
                            type:'pie',
                            radius : ['50%', '85%'],
                            center: ['50%', '50%'],
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
                                    },
                                    color: function(params) {
                                        var colorList = [
                                            'red','#B5C334','#FCCE10','#E87C25','#27727B',
                                            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                },
                                emphasis : {
                                    label : {
                                        formatter : "{b}\n{d}%"
                                    }
                                }
                            },
                            data:atempData
                        }
                    ]
                };
                var oTheme = {
                    color : ['gray','blue','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4']
                };
                // 为echarts对象加载数据
                myChart.setOption(option,oTheme.color);
                /*  $("#myLegend").Panel("init",{
                 type : "legend",
                 data : atempData,
                 color : oTheme.color
                 });*/
            }
        )
    };


    /*
     列表模块,紧急异常
     */

    function drawTable(){

        var opt = {
            colNames: getRcText ("AP_LABELS"),
            showHeader: true,
            multiSelect: true,
            colModel: [
                {name:'Description', datatype:"String"},
                {name:'People', datatype:"String"},
                {name:'Module', datatype:"String"},
                {name:'Time', datatype:"String"}
            ],
        };

        var apData = [{Description:"aaa",People:"zhao",Module:"a",Time:"8/21"},

            {Description:"bbb",People:"qian",Module:"b",Time:"8/22"},

            {Description:"ccc",People:"li",Module:"c",Time:"8/22"}];

        $("#ap_info_list").SList ("head", opt);
        $("#ap_info_list").SList ("refresh", apData);
    };


    /*
     列表模块，无线终端
     */


    function drawTable_WIRELESSTERMINAL(){

        var opt_WIRELESSTERMINAL = {
            colNames: getRcText ("WIRELESSTERMINAL"),
            showHeader: true,
            multiSelect: true,
            colModel: [
                {name: "MacAddress", datatype: "String",width:100},
                {name: "Ipv4Address", datatype: "String",width:60},
                {name: "UserName", datatype: "String",width:60},
                {name: "Ssid", datatype: "String",width:60},
                {name: "ApName", datatype: "String",width:50},
                {name: "Type", datatype: "String",width:80},
                {name: "Radio", datatype: "String",width:40}
            ],
        };

        var apData_WIRELESSTERMINAL = [{MacAddress:"11-11-11-11-11-11",Ipv4Address:"11.22.33.44",UserName:"username1",Ssid:"1",ApName:"1",Type:"1",Radio:"1"},
            {MacAddress:"22-22-22-22-22-12",Ipv4Address:"10.99.43.32",UserName:"username2",Ssid:"2",ApName:"1",Type:"1",Radio:"1"},
            {MacAddress:"33-333-33-33-33-13",Ipv4Address:"11.22.33.44",UserName:"username3",Ssid:"3",ApName:"1",Type:"1",Radio:"1"},
            {MacAddress:"44-44-44-44-44-14",Ipv4Address:"11.22.33.44",UserName:"username4",Ssid:"4",ApName:"1",Type:"1",Radio:"1"},
        ];

        $("#wirelessterminal_slist").SList ("head", opt_WIRELESSTERMINAL);
        $("#wirelessterminal_slist").SList ("refresh", apData_WIRELESSTERMINAL);
    }


    function initData()
    {
        drawTable();
        drawPie();
        drawScatter();
        drawBar();
        drawRate();
        drawLine();
        drawTable_WIRELESSTERMINAL();
    }


    function _init()
    {
        //  NC = Utils.Pages[MODULE_NC].NC;
        g_jForm = $("#UserSelects");
        // onInitContent();
        //initForm();
        //initGrid();
        initData();
    };

    function _destroy()
    {
        g_aUserUp = null;
        g_aUserDown = null;
        g_jForm = null;
        g_aInterfaces = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart"],
        "utils":["Base"]
        //  "subModules":[MODULE_NC]
    });

})( jQuery );

function show(){
    $("#drop").slideToggle(200);
}