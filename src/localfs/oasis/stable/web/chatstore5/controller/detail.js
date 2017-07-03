/**
 * @author  zhangfuqiang
 * @description 微信门店详情功能
 */
define(['utils', './common'], function (Utils, common) {
    return ['$scope', '$alertService', '$state', '$stateParams', '$http', '$timeout',
        function ($scope, $alert, $state, $stateParams, $http, $timeout) {

            $scope.$watch('permission', function (p) {
                if (!p.write) {
                    $timeout(function () {
                        $scope.$broadcast('hideColumn', 'operation');
                    });
                }
            }, true);

            var model = $stateParams.model,
                nasid = $stateParams.nasid,
                sn = $stateParams.sn;
            var queryParams = {
                nasid: nasid
            };
            var user = $scope.userInfo.user;
            // var demoImg = 'http://i.cqnews.net/cq/attachement/jpg/site82/20120517/f04da220bfea111ec5b313.jpg';

            // 获取门店列表，从数据库查询
            var URL_SHOP_LIST = '/v3/ace/oasis/auth-data/o2oportal/wifiShopDb/queryShopList'; //  保存着状态信息
            var URL_WIFI_SHOP_LIST = '/v3/ace/oasis/auth-data/o2oportal/wifiShopDb/queryWifiShopList'; //  保存主要信息
            var URL_QUERY_LIST = '/v3/ace/oasis/auth-data/o2oportal/weixinaccount/query';  //  查询所有的微信公众号
            var URL_DEL_SHOP = '/v3/ace/oasis/auth-data/o2oportal/wifiShopDb/deleteShop';  //  删除门店信息
            var URL_DEL_WIFI_SHOP = '/v3/ace/oasis/auth-data/o2oportal/wifiShopDb/deleteWifiShop';
            var URL_QRCODE = '/v3/ace/oasis/auth-data/o2oportal/wifiConn/getQrCode'; //  获取微信二维码URL

            var tableTitle = Utils.getRcString("model_rc", "table-title").split(",");
            var bindError = Utils.getRcString("model_rc", "bind-error");

            $scope.options = {
                searchable: true,
                pagination: false,
                columns: [
                    {sortable: true, field: 'shop_name', title: tableTitle[0], searcher: {}},
                    {sortable: true, field: 'accountName', title: tableTitle[1], searcher: {}},
                    {
                        field: 'storeSet',
                        title: tableTitle[4],
                        render: '<a class="list-link"><i class="fa fa-qrcode"></i></a>'
                    },
                    {
                        field: 'operation',
                        title: tableTitle[5],
                        render: '<a class="list-link"><i class="fa fa-sign-out"></i></a>'
                    }
                ],
                onClickCell: function (field, val, row, $td) {
                    if (field == 'storeSet') {
                        $scope.row = row;
                        // 获取第一个ssid
                        if ($scope.row.ssid_list && $scope.row.ssid_list[0]) {
                            $scope.qrCodeModal.ssid_name = $scope.row.ssid_list[0];
                        } else {
                            $scope.row.ssid_list = $scope.row.ssid_list || [];
                            $scope.qrCodeModal.ssid_name = '';
                        }
                        $scope.$broadcast('show#qrCodeModal');
                    } else if (field == 'operation') {
                        // 先删除SHOP_DB
                        $alert.confirm(tableTitle[6], function () {
                            $http.post(URL_DEL_WIFI_SHOP, {
                                appId: row.appId,
                                nasid: nasid,
                                shop_id: row.shop_id,
                                sid: row.sid
                            }).success(function (data) {
                                if (data) {
                                    if (data.errcode == 0) {
                                        $http.post(URL_DEL_SHOP, {
                                            appId: row.appId,
                                            nasid: nasid,
                                            poi_id: row.poi_id,
                                            sid: row.sid
                                        }).success(function (data) {
                                            if (data && data.errcode == 0) {
                                                $alert.msgDialogSuccess(tableTitle[8]);
                                                loadTableData();
                                            } else {
                                                $alert.msgDialogError(tableTitle[9]);
                                            }
                                        }).error(common.executeError);
                                    } else if (data.errcode == -1) {
                                        $alert.msgDialogError(bindError);
                                    } else if (data.errcode == 2004) {
                                        $alert.msgDialogError(bindError);
                                    }
                                } else {
                                    $alert.msgDialogError(tableTitle[9]);
                                }
                            }).error(common.executeError);
                        });
                    }
                }
            };

            // 加载表格数据
            function loadTableData() {
                // 1、先得到所有的微信公众号信息
                $http.get(URL_QUERY_LIST + '?storeId=' + nasid)
                    .success(function (data) {
                        // appId
                        queryParams.appId = (data && data.data[0] && data.data[0].appId) || 'wx8f4a00ae32dbc871';
                        // 2、查询微信门店信息
                        $http.post(URL_SHOP_LIST, queryParams).success(function (shopList) {
                            $http.post(URL_WIFI_SHOP_LIST, queryParams).success(function (wifiList) {
                                $scope.$broadcast('load', common.concatRecord((wifiList && wifiList.datas) || [], (shopList && shopList.base_infos) || []));
                            }).error(common.executeError);
                        }).error(common.executeError);
                    });
            }

            loadTableData();

            function getQrCode(params, type) {
                $scope.qrCodeModal.btnView = true;
                $scope.qrCodeModal.qucodeImg0 = '';
                $scope.qrCodeModal.qucodeImg1 = '';
                $http.post(URL_QRCODE, $.extend(true, {img_id: type}, params)).success(function (d) {
                    if (d && d.errcode == 0) {
                        $scope.qrCodeModal['qucodeImg' + type] = d.data.qrcode_url;  //  显示二维码
                    } else {
                        $alert.msgDialogError(tableTitle[12]);
                        $scope.qrCodeModal['qucodeImg' + type] = '';  //  显示二维码
                    }
                    $scope.qrCodeModal.btnView = false;
                }).error(function () {
                    $scope.qrCodeModal.btnView = false;
                });
            }

            // 二维码
            $scope.qrCodeModal = {
                modal: {
                    mId: 'qrCodeModal',
                    title: tableTitle[10],
                    showCancel: false,
                    okText: tableTitle[11]
                },
                btnView: false,
                ssid_name: '',
                qucodeImg0: '',
                qucodeImg1: '',
                click: function () {
                    var ssid = $scope.qrCodeModal.ssid_name;
                    var params = {appId: $scope.row.appId, shop_id: $scope.row.shop_id, ssid: ssid, nasid: nasid};
                    getQrCode(params, 0);
                    getQrCode(params, 1);
                }
            };
            // 清除二维码信息
            $scope.$on('hidden.bs.modal#qrCodeModal', function () {
                $scope.qrCodeModal.qucodeImg0 = '';
                $scope.qrCodeModal.qucodeImg1 = '';
            });
        }];
});