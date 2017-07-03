;(function ($) {
    var MODULE_BASE = "drs";
    var MODULE_NAME = MODULE_BASE + ".dpi_url";
    var g_sn = FrameInfo.ACSN;

    /*定义全局变量来标识所选的状态和过滤条件*/
    var g_MacAndUrl = 0; //选择过滤的是的全部（0）还是MAC（1）或Url（2）；
    var g_SelectTime = 0; //选择时间过滤 一天（0）七天（1）一月（2）一年（3），其他（4）；
    var g_UrlType = 0;  //选择网站类型过滤 全部（0），娱乐（1）新闻（2）购物（3） 科技（4） 其他（5）；
    var g_SelectWay = 0; //选择方式 人次（0），时长（1）；
    var g_Legend = 0; // 选择的图例 斌图（0），折线图（1）；

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
                    scope: "#UrlType_message",
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
        $("#UrlType_pie").echart("init", option, oTheme);
    }
    /*折线图option*/
    function initUrlChart(Name,aData,CountDay)
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
        var adata = aData.aUserNum_url ;
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
                    name:getRcText("PERSON"),
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

        $("#Url_chart").echart("init", option, oTheme);
    }

    /*获取list头*/
    function getListHead(nGroup,aMessage)
    {

        switch(nGroup)
        {
            case 0:
            {
                for(var i=0;i<aMessage.length;i++)
                {
                    var sType = aMessage[i].CategoryName;
                    switch(sType)
                    {
                        case "Entertainment":
                        {
                            aMessage[i].CategoryName = getRcText("Entertainment");
                            break;
                        }
                        case "News":
                        {
                            aMessage[i].CategoryName = getRcText("News");
                            break;
                        }
                        case "Shopping":
                        {
                            aMessage[i].CategoryName = getRcText("Shopping");
                            break;
                        }
                        case "Computers & Technology":
                        {
                            aMessage[i].CategoryName = getRcText("Technology");
                            break;
                        }
                        case "Streaming Media & Downloads":
                        {
                            aMessage[i].CategoryName = getRcText("Downloads");
                            break;
                        }
                        case "Search Engines & Portals":
                        {
                            aMessage[i].CategoryName = getRcText("Search");
                            break;
                        }
                        case "Transportation":
                        {
                            aMessage[i].CategoryName = getRcText("Transportation");
                            break;
                        }
                        case "Finance":
                        {
                            aMessage[i].CategoryName = getRcText("Finance");
                            break;
                        }
                        default:
                            aMessage[i].CategoryName = getRcText("Unknown");
                            break;
                    }
                }
                $("#listTable").removeClass("hide");
                $("#listTable1").addClass("hide");
                $("#listTable2").addClass("hide");
                $("#listTable3").addClass("hide");
                $("#listTable4").addClass("hide");
                $("#listTable5").addClass("hide");
                $("#WelcomeList").SList ("refresh", aMessage);/*TotalTime CategoryName WebSiteName value UserMAC*/
                break;
            }
            case 1:
            {
                for(var i=0;i<aMessage.length;i++)
                {
                    var sType = aMessage[i].CategoryName;
                    switch(sType)
                    {
                        case "Entertainment":
                        {
                            aMessage[i].CategoryName = getRcText("Entertainment");
                            break;
                        }
                        case "News":
                        {
                            aMessage[i].CategoryName = getRcText("News");
                            break;
                        }
                        case "Shopping":
                        {
                            aMessage[i].CategoryName = getRcText("Shopping");
                            break;
                        }
                        case "Computers & Technology":
                        {
                            aMessage[i].CategoryName = getRcText("Technology");
                            break;
                        }
                        case "Streaming Media & Downloads":
                        {
                            aMessage[i].CategoryName = getRcText("Downloads");
                            break;
                        }
                        case "Search Engines & Portals":
                        {
                            aMessage[i].CategoryName = getRcText("Search");
                            break;
                        }
                        case "Transportation":
                        {
                            aMessage[i].CategoryName = getRcText("Transportation");
                            break;
                        }
                        case "Finance":
                        {
                            aMessage[i].CategoryName = getRcText("Finance");
                            break;
                        }
                        default:
                            aMessage[i].CategoryName = getRcText("Unknown");
                            break;
                    }
                }
                $("#listTable").addClass("hide");
                $("#listTable1").removeClass("hide");
                $("#listTable2").addClass("hide");
                $("#listTable3").addClass("hide");
                $("#listTable4").addClass("hide");
                $("#listTable5").addClass("hide");
                $("#WelcomeList1").SList ("refresh", aMessage);
                break;
            }
            case 2:
            {
                $("#listTable").addClass("hide");
                $("#listTable1").addClass("hide");
                $("#listTable2").removeClass("hide");
                $("#listTable3").addClass("hide");
                $("#listTable4").addClass("hide");
                $("#listTable5").addClass("hide");
                $("#WelcomeList2").SList ("refresh", aMessage);
                break;
            }
            case 3:
            {
                $("#listTable").addClass("hide");
                $("#listTable1").addClass("hide");
                $("#listTable2").addClass("hide");
                $("#listTable3").removeClass("hide");
                $("#listTable4").addClass("hide");
                $("#listTable5").addClass("hide");
                $("#WelcomeList3").SList ("refresh", aMessage);
                break;
            }
            case 4:
            {
                for(var i=0;i<aMessage.length;i++)
                {
                    aMessage[i].FirstTime = new Date(aMessage[i].FirstTime*1000).toLocaleString();
                    aMessage[i].LastTime = new Date(aMessage[i].LastTime*1000).toLocaleString();
                };
                $("#listTable").addClass("hide");
                $("#listTable1").addClass("hide");
                $("#listTable2").addClass("hide");
                $("#listTable3").addClass("hide");
                $("#listTable4").removeClass("hide");
                $("#listTable5").addClass("hide");
                $("#WelcomeList4").SList ("refresh", aMessage);
                break;
            }
            case 5:
            {
                for(var i=0;i<aMessage.length;i++)
                {
                    aMessage[i].FirstTime = new Date(aMessage[i].FirstTime*1000).toLocaleString();
                    aMessage[i].LastTime = new Date(aMessage[i].LastTime*1000).toLocaleString();
                };
                $("#listTable").addClass("hide");
                $("#listTable1").addClass("hide");
                $("#listTable2").addClass("hide");
                $("#listTable3").addClass("hide");
                $("#listTable4").addClass("hide");
                $("#listTable5").removeClass("hide");
                $("#WelcomeList5").SList ("refresh", aMessage);
                break;
            }
        }
    }
    /*发list表的请求*/
    function ajaxTable(sUrl,sMac,sUrlType,nGroup,sStartTime, sEnd)
    {
        var sNowStart = getTheDate("one", "start");
        var sNowEndTime = getTheDate("one", "end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime / 1000;
        var nEndTime = sEnd / 1000;
        var SendMsg = {
             url: MyConfig.path + "/ant/read_dpi_url",
            dataType: "json",
            type: "post",
            data: {
                Method: 'UrlTable',
                Group:nGroup,
                CategoryName:sUrlType,
                MAC:sMac,
                WebSiteName:sUrl,
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
    /*网站人次或时长折线图初始化*//*没有输入MAC和URL*/ /*统计单个或所有的网站类型的访问人次或访问人次前五*/
    function aiaxPersonForLine(sUrlType, sStartTime, sEnd)
    {
        var sNowStart = getTheDate("one", "start");
        var sNowEndTime = getTheDate("one", "end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime / 1000;
        var nEndTime = sEnd / 1000;
        var nHour = new Date().getHours();

        /*list表的初始化*/
        if(sUrlType == "")
        {
            nGroup = 0;
            ajaxTable("","","",nGroup,sStartTime,sEnd);
        }
        else
        {
            nGroup = 3;
            ajaxTable("","",sUrlType,nGroup,sStartTime,sEnd);
        }
        /*折线图的初始化*/
        var SendMsg = {
             url: MyConfig.path + "/ant/read_dpi_url",
            dataType: "json",
            type: "post",
            data: {
                Method: 'NetPlayNum',
                UrlType: sUrlType,
                WayType:g_SelectWay,
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
                    var name = getRcText("TIME");
                }
                nCountDay = (nEndTime-nStartTime)/(3600*24);
                initUrlChart(name,aMessage,nCountDay);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }
    }

    /*网站人次饼图初始化*//*没有输入MAC地址和URL*//*统计单个或所有的网站类型的访问人次的前五*/
    function aiaxPersonForPie(sUrlType, sStartTime, sEnd)
    {

        var sNowStart = getTheDate("one", "Start");
        var sNowEndTime = getTheDate("one", "end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime / 1000;
        var nEndTime = sEnd / 1000;
        /*list表的初始化*/
        if(sUrlType == "")
        {
            nGroup = 0;
            ajaxTable("","","",nGroup,sStartTime,sEnd);
        }
        else
        {
            nGroup = 3;
            ajaxTable("","",sUrlType,nGroup,sStartTime,sEnd);
        }

        /*饼图请求*/
        var SendMsg = {
            url: MyConfig.path + "/ant/read_dpi_url",
            dataType: "json",
            type: "post",
            data: {
                Method: 'UrlTopFive',
                UrlType: sUrlType,
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
            var aData = []
            for(var i=0;i<aMessage.length;i++)
            {
                var oTemp = {};
                oTemp.name = aMessage[i].WebSiteName;
                oTemp.value = aMessage[i].sum;
                aData.push(oTemp);
            }
            initUrlPie(aData);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }
    }

    /*网站时长饼图初始化*//*没有MAC地址和URL*//*统计所有的url访问时长的前五*/
    function aiaxTimeForPie(sUrlType, sStartTime, sEnd)
    {
        var sNowStart = getTheDate("one", "start");
        var sNowEndTime = getTheDate("one", "end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime / 1000;
        var nEndTime = sEnd / 1000;
        /*list表的初始化*/
        if(sUrlType == "")
        {
            nGroup = 0;
            ajaxTable("","","",nGroup,sStartTime,sEnd);
        }
        else
        {
            nGroup = 3;
            ajaxTable("","",sUrlType,nGroup,sStartTime,sEnd);
        }
        /*初始化饼图*/
        var SendMsg = {
            url: MyConfig.path + "/ant/read_dpi_url",
            dataType: "json",
            type: "post",
            data: {
                Method: 'UrlTimeTopFive',
                UrlType: sUrlType,
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
               // var aId = ["#UrlType_pie", "#UrlType_message", "#UrlType_chart"];
                initUrlPie(aMessage);
                // initUrlTypeChart(aId);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }

    }

    /*网站时长饼图的处理*//*输入了MAC地址*//*统计某个用户的所有url的在线时长的前五*/
    function MACaiaxTimeForPie(sMAC, sUrlType, sStartTime, sEnd)
    {
        var sNowStart = getTheDate("one", "Start");
        var sNowEndTime = getTheDate("one", "end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime / 1000;
        var nEndTime = sEnd / 1000;
        /*list表初始化*/
        /*list表的初始化*/
        if(sUrlType == "")
        {
            nGroup = 5;
            ajaxTable("",sMAC,"",nGroup,sStartTime,sEnd);
        }
        else
        {
            nGroup = 5;
            ajaxTable("",sMAC,sUrlType,nGroup,sStartTime,sEnd);
        }
        /*饼图初始化*/
          var SendMsg = {
            url: MyConfig.path + "/ant/read_dpi_url",
            dataType: "json",
            type: "post",
            data: {
                Method: 'UrlTimeTopFive',
                UrlType: sUrlType,
                MAC: sMAC,
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


    }
    /*网站时长折线图的处理 输入了MAC 统计每个时间段有多少url*/
    function MACajaxTimeForLine(sMAC,sUrlType,sStartTime,sEnd)
    {
        /*list表的初始化*/
        nGroup = 5;
        ajaxTable("",sMAC,"",nGroup,sStartTime,sEnd);
        //$("#WelcomeList3").SList ("refresh", opt); ///*TotalTime CategoryName value UserMAC */

        var sNowStart = getTheDate("one", "Start");
        var sNowEndTime = getTheDate("one", "end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime / 1000;
        var nEndTime = sEnd / 1000;
        var nHour = new Date().getHours();
          var SendMsg = {
            url: MyConfig.path + "/ant/read_dpi_url",
            dataType: "json",
            type: "post",
            data: {
                Method: 'NetPlayNum',
                URL:"",
                UrlType:sUrlType,
                MAC:sMAC,
                WayType:1,
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
                else{
                    var name = getRcText("TIME");
                }
                nCountDay = (nEndTime-nStartTime)/(3600*24);
                initUrlChart(name,aMessage,nCountDay);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }


    }
    /*网站人次折线图的处理*//*输入了Url*//*统计有多少个用户在访问此url或访问的前五；*/
    function URLaiaxPersonForLine(sURL,sStartTime,sEnd)
    {
        /*list表的初始化*/
        nGroup = 4;
        ajaxTable(sURL,"","",nGroup,sStartTime,sEnd);
        //$("#WelcomeList3").SList ("refresh", opt); ///*TotalTime CategoryName value UserMAC */

        var sNowStart = getTheDate("one", "Start");
        var sNowEndTime = getTheDate("one", "end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime / 1000;
        var nEndTime = sEnd / 1000;
        var nHour = new Date().getHours();
          var SendMsg = {
             url: MyConfig.path + "/ant/read_dpi_url",
            dataType: "json",
            type: "post",
            data: {
                Method: 'NetPlayNum',
                URL: sURL,
                UrlType:"",
                WayType:g_SelectWay,
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
            else{
                var name = getRcText("TIME");
            }
            nCountDay = (nEndTime-nStartTime)/(3600*24);
            initUrlChart(name,aMessage,nCountDay);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }

    }
    /*网站人次饼图的处理*//*输入了Url*//*统计某个url访问的用户的前五*/
    function URLaiaxPersonForPie(sURL,sStartTime,sEnd)
    {
        /*list表的初始化*/
        nGroup = 4;
        ajaxTable(sURL,"","",nGroup,sStartTime,sEnd);
       // $("#WelcomeList3").SList ("refresh", opt);///*TotalTime CategoryName value UserMAC */

        var sNowStart =  getTheDate("one","Start");
        var sNowEndTime =  getTheDate("one","end");
        var sStartTime = sStartTime || sNowStart;
        var sEnd = sEnd || sNowEndTime;
        var nStartTime = sStartTime/1000;
        var nEndTime = sEnd/1000;
          var SendMsg = {
             url: MyConfig.path+"/ant/read_dpi_url",
            dataType: "json",
            type:"post",
            data:{
                Method:'UrlTopFive',
                URL:sURL,
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,
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
            var aDate = []
            for(var i=0;i<aMessage.length;i++)
            {
                var oTemp = {};
                if(sURL == "")
                {
                    oTemp.name = aMessage[i].WebSiteName;
                }
                else
                {
                    oTemp.name = aMessage[i].UserMAC;
                }
                oTemp.value = aMessage[i].sum;
                aDate.push(oTemp);
            }
            initUrlPie(aDate);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }
    }
    function FilterFuncPie(sNowStart,sNowEndTime)
    {
        var sUrlType;
        switch (g_UrlType)
        {
            case 0:
            {
                sUrlType = "";
                break;
            }
            case 1:
            {
                sUrlType = "Entertainment";
                break;
            }
            case 2:
            {
                sUrlType = "News";
                break;
            }
            case 3:
            {
                sUrlType = "Shopping";
                break;
            }
            case 4:
            {
                sUrlType = "Computers & Technology";
                break;
            }
            case 5:
            {
                sUrlType = "Streaming Media & Downloads";
                break;
            }
            case 6:
            {
                sUrlType = "Search Engines & Portals";
                break;
            }
            case 7:
            {
                sUrlType = "Transportation";
                break;
            }
            case 8:
            {
                sUrlType = "Finance";
                break;
            }
            case 9:
            {
                sUrlType = "Unknown";
                break;
            }
            default:
                break;

        }
        if(g_MacAndUrl == 0) //没有输入URl或MAC
        {
            if(g_SelectWay == 0)
            {
                aiaxPersonForPie(sUrlType,sNowStart,sNowEndTime); //统计所有的url的访问人次前五

            }
            else
            {
                aiaxTimeForPie(sUrlType,sNowStart,sNowEndTime); //统计所有的url访问时长的前五

            }

        }
        else //输入了Url或MAC
        {
            if(g_MacAndUrl == 1) //输入MAc地址
            {
                var  sMAC =  $("#MACinput").val();
                MACaiaxTimeForPie(sMAC,sUrlType,sNowStart,sNowEndTime); //统计某个用户的所有url的在线时长的前五 不用统计人次
            }
            else
            {
                /*输入URL时 其类型已经确定 所以不用再去判断属于点击了那个类型*/
                var  sUrl =  $("#URLinput").val();
                if(g_SelectWay == 0)
                {
                    URLaiaxPersonForPie(sUrl,sNowStart,sNowEndTime); //统计某个url访问的用户的前五
                }
                else
                {
                    //URLaiaxTimeForPie(sUrl,sNowStart,sNowEndTime); //没意义
                    return;
                }
            }
        }
    }

    function FilterFuncLine(sNowStart,sNowEndTime)
    {
        var sUrlType;
        switch (g_UrlType)
        {
            case 0:
            {
               sUrlType = "";
                break;
            }
            case 1:
            {
                sUrlType = "Entertainment";
                break;
            }
            case 2:
            {
                sUrlType = "News";
                break;
            }
            case 3:
            {
                sUrlType = "Shopping";
                break;
            }
            case 4:
            {
                sUrlType = "Computers & Technology";
                break;
            }
            case 5:
            {
                sUrlType = "Streaming Media & Downloads";
                break;
            }
            case 6:
            {
                sUrlType = "Search Engines & Portals";
                break;
            }
            case 7:
            {
                sUrlType = "Transportation";
                break;
            }
            case 8:
            {
                sUrlType = "Finance";
                break;
            }
            case 9:
            {
                sUrlType = "Unknown";
                break;
            }
            default:
                break;

        }
        if(g_MacAndUrl == 0)
        {
            aiaxPersonForLine(sUrlType,sNowStart,sNowEndTime);
        }
        else
        {
            if(g_MacAndUrl == 1) //输入MAc地址
            {
                if(g_SelectWay == 0) //输入了MAC不用统计人次
                {
                    return;
                }
                var  sMAC =  $("#MACinput").val();
                /*输入MAC地址不用统计人次*/
                MACajaxTimeForLine(sMAC,sUrlType,sNowStart,sNowEndTime);
            }
            else
            {
                /*输入URL时 其类型已经确定 所以不用再去判断属于点击了那个类型*/
                var  sUrl =  $("#URLinput").val();
                URLaiaxPersonForLine(sUrl,sNowStart,sNowEndTime); //统计有多少个用户在访问此url；
            }
        }
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
                break;
            }

            case 1:
            {
                var sNowStart =  getTheDate("aweek","start");
                var sNowEndTime =  getTheDate("aweek","end");
                FilterFuncPie(sNowStart,sNowEndTime);
                break;
            }

            case 2:
            {
                var sNowStart =  getTheDate("month","start");
                var sNowEndTime =  getTheDate("month","end");
                FilterFuncPie(sNowStart,sNowEndTime);
                break;
            }

            case 3:
            {
                var sNowStart =  getTheDate("year","start");
                var sNowEndTime =  getTheDate("year","end");
                FilterFuncPie(sNowStart,sNowEndTime);
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
                break;
            }
        }
    }
    /*初始化第一张图的折线图*/
    function initLine()
    {
        if(g_SelectWay == 1)
        {
            return;//选择了时长统计折线图没意义不做处理
        }
        switch(g_SelectTime)
        {
            case 0:
            {
                var sNowStart =  getTheDate("one","start");
                var sNowEndTime =  getTheDate("one","end");
                FilterFuncLine(sNowStart,sNowEndTime);
                break;
            }
            case 1:
            {
                var sNowStart =  getTheDate("aweek","start");
                var sNowEndTime =  getTheDate("aweek","end");
                FilterFuncLine(sNowStart,sNowEndTime);
                break;
            }
            case 2:
            {
                var sNowStart =  getTheDate("month","start");
                var sNowEndTime =  getTheDate("month","end");
                FilterFuncLine(sNowStart,sNowEndTime);
                break;
            }
            case 3:
            {
                var sNowStart =  getTheDate("year","start");
                var sNowEndTime =  getTheDate("year","end");
                FilterFuncLine(sNowStart,sNowEndTime);
                break;
            }
            case 4:
            {
                var StartTime = $("#daterange").daterange("value");

                    var sNowStart = (new Date(Number(StartTime.slice(0,4)),Number(StartTime.slice(5,7))-1,Number(StartTime.slice(8,10)))).getTime();
                    var sNowEndTime = (new Date(Number(StartTime.slice(11,15)),Number(StartTime.slice(16,18))-1,Number(StartTime.slice(19,21)),24)).getTime();

                FilterFuncLine(sNowStart,sNowEndTime);
                break;
            }
            default:
                break;
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
                /*选择了饼图而且没有输入URl地址则显示全部*/
                if(g_MacAndUrl != 2)
                {
                    $("#PersonSelectWay").addClass("hide");
                    $("#TimeSelectWay").addClass("hide");
                    $("#AllSelectWay").removeClass("hide");
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

                /*选择了折线图则只统计人次*/
                $("#PersonSelectWay").removeClass("hide");
                $("#TimeSelectWay").addClass("hide");
                $("#AllSelectWay").addClass("hide");
                g_Legend = 1;
                initLine();
                break;
            }
        }
    }
    /*选择是否输入MAC和URL*/
    function InputMacOrUrl(nDate)
    {
        switch(nDate)
        {
            case 0:
            {
                g_MacAndUrl = 0;
                break;
            }
            case 1:
            {
                g_MacAndUrl = 1;
                /*这里是防止在显示的是折线图的时候输入MAC地址*/
                g_Legend = 0;
                $("#AllShowType").addClass("hide");
                $("#OneShowType").removeClass("hide");
                $("#drowline").addClass("hide");
                $("#drawpie").removeClass("hide");
                break;
            }
            case 2:
            {
                g_MacAndUrl = 2;
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
  /*选择时间过滤条件*/
    function SelectTime(nDate)
    {
        //var nDate = $(this).attr("value");
        switch(nDate)
        {
            case 0:
            {
                document.getElementById("daterange").value="选择日期";
                g_SelectTime = 0;
                break;
            }
            case 1:
            {
                document.getElementById("daterange").value="选择日期";
                g_SelectTime = 1;
                break;
            }
            case 2:
            {
                document.getElementById("daterange").value="选择日期";
                g_SelectTime = 2;
                break;
            }
            case 3:
            {
                document.getElementById("daterange").value="选择日期";
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
    /*选择Url类型*/
    function SelectUrlType()
    {
        if(g_MacAndUrl == 2)
        {
            return; /*已选择了输入网站名称 所以再点击类型没意义 所以不做处理*/
        }
        var nDate = $(this).attr("value");
        switch(nDate)
        {
            case "all":
                g_UrlType = 0;
                break;
            case "Entertainment":
                g_UrlType = 1;
                break;
            case "News":
                g_UrlType = 2;
                break;
            case "Shopping":
                g_UrlType = 3;
                break;
            case "Technologyit":
                g_UrlType = 4;
                break;
            case "Downloads":
                g_UrlType = 5;
                break;
            case "Search":
                g_UrlType = 6;
                break;
            case "Transportation":
                g_UrlType = 7;
                break;
            case "Finance":
                g_UrlType = 8;
                break;
            case "Unknown":
                g_UrlType = 9;
                break;
            default:
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
                g_SelectWay = 0;
                break;
            case "Time":
                /*选了时长 则不能有折线图显示*/
                $("#AllShowType").addClass("hide");
                $("#OneShowType").removeClass("hide");
                g_SelectWay = 1;
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
                {name: "CategoryName", datatype: "String"},
                {name: "WebSiteName", datatype: "String"},
                {name:"UserMAC",datatype:"Mac"},
                {name: "value", datatype: "Integer"},
                {name: "TotalTime", datatype: "Integer"}
            ]
        };
        $("#WelcomeList").SList ("head", opt);
        var opt1 = {
            colNames: getRcText ("WELCOME_HEAD1"),
            showHeader: true,
            search:true,
            pageSize:5,
            /*select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [
                {name: "CategoryName", datatype: "String"},
                {name: "WebSiteName", datatype: "String"},
                {name: "value", datatype: "Integer"},
                {name: "TotalTime", datatype: "Integer"}
                //{name:"UserMAC",datatype:"Mac"}
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

                //{name: "CategoryName", datatype: "String"},
                {name: "WebSiteName", datatype: "String"},
                {name: "value", datatype: "Integer"},
                {name: "TotalTime", datatype: "Integer"}
                //{name:"UserMAC",datatype:"Mac"}
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
                {name: "WebSiteName", datatype: "String"},
                //{name: "CategoryName", datatype: "String"},
                {name:"UserMAC",datatype:"Mac"},
                {name: "value", datatype: "Integer"},
                {name: "TotalTime", datatype: "Integer"}
            ]
        };
        $("#WelcomeList3").SList ("head", opt3);
        var opt4 = {
            colNames: getRcText ("WELCOME_HEAD4"),
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
        $("#WelcomeList4").SList ("head", opt4);
        var opt5 = {
            colNames: getRcText ("WELCOME_HEAD5"),
            showHeader: true,
            search:true,
            pageSize:5,
            /*select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [
                {name: "WebSiteName", datatype: "String"},
                {name: "FirstTime", datatype: "Integer"},
                {name: "LastTime", datatype: "Integer"}
            ]
        };
        $("#WelcomeList5").SList ("head", opt5);
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

            /*显示全部的Url类型*/
            $("#AllSelecttype").removeClass("hide");
            $("#OneSelecttype").addClass("hide");
            /*选择了全部，不是输入MAC  如果当前选中的是饼图 则选择方式都显示  如果当前选中的是折线图 则只能选择人次*/
            if(g_Legend == 0)
            {
                $("#PersonSelectWay").addClass("hide");
                $("#TimeSelectWay").addClass("hide");
                $("#AllSelectWay").removeClass("hide");
            }
            if(g_Legend == 1)
            {
                $("#PersonSelectWay").removeClass("hide");
                $("#TimeSelectWay").addClass("hide");
                $("#AllSelectWay").addClass("hide");
            }

            /*清除url和MAC*/
            document.getElementById("MACinput").value="用户MAC";
            document.getElementById("URLinput").value="访问网址";
            /*显示饼图  折线图两个按钮*/
            $("#AllShowType").removeClass("hide");
            $("#OneShowType").addClass("hide");
            /*取消URL和MAC显示的红框*/
            $("#MACinput").removeClass("border-red");
            $("#URLinput").removeClass("border-red");
            var value = 0;
            InputMacOrUrl(value);
        },
        searchClickMAC:function(e){
            /*取消URL显示的红框*/
            $("#URLinput").removeClass("border-red");
            /*清除输入的url*/
            document.getElementById("URLinput").value="访问网址";
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

            /*显示全部的Url类型*/
            $("#AllSelecttype").removeClass("hide");
            $("#OneSelecttype").addClass("hide");
            /*选择了输入MAC则不用统计人次，只统计时长*/
            $("#PersonSelectWay").addClass("hide");
            $("#TimeSelectWay").removeClass("hide");
            $("#AllSelectWay").addClass("hide")
            /*由于只统计时长 所以选择折线图不显示*/
            $("#AllShowType").addClass("hide");
            $("#OneShowType").removeClass("hide");


            var value = 1;
            InputMacOrUrl(value);
        },
        searchClickURL:function(e){
            /*取消MAC地址显示的红框*/
            $("#MACinput").removeClass("border-red");
            /*清除输入的MAC*/
            document.getElementById("MACinput").value="用户MAC";
            /*如果输入的网址是空，则提示 并不收回下拉框*/
            var UrlValue = $("#URLinput").val();
            if(UrlValue == ""||UrlValue == "访问网址")
            {
                $("#URLinput").addClass("border-red");
                return;
            }
            else
            {
                $("#URLinput").removeClass("border-red");
            }

            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text($("#URLinput").val());
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});

            /*选择了url则不用再选择类型*/
            $("#AllSelecttype").addClass("hide");
            $("#OneSelecttype").removeClass("hide");
            /*选择了输入Url，不是输入MAC则统计人次*/
            $("#PersonSelectWay").removeClass("hide");
            $("#TimeSelectWay").addClass("hide");
            $("#AllSelectWay").addClass("hide");
            /*显示饼图  折线图两个按钮*/
            $("#AllShowType").removeClass("hide");
            $("#OneShowType").addClass("hide");

            var value = 2;
            InputMacOrUrl(value);

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

           // otherTime();
            //$(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});
        }
    };

    function ClickInput()
    {
        document.getElementById("MACinput").value="";
        document.getElementById("URLinput").value="访问网址";
    }
    function ClickURLInput()
    {
        document.getElementById("MACinput").value="用户MAC";
        document.getElementById("URLinput").value="";
    }
   /* function otherTime()
    {
        var value = 4;
        SelectTime(value);
    }*/
    /*取消告警的红框*/
    function changeColor()
    {
        var MacValue = $("#MACinput").val();
        if((MacValue == "")||(macFormCheck(MacValue)))
        {
            $("#MACinput").removeClass("border-red");
        }
    }
    function initForm()
        {

        /*选择以饼图显示还是以折线图显示*/
        $("#ShowType").on("change",SelectShowWay);
        /*选择显示的周期*/
        $("#selectTime").on("probechange.probe",function(e, param){
            var value = param.value;
            SelectTime(value);
        });
        //$("#daterange").on("change",otherTime);


        $("#SelectType").on("change",SelectUrlType);
        /*选择人次或时长*/
        $("#SelectWay").on("change",SelectWay);

        $("#all").click(dealEvent.searchClickAll);
        $("#MACinput").on("click",ClickInput);
        $("#URLinput").on("click",ClickURLInput);
        $("#UserMAC").click(dealEvent.searchClickMAC);
        $("#Url").click(dealEvent.searchClickURL);

        /*有输入框的下拉框事件*/
        $(".choice-head").click(dealEvent.inputClick);
        $(".choice-show li").click(dealEvent.liOnClick);
        $("#body_over").click(dealEvent.blackClick);
        /*$(".search-icon").click(dealEvent.searchClick);
        $(".search-icon1").click(dealEvent.searchClick);*/
        $("#daterange").on("inputchange",dealEvent.dateChange);

    }
    function initData()
    {
        //initWelcomeUrlType();
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

