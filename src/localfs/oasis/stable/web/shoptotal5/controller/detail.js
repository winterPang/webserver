define(["utils", "moment", "echarts", "bootstrap-daterangepicker", "css!bootstrap_daterangepicker_css"], function (Utils, moment, echarts) {
	return ["$scope", "$http", "$alertService", "$interval", function ($scope, $http, $alert, $interval) {
		function getRcString(attrName){
            return Utils.getRcString("shoptotal_rc",attrName);
        }

        angular.element('#daterange').daterangepicker(
        	{
		        startDate: moment().startOf("day"),
		        endDate: moment(),
		        maxDate: moment(),
		        dateLimit: {days: 7},
		        timePicker: true,
		        timePicker24Hour: true,
		        timePickerSeconds: true,
		        opens: "left",
		        locale: {
		            format: "YYYY/MM/DD HH:mm:ss",
		            applyLabel : getRcString("DRP_APPLYLABEL"),
		            cancelLabel : getRcString("DRP_CANCELLABEL"),
		            fromLabel : getRcString("DRP_FROMLABEL"),
		            toLabel : getRcString("DRP_TOLABEL"),
		            customRangeLabel : getRcString("DRP_CUSTOMRANGELABEL"),
		            daysOfWeek : getRcString("DRP_DAYSOFWEEK"),
		            monthNames : getRcString("DRP_MONTHNAMES"),
		        }
		    },
		    function(start, end, label) {
		        //console.log(
		        //    start.format("YYYY/MM/DD HH:mm:ss") + " - " + end.format("YYYY/MM/DD HH:mm:ss")
		        //);
		    }
        );
        angular.element('#dater').daterangepicker(
        	{
		        startDate: moment().startOf("day"),
		        endDate: moment(),
		        maxDate: moment(),
		        dateLimit: {days: 7},
		        timePicker: true,
		        timePicker24Hour: true,
		        timePickerSeconds: true,
		        opens: "left",
		        locale: {
		            format: "YYYY/MM/DD HH:mm:ss",
		            applyLabel : getRcString("DRP_APPLYLABEL"),
		            cancelLabel : getRcString("DRP_CANCELLABEL"),
		            fromLabel : getRcString("DRP_FROMLABEL"),
		            toLabel : getRcString("DRP_TOLABEL"),
		            customRangeLabel : getRcString("DRP_CUSTOMRANGELABEL"),
		            daysOfWeek : getRcString("DRP_DAYSOFWEEK"),
		            monthNames : getRcString("DRP_MONTHNAMES"),
		        }
		    },
		    function(start, end, label) {
		        //console.log(
		        //    start.format("YYYY/MM/DD HH:mm:ss") + " - " + end.format("YYYY/MM/DD HH:mm:ss")
		        //);
		    }
        );
        angular.element('#date').daterangepicker(
        	{
		        startDate: moment().startOf("day"),
		        endDate: moment(),
		        maxDate: moment(),
		        dateLimit: {days: 7},
		        timePicker: true,
		        timePicker24Hour: true,
		        timePickerSeconds: true,
		        opens: "left",
		        locale: {
		            format: "YYYY/MM/DD HH:mm:ss",
		            applyLabel : getRcString("DRP_APPLYLABEL"),
		            cancelLabel : getRcString("DRP_CANCELLABEL"),
		            fromLabel : getRcString("DRP_FROMLABEL"),
		            toLabel : getRcString("DRP_TOLABEL"),
		            customRangeLabel : getRcString("DRP_CUSTOMRANGELABEL"),
		            daysOfWeek : getRcString("DRP_DAYSOFWEEK"),
		            monthNames : getRcString("DRP_MONTHNAMES"),
		        }
		    },
		    function(start, end, label) {
		        //console.log(
		        //    start.format("YYYY/MM/DD HH:mm:ss") + " - " + end.format("YYYY/MM/DD HH:mm:ss")
		        //);
		    }
        );

        $http.post("/v3/ace/oasis/auth-data/o2oportal/location/LocationImage", {
	        userId: "oasis_test",
	        shopName: "B2实验室"
	    }).success(function (data, status, header, config){
	        $scope.mapInfo.locationImage = data.locationImage;
	        $scope.mapInfo.curMapIterm = data.locationImage[0];
	        $("#mapImage").bind("load", function () {
	            $scope.$apply(function () {
	                $scope.style = {
	                    relative: {"position": "relative"},
	                    map: {
	                        "position": "absolute",
	                        "top": 0
	                    }
	                };
	            });
	            $scope.$apply(resetSize);
	            drawHeatMapLayer();
	            drawAreaLayer();
	            $scope.timer = $interval(function () {
	                drawHeatMapLayer();
	            }, 10000);
	            $scope.$on("$destroy", function () {
	                $interval.cancel($scope.timer);
	            });
	        });
	    }).error(function (data, status, header, config) {

	    });


        // var conditionOnlineTimeUrl = Utils.getUrl('GET','','/stamonitor/getclientlistbycondition','/init/customer5/bycondition_onlinetime.json');
        // $http({
        //     // url:conditionOnlineTimeUrl.url,
        //     method:conditionOnlineTimeUrl.method,
        //     params:{'devSN':$scope.sceneInfo.sn,'reqType':'onlinetime'}
        //     }).success(function(data){
                var stayChart = echarts.init(document.getElementById('Terminal_firm'));                
                // if(data.clientList.halfhour==0 && data.clientList.onehour==0 && data.clientList.twohour==0&& data.clientList.greatertwohour==0){
                //     stayChart.setOption(grayOption);
                //     return;
                // }
                var type = getRcString("stayType").split(',');
                // var aType = [
                //     { name: type[0], value: data.clientList.halfhour},
                //     { name: type[1], value: data.clientList.onehour},
                //     { name: type[2], value: data.clientList.twohour},
                //     { name: type[3], value: data.clientList.greatertwohour}
                // ];    
                var aType = [
                    { name: type[0], value: 10},
                    { name: type[1], value: 23},
                    { name: type[2], value: 16},
                    { name: type[3], value: 17}
                ];              
                var stayOption ={
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient : 'vertical',
                        y : 'bottom',
                        data:[type[0],type[1],'',type[2],type[3]]
                    },
                    series : [
                        {
                            type:'pie',
                            radius : ['40%', '55%'],
                            center: ['48%', '35%'],
                            itemStyle : {
                                normal : {
                                    label : {
                                        show : false
                                    },
                                    labelLine : {
                                        show : false
                                    }
                                }
                            },
                            data:aType
                        }
                    ],
                    color: ['#4ec1b2', '#ff9c9e', '#fbceb1', '#b3b7dd']
                }                   
                stayChart.setOption(stayOption);            
                var normalnumber = getRcString("custCount").split(',');
                var appendTohtml = [
                    '<div style="position: relative;top: -160px;margin: 0 auto;width: 100px;"><div><span style="font-size: 16px; color:#343e4e; display: block;float: left; margin-left: 10px; margin-top: 2px;">',
                    normalnumber[1],
                    '</span>',
                    '</div>'
                    ].join(" ");
                    $(appendTohtml).appendTo($("#Terminal_firm"));
        //     }).error(function(data,header,config,status){            
        // });
        //wu shu ju xian shu de hui tu 
        var grayOption = {
            height:200,
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : ['40%', '55%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner"
                            }
                        }
                    },
                    data: [{name:'N/A',value:1}]
                }
            ],
            color : ["rgba(216, 216, 216, 0.75)"]
        }
        
        $scope.myechart = function(newcouver,time){
            var customerChart=echarts.init(document.getElementById('loginusermit'));
            var customerOption = {
                color: ['#4EC1B2'],
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [getRcString("shopName")]
                },
                grid: {
                    x: '30',
                    y: '30',
                    x2: '30',
                    y2: '30',
                    containLabel: true,
                    borderWidth: 0
                },
                calculable: true,
                xAxis: [
                    {
                        //type : 'time',
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
                            show: false
                        },
                        boundaryGap: false,
                        data: [1,2,3,4,5,6,7,8]
                    }
                ],
                yAxis: [
                    {
                        axisLine: {
                            show: false
                        },
                        type: 'value',
                        splitNumber: 5,
                        splitLine: {
                            lineStyle: {
                                color: '#eee'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#617085'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: getRcString("shopName"),
                        type: 'line',
                        symbol: 'none',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: 'default'
                                },
                                lineStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        data: [5,6,4,5,3,2,1,5]
                    }
                ]
            };
            customerChart.setOption(customerOption);
        }
        $scope.comeEchart = function(newcouver,time){
            var customerChart=echarts.init(document.getElementById('comeshop'));
            var customerOption = {
                color: ['#4EC1B2'],
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [getRcString("shopin")]
                },
                grid: {
                    x: '30',
                    y: '30',
                    x2: '30',
                    y2: '30',
                    containLabel: true,
                    borderWidth: 0
                },
                calculable: true,
                xAxis: [
                    {
                        //type : 'time',
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
                            show: false
                        },
                        boundaryGap: false,
                        data: [1,2,3,4,5,6,7,8]
                    }
                ],
                yAxis: [
                    {
                        axisLine: {
                            show: false
                        },
                        type: 'value',
                        splitNumber: 5,
                        splitLine: {
                            lineStyle: {
                                color: '#eee'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#617085'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: getRcString("shopin"),
                        type: 'line',
                        symbol: 'none',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: 'default'
                                },
                                lineStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        data: [5,6,4,5,3,2,1,5]
                    }
                ]
            };
            customerChart.setOption(customerOption);
        }
        $scope.outEchart = function(newcouver,time){
            var customerChart=echarts.init(document.getElementById('outshop'));
            var customerOption = {
                color: ['#4EC1B2'],
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: [getRcString("shopout")]
                },
                grid: {
                    x: '30',
                    y: '30',
                    x2: '30',
                    y2: '30',
                    containLabel: true,
                    borderWidth: 0
                },
                calculable: true,
                xAxis: [
                    {
                        //type : 'time',
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
                            show: false
                        },
                        boundaryGap: false,
                        data: [1,2,3,4,5,6,7,8]
                    }
                ],
                yAxis: [
                    {
                        axisLine: {
                            show: false
                        },
                        type: 'value',
                        splitNumber: 5,
                        splitLine: {
                            lineStyle: {
                                color: '#eee'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#617085'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: getRcString("shopout"),
                        type: 'line',
                        symbol: 'none',
                        smooth: true,
                        itemStyle: {
                            normal: {
                                areaStyle: {
                                    type: 'default'
                                },
                                lineStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        data: [5,6,4,5,3,2,1,5]
                    }
                ]
            };
            customerChart.setOption(customerOption);
        }
        $scope.comeEchart();
        $scope.myechart();
        $scope.outEchart();
    }]
});