;(function($)
{
var WIDGETNAME = "Echart";
var echarts;
var myChart;
var oEchart = {
    _create : function()
    {

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
                    fontFamily : 'Microsoft YaHei',
                    fontWeight : 'normal'
                },
                subtextStyle : {
                    color : '#FFF',
                    fontFamily : 'Microsoft YaHei',
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
                if(opt.myLegend)
                {
                    var hLeg = new Legend();
                    hLeg.draw(opt,oDefTheme,ele.children());
                    hLeg.hover(myChart.chart);
                }
            }
        );
        this.element.data("instance", myChart);
        return myChart;
    },
};

var Legend = function(){
    var draw = function(opt,theme,container){
        var aList = opt.series[0].data || [],
            aColor = theme.color || [],
            $legend = $(opt.myLegend.scope).clone();
        var aHtml = [], nTotal = 0, oCss , $container, xFlag, yFlag;

        for(var i=0;i<aList.length;i++)
        {
            if( aList[i].name === '_padding' || aList[i].name === "") continue;
            nTotal += aList[i].value;
        }

        for(var i=0;i<aList.length;i++)
        {
            var oItem = aList[i], sHtml, nPercent;
            if( oItem.name == '_padding'  || oItem.name === "") continue;
            //var nPercent = Math.round((oItem.value / nTotal) * 100) + "%";
            var nPercent =Math.round((oItem.value / nTotal)*100 * Math.pow(10, 2)) / Math.pow(10, 2)+"%" ;
            sHtml ='<div class="leg-row">'+
                '<span class="leg-icon" style="background:'+ aColor[i] + '"></span>'+
                '<span class="leg-title" title="'+oItem.name+'">' + oItem.name +  '</span>'+
                '<span class="leg-percent">'+ nPercent+'</span>'+
                '</div>';
            aHtml.push(sHtml);
        }

        var oCss = {
            "width" : opt.myLegend.width || "100%",
            "height" : opt.myLegend.height || "100%",
        };
        
        if(opt.myLegend.left)
        {
            xFlag = true;
            oCss.left = opt.myLegend.left;
        }

        if(opt.myLegend.right)
        {
            xFlag = true;
            oCss.right = opt.myLegend.right;
        }

        if(opt.myLegend.top)
        {
            yFlag = true;
            oCss.top = opt.myLegend.top;
        }

        if(opt.myLegend.bottom)
        {
            yFlag = true;
            oCss.bottom = opt.myLegend.bottom;
        }

        if(!xFlag) oCss.right = "0";
        if(!yFlag) oCss.top = "0";

        $container = $(container).css({"position":"relative"});
        $container.find('div').css({"z-index":3});

        $legend.empty()
               .addClass('leg-panel')
               .append(aHtml.join(""))
               .appendTo($container)
               .css(oCss);

        this.option.element = $legend;
    };

    
    var hover = function(chart){
        var $ele = this.option.element;
        chart.on("hover",function(obj,e){
            var n = obj.dataIndex;
            $ele.find('.leg-row').each(function(i,item){
                i == n ? $(item).addClass("leg-hover") : $(item).removeClass("leg-hover");
            });
        });
    };

    var _option = {
        element : null
    };

    this.option = _option;
    this.draw = draw;
    this.hover = hover;
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