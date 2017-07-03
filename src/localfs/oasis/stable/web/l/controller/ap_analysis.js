/**
 * Created by Administrator on 2016/11/2.
 */
define(['jquery', 'echarts3','l/directive/dashboard-echarts'],
    function ($, echarts) {
        return ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
            $scope.ap = {
                click:function(){
                    if($scope.ap.model){
                        $scope.ap.info = true;
                        var data = [{a:'BD-40',b:'107',c:'开启',d:'开启',e:'正常',f:'AP数量超出AC能力集'}];
                        $scope.$broadcast('load#ap_info',data);
                    }else{
                        $scope.ap.info = false;
                        $scope.$broadcast('load#ap_info',[]);
                    }
                }
            };
            $scope.ap_info = {
                tId: "ap_info",
                url: "",
                pageSize: 3,
                pageList: [3, 10, 15, 20],
                showPageList:false,
                columns: [
                    {sortable: true, field: 'a', title: "所属AC"},
                    {sortable: true, field: 'b', title: "连接终端数"},
                    {sortable: true, field: 'c', title: "2.4GHz"},
                    {sortable: true, field: 'd', title: "5GHz"},
                    {sortable: true, field: 'e', title: "负载"},
                    {sortable: true, field: 'f', title: "最近一次隧道关闭原因"}
                ],
                sidePagination: 'client'
            };
            function randomTime() {
                var timedata = [];
                for (var i = 0; i <= 720; i++) {
                    timedata.push(2 * i);
                }
                return timedata.map(function (val) {
                    return (Math.floor(val / 60)<10?('0'+Math.floor(val / 60)):Math.floor(val / 60)) +
                        ':' +
                        ((val - Math.floor(val / 60) * 60)<10?('0'+(val - Math.floor(val / 60) * 60)):(val - Math.floor(val / 60) * 60));
                });
            }
            function randomData() {
                var datalist = [];
                for (var i = 0; i <= 720; i++) {
                    datalist.push(parseInt(Math.random() * 100 + 1));
                }
                return datalist;
            }
            var timeData = randomTime();
            $scope.ap_client_option = {
                option: {
                    textStyle:{
                        color:'#777777'
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start:0,
                            end: 50
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            xAxisIndex: [0, 1],
                            start: 0,
                            end: 50
                        }
                    ],
                    grid: [{
                        left: '3%',
                        right: '4%',
                        bottom: '48%',
                        containLabel: true
                    },{
                        gridIndex: 1,
                        left: '3%',
                        right: '4%',
                        top: '52%',
                        containLabel: true
                    }],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    legend: {
                        data: ['终端', '上行流量','下行流量'],
                        x: 'center'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: timeData,
                            splitLine: {
                                show: true
                            },
                            axisTick: {
                                show: false
                            }
                        },
                        {
                            gridIndex: 1,
                            type: 'category',
                            boundaryGap: false,
                            data: timeData,
                            axisLabel: {
                                show: false
                            },
                            splitLine: {
                                show: true
                            },
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    yAxis: [
                        {
                            name: '终端',
                            type: 'value',
                            /*max: 150,*/
                            axisTick: {
                                show: false
                            }
                        },
                        {
                            inverse: true,
                            gridIndex: 1,
                            name: '流量',
                            type: 'value',
                            /*max: 150,*/
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series: [
                        {
                            name: '终端',
                            type: 'line',
                            animation: false,
                            areaStyle: {
                                normal: {color:"#1CAF9A",opacity:0.7}
                            },
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color:"#1CAF9A"
                                }
                            },
                            data: randomData()
                        },
                        {
                            name: '上行流量',
                            type: 'line',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            animation: false,
                            areaStyle: {
                                normal: {color: '#428bca',opacity:0.7}
                            },
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color: '#428bca'
                                }
                            },
                            data: randomData()
                        },
                        {
                            name: '下行流量',
                            type: 'line',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            animation: false,
                            areaStyle: {
                                normal: {color: '#428bca',opacity:0.7}
                            },
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color: '#428bca'
                                }
                            },
                            data: randomData()
                        }
                    ]
                },
                events: {
                    click: function () {
                        if(arguments[0].seriesName == "终端"){
                            $scope.client.showModal();
                        }
                    }
                }
            };
            $scope.busy_lost_option = {
                option: {
                    textStyle:{
                        color:'#777777'
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start:0,
                            end: 2
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            xAxisIndex: [0, 1],
                            start: 0,
                            end: 2
                        }
                    ],
                    grid: [{
                        left: '3%',
                        right: '4%',
                        bottom: '48%',
                        containLabel: true
                    },{
                        gridIndex: 1,
                        left: '3%',
                        right: '4%',
                        top: '52%',
                        containLabel: true
                    }],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    legend: {
                        data: ['空口质量', '丢包率'],
                        x: 'center'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: timeData,
                            splitLine: {
                                show: true
                            },
                            axisTick: {
                                show: false
                            }
                        },
                        {
                            gridIndex: 1,
                            type: 'category',
                            boundaryGap: false,
                            data: timeData,
                            axisLabel: {
                                show: false
                            },
                            splitLine: {
                                show: true
                            },
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    yAxis: [
                        {
                            name: '空口质量',
                            type: 'value',
                            /*max: 150,*/
                            axisTick: {
                                show: false
                            }
                        },
                        {
                            inverse: true,
                            gridIndex: 1,
                            name: '丢包率',
                            type: 'value',
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series: [
                        {
                            name: '空口质量',
                            type: 'line',
                            animation: false,
                            areaStyle: {
                                normal: {color:"#1CAF9A",opacity:0.7}
                            },
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color:"#1CAF9A"
                                }
                            },
                            data: randomData()
                        },
                        {
                            name: '丢包率',
                            type: 'line',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            animation: false,
                            areaStyle: {
                                normal: {color: '#428bca',opacity:0.7}
                            },
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color: '#428bca'
                                }
                            },
                            data: randomData()
                        }
                    ]
                }
            };
            $scope.AP_xin_option = {
                option: {
                    textStyle:{
                        color:'#777777'
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start:0,
                            end: 2
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            start: 0,
                            end: 2
                        }
                    ],
                    grid: {
                        left: '3%',
                        right: '4%',
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            splitLine: {
                                show: true
                            },
                            axisTick: {
                                show: false
                            },
                            boundaryGap: false,
                            data: randomTime().map(function (str) {
                                return str.replace(' ', '\n')
                            })
                        }
                    ],
                    yAxis: [
                        {
                            name: '信道占用率',
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '信道占用率',
                            type: 'line',
                            animation: false,
                            areaStyle: {
                                normal: {color:"#1CAF9A",opacity:0.7}
                            },
                            smooth: true,
                            lineStyle: {
                                normal: {
                                    width: 1,
                                    color:"#1CAF9A"
                                }
                            },
                            data: randomData()
                        }
                    ]
                }
            };
            $scope.client = {
                modal:{
                    mId: "client_modal",
                    title: "终端信息"
                },
                data:[
                {a:'00:56',b:'00-25-64-76-BD-40',c:'1.3M',d:'3.5M'},
                {a:'03:21',b:'30-21-44-23-HF-25',c:'0.3M',d:'9.8M'},
                {a:'10:00',b:'25-65-65-45-NR-30',c:'1.7M',d:'4.3M'},
                {a:'11:03',b:'66-55-15-12-EY-05',c:'2.5M',d:'7.7M'},
                {a:'11:03',b:'48-11-97-23-RH-49',c:'3.3M',d:'10.6M'},
                {a:'11:03',b:'95-48-19-34-JR-88',c:'1.3M',d:'3.5M'},
                {a:'11:56',b:'20-34-29-45-KU-76',c:'1.3M',d:'3.5M'},
                {a:'12:03',b:'64-84-64-56-WE-14',c:'1.3M',d:'3.5M'},
                {a:'12:09',b:'98-19-19-67-GE-52',c:'1.3M',d:'3.5M'},
                {a:'12:10',b:'54-75-00-78-JU-40',c:'1.3M',d:'3.5M'}
            ],
                table:{
                    tId: "client_table",
                    extraCls: 'default_table',
                    showToolbar: true,
                    pageSize: 5,
                    pageList: [5, 10, 15, 20],
                    showPageList:false,
                    columns: [
                        // {sortable: true, field: 'a', title: "用户名称"},
                        {sortable: true, field: 'b', title: "MAC地址"},
                        {sortable: true, field: 'c', title: "上行流量"},
                        {sortable: true, field: 'd', title: "下行流量"}
                    ],
                    sidePagination: 'client'
                },
                showModal:function () {
                    $scope.$broadcast('show#client_modal');
                    $scope.$broadcast('load#client_table', $scope.ap_client_detail.data);
                }
            };
            $scope.ap_client_detail = {
                modal:{
                    mId: "ap_client_detail_modal",
                    title: "AP流量与终端信息",
                    modalSize: "lg"
                },
                data:[
                    {a:'00:56',b:'00-25-64-76-BD-40',c:'1.3M',d:'3.5M'},
                    {a:'03:21',b:'30-21-44-23-HF-25',c:'0.3M',d:'9.8M'},
                    {a:'10:00',b:'25-65-65-45-NR-30',c:'1.7M',d:'4.3M'},
                    {a:'11:03',b:'66-55-15-12-EY-05',c:'2.5M',d:'7.7M'},
                    {a:'11:03',b:'48-11-97-23-RH-49',c:'3.3M',d:'10.6M'},
                    {a:'11:03',b:'95-48-19-34-JR-88',c:'1.3M',d:'3.5M'},
                    {a:'11:56',b:'20-34-29-45-KU-76',c:'1.3M',d:'3.5M'},
                    {a:'12:03',b:'64-84-64-56-WE-14',c:'1.3M',d:'3.5M'},
                    {a:'12:09',b:'98-19-19-67-GE-52',c:'1.3M',d:'3.5M'},
                    {a:'12:10',b:'54-75-00-78-JU-40',c:'1.3M',d:'3.5M'}
                ],
                table:{
                    tId: "ap_client_detail_table",
                    showToolbar: true,
                    extraCls: 'default_table',
                    pageSize: 5,
                    pageList: [5, 10, 15, 20],
                    showPageList:false,
                    columns: [
                        {sortable: true, field: 'b', title: "MAC地址"},
                        {sortable: true, field: 'c', title: "上行流量"},
                        {sortable: true, field: 'd', title: "下行流量"},
                        {sortable: true, field: 'a', title: "时间"}
                    ],
                    sidePagination: 'client'
                },
                showModal:function () {
                    $scope.$broadcast('show#ap_client_detail_modal');
                    $scope.$broadcast('load#ap_client_detail_table', $scope.ap_client_detail.data);
                }
            };
            $scope.busy_lost_detail = {
                modal:{
                    mId: "busy_lost_detail_modal",
                    title: "空口质量与丢包率"
                    // modalSize: "lg"
                },
                data:[
                    {c:'0.10%',b:'100',a:'08:00',d:'3.5M'},
                    {c:'0.30%',b:'95',a:'08:10',d:'9.8M'},
                    {c:'0.25%',b:'98.7',a:'08:13',d:'4.3M'},
                    {c:'1.03%',b:'99.8',a:'08:23',d:'7.7M'},
                    {c:'1.06%',b:'97.9',a:'08:56',d:'10.6M'},
                    {c:'1.75%',b:'99.3',a:'09:02',d:'3.5M'},
                    {c:'0.23%',b:'98.2',a:'09:10',d:'3.5M'},
                    {c:'1.01%',b:'99.0',a:'09:12',d:'3.5M'},
                    {c:'2.00%',b:'98.2',a:'09:35',d:'3.5M'},
                    {c:'50.00%',b:'98.00',a:'09:44',d:'3.5M'}
                ],
                table:{
                    tId: "busy_lost_detail_table",
                    showToolbar: true,
                    extraCls: 'default_table',
                    pageSize: 5,
                    pageList: [5, 10, 15, 20],
                    showPageList:false,
                    columns: [
                        {sortable: true, field: 'b', title: "空口质量"},
                        {sortable: true, field: 'c', title: "丢包率"},
                        // {sortable: true, field: 'd', title: "下行流量"},
                        {sortable: true, field: 'a', title: "时间"}
                    ],
                    sidePagination: 'client'
                },
                showModal:function () {
                    $scope.$broadcast('show#busy_lost_detail_modal');
                    $scope.$broadcast('load#busy_lost_detail_table', $scope.busy_lost_detail.data);
                }
            };
            $scope.ap_xin_detail = {
                modal:{
                    mId: "ap_xin_detail_modal",
                    title: "信道占用率"
                    // modalSize: "lg"
                },
                data:[
                    {a:'00:56',b:'40%',c:'1.3M',d:'3.5M'},
                    {a:'03:21',b:'25%',c:'0.3M',d:'9.8M'},
                    {a:'10:00',b:'30%',c:'1.7M',d:'4.3M'},
                    {a:'11:03',b:'15%',c:'2.5M',d:'7.7M'},
                    {a:'11:03',b:'11%',c:'3.3M',d:'10.6M'},
                    {a:'11:03',b:'19%',c:'1.3M',d:'3.5M'},
                    {a:'11:56',b:'34%',c:'1.3M',d:'3.5M'},
                    {a:'12:03',b:'14%',c:'1.3M',d:'3.5M'},
                    {a:'12:09',b:'19%',c:'1.3M',d:'3.5M'},
                    {a:'12:10',b:'40%',c:'1.3M',d:'3.5M'}
                ],
                table:{
                    tId: "ap_xin_detail_table",
                    showToolbar: true,
                    extraCls: 'default_table',
                    pageSize: 5,
                    pageList: [5, 10, 15, 20],
                    showPageList:false,
                    columns: [
                        {sortable: true, field: 'b', title: "信道占用率"},
                        // {sortable: true, field: 'c', title: "丢包率"},
                        // {sortable: true, field: 'd', title: "下行流量"},
                        {sortable: true, field: 'a', title: "时间"}
                    ],
                    sidePagination: 'client'
                },
                showModal:function () {
                    $scope.$broadcast('show#ap_xin_detail_modal');
                    $scope.$broadcast('load#ap_xin_detail_table', $scope.ap_xin_detail.data);
                }
            }
        }]
    }
);