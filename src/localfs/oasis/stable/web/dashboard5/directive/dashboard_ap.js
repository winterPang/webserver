define(['angularAMD', 'jquery', 'utils', 'sprintf'],function(app, $, utils){
    var sLang = utils.getLang();
    var URL_TEMPLATE_FILE = sprintf('../dashboard5/views/%s/dashboard_ap.html', sLang);
    var URL_GET_ap = '/v3/apmonitor/getApCountByStatus';
    app.directive('dashboardAp', ['$timeout', '$rootScope', '$http', '$q',
        function ($timeout, $rootScope, $http, $q) {
            return {
                templateUrl: URL_TEMPLATE_FILE,
                restrict: 'E',
                scope: {
                    sn: '@'
                },
                replace: true,
                controller: function ($scope, $element, $attrs, $transclude) {
                },
                link: function ($scope, $element, $attrs, $ngModel) {
                    $scope.apCount=function(){
                        $http.get(URL_GET_ap+'?devSN='+$scope.sn).success(function (data) {
                            $scope.apOnline = data.ap_statistic.online;
                            $scope.apTotal = data.ap_statistic.online + data.ap_statistic.offline + data.ap_statistic.other;
                            if ($scope.apTotal == 0) {
                                $scope.drawEmptyPie('pie_aps', '28%');
                            } else {
                                var datas = [{
                                    name: $scope.onlineAp,//getRcString("ONLINEAP"),
                                    value: data.ap_statistic.online
                                }, {
                                    name: $scope.offlineAp,//getRcString("OFFLINEAP"),
                                    value: data.ap_statistic.offline
                                }];
                                $scope.drawChartScore(datas);
                            }
                        }).error(function () {});
                    };
                    $scope.apCount();
                    $scope.refreshAP=function(){
                        $scope.apCount();
                    };
                    $scope.drawChartScore=function(aData){
                        var apCount = echarts.init(document.getElementById('pie_aps'));
                        var apOption = {
                            //color: '#4EC1B2',
                            animation: true,
                            calculable: false,
                            height: 245,
                            tooltip: {
                                show: true,
                                formatter: function (aData) {
                                    var sLable = aData[1] + ":<br/> " + aData[2] + " (" + Math.round(aData[3]) + "%)";
                                    return sLable;
                                }
                            },
                            series: [{
                                name: 'APs',
                                type: 'pie',
                                minAngle: '3',
                                radius: '55%',
                                // selectedMode: "single",
                                // selectedOffset: 10,
                                center: ['50%', '28%'],
                                itemStyle: {
                                    normal: {
                                        //color: '#4EC1B2',
                                        borderColor: "#FFF",
                                        borderWidth: 1,
                                        label: {
                                            position: 'inner',
                                            formatter: function (a, b, c, d) {
                                                return Math.round(a.percent) + "%";
                                            }
                                        },
                                        labelLine: false
                                    },
                                    emphasis: {
                                        label: {
                                            show: true,
                                            textStyle: {
                                                color: "#000"
                                            }
                                        },
                                        labelLine: false
                                    }
                                },
                                data: aData
                                /* [
                                 {value:aData.ap_statistic.online, name:'在线AP数'},
                                 {value:aData.ap_statistic.offline,name:'离线AP数'}
                                 ]*/
                            }],
                            color:["#78CEC3", "#E2E2E2"]
                        };
                        apCount.setOption(apOption);
                    };
                    $scope.drawEmptyPie=function(){
                        var terminalAuth = echarts.init(document.getElementById('pie_aps'));
                        var terAuthOption = {
                            height: 245,
                            calculable: false,
                            tooltip: {
                                show: true,
                                trigger: 'item'
                            },
                            series: [
                                {
                                    type: 'pie',
                                    minAngle: '3',
                                    radius: '55%',
                                    center: ['50%', '28%'],
                                    itemStyle: {
                                        normal: {
                                            color: "#E2E2E2",
                                            labelLine: {
                                                show: false
                                            },
                                            label: {
                                                position: "inner"
                                            }
                                        }
                                    },
                                    data: [{name: 'N/A', value: 1}]
                                }
                            ]
                        };
                        terminalAuth.setOption(terAuthOption);
                    }
                }
            }
        }
    ]);
});
