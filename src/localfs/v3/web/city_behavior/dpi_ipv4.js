;(function ($) {
    var MODULE_BASE = "city_behavior";
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
               
                return tNow - aHour*(nDATA-1)
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
               
               return tNow - aHour*(nDATA-1)
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
                return tNow - aHour*(nDATA-1)
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

       // $("#totalflowup").echart("init", Upoption,oTheme);
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
        var sNowStart =  getTheDate("one","start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        var tNow = new Date();
        var nHour = tNow.getHours();
        var SendMsg = 
        {
            url: MyConfig.path+"/ant/read_dpi_app",
            dataType: "json",
            type:"post",
            data:{
                Method:'GetFlowChart',
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
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(Data)
        {
            g_returnChart = 1;
                g_returnMAC = 1;
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
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        } 
    }
    //流量饼图的数据处理
    function initUser(sStartTime,sEnd)
    {
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart =  getTheDate("one","start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;

        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        var SendMsg = 
        {
            url: MyConfig.path+"/ant/read_dpi_app",
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
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(Data)
        {
            g_returnTime = 1
            g_returnMAC = 1;
            var message = Data.message;
            TotalFlowPie(message.upflow,message.downflow);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }  
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
        var sNowStart =  getTheDate("one","start");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;

        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        var SendMsg = 
        {
            url: MyConfig.path+"/ant/read_dpi_app",
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
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail 
        }
         Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(Data)
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
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }  
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
           // $("#UserFlow_chart").echart("init", option, oTheme_0);
        }
        else
        {
           // $("#UserFlow_chart").echart("init", option, oTheme);
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
                width: 560,
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
                width: 560,
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
        var sNowStart = getTheDate("one","start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        var SendMsg = 
        {
            url:  MyConfig.path+"/ant/read_dpi_url",
            dataType: "json",
            type:"post",
            data:{
                Method:"WelComeUrl",
                UrlType:"WebSiteName",
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
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
         Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data)
        {
            //g_returnurl = 1;
                g_returnTime = 1;
                g_returnMAC = 1;
                var aSearchWeb = data.message;
                WecomUrls_pie(aSearchWeb);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        } 
    }
    //最受欢迎的应用类别饼图option
    function initWecomPie_App(aData)
    {
        //for(var i=0;i<aData.length;i++)
        //{
        //    if(aData[i].name == "")
        //    {
        //       aData[i].name = aData[i].APPName;
        //
        //    }
        //}
        var aData =  [{name: "netbios-dgm",value: 127},{name: "oicq",value: 16},{name: "腾讯网",value: 14},
            {name: "QQ",value: 10},{name: "微信",value: 10},{name: "百度搜索",value: 4},
            {name: "腾讯新闻",value: 4},{name: "腾讯视频",value: 3}];
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
                    width: "46%",
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
        var sNowStart = getTheDate("one","start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        var SendMsg = 
        {
            url: MyConfig.path+"/ant/read_dpi_app",
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
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data)
        {
           //g_returnApp = 1;
            g_returnTime = 1;
            g_returnWay = 1;
            g_returnMAC = 1;
            var aSearchApp = data.message;
            initWecomPie_App(aSearchApp);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }  

    }
    //最受欢迎的应用饼图的数据处理
    function initPie_App(sStartTime,sEnd)
    {
        var sNowEndTime =  getTheDate("one","end");
        var sNowStart = getTheDate("one","start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        var SendMsg = {
            url: MyConfig.path+"/ant/read_dpi_app",
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
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
         Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data)
        {
          // g_returnApp = 1;
            g_returnTime = 1;
            g_returnWay = 1;
            g_returnMAC = 1;
            var aSearchApp = data.message;
            initWecomPie_App(aSearchApp);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }  
    } 
    function initFlow()
    {
        initUser();
        initUserFlowChart();
    }
    function initUrl()
    {
        initpie_Url();
    }
    function initApp()
    {
        initPie_App();
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
        var sNowStart = getTheDate("one","start");
        var sEnd = EndTime || sNowEndTime;
        var sStartTime = StartTime || sNowStart;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        var SendMsg = {
            url: MyConfig.path+"/ant/read_dpi_url",
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
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(Data)
        {
             //g_returnurl = 1;
                g_returnTime = 1;
                g_returnMAC =  1;
                var aSearchUrl = Data.message;
                WecomUrls_pie(aSearchUrl);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }  
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
        var sNowStart = getTheDate("one","start");
        var sEnd = sEnd || sNowEndTime;
        var sStartTime = sStartTime || sNowStart;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
        var SendMsg = {
            url: MyConfig.path+"/ant/read_dpi_app",
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
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        }
         Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(Data)
        {
            //g_returnApp = 1;
            g_returnTime = 1;
            g_returnWay = 1;
            g_returnMAC  =1;
            var aSearchApp = Data.message;
            initWecomPie_App(aSearchApp);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }  
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
        setCalendarDate();
        if(g_bPieTimeFlag == 0)
        {
            var sEndTime =  getTheDate("one","end");
            var sStartTime =  getTheDate("one","start");
            initUserFlowChart(sStartTime,sEndTime);
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
            var sStartTime =  getTheDate("aweek","start");
            initUserFlowChart(sStartTime,sEndTime);
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
            var sStartTime =  getTheDate("month","start");
            initUserFlowChart(sStartTime,sEndTime);
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
            var sStartTime =  getTheDate("year","start");
            initUserFlowChart(sStartTime,sEndTime);
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
                var sStartTime =  getTheDate("one","start");
            }
            else
            {
                var sStartTime = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                var sEndTime = (new Date(Number(StartTime.slice(13,17)),Number(StartTime.slice(18,20))-1,Number(StartTime.slice(21,23)))).getTime();
            }
            initUserFlowChart(sStartTime,sEndTime);
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
            var sStartTime =  getTheDate("one","start");

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
            var sStartTime =  getTheDate("aweek","start");

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
            var sStartTime =  getTheDate("one","start");
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
            var sStartTime =  getTheDate("aweek","start");
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
            var sStartTime =  getTheDate("month","start");
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
            var sStartTime =  getTheDate("year","start");

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
                var sStartTime =  getTheDate("one","start");
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
            var sStartTime =  getTheDate("one","start");
            initUserFlowChart(sStartTime,sEndTime);
           /* initWecomApp_Chart(sStartTime,sEndTime);
            AppTypeFlow_Chart(sStartTime,sEndTime);
            initNum_UrlChart(sStartTime,sEndTime);
            initUserNumber_Chart(sStartTime,sEndTime);*///去掉折线图
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
            var sStartTime =  getTheDate("aweek","start");
            initUserFlowChart(sStartTime,sEndTime);
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
            var sStartTime =  getTheDate("month","start");
            initUserFlowChart(sStartTime,sEndTime);
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
            var sStartTime =  getTheDate("year","start");
            initUserFlowChart(sStartTime,sEndTime);
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

           // var StartTime = $("#starttime").daterange("value");
            var aStartValue = $("input[name='daterangepicker_start']").val();
            var aEndValue = $("input[name='daterangepicker_end']").val();
            var StartTime = aStartValue + " - " + aEndValue;
            if(StartTime.slice(0,10) == StartTime.slice(13,23))
            {
                var sEndTime =  getTheDate("one","end");
                var sStartTime =  getTheDate("one","start");
            }
            else
            {
                var sStartTime = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                var sEndTime = (new Date(Number(StartTime.slice(13,17)),Number(StartTime.slice(18,20))-1,Number(StartTime.slice(21,23)))).getTime();
            }
            initUserFlowChart(sStartTime,sEndTime);
           /* initWecomApp_Chart(sStartTime,sEndTime);
            AppTypeFlow_Chart(sStartTime,sEndTime);
            initNum_UrlChart(sStartTime,sEndTime);
            initUserNumber_Chart(sStartTime,sEndTime);*/
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

    function _init()
    {
        g_jForm = $("#UserSelects");
        var AreaList = ["酒店","景区","车站"];
        $("#AreaSelect").singleSelect("InitData", AreaList);
        setCalendarDate();
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
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","SingleSelect","DateRange","DateTime"],
        "utils":["Base","Request"]
    });
})( jQuery );

