define(['jquery', './resource', 'frame/directive/sitePicker', 'jqueryZtree', 'css!frame/libs/ztree/css/zTreeStyle', 'css!devmanage/css/newdevmanage'],
    function($, Res) {
        return ['$scope', '$rootScope', '$alertService', '$http', '$q',
            function($scope, $rootScope, $alert, $http, $q) {
                // 添加设备的表单
                $scope.addDev = {};
                // 搜索框
                $scope.searchText = '';
                $scope.tableAllData = []; //  表格所有的数据
                // 标志位
                $scope.flags = {
                    simple_branch: $rootScope.oasisType == 0 ? 'simple' : '',
                    showAddArea: false
                };
                // 批量删除按钮可用性
                $scope.canDelMulti = false;

                // 选中的场所的信息
                var shopInfo = {
                    shopId: 352331, //  TODO  需要修改了
                    regionId: '',
                    shopName: '',
                    regionName: ''
                };

                /*table option start*/
                var tableCommon = {
                    extraCls: 'new_style_170413_table',
                    showCheckBox: true,
                    operateWidth: 100
                };
                var devList = {
                    tId: 'devList',
                    columns: [
                        { field: 'devAlias', showTooltip: true, title: '名称' },
                        { field: 'devSn', showTooltip: true, title: '序列号' },
                        {
                            field: 'status',
                            showTooltip: true,
                            title: '状态',
                            formatter: function(val) {
                                return val === 0 ? getRcString('ON_LINE') : getRcString('OFF_LINE');
                            }
                        },
                        { field: 'devTypeStr', showTooltip: true, title: '类型' },
                        { field: 'devModel', showTooltip: true, title: '型号' },
                        {
                            field: 'groupName',
                            showTooltip: true,
                            title: '分支',
                            // render: shopInfo.regionName, //  固定为regionName
                            visible: $scope.flags.simple_branch != 'simple',
                            formatter: function() {
                                return shopInfo.regionName;
                            }
                        }
                    ],
                    operate: {
                        edit: {
                            enable: function() {
                                return 1 == 1;
                            },
                            click: function(e, row) {
                                console.log(row)
                                $scope.$apply(function() {
                                    //  填充数据
                                    $scope.addDev.devId = row.id;
                                    $scope.addDev.shopId = row.shopId;
                                    $scope.addDev.devAlias = row.devAlias;
                                    $scope.addDev.devSn = row.devSn;
                                    $scope.addDev.isIRF = row.groupName === 'IRF';

                                    $scope.flags.showAddArea = true;
                                    $scope.isEdit = true;
                                });
                            }
                        }
                    }
                };
                $scope.devList = $.extend(true, {}, tableCommon, devList);

                $.each(['check.bs.table', 'uncheck.bs.table', 'check-all.bs.table', 'uncheck-all.bs.table'], function(idx, val) {
                    $scope.$on(val + '#devList', function() {
                        $scope.$broadcast('getAllSelections#devList', function(rows) {
                            $scope.canDelMulti = rows.length;
                        });
                    });
                });

                // start zhangfuqiang
                var $rc = null;

                /**
                 * 获取中英文的问题
                 * @param {String} name 
                 */
                function getRcString(name) {
                    if (!$rc) {
                        $rc = $('#devmanage_rc');
                    }
                    return $rc.attr(name);
                }

                function loadTableData(data, loading) {
                    loading = (loading === undefined ? true : loading);
                    $scope.$broadcast('load#devList', data);
                    $scope.tableAllData = data;
                    loading && $scope.$broadcast('hideLoading#devList');
                }
                var res = new Res($q, $http);

                function getDevices(id, type) {
                    $scope.$broadcast('showLoading#devList');
                    var devPromise = {};
                    if (type === 'region') {
                        devPromise = res.getDevicesByRegion(id);
                    } else {
                        devPromise = res.getDevicesByShop(id);
                    }
                    // 获取设备列表
                    devPromise.then(function(data) {
                        // 在这里请求设备在线状态的数据
                        res.getStatus($.map(data, function(dev) {
                            return dev.devSn;
                        })).then(function(status) {
                            var resultList = $.map(data, function(dev) {
                                dev.status = (status[dev.devSn] === undefined ? dev.status : status[dev.devSn]);
                                return dev;
                            });
                            // 加载成功
                            loadTableData(resultList);
                        }).catch(function() {
                            //  失败就加载默认的在线状态
                            var resultList = $.map(data, function(dev) {
                                dev.status = Number(dev.status) === 1 ? 0 : 1;
                                return dev;
                            });
                            loadTableData(resultList);
                        });
                    }).catch(function(err) {
                        //  显示设备加载失败了
                        console.log(getRcString('DEV_LOAD_ERR'));
                        loadTableData(resultList);
                    });
                }
                /**
                 * 修改设备别名
                 */
                $scope.editAlias = function() {
                    res.editAlias($scope.addDev.devId, $scope.addDev.shopId, $scope.addDev.devAlias).then(function() {
                        $alert.msgDialogSuccess(getRcString('EDIT_ALIAS_SUCC'));
                        $scope.flags.showAddArea = false;
                        getDevices(shopInfo.shopId);
                    }).catch(function(err) {
                        $alert.msgDialogError(err || getRcString('EDIT_ALIAS_ERR'));
                    });
                };
                // 添加设备
                $scope.addDevice = function() {};
                // 点击选择场所或者区域
                $scope.treeClick = function(info) {
                    shopInfo.regionName = info.regionName;
                    getDevices(info.id, info.type);
                };
                //  搜索
                $scope.search = function() {
                    $scope.$broadcast('load#devList', $.grep($scope.tableAllData, function(item) {
                        return item.devAlias.toUpperCase().indexOf($scope.searchText) !== -1;
                    }));
                };
            }
        ];
    });