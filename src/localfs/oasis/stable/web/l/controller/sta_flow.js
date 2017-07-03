/**
 * Created by Administrator on 2016/11/2.
 */
define(['jquery','css!l/css/sta_analyse','l/directive/dashboard-echarts','l/controller/funcs_common'],
    function ($) {
        return ['$scope', function ($scope) {

            var LINE_ECHARTS_DEFAULT = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: '10%',
                    bottom: '25%',
                    right: '5%',
                    left: '5%'
                },
                dataZoom: [
                    {
                        type: 'inside',
                        realtime:true,
                        start: 90,
                        end: 100
                    },{}
                ],
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: randomTime()
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        type: 'line',
                        data: randomData(),
                        smooth: true
                    },
                    {
                        type: 'line',
                        data: randomData(),
                        smooth: true
                    }
                ]
            };

            var PIE_ECHARTS_DEFAULT ={
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

            var SM_LINE_DEFAULT_POTION={
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

            var SM_LINE_ECHARTS_DEFAULT={
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: 15,
                    right: 2,
                    bottom: 15,
                    left: 30,
                    show: false
                },
                xAxis:[$.extend(true,{},SM_LINE_DEFAULT_POTION,{
                    type: 'category',
                    boundaryGap: false
                })],
                yAxis:[$.extend(true,{},SM_LINE_DEFAULT_POTION,{
                    type: 'value',
                    nameRotate: 0,
                    nameLocation: 'middle'
                })],
                series: [
                    {
                        type: 'line',
                        smooth: true
                    },
                    {
                        type: 'line',
                        smooth: true
                    }
                ]
            };

            var FLOW_WEEK_TREND_OPTION=$.extend(true,{},SM_LINE_ECHARTS_DEFAULT,{
                xAxis:[{
                    data:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
                }],
                yAxis:[{
                    name:'周'
                }],
                series: [
                    {
                        name: '下行流量',
                        areaStyle: {
                            normal: {
                                color: 'rgb(45, 158, 68)'
                            }
                        },
                        data: [
                            2.22, 2.14, 78.45, 45.44, 1.21, 45.12, 12.54
                        ]
                    },
                    {
                        name: '上行流量',
                        areaStyle: {
                            normal: {
                                color: 'rgb(255, 58, 68)'
                            }
                        },
                        data: [
                            45.45, 14.45, 78.23, 78.12, 14.12, 47.52, 45.25
                        ]
                    }
                ]
            });

            var FLOW_MONTH_TREND_OPTION=$.extend(true,{},SM_LINE_ECHARTS_DEFAULT,{
                xAxis:[{
                    data:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
                }],
                yAxis:[{
                    name:'月'
                }],
                series: [
                    {
                        name: '上行流量',
                        areaStyle: {
                            normal: {
                                color: 'rgb(45, 158, 68)'
                            }
                        },
                        data: [
                            2.22, 2.14, 78.45, 45.44, 1.21, 45.12, 12.54
                        ]
                    },
                    {
                        name: '下行流量',
                        areaStyle: {
                            normal: {
                                color: 'rgb(255, 58, 68)'
                            }
                        },
                        data: [
                            45.45, 14.45, 78.23, 78.12, 14.12, 47.52, 45.25
                        ]
                    }
                ]
            });

            var FLOW_YEAR_TREND_OPTION=$.extend(true,{},SM_LINE_ECHARTS_DEFAULT,{
                xAxis:[{
                    data:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
                }],
                yAxis:[{
                    name:'年'
                }],
                series: [
                    {
                        name: '上行流量',
                        areaStyle: {
                            normal: {
                                color: 'rgb(45, 158, 68)'
                            }
                        },
                        data: [
                            2.22, 2.14, 78.45, 45.44, 1.21, 45.12, 12.54
                        ]
                    },
                    {
                        name: '下行流量',
                        areaStyle: {
                            normal: {
                                color: 'rgb(255, 58, 68)'
                            }
                        },
                        data: [
                            45.45, 14.45, 78.23, 78.12, 14.12, 47.52, 45.25
                        ]
                    }
                ]
            });

            var DATA_FLOW_OPTION=$.extend(true,{},LINE_ECHARTS_DEFAULT,{
                grid:{
                    left:'7%',
                    bottom:'20%'
                },
                legend: {
                    data: ['上行流量', '下行流量']
                },
                yAxis: [
                    {
                        name: '上下行流量(MB)'
                    }
                ],
                series: [
                    {
                        name: '下行流量',
                        areaStyle: {
                            normal: {
                                color: 'rgb(66,139,202)'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'rgba(66,139,202,.5)'
                            }
                        }
                    },
                    {
                        name: '上行流量',
                        areaStyle: {
                            normal: {
                                color: 'rgb(45, 158, 68)'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'rgba(45,158,68,.5)'
                            }
                        }
                    }
                ]
            });

            var APP_PERSON_TIME_OPTION=$.extend(true,{},PIE_ECHARTS_DEFAULT,{
                series: [
                    {
                        name: '人次',
                        radius:['50%','80%'],
                        data: [
                            {value: 335, name: 'QQ'},
                            {value: 310, name: '微信'},
                            {value: 234, name: '迅雷'},
                            {value: 230, name: '百度地图'},
                            {value: 135, name: '支付宝'}
                        ]
                    }
                ]
            });

            var APP_FLOW_OPTION=$.extend(true,{},PIE_ECHARTS_DEFAULT,{
                series: [
                    {
                        name: '流量',
                        radius:['50%','80%'],
                        data: [
                            {value: 335, name: 'QQ'},
                            {value: 310, name: '微信'},
                            {value: 234, name: '迅雷'},
                            {value: 230, name: '百度地图'},
                            {value: 135, name: '支付宝'}
                        ]
                    }
                ]
            });

            $scope.top_flow_user = {
                url: "../l/json/user_flow.json",
                pageSize: 8,
                pagination:false,
                extraCls: 'default_table',
                columns: [
                    {sortable: true, field: 'MAC', title: "MAC地址"},
                    {sortable: true, field: 'AP', title: "AP设备名称"},
                    {sortable: true, field: 'online_time', title: "开始上网时间"},
                    {sortable: true, field: 'online', title: "在线时长"},
                    {sortable: true, field: 'flow_upload', title: "上行流量"},
                    {sortable: true, field: 'flow_download', title: "下行流量"},
                    {sortable: true, field: 'equipment_factory', title: "设备厂商"}
                ]
            };
            $scope.all_flow_trend_table = {
                url: "../l/json/all_flow_trend.json",
                extraCls: 'default_table',
                showToolbar:true,
                columns: [
                    {sortable: true, field: 'AP_num', title: "在线AP数量"},
                    {sortable: true, field: 'user_count', title: "在线终端数量"},
                    {sortable: true, field: 'flow_upload', title: "上行流量"},
                    {sortable: true, field: 'flow_download', title: "下行流量"}
                ]
            };

            $scope.top_flow_app = {
                url: "../l/json/app_flow.json",
                pageSize: 8,
                pagination:false,
                extraCls: 'default_table',
                columns: [
                    {sortable: true, field: 'app_type', title: "应用类型"},
                    {sortable: true, field: 'app_name', title: "应用名称"},
                    {sortable: true, field: 'MAC', title: "MAC地址"},
                    {sortable: true, field: 'person_time', title: "访问人次"},
                    {sortable: true, field: 'online', title: "在线时长"},
                    {sortable: true, field: 'flow', title: "流量（MB）"}
                ]
            };

            $scope.flow_week_trend_option = {
                option:FLOW_WEEK_TREND_OPTION
            };
            $scope.flow_month_trend_option = {
                option:FLOW_MONTH_TREND_OPTION
            };
            $scope.flow_year_trend_option = {
                option:FLOW_YEAR_TREND_OPTION
            };

            $scope.data_flow_option = {
                option:DATA_FLOW_OPTION
            };

            $scope.app_person_time_option = {
                option:APP_PERSON_TIME_OPTION
            };
            $scope.app_flow_option={
                option:APP_FLOW_OPTION
            };

            $scope.app_user_flow_modal={
                mId: 'app_user_flow_modal_id',
                title: '终端流量排行',
                autoClose: false,
                showFooter:false,
                modalSize:'lg'
            };
            $scope.app_user_flow_options={
                url: "../l/json/app_user_flow.json",
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                extraCls: 'default_table',
                showToolbar:true,
                columns: [
                    {sortable: true, field: 'app_name', title: "应用名称"},
                    {sortable: true, field: 'app_type', title: "应用类型"},
                    {sortable: true, field: 'user_time', title: "访问人次"},
                    {sortable: true, field: 'flow_count', title: "访问流量"}
                ]
            };
            $scope.show_app_user_flow_modal=function () {
                $scope.$broadcast('show#app_user_flow_modal_id');
            };

            $scope.top_flow_user_modal={
                mId: 'top_flow_user_modal_id',
                title: '终端流量排行',
                autoClose: false,
                showFooter:false,
                modalSize:'lg'
            };
            $scope.top_flow_user_options={
                url: "../l/json/user_flow.json",
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                extraCls: 'default_table',
                showToolbar:true,
                columns: [
                    {sortable: true, field: 'MAC', title: "MAC地址"},
                    {sortable: true, field: 'AP', title: "AP设备名称"},
                    {sortable: true, field: 'online_time', title: "开始上网时间"},
                    {sortable: true, field: 'online', title: "在线时长"},
                    {sortable: true, field: 'flow_upload', title: "上行流量"},
                    {sortable: true, field: 'flow_download', title: "下行流量"},
                    {sortable: true, field: 'equipment_factory', title: "设备厂商"}
                ]
            };
            $scope.show_top_flow_user_modal=function () {
                $scope.$broadcast('show#top_flow_user_modal_id');
            };

            $scope.top_flow_app_modal={
                mId: 'top_flow_app_modal_id',
                title: '终端流量排行',
                autoClose: false,
                showFooter:false,
                modalSize:'lg'
            };
            $scope.top_flow_app_options={
                url: "../l/json/app_flow.json",
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                extraCls: 'default_table',
                showToolbar:true,
                columns: [
                    {sortable: true, field: 'app_type', title: "应用类型"},
                    {sortable: true, field: 'app_name', title: "应用名称"},
                    {sortable: true, field: 'MAC', title: "MAC地址"},
                    {sortable: true, field: 'person_time', title: "访问人次"},
                    {sortable: true, field: 'online', title: "在线时长"},
                    {sortable: true, field: 'flow', title: "流量（MB）"}
                ]
            };
            $scope.show_top_flow_app_modal=function () {
                $scope.$broadcast('show#top_flow_app_modal_id');
            };
        }]
    }
);