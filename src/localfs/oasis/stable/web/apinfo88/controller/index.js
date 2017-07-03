define(['jquery', 'utils', 'echarts3', 'echartNodataPie', 'css!../css/index'], function ($, Utils, echarts) {
    return ['$scope', '$http', '$filter', '$state', '$stateParams', function ($scope, $http, $filter, $state, $stateParams) {

        var URL_GET_DROPLINE_TRENDS = "/v3/apmonitor/getapdowncountbytime?devSN=%s&dateType=%s";
        var URL_GET_DROPLINE_TIME = "/v3/apmonitor/getAPCountByDownNumber?devSN=%s&dateType=%s";
        var URL_GET_DROPLINE_TIME_TOP20 = "/v3/apmonitor/getTop20ApDownCount?devSN=%s&dateType=%s";
        var URL_GET_DROPLINE_TIME_TABLE_APINFO = "/v3/apmonitor/getAPInfoByDownNumber?devSN=%s&dateType=%s&apDownRate=%s";
        var URL_POST_AP_LOAD = "/v3/stamonitor/clientloadonap";
        var URL_GET_AP_HUFF_PUFF = "/v3/apmonitor/getapcountbytotalflowarea?devSN=%s";
        var URL_GET_AP_HUFF_PUFF_TABLE_INFO = "/v3/apmonitor/getapinfobytotalflowarea?devSN=%s&mark=%s";
        var URL_GET_AP_HUFF_PUFF_TOP20 = "/v3/apmonitor/gettop20apcountbytotalflow?devSN=%s";
        var URL_GET_AP_DROPLINE_REASON = "/v3/apmonitor/getAPCountbyDownReason?devSN=%s";
        var URL_GET_AP_DROPLINE_REASON_INFO = "/v3/apmonitor/getAPInfoByDownReason";
        var URL_GET_AP_ONLINE_DURATION = "/v3/apmonitor/getapcountbyonlineduration?devSN=%s";
        var URL_GET_AP_ONLINE_DURATION_INFO = "/v3/apmonitor/getapinfobyonlineduration?devSN=%s&mark=%s";
        var URL_GET_AP_ONLINE_DURATION_TOP20 = "/v3/apmonitor/gettop20apcountbyonlinetime?devSN=%s";
        // var URL_POST_AP_CHANNEL = "/v3/rrmserver"
        var URL_GET_AP_CHANNEL = "/v3/apmonitor/getChlBusyRateDistStat?devSN=%s"


        var AP_dropLine_trends_Echart = echarts.init(document.getElementById('AP_dropLine_trends'));
        var AP_dropLine_time_Echart = echarts.init(document.getElementById('AP_dropLine_time'));
        var apLoadEchart = echarts.init(document.getElementById('ap_load'));
        var apHuffPuffEchart = echarts.init(document.getElementById('apHuffPuff'));
        var apDownReasonEchart = echarts.init(document.getElementById('apDown_Reason'));
        var apOnlineTimeEchart = echarts.init(document.getElementById('apOnline_time'));
        var ap24GApplyEchart = echarts.init(document.getElementById('ap2.4GApply'));
        var ap5GApplyEchart = echarts.init(document.getElementById('ap5GApply'));

        function getRcString(attrName) {
            return Utils.getRcString("apinfo88_rc", attrName);
        }

        window.onresize = function () {
            AP_dropLine_trends_Echart.resize();
            AP_dropLine_time_Echart.resize();
            apLoadEchart.resize();
            apHuffPuffEchart.resize();
            apDownReasonEchart.resize();
            apOnlineTimeEchart.resize();
            ap24GApplyEchart.resize();
            ap5GApplyEchart.resize()
        };

        function setTimeCycleOfApDropLine(isDay, isWeek, isMonth) {
            $scope.isFlowDayActived = isDay;
            $scope.isFlowWeekActived = isWeek;
            $scope.isFlowMounthActived = isMonth;
        }
        function setTimeCycleOfApOfflinePie(isDay, isWeek, isMonth) {
            $scope.isDropLineTimeDayActived = isDay;
            $scope.isDropLineTimeWeekActived = isWeek;
            $scope.isDropLineTimeMonthActived = isMonth;
        }
        /**
         * AP_dropLine_trends  start
         */
        var dropLineTrendsOption = {
            color: ['#71cdc2'],
            tooltip: {
                show: true,
                trigger: 'axis',
                triggerOn: 'mousemove',
                formatter: function (params) {
                    params = params && params.length > 0 && params[0];
                    var date = new Date(params.value.length > 0 && params.value[0]);
                    var time = Utils.transformTimeStr('hh:mm', date)
                    return time + '<br/>' + '不在线AP数 : ' + params.value[1];
                }
            },
            grid: {
                left: '20',
                right: '20',
                top: '30',
                bottom: '10',
                containLabel: true,
                borderWidth: 0,
            },
            xAxis: {
                type: 'time',
                splitLine: {
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
                    formatter: function(value, index){
                        var date = new Date(value);
                        // var texts = [(date.getHours()), date.getMinutes];
                        var time = Utils.transformTimeStr('hh:mm', date);
                        return time;
                    },
                },
                axisTick: {
                    length: '2',
                },

            },
            yAxis: {
                name: "AP" + getRcString("apNumUint"),
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
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
                    }
                },
                axisTick: {
                    length: '2',
                },
                splitNumber: 4,
                minInterval: 1,
            },
            series: [
                {
                    // name: '掉线个数',
                    type: 'line',
                    symbol: 'roundRect',
                    symbolSize: 0,
                    showSymbol: false,
                    hoverAnimation: false,
                    smooth: true,
                    areaStyle: {
                        normal: {}
                    },
                    data: []
                }]
        };
        function refreshFlowTrendData(flag) {
            var sUrl = sprintf(URL_GET_DROPLINE_TRENDS, $stateParams.sn, flag);

            $http.get(sUrl).success(function (data) {
                if (!data.apDownCurrent) {
                    return;
                }
                var apOfflineData = [];
                $.each(data.apDownCurrent, function (i, v) {
                    apOfflineData.push([new Date(v.time), v.apnums]);
                });
                dropLineTrendsOption.xAxis.splitNumber = (apOfflineData.length) / 2;
                dropLineTrendsOption.series[0].data = apOfflineData;
                AP_dropLine_trends_Echart.setOption(dropLineTrendsOption);
            })
        }

        $scope.changeFlowPeriod = function (e, flag) {

            switch (flag) {
                case 1: {
                    dropLineTrendsOption.tooltip.formatter = function (params) {
                        params = params && params.length > 0 && params[0];
                        var date = new Date(params.value.length > 0 && params.value[0]);
                        var time = Utils.transformTimeStr('hh:mm', date)
                        return time + '<br/>' + '不在线AP数 : ' + params.value[1];
                    },
                    dropLineTrendsOption.xAxis.axisLabel.formatter = function(value, index){
                        var date = new Date(value);
                        // var texts = [(date.getHours()), date.getMinutes];
                        var time = Utils.transformTimeStr('hh:mm', date);
                        return time;
                    }
                    dropLineTrendsOption.xAxis.interval = 2 * 60 * 60 * 1000;//默认x轴刻度间隔（h）。type:'time' 毫 
                    setTimeCycleOfApDropLine(true, false, false);
                    break;
                }
                case 2: {
                    dropLineTrendsOption.tooltip.formatter = function (params) {
                        params = params && params.length > 0 && params[0];
                        var date = new Date(params.value.length > 0 && params.value[0]);
                        var time = Utils.transformTimeStr('yyyy-mm-dd', date)
                        return time + '<br/>' + '不在线AP数 : ' + params.value[1];          
                    },
                    dropLineTrendsOption.xAxis.axisLabel.formatter = function(value, index){
                        var date = new Date(value);
                        // var texts = [(date.getHours()), date.getMinutes];
                        var time = Utils.transformTimeStr('mm-dd', date);
                        return time;
                    }
                    dropLineTrendsOption.xAxis.interval = 24 * 60 * 60 * 1000;//默认x轴刻度间隔（h）。type:'time' 毫秒
                    setTimeCycleOfApDropLine(false, true, false);
                    break;
                }
                case 3: {
                    dropLineTrendsOption.tooltip.formatter = function (params) {
                        params = params && params.length > 0 && params[0];
                        var date = new Date(params.value.length > 0 && params.value[0]);
                        var time = Utils.transformTimeStr('yyyy-mm-dd', date)
                        return time + '<br/>' + '不在线AP数 : ' + params.value[1];
                    },
                    dropLineTrendsOption.xAxis.axisLabel.formatter = function(value, index){
                        var date = new Date(value);
                        // var texts = [(date.getHours()), date.getMinutes];
                        var time = Utils.transformTimeStr('mm-dd', date);
                        return time;
                    }
                    dropLineTrendsOption.xAxis.interval = 3 * 24 * 60 * 60 * 1000;//默认x轴刻度间隔（h）。type:'time' 毫
                    setTimeCycleOfApDropLine(false, false, true);
                    break;
                }
                default: {
                    dropLineTrendsOption.tooltip.formatter = function (params) {
                        params = params && params.length > 0 && params[0];
                        var date = new Date(params.value.length > 0 && params.value[0]);
                        var time = Utils.transformTimeStr('hh:mm', date)
                        return time + '<br/>' + '不在线AP数 : ' + params.value[1];
                    },
                        dropLineTrendsOption.xAxis.interval = 2 * 60 * 60 * 1000;//默认x轴刻度间隔（h）。type:'time' 毫 
                    setTimeCycleOfApDropLine(true, false, false);
                    break;
                }
            }
            refreshFlowTrendData(flag);
        };

        setTimeCycleOfApDropLine(true, false, false);
        refreshFlowTrendData(1);

        $scope.dropline_time_modal_apInfo = {
            mId: 'dropline_time_modal_apInfo', //dropline_time_modal_apInfo
            title: getRcString('apDownTableTitle'),
            autoClose: true,
            showCancel: false,
            showOk: false,
            modalSize: 'lg',
            showHeader: true,
            showFooter: false,
            showClose: true
        };

        var apDownTitle = getRcString("apDownTable").split(",");
        $scope.dropline_time_table_apInfo = {
            tId: 'dropline_time_table', //  dropline_time_table_apInfo
            method: "get",
            contentType: 'application/json',
            dataType: 'json',
            pageSize: 5,
            pageList: [5, 10, 15],
            searchable: true,
            dataField: 'data',
            totalField: 'totalCount',
            columns: [
                { searcher: {}, sortable: true, field: 'apName', title: apDownTitle[0] },
                { searcher: {}, sortable: true, field: 'apSN', title: apDownTitle[1] },
                { searcher: {}, sortable: true, field: 'apdownNums', title: apDownTitle[2] }
            ]
        };

        AP_dropLine_time_Echart.on('click', function (params) {
            $scope.$broadcast('show#dropline_time_modal_apInfo');
            $scope.$broadcast('hideSearcher#dropline_time_table_apInfo', false);

            var pieFlag = 1;

            switch (params.name) {
                case '0-5': {
                    pieFlag = 1;
                    break;
                }
                case '6-10': {
                    pieFlag = 2;
                    break;
                }
                case '>10': {
                    pieFlag = 3;
                    break;
                }
                default: {
                    pieFlag = 1;
                    break;
                }
            }

            var APInfo_Url = sprintf(URL_GET_DROPLINE_TIME_TABLE_APINFO, $stateParams.sn, g_dropline_time, pieFlag);

            $http.get(APInfo_Url).success(function (data) {
                if (!data.apDownlist) {
                    return;
                }
                $scope.$broadcast("load#dropline_time_table", data.apDownlist);
            });
        });

        var nodataEchartsoption = {
            color: ['#e7e7e9', '#e7e7e9'],
            tooltip: {
                trigger: 'item',
                formatter: "{b}({d}%) : {c} "
            },
            series: [
                {
                    type: 'pie',
                    center: ['50%', '43%'],
                    radius: ['42%', '70%'],
                    hoverAnimation: false,
                    avoidLabelOverlap: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            formatter: '{b}'
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#fff',
                            borderWidth: 1,
                            borderType: 'solid',

                        }
                    },
                    data: [{ name: 'N/A', value: 0 }]
                }
            ]
        };

        var g_dropline_time = 0;
        var apDownPieName = getRcString('apDownPieName').split(',');
        var dropLineTimeOption = {
            color: ['#78cec3', '#f2bc98', '#fe808b'],
            tooltip: {
                trigger: 'item',
                formatter: "掉线{b}的AP({d}%)<br/>AP数目 : {c}",
                position: ['50%', '50%']
            },
            legend: {
                orient: 'horizontal',
                top: '82%',
                // bottom:'10%',
                // left: 'middle',
                itemWidth: 20,
                itemHeight: 12,
                textStyle: {
                    color: '#617085',
                    fontSize: 12,
                },
                data: [{ name: apDownPieName[0], icon: 'pin' }, { name: apDownPieName[1], icon: 'pin' }, { name: apDownPieName[2], icon: 'pin' }]
            },
            series: [
                {
                    name: getRcString('apDownPie'),
                    type: 'pie',
                    center: ['50%', '43%'],
                    radius: ['42%', '70%'],
                    hoverAnimation: false,
                    avoidLabelOverlap: true,
                    minAngle: 3,
                    legend: {
                        show: true,
                        bottom: 10,
                        data: [apDownPieName[0], apDownPieName[1], apDownPieName[2]]
                    },
                    label: {
                        normal: {
                            show: false,
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
                    data: []
                }
            ]
        };

        function refresh_AP_dropLine_time_Echart(flag) {
            var sUrl = sprintf(URL_GET_DROPLINE_TIME, $stateParams.sn, flag);
            g_dropline_time = flag;

            $http.get(sUrl).success(function (data) {
                if ((!data) || (!data.apDownNumber)) {
                    return;
                }
                var aResult = data.apDownNumber;
                if ((aResult[0].APDownNumber === 0) && (aResult[1].APDownNumber === 0) && (aResult[2].APDownNumber === 0)) {
                    AP_dropLine_time_Echart.setOption(nodataEchartsoption)
                } else {
                    dropLineTimeOption.series[0].data = [
                        { value: aResult[0].APDownNumber, name: apDownPieName[0] },
                        { value: aResult[1].APDownNumber, name: apDownPieName[1] },
                        { value: aResult[2].APDownNumber, name: apDownPieName[2] }
                    ];
                    AP_dropLine_time_Echart.setOption(dropLineTimeOption);
                }

            }).error(function (data, header, config, status) {
                AP_dropLine_time_Echart.setOption(nodataEchartsoption);
            });
        }

        function refresh_AP_dropLine_time_Top20(flag) {
            var sUrl = sprintf(URL_GET_DROPLINE_TIME_TOP20, $stateParams.sn, flag);
            $http.get(sUrl).success(function (data) {
                if (data.apDownlist) {
                    $scope.topList_dropline_time = [];
                    $scope.apdownNumsPrograss = [];
                    var classList = ['top-one', 'top-two', 'top-three', 'top-four', 'top-five'];
                    $.each(data.apDownlist, function (i, v) {
                        if (i < 5) {
                            v.color = classList[i];
                            $scope.apdownNumsPrograss.push((v.apdownNums / data.apDownlist[0].apdownNums).toFixed(4) * 100 + '%');
                            v.valuePercent = $scope.apdownNumsPrograss[i];
                            $scope.topList_dropline_time.push(v);
                        }
                    });
                }
            })
        }

        setTimeCycleOfApOfflinePie(true, false, false);
        refresh_AP_dropLine_time_Echart(1);
        refresh_AP_dropLine_time_Top20(1);

        $scope.changeDropLineTimePeriod = function (e, flag) {

            switch (flag) {
                case 1: {
                    setTimeCycleOfApOfflinePie(true, false, false);
                    break;
                }
                case 2: {
                    setTimeCycleOfApOfflinePie(false, true, false);
                    break;
                }
                case 3: {
                    setTimeCycleOfApOfflinePie(false, false, true);
                    break;
                }
                default: {
                    setTimeCycleOfApOfflinePie(true, false, false);
                    break;
                }
            }

            refresh_AP_dropLine_time_Echart(flag);
            refresh_AP_dropLine_time_Top20(flag);
        };

        var apLoadPieName = getRcString('apLoadPieName').split(',');
        var apLoadOption = {
            color: ['#78cec3', '#f2bc98', '#fe808b'],
            tooltip: {
                trigger: 'item',
                formatter: "{b}负载AP({d}%)<br/>AP数目 : {c}",
                position: ['50%', '50%']
            },
            legend: {
                orient: 'horizontal',
                top: '82%',
                // bottom:'10%',
                // left: 'middle',
                itemWidth: 20,
                itemHeight: 12,
                textStyle: {
                    color: '#617085',
                    fontSize: 12,
                },
                data: [{ name: '低', icon: 'pin' }, { name: '中', icon: 'pin' }, { name: '高', icon: 'pin' }]
            },
            series: [
                {
                    name: getRcString('apLoadPie'),
                    type: 'pie',
                    center: ['50%', '43%'],
                    radius: ['42%', '70%'],
                    hoverAnimation: false,
                    avoidLabelOverlap: true,
                    minAngle: 3,
                    label: {
                        normal: {
                            show: false,
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
                        }
                    },
                    data: []
                }
            ]
        };

        var param_load = {
            "method": "clientLoadOnApDistribuStat",
            "param": {
                "scenarioid": $scope.sceneInfo.nasid
            }
        };
        $http.post(URL_POST_AP_LOAD, JSON.stringify(param_load)).success(function (data) {
            if ((!data) || (!data.clientloadonap) || (!data.clientloadonap.data)) {
                apLoadEchart.setOption(nodataEchartsoption);
                return;
            }
            var oResult = data.clientloadonap.data;
            if ((oResult.low == 0) && (oResult.normal == 0) && (oResult.heavy == 0)) {
                apLoadEchart.setOption(nodataEchartsoption);
            } else {
                apLoadOption.series[0].data = [
                    { value: data.clientloadonap.data.low, name: apLoadPieName[0] },
                    { value: data.clientloadonap.data.normal, name: apLoadPieName[1] },
                    { value: data.clientloadonap.data.heavy, name: apLoadPieName[2] }
                ];
                apLoadEchart.setOption(apLoadOption);
            }

        }).error(function (data, header, config, status) {
            apLoadEchart.setOption(nodataEchartsoption);
        });
        var param_load_Top20 = {
            "method": "clientLoadOnHeavyApTop20",
            "param": {
                "scenarioid": $scope.sceneInfo.nasid
            }
        };
        $http.post(URL_POST_AP_LOAD, JSON.stringify(param_load_Top20)).success(function (data) {
            if ((!data) || (!data.clientloadonap)) {
                return;
            }
            $scope.topList_AP_load = [];
            $scope.load = [];
            var classList = ['top-one', 'top-two', 'top-three', 'top-four', 'top-five'];
            $.each(data.clientloadonap.data, function (i, v) {
                if (i < 5) {
                    v.color = classList[i];
                    $scope.load.push((v.loadRate / data.clientloadonap.data[0].loadRate).toFixed(4) * 100 + '%');
                    v.valuePercent = $scope.load[i];
                    $scope.topList_AP_load.push(v);
                }
            });
        });
        $scope.load_modal_apinfo = {
            mId: 'load_modal_apinfo',
            title: getRcString('apLoadTableTitle'),
            autoClose: true,
            showCancel: false,
            showOk: false,
            modalSize: 'lg',
            showHeader: true,
            showFooter: false,
            showClose: true
        };
        var apLoadTable = getRcString('apLoadTable').split(',')
        $scope.load_table_apInfo = {
            tId: "load_table_apInfo",
            method: "get",
            contentType: 'application/json',
            dataType: 'json',
            pageSize: 5,
            pageList: [5, 10, 15],
            searchable: true,
            dataField: 'data',
            totalField: 'totalCount',
            columns: [
                { searcher: {}, sortable: true, field: 'apName', title: apLoadTable[0] },
                { searcher: {}, sortable: true, field: 'apSN', title: apLoadTable[1] },
                {
                    searcher: {},
                    sortable: true,
                    field: 'loadRate',
                    title: apLoadTable[2],
                    formatter: function (val, row, index) {
                        if (row.loadRate && row.loadRate != 0) {
                            return (row.loadRate * 100).toFixed(2) + '%';
                        } else {
                            return row.loadRate
                        }
                    }
                }
            ]
        };

        apLoadEchart.on('click', function (params) {
            $scope.$broadcast('show#load_modal_apinfo');
            $scope.$broadcast('hideSearcher#load_table_apInfo', false);

            var apLoadType = "low";

            switch (params.name) {
                case apLoadPieName[0]: {
                    apLoadType = "low";
                    break;
                }
                case apLoadPieName[1]: {
                    apLoadType = "normal";
                    break;
                }
                case apLoadPieName[2]: {
                    apLoadType = "heavy";
                    break;
                }
                default: {
                    apLoadType = "low";
                    break;
                }
            }
            var apInfo_param = {
                "method": "clientLoadOnApDetail",
                "param": {
                    "scenarioid": $scope.sceneInfo.nasid,
                    "type": apLoadType
                }
            };
            $http.post(URL_POST_AP_LOAD, JSON.stringify(apInfo_param)).success(function (data) {
                $scope.$broadcast("load#load_table_apInfo", data.clientloadonap.data)
            });
        });

        /**
         * AP_huffPuff  start
         */
        var apRadioHuffPieTable = getRcString('apRadioHuffPieTable').split(',');
        var apRadioHuffPieName = getRcString('apRadioHuffPieName').split(',');
        var apHuffPuffOption = {
            color: ['#78cec3', '#f2bc98', '#fe808b'],
            tooltip: {
                trigger: 'item',
                formatter: "吞吐率 : {b}({d}%)<br/>AP数目 : {c} ",
                confine: true,
                position: ['50%', '50%']
            },
            legend: {
                orient: 'horizontal',
                top: '82%',
                // bottom:10,
                // left: 'middle',
                itemWidth: 20,
                itemHeight: 12,
                textStyle: {
                    color: '#617085',
                    fontSize: 12,
                },
                data: [{ name: apRadioHuffPieName[0], icon: 'pin' },
                { name: apRadioHuffPieName[1], icon: 'pin' },
                { name: apRadioHuffPieName[2], icon: 'pin' }]
            },
            series: [
                {
                    name: getRcString('apRadioHuffPie'),
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
                    data: []
                }
            ]
        };
        $scope.huff_puff_modal_apInfo = {
            mId: 'huff_puff_modal_apInfo', //AP_HUFF_PUFF
            title: getRcString('apRadioHuffPieTableTitle'),
            autoClose: true,
            showCancel: false,
            showOk: false,
            modalSize: 'lg',
            showHeader: true,
            showFooter: false,
            showClose: true
        };
        $scope.huff_puff_table_apInfo = {
            tId: 'huff_puff_table',
            method: "get",
            contentType: 'application/json',
            dataType: 'json',
            pageSize: 5,
            pageList: [5, 10, 15],
            searchable: true,
            dataField: 'data',
            totalField: 'totalCount',
            columns: [
                { searcher: {}, sortable: true, field: 'apName', title: apRadioHuffPieTable[0] },
                { searcher: {}, sortable: true, field: 'apSN', title: apRadioHuffPieTable[1] },
                {
                    searcher: {},
                    sortable: true,
                    field: 'throughputRate',
                    title: apRadioHuffPieTable[2],
                    formatter: function (val, row, index) {
                        if (row.throughputRate) {
                            return row.throughputRate.toFixed(2);
                        }
                    }
                }
            ]
        };

        apHuffPuffEchart.on('click', function (params) {
            $scope.$broadcast('show#huff_puff_modal_apInfo');
            $scope.$broadcast('hideSearcher#huff_puff_table', false);

            var optionType = 1;
            switch (params.name) {
                case apRadioHuffPieName[0]: {
                    optionType = 1;
                    break;
                }
                case apRadioHuffPieName[1]: {
                    optionType = 2;
                    break;
                }
                case apRadioHuffPieName[2]: {
                    optionType = 3;
                    break;
                }
                default: {
                    optionType = 1;
                    break;
                }
            }
            var huff_puff_url = sprintf(URL_GET_AP_HUFF_PUFF_TABLE_INFO, $stateParams.sn, optionType);
            $http.get(huff_puff_url).success(function (data) {
                $scope.$broadcast("load#huff_puff_table", data.apList);
            });
        });

        var sUrl = sprintf(URL_GET_AP_HUFF_PUFF, $stateParams.sn);
        $http.get(sUrl).success(function (data) {
            if ((!data) || (!data.ApCount)) {
                apHuffPuffEchart.setOption(nodataEchartsoption);
                return;
            }
            var aResult = data.ApCount;
            if ((aResult[0].count == 0) && (aResult[1].count == 0) && (aResult[2].count == 0)) {
                apHuffPuffEchart.setOption(nodataEchartsoption);
            } else {
                apHuffPuffOption.series[0].data = [
                    { value: aResult[0].count, name: apRadioHuffPieName[0] },
                    { value: aResult[1].count, name: apRadioHuffPieName[1] },
                    { value: aResult[2].count, name: apRadioHuffPieName[2] }
                ]
                apHuffPuffEchart.setOption(apHuffPuffOption);
            }

        }).error(function (data, header, config, status) {
            apHuffPuffEchart.setOption(nodataEchartsoption);
        });
        function top20HuffInfo() {
            var top20Huff = sprintf(URL_GET_AP_HUFF_PUFF_TOP20, $stateParams.sn);
            $http.get(top20Huff).success(function (data) {
                $scope.topList_AP_HUFF_PUFF = [];
                $scope.throughputRate = [];
                var classList = ['top-one', 'top-two', 'top-three', 'top-four', 'top-five'];
                $.each(data.Aplist, function (i, v) {
                    if (i < 5) {
                        v.color = classList[i];
                        $scope.throughputRate.push((v.throughputRate / data.Aplist[0].throughputRate).toFixed(4) * 100 + '%');
                        v.valuePercent = $scope.throughputRate[i];
                        $scope.topList_AP_HUFF_PUFF.push(v);
                    }
                });
            });
        }

        top20HuffInfo();

        /* AP_DROPLINE_REASON start*/

        $scope.dropline_reason_modal_apInfo = {
            mId: 'dropline_reason_modal_apInfo',
            title: getRcString('apDownReasonTableTitle'),
            autoClose: true,
            showCancel: false,
            showOk: false,
            modalSize: 'lg',
            showHeader: true,
            showFooter: false,
            showClose: true
        };
        var apDownTable = getRcString('apDownReasonTable').split(',');
        $scope.dropline_reason_table_apInfo = {
            tId: 'dropline_reason_table',
            method: "get",
            contentType: 'application/json',
            dataType: 'json',
            pageSize: 5,
            pageList: [5, 10, 15],
            searchable: true,
            dataField: 'data',
            totalField: 'totalCount',
            columns: [
                { searcher: {}, sortable: true, field: 'apName', title: apDownTable[0] },
                { searcher: {}, sortable: true, field: 'apSN', title: apDownTable[1] },
                { searcher: {}, sortable: true, field: 'apModel', title: apDownTable[2] },
                { searcher: {}, sortable: true, field: 'apDownReason', title: apDownTable[3] }
            ]
        };

        var apOfflineReson = getRcString('apDownReasonPieName').split(',');
        var apDroplineReason = {
            // color: ['#edf1f4'],
            color: ['#4ec1b2', '#78cec3', '#f2bc98', '#fbceb1', '#fe808b'],
            tooltip: {
                trigger: 'item',
                formatter: "{b}({d}%)<br/>AP数目 : {c} "
            },
            legend: {
                show: false

            },
            series: [
                {
                    name: getRcString('apDownReasonPie'),
                    type: 'pie',
                    center: ['50%', '43%'],
                    radius: ['42%', '70%'],
                    hoverAnimation: false,
                    avoidLabelOverlap: true,
                    minAngle: 3,
                    label: {
                        normal: {
                            show: false,
                            // show: true,
                            position: 'outside',
                            formatter: '{b}'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length: 8,
                            length2: 10,
                            smooth: true
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
                        { value: 0, name: apOfflineReson[0] },
                        { value: 0, name: apOfflineReson[1] },
                        { value: 0, name: apOfflineReson[2] },
                        { value: 0, name: apOfflineReson[3] },
                        { value: 0, name: apOfflineReson[4] }
                    ]
                }
            ]
        };
        var AP_dropline_reason_url = sprintf(URL_GET_AP_DROPLINE_REASON, $stateParams.sn);
        var dropline_reason_data = [];
        $http.get(AP_dropline_reason_url).success(function (data) {
            if ((!data) || (!data.apDownReasonNumber)) {
                apDownReasonEchart.setOption(nodataEchartsoption);
                return;
            }
            var aresult = data.apDownReasonNumber;
            var downAPTotalNum = 0;
            $.each(aresult, function (i, v) {
                dropline_reason_data.push({ value: v.apdownNums, name: v.apDownReason });
                downAPTotalNum += v.apdownNums;
            });

            if (0 === downAPTotalNum) {
                apDownReasonEchart.setOption(nodataEchartsoption);
            } else {
                apDroplineReason.series[0].data = dropline_reason_data;
                // apDroplineReason.series[0].data = [
                //     { value: 1, name: apOfflineReson[0] },
                //     { value: 2, name: apOfflineReson[1] },
                //     { value: 3, name: apOfflineReson[2] },
                //     { value: 4, name: apOfflineReson[3] },
                //     { value: 5, name: apOfflineReson[4] }
                // ];
                apDownReasonEchart.setOption(apDroplineReason);
            }
        }).error(function (data, header, config, status) {
            apDownReasonEchart.setOption(nodataEchartsoption);
        });

        apDownReasonEchart.on('click', function (params) {
            $scope.$broadcast('show#dropline_reason_modal_apInfo');
            $scope.$broadcast('hideSearcher#dropline_reason_table', false);

            dropline_reason_info_params = {
                devSN: $stateParams.sn,
                apDownReason: params.name
            };
            $http.post(URL_GET_AP_DROPLINE_REASON_INFO, JSON.stringify(dropline_reason_info_params)).success(function (data) {
                if (data.apDownlist) {
                    $scope.$broadcast("load#dropline_reason_table", data.apDownlist)
                }
            });
        });
        /**
         *  AP_DROPLINE_REASON end
         */
        /**
         *  AP_online_duration start
         */
        $scope.online_duration_modal_apInfo = {
            mId: 'online_duration_modal_apInfo', //DROPLINE_REASON
            title: getRcString('apOnlineTimeTableTitle'),
            autoClose: true,
            showCancel: false,
            showOk: false,
            modalSize: 'lg',
            showHeader: true,
            showFooter: false,
            showClose: true
        };
        var apOnlineTimeTable = getRcString('apOnlineTimeTable').split(',');
        $scope.online_duration_table_apInfo = {
            tId: 'online_duration_table',
            method: "get",
            contentType: 'application/json',
            dataType: 'json',
            pageSize: 5,
            pageList: [5, 10, 15],
            searchable: true,
            dataField: 'data',
            totalField: 'totalCount',
            columns: [
                { searcher: {}, sortable: true, field: 'apName', title: apOnlineTimeTable[0] },
                { searcher: {}, sortable: true, field: 'apSN', title: apOnlineTimeTable[1] },
                {
                    searcher: {},
                    sortable: true,
                    field: 'onlineTime',
                    title: apOnlineTimeTable[2],
                    formatter: function (val, row, index) {
                        if (row.onlineTime) {
                            return (row.onlineTime / 86400).toFixed(2);
                        }
                    }
                }
            ]
        };
        var apOnlineTime = getRcString('apOnlineTimeName').split(',');
        var apOnlineCycle = getRcString('apOnlineTimeName').split(',');
        var onlineDurationOption = {
            color: ['#4ec1b2', '#78cec3', '#f2bc98', '#fbceb1', '#fe808b', '#ff9c9e'],
            tooltip: {
                trigger: 'item',
                formatter: "在线时长 : {b}({d}%)<br/> AP数目: {c}",
                position: ['50%', '50%']
            },
            legend: {
                orient: 'horizontal',
                top: '82%',
                // bottom:10,
                // left: 'middle',
                itemWidth: 20,
                itemHeight: 12,
                textStyle: {
                    color: '#617085',
                    fontSize: 12,
                },
                data: [
                    { name: apOnlineCycle[0], icon: 'pin' },
                    { name: apOnlineCycle[1], icon: 'pin' },
                    { name: apOnlineCycle[2], icon: 'pin' },
                    { name: ''},
                    { name: apOnlineCycle[3], icon: 'pin' },
                    { name: apOnlineCycle[4], icon: 'pin' },
                    { name: apOnlineCycle[5], icon: 'pin' }
                ]
            },
            series: [
                {
                    name: getRcString('apOnlineTimePie'),
                    type: 'pie',
                    center: ['50%', '43%'],
                    radius: ['42%', '70%'],
                    hoverAnimation: false,
                    avoidLabelOverlap: true,
                    minAngle: 3,
                    label: {
                        normal: {
                            show: false,
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

        apOnlineTimeEchart.on('click', function (params) {
            $scope.$broadcast('show#online_duration_modal_apInfo');
            $scope.$broadcast('hideSearcher#online_duration_table', false);

            var optionType = 1;

            for (i = 0; i < apOnlineTime.length; i++) {
                if (apOnlineTime[i] === params.name) {
                    optionType = i + 1;
                    break;
                }
            }
            var url = sprintf(URL_GET_AP_ONLINE_DURATION_INFO, $stateParams.sn, optionType);
            $http.get(url).success(function (data) {
                if ((!data) || (!data.ApList)) {
                    return;
                }
                $scope.$broadcast("load#online_duration_table", data.ApList);
            })

        });
        var online_duration_url = sprintf(URL_GET_AP_ONLINE_DURATION, $stateParams.sn);
        $http.get(online_duration_url).success(function (data) {
            if ((!data) || (!data.ApCount)) {
                apOnlineTimeEchart.setOption(nodataEchartsoption);
                return;
            }
            var aResult = data.ApCount;
            var apCount = 0;

            if ((aResult.OneHour_APCount == 0) && (aResult.OneDay_APCount == 0) && (aResult.OneWeek_APCount == 0) && (aResult.OneMonth_APCount == 0) && (aResult.OneYear_APCount == 0)
                && (aResult.GtOneYear_APCount == 0)) {
                apOnlineTimeEchart.setOption(nodataEchartsoption);
            } else {
                onlineDurationOption.series[0].data = [
                    { value: aResult.OneHour_APCount, name: apOnlineCycle[0] },
                    { value: aResult.OneDay_APCount, name: apOnlineCycle[1] },
                    { value: aResult.OneWeek_APCount, name: apOnlineCycle[2] },
                    { value: aResult.OneMonth_APCount, name: apOnlineCycle[3] },
                    { value: aResult.OneYear_APCount, name: apOnlineCycle[4] },
                    { value: aResult.GtOneYear_APCount, name: apOnlineCycle[5] }
                ];
                apOnlineTimeEchart.setOption(onlineDurationOption);
            }
        }).error(function (data, header, config, status) {
            apOnlineTimeEchart.setOption(nodataEchartsoption);
        });
        function top20OnlineDuration() {
            var online_duration_top20_url = sprintf(URL_GET_AP_ONLINE_DURATION_TOP20, $stateParams.sn);
            $http.get(online_duration_top20_url).success(function (data) {
                $scope.topList_online_duration = [];
                $scope.onlineTime = [];
                var classList = ['top-one', 'top-two', 'top-three', 'top-four', 'top-five'];
                $.each(data.ApList, function (i, v) {
                    if (i < 5) {
                        v.color = classList[i];
                        $scope.onlineTime.push((v.onlineTime / data.ApList[0].onlineTime).toFixed(4) * 100 + '%');
                        v.valuePercent = $scope.onlineTime[i];
                        $scope.topList_online_duration.push(v);
                    }
                });
            });
        };
        top20OnlineDuration();


        /**
         *  AP_online_duration end
         */
        /**
         * AP_channel start
         */
        $scope.changeAPchannelPeriod = function (e, flag) {
            refreshAPchannelData(flag);
        };

        // var g_channel_time;
        var ap24GChannelOption = {
            color: ['#fe808b', '#f2bc98', '#78cec3'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                // formatter: function (params) {
                //     var sTps = '信道 : ' + params[0].name + '<br/>' +
                //         params[0].seriesName + 'AP数 : ' + params[0].value + '<br/>' +
                //         params[1].seriesName + 'AP数 : ' + params[1].value + '<br/>' +
                //         params[2].seriesName + 'AP数 : ' + params[2].value + '<br/>';
                //     return sTps;
                // }
            },
            legend: {
                data: ['堵塞', '繁忙', '良好'],
                right: 0,
                itemWidth: 20,
                itemHeight: 12,
                textStyle: {
                    color: '#617085',
                    fontSize: 12,
                },
            },
            grid: {
                left: 40,
                right: 10,
                bottom: 25,
                top: 50,
                containLabel: true
            },
            yAxis: {
                type: 'value',
                name: 'AP个数',
                minInterval: 1,
                axisTick: {
                    length: '2',
                },
                splitLine: {
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
                    }
                }
            },
            xAxis: {
                type: 'category',
                splitLine: {
                    show: false
                },
                axisTick: {
                    length: '2',
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
                    }
                },
                data: []
            },
            series: [
                {
                    name: '堵塞',
                    type: 'bar',
                    stack: '2.4G',
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 2
                        }
                    },
                    barMaxWidth: '20',
                    data: []
                },
                {
                    name: '繁忙',
                    type: 'bar',
                    stack: '2.4G',
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 2
                        }
                    },
                    barMaxWidth: '20',
                    data: []
                },
                {
                    name: '良好',
                    type: 'bar',
                    stack: '2.4G',
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 2
                        }
                    },
                    barMaxWidth:'20',
                    data: []
                }
            ]
        };
        var ap5GChannelOption = {
            color: ['#fe808b', '#f2bc98', '#78cec3'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                // formatter: function (params) {
                //     var sTps = '信道 : ' + params[0].name + '<br/>' +
                //         params[0].seriesName + 'AP数 : ' + params[0].value + '<br/>' +
                //         params[1].seriesName + 'AP数 : ' + params[1].value + '<br/>' +
                //         params[2].seriesName + 'AP数 : ' + params[2].value + '<br/>';
                //     return sTps;
                // }
            },
            legend: {
                data: ['堵塞', '繁忙', '良好'],
                right: 0,
                itemWidth: 20,
                itemHeight: 12,
                textStyle: {
                    color: '#617085',
                    fontSize: 12,
                },
            },
            grid: {
                left: 40,
                right: 10,
                bottom: 25,
                top: 50,
                containLabel: true
            },
            yAxis: {
                type: 'value',
                name: 'AP个数',
                minInterval: 1,
                axisTick: {
                    length: '2',
                },
                splitLine: {
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
                    }
                },
            },
            xAxis: {
                type: 'category',
                splitLine: {
                    show: false
                },
                axisTick: {
                    length: '2',
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
                    }
                },

                data: []
            },
            series: [
                {
                    name: '堵塞',
                    type: 'bar',
                    stack: '5g',
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 2
                        }
                    },
                    barMaxWidth:'20',
                    data: []
                },
                {
                    name: '繁忙',
                    type: 'bar',
                    stack: '5g',
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 2
                        }
                    },
                    // barMinHeight:2,
                    barMaxWidth:'20',
                    data: []
                },
                {
                    name: '良好',
                    type: 'bar',
                    stack: '5g',
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            barBorderRadius: 2
                        }
                    },
                    // barMinHeight:2,
                    barMaxWidth:'20',
                    data: []
                }
            ]
        };
        ap24GApplyEchart.setOption(ap24GChannelOption);
        ap5GApplyEchart.setOption(ap5GChannelOption);
        var data_2D4G_good = [];
        var data_2D4G_normal = [];
        var data_2D4G_bad = [];
        var channel_2D4G_NUM = [];
        var data_5G_good = [];
        var data_5G_normal = [];
        var data_5G_bad = [];
        var channel_5G_NUM = [];

        $http.get(sprintf(URL_GET_AP_CHANNEL, $stateParams.sn)).success(function (data) {
            if ((!data) || (!data.ChlBusyStatList)) {
                return;
            }
            $.each(data.ChlBusyStatList.radio2D4G, function (i, v) {
                data_2D4G_good.push(v.good);
                data_2D4G_normal.push(v.normal);
                data_2D4G_bad.push(v.bad);
                channel_2D4G_NUM.push('信道' + v.Channel);
            });
            $.each(data.ChlBusyStatList.radio5G, function (i, v) {
                data_5G_good.push(v.good);
                data_5G_normal.push(v.normal);
                data_5G_bad.push(v.bad);
                channel_5G_NUM.push('信道' + v.Channel);
            });
            ap24GChannelOption.xAxis.data = channel_2D4G_NUM;
            ap24GChannelOption.series[0].data = data_2D4G_bad;
            ap24GChannelOption.series[1].data = data_2D4G_normal;
            ap24GChannelOption.series[2].data = data_2D4G_good;
            ap24GApplyEchart.setOption(ap24GChannelOption);

            ap5GChannelOption.xAxis.data = channel_5G_NUM;
            ap5GChannelOption.series[0].data = data_5G_bad;
            ap5GChannelOption.series[1].data = data_5G_normal;
            ap5GChannelOption.series[2].data = data_5G_good;
            ap5GApplyEchart.setOption(ap5GChannelOption);

        });

        /**
         * AP_channel end
         */
        $scope.linkToDetail = function (e) {
            $state.go('^.apdetail88');
        }
    }]
})