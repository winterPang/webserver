define(['jquery', 'css!appstore/css/style'], function ($) {
    return ['$scope', '$http', function ($scope, $http) {
        $scope.img = 'http://172.27.9.118/data/upload/shop/store/goods/6/6_05349390159442003_240.jpg';
        var URL_LIST_HOT_APPS = '/v3/ace/oasis/oasis-rest-application/restapp/appStore/applications/hots';
        var URL_LIST_NEW_APPS = '/v3/ace/oasis/oasis-rest-application/restapp/appStore/applications/news';
        var URL_LIST_FEE_APPS = '/v3/ace/oasis/oasis-rest-application/restapp/appStore/applications/fee';
        var URL_LIST_FREE_APPS = '/v3/ace/oasis/oasis-rest-application/restapp/appStore/applications/free';
        var URL_GET_APP_DETAIL = '/v3/ace/oasis/oasis-rest-application/restapp/appStore/application/';

        function getRcString(name) {
            return $('#appstore_list').attr(name);
        }

        // 显示详情模态框
        $scope.detailModal = {
            mId: 'detailModal',
            okText: getRcString('modal_ok'),
            cancelText: getRcString('modal_cancel'),
            title: getRcString('modal_title'),
            bodyHeight: 400,
            okHandler: function () {
                if ($scope.detail && $scope.detail.btn) {
                    window.open($scope.detail.btn.url);
                }
            }
        };
        $scope.detail = {};
        $scope.showDetail = function (id) {
            $scope.detail = {};
            $http.get(URL_GET_APP_DETAIL + id)
                .success(function (data) {
                    if (data && data.code == 0) {
                        $scope.detail = data.data;
                    }
                });
            $scope.$broadcast('show#detailModal');
        };

        var hotTop = 6, newTop = 6, userName = $scope.userInfo.user;

        function getData(url, params, field) {
            $http.get(url + '?' + $.param(params))
                .success(function (data) {
                    if (data.code == 0) {
                        $scope[field] = data.data ? $.map(data.data.data, function (item) {
                                item.logo = item.logo ? item.logo.replace('localhost', '172.27.9.118') : '';
                                return item;
                            }) : [];
                    } else {
                        $scope[field] = [];
                    }
                })
                .error(function () {
                    $scope[field] = [];
                });
        }

        // 获取热门应用
        function getHotApps() {
            getData(URL_LIST_HOT_APPS, {
                user_name: userName,
                topNum: hotTop
            }, 'hotApps');
        }

        // 获取新应用
        function getNewApps() {
            getData(URL_LIST_NEW_APPS, {
                user_name: userName,
                topNum: newTop
            }, 'newApps');
        }

        // 获取免费应用
        function getFreeApps() {
            getData(URL_LIST_FREE_APPS, {
                user_name: userName
            }, 'freeApps');
        }

        // 获取付费yy
        function getFeeApps() {
            getData(URL_LIST_FEE_APPS, {
                user_name: userName
            }, 'feeApps');
        }

        getHotApps();
        getNewApps();
        getFeeApps();
        getFreeApps();

    }];
});