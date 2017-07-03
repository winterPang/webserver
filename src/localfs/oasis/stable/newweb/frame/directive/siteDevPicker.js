/**
 * siteDevPicker
 * @create 2017/06/27
 * @description 需要支持场所的选择和设备的选择，最终导出设备的信息
 * 
 */
define(['angularAMD',
    'frame/component/form/oasis-select',
    'frame/directive/sitePicker'
], function(app) {
    var URL_GET_DEVS = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/';
    var factory = ['$http', '$q', function($http, $q) {
        function getDevs(shopId) {
            var defer = $q.defer();
            if (!shopId) {
                defer.resolve([]);
                return defer.promise;
            }
            $http.get(URL_GET_DEVS + shopId).then(function(resp) {
                var devList = [];
                if (resp && resp.data) {
                    if (resp.data.code === 0) {
                        $.each(resp.data.data, function(index, g) {
                            devList = devList.concat(g.devices);
                        });
                        defer.resolve(devList);
                    } else {
                        defer.reject(resp.data.message);
                    }
                } else {
                    defer.reject('请求没有任何返回');
                }
            }).catch(function(err) {
                defer.reject('请求出错了');
            });
            return defer.promise;
        }
        return {
            scope: {
                sn: '@',
                shopid: '@',
                devChange: '&'
            },
            restrict: 'E',
            replace: true,
            template: '<div class="clearfix" style="display:inline-block">\
            <site-picker os-label="选择场所" os-model="siteInfo" os-value="shopid"></site-picker>\
            <oasis-select os-label="选择设备" os-model="devsn" os-key="devSn" os-text="devAlias" os-data="devs"></oasis-select>\
            </div>',
            link: function(scope, ele, attr) {
                scope.devs = [{ id: 10, name: 20 }];
                scope.devsn = '';
                scope.$watch('siteInfo.id', function() {
                    if (scope.siteInfo.type === 'shop') {
                        getDevs(scope.siteInfo.id).then(function(data) {
                            scope.devs = data;
                            // 如果只有一个值就设置为当前的值

                            // 检查传入的sn是否存在
                            if (data && data.length) {
                                var has = $.grep(data, function(item) {
                                    return item.devSn === scope.sn;
                                }).length;
                                if (has) {
                                    scope.devsn = scope.sn;
                                    return;
                                }
                            }

                            if (data.length === 1) {
                                scope.devsn = data[0].devSn;
                            } else {
                                scope.devsn = '';
                            }
                        }).catch(function(err) {
                            console.error(err);
                        });
                    }
                });

                scope.$watch('devsn', function(sn) {
                    scope.devChange({
                        $devInfo: {
                            devSN: sn,
                            shopId: scope.siteInfo.id,
                            shopName: scope.siteInfo.name
                        }
                    });
                });
            }
        }
    }];

    app.directive('siteDevPicker', factory);
});