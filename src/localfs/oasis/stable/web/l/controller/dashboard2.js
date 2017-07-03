/**
 * Created by Administrator on 2016/11/12.
 */
define(['jquery', 'echarts3', 'css!l/css/dashboard2', 'l/directive/dashboard-echarts', 'l/directive/dashboard-star'], function () {
    return ['$scope', '$http', function ($scope, $http) {
        // echarts_1
        // var ECHARTS_1 = {
        //     // title: {
        //     //     text: '折线图堆叠'
        //     // },
        //     tooltip: {
        //         trigger: 'axis'
        //     },
        //     legend: {
        //         data:['用户数','联盟广告']
        //     },
        //     grid: {
        //         left: '3%',
        //         right: '4%',
        //         bottom: '3%',
        //         containLabel: true
        //     },
        //     toolbox: {
        //         feature: {
        //             saveAsImage: {}
        //         }
        //     },
        //     xAxis: {
        //         type: 'category',
        //         boundaryGap: false,
        //         data: ['2015-11-01', '2015-11-02', '2015-11-03', '2015-11-04', '2015-11-05', '2015-11-06', '2015-11-07','2015-11-08','2015-11-09']
        //     },
        //     yAxis: {
        //         type: 'value'
        //     },
        //     series: [
        //         {
        //             name:'用户数',
        //             type:'line',
        //             stack: '总量',
        //             data:[400, 667, 1220, 1446, 1868, 2260, 2880,3060,3550],
        //             itemStyle: {
        //                 normal: {
        //                     color: '#dfba6f'
        //                 }
        //             }
        //         },
        //         {
        //             name:'联盟广告',
        //             type:'line',
        //             stack: '总量',
        //             data:[330, 788, 1300, 1668, 1998, 2620, 3060,3355,3660],
        //             itemStyle: {
        //                 normal: {
        //                     color: '#c9d3bd'
        //                 }
        //             }
        //         }
        //     ]
        // };
        // $scope.echarts_1 = {
        //     option: ECHARTS_1
        // };
        $scope.table_1 = {
            tId: "apType",
            url: "../l/json/AP_type.json",
            extraCls: 'default_table',
            showToolbar: true,
            pageSize: 5,
            pageList: [5, 10, 15, 20],
            showPageList: false,
            columns: [
                {sortable: true, field: 'AP_typeName', title: "AP类型"},
                {sortable: true, field: 'number', title: "数量"},
                {sortable: true, field: 'AP_typeName', title: "AP类型"},
                {sortable: true, field: 'number', title: "数量"},
            ],
            sidePagination: 'client'
        };

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

        // 用户量
        var URL_USER_NUMS = '../l/json/usernuminfo.json';
        // 数据流量
        var URL_DATA_FLOWS = '../l/json/dataflowinfo.json';

        // 用户数统计图
        $scope.echarts_1 = {
            option: $.extend(true, {}, LINE_DEFAULTS, {
                // title: {
                //     text: '用户量趋势图'
                // },
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
                        },
                        itemStyle: {
                            normal: {
                                color: '#93c4e4'
                            }
                        },
                    }
                ]
            }),
            events: {}
        };
        // 数据流量统计图
        $scope.echarts_2 = {
            option: $.extend(true, {}, LINE_DEFAULTS, {
                // title: {
                //     text: '流量趋势图'
                // },
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
                        },
                        itemStyle: {
                            normal: {
                                color: '#a8c77b'
                            }
                        }
                    },
                    {
                        name: '下行流量',
                        type: 'line',
                        areaStyle: {
                            normal: {}
                        },
                        itemStyle: {
                            normal: {
                                color: '#fcce73'
                            }

                        }
                    }
                ]
            }),
            events: {}
        };

        // 加载用户信息图
        $http.get(URL_USER_NUMS).success(function (data) {
            $scope.echarts_1.option.xAxis[0].data = data.xlist;
            $scope.echarts_1.option.series[0].data = data.ylist;
        });

        // 加载流量信息图
        $http.get(URL_DATA_FLOWS).success(function (data) {
            $scope.echarts_2.option.xAxis[0].data = data.xlist;
            $scope.echarts_2.option.series[0].data = data.ylist;
            $scope.echarts_2.option.series[1].data = data.ylist2;
        });


        //slideToggle
        $scope.users_flow_toggle = function (e) {
            $(".users_flow_chart").slideToggle();
            $(e.target).toggleClass('glyphicon-chevron-up').toggleClass('glyphicon-chevron-down');
        }
        $scope.flow_trend_toggle = function (e) {
            $(".flow_trend_chart").slideToggle();
            $(e.target).toggleClass('glyphicon-chevron-up').toggleClass('glyphicon-chevron-down');
        }
        $scope.table_1_toggle = function (e) {
            $(".table_1_show").slideToggle();
            $(e.target).toggleClass('glyphicon-chevron-up').toggleClass('glyphicon-chevron-down');
        }
        //hide
        $scope.users_flow_hide = function () {
            $(".span8").hide();
        }
        $scope.flow_trend_hide = function () {
            $(".span4").hide();
        }
        $scope.table_1_hide = function () {
            $(".span12").hide();
        }

        // show_theme
        // $scope.theme_show = function () {
        //     var $div = $('#theme-change');
        //     if ($div.width() == 202) {
        //         $div.animate({
        //             width: 36
        //         });
        //     } else {
        //         $div.animate({
        //             width: 220
        //         });
        //     }
        // }

    }];
});