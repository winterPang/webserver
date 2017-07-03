/**
 * @author  zhangfuqiang
 * @description 微信门店导入功能
 */
define(['utils', './common'], function (Utils, common) {
    return ['$scope', '$alertService', '$stateParams', '$http',
        function ($scope, $alert, $stateParams, $http) {
            var model = $stateParams.model,
                nasid = $stateParams.nasid,
                sn = $stateParams.sn;

            var queryParams = {
                nasid: nasid,
                appId: 'wx8f4a00ae32dbc871'
            };
            var user = $scope.userInfo.user;


            // var URL_SHOP_LIST = '../../init/chatstore5/importshoplist.json';
            // var URL_WIFI_SHOP_LIST = '../../init/chatstore5/importwifishoplist.json';
            // var URL_QUERY_LIST = '../../init/chatstore5/query.json';

            var URL_SHOP_LIST = '/v3/ace/oasis/auth-data/o2oportal/wifiShop/getShoplist';   // 门店列表
            var URL_WIFI_SHOP_LIST = '/v3/ace/oasis/auth-data/o2oportal/wifiShop/getWifishoplist'; // 门店WI-FI信息
            var URL_QUERY_LIST = '/v3/ace/oasis/auth-data/o2oportal/weixinaccount/query';  //  查询所有的微信公众号
            var URL_SAVE_SHOP = '/v3/ace/oasis/auth-data/o2oportal/wifiShopDb/saveShop';
            var URL_SAVE_WIFI_SHOP = '/v3/ace/oasis/auth-data/o2oportal/wifiShopDb/saveWifiShop';
            var URL_GET_KEY = '/v3/ace/oasis/auth-data/o2oportal/wifiShop/getWifishopSecretkey';

            var tableTitle = Utils.getRcString("model_rc", "table-title").split(",");

            $scope.appselect = {
                allowClear: false,
                width: 200
            };

            function saveShop(row) {
                var sssid = row.sid || +new Date();
                var shopInfo = {
                    appId: $scope.appId,
                    nasid: nasid,
                    base_info: {
                        sid: sssid,
                        business_name: row.business_name,
                        branch_name: row.branch_name,
                        province: row.province,
                        city: row.city,
                        district: row.district,
                        address: row.address,
                        telephone: row.telephone,
                        categories: row.categories,
                        offset_type: row.offset_type,
                        longitude: row.longitude,
                        latitude: row.latitude,
                        photo_list: row.photo_list,
                        recommend: row.recommend,
                        special: row.special,
                        introduction: row.introduction,
                        open_time: row.open_time,
                        avg_price: row.avg_price,
                        update_status: row.update_status,
                        available_state: row.available_state,
                        poi_id: row.poi_id
                    }
                };
                var shopWifiInfo = {
                    appId: $scope.appId,
                    nasid: nasid,
                    data: {
                        shop_id: row.shop_id,
                        shop_name: row.shop_name,
                        ssid: row.ssid || 'h3c-lvzhou',
                        sid: sssid,
                        ssid_list: row.ssid_list,
                        ssid_password_list: row.ssid_password_list,
                        password: row.password,
                        protocol_type: row.protocol_type,
                        ap_count: row.ap_count,
                        template_id: row.template_id,
                        homepage_url: row.homepage_url,
                        bar_type: row.bar_type,
                        secretkey: row.secretkey
                    }
                };

                function saveShopAction() {


                    // if (row.ssid && row.shop_id) {
                    /**
                     * 添加portal型设备（获取SecretKey）
                     */
                    $http.post(URL_GET_KEY, {
                        nasid: nasid,
                        appId: $scope.appId,
                        shop_id: row.shop_id,
                        ssid: row.ssid || 'h3c-lvzhou',
                        reset: false
                    }).success(function (data) {
                        if (data && data.errcode == 0) {
                            shopWifiInfo.data.secretkey = data.data.secretkey;
                        }
                        exportShop();
                    }).error(common.executeError);
                    // } else {
                    //     exportShop();
                    // }
                }

                function exportShop() {
                    // 保存门店信息
                    $http.post(URL_SAVE_SHOP, shopInfo).success(function (data) {
                        if (data.errcode == 0) {
                            // 保存门店WIFI信息
                            $http.post(URL_SAVE_WIFI_SHOP, shopWifiInfo).success(function (data) {
                                if (data && data.errcode == 0) {
                                    $alert.msgDialogSuccess(tableTitle[3]);
                                } else if (data && data.errcode == -1) {
                                    $alert.msgDialogError(tableTitle[4]);
                                }
                            }).error(function (e) {
                                $alert.msgDialogError(tableTitle[5]);
                            });
                        } else if (data && data.errcode == -1) {
                            $alert.msgDialogError(tableTitle[4]);
                        }
                    }).error(function (e) {
                        $alert.msgDialogError(tableTitle[5]);
                    });
                }

                saveShopAction();
            }

            $scope.options = {
                searchable: true,
                operateWidth: 100,
                columns: [
                    {sortable: true, field: 'shop_name', title: tableTitle[0], searcher: {}},
                    {sortable: true, field: 'ssid', title: tableTitle[1], searcher: {}},
                    {sortable: true, field: 'statusText', title: tableTitle[2], searcher: {}}
                ],
                operate: {
                    imports: {
                        enable: function (val, row) {
                            return row.available_state == 3;
                        },
                        click: function (e, row) {
                            saveShop(row);
                        }
                    }
                }
            };

            $scope.wifiList = [];
            $scope.shopList = [];

            /**
             * 加载门店下拉框信息
             */
            $http.get(URL_QUERY_LIST + '?storeId=' + nasid).success(function (data) {
                $scope.appList = (data && data.data) || [];
                $scope.appId = $scope.appList && $scope.appList.length ? $scope.appList[0].appId : '';
            });

            /**
             * 加载门店信息
             */
            function loadShopList(begin) {
                $scope.$broadcast('showLoading');
                begin = begin || 0;
                if (begin === 0) {
                    $scope.shopList = [];
                }
                $http.post(URL_SHOP_LIST, {
                    nasid: queryParams.nasid,
                    appId: queryParams.appId,
                    begin: begin,
                    limit: 50  //  默认20  最大50
                }).success(function (data) {
                    if (data && data.errcode == 0) {
                        data.business_list = $.map(data.business_list, function (b) {
                            return b.base_info;
                        });
                        $scope.shopList = $scope.shopList.concat(data.business_list);
                        // 如果还有下一页，继续请求
                        if (begin + 50 < data.total_count) {
                            loadShopList(begin + 50);
                        } else {
                            // 数据加载完毕了，开始请求wifilist
                            loadWifiShopList();
                        }
                    } else {
                        $scope.$broadcast('load', []);
                        $scope.$broadcast('hideLoading');
                        $alert.msgDialogError(tableTitle[6]);
                    }
                }).error(function () {
                    $scope.$broadcast('hideLoading');
                });
            }

            /**
             * 加载门店WIFI信息
             */
            function loadWifiShopList(pageIndex) {
                pageIndex = pageIndex || 1;
                if (pageIndex === 1) {
                    $scope.wifiList = [];
                }
                $http.post(URL_WIFI_SHOP_LIST, {
                    nasid: queryParams.nasid,
                    appId: queryParams.appId,
                    pageindex: pageIndex,
                    pagesize: 20   //  最大50
                }).success(function (data) {
                    if (data && data.errcode == 0) {
                        $scope.wifiList = $scope.wifiList.concat(data.data.records);
                        if (data.data.pageindex < data.data.pagecount) {
                            loadWifiShopList(data.data.pageindex + 1);
                        } else {
                            //  查询结束，开始组装数据，并刷新到表格中
                            $scope.$broadcast('load', common.concatRecord($scope.wifiList, $scope.shopList));
                        }
                    } else {
                        $scope.$broadcast('load', []);
                    }
                    $scope.$broadcast('hideLoading');
                }).error(function () {
                    $scope.$broadcast('hideLoading');
                });
            }

            $scope.$watch('appId', function (v) {
                // 监听微信门店变化，刷新表格
                if (v) {
                    queryParams.appId = v;
                    loadShopList();
                }
            });
        }];
});