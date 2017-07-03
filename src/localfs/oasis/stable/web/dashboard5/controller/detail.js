define(['jquery','echarts','utils','angular-ui-router','bsTable', 'css!dashboard5/css/index.css',
    'dashboard5/directive/dashboard_log',
    'dashboard5/directive/dashboard_online_customer',
    'dashboard5/directive/dashboard_wiser',
    'dashboard5/directive/dashboard_flow',
    'dashboard5/directive/dashboard_ap',
    'dashboard5/directive/dashboard_health'
    ],function($,echarts,Utils) {
    return ['$scope', '$http', '$state','$rootScope',function($scope,$http,$state,$rootScope) {
        function getRcString(attrName) {
            return Utils.getRcString("wireless_service_rc", attrName);
        }
        //console.log($scope.sceneInfo.sn);
        //console.log($scope.sceneInfo.nasid);
        //console.log($rootScope.userInfo.user);
        //draw empty pie
        $scope.drawEmptyPie = function (id, vertical) {
            var terminalAuth = echarts.init(document.getElementById(id));
            var terAuthOption = {
                height: 245,
                calculable: false,
                tooltip: {
                    show: true,
                    trigger: 'item'
                },
                series: [
                    {
                        type: 'pie',
                        minAngle: '3',
                        radius: '55%',
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
        //onlineStatistics
        var onlineStatisticsUrl = Utils.getUrl('GET', '', '/stamonitor/getstastatistic', '/init/dashboard5/online_statistics.json');
        $http({
            url: onlineStatisticsUrl.url,
            method: onlineStatisticsUrl.method,
            params: {'devSN': $scope.sceneInfo.sn}
        }).success(function (data) {
            $scope.newUser = data.stationList.NewStaCount;
            $scope.clientCount = data.stationList.OldStaCount;
        }).error(function () {});
        var adStatisticsUrl = Utils.getUrl('GET', 'o2o', '/oasis/auth-data/o2oportal/advertisement/queryBySpan', '/init/dashboard5/query_by_span.json');
        $scope.curdate = new Date();
        $scope.zerodate = new Date(new Date().toLocaleDateString());
        $scope.startTime = $scope.zerodate.getTime();
        $scope.endTime = $scope.curdate.getTime();
        //console.log($scope.startTime);
        $http({
            url: adStatisticsUrl.url,
            method: adStatisticsUrl.method,
            params: {
                ownerName: $rootScope.userInfo.user,
                'devSN': $scope.sceneInfo.sn,
                storeId: 597,
                span: 1296000000,
                startTime: $scope.startTime,
                endTime: $scope.endTime
            }
        }).success(function (data) {
            console.log(data);
            if (data.errorcode == 0) {
                $scope.adCount = data.data[0].pv;
                $scope.clickCount = data.data[0].clickCount;
            }
        }).error(function () {});
        //认证终端
        var terUrl = Utils.getUrl('GET', '', '/stamonitor/getclientlistbycondition', '/init/dashboard5/get_bycondition.json');
        var aSatus = getRcString("PORTALSTA").split(',');
        $http({
            url: terUrl.url,
            method: terUrl.method,
            params: {
                'devSN': $scope.sceneInfo.sn,
                reqType: 'all'
            }
        }).success(function (data) {
            if (data.clientList[0].totalCount == 0) {
                $scope.drawEmptyPie('pie_terminal', '35%');
            } else {
                var aData = [
                    {name: aSatus[0], value: data.clientList[0].conditionCount},
                    {name: aSatus[1], value: data.clientList[0].totalCount - data.clientList[0].conditionCount}
                ];
                $scope.drawPortalPie(aData);
            }
        }).error(function () {});
        $scope.drawPortalPie = function (data) {
            var terminal = echarts.init(document.getElementById('pie_terminal'));
            var terOption = {
                animation: true,
                calculable: false,
                height: 160,
                tooltip: {
                    show: true,
                    formatter: function (aData) {
                        var sLable = aData[1] + ":<br/> " + aData[2] + " (" + Math.round(aData[3]) + "%)";
                        return sLable;
                    }
                },
                legend: {
                    orient: 'horizontal',
                    y:180,
                    data:aSatus
                },
                series: [{
                    name: 'APs',
                    type: 'pie',
                    minAngle: '3',
                    radius: '60%',
                    center: ['50%', '35%'],
                    itemStyle: {
                        normal: {
                            borderColor: "#FFF",
                            borderWidth: 1,

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
                    data: data
                }],
                // click: onClickPie
                color: ["#4ec1b2", "#E7E7E9"]
            };
            terminal.setOption(terOption);
        };
        //终端类型
        var terTypeUrl = Utils.getUrl('GET', '', '/stamonitor/getclientlistbycondition', '/init/dashboard5/get_bymode.json');
        $http({
            url: terTypeUrl.url,
            method: terTypeUrl.method,
            params: {
                'devSN': $scope.sceneInfo.sn,
                reqType: 'mode'
            }
        }).success(function (data) {
            //console.log(data);
            var newObject = data.clientList;
            var oStaMode = {};
            oStaMode.Num5G = 0;
            oStaMode.Num2G = 0;
            oStaMode.count_one = 0;
            oStaMode.count_two = 0;
            oStaMode.count_three = 0;
            oStaMode.count_four = 0;
            oStaMode.count_five = 0;
            oStaMode.count_six = 0;
            for (var i = 0; i < newObject.length; i++) {
                if (newObject[i]._id == '802.11ac') {
                    oStaMode.count_one = newObject[i].clientCount
                } else if (newObject[i]._id == '802.11an') {
                    oStaMode.count_two = newObject[i].clientCount
                } else if (newObject[i]._id == '802.11a') {
                    oStaMode.count_three = newObject[i].clientCount
                } else if (newObject[i]._id == '802.11gn') {
                    oStaMode.count_four = newObject[i].clientCount
                } else if (newObject[i]._id == '802.11g') {
                    oStaMode.count_five = newObject[i].clientCount
                } else if (newObject[i]._id == '802.11b') {
                    oStaMode.count_six = newObject[i].clientCount
                }
            }
            oStaMode.Num5G = oStaMode.count_one + oStaMode.count_two + oStaMode.count_three;
            oStaMode.Num2G = oStaMode.count_four + oStaMode.count_five + oStaMode.count_six;
            console.log(oStaMode.count_one);
            if (oStaMode.Num5G == 0 && oStaMode.Num2G == 0) {
                $scope.drawEmptyPie('Terminal_type', '35%');
                return;
            } else {
                $scope.drawStaMode(oStaMode);
            }
        }).error(function () {});
        $scope.drawStaMode = function (aData) {
            var terNumber=getRcString("TERMINAL_NUMBER");
            var terminalType = echarts.init(document.getElementById('Terminal_type'));
            var terminalOption = {
                animation: true,
                tooltip: {
                    trigger: 'item',
                     /*formatter: "{a} <br/>{b}: {c} ({d}%)"*/
                    formatter: function (aData) {
                        var sLable = aData[1] + terNumber+":<br/> " + aData[2] + " (" + Math.round(aData[3]) + "%)";
                        return sLable;
                    }
                },
                legend: {
                    orient: 'vertical',
                    y: 'bottom',
                    data: ['802.11ac(5GHz)', '802.11an(5GHz)', '802.11a(5GHz)', '', '802.11gn(2.4GHz)', '802.11g(2.4GHz)', '802.11b(2.4GHz)']
                },
                series: [
                    {
                        type: 'pie',
                        radius: '30%',
                        center: ['50%', '35%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                color: function (a, b, c, d) {
                                    var colorList = ['#4ec1b2', '#b3b7dd'];
                                    return colorList[a.dataIndex];
                                },
                                label: {
                                    position: "inner",
                                    show: false
                                }
                            }
                        },
                        data: [
                            {name: '5GHz', value: aData.Num5G},
                            {name: '2.4GHz', value: aData.Num2G}
                        ]
                        // [
                        //     {name:'5GHz',value:10},
                        //     {name:'2.4GHz',value:30}
                        // ]
                    },
                    {
                        type: 'pie',
                        radius: ['40%', '60%'],
                        center: ['50%', '35%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    //position: "inner",
                                    show: false
                                }
                            }
                        },
                        data: [
                            {name: '802.11ac(5GHz)', value: aData.count_one},
                            {name: '802.11an(5GHz)', value: aData.count_two},
                            {name: '802.11a(5GHz)', value: aData.count_three},
                            {name: '802.11gn(2.4GHz)', value: aData.count_four},
                            {name: '802.11g(2.4GHz)', value: aData.count_five},
                            {name: '802.11b(2.4GHz)', value: aData.count_six}
                        ]
                        // [
                        //     {name:'802.11ac(5GHz)',value:5},
                        //     {name:'802.11an(5GHz)',value:6},
                        //     {name:'802.11a(5GHz)',value:9},
                        //     {name:'802.11gn(2.4GHz)',value:12},
                        //     {name:'802.11g(2.4GHz)',value:20},
                        //     {name:'802.11b(2.4GHz)',value:7}
                        // ]
                    }
                ],
                color: ['#4ec1b2', '#78cec3', '#95dad1', '#b3b7dd', '#c8c3e1', '#e7e7e9']
            };
            terminalType.setOption(terminalOption);
        };
        //终端厂商
        var terFirmUrl = Utils.getUrl('GET', '', '/stamonitor/getclientlistbycondition', '/init/dashboard5/get_bybyod.json');
        $http({
            url: terFirmUrl.url,
            method: terFirmUrl.method,
            params: {
                'devSN': $scope.sceneInfo.sn,
                reqType: 'vendor'
            }
        }).success(function (data) {
            var oData = data.clientList;
            var aLegend = [];
            var aData = [];
            $.each(oData, function (i, item) {
                aLegend[i] = item._id || getRcString("WEIZHI");
                aData[i] = {};
                aData[i].name = item._id || getRcString("WEIZHI");
                aData[i].value = item.clientCount || undefined;
            });
            $scope.deviceLength = aData.length;
            console.log($scope.deviceLength);
            if ($scope.deviceLength == 0) {
                $scope.drawEmptyPie('Terminal_firm', '35%');
            } else {
                $scope.drawStaByod(aLegend, aData);
            }
        }).error(function () {});
        $scope.drawStaByod = function (name, number) {
            var terminalFac = echarts.init(document.getElementById("Terminal_firm"));
            var terFacOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} {b} <br/>{c} ({d}%)",

                },
                legend: {
                    orient: 'horizontal',
                    y:180,
                    data: name
                },
                calculable: false,
                // click: function(oInfo) {
                //     openDalg(oInfo.name, "", "MobileCompany");
                // },
                series: [{
                    type: 'pie',
                    radius: ['40%','60%'],
                    center: ['50%', '35%'],
                    itemStyle: {
                        normal: {
                            //color:'#4EC1B2',
                            borderColor: "#FFF",
                            borderWidth: 1,
                            labelLine: {
                                show: false
                            },
                            label: {
                                // position:"inner",
                                // formatter: function(a,b,c,d){
                                //     return Math.round(a.percent)+"%";
                                // }
                                show: false
                            }
                        }
                    },
                    data: number
                }],
                color: ['#4ec1b2', '#fbceb1', '#b3b7dd', '#4fc4f6', '#fe808b', '#e7e7e9']
            };
            terminalFac.setOption(terFacOption);
        };
    }]
});