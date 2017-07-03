/**
 * Created by Administrator on 2016/11/2.
 */
define(["l/directive/dashboard-echarts","echarts3","css!demo/css/home"], function () {
        return ['$scope', '$http', '$state', '$rootScope', function ($scope, $http, $state, $rootScope) {
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
            $scope.option_client = {
                option: {
                    textStyle:{
                        color:'#777777'
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start:0,
                            end: 1.8
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            xAxisIndex: [0, 1],
                            start: 0,
                            end: 1.8
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
                        data: ['上行流量','下行流量'],
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
                            name: '上行流量',
                            type: 'value',
                            // max: 150,
                            axisTick: {
                                show: false
                            }
                        },
                        {
                            inverse: true,
                            gridIndex: 1,
                            name: '下行流量',
                            type: 'value',
                            // max: 150,
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series: [
                        {
                            name: '上行流量',
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
                }
            };
        }];
    }
);