define(['jquery', 'echarts3', 'moment', 'utils', 'angular-ui-router', '../lib/echarts-liquidfill', 'bootstrap-daterangepicker'], function ($, echarts, moment, Utils) {
    return ['$scope', '$http', '$state', '$rootScope', '$stateParams', '$alertService', '$timeout', function ($scope, $http, $state, $rootScope, $stateParams, $alert, $timeout) {

        function getRcString(attrName) {
            return Utils.getRcString("userExp_rc", attrName);
        }

        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        $('#daterange').daterangepicker({
            singleDatePicker: true,
            maxDate: new Date(),
            minDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
            dateLimit: {
                days: 1
            },
            locale: {
                format: 'YYYY-MM-DD'
            },
            'opens': 'center'
        }, function (start, end, label) {
            start.format('YYYY-MM-DD');
        }).on('apply.daterangepicker', function (e, date) {
        });

        var dateEg = [
                        '00:00', '00:10', '00:20', '00:30', '00:40', '00:50',
                        '01:00', '01:10', '01:20', '01:30', '01:40', '01:50',
                        '02:00', '02:10', '02:20', '02:30', '02:40', '02:50',
                        '03:00', '03:10', '03:20', '03:30', '03:40', '03:50',
                        '04:00', '04:10', '04:20', '04:30', '04:40', '04:50',
                        '05:00', '05:10', '05:20', '05:30', '05:40', '05:50',
                        '06:00', '06:10', '06:20', '06:30', '06:40', '06:50',
                        '07:00', '07:10', '07:20', '07:30', '07:40', '07:50',
                        '08:00', '08:10', '08:20', '08:30', '08:40', '08:50',
                        '09:00', '09:10', '09:20', '09:30', '09:40', '09:50',
                        '10:00', '10:10', '10:20', '10:30', '10:40', '10:50',
                        '11:00', '11:10', '11:20', '11:30', '11:40', '11:50',
                        '12:00', '12:10', '12:20', '12:30', '12:40', '12:50',
                        '13:00', '13:10', '13:20', '13:30', '13:40', '13:50',
                        '14:00', '14:10', '14:20', '14:30', '14:40', '14:50',
                        '15:00', '15:10', '15:20', '15:30', '15:40', '15:50',
                        '16:00', '16:10', '16:20', '16:30', '16:40', '16:50',
                        '17:00', '17:10', '17:20', '17:30', '17:40', '17:50',
                        '18:00', '18:10', '18:20', '18:30', '18:40', '18:50',
                        '19:00', '19:10', '19:20', '19:30', '19:40', '19:50',
                        '20:00', '20:10', '20:20', '20:30', '20:40', '20:50',
                        '21:00', '21:10', '21:20', '21:30', '21:40', '21:50',
                        '22:00', '22:10', '22:20', '22:30', '22:40', '22:50',
                        '23:00', '23:10', '23:20', '23:30', '23:40', '23:50'
                    ];
        var barDataEg = [
                        9, 8, 8, 6, 6, 7,
                        7, 8, 9, 10, 11, 12,
                        12, 12, 13, 13, 14, 14,
                        15, 15, 16, 16, 17, 17,
                        16, 16, 15, 15, 14, 14,
                        13, 13, 12, 12, 11, 11,
                        10, 9, 9, 8, 8, 7,
                        7, 6, 6, 6, 5, 5,
                        5, 5, 4, 4, 4, 5,
                        5, 5, 5, 6, 6, 6,
                        7, 7, 7, 8, 8, 9,
                        10, 11, 11, 12, 12, 12,
                        13, 13, 13, 14, 14, 14,
                        15, 15, 15, 15, 14, 14,
                        14, 13, 13, 13, 12, 12,
                        11, 10, 10, 9, 9, 8,
                        8, 8, 7, 7, 7, 6,
                        6, 6, 5, 5, 5, 5,
                        6, 6, 6, 7, 7, 7,
                        8, 8, 8, 9, 9, 10,
                        10, 11, 12, 13, 14, 12,
                        12, 13, 13, 14, 13, 13,
                        12, 11, 11, 10, 10, 9,
                        9, 8, 6, 5, 6, 9
                    ];
        var clientOnApOpt = {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top: 20,
                left: 30,
                right: 50,
                bottom: 50,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
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
                        },
                    },
                    data:dateEg,
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
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
                        },
                    },
                    minInterval: 1
                }
            ],
            dataZoom: [{
                // type: 'inside',
                xAxisIndex: 0,

                show: true,
                realtime: true,
                start: 70,
                end: 100,
                backgroundColor: '#ffffff',
                dataBackground: {
                    lineStyle: {
                        color: 'rgba(17, 168,171, 1)',
                        width: 0.5,
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(17, 168,171, 0.1)',
                            }, {
                                offset: 1, color: 'rgba(17, 168,171, 1)'
                            }],
                            globalCoord: false
                        }
                    },
                },
            }],
            series: [
                {
                    name: 'AP占比',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 2
                        },
                    },
                    // barWidth: '40%',
                    data: barDataEg,
                },
            ],
            itemStyle: {
                normal: {

                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(17, 168,171, 1)'
                    }, {
                        offset: 1,
                        color: 'rgba(17, 168,171, 0.1)'
                    }]),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            }
        };

        var assocEchart = echarts.init(document.getElementById('assoc'));
        var dropPacketEchart = echarts.init(document.getElementById('dropPacket'));

        assocEchart.setOption(clientOnApOpt);
        dropPacketEchart.setOption(clientOnApOpt);

        var CPUechart = echarts.init(document.getElementById('CPU'));
        var memoryEchart = echarts.init(document.getElementById('memory'));
        CPUechart.setOption(clientOnApOpt);
        memoryEchart.setOption(clientOnApOpt);

        var clientOnApEchart = echarts.init(document.getElementById('clientOnAp'));
        var client5gEchart = echarts.init(document.getElementById('5g'));


        clientOnApEchart.setOption(clientOnApOpt);
        client5gEchart.setOption(clientOnApOpt);


        var pieOption = {
            color: ['#78cec3', '#f2bc98', '#fe808b'],
            tooltip: {
                trigger: 'item',
                confine: true,
                position: ['50%', '50%']
            },
            legend: {
                orient: 'horizontal',
                top: '82%',
                itemWidth: 20,
                itemHeight: 12,
                textStyle: {
                    color: '#617085',
                    fontSize: 12,
                },
                data: [
                ]
            },
            series: [
                {
                    type: 'pie',
                    center: ['50%', '43%'],
                    radius: ['42%', '70%'],
                    hoverAnimation: false,
                    avoidLabelOverlap: true,
                    minAngle: 3,
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false,
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 1,
                            borderType: 'solid',

                        },
                    },
                    data: [
                    ]
                }
            ]
        };
        var pieOptionObj = {
            assocPie: {
                color: ['#78cec3', '#f2bc98', '#fe808b'],
                tooltip: {
                    formatter: "AP关联成功率 : {b}({d}%)<br/>AP数目 : {c} ",
                },
                legend: {
                    data: [
                        { name: '> 80%', icon: 'pin' },
                        { name: '70% - 80%', icon: 'pin' },
                        { name: '< 70%', icon: 'pin' },
                    ]
                },
                series: [{
                    name: 'AP丢包率',
                    data: [
                        { name: '> 80%', value: 11 },
                        { name: '70% - 80%', value: 6 },
                        { name: '< 70%', value: 3 }
                    ]
                }]

            },
            dropPacketPie: {
                color: ['#78cec3', '#f2bc98'],
                tooltip: {
                    formatter: "AP丢包率 : {b}({d}%)<br/>AP数目 : {c} ",
                },
                legend: {
                    data: [
                        { name: '> 10%', icon: 'pin' },
                        { name: '< 10%', icon: 'pin' },
                    ]
                },
                series: [{
                    name: 'AP丢包率',
                    data: [
                        { name: '> 10%', value: 11 },
                        { name: '< 10%', value: 3 }
                    ]
                }]
            },
            cpuPie: {
                color: ['#78cec3', '#f2bc98', '#fe808b'],
                tooltip: {
                    formatter: "AP CPU使用率 : {b}({d}%)<br/>AP数目 : {c} ",
                },
                legend: {
                    data: [
                        { name: '> 90%', icon: 'pin' },
                        { name: '60% - 90%', icon: 'pin' },
                        { name: '< 60%', icon: 'pin' },
                    ]
                },
                series: [{
                    name: 'AP CPU使用率',
                    data: [
                        { name: '> 90%', value: 11 },
                        { name: '60% - 90%', value: 6 },
                        { name: '< 60%', value: 3 }
                    ]
                }]
            },
            memoryPie: {
                color: ['#78cec3', '#f2bc98', '#fe808b'],
                tooltip: {
                    formatter: "AP 内存使用率 : {b}({d}%)<br/>AP数目 : {c} ",
                },
                legend: {
                    data: [
                        { name: '> 90%', icon: 'pin' },
                        { name: '60% - 90%', icon: 'pin' },
                        { name: '< 60%', icon: 'pin' },
                    ]
                },
                series: [{
                    name: 'AP 内存使用率',
                    data: [
                        { name: '> 90%', value: 11 },
                        { name: '60% - 90%', value: 6 },
                        { name: '< 60%', value: 3 }
                    ]
                }]
            },
            clientNumPie: {
                color: ['#78cec3', '#f2bc98', '#fe808b'],
                tooltip: {
                    formatter: "接入AP终端数 : {b}({d}%)<br/>AP数目 : {c} ",
                },
                legend: {
                    data: [
                        { name: '< 30', icon: 'pin' },
                        { name: '30 - 60', icon: 'pin' },
                        { name: '> 60', icon: 'pin' },
                    ]
                },
                series: [{
                    name: 'AP 内存使用率',
                    data: [
                        { name: '< 30', value: 11 },
                        { name: '30 - 60', value: 6 },
                        { name: '> 60', value: 3 }
                    ]
                }]
            },
            client5gPie: {
                color: ['#78cec3', '#f2bc98', '#fe808b'],
                tooltip: {
                    formatter: "5G终端占比 : {b}({d}%)<br/>AP数目 : {c} ",
                },
                legend: {
                    data: [
                        { name: '< 50%', icon: 'pin' },
                        { name: '50% - 60%', icon: 'pin' },
                        { name: '> 60%', icon: 'pin' },
                    ]
                },
                series: [{
                    name: 'AP 内存使用率',
                    data: [
                        { name: '< 50%', value: 11 },
                        { name: '50% - 60%', value: 6 },
                        { name: '> 60%', value: 3 }
                    ]
                }]
            }
        }

        function createPieOption(pieElement) {
            var elementOpt = pieOptionObj[pieElement];
            var pieOptionUsed = {};
            pieOptionUsed = $.extend(true, {}, pieOption, elementOpt);
            return pieOptionUsed;
        }

        function createPie(pieElement) {
            var pie = echarts.init(document.getElementById(pieElement));
            var option = createPieOption(pieElement);
            pie.setOption(option);
            return pie;
        }

        var dataEg = [
            [
                { apName: 'ap1', apSN: '210235A0200041581278', data: '81%' },
                { apName: 'ap2', apSN: '210235A0200041581259', data: '81%' },
                { apName: 'ap3', apSN: '210235A0200041581266', data: '81%' },
                { apName: 'ap4', apSN: '210235A0200041581255', data: '82%' },
                { apName: 'ap5', apSN: '210235A0200041581234', data: '83%' },
                { apName: 'ap6', apSN: '210235A0200041581212', data: '88%' },
                { apName: 'ap7', apSN: '210235A0200041581211', data: '86%' },
                { apName: 'ap8', apSN: '210235A0200041581213', data: '85%' },
                { apName: 'ap9', apSN: '210235A0200041581215', data: '88%' },
                { apName: 'ap10', apSN: '210235A0200041581216', data: '81%' },
                { apName: 'ap11', apSN: '210235A0200041581217', data: '82%' }
            ],
            [
                { apName: 'ap15', apSN: '210235A0200041581268', data: '71%' },
                { apName: 'ap26', apSN: '210235A0200041581269', data: '71%' },
                { apName: 'ap33', apSN: '210235A0200041581276', data: '71%' },
                { apName: 'ap43', apSN: '210235A0200041581225', data: '72%' },
                { apName: 'ap52', apSN: '210235A0200041581224', data: '73%' },
                { apName: 'ap62', apSN: '210235A0200041581222', data: '78%' }
            ],
            [
                { apName: 'ap12', apSN: '210235A0200041581288', data: '50%' },
                { apName: 'ap13', apSN: '210235A0200041581289', data: '55%' },
                { apName: 'ap14', apSN: '210235A0200041581290', data: '56%' }
            ]
        ]

        var oTablePub = {
            contentType: 'application/json',
            dataType: 'json',
            pageSize: 5,
            pageList: [5, 10, 15, 'All'],
            searchable: true,
            dataField: 'data',
            totalField: 'totalCount',
        }

        var oModalPub = {
            autoClose: true,
            showCancel: false,
            showOk: false,
            showHeader: true,
            showFooter: false,
            showClose: true
        };

        // ********************** 鼠标事件变量及方法定义 ********************************
        $scope.eventData = {
            time: '00:00',
            process: function barClickEvent(modalId, pieElement, tadleId) {

                $scope.$broadcast('show#' + modalId);
                // debugger
                var pie = createPie(pieElement);

                pie.on('click', function (paramsPie) {
                    var index = paramsPie.dataIndex;
                    var dataPie = [];
                    switch (index) {
                        case 0: {
                            dataPie = dataEg[0];
                            break;
                        }
                        case 1: {
                            dataPie = dataEg[1];
                            break;
                        }
                        case 2: {
                            dataPie = dataEg[2];
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                    $scope.$broadcast('load#' + tadleId, dataPie);
                });

                $scope.$on('click-cell.bs.table#' + tadleId, function (e, field, value, row, $element) {
                    var date = new Date($('#daterange').val()).Format('yyyy-MM-dd');
                    if (field == "apName") {
                        $state.go('^.apindex88', { ApName: row.apName, date: date });
                        $rootScope.modalInfo.count = 0;
                    }
                })
                return;
            }
        };

        //************************ ap关联失败率 ***********************************
        $scope.assocModal = $.extend(true, {}, {
            mId: 'assocMid',
            title: 'AP关联成功率',
        }, oModalPub);

        $scope.assocTable = $.extend(true, {}, {
            tId: 'assocTid',
            columns: [
                {
                    searcher: {}, sortable: true, field: 'apName', title: 'AP名字',
                    formatter: function (value, row, index) {
                        return '<a class="list-link">' + value + '</a>';
                    }
                },
                { searcher: {}, sortable: true, field: 'apSN', title: 'ap序列号' },
                { searcher: {}, sortable: true, field: 'data', title: 'AP关联成功率' }
            ],
            data: dataEg[2],
        }, oTablePub);

        assocEchart.on('click', function (params) {
            $scope.eventData.time = params.name;
            $scope.eventData.process('assocMid', 'assocPie', 'assocTid')
            return;
        });


        //*************************** AP丢包率 ********************************
        $scope.dropPacketModal = $.extend(true, {}, {
            mId: 'dropPacketMid',
            title: 'AP丢包率',
        }, oModalPub);

        $scope.dropPktTable = $.extend(true, {}, {
            tId: 'dropPktTid',
            columns: [
                {
                    searcher: {}, sortable: true, field: 'apName', title: 'AP名字',
                    formatter: function (value, row, index) {
                        return '<a class="list-link">' + value + '</a>';
                    }
                },
                { searcher: {}, sortable: true, field: 'apSN', title: 'ap序列号' },
                { searcher: {}, sortable: true, field: 'data', title: 'AP丢包率' }
            ],
            data: dataEg[0],
        }, oTablePub);

        dropPacketEchart.on('click', function (params) {
            $scope.eventData.time = params.name;
            $scope.eventData.process('dropPacketMid', 'dropPacketPie', 'dropPktTid')
            return;
        });

        //CPU

        $scope.cpuModal = $.extend(true, {}, {
            mId: 'cpuMid',
            title: 'AP CPU使用率',
        }, oModalPub);

        $scope.cpuTable = $.extend(true, {}, {
            tId: 'cpuTid',
            columns: [
                {
                    searcher: {}, sortable: true, field: 'apName', title: 'AP名字',
                    formatter: function (value, row, index) {
                        return '<a class="list-link">' + value + '</a>';
                    }
                },
                { searcher: {}, sortable: true, field: 'apSN', title: 'ap序列号' },
                { searcher: {}, sortable: true, field: 'data', title: 'CPU使用率' }
            ],
            data: dataEg[0],
        }, oTablePub);

        CPUechart.on('click', function (params) {
            $scope.eventData.time = params.name;
            $scope.eventData.process('cpuMid', 'cpuPie', 'cpuTid')
            return;
        });

        // memory

        $scope.memoryModal = $.extend(true, {}, {
            mId: 'memoryMid',
            title: 'AP 内存使用率',
        }, oModalPub);

        $scope.memoryTable = $.extend(true, {}, {
            tId: 'memoryTid',
            columns: [
                {
                    searcher: {}, sortable: true, field: 'apName', title: 'AP名字',
                    formatter: function (value, row, index) {
                        return '<a class="list-link">' + value + '</a>';
                    }
                },
                { searcher: {}, sortable: true, field: 'apSN', title: 'ap序列号' },
                { searcher: {}, sortable: true, field: 'data', title: '内存使用率' }
            ],
            data: dataEg[0],
        }, oTablePub);

        memoryEchart.on('click', function (params) {
            $scope.eventData.time = params.name;
            $scope.eventData.process('memoryMid', 'memoryPie', 'memoryTid')
            return;
        });

        //接入终端数
        $scope.clientNumModal = $.extend(true, {}, {
            mId: 'clientNumMid',
            title: '接入AP终端数',
        }, oModalPub);

        $scope.clientNumTable = $.extend(true, {}, {
            tId: 'clientNumTid',
            columns: [
                {
                    searcher: {}, sortable: true, field: 'apName', title: 'AP名字',
                    formatter: function (value, row, index) {
                        return '<a class="list-link">' + value + '</a>';
                    }
                },
                { searcher: {}, sortable: true, field: 'apSN', title: 'ap序列号' },
                { searcher: {}, sortable: true, field: 'data', title: '接入终端数' }
            ],
            data: dataEg[0],
        }, oTablePub);

        clientOnApEchart.on('click', function (params) {
            $scope.eventData.time = params.name;
            $scope.eventData.process('clientNumMid', 'clientNumPie', 'clientNumTid')
            return;
        });

        //5g终端占比
        $scope.client5gModal = $.extend(true, {}, {
            mId: 'client5gMid',
            title: '5G终端占比',
        }, oModalPub);

        $scope.client5gTable = $.extend(true, {}, {
            tId: 'client5gTid',
            columns: [
                {
                    searcher: {}, sortable: true, field: 'apName', title: 'AP名字',
                    formatter: function (value, row, index) {
                        return '<a class="list-link">' + value + '</a>';
                    }
                },
                { searcher: {}, sortable: true, field: 'apSN', title: 'ap序列号' },
                { searcher: {}, sortable: true, field: 'data', title: '5g终端占比' }
            ],
            data: dataEg[0],
        }, oTablePub);

        client5gEchart.on('click', function (params) {
            $scope.eventData.time = params.name;
            $scope.eventData.process('client5gMid', 'client5gPie', 'client5gTid')
            return;
        });


    }]
})