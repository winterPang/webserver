define(['utils','jquery','echarts','bootstrap-daterangepicker','angular-ui-router','css!bootstrap_daterangepicker_css','css!wiresecurit5/css/style'], function (Utils,$scope,echarts) {
    return ['$scope', '$http', '$state', function ($scope, $http) {
        var g_result = {AP:{}, Client:{}, Attack:{},Statistics:{}};
        var con_stationClassify = getRcString("DEVICE-TYPE").split(",");
        var con_allAttack = [getRcString("ATTACK-NAME-ONE").split(","),getRcString("ATTACK-NAME-TWO").split(","),
                                getRcString("ATTACK-NAME-THREE").split(",")];
        var con_Time = ["aDay", "aWeek", "aMonth", "aYear", "otherTime"];
        var g_daterange = "";
        var g_nEndTime = 0;
        var g_nStartTime = 0;
        var g_strStartDate = "";
        var g_strEndDate = "";

        var totalAttackUrl = Utils.getUrl('POST', '', '/ant/read_wips_statistics', '/init/wiresecurit/attack_times.json');
        var totalCtmUrl = Utils.getUrl('POST', '', '/ant/read_wips_statistics', '/init/wiresecurit/ctm_times.json');
        var attackInfoUrl = Utils.getUrl('POST', '', '/ant/read_wips_statistics', '/init/wiresecurit/attack_info.json');
        var equipmentInfoAPUrl = Utils.getUrl('POST', '', '/ant/read_wips_ap', '/init/wiresecurit/equipment_info_AP.json');
        var equipmentInfoClientUrl = Utils.getUrl('POST', '', '/ant/read_wips_client', '/init/wiresecurit/equipment_info_client.json');
        var devSN = $scope.sceneInfo.sn;
        var oDaterangeCN = {
            locale : {  
            applyLabel : getRcString("APPLY"),
            cancelLabel: getRcString("CANCEL"),
            daysOfWeek : getRcString("WEEK").split(','),  
            monthNames : getRcString("MONTH").split(","),
        }};

        $scope.clientNum = 0;
        $scope.unauthorClientNum = 0;
        $scope.APNum = 0;
        $scope.rougeAPNum = 0;
        $scope.ctmTimes = 0;
        $scope.attackTimes = 0;

        function getRcString(attrName){
            return Utils.getRcString("wiresecurit_rc",attrName);
        }
        //只有g_daterange改变时才刷新页面  apply事件是为了第一次点击时的刷新页面
        $('#daterange').daterangepicker(oDaterangeCN, function(start, end, label) {
            g_strStartDate = start.format('YYYY/MM/DD');
            g_strEndDate = end.format('YYYY/MM/DD');
            g_daterange = g_strStartDate + ' - ' + g_strEndDate;

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

            $scope.initViewsByTime("otherTime");
        });

        function getOtherRangeTime() {
            var nStartYear  = Number(g_strStartDate.slice(0, 4));
            var nStartMonth = Number(g_strStartDate.slice(5, 7)) - 1;
            var nStartDay   = Number(g_strStartDate.slice(8));
            var nEndYear  = Number(g_strEndDate.slice(0, 4));
            var nEndMonth = Number(g_strEndDate.slice(5, 7)) - 1;
            var nEndDay   = Number(g_strEndDate.slice(8));
            var nDayTime  = 24 * 60 * 60;

            g_nStartTime = parseInt((new Date(nStartYear, nStartMonth, nStartDay)).getTime() / 1000);
            g_nEndTime   = parseInt((new Date(nEndYear, nEndMonth, nEndDay)).getTime() / 1000 + nDayTime);
        }
        //获得“开始时间”和“结束时间”
        function getRangeTime(nRangeType) {
            var nHourTime = 60 * 60;
            var nDayTime = 24 * nHourTime;
            var nWeekTime = 8 * nDayTime;
            var nMonthTime = 31 * nDayTime;
            var nYearTime = 366 * nDayTime;
            //获得当前的时间年月日的字符串
            var strDate = new Date().toLocaleDateString();
            //获得今天凌晨的时间秒数
            var nTodayZeroTime = parseInt((new Date(strDate).getTime() - 0)  / 1000);

            //统计一周、一月、一年数据的“结束时间”是今天凌晨的时间
            g_nEndTime = nTodayZeroTime;

            if(!nRangeType) {
                nRangeType = "otherTime";
            }

            switch(nRangeType) {
                case con_Time[0]: {
                    //一天的“开始时间”是今天的凌晨时间 “结束时间”是明天的凌晨时间
                    g_nStartTime = nTodayZeroTime;
                    g_nEndTime = nTodayZeroTime + nDayTime;
                    g_daterange = "";
                    break;
                }
                case con_Time[1]: {
                    g_nStartTime = nTodayZeroTime - nWeekTime;
                    g_daterange = "";
                    break;
                }
                case con_Time[2]: {
                    g_nStartTime = nTodayZeroTime - nMonthTime;
                    g_daterange = "";
                    break;
                }
                case con_Time[3]: {
                    g_nStartTime = nTodayZeroTime - nYearTime;
                    g_daterange = "";
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
        //Attack Infomation Statistics
        function drawAttackType() {
            var aTypeStr = getRcString("ATTACK-TYPE-LAN").split(",");
            var nFlood = g_result.Attack.FloodNum || 0;
            var nOthers = g_result.Attack.OtherNum || 0;
            var nMalf = g_result.Attack.MalfNum ||0;
            var nSum = nFlood + nOthers + nMalf;
            var aAttackType = [];
            var aColor = [];
            var option = {};

            nFlood && aAttackType.push({name:aTypeStr[0], value:nFlood})&&aColor.push('#FBCEB1');
            nMalf && aAttackType.push({name:aTypeStr[1], value:nMalf})&&aColor.push('#C8C3E1');
            nOthers && aAttackType.push({name:aTypeStr[2], value:nOthers})&&aColor.push('#FE808B');
            
            if(!nSum) {
                option = {
                    calculable : false,
                    tooltip : {
                        show:false
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : '60%',
                            center: ['50%', '45%'],
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
                option = {
                    calculable : false,
                    tooltip : {
                        show:true,
                        formatter: "{b}:<br/> {c} ({d}%)"
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : '50%',
                            center: ['50%', '45%'],
                            itemStyle: {

                                normal: {
                                    labelLine:{
                                        length:5
                                    },
                                    label:
                                    {
                                        position:"outer",
                                        textStyle:{
                                            color: "#484A5E",
                                            fontFamily : "HPSimplified",
                                        },
                                    }
                                }
                            },
                            data: aAttackType
                        }
                    ],
                    color: aColor
                };
            }
            var oEcharts = document.getElementById("AttackInfoPie");
            if (!oEcharts) {return;}
            oEcharts = echarts.init(oEcharts);
            oEcharts.setOption(option);
        }
        function drawAttacks() {
            if(g_result.Attack) {
                drawAttackType();

                var aSeriesData = [g_result.Attack.Flood, g_result.Attack.Malf, g_result.Attack.Other];

                $scope.countSeriousAttackTimes = g_result.Attack.OtherNum || 0;
                $scope.countFloodAttackTimes = g_result.Attack.FloodNum || 0;
                $scope.countAbnormalPacketTimes = g_result.Attack.MalfNum || 0;

                var aOption = [];
                var nWidth = $("#SeriousAttackChart").width()*0.93;
                var aColorList = ["#FBCEB1", "#C8C3E1", "#FE808B"];
                var aAllTitleLan = [];
                for(var j = 0 ; j < aSeriesData.length; j++){
                    var temp = [];
                    for(var k = 0; k < aSeriesData[j].length; k++)
                    {
                        temp.push(aSeriesData[j][k].name);
                    }
                    aAllTitleLan.push(temp);
                }
                for(var i=0; i<3; i++){
                    var nEnd;
                    switch(i){
                        case 0:
                            nEnd = 100*5/(aAllTitleLan[0].length || 1);
                            break;
                        case 1:
                            nEnd = 100*5/(aAllTitleLan[1].length || 1);
                            break;
                        case 2:
                            nEnd = 100*5/(aAllTitleLan[2].length || 1);
                            break;
                    }
                    for(var m = 0; m < 5 - aAllTitleLan[i].length; m++)
                    {
                        aAllTitleLan[i].unshift("");
                        aSeriesData[i].unshift({name:"",value:""});
                    }
                    var opt = {
                        color: [aColorList[i]],
                        tooltip : {
                            show:false,
                            trigger: 'axis'
                        },
                        height:210,
                        calculable : false,
                        yAxis : [
                            {
                                show : false,
                                axisTick:false,
                                type : 'category',
                                data: aAllTitleLan[i],
                                splitLine : false,
                                axisLine:false
                            }
                        ],
                        xAxis: [
                            {
                                type:"value",
                                axisLabel:false,
                                splitLine : false,
                                axisLine:false
                            }
                        ],
                        grid:{
                            borderWidth:0,
                            x:3,
                            y:0,
                            x2:70,
                            y2:15
                        },
                        series : [
                            {
                                name:'Number',
                                type:'bar',
                                data:aSeriesData[i],
                                itemStyle : {
                                    normal: {
                                        label : {
                                            show: true,
                                            position: 'right',
                                            formatter: function(x){
                                                return x.value;
                                            },
                                            textStyle: {
                                                color:"#a7b7c1"
                                            }
                                        }
                                    },
                                    emphasis:{
                                    }
                                }
                            },
                            {
                                name:'Number',
                                type:'bar',
                                data:aSeriesData[i],
                                color:'rgba(0,0,0,0)',
                                itemStyle : {
                                    normal: {
                                        label : {
                                            show: true,
                                            position: 'insideLeft',
                                            formatter: function(x){return x.name;},
                                            textStyle: {color:"#47495d"}
                                        },
                                        color: 'rgba(0,0,0,0)'
                                    },
                                    emphasis: {
                                        label : {
                                            show: true,
                                            formatter: function(x){return x.name;},
                                            textStyle: {color:"#47495d"}
                                        }
                                        , color: 'rgba(0,0,0,0)'
                                    }
                                }

                            }
                        ]
                    };
                    if(nEnd < 100){
                        opt.dataZoom = {
                            show : true,
                            realtime : true,
                            start : 0,
                            end : nEnd,
                            zoomLock: true,
                            orient: "vertical",
                            width: 5,
                            x: nWidth,
                            backgroundColor:'#F7F9F8',
                            fillerColor:'#bec6cf',
                            handleColor:'#bec6cf',
                            border:'none'
                        };
                    }
                    aOption.push(opt);
                }
                var oEchartsFlood =document.getElementById("FloodAttack");
                if (!oEchartsFlood) {return;}

                oEchartsFlood = echarts.init(oEchartsFlood);
                var oEchartsMalf = echarts.init(document.getElementById("AbnormalPacketChart"));
                var oEchartsOther= echarts.init(document.getElementById("SeriousAttackChart"));

                oEchartsFlood.setOption(aOption[0]);
                oEchartsMalf.setOption(aOption[1]);
                oEchartsOther.setOption(aOption[2]);
            }
        }
        function successAttacks(name, aData){
            var message = aData || [];
            var msg = {Flood:[], Malf:[], Other:[], FloodNum:0, MalfNum:0, OtherNum:0};

            for(var i = 0; i < message.length; i++){
                var temp = {};
                if(!con_allAttack[Number(message[i].Type)] || !con_allAttack[Number(message[i].Type)][Number(message[i].SubType)])
                {
                    continue;
                }
                temp.name = con_allAttack[Number(message[i].Type)][Number(message[i].SubType)];
                temp.value = message[i].Count - 0;
                switch(message[i].Type - 0){
                    case 1:
                    {
                        if(temp.name) {
                            msg.Flood.push(temp);
                        }
                        msg.FloodNum += temp.value;
                        break;
                    }
                    case 2:
                    {
                        if(temp.name) {
                            msg.Malf.push(temp);
                        }
                        msg.MalfNum += temp.value;
                        break;
                    }
                    case 0:
                    {
                        if(temp.name) {
                            msg.Other.push(temp);
                        }
                        msg.OtherNum += temp.value;
                        break;
                    }
                }

            }

            g_result[name] = msg;
            drawAttacks();
        }
        //Device Infomation Statistics
        function drawEquipmentInfoPie (strTmp, aData, strInfo) {
            var oAttackInfoPie = document.getElementById(strTmp);
            if (!oAttackInfoPie) {return;}
            oAttackInfoPie = echarts.init(oAttackInfoPie);
            var aColor = ['#4EC1B2','#5FC7B9','#70CDC1','#81D3C8','#92D9CF','#A2DFD7','#B3E5DE','#C4EBE5',
                    '#D5F1ED','#E6F7F4','#B3B7DD','#C0C3E3','#CCCFE8','#D9DBEE','#E6E7F4','#F2F3F9'];
            var oToolTip = {
                trigger: 'item',
                formatter: "{b} <br/> {c} ({d}%)"
            };
            var oItemStyle = { 
                normal: {
                    labelLine:{ length:10},
                    label: {
                        position:"outer",
                        textStyle:{
                            color: "#484A5E",
                            fontFamily : "HPSimplified",
                        },
                    }
                }
            };
            if(!aData.length) {
                oToolTip = {show: false};
                oItemStyle = {};
                aData = [{name:"",value:1}];
                aColor = ["#F5F5F5"];
            }
            var option = {
                title: {
                    text: strInfo,
                    x: 'center',
                    y: 'bottom',
                    textStyle: {
                        fontSize: 13,
                        fontWeight: "lighter",
                        color: "#80878c"
                    }
                },
                tooltip: oToolTip,
                calculable : false,
                series : [
                    {
                        type:'pie',
                        radius :'65%',
                        center: ['50%', '45%'],
                        minAngle:15,
                        itemStyle: oItemStyle,
                        data: aData
                    }
                ],
                color: aColor
            };

            if(aData[0].name) {
                option.color.splice(g_result.AP.info.length, 10 - g_result.AP.info.length);
            }
            
            oAttackInfoPie.setOption(option);
        }
        function drawAPOrClientPie (strId, strFlag, strInfo) {
            var apNum = g_result.Statistics.AP || 0;
            var rougeAPNum = g_result.Statistics.RougeAP || 0;
            var clientNum = g_result.Statistics.Client || 0;
            var unauthorClientNum = g_result.Statistics.UnauthorizedClient || 0;
            var fNum = 0, aColor = [], strTitle = "";

            $scope.clientNum = clientNum;
            $scope.unauthorClientNum = unauthorClientNum;
            $scope.APNum = apNum;
            $scope.rougeAPNum = rougeAPNum;

            if("AP" == strFlag) {
                fNum = ((apNum * 100 / (apNum + clientNum)).toFixed(2) - 0) || 0;
                aColor = ["#71dbc1", "#f5f5f5"];
                strTitle = strInfo + "：" + apNum;
            }
            else {
                fNum = ((clientNum * 100 / (apNum + clientNum)).toFixed(2) - 0) || 0;
                aColor = ["#b3b7dd", "#f5f5f5"];
                strTitle = strInfo + "：" + clientNum;
            }

            var oEcharts = document.getElementById(strId);
            if (!oEcharts) {return;}
            oEcharts = echarts.init(oEcharts);
            var option = {
                title: {
                    text: strTitle,
                    x: 'center',
                    y: 'bottom',
                    textStyle: {
                        fontSize: 13,
                        fontWeight: "lighter",
                        color: "#80878c"
                    }
                },
                calculable : false,
                series : [
                    {
                        type: 'pie',
                        radius : ['50%','65%'],
                        center: ['50%', '45%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : true,
                                    position : 'center',
                                    textStyle : {
                                        color : '#4ecfb2',
                                        fontSize : 15
                                    }
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : false,
                                }
                            }
                        },
                        data:[
                            {value:fNum, name: fNum + "%"},
                            {value:100 - fNum, name:''},
                     
                        ]
                    }
                ],
                color:aColor
            };
            oEcharts.setOption(option);
        }
        function successDevice(name, aData) {
            var nSum = 0;
            var aMsg = [];
            if("AP" == name) {
                g_result.Statistics.UnauthorizedClient = 0;
                for(var i = 0; i < aData.length; i++) {
                    var oTmp = {"name":"","value":""};
                    if(Number(aData[i].ClassifyType) == 3) {
                        g_result.Statistics.RougeAP = Number(aData[i].Sum);
                    }

                    nSum += aData[i].Sum;
                    oTmp.name = con_stationClassify[Number(aData[i].ClassifyType)];
                    oTmp.value = Number(aData[i].Sum);
                    aMsg.push(oTmp);
                }
            }
            else if("Client" == name) {
                g_result.Statistics.UnauthorizedClient = 0;
                for(var i = 0; i < aData.length; i++) {
                    var oTmp = {"name":"","value":""};
                    if(Number(aData[i].ClassifyType) == 15) {
                        g_result.Statistics.UnauthorizedClient = Number(aData[i].Sum);
                    }

                    nSum += aData[i].Sum;
                    oTmp.name = con_stationClassify[Number(aData[i].ClassifyType)] || "unknow";
                    oTmp.value = Number(aData[i].Sum);
                    aMsg.push(oTmp);
                }
            }

            g_result[name].info = aMsg;
            g_result.Statistics[name] = nSum;

            if(g_result.AP.info && g_result.Client.info) {
                var aTmpData = [];
                var aRemaindInfo = getRcString("REMAID-INFO").split(",");

                aTmpData = aTmpData.concat(g_result.AP.info, g_result.Client.info);
                drawEquipmentInfoPie("StatisticsDevicePie", aTmpData, aRemaindInfo[2]);
                drawAPOrClientPie("StatisticsAPPie", "AP", aRemaindInfo[0]);
                drawAPOrClientPie("StatisticsClientPie", "Client", aRemaindInfo[1]);
            }
        }

        function showSelectTimeClass(strTime) {
            switch(strTime) {
                case "aDay": {
                    $scope.isDay = true;
                    $scope.isWeek = false;
                    $scope.isMonth = false;
                    $scope.isYear = false;
                    $scope.isOther = false; 
                    break;
                }
                case "aWeek": {
                    $scope.isDay = false;
                    $scope.isWeek = true;
                    $scope.isMonth = false;
                    $scope.isYear = false;
                    $scope.isOther = false; 
                    break;
                }
                case "aMonth": {
                    $scope.isDay = false;
                    $scope.isWeek = false;
                    $scope.isMonth = true;
                    $scope.isYear = false;
                    $scope.isOther = false; 
                    break;
                }
                case "aYear": {
                    $scope.isDay = false;
                    $scope.isWeek = false;
                    $scope.isMonth = false;
                    $scope.isYear = true;
                    $scope.isOther = false; 
                    break;
                }
                case "otherTime": {
                    $scope.isDay = false;
                    $scope.isWeek = false;
                    $scope.isMonth = false;
                    $scope.isYear = false;
                    $scope.isOther = true;
                    break;
                }
                default: {
                    break;
                }
            }
        }
        
        $scope.initViewsByTime = function(strTime) {
            g_result = {AP:{}, Client:{}, Attack:{},Statistics:{}};

            showSelectTimeClass(strTime);
            getRangeTime(strTime);
            
            $http({
                url:totalAttackUrl.url, 
                method:totalAttackUrl.method, 
                data:{
                    Method:"TotalAttackNumber",
                    Param: {
                        ACSN: devSN,
                        StartTime : g_nStartTime,
                        EndTime :g_nEndTime,
                    }
                }
            }).success(function(data,header,config,status) {
                $scope.attackTimes = data.message || 0;
            }).error(function(data,header,config,status) {
                console.log("ERROR");
            });
            $http({
                url:totalCtmUrl.url, 
                method:totalCtmUrl.method,
                data:{
                    Method: "TotalCtmNumber",
                    Param:{
                        ACSN: devSN,
                        StartTime : g_nStartTime,
                        EndTime : g_nEndTime
                    }
                } 
            }).success(function(data,header,config,status) {
                $scope.ctmTimes = data.message || 0;
            }).error(function(data,header,config,status) {
                console.log("ERROR");
            });
            $http({
                url:attackInfoUrl.url, 
                method:attackInfoUrl.method,
                data:{
                    Method: "GetAttackClassify",
                    Param:{
                        ACSN: devSN,
                        StartTime : g_nStartTime,
                        EndTime : g_nEndTime
                    }
                } 
            }).success(function(data,header,config,status) {
                successAttacks("Attack", data.message);
            }).error(function(data,header,config,status) {
                console.log("ERROR");
            });

            $http({
                url:equipmentInfoAPUrl.url, 
                method:equipmentInfoAPUrl.method,
                data:{
                    Method: "GetApClassify",
                    Param:{
                        ACSN: devSN,
                        StartTime : g_nStartTime,
                        EndTime : g_nEndTime
                    }
                } 
            }).success(function(data,header,config,status) {
                successDevice("AP", data.message);
            }).error(function(data,header,config,status) {
                console.log("ERROR");
            });

            $http({
                url:equipmentInfoClientUrl.url, 
                method:equipmentInfoClientUrl.method,
                data:{
                    Method: "GetClientClassify",
                    Param:{
                        ACSN: devSN,
                        StartTime : g_nStartTime,
                        EndTime : g_nEndTime
                    }
                } 
            }).success(function(data,header,config,status) {
                successDevice("Client", data.message);
            }).error(function(data,header,config,status) {
                console.log("ERROR");
            });
        };
        $scope.initViewsByTime("aDay");

        $scope.helpDoc={
            options:{
                 mId:'helpDoc',
                 title:getRcString("HELP"),                        
                 autoClose: true,  
                 showCancel: false,  
                 showFooter:false,   
                 buttonAlign: "center", 
                 modalSize:'lg',                 
                 okHandler: function(modal,$ele){                                                                                                                  
                 },
                 cancelHandler: function(modal,$ele){
                 },
                 beforeRender: function($ele){
                     return $ele;
                 }
            }
        }

        $scope.openHelpDoc = function() {
            $scope.$broadcast('show#helpDoc',$scope);
        }
        $scope.closeHelpDoc = function() {
            $scope.$broadcast('hide#helpDoc',$scope);
        }
    }];
});