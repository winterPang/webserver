define(['angularAMD', 'utils', 'sprintf'],
    function (app, utils) {

        var sLang = utils.lang || 'cn';
        var URL_TEMPLATE_FILE = sprintf('../customer5/views/%s/xanth_byod_rz.html', sLang);
        var bandTypeUrl = '/stamonitor/getclientlistbycondition'; 

        app.directive('xanthbyodrz', ['$timeout', '$rootScope', '$http', '$q',
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
                        $http.get(bandTypeUrl+'?devSN='+$scope.sn+'&reqType=count'+'&auth=1'				           
				            ).success(function(data){
				                $("#portalNum2G").html(data.clientList[0].Count24G);
				                $("#portalNum5G").html(data.clientList[0].Count5G);
				                $("#portalTotal").html(data.clientList[0].staCount);
				            }).error(function(){           
				        });                                           
                    }
                };
            }
        ]);
    }
);
