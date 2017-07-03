define(['jquery', 'echarts'], function ($scope, echarts) {
    return ['$scope', '$http', '$state', function ($scope, $http, $state) {
        $scope.redirectCustomer = function () {
            $state.go("^.customer");
        };
        var TOP_NAME = $scope.topName;
        var GROUP_NAME = $scope.branchName;
        var DEV_SN = $scope.sceneInfo.sn;
        var URL_POST_COMMON = '/v3/stamonitor/monitor';
        var URL_GET_AUTH_COUNT_CLOUD_AP = '/v3/visitor/getAuthCountByCloudap?topId=%s&groupId=%s&dataType=%s';

        //client num
        $http({
            method: 'POST',
            url: URL_POST_COMMON,
            data: {
                method: 'clientcount_cloud_auth',
                param: {
                    topId: TOP_NAME,
                    groupId: GROUP_NAME,
                    dataType: 'auth'
                }
            }
        }).success(function (data) {
            $("#portalNum2G").html(data.response.authClientCount_2p4G);
            $("#portalNum5G").html(data.response.authClientCount_5G);
            $("#portalTotal").html(data.response.authClientTotalCount);
        }).error(function () {
        });

        //customer total
        $scope.chouseUrl = function (mode) {
            if (mode == 1) {
                para = "clientstat_cloud_yesterday";
            }
            else if (mode == 2) {
                para = "clientstat_cloud_lastweek";
            }
            else if (mode == 3) {
                para = "clientstat_cloud_lastmonth";
            }
            $http({
                method: 'POST',
                url: URL_POST_COMMON,
                data: {
                    method: para,
                    param: {
                        topId: TOP_NAME,
                        groupId: GROUP_NAME,
                        dataType: 'auth'
                    }
                }
            }).success(function (data) {
                $scope.g_AllUser = [];
                $scope.g_newUser = [];
                $scope.g_onlineTime = [];
                $scope.g_Time = [];
                $scope.newlength = data.response.length;
                for (var i = 0; i < $scope.newlength; i++) {
                    $scope.g_newUser.push(data.response[i].newCount);
                    $scope.g_AllUser.push(data.response[i].totalCount);
                    $scope.g_onlineTime.push(data.response[i].time);
                }
                for (var j = 0; j < $scope.newlength; j++) {
                    if (mode == 1) {
                        $scope.g_Time.push(new Date($scope.g_onlineTime[j]).getHours() + ":" + "00");
                    }
                    else {
                        $scope.g_Time.push(new Date(new Date($scope.g_onlineTime[j]) - 1000).getMonth() + 1 + "-" + new Date(new Date($scope.g_onlineTime[j]) - 1000).getDate());
                    }
                }
                $scope.myechart_rz($scope.g_AllUser, $scope.g_newUser, $scope.g_Time);
            }).error(function () {

            });
        };
        $scope.myechart_rz = function (allcouver, newcouver, time) {
            var customerChart = echarts.init(document.getElementById('portalUser'));
            var customerOption = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    itemWidth: 8,
                    data: [$scope.newCustomer, $scope.allCustomer]
                },
                grid: {
                    x: 40, y: 40, x2: 30, y2: 25,
                    borderColor: '#fff'
                },
                xAxis: [
                    {
                        boundaryGap: true,
                        splitLine: false,
                        axisLine: {
                            show: true,
                            lineStyle: {color: '#9da9b8', width: 1}
                        },
                        axisTick: {show: false},
                        type: 'category',
                        data: time
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: $scope.customerCount,
                        interval: 50,
                        axisTick: {show: false},
                        splitLine: {
                            show: true,
                            textStyle: {color: '#c9c4c5', fontSize: "1px", width: 4},
                            lineStyle: {
                                color: ['#e7e7e9']
                            }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {color: '#9da9b8', width: 1}
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {color: '#9da9b8', fontSize: "12px", width: 2},
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: $scope.newCustomer,
                        type: 'bar',
                        barCategoryGap: '40%',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false,
                                    position: 'insideTop',
                                    formatter: function (oData) {
                                        return oData.value;
                                    }
                                },
                                color: '#69C4C5'
                            }
                        },
                        data: newcouver
                    },
                    {
                        name: $scope.allCustomer,
                        type: 'line',
                        barCategoryGap: '40%',
                        itemStyle: {
                            normal: {
                                color: '#F9AB6B'
                            }
                        },
                        data: allcouver
                    }
                ]
            };
            customerChart.setOption(customerOption);
        };
        $scope.clickTest = function (e) {
            $('#total a.time-link').removeClass('active');
            var value = e.target.getAttribute('value');
            $('#total a[value = ' + value + ']').addClass('active');
            $scope.chouseUrl(value);
        };
        $scope.chouseUrl(1);

        //customer flow total
        //onlinetime
        $http({
            method: 'POST',
            url: URL_POST_COMMON,
            data: {
                method: 'clientcount_cloud_onlinetime',
                param: {
                    topId: TOP_NAME,
                    groupId: GROUP_NAME,
                    dataType: 'auth'
                }
            }
        }).success(function (data) {
            var stayChart = echarts.init(document.getElementById('ViewPie'));
            if (data.response.halfhour == 0 && data.response.onehour == 0 && data.response.twohour == 0 && data.response.greatertwohour == 0) {
                stayChart.setOption(grayOption);
                return;
            }
            var aType = [
                {name: $scope.stayType_1, value: data.response.halfhour},
                {name: $scope.stayType_2, value: data.response.onehour},
                {name: $scope.stayType_3, value: data.response.twohour},
                {name: $scope.stayType_4, value: data.response.greatertwohour}
            ];
            var stayOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} {b} : <br/>{c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    y: 'bottom',
                    data: [$scope.stayType_1, $scope.stayType_2, '', $scope.stayType_3, $scope.stayType_4]
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '55%'],
                        center: ['47%', '47%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        },
                        data: aType
                    }
                ],
                color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd']
            };
            stayChart.setOption(stayOption);
            var normalnumber = $scope.custCount;
            var appendTohtml = [
                '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 10px; margin-top: 32px;">',
                normalnumber,
                '</span>',
                '</div>'
            ].join(" ");
            $(appendTohtml).appendTo($("#ViewPie"));
        }).error(function (data, header, config, status) {
        });
        var grayOption = {
            height: 200,
            calculable: false,
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '55%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
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
            ],
            color: ["rgba(216, 216, 216, 0.75)"]
        };

        //visitor num
        // $http.get(sprintf(URL_GET_AUTH_COUNT_CLOUD_AP, TOP_NAME, GROUP_NAME, 'auth')).success(function (data) {
        //     var visitChart = echarts.init(document.getElementById('onlinePie'));
        //     $.each(data.result, function (i, v) {
        //         v.devSN == DEV_SN && (data.result = v);
        //     });
        //     if ((data.result.count1 == 0 && data.result.count2 == 0 && data.result.count3 == 0 && data.result.count4 == 0) || data.result.length == 0) {
        //         visitChart.setOption(grayOption);
        //         return;
        //     }
        //     var aType = [
        //         {name: $scope.visitCount_1, value: data.result.count1},
        //         {name: $scope.visitCount_2, value: data.result.count2},
        //         {name: $scope.visitCount_3, value: data.result.count3},
        //         {name: $scope.visitCount_4, value: data.result.count4}
        //     ];
        //     var visitOption = {
        //         tooltip: {
        //             trigger: 'item',
        //             formatter: "{a} {b} : <br/>{c} ({d}%)"
        //         },
        //         legend: {
        //             orient: 'vertical',
        //             y: 'bottom',
        //             data: [$scope.visitCount_1, $scope.visitCount_2, '', $scope.visitCount_3, $scope.visitCount_4]
        //         },
        //         series: [
        //             {
        //                 type: 'pie',
        //                 radius: ['40%', '55%'],
        //                 center: ['47%', '47%'],
        //                 itemStyle: {
        //                     normal: {
        //                         label: {
        //                             show: false
        //                         },
        //                         labelLine: {
        //                             show: false
        //                         }
        //                     }
        //                 },
        //                 data: aType
        //             }
        //         ],
        //         color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd']
        //     };
        //     visitChart.setOption(visitOption);
        //
        //     var normalnumber = $scope.visit;
        //     var appendTohtml = [
        //         '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 10px; margin-top: 32px;">',
        //         normalnumber,
        //         '</span>',
        //         '</div>'
        //     ].join(" ");
        //     $(appendTohtml).appendTo($("#onlinePie"));
        // }).error(function () {
        // });
        $scope.redirectOnlineCustomer_rz = function () {
            $state.go("^.onlinecustomer_rz");
        };
        $scope.redirectHistoryCustomer_rz = function () {
            $state.go("^.historydetail_rz");
        };

        //client vonder and mode
        $http({
            method: 'POST',
            url: URL_POST_COMMON,
            data: {
                method: 'clientcount_cloud_clientmode',
                param: {
                    topId: TOP_NAME,
                    groupId: GROUP_NAME,
                    dataType: 'auth'
                }
            }
        }).success(function (data) {
            var newObject = data.response;
            var Num5G = 0;
            var Num2G = 0;
            var count_one = 0;
            var count_two = 0;
            var count_three = 0;
            var count_four = 0;
            var count_five = 0;
            var count_six = 0;
            for (var i = 0; i < newObject.length; i++) {
                if (newObject[i].clientMode == '802.11ac') {
                    count_one = newObject[i].count
                } else if (newObject[i].clientMode == '802.11an') {
                    count_two = newObject[i].count
                } else if (newObject[i].clientMode == '802.11a') {
                    count_three = newObject[i].count
                } else if (newObject[i].clientMode == '802.11gn') {
                    count_four = newObject[i].count
                } else if (newObject[i].clientMode == '802.11g') {
                    count_five = newObject[i].count
                } else if (newObject[i].clientMode == '802.11b') {
                    count_six = newObject[i].count
                }
            }
            Num5G = count_one + count_two + count_three;
            Num2G = count_four + count_five + count_six;
            var terminalType = echarts.init(document.getElementById('pTerminal'));
            if (Num5G == 0 && Num2G == 0) {
                terminalType.setOption(grayNextOption);
                return;
            }
            terminalType.on(echarts.config.EVENT.CLICK, function (data) {
                other = data.data.name;
                apart = other.split("(")[0];
                $scope.$broadcast('refresh#clientMode', {
                    url: '/v3/stamonitor/getclientlist_bymodeorvendor?devSN=' + $scope.sn + '&mode=' + apart + '&auth=1',
                });
                $scope.$broadcast("show#clientModeOf");
            });

            var terminalOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} {b}: <br/>{c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '10%',
                    y: '10%',
                    data: ['802.11ac(5GHz)', '802.11an(5GHz)', '802.11a(5GHz)', '802.11gn(2.4GHz)', '802.11g(2.4GHz)', '802.11b(2.4GHz)']
                },
                series: [
                    {
                        type: 'pie',
                        radius: '30%',
                        center: ['58%', '35%'],
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
                            {name: '5GHz', value: Num5G},
                            {name: '2.4GHz', value: Num2G}
                        ]
                        // [
                        //     {name:'5GHz',value:10},
                        //     {name:'2.4GHz',value:30}
                        // ]
                    },
                    {
                        type: 'pie',
                        radius: ['40%', '60%'],
                        center: ['58%', '35%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position: "inner",
                                    show: false
                                }
                            }
                        },
                        data: [
                            {name: '802.11ac(5GHz)', value: count_one},
                            {name: '802.11an(5GHz)', value: count_two},
                            {name: '802.11a(5GHz)', value: count_three},
                            {name: '802.11gn(2.4GHz)', value: count_four},
                            {name: '802.11g(2.4GHz)', value: count_five},
                            {name: '802.11b(2.4GHz)', value: count_six}
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
        }).error(function () {
        });
        var grayNextOption = {
            height: 200,
            calculable: false,
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
                            label: {
                                position: "inner",
                            }
                        }
                    },
                    data: [{name: 'N/A', value: 1}]
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
                                position: "inner"
                            }
                        }
                    },
                    data: [{name: 'N/A', value: 1}]
                }
            ],
            color: ["rgba(216, 216, 216, 0.75)"]
        };
        $http({
            method: 'POST',
            url: URL_POST_COMMON,
            data: {
                method: 'clientcount_cloud_vendor',
                param: {
                    topId: TOP_NAME,
                    groupId: GROUP_NAME,
                    dataType: 'auth'
                }
            }
        }).success(function (data) {
            var oData = data.response;
            var aLegend = [];
            var aData = [];
            $.each(oData, function (i, item) {
                aLegend[i] = item._id || $scope.viewTittle;
                aData[i] = {};
                aData[i].name = item._id || $scope.viewTittle;
                aData[i].value = item.clientCount || undefined;
            });
            Array.prototype.removeByValue = function (val) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] == val) {
                        this.splice(i, 1);
                        break;
                    }
                }
            };
            var apendfor = [];
            var otherclent = [];
            $.extend(apendfor, aLegend);
            apendfor.removeByValue("other");
            otherclent = apendfor.join().replace("未知", "").split(",");
            var terminalFirm = echarts.init(document.getElementById("pTermianlFirm"));
            if (aData.length == 0) {
                terminalFirm.setOption(grayLastOption);
                return;
            }
            // terminalFirm.on(echarts.config.EVENT.CLICK, function (data) {
            //     apart = data.data.name;
            //     if (apart == "other") {
            //         apart = {$nin: otherclent};
            //     } else if (apart == $scope.viewTittle) {
            //         apart = "";
            //     }
            //     $scope.$broadcast('refresh#clientType', {
            //         url: '/v3/stamonitor/getclientlist_bymodeorvendor?devSN=' + $scope.sn + '&auth=1',
            //     });
            //     $scope.$broadcast("show#clientTypeOf");
            // });
            var terFirmOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} {b}: <br/>{c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: '15%',
                    data: aLegend,
                    // ['苹果','小米','三星','华为'],
                    y: '10%'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40', '55%'],
                        center: ['60%', '35%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position: "inner",
                                    show: false
                                }
                            }
                        },
                        data: aData
                        // [
                        //     { name: '苹果', value: 13},
                        //     { name: '小米', value: 17},
                        //     { name: '三星', value: 25},
                        //     { name: '华为', value: 39}
                        // ]
                    }
                ],
                color: ['#4ec1b2', '#fbceb1', '#b3b7dd', '#4fc4f6', '#fe808b', '#e7e7e9']
            };
            terminalFirm.setOption(terFirmOption);
        }).error(function () {
        });
        var grayLastOption = {
            height: 200,
            calculable: false,
            series: [
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
                                position: "inner"
                            }
                        }
                    },
                    data: [{name: 'N/A', value: 1}]
                }
            ],
            color: ["rgba(216, 216, 216, 0.75)"]
        };
        $scope.clientMode = {
            tId: 'clientMode',
            pageSize: 10,
            showPageList: false,
            pageParamsType: 'path',
            method: "post",
            searchable: true,
            sidePagination: "server",
            contentType: "application/json",
            dataType: "json",
            startField: 'skipnum',
            limitField: 'limitnum',
            queryParams: function (params) {
                var oBody = {
                    mode: apart,
                    sortoption: {}
                };
                if (params.sort) {
                    oBody.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
                }
                params.start = undefined;
                params.size = undefined;
                params.order = undefined;
                return $.extend(true, {}, params, oBody);
            },
            responseHandler: function (data) {
                var wheredata = data.clientList.clientInfo;
                $.each(wheredata, function (i, item) {
                    if (item.clientVendor == "") {
                        item.clientVendor = $scope.header_6;
                    }
                });
                return {
                    total: data.clientList.count_total,
                    rows: data.clientList.clientInfo
                };
            },
            columns: [
                {sortable: true, searcher: {}, field: 'clientMAC', title: $scope.header_1},
                {sortable: true, searcher: {}, field: 'clientIP', title: $scope.header_2},
                {sortable: true, searcher: {}, field: 'clientVendor', title: $scope.header_3},
                {sortable: true, searcher: {}, field: 'ApName', title: $scope.header_4},
                {sortable: true, searcher: {}, field: 'clientSSID', title: $scope.header_5}
            ],
        };
        $scope.clientType = {
            tId: 'clientType',
            pageSize: 10,
            showPageList: false,
            pageParamsType: 'path',
            method: "post",
            searchable: true,
            sidePagination: "server",
            contentType: "application/json",
            dataType: "json",
            startField: 'skipnum',
            limitField: 'limitnum',
            queryParams: function (params) {
                var oBody = {
                    vendor: apart,
                    sortoption: {}
                };
                if (params.sort) {
                    oBody.sortoption[params.sort] = (params.order == "asc" ? 1 : -1);
                }
                params.start = undefined;
                params.size = undefined;
                params.order = undefined;
                return $.extend(true, {}, params, oBody);
            },
            responseHandler: function (data) {
                var wheredata = data.clientList.clientInfo;
                $.each(wheredata, function (i, item) {
                    if (item.clientVendor == "") {
                        item.clientVendor = $scope.header_6;
                    }
                });
                return {
                    total: data.clientList.count_total,
                    rows: data.clientList.clientInfo
                };
            },
            columns: [
                {sortable: true, searcher: {}, field: 'clientMAC', title: $scope.header_1},
                {sortable: true, searcher: {}, field: 'clientIP', title: $scope.header_2},
                {sortable: true, searcher: {}, field: 'clientVendor', title: $scope.header_3},
                {sortable: true, searcher: {}, field: 'ApName', title: $scope.header_4},
                {sortable: true, searcher: {}, field: 'clientSSID', title: $scope.header_5}
            ],
        };
        $scope.clientModeOf = {
            mId: 'clientModeOf',
            title: $scope.ngModel,
            autoClose: true,
            showCancel: false,
            modalSize: 'lg',
            showHeader: true,
            showFooter: true,
            okText: $scope.autoClose,
            // cancelText: '关闭',  //取消按钮文本
            okHandler: function (modal, $ele) {

            },
            cancelHandler: function (modal, $ele) {

            },
            beforeRender: function ($ele) {

                return $ele;
            }
        };
        // $scope.clientTypeOf = {
        //     mId: 'clientTypeOf',
        //     title: $scope.ngModel,
        //     autoClose: true,
        //     showCancel: false,
        //     modalSize: 'lg',
        //     showHeader: true,
        //     showFooter: true,
        //     okText: $scope.autoClose,
        //     // cancelText: '关闭',  //取消按钮文本
        //     okHandler: function (modal, $ele) {
        //
        //     },
        //     cancelHandler: function (modal, $ele) {
        //
        //     },
        //     beforeRender: function ($ele) {
        //
        //         return $ele;
        //     }
        // };
        $scope.$on('hidden.bs.modal#clientModeOf', function () {
            $scope.$broadcast('hideSearcher#clientMode');  //  实现了搜索表头的折叠
        });
        // $scope.$on('hidden.bs.modal#clientTypeOf', function () {
        //     $scope.$broadcast('hideSearcher#clientType');  //  实现了搜索表头的折叠
        // });
    }]
});