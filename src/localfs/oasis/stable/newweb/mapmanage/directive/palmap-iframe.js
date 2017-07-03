/**
 * @author kf.zhangfuqiang@h3c.com
 * @description a component of palmap application.
 * @datetime 2017/01/14 14:10
 */
define(['angularAMD'], function (app) {
    app.directive('palmapIframe', ['$http', function ($http) {
        var validMapUrl = '/v3/ace/oasis/oasis-rest-map/restapp/vectorMap/palMapvValid/',
            sessionIdUrl = '/v3/api/getSessionID',
            palmapUrl = 'https://h3c.ipalmap.com/';

        return {
            restrict: 'E',
            scope: {
                nasid: '='
            },
            replace: true,
            templateUrl: '../mapmanage/directive/palmap-iframe.html',
            link: function (scope) {
                function renderPalmap(nasid, id) {
                    $http.get(validMapUrl + nasid).success(function (data) {
                        if (data && data.code == 0 && data.valid == 0) {
                            $http.get(sessionIdUrl).success(function (data) {
                                $('#' + id).attr('src', palmapUrl + '?shopId=' + nasid + '&sessionId=' + data.sessionID);
                            });
                            scope.showMap = true;
                        }
                    });
                }

                scope.$watch('nasid', function (v) {
                    v && renderPalmap(v, 'palmap');
                });
            }
        };
    }]);
});