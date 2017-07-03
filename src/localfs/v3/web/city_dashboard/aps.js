(function ($)
{
var MODULE_NAME = "city_dashboard.aps";

var g_hPie, g_hLine;
var g_oTimer = false;
var g_oResizeTimer;

function getRcText (sRcId)
{
    return Utils.Base.getRcString ("summary_ap_rc", sRcId).split(",");
}

function Interval()
{   
    function getApsFlowSuc (data) {
        var sTime = new Date();
        sTime = sTime.toTimeString().split(" ")[0];
        sTime = sTime.split(":")[0]+":"+sTime.split(":")[1];
        g_hLine.addPoint([data.ap_statistic.online, data.ap_statistic.offline, data.ap_statistic.other], sTime);
        if(g_oTimer)
        {
            clearTimeout(g_oTimer);
        }
        g_oTimer = setTimeout(Interval,900000); 
    }
    function getApsFlowFail (data) {
        // body...
    }
    if(g_hLine)
    {  
        var apsFlowOpt = {
            url: MyConfig.path+"/apmonitor/getApCountByStatus",
            type: "GET",
            dataType:"json",
            data:{
                devSN:FrameInfo.ACSN
            },
            onSuccess:getApsFlowSuc,
            onFailed:getApsFlowFail
        } 
        Utils.Request.sendRequest(apsFlowOpt); 
    }
}

function drawLine(oData,aTimes)
{
    var aSatus = getRcText("STATUS");
    var option = {
        height:200,
        calculable: false,
        tooltip: {
            show: true,
            trigger: 'axis',
            backgroundColor: 'rgba(52,62,78,0.9)',
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
            textStyle:{color: '#80878C'},
            data: aSatus
        },
        grid: {
            x: 40, 
            y: 30,
            x2:15,
            borderColor: '#FFF'
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                splitLine:false,
                axisLabel: {
                    interval:0,
                    textStyle:{color: '#80878C'}
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 1}
                },
                axisTick :{
                    show:false
                },
                data: aTimes
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitLine:false,
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C'} 
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 1}
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
                data: [,,oData.online,oData.online],
                itemStyle: {normal: {lineStyle:{width:2}}}
            },
            {
                symbol: "none", 
                type: 'line', 
                smooth: true,
                name:aSatus[1],
                data: [,,oData.offline,oData.offline],
                itemStyle: {normal: {lineStyle:{width:2}}}
            },
            // {
            //     symbol: "none", 
            //     type: 'line', 
            //     smooth: true,
            //     name:aSatus[2],
            //     data: [0,0,0,oData.other],
            //     itemStyle: {normal: {lineStyle:{width:2}}}
            // }
        ]

    };
    var oTheme = {
        color: ["#78CEC3","#FF9C9E","#E7E7E9"],
        valueAxis:{
            splitLine:{lineStyle:{color:[ '#FFF']}},
            axisLabel:{textStyle: {color: [ '#abbbde']}}
        },
        categoryAxis:{
            splitLine:{lineStyle:{color:['#FFF']}}
        }
    };
    g_hLine = $("#aps").echart("init", option, oTheme);
    if(g_oTimer)
    {
        clearTimeout(g_oTimer);
    }
    g_oTimer = setTimeout(Interval,900000);
}

function drawEmptyPie () 
{
    var option = {
        height:160,
        calculable : false,
        series : [
            {
                type:'pie',
                minAngle: '3',
                radius : '80%',
                center: ['55%', '50%'],
                itemStyle: {
                    normal: {
                        labelLine:{
                            show:false
                        },
                        label:
                        {
                            position:"inner"
                        }
                    }
                },
                data: [{name:'N/A',value:1}]
            }
        ]
    };
    var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
    g_hPie = $("#pie_aps").echart("init", option,oTheme);
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
    if (oData.online == 0 && oData.offline == 0)
    {
        drawEmptyPie();
        return;
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
                minAngle: '3',
                radius : '80%',
                // selectedMode: "single",
                // selectedOffset: 10,
                center: ['55%', '50%'],
                itemStyle: {
                    normal: {
                        borderColor:"#FFF",
                        borderWidth:1,
                        label: {
                            position: 'inner',
                            formatter: function(a,b,c,d){
                                return Math.round(a.percent)+"%";
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
                    {name:aSatus[0], value:oData.online  || undefined},
                    {name:aSatus[1], value:oData.offline || undefined},
                    // {name:aSatus[2], value:oData.other || undefined}
                ],
            }
        ]
        // ,click: onClickPie
    };
    var oTheme = {
        color: ["#78CEC3","#FF9C9E","#E7E7E9"]
    };
    g_hPie = $("#pie_aps").echart("init", option,oTheme);
}

function initForm()
{
    var jForm = $("#aps_page");
    $(".link-detail", jForm).on("click",function()
    {
        var sId = $(this).attr("tab");
        var sUrl = "city_dashboard.aps_detail";
        var oUrlPara = {
            np:sUrl,
            tab:sId
        };
        Utils.Base.redirect (oUrlPara);
    });
    $("#refresh_AP").on("click", initData);
}

// function getApCountByStatus () {
//     return $.ajax({
//             url: MyConfig.path+"/apmonitor/getApCountByStatus",
//             type: "GET",
//             dataType:"json",
//             data:{
//                 devSN:FrameInfo.ACSN
//             }
//         });
// }
function getApsFlowSuc (data) {
    var aTimes = [];
        var nTime = new Date();
        nTime = nTime.getTime();
        for(var i=0;i<2;i++)
        {
            nTime -= 5000;
            var sTime = new Date(nTime);
            sTime = sTime.toTimeString().split(" ")[0];
            sTime = sTime.split(":")[0]+":"+sTime.split(":")[1];
            aTimes.push(sTime);
        }
        aTimes[2] = "";
        aTimes[3] = "";
        aTimes.reverse();
        drawPie(data.ap_statistic);
        drawLine(data.ap_statistic,aTimes);
}
function getApsFlowFail (data) {
    // body...
}
function initData ()
{ 
    var apsFlowOpt = {
        url: MyConfig.path+"/apmonitor/getApCountByStatus",
        type: "GET",
        dataType:"json",
        data:{
            devSN:FrameInfo.ACSN
        },
        onSuccess:getApsFlowSuc,
        onFailed:getApsFlowFail
    } 
    Utils.Request.sendRequest(apsFlowOpt);
}

function _init ()
{
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
    Utils.Request.clearMoudleAjax(MODULE_NAME);
}
Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "resize": _resize,
    "widgets": ["Echart"],
    "utils": [],
    "subModules": []
});

}) (jQuery);
