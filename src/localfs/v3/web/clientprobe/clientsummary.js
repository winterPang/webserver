/**
 * Created by KF5783 on 2016/3/23.
 */
;(function ($) {
    var MODULE_BASE = "clientprobe"
    var MODULE_NAME = MODULE_BASE+".clientsummary";
    var LIST_NAME   = "#probe_list .simple-list";
    var ECHART_NAME = "#probe_map .myEchart";
    var nowTime     = new Date();
    var StartTime   = new Date(nowTime.toDateString()) - 0;
    var EndTime     = nowTime.getTime();
    var g_choice    = 1;
    var g_mac       = 0;
    var g_condition = {ACSN:FrameInfo.ACSN, StartTime:StartTime, EndTime:EndTime,Count:0};
    var g_timelinedata  = [];

    function CheckMac(value)
    {
//mac地址正则表达式
        var reg_name=/[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}/;
        if(!reg_name.test(value)){
            return false;
        }
        return true;
    }


    var listInfo    = {
        listScope   :"#probe_list .simple-list",
        headOpt     :{
            colNames    : Utils.Base.getRcString("probe_rc","LIST_HEADER"),
            showHeader  : true,
            search      :true,
            pageSize    :13,
            colModel    : [
                {name: "MacAddress", datatype:"String"},
                {name: "FirstTime", datatype:"String"},
                {name: "LastTime", datatype:"String"},
                {name: "Ssid",width:200, datatype:"String"},
            ]
        },
        clientOpt   :{
            colNames    : Utils.Base.getRcString("probe_rc","CLIENT_HEADER"),
            showHeader  : true,
            search      :true,
            pageSize    :13,
            colModel    : [
                {name: "MacAddress", datatype:"String"},
                {name: "ReportTime", datatype:"String"},
                {name: "Channel", datatype:"String"},
                //{name: "Bssid", datatype:"String"},
                {name: "Rssi", datatype:"String"},
                {name: "Status",  datatype:"Order",data:getRcText("PROBE_STATUS")},
                {name: "SensorName", datatype:"String"},
            ]
        }
    };

    var dealEvent   = {
        nowState : {},
        nowRadio : 0,
        scope    : "",
        currentid:"",
        init: function(){
            var jscope = $(".probe-choice");
            for(var i = 0; i < jscope.length; i++)
            {
                dealEvent.nowState[jscope[i].getAttribute("id")] = 1;
            }
        },
        liOnClick: function(e){
            var scope = $(this);
            if(scope.val() == dealEvent.nowState[dealEvent.currentid])
            {
                $(".choice-show", dealEvent.scope).removeClass("height-change");
                return false;
            }
            else
            {
                dealEvent.nowState[dealEvent.currentid] = scope.val();
                $(".current-state", dealEvent.scope).text(scope.text());
                $(".choice-show", dealEvent.scope).removeClass("height-change");
            }
            $("#body_over").addClass("hide");

            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});
        },
        inputClick:function(e){
            dealEvent.nowState[dealEvent.currentid] = 0;
            dealEvent.currentid = $(this).closest(".probe-choice").attr("id");
            dealEvent.scope = "#" + dealEvent.currentid;
            $("#body_over").removeClass("hide");
            $(".choice-show", dealEvent.scope).addClass("height-change");

            return false;
        },
        blackClick:function(e){
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).hasClass("height-change") && $(".choice-show", dealEvent.scope).removeClass("height-change");
        },
        searchClick:function(e){
            if(!CheckMac($(".choice-show input", dealEvent.scope).val()))
            {
                $(".choice-show input", dealEvent.scope).addClass("wrong-mac");
                return;
            }
            $(".choice-show input", dealEvent.scope).removeClass("wrong-mac");

            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text($(".probe-input").val());

            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid],parm:$(".probe-input").val()});

        },
        timeClick: function (e) {
            $("#probe_timechoice").addClass("hide");
            //
            //$(dealEvent.scope).trigger({type:"probechange.probe", data:dealEvent.nowState});
            //
        },
        dateChange: function (e) {
            dealEvent.nowState[dealEvent.currentid] = 0;
            var orange = $(this,dealEvent.scope).daterange("getRangeData");
            $(".current-state", dealEvent.scope).text(orange.startData + '-' +orange.endData);
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            StartTime = new Date(orange.startData)-0;
            EndTime = new Date(orange.endData)-0;
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid],startTime:StartTime,endTime:EndTime});
        }
    };

    var ajaxInfo    = {
        url         :MyConfig.path + '/ant' + "/read_probeclient",
        dataType    :"json",
        type        :"post",
        ACSN        :FrameInfo.ACSN,
        data        : {},
    };

    var drawMsg     ={
        judgeData:function(aMessage){
            var xData = [];
            var y1Data = [],y2Data = [],y3Data = [];
            aMessage.sort(function(a, b){
                return Number(a.Date) - Number(b.Date);
            });

            for(var i = 0; i < aMessage.length; i++){
                var temp = new Date(aMessage[i].Date);
                xData.push(temp.toLocaleDateString().slice(5));
                y3Data.push(aMessage[i].Count);
                y1Data.push(aMessage[i].NewClient);
                y2Data.push(aMessage[i].Count - aMessage[i].NewClient);
            }

            return [xData, y1Data, y2Data, y3Data];
        },
        drawTimeLine : function(aData, dateState)
        {
            var timeNow = new Date();
            var xData = [];
            var y1Data = [],y2Data = [],y3Data = [];

            if(aData)
            {
                var aMessage = aData;
                if(!dateState)
                {
                    aMessage.newClient.sort(function(a, b){
                        return Number(a.name) - Number(b.name);
                    });
                    aMessage.oldClient.sort(function(a, b){
                        return Number(a.name) - Number(b.name);
                    });
                    for(var i = (aMessage.oldClient.length < aMessage.newClient.length?aMessage.oldClient.length:aMessage.newClient.length); i--;){
                        var temp = new Date(aMessage.newClient[i].name);
                        xData.unshift(temp.toTimeString().slice(0,5));
                        y1Data.unshift(aMessage.newClient[i].value);
                        y2Data.unshift(aMessage.oldClient[i].value);
                        y3Data.unshift(aMessage.newClient[i].value + aMessage.oldClient[i].value);
                    }
                }
                else
                {
                    var a  = drawMsg.judgeData(aMessage);
                    xData  = a[0];
                    y1Data = a[1];
                    y2Data = a[2];
                    y3Data = a[3];
                }
                g_timelinedata = [xData, y1Data, y2Data, y3Data];
            }
            else{
                xData  = g_timelinedata[0];
                y1Data = g_timelinedata[1];
                y2Data = g_timelinedata[2];
                y3Data = g_timelinedata[3];
            }

            var option = {
                height:350,
                tooltip : {
                    trigger: 'item'
                },
                grid:{
                    x:50,
                    y:80,
                    x2:30,
                    borderWidth:0
                },
                calculable : false,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : xData,
                        splitLine:{
                            show:false,
                        },
                        axisLabel: {
                            rotate:0,
                            textStyle:{color: '#ffffff'}

                        },
                        axisLine  : {
                            show:false,
                            lineStyle :{color: '#F6F7F8', width: 1}
                        }

                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitNumber:4,
                        splitLine:{
                            show:true,
                            lineStyle :{color: '#475C81', width: 1}
                        },
                        axisLabel: {
                            formatter: '{value}',
                            show: true,
                            textStyle:{color: '#ffffff'}
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#475C81', width: 1}
                        }

                    }
                ],
                legend: {
                    data:['全部客户','新客户','老客户'],
                    x:"right",
                    y:"top",
                    textStyle:{"color":"#fff"},
                    padding:[30,20]

                },
                series : [
                    {
                        name:"全部客户",
                        type:'line',
                        smooth:true,
                        symbol:'circle',
                        symbolSize:0,
                        data:y3Data,
                        itemStyle: {
                            normal: {
                                lineStyle:{
                                    width:1,
                                    color:"#FF9D9E"
                                }
                            },
                            emphasis: {
                                lineStyle:{
                                    width:1,
                                    color:"#FF9D9E"
                                }
                            }
                        }
                    },
                    {
                        name:"新客户",
                        type:'line',
                        smooth:true,
                        symbol:'circle',
                        symbolSize:0,
                        data:y1Data,
                        itemStyle: {
                            normal: {
                                lineStyle:{
                                    width:1,
                                    color:"#4EC1B2"
                                }
                            },
                            emphasis: {
                                lineStyle:{
                                    width:1,
                                    color:"#4EC1B2"
                                }
                            }
                        }
                    },
                    {
                        name:"老客户",
                        type:'line',
                        smooth:true,
                        symbol:'circle',
                        symbolSize:0,
                        data:y2Data,
                        itemStyle: {
                            normal: {
                                lineStyle:{
                                    width:1,
                                    color:"#FBCEB1"

                                }
                            },
                            emphasis: {
                                lineStyle:{
                                    width:1,
                                    color:"#FBCEB1"

                                }
                            }
                        }


                    },
                ]
            };
            option.series[g_choice-1].itemStyle.normal.lineStyle.width = 3;
            option.series[g_choice-1].itemStyle.emphasis.lineStyle.width = 3;
            option.series[g_choice-1].itemStyle.normal.lineStyle.color = "#9DE274";
            option.series[g_choice-1].itemStyle.emphasis.lineStyle.color = "#9DE274";
            ////delete(option.series[g_choice-1].itemStyle );
            var oTheme = {
                color: ["#FF9D9E","#4EC1B2","#FBCEB1"]
            };
            oTheme.color[g_choice-1] =  "#9DE274";
            $("#probe_line").echart("init", option, oTheme);

        },
        drawSlist: function (aData) {
            var aMessage = aData;
            for(var i = 0; i < aMessage.length; i++){
                aMessage[i].FirstTime           = (new Date(aMessage[i].FirstTime)).toLocaleString();
                aMessage[i].LastTime            = (new Date(aMessage[i].LastTime)).toLocaleString();
                aMessage[i].DissociativeStatus  = getRcText("LIST_YES_NO").split(",")[aMessage[i].DissociativeStatus];
            }

            $("#probe_slist").SList("refresh", aMessage);
        }
    };

    function loadingFunc(scope){
        $(scope).echart("init", {height:0}, []);
    }

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("probe_rc", sRcName);
    }

    function send2server(oParam, successFunc, errorFunc){
        var ajaxMsg = {
            url         :ajaxInfo.url,
            dataType    :ajaxInfo.dataType,
            type        :ajaxInfo.type,
            data        :oParam,
            onSuccess     :successFunc,
            onFailed       :errorFunc
        };

        Utils.Request.sendRequest(ajaxMsg);
    }


    function initData(e)
    {
        if(g_choice != 0)
        {
            initTimeClient();
            initSimpleSlist();
        }
        else
        {
            initClientSlist(e);
        }
    }
    function initClientSlist(strMac)
    {
        function callback(adoc)
        {
            var aMessage = adoc.Message || [];
            for(var i = 0; i < aMessage.length; i++){
                aMessage[i].ReportTime  = (new Date(aMessage[i].ReportTime)).toLocaleString();
                aMessage[i].Rssi        = aMessage[i].Rssi + '';
            }


            $("#probe_slist").SList("refresh", aMessage);
        }
        var data = {};
        data.Param = g_condition;
        data.Method = "GetClientInfo";
        data.Param.MacAddress = strMac;

        data.Return = [];
        $(listInfo.listScope).children().remove();
        $(listInfo.listScope).SList("head", listInfo.clientOpt);
        send2server(data,callback,errorFunc)
    }


    function initTimeClient()
    {
        function callback(adoc){
            drawMsg.drawTimeLine(adoc.Message, dateState);
        }
        var dateState = 0;
        var data = {};
            data.Param = g_condition;
        if(EndTime - StartTime <= 24 * 60 * 60 * 1000)
        {
            dateState = 0;
            data.Param.Count = 3;
            data.Method = "MultiClassify";
        }
        else{
            dateState = 1;
            data.Method = "DaysInfo";
            data.Return = ["Date", "Count", "NewClient"];
        }
        send2server(data,callback,errorFunc)
    }

    function initSimpleSlist()
    {
        function callback(adoc)
        {
            drawMsg.drawSlist(adoc.Message);
        }
        var data = {};
        data.Param = g_condition;
        data.Method = "GetAllClients";

        data.Return = ["MacAddress", "FirstTime", "LastTime", "Count"];
        $(listInfo.listScope).children().remove();
        $(listInfo.listScope).SList("head", listInfo.headOpt);

        send2server(data,callback,errorFunc)


    }
    function errorFunc(error){
        console.log(error);
    }


    function initForm()
    {
        $(listInfo.listScope).SList("head", listInfo.headOpt);
        $(listInfo.listScope).SList("refresh", [{},{},{}]);
        $(".choice-head").click(dealEvent.inputClick);
        $(".choice-show li").click(dealEvent.liOnClick);
        $("#body_over").click(dealEvent.blackClick);
        $(".probesearch-icon").click(dealEvent.searchClick);
        $("#probe_timechoice").click(dealEvent.timeClick);
        $("#daterange").on("inputchange.datarange",dealEvent.dateChange);
        $("#datechoice").on("probechange.probe",function(e, param){
            switch (param.value)
            {
                case 0:
                {
                    g_mac = param.parm.toLowerCase();
                    g_condition.Count = g_choice = 0;
                    g_condition.MacAddress = param.parm;
                    $("#probe_line").children().remove();
                    $("#datechoice1").addClass("position-up");
                    $("#datechoice1").parent().addClass("position-hide")
                    initData(param.parm);
                    return;
                }
                case 2:
                {
                    g_choice = 2;
                    g_condition.Count = 1;
                    break;
                }
                case 3:
                {
                    g_choice = 3;
                    g_condition.Count = 2;
                    break;
                }
                default :
                {
                    g_choice = 1;
                    g_condition.Count = 0;
                }
            }
            $("#datechoice1").removeClass("position-up");
            $("#datechoice1").parent().removeClass("position-hide")

            if(g_timelinedata.length)
            {
                initSimpleSlist();
                drawMsg.drawTimeLine();
            }
            else{
                initData();
            }
        });
        $("#datechoice1").on("probechange.probe",function(e, param){
            var daytemp = new Date();
            var daynow = new Date(daytemp.toDateString()) - 0;

            switch (param.value)
            {
                case 0:
                {
                    {
                        StartTime   = param.startTime;
                        EndTime     = param.endTime;
                        break;
                    }
                }
                case 1:
                {
                    StartTime   = daynow;
                    EndTime     = daytemp - 0;
                    break;
                }
                case 2:
                {
                    StartTime   = daynow - 8 *24 * 60 * 60 * 1000;
                    EndTime     = daynow;
                    break;
                }
                case 3:
                {
                    StartTime   = daynow  - 31 *24 * 60 * 60 * 1000;
                    EndTime     = daynow;
                    break;
                }
                case 4:
                {
                    StartTime   = daynow - 366 *24 * 60 * 60 * 1000;
                    EndTime     = daynow;
                    break;
                }
            }
            g_condition.StartTime   = StartTime;
            g_condition.EndTime     = EndTime;

            if(g_choice == 0 && g_mac){
                initData(g_mac);
                return;
            }
            initData();
        });
    }

    function _init()
    {
        dealEvent.init();
        initForm();
        initData();
    }

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Echart","SingleSelect","SList","DateRange"],
        "utils":["Request","Base"],
    });
})( jQuery );

