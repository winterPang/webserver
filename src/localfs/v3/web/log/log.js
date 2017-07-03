;(function ($) {
    var MODULE_BASE = "log";
    var MODULE_NAME = MODULE_BASE + ".log";

    var g_timeFlag = 0; //默认为今天
    var g_startTime = 0;
    var g_endTime = 0;

    /*获得html页面的定义的汉字*/
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("log_monitor_rc", sRcName);
    }

    /*显示统计数据*/
    function initShowStatisData(oLevel)
    {
        var ncrit = oLevel[0];
        var nerror = oLevel[1];
        var nwarn = oLevel[2];
        var ninfo = oLevel[3];

        var nToatal = ncrit + nerror + nwarn + ninfo;

        $("#TotalNumber").html(nToatal);
        $("#crit").html(ncrit);
        $("#error").html(nerror);
        $("#warn").html(nwarn);
        $("#info").html(ninfo);
    }
 
    /*折线图绘制*/
    function Logchart_option(aTime,oData)
    {
        var option = {
            height:240,
            legend: {
                data:[getRcText("CRIT"),getRcText("WARN"),getRcText("COMMON"),getRcText("ERROR")]
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                        color: '#373737',
                        width: 0,
                        type: 'solid'
                    }
                },
            },

            //dataZoom:{},

            grid: {
                x: 55, y: 40,x2:35,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine:false,

                    data:aTime
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name:getRcText("NUMBER"),
                    nameTextStyle:{color:"gray"},
                    splitLine:false,
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#47495d', width: 1}
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#E6E6FA', width: 1}
                    }
                }
            ],
            series: [{
                symbol: "none",
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: getRcText("CRIT"),
                data:oData.crit
            },
            {
                symbol: "none",
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: getRcText("WARN"),
                data :oData.warn
            },
            {
                symbol: "none",
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: getRcText("COMMON"),
                data:oData.common
            },
            {
                symbol: "none",
                type: 'line',
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                name: getRcText("ERROR"),
                data:oData.error
            },]
        };

        if(30 < aTime.length)
        {
            var dataZoom = {
                show: true,
                start:0,
            };

            option.dataZoom = dataZoom;

            $("#newLines").html("<div id='del_newLines'><br/></div>");
        }
        else
        {
            if(document.getElementById("del_newLines"))
            {
                $("#del_newLines").remove();
            }
        }

        var oTheme = {
            color: ['#0096d6','#31A9DC','#62BCE2','#7BC7E7'],
            valueAxis:{
                splitLine:{lineStyle:{color:[ '#FFF']}},
                axisLabel:{textStyle: {color: [ '#abbbde']}}
            },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFF']}}
            }
        };

        $("#log_chart").echart("init", option, oTheme);
    }


    function initTodayChartLine(LogMsg)
    {
        var nHOURS = 24;
        var nOneHours = 3600 * 1000;
        var aFlowOptTime = [];
        var oLevel = [];

        /*统计显示数据*/
        var ncrit = 0;
        var nerror = 0;
        var nwarn = 0;
        var ninfo = 0;

        var oData = {};
        oData.crit = [];
        oData.warn = [];
        oData.common = [];
        oData.error = [];

        if("0" == g_timeFlag)
        {
            var tNow = new Date();
            var nYear = tNow.getFullYear();
            var nMonth = tNow.getMonth();
            var nDay = tNow.getDate();

            tNow = new Date(nYear,nMonth,nDay,24).getTime();
        }
        else if("4" == g_timeFlag)
        {
            var tNow = new Date(g_startTime);
            tNow = tNow.getTime() + nOneHours * nHOURS;
        }

        for(var i = 0;i < nHOURS; i++)
        {
            aFlowOptTime[i] = tNow - nOneHours * (nHOURS - i);
            oData.crit[i] = 0;
            oData.warn[i] = 0;
            oData.common[i] = 0;
            oData.error[i] = 0;
        }

        for(var i = 1; i < aFlowOptTime.length; i++)
        {
            for(var j = 0; j < LogMsg.length; j++)
            {
                var dataTimeStamp = LogMsg[j].stamp * 1000;

                if( (dataTimeStamp > aFlowOptTime[i] - nOneHours) && (dataTimeStamp <= aFlowOptTime[i]) )
                {
                    if(LogMsg[j].level == getRcText("CRIT") )
                    {
                        oData.crit[i-1] +=1;
                        ncrit++;
                    }
                    else if(LogMsg[j].level == getRcText("WARN") )
                    {
                        oData.warn[i-1] +=1;
                        nwarn++;
                    }
                    else if(LogMsg[j].level == getRcText("COMMON") )
                    {
                        oData.common[i-1] +=1;
                        ninfo++;
                    }
                    else if(LogMsg[j].level == getRcText("ERROR") )
                    {
                        oData.error[i-1] +=1;
                        nerror++;
                    }
                }
            }
        }

        for(var i = 0; i < aFlowOptTime.length; i++)
        {
            aFlowOptTime[i] = new Date(aFlowOptTime[i]);
            var nHours = aFlowOptTime[i].getHours();
            var nMinutes = aFlowOptTime[i].getMinutes();

            if(10 > nHours) {
                aFlowOptTime[i] = "0" + nHours + ":" + "00";
            }
            else{
                aFlowOptTime[i] = nHours + ":" + "00";
            }
        }

        /*折线图*/
        Logchart_option(aFlowOptTime, oData);

        /*级别统计放到一个数组里*/
        oLevel.push(ncrit,nerror,nwarn,ninfo);
        return oLevel;
    }

    /*显示折线图 */
    function initLogChartLine(LogMsg)
    {
        var nDATA = 0;
        var nOneDay = 24 * 3600 * 1000;
        var aFlowOptTime = [];
        var oLevel = [];

        var oData = {};
        oData.crit = [];
        oData.warn = [];
        oData.common = [];
        oData.error = [];

        var ncrit = 0;
        var nerror = 0;
        var nwarn = 0;
        var ninfo = 0;

        if("1" == g_timeFlag)
        {
            nDATA = 7;
        }
        else if("2" == g_timeFlag)
        {
            nDATA = 30;
        }
        else if("3" == g_timeFlag)
        {
            nDATA = 365;
        }

        var tNow = new Date();
        if("1" == g_timeFlag || "2" == g_timeFlag || "3" == g_timeFlag)
        {
            var nYear = tNow.getFullYear();
            var nMonth = tNow.getMonth();
            var nDay = tNow.getDate();

            tNow = new Date(nYear,nMonth,nDay,24).getTime();
        }
        if("4" == g_timeFlag)
        {
            var tEndTime = new Date(g_endTime);
            var tStartTime = new Date(g_startTime);

            nDATA = (tEndTime.getTime() - tStartTime.getTime()) / nOneDay + 1;
            tNow = tEndTime.getTime() + nOneDay;
        }

        nDATA += 1;

        for(var i = 0; i < nDATA; i++)
        {
            aFlowOptTime[i] = tNow - nOneDay * (nDATA - i - 1);
            oData.crit[i] = 0;
            oData.warn[i] = 0;
            oData.common[i] = 0;
            oData.error[i] = 0;
        }

        for(var i = 1; i < aFlowOptTime.length; i++)
        {
            for(var j = 0; j < LogMsg.length; j++)
            {
                var dataTimeStamp = LogMsg[j].stamp * 1000;
                if((dataTimeStamp >= aFlowOptTime[i] - nOneDay) && (dataTimeStamp <= aFlowOptTime[i]))
                {
                    if(LogMsg[j].level == getRcText("CRIT"))
                    {
                        oData.crit[i-1] +=1;
                        ncrit++;
                    }
                    else if(LogMsg[j].level == getRcText("WARN"))
                    {
                        oData.warn[i-1] +=1;
                        nwarn++;
                    }
                    else if(LogMsg[j].level == getRcText("COMMON"))
                    {
                        oData.common[i-1] +=1;
                        ninfo++;
                    }
                    else if(LogMsg[j].level == getRcText("ERROR"))
                    {
                        oData.error[i-1] +=1;
                        nerror++;
                    }
                }
            }
        }

        /*折线图*/
        for(var i = 0; i < (aFlowOptTime.length); i++)
        {
            aFlowOptTime[i] = new Date(aFlowOptTime[i]);
            aFlowOptTime[i] = aFlowOptTime[i].toLocaleDateString();
        }

        aFlowOptTime.pop(aFlowOptTime[nDATA - 1]);
        oData.crit.pop(oData.crit[nDATA - 1]);
        oData.warn.pop(oData.warn[nDATA - 1]);
        oData.common.pop(oData.common[nDATA - 1]);
        oData.error.pop(oData.error[nDATA - 1]);

        Logchart_option(aFlowOptTime, oData);

        /*级别统计放到一个数组里*/
        oLevel.push(ncrit,nerror,nwarn,ninfo);
        return oLevel;
    }

    /*绘制表格头*/
    function initLogHead()
    {
        var optLog= {
            colNames: getRcText ("LOG_HEAD"),
            showHeader: true,
            search:true,
            pageSize:12,
            colModel: [
                {name: "user", datatype: "String",width:100},
                {name: "ip", datatype: "Integer",width:100},
                {name: "module", datatype: "String",width:100},
                {name: "level", datatype: "String",width:80},
                {name: "message", datatype: "String",width:250},
                {name: "stamp", datatype: "Integer",width:150}
            ]
        };
        $("#log_list").SList ("head", optLog);
    }

    /*绘制表格*/
    function initTodayLogTable(LogMsg)
    {
        var listLogMsg = [];
        var nOneDay = 24 * 3600 * 1000;

        if("0" == g_timeFlag)
        {
            var tNow = new Date();
            var nYear = tNow.getFullYear();
            var nMonth = tNow.getMonth();
            var nDay = tNow.getDate();

            var nEndTime = new Date(nYear,nMonth,nDay,24).getTime();
        }
        else if("4" == g_timeFlag)
        {
            var tNow = new Date(g_startTime);
            nEndTime = tNow.getTime() + nOneHours * nHOURS;
        }

        for(var i = 0; i < LogMsg.length; i++)
        {
            var dataTimeStamp = LogMsg[i].stamp * 1000;

            if( (dataTimeStamp > nEndTime - nOneDay) && (dataTimeStamp <= nEndTime) )
            {
                delete LogMsg[i].id;
               // delete LogMsg[i].stamp;
               LogMsg[i].stamp = new Date(LogMsg[i].stamp*1000).toLocaleString()
                listLogMsg.push(LogMsg[i]);
            }
        }

        $("#log_list").SList("refresh",listLogMsg);
    }

    function initLogTable(LogMsg)
    {
        var listLogMsg =[];
        var nDATA = 0;
        var nOneDay = 24 * 3600 * 1000;

        if("1" == g_timeFlag)
        {
            nDATA = 7;
        }
        else if("2" == g_timeFlag)
        {
            nDATA = 30;
        }
        else if("3" == g_timeFlag)
        {
            nDATA = 365;
        }

        var tNow = new Date();
        if("1" == g_timeFlag || "2" == g_timeFlag || "3" == g_timeFlag)
        {
            var nYear = tNow.getFullYear();
            var nMonth = tNow.getMonth();
            var nDay = tNow.getDate();

            var nEndTime = new Date(nYear,nMonth,nDay,24).getTime();
        }
        if("4" == g_timeFlag)
        {
            var tEndTime = new Date(g_endTime);
            var tStartTime = new Date(g_startTime);
            var nEndTime = tEndTime.getTime() + nOneDay;

            nDATA = (tEndTime.getTime() - tStartTime.getTime()) / nOneDay + 1;
        }

        for(var i=0;i<LogMsg.length;i++)
        {
            var dataTimeStamp = LogMsg[i].stamp * 1000;

            if((dataTimeStamp >= nEndTime - nOneDay * nDATA) && (dataTimeStamp <= nEndTime))
            {
                delete LogMsg[i].id;
               // delete LogMsg[i].stamp;
               LogMsg[i].stamp = new Date(LogMsg[i].stamp*1000).toLocaleString()
                listLogMsg.push(LogMsg[i]);
            }
        }

        $("#log_list").SList("refresh",listLogMsg);
    }

    function initOtherLogTable(LogMsg)
    {
        g_startTime = $("input[name='daterangepicker_start']").val();
        g_endTime = $("input[name='daterangepicker_end']").val();

        /*显示折线图 */
        if(g_startTime == g_endTime)
        {
            initTodayLogTable(LogMsg);
        }
        else
        {
            initLogTable(LogMsg);
        }
    }

    function initLogLevelForChart()
    {
          var SendMsg = {
            url:  MyConfig.path+"/ant/read_logmgr",
            dataType: "json",
            type:"post",
            data:{
                devSN:FrameInfo.ACSN,
                //sessionID:"00001",
                method:"getLog",
                ret:[]
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data)
        {
          var LogMsg = data.message;
                //var LogMsg = data.result;
            var oLevel = [];

            /*显示折线图 */
            if("0" == g_timeFlag)
            {
                oLevel = initTodayChartLine(LogMsg);
            }
            else if("4" == g_timeFlag)
            {
                oLevel = initOtherChartLine(LogMsg);
            }
            else
            {
                oLevel = initLogChartLine(LogMsg);
            }

            /*显示统计数据*/
            initShowStatisData(oLevel);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }  
    }

    function initLogLevelForTable()
    {
          var SendMsg = {
           url:  MyConfig.path+"/ant/read_logmgr",
            dataType: "json",
            type:"post",
            data:{
                devSN:FrameInfo.ACSN,
                //sessionID:"00001",
                method:"getLog",
                ret:[]
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data)
        {
           var LogMsg = data.message;
           // var LogMsg = data.result;

                /*绘制表格 */
                if("0" == g_timeFlag)
                {
                    initTodayLogTable(LogMsg);
                }
                else if("4" == g_timeFlag)
                {
                    initOtherLogTable(LogMsg);
                }
                else
                {
                    initLogTable(LogMsg);
                }
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }  
    }

    function ButShowOther()
    {
        if($("#otherTime:checked").length)
        {
            $("#getOtherTime").removeClass("hide");
        }
        var aStartValue = $("input[name='daterangepicker_start']").val();
        var aEndValue = $("input[name='daterangepicker_end']").val();
        var sInputValue = aStartValue + " - " + aEndValue;
        if($("#starttime").val() == "")
        {
            $("#starttime").val(sInputValue);
        }
    }

    function ButHideOther()
    {
        if(!($("#otherTime:checked").length))
        {
            $("#getOtherTime").addClass("hide");
        }
    }

    function initOtherChartLine(LogMsg)
    {
        var oLevel = [];

        g_startTime = $("input[name='daterangepicker_start']").val();
        g_endTime = $("input[name='daterangepicker_end']").val();

        /*显示折线图 */
        if(g_startTime == g_endTime)
        {
            oLevel = initTodayChartLine(LogMsg);
        }
        else
        {
            oLevel = initLogChartLine(LogMsg);
        }

        return oLevel;
    }

    function Ensure()
    {
        g_timeFlag = $("input[type=radio]:checked").val();

        switch (g_timeFlag)
        {
            case "0":
                $("#trendId").html("（今天）");
                break;
            case "1":
                $("#trendId").html("（七天）");
                break;
            case "2":
                $("#trendId").html("（一月）");
                break;
            case "3":
                $("#trendId").html("（一年）");
                break;
            case "4":
                var startTime = $("input[name='daterangepicker_start']").val();
                var endTime = $("input[name='daterangepicker_end']").val();
                $("#trendId").html("（" + startTime + "-" + endTime + "）");
                break;
            default:
                break;
        }

        initLogLevelForChart();
        initLogLevelForTable();
    }

    function initForm()
    {
        //显示可选择的周期和等级
        $("#msg_select").on("click",function(){
            if($("#select_option").hasClass("hide"))
            {
                $("#select_option").removeClass("hide");
            }
            else
            {
                $("#select_option").addClass("hide");
            }
        });
        //隐藏可选择的周期和等级
        $("#remove").on("click",function(){
            $("#select_option").addClass("hide");
        });

        /*周期的选择刷新*/
        $("#statisOneday").on("click",Ensure);
        $("#statisAweek").on("click",Ensure);
        $("#statisMonth").on("click",Ensure);
        $("#statisYear").on("click",Ensure);
        /*点击查看是否影藏日历*/
        $("#otherTime").on("click",ButShowOther);
        $(".applyBtn").on("click",Ensure);
        $("#statisOneday,#statisAweek,#statisMonth,#statisYear").on("click",ButHideOther);
    }

    function setCalendarDate() {
        /*设置日历背景图的日期*/
        var todayDate = new Date().getDate();

        if (1 == todayDate) {
            $(".set-background").css("padding-left", "23px");
        }
        else if(9 >= todayDate && 1 != todayDate) {
            $(".set-background").css("padding-left", "22px");
        }
        else if (11 == todayDate) {
            $(".set-background").css("padding-left", "19px");
        }
        else if(10 < todayDate && 20 > todayDate && 11 != todayDate) {
            $(".set-background").css("padding-left", "18px");
        }
        else {
            $(".set-background").css("padding-left", "18px");
        }

        $(".set-background").html(todayDate);
    }

    function initData()
    {
      // testAdd();
        //设置默认是一周
        initLogLevelForChart();
        initLogLevelForTable();
    }
    function initGrid()
    {
        initLogHead();
    }
    function _init()
    {
        setCalendarDate();
        initForm();
        initGrid();
        initData();
    };

    function _destroy()
    {
        g_timeFlag = 0; //默认为今天
        g_startTime = 0;
        g_endTime = 0;
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","DateRange"],
        "utils":["Base","Request"]
    });
})( jQuery );