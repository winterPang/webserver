(function ($)
{
var MODULE_NAME = "wdashboard.aps";
//var NC, MODULE_NC = "WDashboard.NC";

var g_hPie, g_hLine;
var g_oTimer = false;
var g_oResizeTimer;
    var oAPData =  {
        "ManualApNum":"153",
        "RunApNum":"256",
        "OfflineApNum":"123",
        "UnhealthyApNum":"12",
        "UnAuthApNum":"75",
        "ApGroupNum":"32",
        "LocationNum":"15","NorthIfOutPkt":"18964","NorthIfOutByte":"164685","NorthIfInPkt":"156489","NorthIfInByte":"251566","Is5gRadioNum":"10","Is2gRadioNum":"20","AccessModeNum":"30","SensorModeNum":"40","HybirdModeNum":"50","ChannelBusyLower10PctNum":"2","ChannelBusy10PctNum":"5","ChannelBusy20PctNum":"5","ChannelBusy30PctNum":"8","ChannelBusy40PctNum":"10","ChannelBusy50PctNum":"12","ChannelBusy60PctNum":"11","ChannelBusy70PctNum":"12","ChannelBusy80PctNum":"10","ChannelBusy90PctNum":"10","NoiseFloorLower105Num":"10","NoiseFloor100Num":"10","NoiseFloor95Num":"2","NoiseFloor90Num":"20","NoiseFloor85Num":"10","NoiseFloor80Num":"5","NoiseFloor75Num":"20","NoiseFloor70Num":"30","NoiseFloorUpper70Num":"10","Dot11InterfLower10PctNum":"10","Dot11Interf10PctNum":"10","Dot11Interf20PctNum":"10","Dot11Interf30PctNum":"20","Dot11Interf40PctNum":"10","Dot11Interf50PctNum":"20","Dot11Interf60PctNum":"10","Dot11Interf70PctNum":"10","Dot11Interf80PctNum":"20","Dot11Interf90PctNum":"20","NonDot11InterfLower10PctNum":"10","NonDot11Interf10PctNum":"10","NonDot11Interf20PctNum":"10","NonDot11Interf30PctNum":"10","NonDot11Interf40PctNum":"10","NonDot11Interf50PctNum":"10","NonDot11Interf60PctNum":"10","NonDot11Interf70PctNum":"10","NonDot11Interf80PctNum":"10","NonDot11Interf90PctNum":"10"}

function getRcText (sRcId)
{
    return Utils.Base.getRcString ("summary_ap_rc", sRcId).split(",");
}

function Interval()
{
   /* function doDraw(oInfo)
    {
        var oAPData = Utils.Request.getTableRows (NC.APSummary, oInfo)[0] || {};
        var sTime = new Date();
        sTime = sTime.toTimeString().split(" ")[0];
        g_hLine.addPoint([oAPData.RunApNum, oAPData.OfflineApNum, oAPData.UnhealthyApNum], sTime);
        if(g_oTimer)
        {
            clearTimeout(g_oTimer);
        }
        g_oTimer = setTimeout(Interval,900000);
    }
*/
    if(g_hLine)
    {   
        /*var oAPSummary = Utils.Request.getTableInstance (NC.APSummary);
        Utils.Request.getAll ([oAPSummary], doDraw);*/
        var sTime = new Date();
        sTime = sTime.toTimeString().split(" ")[0];
        g_hLine.addPoint([oAPData.RunApNum, oAPData.OfflineApNum, oAPData.UnhealthyApNum], sTime);
        if(g_oTimer)
        {
            clearTimeout(g_oTimer);
        }
        g_oTimer = setTimeout(Interval,900000);
    }
}

function drawLine(oData,aTimes)
{
    var aSatus = getRcText("STATUS");
    var option = {
        height:180,
        calculable: false,
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
        legend: {
            orient: "horizontal",
            y: 'top',
            x: "right",
            data: aSatus
        },
        grid: {
            x: 40, 
            y: 30,
            x2:30,
            borderColor: '#FFF'
        },
        xAxis: [
            {
                // name: getRcText("AP_TIME"),
                type: 'category',
                boundaryGap: false,
                splitLine:true,
                axisLabel: {
                    interval:0
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#373737', width: 1}
                },
                axisTick :{
                    show:false
                },
                data: aTimes
            }
        ],
        yAxis: [
            {
                // name: getRcText("AP_NUMBER"),
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle:{color: '#373737'} 
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#373737', width: 1}
                }
            }
        ],
        series: [
            {
                symbol: "none", 
                type: 'line', 
                smooth: true,
                name:aSatus[0],
                //todo
                data: [0,0,0,0,oData.RunApNum]
            },
            {
                symbol: "none", 
                type: 'line', 
                smooth: true,
                name:aSatus[1],
                data: [0,0,0,0,oData.OfflineApNum]
            },
            {
                symbol: "none", 
                type: 'line', 
                smooth: true,
                name:aSatus[2],
                data: [0,0,0,0,oData.UnhealthyApNum]
            }
        ]

    };
    var oTheme = {
        color: ["#7FCAEA","#BECACF","#F8A4AE"],
        valueAxis:{
            splitLine:{lineStyle:{color:[ '#FFF']}},
            axisLabel:{textStyle: {color: [ '#abbbde']}}
        },
        categoryAxis:{
            splitLine:{lineStyle:{color:['#FFF']}}
        }
    };
    g_hLine = $("#aps").echart("init", option, oTheme);
    Interval();
}
function drawPie(oData)
{   
    function onClickPie(oPiece)
    {
        Utils.Base.redirect({
            np:"apmgr.allaps",
            nIndex:oPiece.dataIndex + 1,
            openMethod:"monitor"
        });
    }
    var aSatus = getRcText("STATUS");
    var option = {
        animation: false,
        calculable : false,
        height:160,
        tooltip : {
            show:true,
            formatter: function(aData){
                var sLable = aData[1] + ":<br/> " + aData[2] + " (" + Math.round(aData[3])+"%)";
                return sLable;
            }
        },
        series : [
            {
                name:'APs',
                type: 'pie',
                radius : '80%',
                selectedMode: "single",
                selectedOffset: 10,
                center: ['55%', '50%'],
                itemStyle: {
                    normal: {
                        label: {
                            position: 'inner',
                            formatter: function(a,b,c,d){
                                return Math.round(d)+"%";
                            }
                        },
                        labelLine: false
                    },
                    emphasis: {
                        label: {
                            show: true,
                            textStyle: {
                                color:"#000"
                            }
                        },
                        labelLine: false
                    }
                },
                data: [
                    {name:aSatus[0], value:oData.RunApNum},
                    {name:aSatus[1], value:oData.OfflineApNum},
                    {name:aSatus[2], value:oData.UnhealthyApNum}
                ],
            }
        ]
       // ,click: onClickPie
    };
    var oTheme = {
        color: ["#7FCAEA","#BEC7D0","#F7A4AE"]
    };
    g_hPie = $("#pie_aps").echart("init", option,oTheme);
}

function initForm()
{
    var jForm = $("#aps_page");
    $(".link-detail", jForm).on("click",function()
    {
        var sId = $(this).attr("id");
        var sUrl = "WDashboard.index";
        var oUrlPara = {
            np:sUrl,
            ID:sId
        };
        Utils.Base.redirect (oUrlPara);
        return false;
    });
    $("#refresh_AP").on("click", initData);
}

function initData ()
{
  //  function myCallback (oInfo)
  //  {
     //   var oAPData = Utils.Request.getTableRows (NC.APSummary, oInfo)[0] || {};
        var aTimes = [];
        var nTime = new Date();
        nTime = nTime.getTime();
        for(var i=0;i<5;i++)
        {
            nTime -= 5000;
            var sTime = new Date(nTime);
            sTime = sTime.toTimeString().split(" ")[0];
            aTimes.push(sTime);
        }
        aTimes.reverse();
        drawPie(oAPData);
        drawLine(oAPData,aTimes);
   // }

    /*var oAPSummary = Utils.Request.getTableInstance (NC.APSummary);
    Utils.Request.getAll ([oAPSummary], myCallback);*/
}

function _init ()
{
   // NC = Utils.Pages[MODULE_NC].NC;
    initForm();
    initData();
}

function _resize(jParent)
{
}

function _destroy()
{
    if(g_oTimer)
    {  
        clearTimeout(g_oTimer);
        g_oTimer = false;
    }
    g_hLine = null;
    g_hPie = null;
}
Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "resize": _resize,
    "widgets": ["Echart"],
    "utils": []
});

}) (jQuery);
