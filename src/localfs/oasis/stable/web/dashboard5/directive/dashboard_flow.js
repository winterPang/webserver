define(['angularAMD', 'jquery', 'utils', 'sprintf'],function(app, $, utils){
    var sLang = utils.getLang();
    var URL_TEMPLATE_FILE = sprintf('../dashboard5/views/%s/dashboard_flow.html', sLang);  
    app.directive('dashboardFlow', ['$timeout', '$rootScope', '$http', '$q',
        function($timeout, $rootScope, $http, $q){
            return{
                templateUrl: URL_TEMPLATE_FILE,
                restrict: 'E',
                scope: {
                    sn: '@'
                },
                replace: true,
                controller: function ($scope, $element, $attrs, $transclude) {
                },
                link: function ($scope, $element, $attrs, $ngModel) {
                    function getRcString(attrName) {
                        return utils.getRcString("dashboard_rc", attrName);
                    }
                    $scope.urlObj = {
                        getAllInterfaces:utils.getUrl('GET', '', '/devmonitor/getAllInterfaces', '/init/dashboard2/get_ap_count_by_status.json'),
                        setOneInterface:utils.getUrl('GET', '', '/devmonitor/setOneInterface', '/init/dashboard2/get_ap_count_by_status.json'),
                        getOneInterfaceData:utils.getUrl('GET', '', '/devmonitor/getOneInterfaceData', '/init/dashboard2/get_ap_count_by_status.json'),
                        getAllinterfaceFlow:utils.getUrl('GET', '', '/devmonitor/getAllInterfacesFlow', '/init/dashboard2/get_ap_count_by_status.json')
                    };
                    function addComma(sNum, Stype/*Stype=rate,.memory*/, nStart, nEnd) {
                        function doFormat(num, type, start, end) {
                            if (!(typeof(num) === "string" || typeof(num) === "number") || Number(num) != Number(num)) {
                                return num;
                            }
                            var max, len, remain, unit, fixed;
                            var flag = "";
                            start = start || 0;
                            end = typeof end == "undefined" ? 3 : end;
                            switch (type) {
                                case "memory":
                                    max = 1000;
                                    unit = ["B", "KB", "MB", "GB"];
                                    break;
                                case "rate":
                                    max = 1024;
                                    unit = ["bps", "Kbps", "Mbps", "Gbps"];
                                    break;
                                default:
                                    max = Infinity;
                                    unit = [""];
                                    fixed = 0;
                                    break;
                            }
                            if (num < 0) {
                                num = -num;
                                flag = "-"
                            }
                            while (num >= max && start < end) {
                                num = num / max;
                                start++;
                                fixed = 1;
                            }
                            num = Number(num).toFixed(fixed).split(".");
                            if (fixed) {
                                unit = "." + num[1] + unit[start];
                            } else {
                                unit = unit[start];
                            }
                            num = num[0];
                            len = num.length;
                            if (len < 3) {
                                return flag + num + unit;
                            }
                            remain = len % 3;
                            if (remain > 0) {
                                num = num.slice(0, remain) + "," + num.slice(remain, len).match(/\d{3}/g).join(",");

                            } else {
                                num = num.slice(remain, len).match(/\d{3}/g).join(",");
                            }
                            return flag + num + unit;

                        };

                        if ($.isPlainObject(sNum)) {
                            for (key in sNum) {
                                sNum[key] = doFormat(sNum[key], Stype, nStart, nEnd);
                            }
                        } else {
                            sNum = doFormat(sNum, Stype, nStart, nEnd);
                        }
                        return sNum;
                    }
                    // storage chart data
                    $scope.usageData = [];
                    // record request status
                    $scope.dataState = 0;
                    // judge request status, render chart
                    $scope.default = {
                        devSN:$scope.sn,
                        interfaceName:'',
                        name:getRcString("no_choose_port")
                    };

                    $scope.renderEchart = function(){
                        if($scope.dataState === 3){
                            var isInterface = false;
                            angular.forEach($scope.list,function(item,idx){
                                if(item.interfaceName === $scope.interfaceName){
                                    console.log('selectName')
                                    $scope.selectValue = item;
                                    isInterface = true;
                                }
                            });
                            if(!isInterface){
                                $scope.selectValue = $scope.default;
                            }
                            $scope.drawWanChart($scope.usageData)
                            $scope.$watch('selectValue',$scope.changeSelectValue)
                        }
                    };

                    $scope.changeSelectValue = function(n,o){
                        if(n.interfaceName){
                            var count = 0;
                            $http({
                                method:$scope.urlObj.getAllinterfaceFlow.method,
                                url:$scope.urlObj.getAllinterfaceFlow.url,
                                params: {
                                    'devSN': $scope.sn
                                }
                            }).success(function(data){
                                count++;
                                $scope.usageData[0] = data.DataList;
                                if(count === 2){
                                    $scope.drawWanChart($scope.usageData)
                                }
                            })

                            $http({
                                method:$scope.urlObj.setOneInterface.method,
                                url:$scope.urlObj.setOneInterface.url,
                                params:{
                                    'devSN': $scope.sn,
                                    interfaceName:$scope.selectValue.interfaceName,
                                    interfaceType:$scope.selectValue.interfaceType
                                }
                            }).success(function(data){
                                count++;
                                if(data.errcode === 0){
                                    $scope.usageData[1] = data.histdataList.dataList.reverse();
                                    $scope.usageData[1].name = $scope.getAbbreviate(data.histdataList.interfaceName);
                                    if(count ===2){
                                        $scope.drawWanChart($scope.usageData)
                                    }
                                }
                            })
                        }else{
                            if($scope.usageData.length === 2){
                                $scope.usageData.pop()
                                $scope.drawWanChart($scope.usageData)
                                $http({
                                    method:$scope.urlObj.setOneInterface.method,
                                    url:$scope.urlObj.setOneInterface.url,
                                    params:{
                                        'devSN': $scope.sn,
                                        interfaceName:$scope.selectValue.interfaceName,
                                        interfaceType:$scope.selectValue.interfaceType
                                    }
                                }).success(function(data){
                                    if(data.errcode === 0){
                                        console.log('success')
                                    }
                                })
                            }
                        }
                    };
                    //get list
                    $http({
                        method:$scope.urlObj.getAllInterfaces.method,
                        url:$scope.urlObj.getAllInterfaces.url,
                        params: {
                            'devSN': $scope.sn
                        }
                    }).success(function(data){
                        data.InterfaceList.forEach(function(item,idx){
                            item.name = $scope.getAbbreviate(item.interfaceName)
                        })
                        data.InterfaceList.unshift($scope.default);
                        $scope.list = data.InterfaceList;
                        $scope.dataState++;
                        $scope.renderEchart()
                    });
                    //get oneInterface
                    $http({
                        method:$scope.urlObj.getOneInterfaceData.method,
                        url:$scope.urlObj.getOneInterfaceData.url,
                        params: {
                            'devSN': $scope.sn
                        }
                    }).success(function(data){
                        $scope.dataState++;
                        if(data.flag === 0){
                            // console.log('flag === 0')
                            $scope.usageData[1] = data.histdataList.dataList.reverse();
                            $scope.usageData[1].name = $scope.getAbbreviate(data.histdataList.interfaceName);
                            $scope.interfaceName = data.histdataList.interfaceName
                        }
                        $scope.renderEchart()
                    });
                    //get all
                    $http({
                        method:$scope.urlObj.getAllinterfaceFlow.method,
                        url:$scope.urlObj.getAllinterfaceFlow.url,
                        params: {
                            'devSN': $scope.sn
                        }
                    }).success(function(data){
                        $scope.usageData[0] = data.DataList;
                        $scope.dataState++;
                        $scope.renderEchart()
                    });
                    $scope.timeStatus=function(time) {
                        // body...
                        if (time < 10) {
                            return "0" + time;
                        }
                        return time;
                    };
                    $scope.getAbbreviate = function getAbbreviate(str){
                        var firstLetter = str[0]
                        switch(firstLetter){
                            case 'G':
                                return Array.prototype.slice.call(/(G)igabit(E)thernet(\d\/\d\/*\d*)/.exec(str),1).join('').toUpperCase();
                            case 'T':
                                return Array.prototype.slice.call(/(Ten)-GigabitEthernet(\d\/\d\/*\d*)/.exec(str),1).join('');
                            case 'B':
                                return Array.prototype.slice.call(/(B)ridge-(Agg)regation(\d*)/.exec(str),1).join('').toUpperCase();
                            case 'F':
                                return Array.prototype.slice.call(/(Forty)GigE(\d\/\d\/\d*)/.exec(str),1).join('');
                        }
                    };
                    $scope.drawWanChart=function(aData){
                        var chartWan = document.getElementById("usage");
                        if (!chartWan) {return;}
                        chartWan = echarts.init(chartWan);
                        var aTimes = [];
                        var aServices = [];
                        var aLegend = [getRcString("ZONGLIANG")];
                        var aTooltip = getRcString("total_flow_up_down").split(",");
                        var aColor = ["rgba(29,143,222,.2)","rgba(186,85,211,.2)"];
                        // var reg = /./;
                        // var reg2 = /G\d{1,2}/;
                        // var aColor = ["rgba(120,206,195,1)", "rgba(254,240,231,1)", "rgba(144,129,148,1)", "rgba(254,184,185,1)"];
                        //x-time
                        $.each(aData[0], function(i, oData) {
                            var temp = new Date(oData.updateTime);
                            aTimes.push(($scope.timeStatus(temp.getHours())||'00') + ":" + ($scope.timeStatus(temp.getMinutes())||'00') + ":" + ($scope.timeStatus(temp.getSeconds())||'00'));
                        });
                        angular.forEach(aData, function(oData,i) {
                            if(i === 1){
                                aLegend.push(oData.name +" "+getRcString("LIULIANG"));
                                aTooltip.push(oData.name+" " +getRcString("STREAM").split(",")[0],oData.name+" " +getRcString("STREAM").split(",")[1])
                            }


                            var aUp = [];
                            var aDown = [];
                            angular.forEach(aData[i], function(oData,i) {
                                aUp.push(oData.speed_up);
                                aDown.push(-oData.speed_down);
                            });

                            var oUp = {
                                symbol: "none",
                                type: 'line',
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            type: 'default',
                                            color: aColor[i]
                                        }
                                    }
                                },
                                name: aLegend[i],
                                data: aUp
                            };
                            var oDown = {
                                symbol: "none",
                                type: 'line',
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            type: 'default',
                                            color: aColor[i]

                                        }
                                    }
                                },
                                name: aLegend[i],
                                data: aDown
                            };
                            //
                            aServices.push(oUp);
                            aServices.push(oDown);
                        });

                        var chartWanOption = {
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
                                }
                                ,formatter: function(y) {
                                    var sTips = y[0][1] + '<br/>';
                                    y.forEach(function(item,idx){
                                        sTips += aTooltip[idx] + ':' + addComma(Math.abs(item[2]), "rate", 1) +"<br/>"
                                    });
                                    return sTips;
                                }
                            },
                            legend: {
                                orient: "horizontal",
                                y: 0,
                                x: "center",
                                data: aLegend
                            },
                            grid: {
                                x: 100,
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
                                    }
                                },
                                axisTick: {
                                    show: false
                                },
                                data: aTimes
                            }],
                            yAxis: [{
                                type: 'value',
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#80878C',
                                        width: 2
                                    },
                                    formatter: function(nNum) {
                                        return addComma(Math.abs(nNum), 'rate', 1);
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
                            series: aServices,
                            color: ["rgba(29,143,222,.4)","rgba(75,0,130,.4)"]
                        };
                        chartWan.setOption(chartWanOption);
                    };

                }
            };
        }
    ]);
});
