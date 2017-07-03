define(['jquery', 'utils', 'echarts3', 'moment','../lib/echarts-liquidfill', 'bootstrap-daterangepicker', 'css!bootstrap_daterangepicker_css'], function ($, Utils, echarts, moment) {
    return ['$scope', '$http', '$filter','$window','$state', '$alertService', '$stateParams', function ($scope, $http, $filter,$window,$state, $alert, $stateParams) {
        var myChart, scorePie, ScoreChart, signalChart, channelChart, noiseChart;
        var gTimeout;
        function getRcString(attrName) {
            return Utils.getRcString("user_rc", attrName).split(',');
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

        // function fnChengeTime(value) {
        //     var nMsecond = parseInt(value);// 毫秒
        //     var nSecond = 0;//秒
        //     var nMinute = 0;// 分
        //     var nHour = 0;// 小时
        //     var nDay = 0; //天
        //     var result = "";
        //     if(nMsecond >= 1000) {
        //         nSecond = parseInt(nMsecond/1000);
        //         nMsecond = parseInt(nMsecond%1000);
        //         if(nSecond >= 60) {
        //             nMinute = parseInt(nSecond/60);
        //             nSecond = parseInt(nSecond%60);
        //         }
        //         if(nMinute >= 60){
        //             nHour = parseInt(nMinute/60);
        //             nMinute = parseInt(nMinute%60);
        //         }
        //         if(nHour >= 24){
        //             nDay = parseInt(nHour/24);
        //             nHour = parseInt(nHour%24);
        //         }
        //     }
        //     /*result = ""+parseInt(nSecond)+"秒";*/
        //     if(nDay > 0 && nDay < 10)
        //     {
        //         result += "0"+parseInt(nDay)+"d:";
        //     }else if(nDay > 10){
        //         result += parseInt(nDay)+"d:";
        //     }else{
        //         result += "00"+"d:"
        //     }
        //     if(nHour > 0 && nHour <10) {
        //         result += "0"+parseInt(nHour)+"h:";
        //     }else if(nHour > 10){
        //         result +=parseInt(nHour)+'h:'
        //     }else{
        //         result += "00"+"h:";
        //     }
        //     if(nMinute > 0 && nMinute < 10) {
        //         result += "0"+parseInt(nMinute)+"m:";
        //     }else if(nMinute>10){
        //         result +=parseInt(nMinute)+"m:";
        //     }else{
        //         result += "00"+"m:"
        //     }
        //     if(nSecond > 0 && nSecond < 10) {
        //         result += "0"+parseInt(nSecond)+"s";
        //     }else if(nSecond > 10){
        //         result +=parseInt(nSecond)+'s';
        //     }else{
        //         result +='00'+"s"
        //     }
        //     return result;
        // }
        $scope.filterBar = {
            levelList: [
                'emergency',
                'alert',
                'critical',
                'error',
                'warning',
                'notification',
                'informational',
                'debugging'
            ]
        };
        $scope.return = function(){
            $window.history.back();
        }
        $scope.drawPie = function (aData, status) {
            var scoreData = [];
            scoreData.push(aData.staScore / 100);
            scorePie = echarts.init(document.getElementById('experienceInfo'));
            var pieOption = {
                width: '150%',
                series: [{
                    type: 'liquidFill',
                    radius: '100%',
                    center: ['50%', '50%'],
                    data: scoreData,
                    color: [status == 1 ? ((aData.staScore >= 80 ? "#66E6D5" : (aData.staScore >= 70 ? "#fbceb1" : "#fe808b"))) : "#f5f5f5"],
                    itemStyle: {
                        normal: {
                            //color: 'red',
                            opacity: 0.6
                        },
                        emphasis: {
                            opacity: 0.9
                        }
                    },
                    outline: {
                        show: false,
                        borderDistance: 1,
                        itemStyle: {
                            color: 'none',
                            borderColor: '#294D99',
                            borderWidth: 8,
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.25)'
                        }
                    },
                    backgroundStyle: {
                        color: 'rgb(255,255,255)',
                        borderWidth: 1,
                        borderColor: 'rgb(102,230,213)'
                    },
                    label: {
                        normal: {
                            formatter: function (params) {
                                return parseInt(params.value * 100) + '分';
                            },
                            textStyle: {
                                color: 'red',
                                insideColor: '#fff',
                                fontSize: 20
                            }
                        }
                    }
                }]
            };
            scorePie.setOption(pieOption);
        }
        window.onresize = function () {

            // scorePie.resize();/*echarts 插件问题，不放开*/
            // scorePie.setOption(pieOption);
            ScoreChart && ScoreChart.resize();
            signalChart && signalChart.resize();
            channelChart && channelChart.resize();
            noiseChart && noiseChart.resize();
            myChart && myChart.resize();
        };
        $scope.drawScoreChart = function (oData) {
            ScoreChart = echarts.init(document.getElementById('ScoreInfo'));
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
                    }
                },
                grid: {
                    x: 30,
                    y: 5,
                    x2: 20,
                    y2: 20
                },
                // grid: {
                //     left: '30',
                //     right: '20',
                //     top: '5',
                //     bottom: '20',
                //     // containLabel: true,
                //     // borderWidth: 0,
                // },
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
                        }
                    }
                ],
                series: [
                    {
                        name: '评分',
                        // symbol:"none",
                        type: 'line',
                        smooth: true,
                        clickable: true,
                        itemStyle: { normal: { areaStyle: { type: 'default' } } },
                        data: oData.aYdata
                    }
                ],
                color: ['#f2bc98']
            };
            ScoreChart.setOption(option);
            ScoreChart.on('click', function (param) {
                $scope.$broadcast('show#clientDetail');
                $scope.$broadcast('showLoading#stadata');
                $http({
                    url:'/v3/stamonitor/stascore',
                    method:'POST',
                    data:{
                        'method':'staQuotaInfo',
                        param:{
                            'scenarioId':$scope.sceneInfo.nasid,
                            'clientMAC':$('#maclist').find("option:selected").text(),
                            'time':new Date($('#timerange').val() +" "+param.name).getTime()
                        }
                    }
                }).success(function(data){
                    if(data.retcode ==0){
                        var aData =  angular.isArray(data.response)?data.response:[data.response];

                        $scope.$broadcast('load#stadata',aData);
                        $scope.$broadcast('hideLoading#stadata');
                        $(window).trigger('resize');
                    }
                    
                }).error(function() {
                    /* Act on the event */
                });
            });
        };

        $scope.drawMyChart = function (oData) {
            myChart = echarts.init(document.getElementById('channel_rate'));
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'none',
                    },
                    formatter: function (params) {
                        var sTips = params[0].name;
                        for (var i = 0; i < params.length; i++) {
                            sTips = sTips + "<br/>" + params[i].seriesName + " : " + Utils.addComma(Math.abs(params[i].value), "rate", 1);
                        }
                        return sTips;
                    }
                },
                legend: {
                    orient: "horizontal",
                    y: -5,
                    x: "center",
                    data:['上行','下行']
                },
                grid: {
                    x: 80,
                    y: 20,
                    x2: 20,
                    y2: 20
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            length: '2',
                            interval: 'auto'
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
                            interval: 'auto'
                        },
                        data: oData.aXdata
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitNumber: 5,
                        minInterval: 1,
                        axisLabel: {
                            show: true,
                            formatter: function (nNum) {
                                return Utils.addComma(Math.abs(nNum), "rate", 1);
                            },
                            textStyle: {
                                color: '#617085'
                            }
                        },
                        // splitLine: {
                        //     show: false
                        // },
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
                        name: '上行',
                        type: 'bar',
                        stack: '速率',
                        smooth: true,
                        itemStyle: { normal: { areaStyle: { type: 'default' } } },
                        data: oData.aYdata.upRate
                    },
                    {
                        name: '下行',
                        type: 'bar',
                        stack: '速率',
                        smooth: true,
                        itemStyle: { normal: { areaStyle: { type: 'default' } } },
                        data: oData.aYdata.downRate
                    }
                ],
                color: ['rgba(78,193,178,0.6)', "rgba(253,117,113,0.6)"]
            };

            myChart.setOption(option);
        };

        $scope.drawSingalChart = function (oData) {
            signalChart = echarts.init(document.getElementById('signalInfo'));
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
                        sTips += params[0].seriesName + ' : ' + params[0].value +"db"+ "<br/>"
                        return sTips;
                    }
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 80,
                        end: 100
                    },
                    {
                        type: 'slider',
                        realtime: true,
                        start: 80,
                        end: 100,
                        dataBackground:{
                            areaStyle:{
                                color:'#4ec1b2'
                            }
                        }
                    }

                ],
                grid: {
                    x: 50,
                    y: 5,
                    x2: 20,
                    y2: 60
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            length: '2',
                            interval: 'auto'
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
                            interval: 'auto'
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
                        // splitNumber: 4,
                        minInterval: 1,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#617085'
                            },
                            formatter: function (nNum) {
                                return Math.abs(nNum) + 'db';
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
                        name: '信号强度',
                        symbol:'none',
                        type: 'bar',
                        smooth: true,
                        itemStyle: { normal: { areaStyle: { type: 'default' } } },
                        data: oData.aRssi
                    }
                ],
                color: ['#bcd4ca']

            }
            signalChart.setOption(option);
        };

        $scope.busyAvg = {
            options: {
                mId: 'busyAvg',
                title: getRcString("DETAIL"),
                modalSize: 'normal',
                autoClose: true,
                showCancel: true,
                buttonAlign: "center",
                okHandler: function (modal, $ele) {
                },
                cancelHandler: function (modal, $ele) {

                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        };

        $scope.noise = {
            options: {
                mId: 'noise',
                title: getRcString("DETAIL"),
                modalSize: 'normal',
                autoClose: true,
                showCancel: true,
                buttonAlign: "center",
                okHandler: function (modal, $ele) {
                },
                cancelHandler: function (modal, $ele) {

                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }
        }
        $scope.drawchannelChart = function (oResult) {
            channelChart = echarts.init(document.getElementById('channelInfo'));
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
                        var tmp = params[0].value ? params[0].value +"%" :"--";
                        var sTips = params[0].name + "<br/>";
                        sTips += params[0].seriesName + ' : ' + tmp+ "<br/>"
                        return sTips;
                    }
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 80,
                        end: 100
                    },
                    {
                        type: 'slider',
                        realtime: true,
                        start: 80,
                        end: 100,
                        dataBackground:{
                            areaStyle:{
                                color:'#fb948e'
                            }
                        }
                    }
                ],
                grid: {
                    x: 50,
                    y: 5,
                    x2: 20,
                    y2: 60
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        // boundaryGap: false,
                        axisTick: {
                            length: '2',
                            interval: 'auto'
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
                            interval: 'auto'
                        },
                        data: oResult.aXdata
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
                    {
                        name: '信道利用率',
                        type: 'bar',
                        smooth: true,
                        itemStyle: { normal: { areaStyle: { type: 'default' } } },
                        data: oResult.aYdata
                    }
                ],
                color: ['#fb948e']
            };
            channelChart.setOption(option);
            channelChart.on('click', function (param) {
                // alert(param);
                $scope.$broadcast('show#busyAvg');
                var oData = oResult[param.name];
                updateForm($("#view_busyAvg_form"), oData);
                $("#time", $("#view_busyAvg_form")).html(param.name);
                $("#busyAvg", $("#view_busyAvg_form")).html(oData.busyAvg+'%');
            });
        }
        $scope.drawnoiseChart = function (oResult) {
            noiseChart = echarts.init(document.getElementById('noiseInfo'));
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
                        var tmp = params[0].value ? params[0].value +"db" :"--";
                        var sTips = params[0].name + "<br/>";
                        sTips += params[0].seriesName + ' : ' + tmp + "<br/>"
                        return sTips;
                    }
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 80,
                        end: 100
                    },
                    {
                        type: 'slider',
                        realtime: true,
                        start: 80,
                        end: 100,
                        dataBackground:{
                            areaStyle:{
                                color:'#b3b7dd'
                            }
                        }
                       
                    }
                ],
                grid: {
                    x: 50,
                    y: 5,
                    x2: 20,
                    y2: 60
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        // boundaryGap: false,
                        // axisLine: {
                        // show: false
                        // },
                        axisTick: {
                            length: '2',
                            interval: 'auto'
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
                            interval: 'auto'
                        },
                        data: oResult.aXdata
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: false
                        },
                        // splitNumber: 4,
                        minInterval: 1,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#617085'
                            },
                            formatter: function (nNum) {
                                return Math.abs(nNum) + 'db';
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
                        name: '底噪',
                        type: 'bar',
                        smooth: true,
                        itemStyle: { normal: { areaStyle: { type: 'default' } } },
                        data: oResult.aYdata
                    }
                ],
                color: ['#b3b7dd']
            };
            noiseChart.setOption(option);
            noiseChart.on('click', function (param) {
                $scope.$broadcast('show#noise');
                var oData = oResult[param.name];
                updateForm($("#view_noise_form"), oData);
                $("#time", $("#view_noise_form")).html(param.name);
                $("#RadioNoiseFloor", $("#view_noise_form")).html(oData.RadioNoiseFloor +'db');
            });
        };
        $scope.getMACList = function (inputIP) {
            var date = new Date($('#timerange').val()).Format("yyyy/MM/dd");

            $http({
                url: "/v3/stamonitor/stascore",
                method: 'POST',
                data: {
                    'method': 'getStaMacListByIpAndDate',
                    param: {
                        "scenarioId": $scope.sceneInfo.nasid,
                        "clientIP": inputIP,
                        "time": date
                    }

                }
            }).success(function (data) {
                if (data.retcode == -1) {
                    $scope.macArr = [];
                    myChart && myChart.clear();
                    scorePie && scorePie.clear();
                    ScoreChart && ScoreChart.clear();
                    signalChart && signalChart.clear();
                    channelChart && channelChart.clear();
                    noiseChart && noiseChart.clear();
                    updateHtml({ clientIP: "", clientMAC: "", clientVendor: "", time: "" });
                    $alert.msgDialogError(getRcString("ERROR")[0]);
                } else {
                    $scope.macArr = data.MACList;
                    $scope.fisrtMAC = ($stateParams.ipAddress == $scope.ipA) ? $stateParams.macAddress : $scope.macArr[0];
                    if ($scope.fisrtMAC != '') {
                        $scope.getPieData($scope.fisrtMAC, date);
                        $scope.getScoreChart($scope.fisrtMAC, date);
                        $scope.getMyChart($scope.fisrtMAC, date);
                        $scope.getTerminalInfo($scope.fisrtMAC, date);
                        $scope.getchannelData($scope.fisrtMAC, date);
                        $scope.getnoiseData($scope.fisrtMAC, date);
                    }

                }

            }).error(function (data, header, config, status) {

            });
        };


        $scope.getPieData = function (macAddress, date) {
            $http({
                url: "/v3/stamonitor/stascore",
                method: 'POST',
                data: {
                    'method': 'getStaScoreByDay',
                    param: {
                        "scenarioId": $scope.sceneInfo.nasid,
                        "clientMAC": macAddress,
                        "Time": date
                    }
                }
            }).success(function (data) {
                if (data.retcode == 0) {
                    $scope.drawPie(data, 1);
                }
            }).error(function (data, header, config, status) {

            });
        }

        $scope.getScoreChart = function (macAddress, date) {
            $http({
                url: "/v3/stamonitor/stascore",
                method: 'POST',
                data: {
                    'method': 'getStaScoreDetailsByDay',
                    param: {
                        "scenarioId": $scope.sceneInfo.nasid,
                        "clientMAC": macAddress,
                        "Time": date
                    }
                }
            }).success(function (data) {
                var oResult = {
                    aXdata: [],
                    aYdata: []
                }
                if (data.retcode == 0) {
                    var aData = data.response;
                    aData.forEach(function (v, i) {
                        oResult.aXdata.push(new Date(v.time).Format('hh:mm'));
                        oResult.aYdata.push(v.clientScore);
                    });
                    $scope.drawScoreChart(oResult);
                }
            }).error(function (data, header, config, status) {

            });
        };


        $scope.getMyChart = function (macAddress, date) {
            $http({
                url: "/v3/stamonitor/stascore",
                method: 'POST',
                data: {
                    'method': 'getClientInfoInDayHistory',
                    param: {
                        "scenarioId": $scope.sceneInfo.nasid,
                        "MAC": macAddress,
                        "Time": date
                    }
                }
            }).success(function (data) {
                var oResult = {
                    aXdata: [],
                    aYdata: {
                        upRate: [],
                        downRate: []
                    },
                    aRssi: []
                };
                if (data.retcode == 0) {
                    var aData = data.response;
                    aData.forEach(function (v, i) {
                        oResult.aXdata.push(new Date(v.time).Format("hh:mm"));
                        oResult.aRssi.push(v.rssi);
                        oResult.aYdata.upRate.push(v.clientUpRate);
                        oResult.aYdata.downRate.push(-v.clientDownRate);
                    });
                }
                $scope.drawMyChart(oResult);
                $scope.drawSingalChart(oResult);
            }).error(function (data, header, config, status) {

            });
        };

        $scope.getTerminalInfo = function (macAddress, date) {
            $http({
                url: "/v3/stamonitor/stascore",
                method: 'POST',
                data: {
                    'method': 'getStaBasicInfo',
                    param: {
                        "scenarioId": $scope.sceneInfo.nasid,
                        "clientMAC": macAddress,
                        "time": date
                    }
                }
            }).success(function (data) {
                if (data.retcode == 0) {
                    if (data.response.length > 0) {
                        updateHtml(data.response[0]);
                    } else {
                        return;
                    }
                }

            }).error(function (data, header, config, status) {

            });
        };

        $scope.getchannelData = function (macAddress, date) {
            $http({
                url: "/v3/stamonitor/clienthistory",
                method: 'POST',
                data: {
                    'method': 'getStaAssoApChannelBusyDayHistory',
                    param: {
                        "scenarioId": $scope.sceneInfo.nasid,
                        "MAC": macAddress,
                        "Time": date
                        // "scenarioId": "353326",
                        // "MAC":"2cf0-a276-d6af",
                        // "Time":"2017-04-23"
                    }
                }
            }).success(function (data) {
                var oResult = {
                    aXdata: [],
                    aYdata: []
                };
                if (data.errCode == 0) {
                    var aData = data.response.info;
                    aData.forEach(function (v, i) {
                        oResult.aXdata.push(new Date(v.time).Format('hh:mm'));
                        oResult.aYdata.push(v.busyAvg);
                        // oResult.aYdata.push(200);
                        oResult[new Date(v.time).Format('hh:mm')] = v;
                    });
                    $scope.drawchannelChart(oResult);
                }

            }).error(function (data, header, config, status) {

            });
        };

        $scope.getnoiseData = function (macAddress, date) {
            $http({
                url: "/v3/stamonitor/clienthistory",
                method: 'POST',
                data: {
                    'method': 'getStaAssoApChannelNoiseDayHistory',
                    param: {
                        "scenarioId": $scope.sceneInfo.nasid,
                        "MAC": macAddress,
                        "Time": date
                        // "scenarioId": "353326",
                        // "MAC":"2cf0-a276-d6af",
                        // "Time":"2017-04-23"
                    }
                }
            }).success(function (data) {
                var oResult = {
                    aXdata: [],
                    aYdata: []
                };
                if (data.errCode == 0) {
                    var aData = data.response.info;
                    aData.forEach(function (v, i) {
                        oResult.aXdata.push(new Date(v.time).Format('hh:mm'));
                        oResult.aYdata.push(v.RadioNoiseFloor);
                        // oResult.aYdata.push(200);
                        oResult[new Date(v.time).Format('hh:mm')] = v;
                    });
                    // console.log(oResult);
                    $scope.drawnoiseChart(oResult);
                }

            }).error(function (data, header, config, status) {

            });
        };
        $('#timerange').daterangepicker({
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
            var g_date = date.endDate.format('YYYY/MM/DD');
            var ipData = $scope.ipA;
            if(new Date().getTime() -new Date($("#timerange").val()).getTime() > 86400*1000*7 ){
                $('#aphistory').hide();
            }else{
                $('#aphistory').show();
            }

            $scope.macArr = [];
            myChart && myChart.clear();
            scorePie && scorePie.clear();
            ScoreChart && ScoreChart.clear();
            signalChart && signalChart.clear();
            channelChart && channelChart.clear();
            noiseChart && noiseChart.clear();
            updateHtml({ clientIP: "", clientMAC: "", clientVendor: "", time: "" });
            if (ipData) {
                $scope.getMACList(ipData);
            } else {
                $alert.msgDialogError(getRcString("ERROR")[2]);
            }

        });

        $scope.$watch('ipA', function (v) {
            clearTimeout(gTimeout);
            gTimeout = setTimeout(function () {
                if(v) {
                    ($scope.ipA) && $scope.getMACList($scope.ipA);
                }
            }, 1000);
        });

        if ($stateParams.ipAddress == "" || $stateParams.macAddress == "") {
            $alert.msgDialogError(getRcString("ERROR")[2]);
        }else if($stateParams.macAddress!="" && $stateParams.ipAddress =="N/A"){
            $scope.ipA = $stateParams.ipAddress;
            $('#timerange').val($stateParams.date);
            if(new Date().getTime() -new Date($("#timerange").val()).getTime() > 86400*1000*7 ){
                $('#aphistory').hide();
            }else{
                $('#aphistory').show();
            }
            $scope.macArr = [$stateParams.macAddress];
            $scope.fisrtMAC = $stateParams.macAddress;
            $scope.getPieData($stateParams.macAddress, $stateParams.date);
            $scope.getScoreChart($stateParams.macAddress, $stateParams.date);
            $scope.getMyChart($stateParams.macAddress, $stateParams.date);
            $scope.getTerminalInfo($stateParams.macAddress, $stateParams.date);
            $scope.getchannelData($stateParams.macAddress, $stateParams.date);
            $scope.getnoiseData($stateParams.macAddress, $stateParams.date);
        }else {
            $scope.ipA = $stateParams.ipAddress;
            $('#timerange').val($stateParams.date);
            if(new Date().getTime() -new Date($("#timerange").val()).getTime() > 86400*1000*7 ){
                $('#aphistory').hide();
            }else{
                $('#aphistory').show();
            }
            // $('#maclist').val($stateParams.macAddress);

        }
        function drawEmptyPie() {
            var option = {
                // height:200,
                width: '150%',
                calculable: false,
                animation: false,
                series: [
                    {
                        type: 'pie',
                        radius: '100%',
                        center: ['50%', '50%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label:
                                {
                                    position: "inner"
                                }
                            }
                        },
                        data: [{ name: 'N/A', value: 1 }],
                        color: ["rgba(216, 216, 216, 0.75)"]
                    }
                ]
            };
            echarts.init(document.getElementById('experienceInfo')).setOption(option);
        }

        drawEmptyPie();

        $('#maclist').on('change', function () {
            var macData = $('#maclist').find("option:selected").text();
            var date = new Date($("#timerange").val()).Format("yyyy/MM/dd");
            myChart && myChart.clear();
            scorePie && scorePie.clear();
            ScoreChart && ScoreChart.clear();
            signalChart && signalChart.clear();
            channelChart && channelChart.clear();
            noiseChart && noiseChart.clear();
            $scope.getPieData(macData, date);
            $scope.getScoreChart(macData, date);
            $scope.getMyChart(macData, date);
            $scope.getTerminalInfo(macData, date);
            $scope.getchannelData(macData, date);
            $scope.getnoiseData(macData, date);
        });


        $scope.apButtons = {
            options: {
                mId: 'apstnum',
                title: getRcString('APINFO')[0],
                autoClose: true,
                showCancel: true,
                buttonAlign: 'center',
                okHandler: function (modal, $ele) {
                    //点击确定按钮事件，默认什么都不做
                },
                cancelHandler: function (modal, $ele) {
                    //点击取消按钮事件，默认什么都不做
                },
                beforeRender: function ($ele) {
                    //渲染弹窗之前执行的操作,$ele为传入的html片段
                    return $ele;
                }
            }
        }
        $scope.bindApStaOptions = {
            tId: 'apdata',
            striped: true,
            pagniation: true,
            clickToSelect: true,
            columns: [
                { sortable: true, field: 'ApName', title: getRcString('APINFO')[1] },
                { sortable: true, field: 'radioID', title: getRcString('APINFO')[2] },
                { sortable: true, field: 'clientMode', title: getRcString('APINFO')[3] },
                { sortable: true, field: 'upLineDate', title: getRcString('APINFO')[4] },
                { sortable: true, field: 'offLineDate', title: getRcString('APINFO')[5] }
            ]
        }

        $scope.clientDetail = {
            options: {
                mId: 'clientDetail',
                title: getRcString('STAINFO')[0],
                autoClose: true,
                modalSize: 'lg',
                showCancel: true,
                buttonAlign: 'center',
                okHandler: function (modal, $ele) {
                    //点击确定按钮事件，默认什么都不做
                },
                cancelHandler: function (modal, $ele) {
                    //点击取消按钮事件，默认什么都不做
                },
                beforeRender: function ($ele) {
                    //渲染弹窗之前执行的操作,$ele为传入的html片段
                    return $ele;
                }
            }
        }
        $scope.staOptions = {
            tId: 'stadata',
            striped: true,
            pageSize: 5,
            pageList: [5,10,20],
            showPageList: true,
            pagniation: true,
            clickToSelect: true,
            columns: [
                { sortable: true, field: 'clientMAC', title: getRcString('STAINFO')[1] },
                { sortable: true, field: 'clientIP', title: getRcString('STAINFO')[2] },
                { sortable: true, field: 'rssi', title: getRcString('STAINFO')[3] },
                { sortable: true, field: 'apSN', title: getRcString('STAINFO')[4] },
                { sortable: true, field: 'negoSpeed', title: getRcString('STAINFO')[6] },
                { sortable: true, field: 'clientVendor', title: getRcString('STAINFO')[7] }
                // { sortable: true, field: 'onlineTime', title: getRcString('STAINFO')[8],
                //     formatter: function (value) {
                //         return fnChengeTime(value);
                //     }
                //  }
            ]
        }
        $scope.logDetail = {
            options: {
                mId: 'logDetail',
                title: getRcString('STAINFO')[0],
                modalSize:'lg',
                autoClose: true,
                showCancel: true,
                buttonAlign: 'center',
                okHandler: function (modal, $ele) {
                    //点击确定按钮事件，默认什么都不做
                },
                cancelHandler: function (modal, $ele) {
                    //点击取消按钮事件，默认什么都不做
                },
                beforeRender: function ($ele) {
                    //渲染弹窗之前执行的操作,$ele为传入的html片段
                    return $ele;
                }
            }
        }
        

        function updateHtml(oData) {
            $.each(oData, function (sKey, sValue) {
                // sKey = sKey.replace(/\./g, "\\.");
                sValue = (null == sValue) ? "" : sValue + "";
                $("#" + sKey).html(sValue);
            });
            return;
        };

        function updateForm(jScope, oData) {
            $.each(oData, function (sKey, sValue) {
                sValue = (null == sValue) ? "" : sValue + "";
                $("#" + sKey, jScope).html(sValue);
            });
            return;
        };
        // $('#apDetail').click(function(){

        // });
        $scope.apclick = function () {
            var date = new Date($('#timerange').val()).Format("yyyy/MM/dd");
            $scope.$broadcast('show#apstnum');
            $scope.$broadcast('showLoading#apdata');
            $http({
                url: "/v3/stamonitor/clienthistory",
                method: "POST",
                data: {
                    method: 'getStaAssocApHistoryByDay',
                    param: {
                        "scenarioId": $scope.sceneInfo.nasid,
                        "clientMAC": $('#maclist').find("option:selected").text(),
                        "time": date
                    }

                }
            }).success(function (data) {

                if (data.errCode == 0) {
                    if (data.response.length < 0) {
                        $alert.msgDialogError(getRcString("ERROR")[1]);
                    }
                    var aData = data.response;
                    $.each(aData, function (i, item) {
                        aData[i] = {};
                        aData[i].ApName = item.ApName || " ";
                        aData[i].radioID = item.radioID || " ";
                        aData[i].clientMode = item.clientMode || " ";
                        aData[i].upLineDate = new Date(item.upLineDate).Format('yyyy-MM-dd hh:mm:ss') || " ";
                        aData[i].offLineDate = (item.offLineDate =="N/A")?"未下线":new Date(item.offLineDate).Format('yyyy-MM-dd hh:mm:ss');
                    });
                    $scope.$broadcast('load#apdata', aData);
                    $scope.$broadcast('hideLoading#apdata');
                    $(window).trigger('resize');
                }

            }).error(function (data, header, config, status) {

            });
        }

        $scope.logclick = function () {
            if(!$('#maclist').find("option:selected").text().toLowerCase()){
                return
            }
            $http({
                url: "/v3/ant/confmodule/getdevlogstatus",
                method: "POST",
                data: {
                    "devSN": $scope.sceneInfo.sn
                }
            }).success(function (data) {
                if(data.retCode =="-1"){
                    $alert.msgDialogError(getRcString("LOGINFO"));
                    return;
                }else if(data.retCode == "0"){
                    $scope.$broadcast('show#logDetail');
                    $scope.$broadcast('showLoading#warn');
                    var sTime  = new Date($('#timerange').val().replace(/-/g,'/')).getTime();
                    var eTime = sTime + 24*60*60*1000 -1;
                    // $http({
                    //     url:'/v3/devlogserver/getdevlogs',
                    //     method:'POST',
                    //     data:{
                    //         "devSN":$scope.sceneInfo.sn,
                    //         "starttime":sTime,
                    //         "endtime":eTime,
                    //         "search":$('#maclist').find("option:selected").text().toLowerCase(),
                    //         // "search":'683e-342c-f9df',
                    //         "DATA":1,
                    //         "limit":10
                    //     }
                    // }).success(function (data) {
                    //     if(data.retCode == 0){
                    //         var aData = data.message.DATA;
                    //         $.each(aData,function(i,item) {
                    //             aData[i].reportedTime = GetLoginTime(item.reportedTime*1000);
                    //         });
                    //         $scope.$broadcast('load#stadata', aData);
                    //         $scope.$broadcast('hideLoading#stadata');
                    //         $(window).trigger('resize');
                    //     }
                    // }).error(function() {
                    //     /* Act on the event */
                    // });
                    var g_total = 0, // 表格中数据条数未知
                    g_curPage = 1, // 刷新页面，表格页数是1
                    g_limit = 10; // 表格 默认每页 显示10条

                    $scope.logOptions = {
                        tId: 'warn',
                        searchable: true,
                        pageSize:5,
                        paginationSize: 'sm',
                        pageList: [5,10],
                        sidePagination: 'server',
                        method: 'post',
                        url: '/devlogserver/getdevlogs',
                        pageListChange: {
                            pageNumber: 1
                        },
                        queryParams: function (params) {

                            var limit, action, tab,
                                tab_first = undefined,
                                tab_last = undefined;
                            var nextPage = params.start;
                            var paramsLimit = Number(params.limit);

                            $scope.$broadcast('getData#warn', function (data) {
                                tab_first = data[0];
                                tab_last = data[data.length-1];
                            });

                            if (g_limit != paramsLimit) { // 切换每页显示多少条时
                                limit = paramsLimit;
                                g_limit = paramsLimit;
                            } else if (nextPage == g_curPage || nextPage == 1) { // 第一页
                                limit = paramsLimit;
                                action = 1;
                                tab = undefined;
                            } else if (nextPage == Math.ceil(g_total/params.limit)) { // 最后一页
                                limit = g_total%paramsLimit;
                                action = -1;
                                tab = undefined;
                            } else if (nextPage == g_curPage-1) { // 上一页
                                limit = paramsLimit;
                                action = -1;
                                tab = tab_first;
                            }  else if (nextPage == g_curPage+1) { // 下一页
                                limit = paramsLimit;
                                action = 1;
                                tab = tab_last;
                            }

                            g_curPage = nextPage;

                            var nLevel = $scope.filterBar.levelList.indexOf($scope.filterBar.level);
                            var sModule = $scope.filterBar.module;

                            return {
                                devSN: $scope.sceneInfo.sn,
                                DATA: 1,
                                COUNT: params.start == 1 ? 1 : undefined,
                                starttime: sTime,
                                endtime: eTime,
                                sortmodule: params.sort,
                                sort: params.sort && (params.order=='desc' ? -1 : 1),
                                search: $('#maclist').find("option:selected").text().toLowerCase(),
                                Level: nLevel == -1 ? undefined : (nLevel+''),
                                module: sModule ? sModule : undefined,

                                limit: limit, // 一般是params.limit个，如果是最后一页，要计算最后一页个数。
                                action: action, // 向前翻，最后一页用-1，向后翻，第一页用1
                                tab: tab // 向前翻页，当前页第一条数据，向后翻页，当前页最后一条数据，第一页/最后一页不返东西。
                            };
                        },
                        responseHandler: function (data) {
                            if (data.message['COUNT'] != undefined) {
                                g_total = data.message['COUNT'];
                            }
                            return {
                                rows: data.message['DATA'],
                                total: g_total
                            };
                        },
                        columns: [
                            {
                                width: 140,
                                title: getRcString('warn-list-header')[0],
                                field: 'service'
                            },
                            {
                                width: 104,
                                sortable: true,
                                title: getRcString('warn-list-header')[1],
                                field: 'wModule'
                            },
                            {
                                width: 104,
                                sortable: true,
                                title: getRcString('warn-list-header')[2],
                                field: 'Level',
                                formatter: function (value) {
                                    return $scope.filterBar.levelList[value];
                                }
                            },
                            {
                                width: 612,
                                title: getRcString('warn-list-header')[3],
                                field: 'content',
                                formatter: function (value) {
                                    // '<div style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:500px;" title="'+value+'">' + value + '</div>'
                                    return (value?'<div style="width: 90%;word-break: break-word;">'+value+'</div>':'');
                                }
                                // searcher: {}
                            },
                            {
                                width: 163,
                                sortable: true,
                                title: getRcString('warn-list-header')[4],
                                field: 'receptionTime',
                                formatter: function (value) {
                                    return ( value ? moment(value*1000).format('YYYY/MM/DD HH:mm:ss') : '' );
                                }
                            }
                        ]
                    };
                }

            }).error(function (data, header, config, status) {

            });
        }
    }]

})