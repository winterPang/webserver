define(['jquery', 'css!appmanage/css/style'], function ($) {
    return ['$scope', '$http', '$state', function ($scope, $http, $state) {
        // url of get bought application;
        var URL_LIST_MINE_APP = '/v3/ace/oasis/oasis-rest-application/restapp/appStore/applications/mine';
        //  configure redirect page
        var redirect = {
            map: 'global.content.application.appmanage_palmap',
            advertise: 'global.content.application.appmanage_advert'
        };
        $scope.img = 'http://172.27.9.118/data/upload/shop/store/goods/6/6_05349390159442003_240.jpg';
        // $http.get('/v3/ace/oasis/oasis-rest-application/appStore/applications/mine?' + $.param({user_name: userName}))
        $http.get(URL_LIST_MINE_APP).success(function (data) {
            if (data.code == 0) {
                $scope.appList = data.data ? $.map(data.data.data, function (item) {
                        item.logo = item.logo ? item.logo.replace('localhost', '172.27.9.118') : '';
                        return item;
                    }) : [];
            } else {
                $scope.appList = [];
            }
        }).error(function () {
            $scope.appList = [];
        });
        $scope.toDetail = function (appId, type) {
            $state.go(redirect[type || 'map'], {appId: appId});
        };
    }];
});