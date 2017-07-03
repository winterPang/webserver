/**
 * directive dashboard-log by z04434@20161013
 */
define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.getLang();
        var URL_TEMPLATE_FILE = sprintf('../dashboard5/views/%s/dashboard_log.html', sLang);
        var URL_GET_LOG = '/v3/devlogserver/getlogstats';

        app.directive('dashboardLog', ['$timeout', '$rootScope', '$http', '$q',
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
                        var g_startTime=new Date(new Date().toLocaleDateString()).getTime();
                        var g_endTime=new Date().getTime();
                        var sUrl = sprintf(URL_GET_LOG, $scope.sn);
                        $http.get(sUrl+'?devSN='+$scope.sn+'&startTime='+g_startTime+'&endTime='+g_endTime).then(success, fail);
                        // {"logstats":[0,0,0,0,95,0,130,0]} - ok
                        // {"errcode":"Permission denied"} - err
                       /* $http({
                            url: URL_GET_LOG,
                            method: 'POST',
                            data: {
                                'devSN':$scope.sn,
                                'starttime':new Date(new Date().toLocaleDateString()).getTime(),
                                'endtime':new Date().getTime(),
                                'LEVEL':1
                            }
                        }).success(function (data) {
                            success(data);
                        });*/
                        function success(data) {
                            var log = data.data.logstats;
                            if(log&&(8 == log.length)){
                                $scope.logLevels[0].data = log[0] + log[1];
                                $scope.logLevels[1].data = log[2] + log[3];
                                $scope.logLevels[2].data = log[4] + log[5];
                                $scope.logLevels[3].data = log[6] + log[7];
                            }
                            else{
                                console.log('error', data);
                            }                               
                        }
                        /*var log = data.message.LEVEL;
                        if(log.length>0){
                            $.each(log,function(index, el) {
                                if(el&&el.level =="0"){
                                    $scope.logLevels[0].data += el.sum;
                                }else if(el&&el.level =="1"){
                                    $scope.logLevels[0].data +=el.sum;
                                }else if(el&&el.level =="2"){
                                    $scope.logLevels[1].data +=el.sum;
                                }else if(el&&el.level =="3"){
                                    $scope.logLevels[1].data +=el.sum;
                                }else if(el&&el.level =="4"){
                                    $scope.logLevels[2].data +=el.sum;
                                }else if(el&&el.level =="5"){
                                    $scope.logLevels[2].data +=el.sum;
                                }else if(el&&el.level =="6"){
                                    $scope.logLevels[3].data +=el.sum;
                                }else if(el&&el.level =="7"){
                                    $scope.logLevels[3].data +=el.sum;
                                }
                            });
                        }*/
                        function fail(data) {
                            console.log('error', data);
                        }
                        
                    }
                };
            }]);
    });
