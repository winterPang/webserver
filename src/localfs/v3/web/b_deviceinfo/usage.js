(function ($)
{
var MODULE_NAME = "b_deviceinfo.usage";
var g_oLineChart;
var g_oResizeTimer;
var g_oTimer;
var g_sPort;

function getRcText(sRcId)
{
    return Utils.Base.getRcString("app_usage_rc", sRcId);
}

// function Interval()
// {
//     if(g_oLineChart)
//     {   
//         getUpLinkInterfaceData().done(function(data){

//         })
//         .fail();
//     }
    
// }
function timeStatus (time) {
    // body...
    if (time < 10)
    {
        return "0" + time;
    }
    return time;
}

function drawChart(oData)
{
    var aSpeedUp = [];
    var aSpeedDown = [];
    var aTimes = [];
    oData = oData.reverse();
    $.each(oData,function(i,oData){
        aSpeedUp.push(oData.speed_up);
        aSpeedDown.push(-oData.speed_down);
        var temp = new Date(oData.updateTime);
        aTimes.push(timeStatus(temp.getHours())+":"+timeStatus(temp.getMinutes())+":"+timeStatus(temp.getSeconds()));
    }); 
    var aStream = getRcText("STREAM").split(",");
    var option = {
        width:"100%",
        height:210,
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#80878C',
                  width: 2,
                  type: 'solid'
                }
            },
            formatter:function(y,x){
                var sTips = y[0][1];
                for(var i = 0; i < y.length; i++)
                {
                    sTips = sTips + "<br/>" + y[i][0] + ":" + Utils.Base.addComma(Math.abs(y[i][2]),"rate",1);
                }
                return sTips;
            }
        },
        legend: {
            orient: "horizontal",
            y: 0,
            x: "center",
            data: aStream
        },
        grid: {
            x: 65, y: 40,
            borderColor: '#FFF'
        },
        calculable: false,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                splitLine:true,
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 2}
                },
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C', width: 2}
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
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C', width: 2},
                    formatter:function(nNum){
                        return Utils.Base.addComma(Math.abs(nNum),'rate',1);
                    }
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 2}
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
                data: aSpeedUp
            },
            {
            	symbol: "none", 
            	type: 'line', 
            	smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: aStream[1],
                data: aSpeedDown
            }
        ]

    };
    var oTheme = {
        color: ["rgba(242,188,152,1)","rgba(120,206,192,0.6)"],
    };
    g_oLineChart = $("#usage").echart ("init", option,oTheme);
    // Interval();
}

function drawChartWan (aData) {
    var aSpeedUp = [];
    var aSpeedDown = [];
    var aSpeedUp2 = [];
    var aSpeedDown2 = [];
    var aTimes = [];
    var aServices = [];
    var aLegend = [];
    var aTooltip = [];
    var reg = /./;
    var reg2 = /G\d{1,2}/;
    var aStream = getRcText("STREAM").split(",");
    var aColor = ["rgba(120,206,195,1)","rgba(254,240,231,1)","rgba(144,129,148,1)","rgba(254,184,185,1)"];
    $.each(aData,function (i,oData) {
        var aUp = [];
        var aDown = [];
        aData[i] = aData[i].reverse();
        $.each(aData[i],function(j,oData){
            aUp.push(oData.speed_up);
            aDown.push(-oData.speed_down);
        });
        
        var aName = (aData[i][0].interfaceName).match(reg) + (aData[i][0].interfaceName).split('/').pop();
        var oUp = {
                symbol: "none", 
                type: 'line', 
                smooth: true,
                stack:'总量',
                itemStyle: {normal: {areaStyle: {type: 'default',color:aColor[i]}}},
                name: aName + '流量',
                data: aUp
            };
        var oDown = {
                symbol: "none", 
                type: 'line', 
                smooth: true,
                stack:'总量',
                itemStyle: {normal: {areaStyle: {type: 'default',color:aColor[i]}}},
                name: aName + '流量',
                data: aDown
            }; 
        aServices.push(oUp);
        aServices.push(oDown); 
        aLegend.push(aName + '流量');     
        aTooltip.push(aName + aStream[0]);
        aTooltip.push(aName + aStream[1]);
    });
    aTooltip = aTooltip.reverse();
    $.each(aData[0],function(i,oData){
        var temp = new Date(oData.updateTime);
        aTimes.push(timeStatus(temp.getHours())+":"+timeStatus(temp.getMinutes())+":"+timeStatus(temp.getSeconds()));
    });
    
    var option = {
        width:"100%",
        height:210,
        tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#80878C',
                  width: 2,
                  type: 'solid'
                }
            },
            formatter:function(y,x){
                var sTips = y[0][1];
                var temp = y[0][0].match(reg2)[0];
                for (var j = 0; j < aTooltip.length; j++) {
                    if(temp == aTooltip[j].match(reg2)[0])
                    {
                        break;
                    }
                } 
                for(var i = 0; i < y.length; i++)
                {
                    sTips = sTips + "<br/>" + aTooltip[j+i] + ":" + Utils.Base.addComma(Math.abs(y[i][2]),"rate",1);
                }
                return sTips;
            }
        },
        legend: {
            orient: "horizontal",
            y: 0,
            x: "center",
            data: aLegend
        },
        grid: {
            x: 60, y: 40,
            borderColor: '#FFF'
        },
        calculable: false,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                splitLine:true,
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 2}
                },
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C', width: 2}
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
                axisLabel: {
                    show: true,
                    textStyle:{color: '#80878C', width: 2},
                    formatter:function(nNum){
                        return Utils.Base.addComma(Math.abs(nNum),'rate',1);
                    }
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#80878C', width: 2}
                }
            }
        ],
        series: aServices,
    };
    var oTheme = {
        color: ["rgba(120,206,195,1)","rgba(254,240,231,1)","rgba(144,129,148,1)","rgba(254,184,185,1)"],
    };
    g_oLineChart = $("#usage").echart ("init", option,oTheme);
}

