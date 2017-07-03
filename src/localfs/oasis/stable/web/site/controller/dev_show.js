define(['jquery', 'utils', 'home/controller/homeCommon', 'css!site/css/style.css'], function ($, Utils, common) {
    return ['$scope', '$http', '$alertService', '$stateParams', '$q', '$state', '$filter', '$timeout',
        function ($scope, $http, $alert, $stateParams, $q, $state, $filter, $timeout) {
            function getRcString(attrName) {
                return Utils.getRcString("dev_show_rc", attrName);
            }

            // 初始化公共实例
            var commonInst = common({$q: $q, $http: $http});
            var isCompleted = /*$scope.userInfo.isCompleted*/true;
            $scope.$watch("permission", function () {
                $scope.showHide = {
                    devWrite: false
                };
                $.each($scope.permission, function () {
                    if (this.id == "site") {
                        $.each(this.permission, function () {
                            if (this == "DEVICE_WRITE") {
                                $scope.showHide.devWrite = true;
                            }
                        });
                    }
                });
                var siteUrl = $stateParams.siteUrl;
                var shopId = $stateParams.id;
                var content = $stateParams.content;
                var topName = $stateParams.topName;
                $scope.isFatAp = $stateParams.isFatAp;
                var userName = $scope.userInfo.user;
                var topGroupId;

                //modify_dev_alias
                $scope.dev = {};

                $scope.devtype = [
                    {"name": getRcString("w-device"), "value": "1"},
                    {"name": getRcString("x-device"), "value": "4"}
                ];

                // TODO zhangfq  是否显示Irf表格进行标签页切换
                $scope.showIrf = false;

                // zhangfq

                //add_dev_model
                $scope.addDev = {devType: '1', optType: '0', irfName: '', isIRF: false};

                var URL_GET_DEV_LIST = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/%d';
                var URL_GET_SUB_DEV_LIST = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/subdevices/%d/1/3/%s/%s/undefined';
                var URL_POST_ADD_DEV = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2';
                var URL_POST_MODIFY_DEV_ALIAS = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/devicealias';
                var URL_DELETE_DEV = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices/%s';
                var URL_ISEXIST_SAME_DEVSN = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/deviceSnExisted/%s';
                var URL_AP_GROUP = '/v3/cloudapgroup';

                // 缓存加载后的数据，过滤设备类型列表
                var groupTypeList = [];

                function loadDataToTable(id, data) {
                    $scope.$broadcast('load' + (id ? '#' + id : ''), data || []);
                    $scope.$broadcast('hideLoading' + (id ? '#' + id : ''));
                }

                function getDevStatus(devSnList) {
                    var defer = $q.defer();
                    // 加载设备在线信息
                    $http.post('/base/getDevs', {devSN: devSnList}, {timeout: 5000}).success(function (data) {
                        if (data && data.status == 0) {
                            defer.resolve(data.detail);
                        } else {
                            defer.reject(data);
                        }
                    }).error(function (data) {
                        defer.reject(data);
                    });
                    return defer.promise;
                }

                // 加载表格数据
                function loadData() {
                    var devSnList = []; //  初始化设备SN列表
                    $timeout(function () {
                        $scope.$broadcast('showLoading');
                        $scope.$broadcast('showLoading#irfTable');
                    });
                    $http.get(sprintf(URL_GET_DEV_LIST, shopId)).success(function (data) {
                        // data {code,data,devices}
                        var tableData = [], newTableData = [];
                        var irfTableData = [], newIrfTableData = [];
                        if (data && data.code == 0) {
                            $.each(data.data, function () {
                                var item = this;
                                if (item.devices) {
                                    $.each(item.devices, function () {
                                        var devItem = $.extend(true, {
                                            groupId: item.groupId,
                                            groupName: item.groupName,
                                            groupType: item.groupType,
                                            statusStr: item.statusStr
                                        }, this);
                                        devItem.status = this.status == 1 ? 0 : 1;
                                        devItem.devTypeStr = this.devType == 4 ? getRcString('x-device') : getRcString('w-device');
                                        this.addTime && (devItem.addTime = $filter('date')(new Date(this.addTime), 'yyyy-MM-dd HH:mm:ss'));
                                        devSnList.push(devItem.devSn);
                                        if (devItem.groupType == 'IRF') {
                                            irfTableData.push(devItem);
                                        } else {
                                            tableData.push(devItem);
                                        }
                                    });
                                }
                            });
                            groupTypeList = $.map(data.data, function (d) {
                                if (d.groupType == 'IRF') {
                                    return {id: d.groupId, name: d.groupName};
                                }
                            });
                        } else {
                            groupTypeList = [];
                        }

                        //  TODO  加载设备在线状态
                        getDevStatus(devSnList).then(function (statusList) {
                            $.each(statusList, function (i, sta) {
                                $.each(tableData, function (j, t) {
                                    if (t.devSn == sta.devSN) {
                                        t.status = sta.status;
                                        newTableData.push(t);
                                    }
                                });
                                $.each(irfTableData, function (j, t) {
                                    if (t.devSn == sta.devSN) {
                                        t.status = sta.status;
                                        newIrfTableData.push(t);
                                    }
                                });
                            });
                            loadDataToTable(null, newTableData);
                            loadDataToTable('irfTable', newIrfTableData);
                        }, function () {
                            loadDataToTable(null, tableData);
                            loadDataToTable('irfTable', irfTableData);
                        });

                    }).error(function (msg) {
                        groupTypeList = [];
                        loadDataToTable();
                        loadDataToTable('irfTable');
                        $alert.noticeDanger(msg || getRcString('error'));
                    });
                }

                loadData();

                function devstatus(devsn, statu) {
                    //status== 0 ? online : not online
                    var status = (!devsn ? '' : statu == 0 ? getRcString("online") : getRcString("offline"));
                    var clazz = (status == getRcString("online") ? 'dev_status_base' : status == getRcString("offline") ? 'dev_status_base dev_status_unmanaged' : '');
                    return '<span ' + (clazz && 'class="' + clazz + '" ') + '></span><span>' + status + '</span>';
                }

                var pageTitle = getRcString("table-title").split(",");
                var tableCommon = {
                    pagination: true,
                    tips: {
                        custom: getRcString('man-text'),
                        maintenance: getRcString('maintenance-text')
                    },
                    icons: {
                        custom: 'fa fa-cog',
                        maintenance: 'fa fa-wrench'
                    },
                    operateWidth: 150,
                    operate: {
                        custom: function (e, row) {
                            if (content && topName) {
                                location.href = "https://" + location.hostname + "/oasis/stable/web/frame/index.html#/scene15/nasid" + shopId + "/devsn" + row.devSn + "/content" + content + "topName" + topName + "/monitor/dashboard15"
                            } else {
                                location.href = siteUrl && siteUrl.indexOf('$sn$') != -1 ? siteUrl.replace(/\$sn\$/, row.devSn).replace(/\$shopId\$/, shopId) : siteUrl;
                            }
                        },
                        maintenance: {
                            enable: function (val, row) {
                                return location.hostname != 'oasishk.h3c.com' && (siteUrl.indexOf('scene0')!=-1 || siteUrl.indexOf('scene2')!=-1 || siteUrl.indexOf('scene5')!=-1);
                            },
                            click: function (e, row, $btn) {
                                location.href = "https://" + location.hostname + "/oasis/stable/web/frame/index.html#/scene88/nasid" + row.shopId + "/devsn" + row.devSn + "/content/monitor/dashboard88";
                            }
                        },
                        edit: {
                            enable: $scope.showHide.devWrite,
                            click: function (e, row) {
                                $scope.$apply(function () {
                                    $scope.dev.devAlias = row.devAlias;
                                    $scope.old_devAlias = row.devAlias;
                                    $scope.dev.id = row.id;
                                });
                                $scope.$broadcast('show#modify_dev_alias_model');
                            }
                        },
                        remove: {
                            enable: $scope.showHide.devWrite,
                            click: function (e, row) {
                                $alert.confirm(getRcString('sure-delete'), function () {
                                    $http.delete(sprintf(URL_DELETE_DEV, row.id)).success(function (data) {
                                        if (data.code == 0) {
                                            $alert.noticeSuccess(getRcString('delete-device') + row.devSn + getRcString('success'));
                                        } else {
                                            $alert.noticeDanger(data.message);
                                        }
                                        loadData(); //  reload data
                                    }).error(function (msg) {
                                        $alert.noticeDanger(msg || getRcString('error'));
                                    });
                                });
                            }
                        }
                    }
                };
                $scope.irfOptions = $.extend(true, {}, tableCommon, {
                    tId: 'irfTable',
                    columns: [
                        {field: 'groupName', title: pageTitle[0]},
                        {field: 'devAlias', title: pageTitle[1], link: true},
                        {field: 'devSn', title: pageTitle[2]},
                        {field: 'devModel', title: pageTitle[4]},
                        {
                            field: 'status', title: pageTitle[5],
                            formatter: function (value, row) {
                                return devstatus(row.devSn, value);
                            }
                        }
                    ]
                });
                $scope.options = $.extend(true, {}, tableCommon, {
                    columns: [
                        {field: 'devAlias', title: pageTitle[1], link: true},
                        {field: 'devSn', title: pageTitle[2]},
                        {field: 'devModel', title: pageTitle[4]},
                        {
                            field: 'status', title: pageTitle[5],
                            formatter: function (value, row) {
                                return devstatus(row.devSn, value);
                            }
                        }
                    ]
                });
                // zhangfq
                function showDetails(e, field, value, row, $td) {
                    if (field == "devAlias") {
                        $scope.detail = row;
                        $scope.$broadcast('show#detailModal');
                    }
                }

                $scope.$on('click-cell.bs.table', showDetails);

                $scope.$on('click-cell.bs.table#irfTable', showDetails);

                $scope.detailModal = {
                    mId: 'detailModal',
                    showCancel: false,
                    okText: getRcString('close-text'),
                    title: getRcString('dev-detail')
                };

                $scope.modify_dev_alias_model = {
                    mId: 'modify_dev_alias_model',
                    title: getRcString('reset-alias'),
                    autoClose: false,
                    okDisabledFlag: 'modAlias.$invalid',
                    okHandler: function (modal) {
                        var modifyDevAlias = {
                            devAlias: $scope.dev.devAlias || $scope.old_devAlias,
                            id: +$scope.dev.id,
                            shopId: shopId
                        };
                        $http.put(sprintf(URL_POST_MODIFY_DEV_ALIAS), JSON.stringify(modifyDevAlias)).success(function (data) {
                            if (data.code == 0) {
                                modal.hide();
                                $alert.noticeSuccess(getRcString('alias-success'));
                                loadData();
                            } else {
                                $alert.noticeDanger(data.message);
                            }
                        }).error(function (msg) {
                            $alert.noticeDanger(msg || getRcString('error'));
                        });
                    }
                };

                $scope.refresh = function () {
                    loadData();
                };

                $scope.$on('show.bs.modal#add_dev_model', function () {
                    $scope.addDev.groupTypeList = groupTypeList;
                });

                //yanch get ap groups
                if ($scope.isFatAp == 1) {
                    $http.post(URL_AP_GROUP, {
                        Method: "getCloudApgroupNameList",
                        query: {
                            userName: userName,
                            nasId: shopId
                        }
                    }).success(function (data) {
                        topGroupId = data.message.groupId;
                    }).error(function (msg) {
                        $alert.noticeDanger(msg || getRcString('error'));
                    });

                    function ajaxReqApIntoGroup(groupId, apSN, acSN) {
                        $http.post(URL_AP_GROUP, {
                            Method: 'setApsnData',
                            query: {
                                groupId: groupId
                            },
                            data: [{
                                apSN: apSN,
                                acSN: acSN
                            }]
                        }).success(function (data) {
                            if (!data) return;
                            if (data.retCode == 0) {

                            } else {
                                $alert.noticeDanger(data.message);
                            }
                        }).error(function (msg) {
                            console.info(msg);
                        });
                    }
                }

                $scope.completeInfo = {
                    mId: 'completeInfo',
                    title: getRcString('tip'),
                    okHandler: function () {
                        setTimeout(function () {
                            $state.go('global.content.user.information');
                        }, 500);
                    }
                };

                $scope.add_dev_model = {
                    mId: 'add_dev_model',
                    title: getRcString('add-device'),
                    autoClose: false,
                    okHandler: function (modal) {
                        if (isCompleted) {
                            $scope.$broadcast('disabled.ok#add_dev_model');
                            var addDev = $scope.addDev,
                                // 只能添加一个设备
                                devs = {
                                    shopId: shopId,
                                    data: [{
                                        optType: addDev.optType,
                                        devices: [{
                                            devAlias: addDev.devAlias,
                                            devSn: addDev.devSn,
                                            devType: addDev.devType
                                        }]
                                    }]
                                },
                                // 添加的设备信息
                                dev = devs.data[0];

                            // 判断设备sn是否已经存在
                            commonInst.checkSnIsExist([], addDev.devSn).then(function () {
                                if (addDev.isIRF) {
                                    dev.groupType = 'IRF';
                                    if (addDev.groupId == '-1') {  //  新增
                                        dev.groupName = addDev.groupName;
                                        dev.optType = 1;
                                    } else {  //  添加到已存在
                                        dev.groupId = addDev.groupId;
                                        dev.optType = 2;
                                    }
                                }

                                //TODO
                                $http.post(URL_POST_ADD_DEV, JSON.stringify(devs)).success(function (data) {
                                    if ($scope.isFatAp == 1) {
                                        if (topGroupId) {
                                            ajaxReqApIntoGroup(topGroupId, addDev.devSn, addDev.devSn);
                                        } else {
                                            $http.post(URL_AP_GROUP, {
                                                Method: "getCloudApgroupNameList",
                                                query: {
                                                    userName: userName,
                                                    nasId: shopId
                                                }
                                            }).success(function (data) {
                                                topGroupId = data.message.groupId;
                                                ajaxReqApIntoGroup(topGroupId, addDev.devSn, addDev.devSn);
                                            }).error(function (msg) {
                                                $alert.noticeDanger(msg || getRcString('error'));
                                            });
                                        }
                                    }

                                    if (data.code == 0) {
                                        modal.hide();
                                        $alert.noticeSuccess(getRcString('add-success'));
                                        loadData();
                                    } else {
                                        $alert.noticeDanger(data.message);
                                    }
                                    $scope.$broadcast('enable.ok#add_dev_model');
                                }).error(function (msg) {
                                    $alert.noticeDanger(msg || getRcString('error'));
                                    $scope.$broadcast('enable.ok#add_dev_model');
                                });
                            }, function (msg) {
                                $alert.noticeDanger(msg);
                                $scope.$broadcast('enable.ok#add_dev_model');
                            });
                        } else {
                            $scope.$broadcast('hide#add_dev_model');
                            $scope.$broadcast('show#completeInfo');
                        }
                    }
                };
                $scope.adddev = function () {
                    $scope.addDev.devType = $scope.devtype[0].value;
                    $scope.$broadcast('show#add_dev_model');
                };
                $scope.validDevSn = {
                    url: sprintf(URL_ISEXIST_SAME_DEVSN, '{value}'),
                    method: 'get',// 请求方式
                    live: false,
                    validFn: function (resp) {
                        if (resp.code == 0) {
                            return true;
                        } else {
                            return resp.code;
                        }
                    }
                };

                //  close modal and reset form
                $scope.$on('hidden.bs.modal#modify_dev_alias_model', function () {
                    $scope.$apply(function () {
                        // reset form
                        $scope.modAlias.$setPristine();
                        $scope.modAlias.$setUntouched();
                    });
                });

                //  close modal and reset form
                $scope.$on('hidden.bs.modal#add_dev_model', function () {
                    $scope.$apply(function () {
                        $scope.addDev.devAlias = '';
                        $scope.addDev.devSn = '';
                        $scope.addDev.isIRF = false;
                        $scope.addDev.groupName = '';
                        $scope.addDev.groupId = '-1';
                        $scope.addDev.devType = $scope.devtype[0].value;
                        // reset form
                        $scope.devAddForm.$setPristine();
                        $scope.devAddForm.$setUntouched();
                    });
                });

                $scope.$watch('modAlias.$invalid', function (v) {
                    $scope.$broadcast((v ? 'disabled' : 'enable') + '.ok#modify_dev_alias_model');

                });
                /**
                 * 新增设备表单禁用或启动按钮
                 */
                function setAddModalOkDisabled() {
                    var dev = $scope.addDev, invalid = $scope.devAddForm.$invalid, disabled;
                    // 如果是IRF设备需要手动判断
                    dev.isIRF && (disabled = dev.groupId == -1 ? !dev.groupName : !dev.groupId);
                    $scope.$broadcast((disabled || invalid ? 'disabled' : 'enable') + '.ok#add_dev_model');
                }

                // 新增设备
                $scope.$watch('devAddForm.$invalid', setAddModalOkDisabled);
                $scope.$watch('addDev', setAddModalOkDisabled, true);

                // 批量增加设备

                $scope.batchAddSite = function () {
                    $('#file').trigger('click');
                };
                $('#file').on('change', function (e) {
                    $http({
                        url: "/v3/ace/oasis/oasis-rest-shop/restshop/fileupload/devicefile?shop_id=" + shopId,
                        method: 'POST',
                        headers: {
                            'Content-Type': undefined
                        },
                        transformRequest: function () {
                            var formData = new FormData();
                            formData.append('file', $('#file')[0].files[0]);
                            return formData;
                        }
                    }).success(function (data) {
                        if (data.code == 0) {
                            $alert.noticeSuccess(data.message);
                            $state.go('^.dev_new_log', {shopid: shopId})
                        } else {
                            $alert.noticeDanger(data.message)
                        }
                    });
                });
            });
        }];
});