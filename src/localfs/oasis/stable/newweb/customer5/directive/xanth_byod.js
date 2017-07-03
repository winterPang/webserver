define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.lang || 'cn';
        var URL_TEMPLATE_FILE = sprintf('../customer5/views/%s/xanth_byod.html', sLang);
        var bandTypeUrl = '/stamonitor/getclientstatisticbybandtype';
        var conditionAllUrl = '/stamonitor/getclientlistbycondition';

        app.directive('xanthbyod', ['$timeout', '$rootScope', '$http', '$q',
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
                        $http.get(bandTypeUrl+'?devSN='+$scope.sn).success(function (data){
                            $("#Num2G").html(data.client_statistic.band_2_4g);
                            $("#Num5G").html(data.client_statistic.band_5g);
                        }).error(function (){
                        });

                        $http.get(conditionAllUrl+'?devSN='+$scope.sn+'&reqType=all'
                            ).success(function(data){
                                $("#Total").html(data.clientList[0].totalCount);
                                $("#NumRZ").html(data.clientList[0].conditionCount);
                            }).error(function(){           
                        });                       
                    }
                };
            }
        ]);
    }
);
