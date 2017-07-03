;(function($)
{
var WIDGETNAME = "Echart";
var echarts;
var myChart;
var oEchart = {
    _create : function()
    {
	    // Step:3 conifg ECharts's path, link to echarts.js from current page.
	    // require.config({
	    //     paths:{ 
	    //         echarts:'/frame/widgets_new/echarts'
	    //         ,'echarts/chart/bar' : '/frame/widgets_new/echarts'      // 把所需图表指向单文件
	    //         ,'echarts/chart/line': '/frame/widgets_new/echarts'
	    //         ,'echarts/chart/pie' : '/frame/widgets_new/echarts'
     //            ,'echarts/chart/map' : '/frame/widgets_new/echarts'
	    //         // ,'echarts/chart/gauge': '/frame/widgets_new/echarts'
	    //         // ,'echarts/chart/funnel': '/frame/widgets_new/echarts'
	    //         // ,'echarts/chart/scatter' : '/frame/widgets_new/echarts'
	    //         // ,'echarts/chart/k': '/frame/widgets_new/echarts'
	    //         // ,'echarts/chart/radar': '/frame/widgets_new/echarts'
	    //         // ,'echarts/chart/chord' : '/frame/widgets_new/echarts'
	    //         // ,'echarts/chart/force': '/frame/widgets_new/echarts'
	    //     }
	    // });
    },
    _destroy:function()
    {
    },
    init:function(opt,oTheme)
    {
        var myChart = {
            chart: false,
            addPoint: function (data, xAxis)
            {
                if($.isArray(data))
                {
                    var aData = [[0, data[0], false, false, xAxis]];
                    for(var i=1,len=data.length; i<len; i++)
                    {
                        aData.push([i, data[i], false, false]);
                    }
                    this.chart.addData(aData);
                }
                else
                {
                    this.chart.addData(0, val, false, false, xAxis);
                }
            },
            setOption: function (opt, notMerge)
            {
                
                this.chart.setOption(opt, notMerge);
               
            },
            resize: function()
            {
                this.chart.resize();
            }
                    };
        var ele = this.element;

        ele.width(opt.width || opt.radius*2);
        ele.height(opt.height || opt.radius*2);
        var oDefTheme={
            title:{
                textStyle : {
                    fontFamily : '微软雅黑',
                    fontWeight : 'normal'
                },
                subtextStyle : {
                    color : '#FFF',
                    fontFamily : '微软雅黑',
                    fontSize : 16,
                    fontWeight : 'normal'
                }
            },
            color: [

                '#0096d6','#1EBBA6','#ED8263','#FF96C6',
                '#b9b8bb','#42EBD6','#F7824A','#3196A5','#8f3e8d',
                '#84BE94','#59bbe4','#767676','#cda9cc','#822980',
                '#008424','#05b2d2','#2d373f','#a3b0b7','#ee7836',
                '#56c4c3','#00a8ff','#2ec7c9','#b6a2de','#5ab1ef',
                '#ffb980','#d87a80','#97b552','#95706d','#c9ab00',
                '#8d98b3','#e5cf0d','#dc69aa','#7eb00a','#6f5553',
                '#07a2a4','#9a7fd1','#588dd5','#f5994e','#59678c',
                '#c14089'
            ]
        };
        $.extend(oDefTheme,true,oTheme);
        require(
            [
                'echarts',
                'echarts/chart/pie',
                'echarts/chart/bar',
                "echarts/chart/line",
                "echarts/chart/map"
            ],
            function (ec)
            {
                var ecConfig = require('echarts/config');
                myChart.chart = ec.init(ele[0]);
                myChart.chart.setOption(opt);
                myChart.chart.setTheme(oDefTheme);
                myChart.chart.on(ecConfig.EVENT.CLICK, opt.click||function(){});
                myChart.chart.on(ecConfig.EVENT.LEGEND_SELECTED, opt.legendSelect||function(){});
                myChart.chart.on(ecConfig.EVENT.MAP_SELECTED,opt.mapSelect || function (){});
            }
        );
        this.element.data("instance", myChart);
        return myChart;
    },
    pie: function (oParas)
    {
		var myChart = {
			chart: false,
			addPoint: function (data)
			{
				this.chart.addData(0, data);
			}
		};

    	var ele = this.element;
		oParas.radius = oParas.radius || 70;
		ele.width(oParas.width || oParas.radius*2);
		ele.height(oParas.height || oParas.radius*2);

		var dataStyle = {
		    normal: {
		        label: {show:false},
		        labelLine: {show:false}
		    }
		};
		var placeHolderStyle = {
		    normal : {
		        color: oParas.bgColor || 'rgba(225,243,253,1)',
		        label: {show:false},
		        labelLine: {show:false}
		    },
		    emphasis : {
		        color: 'rgba(0,0,0,0)'
		    }
		};
		var sInnerTitle = false;
		if ("string" == typeof(oParas.title))
		{
			sInnerTitle = oParas.title;
			oParas.title = {};
		}

		oParas.title = $.extend({
			text:"", 
			subtext:"", 
			sublink:"", 
			textStyle:{}
		}, oParas.title);

		oParas.title.textStyle = $.extend({
			color:'rgba(255,255,255,1)',
			fontSize: 20
		}, oParas.title.textStyle);

        var sColor = oParas.color || '#70ceef';

		var opt = {
		    animation: false,
		    title: {
		        text: oParas.title.text,
		        subtext: oParas.title.subtext,
		        sublink: oParas.title.sublink,
		        x: 'center', y: 'center',
		        itemGap: 20
		    },
		    tooltip : {
		        show: false,
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
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
		    series : [
		        {
		            name:oParas.series.name,
		            type:'pie',
		            clockWise:true,
		            startAngle : 0,
                    center: oParas.series.center || ["50%","50%"],
		            radius : oParas.series.radius || ["80%","100%"],
		            itemStyle : dataStyle,
		            data:[
		                {
		                    value:oParas.series.data,
		                    name:oParas.series.name
		                },
		                {
		                    value:100-oParas.series.data,
		                    name:'invisible',
		                    itemStyle : placeHolderStyle
		                }
		            ]
		        }
		    ]
		};
              
	    // Step:4 require echarts and use it in the callback.
	    require(
	        [
	            'echarts',
	            'echarts/chart/pie'
	        ],
            function (ec)
            {
	            myChart.chart = ec.init(ele[0]);
				myChart.chart.setOption(opt);
				myChart.chart.setTheme({
					color: [sColor],
		            backgroundColor: oParas.backgroundColor || 'rgba(0,0,0,0)',
		            title:{
				        textStyle : {
				            color : oParas.title.textStyle.color,
				            fontFamily : '微软雅黑',
				            fontSize : oParas.title.textStyle.fontSize,
				            fontWeight : 'normal'
				        },
				        subtextStyle : {
				            color : 'rgba(255,255,255,1)',
				            fontFamily : '微软雅黑',
				            fontSize : 16,
				            fontWeight : 'normal'
				        }
		            }
				});
            }
	    );
		if (sInnerTitle)
		{
			$(sInnerTitle).appendTo(ele);
		}
		this.element.data("instance", myChart);
		return myChart;
    },
    setPieTheme: function(oParas)
    {
        var oInstance = this.element.data("instance");

	    var oTheme = {};

	    if (oParas.color)
	    {
	    	oTheme.color = $.isArray(oParas.color) ? oParas.color : [oParas.color];
	    }

	    if (oParas.backgroundColor)
	    {
	    	oTheme.backgroundColor = oParas.backgroundColor;
	    }

    	oInstance.chart.setTheme(oTheme);
    },
    bar: function (oParas)
    {
		var opt = {
            color: ['#eb433a','#eb433a','#ff7200','#ff7200','#dbb01d','#dbb01d','#8a8a8a','#8a8a8a'],
			tooltip:{
		        show : true,
		        trigger: 'axis',
			    axisPointer : {type : 'none'}
			},
		    grid: {
		        x:20, y:10, x2:20, y2:25,
		        backgroundColor : 'rgba(0,0,0,0.1)',
		        borderColor : 'rgba(255,255,255,0.1)'
		    },
		    xAxis : [{
                axisLabel : {
                    show:true,  //
                    'interval':0,
                    textStyle : {
                        color: oParas.Axis_textStyle_color || '#abbbde'
                    }
                },
                axisLine  : {
                    show:false,
                    lineStyle :{color: 'rgba(255,255,255,0.05)', width: 1}   //
                },
                axisTick : {
                    show:false
                },
                splitLine : {
                    show:true,
                    lineStyle: {
                        color: oParas.Axis_splitLine_lineStyle_color || 'rgba(255,255,255,0.1)',
                        type: 'solid',
                        width: 1
                    }
                },
                splitArea : {
                    areaStyle : {
                        color: '#174686'
                    }
                },
	            // type : 'category',
	            data : oParas.x  // ['1ÔÂ','2ÔÂ','3ÔÂ','4ÔÂ','5ÔÂ','6ÔÂ','7ÔÂ','8ÔÂ','9ÔÂ','10ÔÂ','11ÔÂ','12ÔÂ']
		    }],
		    yAxis : [{
                axisLabel : {
                    show:true,  //
                    textStyle : {
                        color: oParas.Axis_textStyle_color || '#abbbde'
                    }
                },
                axisLine  : {
                    show:false,
                    lineStyle :{color: 'rgba(255,255,255,0.05)', width: 1}   //
                },
                axisTick : {
                    show:false
                },
                splitLine : {
                    show:true,
                    lineStyle: {
                        color: oParas.Axis_splitLine_lineStyle_color || 'rgba(255,255,255,0.1)',
                        type: 'solid',
                        width: 1
                    }
                },
	            // type : 'value',
                splitArea : {
                    areaStyle : {
                        color: '#174686'
                    }
                }
		    }]
		};

		oParas.requires = ['echarts', 'echarts/chart/bar'];

    	return this._show (opt, oParas, function(oSeries)
    		{
    			oSeries.type = "bar";
    			if (oParas.dataColor)
    			{
    				var dataColor = oParas.dataColor;
			        var aData = oSeries.data;
			        for (var i=0; i<aData.length; i++)
			        {
			        	var sColor = "red";
			            var oData = $.isPlainObject(aData[i]) ? aData[i] : {y:aData[i]};

			            if ($.isArray(dataColor))
			            {
			            	sColor = dataColor[i];
			            }
			            else if ($.isFunction(dataColor))
			            {
			            	sColor = dataColor(i, oData.y);
			            }
			            else if ($.isPlainObject(dataColor) && dataColor.getColor)
			            {
			            	sColor = dataColor.getColor(i, oData.y);
			            }

    					var oData = {
    						value: aData[i],
    						itemStyle: {
    							normal: {
		                            color: sColor
		                            // ,borderWidth: 1
		                        }
    						}
    					};
    					aData[i] = oData;
			        }
    			}
    			if(oParas.series.barWidth)
    			{
    			    oSeries.barWidth = oParas.series.barWidth;                    
    			}
    		});
    }, 
    area: function (oParas)
    {
            oParas.area = true;
        var sColor = oParas.color || 'rgba(140,216,242,1)';
        
		oParas.yAxisLabel = $.extend({
			show:false
		}, oParas.yAxisLabel);
        
		var opt = {
			tooltip:{
		        show : true,
		        trigger: 'axis',
		        axisPointer : {type : 'none'},
		        position : function(p) {
		            return [p[0], p[1]-22];
		        }
			},
		    grid: {
    		    x:oParas.grid_x || 0, y:oParas.grid_y || 0, x2:oParas.grid_x2 || 0, y2:oParas.grid_y2 || 0,
		        backgroundColor : 'rgba(0,0,0,0)',
                borderColor : 'rgba(0,0,0,0)'
		    },
		    xAxis : [{
	            type : 'category',
	            boundaryGap : false,
                splitLine : {
                    show:true,
                    lineStyle: {
                        type: 'solid',
                        width: 1
                    }
                },
                axisLabel : {
                    show: false //oParas.xAxis.axisLabel.show || false  //
                },
                axisLine  : {
                    show:false,
                    lineStyle :{color: 'rgba(255,255,255,0.1)', width: 1}   //
                },
                axisTick : {
                    show:false
                },
	            data : oParas.x //['ÖÜÒ»','ÖÜ¶þ','ÖÜÈý','ÖÜËÄ','ÖÜÎå','ÖÜÁù','ÖÜÈÕ']
		    }],
		    yAxis : [{
	            type : 'value',
                splitLine : {
                    show:true,
                    lineStyle: {
                        type: 'solid',
                        width: 1
                    }
                },
                axisLabel : {
                    show: oParas.yAxisLabel.show//oParas.yAxis.axisLabel.show || false
                },                    
                axisLine : {
                    show:false,
                    lineStyle :{color: 'rgba(255,255,255,0.1)', width: 1}   //
                },
                axisTick : {
                    show:false
                }
	        }]
		};

		oParas.requires = ['echarts', 'echarts/chart/line'];

    	return this._show (opt, oParas, function(oSeries)
    		{
				oSeries.symbol = "none";
				oSeries.type = "line";
				oSeries.smooth = (false!==oParas.smooth);
				if (true == oParas.area)
				{
					oSeries. itemStyle = {normal: {areaStyle: {type: 'default'}}}
				}
    		});
    },
    setLineTheme: function(oParas)
    {
        var oInstance = this.element.data("instance");

	    var oTheme = {};
	    if (oParas.color)
	    {
	    	oTheme.color = $.isArray(oParas.color) ? oParas.color : [oParas.color];
	    }
	    if (oParas.XlineStyle_Color)
	    {
	    	oTheme.valueAxis={splitLine:{lineStyle:{color:[oParas.XlineStyle_Color]}}};
	    }
	    if (oParas.YlineStyle_Color)
	    {
	    	oTheme.categoryAxis={splitLine:{lineStyle:{color:[oParas.YlineStyle_Color]}}};
	    }
	    if (oParas.XAxis_axisLabel_Color)
	    {
	        if(!oTheme.valueAxis)
	        {
	    	    oTheme.valueAxis={axisLabel:{textStyle:{color:[oParas.XAxis_axisLabel_Color]}}};
	        }
            else 
            {
	    	    oTheme.valueAxis.axisLabel={textStyle:{color:[oParas.XAxis_axisLabel_Color]}};
            }
	    }
    	oInstance.chart.setTheme(oTheme);
    },

        line: function (opt,oTheme)
        {
            var ele = this.element;
            opt.requires = ['echarts', 'echarts/chart/line'];
            var oDefOpt ={
            };

            opt.width && ele.width(opt.width);
            opt.height && ele.height(opt.height);

            var oDefTheme = {
//                "color": [ 'rgba(140,216,242,1)'],
                "color": [ 'rgba(0,150,214,1)'],
                "valueAxis":{
                    "splitLine":{"lineStyle":{"color":[ 'rgba(255,255,255,0.1)']}},
                    "axisLabel":{"textStyle": {"color": [ '#abbbde']}}
                },
                "categoryAxis":{
                    "splitLine":{"lineStyle":{"color":[ 'rgba(255,255,255,0.1)']}}
                }
            };
            $.extend(oDefTheme,true,oTheme);
            $.extend(oDefOpt,true,opt);

            var myChart = {
                chart: false,
                addPoint: function (data)
                {
                    var val = ($.isArray(data)) ? data[1] : data;
                    this.chart.addData(0, val);
                }
            };
            require(
                opt.requires,
                function (ec)
                {
                    myChart.chart = ec.init(ele[0]);
                    myChart.chart.setOption(oDefOpt);
                    myChart.chart.setTheme(oDefTheme);
                }
            );
            this.element.data("instance", myChart);
            return myChart;
        },

    _show: function (opt, oParas, pfSeariesCb)
    {
        // oSeries = {
        //     name:'½µË®Á¿',
        //     type:'bar',
        //     data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        // }
		var aSeries;
		if ($.isArray(oParas.series))
		{
			aSeries = oParas.series;
		}
		else if ($.isPlainObject(oParas.series))
		{
			aSeries = [oParas.series];
		}
		else
		{
			return false;
		}
		for (var i=0; i<aSeries.length; i++)
		{
			pfSeariesCb (aSeries[i]);
		}

    	var ele = this.element;
    	oParas.width && ele.width(oParas.width);
    	oParas.height && ele.height(oParas.height);

		$.extend(opt, {
			calculable : true,
			series: aSeries,
			toolbox:{
		        show : false,
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            magicType : {show: true, type: ['line', 'bar']},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    }
		})

		// xAxis
		if (!opt.xAxis[0].data)
		{
			opt.xAxis[0].data = [];
			for (var i=0; i<aSeries[0].data.length; i++)
			{
				opt.xAxis[0].data.push ("");
			}
		}

	    // Step:4 require echarts and use it in the callback.
		var myChart = {
			chart: false,
			addPoint: function (data)
			{
				var val = ($.isArray(data)) ? data[1] : data;
				this.chart.addData(0, val);
			}
		};
	    require(
	    	oParas.requires,
            function (ec)
            {
	            myChart.chart = ec.init(ele[0]);
				myChart.chart.setOption(opt);
				myChart.chart.setTheme({
					"color": [oParas.color || 'rgba(140,216,242,1)'],
                    "valueAxis":{
                        "splitLine":{"lineStyle":{"color":[oParas.XlineStyle_Color || 'rgba(255,255,255,0.1)']}},
                            "axisLabel":{"textStyle": {"color": [oParas.XAxis_axisLabel_Color || '#abbbde']}}
                    },
                    "categoryAxis":{
                        "splitLine":{"lineStyle":{"color":[oParas.YlineStyle_Color || 'rgba(255,255,255,0.1)']}}
                    }
				});
        }
	    );
		this.element.data("instance", myChart);
    	return myChart;
    }
};

function _init(oFrame)
{
    $(".myEchart", oFrame).echart();
}

function _destroy(oFrame)
{

}

$.widget("ui.echart", oEchart);


// All the depended files were loaded
Widgets.regWidget(WIDGETNAME, {
    "init": _init, "destroy": _destroy, 
    "widgets": [], 
    "utils":[],
    "libs": ["Widgets.Echart.Esl"
    		,"Widgets.Echart.Echarts"]
});

})(jQuery);