/**
 * Created by Administrator on 2016/11/2.
 */
define(['css!l/css/sta_analyse','l/directive/dashboard-echarts','l/controller/funcs_common'],
    function () {
        return ['$scope', function ($scope) {

            $scope.top_delay_user = {
                url: "../l/json/delay_user.json",
                pagination:false,
                extraCls: 'default_table',
                columns: [
                    {sortable: true, field: 'MAC', title: "MAC地址"},
                    {sortable: true, field: 'delay_num', title: "时延次数"},
                    {sortable: true, field: 'delay_max', title: "最高时延"},
                    {sortable: true, field: 'delay_time', title: "最近一次时延时间"}
                ]
            };
            $scope.top_lossrate_user = {
                url: "../l/json/lossrate_user.json",
                pagination:false,
                extraCls: 'default_table',
                columns: [
                    {sortable: true, field: 'MAC', title: "MAC地址"},
                    {sortable: true, field: 'lossrate_num', title: "丢包次数"},
                    {sortable: true, field: 'lossrate', title: "丢包率"},
                    {sortable: true, field: 'lossrate_time', title: "最近一次丢包时间"}
                ]
            };

            $scope.sta_performance_option = {
                option:{
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['时延','丢包率','用户量','流量'],
                        x: 'center'
                    },
                    dataZoom:[{
                        realtime:true,
                        type:'inside',
                        top:'10%',
                        start:80,
                        end:100,
                        xAxisIndex:[0,1]
                    },{}],
                    grid: [{
                        left: 50,
                        right: 50,
                        top:'8%',
                        height: '32%'
                    }, {
                        left: 50,
                        right: 50,
                        top: '47%',
                        height: '32%',
                        bottom:'30%'
                    }],
                    xAxis : [
                        {
                            type : 'category',
                            data: randomTime(),
                            boundaryGap: false,
                            splitLine: {
                                show: true
                            },
                            axisLabel:{
                                interval:39
                            },
                            axisTick: {
                                show: false
                            }
                        },
                        {
                            gridIndex: 1,
                            type : 'category',
                            data: randomTime(),
                            boundaryGap: false,
                            position: 'top',
                            axisLabel: {
                                show: false,
                                interval:39
                            },
                            splitLine: {
                                show: true
                            },
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    yAxis : [
                        {
                            name : '时延（ms）',
                            type : 'value',
                            axisTick: {
                                show: false
                            }
                        },
                        {
                            name : '丢包率(%)',
                            type : 'value',
                            axisTick: {
                                show: false
                            }
                        },
                        {
                            gridIndex: 1,
                            name : '用户量(个)',
                            type : 'value',
                            inverse: true,
                            axisTick: {
                                show: false
                            }
                        },
                        {
                            gridIndex: 1,
                            name : '流量(MB)',
                            inverse: true,
                            type : 'value',
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series : [
                        {
                            name:'时延',
                            type:'line',
                            symbolSize: 8,
                            smooth:true,
                            hoverAnimation: false,
                            data:randomData(),
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
                        },
                        {
                            name:'丢包率',
                            type:'line',
                            yAxisIndex: 1,
                            smooth:true,
                            hoverAnimation: false,
                            data: randomData(),
                            itemStyle: {
                                normal: {
                                    color: 'rgba(12,139,202,.5)'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: 'rgb(12,139,202)'
                                }
                            }
                        },
                        {
                            name:'用户量',
                            type:'line',
                            xAxisIndex: 1,
                            yAxisIndex: 2,
                            smooth:true,
                            hoverAnimation: false,
                            data:randomData(),
                            itemStyle: {
                                normal: {
                                    color: 'rgba(66,13,202,.5)'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: 'rgb(66,13,202)'
                                }
                            }
                        },
                        {
                            name:'流量',
                            type:'line',
                            symbolSize: 8,
                            xAxisIndex: 1,
                            yAxisIndex: 3,
                            smooth:true,
                            hoverAnimation: false,
                            data: randomData(),
                            itemStyle: {
                                normal: {
                                    color: 'rgba(66,139,20,.5)'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: 'rgb(66,139,20)'
                                }
                            }
                        }
                    ]
                }
            };

            $scope.user_performance_option = {
                option:{
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['时延','丢包率'],
                        x: 'center'
                    },
                    dataZoom:[{
                        realtime:true,
                        type:'inside',
                        top:'10%',
                        start:80,
                        end:100
                    },{}],
                    grid: [{
                        left: 50,
                        right: 50,
                        top:'8%'
                    }],
                    xAxis : [
                        {
                            type : 'category',
                            data: randomTime(),
                            boundaryGap: false,
                            splitLine: {
                                show: true
                            },
                            axisLabel:{
                                interval:39
                            },
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    yAxis : [
                        {
                            name : '时延（ms）',
                            type : 'value',
                            axisTick: {
                                show: false
                            }
                        },
                        {
                            name : '丢包率(%)',
                            type : 'value',
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series : [
                        {
                            name:'时延',
                            type:'line',
                            symbolSize: 8,
                            smooth:true,
                            hoverAnimation: false,
                            data:randomData(),
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
                        },
                        {
                            name:'丢包率',
                            type:'line',
                            yAxisIndex: 1,
                            smooth:true,
                            hoverAnimation: false,
                            data: randomData(),
                            itemStyle: {
                                normal: {
                                    color: 'rgba(12,139,202,.5)'
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: 'rgb(12,139,202)'
                                }
                            }
                        }
                    ]
                }
            };

            $scope.all_net_performance_options={
                url: "../l/json/all_net_performance.json",
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                extraCls: 'default_table',
                showToolbar:true,
                columns: [
                    {sortable: true, field: 'AP_name', title: "AP名称"},
                    {sortable: true, field: 'user_count', title: "在线终端数量"},
                    {sortable: true, field: 'flow', title: "流量"},
                    {sortable: true, field: 'user_delay_num', title: "终端时延次数"},
                    {sortable: true, field: 'delay_time', title: "总时延时间"},
                    {sortable: true, field: 'loss_num', title: "丢包次数"},
                    {sortable: true, field: 'loss_rate', title: "丢包率"}
                ]
            };

            $scope.delay_user_modal={
                mId: 'delay_user_modal_id',
                title: '终端流量排行',
                autoClose: false,
                showFooter:false,
                modalSize:'lg'
            };
            $scope.delay_user_options={
                url: "../l/json/delay_user.json",
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                extraCls: 'default_table',
                showToolbar:true,
                columns: [
                    {sortable: true, field: 'MAC', title: "MAC地址"},
                    {sortable: true, field: 'delay_num', title: "时延次数"},
                    {sortable: true, field: 'delay_max', title: "最高时延"},
                    {sortable: true, field: 'delay_time', title: "最近一次时延时间"}
                ]
            };
            $scope.show_delay_user_modal=function () {
                $scope.$broadcast('show#delay_user_modal_id');
            };

            $scope.lossrate_user_modal={
                mId: 'lossrate_user_modal_id',
                title: '终端流量排行',
                autoClose: false,
                showFooter:false,
                modalSize:'lg'
            };
            $scope.lossrate_user_options={
                url: "../l/json/lossrate_user.json",
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                extraCls: 'default_table',
                showToolbar:true,
                columns: [
                    {sortable: true, field: 'MAC', title: "MAC地址"},
                    {sortable: true, field: 'lossrate_num', title: "丢包次数"},
                    {sortable: true, field: 'lossrate', title: "最高丢包率"},
                    {sortable: true, field: 'lossrate_time', title: "最近一次丢包时间"}
                ]
            };
            $scope.show_lossrate_user_modal=function () {
                $scope.$broadcast('show#lossrate_user_modal_id');
            };
        }]
    }
);