/**
 * Created by KF5783 on 2016/3/23.
 */
;(function ($) {
    var MODULE_BASE = "probe"
    var MODULE_NAME = MODULE_BASE+".clientsummary";
    var LIST_NAME   = "#probe_list .simple-list";
    var ECHART_NAME = "#probe_map .myEchart";
    var nowTime     = new Date();
    var StartTime   = new Date(nowTime.toDateString()) - 0;
    var EndTime     = nowTime.getTime();
    var g_choice     = 3;
    var g_condition   = {ACSN:FrameInfo.ACSN, StartTime:StartTime, EndTime:EndTime,Count:0};


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
                {name: "DissociativeStatus",width:200, datatype:"String"},
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
            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text($(".probe-input").val());

            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});

        },
        timeClick: function (e) {
            $("#probe_timechoice").addClass("hide");
            //
            //$(dealEvent.scope).trigger({type:"probechange.probe", data:dealEvent.nowState});
            //
        },
        dateChange: function (e) {
            var orange = $(this,dealEvent.scope).daterange("getRangeData");
            $(".current-state", dealEvent.scope).text(orange.startData + '-' +orange.endData);
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            StartTime = new Date(orange.startData);
            EndTime = new Date(orange.endData);
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});
        }
    };

    var ajaxInfo    = {
        url         :MyConfig.path + '/ant' + "/probeclient",
        dataType    :"json",
        type        :"post",
        ACSN        :FrameInfo.ACSN,
        data        : {},
    };

    var drawMsg     ={
        drawTimeLine : function(aData, dateState)
        {
            var xData = [];
            var yData = [];
            var aMessage = aData;
            if((typeof(aMessage) != "object")||!aMessage.length)
                return false;

            aMessage.sort(function(a, b){
                return Number(a.name) - Number(b.name);
            });

            if(!dateState)
            {
                for(var i = 0; i < aMessage.length; i++){
                    var temp = new Date(aMessage[i].name - 30*60*1000);
                    xData.push(temp.toTimeString().slice(0,5));
                    yData.push(aMessage[i].value);
                }
            }
            else
            {
                for(var i = 0; i < aMessage.length; i++){
                    var temp = new Date(aMessage[i].Date);
                    xData.push(temp.toLocaleDateString().slice(5));
                    yData.push(aMessage[i].Count);
                }
            }

            var option = {
                height:280,
                tooltip : {
                    trigger: 'item'
                },
                grid:{
                    x:50,
                    y:10,
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
                            interval:0,
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
                series : [
                    {
                        name:'ÈËÊý',
                        type:'line',
                        smooth:true,
                        symbol:'circle',
                        symbolSize:0,
                        data:yData

                    }
                ]
            };
            var oTheme = {
                color: ["#9DE274","rgba(0,150,214,0.8)","rgba(0,150,214,0.6)","rgba(0,150,214,0.3)"]
            };
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

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("probe_rc", sRcName);
    }

    function send2server(oParam, successFunc, errorFunc){
        $.ajax({
            url         :ajaxInfo.url,
            dataType    :ajaxInfo.dataType,
            type        :ajaxInfo.type,
            data        :oParam,
            success     :successFunc,
            error       :errorFunc
        });
    }


    function initData(e)
    {
        initTimeClient();
        initSimpleSlist();
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
            data.Method = "TimeClassify";
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
            g_condition.Count = g_choice = param.value;
            initData();
        });
        $("#datechoice1").on("probechange.probe",function(e, param){
            var daytemp = new Date();

            switch (param.value)
            {
                case 1:
                {
                    StartTime   = new Date(daytemp.toDateString()) - 0;
                    EndTime     = daytemp.getTime(); ;
                    break;
                }
                case 2:
                {
                    StartTime   = new Date(daytemp.toDateString()) - 7 *24 * 60 * 60 * 1000;
                    EndTime     = daytemp.getTime(); ;
                    break;
                }
                case 3:
                {
                    StartTime   = new Date(daytemp.toDateString())  - 30 *24 * 60 * 60 * 1000;
                    EndTime     = daytemp.getTime(); ;
                    break;
                }
                case 4:
                {
                    StartTime   = new Date(daytemp.toDateString()) - 365 *24 * 60 * 60 * 1000;
                    EndTime     = daytemp.getTime(); ;
                    break;
                }
            }
            g_condition.StartTime   = StartTime;
            g_condition.EndTime     = EndTime;

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
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Echart","SingleSelect","SList","DateRange"],
        "utils":["Request","Base"],
    });
})( jQuery );

