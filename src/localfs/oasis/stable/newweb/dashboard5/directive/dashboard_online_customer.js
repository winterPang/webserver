define(['angularAMD', 'jquery', 'utils', 'sprintf'],function(app, $, utils){
    var sLang = utils.getLang();
    var URL_TEMPLATE_FILE = sprintf('../dashboard5/views/%s/dashboard_online_customer.html', sLang);
    var URL_GET_CUSTOMER = '/stamonitor/histclientstatistic_bycondition';
    app.directive('dashboardOnlineCustomer', ['$timeout', '$rootScope', '$http', '$q',
        function ($timeout, $rootScope, $http, $q) {
            return {
                templateUrl: URL_TEMPLATE_FILE,
                restrict: 'E',
                scope: {
                    sn: '@',
                    nas:'@'
                },
                replace: true,
                controller: function ($scope, $element, $attrs, $transclude) {
                },
                link: function ($scope, $element, $attrs, $ngModel) {
                    $scope.initUserChange = function (time) {
                        $scope.time = time;
                        $http.get(URL_GET_CUSTOMER+'?devSN='+$scope.sn+'&nasId='+$scope.nas+'&dataType='+$scope.time).success(function (data){
                            $scope.g_AllUser = [];
                            $scope.g_onlineTime = [];
                            $scope.g_Time = [];
                            $scope.newlength = data.histclientList.length;
                            for (var i = 0; i < $scope.newlength; i++) {
                                $scope.g_AllUser.push(data.histclientList[i].totalCount);
                                $scope.g_onlineTime.push(data.histclientList[i].time);
                            }
                            console.log($scope.g_AllUser);
                            for (var j = 0; j < $scope.newlength; j++) {
                                if ($scope.time == "oneday") {
                                    $scope.g_Time.push(new Date($scope.g_onlineTime[j]).getHours() + ":" + "00");
                                }
                                else {
                                    $scope.g_Time.push(new Date($scope.g_onlineTime[j]).getMonth() + 1 + "-" + new Date($scope.g_onlineTime[j]).getDate());
                                }
                            }
                            $scope.customerChange($scope.g_AllUser, $scope.g_Time);
                        }).error(function (){});
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
                                    symbol: 'none',
                                    smooth: true,
                                    itemStyle: {
                                        normal: {
                                            areaStyle: {
                                                type: 'default'
                                            },
                                            lineStyle: {
                                                color: '#fff'
                                            }
                                        }
                                    },
                                    data: customer
                                }
                            ]
                        };
                        customerChart.setOption(customerOption);
                    };
                    $scope.initUserChange('oneday');
                }
            };
        }
    ]);
});
