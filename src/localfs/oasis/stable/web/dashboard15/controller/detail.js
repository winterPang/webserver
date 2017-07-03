define(['jquery', 'echarts', 'utils', 'angular-ui-router', 'bsTable', 'css!dashboard15/css/index.css'
], function ($, echarts, Utils) {
    return ['$scope', '$http', '$state', '$rootScope', '$timeout', function ($scope, $http, $state, $rootScope, $timeout) {
        function getRcString(attrName) {
            return Utils.getRcString("wireless_service_rc", attrName);
        }

        var URL_GET_AP_STATUS = '/v3/apmonitor/getApStatusCountByCloudGroup?topId=%s&midId=%s';
        var URL_GET_WISER = '/v3/ssidmonitor/getssidinfobrief?devSN=%s&ownerName=%s&topName=%s&midName=%s&nasId=%s';

        var URL_BASE_STA_MONITOR = '/v3/stamonitor/monitor';

        var USER_ROOT = $rootScope.userRoles.userRoot;
        var USER_NAME = $scope.userInfo.attributes.name;
        var NASID = $scope.sceneInfo.nasid;
        var GROUP_NAME = $scope.branchName;
        var TOP_NAME = $scope.topName;
        var DEVSN = $scope.sceneInfo.sn;

        $scope.apCount = function () {
            $http.get(sprintf(URL_GET_AP_STATUS, TOP_NAME, GROUP_NAME)).success(function (data) {
                $scope.apOnline = data.ap_statistic.online;
                $scope.apTotal = data.ap_statistic.online + data.ap_statistic.offline + data.ap_statistic.other + data.ap_statistic.unmatched;
                if ($scope.apTotal == 0) {
                    $scope.drawEmptyPie('pie_aps', '28%');
                } else {
                    var datas = [{
                        name: $scope.onlineAp,//getRcString("ONLINEAP"),
                        value: data.ap_statistic.online
                    }, {
                        name: $scope.offlineAp,//getRcString("OFFLINEAP"),
                        value: data.ap_statistic.offline
                    }];
                    $scope.drawChartScore(datas);
                }
            }).error(function () {
            });
        };
        $scope.apCount();
        $scope.refreshAP = function () {
            $scope.apCount();
        };
        $scope.drawChartScore = function (aData) {
            var apCount = echarts.init(document.getElementById('pie_aps'));
            var apOption = {
                //color: '#4EC1B2',
                animation: true,
                calculable: false,
                height: 245,
                tooltip: {
                    show: true,
                    formatter: function (aData) {
                        var sLable = aData[1] + ":<br/> " + aData[2] + " (" + Math.round(aData[3]) + "%)";
                        return sLable;
                    }/*,
                     position: function (p) {
                     return [p[0] - 30, p[1]];
                     }*/
                },
                series: [{
                    name: 'APs',
                    type: 'pie',
                    minAngle: '3',
                    radius: '55%',
                    // selectedMode: "single",
                    // selectedOffset: 10,
                    center: ['50%', '28%'],
                    itemStyle: {
                        normal: {
                            //color: '#4EC1B2',
                            borderColor: "#FFF",
                            borderWidth: 1,
                            label: {
                                position: 'inner',
                                formatter: function (a, b, c, d) {
                                    return Math.round(a.percent) + "%";
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
                    data: aData
                }],
                color: ["#78CEC3", "#E2E2E2"]
            };
            apCount.setOption(apOption);
        };

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
        $scope.curdate = new Date();
        $scope.zerodate = new Date(new Date().toLocaleDateString());
        $scope.startTime = $scope.zerodate.getTime();
        $scope.endTime = $scope.curdate.getTime();

        //client auth
        var aSatus = getRcString("PORTALSTA").split(',');
        $http({
            url: URL_BASE_STA_MONITOR,
            method: 'POST',
            data: {
                method: 'clientcount_cloud_condition',
                param: {
                    topId: TOP_NAME,
                    groupId: GROUP_NAME
                }
            }
        }).success(function (data) {
            if ((data.response.asymmetricCount + data.response.conditionCount) == 0) {
                $scope.drawEmptyPie('pie_terminal', '35%');
            } else {
                var aData = [
                    {name: aSatus[0], value: data.response.conditionCount},
                    {name: aSatus[1], value: data.response.asymmetricCount}
                ];
                $scope.drawPortalPie(aData);
            }
        }).error(function () {
        });
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
                    y: 180,
                    data: aSatus
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

        //client mode
        $http({
            url: URL_BASE_STA_MONITOR,
            method: 'POST',
            data: {
                method: 'clientcount_cloud_clientmode',
                param: {
                    topId: TOP_NAME,
                    groupId: GROUP_NAME,
                    dataType: ''
                }
            }
        }).success(function (data) {
            var newObject = data.response;
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
                if (newObject[i].clientMode == '802.11ac') {
                    oStaMode.count_one = newObject[i].count
                } else if (newObject[i].clientMode == '802.11an') {
                    oStaMode.count_two = newObject[i].count
                } else if (newObject[i].clientMode == '802.11a') {
                    oStaMode.count_three = newObject[i].count
                } else if (newObject[i].clientMode == '802.11gn') {
                    oStaMode.count_four = newObject[i].count
                } else if (newObject[i].clientMode == '802.11g') {
                    oStaMode.count_five = newObject[i].count
                } else if (newObject[i].clientMode == '802.11b') {
                    oStaMode.count_six = newObject[i].count
                }
            }
            oStaMode.Num5G = oStaMode.count_one + oStaMode.count_two + oStaMode.count_three;
            oStaMode.Num2G = oStaMode.count_four + oStaMode.count_five + oStaMode.count_six;
            if (oStaMode.Num5G == 0 && oStaMode.Num2G == 0) {
                $scope.drawEmptyPie('Terminal_type', '35%');
            } else {
                $scope.drawStaMode(oStaMode);
            }
        }).error(function () {
        });
        $scope.drawStaMode = function (aData) {
            var terNumber = getRcString("TERMINAL_NUMBER");
            var terminalType = echarts.init(document.getElementById('Terminal_type'));
            var terminalOption = {
                animation: true,
                tooltip: {
                    trigger: 'item',
                    /*formatter: "{a} <br/>{b}: {c} ({d}%)"*/
                    formatter: function (aData) {
                        var sLable = aData[1] + terNumber + ":<br/> " + aData[2] + " (" + Math.round(aData[3]) + "%)";
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
                    }
                ],
                color: ['#4ec1b2', '#78cec3', '#95dad1', '#b3b7dd', '#c8c3e1', '#e7e7e9']
            };
            terminalType.setOption(terminalOption);
        };

        //client vonder
        $http({
            url: URL_BASE_STA_MONITOR,
            method: 'POST',
            data: {
                method: 'clientcount_cloud_vendor',
                param: {
                    topId: TOP_NAME,
                    groupId: GROUP_NAME,
                    dataType: ''
                }
            }
        }).success(function (data) {
            var oData = data.response;
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
        }).error(function () {
        });
        $scope.drawStaByod = function (name, number) {
            var terminalFac = echarts.init(document.getElementById("Terminal_firm"));
            var terFacOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} {b} <br/>{c} ({d}%)"

                },
                legend: {
                    orient: 'horizontal',
                    y: 180,
                    data: name
                },
                calculable: false,
                // click: function(oInfo) {
                //     openDalg(oInfo.name, "", "MobileCompany");
                // },
                series: [{
                    type: 'pie',
                    radius: ['40%', '60%'],
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

        //online-customer
        $scope.initUserChange = function (data_type) {
            $scope.time = data_type;
            $http({
                url: URL_BASE_STA_MONITOR,
                method: 'POST',
                data: {
                    'method': data_type,
                    'param': {
                        topId: TOP_NAME,
                        groupId: GROUP_NAME,
                        dataType: ''
                    }
                }
            }).success(function (data) {
                //data  {errCode: 0, response: [{time: "2016-12-24T16:00:00.000Z", totalCount: 0, newCount: 0},…]}
                $scope.g_AllUser = [];
                $scope.g_onlineTime = [];
                $scope.g_Time = [];
                $scope.newlength = data.response.length;
                for (var i = 0; i < $scope.newlength; i++) {
                    $scope.g_AllUser.push(data.response[i].totalCount);
                    $scope.g_onlineTime.push(data.response[i].time);
                }
                for (var j = 0; j < $scope.newlength; j++) {
                    if ($scope.time == "clientstat_cloud_yesterday") {
                        $scope.g_Time.push(new Date($scope.g_onlineTime[j]).getHours() + ":" + "00");
                    }
                    else {
                        $scope.g_Time.push(new Date(new Date($scope.g_onlineTime[j]) - 1000).getMonth() + 1 + "-" + new Date(new Date($scope.g_onlineTime[j]) - 1000).getDate());
                    }
                }
                $scope.customerChange($scope.g_AllUser, $scope.g_Time);
            }).error(function () {
            });
        };
        $scope.customerChange = function (customer, time) {
            var customerChart = echarts.init(document.getElementById('userchange'));
            var customerOption = {
                color: ['#4EC1B2'],
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [$scope.terminalNumber]
                },
                grid: {
                    x: '45',
                    y: '30',
                    x2: '30',
                    y2: '30',
                    containLabel: true,
                    borderWidth: 0
                },
                calculable: true,
                xAxis: [
                    {
                        //type : 'time',
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#AEAEB7',
                                width: '1'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#617085'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        boundaryGap: false,
                        data: time
                    }
                ],
                yAxis: [
                    {
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#AEAEB7',
                                width: '1'
                            }
                        },
                        type: 'value',
                        splitNumber: 5,
                        splitLine: {
                            lineStyle: {
                                color: '#eee'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#617085'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: $scope.terminalNumber,
                        type: 'line',
                        // symbol: 'none',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: 'default'
                                }/*,
                                lineStyle: {
                                    color: '#F9AB6B'
                                }*/
                            }
                        },
                        data: customer
                    }
                ]
            };
            customerChart.setOption(customerOption);
        };
        $scope.initUserChange("clientstat_cloud_yesterday");

        //wiser
        $timeout(function () {
            $scope.option = {
                tId: 'wiser',
                url: sprintf(URL_GET_WISER, DEVSN, USER_NAME, TOP_NAME, GROUP_NAME, NASID),
                pageSize: 5,
                pageList: [5, 10],
                totalField: 'ssidTotalCnt',
                dataField: 'ssidList',
                sidePagination: 'server',
                queryParams: function (o) {
                    return o;
                },
                columns: [
                    {
                        field: 'ssidName',
                        title: $scope.RC_TABLE_COLUMN_SSID
                    },
                    {
                        field: 'status',
                        title: $scope.RC_TABLE_COLUMN_SSID_STATUS,
                        formatter: function (value, row, index) {
                            var sStatus = $scope.RC_TITLE_WISER_STATUS_OFF;
                            if (value == 1) {
                                sStatus = $scope.RC_TITLE_WISER_STATUS_ON;
                            }
                            return sStatus;
                        }
                    },
                    {
                        field: 'clientCount',
                        title: $scope.RC_TABLE_COLUMN_CLIENT_COUNT
                    },
                    {
                        field: 'ApCnt',
                        title: $scope.RC_TABLE_COLUMN_AP_COUNT
                    },
                    {
                        field: 'ApGroupCnt',
                        title: $scope.RC_TABLE_COLUMN_AP_GROUP_COUNT
                    }
                ]
            };
        });
    }]
});