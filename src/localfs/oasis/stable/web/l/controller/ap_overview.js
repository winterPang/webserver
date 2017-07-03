define(['jquery', 'echarts3', 'css!l/css/menu3.css', 'l/directive/dashboard-echarts', 'l/controller/funcs_common'], function ($, echarts) {
    return ['$scope', '$http', '$rootScope', '$stateParams', function ($scope, $http, $rootScope, $stateParams) {
        //AP在线率
        var AP_ONLINE_RATE_OPTION = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    name: 'AP在线率',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [
                        {
                            value: 900, name: '在线',
                            itemStyle: {
                                normal: {
                                    color: "#61a0a8"
                                }
                            }
                        },
                        {
                            value: 100, name: '未在线',

                        }
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        $scope.AP_onlineRate_option = {
            option: AP_ONLINE_RATE_OPTION
        };

        //AP类型
        $scope.AP_type = {
            tId: "apType",
            url: "../l/json/AP_type.json",
            extraCls: 'default_table',
            showToolbar: true,
            pageSize: 5,
            pageList: [5, 10, 15, 20],
            showPageList: false,
            columns: [
                {sortable: true, field: 'AP_typeName', title: "AP类型"},
                {sortable: true, field: 'number', title: "数量"}
            ],
            sidePagination: 'client'
        };

        //AP重启比例
        var AP_RESTART_RATIO_OPTION = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            // legend: {
            //     orient: 'vertical',
            //     x: 'left',
            //     data: ['AP1', 'AP2', 'AP3', 'AP4', '其他']
            // },
            series: [
                {
                    name: 'AP重启比例',
                    type: 'pie',
                    center: ['50%', '45%'],
                    radius: ['25%', '60%'],
                    avoidLabelOverlap: false,
                    // label: {
                    //     normal: {
                    //         show: false,
                    //         position: 'center'
                    //     },
                    //     emphasis: {
                    //         show: true,
                    //         textStyle: {
                    //             fontSize: '17',
                    //             fontWeight: 'bold'
                    //         }
                    //     }
                    // },
                    // labelLine: {
                    //     normal: {
                    //         show: false
                    //     }
                    // },
                    data: [
                        {value: 1548, name: 'AP1'},
                        {value: 1003, name: 'AP2'},
                        {value: 899, name: 'AP3'},
                        {value: 565, name: 'AP4'},
                        {value: 332, name: '其他'}
                    ],
                }
            ]
        };
        $scope.AP_restart_ratio_option = {option: AP_RESTART_RATIO_OPTION};
        //...AP重启次数模态框
        $scope.AP_restart_times_modal = {
            mId: 'AP_restart_times_modal_id',
            title: 'AP重启次数排行',
            autoClose: false,
            showFooter: false,
            modalSize: 'lg'
        };
        $scope.AP_restart_times_options = {
            url: "../l/json/AP_restart_times_modal.json",
            pageSize: 5,
            pageList: [5, 10, 15, 20],
            extraCls: 'default_table',
            showToolbar: true,
            columns: [
                {sortable: true, field: 'AP_name', title: "AP名称"},
                {sortable: true, field: 'restart_times', title: "重启次数"}
            ],
        };
        $scope.show_AP_restart_times_modal = function () {
            $scope.$broadcast('show#AP_restart_times_modal_id');
        };


        //AP负载率
        var AP_LOAD_RATIO_OPTION = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            // legend: {
            //     orient: 'vertical',
            //     x: 'left',
            //     data: ['正常', '繁忙', '较重', '超负荷', '空闲']
            // },
            series: [
                {
                    name: 'AP负载率',
                    type: 'pie',
                    center: ['50%', '45%'],
                    radius: ['25%', '60%'],
                    avoidLabelOverlap: false,
                    // label: {
                    //     normal: {
                    //         show: false,
                    //         position: 'center'
                    //     },
                    //     emphasis: {
                    //         show: true,
                    //         textStyle: {
                    //             fontSize: '17',
                    //             fontWeight: 'bold'
                    //         }
                    //     }
                    // },
                    // labelLine: {
                    //     normal: {
                    //         show: false
                    //     }
                    // },
                    data: [
                        {value: 1548, name: '正常'},
                        {value: 1003, name: '繁忙'},
                        {value: 899, name: '较重'},
                        {value: 565, name: '超负荷'},
                        {value: 332, name: '空闲'}
                    ],
                }
            ]
        };
        $scope.AP_load_ratio_option = {
            option: AP_LOAD_RATIO_OPTION
        };
        //...AP负载率模态框
        $scope.AP_load_ratio_modal = {
            mId: 'AP_load_ratio_modal_id',
            title: 'AP负载率超负荷次数',
            autoClose: false,
            showFooter: false,
            modalSize: 'lg'
        };
        $scope.AP_load_ratio_options = {
            url: "../l/json/AP_load_ratio_modal.json",
            pageSize: 5,
            pageList: [5, 10, 15, 20],
            extraCls: 'default_table',
            showToolbar: true,
            columns: [
                {sortable: true, field: 'AP_name', title: "AP名称"},
                {sortable: true, field: 'load_ratio_times', title: "超负荷次数"}
            ],
        };
        $scope.show_AP_load_ratio_modal = function () {
            $scope.$broadcast('show#AP_load_ratio_modal_id');
        };


        //AP在线时长
        var AP_ONLINE_TIME_LENGTH_OPTION = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    name: 'AP在线时长',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: [
                        {value: 100, name: '在线一天'},
                        {value: 700, name: '在线一周'},
                        {value: 2100, name: '在线一月'},
                        {value: 6300, name: '在线一季度'},
                        {value: 25200, name: '在线一年'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        $scope.AP_onlineTimeLength_option = {
            option: AP_ONLINE_TIME_LENGTH_OPTION
        };
        $scope.AP_flow = {
            url: "../l/json/AP_flow.json",
            showToolbar: true,
            pageSize: 5,
            pageList: [5, 10, 15, 20],
            showPageList: false,
            columns: [
                {sortable: true, field: 'AP_name', title: "AP名称"},
                {sortable: true, field: 'flow', title: "流量"}
            ],
            sidePagination: 'client'
        };
        //AP在线时长模态框
        $scope.AP_quarter_flow_modal = {
            mId: 'AP_quarter_flow_modal_id',
            title: 'AP季度流量',
            autoClose: false,
            showFooter: false,
            modalSize: 'lg'
        };
        $scope.AP_quarter_flow_modal_options = {
            url: "../l/json/AP_quarter_flow_modal.json",
            pageSize: 5,
            pageList: [5, 10, 15, 20],
            extraCls: 'default_table',
            showToolbar: true,
            columns: [
                {sortable: true, field: 'AP_name', title: "AP名称"},
                {sortable: true, field: 'AP_quarter_flow', title: "一季度流量"}
            ],
        };
        $scope.show_AP_quarter_flow_modal = function () {
            $scope.$broadcast('show#AP_quarter_flow_modal_id');
        };


        //AP使用率
        $scope.sta_time_analyse = {
            url: "../l/json/users_number.json",
            showToolbar: true,
            pageSize: 5,
            pageList: [5, 10, 15, 20],
            showPageList: false,
            columns: [
                {sortable: true, field: 'name', title: "AP名称"},
                {sortable: true, field: 'users_number', title: "用户数量"}
            ],
            data: [],
            sidePagination: 'client'
        };
        var STA_FLOW_ACTIVE_OPTION = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    name: 'AP使用率',
                    type: 'pie',
                    radius: '55%',
                    center: ['49.5%', '50%'],
                    data: [
                        {value: 777, name: '2500~2000人'},
                        {value: 888, name: '1999~1500人'},
                        {value: 666, name: '1499~1000'},
                        {value: 333, name: '999~500'},
                        {value: 555, name: '499以下'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        $scope.sta_flow_active_option = {
            option: STA_FLOW_ACTIVE_OPTION
        };


        //2.4G 5G 信道利用率
        var AP_CHANNEL_BUSY1_OPTION = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['良好', '繁忙', '堵塞']
            },
            grid: {
                left: '3%',
                right: 120,
                bottom: '3%',
                containLabel: true
            },
            yAxis: [
                {
                    type: 'category',
                    name: "信道名称",
                    data: ['1信道', '2信道', '3信道', '4信道', '5信道', '6信道', '7信道']
                }
            ],
            xAxis: [
                {
                    type: 'value',
                    name: "AP个数",
                    data: [0, 2, 4, 6, 8, 10, 12]
                }
            ],
            series: [
                {
                    name: '良好',
                    type: 'bar',
                    barWidth: 20,
                    stack: 'AP个数',
                    data: [6, 10, 2, 7, 5, 6],
                    itemStyle: {
                        normal: {
                            color: '#61a0a8'
                        }
                    }
                },
                {
                    name: '繁忙',
                    type: 'bar',
                    barWidth: 20,
                    stack: 'AP个数',
                    data: [2, 3, 0, 0, 1, 1],
                    itemStyle: {
                        normal: {
                            color: "#2f4554"
                        }
                    }
                },
                {
                    name: '堵塞',
                    type: 'bar',
                    barWidth: 20,
                    stack: 'AP个数',
                    data: [0, 0, 1, 1, 0, 0]
                }

            ]
        }
        $scope.AP_channelBusy1_option = {
            option: AP_CHANNEL_BUSY1_OPTION
        };


        var AP_CHANNEL_BUSY2_OPTION = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['良好', '繁忙', '堵塞']
            },
            grid: {
                left: '3%',
                right: 120,
                bottom: '3%',
                containLabel: true
            },
            yAxis: [
                {
                    type: 'category',
                    name: '信道名称',
                    data: ['151信道', '152信道', '153信道', '154信道', '155信道', '156信道', '157信道']
                }
            ],
            xAxis: [
                {
                    type: 'value',
                    name: 'AP信道个数',
                    data: [0, 2, 4, 6, 8, 10, 12]
                }
            ],
            series: [
                {
                    name: '良好',
                    type: 'bar',
                    barWidth: 20,
                    stack: 'AP个数',
                    data: [8, 10, 8, 3, 9, 9],
                    itemStyle: {
                        normal: {
                            color: '#61a0a8'
                        },
                        // emphasis:{
                        //     color:'#f00'
                        // }
                    }
                },
                {
                    name: '繁忙',
                    type: 'bar',
                    barWidth: 20,
                    stack: 'AP个数',
                    data: [0, 1, 0, 3, 1, 0],
                    itemStyle: {
                        normal: {
                            color: "#2f4554"
                        }
                    }
                },
                {
                    name: '堵塞',
                    type: 'bar',
                    barWidth: 20,
                    stack: 'AP个数',
                    data: [1, 0, 0, 1, 0, 0]
                }
            ]
        }
        $scope.AP_channelBusy2_option = {
            option: AP_CHANNEL_BUSY2_OPTION
        };


    }];
});
