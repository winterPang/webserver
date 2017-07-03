/*******************************************************************************
 Copyright (c) 2011, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:libs/frame/plot.js
@ProjectCode: Comware v7
@ModuleName: Frame.Plot
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description: 
    ��ͼ�ؼ���װ����������ͼ����ͼ����״ͼ�����ؼ����Զ�װ����ҪJS�ļ�����װ����ɺ���init��ɵ��źš�
    �����ʹ�ñ��ؼ��Ĺ���ʱ�������ڵȵ��ؼ���init�źź���ܵ�����صĻ�ͼ�ӿڡ�
@Modification:
*******************************************************************************/

;(function($F)
{

var MODULE_NAME = "Libs.Frame.Plot";

var DEF_WIDTH = MyConfig.Plot.width;
var DEF_HEIGHT = 100;

var _cb = [];

/*****************************************************************************
@FuncName: private, Frame.Plot._Create
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  ����һ����ͼ���ýӿ��ǶԿ�Դ�ؼ�Plot�ķ�װ��
@Usage: 
    _create(sSelector, iWidth, iHeight, aData, opt);
@ParaIn: 
    * sSelector, selector, ��������
    * aData, Array, ����optѡ�ͬ�����ݵ�����Ҳ��ͬ
    * opt,FlotOption, ��ͼѡ���ο�flot.js�е�options
@Return: Dialog����,�ڻص������п��Ե���close�رնԻ���.
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
function _create(sSelector, aData, opt)
{
    var jObj = $(sSelector);
    jObj.data("opt", opt);
    
    // ���ÿ�Ⱥ͸߶�
    opt.width && jObj.width(opt.width);
    opt.height && jObj.height(opt.height);
    
    opt.width = jObj.width();
    opt.height = jObj.height();

        //alert(opt.width);
    // ���ÿ�Դ�ؼ���ͼ
    var jPlot = $.plot(sSelector, aData, opt);
        //jObj.css({height: (opt.height+10)+"px"});
   // opt.plot = jPlot;
    return jPlot;
}

var Plot = 
{
    NAME: MODULE_NAME,

    // Highcharts.setOptions({
    //                     global: {
    //                         useUTC: false
    //                     }
    //                 });

/*****************************************************************************
@FuncName: public, Frame.Plot.Line
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  ������ͼ����С������div�Ĵ�С����
@Usage: 
    // HTML ����
    <div id="container"></div>

    // ��������С��ͼ��
    var oOption = [{
                name: 'CPU',
                data: [10,20,30,23,56]
            }, {
                name: 'Mem', 
                data: [20,33,21,89,54]
            }]��  //���Ƕ����������е�����
        Frame.Plot.Line("#container",oOption);
  
  
@ParaIn: 
    * sSelector, ��������
    * oOption, ��������
@Return: jObject, ����ͼ����
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    Line: function (sSelector, oOption)
    {
        // ׼����ͼѡ��
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
        $(sSelector).highcharts(oOptionLine);
    },
    
    area: function(sSelector, oOption)
    {
        var sBorderColor = oOption.BorderColor||"#214575";
        var sGridLineColor = oOption.GridLineColor || "#214575";
        var sPlotColor = oOption.PlotColor || "#5fafd2";
        var sFillColor = oOption.FillColor || "#5fafd2";
        var sLineColor = oOption.LineColor || "#5fafd2";
        var sBackgroundColor = oOption.backgroundColor || "#12386b";
        var sGridLineColor = oOption.gridLineColor || "#214575";
        var sChartBorderColor = oOption.ChartBorderColor||"#214575";

	var opt = {
            chart:
            {
                 type: 'area',
                 animation:true,
                 margin:[3,0,1,0],
                 plotBorderWidth: 0,
                 borderWidth:0,
                 plotBorderColor: sBorderColor,
                 backgroundColor: sBackgroundColor,
                 borderColor: sChartBorderColor,
                 borderRadius: 0,
                 borderWidth: 1,
                 events:{
                    load:function()
                    {
                        oOption.backSeries = this.series;
                    }
                 }
            },
            title: {text: null},
            tooltip: {enabled: false},
            xAxis: {
  		   type: 'datetime',
                gridLineWidth: 1,
                gridLineColor: sGridLineColor,
                minorTickInterval: 30000,
                //tickColor: '#fff',
                tickInterval: 30000,
                tickWidth:0,
                lineColor: '#FF0000',
                lineWidth:0,
                tickLength: 0,
				labels:{enabled:false}
			},
			legend:false,
		yAxis: {
    			min: oOption.min||0,
    			max: oOption.max||100,
                gridLineWidth: 0,
                gridLineColor: sGridLineColor,
                minorTickInterval: 50,
                //tickInterval: 50,
                lineWidth:0,
                minorGridLineColor: sGridLineColor,
			    title: {text: false}
			},
			credits:{enabled:false},
			exporting:{enabled:false},
			plotOptions: {
				area: {
				    marker: {
						enabled: false
					},
					lineWidth:1
				},
                series: {
                    lineColor: sLineColor,
                    enableMouseTracking: false
                }
			},
			series: oOption.series
		};

		opt.colors = sPlotColor;
		opt.plotOptions.area.fillColor = sFillColor;
		
		
        $(sSelector).highcharts(opt);    
    },

    DynamicLine:function(sSelector,oOption)
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
        $(sSelector).highcharts(oOptionDynamicLine);
    },
    
/*****************************************************************************
@FuncName: public, Frame.Plot.Bar
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  ������״ͼ��
@Usage: 
    // HTML ����
    <div id="container"></div>

    // ʹ��div�����Ŀ�Ⱥ͸߶Ȼ�����ͼ
    //data���ÿ����������һ������ϵ�С�
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
            *sSelector:ͼ�������
                *oOption:��series��ص�������Ϣ�����а���data
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    Bar: function (sSelector, oOption, aCategories)
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
        
         $(sSelector).highcharts(oOptionBar);      
    },
/*****************************************************************************
@FuncName: public, Frame.Plot.Column
@Usage:
            //html����
            <div id="container"></div>
            //���ݴ���ĳ����������Ӧ��������״ͼ
            //aData��һ������
             var aData = new Array();
       for(var i = 0;i<aSeverity.length;i++)
       {
        aData.push(oSeverity[aSeverity[i]]);   
       }
            
            var oOption = {      
              series:{ 
                name: 'Counts',         //ָ����һϵ�е����ݵ�����
                data: aData
              },
              width:720,
              height:300
        };
     Frame.Plot.Column("#container",oOption);
@ParaIn:
                *sSelector:ͼ�������
                *oOption:��series��ص�������Ϣ�����а���data
@Description:  ��������״ͼ
*****************************************************************************/   
        Column:function(sSelector,oOption)
        {
            var oOptionColumn={
                         chart: {
                type: 'column',
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
                categories: oOption.x
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''  // ???
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
                $(sSelector).highcharts(oOptionColumn);     
        }, 
    
/*****************************************************************************
@FuncName: public, Frame.Plot.Gauge
@Usage:
            //html����
            <div id="container"></div>
            //ʹ��div�����Ŀ�Ⱥ͸߶��������̶�ֵ�ı���ͼ
            var oOption={
            name: 'CPU',                                    //���ݵ�����
            data: [60],                                     //���ݵľ���ֵ
            tooltip: {
                valueSuffix: ' %'                   //���ݵĵ�λ
                }
        };
            var flag = true;
            Frame.Plot.Gauge("#container",oOption,flag);
@ParaIn:
                *sSelector:ͼ�������
                *oOption:��series��ص�������Ϣ�����а���data
                *flag:�Ƿ���ʾ�̶�
@Description:  ���Ǳ���
*****************************************************************************/
        Gauge:function(sSelector, oOption, flag)
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
            $(sSelector).highcharts(oOptionGauge);  
            
        },



/*****************************************************************************
@FuncName: public, Frame.Plot.Pie
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  ��ͼ
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
    * sSelector, selector, JQueryѡ�����ַ������󲿷������ѡ��Ľ��Ӧ��Ψһ������ʹ��ID
    * aData, Array, ��ͼ�������飬Ԫ������Ϊ����label��data�������ԵĶ��󣬱��磺{label:"error", data: 34}
@Return: jObject������sSelector��Ӧ��JQuery����
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/    
    Pie: function (sSelector, oOption)
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
	        // ��ʼ��ͼ
        $(sSelector).highcharts(opt); 
    },
/*****************************************************************************
@FuncName: public, Frame.Plot.Stack
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description: �м��м������״ͼ. ��Frame.Plot.Bar�������Ǳ�Bar�ĸ���֮��û�м����Stack��
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
    * sSelector, selector, JQueryѡ�����ַ������󲿷������ѡ��Ľ��Ӧ��Ψһ������ʹ��ID
    * aData, Array, ��ͼ�������飬Ԫ������Ϊ����label��data�������ԵĶ��󣬱��磺{label:"error", data: 34}
@Return: jObject������sSelector��Ӧ��JQuery����
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    Stack: function(sSelector, option)
    {
        var aData = option.data;
        
        var t=[], d=[];
        for(var i=0; i<aData.length; i++)
        {
            t[i] = [i, aData[i].label];
            d[i] = [i, aData[i].data];
        }

        // ׼����ͼѡ��
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

        // ��ʼ��ͼ
        return _create(sSelector, [d], opt);
    },
    
/*****************************************************************************
@FuncName: public, Frame.Plot.refresh
@DateCreated: 2012-01-31
@Author: huangdongxiao 02807
@Description: ˢ������ͼ,��״ͼ��.
@Usage: 
    var aData = [
        {label:"info", data:32},
        {label:"warning", data:12},
        {label:"error", data:54},
        {label:"log", data:72}
    ];
    Frame.Plot.refresh("#myplotdiv", aData);
@ParaIn: 
    * sSelector, selector, JQueryѡ�����ַ������󲿷������ѡ��Ľ��Ӧ��Ψһ������ʹ��ID
    * aData, Array, ��ͼ�������飬Ԫ������Ϊ����label��data�������ԵĶ��󣬱��磺{label:"error", data: 34}
@Return: jObject������sSelector��Ӧ��JQuery����
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    refresh: function(sSelector, aData)
    {
        var jObj = $(sSelector);
        var opt = jObj.data("opt");

        if(true === opt.autoY)
        {
            opt.plot.setupGrid();
        }
        
        opt.plot.setData(aData);
        opt.plot.draw();
        return opt.plot;
    }

} //// end of Plot
$F.Plot = Plot;

Frame.regNotify(MODULE_NAME, "loaded", function()
    {
        // ���JS�ļ��Ѿ�load���, ֪ͨҳ��isReady
        Frame.Signal.ready(MODULE_NAME, "init");
    });

Frame.include(MODULE_NAME, 
    "Frame.Widgets.Highcharts.highcharts;Frame.Widgets.Highcharts.highcharts-more;Frame.Widgets.Highcharts.exporting");

})(Frame);

