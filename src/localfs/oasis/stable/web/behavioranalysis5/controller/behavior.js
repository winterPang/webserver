define(['utils','jquery','echarts','bootstrap-daterangepicker','angular-ui-router','css!bootstrap_daterangepicker_css'], function (Utils,$scope,echarts) {
    return ['$scope', '$http', '$alertService', '$state', function ($scope, $http,FRAME) {
        var g_daterange = "";
        var g_nEndTime = 0;
        var g_nStartTime = 0;
        var g_strStartDate = "";
        var g_strEndDate = "";
        var g_strTime = "";
        var g_strMethod = "";
        var g_selectMethod = "Flow";
        var g_strMac = "";
        var con_devSN = $scope.sceneInfo.sn;
        var con_Time = ["aDay", "aWeek", "aMonth", "aYear", "otherTime"];
        var con_MacWarnInfo = getRcString("MAC-WARN");
        var bLang = Utils.getLang();
        var oDaterangeCN = {
            locale : {
            applyLabel : getRcString("APPLY"),
            cancelLabel: getRcString("CANCEL"),
            daysOfWeek : getRcString("WEEK").split(','),  
            monthNames : getRcString("MONTH").split(",")
        }};

        var app_dpiUrl = Utils.getUrl('POST', '', '/ant/read_dpi_app', '/init/log/app_dpi_pie.json');
        //console.log(app_dpiUrl,"app_dpiUrl");
        var networkUrl = Utils.getUrl('POST', '', '/ant/read_dpi_url', '/init/log/network_pie.json');

        $scope.strToday = new Date().getDate();
        $scope.showMac = true;
        $scope.TotalFlow = 0;
        $scope.UpFlow = 0;
        $scope.DownFlow = 0;
        $scope.DropFlow = 0;
        $scope.show_cycle = false;
        $scope.show_other = false;
        $scope.totalNum = 0;
        $scope.activeNum = 0;
        $scope.in_activeNum = 0;
        $scope.associatedNum = 0;
        $scope.in_associatedNum = 0;
        
        $scope.showSelectTime = function() {
            $scope.show_cycle = !$scope.show_cycle;
        };

        $scope.showOtherTime = function(strTime) {
            $scope.show_other = true;
        };

        $scope.hideOtherTime = function() {
            $scope.show_other = false;
        };

        function getRcString(attrName){
            return Utils.getRcString("dpi_behavior_rc",attrName);
        }

        //只有g_daterange改变时才刷新页面  apply事件是为了第一次点击时的刷新页面
        $('#daterange').daterangepicker(oDaterangeCN, function(start, end, label) {
            g_strStartDate = start.format('YYYY/MM/DD');
            g_strEndDate = end.format('YYYY/MM/DD');
            g_daterange = g_strStartDate + ' - ' + g_strEndDate;
            
            $scope.selectTime = '（' + g_daterange + '）';
            $scope.initViewsByTime("otherTime");
        }).on('apply.daterangepicker', function(e, date) {
            g_strStartDate = date.startDate.format('YYYY/MM/DD')
            g_strEndDate = date.endDate.format('YYYY/MM/DD');
            var strDaterange = g_strStartDate + ' - ' + g_strEndDate;
            //选择相同日期 不刷新页面
            if(strDaterange == g_daterange) {
                return;
            }
            g_daterange = strDaterange;
           
            $scope.selectTime = '（' + g_daterange + '）';
            $scope.initViewsByTime("otherTime");
        });

        //获得自定义时间
        function getOtherRangeTime() {
            var nStartYear  = Number(g_strStartDate.slice(0, 4));
            var nStartMonth = Number(g_strStartDate.slice(5, 7)) - 1;
            var nStartDay   = Number(g_strStartDate.slice(8));
            var nEndYear  = Number(g_strEndDate.slice(0, 4));
            var nEndMonth = Number(g_strEndDate.slice(5, 7)) - 1;
            var nEndDay   = Number(g_strEndDate.slice(8));
            var nDayTime  = 24 * 60 * 60;

            g_nStartTime = parseInt((new Date(nStartYear, nStartMonth, nStartDay)).getTime());
            g_nEndTime   = parseInt((new Date(nEndYear, nEndMonth, nEndDay)).getTime() + nDayTime * 1000);
        }
        //获得开始时间 和 结束时间
        function getRangeTime(strTime) {
            var nHourTime = 60 * 60 * 1000;
            var nDayTime = 24 * nHourTime;
            var nWeekTime = 7 * nDayTime;
            var nMonthTime = 30 * nDayTime;
            var nYearTime = 365 * nDayTime;
            var strCurrentDate = new Date().toLocaleDateString();
            var nTodayZeroTime = new Date(strCurrentDate).getTime() - 0; 


            var oDate=new Date();
            var tNow=oDate.getTime();
            oDate.setHours(0);
            oDate.setMinutes(0);
            oDate.setSeconds(0);
            var tNowBefore=oDate.getTime();

            g_nEndTime = tNow-0;

            switch(strTime) {
                case con_Time[0]: {
                    g_nStartTime = tNowBefore;
                    break;
                }
                case con_Time[1]: {
                    g_nStartTime = tNowBefore - nWeekTime;
                    break;
                }
                case con_Time[2]: {
                    g_nStartTime = tNowBefore - nMonthTime;
                    break;
                }
                case con_Time[3]: {
                    g_nStartTime = tNowBefore - nYearTime;
                    break;
                }
                case con_Time[4]: {
                    getOtherRangeTime();
                    break;
                }
                default: {
                    console.log("Select time range error");
                    break;
                }
            }
        }
        //中间点距离上边高度， 行高， 数量， 最小上边距
        function topChange(top, lineHeight, sum, mixTop) {
            if(mixTop != undefined) {
                if(top - sum * lineHeight / 2 < mixTop) {
                    return mixTop;
                }
            }
            return parseInt(top - sum * lineHeight / 2);
        }
        //设置饼图右侧的legend
        function setPieLegend(aData, aColor, strId) {
            var strHtml = "";
            var sum = 0;
            var startDiv = "<div class='leg-row'>"
            var endDiv = "</div>"
            var oTmp = $("#" + strId);

            if(!aData.length) {
                oTmp.html(strHtml);
                return;
            }

            for(var i = 0; i < aData.length; i++) {
                aData[i].value = Number(aData[i].value);
                sum += aData[i].value;
            }

            for(var i = 0; i < aData.length; i++) {
                strHtml += startDiv +  "<span class='leg-icon' style=" + "'"+ "background:" + aColor[i] + "'" + ">" + "</span>";
                strHtml += "<span class='leg-title' title=" + "'" + aData[i].name + "'" + ">" + aData[i].name + "</span>";
                strHtml += "<span class='leg-percent'>" + (aData[i].value / sum * 100).toFixed(0) + "%" + "</span>" + endDiv; 
            }

            oTmp.css("top", topChange(180, 31, aData.length, 50));
            oTmp.html(strHtml);
        }
        //最受欢迎的应用类别饼图option
        function drawWecomAppPie(aData) {
            var aColor = ['#0195D7','#53B9E7', '#31ADB4', '#69C4C5','#92C888', '#FFBB33','#FF8800','#CC324B'];
            for(var i = 0; i < aData.length; i++) {
                if("cn" === bLang && aData[i].name != "")
                {
                    aData[i].name = aData[i].APPNameCN;
                    aData[i].value=aData[i].TotalBytes||aData[i].Count;
                }else{
                    aData[i].name=aData[i].APPName;
                    aData[i].value=aData[i].TotalBytes||aData[i].Count;
                }
            }

            if(!aData.length) {
                var option = {
                    calculable : false,
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
                    ],
                    color: ['#F5F5F5']
                };
            }
            else{
                var option = {
                    tooltip : {
                        trigger: 'item',
                        formatter: " {b}: {d}%"
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
                    ],
                    color : aColor,
                };
            }

            setPieLegend(aData, aColor, "App_message");

            var oInfoPie = echarts.init(document.getElementById("App_pie"));
            oInfoPie.setOption(option);
        }
        //最受欢迎的网站类别饼图的option
        function drawWecomNetworkPie(aData) {
            var aColor = ['#0195D7','#53B9E7', '#31ADB4', '#69C4C5','#92C888', '#FFBB33','#FF8800','#CC324B','#91B2D2','#D7DDE4'];
            if(!aData.length) {
                var option = { 
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
                    ],
                    color: ['#F5F5F5']
                };
            }
            else {
                aData.splice(8);
                for(var i=0;i<aData.length;i++){
                    aData[i].name=aData[i]._id;
                    aData[i].value=aData[i].Count;
                }
                var option = {
                    height:220,
                    width: 560,
                    tooltip : {
                        trigger: 'item',
                        formatter: " {b}: {d}%"
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
                    ],
                    color: aColor
                };
            }

            setPieLegend(aData, aColor, "Url_message");

            var oInfoPie = echarts.init(document.getElementById("Url_pie"));
            oInfoPie.setOption(option);
        }

        function showNumByUnit(nFlow) {
            var strFlow = "";
            var nKb = 1024;
            var nMb = nKb * 1024;
            var nGb = nMb * 1024;
            var nTb = nGb * 1024;
            var nHb = nTb * 1024;

            if(0 <= nFlow && nFlow < nMb){
                strFlow = (nFlow / nKb).toFixed(2) + "KB";
            }
            else if(nMb <= nFlow && nFlow < nGb) {
                strFlow = (nFlow / nMb).toFixed(2) + "MB";
            } 
            if(nGb <= nFlow && nFlow < nTb ) {
                strFlow = (nFlow / nGb).toFixed(2) + "GB";
            } 
            if(nTb <= nFlow) {
                strFlow = (nFlow / nTb).toFixed(2) + "TB";
            }
            if(nHb <= nFlow) {
                strFlow = (nFlow / nHb).toFixed(2) + "PB";
            }

            return strFlow;
        }

        function drawStatisticFlowPie(aUserUp,aUserDown) { 
            var nFlowUpNum = Number(aUserUp.UpBytes || 0);
            var nFlowDownNum = Number(aUserDown.DownBytes || 0);
            var nFlowNum  =  nFlowUpNum + nFlowDownNum;
            var nDropFlowNum = Number(aUserDown.DownDropBytes || 0) + Number(aUserUp.UpDropBytes || 0);
            var aFlowName = getRcString("FLOWNAME").split(",");

            $scope.TotalFlow = showNumByUnit(nFlowNum);
            $scope.UpFlow    = showNumByUnit(nFlowUpNum);
            $scope.DownFlow  = showNumByUnit(nFlowDownNum);
            $scope.DropFlow  = showNumByUnit(nDropFlowNum);

            if(!nFlowUpNum && !nFlowDownNum && !nDropFlowNum) {
                var option = {
                    tooltip : {
                        show:false
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : 80,
                            center: ['50%', '50%'],
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
                    ],
                    color: ['#F5F5F5']
                };
            }
            else {
                var aValue=[
                    {value: nFlowUpNum, name: aFlowName[0]},
                    {value: nFlowDownNum, name: aFlowName[1]},
                    {value: nDropFlowNum, name: aFlowName[2]},
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
                var option = {
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
                    ],
                    color: ['#0096d6','#31A9DC','#7BC7E7']
                };
            }

            var oInfoPie = echarts.init(document.getElementById("totalflowup"));
            oInfoPie.setOption(option);
        }
        
        function drawStatisticFlowChart(aUpFlow, aDownFlow, aDropFlow, aTime, CountDay) {
            var unit=0;
            var Bandwidth = new Array("Byte","KB", "MB", "GB", "TB");
            var aData1=[];
            var aData2=[];
            var aData3=[];
            for(var i=0;i<aUpFlow.length;i++){
                aData1.push(aUpFlow[i]);
                aData2.push(aDownFlow[i]);
                aData3.push(aDropFlow[i]);
            }
            aData1.sort(function(n,m){
                return m-n;
            });
            aData2.sort(function(n,m){
                return m-n;
            });
            aData3.sort(function(n,m){
                return m-n;
            });
            while(aData1[0]>1024||aData2[0]>1024||aData3[0]>1024){
                aData1[0]=aData1[0]/1024;
                aData2[0]=aData2[0]/1024;
                aData3[0]=aData3[0]/1024;
                for(var i=0;i<aUpFlow.length;i++){
                    //aUpFlow[i]=parseInt(aUpFlow[i]/1024);
                    //aDownFlow[i]=parseInt(aDownFlow[i]/1024);
                    //aDropFlow[i]=parseInt(aDropFlow[i]/1024);
                    aUpFlow[i]=(aUpFlow[i]/1024).toFixed(2);
                    aDownFlow[i]=(aDownFlow[i]/1024).toFixed(2);
                    aDropFlow[i]=(aDropFlow[i]/1024).toFixed(2);
                }
                unit++;
            }
            //console.log(aData1,unit,"unit",aUpFlow,aDownFlow,aDropFlow);
            var flowFlag = 0;
            var sTarffic = getRcString("TRAFFICMB");
            var aShowTime = getRcString("SHOWTIME").split(",");
            var aFlowName = getRcString("FLOWNAME").split(",");
            var option = {
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
                    data: aFlowName,
                    textStyle:{color:"gray"}
                },
                dataZoom:{},
                grid: { x:60, y:50, x2:30, y2:75, borderColor: '#FFF'},
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        splitLine:false,
                        name: aShowTime[1], 
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
                        data: aTime
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: Bandwidth[unit],
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
                        name: aFlowName[0],
                        data: aUpFlow
                    },
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aFlowName[1],
                        data: aDownFlow
                    },
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: aFlowName[2],
                        data: aDropFlow
                    }, 
                ],
                color: ['#0096d6','#31A9DC','#62BCE2'],
            };

            if(CountDay > 30) {
                var dataZoom = {
                    show: true, realtime: true, start: 60, end: 80
                };
                option.dataZoom = dataZoom;
            }

            if(1 == CountDay) {
                option.xAxis[0].name = aShowTime[0];
            }

            for(var i = 0 ; i < aUpFlow.length; i++) {
                if(aUpFlow[i] != 0 || aDropFlow[i] != 0 || aDownFlow[i] != 0) {
                    flowFlag = 1;
                    break;
                }
            }
            
            if(!flowFlag) {
                option.color = ['#FFFFFF','#FFFFFF','#FFFFFF'];
            }

            var oInfoChart = echarts.init(document.getElementById("UserFlow_chart"));
            oInfoChart.setOption(option);
        }

        function httpWecomAppByFlow() {
            g_strMethod = "WelComeAppFlowWay";
            var paramData={
                method: "getAppFlowTop10",
                param:{
                    family:"0",
                    ACSN: con_devSN,
                    startTime: g_nStartTime,
                    endTime: g_nEndTime
                }
            };
            if(g_strMac){
                paramData.param.userMAC=g_strMac;
            }
            console.log("g_strMac",g_strMac);
            $http({
                url: "/v3/ant/read_dpi_app",
                method: "POST",
                data:paramData
            }).success(function(data,header,config,status) { 
                var adata = data.message || [];
                drawWecomAppPie(adata);
            }).error(function(data,header,config,status) {
                console.log("Show app flow pie error!");
            });
        }

        function httpWecomAppByMantime() {
            g_strMethod = "WelComeApp";
            var paramData={
                "method": "getAppCountTop10",
                "param":{
                    ACSN: con_devSN,
                    family: 0,
                    startTime: g_nStartTime,
                    endTime: g_nEndTime
                }
            };
            if(g_strMac){
                paramData.param.userMAC=g_strMac;
            }
            $http({
                url: "/v3/ant/read_dpi_app",
                method: "POST",
                dataType:"json",
                data:paramData
            }).success(function(data,header,config,status) {
                //console.log(data,"app top10");
                var adata = data.message || [];
                drawWecomAppPie(adata);
            }).error(function(data,header,config,status) {
                console.log("Show app mantime pie error!");
            });
        }

        function httpWecomAppByMac() {
            if("Flow" == g_selectMethod) {
                g_strMethod = "getAppFlowTop10";
            }
            else {
                g_strMethod = "getAppCountTop10";
            }

            $http({
                url: "/v3/ant/read_dpi_app",
                method: "POST",
                data:{
                    method: g_strMethod,
                    param:{
                        family:"0",
                        ACSN: con_devSN,
                        startTime: g_nStartTime,
                        endTime: g_nEndTime,
                        userMAC:g_strMac
                    }
                }
            }).success(function(data,header,config,status) { 
                var adata = data.message || [];
                drawWecomAppPie(adata);
            }).error(function(data,header,config,status) {
                console.log("Show app MAC pie error!");
            });
        }

        function httpNetworkByFlow() {

            $http({
                url: "/v3/ant/read_dpi_url",
                method: "POST",
                data:{
                    method: "getUrlTop10",
                    param:{
                        ACSN: con_devSN,
                        family: 0,
                        startTime: g_nStartTime,
                        endTime: g_nEndTime,
                    }
                }
            }).success(function(data,header,config,status) {
                //console.log("url前十",data);
                var adata = data.message || []; 
                drawWecomNetworkPie(adata);
            }).error(function(data,header,config,status) {
                console.log("Show app flow pie error!");
            });
        }

        function httpNetworkByMac() {
            //g_strMethod = "WelComeUrlMac";

            $http({
                url: "/v3/ant/read_dpi_url",
                method: "POST",
                data:{
                    method: "getUrlTop10",
                    param:{
                        family:"0",
                        ACSN: con_devSN,
                        startTime: g_nStartTime,
                        endTime: g_nEndTime,
                        userMAC:g_strMac
                    }
                }
            }).success(function(data,header,config,status) {
                //console.log("mac网站top10",data);
                var adata = data.message || [];
                drawWecomNetworkPie(adata);
            }).error(function(data,header,config,status) {
                console.log("Show app flow pie error!");
            });
        }

        function httpTotalStatisticFlowForPie() {
            g_strMethod = "GetFlow";

            $http({
                url: "/v3/ant/read_dpi_app",
                method: "POST",
                dataType:"json",
                data:{
                    "method": "getAppFlowStatistic",
                    "param":{
                        ACSN: con_devSN,
                        family: 0,
                        startTime: g_nStartTime,
                        endTime: g_nEndTime,
                    }
                }
            }).success(function(data,header,config,status) {
                //console.log("流量详情",data);
                var oData = data.message || "";

                drawStatisticFlowPie(oData || "", oData || "");
            }).error(function(data,header,config,status) {
                console.log("Show tatal statistic flow pie error!");
            });
        }

        function httpStatisticFlowByMac() {
            g_strMethod = "GetFlow";

            $http({
                url: "/v3/ant/read_dpi_app",
                method: "POST",
                dataType:"json",
                data:{
                    "method": "getAppFlowStatistic",
                    "param":{
                        ACSN: con_devSN,
                        family: 0,
                        startTime: g_nStartTime,
                        endTime: g_nEndTime,
                        userMAC:g_strMac
                    }
                }
            }).success(function(data,header,config,status) { 
                var oData = data.message || "";
                drawStatisticFlowPie(oData || "", oData || "");
            }).error(function(data,header,config,status) {
                console.log("Show statistic flow by MAC pie error!");
            });
        }

        function httpTotalStatisticFlowForChartMac() {
            //g_strMethod = "GetFlowChart";
            var nHour = new Date().getHours();

            $http({
                url: "/v3/ant/read_dpi_app",
                method: "POST",
                data:{
                    method: "getAppFlowTrend",
                    param:{
                        family:"0",
                        ACSN: con_devSN,
                        startTime: g_nStartTime,
                        endTime: g_nEndTime,
                        userMAC:g_strMac
                    }
                }
            }).success(function(data,header,config,status) {
                //console.log("折线图",data);
                var oData = data.message || "";
                var aUpFlow = new Array(data.message.length);
                var aDownFlow = new Array(data.message.length);
                var aDropFlow = new Array(data.message.length);
                var aTime = new Array(data.message.length);

                //console.log(aUpFlow,aDownFlow,aTime);

                for(var i=0;i<oData.length;i++){
                    aUpFlow[i] = oData[i].UpBytes || "";
                    aDownFlow[i] = oData[i].DownBytes || "";
                    aDropFlow[i] = oData[i].UpDropBytes + oData[i].DownDropBytes || "";
                    aTime[i] = oData[i].Time || "";
                }

                var OneDayHour = 24;
                var nTime = (g_nEndTime - g_nStartTime) / (3600 * 1000);

                if(nTime <= OneDayHour) {
                    for(var i = 0; i < aTime.length; i++) {
                        aTime[i] = new Date(aTime[i]);
                        aTime[i] = (aTime[i].toTimeString()).slice(0,5);
                    }
                    drawStatisticFlowChart(aUpFlow, aDownFlow, aDropFlow, aTime, 1);
                }
                if(nTime > OneDayHour) {
                    for(var i = 0; i < aTime.length; i++) {
                        aTime[i] = new Date(aTime[i]);
                        aTime[i] = (aTime[i].toLocaleDateString()).slice(5);
                    }
                    var nDATA = nTime / OneDayHour;
                    drawStatisticFlowChart(aUpFlow, aDownFlow, aDropFlow, aTime, nDATA);
                }
            }).error(function(data,header,config,status) {
                console.log("Show tatal statistic flow chart error!");
            });
        }

        function httpTotalStatisticFlowForChart() {
            //g_strMethod = "GetFlowChart";
            var nHour = new Date().getHours();

            $http({
                url: "/v3/ant/read_dpi_app",
                method: "POST",
                data:{
                    method: "getAppFlowTrend",
                    param:{
                        family:"0",
                        ACSN: con_devSN,
                        startTime: g_nStartTime,
                        endTime: g_nEndTime,
                    }
                }
            }).success(function(data,header,config,status) {
                //console.log("折线图",data);
                var oData = data.message || "";
                var aUpFlow = new Array(data.message.length);
                var aDownFlow = new Array(data.message.length);
                var aDropFlow = new Array(data.message.length);
                var aTime = new Array(data.message.length);

                //console.log(aUpFlow,aDownFlow,aTime);

                for(var i=0;i<oData.length;i++){
                    aUpFlow[i] = oData[i].UpBytes || "";
                    aDownFlow[i] = oData[i].DownBytes || "";
                    aDropFlow[i] = oData[i].UpDropBytes + oData[i].DownDropBytes || "";
                    aTime[i] = oData[i].Time || "";
                }

                var OneDayHour = 24;
                var nTime = (g_nEndTime - g_nStartTime) / (3600 * 1000);
                    
                if(nTime <= OneDayHour) {
                    for(var i = 0; i < aTime.length; i++) {
                        aTime[i] = new Date(aTime[i]);
                        aTime[i] = (aTime[i].toTimeString()).slice(0,5);
                    }
                    drawStatisticFlowChart(aUpFlow, aDownFlow, aDropFlow, aTime, 1);
                }
                if(nTime > OneDayHour) {
                    for(var i = 0; i < aTime.length; i++) {
                        aTime[i] = new Date(aTime[i]);
                        aTime[i] = (aTime[i].toLocaleDateString()).slice(5);
                    }
                    var nDATA = nTime / OneDayHour;
                    drawStatisticFlowChart(aUpFlow, aDownFlow, aDropFlow, aTime, nDATA);
                }
            }).error(function(data,header,config,status) {
                console.log("Show tatal statistic flow chart error!");
            });
        }

        $scope.initViewsByTime = function(strTime) {
            var aTime = getRcString("CYCLE-TIME").split(",");
            g_strTime = strTime;
 
            if("otherTime" != strTime) {
                $scope.hideOtherTime();
                g_daterange = "";
            }


            switch(strTime) {
                case "aDay": {
                    $scope.selectTime = aTime[0];
                    break;
                }
                case "aWeek": {
                    $scope.selectTime = aTime[1];
                    break;
                }
                case "aMonth": {
                    $scope.selectTime = aTime[2];
                    break;
                }
                case "aYear": {
                    $scope.selectTime = aTime[3];
                    break;
                }
                case "otherTime": {
                    break;
                }
                default: {
                    break;
                }
            }

            if(!isValidMac()) {
                return;
            }

            getRangeTime(strTime);
            showViewByMac();
        };

        /*mac输入*/
        function showViewByMac() {
            if(g_strMac) {
                httpWecomAppByMac();
                httpNetworkByMac();
                httpStatisticFlowByMac();
                httpTotalStatisticFlowForChartMac();
            } else {
                showWecomAppByDiffMethod();
                httpNetworkByFlow();
                httpTotalStatisticFlowForPie();
                httpTotalStatisticFlowForChart();
            }
        }
        //刷新按钮影响所有视图
        $scope.refreshViews = function() {
            if(isValidMac()) {
                getRangeTime(g_strTime);
                showViewByMac();
            }
        };

        function isValidMac() { 
            var strMac = $scope.macMobile;
            var strTestMac = /^[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}$/;

            if($scope.showMac && strMac && !strTestMac.test(strMac)) {
                $scope.macWarning = con_MacWarnInfo;
                return false;
            }

            $scope.macWarning = "";
            g_strMac = strMac;
            return true;
        }

        //mac地址的选择影响所有饼图pie 不影响折线图；只有方式选择的是“流量”时，mac地址才会显现
        $scope.keyUpEvent = function() {
            var nKey = event.keyCode;
            var strMac = $scope.macMobile;
            var strTestMac = /^[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}$/;
            
            if(13 != nKey) {
                return;
            }

            if(strMac && !strTestMac.test(strMac)) {
                $scope.macWarning = con_MacWarnInfo;
                return;
            }

            $scope.macWarning = "";
            g_strMac = strMac;
            getRangeTime(g_strTime);
            showViewByMac();
        };

        function showWecomAppByDiffMethod() {
            //console.log(g_selectMethod,"选择");
            if("Flow" == g_selectMethod) {
                httpWecomAppByFlow();
            }
            else {
                httpWecomAppByMantime();
            }
        }
        //选择“方式”只影响  最受欢迎的应用饼图pie
        $scope.getShowWecomAppMethod = function(strSelectMethod) {
            g_selectMethod = strSelectMethod;
            //只有方式选择的是“流量”时，mac地址才会显现
            //$scope.showMac = ("Flow" == g_selectMethod) ? true : false;
            getRangeTime(g_strTime);

            //$scope.macMobile = "";
            $scope.macWarning = "";
            //if(g_strMac) {
            //    //g_strMac = "";
            //
            //    httpNetworkByFlow();
            //    httpTotalStatisticFlowForPie();
            //}
            showWecomAppByDiffMethod();
        };

        $scope.initViewsByTime("aDay");
    }];
});