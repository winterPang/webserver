/**
 * Created by Administrator on 2016/7/7.
 */
(function ($)
{
    var MODULE_NAME = "a_dataanalysis.relateanalysis";
    var oTheme = {
        color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd', '#F7C762', '#ABD6F5', '#63B4EF', '#3DA0EB', '#1683D3', '#136FB3']
    };

    var g_date = "0";
    var g_changshuo = "所有场所";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("relateanalysis_rc", sRcName);
    }

    function setguanlianOpt()
    {
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: function (params) {
                    if (params.indicator2) { // is edge
                        return params.value.weight;
                    } else {// is node
                        return params.name
                    }
                }
            },
            legend: {
                width: "52%",
                height: "50%",
                x: "20%",
                y: "96%",
                data:['场所1','场所2', '场所3', '场所4']
            },
            series : [
                {
                    type:'chord',
                    radius: ['65%', '70%'],
                    center: ['45%', '45%'],
                    sort : 'ascending',
                    sortSub : 'descending',
                    showScale : true,
                    showScaleText : true,
                    data : [
                        {name : '场所1'},
                        {name : '场所2'},
                        {name : '场所3'},
                        {name : '场所4'}
                    ],
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            }
                        }
                    },
                    matrix : [
                        [11975,  5871, 8916, 2868],
                        [ 1951, 10048, 2060, 6171],
                        [ 8010, 16145, 8090, 8045],
                        [ 1013,   990,  940, 6907]
                    ]
                }
            ]
        };

        return option;

    }

    function setpaiminOpt()
    {
        var placeHoledStyle = {
            normal:{
                barBorderColor:'rgba(0,0,0,0)',
                color:'rgba(0,0,0,0)'
            },
            emphasis:{
                barBorderColor:'rgba(0,0,0,0)',
                color:'rgba(0,0,0,0)'
            }
        };
        var dataStyle = {
            height:300,
            normal: {
                label : {
                    show: true,
                    position: 'insideRight',
                    formatter: '{c}%',
                    textStyle:{
                        fontSize:20,
                        color:"#030303"
                    }
                }
            }
        };
        var option = {
            grid: {
                y: 45,
                x: 40,
                y2: 45,
                x2: 35
            },
            xAxis : [
                {
                    type : 'value',
                    position: 'top',
                    splitLine: {show: false},
                    axisLabel: {show: false}
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    splitLine: {show: false},
                    data : ['场所1', '场所2', '场所3', '场所4']
                }
            ],
            series : [
                {
                    name:'GML',
                    type:'bar',
                    stack: '总量',
                    barWidth:50,
                    itemStyle : dataStyle,
                    data:[33, 38, 55, 72]
                }
            ]
        };

        return option;
                    
    }

    function setVeenOpt()
    {
        var option = {
            tooltip : {
                trigger: 'item',
                formatter: "{b}"
            },
            calculable : false,
            series : [
                {
                    type:'venn',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    fontSize: 10,
                                    color:"#030303"
                                }
                            },
                            labelLine: {
                                show: false,
                                length: 10,
                                lineStyle: {
                                    // color: 各异,
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        },
                        emphasis: {
                            color: '#cc99cc',
                            borderWidth: 1,
                            borderColor: '#996699'
                        }
                    },
                    data:[]
                }
            ]
        };

        return option;
    }

    function getGuanlianoption()
    {
        var option = {
            color : [
                '#FBB367','#80B1D2','#FB8070','#CC99FF','#B0D961',
                '#99CCCC','#BEBBD8','#FFCC99','#8DD3C8','#FF9999',
                '#CCEAC4','#BB81BC','#FBCCEC','#CCFF66','#99CC66',
                '#66CC66','#FF6666','#FFED6F','#ff7f50','#87cefa'
            ],
            title : {
                text : '场所关系图',
                x:'left',
                y:'top',
                textStyle:{
                    color:'#4ec1b2'
                }
            },
            tooltip : {
                trigger: 'item',
                formatter : function (params) {
                    //alert(JSON.stringify(params));
                    if (params.name && params.name.indexOf('-') != -1) {
                        return params.name.replace('-', ' ' + params.seriesName + ' ')

                    }
                    else {
                        return params.name ? params.name : params.data.id
                    }
                }
            },
            series : [
                {
                    "name": "去过",
                    "type": "chord",
                    "showScaleText": false,
                    "clockWise": false,
                }
            ]

        };

        return option;

    }

    function dateChange_today()
    {

        var dom = document.getElementById("bijiao");
        var myChart = echarts.init(dom);
        
        var option = getGuanlianoption ();

        option.series[0].data =  [ {"name": "场所1"},
                        {"name": "场所2"},
                        {"name": "场所3"},
                        {"name": "场所4"},
                        {"name": "场所5"}];

        option.series[0].matrix = [
                        [0,90,70,60,40],
                        [10,0,20,30,40],
                        [10,20,0,30,50],
                        [20,30,90,0,80],
                        [50,90,60,10,0]
                    ]

        myChart.setOption(option);


    }

    function dateChange_aweek()
    {
        var dom = document.getElementById("bijiao");
        var myChart = echarts.init(dom);
        
        var option = getGuanlianoption ();

        option.series[0].data =  [ {"name": "场所1"},
                        {"name": "场所2"},
                        {"name": "场所3"},
                        {"name": "场所4"},
                        {"name": "场所5"}];

        option.series[0].matrix = [
                        [0,90,70,60,40],
                        [10,0,20,30,40],
                        [10,30,0,10,50],
                        [20,30,90,0,80],
                        [50,90,60,10,0]
                    ]

        myChart.setOption(option);
    }

    function dateChange_amonth()
    {
        var dom = document.getElementById("bijiao");
        var myChart = echarts.init(dom);
        
        var option = getGuanlianoption ();

        option.series[0].data =  [ {"name": "场所1"},
                        {"name": "场所2"},
                        {"name": "场所3"},
                        {"name": "场所4"},
                        {"name": "场所5"}];

        option.series[0].matrix = [
                        [0,90,70,60,40],
                        [10,0,20,30,40],
                        [10,40,0,10,50],
                        [20,30,90,0,80],
                        [50,90,60,10,0]
                    ]

        myChart.setOption(option);
    }

    function dateChange_ayear()
    {
        var dom = document.getElementById("bijiao");
        var myChart = echarts.init(dom);
        
        var option = getGuanlianoption ();

        option.series[0].data =  [ {"name": "场所1"},
                        {"name": "场所2"},
                        {"name": "场所3"},
                        {"name": "场所4"},
                        {"name": "场所5"}];

        option.series[0].matrix = [
                        [0,90,70,60,40],
                        [10,0,20,30,40],
                        [10,20,0,10,50],
                        [20,30,90,0,80],
                        [50,90,60,10,0]
                    ]

        myChart.setOption(option);
    }


    function drawFirstHighVeen()
    {
        var option = setVeenOpt();
        var data = [
            {value:100, name:'场所5'},
            {value:100, name:'场所3'},
            {value:60, name:'公共'}
        ];
        option.series[0].data = data;
        //var oTheme = {
        //      color : ['#53B9E7','#69C4C5','#CC324B','#FFBB33','#FF8800','#D7DDE4']
        //};

        $("#first_high2").echart("init", option, oTheme);
    }
    function drawSecondHighVeen()
    {
        var option = setVeenOpt();
        var data = [
            {value:100, name:'场所4'},
            {value:100, name:'场所5'},
            {value:50, name:'公共'}
        ];
        option.series[0].data = data;
        //var oTheme = {
        //      color : ['#53B9E7','#69C4C5','#CC324B','#FFBB33','#FF8800','#D7DDE4']
        //};
        $("#second_high2").echart("init", option, oTheme);
    }
    function drawThirdHighVeen()
    {
        var option = setVeenOpt();
        var data = [
            {value:100, name:'场所1'},
            {value:100, name:'场所3'},
            {value:40, name:'公共'}
        ];
        option.series[0].data = data;
        //var oTheme = {
        //      color : ['#53B9E7','#69C4C5','#CC324B','#FFBB33','#FF8800','#D7DDE4']
        //};
        $("#third_high2").echart("init", option, oTheme);
    }
    function drawFirstLowVeen()
    {
        var option = setVeenOpt();
        var data = [
            {value:40, name:'场所2'},
            {value:70, name:'场所4'},
            {value:20, name:'公共'}
        ];
        option.series[0].data = data;
        $("#first_low2").echart("init", option, oTheme);
    }
    function drawSecondLowVeen()
    {
        var option = setVeenOpt();
        var data = [
            {value:40, name:'场所1'},
            {value:50, name:'场所3'},
            {value:10, name:'公共'}
        ];
        option.series[0].data = data;
        $("#second_low2").echart("init", option, oTheme);
    }
    function drawThirdLowVeen()
    {
        var option = setVeenOpt();
        var data = [
            {value:40, name:'场所2'},
            {value:60, name:'场所3'},
            {value:20, name:'公共'}
        ];
        option.series[0].data = data;
        $("#third_low2").echart("init", option, oTheme);
    }

    function initData()
    {
        drawFirstHighVeen();
        drawSecondHighVeen();
        drawThirdHighVeen();
        drawFirstLowVeen();
        drawSecondLowVeen();
        drawThirdLowVeen();
    }

    function changeChangShuo()
    {
        g_changshuo = $("#changshuoselect").val();

        var data1 = [{"name": "场所1"},{"name": "场所2"},{"name": "场所3"},{"name": "场所4"},{"name": "场所5"}];
        var data2 = [{"name": "场地1"},{"name": "场地2"}, {"name": "场地3"}, {"name": "场地4"},{"name": "场地5"},
            {"name": "场地6"},{"name": "场地7"}, {"name": "场地8"}, {"name": "场地9"},{"name": "场地10"}];
        //var data_series = [[0,90,70,60,40,50,31,44,56,100],
        //    [10,0,20,50,31,44,56,100,30,40],
        //    [10,20,0,10,50,31,44,56,100,50],
        //    [20,30,55,0,50,44,56,100,90,60,80],
        //    [50,90,60,10,0,31,44,56,100,80],
        //    [50,90,60,10,60,0,44,56,100,80],
        //    [50,90,60,10,20,70,0,56,100,80],
        //    [50,90,60,10,90,31,44,0,100,80],
        //    [50,90,60,10,80,31,44,56,0,80],
        //    [50,90,60,10,50,31,44,56,100,0]
        //];

        if ("场所1" == g_changshuo)
        {
            switch (g_date)
            {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                    var data_le = data2;
                    var data_series = [[0,90,70,60,40,50,31,44,56,100],
                        [10,0,20,50,31,44,56,100,30,40],
                        [10,20,0,10,50,31,44,56,100,50],
                        [20,30,55,0,50,44,56,100,90,60,80],
                        [50,90,60,10,0,31,44,56,100,80],
                        [50,90,60,10,60,0,44,56,100,80],
                        [50,90,60,10,20,70,0,56,100,80],
                        [50,90,60,10,90,31,44,0,100,80],
                        [50,90,60,10,80,31,44,56,0,80],
                        [50,90,60,10,50,31,44,56,100,0]
                    ];
                    break;
            }
        }
        if ("场所2" == g_changshuo)
        {
            switch (g_date)
            {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                    var data_le = data2.slice(0,7);
                    var data_series = [[0,90,70,60,40,44,66],
                        [10,0,20,30,40,56,67],
                        [10,20,0,10,50,33,44],
                        [20,30,90,0,80,22,19],
                        [50,90,60,10,0,33,88],
                        [20,30,90,70,80,0,19],
                        [50,90,60,10,80,33,0]
                    ];
                    break;
            }
        }
        if ("场所3" == g_changshuo)
        {
            switch (g_date)
            {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                    var data_le = data2.slice(0,6);
                    var data_series = [[0,90,70,60,40,44],
                        [10,0,20,30,40,56],
                        [10,20,0,10,50,33],
                        [20,30,90,0,80,22],
                        [50,90,60,10,0,88],
                        [20,30,90,70,80,0]
                    ];
                    break;
            }
        }
        if ("场所4" == g_changshuo)
        {
            switch (g_date)
            {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                    var data_le = data2.slice(0,5);
                    var data_series = [[0,90,40,44,66],
                        [10,0,20,40,67],
                        [10,20,0,10,50],
                        [20,30,90,0,80],
                        [50,90,60,10,0],
                    ];
                    break;
            }
        }
        if ("场所5" == g_changshuo)
        {
            switch (g_date)
            {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                    var data_le = data2.slice(0,4);
                    var data_series = [[0,90,60,40],
                        [10,0,20,30],
                        [10,20,0,10],
                        [20,30,90,0],
                    ];
                    break;
            }
        }
        if ("所有场所" == g_changshuo)
        {
            switch (g_date)
            {
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                    var data_le = data1;
                    var data_series = [[0,90,70,60,40],
                        [10,0,20,30,56],
                        [10,20,0,10,50],
                        [20,30,90,0,80],
                        [50,90,60,10,0],
                    ];
                    break;
            }
        }

        var dom = document.getElementById("bijiao");
        var myChart = echarts.init(dom);

        var option = getGuanlianoption();

        option.series[0].data = data_le;

        option.series[0].matrix = data_series;

        myChart.setOption(option);

        //$("#bijiao").echart("init", option)

    }

    function initForm()
    {
        $("#changshuoselect").change(changeChangShuo);

        $(".cancel-actions", "#tabContent").on("click",function(){
            $(this).parent().toggleClass("hide");
        });

        $("#daterange").on("inputchange.datarange", function(e){
            var orange = $(this).daterange("getRangeData");

            $("#cycle_date").text("（" + orange.startData + "-" + orange.endData + "）");

        });

        $(".box-footer #senior_filter").on("click", function(){
            $(".top-box").toggleClass("hide");
        });

        $("#WT1, #WT2, #WT3, #WT4, #WT5").click(function(){
            g_date = $(this).val();
            if(g_date != "4")
            {
                $("#cycle_date").text(getRcText("DATE_CYCLE").split(",")[g_date]);
                //$("#timezone").addClass('hide');
                //$("#timezone").toggleClass("hide");
                $("#daterange").addClass('hide');
            }
            else
            {
                //$("#timezone").removeClass('hide');
                $("#daterange").removeClass('hide');
            }
            switch (g_date)
            {
                case '0':
                    dateChange_today();
                    break;
                case '1':
                    dateChange_aweek();
                    break;
                case '2':
                    dateChange_amonth();
                    break;
                case '3':
                    dateChange_ayear();
                    break;
                case '4':
                    //dateChange_custom();
                    break;
            }

        });
    }

    function setCalendarDate() {
        /*设置日历背景图的日期*/
        var todayDate = new Date().getDate();

        if (1 == todayDate) {
            $(".set-background").css("padding-left", "23px");
        }
        else if(9 >= todayDate && 1 != todayDate) {
            $(".set-background").css("padding-left", "22px");
        }
        else if (11 == todayDate) {
            $(".set-background").css("padding-left", "19px");
        }
        else if(10 < todayDate && 20 > todayDate && 11 != todayDate) {
            $(".set-background").css("padding-left", "18px");
        }
        else {
            $(".set-background").css("padding-left", "18px");
        }

        $("#calendar").html(todayDate);


    }

    //初始化选择按钮
    function initPlace()
    {
        var btn_loupan = ["所有场所","场所1","场所2", "场所3","场所4","场所5"];
        $("#changshuoselect").singleSelect("InitData", btn_loupan);
    }
    function _init()
    {
        initForm();
        setCalendarDate();
        initPlace();
        initData();

        var dom = document.getElementById("bijiao");
        var myChart = echarts.init(dom);
        
        var option = getGuanlianoption ();

        option.series[0].data =  [ {"name": "场所1"},
                        {"name": "场所2"},
                        {"name": "场所3"},
                        {"name": "场所4"},
                        {"name": "场所5"}];

        option.series[0].matrix = [
                        [0,90,70,60,40],
                        [10,0,20,30,40],
                        [10,20,0,10,50],
                        [20,30,90,0,80],
                        [50,90,60,10,0]
                    ];

        var newopt = setguanlianOpt();
        $("#bijiao").echart("init", newopt, oTheme);

        var paiminOpt = setpaiminOpt();

        $("#paimin").echart("init", paiminOpt, oTheme);

    }

    function _destroy()
    {

    }

    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","SList", "SingleSelect", "DateRange", "DateTime"],
        "utils": ["Base"]
    });
}) (jQuery);