define(["angularAMD"], function (app) {
    app.factory("appSer", function($rootScope, $http) {
        function getMine() {
            return $http({
                url: "/v3/ace/oasis/oasis-rest-application/restapp/appStore/applications/mines",
                method: "get"
            });
        }
        function getHot(num) {
            return $http({
                url: "/v3/ace/oasis/oasis-rest-application/restapp/appStore/applications/hots",
                method: "get",
                params: {
                    username: $rootScope.userInfo.user,
                    topNum: num
                }
            });
        }
        function getDevList() {
            return $http({
                url: "/v3/scenarioserver",
                method: "post",
                data: {
                    Method: 'getdevListByUser',
                    param: {
                        userName: $rootScope.userInfo.user
                    }
                }
            });
        }
        return {
            getMine: getMine,
            getHot: getHot,
            getDevList: getDevList
        };

    });
});