define(['jquery', 'utils', 'echarts3', 'async', 'moment','bootstrap-daterangepicker', 'css!bootstrap_daterangepicker_css'], function ($, Utils, echarts, async, moment) {
    return ['$scope', '$http', '$filter','$window','$state', '$alertService', '$stateParams', function ($scope, $http, $filter,$window,$state, $alert, $stateParams) {
        var myChart, terminalChart, flowChart, cpuChart, memoryChart, g_date;
        var defaultAp;
        $scope.g_result = {
            aLengend: [],
            aCheck: [],
            channelResult: {
                aXdata: []
            },
            terminalResult: {
                aXdata: []
            },
            flowResult: {
                aXdata: []
            }
        }

        $scope.Options = {
            sId :"bbb"
        }

        var aColor = ['rgba(79,193,178,.7)','rgba(242,168,152,.8)','rgba(254,128,139,.8)','rgba(179,183,221,.6)'];

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

        function getRcString(attrName) {
            return Utils.getRcString("user_rc", attrName).split(',');
        }

        $scope.apOptions={
            multiple:true
        }
        $scope.return = function(){
            $window.history.back();
        }

        $('#daterange_ap').daterangepicker({
            singleDatePicker: true,
            // startDate: moment().startOf("day"),
            // endDate: moment(),
            // maxDate: moment(),
            maxDate: new Date(),
            minDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
            dateLimit: {
                days: 1
            },
            locale: {  
                format: 'YYYY/MM/DD'  
            }, 
            'opens': 'center'
            // autoUpdateInput: false
        }, function (start, end, label) {
            start.format('YYYY/MM/DD');
        }).on('apply.daterangepicker', function (e, date) {
            g_date = date.endDate.format('YYYY/MM/DD');
            $scope.apArrSn = [];
            $scope.getAPList(g_date);
            myChart.clear();
            terminalChart.clear();
            flowChart.clear();
            cpuChart.clear();
            memoryChart.clear();
        });

        //get AP list
        $scope.getAPList = function (date) {
            $http({
                url: "/v3/apmonitor/getApListByDate",
                method: 'GET',
                params: {
                    'devSN': $scope.sceneInfo.sn,
                    "time": date
                }
            }).success(function (data) {
                if (data.apList != "") {
                    $scope.apArrSn = [];
                    $.each(data.apList, function (key, val) {
                        $scope.apArrSn.push(val.apName);
                    });
                    $scope.fisrtAp = ($stateParams.ApName != "") ? $stateParams.ApName : $scope.apArrSn[0];
                    $scope.getAllData($scope.fisrtAp, date);
                } else {
                    $alert.msgDialogError(getRcString("ERROR")[0]);
                }

            }).error(function (data, header, config, status) {

            });
        }

        window.addEventListener("resize", function () {
            myChart && myChart.resize();
            terminalChart && terminalChart.resize();
            flowChart && flowChart.resize();
            cpuChart && cpuChart.resize();
            memoryChart && memoryChart.resize();

        });

        $scope.drawChannel = function () {
            var oData = $scope.g_result.channelResult;
            myChart = echarts.init(document.getElementById('channel_rate'));
            var channelOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#80878C',
                            width: 2,
                            type: 'solid'
                        }
                    },
                    formatter: function (params) {
                        var sTips = params[0].name + "<br/>";
                        params.forEach(function (item, idx) {
                            if(item.value =='-'){
                                sTips += item.seriesName +' : '+ item.value +'<br/>'
                            }else{
                                sTips += item.seriesName + ' : ' + item.value +"%"+ "<br/>"
                            }
                            
                        });
                        return sTips;
                    }
                },
                grid: {
                    x: 60,
                    y: 5,
                    x2: 20,
                    y2: 20
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisTick: {
                            length: '2',
                            interval: 11
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
                            interval: 11
                        },
                        data: oData.aXdata
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        splitNumber: 4,
                        minInterval: 1,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#617085'
                            },
                            formatter: function (nNum) {
                                return Math.abs(nNum) + '%';
                            }
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
                        }
                    }
                ],
                series: [
                ],
                color: aColor,
                // color:['rgba(29,143,222,.2)', 'rgba(186,85,211,.2)','rgba(139,193,81,.3)']
                // color: ['#b3b7dd', '#f2bc98', '#4ec1b2']
                // color: ['rgba(179,183,221,0.6)', 'rgba(242,188,152,0.6)', 'rgba(78,913,178,0.6)']
            };
            $scope.g_result.aCheck.forEach(function (v) {
                var areaColor = aColor[0];
                switch (v) {
                    case "radio1": {
                        areaColor = aColor[0];
                        break;
                    }
                    case "radio2": {
                        areaColor = aColor[1];
                        break;
                    }
                    case "radio3": {
                        areaColor = aColor[2];
                        break;
                    }
                    default: {
                        areaColor = aColor[0];
                        console.error("Wrong Radio ID", v);
                        break;
                    }
                }
                var oTmp = {
                    name: v,
                    symbol:"none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: areaColor
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: areaColor
                        }
                    },
                    data: oData[v]
                };
                channelOption.series.push(oTmp);
            });

            myChart.setOption(channelOption);
        };

        $scope.drawTerminal = function () {
            var oData = $scope.g_result.terminalResult;
            // var colorTerminal = ['rgba(29,143,222,.2)', 'rgba(186,85,211,.2)', 'rgba(139,193,81,.3)'];
            terminalChart = echarts.init(document.getElementById('terminal_rate'));
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#80878C',
                            width: 2,
                            type: 'solid'
                        }
                    },
                    formatter: function (params) {
                        var sTips = params[0].name + "<br/>";
                        params.forEach(function (item, idx) {
                            sTips += item.seriesName + ' : ' + item.value + "<br/>"
                        });
                        return sTips;
                    }
                },
                // legend: {
                //     data:oData.aLengend
                // },
                grid: {
                    x: 60,
                    y: 5,
                    x2: 20,
                    y2: 20
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisTick: {
                            length: '2',
                            interval: 11
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
                            interval: 11
                        },
                        data: oData.aXdata
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitNumber: 4,
                        minInterval: 1,
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#617085'
                            }
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
                        }
                    }
                ],
                series: [
                ],
                color: aColor
                // color: ['#b3b7dd', '#f2bc98', '#4ec1b2']
                // color: ['rgba(179,183,221,0.6)', 'rgba(242,188,152,0.6)', 'rgba(78,913,178,0.6)']

            };
            // $scope.g_result.aCheck.forEach(function(v){
            //     var oTmp = {
            //         name:v,
            //         type:'line',
            //         smooth:true,
            //         itemStyle: {normal: {areaStyle: {type: 'default'}}},
            //         data:oData[v]
            //     };
            //     option.series.push(oTmp);
            // });
            $scope.g_result.aCheck.forEach(function (v) {
                var areaColor = aColor[0];

                switch (v) {
                    case "radio1": {
                        areaColor = aColor[0];
                        break;
                    }
                    case "radio2": {
                        areaColor = aColor[1];
                        break;
                    }
                    case "radio3": {
                        areaColor = aColor[2];
                        break;
                    }
                    default: {
                        areaColor = aColor[0];
                        console.error("Wrong Radio ID", v);
                        break;
                    }
                }
                var oTmp = {
                    name: v,
                    symbol:"none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: areaColor
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: areaColor
                        }
                    },
                    data: oData[v]
                };
                option.series.push(oTmp);
            });

            terminalChart.setOption(option);
        };

        $scope.drawFlow = function () {
            var oData = $scope.g_result.flowResult;
            // var aColor = ['rgba(29,143,222,.2)', 'rgba(186,85,211,.2)', 'rgba(139,193,81,.3)'];
            var aSeries = [];
            var aTooltip = [];
            flowChart = echarts.init(document.getElementById('flow'));

            $scope.g_result.aCheck.forEach(function (v, i) {
                // for(var k in oData[v]){
                var areaColor = aColor[0];
                switch (v) {
                    case "radio1": {
                        areaColor = aColor[0];
                        break;
                    }
                    case "radio2": {
                        areaColor = aColor[1];
                        break;
                    }
                    case "radio3": {
                        areaColor = aColor[2];
                        break;
                    }
                    default: {
                        areaColor = aColor[0];
                        console.error("Wrong Radio ID", v);
                        break;
                    }
                }

                aTooltip.push(v + '上行');
                aTooltip.push(v + '下行');
                var sLengend = v;
                var oUp = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: areaColor
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: areaColor
                        }
                    },
                    name: sLengend,
                    data: oData[v].transmit
                };
                var oDown = {
                    symbol: "none",
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: areaColor
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: areaColor
                        }
                    },
                    name: sLengend,
                    data: oData[v].receive
                };
                // option.legend.data.push(sLengend);
                aSeries.push(oUp);
                aSeries.push(oDown);
                // }

            });
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#80878C',
                            width: 2,
                            type: 'solid'
                        }
                    },
                    // position: ['', '20%'],
                    formatter: function (params) {
                        var sTips = params[0].name + "<br/>";
                        params.forEach(function (item, idx) {
                            if(item.data =="-"){
                                sTips += aTooltip[idx] + ' : ' + item.data + "<br/>"
                            }else{
                                sTips += aTooltip[idx] + ' : ' + Utils.addComma(Math.abs(item.data), "rate", 1) + "<br/>"
                            }
                            
                        });
                        return sTips;
                    }
                },
                grid: {
                    x: 90,
                    y: 5,
                    x2: 20,
                    y2: 20
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            length: '2',
                            interval: 11
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
                            interval: 11
                        },
                        data: oData.aXdata
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitNumber: 4,
                        splitLine: {
                            show: false
                        },
                        minInterval: 1,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#617085'
                            },
                            formatter: function (nNum) {
                                return Utils.addComma(Math.abs(nNum), "rate", 1);
                            }
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
                        }
                    }
                ],
                series: aSeries,
                color: aColor
                // color: ['rgba(179,183,221,0.6)', 'rgba(242,188,152,0.6)', 'rgba(78,913,178,0.6)']
            };
            flowChart.setOption(option);
        };

        $scope.drawCpu = function (oData) {
            cpuChart = echarts.init(document.getElementById('cpu_rate'));
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#80878C',
                            width: 2,
                            type: 'solid'
                        }
                    },
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#80878C',
                            width: 2,
                            type: 'solid'
                        }
                    },
                    formatter: function (params) {
                        var sTips = params[0].name + "<br/>";
                        if(params[0].value =="-"){
                            sTips += params[0].seriesName + ' : ' + params[0].value + "<br/>"
                        }else{
                            sTips += params[0].seriesName + ' : ' + params[0].value +"%"+ "<br/>"
                        }
                        return sTips;
                    }
                    // formatter: "{b} <br/> {a}: {c}%"
                },
                // legend: {
                //     data:['射频：1（5g）','射频：2（2.4g）','射频：3（2.4g）']
                // },
                grid: {
                    x: 60,
                    y: 5,
                    x2: 20,
                    y2: 20
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisTick: {
                            length: '2',
                            interval: 23
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#AEAEB7',
                                width: '1'
                            }
                        },
                        axisLabel: {
                            showMaxLabel:true,
                            textStyle: {
                                color: '#617085'
                            },
                            interval: 23
                        },
                        data: oData.aXdata
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        // splitNumber: 4,
                        minInterval: 1,
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#617085'
                            },
                            formatter: function (nNum) {
                                return nNum + '%';
                            }
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
                        }
                    }
                ],
                series: [
                    {
                        name: 'CPU',
                        symbol:"none",
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#bcd4ca'
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: '#bcd4ca',
                                opacity: 0.5,
                            }
                        },
                        data: oData.aYdata
                    }
                ],
                // color: ['#bcd4ca']
                // color:["rgba(179,183,221,0.6)"]
            };
            cpuChart.setOption(option);
        };

        $scope.drawMemory = function (oData) {
            memoryChart = echarts.init(document.getElementById('memory_rate'));
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            color: '#80878C',
                            width: 2,
                            type: 'solid'
                        }
                    },
                    formatter: function (params) {
                        var sTips = params[0].name + "<br/>";
                        if(params[0].value =='-'){
                            sTips += params[0].seriesName + ' : ' + params[0].value + "<br/>"
                        }else{
                            sTips += params[0].seriesName + ' : ' + params[0].value +"%"+ "<br/>"
                        }
                        return sTips;
                    }
                },
                // legend: {
                //     data:[neicun]
                // },
                grid: {
                    x: 60,
                    y: 5,
                    x2: 20,
                    y2: 20
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisTick: {
                            length: '2',
                            interval: 23
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#AEAEB7',
                                width: '1'
                            }
                        },
                        axisLabel: {
                            showMaxLabel:true,
                            textStyle: {
                                color: '#617085'
                            },
                            interval: 23
                        },
                        data: oData.aXdata
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        // splitNumber: 4,
                        minInterval: 1,
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#617085'
                            },
                            formatter: function (nNum) {
                                return nNum + '%';
                            }
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
                        }
                    }
                ],
                series: [
                    {
                        name: '内存',
                        symbol:'none',
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                color: '#f2bc98'
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: '#f2bc98',
                                opacity: 0.5,
                            }
                        },
                        // itemStyle: { normal: { areaStyle: { type: 'default' } } },
                        data: oData.aYdata
                    }
                ],
                // color: ['#f2bc98']
                // color:["rgba(242,188,152,0.6)"]
            };
            memoryChart.setOption(option);
        };
        $scope.getAllData = function (apname, date) {
            async.parallel([
                /*getChannelData*/
                function (callback) {
                    $http({
                        url: "/v3/apmonitor/getApRadioChannelBusyAvgByDate",
                        method: 'GET',
                        params: {
                            'devSN': $scope.sceneInfo.sn,
                            // 'apName':$('#aplist').val(),
                            'apName': apname,
                            'date': date
                        }
                    }).success(function (data) {
                        var obj = data.apRadioBusyAvgList;
                        $scope.g_result.aLengend = [];
                        $scope.g_result.aCheck = [];
                        $scope.g_result.channelResult = {
                            aXdata: []
                        };
                        for (var k in obj) {
                            $scope.g_result.aLengend.push({ "id": k, "shortName": k });
                            $scope.g_result.aCheck.push(k);
                            obj[k].forEach(function (v, i) {
                                if (k == "radio1") {
                                    $scope.g_result.channelResult.aXdata.push(new Date(v.time).Format("hh:mm"));
                                }
                                if (!$scope.g_result.channelResult[k]) {
                                    $scope.g_result.channelResult[k] = [];
                                }
                                $scope.g_result.channelResult[k].push(v.busyAvg);
                            });
                        }
                        if($stateParams.radioID !=""){
                            $scope.g_result.aCheck = [$stateParams.radioID];
                        }
                        // $scope.drawChannel();
                        callback(null, "getChannelData");

                    }).error(function (data, header, config, status) {

                    });
                },
                /*getTerminalData*/
                function (callback) {
                    $http({
                        url: "/v3/stamonitor/clientloadonap",
                        method: "POST",
                        data: {
                            method: 'getApClientOnlineTrend',
                            param: {
                                'scenarioId': $scope.sceneInfo.nasid,
                                'acSN': $scope.sceneInfo.sn,
                                'ApName': apname,
                                'time': date
                            }

                        }
                    }).success(function (data) {
                        $scope.g_result.terminalResult = {
                            aXdata: []
                        };
                        if (data.errCode == 1) {
                            return;
                        }
                        var obj = data.clientOnlineTrend;
                        for (var k in obj) {
                            obj[k].forEach(function (v) {
                                if (k == "radio1") {
                                    $scope.g_result.terminalResult.aXdata.push(new Date(v.updateTime).Format("hh:mm"));
                                }

                                if (!$scope.g_result.terminalResult[k]) {
                                    $scope.g_result.terminalResult[k] = [];
                                }
                                $scope.g_result.terminalResult[k].push(v.clientCount);
                            });
                        }
                        // $scope.drawTerminal();
                        callback(null, "getTerminalData");
                    }).error(function (data, header, config, status) {

                    });
                },
                /*getCpuData*/
                function (callback) {
                    $http({
                        url: "/v3/apmonitor/getApCpuRatioByDate",
                        method: "GET",
                        params: {
                            'devSN': $scope.sceneInfo.sn,
                            'apName': apname,
                            'date': date
                        }
                    }).success(function (data) {
                        var oResult = {
                            aXdata: [],
                            aYdata: []
                        };
                        var arr = data.apCpuRatioList;
                        for (var i = 0; i < arr.length; i++) {
                            oResult.aXdata.push(new Date(arr[i].time).Format("hh:mm"));
                            oResult.aYdata.push(arr[i].cpuRatio);
                        }
                        $scope.drawCpu(oResult);
                        callback(null, "getCpuData");
                    }).error(function (data, header, config, status) {

                    });
                },
                /*getFlowData*/
                function (callback) {
                    $http({
                        url: "/v3/apmonitor/getApRadioTrafficByDate",
                        method: "GET",
                        params: {
                            'devSN': $scope.sceneInfo.sn,
                            'apName': apname,
                            'date': date
                        }
                    }).success(function (data) {
                        $scope.g_result.flowResult = {
                            aXdata: []
                        };
                        var obj = data.apRadioTrafficList;
                        for (var k in obj) {
                            obj[k].forEach(function (v) {
                                if (k == "radio1"){
                                    $scope.g_result.flowResult.aXdata.push(new Date(v.time).Format("hh:mm"));
                                }
                                if (!$scope.g_result.flowResult[k]) {
                                    $scope.g_result.flowResult[k] = {
                                        'transmit': [],
                                        'receive': []
                                    };
                                }
                                if(v.transmitTraffic =="-" ||v.receiveTraffic=="-"){
                                    $scope.g_result.flowResult[k].transmit.push(v.transmitTraffic);
                                    $scope.g_result.flowResult[k].receive.push(v.receiveTraffic);
                                }else{
                                    $scope.g_result.flowResult[k].transmit.push(v.transmitTraffic);
                                    $scope.g_result.flowResult[k].receive.push(-v.receiveTraffic);
                                }
                            });
                        }
                        // $scope.drawFlow();
                        callback(null, "getFlowData");
                    }).error(function (data, header, config, status) {

                    });
                },
                /*getMemData*/
                function (callback) {
                    $http({
                        url: "/v3/apmonitor/getApMemRatioByDate",
                        method: "GET",
                        params: {
                            'devSN': $scope.sceneInfo.sn,
                            'apName': apname,
                            'date': date
                        }
                    }).success(function (data) {
                        var oResult = {
                            aXdata: [],
                            aYdata: []
                        };
                        var arr = data.apMemRatioList;
                        for (var i = 0; i < arr.length; i++) {
                            oResult.aXdata.push(new Date(arr[i].time).Format("hh:mm"));
                            oResult.aYdata.push(arr[i].memoryRatio);
                        }
                        $scope.drawMemory(oResult);
                        callback(null, "getMemData");
                    }).error(function (data, header, config, status) {

                    });
                }
            ], function (err, result) {
                $scope.drawChannel();
                $scope.drawTerminal();
                $scope.drawFlow();

                echarts.connect([myChart,terminalChart,flowChart]);
            }
            );
        }

        if ($stateParams.date == "" || $stateParams.ApName == "") {
            // $alert.msgDialogError(getRcString("ERROR")[2]);
            var date = new Date($('#daterange_ap').val()).Format("yyyy/MM/dd")
            $scope.getAPList(date);
        } else {
            $('#daterange_ap').val($stateParams.date);
            $scope.getAPList($stateParams.date);
        }
        $('#aplist').on('change', function () {
            var apData = $('#aplist').find("option:selected").text();
            var date = new Date($('#daterange_ap').val()).Format("yyyy/MM/dd");
            myChart&&myChart.clear();
            terminalChart&&terminalChart.clear();
            flowChart&&flowChart.clear();
            cpuChart&&cpuChart.clear();
            memoryChart&&memoryChart.clear();
            $scope.getAllData(apData, date);

        });

        $scope.isChecked = function (id) {
            return $scope.g_result.aCheck.indexOf(id) >= 0;
        };
        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var checked = checkbox.checked;
            if (checked) {
                $scope.g_result.aCheck.push(id);
            } else {
                var idx = $scope.g_result.aCheck.indexOf(id);
                $scope.g_result.aCheck.splice(idx, 1);
            }
            // console.log('$scope.g_result.aCheck', $scope.g_result.aCheck);
            // console.log('$scope.g_result', $scope.g_result);

            myChart.clear();
            $scope.drawChannel();

            terminalChart.clear();
            $scope.drawTerminal();

            flowChart.clear();
            $scope.drawFlow();

            echarts.connect([myChart,terminalChart,flowChart]);
        };

    }]

})