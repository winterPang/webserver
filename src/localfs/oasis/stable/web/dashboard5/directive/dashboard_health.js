define(['angularAMD', 'jquery', 'utils', 'sprintf'],function(app, $, utils){
    var sLang = utils.getLang();
    var URL_TEMPLATE_FILE = sprintf('../dashboard5/views/%s/dashboard_health.html', sLang);
    var URL_GET_HEALTH = '/v3/health/home/health';
    var URL_GET_BAND=  '/v3/devmonitor/getbandwidth';
    var URL_SET_BAND='/v3/devmonitor/setbandwidth';
    var URL_GET_SYSTEM='/v3/devmonitor/web/system';
    var URL_GET_DEV='/v3/base/getDev';
    app.directive('dashboardHealth', ['$timeout', '$rootScope', '$http', '$q','$alertService',
        function($timeout, $rootScope, $http, $q,$alert){
            return{
                templateUrl: URL_TEMPLATE_FILE,
                restrict: 'E',
                scope: {
                    sn: '@',
                    permission:'='
                },
                replace: true,
                controller: function ($scope, $element, $attrs, $transclude) {
                },
                link: function ($scope, $element, $attrs, $ngModel) {
                    /*$scope.$watch('permission',function(){
                        console.log($scope.permission.write);
                    });*/
                    $scope.healthDegree=function(){
                        $http.get(URL_GET_HEALTH+'?acSN='+$scope.sn).success(function(data){
                            console.log(data);
                            var aData = $.parseJSON(data);
                            var healthData = JSON.parse(aData);
                            console.log(healthData.finalscore);
                            if (healthData==-1) {
                                healthData = {
                                    finalscore: 0,
                                    wanspeed: 0,
                                    APpercent: 0,
                                    clientspeed: 0,
                                    security: 0,
                                    wireless: 0,
                                    system: 0,
                                    Bpercent: 0
                                };
                            }
                            $scope.drawScorePie(healthData, 1);
                            $scope.showMessage(healthData);
                            $scope.initHealthScore(healthData);
                            $scope.getBandWidth();
                        }).error(function(){
                            $scope.isFail = false;
                            $scope.isSuccess = false;
                        });
                    };
                    $scope.healthDegree();
                    $scope.showMessage = function (oData) {
                        $scope.isFail = false;
                        $scope.isSuccess = false;
                        if (oData.finalscore == 0) {
                        } else if (oData.finalscore < 40) {
                            $scope.isFail = true;
                            $scope.getPercent = oData.Bpercent;
                        } else if (oData.finalscore < 70) {
                            $("#terminalMessage").css("color", "#fbceb1");
                            $scope.isSuccess = true;
                            $scope.getPercent = oData.Bpercent;
                            $scope.terminalMessage =$scope.TIP1;// getRcString("TIP2");
                        } else if (oData.finalscore <= 100) {
                            $("#terminalMessage").css("color", "#4ec1b2");
                            $scope.isSuccess = true;
                            $scope.getPercent = oData.Bpercent;
                            if (oData.finalscore < 80) {
                                $scope.terminalMessage =$scope.TIP2;// getRcString("TIP3");
                            } else if (oData.finalscore < 90) {
                                $scope.isSuccess = true;
                                $scope.getPercent = oData.Bpercent;
                                $scope.terminalMessage =$scope.TIP3;// getRcString("TIP4");
                            } else {
                                $scope.isSuccess = true;
                                $scope.getPercent = oData.Bpercent;
                                $scope.terminalMessage =$scope.TIP4;// getRcString("TIP5");
                            }
                        }
                    };
                    $scope.drawScorePie = function (aData, status) {
                        var scorePie = echarts.init(document.getElementById('score-pie'));
                        var labelTop = {
                            normal: {
                                color: (status == 1 ? ((aData.finalscore >= 80 ? "#4ec1b2" : (aData.finalscore >= 60 ? "#fbceb1" : "#fe808b"))) : "#f5f5f5"),
                                label: {
                                    show: false,
                                    position: 'center',
                                    formatter: '{b}',
                                    textStyle: {
                                        baseline: 'bottom'
                                    }
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        };
                        var labelFromatter = {
                            normal: {
                                label: {
                                    formatter: function (params) {
                                        return 100 - params.value
                                    },
                                    textStyle: {
                                        baseline: 'top',
                                        fontSize: 20,
                                        color: '#4EC1B2'
                                    }
                                }
                            }
                        };
                        var labelBottom = {
                            normal: {
                                color: '#fff',
                                label: {
                                    show: true,
                                    position: 'center',
                                    textStyle: {
                                        baseline: 'middle',
                                        fontSize: 20,
                                        color: "#646D77"
                                    }
                                },
                                labelLine: {
                                    show: false
                                }
                            },
                            emphasis: {
                                color: 'rgba(0,0,0,0)'
                            }
                        };
                        var radius = [50, 60];
                        scoreOption = {
                            series: [
                                {
                                    type: 'pie',
                                    center: ['50%', '40%'],
                                    radius: radius,
                                    x: '80%', // for funnel
                                    itemStyle: labelFromatter,
                                    data: [
                                        {value: 100 - aData.finalscore, itemStyle: labelBottom},
                                        {value: aData.finalscore, itemStyle: labelTop}
                                    ]
                                }
                            ]
                        };
                        scorePie.setOption(scoreOption);
                    };
                    $scope.initHealthScore = function (aData) {
                        if (!aData) {
                        }
                        $scope.healthGrade(aData.wanspeed, "#raty_score_1 li");
                        $scope.healthGrade(aData.APpercent, "#raty_score_2 li");
                        $scope.healthGrade(aData.clientspeed, "#raty_score_3 li");
                        $scope.healthGrade(aData.security, "#raty_score_4 li");
                        $scope.healthGrade(aData.wireless, "#raty_score_5 li");
                        $scope.healthGrade(aData.system, "#raty_score_6 li");
                    };
                    $scope.healthGrade = function (sizeof, selector) {
                        if(sizeof<=2){
                            for (var i = 0; i < sizeof; i++) {
                                $(selector).eq(i).removeClass('emptyStar').addClass('dangerStar');
                            }
                        }else if(sizeof==3){
                            for (var i = 0; i < sizeof; i++) {
                                $(selector).eq(i).removeClass('emptyStar').addClass('warningStar');
                            }
                        }else if(sizeof>3){
                            for (var i = 0; i < sizeof; i++) {
                                $(selector).eq(i).removeClass('emptyStar').addClass('lightStar');
                            }
                        }                       
                    };
                    //system info
                    $scope.systemInfo = {
                        options: {
                            mId: 'systemInfo',
                            title: $scope.FORM_TITLE,//getRcString("FORM_TITLE"),
                            autoClose: true,
                            showCancel: false,
                            buttonAlign: "center",
                            modalSize: 'lg',
                            showHeader: true,
                            showFooter: true,
                            searchable: true,
                            okText: $scope.CANCEL,
                            okHandler: function (modal, $ele) {
                                //add ap to ap group
                                //$scope.$broadcast('show#systemInfo');
                            },
                            cancelHandler: function (modal, $ele) {
                            },
                            beforeRender: function ($ele) {
                                return $ele;
                            }
                        }
                    };
                    $scope.drawCircleScore = function (jEle, val, sName) {
                        var circlePie = echarts.init(document.getElementById(jEle));
                        var labelTop = {
                            normal: {
                                color: '#4EC1B2',
                                label: {
                                    show: true,
                                    position: 'center',
                                    formatter: '{b}',
                                    textStyle: {
                                        baseline: 'bottom',
                                        color: '#4EC1B2'
                                    }
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        };
                        var labelFromatter = {
                            normal: {
                                label: {
                                    formatter: function (params) {
                                        return 100 - params.value + '%'
                                    },
                                    textStyle: {
                                        baseline: 'top',
                                        color: '#0096D6'
                                    }
                                }
                            }
                        };
                        var labelBottom = {
                            normal: {
                                color: '#ccc',
                                label: {
                                    show: true,
                                    position: 'center'
                                },
                                labelLine: {
                                    show: false
                                }
                            },
                            emphasis: {
                                color: 'rgba(0,0,0,0)'
                            }
                        };
                        var radius = [40, 55];
                        var circleOption = {
                            series: [
                                {
                                    type: 'pie',
                                    center: ['40%', '50%'],

                                    radius: radius,
                                    x: '0%', // for funnel
                                    itemStyle: labelFromatter,
                                    data: [
                                        {name: 'other', value: 100 - val, itemStyle: labelBottom},
                                        {name: sName, value: val, itemStyle: labelTop}
                                    ]
                                }
                            ]
                        };
                        circlePie.setOption(circleOption);
                    };
                    $scope.systemInformation = function () {
                        $http.get(URL_GET_SYSTEM+'?devSN='+$scope.sn).success(function(data){
                            $scope.nCpu = parseInt(data.cpuRatio);
                            $scope.nMem = parseInt(data.memoryRatio);
                            $scope.drawCircleScore('gauge_cpu', $scope.nCpu, $scope.cpu);
                            $scope.drawCircleScore('gauge_mem', $scope.nMem, $scope.memory);
                            $scope.devMode=data.devMode;
                            //angular.element("#devMode").html(data.devMode);
                            //angular.element("#SerialNumber").html($scope.sn);
                            $scope.devSoftVersion=data.devSoftVersion;
                            //angular.element("#devSoftVersion").html(data.devSoftVersion);
                            $scope.devHardVersion=data.devHardVersion;
                            //angular.element("#devHardVersion").html(data.devHardVersion);
                            $scope.devBootWare=data.devBootWare;
                            //angular.element("#devBootWare").html(data.devBootWare);
                        }).error(function(){});
                        $http({
                            method: 'POST',
                            url:URL_GET_DEV,
                            data:{
                                devSN:$scope.sn
                            }
                        }).success(function (data) {
                            console.log(data);
                            $scope.statust = data.status || [];
                            if ($scope.statust == 0) {
                                $scope.connectStatus=$scope.connect_suc;
                                //angular.element("#devv3CloudConnectionState").html($scope.connect_suc);
                            } else {
                                $scope.connectStatus=$scope.connect_fail;
                                //angular.element("#devv3CloudConnectionState").html($scope.connect_fail);
                            }
                        }).error(function () {});
                        $scope.$broadcast('show#systemInfo');
                    };
                    //band width set
                    $scope.bandWidth={};
                    $scope.$watch('AddInternetForm.$invalid', function (v) {
                        if (v) {
                            $scope.$broadcast('disabled.ok#bandWidthSet');
                        } else {
                            $scope.$broadcast('enable.ok#bandWidthSet');
                        }
                    });
                    $scope.$watch('AddInternetForm.$dirty', function (v) {
                        console.log(v);
                        if (v) {
                            $scope.$broadcast('enable.ok#bandWidthSet');
                        } else {
                            $scope.$broadcast('disabled.ok#bandWidthSet');
                        }
                    });
                    $scope.bandWidthOption={
                        options:{
                            mId: 'bandWidthSet',
                            title: $scope.ADD_TITLE,//getRcString("ADD_TITLE"),
                            autoClose: true,
                            showCancel: true,
                            buttonAlign: "center",
                            modalSize: 'normal',
                            showHeader: true,
                            showFooter: true,
                            searchable: true,
                            okHandler: function (modal, $ele) {
                                $scope.setBandWidth();
                                //$scope.$broadcast('show#bandWidth');
                            },
                            cancelHandler: function (modal, $ele) {
                            },
                            beforeRender: function ($ele) {
                                return $ele;
                            }
                        }
                    };
                    $scope.getBandWidth=function(){
                        $http.get(URL_GET_BAND+'?devSN='+$scope.sn).success(function (data) {
                            console.log(data);
                            if(data.errCode==0){
                                $scope.bandWidth.upband=data.upBandwidth;
                                $scope.bandWidth.downband=data.downBandwidth;
                            }else if (data.errCode==1) {

                            }
                        }).error(function () {});
                    };
                    $scope.openModal=function(){
                        $scope.$broadcast('show#bandWidthSet');
                        $scope.$broadcast('disabled.ok#bandWidthSet');
                        $scope.getBandWidth();
                    };
                    $scope.$on('hidden.bs.modal#bandWidthSet', function () {
                        $scope.AddInternetForm.$setUntouched();
                        $scope.AddInternetForm.$setPristine();
                    });
                    //set band width
                    $scope.setBandWidth=function(){
                        $http.get(URL_SET_BAND+'?devSN='+$scope.sn+'&upBandwidth='+$scope.bandWidth.upband+'&downBandwidth='+$scope.bandWidth.downband)
                        .success(function (data) {
                            console.log(data);
                            if(data.errCode==0){
                                $alert.msgDialogSuccess($scope.SETBAND_SUC);
                                $scope.healthDegree();
                            }else{
                                $alert.msgDialogError($scope.SETBAND_FAIL);
                            }
                        }).error(function () {});
                    };
                }
            }
        }
    ]);
});
