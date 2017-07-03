define(["angularAMD", "utils", "echarts", "moment", "sprintf"], function (app, Utils, echarts, moment) {
	var sLang = Utils.getLang() || "cn";
	var sTemplateUrl = sprintf('../wirelessterminal2/views/%s/wireless_ter.html', sLang);
	// directive
	app.directive("xanthter", ["$http", "$filter", function ($http, $filter) {
		return {
			restrict: "E",
			replace: true,
			templateUrl: sTemplateUrl,
			scope: {sn: "@", nasid: '@'},
			link: function (scope) {

                function getRcText(str) {
                    return str.split(',');
                }

				function getOneDayData(dateTimeMS) {
					$http({
						method: 'post',
						url: '/v3/stamonitor/monitor',
						data: {
							method: 'getOnlineClientDayStatByScenarioid',
							param: {
                                scenarioid: scope.nasid,
                                dateTime: dateTimeMS
							}
						}
					}).success(function (data) {
						if (data.errCode !== 0) {return;}

						angular.forEach(data.response, function (value) {
                            value.time = (value.time===null ? '-' : value.time);
                            value.totalCount = (value.totalCount===null ? '-' : value.totalCount);
                            value.authTotalCount = (value.authTotalCount===null ? '-' : value.authTotalCount);
						});
                        initUserChart(data.response, 'yesterday', true, "oneDayUserChart");
					});
				}

                function initDateRangePicker() { // 时间选择插件
                    var config = {
                        startDate: moment().startOf('day'),
                        endDate: moment().startOf('day'),
                        minDate: moment().subtract(29, 'day').startOf('day'),
						maxDate: moment().startOf('day'),
                        dateLimit: {days: 1},
						singleDatePicker: true,
                        opens: "left",
                        locale: {}
                    };
                    var oLocale = {
                        format: "YYYY-MM-DD",
                        daysOfWeek: getRcText(scope['dateRangePicker_week']),
                        monthNames: getRcText(scope['dateRangePicker_month'])
                    };
                    if (Utils.getLang() !== 'en') {
                        config.locale = oLocale;
                    } else {
                        config.locale.format = "YYYY-MM-DD";
                    }
                    $('#dateRangePicker').daterangepicker(config, function (start, end, label) {
                        getOneDayData(start.valueOf());
                    });
                }


				function initUserChart (data, dateType, count, id) {
					var aTime = [],
						aTotalCount = [],
						aAuthTotalCount = [];
					angular.forEach(data, function (value) {
						aTime.push(value.time);
						aTotalCount.push(value.totalCount);
						aAuthTotalCount.push(value.authTotalCount);
						if (value.totalCount!=='-' || value.authTotalCount!=='-') {
                            count = false;
						}
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
							data: scope.user_total_count.split(",")
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
								interval: dateType === "yesterday" ? 11 : 'auto',
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
							min: 0,
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
								data: aTotalCount,
								itemStyle: {
									normal: {
										areaStyle: {type: "default"}
									}
								},
								name: scope.user_total_count.split(",")[0],
								smooth: true,
								symbol: "none",
								type: "line"
							},
							{
								data: aAuthTotalCount,
								itemStyle: {
									normal: {
										areaStyle: {type: "default"}
									}
								},
								name: scope.user_total_count.split(",")[1],
								smooth: true,
								symbol: "none",
								type: "line"
							}
						]
					};
					var oChartEle = document.getElementById(id);
					if (!oChartEle) {return;}
					var oChart = echarts.init(oChartEle);
					oChart.setOption(oChartOpt);
				}
				function getUserData(dateType) {
					dateType = (dateType == 'oneday' ? 'yesterday' : dateType);
					$http({
						url: "/stamonitor/monitor",
						method: "POST",
						data: {
							method: "getclientcountbyscenarioid_" + dateType,
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
								method: "getclientcountbyscenarioid_" + dateType,
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
									authTotalCount: value.totalCount===null ? '-' : value.totalCount,
									totalCount: aData[index]['totalCount']===null ? '-' : aData[index]['totalCount']
								});
								if(value.totalCount!=="-" || aData[index]['totalCount']!=='-') {
									count = false;
								}
							});
							//aResult = $.extend(true, aData, aResult);
							initUserChart(aResult, dateType, count, "userTotalChart");
						});
					});
				}


                function init() {
                    getOneDayData( moment().startOf("day").valueOf() );
                    getUserData("onemonth");
                    initDateRangePicker();
				}

				init();

			}
		};
	}]);
});