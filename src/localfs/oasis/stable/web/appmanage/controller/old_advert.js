define(['jquery', 'utils', 'css!appmanage/css/style'], function ($, utils) {
    return ['$scope', '$http', '$alertService', '$stateParams', function ($scope, $http, $alert, $stateParams) {
        var _rcCache = {};
        var URL_GET_APP_SHOP = '/v3/ace/oasis/oasis-rest-application/restapp/appStore/getAppShops?appId=' + $stateParams.appId;
        var URL_START_ADVERT = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/startApp?appId=' + $stateParams.appId;
        var URL_PAUSE_ADVERT = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/pauseApp?appId=' + $stateParams.appId;
        var URL_REDIRECT_ADVERT = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/adPlatform?appId=' + $stateParams.appId;
        var URL_STOP_ADVERT = '/v3/ace/oasis/oasis-rest-application/restapp/appOperators/stopApp?appId=' + $stateParams.appId;
        var URL_GET_ADVERT_INFO = '/v3/ace/oasis/oasis-rest-application/restapp/appStore/ad/selectedPage/';

        function getRcString(key) {
            if (!_rcCache[key]) {
                _rcCache[key] = $('#advertRc').attr(key);
            }
            return _rcCache[key];
        }

        function openAdvert(shopList) {
            $http.post(URL_START_ADVERT, JSON.stringify(shopList))
                .success(function (data) {
                    if (data && data.code == 0) {
                        $scope.$broadcast('refresh');
                        $alert.msgDialogSuccess(getRcString('startSucc'));
                    } else {
                        $alert.msgDialogError(data.message || getRcString('startFail'));
                    }
                })
                .error(function () {
                    $alert.msgDialogError(getRcString('requestError'));
                });
        }

        function pauseAdvert(shopList) {
            $http.post(URL_PAUSE_ADVERT, JSON.stringify(shopList))
                .success(function (data) {
                    if (data && data.code == 0) {
                        $scope.$broadcast('refresh');
                        $alert.msgDialogSuccess(getRcString('pauseSucc'));
                    } else {
                        $alert.msgDialogError(data.message || getRcString('pauseFail'));
                    }
                })
                .error(function () {
                    $alert.msgDialogError(getRcString('requestError'));
                });
        }

        var tableTitle = getRcString('table-header').split(',');
        $scope.selection = [];
        $scope.advertUrl = '';
        $scope.detailInfo = {};
        $scope.canStop = false;
        $scope.table = {
            url: URL_GET_APP_SHOP,
            clickToSelect: false,
            showCheckBox: true,
            checkboxHeader: false,
            columns: [
                {field: 'shopName', title: tableTitle[0]},
                {field: 'shopStatus', title: tableTitle[1]},
                {field: 'adStatus', title: tableTitle[2]}
            ],
            icons: {
                start: 'fa fa-play',
                pause: 'fa fa-pause'
            },
            tips: {
                edit: getRcString('operaConfig'),
                start: getRcString('operaStart'),
                pause: getRcString('operaPause')
            },
            responseHandler: function (data) {
                if (data && data.code == 0 && data.data && data.data.data) {
                    return $.map(data.data.data, function (item) {
                        if (item.shopType == 0) {
                            item.shopStatus = getRcString('noBoundAc');
                            item.adStatus = getRcString('noStart');
                        } else {
                            if (item.authType != 3) {
                                item.shopStatus = getRcString('noPublish');
                                item.adStatus = getRcString('noStart');
                            } else {
                                item.shopStatus = getRcString('published');
                                if (!item.ad_status) { // 0 or undefined
                                    item.adStatus = getRcString('noStart');
                                } else if (item.ad_status == 1) {
                                    item.adStatus = getRcString('started');
                                    $scope.$apply(function () {
                                        $scope.canStop = true; //  if published  ,can stop
                                    });
                                } else if (item.ad_status == 2) {
                                    item.adStatus = getRcString('paused');
                                    $scope.$apply(function () {
                                        $scope.canStop = true; //  if published  ,can stop
                                    });
                                } else {
                                    item.adStatus = '';
                                }
                            }
                        }
                        return item;
                    });
                }

                $scope.$apply(function () {
                    $scope.canStop = false; //  if published  ,can stop
                });
                return [];
            },
            operate: {
                edit: {
                    enable: function (r, row) {
                        return row.adStatus != getRcString('noStart');
                    },
                    click: function (e, row) { // 打开
                        $scope.storeId = row.storeId;
                        $http.get(URL_GET_ADVERT_INFO + row.storeId)
                            .success(function (data) {
                                $.each($(".move"),function(i,item){
                                    item.style.left = 0 +"px";
                                });
                                $scope.Imghide = false;
                                $scope.Righthide = false;
                                $scope.Lefthide = false;
                                if (data.code == 0) {
                                    $scope.detailInfo = {
                                        ad_home: data.data.selectedPage.ad_home == 'enable',
                                        ad_portal: data.data.selectedPage.ad_portal == 'enable',
                                        ad_index: data.data.selectedPage.ad_index == 'enable',
                                        ad_login: data.data.selectedPage.ad_login == 'enable'
                                    };
                                    if(data.data.selectedPage.ad_index === undefined){
                                        $scope.$broadcast('show#SmallModel');
                                    }else
                                    if(data.data.selectedPage.ad_index !== undefined){
                                        $scope.$broadcast('show#BigModel');
                                        //$scope.$broadcast('show#MoveModel');
                                    }
                                    $scope.detailShow = data.data.selectedPage;
                                } else {
                                    $alert.msgDialogError(data.message);
                                }
                            })
                            .error(function () {
                                $alert.msgDialogError(getRcString('requestError'));
                            });
                    }
                },
                start: {
                    enable: function (r, row) {
                        return row.shopStatus == getRcString('published');
                    },
                    click: function (e, row) { // 打开
                        openAdvert([row.storeId]);
                    }
                },
                pause: {
                    enable: function (r, row) {
                        return row.adStatus == getRcString('started');
                    },
                    click: function (e, row) { // 打开
                        pauseAdvert([row.storeId]);
                    }
                }
            }
        };

        $http.get(URL_REDIRECT_ADVERT)
            .success(function (data) {
                $scope.advertUrl = data ? data.data : null;
            })
            .error(function () {
                $alert.msgDialogError(getRcString('requestError'));
            });


        $scope.ImghideClack = function(){
            $.each($(".move"),function(i,item){
                item.style.left = -185.4 +"px";
            })
            $scope.Imghide = true;
            $scope.Righthide = true;
            $scope.Lefthide = true;
        }

        $scope.ImgRightClack = function(){ 
            $scope.Lefthide = true;        
            $.each($(".move"),function(i,item){
                item.style.left = parseFloat(item.style.left) - 185.4 +"px";
                if(parseFloat(item.style.left) < -370){
                    $scope.Righthide = false;
                }
            })
        }

        $scope.ImgLeftClack = function(){
            $scope.Righthide = true;
            $.each($(".move"),function(i,item){
                item.style.left = parseFloat(item.style.left) + 185.4 +"px";
                if(parseFloat(item.style.left) >= 0){
                    $scope.Lefthide = false;
                }
            })
        }
        //移动的模态框
        $scope.MoveModel = {
            mId:'MoveModel',                             
            title:getRcString('configAdvert'),                                                             
            modalSize:'lg' ,                                  
            okHandler: function(modal,$ele){ 
                var postData = {};
                $.each($scope.detailInfo, function (k, v) {
                    if ($scope.detailShow[k]) {
                        postData[k] = v ? 'enable' : 'disable';
                    }
                });
                $http.post(URL_GET_ADVERT_INFO + $scope.storeId, postData)
                    .success(function (data) {
                        if (data && data.code == 0) {
                            $alert.msgDialogSuccess(getRcString('configSucc'));
                            $scope.$broadcast('refresh');
                        } else {
                            $alert.msgDialogError(data.message);
                        }
                    })
                    .error(function () {
                        $alert.msgDialogError(getRcString('requestError'));
                    });
            },
        }; 
        //小模态框
        $scope.SmallModel = {
            mId:'SmallModel',                             
            title:getRcString('configAdvert'),                                                             
            modalSize:'normal' ,                                  
            okHandler: function(modal,$ele){ 
                var postData = {};
                $.each($scope.detailInfo, function (k, v) {
                    if ($scope.detailShow[k]) {
                        postData[k] = v ? 'enable' : 'disable';
                    }
                });
                $http.post(URL_GET_ADVERT_INFO + $scope.storeId, postData)
                    .success(function (data) {
                        if (data && data.code == 0) {
                            $alert.msgDialogSuccess(getRcString('configSucc'));
                            $scope.$broadcast('refresh');
                        } else {
                            $alert.msgDialogError(data.message);
                        }
                    })
                    .error(function () {
                        $alert.msgDialogError(getRcString('requestError'));
                    });
            },
        }; 
        //大模态框
        $scope.BigModel = {
            mId:'BigModel',
            modalSize:'lg' ,
            title: getRcString('configAdvert'),
            okHandler: function () {
                var postData = {};
                $.each($scope.detailInfo, function (k, v) {
                    if ($scope.detailShow[k]) {
                        postData[k] = v ? 'enable' : 'disable';
                    }
                });
                $http.post(URL_GET_ADVERT_INFO + $scope.storeId, postData)
                    .success(function (data) {
                        if (data && data.code == 0) {
                            $alert.msgDialogSuccess(getRcString('configSucc'));
                            $scope.$broadcast('refresh');
                        } else {
                            $alert.msgDialogError(data.message);
                        }
                    })
                    .error(function () {
                        $alert.msgDialogError(getRcString('requestError'));
                    });
            }
        };

        $scope.openAdvertMulti = function () {
            var shopIdList = $.map($scope.selection, function (item) {
                return item.storeId;
            });
            openAdvert(shopIdList);
        };

        $scope.pauseAdvertMulti = function () {
            var shopIdList = $.map($scope.selection, function (item) {
                return item.storeId;
            });
            pauseAdvert(shopIdList);
        };

        $scope.openAdvertUrlWin = function () {
            window.top.open($scope.advertUrl);
        };

        $scope.stopAdvert = function () {
            $scope.canStop = false; //  if published  ,can stop
            $http.get(URL_STOP_ADVERT)
                .success(function (data) {
                    if (data && data.code == 0) {
                        $alert.msgDialogSuccess(getRcString('stopSucc'));
                        $scope.$broadcast('refresh');
                    } else {
                        $alert.msgDialogError(data.message);
                    }
                })
                .error(function () {
                    $alert.msgDialogError(getRcString('requestError'));
                });
        };

        $.each([
            'check.bs.table', 'uncheck.bs.table',
            'load-success.bs.table'
        ], function (a, b) {
            $scope.$on(this, function () {
                $scope.$broadcast('getSelections', function (data) {
                    $scope.$apply(function () {
                        $scope.selection = data;
                    });
                });
            });
        });

        $scope.$on('check.bs.table', function (e, row, $ele) {
            if (row.shopStatus !== getRcString('published')) {
                var index = $ele.parents('tr').attr('data-index');
                $scope.$broadcast('uncheck', Number(index));
            }
        });
    }];
});