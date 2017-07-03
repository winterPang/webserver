/**
 * Created by Administrator on 2016/11/2.
 */
define(['jquery', 'css!l/css/sta_analyse','l/directive/dashboard-echarts',  'l/controller/funcs_common'],
    function ($) {
        return ['$scope', function ($scope) {
            $scope.top_online_abnormal_analyse = {
                url: "../l/json/online_abnormal.json",
                extraCls: 'default_table',
                pagination:false,
                columns: [
                    {sortable: true, field: 'abnormal_cate', title: "异常分类"},
                    {sortable: true, field: 'abnormal_num', title: "异常次数"},
                    {sortable: true, field: 'abnormal_desc', title: "异常描述"}
                ]
            };
            $scope.top_offline_abnormal_analyse = {
                url: "../l/json/offline_abnormal.json",
                extraCls: 'default_table',
                pagination:false,
                columns: [
                    {sortable: true, field: 'abnormal_cate', title: "异常分类"},
                    {sortable: true, field: 'abnormal_num', title: "异常次数"},
                    {sortable: true, field: 'abnormal_desc', title: "异常描述"}
                ]
            };

            $scope.online_abnormal_analyse_option = {
                option:{
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['auth异常次数','重认证异常次数'],
                        x: 'center'
                    },
                    dataZoom:[
                        {
                            type:'inside',
                            realtime:true,
                            start:90,
                            end:100
                        },{}
                    ],
                    xAxis : [
                        {
                            type : 'category',
                            data: randomTime(),
                            boundaryGap: false,
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
                            name : '异常次数',
                            type : 'value',
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series : [
                        {
                            name:'auth异常次数',
                            type:'line',
                            symbolSize: 8,
                            smooth:true,
                            data:randomData()
                        },
                        {
                            name:'重认证异常次数',
                            type:'line',
                            smooth:true,
                            data: randomData()
                        }
                    ]
                }
            };

            $scope.offline_abnormal_analyse_option = {
                option:{
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['auth异常次数','重认证异常次数'],
                        x: 'center'
                    },
                    dataZoom:[
                        {
                            type:'inside',
                            realtime:true,
                            start:90,
                            end:100
                        },{}
                    ],
                    xAxis : [
                        {
                            type : 'category',
                            data: randomTime(),
                            boundaryGap: false,
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
                            name : '异常次数',
                            type : 'value',
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series : [
                        {
                            name:'auth异常次数',
                            type:'line',
                            symbolSize: 8,
                            smooth:true,
                            data:randomData()
                        },
                        {
                            name:'重认证异常次数',
                            type:'line',
                            smooth:true,
                            data: randomData()
                        }
                    ]
                }
            };

            $scope.online_abnormal_info_modal = {
                mId: 'online_abnormal_info_modal_id',
                title: '上线异常',
                autoClose: false,
                showCancel: false,
                showOk: false,
                modalSize: "lg"
            };
            $scope.offline_abnormal_info_modal = {
                mId: 'offline_abnormal_info_modal_id',
                title: '下线异常',
                autoClose: false,
                showCancel: false,
                showOk: false,
                modalSize: "lg"
            };

            $scope.options = {
                showToolbar:true,
                extraCls: 'default_table',
                url: "../l/json/online_detail.json",
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                columns: [
                {sortable: true, field: 'abnormal_mac', title: "MAC地址"},
                {sortable: true, field: 'abnormal_cate', title: "异常类型"},
                {sortable: true, field: 'abnormal_desc', title: "异常描述"},
                    {sortable: true, field: 'abnormal_time', title: "时间"}
            ],
                onLoadSuccess: function () {
                    $(window).trigger('resize');
                }
            };
            $scope.offline_options = {
                showToolbar:true,
                extraCls: 'default_table',
                url: "../l/json/offline_detail.json",
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                columns: [
                    {sortable: true, field: 'abnormal_mac', title: "MAC地址"},
                    {sortable: true, field: 'abnormal_cate', title: "异常类型"},
                    {sortable: true, field: 'abnormal_desc', title: "异常描述"},
                    {sortable: true, field: 'abnormal_time', title: "时间"}
                ],
                onLoadSuccess: function () {
                    $(window).trigger('resize');
                }
            };

            $scope.show_online_abnormal_info_modal=function () {
                $scope.$broadcast('show#online_abnormal_info_modal_id');
            }
            $scope.show_offline_abnormal_info_modal=function () {
                $scope.$broadcast('show#offline_abnormal_info_modal_id');
            }
        }]
    }
);