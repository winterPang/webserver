/*******************************************************************************
 Copyright (c) 2011, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:libs/frame/plot.js
@ProjectCode: Comware v7
@ModuleName: Frame.Plot
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description: 
    绘图控件封装。包括折线图、饼图、柱状图。本控件会自动装载需要JS文件，在装载完成后发送init完成的信号。
    因此在使用本控件的功能时，必须在等到控件的init信号后才能调用相关的绘图接口。
@Modification:
*******************************************************************************/
;(function($)
{
var WIDGETNAME = "Plot";

function _create(jEle, aData, opt)
{
    jEle.data("opt", opt);
    
    // 设置宽度和高度
    opt.width && jEle.width(opt.width);
    opt.height && jEle.height(opt.height);
    
    opt.width = jEle.width();
    opt.height = jEle.height();

    // 调用开源控件绘图
    var sSelector = jEle.selector;
    var jPlot = $.plot(sSelector, aData, opt);
    return jPlot;
}

var DefDataColor = {
    _colors: ['#fc9783', '#fbda66', '#c6b5f4', '#b5e583', '#70ceef', '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
    _index: 0,
    getColor: function (x, y)
    {
        var k = this._index++;
        k = (k%this._colors.length);

        return this._colors[k];
    }
};

var oPlot = {
    _create: function(){
        
    },

/*****************************************************************************
@FuncName: public, JQuery.plot.Line
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  画折线图。大小由容器div的大小决定
@Usage: 
    // HTML 代码
    <div id="container"></div>

    // 按容器大小画图表
    var oOption = [{
                name: 'CPU',
                data: [10,20,30,23,56]
            }, {
                name: 'Mem', 
                data: [20,33,21,89,54]
            }]；  //这是定义两个序列的数据
        Frame.Plot.Line("#container",oOption);
  
  
@ParaIn: 
    * sSelector, 画布容器
    * oOption, 数据序列
@Return: jObject, 折线图对象
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    Line: function (oOption)
    {
        // 准备绘图选项
       var oOptionLine={
            credits:{enabled:false},
            exporting:
            {
                buttons:{contextButton:{enabled:false}}
            },
            chart: {type: 'line'},
            colors:['green','red'],
            title: {text: null},
            subtitle: {text: null},
            xAxis: 
            {
                labels:{enabled:false},
                categories: []
            },
            yAxis: 
            {
                title: {text: 'Utilization (%)'},  
                allowDecimals:false
            },
            tooltip: {valueSuffix: '%'},
            legend: 
            {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            series:oOption
        }
        this.element.highcharts(oOptionLine);
    },
    
    area: function(oOption)
    {
        var sBorderColor = oOption.BorderColor||"#000";
        var sGridLineColor = oOption.gridLineColor ||"#49b378";
        var sPlotColor = oOption.PlotColor || "#ff0000";
        var sFillColor = oOption.FillColor || "#0b833b";
        var sLineColor = oOption.LineColor || "#0b833b";
        var sBackgroundColor = oOption.backgroundColor || "#18a24f";
        var sChartBorderColor = oOption.ChartBorderColor||"#000";
        var sStyleColor = oOption.StyleColor||"#bae3cb";
        

    var opt = {
    	colors: sPlotColor,
        chart:
        {
            /*
            line        直线图
            spline      曲线图 
            area        面积图 
            areaspline  曲线面积图   
            arearange   面积范围图   
            areasplinerange 曲线面积范围图
            column      柱状图
            columnrange 柱状范围图
            bar         条形图
            pie         饼图
            scatter     散点图
            boxplot     箱线图
            bubble      气泡图
            errorbar    误差线图
            funnel      漏斗图
            gauge       仪表图
            waterfall   瀑布图
            polar       雷达图
            pyramid     金字塔
            */
             type: 'area',
             animation:true,
             //margin:oOption.margin || [7,1,5,8],
             plotBorderWidth: 0,
             borderWidth:0,
             plotBorderColor: sBorderColor,
             backgroundColor: sBackgroundColor,
             borderColor: sChartBorderColor,
             borderRadius: 0,
             height: oOption.height,
             width: oOption.width,
             borderWidth: 0,
             events:{
                load:function()
                {
                    oOption.backSeries = this.series;
                }
             }
        },
        title: {text: oOption.title || null},
        tooltip: {enabled: false},
        xAxis: {
            //type: 'datetime',
            labels: {
                enabled: false
            },
            gridLineWidth: oOption.xGridLineWidth || 1,
            gridLineColor: sGridLineColor,
            //minorTickInterval: 4,
            //tickColor: '#fff',
            //tickInterval: 4,
            tickWidth:1,
            tickLength: 0,
            lineColor: sGridLineColor,
            lineWidth:1
        },
        legend:false,
        yAxis: {
            min: parseInt(oOption.min)||null,
            max: parseInt(oOption.max)||null,
            gridLineWidth: 1,
            gridLineColor: sGridLineColor,
            minorGridLineColor: sGridLineColor,
            // minorTickInterval: 1024*1024*1024*10,
            // tickInterval: 1024*1024*1024*20,
            lineWidth:1,
            lineColor:sGridLineColor,
            labels:{
            	style:{color: sStyleColor,}
            },
            title: {text:  null}
        },
        credits:{enabled:false},
        exporting:{enabled:false},
        plotOptions: {
        	areaspline: {
        		marker:{
        			enabled: false,
        			radius: 6
        		},
                fillColor: sFillColor

        		//,pointInterval: 10
        	},
            area: {
                marker: {
                    enabled: false
                },
                fillColor: sFillColor,
                lineWidth:1
            },
            series: {
                lineColor: sLineColor,
                enableMouseTracking: false
            }
        },
        series: oOption.series
        };
        
        this.chart = this.element.highcharts(opt);
    },
    
    setSize: function(width, height)
    {
    	this.chart.highcharts().setSize (width, height);
    },

    DynamicLine:function(oOption)
    {
         Highcharts.setOptions({
                        global: {
                            useUTC: false
                        }
                    });
        
       var oOptionDynamicLine={
                //colors:['green','red','blue'],

                credits:{enabled:false},
                exporting:
                {
                    buttons:
                    {
                        contextButton:{enabled:false}
                    }
                },
                chart:
                {
                     type: 'spline',
                     animation:false,
                     //animation: Highcharts.svg, // don't animate in old IE
                     //marginRight: oOption.margin,
                     events:{
                        load:function()
                        {
                            oOption.backSeries = this.series;
                        }
                     }
                },
                title: {text: null},
                xAxis: {type: 'datetime'},//,tickPixelInterval: 50
                yAxis: 
                {
                    min:oOption.min,
                    max:oOption.max,
                    title: {text: oOption.title},
                    plotLines: [{
                          value: 0,
                          width: 1
                        }]
                },
                tooltip: 
                {
                    formatter: function() 
                    {
                        return '<b>'+ this.series.name +'</b><br/>'+
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                            Highcharts.numberFormat(this.y, 0)+'%';
                    }
                },
                plotOptions: 
                {
                    spline: 
                    {
                        lineWidth: 1,
                        states: {hover: {lineWidth: 2}},
                        marker: {enabled: false}
                    }
                },
                legend: 
                {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    x: 0
                },
                exporting: {enabled: false},
                series:oOption.series
        }
        this.element.highcharts(oOptionDynamicLine);
    },
    
/*****************************************************************************
@FuncName: public, JQuery.plot.Bar
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  横向柱状图。
@Usage: 
    // HTML 代码
    <div id="container"></div>

    // 使用div容器的宽度和高度画折线图
    //data项里，每个大括号是一个数据系列。
    var oOption = {     
                    name:'Temperature',
                data: [{
                    name:'CPU temperature',
                    color:'#8BBC21',
                    y:30
                },{
                    name:'Memory temperature',
                    color:'#8BBC21',
                    y:50
                },{
                    name:'Flash temperature',
                    color:'#8BBC21',
                    y:60
                },{
                    name:'Mainboard temperature',
                    color:'#DF5353',
                    y:90
                    }
                ]                          
        };
     Frame.Plot.Bar("#container",oOption);
    
    
@ParaIn: 
            *sSelector:图表的容器
                *oOption:与series相关的配置信息，其中包括data
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
        Bar: function (oOption, aCategories)
    {
        var oOptionBar=
        {
            credits:{enabled:false},
            chart: {type: 'bar'},
            title: {text: null},
            subtitle: {text: null},
            exporting:
            {
                buttons:
                {
                    contextButton:{enabled:false}
                }
            },
            xAxis: 
            {
                categories: aCategories,
                title: {text: null}
            },
            yAxis: 
            {
                tickInterval:20,
                max:100,
                title: 
                {
                    text: null,
                    align: 'high'
                },
                labels: {overflow: 'justify'}
            },
            tooltip: 
            {
                valueSuffix: String.fromCharCode(176)+'C'
            },
            plotOptions: 
            {
                bar: 
                {
                    dataLabels: {enabled: true}
                }
            },
            legend: {enabled:false},
            credits: {enabled: false},
            series:[oOption]
        };
        
         this.element.highcharts(oOptionBar);      
    },
/*****************************************************************************
@FuncName: public, JQuery.plot.Column
@Usage:
            //html代码
            <div id="container"></div>
            //根据传入的长宽参数画相应的竖向柱状图
            //aData是一个数组
             var aData = new Array();
       for(var i = 0;i<aSeverity.length;i++)
       {
        aData.push(oSeverity[aSeverity[i]]);   
       }
            
            var oOption = {      
              series:{ 
                name: 'Counts',         //指定这一系列的数据的名称
                data: aData
              },
              width:720,
              height:300
        };
     Frame.Plot.Column("#container",oOption);
@ParaIn:
                *sSelector:图表的容器
                *oOption:与series相关的配置信息，其中包括data
@Description:  画竖向柱状图
*****************************************************************************/   
    Column:function(oOption)
    {
        var oOptionColumn=
        {
            chart: {
                type: 'column',
                backgroundColor: oOption.backgroundColor || "#1a4e95",
                plotBackgroundColor: {
            linearGradient: [0, 0, 250, 500],
            stops: [
                [0, oOption.stops0 || 'rgba(23, 70, 134, 1)'],
                [1, oOption.stops1 || 'rgba(23, 70, 134, 1)']
            ]
        },
                width:oOption.width,
                height:oOption.height
            },
            title: {
                text: ''    // ???
            },
            legend: {
                enabled:false
            },
            credits: {
                enabled: false
            },
            exporting:{
                            buttons:{
                                contextButton:{
                                    enabled:false
                                }   
                            }
                        },
            xAxis: {
                categories: oOption.x,
                gridLineWidth: 1,
                gridLineColor: oOption.gridLineColor || "#25518d",
                lineColor: "#25518d",
                tickLength: 0,
                labels:{
                    style: {
                        color: "#abbbde"
                    }
                }
            },
            yAxis: {
                min: 0,
                gridLineColor: oOption.gridLineColor || "#25518d",    
                title: {
                    text: ''  // ???
                },
                labels:{
                    style: {
                        color: "#abbbde"
                    }
                },
                allowDecimals:false
            },
            plotOptions: {
                  bar: {
                    dataLabels: {
                        enabled: true
                    }
                },
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series:[oOption.series]
        }

        var dataColor = oOption.dataColor || DefDataColor;
        var aData = oOptionColumn.series[0].data || [];
        for (var i=0; i<aData.length; i++)
        {
            var oData = $.isPlainObject(aData[i]) ? aData[i] : {y:aData[i]};

            if ($.isArray(dataColor))
            {
            	oData.color = dataColor[i];
            }
            else if ($.isFunction(dataColor))
            {
            	oData.color = dataColor(i, oData.y);
            }
            else if ($.isPlainObject(dataColor) && dataColor.getColor)
            {
            	oData.color = dataColor.getColor(i, oData.y);
            }

            aData[i] = oData;
        }

        this.chart = this.element.highcharts(oOptionColumn);
    }, 
/*****************************************************************************
@FuncName: public, JQuery.plot.Gauge
@Usage:
            //html代码
            <div id="container"></div>
            //使用div容器的宽度和高度来画带刻度值的表盘图
            var oOption={
            name: 'CPU',                                    //数据的名称
            data: [60],                                     //数据的具体值
            tooltip: {
                valueSuffix: ' %'                   //数据的单位
                }
        };
            var flag = true;
            Frame.Plot.Gauge("#container",oOption,flag);
@ParaIn:
                *sSelector:图表的容器
                *oOption:与series相关的配置信息，其中包括data
                *flag:是否显示刻度
@Description:  画仪表盘
*****************************************************************************/
        Gauge:function(oOption, flag)
        {
            var oOptionGauge={
                    credits:{
                        enabled:false               
                    },
                    exporting:{
                            buttons:{
                                    contextButton:{
                                        enabled:false
                                    }
                            }
                    },
                chart: {
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    events:{
                        load:function()
                        {
                            //oOption.series0=this.series[0];
                        }
                    }

                },
        
                title: {
                    text: null
                },
        
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },
           
        // the value axis
        yAxis: {
            min: 0,
            max: 100,
            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666', 
            tickPixelInterval: 25,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                enabled:flag,
                step:2,
                rotation:'auto'
            },
            title: {
                text: '%'
            },
            plotBands: [{
                from: 0,
                to: 60,
                color: '#55BF3B' // green
            }, {
                from: 60,
                to: 80,
                color: '#DDDF0D' // yellow
            }, {
                from: 80,
                to: 100,
                color: '#DF5353' // red
            }]        
        },
                 series: [oOption]
                }
            this.element.highcharts(oOptionGauge);  
            
        },

