define(['echarts3', 'utils', 'angular-ui-router','../lib/echarts-liquidfill', 'bsTable', 'bootstrap-daterangepicker'], function (echarts, Utils) {
    return ['$scope', '$http', '$state', function ($scope, $http, $state) {
        var scorePie;
        var g_time,ScoreChart;
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

        var good = getRcString("good");
        var bad = getRcString("bad");
        var normal = getRcString("normal");
        var userExpTatil = getRcString("userexperience");

        // 时间转换函数 入参：标准时间格式 返回值格式：12:00:01
        function timeChange2Normal(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var timeNormal = '';

            if ((hours >= 0) && (hours < 10)) {
                if ((minutes >= 0) && (minutes < 10)) {
                    timeNormal = '0' + hours + ':' + '0' + minutes;
                } else {
                    timeNormal = '0' + hours + ':' + minutes;
                }
            } else if ((minutes >= 0) && (minutes < 10)) {
                timeNormal = hours + ':' + '0' + minutes;
            } else {
                timeNormal = hours + ':' + minutes;
            }
            return timeNormal;
        }

        $scope.eventData = {
            time: new Date(),
            timeNormal: timeChange2Normal(new Date()),
            method: "getStaScoreBadPoint",
            category: bad
        };

        function eventDataSet(time, timeNormal, method, category) {
            $scope.eventData.time = time;
            $scope.eventData.timeNormal = timeNormal;
            $scope.eventData.method = method;
            $scope.eventData.category = category;
        }

        function scoreDetailMethodGet(badNum, goodNum, normalNum) {
            var method = "getStaScoreBadPoint";
            if (0 != badNum) {
                method = "getStaScoreBadPoint";
            } else if (0 != goodNum) {
                method = "getStaScoreGoodPoint"
            } else if (0 != normalNum) {
                method = "getStaScoreNormalPoint"
            }
            return method;
        }

        function changeMethod2category(method) {
            var category = bad;
            switch (method) {
                case "getStaScoreBadPoint": {
                    category = bad;
                    break;
                }
                case "getStaScoreGoodPoint": {
                    category = good;
                    break;
                }
                case "getStaScoreNormalPoint": {
                    category = normal;
                    break;
                }
                default: {
                    break;
                }
            }
            return category;
        }
        // 切换top10 top50 top100
        function setLimitTag(is10Actived, is50Actived, is100Actived) {
            $scope.is10Actived = is10Actived;
            $scope.is50Actived = is50Actived;
            $scope.is100Actived = is100Actived;
        }

        function setLimtTagbyNum(num) {
            if (10 === num) {
                setLimitTag(true, false, false);
            }
            if (50 === num) {
                setLimitTag(false, true, false);
            }
            if (100 === num) {
                setLimitTag(false, false, true);
            }
        }

        function setScore(isGood, isBad, isNormal) {
            $scope.isGood = isGood;
            $scope.isBad = isBad;
            $scope.isNormal = isNormal;
        }

        function setScorebyCategory(category) {
            switch (category) {
                case good: {
                    setScore(true, false, false);
                    break;
                }
                case bad: {
                    setScore(false, true, false);
                    break;
                }
                case normal: {
                    setScore(false, false, true);
                    break;
                }
                default:
                    {
                        console.log("get Category failed");
                        break
                    }
            }
        }

        setLimtTagbyNum(10);
        setScorebyCategory(bad);

        // 获取客户端详情
        function getScoreInfo(reqMethod, num, time) {
            // debugger
            $http({
                url: '/v3/stamonitor/stascore',
                method: 'POST',
                data: {
                    method: reqMethod,
                    param: {
                        sernarioId: $scope.sceneInfo.nasid,
                        // sernarioId: "352687",
                        datetime: time,
                        limit: num
                    }
                }
            }).success(function (data, header, config, status) {
                var clientList = data.clientScoreList;
                for (var j = 0; j < clientList.length; j++) {
                    clientList[j].clientOnlineTime = Utils.transformOnlineTimeStr('ms', clientList[j].clientOnlineTime);
                }
                // console.log(data.clientScoreList);
                $scope.$broadcast('load#userTableId', data.clientScoreList);
            }).error(function (data, header, config, status) {

            });
        }

        function getScoreAndDetailInfo(datetime, detailLimit, isGetTodyInfo) {
            $http({
                url: '/v3/stamonitor/stascore',
                method: 'POST',
                data: {
                    method: "getDayStaScore",
                    param: {
                        sernarioId: $scope.sceneInfo.nasid,
                        datetime: datetime
                    }
                }
            }).success(function (data, header, config, status) {
                // console.log(data);
                    $scope.scoreDate = [];
                    $scope.scoreGood = [];
                    $scope.scoreBad = [];
                    $scope.scoreNormal = [];
                    $scope.gTime = [];
                if (0 === data.clientScoreList[0].retcode) {
                    // $scope.scoreDate = [];
                    // $scope.scoreGood = [];
                    // $scope.scoreBad = [];
                    // $scope.scoreNormal = [];
                    // $scope.gTime = [];
                    var scoreInfo = data.clientScoreList[0].info;
                    for (var i = 0; i < scoreInfo.length; i++) {

                        var dateFormat = new Date(scoreInfo[i].time);
                        $scope.gTime.push(dateFormat);
                        $scope.scoreDate.push(timeChange2Normal(dateFormat));
                        $scope.scoreGood.push(scoreInfo[i].good);
                        $scope.scoreBad.push(scoreInfo[i].bad);
                        $scope.scoreNormal.push(scoreInfo[i].normal);
                    }
                    
                }
                userExpBar.setOption({
                        xAxis: {
                            data: $scope.scoreDate
                        },
                        series: [
                            {
                                name: bad,
                                data: $scope.scoreBad
                            },
                            {
                                name: normal,
                                data: $scope.scoreNormal
                            },
                            {
                                name: good,
                                data: $scope.scoreGood
                            }
                        ]
                    })

                if (true === isGetTodyInfo) {
                    scoreDetailMethod = scoreDetailMethodGet($scope.scoreBad[i - 1], $scope.scoreGood[i - 1], $scope.scoreNormal[i - 1]);
                    eventDataSet($scope.gTime[i - 1], timeChange2Normal($scope.gTime[i - 1]), scoreDetailMethod, changeMethod2category(scoreDetailMethod));
                } else {
                    // console.log($scope.eventData.time.toString())
                    var gTimeTemp=[];
                    for (var j = 0; j < $scope.gTime.length; j++){
                        gTimeTemp.push($scope.gTime[j].toString());
                    }
                    var historyDefaultTimeIndex = gTimeTemp.indexOf($scope.eventData.time.toString());
                    if (-1 != historyDefaultTimeIndex) {
                        scoreDetailMethod = scoreDetailMethodGet($scope.scoreBad[historyDefaultTimeIndex], $scope.scoreGood[historyDefaultTimeIndex], $scope.scoreNormal[historyDefaultTimeIndex]);
                    } else {
                        scoreDetailMethod = "getStaScoreBadPoint";
                    }
                    eventDataSet(datetime, timeChange2Normal(datetime), scoreDetailMethod, changeMethod2category(scoreDetailMethod));
                }
                // console.log("eventData", $scope.eventData);
                setScorebyCategory($scope.eventData.category);
                getScoreInfo($scope.eventData.method, detailLimit, $scope.eventData.time);
                
            }).error(function (data, header, config, status) {
            });
        }
        // ************************************用户体验柱状图********************************************
        var userExpBar = echarts.init(document.getElementById("userexperience"));
        var option =
            {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },

                color: ['#fe808b', '#f2bc98', '#4ec1b2'],
                legend: {
                    top: 'top',
                    data: [bad, normal, good]
                },
                grid: {
                    x: 30,
                    y: 40,
                    x2: 0,
                    y2: 20,
                    containLabel: true,
                    borderWidth: 0,
                },
                xAxis: [
                    {
                        type: 'category',
                        // boundaryGap:[2,3],
                        axisTick: {
                            alignWithLabel: true
                        },
                        splitLine: {
                            show: false,
                        },
                        axisTick: {
                            length: '3',
                            interval: 0
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
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        splitLine: {
                            show: false,
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
                        minInterval: 1
                    }
                ],
                series: [
                    {
                        name: bad,
                        type: 'bar',
                        // barWidth:6,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 2
                            },
                            emphasis: {
                                borderColor: '#fe808b',
                                borderWidth: 2,
                                barBorderRadius: 2
                            }
                        },
                        stack: userexperience,
                        data: []
                    },
                    {
                        name: normal,
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                barBorderRadius: 2
                            },
                            emphasis: {
                                borderColor: '#f2bc98',
                                borderWidth: 2,
                                barBorderRadius: 2
                            }
                        },
                        stack: userexperience,
                        data: $scope.scoreNormal
                    },
                    {
                        name: good,
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                barBorderRadius: 2
                            },
                            emphasis: {
                                borderColor: '#4ec1b2',
                                borderWidth: 2,
                                barBorderRadius: 2
                            }
                        },
                        stack: userexperience,
                        data: $scope.scoreGood
                    }
                ],
            };
        userExpBar.setOption(option);

        getScoreAndDetailInfo(new Date(), 10, true);


        // 选择日期
        // $('#daterange').daterangepicker(oDaterangeCN, function () {

        // }).on('apply.daterangepicker', function (e, date) {
        //     var selectedDate = date.startDate.format('YYYY/MM/DD');
        //     var year = Number(selectedDate.slice(0, 4));
        //     var month = Number(selectedDate.slice(5, 7)) - 1;
        //     var day = Number(selectedDate.slice(8));
        //     var currentTime = new Date();
        //     var minutes10 = 0;
        //     if (currentTime.getMinutes() < 10) {
        //         minutes10 = 0;
        //     } else {
        //         minutes10 = parseInt(currentTime.getMinutes() / 10) * 10;
        //     }

        //     $scope.eventData.time = new Date(year, month, day, currentTime.getHours(), minutes10, 0);
        //     $scope.eventData.timeNormal = timeChange2Normal($scope.eventData.time);

        //     if (($scope.eventData.time.getDay() === currentTime.getDay()) && ($scope.eventData.time.getMonth() === currentTime.getMonth())) {
        //         getScoreAndDetailInfo($scope.eventData.time, 10, true);
        //     } else {
        //         getScoreAndDetailInfo($scope.eventData.time, 10, false);
        //     }
        //     setLimtTagbyNum(10);
        // })
        var oDaterangeTab1 ={
            singleDatePicker: true,
            maxDate: new Date(),
            minDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
            dateLimit: {
                days: 1
            },
            locale: {  
                format: 'YYYY/MM/DD'  
            }, 
            'opens': 'center'
        }

        var oDaterangeTab2 ={
            singleDatePicker: true,
            maxDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            minDate: new Date(new Date().getTime() - 31 * 24 * 60 * 60 * 1000),
            dateLimit: {
                days: 1
            },
            locale: {  
                format: 'YYYY/MM/DD'  
            }, 
            'opens': 'center'
        }

        $scope.initDaterange = function(oDaterangeCN){
            $('#daterange_sta').daterangepicker(oDaterangeCN, function (start, end, label) {
                start.format('YYYY/MM/DD');
            }).on('apply.daterangepicker', function (e, date) {
                if($("#clientTab li.active").attr('tag') == "baseInfo") {
                    // g_date = date.endDate.format('YYYY-MM-DD');
                    var selectedDate = date.startDate.format('YYYY/MM/DD');
                    var year = Number(selectedDate.slice(0, 4));
                    var month = Number(selectedDate.slice(5, 7)) - 1;
                    var day = Number(selectedDate.slice(8));
                    var currentTime = new Date();
                    var minutes10 = 0;
                    if (currentTime.getMinutes() < 10) {
                        minutes10 = 0;
                    } else {
                        minutes10 = parseInt(currentTime.getMinutes() / 10) * 10;
                    }

                    $scope.eventData.time = new Date(year, month, day, currentTime.getHours(), minutes10, 0);
                    $scope.eventData.timeNormal = timeChange2Normal($scope.eventData.time);

                    if (($scope.eventData.time.getDay() === currentTime.getDay()) && ($scope.eventData.time.getMonth() === currentTime.getMonth())) {
                        getScoreAndDetailInfo($scope.eventData.time, 10, true);
                    } else {
                        getScoreAndDetailInfo($scope.eventData.time, 10, false);
                    }
                    setLimtTagbyNum(10);
                } else {
                    //获取日期
                    //do something
                    //绘制体验日报
                    g_time = new Date($('#daterange_sta').val()).getTime();
                    $scope.drawAllInfo();
                }
            });
        }

        $scope.initDaterange(oDaterangeTab1);
        // 鼠标点击柱状图事件
        userExpBar.on('click', function (params) {
            // console.log("################# params:", params);

            // 高亮选中区域
            userExpBar.dispatchAction({
                type: 'highlight',
                seriesIndex: params.seriesIndex,
                dataIndex: params.dataIndex
            });

            // 刷新表格
            if (good === params.seriesName) {
                tmpmethod = 'getStaScoreGoodPoint';
            } else if (bad === params.seriesName) {
                tmpmethod = 'getStaScoreBadPoint';
            }
            else if (normal === params.seriesName) {
                tmpmethod = 'getStaScoreNormalPoint';
            }


            if (true === $scope.is10Actived) {
                var limitEvent = 10;
            } else if (true === $scope.is50Actived) {
                var limitEvent = 50;
            } else if (true === $scope.is100Actived) {
                var limitEvent = 100;
            }

            setScorebyCategory(params.seriesName);
            eventDataSet($scope.gTime[params.dataIndex], timeChange2Normal($scope.gTime[params.dataIndex]), tmpmethod, params.seriesName);
            getScoreInfo($scope.eventData.method, limitEvent, $scope.eventData.time);
            return;
        });

        $scope.changeListNum = function (limit) {
            setLimtTagbyNum(limit);
            setScorebyCategory($scope.eventData.category);
            getScoreInfo($scope.eventData.method, limit, $scope.eventData.time);
        }

        // ***************************************************用户体验列表*********************************************
        $scope.userTable = {
            tId: 'userTableId',
            pageSize: 5,
            searchable: true,
            pageList:[5,10,'All'],
            //showPageList: true,   
            columns: [
                { sortable: true, field: 'clientMAC', title: "MAC", searcher: {},
                    formatter: function(value,row,index){
                        return '<a class="list-link">'+value+'</a>';
                    } 
                },
                { sortable: true, field: 'clientIP', title: "IP", searcher: {},
                    formatter: function(value,row,index){
                        return '<a class="list-link">'+value+'</a>';
                    } 
                },
                { sortable: true, field: 'clientScore', title: getRcString("clientScore").split(','), searcher: {} },
                { sortable: true, field: 'negoSpeed', title: getRcString("negoSpeed").split(','), searcher: {} },
                { sortable: true, field: 'Appercent', title: "RSSI(db)", searcher: {} },
                { sortable: true, field: 'clientOnlineTime', title: getRcString("clientOnlineTime").split(','), searcher: {} },
                { sortable: true, field: 'clientVendor', title: getRcString("clientVendor").split(','), searcher: {} },
                { sortable: true, field: 'clientApName', title: getRcString("clientApName").split(','), searcher: {},
                    formatter: function(value,row,index){
                        return '<a class="list-link">'+value+'</a>';
                    } 
                },
                { sortable: true, field: 'radioID', title: getRcString("radio").split(','), searcher: {},
                    formatter: function(value,row,index){
                        return '<a class="list-link">'+value+'</a>';
                    } 
                }
            ],
            data: []
        }

        $scope.$on('click-cell.bs.table#userTableId',function (e, field, value, row, $element){
            var date = new Date($('#daterange_sta').val()).Format('yyyy/MM/dd');
            if(field == 'clientMAC' || field =="clientIP"){
                $state.go('^.exception88',{macAddress:row.clientMAC,ipAddress:row.clientIP,date:date});  
            }else if(field == "clientApName"){
                $state.go('^.apindex88',{ApName:row.clientApName,date:date});  
            }else if(field == "radioID"){
                $state.go('^.apindex88',{ApName:row.clientApName,radioID:'radio'+ row.radioID,date:date});  
            }
        })

        window.onresize = function () {
            userExpBar.resize();
            ScoreChart&&ScoreChart.resize();
        };

        /***************************************************体验日报************************************/
        $scope.drawAllInfo = function(){
            //刷新视图
            $scope.$apply(function(){
                $scope.getExperienceScore();
                $scope.getWorstExperience();
                $scope.getExperienceCount();
                $scope.getMostAP();
                $scope.getScoreTrend();
            });
        }
        $("#clientTab li").on('click',function(){
            $("#clientTab li").removeClass('active');
            $('.clientSection').hide();
            $(this).addClass('active');
            $("#"+$(this).attr('tag')).fadeIn();
            if($(this).attr('tag') == 'allInfo'){
                $scope.initDaterange(oDaterangeTab2);
            } else {
                $scope.initDaterange(oDaterangeTab1);
            }
            g_time = new Date($('#daterange_sta').val()).getTime();
            $scope.drawAllInfo();
        });
        /****************************************绘出体验评分水球****************************************/
        $scope.drawAllScore = function (aData, status) {
            var scoreData = [];
            scoreData.push(aData.averScore / 100);
            scorePie = echarts.init(document.getElementById('allexperience'));
            var pieOption = {
                width: '150%',
                series: [{
                    type: 'liquidFill',
                    radius: '100%',
                    center: ['50%', '50%'],
                    data: scoreData,
                    color: [status == 1 ? ((aData.averScore >= 80 ? "#66E6D5" : (aData.averScore >= 70 ? "#fbceb1" : "#fe808b"))) : "#f5f5f5"],
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
        /****************************************绘出体验评分趋势图****************************************/
        $scope.drawScoreChart = function (oData) {
            ScoreChart = echarts.init(document.getElementById('experienceLine'));
            var scoreOption = {
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
                        symbol:"none",
                        type: 'line',
                        smooth: true,
                        clickable: true,
                        itemStyle: { normal: { areaStyle: { type: 'default' } } },
                        data: oData.aYdata
                    }
                ],
                color: ['#f2bc98']
            };
            ScoreChart.setOption(scoreOption);
        };
        $scope.drawBadClient =function (oResult) {
            var classList = ['top-one', 'top-two', 'top-three', 'top-four', 'top-five','top-six','top-seven'];
            $scope.badClientList=[];
            $.each(oResult, function (i, v) {
                v.color = classList[i];
                v.valuePercent = v.clientScore +"%";
                $scope.badClientList.push(v);  
            });
        }

        $scope.drawCountClient =function (oResult) {
            var classList = ['top-one', 'top-two', 'top-three', 'top-four', 'top-five','top-six','top-seven'];
            $scope.badCountList=[];
            $.each(oResult, function (i, v) {
                v.color = classList[i];
                v.valuePercent = v.badScoreTimes +"%";
                $scope.badCountList.push(v);  
            });
        }
        $scope.drawBadAp =function (oResult) {
            var classList = ['top-one', 'top-two', 'top-three', 'top-four', 'top-five','top-six','top-seven'];
            $scope.badAPList=[];
            $.each(oResult, function (i, v) {
                v.color = classList[i];
                v.valuePercent = v.badStaCount +"%";
                $scope.badAPList.push(v);  
            });
        }
        /*************************************获取体验评分*************************************************/
        $scope.getExperienceScore = function(){
            $http({
                url:'/v3/stamonitor/stascore',
                method:'POST',
                data:{
                    method:'allNetStaAverScoreInDay',
                    param:{
                        sernarioId: $scope.sceneInfo.nasid,
                        date:g_time
                    }
                }

            }).success(function (data) {
                if(data.retcode ==0){
                    $scope.drawAllScore(data,1);
                }
            }).error(function() {
                /* Act on the event */
            });
        }
        /*****************************获取体验评分趋势***********************/
        $scope.getScoreTrend =function(){
            $http({
                url:'/v3/stamonitor/stascore',
                method:'POST',
                data:{
                    method:'allNetStaScoreListInDay',
                    param:{
                        date:g_time,
                        scenarioId: $scope.sceneInfo.nasid
                    }
                }
            }).success(function(data){
                var oResult = {
                    aXdata:[],
                    aYdata:[]
                }

                if(data.retcode ==0){
                    var aData = data.response;
                    aData.forEach(function (v, i) {
                        oResult.aXdata.push(new Date(v.time).Format('hh:mm'));
                        oResult.aYdata.push(parseInt(v.clientScore));
                    });
                    $scope.drawScoreChart(oResult);
                }
            }).error(function() {
                /* Act on the event */
            });
        }
        var g_result ={
            'score':{},
            'count':{}
        }
        /*****************************获取体验最差客户端*********************/
        $scope.getWorstExperience = function(){
            $http({
                url:'/v3/stamonitor/stascore',
                method:'POST',
                data:{
                    method:'allNetStaBadTopInDay',
                    param:{
                        date:g_time,
                        scenarioId: $scope.sceneInfo.nasid,
                        limitNum:20
                    }
                }
            }).success(function(data){
                var aResult = [];
                if(data.retcode ==0){
                    var aData = (data.scoreList.length > 5)?data.scoreList.slice(0, 5):data.scoreList;
                    aData.forEach(function(v,i){
                        aResult[i]={};
                        aResult[i].clientMAC = v.clientMAC;
                        aResult[i].clientScore = parseInt(v.clientScore);
                        g_result.score[v.clientMAC] =v.clientIP;
                    });
                    $scope.drawBadClient(aResult);
                } 
            }).error(function() {
                /* Act on the event */
            });
        }

        /*****************************获取体验差次数最多的客户端*********************/
        $scope.getExperienceCount = function(){
            $http({
                url:'/v3/stamonitor/stascore',
                method:'POST',
                data:{
                    method:'allNetStaBadScoreTimesTopInDay',
                    param:{
                        date:g_time,
                        scenarioId: $scope.sceneInfo.nasid,
                        limitNum:20
                    }
                }
            }).success(function(data){
                var aResult = [];
                if(data.retcode ==0){
                    var aData = (data.response.length > 5)?data.response.slice(0, 5):data.response;
                    aData.forEach(function(v,i){
                        aResult[i] = {};
                        aResult[i].clientMAC = v.clientMAC;
                        aResult[i].badScoreTimes = v.badScoreTimes;
                        g_result.count[v.clientMAC] = v.clientIP;
                    });
                    $scope.drawCountClient(aResult);
                } 
            }).error(function() {
                /* Act on the event */
            });
        }

        /*****************************获取体验差客户端个数最多的AP*********************/
        $scope.getMostAP = function(){
            $http({
                url:'/v3/stamonitor/stascore',
                method:'POST',
                data:{
                    method:'allNetBadStasAPTopInDay',
                    param:{
                        date:g_time,
                        scenarioId: $scope.sceneInfo.nasid,
                        limitNum:20
                    }
                }
            }).success(function(data){
                var aResult = [];
                if(data.retcode ==0){
                    var aData = (data.response.length >5)?data.response.slice(0, 5):data.response;
                    aData.forEach(function(v,i){
                        aResult[i]={};
                        aResult[i].apSN = v.apSN;
                        aResult[i].badStaCount = v.badStaCount;
                    });
                    $scope.drawBadAp(aResult);
                } 
            }).error(function() {
                /* Act on the event */
            });
        }
        $scope.goStaorAP = function (v) {
            if(v.apSN){
                $state.go('^.apindex88',{ApName:v.apSN,date:$('#daterange_sta').val()});
            }
            if(v.clientMAC&&v.badScoreTimes){
                var ipAddress = g_result.count[v.clientMAC];
                $state.go('^.exception88',{macAddress:v.clientMAC,ipAddress:ipAddress,date:$('#daterange_sta').val()});
            }else if(v.clientMAC&&v.clientScore){
                var ipAddress = g_result.score[v.clientMAC];
                $state.go('^.exception88',{macAddress:v.clientMAC,ipAddress:ipAddress,date:$('#daterange_sta').val()});
            }
            
        }
    }]
})