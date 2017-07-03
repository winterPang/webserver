;(function ($) {
    var MODULE_BASE = "b_wips";
    var MODULE_NAME = MODULE_BASE + ".dpi_ipv4";
    var  g_sn = FrameInfo.ACSN;
    var g_aUserUp,g_aUserDown,g_jForm;

    /*定义全局变量来标识数据是否已经返回 0没返回 1返回*/
    var g_returnFlow = 0;
    var g_returnApp = 0;
    var g_returnurl = 0;
    var g_returnChart = 0;

    var g_returnTime = 0;
    var g_returnWay = 0;
    var g_returnMAC = 0;

    /*定义全局变量来标识当前的统计时间的方式是一周还是一天 0表示当前一天 1表示当前是一周*/
    var g_bPieTimeFlag = 0;
    /*定义全局变量来标识当前的统计方式是流量还是人次 0表示人次 1表示流量*/
    var g_bPieWayFlag = 0;
    /*定义全局变量来标识当前是否有MAC地址在输入框中 0表示没有 1表示有*/
    var g_bMACFlag = 0;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("dpi_monitor_rc", sRcName);
    }
    //获取时间函数
    function getTheDate(str1,str2)
    {
        if(str1=="one")
        {
            var nDATA = 24
            var nHour = 3600*1000
            var aOptTime = []
            var tNow = new Date();
            for(var i=0;i<nDATA;i++)
            {
                aOptTime[i] = (tNow - nHour*(nDATA-i-1))
            }
            if(str2=="end")
            {
                return aOptTime[nDATA-1]
            }
            if(str2 =="Start")
            {
                return aOptTime[0];
            }
        }
        if(str1=="month")
        {
            var nDATA = 30;
            var aHour = 24*3600*1000;
            var aOptTime = [];
            var tNow = new Date();
            for(var i=0;i<nDATA;i++)
            {
                aOptTime[i] = (tNow - aHour*(nDATA-i-1))
            }
            if(str2=="end")
            {
                return aOptTime[nDATA-1];
            }
            if(str2 =="Start")
            {
                return aOptTime[0];
            }
        }
        if(str1=="year")
        {
            var nDATA = 365;
            var aHour = 24*3600*1000;
            var aOptTime = [];
            var tNow = new Date();
            for(var i=0;i<nDATA;i++)
            {
                aOptTime[i] = (tNow - aHour*(nDATA-i-1))
            }
            if(str2=="end")
            {
                return aOptTime[nDATA-1];
            }
            if(str2 =="Start")
            {
                return aOptTime[0];
            }
        }
        if(str1=="aweek")
        {
            var nDATA = 7;
            var aHour = 24*3600*1000;
            var aOptTime = [];
            var tNow = new Date();
            for(var i=0;i<nDATA;i++)
            {
                aOptTime[i] = (tNow - aHour*(nDATA-i-1))
            }
            if(str2=="end")
            {
                return aOptTime[nDATA-1];
            }
            if(str2=="Start")
            {
                return aOptTime[0];
            }
        }
    }
    function addzero(num)
    {
        var str;
        str =  num<10 ? ("0" + num): num;
        return str;
    }


    //流量饼图option、
    function TotalFlowPie(aUserUp,aUserDown)
    {
        var nFlowUpNum=0,nFlowDownNum= 0,nFlowNum = 0,nDropFlowNum = 0;
        var sFlowUpFlag,sFlowDownFlag,sFlowNumFlag,sFlowDropFlag;
        var nDropUpFlowNum=0,nDropDownFlowNum=0;
        var nKb = 1024,nMb = nKb*1024,nGb = nMb*1024,nTb = nGb*1024;
        nFlowUpNum = aUserUp.nFlowUpNum;
        nFlowDownNum = aUserDown.nFlowDownNum;
        nDropDownFlowNum = aUserDown.nDropDownFlowNum;
        nDropUpFlowNum = aUserUp.nDropUpFlowNum;
        nFlowNum=  Number(nFlowUpNum)+ Number(nFlowDownNum);
        nDropFlowNum=nDropUpFlowNum+nDropDownFlowNum;
        var nFlowUpPie = nFlowUpNum,nFlowDownPie = nFlowDownNum, nFlowDroPie = nDropFlowNum;
         /*饼图上行流量单位转换*/
        if(0 <= nFlowUpNum && nFlowUpNum< nMb)
        {
            nFlowUpNum = (nFlowUpNum/nKb).toFixed(2);
            sFlowUpFlag = "kb";
        }

        if(nMb<=nFlowUpNum && nFlowUpNum < nGb)
        {
            nFlowUpNum = (nFlowUpNum/nMb).toFixed(2);
            sFlowUpFlag = "mb";
        }

        if(nGb<= nFlowUpNum && nFlowUpNum < nTb )
        {
            nFlowUpNum = (nFlowUpNum/nGb).toFixed(2);
            sFlowUpFlag = "gb";
        }

        if(nTb<= nFlowUpNum)
        {
            nFlowUpNum = (nFlowUpNum/nTb).toFixed(2);
            sFlowUpFlag = "tb";
        }
        /*饼图下行流量单位转换*/
        if(0 <= nFlowDownNum && nFlowDownNum < nMb)
        {
            nFlowDownNum = (nFlowDownNum/nKb).toFixed(2);
            sFlowDownFlag = "kb";
        }
        if(nMb <= nFlowDownNum && nFlowDownNum < nGb)
        {
            nFlowDownNum = (nFlowDownNum/nMb).toFixed(2);
            sFlowDownFlag = "mb";
        }
        if(nGb <= nFlowDownNum && nFlowDownNum < nTb )
        {
            nFlowDownNum = (nFlowDownNum/nGb).toFixed(2);
            sFlowDownFlag = "gb";
        }
        if(nTb <= nFlowDownNum )
        {
            nFlowDownNum = (nFlowDownNum/nTb).toFixed(2);
            sFlowDownFlag = "tb";
        }
        /*饼图总流量单位转换*/
        if(0 <= nFlowNum && nFlowNum < nMb)
        {
            nFlowNum= (nFlowNum/nKb).toFixed(2);
            sFlowNumFlag = "kb";
        }
        if(nMb <= nFlowNum && nFlowNum < nGb)
        {
            nFlowNum= (nFlowNum/nMb).toFixed(2);
            sFlowNumFlag = "mb";
        }
        if(nGb <= nFlowNum && nFlowNum < nTb)
        {
            nFlowNum= (nFlowNum/nGb).toFixed(2);
            sFlowNumFlag = "gb";
        }
        if(nTb <= nFlowNum)
        {
            nFlowNum= (nFlowNum/nTb).toFixed(2);
            sFlowNumFlag = "tb";
        }
        /*饼图丢弃流量单位转换*/
        if(0 <= nDropFlowNum && nDropFlowNum< nMb)
        {

            nDropFlowNum = (nDropFlowNum/nKb).toFixed(2);
            sFlowDropFlag = "kb";
        }
        if(nMb <= nDropFlowNum && nDropFlowNum < nGb)
        {

            nDropFlowNum = (nDropFlowNum/nMb).toFixed(2);
            sFlowDropFlag = "mb";
        }
        if(nGb <= nDropFlowNum && nDropFlowNum < nTb)
        {
            nDropFlowNum = (nDropFlowNum/nMb).toFixed(2);
            sFlowDropFlag = "mb";
        }
        if(nTb <= nDropFlowNum)
        {
            nDropFlowNum = (nDropFlowNum/nTb).toFixed(2);
            sFlowDropFlag = "tb";
        }

        if(nFlowUpPie==0 && nFlowDownPie==0 && nFlowDroPie==0)
        {
            var Upoption = {
                calculable : false,
                height:250,
                title:{
                    text:"流量",
                    x:20,
                    textStyle:{
                        fontSize:13,
                        color: "gray"
                    }
                },
                tooltip : {
                    show:false
                },
                series : [
                    {
                        type: 'pie',
                        radius : 80,
                        center: ['50%', '55%'],
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
            var oTheme = {color: ['#F5F5F5']};
        }
        else{
            var aValue=[
                {value:nFlowUpPie, name:getRcText("UPNAME")},
                {value:nFlowDroPie, name:getRcText("DROPFLOW")},
                {value:nFlowDownPie,name:getRcText("DOWNNAME")},
            ]
            var labelFromatter = {
                normal : {
                    label : {
                        textStyle: {
                            color:"gray"
                        }
                    }
                }
            };
            $.each(aValue, function(i, oTemp){
                $.extend(oTemp,{itemStyle:labelFromatter});
            });
            var Upoption = {
                height:250,
                title:{
                    text:"流量",
                    x:20,
                    textStyle:{
                        fontSize:13,
                        color: "gray"
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} {b}: {d}%"
                },
                calculable : false,
                series : [
                    {
                        type:'pie',
                        radius : 80,
                        center: ['50%', '55%'],
                        data:aValue
                    }
                ]
            };
            var oTheme={
                color: ['#0096d6','#31A9DC','#7BC7E7']
            };
        }

        $("#totalflowup").echart("init", Upoption,oTheme);
        if(sFlowUpFlag == "kb")
        {
            $("#upflow").html(nFlowUpNum+" KB");
        }
        if(sFlowUpFlag == "mb")
        {
            $("#upflow").html(nFlowUpNum+" MB");
        }
        if(sFlowUpFlag == "gb")
        {
            $("#upflow").html(nFlowUpNum+" GB");
        }
        if(sFlowUpFlag == "tb")
        {
            $("#upflow").html(nFlowUpNum+" TB");
        }


        if(sFlowDownFlag == "kb")
        {
            $("#downflow").html(nFlowDownNum+" KB");
        }
        if(sFlowDownFlag == "mb")
        {
            $("#downflow").html(nFlowDownNum+" MB");
        }
        if(sFlowDownFlag == "gb")
        {
            $("#downflow").html(nFlowDownNum+" GB");
        }

        if(sFlowDownFlag == "tb")
        {
            $("#downflow").html(nFlowDownNum+" TB");
        }

        if(sFlowDropFlag == "kb")
        {
            $("#dropFlow").html(nDropFlowNum+" KB");
        }
        if(sFlowDropFlag == "mb")
        {
            $("#dropFlow").html(nDropFlowNum+" MB");
        }
        if(sFlowDropFlag == "gb")
        {
            $("#dropFlow").html(nDropFlowNum+" GB");
        }

        if(sFlowDropFlag == "tb")
        {
            $("#dropFlow").html(nDropFlowNum+" tB");
        }

        if(sFlowNumFlag == "kb")
        {
            $("#TotalFlow").html(nFlowNum+" KB");
        }
        if(sFlowNumFlag == "mb")
        {
            $("#TotalFlow").html(nFlowNum+" MB");
        }
        if(sFlowNumFlag == "gb")
        {
            $("#TotalFlow").html(nFlowNum+" GB");
        }
        if(sFlowNumFlag == "tb")
        {
            $("#TotalFlow").html(nFlowNum+" TB");
        }


    }
    //用户流量折线图
    function initUserFlowChart(sStartTime,sEnd)
    {
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart =  getTheDate("one","Start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        var tNow = new Date();
        var nHour = tNow.getHours();
        $.ajax({
            url: MyConfig.path+"/ant/dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'GetFlow',
                requestType:"getTotalFlowChart",
                Time:nHour,
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                },
                Return: [
                    "FirstTime",
                    "LastTime",
                    "DropPktBytes",
                    "Pkt",
                    "PktBytes",
                    "DropPkt",
                ]

            },
            success: function (Data)
            {
                g_returnChart = 1;
                var OneDayHour = 24;
                var nTime = (nEndTime-nStartTime)/3600;
                var message = Data.message;
                var upFlow = message.upFlow;
                var downFlow = message.downFlow;
                var dropFlow = message.dropFlow;
                var aTime = message.time;
                /*画一天的折线图*/
                if(nTime<=OneDayHour)
                {
                    for(var i=0;i<aTime.length;i++)
                    {
                        aTime[i] = new Date(aTime[i]);
                        aTime[i] = (aTime[i].toTimeString()).slice(0,5);
                    }
                    var sTarffic = getRcText("TrafficMb");
                    var sTime = getRcText("SHOWTIMEHOUR")
                    UserFlow_chart(upFlow,downFlow,dropFlow,aTime,sTarffic,sTime,1);
                }
                /*画一周 一月 一年 及选择的其他数据的折线图*/
                if(nTime>OneDayHour)
                {
                    for(var i=0;i<aTime.length;i++)
                    {
                        aTime[i] = new Date(aTime[i]);
                        aTime[i] = (aTime[i].toLocaleDateString()).slice(5);
                    }
                    var sTarffic = getRcText("TrafficMb");
                    var sTime = getRcText("SHOWTIMEWEEK");
                    var nDATA = (nTime/OneDayHour)+1;
                    UserFlow_chart(upFlow,downFlow,dropFlow,aTime,sTarffic,sTime,nDATA);
                }
            },
            error: function(err){
                // alert(err);
            }
        });
    }
    //用户数量折线图的数据处理
    function initUserNumber_Chart(sStartTime,sEnd)
    {
        var sNowStart =  getTheDate("one","Start");
        var sNowEndTime =  getTheDate("one","end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        var tNow = new Date();
        var nHour = tNow.getHours();
        $.ajax({
            url: MyConfig.path+"/ant/dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'UserNumber',
                Time:nHour,
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,

                },
                Return: [
                    "FirstTime",
                    "LastTime",
                    "UserMAC"
                ]

            },
            success: function (data)
            {
                var message = data.message;
                var aTime = message.aTime;
                var nDATA = 24;
                var ShowTime = ((nEndTime - nStartTime)/nDATA/3600);
                if(ShowTime<=1)
                {
                    for(var i=0;i<aTime.length;i++)
                    {
                        aTime[i] = new Date(aTime[i]);
                        aTime[i] = (aTime[i].toTimeString()).slice(0,5);
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
                var aUserNumData = message.aUserNumData;
                initUserChange(aTime,aUserNumData,ShowTime);
            },
            error: onAjaxErr
        });

    }

    //流量饼图的数据处理
    function initUser(sStartTime,sEnd)
    {
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart =  getTheDate("one","Start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;

        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        $.ajax({
            url: MyConfig.path+"/ant/dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'GetFlow',
                requestType:"getTotalFlow",
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                },
                Return: [
                    "DropPktBytes",
                    "Pkt",
                    "PktBytes",
                    "DropPkt",
                ]

            },
            success: function (Data)
            {
                //g_returnFlow = 1;
                g_returnTime = 1;
                var message = Data.message;
                TotalFlowPie(message.upflow,message.downflow);
            },
            error: function(err){
                alert(err);
            }
        });
    }

    /*流量饼图的输入MAC地址的处理*/
    function MacSelectFlow(sStartTime,sEnd)
    {
        var MacValue = $("#filter_PieDateValue").val();
        /*防止刷新时没有填MAC而点击了对勾 导致刷新不正常*/
        if(MacValue == "")
        {
            g_bMACFlag = 0;
        }
        if(!macFormCheck(MacValue))
        {
            return;
        }
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart =  getTheDate("one","Start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;

        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        $.ajax({
            url: MyConfig.path+"/ant/dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'GetFlow',
                requestType:"getFlowMAC",
                Macvalue:MacValue,
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,

                },
                Return: [
                    "DropPktBytes",
                    "Pkt",
                    "PktBytes",
                    "DropPkt",
                    "UserMAC",
                ]

            },
            success: function (Data)
            {
                //g_returnFlow = 1;
                g_returnTime = 1;
                g_returnMAC = 1;
                g_returnWay = 1;

                /*画图*/
                var message = Data.message;
                var upFlow_pie = message.upflow;
                var downFlow_pie = message.downflow;
                TotalFlowPie(upFlow_pie,downFlow_pie);
            },
            error: function(err){
                alert(err);
            }
        });
    }


    //用户流量折线图
    function UserFlow_chart(upflow,downflow,dropflow,aTime,sTarffic,sTime,CountDay)
    {

        /*大于30出现滚动条*/
        if(CountDay>30)
        {
            var option = {
                //width:"100%",
                height:300,
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
                    data:["上行流量","下行流量","丢弃流量"],
                    textStyle:{
                        color:"gray"
                    }
                },

                dataZoom:{
                        show: true,
                        realtime: true,
                        start: 60,
                        end: 80,
                        height:15
                    },
                grid: {
                    x:70,
                    y:80,
                    x2:30,
                    y2:70, //45
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:false,
                        name:sTime,//getRcText("SHOWTIME"),
                        nameTextStyle:{color:"gray"},
                        axisLabel: {
                            rotate:45
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#E6E6FA', width: 1}
                        },
                        axisTick :{
                            show:false
                        },
                        data:aTime
                    }
                ],

                yAxis: [
                    {
                        type: 'value',
                        name:sTarffic,//getRcText("Traffic"),
                        nameTextStyle:{color:"gray"},
                        splitLine:false,
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 2}
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#E6E6FA', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: getRcText("UPFLOW"),
                        data: upflow
                    },
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: getRcText("DOWNFLOW"),
                        data: downflow
                    },
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: getRcText("DROPFLOW"),
                        data: dropflow
                    },

                ]

            };
        }
        else
        {
            var option = {
                //width:"100%",
                height:300,
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
                    data:["上行流量","下行流量","丢弃流量"],
                    textStyle:{
                        color:"gray"
                    }

                },
                grid: {
                    x:70,
                    y:80,
                    x2:30,
                    y2:70, //45
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:false,
                        name:sTime,//getRcText("SHOWTIME"),
                        nameTextStyle:{color:"gray"},
                        axisLabel: {
                            rotate:45
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#E6E6FA', width: 1}
                        },
                        axisTick :{
                            show:false
                        },
                        data:aTime
                    }
                ],

                yAxis: [
                    {
                        type: 'value',
                        name:sTarffic,//getRcText("Traffic"),
                        nameTextStyle:{color:"gray"},
                        splitLine:false,
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#47495d', width: 2}
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#E6E6FA', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: getRcText("UPFLOW"),
                        data: upflow
                    },
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: getRcText("DOWNFLOW"),
                        data: downflow
                    },
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: getRcText("DROPFLOW"),
                        data: dropflow
                    },

                ]

            };
        }
        var oTheme = {
            color: ['#0096d6','#31A9DC','#62BCE2'],
            valueAxis:{
                splitLine:{lineStyle:{color:[ '#FFF']}},
                axisLabel:{textStyle: {color: [ '#abbbde']}}
            },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFF']}}
            }
        };
        var oTheme_0 = {
            color: ['#FFFFFF','#FFFFFF'],
            valueAxis:{
                splitLine:{lineStyle:{color:[ '#FFFFFF']}},
                axisLabel:{textStyle: {color: [ '#FFFFFF']}}
            },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFFFFF']}}
            }
        };

        var upFlowFlag = 0,downFlowFlag = 0,dropFlowFlag = 0;
        for(var i=0;i<upflow.length;i++)
        {
            if(upflow[i]!=0)
            {
                upFlowFlag = 1;
            }
        }
        for(var i=0;i<downflow.length;i++)
        {
            if(downflow[i]!=0)
            {
                downFlowFlag = 1;
            }
        }
        for(var i=0;i<dropflow.length;i++)
        {
            if(dropflow[i]!=0)
            {
                dropFlowFlag = 1;
            }
        }
        if(upFlowFlag==0&&downFlowFlag==0&&dropFlowFlag==0)
        {
            $("#UserFlow_chart").echart("init", option, oTheme_0);
        }
        else
        {
            $("#UserFlow_chart").echart("init", option, oTheme);
        }
    }
    //用户数量折线图的option
    function initUserChange(aTime,aData,nDay)
    {
        if(nDay>30)
        {
            var dataZoom=
            {
                show: true,
                realtime: true,
                start: 60,
                end: 80,
                height:15
            }
        }
        else
        {
            var dataZoom={

            }
        }
        var option = {
            height:240,
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
            dataZoom:dataZoom,
            grid: {
                x:60,
                y:20,
                x2:20,
                y2:65,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine:false,
                   /* name:getRcText("SHOWTIMEHOUR"),
                    nameTextStyle:{color:"gray"},*/
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#E6E6FA', width: 1}
                    },
                    axisTick :{
                        show:false
                    },
                    data:aTime
                }
            ],

            yAxis: [
                {
                    type: 'value',
                    name:getRcText("REN"),
                    nameTextStyle:{color:"gray"},
                    splitLine:false,
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#47495d', width: 2}
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#E6E6FA', width: 1}
                    }
                }
            ],
            series: [
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: getRcText("USAGENUM"),
                    data: aData
                },

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
        var oTheme_0 = {
            color: ['#FFFFFF','#FFFFFF'],
            valueAxis:{
                splitLine:{lineStyle:{color:[ '#FFFFFF']}},
                axisLabel:{textStyle: {color: [ '#FFFFFF']}}
            },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFFFFF']}}
            }
        };
        var HaveDateFlag = 0;
        for(var i=0;i<aData.length;i++)
        {
           if(aData[i]!=0)
           {
               HaveDateFlag = 1;
               break;
           }
        }
        if(HaveDateFlag==0)
        {
            $("#userchange").echart("init", option, oTheme_0);
        }
        else{
            $("#userchange").echart("init", option, oTheme);
        }

    }
    //最受欢迎的网站类别饼图的option
    function WecomUrls_pie(aData)
    {
        if(!aData.length)
        {
            var option = {
                calculable : false,
                height:220,
                tooltip : {
                    show:false
                },
                series : [
                    {
                        type: 'pie',
                        radius : ['40%', '70%'],
                        center: ['30%', '55%'],
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
            var oTheme = {color: ['#F5F5F5']};
        }
        else
        {
            var option = {
                height:220,

                tooltip : {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                myLegend:{
                    scope : "#Url_message",
                    width: "46%",
                    height:150,
                    right: "1%",
                    top: 8,
                },
                calculable : false,
                series : [
                    {
                        type:'pie',
                        radius : ['40%', '70%'],
                        center: ['30%', '55%'],
                        itemStyle: {
                            normal: {
                                labelLine:{
                                    show:false
                                },
                                label:
                                {
                                    position:"inner",
                                    formatter: function(a){
                                        return ""
                                    }
                                }
                            }
                        },
                        data: aData
                    }
                ]
            };
            var oTheme={
                color : ['#0195D7','#53B9E7', '#31ADB4', '#69C4C5','#92C888', '#FFBB33','#FF8800','#CC324B','#91B2D2','#D7DDE4']
            };
        }

        $("#Url_pie").echart("init", option,oTheme);
    }
    //最受欢迎的网站数据处理
    function initpie_Url(sStartTime,sEnd)
    {
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart = getTheDate("one","Start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;

        $.ajax({
            url:  MyConfig.path+"/ant/dpi_url",
            dataType: "json",
            type:"post",
            data:{
                Method:"WelComeUrl",
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                   StartTime:nStartTime,
                   EndTime:nEndTime,
                },
                Return: [
                    "UserMAC",
                    "WebSiteName"
                ]

            },
            success: function (data)
            {
                //g_returnurl = 1;
                g_returnTime = 1;
                var aSearchWeb = data.message;
                WecomUrls_pie(aSearchWeb);
            },
            error: onAjaxErr
        });
    }

    //上网人次的折线图的option
    function initWebChange(aTime,aData,nDay)
    {
        if(nDay>30)
        {
            var dataZoom=
            {
                show: true,
                realtime: true,
                start: 60,
                end: 80,
                height:15
            }
        }
        else
        {
            var dataZoom={

            }
        }
        var option = {
            height:240,
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
                }
            },
            dataZoom:dataZoom,
            grid: {
                x: 60,
                y: 20,
                x2:20,
                y2:65,
                borderColor: '#FFF'
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine:{
                        show:false
                    },
                   /* name: getRcText("SHOWTIMEHOUR"),
                    nameTextStyle:{color:"gray"},*/
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#E6E6FA', width: 1}
                    },
                    axisTick :{
                        show:false
                    },
                    data: aTime
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: getRcText("REN"),
                    nameTextStyle:{color:"gray"},
                    splitLine:{
                        show:false
                    },
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
            series: [
                {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    name: getRcText("USAGENUM"),

                    data:aData
                },

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
        var oTheme_0 = {
            color: ['#FFFFFF','#FFFFFF'],
            valueAxis:{
                splitLine:{lineStyle:{color:[ '#FFFFFF']}},
                axisLabel:{textStyle: {color: [ '#FFFFFF']}}
            },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFFFFF']}}
            }
        };
        var HaveDateUrl = 0;
        for(var i=0;i<aData.length;i++)
        {
            if(aData[i]!=0)
            {
                HaveDateUrl = 1;
                break;
            }
        }
        if(HaveDateUrl == 0)
        {
            $("#userchange_url").echart("init", option, oTheme_0);
        }
        else{
            $("#userchange_url").echart("init", option, oTheme);
        }

    }
    //上网人次折线图的数据处理
    function initNum_UrlChart(sStartTime,sEnd)
    {
        var sNowStart =  getTheDate("one","Start");
        var sNowEndTime =  getTheDate("one","end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;

        var tNow = new Date();
        var nHour = tNow.getHours();

        $.ajax({
            url: MyConfig.path+"/ant/dpi_url",
            dataType: "json",
            type:"post",
            data:{
                Method:'NetPlayNum',
                Time: nHour,
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                },
                Return: [
                    "WebSiteName",
                    "FirstTime",
                    "LastTime",
                ]

            },
            success: function (data)
            {
                var message = data.message;
                var nDATA = 24;
                var aTime = message.aTime;
                var ShowTime = ((nEndTime - nStartTime)/nDATA/3600);
                if(ShowTime<=1)
                {
                    for(var i=0;i<aTime.length;i++)
                    {
                        aTime[i] = new Date(aTime[i]);
                        aTime[i] = (aTime[i].toTimeString()).slice(0,5);
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
                var aUserNum_url = message.aUserNum_url;
                initWebChange(aTime,aUserNum_url,ShowTime);

               /* /!*测试问题*!/

                var aUserNum_url=[];
                var aTime = [];
                var aUrl = data.message;
                var nOneHour = 3600*1000;//
                var nDATA = 24;//
                var tNow = new Date();
                var nReqTime =  ((nEndTime - nStartTime)/24/3600);
                if(nReqTime<=1)
                {
                    for(var i=0;i<nDATA;i++)
                    {
                        aTime[i] = tNow - nOneHour*(nDATA-i-1);
                        aUserNum_url[i]=0;
                    }
                    for(var i=0;i<aUrl.length;i++)
                    {
                        var nNumStart = aUrl[i].FirstTime * 1000;//
                        var nNumEnd = aUrl[i].LastTime * 1000;//
                        for(var j=0;j<aTime.length;j++)
                        {
                            //var nTime = Number(aTime[j].slice(0,2));
                            if((aTime[j]>=nNumStart)&&(aTime[j]<=nNumEnd))
                            {
                                aUserNum_url[j]++;
                            }
                        }
                    }
                    for(var i=0;i<aTime.length;i++)
                    {
                        aTime[i] = new Date(aTime[i]);
                        aTime[i] = (aTime[i].toTimeString()).slice(0,5);
                    }
                }
                else
                {
                    var nOneDay= nDATA*3600*1000;//
                    var nyear = new Date().getFullYear();
                    var nmonth = new Date().getMonth();
                    var nday = new Date().getDate();
                    var tNow = new Date(nyear,nmonth,nday);
                    var nDATA = (nTime/nDATA)+1;
                    for(var i=0;i<nDATA;i++)
                    {
                        aTime[i] = tNow - nOneDay*(nDATA-i-1);
                        aUserNum_url[i]=0;
                    }
                    for(var i=0;i<aUrl.length;i++)
                    {
                        /!* var nNumStart = new Date(aUrl[i].FirstTime * 1000).getDate();//
                         var nNumEnd = new Date(aUrl[i].LastTime * 1000).getDate();//!*!/
                        var nNumEnd = aUrl[i].LastTime * 1000
                        for(var j=0;j<aTime.length;j++)
                        {
                            // var iDay = new Date(aTime[j]).getDate();
                            if((aTime[j]>nNumEnd-nOneDay)&&(aTime[j]<=nNumEnd))
                            {
                                aUserNum_url[j]++;
                            }
                        }
                    }
                    for(var i=0;i<aTime.length;i++)
                    {
                        aTime[i] = new Date(aTime[i]);
                        aTime[i] = (aTime[i].toLocaleDateString()).slice(5);
                    }
                }
                initWebChange(aTime,aUserNum_url,nReqTime);*/
            },
            error: onAjaxErr
        });


    }
    //访问应用人次折线图的option
    function initAppChange(aTime,aData,aName,nLenght,nDay)
    {
        var oTheme_app_0 = {
            color: ['#FFFFFFF','#FFFFFFF','#FFFFFFF','#FFFFFFF','#FFFFFFF','#FFFFFFF','#FFFFFFF'],
            valueAxis:{
                splitLine:{lineStyle:{color:[ '#FFFFFFF']}},
                axisLabel:{textStyle: {color: [ '#FFFFFFF']}}
            },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFFFFFF']}}
            }
        };
        var oTheme_app = {
            color: ['#0096d6','#31A9DC','#62BCE2','#7BC7E7','#ACDAED','#C4E3F0','#DDEDF3'],
            valueAxis:{
                splitLine:{lineStyle:{color:[ '#FFF']}},
                axisLabel:{textStyle: {color: [ '#abbbde']}}
            },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFF']}}
            }
        };
        if(nDay>30)
        {
            var dataZoom=
            {
                show: true,
                realtime: true,
                start: 60,
                end: 80,
                height:15
            }
        }
        else
        {
            var dataZoom={

            }
        }
        switch(nLenght)
        {

            case "0":
                var option_app = {
                    height:240,
                    toolbox:{
                        y:'bottom',
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
                        }
                    },
                    dataZoom:dataZoom,
                    grid: {
                        x:60,
                        y: 40,
                        x2:20,
                        borderColor: '#FFF'
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            splitLine:{
                                show:false
                            },
                            name: getRcText("SHOWTIMEHOUR"),
                            nameTextStyle:{color:"gray"},
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E6E6FA', width: 1}
                            },
                            axisTick :{
                                show:false
                            },
                            data: aTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: getRcText("REN"),
                            nameTextStyle:{color:"gray"},
                            splitLine:{
                                show:false,
                            },
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
                    series: [
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: "no App",
                            data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

                        },
                    ]

                };

                $("#change_App").echart("init", option_app, oTheme_app_0);
                break;
            case "1":
                var option_app = {
                    legend: {
                        data:[aName[0].name]
                    },
                    height:240,
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
                        }
                    },
                    dataZoom:dataZoom,
                    grid: {
                        x: 60,
                        y: 40,
                        x2:20,
                        borderColor: '#FFF'
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            splitLine:{
                                show:false
                            },
                           /* name: getRcText("SHOWTIMEHOUR"),
                            nameTextStyle:{color:"gray"},*/
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E6E6FA', width: 1}
                            },
                            axisTick :{
                                show:false
                            },
                            data: aTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: getRcText("REN"),
                            nameTextStyle:{color:"gray"},
                            splitLine:{
                                show:false,
                            },
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
                    series: [
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[0].name,
                            data:aData[0]

                        },
                    ]

                };

                $("#change_App").echart("init", option_app, oTheme_app);
                break;
            case "2":
                var option_app = {
                    height:240,
                    legend: {
                        data:[aName[0].name,aName[1].name]
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
                        }
                    },
                    dataZoom:dataZoom,
                    grid: {
                        x: 60, y: 40, x2:20,
                        borderColor: '#FFF'
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            splitLine:{
                                show:false
                            },
                            /*name: getRcText("SHOWTIMEHOUR"),
                            nameTextStyle:{color:"gray"},*/
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E6E6FA', width: 1}
                            },
                            axisTick :{
                                show:false
                            },
                            data: aTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: getRcText("REN"),
                            nameTextStyle:{color:"gray"},
                            splitLine:{
                                show:false,
                            },
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
                    series: [
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[0].name,
                            data:aData[0]

                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[1].name,
                            data:aData[1]
                        },
                    ]

                };

                $("#change_App").echart("init", option_app, oTheme_app);
                break;
            case "3":
                var option_app = {
                    height:240,
                    legend: {
                        data:[aName[0].name,aName[1].name,aName[2].name]

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
                        }
                    },
                    dataZoom:dataZoom,
                    grid: {
                        x: 60, y: 40, x2:20,
                        borderColor: '#FFF'
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            splitLine:{
                                show:false
                            },
                           /* name: getRcText("SHOWTIMEHOUR"),
                            nameTextStyle:{color:"gray"},*/
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E6E6FA', width: 1}
                            },
                            axisTick :{
                                show:false
                            },
                            data: aTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: getRcText("REN"),
                            nameTextStyle:{color:"gray"},
                            splitLine:{
                                show:false,
                            },
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
                    series: [
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[0].name,
                            data:aData[0]

                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[1].name,
                            data:aData[1]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[2].name,
                            data:aData[2]
                        },
                    ]

                };

                $("#change_App").echart("init", option_app, oTheme_app);
                break;
            case "4":
                var option_app = {
                    height:240,
                    legend: {
                        data:[aName[0].name,aName[1].name,aName[2].name,aName[3].name]
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
                        }
                    },
                    dataZoom:dataZoom,
                    grid: {
                        x: 60,
                        y: 40,
                        x2:20,
                        borderColor: '#FFF'
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            splitLine:{
                                show:false
                            },
                           /* name: getRcText("SHOWTIMEHOUR"),
                            nameTextStyle:{color:"gray"},*/
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E6E6FA', width: 1}
                            },
                            axisTick :{
                                show:false
                            },
                            data: aTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: getRcText("REN"),
                            nameTextStyle:{color:"gray"},
                            splitLine:{
                                show:false,
                            },
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
                    series: [
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[0].name,
                            data:aData[0]

                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[1].name,
                            data:aData[1]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[2].name,
                            data:aData[2]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[3].name,
                            data:aData[3]
                        },
                    ]

                };

                $("#change_App").echart("init", option_app, oTheme_app);
                break;
            case "5":
                var option_app = {
                    height:240,
                    legend: {
                        data:[aName[0].name,aName[1].name,aName[2].name,aName[3].name,aName[4].name]
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
                        }
                    },
                    dataZoom:dataZoom,
                    grid: {
                        x: 60, y: 40, x2:20,
                        borderColor: '#FFF'
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            splitLine:{
                                show:false
                            },
                           /* name: getRcText("SHOWTIMEHOUR"),
                            nameTextStyle:{color:"gray"},*/
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E6E6FA', width: 1}
                            },
                            axisTick :{
                                show:false
                            },
                            data: aTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: getRcText("REN"),
                            nameTextStyle:{color:"gray"},
                            splitLine:{
                                show:false,
                            },
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
                    series: [
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[0].name,
                            data:aData[0]

                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[1].name,
                            data:aData[1]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[2].name,
                            data:aData[2]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[3].name,
                            data:aData[3]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[4].name,
                            data:aData[4]
                        },
                    ]

                };

                $("#change_App").echart("init", option_app, oTheme_app);
                break;
        }
    }
    //最受欢迎的应用类别饼图option
    function initWecomPie_App(aData)
    {
        if(!aData.length)
        {
            var option = {
                calculable : false,
                height:220,
                tooltip : {
                    show:false
                },
                series : [
                    {
                        type: 'pie',
                        radius : ['40%', '70%'],
                        center: ['25%', '55%'],
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
            var oTheme = {color: ['#F5F5F5']};
        }
        else{
            var option = {
                height:220,

                tooltip : {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                myLegend:{
                    scope : "#App_message",
                    width: "50%",
                    height:150,
                    right: "1%",
                    top: 5,
                },
                calculable : false,
                series : [
                    {
                        name:'App flow anaylsis',
                        type:'pie',
                        radius : ['40%', '70%'],
                        center: ['25%', '55%'],
                        itemStyle: {
                            normal: {
                                labelLine:{
                                    show:false
                                },
                                label:
                                {
                                    position:"inner",
                                    formatter: function(a){
                                        return"";
                                    }
                                }
                            },
                            emphasis : {
                                label : {
                                    formatter : "{b}\n{d}%"
                                }
                            }
                        },
                        data:aData
                    }
                ]
            };
            var oTheme={
                color : ['#0195D7','#53B9E7', '#31ADB4', '#69C4C5','#92C888', '#FFBB33','#FF8800','#CC324B']

            };
        }

        $("#App_pie").echart("init", option,oTheme);
    }

    //最受欢迎的应用流量统计方法
    function initFlowPie_App(sStartTime,sEnd)
    {
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart = getTheDate("one","Start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        $.ajax({
            url: MyConfig.path+"/ant/dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'WelComeAppFlowWay',
                Param: {

                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                },
                Return: [
                    "UserMAC",
                    "APPName",
                    "PktBytes"
                ]

            },
            success: function (data)
            {

                //g_returnApp = 1;
                g_returnTime = 1;
                g_returnWay = 1;
                g_returnMAC = 1;
                var aSearchApp = data.message;
                initWecomPie_App(aSearchApp);
            },
            error: onAjaxErr
        });

    }
    //最受欢迎的应用饼图的数据处理
    function initPie_App(sStartTime,sEnd)
    {
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart = getTheDate("one","Start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        $.ajax({
            url: MyConfig.path+"/ant/dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'WelComeApp',
                Param: {

                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                },
                Return: [
                    "UserMAC",
                    "APPName",
                ]

            },
            success: function (data)
            {
              // g_returnApp = 1;
                g_returnTime = 1;
                g_returnWay = 1;
                var aSearchApp = data.message;
                initWecomPie_App(aSearchApp);

            },
            error: onAjaxErr
        });

    }


    //应用类别流量折线图的option
    function AppTypeChange(aTime,aData,aName,nLenght,nDay)
    {
        var oTheme_app = {
            color: ['#0096d6','#31A9DC','#62BCE2','#7BC7E7','#ACDAED','#C4E3F0','#DDEDF3'],
            //color: ["#7FCAEA","#99FF33","#F8A4AE","#239FD7","#7FCAEA"],
            valueAxis:{
                splitLine:{lineStyle:{color:[ '#FFF']}},
                axisLabel:{textStyle: {color: [ '#abbbde']}}
            },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFF']}}
            }
        };
        var oTheme_app_0 = {
            color: ['#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF'],
            valueAxis:{
                splitLine:{lineStyle:{color:[ '#FFFFFF']}},
                axisLabel:{textStyle: {color: [ '#FFFFFF']}}
            },
            categoryAxis:{
                splitLine:{lineStyle:{color:['#FFFFFF']}}
            }
        };
        if(nDay>30)
        {
            var dataZoom=
            {
                show: true,
                realtime: true,
                start: 60,
                end: 80,
                height:15
            }
        }
        else
        {
            var dataZoom={
               /* show: false,
                realtime: true,
                start: 60,
                end: 80,
                height:15*/
            }
        }
        switch(nLenght)
        {
            case "0":
                var option_app = {
                    height:240,
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
                        }
                    },
                    dataZoom:dataZoom,
                    grid: {
                        x: 60, y: 40,x2:20,
                        borderColor: '#FFF'
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            splitLine:false,
                           /* name:getRcText("SHOWTIMEHOUR"),
                            nameTextStyle:{color:"gray"},*/
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E6E6FA', width: 1}
                            },
                            axisTick :{
                                show:false
                            },
                            data:aTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name:getRcText("TrafficMb"),
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
                    series: [
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: "no Apptype",
                            data:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                        },
                    ]

                };
                $("#AppType_change").echart("init", option_app, oTheme_app_0);
                break;
            case "1":
                var option_app = {
                    height:240,
                    legend: {
                        data:[aName[0].name]
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
                        }
                    },
                    dataZoom:dataZoom,
                    grid: {
                        x: 60,
                        x2:20,
                        y: 40,
                        borderColor: '#FFF'
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            splitLine:{
                                show:false
                            },
                            /*name:getRcText("SHOWTIMEHOUR"),
                            nameTextStyle:{color:"gray"},*/
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E6E6FA', width: 1}
                            },
                            axisTick :{
                                show:false
                            },
                            data:aTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name:getRcText("TrafficMb"),
                            nameTextStyle:{color:"gray"},
                            splitLine:{
                                show:false
                            },
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
                    series: [
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[0].name,
                            data:aData[0]
                        },
                    ]
                };
                $("#AppType_change").echart("init", option_app, oTheme_app);
                break;
            case "2":
                var option_app = {
                    height:240,
                    legend: {
                        data:[aName[0].name,aName[1].name]
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
                        }
                    },
                    dataZoom:dataZoom,
                    grid: {
                        x: 60, y: 40,x2:20,
                        borderColor: '#FFF'
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            splitLine:false,
                           /* name:getRcText("SHOWTIMEHOUR"),
                            nameTextStyle:{color:"gray"},*/
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E6E6FA', width: 1}
                            },
                            axisTick :{
                                show:false
                            },
                            data:aTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name:getRcText("TrafficMb"),
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
                    series: [
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[0].name,
                            data:aData[0]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[1].name,
                            data :aData[1]
                        },
                    ]

                };
                $("#AppType_change").echart("init", option_app, oTheme_app);
                break;
            case "3":
                var option_app = {
                    height:240,
                    legend: {
                        data:[aName[0].name,aName[1].name,aName[2].name]
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
                        }
                    },
                    dataZoom:dataZoom,
                    grid: {
                        x: 60, y: 40,x2:20,
                        borderColor: '#FFF'
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            splitLine:false,
                           /* name:getRcText("SHOWTIMEHOUR"),
                            nameTextStyle:{color:"gray"},*/
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E6E6FA', width: 1}
                            },
                            axisTick :{
                                show:false
                            },
                            data:aTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name:getRcText("TrafficMb"),
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
                    series: [
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[0].name,
                            data:aData[0]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[1].name,
                            data :aData[1]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[2].name,
                            data:aData[2]
                        },
                    ]
                };
                $("#AppType_change").echart("init", option_app, oTheme_app);
                break;
            case "4":
                var option_app = {
                    height:240,
                    legend: {
                        data:[aName[0].name,aName[1].name,aName[2].name,aName[3].name]
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
                        }
                    },
                    dataZoom:dataZoom,
                    grid: {
                        x: 60, y: 40,x2:20,
                        borderColor: '#FFF'
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            splitLine:false,
                            /*name:getRcText("SHOWTIMEHOUR"),
                            nameTextStyle:{color:"gray"},*/
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E6E6FA', width: 1}
                            },
                            axisTick :{
                                show:false
                            },
                            data:aTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name:getRcText("TrafficMb"),
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
                    series: [
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[0].name,
                            data:aData[0]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[1].name,
                            data :aData[1]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[2].name,
                            data:aData[2]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[3].name,
                            data:aData[3]
                        },
                    ]

                };
                $("#AppType_change").echart("init", option_app, oTheme_app);
                break;
            case "5":
                var option_app = {
                    height:280,
                    legend: {
                        data:[aName[0].name,aName[1].name,aName[2].name,aName[3].name,aName[4].name]
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
                        }
                    },
                    dataZoom:dataZoom,
                    grid: {
                        x: 60, y: 40,x2:20,
                        borderColor: '#FFF'
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            splitLine:false,
                            /*name:getRcText("SHOWTIMEHOUR"),
                            nameTextStyle:{color:"gray"},*/
                            axisLine  : {
                                show:true,
                                lineStyle :{color: '#E6E6FA', width: 1}
                            },
                            axisTick :{
                                show:false
                            },
                            data:aTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name:getRcText("TrafficMb"),
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
                    series: [
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[0].name,
                            data:aData[0]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[1].name,
                            data :aData[1]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[2].name,
                            data:aData[2]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name: aName[3].name,
                            data:aData[3]
                        },
                        {
                            symbol: "none",
                            type: 'line',
                            smooth: true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            name:aName[4].name,
                            data:aData[4]
                        },
                    ]
                };
                $("#AppType_change").echart("init", option_app, oTheme_app);
                break;
        }
    }
    //应用类别流量折线图的数据处理
    function AppTypeFlow_Chart(sStartTime,sEnd)
    {
        var sNowStart =  getTheDate("one","Start");
        var sNowEndTime =  getTheDate("one","end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        var tNow = new Date();
        var nHour = tNow.getHours();

        var nOneHour = 3600*1000;//
        var nDATA = 24;//
        var tNow = new Date();
        $.ajax({
            url: MyConfig.path+"/ant/dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'AppTypeFlow',
                Time:nHour,
                Param: {

                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                },
                Return: [
                    "APPName",
                    "APPGroupName",
                    "PktBytes",
                    "FirstTime",
                    "LastTime",
                ]

            },
            success: function(data)
            {

                var message = data.message;
                var aAppTypeFlow0 = message.aAppTypeFlow0,aAppTypeFlow1 = message.aAppTypeFlow1,aAppTypeFlow2 = message.aAppTypeFlow2,aAppTypeFlow3 = message.aAppTypeFlow3,aAppTypeFlow4 = message.aAppTypeFlow4;
                var aTime = message.aTime;
                var ShowTime = ((nEndTime - nStartTime)/nDATA/3600);
                if(ShowTime<=1)
                {
                    for(var i=0;i<aTime.length;i++)
                    {
                        aTime[i] = new Date(aTime[i]);
                        aTime[i] = (aTime[i].toTimeString()).slice(0,5);
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
                var aSearchApp = message.aSearchApp;
                var aTypeData = [];
                var nMb = 1024*1024;
                for(var i=0;i<aTime.length;i++)
                {
                    aAppTypeFlow0[i] = Number((aAppTypeFlow0[i]/nMb).toFixed(2));
                    aAppTypeFlow1[i] = Number((aAppTypeFlow1[i]/nMb).toFixed(2));
                    aAppTypeFlow2[i] = Number((aAppTypeFlow2[i]/nMb).toFixed(2));
                    aAppTypeFlow3[i] = Number((aAppTypeFlow3[i]/nMb).toFixed(2));
                    aAppTypeFlow4[i] = Number((aAppTypeFlow4[i]/nMb).toFixed(2));

                }
                aTypeData.push(aAppTypeFlow0,aAppTypeFlow1,aAppTypeFlow2,aAppTypeFlow3,aAppTypeFlow4);
                var aTureTypeData = [];
                var nLenght = aSearchApp.length;
                switch(nLenght)
                {
                    case 0:
                        AppTypeChange(aTime,aTypeData,aSearchApp,"0",ShowTime);
                        break;
                    case 1:
                        aTureTypeData.push(aTypeData[0]);
                        AppTypeChange(aTime,aTureTypeData,aSearchApp,"1",ShowTime);
                        break;
                    case 2:
                        aTureTypeData.push(aTypeData[0],aTypeData[1]);
                        AppTypeChange(aTime,aTureTypeData,aSearchApp,"2",ShowTime);
                        break;
                    case 3:
                        aTureTypeData.push(aTypeData[0],aTypeData[1],aTypeData[2]);
                        AppTypeChange(aTime,aTureTypeData,aSearchApp,"3",ShowTime);
                        break;
                    case 4:
                        aTureTypeData.push(aTypeData[0],aTypeData[1],aTypeData[2],aTypeData[3]);
                        AppTypeChange(aTime,aTureTypeData,aSearchApp,"4",ShowTime);
                        break;
                    case 5:
                        aTureTypeData.push(aTypeData[0],aTypeData[1],aTypeData[2],aTypeData[3],aTypeData[4]);
                        AppTypeChange(aTime,aTureTypeData,aSearchApp,"5",ShowTime);
                        break;
                    default:
                        break;
                }
            },
            error: onAjaxErr
        });
    }
    //访问应用人次折线图的数据处理
    function initWecomApp_Chart(sStartTime,sEnd)
    {
        var sNowStart =  getTheDate("one","Start");
        var sNowEndTime =  getTheDate("one","end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        var nOneHour = 3600*1000;//
        var nDATA = 24;//
        var tNow = new Date();

        $.ajax({
            url: MyConfig.path+"/ant/dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'AccessAppNum',
                Time:tNow,
                Param: {

                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
                },
                Return: [
                    "UserMAC",
                    "APPName",
                    "FirstTime",
                    "LastTime",
                ]

            },
            success: function(data)
            {
                var message  = data.message;
                var aTime = message.aTime;
                var ShowTime = ((nEndTime - nStartTime)/nDATA/3600);
                if(ShowTime<=1)
                {
                    for(var i=0;i<aTime.length;i++)
                    {
                        aTime[i] = new Date(aTime[i]);
                        aTime[i] = (aTime[i].toTimeString()).slice(0,5);
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

                var aSearchApp = message.aSearchApp;
                var aWecomAppNum = [];
                aWecomAppNum.push(message.aAppTypeFlow0,message.aAppTypeFlow1,message.aAppTypeFlow2,message.aAppTypeFlow3,message.aAppTypeFlow4);
                var aTrueWelcomAPP = [];
                var nLenght=aSearchApp.length;
                switch(nLenght)
                {
                    case 0:
                        initAppChange(aTime,aWecomAppNum,aSearchApp,"0",ShowTime);
                        break;
                    case 1:
                        aTrueWelcomAPP.push(aWecomAppNum[0]);
                        initAppChange(aTime,aTrueWelcomAPP,aSearchApp,"1",ShowTime);
                        break;
                    case 2:
                        aTrueWelcomAPP.push(aWecomAppNum[0],aWecomAppNum[1]);
                        initAppChange(aTime,aTrueWelcomAPP,aSearchApp,"2",ShowTime);
                        break;
                    case 3:
                        aTrueWelcomAPP.push(aWecomAppNum[0],aWecomAppNum[1],aWecomAppNum[2]);
                        initAppChange(aTime,aTrueWelcomAPP,aSearchApp,"3",ShowTime);
                        break;
                    case 4:
                        aTrueWelcomAPP.push(aWecomAppNum[0],aWecomAppNum[1],aWecomAppNum[2],aWecomAppNum[3]);
                        initAppChange(aTime,aTrueWelcomAPP,aSearchApp,"4",ShowTime);
                        break;
                    case 5:
                        aTrueWelcomAPP.push(aWecomAppNum[0],aWecomAppNum[1],aWecomAppNum[2],aWecomAppNum[3],aWecomAppNum[4]);
                        initAppChange(aTime,aTrueWelcomAPP,aSearchApp,"5",ShowTime);
                        break;
                    default:
                        break;
                }
            },
            error: onAjaxErr
        });

    }
    function initFlow()
    {
        initUser();
        initUserFlowChart();
        AppTypeFlow_Chart();
    }
    function initUrl()
    {
        initpie_Url();
        initNum_UrlChart();
    }
    function initApp()
    {
        initPie_App();
        initWecomApp_Chart();
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
    function MacSelectUrl(StartTime,EndTime)
    {
        var MacValue = $("#filter_PieDateValue").val();
        /*防止刷新时没有填MAC而点击了对勾 导致刷新不正常*/
        if(MacValue == "")
        {
            g_bMACFlag = 0;
        }
        if(!macFormCheck(MacValue))
        {
            return;
        }
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart = getTheDate("one","Start");
        var sEnd = EndTime || sNowEndTime;
        var sStartTime = StartTime || sNowStart;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        $.ajax({
            url: MyConfig.path+"/ant/dpi_url",
            dataType: "json",
            type:"post",
            data:{
                Method:"WelComeUrlMac",
                MacValue:MacValue,
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,

                },
                Return: [
                    "WebSiteName",
                    "UserMAC",
                ]

            },
            success: function (Data)
            {

                //g_returnurl = 1;
                g_returnTime = 1;
                g_returnMAC =  1;
                var aSearchUrl = Data.message;
                WecomUrls_pie(aSearchUrl);
            },
            error: onAjaxErr
        });


    }

    function MacSelectApp(sStartTime,sEnd)
    {
        var MacValue = $("#filter_PieDateValue").val();
        if(!macFormCheck(MacValue))
        {
            return;
        }
        var UserId;
        var aRequest = [];
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart = getTheDate("one","Start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;

        $.ajax({
            url: MyConfig.path+"/ant/dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'WelComeAppMac',
                MacValue:MacValue,
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,

                },
                Return: [
                    "UserMAC",
                    "APPName",
                ]

            },
            success: function (Data)
            {

                //g_returnApp = 1;
                g_returnTime = 1;
                g_returnWay = 1;
                g_returnMAC  =1;
                var aSearchApp = Data.message;
                initWecomPie_App(aSearchApp);
            },
            error: onAjaxErr
        });
    }

    function removeData()
    {
        document.getElementById("filter_PieDateValue").value="";
        g_bMACFlag = 0;
    }

    function onClick()
    {
        var sId = $(this).attr("id").split("_")[1];
        switch(sId){
            case "filter":
                $("#senior_select").toggle();
                return false;
                break;
            default:
                break;
        }
    }

    function initGrid( )
    {

    }

    function FreshClick()
    {
        if(g_bPieTimeFlag == 0)
        {
            var sEndTime =  getTheDate("one","end");
            var sStartTime =  getTheDate("one","Start");
            initUserFlowChart(sStartTime,sEndTime);
            initWecomApp_Chart(sStartTime,sEndTime);
            AppTypeFlow_Chart(sStartTime,sEndTime);
            initNum_UrlChart(sStartTime,sEndTime);
            initUserNumber_Chart(sStartTime,sEndTime);
            if(g_bMACFlag == 0)
            {
                initpie_Url(sStartTime,sEndTime);
                initUser(sStartTime,sEndTime);
            }
            if(g_bMACFlag == 1)
            {
                MacSelectUrl(sStartTime,sEndTime);
                MacSelectFlow(sStartTime,sEndTime);
            }
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App(sStartTime,sEndTime);
                }
                if(g_bMACFlag == 1)
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            if(g_bPieWayFlag == 1)
            {

                if(g_bMACFlag == 0)
                {
                    initFlowPie_App(sStartTime,sEndTime);
                }
                if(g_bMACFlag == 1)
                {
                    MacSelectApp(sStartTime,sEndTime);
                }

            }
        }
        if(g_bPieTimeFlag == 1)
        {
            var sEndTime =  getTheDate("aweek","end");
            var sStartTime =  getTheDate("aweek","Start");
            initUserFlowChart(sStartTime,sEndTime);
            initWecomApp_Chart(sStartTime,sEndTime);
            AppTypeFlow_Chart(sStartTime,sEndTime);
            initNum_UrlChart(sStartTime,sEndTime);
            initUserNumber_Chart(sStartTime,sEndTime);
            if(g_bMACFlag == 0)
            {
                initpie_Url(sStartTime,sEndTime);
                initUser(sStartTime,sEndTime);
            }
            if(g_bMACFlag == 1)
            {
                MacSelectUrl(sStartTime,sEndTime);
                MacSelectFlow(sStartTime,sEndTime);
            }
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App(sStartTime,sEndTime);
                }
                if(g_bMACFlag == 1)
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            if(g_bPieWayFlag == 1)
            {

                if(g_bMACFlag == 0)
                {
                    initFlowPie_App(sStartTime,sEndTime);
                }
                if(g_bMACFlag == 1)
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
        }
        if(g_bPieTimeFlag == 2)
        {
            var sEndTime =  getTheDate("month","end");
            var sStartTime =  getTheDate("month","Start");
            initUserFlowChart(sStartTime,sEndTime);
            initWecomApp_Chart(sStartTime,sEndTime);
            AppTypeFlow_Chart(sStartTime,sEndTime);
            initNum_UrlChart(sStartTime,sEndTime);
            initUserNumber_Chart(sStartTime,sEndTime);
            if(g_bMACFlag == 0)
            {
                initpie_Url(sStartTime,sEndTime);
                initUser(sStartTime,sEndTime);
            }
            if(g_bMACFlag == 1)
            {
                MacSelectUrl(sStartTime,sEndTime);
                MacSelectFlow(sStartTime,sEndTime);
            }
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App(sStartTime,sEndTime);
                }
                if(g_bMACFlag == 1)
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            if(g_bPieWayFlag == 1)
            {

                if(g_bMACFlag == 0)
                {
                    initFlowPie_App(sStartTime,sEndTime);
                }
                if(g_bMACFlag == 1)
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
        }
        if(g_bPieTimeFlag == 3)
        {
            var sEndTime =  getTheDate("year","end");
            var sStartTime =  getTheDate("year","Start");
            initUserFlowChart(sStartTime,sEndTime);
            initWecomApp_Chart(sStartTime,sEndTime);
            AppTypeFlow_Chart(sStartTime,sEndTime);
            initNum_UrlChart(sStartTime,sEndTime);
            initUserNumber_Chart(sStartTime,sEndTime);
            if(g_bMACFlag == 0)
            {
                initpie_Url(sStartTime,sEndTime);
                initUser(sStartTime,sEndTime);
            }
            if(g_bMACFlag == 1)
            {
                MacSelectUrl(sStartTime,sEndTime);
                MacSelectFlow(sStartTime,sEndTime);
            }
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App(sStartTime,sEndTime);
                }
                if(g_bMACFlag == 1)
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            if(g_bPieWayFlag == 1)
            {

                if(g_bMACFlag == 0)
                {
                    initFlowPie_App(sStartTime,sEndTime);
                }
                if(g_bMACFlag == 1)
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
        }
        if(g_bPieTimeFlag == 4)
        {
            var StartTime = $("#starttime").daterange("value");
            if(StartTime.slice(0,10) == StartTime.slice(13,23))
            {
                var sEndTime =  getTheDate("one","end");
                var sStartTime =  getTheDate("one","Start");
            }
            else
            {
                var sStartTime = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                var sEndTime = (new Date(Number(StartTime.slice(13,17)),Number(StartTime.slice(18,20))-1,Number(StartTime.slice(21,23)))).getTime();
            }
            initUserFlowChart(sStartTime,sEndTime);
            initWecomApp_Chart(sStartTime,sEndTime);
            AppTypeFlow_Chart(sStartTime,sEndTime);
            initNum_UrlChart(sStartTime,sEndTime);
            initUserNumber_Chart(sStartTime,sEndTime);
            if(g_bMACFlag == 0)
            {
                initpie_Url(sStartTime,sEndTime);
                initUser(sStartTime,sEndTime);
            }
            if(g_bMACFlag == 1)
            {
                MacSelectUrl(sStartTime,sEndTime);
                MacSelectFlow(sStartTime,sEndTime);
            }
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App(sStartTime,sEndTime);
                }
                if(g_bMACFlag == 1)
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            if(g_bPieWayFlag == 1)
            {

                if(g_bMACFlag == 0)
                {
                    initFlowPie_App(sStartTime,sEndTime);
                }
                if(g_bMACFlag == 1)
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
        }
    }


    /*此函数暂时保留，如果后面流量饼图单独过滤刷新的话 可用到此函数*/
    function SelectFlowTimePie()
    {
        var nDate = $(this).attr("value");
        if(nDate=="0")
        {
            g_bPieTimeFlag = 0;
            var sEndTime =  getTheDate("one","end");
            var sStartTime =  getTheDate("one","Start");

            if(g_bMACFlag == 0)
            {
                initUser(sStartTime,sEndTime);
            }
            else
            {
                MacSelectFlow(sStartTime,sEndTime);
            }
        }
        if(nDate=="1")
        {
            g_bPieTimeFlag = 1;
            var sEndTime =  getTheDate("aweek","end");
            var sStartTime =  getTheDate("aweek","Start");

            if(g_bMACFlag == 0)
            {
                initUser(sStartTime,sEndTime);
            }
            else
            {
                MacSelectFlow(sStartTime,sEndTime);
            }

        }
    }

    function SelectWayPie()
    {
        if(g_bPieTimeFlag==0)
        {
            var sEndTime =  getTheDate("one","end");
            var sStartTime =  getTheDate("one","Start");
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            else{
                if(g_bMACFlag == 0)
                {
                    initFlowPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }

        }
        if(g_bPieTimeFlag==1)
        {
            var sEndTime =  getTheDate("aweek","end");
            var sStartTime =  getTheDate("aweek","Start");
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App(sStartTime,sEndTime);
                }
                else
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            else{
                if(g_bMACFlag == 0)
                {
                    initFlowPie_App(sStartTime,sEndTime);
                }
                else
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
        }
        if(g_bPieTimeFlag==2)
        {
            var sEndTime =  getTheDate("month","end");
            var sStartTime =  getTheDate("month","Start");
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            else{
                if(g_bMACFlag == 0)
                {
                    initFlowPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }

        }
        if(g_bPieTimeFlag==3)
        {
            var sEndTime =  getTheDate("year","end");
            var sStartTime =  getTheDate("year","Start");

            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            else{
                if(g_bMACFlag == 0)
                {
                    initFlowPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
        }
        if(g_bPieTimeFlag==4)
        {

            var StartTime = $("#starttime").daterange("value");
            if(StartTime.slice(0,10) == StartTime.slice(13,23))
            {
                var sEndTime =  getTheDate("one","end");
                var sStartTime =  getTheDate("one","Start");
            }
            else
            {
                var sStartTime = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                var sEndTime = (new Date(Number(StartTime.slice(13,17)),Number(StartTime.slice(18,20))-1,Number(StartTime.slice(21,23)))).getTime();
            }
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            else{
                if(g_bMACFlag == 0)
                {
                    initFlowPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }

        }
    }
    function SelectTimePie()
    {
        if(g_bPieTimeFlag==0)
        {
            var sEndTime =  getTheDate("one","end");
            var sStartTime =  getTheDate("one","Start");
            initUserFlowChart(sStartTime,sEndTime);
            initWecomApp_Chart(sStartTime,sEndTime);
            AppTypeFlow_Chart(sStartTime,sEndTime);
            initNum_UrlChart(sStartTime,sEndTime);
            initUserNumber_Chart(sStartTime,sEndTime);
            if(g_bMACFlag == 0)
            {
                initpie_Url(sStartTime,sEndTime);
                initUser(sStartTime,sEndTime);
            }
            else
            {
                MacSelectUrl(sStartTime,sEndTime);
                MacSelectFlow(sStartTime,sEndTime);
            }
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            else{
                if(g_bMACFlag == 0)
                {
                    initFlowPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }

        }
        if(g_bPieTimeFlag==1)
        {
            var sEndTime =  getTheDate("aweek","end");
            var sStartTime =  getTheDate("aweek","Start");
            initUserFlowChart(sStartTime,sEndTime);
            initWecomApp_Chart(sStartTime,sEndTime);
            AppTypeFlow_Chart(sStartTime,sEndTime);
            initNum_UrlChart(sStartTime,sEndTime);
            initUserNumber_Chart(sStartTime,sEndTime);
            if(g_bMACFlag == 0)
            {
                initpie_Url(sStartTime,sEndTime);
                initUser(sStartTime,sEndTime);
            }
            else
            {
                MacSelectUrl(sStartTime,sEndTime);
                MacSelectFlow(sStartTime,sEndTime);
            }
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App(sStartTime,sEndTime);
                }
                else
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            else{
                if(g_bMACFlag == 0)
                {
                    initFlowPie_App(sStartTime,sEndTime);
                }
                else
                {
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
        }
        if(g_bPieTimeFlag==2)
        {
            var sEndTime =  getTheDate("month","end");
            var sStartTime =  getTheDate("month","Start");
            initUserFlowChart(sStartTime,sEndTime);
            initWecomApp_Chart(sStartTime,sEndTime);
            AppTypeFlow_Chart(sStartTime,sEndTime);
            initNum_UrlChart(sStartTime,sEndTime);
            initUserNumber_Chart(sStartTime,sEndTime);
            if(g_bMACFlag == 0)
            {
                initpie_Url(sStartTime,sEndTime);
                initUser(sStartTime,sEndTime);
            }
            else
            {
                MacSelectUrl(sStartTime,sEndTime);
                MacSelectFlow(sStartTime,sEndTime);
            }
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            else{
                if(g_bMACFlag == 0)
                {
                    initFlowPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }

        }
        if(g_bPieTimeFlag==3)
        {
            var sEndTime =  getTheDate("year","end");
            var sStartTime =  getTheDate("year","Start");
            initUserFlowChart(sStartTime,sEndTime);
            initWecomApp_Chart(sStartTime,sEndTime);
            AppTypeFlow_Chart(sStartTime,sEndTime);
            initNum_UrlChart(sStartTime,sEndTime);
            initUserNumber_Chart(sStartTime,sEndTime);
            if(g_bMACFlag == 0)
            {
                initpie_Url(sStartTime,sEndTime);
                initUser(sStartTime,sEndTime);
            }
            else
            {
                MacSelectUrl(sStartTime,sEndTime);
                MacSelectFlow(sStartTime,sEndTime);
            }
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            else{
                if(g_bMACFlag == 0)
                {
                    initFlowPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
        }
        if(g_bPieTimeFlag==4)
        {

            var StartTime = $("#starttime").daterange("value");
            if(StartTime.slice(0,10) == StartTime.slice(13,23))
            {
                var sEndTime =  getTheDate("one","end");
                var sStartTime =  getTheDate("one","Start");
            }
            else
            {
                var sStartTime = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                var sEndTime = (new Date(Number(StartTime.slice(13,17)),Number(StartTime.slice(18,20))-1,Number(StartTime.slice(21,23)))).getTime();
            }
            initUserFlowChart(sStartTime,sEndTime);
            initWecomApp_Chart(sStartTime,sEndTime);
            AppTypeFlow_Chart(sStartTime,sEndTime);
            initNum_UrlChart(sStartTime,sEndTime);
            initUserNumber_Chart(sStartTime,sEndTime);
            if(g_bMACFlag == 0)
            {
                initpie_Url(sStartTime,sEndTime);
                initUser(sStartTime,sEndTime);
            }
            else
            {
                MacSelectUrl(sStartTime,sEndTime);
                MacSelectFlow(sStartTime,sEndTime);
            }
            if(g_bPieWayFlag == 0)
            {
                if(g_bMACFlag == 0)
                {
                    initPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }
            else{
                if(g_bMACFlag == 0)
                {
                    initFlowPie_App (sStartTime,sEndTime);
                }
                else{
                    MacSelectApp(sStartTime,sEndTime);
                }
            }

        }
    }
    /*取消告警的红框*/
    function changeColor()
    {
        var MacValue = $("#filter_PieDateValue").val();
        if((MacValue == "")||(macFormCheck(MacValue)))
        {
            $("#filter_PieDateValue").removeClass("border-red");
        }
    }
    /*点击确定之后的处理*/
    function Ensure()
    {
        /*先要确定选中了那几个键*/
        var aTimeDate = $("input[name='StatisCycle']");
        var aWayDate = $("input[name='selectWayPie']");
        var MacValue = $("#filter_PieDateValue").val();
        var nTimeDate;
        var nWayDate;
        for(var i=0; i<aWayDate.length;i++)
        {
            if($(aWayDate[i])[0].checked)
            {
                nWayDate = $(aWayDate[i]).val();
                break;
            }
        }
        for(var i=0; i<aTimeDate.length;i++)
        {
            if($(aTimeDate[i])[0].checked)
            {
                nTimeDate = $(aTimeDate[i]).val();
                break;
            }
        }
        switch(nWayDate)
        {
            case "0":
                g_bPieWayFlag = 0;
                break;
            case "1":
                g_bPieWayFlag = 1;
                break;
            default :
                break;
        }
        switch(nTimeDate)
        {
            case "0":
                g_bPieTimeFlag = 0;
                $("#selectNow").html(getRcText("ONEDAY"));
                break;
            case "1":
                $("#selectNow").html(getRcText("AWEEK"));
                g_bPieTimeFlag = 1;
                break;
            case "2":
                g_bPieTimeFlag = 2;
                $("#selectNow").html(getRcText("MONTH"));
                break;
            case "3":
                g_bPieTimeFlag = 3;
                $("#selectNow").html(getRcText("YEAR"));
                break;
            case "4":
                var aStartValue = $("input[name='daterangepicker_start']").val();
                var aEndValue = $("input[name='daterangepicker_end']").val();
                var sInputValue = "（"+aStartValue + " - " + aEndValue+"）";
                $("#selectNow").html(sInputValue);
                g_bPieTimeFlag = 4;
                break;
            default :
                break;
        }
        /*排除因为MAC地址输入有误或没有输入造成的变量变化*/
        if((MacValue == ""))
        {
            g_bMACFlag = 0;
        }
        else
        {
            if((!macFormCheck(MacValue)))
            {
                $("#filter_PieDateValue").addClass("border-red");
                return;
            }
            else
            {
                g_bMACFlag = 1;
            }
        }
        /*判断前面发的请求是否回来 回来1 没回来0*/
        if((g_returnFlow == 1)&&(g_returnApp == 1)&&(g_returnurl == 1))
        {
            g_returnFlow = 0;
            g_returnApp = 0;
            g_returnurl = 0;
            SelectTimePie();
        }
    }
    /*输入MAC地址时键入回车键后的处理*/
    function getMACKey()
    {
        if(event.keyCode==13) {
            /*先要确定选中了那几个键*/
            var MacValue = $("#filter_PieDateValue").val();
            /*排除因为MAC地址输入有误或没有输入造成的变量变化*/
            if ((MacValue == "")) {
                g_bMACFlag = 0;
            }
            else {
                if ((!macFormCheck(MacValue))) {
                    $("#filter_PieDateValue").addClass("border-red");
                    return;
                }
                else {
                    g_bMACFlag = 1;
                }
            }
            /*判断前面发的请求是否回来 回来1 没回来0*/
            if(g_returnMAC == 1)
            {
                g_returnMAC = 0;
                SelectTimePie();
            }

        }

    }
    /*点击取消的处理*/
    function Remove()
    {
        removeData();
        $("#senior_select").hide();

    }

    function refreshChart()
    {
        initWecomApp_Chart();
        initNum_UrlChart();
        AppTypeFlow_Chart();
        initUserNumber_Chart();
    };
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
    /*时间周期选择*/
    function BtnTimeSelect()
    {
        /*先要确定选中了那几个键*/
        var aTimeDate = $("input[name='StatisCycle']");
        var nTimeDate;
        for(var i=0; i<aTimeDate.length;i++)
        {
            if($(aTimeDate[i])[0].checked)
            {
                nTimeDate = $(aTimeDate[i]).val();
                break;
            }
        }
        switch(nTimeDate)
        {
            case "0":
                g_bPieTimeFlag = 0;
                $("#selectNow").html(getRcText("ONEDAY"));
                break;
            case "1":
                $("#selectNow").html(getRcText("AWEEK"));
                g_bPieTimeFlag = 1;
                break;
            case "2":
                g_bPieTimeFlag = 2;
                $("#selectNow").html(getRcText("MONTH"));
                break;
            case "3":
                g_bPieTimeFlag = 3;
                $("#selectNow").html(getRcText("YEAR"));
                break;
            case "4":
                var aStartValue = $("input[name='daterangepicker_start']").val();
                var aEndValue = $("input[name='daterangepicker_end']").val();
                var sInputValue = "（"+aStartValue + " - " + aEndValue+"）";
                $("#selectNow").html(sInputValue);
                g_bPieTimeFlag = 4;
                break;
            default :
                break;
        }

        if(g_returnTime == 1)
        {
            g_returnTime = 0;
            SelectTimePie();
        }

    }
    /*方式选择*/
    function BtnWaySelect()
    {
        /*先要确定选中了那几个键*/
        var aWayDate = $("input[name='selectWayPie']");
        var nWayDate;
        for(var i=0; i<aWayDate.length;i++)
        {
            if($(aWayDate[i])[0].checked)
            {
                nWayDate = $(aWayDate[i]).val();
                break;
            }
        }
        switch(nWayDate)
        {
            case "0":
                g_bPieWayFlag = 0;
                break;
            case "1":
                g_bPieWayFlag = 1;
                break;
            default :
                break;
        }
        if(g_returnWay == 1)
        {
            g_returnWay = 0;
            SelectWayPie();
        }

    }
    function showAppChart()
    {
        var aValue = $("input[name='AcceessAppNum']");
        var nDate;
        for(var i=0; i<aValue.length;i++)
        {
            if($(aValue[i])[0].checked)
            {
                nDate = $(aValue[i]).val();
                break;
            }
        }
        var nTimeDate;
        nTimeDate =g_bPieTimeFlag
        if(nDate == 0)
        {
            $("#change_App").removeClass("hide");
            $("#AppType_change").addClass("hide");
            if(nTimeDate == 0)
            {
                initWecomApp_Chart();
            }
            if(nTimeDate == 1)
            {
                var sStartTime = getTheDate("aweek","Start");
                var sEndTime = getTheDate("aweek","end");
                initWecomApp_Chart(sStartTime,sEndTime);
            }
            if(nTimeDate == 2)
            {
                var sStartTime = getTheDate("month","Start");
                var sEndTime = getTheDate("month","end");
                initWecomApp_Chart(sStartTime,sEndTime);
            }
            if(nTimeDate == 3)
            {
                var sStartTime = getTheDate("year","Start");
                var sEndTime = getTheDate("year","end");
                initWecomApp_Chart(sStartTime,sEndTime);
            }
            if(nTimeDate == 4)
            {
                var StartTime = $("#starttime").daterange("value");
                if(StartTime.slice(0,10) == StartTime.slice(13,23))
                {
                    var sEndTime =  getTheDate("one","end");
                    var sStartTime =  getTheDate("one","Start");
                }
                else
                {
                    var sStartTime = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                    var sEndTime = (new Date(Number(StartTime.slice(13,17)),Number(StartTime.slice(18,20))-1,Number(StartTime.slice(21,23)))).getTime();
                }
                initWecomApp_Chart(sStartTime,sEndTime);
            }

        }
        if(nDate == 1)
        {
            $("#AppType_change").removeClass("hide");
            $("#change_App").addClass("hide");
            if(nTimeDate == 0)
            {
                AppTypeFlow_Chart();
            }
            if(nTimeDate == 1)
            {
                var sStartTime = getTheDate("aweek","Start");
                var sEndTime = getTheDate("aweek","end");
                AppTypeFlow_Chart(sStartTime,sEndTime);
            }
            if(nTimeDate == 2)
            {
                var sStartTime = getTheDate("month","Start");
                var sEndTime = getTheDate("month","end");
                AppTypeFlow_Chart(sStartTime,sEndTime);
            }
            if(nTimeDate == 3)
            {
                var sStartTime = getTheDate("year","Start");
                var sEndTime = getTheDate("year","end");
                AppTypeFlow_Chart(sStartTime,sEndTime);
            }
            if(nTimeDate == 4)
            {
                var StartTime = $("#starttime").daterange("value");
                if(StartTime.slice(0,10) == StartTime.slice(13,23))
                {
                    var sEndTime =  getTheDate("one","end");
                    var sStartTime =  getTheDate("one","Start");
                }
                else
                {
                    var sStartTime = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                    var sEndTime = (new Date(Number(StartTime.slice(13,17)),Number(StartTime.slice(18,20))-1,Number(StartTime.slice(21,23)))).getTime();
                }
                AppTypeFlow_Chart(sStartTime,sEndTime);
            }
        }
    }
    function showNumberChart()
    {
        var aValue = $("input[name='Number']");
        var nDate;
        for(var i=0; i<aValue.length;i++)
        {
            if($(aValue[i])[0].checked)
            {
                nDate = $(aValue[i]).val();
                break;
            }
        }
        var nTimeDate;
        nTimeDate =g_bPieTimeFlag
        if(nDate == 0)
        {
            $("#userchange_url").removeClass("hide");
            $("#userchange").addClass("hide");
            if(nTimeDate == 0)
            {
                initNum_UrlChart();
            }
            if(nTimeDate == 1)
            {
                var sStartTime = getTheDate("aweek","Start");
                var sEndTime = getTheDate("aweek","end");
                initNum_UrlChart(sStartTime,sEndTime);
            }
            if(nTimeDate == 2)
            {
                var sStartTime = getTheDate("month","Start");
                var sEndTime = getTheDate("month","end");
                initNum_UrlChart(sStartTime,sEndTime);
            }
            if(nTimeDate == 3)
            {
                var sStartTime = getTheDate("year","Start");
                var sEndTime = getTheDate("year","end");
                initNum_UrlChart(sStartTime,sEndTime);
            }
            if(nTimeDate == 4)
            {
                 var StartTime = $("#starttime").daterange("value");
                if(StartTime.slice(0,10) == StartTime.slice(13,23))
                {
                    var sEndTime =  getTheDate("one","end");
                    var sStartTime =  getTheDate("one","Start");
                }
                else
                {
                    var sStartTime = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                    var sEndTime = (new Date(Number(StartTime.slice(13,17)),Number(StartTime.slice(18,20))-1,Number(StartTime.slice(21,23)))).getTime();
                }
                initNum_UrlChart(sStartTime,sEndTime);
            }
        }
        if(nDate == 1)
        {
            $("#userchange").removeClass("hide");
            $("#userchange_url").addClass("hide");
            if(nTimeDate == 0)
            {
                initUserNumber_Chart();
            }
            if(nTimeDate == 1)
            {
                var sStartTime = getTheDate("aweek","Start");
                var sEndTime = getTheDate("aweek","end");
                initUserNumber_Chart(sStartTime,sEndTime);
            }
            if(nTimeDate == 2)
            {
                var sStartTime = getTheDate("month","Start");
                var sEndTime = getTheDate("month","end");
                initUserNumber_Chart(sStartTime,sEndTime);
            }
            if(nTimeDate == 3)
            {
                var sStartTime = getTheDate("year","Start");
                var sEndTime = getTheDate("year","end");
                initUserNumber_Chart(sStartTime,sEndTime);
            }
            if(nTimeDate == 4)
            {
                var StartTime = $("#starttime").daterange("value");
                if(StartTime.slice(0,10) == StartTime.slice(13,23))
                {
                    var sEndTime =  getTheDate("one","end");
                    var sStartTime =  getTheDate("one","Start");
                }
                else
                {
                    var sStartTime = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                    var sEndTime = (new Date(Number(StartTime.slice(13,17)),Number(StartTime.slice(18,20))-1,Number(StartTime.slice(21,23)))).getTime();
                }
                initUserNumber_Chart(sStartTime,sEndTime);
            }
        }
    }


    function onAjaxErr()
    {
    }
    function initForm()
    {
        /*取消告警的红框*/
        $("#filter_PieDateValue").on("change",changeColor);
        /*点击确定和取消键的处理*/
       /* $("#sure").on("click",Ensure);*/
        $("#remove").on("click",Remove);
        /*点击选择周期*/
        $("#statisOneday,#statisAweek,#statisMonth,#statisYear,.applyBtn").on("click",BtnTimeSelect);
        /*点击选择方式*/
        $("#statisMan,#statisFlow").on("click",BtnWaySelect);
        /*绑定键入的回车键*/
        $("#filter_PieDateValue").bind("keyup",getMACKey);
        /*点击查看是否影藏日历*/
        $("#otherTime").on("click",ButShowOther);
        $("#statisOneday,#statisAweek,#statisMonth,#statisYear").on("click",ButHideOther);

        /*高级查询的显示处理*/
        $("#senior_filter").on("click",onClick);
        /*饼图刷新处理*/
        $("#refreshPie").on("click",FreshClick);

        /*数量变化图刷新*/
        $("#refreshChange_App").on("click",refreshChart);
        /*点击折线图转换*/
        $("#EchartSkipname").on("click",showAppChart);
        $("#EchartSkipname1").on("click",showNumberChart);
        //链接详情页面
        $("#appinfo_detail,#urlinfo_detail").on("click", function(){
            Utils.Base.redirect ({np:"drs.index",ID:$(this).attr("id")});
            return false;
        });
    }
    function initData()
    {
        initFlow();
        initUrl();
        initApp();
        initUserNumber_Chart();
    }

    function _init()
    {
        g_jForm = $("#UserSelects");
        initForm();
        initGrid();
        initData();


    };

    function _destroy()
    {
        g_aUserUp = null;
        g_aUserDown = null;
        g_jForm = null;
        g_aInterfaces = null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","DateRange","DateTime"],
        "utils":["Base"]
    });
})( jQuery );