/*****************************************************************************
@FuncName: public, JQuery.plot.Pie
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  饼图
@Usage: 
    var aData = [
        {label:"info", data:32},
        {label:"warning", data:12},
        {label:"error", data:54},
        {label:"log", data:72}
    ];
    Frame.Signal.wait(Frame.Plot.NAME, "init", function(bTimeout)
    {
        Frame.Plot.Pie("#myplotdiv", aData)
    }
@ParaIn: 
    * sSelector, selector, JQuery选择器字符串，大部分情况下选择的结果应该唯一，建议使用ID
    * aData, Array, 绘图数据数组，元素类型为包含label和data两个属性的对象，比如：{label:"error", data: 34}
@Return: jObject，返回sSelector对应的JQuery对象
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/    
    Pie: function (oOption)
    {
    var opt = {
            chart:
            {
                 type: 'pie'
            },
            title: 
            {
                text: null
            },
            tooltip: {enabled: false},
            credits:{enabled:false},
            exporting:{enabled:false},
            colors: [
               '#9CD10D', 
               '#F1F1F1'
            ],
            plotOptions: 
            {
                pie: {
                    size: 95,
                    borderColor: '#FFF'
                },
                series: {
                    enableMouseTracking: false,
                    dataLabels: {
                        align: 'left',
                        enabled: false,
                        rotation: 0,
                        x: 0,
                        y: 0
                    }
                }
            },
            series: oOption.series 
        }
            // 开始绘图
        this.element.highcharts(opt); 
    },
/*****************************************************************************
@FuncName: public, JQuery.plot.Stack
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description: 中间有间隔的柱状图. 和Frame.Plot.Bar的区别是本Bar的各柱之间没有间隔而Stack有
@Usage: 
    var aData = [
        {label:"info", data:32},
        {label:"warning", data:12},
        {label:"error", data:54},
        {label:"log", data:72}
    ];
    Frame.Signal.wait(Frame.Plot.NAME, "init", function(bTimeout)
    {
        Frame.Plot.Stack("#myplotdiv", aData)
    }
@ParaIn: 
    * sSelector, selector, JQuery选择器字符串，大部分情况下选择的结果应该唯一，建议使用ID
    * aData, Array, 绘图数据数组，元素类型为包含label和data两个属性的对象，比如：{label:"error", data: 34}
@Return: jObject，返回sSelector对应的JQuery对象
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    Stack: function(option)
    {
        var aData = option.data;
        
        var t=[], d=[];
        for(var i=0; i<aData.length; i++)
        {
            t[i] = [i, aData[i].label];
            d[i] = [i, aData[i].data];
        }

        // 准备绘图选项
        var opt = 
        {
            colors: ThemeConfig.Plot.Bar,
            xaxis: {ticks: t},
            yaxis: {tickDecimals:0},
            series: {
                stack: true,
                lines: { show: false, fill: true, steps: false },
                bars: { show: true, barWidth: 0.6 }
            },
            width: option.width,
            height: option.height
        };

        // 开始绘图
        return _create(this.element, [d], opt);
    },
/*****************************************************************************
@FuncName: public, JQuery.plot.refresh
@DateCreated: 2012-01-31
@Author: huangdongxiao 02807
@Description: 刷新折线图,柱状图等.
@Usage: 
    var aData = [
        {label:"info", data:32},
        {label:"warning", data:12},
        {label:"error", data:54},
        {label:"log", data:72}
    ];
    Frame.Plot.refresh("#myplotdiv", aData);
@ParaIn: 
    * sSelector, selector, JQuery选择器字符串，大部分情况下选择的结果应该唯一，建议使用ID
    * aData, Array, 绘图数据数组，元素类型为包含label和data两个属性的对象，比如：{label:"error", data: 34}
@Return: jObject，返回sSelector对应的JQuery对象
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    refresh: function(aData)
    {
        var jObj = this.element;
        var opt = jObj.data("opt");

        if(true === opt.autoY)
        {
            opt.plot.setupGrid();
        }
        
        opt.plot.setData(aData);
        opt.plot.draw();
        return opt.plot;
    }
};

function _init(oFrame)
{
    $(".plot", oFrame).plot();
}

function _destroy(oFrame)
{
    //$(".mlist", oFrame).mlist("destroy");
}

$.widget("ui.plot", oPlot);


Frame.regNotify(WIDGETNAME, "loaded", function()
{
    // All the depended files were loaded
    Widgets.regWidget(WIDGETNAME, {
        "init": _init, "destroy": _destroy, 
        "widgets": [], 
        "utils":[],
        "libs": []
    });
});

Frame.include(WIDGETNAME, 
    "Frame.Widgets.Highcharts.highcharts;Frame.Widgets.Highcharts.highcharts-more;Frame.Widgets.Highcharts.exporting");

})(jQuery);