function configUpPort()
{
    function setUpLinkInterfaceSuc (data) {
        if('{"errcode":"illegal access"}' == data){
            console.log("没有权限")
        }
        else{
            if(data.errcode == '0') {
                $("#config").addClass("hide");
                $("#charts").removeClass("hide");
                $("#usage_block").addClass("hide");
                var aData = JSON.parse(data.histdataList[0]);
                drawChart(aData.dataList);
            }
            else{
                console.log("设置失败")
            };
        }
    }
    function setUpLinkInterfaceFial (data) {
        // body...
    }
    g_sPort = $("#ConfigUpport").val();
    if(!g_sPort)return;
    var setUpLinkInterfaceFlowOpt = {
        url: MyConfig.path +'/devmonitor/setUpLinkInterface',
        type: "GET",
        dataType: "json",
        data:{
                devSN:FrameInfo.ACSN,
                interfaceName:g_sPort
            },
        onSuccess:setUpLinkInterfaceSuc,
        onFailed:setUpLinkInterfaceFial
    };
    Utils.Request.sendRequest(setUpLinkInterfaceFlowOpt);  
}

function setConfigUpport () {
    function setUpLinkInterfaceSuc (data) {
       if('{"errcode":"illegal access"}' == data){
            console.log("没有权限")
        }
        else{
            if(data.errcode == '0') {
                var aData = JSON.parse(data.histdataList[0]);
                drawChart(aData.dataList);
            }
            else{
                console.log("设置失败")
            };
        }
    }
    function setUpLinkInterfaceFial (data) {
        // body...
    }
    $("#usage_block").toggle();
    g_sPort = $("#SetfigUpport").val();
    if(!g_sPort)return;
    var setUpLinkInterfaceFlowOpt = {
        url: MyConfig.path +'/devmonitor/setUpLinkInterface',
        type: "GET",
        dataType: "json",
        data:{
                devSN:FrameInfo.ACSN,
                interfaceName:g_sPort
            },
        onSuccess:setUpLinkInterfaceSuc,
        onFailed:setUpLinkInterfaceFial
    };
    Utils.Request.sendRequest(setUpLinkInterfaceFlowOpt);
}
function initForm()
{
    $("#refresh_usage").on("click", initData);
    $("#filter_usage").on("click", function(){
        $("#usage_block").toggle();
    });
    $("#SetfigUpport").on("change",setConfigUpport);
    $("#submit").on("click", configUpPort);/*确认按钮*/
}

