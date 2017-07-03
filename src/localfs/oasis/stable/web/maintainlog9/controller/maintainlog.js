define(['jquery','utils','echarts','angular-ui-router','bootstrap-daterangepicker','bsTable','css!bootstrap_daterangepicker_css'],function($scope,Utils,echarts) {
    return ['$scope', '$http','$state','$window',function($scope,$http,$state,$window){
        var g_daterange = "";
        var g_strStartDate = "";
        var g_strEndDate = "";
        var g_msgChart = [];
        var startTime;
        var endTime;
        var g_oLevel = {"nCrit":0,"nError":0,"nWarn":0,"nCommon":0};
        var g_strTime = "aDay";
        var con_Time = ["aDay", "aWeek", "aMonth", "aYear", "otherTime"];
        var con_level = ["Severe", "Mistake", "Warning", "Common"];
        var con_module = ["Command Helper",];
        var con_moduleName = getRcString("MODULE-NAME").split(",");
        var con_legend = getRcString("LEGEND").split(",");
        var con_devSN = $scope.sceneInfo.sn;
        var oDaterangeCN = {
            locale : {  
            applyLabel : getRcString("APPLY"),
            cancelLabel: getRcString("CANCEL"),
            daysOfWeek : getRcString("WEEK").split(','),
            monthNames : getRcString("MONTH").split(","),
        }};
        
        $scope.show_cycle = false;
        $scope.show_other = false;
        $scope.strToday = new Date().getDate();
        $scope.totalNum = 0;
        $scope.critNum = 0;
        $scope.errorNum = 0;
        $scope.warnNum = 0;
        $scope.commonNum = 0;

        var logChartUrl = Utils.getUrl('POST', '', '/ant/read_logmgr', '/init/log/log_info_chart.json');
    
        function getRcString(attrName) {
            return Utils.getRcString("log_rc",attrName);
        }

        function dealTimeByTen(nNum) {
            return Number(nNum) < 10 ? ('0' + nNum) : nNum;
        }

        function dealTimeFun(nTmpDate){
            var oDate = new Date(nTmpDate);
            var nYear = oDate.getFullYear();
            var nMonth = dealTimeByTen(oDate.getMonth() + 1);
            var nDate = dealTimeByTen(oDate.getDate());
            var nHours = dealTimeByTen(oDate.getHours());
            var nMinutes = dealTimeByTen(oDate.getMinutes());
            var nSeconds = dealTimeByTen(oDate.getSeconds());

            return nYear + '/' + nMonth + '/' + nDate + ' ' + nHours + ':' + nMinutes + ':' + nSeconds;
        }

        function initTodayLogTable(LogMsg) {
            var listLogMsg = [];
            var nOneDay = 24 * 3600 * 1000;
            var nOneHours = 3600 * 1000;
            var nHOURS = 24;

            if("aDay" == g_strTime) {
                var tNow = new Date();
                var nYear = tNow.getFullYear();
                var nMonth = tNow.getMonth();
                var nDay = tNow.getDate();

                var nEndTime = new Date(nYear,nMonth,nDay,24).getTime();
            }
            else if("otherTime" == g_strTime) {
                var tNow = new Date(g_strStartDate);
                nEndTime = tNow.getTime() + nOneHours * nHOURS;
            }

            for(var i = 0; i < LogMsg.length; i++) {
                var dataTimeStamp = LogMsg[i].stamp * 1000;

                if( (dataTimeStamp > nEndTime - nOneDay) && (dataTimeStamp <= nEndTime)) {
                    delete LogMsg[i].id;
                    LogMsg[i].stamp = dealTimeFun(Number(LogMsg[i].stamp) * 1000);
                    setTableData(LogMsg[i]);
                    listLogMsg.push(LogMsg[i]);
                }
            }

            $scope.$broadcast('load#logInfoTable', listLogMsg);
        }

        function initLogTable(LogMsg) {
            var listLogMsg =[];
            var nDATA = 0;
            var nOneDay = 24 * 3600 * 1000;

            if("aWeek" == g_strTime) {
                nDATA = 7;
            }
            else if("aMonth" == g_strTime) {
                nDATA = 30;
            }
            else if("aYear" == g_strTime) {
                nDATA = 365;
            }

            var tNow = new Date();
            if("aWeek" == g_strTime || "aMonth" == g_strTime || "aYear" == g_strTime) {
                var nYear = tNow.getFullYear();
                var nMonth = tNow.getMonth();
                var nDay = tNow.getDate();

                var nEndTime = new Date(nYear,nMonth,nDay,24).getTime();
            }
            if("otherTime" == g_strTime) {
                var tEndTime = new Date(g_strEndDate);
                var tStartTime = new Date(g_strStartDate);
                var nEndTime = tEndTime.getTime() + nOneDay;

                nDATA = (tEndTime.getTime() - tStartTime.getTime()) / nOneDay + 1;
            }

            for(var i=0;i<LogMsg.length;i++) {
                var dataTimeStamp = LogMsg[i].stamp * 1000;

                if((dataTimeStamp >= nEndTime - nOneDay * nDATA) && (dataTimeStamp <= nEndTime)) {
                    delete LogMsg[i].id;
                    LogMsg[i].stamp = dealTimeFun(Number(LogMsg[i].stamp) * 1000);
                    setTableData(LogMsg[i]);
                    listLogMsg.push(LogMsg[i]);
                }
            }

            $scope.$broadcast('load#logInfoTable', listLogMsg);
        }

        function setTableData(oLogMsg) {
            switch(oLogMsg.level) {
                case con_level[0]: {
                    oLogMsg.level = con_legend[0];
                    break;
                }
                case con_level[1]: {
                    oLogMsg.level = con_legend[1];
                    break;
                }
                case con_level[2]: {
                    oLogMsg.level = con_legend[2];
                    break;
                }
                case con_level[3]: {
                    oLogMsg.level = con_legend[3];
                    break;
                }
                default: {
                    break;
                }
            }

            switch(oLogMsg.module) {
                case con_module[0]: {
                    oLogMsg.module = con_moduleName[0];
                    break;
                }
            }
        }

        function initOtherLogTable(LogMsg) {
            if(g_strStartDate == g_strEndDate) {
                initTodayLogTable(LogMsg);
            }
            else {
                initLogTable(LogMsg);
            }
        }

        function initTodayChartLine(LogMsg) {
            var nHOURS = 24;
            var nOneHours = 3600 * 1000;
            var aFlowOptTime = [];
            var oLevel = [];

            var oData = {};
            oData.crit = [];
            oData.warn = [];
            oData.common = [];
            oData.error = [];

            if("aDay" == g_strTime) {
                var tNow = new Date();
                var nYear = tNow.getFullYear();
                var nMonth = tNow.getMonth();
                var nDay = tNow.getDate();

                tNow = new Date(nYear,nMonth,nDay,24).getTime();
            }
            else if("otherTime" == g_strTime) {
                var tNow = new Date(g_strStartDate);
                tNow = tNow.getTime() + nOneHours * nHOURS;
            }

            for(var i = 0;i < nHOURS; i++) {
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
                        if(LogMsg[j].level == con_level[0] )
                        {
                            oData.crit[i-1] +=1;
                            g_oLevel.nCrit++;
                        }
                        else if(LogMsg[j].level == con_level[2] )
                        {
                            oData.warn[i-1] +=1;
                            g_oLevel.nWarn++;
                        }
                        else if(LogMsg[j].level == con_level[3] )
                        {
                            oData.common[i-1] +=1;
                            g_oLevel.nCommon++;
                        }
                        else if(LogMsg[j].level == con_level[1] )
                        {
                            oData.error[i-1] +=1;
                            g_oLevel.nError++;
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

            drawStatisticsChart(aFlowOptTime, oData);
        }
        /*显示折线图 */
        function initLogChartLine(LogMsg) {
            var nDATA = 0;
            var nOneDay = 24 * 3600 * 1000;
            var aFlowOptTime = [];
            var oLevel = [];
            var tNow = new Date();
            var nYear = tNow.getFullYear();
            var nMonth = tNow.getMonth();
            var nDay = tNow.getDate();

            var oData = {};
            oData.crit = [];
            oData.warn = [];
            oData.common = [];
            oData.error = [];

            if("aWeek" == g_strTime) {
                nDATA = 7;
            }
            else if("aMonth" == g_strTime) {
                nDATA = 30;
            }
            else if("aYear" == g_strTime) {
                nDATA = 365;
            }

            if("aWeek" == g_strTime || "aMonth" == g_strTime || "aYear" == g_strTime) {
                tNow = new Date(nYear,nMonth,nDay,24).getTime();
            }
            else if("otherTime" == g_strTime) {
                var tEndTime = new Date(g_strEndDate);
                var tStartTime = new Date(g_strStartDate);

                nDATA = (tEndTime.getTime() - tStartTime.getTime()) / nOneDay + 1;
                tNow = tEndTime.getTime() + nOneDay;
            }

            nDATA += 1;
            for(var i = 0; i < nDATA; i++) {
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
                        if(LogMsg[j].level == con_level[0])
                        {
                            oData.crit[i-1] +=1;
                            g_oLevel.nCrit++;
                        }
                        else if(LogMsg[j].level == con_level[2])
                        {
                            oData.warn[i-1] +=1;
                            g_oLevel.nWarn++;
                        }
                        else if(LogMsg[j].level == con_level[3])
                        {
                            oData.common[i-1] +=1;
                            g_oLevel.nCommon++;
                        }
                        else if(LogMsg[j].level == con_level[1])
                        {
                            oData.error[i-1] +=1;
                            g_oLevel.nError++;
                        }
                    }
                }
            } 

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

            drawStatisticsChart(aFlowOptTime, oData);
        }

        function initOtherChartLine(LogMsg) {
            if(g_strStartDate == g_strEndDate) {
                initTodayChartLine(LogMsg);
            }
            else{
                initLogChartLine(LogMsg);
            }
        }

        function initHeadNum() {
            $scope.totalNum = g_oLevel.nCrit + g_oLevel.nError + g_oLevel.nWarn + g_oLevel.nCommon;
            $scope.critNum = g_oLevel.nCrit;
            $scope.errorNum = g_oLevel.nError;
            $scope.warnNum = g_oLevel.nWarn;
            $scope.commonNum = g_oLevel.nCommon;
        }

        function httpStatisticsChart(strTime) { 
            var nowTime=Date.parse( new Date())/1000;
            switch(g_strTime) {
                    case "aDay": {
                        startTime='';
                        endTime='';
                        break;
                    }
                    case "aWeek": {
                        endTime=nowTime;
                        startTime=nowTime-7*24*3600;  
                        break;
                    }
                    case "aMonth": {
                        endTime=nowTime;
                        startTime=nowTime-30*24*3600;
                        break;
                    }
                    case "aYear": {
                        endTime=nowTime;
                        startTime=nowTime-365*24*3600;
                        break;
                    }
                    case "otherTime": {
                        break;
                    }
                    default: {
                        break;
                    }
                }
            $http({
                url:logChartUrl.url, 
                method:logChartUrl.method,
                data:{
                    method:"getLog",
                    scenarioId:$scope.sceneInfo.nasid,
                    startTime:startTime,
                    endTime:endTime,
                    ret:[]
                }
            }).success(function(data,header,config,status) {
                successLogChart(data);
            }).error(function(data,header,config,status) {
                console.log("Show attack information list error!");
            });
            function successLogChart(data) {
                var message = data.message || [];
                if(data.message){
                    $http.get('/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/'+$scope.sceneInfo.nasid)
                        .success(function(allData){
                            if(allData.data&&(allData.code==0)){
                                $.each(data.message,function(i,val){
                                    $.each(allData.data[0].devices,function(j,jval){
                                        if(val.devSn==jval.devSN){
                                            val.devAlias =jval.devAlias;
                                        }
                                    })
                                })
                                var aTime = getRcString("CYCLE-TIME").split(",");

                                switch(g_strTime) {
                                    case "aDay": {
                                        $scope.selectTime = aTime[0];
                                        initTodayChartLine(message);
                                        initTodayLogTable(message);
                                        break;
                                    }
                                    case "aWeek": {
                                        $scope.selectTime = aTime[1];
                                        initLogChartLine(message);
                                        initLogTable(message);
                                        break;
                                    }
                                    case "aMonth": {
                                        $scope.selectTime = aTime[2];
                                        initLogChartLine(message);
                                        initLogTable(message);
                                        break;
                                    }
                                    case "aYear": {
                                        $scope.selectTime = aTime[3];
                                        initLogChartLine(message);
                                        initLogTable(message);
                                        break;
                                    }
                                    case "otherTime": {
                                        initOtherChartLine(message);
                                        initOtherLogTable(message);
                                        break;
                                    }
                                    default: {
                                        break;
                                    }
                                }

                                initHeadNum();
                                if("otherTime" != g_strTime) {
                                    $scope.hideOtherTime();
                                }
                            }
                        })
                        .error(function(){})
                }
            }
        }

        function drawStatisticsChart(aTime, oData) {
            var oEcharts = echarts.init(document.getElementById("log_chart"));
            var option = {
                height:240,
                legend: {
                    data:con_legend
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
                grid: {
                    x:40, y:30, x2:45, y2:30,
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
                        name: getRcString("NUMBER"),
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
                        name: con_legend[0],
                        data: oData.crit
                    },
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: con_legend[1],
                        data: oData.error
                    },
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: con_legend[2],
                        data: oData.warn
                    },
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        name: con_legend[3],
                        data:oData.common
                    },
                ],
                color: ['#0096d6','#31A9DC','#62BCE2','#7BC7E7']
            };

            if(30 < aTime.length) {
                var dataZoom = {
                    show: true,
                    start:0,
                };
                option.dataZoom = dataZoom;
                option.grid.y2 = 60;
            }

            oEcharts.setOption(option);
        }
        
        function logInfoHead() {
            var aName = getRcString("LOG-HEAD").split(",");

            $scope.logTable = {
                tId:'logInfoTable',
                pageSize:12,
                pageList:[12,24],
                columns: [
                    {sortable: true, field: 'user', title: aName[0]},
                    {sortable: true, field: 'ip', title: aName[1]},
                    {sortable: true, field: 'module', title: aName[2]},
                    {sortable: true, field: 'devAlias', title: aName[3]},
                    {sortable: true, field: 'level', title: aName[4]},
                    {sortable: true, field: 'message', title: aName[5]},
                    {sortable: true, field: 'stamp', title: aName[6]}
                ]
            };
        }

        //只有g_daterange改变时才刷新页面  apply事件是为了第一次点击时的刷新页面
        $('#daterange').daterangepicker(oDaterangeCN, function(start, end, label) {
            g_strStartDate = start.format('YYYY/MM/DD');
            g_strEndDate = end.format('YYYY/MM/DD');
            startTime=((new Date(g_strStartDate)).getTime())/1000;//发给后台的时间戳
            endTime=((new Date(g_strEndDate)).getTime())/1000;//
            g_daterange = g_strStartDate + ' - ' + g_strEndDate;

            $scope.$apply(function() {
                $scope.selectTime = '（' + g_daterange + '）';
                $scope.initViewsByTime("otherTime");
            });
        }).on('apply.daterangepicker', function(e, date) {
            g_strStartDate = date.startDate.format('YYYY/MM/DD')
            g_strEndDate = date.endDate.format('YYYY/MM/DD');
            var strDaterange = g_strStartDate + ' - ' + g_strEndDate;
            //选择相同日期 不刷新页面
            if(strDaterange == g_daterange) {
                return;
            }
            g_daterange = strDaterange;

            $scope.$apply(function() {
                $scope.selectTime = '（' + g_daterange + '）';
                $scope.initViewsByTime("otherTime");
            });
        });

        $scope.showSelectTime = function() {
            $scope.show_cycle = !$scope.show_cycle;
        }
        
        $scope.showOtherTime = function(strTime) {
            g_strTime = strTime;
            $scope.show_other = true;
        }

        $scope.hideOtherTime = function() {
            $scope.show_other = false;
        }

        $scope.initViewsByTime = function(strTime) {
            g_strTime = strTime;
            g_oLevel.nCrit = 0;
            g_oLevel.nError = 0;
            g_oLevel.nWarn = 0;
            g_oLevel.nCommon = 0;

            if("otherTime" != strTime) {
                g_daterange = "";
            }

            httpStatisticsChart(strTime);
        }
        logInfoHead();
        $scope.initViewsByTime("aDay");
    }]
});