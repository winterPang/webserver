(function ($)
{
var MODULE_NAME = "WDashboard.Usage";

var g_oLineChart;
var g_oResizeTimer;
var g_oTimer ;
var oAPData={"ManualApNum":"153", "RunApNum":"256", "OfflineApNum":"123","UnhealthyApNum":"12","UnAuthApNum":"75","ApGroupNum":"32","LocationNum":"15","NorthIfOutPkt":"18964","NorthIfOutByte":"164685","NorthIfInPkt":"156489","NorthIfInByte":"251566","Is5gRadioNum":"10","Is2gRadioNum":"20","AccessModeNum":"30","SensorModeNum":"40","HybirdModeNum":"50","ChannelBusyLower10PctNum":"2","ChannelBusy10PctNum":"5","ChannelBusy20PctNum":"5","ChannelBusy30PctNum":"8","ChannelBusy40PctNum":"10","ChannelBusy50PctNum":"12","ChannelBusy60PctNum":"11","ChannelBusy70PctNum":"12","ChannelBusy80PctNum":"10","ChannelBusy90PctNum":"10","NoiseFloorLower105Num":"10","NoiseFloor100Num":"10","NoiseFloor95Num":"2","NoiseFloor90Num":"20","NoiseFloor85Num":"10","NoiseFloor80Num":"5","NoiseFloor75Num":"20","NoiseFloor70Num":"30","NoiseFloorUpper70Num":"10","Dot11InterfLower10PctNum":"10","Dot11Interf10PctNum":"10","Dot11Interf20PctNum":"10","Dot11Interf30PctNum":"20","Dot11Interf40PctNum":"10","Dot11Interf50PctNum":"20","Dot11Interf60PctNum":"10","Dot11Interf70PctNum":"10","Dot11Interf80PctNum":"20","Dot11Interf90PctNum":"20","NonDot11InterfLower10PctNum":"10","NonDot11Interf10PctNum":"10","NonDot11Interf20PctNum":"10","NonDot11Interf30PctNum":"10","NonDot11Interf40PctNum":"10","NonDot11Interf50PctNum":"10","NonDot11Interf60PctNum":"10","NonDot11Interf70PctNum":"10","NonDot11Interf80PctNum":"10","NonDot11Interf90PctNum":"10"};


    function getRcText(sRcId)
{
    return Utils.Base.getRcString("app_usage_rc", sRcId);
}

function Interval()
{
    if(g_oLineChart)
    {
        var sTime = new Date();
        sTime = sTime.toTimeString().split(" ")[0];
        g_oLineChart.addPoint([oAPData.NorthIfOutByte, oAPData.NorthIfInByte], sTime);
        if(g_oTimer)
        {
            clearTimeout(g_oTimer);
        }
        g_oTimer = setTimeout(Interval,600000);
    }
}

function drawChart(oData, aTimes)
{
    var aStream = getRcText("STREAM").split(",");
    var option = {
        width:"100%",
        height:200,
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#373737',
                  width: 1,
                  type: 'solid'
                }
            }
        },
        tooltip : {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#fff',
                  width: 0,
                  type: 'solid'
                }
            },
            formatter : function(aData){
                var aUp = aData[1];
                var aDown = aData[0];
                return  aUp[1] + "<br/>" + aUp[0] + " : " + Utils.Base.addComma(aUp[2]) + " Kbps<br/>" + aDown[0] + " : " +Utils.Base.addComma(aDown[2]) + " Kbps";
            }
        },
        legend: {
            orient: "horizontal",
            y: 0,
            x: "center",
            data: aStream
        },
        grid: {
            x: 60, y: 40,
            borderColor: '#FFF'
        },
        calculable: false,
        xAxis: [
            {
                // name: getRcText("UNIT_TIME"),
                type: 'category',
                boundaryGap: false,
                splitLine:true,
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#47495d', width: 2}
                },
                axisTick :{
                    show:false
                },
                data: aTimes
            }
        ],
        yAxis: [
            {
                // name: getRcText("UNIT_STREAM"),
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle:{color: '#47495d', width: 2} 
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#47495d', width: 2}
                }
            }
        ],
        series: [
            {
            	symbol: "none", 
            	type: 'line', 
            	smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: aStream[0],
                data: [0, 0, 0, 0, 0, 0, 0, oData.NorthIfOutByte]
            },
            {
            	symbol: "none", 
            	type: 'line', 
            	smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: aStream[1],
                data: [0, 0, 0, 0, 0, 0, 0, oData.NorthIfInByte]
            }
        ]

    };
    var oTheme = {
        color: ["rgba(0,150,214,0.5)","rgba(0,150,214,0.2)"],
        valueAxis:{
            splitLine:{lineStyle:{color:[ '#FFF']}},
            axisLabel:{textStyle: {color: [ '#abbbde']}}
        },
        categoryAxis:{
            splitLine:{lineStyle:{color:['#FFF']}}
        }
    };
    g_oLineChart = $("#usage").echart ("init", option,oTheme);
    Interval();
}

function initForm()
{
    $("#refresh_usage").on("click", initData);
}

function initData ()
{


       var aTimes = [];
        var nTime = new Date();
        nTime = nTime.getTime();
        for(var i=0;i<8;i++)
        {
            nTime -= 5000;
            var sTime = new Date(nTime);
            sTime = sTime.toTimeString().split(" ")[0];
            aTimes.push(sTime);            
        }
        aTimes.reverse();
        drawChart(oAPData,aTimes);


}

function _init ()
{
    initForm();
    initData();
}

function _resize (jParent)
{
    if(g_oResizeTimer)
    {
        clearTimeout(g_oResizeTimer);
    }
    g_oResizeTimer = setTimeout(function(){
        g_oLineChart && g_oLineChart.chart && g_oLineChart.resize();
    }, 200);
}

function _destroy ()
{
    g_oLineChart = null;
    clearTimeout(g_oTimer);
}
Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "resize": _resize,
    "widgets": ["Echart"],
    "utils": []
});
}) (jQuery);
