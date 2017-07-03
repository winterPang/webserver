/**
 * Created by Administrator on 2016/11/2.
 */
define(['jquery', 'css!l/css/sta_analyse', 'l/directive/dashboard-echarts', 'l/controller/funcs_common'],
    function ($) {
        return ['$scope', function ($scope) {

            var LINE_ECHARTS_DEFAULT = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: '10%',
                    bottom: '20%',
                    right: '5%',
                    left: '5%'
                },
                dataZoom: [
                    {
                        realtime: true,
                        type: 'inside',
                        start: 90,
                        end: 100
                    }, {}
                ],
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: randomTime(),
                        splitLine: {
                            show: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: true
                        }
                    }
                ],
                series: [
                    {
                        type: 'line',
                        data: randomData(),
                        smooth: true
                    }
                ]
            };
            var PIE_ECHARTS_DEFAULT = {
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['40%', '80%'],
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

            var DATA_TIME_FLOW_OPTION = $.extend(true, {}, LINE_ECHARTS_DEFAULT, {
                legend: {
                    data: ['终端数量']
                },
                yAxis: [
                    {
                        name: '终端数量(个)'
                    }
                ],
                series: [
                    {
                        name: '终端数量',
                        itemStyle: {
                            normal: {
                                color: 'rgba(66,139,202,.5)'
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: 'rgb(66,139,202)'
                            }
                        }
                    }
                ]
            });

            var STA_TIME_ACTIVE_OPTION = $.extend(true, {}, PIE_ECHARTS_DEFAULT, {
                series: [
                    {
                        name: '在线时长',
                        data: [
                            {value: 335, name: '骨灰级'},
                            {value: 310, name: '灵魂级'},
                            {value: 234, name: '平民级'}
                        ]
                    }
                ]
            });

            var STA_FLOW_ACTIVE_OPTION = $.extend(true, {}, PIE_ECHARTS_DEFAULT, {
                series: [
                    {
                        name: '在线时长',
                        data: [
                            {value: 335, name: '骨灰级'},
                            {value: 310, name: '灵魂级'},
                            {value: 234, name: '平民级'}
                        ]
                    }
                ]
            });

            $scope.user_count_table = {
                url: "../l/json/user_count.json",
                pageSize: 8,
                pageList: [5, 8, 10, 15, 20],
                extraCls: 'default_table',
                showToolbar: true,
                // Mac地址， 关联AP， 在线时长，信号强度
                columns: [
                    {sortable: true, field: 'mac', title: "Mac地址"},
                    {sortable: true, field: 'rel_ap', title: "关联AP"},
                    {sortable: true, field: 'online', title: "在线时长"},
                    {sortable: true, field: 'quality', title: "信号强度"}
                ]
            };

            $scope.data_time_flow_option = {
                option: DATA_TIME_FLOW_OPTION
            };

            $scope.sta_time_active_option = {
                option: STA_TIME_ACTIVE_OPTION
            };

            $scope.sta_flow_active_option = {
                option: STA_FLOW_ACTIVE_OPTION
            };

            $scope.online_time_modal = {
                mId: 'online_time_modal_id',
                title: '在线时长',
                autoClose: false,
                showFooter: false,
                modalSize: 'lg'
            };
            $scope.online_time_options = {
                url: "../l/json/online_time.json",
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                extraCls: 'default_table',
                showToolbar: true,
                columns: [
                    {sortable: true, field: 'MAC', title: "MAC地址"},
                    {sortable: true, field: 'AP_relevance', title: "关联AP"},
                    {sortable: true, field: 'begin_online', title: "开始上网时间"},
                    {sortable: true, field: 'online_time', title: "上网时长"}
                ]
            };
            $scope.show_online_time_modal = function () {
                $scope.$broadcast('show#online_time_modal_id');
            };

            $scope.user_flow_rate_modal = {
                mId: 'user_flow_rate_modal_id',
                title: '终端流量排行',
                autoClose: false,
                showFooter: false,
                modalSize: 'lg'
            };
            $scope.user_flow_rate_options = {
                url: "../l/json/user_flow_rate.json",
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                extraCls: 'default_table',
                showToolbar: true,
                columns: [
                    {sortable: true, field: 'MAC', title: "MAC地址"},
                    {sortable: true, field: 'AP_relevance', title: "关联AP"},
                    {sortable: true, field: 'begin_online', title: "开始上网时间"},
                    {sortable: true, field: 'flow_total', title: "总流量"}
                ]
            };
            $scope.show_user_flow_rate_modal = function () {
                $scope.$broadcast('show#user_flow_rate_modal_id');
            };
        }]
    }
);