function initData ()
{
    var data = {"InterfaceList":[{"interfaceName":"GigabitEthernet1/0/1","interfaceType":3},{"interfaceName":"GigabitEthernet1/0/2","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/3","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/4","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/5","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/6","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/7","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/8","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/9","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/10","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/11","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/12","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/13","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/14","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/15","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/16","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/17","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/18","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/19","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/20","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/21","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/22","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/23","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/24","interfaceType":2},{"interfaceName":"Ten-GigabitEthernet1/0/25","interfaceType":2},{"interfaceName":"Ten-GigabitEthernet1/0/26","interfaceType":2},{"interfaceName":"Ten-GigabitEthernet1/0/27","interfaceType":2},{"interfaceName":"Ten-GigabitEthernet1/0/28","interfaceType":2}]};
    for(var i = 0; i < data.InterfaceList.length; i++)
    {
        if(data.InterfaceList[i].interfaceType == 1)
        {
            data2 = {};
            var aData=[];
            for (var i = 0; i < data2.histdataList.length; i++)
            {
                var temp = JSON.parse(data2.histdataList[i]);
                aData[i] = temp.dataList;
            }
            $("#config").addClass("hide");
            $("#charts").removeClass("hide");
            $("#filter_usage").addClass("hide");
            $("#usage_block").addClass("hide");
            drawChartWan(aData);
            return;
        }
    }
    for(var i = 0; i < data.InterfaceList.length; i++)
    {
        if(data.InterfaceList[i].interfaceType == 3)
        {
            data2 = {"histdataList":["{\"interfaceName\":\"GigabitEthernet1/0/1\",\"dataList\":[{\"_id\":\"573a82815a35950100b71972\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T02:31:29.461Z\",\"__v\":0},{\"_id\":\"573a7dd15a35950100b716c8\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T02:11:29.375Z\",\"__v\":0},{\"_id\":\"573a79215a35950100b71423\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T01:51:29.383Z\",\"__v\":0},{\"_id\":\"573a74715a35950100b7117e\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T01:31:29.277Z\",\"__v\":0},{\"_id\":\"573a6fc15a35950100b70eff\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T01:11:29.268Z\",\"__v\":0},{\"_id\":\"573a6b115a35950100b70c64\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T00:51:29.164Z\",\"__v\":0},{\"_id\":\"573a66615a35950100b709bf\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T00:31:29.116Z\",\"__v\":0},{\"_id\":\"573a61b15a35950100b7071a\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T00:11:29.101Z\",\"__v\":0},{\"_id\":\"573a5d015a35950100b70475\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-16T23:51:29.152Z\",\"__v\":0},{\"_id\":\"573a58505a35950100b701d0\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-16T23:31:28.895Z\",\"__v\":0}]}"]};
            var aData = JSON.parse(data2.histdataList[0]);
            $("#config").addClass("hide");
            $("#charts").removeClass("hide");
            $("#usage_block").addClass("hide");
            drawChart(aData.dataList);
            var aIntList = [];
            $.each(data.InterfaceList,function(i,o){
                aIntList.push(o.interfaceName);
            });
            $("#SetfigUpport").singleSelect("InitData",aIntList);
            return;
        }
    }
    var aIntList = [];
    $.each(data.InterfaceList,function(i,o){
        aIntList.push(o.interfaceName);
    });
    $("#ConfigUpport").singleSelect("InitData",aIntList);
    $("#SetfigUpport").singleSelect("InitData",aIntList);
    //ajax
    //function getAllInterfacesSuc (data) {
    //    data = {"InterfaceList":[{"interfaceName":"GigabitEthernet1/0/1","interfaceType":3},{"interfaceName":"GigabitEthernet1/0/2","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/3","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/4","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/5","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/6","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/7","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/8","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/9","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/10","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/11","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/12","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/13","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/14","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/15","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/16","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/17","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/18","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/19","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/20","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/21","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/22","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/23","interfaceType":2},{"interfaceName":"GigabitEthernet1/0/24","interfaceType":2},{"interfaceName":"Ten-GigabitEthernet1/0/25","interfaceType":2},{"interfaceName":"Ten-GigabitEthernet1/0/26","interfaceType":2},{"interfaceName":"Ten-GigabitEthernet1/0/27","interfaceType":2},{"interfaceName":"Ten-GigabitEthernet1/0/28","interfaceType":2}]};
    //    function getWanInterfaceSuc (data2) {
    //        var aData=[];
    //        for (var i = 0; i < data2.histdataList.length; i++)
    //        {
    //            var temp = JSON.parse(data2.histdataList[i]);
    //            aData[i] = temp.dataList;
    //        }
    //        $("#config").addClass("hide");
    //        $("#charts").removeClass("hide");
    //        $("#filter_usage").addClass("hide");
    //        $("#usage_block").addClass("hide");
    //        drawChartWan(aData);
    //    }
    //    function getWanInterfaceFail (data2) {
    //        // body...
    //    }
    //    function getUpLinkInterfaceSuc (data2) {
    //        data2 = {"histdataList":["{\"interfaceName\":\"GigabitEthernet1/0/1\",\"dataList\":[{\"_id\":\"573a82815a35950100b71972\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T02:31:29.461Z\",\"__v\":0},{\"_id\":\"573a7dd15a35950100b716c8\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T02:11:29.375Z\",\"__v\":0},{\"_id\":\"573a79215a35950100b71423\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T01:51:29.383Z\",\"__v\":0},{\"_id\":\"573a74715a35950100b7117e\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T01:31:29.277Z\",\"__v\":0},{\"_id\":\"573a6fc15a35950100b70eff\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T01:11:29.268Z\",\"__v\":0},{\"_id\":\"573a6b115a35950100b70c64\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T00:51:29.164Z\",\"__v\":0},{\"_id\":\"573a66615a35950100b709bf\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T00:31:29.116Z\",\"__v\":0},{\"_id\":\"573a61b15a35950100b7071a\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-17T00:11:29.101Z\",\"__v\":0},{\"_id\":\"573a5d015a35950100b70475\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-16T23:51:29.152Z\",\"__v\":0},{\"_id\":\"573a58505a35950100b701d0\",\"speed_up\":0,\"speed_down\":0,\"downflow\":20922,\"upflow\":852,\"status\":1,\"describe\":\"GigabitEthernet1/0/1 Interface\",\"interfaceName\":\"GigabitEthernet1/0/1\",\"devSN\":\"210235A1JT1785638361\",\"updateTime\":\"2016-05-16T23:31:28.895Z\",\"__v\":0}]}"]};
    //        var aData = JSON.parse(data2.histdataList[0]);
    //        $("#config").addClass("hide");
    //        $("#charts").removeClass("hide");
    //        $("#usage_block").addClass("hide");
    //        drawChart(aData.dataList);
    //        var aIntList = [];
    //        $.each(data.InterfaceList,function(i,o){
    //            aIntList.push(o.interfaceName);
    //        });
    //        $("#SetfigUpport").singleSelect("InitData",aIntList);
    //    }
    //    function getUpLinkInterfaceFail (data) {
    //        // body...
    //
    //    }
    //
    //    for(var i = 0; i < data.InterfaceList.length; i++)
    //    {
    //        if(data.InterfaceList[i].interfaceType == 1)
    //        {
    //            var wanInterfaceFlowOpt = {
    //                url:  MyConfig.path +"/devmonitor/getUpLinkInterfaceData",
    //                type: "GET",
    //                dataType:"json",
    //                data:{
    //                    devSN:FrameInfo.ACSN,
    //                    interfaceType:1
    //                },
    //                onSuccess:getWanInterfaceSuc,
    //                onFailed:getWanInterfaceFail
    //            };
    //            Utils.Request.sendRequest(wanInterfaceFlowOpt);
    //            return;
    //        }
    //    }
    //    for(var i = 0; i < data.InterfaceList.length; i++)
    //    {
    //        if(data.InterfaceList[i].interfaceType == 3)
    //        {
    //            var UpLinkInterfaceFlowOpt = {
    //                url:  MyConfig.path +"/devmonitor/getUpLinkInterfaceData",
    //                type: "GET",
    //                dataType:"json",
    //                data:{
    //                    devSN:FrameInfo.ACSN,
    //                    interfaceType:2
    //                },
    //                onSuccess:getUpLinkInterfaceSuc,
    //                onFailed:getUpLinkInterfaceFail
    //            };
    //            Utils.Request.sendRequest(UpLinkInterfaceFlowOpt);
    //            return;
    //        }
    //    }
    //    var aIntList = [];
    //    $.each(data.InterfaceList,function(i,o){
    //        aIntList.push(o.interfaceName);
    //    });
    //    $("#ConfigUpport").singleSelect("InitData",aIntList);
    //    $("#SetfigUpport").singleSelect("InitData",aIntList);
    //}
    //function getAllInterfacesFail (data) {
    //    // body...
    //
    //}
    //var allInterfaceFlowOpt = {
    //     url:  MyConfig.path +"/devmonitor/getAllInterfaces",
    //    type: "GET",
    //    dataType:"json",
    //    data:{
    //        devSN:FrameInfo.ACSN
    //    },
    //    onSuccess:getAllInterfacesSuc,
    //    onFailed:getAllInterfacesFail
    //};
    //Utils.Request.sendRequest(allInterfaceFlowOpt);
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
    Utils.Request.clearMoudleAjax(MODULE_NAME);
}

function _destroy ()
{
    g_oLineChart = null;
    g_sPort = null;
    clearTimeout(g_oTimer);
    Utils.Request.clearMoudleAjax(MODULE_NAME);
}
Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "resize": _resize,
    "widgets": ["Echart","SingleSelect"],
    "utils": [],
    "subModules": []
});
}) (jQuery);
