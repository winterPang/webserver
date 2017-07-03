;(function ($) {
    var MODULE_BASE = "drs";
    var MODULE_NAME = MODULE_BASE + ".dpi_app";
    var g_sn = FrameInfo.ACSN;

    /*定义全局变量来标识所选的状态和过滤条件*/
    var g_sInputMac = ""; //保存输入的MAC；
    var g_sInputApp = ""; //保存输入的APP
    var g_SelectTime = 0; //选择时间过滤 一天（0）七天（1）一月（2）一年（3），其他（4）；
    var g_AppType = "";  //选择网站类型过滤填充value值；
    var g_SelectWay = 0; //选择方式 人次（0），时长（1），流量（2）；
    var g_Legend = 0; // 选择的图例 饼图（0），折线图（1）；

    function getRcText(sRcName) {
        return Utils.Base.getRcString("dpi_monitor_rc", sRcName);
    }

    /*验证MAC地址的合法性*/
    function macFormCheck(mac)
    {
        var macs = new Array();
        macs = mac.split("-");
        if(macs.length != 3)
        {
            return false;
        }
        for (var s=0; s<3; s++) {
            var temp = parseInt(macs[s],16);

            if(isNaN(temp))
            {
                return false;
            }


            if(temp < 0 || temp > 65535)
            {
                return false;
            }
        }
        return true;
    }
    //获取时间函数
    function getTheDate(str1,str2)
    {
        var nyear = new Date().getFullYear();
        var nmonth = new Date().getMonth();
        var nday = new Date().getDate();
        var nHour = new Date().getHours();
        if(str1=="one")
        {
            var nDATA = 24
            var tNow = new Date(nyear,nmonth,nday,nDATA);
            var noneHour = 3600*1000

            if(str2=="end")
            {

                return tNow-0
            }
            if(str2 =="start")
            {

                return tNow - noneHour*(nDATA)
            }
        }
        if(str1=="month")
        {
            var nDATA = 30;
            var aHour = 24*3600*1000;
            var aOptTime = [];
            var tNow = new Date(nyear,nmonth,nday,24);

            if(str2=="end")
            {

                return tNow - 0
            }
            if(str2 =="start")
            {

                return tNow - aHour*(nDATA)
            }
        }
        if(str1=="year")
        {
            var nDATA = 365;
            var aHour = 24*3600*1000;
            var aOptTime = [];
           var tNow = new Date(nyear,nmonth,nday,24);

            if(str2=="end")
            {

                 return tNow - 0
            }
            if(str2 =="start")
            {

               return tNow - aHour*(nDATA)
            }
        }
        if(str1=="aweek")
        {
            var nDATA = 7;
            var aHour = 24*3600*1000;
            var aOptTime = [];
            var tNow = new Date(nyear,nmonth,nday,24);

            if(str2=="end")
            {
                 return tNow - 0
            }
            if(str2=="start")
            {
                return tNow - aHour*(nDATA)
            }
        }
    }
    /*饼图图例显示在中间*/
    function topChange(top, lineHeight,sum, mixTop)//中间点距离上边高度， 行高， 数量， 最小上边距
    {
        if(mixTop != undefined)
        {
            if(top - sum * lineHeight / 2 < mixTop)
            {
                return mixTop;
            }
        }
        return parseInt(top - sum * lineHeight / 2);
    }
    /*饼图option*/
    function initUrlPie(aData) {
        for(var i=0;i<aData.length;i++)
        {
            if(aData[i].name == "")
            {
                aData[i].name  = aData[i].APPName;

            }
        }
        if(aData.length == 0)
        {
            var option = {
                calculable : false,
                height:300,
                tooltip : {
                    show:false
                },
                series : [
                    {
                        type: 'pie',
                        radius: ['35%', '65%'],
                        center: ['15%', '47%'],
                        itemStyle: {
                            normal: {
                                labelLine:{
                                    show:false
                                },
                                label:
                                {
                                    show:false
                                }
                            }
                        },
                        data: [{name:"",value:1}]
                    }
                ]
            };
            var oTheme = {color: ['#B7ADAD']};
        }
        else
        {
            var adata = aData;
            /*防止时长为0而出现错误*/
            for(var i=0;i<adata.length;i++)
            {
                if(adata[i].value == 0)
                {
                    adata[i].value = 1;
                }
            }
            var option = {
                height: 300,
                tooltip: {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                myLegend: {
                    scope: "#AppType_message",
                    width: "30%",
                    height: 150,
                    right: "40%",
                    top: topChange(140, 31,aData.length,8),
                },
                calculable: false,
                series: [
                    {
                        //  name: aID[2],
                        type: 'pie',
                        radius: ['35%', '65%'],
                        center: ['15%', '47%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position:"inner",
                                    formatter: function(a){
                                        return"";
                                    }
                                }
                            }
                        },
                        data: adata
                    }
                ],
            };
           /* var oTheme = {
                color: ['#C72222','#S0E014','#FFFF00','#8A2BE2','#33FF00','#483D8B','#BB860B','#006400']
            };*/
            var oTheme = {
                color: ['#D52B4D', '#FF9900', '#44BB74', '#D56F2B', '#C48D3C', '#55AA66', '#44A3BB', '#2BD5D5', '#91B2D2', '#D7DDE4']
            };
        }
        $("#AppType_pie").echart("init", option, oTheme);
    }
    /*折线图option*/
    function initAppChart(Name,aData,CountDay)
    {
        var aTime = aData.aTime;
        if(CountDay>=30)
        {
           var  dataZoom={
                show: true,
                    realtime: true,
                    start: 60,
                    end: 80,
                    height:15
            }
        }
        else
        {
           var  dataZoom={};
        }
        if(CountDay <= 1)
        {
            for (var i = 0; i < aTime.length; i++)
            {
                aTime[i] = new Date(aTime[i]);
                aTime[i] = (aTime[i].toTimeString()).slice(0, 5);
            }
        }
        else
        {
            for(var i=0;i<aTime.length;i++)
            {
                aTime[i] = new Date(aTime[i]);
                aTime[i] = (aTime[i].toLocaleDateString()).slice(5);
            }
        }
        if(g_SelectWay == 2)
        {
            var ShowName = getRcText("FlowName");
        }
        else
        {
            var ShowName = getRcText("PERSON");
        }
        var adata = aData.aUserNum_app ;
        var option = {
            //width:"100%",
            height: 300,
            /* title: {
             text: IdAndName.name,
             x: 70
             },*/
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#373737',
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            /*legend: {
             data:["上行流量","下行流量","丢弃流量"],
             textStyle:{
             color:"gray"
             }
             },*/
            dataZoom:dataZoom,
            grid: {
                x: 70,
                y: 50,
                x2: 30,
                y2: 70, //45
                borderColor: '#415172'
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine:{
                            show:true,
                            lineStyle :{color: '#475C81', width: 1}
                        },
                    // name:sTime,//getRcText("SHOWTIME"),
                    nameTextStyle: {color: "gray"},
                    axisLabel: {
                       // rotate: 45, //横轴的倾斜程度
                        show: true,
                        textStyle: {color: '#fff', width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#475C81', width: 1}
                    },
                    axisTick: {
                        show: false
                    },
                    data: aTime,
                }
            ],

            yAxis: [
                {
                    type: 'value',
                    name:ShowName,
                    nameTextStyle: {color: "gray"},
                    splitLine:{
                            show:true,
                            lineStyle :{color: '#475C81', width: 1}
                        },
                    axisLabel: {
                        show: true,
                        //textStyle: {color: '#47495d', width: 2}
                        textStyle: {color: '#fff', width: 2}
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#475C81', width: 1}
                    }
                }
            ],
            series: [
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                   // itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: Name,
                    data: adata
                }

            ]

        };
        var oTheme = {
            color: ['#9DE274', '#31A9DC', '#62BCE2'],
            valueAxis: {
                splitLine: {lineStyle: {color: ['#415172']}},
                axisLabel: {textStyle: {color: ['#abbbde']}}
            },
            categoryAxis: {
                splitLine: {lineStyle: {color: ['#415172']}}
            }
        }

        $("#App_chart").echart("init", option, oTheme);
    }

     /*发送折线图已经组织好的ajax*/
    function FilterFuncLine(sStartTime,sEnd)
    {

        var sNowStart = getTheDate("one", "Start");
        var sNowEndTime = getTheDate("one", "end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime / 1000;
        var nEndTime = sEnd / 1000;
        var nHour = new Date().getHours();

        var SendMsg = {
            url: MyConfig.path + "/ant/read_dpi_app",
            dataType: "json",
            type: "post",
            data: {
                Method: 'GetAppLine',
                MAC:g_sInputMac,
                APPName:g_sInputApp,
                SelectWay:g_SelectWay, //只有人次和流量可以（0,2）
                APPGroupName:g_AppType,
                Time:nHour,
                Param: {
                    family: "0",
                    direct: "0",
                    ACSN: g_sn,
                    StartTime: nStartTime,
                    EndTime: nEndTime,
                },
                Return: [

                ]
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data)
        {
           var aMessage = data.message;
             if(g_SelectWay == 0)
            {
                var name = getRcText("PERSON");
            }
            else
            {
                var name = getRcText("Flow");
            }
            var nCountDay = (nEndTime-nStartTime)/(3600*24);
            initAppChart(name,aMessage,nCountDay);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }
    }

    /*发送饼图已经组织好的ajax*/
    function FilterFuncPie(sStartTime,sNowEndTime)
    {

        var sNowStart = getTheDate("one", "Start");
        var sNowEndTime = getTheDate("one", "end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime / 1000;
        var nEndTime = sEnd / 1000;

        var SendMsg = {
            url: MyConfig.path + "/ant/read_dpi_app",
            dataType: "json",
            type: "post",
            data: {
                Method: 'GetAppPie',
                MAC:g_sInputMac,
                APPName:g_sInputApp,
                SelectWay:g_SelectWay,
                APPGroupName:g_AppType,
                Param: {
                    family: "0",
                    direct: "0",
                    ACSN: g_sn,
                    StartTime: nStartTime,
                    EndTime: nEndTime,
                },
                Return: [

                ]
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data)
        {
           var aMessage = data.message;
            initUrlPie(aMessage);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }
        /*饼图请求*/
    }
    /*获取list头*/
    function getListHead(nGroup,aMessage)
    {
        for(var i=0;i<aMessage.length;i++)
        {
            if(aMessage[i].APPName == "")
            {
                aMessage[i].APPName  = aMessage[i].APPNameEn;

            }
        }

        switch(nGroup)
        {
            case 0:
            {
                for(var i=0;i<aMessage.length;i++)
                {
                    var sType = aMessage[i].APPGroupName;
                    switch(sType)
                    {
                        case "Life":
                        {
                            aMessage[i].APPGroupName = getRcText("Life");
                            break;
                        }
                        case "Office":
                        {
                            aMessage[i].APPGroupName = getRcText("Office");
                            break;
                        }
                        case "Communication":
                        {
                            aMessage[i].APPGroupName = getRcText("Communication");
                            break;
                        }
                        case "Video":
                        {
                            aMessage[i].APPGroupName = getRcText("Video");
                            break;
                        }
                        case "Game":
                        {
                            aMessage[i].APPGroupName = getRcText("Game");
                            break;
                        }
                        case "Tool":
                        {
                            aMessage[i].APPGroupName = getRcText("Tool");
                            break;
                        }
                        case "News":
                        {
                            aMessage[i].APPGroupName = getRcText("News");
                            break;
                        }
                        case "Navigation":
                        {
                            aMessage[i].APPGroupName = getRcText("Navigation");
                            break;
                        }
                        case "Finance":
                        {
                            aMessage[i].APPGroupName = getRcText("Finance");
                            break;
                        }
                        default:
                        {
                            aMessage[i].APPGroupName = getRcText("Unknown");
                            break;
                        }

                    }
                }
                $("#listTable").removeClass("hide");
                $("#listTable1").addClass("hide");
                $("#listTable2").addClass("hide");
                $("#listTable3").addClass("hide");
                $("#WelcomeList").SList ("refresh", aMessage);/*TotalTime CategoryName WebSiteName value UserMAC*/
                break;
            }
            case 1:
            {
                 for(var i=0;i<aMessage.length;i++)
                {
                    aMessage[i].FirstTime = new Date(aMessage[i].FirstTime*1000).toLocaleString();
                    aMessage[i].LastTime = new Date(aMessage[i].LastTime*1000).toLocaleString();
                };

                $("#listTable").addClass("hide");
                $("#listTable1").removeClass("hide");
                $("#listTable2").addClass("hide");
                $("#listTable3").addClass("hide");
                $("#WelcomeList1").SList ("refresh", aMessage);
                break;
            }
            case 2:
            {
                for(var i=0;i<aMessage.length;i++)
                {
                    aMessage[i].FirstTime = new Date(aMessage[i].FirstTime*1000).toLocaleString();
                    aMessage[i].LastTime = new Date(aMessage[i].LastTime*1000).toLocaleString();
                };
                $("#listTable").addClass("hide");
                $("#listTable1").addClass("hide");
                $("#listTable2").removeClass("hide");
                $("#listTable3").addClass("hide");
                $("#WelcomeList2").SList ("refresh", aMessage);
                break;
            }
            case 3:
            {
                $("#listTable").addClass("hide");
                $("#listTable1").addClass("hide");
                $("#listTable2").addClass("hide");
                $("#listTable3").removeClass("hide");
                $("#WelcomeList3").SList ("refresh", aMessage);
                break;
            }
            default:
                break;
        }
    }
     /*发list表的请求*/
    function ajaxTable(sAPP,sMac,sAppType,nGroup,sStartTime, sEnd)
    {
        var sNowStart = getTheDate("one", "start");
        var sNowEndTime = getTheDate("one", "end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime / 1000;
        var nEndTime = sEnd / 1000;
         var SendMsg = {
            url: MyConfig.path + "/ant/read_dpi_app",
            dataType: "json",
            type: "post",
            data: {
                Method: 'AppTable',
                Group:nGroup,
                APPGroupName:sAppType,
                MAC:sMac,
                APPName:sAPP,
                Param: {
                    family: "0",
                    direct: "0",
                    ACSN: g_sn,
                    StartTime: nStartTime,
                    EndTime: nEndTime,
                },
                Return: []

            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data)
        {
            var aMessage = data.message;
                getListHead(nGroup,aMessage);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }
        /*list表的初始化*/
    }
    /*初始化list表*/
    function initTable(sStartTime,sEnd)
    {
        if(g_sInputApp == "" && g_sInputMac == "" && g_AppType =="")
        {
            var nGroup = 0;
        }
        if(g_sInputMac != "")
        {
            var nGroup = 1;
        }
        if(g_sInputApp != "")
        {
            var nGroup = 2;
        }
        if(g_sInputMac == "" && g_AppType!="")
        {
            var nGroup = 3;
        }
        var sAPP = g_sInputApp;
        var sMac = g_sInputMac;
        var sAppType = g_AppType;
        ajaxTable(sAPP,sMac,sAppType,nGroup,sStartTime, sEnd)

    }
    /*初始化第一张图的饼图*/
    function initPie()
    {
        switch(g_SelectTime)
        {
            case 0:
            {
                var sNowStart =  getTheDate("one","start");
                var sNowEndTime =  getTheDate("one","end");
                FilterFuncPie(sNowStart,sNowEndTime);
                initTable(sNowStart,sNowEndTime);
                break;
            }

            case 1:
            {
                var sNowStart =  getTheDate("aweek","start");
                var sNowEndTime =  getTheDate("aweek","end");
                FilterFuncPie(sNowStart,sNowEndTime);
                initTable(sNowStart,sNowEndTime)
                break;
            }

            case 2:
            {
                var sNowStart =  getTheDate("month","start");
                var sNowEndTime =  getTheDate("month","end");
                FilterFuncPie(sNowStart,sNowEndTime);
                initTable(sNowStart,sNowEndTime)
                break;
            }

            case 3:
            {
                var sNowStart =  getTheDate("year","start");
                var sNowEndTime =  getTheDate("year","end");
                FilterFuncPie(sNowStart,sNowEndTime);
                initTable(sNowStart,sNowEndTime)
                break;
            }

            case 4:
            {
                var aStartValue = $("input[name='daterangepicker_start']").val();
                var aEndValue = $("input[name='daterangepicker_end']").val();
                var StartTime = aStartValue + " - " + aEndValue;
                $("#InputselecTime").text(StartTime);

                var sNowStart = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                var sNowEndTime = (new Date(Number(StartTime.slice(13,17)),Number(StartTime.slice(18,20))-1,Number(StartTime.slice(21,23)),24)).getTime();

                FilterFuncPie(sNowStart,sNowEndTime);
                initTable(sNowStart,sNowEndTime)
                break;
            }

        }
    }
    /*初始化第一张图的折线图*/
    function initLine()
    {
        switch(g_SelectTime)
        {
            case 0:
            {
                var sNowStart =  getTheDate("one","start");
                var sNowEndTime =  getTheDate("one","end");
                FilterFuncLine(sNowStart,sNowEndTime);
                initTable(sNowStart,sNowEndTime)
                break;
            }
            case 1:
            {
                var sNowStart =  getTheDate("aweek","start");
                var sNowEndTime =  getTheDate("aweek","end");
                FilterFuncLine(sNowStart,sNowEndTime);
                initTable(sNowStart,sNowEndTime)
                break;
            }
            case 2:
            {
                var sNowStart =  getTheDate("month","start");
                var sNowEndTime =  getTheDate("month","end");
                FilterFuncLine(sNowStart,sNowEndTime);
                initTable(sNowStart,sNowEndTime)
                break;
            }
            case 3:
            {
                var sNowStart =  getTheDate("year","start");
                var sNowEndTime =  getTheDate("year","end");
                FilterFuncLine(sNowStart,sNowEndTime);
                initTable(sNowStart,sNowEndTime)
                break;
            }
            case 4:
            {
                var StartTime = $("#daterange").daterange("value");

                var sNowStart = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                var sNowEndTime = (new Date(Number(StartTime.slice(13,17)),Number(StartTime.slice(18,20))-1,Number(StartTime.slice(21,23)),24)).getTime();

                FilterFuncLine(sNowStart,sNowEndTime);
                initTable(sNowStart,sNowEndTime)
                break;
            }
        }
    }

  /*选择以饼图显示还是以折线图显示*/
    function SelectShowWay()
    {
        var nDate = $(this).attr("value");
        switch(nDate)
        {
            case "pie":
            {
                $("#drowline").addClass("hide");
                $("#drawpie").removeClass("hide");

                /*选择了饼图而且没有输入应用名称地址则显示全部*/
                if(g_sInputApp  == "")
                {
                    $("#PersonSelectWay").addClass("hide");
                    $("#TimeSelectWay").addClass("hide");
                    $("#FlowSelectWay").addClass("hide");
                    $("#AllSelectWay").removeClass("hide");
                    /*保证转换后显示的选择方式是正确的*/
                    switch(g_SelectWay)
                    {
                        case 0:
                            $("#SelectWay").val("manNum");
                            break;
                        case 1:
                            $("#SelectWay").val("Time");
                            break;
                        case 2:
                            $("#SelectWay").val("Flow");
                            break;
                    }
                }
                /*输入了MAC地址 当前选择的的是流量 则在选择饼图时要不选择人次*/
                if(g_sInputMac!="")
                {
                    $("#PersonSelectWay").addClass("hide");
                    $("#TimeSelectWay").removeClass("hide");
                    $("#FlowSelectWay").addClass("hide");
                    $("#AllSelectWay").addClass("hide");
                    /*根据当前选择的统计方式的值决定显示那个*/
                    if(g_SelectWay == 1)
                    {
                        $("#SelectWay2").val("Time");
                    }
                    else
                    {
                        $("#SelectWay2").val("Flow");
                    }
                }

                g_Legend = 0;
                initPie();
                break;
            }
            case "line":
            {
                if(g_SelectWay == 1)
                {
                    return;//选择了时长统计折线图没意义不做处理
                }

                $("#drawpie").addClass("hide");
                $("#drowline").removeClass("hide");

                /*选择了折线图则只统计人次 和流量*/
                $("#PersonSelectWay").removeClass("hide");
                $("#TimeSelectWay").addClass("hide");
                $("#AllSelectWay").addClass("hide");
                /*保证转换后显示的选择方式是正确的*/
                switch(g_SelectWay)
                {
                    case 0:
                        $("#SelectWay1").val("manNum");
                        break;
                    case 1:
                        $("#SelectWay1").val("Time");
                        break;
                    case 2:
                        $("#SelectWay1").val("Flow");
                        break;
                }

                /*输入了MAC地址 当前选择的的是流量 则在选择折线图时要不选择人次和时长*/
                if(g_sInputMac!="")
                {
                    $("#PersonSelectWay").addClass("hide");
                    $("#TimeSelectWay").addClass("hide");
                    $("#FlowSelectWay").removeClass("hide");
                    $("#AllSelectWay").addClass("hide");
                }

                g_Legend = 1;
                initLine();
                break;
            }
        }
    }

  /*选择时间过滤条件*/
    function SelectTime(nDate)
    {
        switch(nDate)
        {
            case 0:
            {
                g_SelectTime = 0;
                break;
            }
            case 1:
            {
                g_SelectTime = 1;
                break;
            }
            case 2:
            {
                g_SelectTime = 2;
                break;
            }
            case 3:
            {
                g_SelectTime = 3;
                break;
            }
            case 4:
            {
                g_SelectTime = 4;
                break;
            }
        }
        if(g_Legend == 0)
        {
            initPie();
        }
        else
        {
            initLine();
        }

    }
    /*选择APP类型*/
    function SelectAppType()
    {
        var nDate = $(this).attr("value");
        if(nDate == "all")
        {
            g_AppType = "";
        }
        else
        {
            g_AppType = nDate;
        }
        if(g_Legend == 0)
        {
            initPie();
        }
        else
        {
            initLine();
        }
    }
    /*选择统计方式*/
    function SelectWay()
    {
        var nDate = $(this).attr("value");
        switch(nDate)
        {
            case "manNum":
               /*选了人次  饼图折线图都可以显示*/
                $("#AllShowType").removeClass("hide");
                $("#OneShowType").addClass("hide");
                /*在select中选择当前选择的图*/
                if(g_Legend == 0)
                {
                    $("#ShowType").val("pie");
                }
                else
                {
                    $("#ShowType").val("line");
                }
                g_SelectWay = 0;
                break;
            case "Time":
                 /*选了时长 则不能有折线图显示*/
                $("#AllShowType").addClass("hide");
                $("#OneShowType").removeClass("hide");
                g_SelectWay = 1;
                break;
            case "Flow":
               /*选了流量  饼图折线图都可以显示*/
                $("#AllShowType").removeClass("hide");
                $("#OneShowType").addClass("hide");
                /*在select中选择当前选择的图*/
                if(g_Legend == 0)
                {
                    $("#ShowType").val("pie");
                }
                else
                {
                    $("#ShowType").val("line");
                }
                g_SelectWay = 2;
                break;
        }
        if(g_Legend == 0)
        {
            initPie();
        }
        else
        {
            initLine();
        }
    }
    function initGrid()
    {
       var opt = {
            colNames: getRcText ("WELCOME_HEAD"),
            showHeader: true,
            search:true,
            pageSize:5,
            /*select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [
                {name: "APPGroupName", datatype: "String"},
                {name: "APPName", datatype: "String"},
                {name:"UserMAC",datatype:"Mac"},
                {name: "value", datatype: "Integer"},
                {name: "TotalTime", datatype: "Integer"},
                {name: "Flow", datatype: "Integer"}
            ]
        };
        $("#WelcomeList").SList ("head", opt);
         var opt1 = {
            colNames: getRcText ("WELCOME_HEAD3"),
            showHeader: true,
            search:true,
            pageSize:5,
            /*select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [
                {name:"APPName",datatype:"String"},
                {name: "FirstTime", datatype: "Integer"},
                {name: "LastTime", datatype: "Integer"}
            ]
        };
        $("#WelcomeList1").SList ("head", opt1);
        var opt2 = {
            colNames: getRcText ("WELCOME_HEAD2"),
            showHeader: true,
            search:true,
            pageSize:5,
            /*select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [
                {name:"UserMAC",datatype:"Mac"},
                {name: "FirstTime", datatype: "Integer"},
                {name: "LastTime", datatype: "Integer"}
            ]
        };
        $("#WelcomeList2").SList ("head", opt2);

        var opt3 = {
            colNames: getRcText ("WELCOME_HEAD3"),
            showHeader: true,
            search:true,
            pageSize:5,
            /*select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [
                {name: "APPName", datatype: "String"},
                {name:"UserMAC",datatype:"Mac"},
                {name: "value", datatype: "Integer"},
                {name: "TotalTime", datatype: "Integer"},
                {name: "Flow", datatype: "Integer"}
            ]
        };
        $("#WelcomeList3").SList ("head", opt3);


    }

      /*有输入框的下拉框的事件处理*/
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
       searchClickAll:function(e){
            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text("全部");
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});

            /*显示全部的app类型*/
            $("#AllSelecttype").removeClass("hide");
            $("#OneSelecttype").addClass("hide");
            /*选择了全部，不是输入MAC则 如果选择了折线图不能时长  如果没有选择折线图则全部显示选择方式*/
           if(g_Legend == 0)
           {
               $("#PersonSelectWay").addClass("hide");
               $("#TimeSelectWay").addClass("hide");
               $("#AllSelectWay").removeClass("hide");
               $("#FlowSelectWay").addClass("hide");
               /*判断当前选择的是那种方式*/
               switch(g_SelectWay)
               {
                   case 0:
                   {
                       $("#SelectWay").val("manNum");
                       break;
                   }
                   case 1:
                   {
                       $("#SelectWay").val("Time");
                       break;
                   }
                   case 2:
                   {
                       $("#SelectWay").val("Flow");
                       break;
                   }
               }
           }
           else{
               $("#PersonSelectWay").removeClass("hide");
               $("#TimeSelectWay").addClass("hide");
               $("#AllSelectWay").addClass("hide");
               $("#FlowSelectWay").addClass("hide");
               /*不取时长 如果当前选择的是时长则变为人次*/
               if(g_SelectWay == 1)
               {
                   g_SelectWay = 0;
               }
               switch(g_SelectWay)
               {
                   case 0:
                   {
                       $("#SelectWay1").val("manNum");
                       break;
                   }
                   case 2:
                   {
                       $("#SelectWay1").val("Flow");
                       break;
                   }
               }
           }

            /*清除输入的应用和MAC*/
            document.getElementById("MACinput").value="用户MAC";
            document.getElementById("Appinput").value="访问应用";
            /*显示饼图  折线图两个按钮 如果当前显示的是时长则不能选择折线图  否则都显示*/
           if(g_SelectWay == 1)
           {
               $("#AllShowType").addClass("hide");
               $("#OneShowType").removeClass("hide");
           }
           else
           {
               $("#AllShowType").removeClass("hide");
               $("#OneShowType").addClass("hide");
           }
            /*取消APP和MAC显示的红框*/
            $("#MACinput").removeClass("border-red");
            $("#Appinput").removeClass("border-red");
            g_sInputMac  = "";
            g_sInputApp = "";
            if(g_Legend == 0)
            {
                initPie();
            }
            else
            {
                initLine();
            }
        },
        searchClickMAC:function(e){
            /*取消URL显示的红框*/
            $("#Appinput").removeClass("border-red");
            /*清除输入的应用*/
            document.getElementById("Appinput").value="访问应用";
            /*判断MAC地址的合法性 如果不合法则不收回下拉框*/
            var MacValue = $("#MACinput").val();
            if((!macFormCheck(MacValue)))
            {
                $("#MACinput").addClass("border-red");
                return;
            }
            else
            {
                $("#MACinput").removeClass("border-red");
            }

            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text($("#MACinput").val());
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});

             /*显示全部的APP类型*/
            $("#AllSelecttype").removeClass("hide");
            $("#OneSelecttype").addClass("hide");
            /*选择了输入MAC则不用统计人次，只统计时长和流量*/
            /*如果当前统计的是人次 则要换成统计时长*/
            if(g_SelectWay == 0)
            {
                g_SelectWay = 1;
            }
            $("#PersonSelectWay").addClass("hide");
            $("#TimeSelectWay").removeClass("hide");
            $("#AllSelectWay").addClass("hide");
            $("#FlowSelectWay").addClass("hide");

            /*如果当前选择的是时长则不能选择折线图*/
            if(g_SelectWay == 1)
            {
                $("#SelectWay2").val("Time");
                g_Legend = 0
                /*当前显示的是时长则选择的折线图不显示*/
                $("#AllShowType").addClass("hide");
                $("#OneShowType").removeClass("hide");
                /*显示饼图*/
                $("#drawpie").removeClass("hide");
                $("#drowline").addClass("hide");
            }
            else
            {
                /*如果当前选择的是流量 则要判断当前选择的图是哪个然后发ajax*/

                $("#AllShowType").removeClass("hide");
                $("#OneShowType").addClass("hide");
                switch(g_Legend)
                {
                    case 0:
                    {
                        $("#SelectWay2").val("Flow");
                        $("#ShowType").val("pie");
                        break;
                    }
                    case 1:
                    {
                        $("#PersonSelectWay").addClass("hide");
                        $("#TimeSelectWay").addClass("hide");
                        $("#AllSelectWay").addClass("hide");
                        $("#FlowSelectWay").removeClass("hide");  /*如果当前显示的是折线图 则只能选择流量*/
                        $("#ShowType").val("line");
                        break;
                    }

                }
            }

            g_sInputMac = MacValue;
            g_sInputApp = "";
             if(g_Legend == 0)
            {
                initPie();
            }
            else
            {
                initLine();
            }

        },
        searchClickAPP:function(e){

             /*取消MAC地址显示的红框*/
            $("#MACinput").removeClass("border-red");
            /*清除输入的MAC*/
            document.getElementById("MACinput").value="用户MAC";
            /*如果输入的网址是空，则提示 并不收回下拉框*/
            var AppValue = $("#Appinput").val();
            if(AppValue == ""||AppValue == "访问应用")
            {
                $("#Appinput").addClass("border-red");
                return;
            }
            else
            {
                $("#Appinput").removeClass("border-red");
            }

            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text($("#Appinput").val());
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});

             /*选择了app则不用再选择类型*/
            $("#AllSelecttype").addClass("hide");
            $("#OneSelecttype").removeClass("hide");
            /*选择了输入app，不是输入MAC则统计人次和流量*/
            $("#PersonSelectWay").removeClass("hide");
            $("#TimeSelectWay").addClass("hide");
            $("#AllSelectWay").addClass("hide");
            $("#FlowSelectWay").addClass("hide");
            /*如果当前的统计方式是时长则转为人次*/
            if(g_SelectWay == 1)
            {
                g_SelectWay = 0;
            }
            /*显示饼图  折线图两个按钮*/
            $("#AllShowType").removeClass("hide");
            $("#OneShowType").addClass("hide");

            g_sInputMac = "";
            g_sInputApp = AppValue;
             if(g_Legend == 0)
            {
                initPie();
            }
            else
            {
                initLine();
            }

        },
        timeClick: function (e) {
            $("#probe_timechoice").addClass("hide");
            //
            //$(dealEvent.scope).trigger({type:"probechange.probe", data:dealEvent.nowState});
            //
        },
        dateChange: function (e) {
             dealEvent.nowState[dealEvent.currentid] = 4;///

            var orange = $(this,dealEvent.scope).daterange("getRangeData");
            $(".current-state", dealEvent.scope).text(orange.startData + '-' +orange.endData);
            var  sinputTime = orange.startData + '-' +orange.endData
            document.getElementById("daterange").value=sinputTime;
            $(".choice-show", dealEvent.scope).removeClass("height-change");

            StartTime = new Date(orange.startData)-0;////
            EndTime = new Date(orange.endData)-0;/////
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid],startTime:StartTime,endTime:EndTime});////

        }
    };
    /*function otherTime()
    {
        var value = 4;
        SelectTime(value);
    }*/
    function ClickInput()
    {
        document.getElementById("MACinput").value="";
        document.getElementById("Appinput").value="访问应用";
    }
    function ClickURLInput()
    {
        document.getElementById("MACinput").value="用户MAC";
        document.getElementById("Appinput").value="";
    }
    function initForm()
    {
         /*有输入框的下拉框事件*/
        $(".choice-head").click(dealEvent.inputClick);
        $(".choice-show li").click(dealEvent.liOnClick);
        $("#body_over").click(dealEvent.blackClick);
        $("#daterange").on("inputchange",dealEvent.dateChange);

        /*选择以饼图显示还是以折线图显示*/
        $("#ShowType").on("change",SelectShowWay);

         /*选择点击的是全部或输入MAC或输入应用*/
        $("#all").click(dealEvent.searchClickAll);
        $("#UserMAC").click(dealEvent.searchClickMAC);
        $("#App").click(dealEvent.searchClickAPP);
        /*点击MAC地址和App输入框的事件 目的是取消显示在框中的汉字*/
        $("#MACinput").on("click",ClickInput);
        $("#Appinput").on("click",ClickURLInput);

        /*选择显示的周期*/
        $("#selectTime").on("probechange.probe",function(e, param){
             var value = param.value;
            SelectTime(value);
        });
        /*选择App类型*/
        $("#SelectType").on("change",SelectAppType);

        /*选择人次或时长或流量*/
        $("#SelectWay").on("change",SelectWay);
        $("#SelectWay1").on("change",SelectWay);
        $("#SelectWay2").on("change",SelectWay);




    }
    function initData()
    {
        initPie();
    }
    function onAjaxErr()
    {
    }
    function _init()
    {

        initForm();
        initGrid();
        initData();


    };

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","DateRange","SingleSelect","DateTime"],
        "utils":["Base","Request"]
    });
})( jQuery );

