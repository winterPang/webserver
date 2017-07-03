define(["angularAMD", "utils", "echarts", "sprintf"], function (app, Utils, echarts) {
    var sLang = Utils.getLang() || "cn";
    var sTemplateUrl = sprintf('../wirelessterminal2/views/%s/wireless_view.html', sLang);
    // directive
    app.directive("xanthview", ["$http", "$filter", function ($http, $filter) {
        return {
            restrict: "E",
            replace: true,
            templateUrl: sTemplateUrl,
            scope: {sn: "@", nasid: '@'},
            link: function (scope) {
                // initChart
                function initUserChart (data, dateType, count) {
                    var aTime = [],
                        aNewUserCount = [],
                        aNewAuthUserCount = [];
                    angular.forEach(data, function (value) {
                        aTime.push(value.time);
                        aNewUserCount.push(value.totalCount===null ? '-' : value.totalCount);
                        aNewAuthUserCount.push(value.authTotalCount===null ? '-' : value.authTotalCount);
                    });

                    var oChartOpt = {
                        color: ["rgba(29,143,222,.5)","rgba(186,85,211,.5)"],
                        tooltip: {
                            show: true,
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
                                var secondParams = params[1] && params[1].seriesName + " : " + params[1].value;
                                return $filter("date")(params[0].name, "yyyy-MM-dd HH:mm:ss") + "<br/>"
                                    + params[0].seriesName + " : " + params[0].value + "<br/>"
                                    + (secondParams || "");
                            }
                        },
                        legend: {
                            orient: "horizontal",
                            y: 0,
                            x: "center",
                            data: scope.new_user_count.split(",")
                        },
                        grid: {
                            x: 60,
                            y: 40,
                            borderColor: '#FFF'
                        },
                        calculable: false,
                        xAxis: [{
                            type: 'category',
                            boundaryGap: false,
                            splitLine: true,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#80878C',
                                    width: 2
                                }
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#80878C',
                                    width: 2
                                },
                                formatter: function (value) {
                                    if (dateType === "yesterday") {
                                        return $filter("date")(value, "HH:mm");
                                    }
                                    return $filter("date")(value, "MM-dd");
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            data: aTime
                        }],
                        yAxis: [{
                            name: scope.user_count,
                            type: 'value',
                            max: count ? 5 : undefined,
                            min:0,
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#80878C',
                                    width: 2
                                }
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#80878C',
                                    width: 2
                                }
                            }
                        }],
                        series: [
                            {
                                data: aNewUserCount,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {type: "default"}
                                    }
                                },
                                name: scope.new_user_count.split(",")[0],
                                smooth: true,
                                symbol: "none",
                                type: "line"
                            },
                            {
                                data: aNewAuthUserCount,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {type: "default"}
                                    }
                                },
                                name: scope.new_user_count.split(",")[1],
                                smooth: true,
                                symbol: "none",
                                type: "line"
                            }
                        ]
                    };
                    var oChartEle = document.getElementById("newUserChart");
                    if (!oChartEle) {return;}
                    var oChart = echarts.init(oChartEle);
                    oChart.setOption(oChartOpt);
                }
                // getData
                function getUserData(dateType) {
                    dateType = (dateType === 'oneday' ? 'yesterday' : dateType);
                    $http({
                        url: "/stamonitor/monitor",
                        method: "POST",
                        data: {
                            method: "getnewvisitorbyscenarioid_" + dateType,
                            param: {
                                scenarioid: scope.nasid,
                                dataType: ""
                            }
                        }
                    }).then(function (data) {
                        var aData = data.data.response;
                        $http({
                            url: "/stamonitor/monitor",
                            method: "POST",
                            data: {
                                method: "getnewvisitorbyscenarioid_" + dateType,
                                param: {
                                    scenarioid: scope.nasid,
                                    dataType: "auth"
                                }
                            }
                        }).success(function (data) {
                            var aResult = [];
                            var count = true;
                            angular.forEach(data.response, function (value, index) {
                                aResult.push({
                                    time: value.time,
                                    authTotalCount: value.totalCount
                                });
                                if (value.totalCount!=='-' || aData[index]['totalCount']!=='-') {
                                    count = false;
                                }
                            });
                            aResult = $.extend(true, aData, aResult);
                            initUserChart(aResult, dateType, count);
                        });
                    });
                }
                // click fun
                scope.click = {
                    dateType: "oneday"
                };
                scope.click.btn = function (dateType) {
                    scope.click.dateType = dateType;
                    getUserData(dateType);
                };
                getUserData("oneday");
            }
        };
    }]);
});