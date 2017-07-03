define(['css!l/css/dashboard', 'l/directive/dashboard-echarts', 'l/directive/dashboard-star'], function () {
    return ['$scope', '$http', function ($scope, $http) {
        // 用户量
        var URL_USER_NUMS = '../l/json/usernuminfo.json';
        // 数据流量
        var URL_DATA_FLOWS = '../l/json/dataflowinfo.json';
        // echarts图形默认配置
        var LINE_DEFAULTS = {
            title: {
                textStyle: {
                    fontWeight: 'lighter'
                }
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 65,
                    end: 85
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 65,
                    end: 85
                }
            ],
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: 70, left: 50, right: 50, bottom: 70
            },
            xAxis: [
                {
                    type: 'category',
                    splitLine: {
                        show: true
                    }
                }
            ]
        };
        // 小型的echarts中默认axis配置
        var SM_AXIS_DEFAULT = {
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false
            },
            splitArea: {
                show: false
            }
        };
        // 小型的echarts配置
        var SM_DEFAULTS = {
            grid: {
                top: 20, left: 0, right: 10, bottom: 1, show: false
            },
            xAxis: [$.extend({}, SM_AXIS_DEFAULT, {
                type: 'category',
                boundaryGap: false
            })],
            yAxis: [$.extend({}, SM_AXIS_DEFAULT, {
                type: 'value',
                nameRotate: 0,
                nameLocation: 'middle'
            })],
            series: [{
                type: 'line',
                smooth: true,
                areaStyle: {
                    normal: {}
                }
            }]
        };

        /**
         * 生成随机数方法
         * @param num 随机数的个数
         * @returns {Array}
         */
        function getRandom(num) {
            num = num || 1;
            var i = 0;
            var result = [];
            for (; i <= num; i++) {
                result.push(parseInt(Math.random() * 1000));
            }
            return result;
        }

        // 显示关系图
        $scope.showRelationCharts = false;

        $scope.$watch('showRelationCharts', function () {
            $(window).trigger('resize');
        });
        // 用户数统计图
        $scope.userNumInfo = {
            option: $.extend(true, {}, LINE_DEFAULTS, {
                title: {
                    text: '用户量趋势图'
                },
                grid: {right: 20},
                legend: {
                    data: ['用户数']
                },
                yAxis: [
                    {
                        name: '用户数',
                        type: 'value',
                        splitNumber: 5
                    }
                ],
                series: [
                    {
                        name: '用户数',
                        type: 'line',
                        areaStyle: {
                            normal: {}
                        }
                    }
                ]
            }),
            events: {}
        };
        // 数据流量统计图
        $scope.dataFlowInfo = {
            option: $.extend(true, {}, LINE_DEFAULTS, {
                title: {
                    text: '流量趋势图'
                },
                grid: {right: 20},
                legend: {
                    data: ['上行流量', '下行流量']
                },
                yAxis: [
                    {
                        name: '流量',
                        type: 'value',
                        splitNumber: 5
                    }
                ],
                series: [
                    {
                        name: '上行流量',
                        type: 'line',
                        areaStyle: {
                            normal: {}
                        }
                    },
                    {
                        name: '下行流量',
                        type: 'line',
                        areaStyle: {
                            normal: {}
                        }
                    }
                ]
            }),
            events: {}
        };
        // 用户流量关系图
        $scope.userFlowRelation = {
            option: $.extend(true, {}, LINE_DEFAULTS, {
                title: {
                    text: '用户量流量关系图'
                },
                legend: {
                    data: ['用户数', '上行流量', '下行流量']
                },
                yAxis: [
                    {
                        name: '用户数',
                        type: 'value',
                        max: 10000,
                        splitNumber: 5
                    }, {
                        name: '流量(M)',
                        type: 'value',
                        inverse: true,
                        max: 1000,
                        splitNumber: 5,
                        nameLocation: 'start'
                    }
                ],
                series: [
                    {
                        name: '用户数',
                        type: 'line',
                        areaStyle: {
                            normal: {}
                        }
                    }, {
                        name: '上行流量',
                        type: 'line',
                        yAxisIndex: 1,
                        areaStyle: {
                            normal: {}
                        }
                    }, {
                        name: '下行流量',
                        type: 'line',
                        yAxisIndex: 1,
                        areaStyle: {
                            normal: {}
                        }
                    }
                ]
            }),
            events: {}
        };

        // 周视图
        $scope.weekViewCharts = {
            option: $.extend(true, {}, SM_DEFAULTS, {
                title: {
                    text: '周趋势',
                    textStyle: {
                        fontWeight: 'lighter',
                        fontSize: 10
                    }
                },
                yAxis: [{
                    name: '周'
                }],
                xAxis: [{
                    data: ['2015-11-01', '2015-11-02', '2015-11-03', '2015-11-04', '2015-11-05', '2015-11-06', '2015-11-07']
                }],
                series: [{
                    data: getRandom(7)
                }]
            })
        };
        /*        // 月视图
         $scope.monthViewCharts = {
         option: $.extend(true, {}, SM_DEFAULTS, {
         yAxis: [{
         name: '月',
         type: 'value'
         }],
         xAxis: [{
         data: [
         '2015-11-01', '2015-11-02', '2015-11-03', '2015-11-04', '2015-11-05', '2015-11-06',
         '2015-11-07', '2015-11-08', '2015-11-09', '2015-11-10', '2015-11-11', '2015-11-12',
         '2015-11-13', '2015-11-14', '2015-11-15', '2015-11-16', '2015-11-17', '2015-11-18',
         '2015-11-19', '2015-11-20', '2015-11-21', '2015-11-22', '2015-11-23', '2015-11-24',
         '2015-11-25', '2015-11-26', '2015-11-27', '2015-11-28', '2015-11-29', '2015-11-30'
         ]
         }],
         series: [{
         data: getRandom(30)
         }]
         })
         };
         // 年视图
         $scope.yearViewCharts = {
         option: $.extend(true, {}, SM_DEFAULTS, {
         yAxis: [{
         name: '年',
         type: 'value'
         }],
         xAxis: [{
         data: [
         '2015-01-01', '2015-02-01', '2015-03-01', '2015-04-01', '2015-05-01', '2015-06-01',
         '2015-07-01', '2015-08-01', '2015-09-01', '2015-10-01', '2015-11-01', '2015-12-01']
         }],
         series: [{
         data: getRandom(12)
         }]
         })
         };*/
        // 加载用户信息图
        $http.get(URL_USER_NUMS).success(function (data) {
            $scope.userNumInfo.option.xAxis[0].data = data.xlist;
            $scope.userNumInfo.option.series[0].data = data.ylist;
        });

        // 加载流量信息图
        $http.get(URL_DATA_FLOWS).success(function (data) {
            $scope.dataFlowInfo.option.xAxis[0].data = data.xlist;
            $scope.dataFlowInfo.option.series[0].data = data.ylist;
            $scope.dataFlowInfo.option.series[1].data = data.ylist2;
        });

        // 加载流量信息图
        $http.get(URL_USER_NUMS).success(function (data) {
            $http.get(URL_DATA_FLOWS).success(function (data2) {
                $scope.userFlowRelation.option.xAxis[0].data = data.xlist;
                $scope.userFlowRelation.option.series[0].data = data.ylist;
                $scope.userFlowRelation.option.series[1].data = data2.ylist;
                $scope.userFlowRelation.option.series[2].data = data2.ylist2;
            });
        });
    }];
});