define(['jquery', 'echarts', 'utils', 'angular-ui-router', 'bsTable', 'css!dashboard2/css/index.css', 'dashboard5/directive/dashboard_log',
    'dashboard5/directive/dashboard_wiser'], function ($, echarts, Utils) {
    return ['$scope', '$http', '$state', '$rootScope','$stateParams', function ($scope, $http, $state, $rootScope,$stateParams ) {
        function getRcString(attrName) {
            return Utils.getRcString("dashboard_rc", attrName);
        }

        function addComma(sNum, Stype/*Stype=rate,.memory*/, nStart, nEnd) {
            function doFormat(num, type, start, end) {
                if (!(typeof(num) === "string" || typeof(num) === "number") || Number(num) != Number(num)) {
                    return num;
                }
                var max, len, remain, unit, fixed;
                var flag = "";
                start = start || 0;
                end = typeof end == "undefined" ? 3 : end;
                switch (type) {
                    case "memory":
                        max = 1000;
                        unit = ["B", "KB", "MB", "GB"];
                        break;
                    case "rate":
                        max = 1024;
                        unit = ["bps", "Kbps", "Mbps", "Gbps"];
                        break;
                    default:
                        max = Infinity;
                        unit = [""];
                        fixed = 0;
                        break;
                }
                if (num < 0) {
                    num = -num;
                    flag = "-"
                }
                while (num >= max && start < end) {
                    num = num / max;
                    start++;
                    fixed = 1;
                }
                num = Number(num).toFixed(fixed).split(".");
                if (fixed) {
                    unit = "." + num[1] + unit[start];
                } else {
                    unit = unit[start];
                }
                num = num[0];
                len = num.length;
                if (len < 3) {
                    return flag + num + unit;
                }
                remain = len % 3;
                if (remain > 0) {
                    num = num.slice(0, remain) + "," + num.slice(remain, len).match(/\d{3}/g).join(",");

                } else {
                    num = num.slice(remain, len).match(/\d{3}/g).join(",");
                }
                return flag + num + unit;

            };

            if ($.isPlainObject(sNum)) {
                for (key in sNum) {
                    sNum[key] = doFormat(sNum[key], Stype, nStart, nEnd);
                }
            } else {
                sNum = doFormat(sNum, Stype, nStart, nEnd);
            }
            return sNum;
        }

        $scope.$watch('permission', function () {
            console.log($scope.permission.write);
        });
        //draw empty pie
        $scope.drawEmptyPie = function (id,size, vertical) {
            var terminalAuth = document.getElementById(id);
            if (!terminalAuth) {return;}
            terminalAuth = echarts.init(document.getElementById(id));
            var terAuthOption = {
                height:200,
                calculable: false,
                tooltip: {
                    show: false,
                    trigger: 'item'
                },
                series: [
                    {
                        type: 'pie',
                        minAngle: '3',
                        radius: size,
                        center: ['50%', vertical],
                        itemStyle: {
                            normal: {
                                color: "#E2E2E2",
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position: "inner"
                                }
                            }
                        },
                        data: [{name: 'N/A', value: 1}]
                    }
                ]
            };
            terminalAuth.setOption(terAuthOption);
        };
        //AP count
        var getAPsUrl = Utils.getUrl('GET', '', '/apmonitor/getApCountByStatus', '/init/dashboard2/get_ap_count_by_status.json');
        var g_hLine;
        var g_oTimer = false;
        var aStatus=getRcString("AP_STATUS").split(",");
        /*Interval=function(){
            if(g_hLine){
                $http({
                url: getAPsUrl.url,
                method: getAPsUrl.method,
                params: {
                    'devSN': $scope.sceneInfo.sn
                }
                }).success(function (data) {
                    var sTime = new Date();
                    sTime = sTime.toTimeString().split(" ")[0];
                    sTime = sTime.split(":")[0]+":"+sTime.split(":")[1];
                    g_hLine.addData([
                        [
                            0,
                            data.ap_statistic.online,
                            false,
                            false,                         
                            sTime
                        ],
                        [
                            1,
                            data.ap_statistic.offline,
                            false,
                            false
                            
                        ]
                    ]);
                    if(g_oTimer){
                        clearTimeout(g_oTimer);
                    }
                    g_oTimer = setTimeout(function(){(Interval())},60000);
                }).error(function(){});
            }
        }*/
        $scope.apCount=function(){
            $http({
                url: getAPsUrl.url,
                method: getAPsUrl.method,
                params: {
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function (data) {
                var aTimes = [];
                var nTime = new Date();
                nTime = nTime.getTime();
                for(var i=0;i<2;i++)
                {
                    var sTime = new Date(nTime);
                    sTime = sTime.toTimeString().split(" ")[0];
                    sTime = sTime.split(":")[0]+":"+sTime.split(":")[1];
                    aTimes.push(sTime);
                    //nTime -= 60000;
                }
                aTimes.reverse();
                if(data.ap_statistic.online == 0&&data.ap_statistic.offline==0){
                    $scope.drawEmptyPie('pie_aps','80%','50%');
                    drawLine(data.ap_statistic,aTimes);
                }else{
                    drawPie(data.ap_statistic);
                    drawLine(data.ap_statistic,aTimes);
                }
            }).error(function(){});
        };
        $scope.apCount();
        drawPie=function(aData){
            var apCount = document.getElementById('pie_aps');
            if (!apCount) {return;}
            apCount = echarts.init(apCount);
            var apOption = {
                animation: false,
                calculable : false,
                tooltip : {
                    //show:true,
                    formatter: function(aData){
                        var sLable = aData[1] + ":<br/> " + aData[2] + " (" + aData[3]+"%)";
                        return sLable;
                    }
                },
                series : [
                    {
                        name: 'APs',
                        type: 'pie',
                        minAngle: '3',
                        radius: '70%',
                        // selectedMode: "single",
                        // selectedOffset: 10,
                        center: ['55%', '55%'],
                        itemStyle: {
                            normal: {
                                borderColor: "#FFF",
                                borderWidth: 1,
                                label: {
                                    position: 'inner',
                                    formatter: function (a, b, c, d) {
                                        return a.percent + "%";
                                    }
                                },
                                labelLine: false
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: "#000"
                                    }
                                },
                                labelLine: false
                            }
                        },
                        data: [
                            {name: aStatus[0], value: aData.online || undefined},
                            {name: aStatus[1], value: aData.offline || undefined}
                            //{name:aSatus[2], value:oData.other || undefined}
                        ]
                    }],
                color: ["#78CEC3","#FF9C9E","#E7E7E9"]
            };
            apCount.setOption(apOption);
        };
        drawLine=function(oData,aTimes){
            g_hLine = document.getElementById('aps')
            if (!g_hLine) {return;}
            g_hLine=echarts.init(g_hLine);
            var apLineOption={
                calculable: true,
                tooltip: {
                    //show: true,
                    trigger: 'axis',
                    backgroundColor: 'rgba(52,62,78,0.9)',
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
                    orient: "horizontal",
                    y: 'top',
                    x: "right",
                    textStyle:{color: '#80878C'},
                    data: aStatus
                },
                grid: {
                    x: 40,
                    y: 30,
                    x2:15,
                    borderColor: '#FFF'
                },
                xAxis: [
                    {
                        //type: 'category',
                        boundaryGap: false,
                        splitLine:false,
                        axisLabel: {
                            interval:0,
                            textStyle:{color: '#80878C'}
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#80878C', width: 1}
                        },
                        axisTick :{
                            show:false
                        },
                        data: aTimes
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine:false,
                        axisLabel: {
                            show: true,
                            textStyle:{color: '#80878C'}
                        },
                        axisLine  : {
                            show:true,
                            lineStyle :{color: '#80878C', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        name:aStatus[0],
                        data: [oData.online,oData.online],
                        itemStyle: {normal: {lineStyle:{width:2}}}
                    },
                    {
                        symbol: "none",
                        type: 'line',
                        smooth: true,
                        name:aStatus[1],
                        data: [oData.offline,oData.offline],
                        itemStyle: {normal: {lineStyle:{width:2}}}
                    }
                    // {
                    //     symbol: "none",
                    //     type: 'line',
                    //     smooth: true,
                    //     name:aSatus[2],
                    //     data: [0,0,0,oData.other],
                    //     itemStyle: {normal: {lineStyle:{width:2}}}
                    // }
                ],
                color: ["#78CEC3","#FF9C9E","#E7E7E9"],
                valueAxis:{
                    splitLine:{lineStyle:{color:[ '#FFF']}},
                    axisLabel:{textStyle: {color: [ '#abbbde']}}
                },
                categoryAxis:{
                    splitLine:{lineStyle:{color:['#FFF']}}
                }
            };
            g_hLine.setOption(apLineOption);
            console.log(g_hLine);
            if(g_oTimer){
                clearTimeout(g_oTimer);
            }
            //debugger
            g_oTimer = setTimeout(function(){$scope.apCount()},900000);
        };
        //health degree;
        var healthUrl = Utils.getUrl('GET', '', '/health/home/health', '/init/dashboard5/health_by_acSN.json');
        var bandWidthUrl=Utils.getUrl('GET', '', '/devmonitor/getbandwidth', '/init/dashboard5/get_band_iwidths.json');
        var setBandWidthUrl=Utils.getUrl('GET', '', '/devmonitor/setbandwidth', '/init/dashboard5/set_band_width.json');
        $scope.healthDegree=function(){
            $http({
                url: healthUrl.url,
                method: healthUrl.method,
                params: {
                    'acSN': $scope.sceneInfo.sn
                }
            }).success(function (data) {
                console.log(data);
                var aData = $.parseJSON(data);
                var healthData = JSON.parse(aData);
                console.log(healthData.finalscore);
                if (healthData==-1) {
                    healthData = {
                        finalscore: 0,
                        wanspeed: 0,
                        APpercent: 0,
                        clientspeed: 0,
                        security: 0,
                        wireless: 0,
                        system: 0,
                        Bpercent: 0
                    };
                }
                $scope.drawScorePie(healthData, 1);
                $scope.showMessage(healthData);
                $scope.initHealthScore(healthData);
                $scope.getBandWidth();
            }).error(function(){
                $scope.isFail = false;
                $scope.isSuccess = false;
            });
        };
        $scope.healthDegree();
        $scope.showMessage = function (oData) {
            $scope.isFail = false;
            $scope.isSuccess = false;
            if (oData.finalscore == 0) {
            } else if (oData.finalscore < 40) {
                $scope.isFail = true;
                $scope.getPercent = oData.Bpercent;
            } else if (oData.finalscore < 70) {
                $("#terminalMessage").css("color", "#fbceb1");
                $scope.isSuccess = true;
                $scope.getPercent = oData.Bpercent;
                $scope.terminalMessage = getRcString("TIP2");
            } else if (oData.finalscore <= 100) {
                $("#terminalMessage").css("color", "#4ec1b2");
                $scope.isSuccess = true;
                $scope.getPercent = oData.Bpercent;
                if (oData.finalscore < 80) {
                    $scope.terminalMessage = getRcString("TIP3");
                } else if (oData.finalscore < 90) {
                    $scope.isSuccess = true;
                    $scope.getPercent = oData.Bpercent;
                    $scope.terminalMessage = getRcString("TIP4");
                } else {
                    $scope.isSuccess = true;
                    $scope.getPercent = oData.Bpercent;
                    $scope.terminalMessage = getRcString("TIP5");
                }
            }
        };
        $scope.drawScorePie = function (aData, status) {
            var scorePie = document.getElementById('score-pie');
            if (!scorePie) {return;}
            scorePie = echarts.init(scorePie);
            var labelTop = {
                normal: {
                    color: (status == 1 ? ((aData.finalscore >= 80 ? "#4ec1b2" : (aData.finalscore >= 60 ? "#fbceb1" : "#fe808b"))) : "#f5f5f5"),
                    label: {
                        show: false,
                        position: 'center',
                        formatter: '{b}',
                        textStyle: {
                            baseline: 'bottom'
                        }
                    },
                    labelLine: {
                        show: false
                    }
                }
            };
            var labelFromatter = {
                normal: {
                    label: {
                        formatter: function (params) {
                            return 100 - params.value
                        },
                        textStyle: {
                            baseline: 'top',
                            fontSize: 20,
                            color: '#4EC1B2'
                        }
                    }
                }
            };
            var labelBottom = {
                normal: {
                    color: '#fff',
                    label: {
                        show: true,
                        position: 'center',
                        textStyle: {
                            baseline: 'middle',
                            fontSize: 20,
                            color: "#646D77"
                        }
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    color: 'rgba(0,0,0,0)'
                }
            };
            var radius = [50, 60];
            scoreOption = {
                series: [
                    {
                        type: 'pie',
                        center: ['50%', '40%'],
                        radius: radius,
                        x: '80%', // for funnel
                        itemStyle: labelFromatter,
                        data: [
                            {value: 100 - aData.finalscore, itemStyle: labelBottom},
                            {value: aData.finalscore, itemStyle: labelTop}
                        ]
                    }
                ]
            };
            scorePie.setOption(scoreOption);
        };
        $scope.initHealthScore = function (aData) {
            if (!aData) {
            }
            $scope.healthGrade(aData.wanspeed, "#raty_score_1 li");
            $scope.healthGrade(aData.APpercent, "#raty_score_2 li");
            $scope.healthGrade(aData.clientspeed, "#raty_score_3 li");
            $scope.healthGrade(aData.security, "#raty_score_4 li");
            $scope.healthGrade(aData.wireless, "#raty_score_5 li");
            $scope.healthGrade(aData.system, "#raty_score_6 li");
        };
        $scope.healthGrade = function (sizeof, selector) {
            if(sizeof<=2){
                for (var i = 0; i < sizeof; i++) {
                    $(selector).eq(i).removeClass('emptyStar').addClass('dangerStar');
                }
            }else if(sizeof==3){
                for (var i = 0; i < sizeof; i++) {
                    $(selector).eq(i).removeClass('emptyStar').addClass('warningStar');
                }
            }else if(sizeof>3){
                for (var i = 0; i < sizeof; i++) {
                    $(selector).eq(i).removeClass('emptyStar').addClass('lightStar');
                }
            }                       
        };
        //system info
        $scope.systemInfo = {
            options: {
                mId: 'systemInfo',
                title: getRcString("FORM_TITLE"),
                autoClose: true,
                showCancel: false,
                buttonAlign: "center",
                modalSize: 'lg',
                showHeader: true,
                showFooter: true,
                searchable: true,
                okText:getRcString("CLOSE"),
                okHandler: function (modal, $ele) {
                    //add ap to ap group
                    //$scope.$broadcast('show#systemInfo');
                },
                cancelHandler: function (modal, $ele) {
                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        };
        $scope.drawCircleScore = function (jEle, val, sName) {
            var circlePie = document.getElementById(jEle);
            if (!circlePie) {return;}
            circlePie = echarts.init(circlePie);
            var labelTop = {
                normal: {
                    color: '#4EC1B2',
                    label: {
                        show: true,
                        position: 'center',
                        formatter: '{b}',
                        textStyle: {
                            baseline: 'bottom',
                            color: '#4EC1B2'
                        }
                    },
                    labelLine: {
                        show: false
                    }
                }
            };
            var labelFromatter = {
                normal: {
                    label: {
                        formatter: function (params) {
                            return 100 - params.value + '%'
                        },
                        textStyle: {
                            baseline: 'top',
                            color: '#0096D6'
                        }
                    }
                }
            };
            var labelBottom = {
                normal: {
                    color: '#ccc',
                    label: {
                        show: true,
                        position: 'center'
                    },
                    labelLine: {
                        show: false
                    }
                },
                emphasis: {
                    color: 'rgba(0,0,0,0)'
                }
            };
            var radius = [40, 55];
            var circleOption = {
                series: [
                    {
                        type: 'pie',
                        center: ['30%', '50%'],

                        radius: radius,
                        x: '0%', // for funnel
                        itemStyle: labelFromatter,
                        data: [
                            {name: 'other', value: 100 - val, itemStyle: labelBottom},
                            {name: sName, value: val, itemStyle: labelTop}
                        ]
                    }
                ]
            };
            circlePie.setOption(circleOption);
        };
        $scope.systemInformation = function () {
            var systemScoreUrl = Utils.getUrl('GET', '', '/devmonitor/web/system', '/init/dashboard5/system_dev.json');
            var v3Status = Utils.getUrl('POST', '', '/base/getDev', '/init/dashboard5/get_dev.json');
            //$scope.systemData={};
            $scope.$broadcast('show#systemInfo');
            $http({
                url: systemScoreUrl.url,
                method: systemScoreUrl.method,
                params: {
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function (data) {
                //console.log(data);
                $scope.nCpu = parseInt(data.cpuRatio);
                $scope.nMem = parseInt(data.memoryRatio);
                $scope.drawCircleScore('gauge_cpu', $scope.nCpu, getRcString("cpu"));
                $scope.drawCircleScore('gauge_mem', $scope.nMem, getRcString("memory"));
                /*angular.element("#devMode").html(data.devMode);
                angular.element("#SerialNumber").html($scope.sceneInfo.sn);
                angular.element("#devSoftVersion").html(data.devSoftVersion);
                angular.element("#devHardVersion").html(data.devHardVersion);
                angular.element("#devBootWare").html(data.devBootWare);*/
                $scope.devMode=data.devMode;
                $scope.devSoftVersion=data.devSoftVersion;
                $scope.devHardVersion=data.devHardVersion;
                $scope.devBootWare=data.devBootWare;
            }).error(function () {
            });
            $http({
                url: v3Status.url,
                method: v3Status.method,
                data: {
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function (data) {
                console.log(data);
                $scope.statust = data.status || [];
                var Connect_Sta = getRcString("Connect_Stav3").split(",");
                if ($scope.statust == 0) {
                    $scope.connectStatus=Connect_Sta[0];
                    //angular.element("#devv3CloudConnectionState").html(Connect_Sta[0]);
                } else {
                    $scope.connectStatus=Connect_Sta[1];
                   // angular.element("#devv3CloudConnectionState").html(Connect_Sta[1]);
                }
            }).error(function () {
            });
        };
        //band width set
        $scope.bandWidth={};
        $scope.$watch('AddInternetForm.$invalid', function (v) {
            if (v) {
                $scope.$broadcast('disabled.ok#bandWidthSet');
            } else {
                $scope.$broadcast('enable.ok#bandWidthSet');
            }
        });
        $scope.$watch('AddInternetForm.$dirty', function (v) {
            console.log(v);
            if (v) {
                $scope.$broadcast('enable.ok#bandWidthSet');
            } else {
                $scope.$broadcast('disabled.ok#bandWidthSet');
            }
        });
        /*$scope.$watch('bandWidth.upband',function(){
            console.log($scope.bandWidth.upband);
        });*/
        $scope.bandWidthOption={
            options:{
                mId: 'bandWidthSet',
                title: getRcString("ADD_TITLE"),
                autoClose: true,
                showCancel: true,
                buttonAlign: "center",
                modalSize: 'normal',
                showHeader: true,
                showFooter: true,
                searchable: true,
                okHandler: function (modal, $ele) {
                    $scope.setBandWidth();
                    //$scope.$broadcast('show#bandWidth');
                },
                cancelHandler: function (modal, $ele) {
                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        };
        $scope.getBandWidth=function(){
            $http({
                url: bandWidthUrl.url,
                method: bandWidthUrl.method,
                params: {
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function (data) {
                console.log(data);
                if(data.errCode==0){
                    $scope.bandWidth.upband=data.upBandwidth;
                    $scope.bandWidth.downband=data.downBandwidth;
                }else if (data.errCode==1) {

                }
            }).error(function () {});
        };
        $scope.openModal=function(){
            $scope.$broadcast('show#bandWidthSet');
            $scope.$broadcast('disabled.ok#bandWidthSet');
            $scope.getBandWidth();
        };
        $scope.$on('hidden.bs.modal#bandWidthSet', function () {
            $scope.AddInternetForm.$setUntouched();
            $scope.AddInternetForm.$setPristine();
        });
        //set band width
        $scope.setBandWidth=function(){
            $http({
                url: setBandWidthUrl.url,
                method: setBandWidthUrl.method,
                params: {
                    'devSN': $scope.sceneInfo.sn,
                    upBandwidth:$scope.bandWidth.upband,
                    downBandwidth:$scope.bandWidth.downband
                }
            }).success(function (data) {
                console.log(data);
                if(data.errCode==0){
                    $alert.msgDialogSuccess(getRcString('SETBAND_SUC'));
                    $scope.healthDegree();
                }else{
                    $alert.msgDialogError(getRcString('SETBAND_FAIL'));
                }
            }).error(function () {
            });
        };
        //client
        var portalUrl=Utils.getUrl('GET', '', '/portalmonitor/portalusercount', '/init/dashboard2/portal_user_count.json');
        var getClientUrl=Utils.getUrl('GET', '', '/stamonitor/getclientstatisticbymode', '/init/dashboard2/get_client_statistic_by_mode.json');
        $scope.clientCount=function(){
            $http({
                url: portalUrl.url,
                method: portalUrl.method,
                params: {
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function(data){
                $("#portalusercount").html(data.portalusercount);
            }).error(function(){});
            /*$http.get('../../init/dashboard2/get_client_statistic_by_mode.json').success(function(data){
                data.client_statistic.Num5G = data.client_statistic["11ac"] + data.client_statistic["11an"] + data.client_statistic["11a"];
                data.client_statistic.Num2G = data.client_statistic["11gn"] + data.client_statistic["11g"] + data.client_statistic["11b"];
                data.client_statistic.Total = data.client_statistic.Num5G + data.client_statistic.Num2G;
                angular.element("#Current").html(data.client_statistic.Total);
                if(data.client_statistic.Total==0){
                    $scope.drawEmptyPie('client_count','80%','50%');
                }
                console.log(data.client_statistic);
                drawClient(data.client_statistic);
            }).error(function(){});*/
            $http({
                url: getClientUrl.url,
                method: getClientUrl.method,
                params: {
                    'devSN': $scope.sceneInfo.sn
                }
            }).success(function(data){
                data.client_statistic.Num5G = data.client_statistic["11ac"] + data.client_statistic["11an"] + data.client_statistic["11a"];
                data.client_statistic.Num2G = data.client_statistic["11gn"] + data.client_statistic["11g"] + data.client_statistic["11b"];
                data.client_statistic.Total = data.client_statistic.Num5G + data.client_statistic.Num2G;
                $("#Current").html(data.client_statistic.Total);
                if(data.client_statistic.Total==0){
                    $scope.drawEmptyPie('client_count','80%','50%');
                }else{
                    drawClient(data.client_statistic);
                }
                console.log(data.client_statistic);
            }).error(function(){});
        };
        $scope.clientCount();
        drawClient=function(oInfor){
            var clientPie = document.getElementById('client_count');
            if (!clientPie) {return;}
            clientPie = echarts.init(clientPie);
            var clientOption={
                tooltip : {
                    trigger: 'item',
                    formatter: function(aData){
                        return aData[1]+'<br/>' + aData[2] +' (' + Math.round(aData[2]/this._option.nTotal*100) +'%)';
                    }
                },
                // legend: {
                //     orient : 'vertical',
                //     x : '75%',
                //     y : 30,
                //     data: ['802.11ac(5GHz)','802.11an(5GHz)','802.11a(5GHz)','802.11gn(2.4GHz)','802.11g(2.4GHz)','802.11b(2.4GHz)']
                // },
                calculable : false,
                nTotal : oInfor.Total,
                series : [
                    {
                        type:'pie',
                        radius : '45%',
                        center: ['55%', '50%'],
                        itemStyle: {
                            normal: {
                                borderColor:"#FFF",
                                borderWidth:1,
                                labelLine:{
                                    show:false
                                },
                                color: function(a,b,c,d) {
                                    var colorList = ['#78cec3','#c8c3e1'];
                                    return colorList[a.dataIndex];
                                },
                                label:
                                {
                                    position:"inner",
                                    formatter: '{b}'
                                }
                            }
                        },
                        data: [
                            {name:'5GHz',value:oInfor.Num5G||undefined},
                            {name:'2.4GHz',value:oInfor.Num2G||undefined}
                        ]
                    },
                    {
                        type:'pie',
                        radius : ['60%','80%'],
                        center: ['55%', '50%'],
                        itemStyle: {
                            normal: {
                                borderColor:"#FFF",
                                borderWidth:1,
                                labelLine:{
                                    show:true,
                                    length:10
                                },
                                label:
                                {
                                    position:"outer",
                                    textStyle:{color: '#80878C'}
                                    // formatter: function(a,b,c,d){
                                    //     return Math.round(a.value/this._option.nTotal*100)+"%";
                                    // }
                                }
                            }
                        },
                        data: [
                            {name:'802.11ac(5GHz)',value:oInfor["11ac"] || undefined},
                            {name:'802.11an(5GHz)',value:oInfor["11an"] || undefined},
                            {name:'802.11a(5GHz)',value:oInfor["11a"] || undefined},
                            {name:'802.11gn(2.4GHz)',value:oInfor["11gn"] || undefined},
                            {name:'802.11g(2.4GHz)',value:oInfor["11g"] || undefined},
                            {name:'802.11b(2.4GHz)',value:oInfor["11b"] || undefined}
                        ]
                    }
                ],
                color: ['#4ec1b2','#78cec3','#95dad1','#b3b7dd','#c8c3e1','#e7e7e9']
            };
            clientPie.setOption(clientOption);
        };
        //wireless service
        var getssidUrl=Utils.getUrl('GET', '', '/ssidmonitor/getssidlist', '/init/dashboard2/get_ssid_list.json');
        var status=getRcString("STATUS").split(',');
        $scope.wireless_service={
            tId:'wirelessService',
            pageSize: 4,
            paginationSize: "sm",
            showPageList:false,
            searchable: true,
            columns: [
                {sortable: true, field: 'ssidName', title: getRcString("ssidName"), searcher: {type: "text"}},
                {sortable: true, field: 'stName', title: getRcString("WL_SERVICE_NAME"), searcher: {type: "text"}},
                {
                    sortable: true, field: 'status',
                    title: getRcString("WL_SERVICE_STATUS"),
                    searcher: {
                        type: "select",
                        textField: "statusText",
                        valueField: "statusValue",
                        data: [
                            {statusText:status[0] ,statusValue:1},
                            {statusText: status[1],statusValue:2}
                        ]
                    },
                    formatter: function(value, row, index) {
                        var sStatus="";
                        if(value==1){
                            sStatus=status[0];
                        }else if(value==2){
                            sStatus=status[1];
                        }
                        return sStatus;
                    }
                }
            ]
        };
        $http({
            url: getssidUrl.url,
            method: getssidUrl.method,
            params: {
                'devSN': $scope.sceneInfo.sn,
                skipnum:0,
                limitnum:100000
            }
        }).success(function(data){
            if('{"errcode":"illegal access"}' == data){
                console.log(getRcString("NO_AUTHORITY"));
            }
            else{
                /*$.each(data.ssidList,function(index,iDate){
                    var aStatus = getRcText("STATUS").split(',');
                    iDate.status1 = aStatus[iDate.status];
                });*/
                $scope.$broadcast('load#wirelessService',data.ssidList);
            }
        }).error(function(){});

        $scope.urlObj = {
            getAllInterfaces:Utils.getUrl('GET', '', '/devmonitor/getAllInterfaces', '/init/dashboard2/get_ap_count_by_status.json'),
            setOneInterface:Utils.getUrl('GET', '', '/devmonitor/setOneInterface', '/init/dashboard2/get_ap_count_by_status.json'),
            getOneInterfaceData:Utils.getUrl('GET', '', '/devmonitor/getOneInterfaceData', '/init/dashboard2/get_ap_count_by_status.json'),
            getAllinterfaceFlow:Utils.getUrl('GET', '', '/devmonitor/getAllInterfacesFlow', '/init/dashboard2/get_ap_count_by_status.json')
        };
        // storage chart data
        $scope.usageData = [];
        // record request status
        $scope.dataState = 0;
        // judge request status, render chart
        $scope.default = {
            devSN:$stateParams.sn,
            interfaceName:'',
            name:getRcString("no_choose_port")
        };

        $scope.renderEchart = function(){
            if($scope.dataState === 3){
                var isInterface = false;
                angular.forEach($scope.list,function(item,idx){
                    if(item.interfaceName === $scope.interfaceName){
                        console.log('selectName')
                        $scope.selectValue = item;
                        isInterface = true;
                    }
                });
                if(!isInterface){
                    $scope.selectValue = $scope.default;
                }
                $scope.drawWanChart($scope.usageData)
                $scope.$watch('selectValue',$scope.changeSelectValue)
            }
        };

        $scope.changeSelectValue = function(n,o){
            if(n.interfaceName){
                var count = 0;
                $http({
                    method:$scope.urlObj.getAllinterfaceFlow.method,
                    url:$scope.urlObj.getAllinterfaceFlow.url,
                    params: {
                        'devSN': $stateParams.sn
                    }
                }).success(function(data){
                    count++;
                    $scope.usageData[0] = data.DataList;
                    if(count === 2){
                        $scope.drawWanChart($scope.usageData)
                    }
                })

                $http({
                    method:$scope.urlObj.setOneInterface.method,
                    url:$scope.urlObj.setOneInterface.url,
                    params:{
                        'devSN': $stateParams.sn,
                        interfaceName:$scope.selectValue.interfaceName,
                        interfaceType:$scope.selectValue.interfaceType
                    }
                }).success(function(data){
                    count++;
                    if(data.errcode === 0){
                        $scope.usageData[1] = data.histdataList.dataList.reverse();
                        $scope.usageData[1].name = $scope.getAbbreviate(data.histdataList.interfaceName);
                        if(count ===2){
                            $scope.drawWanChart($scope.usageData)
                        }
                    }
                })
            }else{
                if($scope.usageData.length === 2){
                    $scope.usageData.pop()
                    $scope.drawWanChart($scope.usageData)
                    $http({
                        method:$scope.urlObj.setOneInterface.method,
                        url:$scope.urlObj.setOneInterface.url,
                        params:{
                            'devSN': $stateParams.sn,
                            interfaceName:$scope.selectValue.interfaceName,
                            interfaceType:$scope.selectValue.interfaceType
                        }
                    }).success(function(data){
                        if(data.errcode === 0){
                            console.log('success')
                        }
                    })
                }
            }
        };
        //get list
        $http({
            method:$scope.urlObj.getAllInterfaces.method,
            url:$scope.urlObj.getAllInterfaces.url,
            params: {
                'devSN': $stateParams.sn
            }
        }).success(function(data){
            data.InterfaceList.forEach(function(item,idx){
                item.name = $scope.getAbbreviate(item.interfaceName)
            })
            data.InterfaceList.unshift($scope.default);
            $scope.list = data.InterfaceList;
            $scope.dataState++;
            $scope.renderEchart()
        });
        //get oneInterface
        $http({
            method:$scope.urlObj.getOneInterfaceData.method,
            url:$scope.urlObj.getOneInterfaceData.url,
            params: {
                'devSN': $stateParams.sn
            }
        }).success(function(data){
            $scope.dataState++;
            if(data.flag === 0){
                // console.log('flag === 0')
                $scope.usageData[1] = data.histdataList.dataList.reverse();
                $scope.usageData[1].name = $scope.getAbbreviate(data.histdataList.interfaceName);
                $scope.interfaceName = data.histdataList.interfaceName
            }
            $scope.renderEchart()
        });
        //get all
        $http({
            method:$scope.urlObj.getAllinterfaceFlow.method,
            url:$scope.urlObj.getAllinterfaceFlow.url,
            params: {
                'devSN': $stateParams.sn
            }
        }).success(function(data){
            $scope.usageData[0] = data.DataList;
            $scope.dataState++;
            $scope.renderEchart()
        });

        function addComma (sNum, Stype/*Stype=rate,.memory*/, nStart, nEnd) {
            function doFormat(num, type, start, end) {
                if (!(typeof(num) === "string" || typeof(num) === "number") || Number(num) != Number(num)) {
                    return num;
                }
                var max, len, remain, unit, fixed;
                var flag = "";
                start = start || 0;
                end = typeof end == "undefined" ? 3 : end;
                switch (type) {
                    case "memory":
                        max = 1000;
                        unit = ["B", "KB", "MB", "GB"];
                        break;
                    case "rate":
                        max = 1024;
                        unit = ["bps", "Kbps", "Mbps", "Gbps"];
                        break;
                    default:
                        max = Infinity;
                        unit = [""];
                        fixed = 0;
                        break;
                }
                if (num < 0) {
                    num = -num;
                    flag = "-"
                }
                while (num >= max && start < end) {
                    num = num / max;
                    start++;
                    fixed = 1;
                }
                num = Number(num).toFixed(fixed).split(".");
                if (fixed) {
                    unit = "." + num[1] + unit[start];
                } else {
                    unit = unit[start];
                }
                num = num[0];
                len = num.length;
                if (len < 3) {
                    return flag + num + unit;
                }
                remain = len % 3;
                if (remain > 0) {
                    num = num.slice(0, remain) + "," + num.slice(remain, len).match(/\d{3}/g).join(",");

                } else {
                    num = num.slice(remain, len).match(/\d{3}/g).join(",");
                }
                return flag + num + unit;

            }

            if ($.isPlainObject(sNum)) {
                for (key in sNum) {
                    sNum[key] = doFormat(sNum[key], Stype, nStart, nEnd);
                }
            } else {
                sNum = doFormat(sNum, Stype, nStart, nEnd);
            }
            return sNum;
        }


        $scope.timeStatus=function(time) {
            // body...
            if (time < 10) {
                return "0" + time;
            }
            return time;
        };

        $scope.getAbbreviate = function getAbbreviate(str){
            var firstLetter = str[0]
            switch(firstLetter){
                case 'G':
                    return Array.prototype.slice.call(/(G)igabit(E)thernet(\d\/\d\/*\d*)/.exec(str),1).join('').toUpperCase();
                case 'T':
                    return Array.prototype.slice.call(/(Ten)-GigabitEthernet(\d\/\d\/*\d*)/.exec(str),1).join('');
                case 'B':
                    return Array.prototype.slice.call(/(B)ridge-(Agg)regation(\d*)/.exec(str),1).join('').toUpperCase();
                case 'F':
                    return Array.prototype.slice.call(/(Forty)GigE(\d\/\d\/\d*)/.exec(str),1).join('');
            }
        };


        $scope.drawWanChart=function(aData){
            var chartWan = document.getElementById("usage");
            if (!chartWan) {return;}
            chartWan = echarts.init(chartWan);
            var aTimes = [];
            var aServices = [];
            var aLegend = [getRcString("ZONGLIANG")];
            var aTooltip = getRcString("total_flow_up_down").split(",");
            var aColor = ["rgba(29,143,222,.2)","rgba(186,85,211,.2)"];
            // var reg = /./;
            // var reg2 = /G\d{1,2}/;
            // var aColor = ["rgba(120,206,195,1)", "rgba(254,240,231,1)", "rgba(144,129,148,1)", "rgba(254,184,185,1)"];
            //x-time
            $.each(aData[0], function(i, oData) {
                var temp = new Date(oData.updateTime);
                aTimes.push(($scope.timeStatus(temp.getHours())||'00') + ":" + ($scope.timeStatus(temp.getMinutes())||'00') + ":" + ($scope.timeStatus(temp.getSeconds())||'00'));
            });
            angular.forEach(aData, function(oData,i) {
                if(i === 1){
                    aLegend.push(oData.name +" "+getRcString("LIULIANG"));
                    aTooltip.push(oData.name+" " +getRcString("STREAM").split(",")[0],oData.name+" " +getRcString("STREAM").split(",")[1])
                }


                var aUp = [];
                var aDown = [];
                angular.forEach(aData[i], function(oData,i) {
                    aUp.push(oData.speed_up);
                    aDown.push(-oData.speed_down);
                });

                var oUp = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default',
                                color: aColor[i]
                            }
                        }
                    },
                    name: aLegend[i],
                    data: aUp
                };
                var oDown = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            areaStyle: {
                                type: 'default',
                                color: aColor[i]

                            }
                        }
                    },
                    name: aLegend[i],
                    data: aDown
                };
                //
                aServices.push(oUp);
                aServices.push(oDown);
            });

            var chartWanOption = {
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#80878C',
                            width: 2,
                            type: 'solid'
                        }
                    }
                    ,formatter: function(y) {
                        var sTips = y[0][1] + '<br/>';
                        y.forEach(function(item,idx){
                            sTips += aTooltip[idx] + ':' + addComma(Math.abs(item[2]), "rate", 1) +"<br/>"
                        });
                        return sTips;
                    }
                },
                legend: {
                    orient: "horizontal",
                    y: 0,
                    x: "center",
                    data: aLegend
                },
                grid: {
                    x: 100,
                    y: 40,
                    borderColor: '#FFF'
                },
                calculable: false,
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    splitLine: true,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#80878C',
                            width: 2
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#80878C',
                            width: 2
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    data: aTimes
                }],
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#80878C',
                            width: 2
                        },
                        formatter: function(nNum) {
                            return addComma(Math.abs(nNum), 'rate', 1);
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#80878C',
                            width: 2
                        }
                    }
                }],
                series: aServices,
                color: ["rgba(29,143,222,.4)","rgba(75,0,130,.4)"]
            };
            chartWan.setOption(chartWanOption);
        };
    }]
});
