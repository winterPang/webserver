define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils,echarts) {

        var sLang = utils.getLang() || 'cn';
        var URL_TEMPLATE_FILE = sprintf('../liveness88/views/%s/wireless_count.html', sLang);
        var bandTypeUrl = '/stamonitor/getclientstatisticbybandtype';
        // var portalUserCountUrl = "/v3/portalmonitor/portalusercount";

        app.directive('wirelesscount', ['$timeout', '$rootScope', '$http', '$q',
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
                            $("#Total").html(data.client_statistic.band_2_4g + data.client_statistic.band_5g);
                        }).error(function (){
                        });

                        // $http.get(portalUserCountUrl+"?devSN="+$scope.sn).success(function (data) {
                        //     $("#NumRZ").html(data.portalusercount);
                        // });
                    }
                };
            }
        ]);
    }
);
