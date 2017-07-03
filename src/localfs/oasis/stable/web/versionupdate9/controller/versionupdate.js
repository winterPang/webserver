define(['utils', 'jquery'], function (Utils, $) {
    return ['$scope', '$http', '$alertService', '$interval', '$filter', '$timeout', '$state', function ($scope, $http, $alert, $interval, $filter, $timeout, $state) {

        var UNMATCHED_TEXT = 'unmatched'; //  没有匹配的设备，不显示，后期该字段可能会变化

        function getRcString(attrName) {
            return Utils.getRcString("device_infor_rc", attrName);
        }

        /**
         * 设备升级流程
         *
         * 1、获取上所有的分支信息
         * 2、获取设备类型信息（分组下的设备和总部下面的设备）
         * 3、获取设备的最新版本信息
         * 4、获取选择的设备进行升级
         * 5、提交升级接口进行升级
         */

        var rcTableTitle = getRcString('Version_HEADER').split(',');
        var urlGetModelVersion = '/v3/ace/oasis/oasis-rest-dev-version/restdev/o2oportal/getModelVersions';
        var urlGetModels = '/v3/apmonitor/getApModelCountByCloudGroup?midId=#midId#&topId=#topId#';
        var urlGetAps = '/v3/apmonitor/getApModelInfoBycloudapgroup?topId=#topId#&midId=#midId#';
        var urlCloudApGroup = '/v3/cloudapgroup';
        var urlUpdateDevices = '/v3/base/updateDevices';

        var topId = '';

        var requestApGroup = $http.post(urlCloudApGroup, {
            Method: "getCloudApgroupNameList",
            query: {
                userName: $scope.userInfo.user,
                nasId: $scope.sceneInfo.nasid
            }
        });

        $scope.isCheck = false;

        $scope.template = {
            filterBranch: 'headquarters',
            branchList: [],
            branch: ''
        };

        $scope.updateType = {versionType: '1'};

        // 初始化设备表格
        $scope.devModelTable = {
            tId: 'devModelTable',
            // searchable: true,
            showCheckBox: true,
            pageSize: 5,
            pageList: [5, 10, 20, 50, 100],
            columns: [
                {sortable: true, field: 'ApModel', title: rcTableTitle[0]},
                {sortable: true, field: 'ApCount', title: rcTableTitle[1]},
                {sortable: true, field: 'version', title: rcTableTitle[2]}
            ],
            operateWidth: 240,
            operateTitle: rcTableTitle[3],
            operate: {
                edit: {
                    enable: function (val, row) {
                        return row.ApCount;
                    },
                    click: function (e, row, $btn) {
                        $state.go('^.versionupdate9_updata_apmodel', {
                            apmodel: row.ApModel,
                            topId: topId,
                            groupID: $scope.template.filterBranch !== 'headquarters' ? $scope.template.branch : ''
                        });
                    }
                }
            },
            tips: {
                edit: getRcString("title")
            },
            icons: {
                edit: 'fa fa-mydetail'
            }
        };

        $scope.updateModal = {
            mId: 'updateModal',
            title: getRcString('SELECT'),
            okHandler: function () {
                var _commData = {};
                if ($scope.updateType.versionType == "1") {
                    _commData.saveConfig = 0;
                    _commData.rebootDev = 1;
                } else if ($scope.updateType.versionType == "2") {
                    _commData.saveConfig = 1;
                    _commData.rebootDev = 1;
                } else if ($scope.updateType.versionType == "3") {
                    _commData.saveConfig = 0;
                    _commData.rebootDev = 0;
                }
                // 1、先获取选择的数据
                $scope.$broadcast('getSelections#devModelTable', function (data) {
                    var apModelObj = {}; //  存储
                    var apModelNameArr = $.map(data, function (item) {
                        // 存储ApModel对应的信息
                        apModelObj[item.ApModel] = item;
                        return item.ApModel;
                    });
                    // 2、请求各个设备类型下面的设备信息
                    $http.post(urlGetAps.replace('#topId#', topId)
                            .replace('#midId#', $scope.template.filterBranch == 'headquarters' ? '' : $scope.template.branch),
                        {model: apModelNameArr}).success(function (aps) {
                        var postData = [];
                        // 3、拼接需要提交的数据
                        if (aps.apModelInfo) {
                            $.each(aps.apModelInfo, function (i, m) {
                                var versionInfo = apModelObj[m.apModel];
                                $.each(m.apList, function (i, ap) {
                                    postData.push($.extend(true, {}, _commData, {
                                        devSN: ap.apSN,
                                        fileSize: versionInfo.size,
                                        devVersionUrl: versionInfo.url,
                                        softwareVersion: versionInfo.version
                                    }));
                                });
                            });
                            if (postData.length) {
                                $http.post(urlUpdateDevices, {param: postData}).success(function (data) {
                                    if (data.retCode == 0) {
                                        $scope.isCheck = false;
                                        $alert.msgDialogSuccess(getRcString('VERXION_SUC'));
                                        getDevModels();
                                    }
                                });
                            } else {
                                $alert.msgDialogError(getRcString('NO_DEVICES_UPGRADE'))
                            }
                        }
                    });
                });
            }
        };

        $.each([
            'check.bs.table#devModelTable', 'uncheck.bs.table#devModelTable',
            'check-all.bs.table#devModelTable', 'uncheck-all.bs.table#devModelTable'
        ], function (a, b) {
            $scope.$on(this, function () {
                $scope.$broadcast('getSelections#devModelTable', function (data) {
                    $scope.$apply(function () {
                        $scope.isCheck = data.length;
                    });
                });
            });
        });

        function getDevModels() {
            if (!topId || ($scope.template.filterBranch !== 'headquarters' && !$scope.template.branch)) {
                return
            }
            var mId = $scope.template.filterBranch == 'headquarters' ? null : $scope.template.branch;
            $http.get(urlGetModels.replace('#topId#', topId).replace('#midId#', mId || '')).success(function (data) {
                if (data.apCountList && data.apCountList.length) {
                    //  获取设备办本信息
                    $http.post(urlGetModelVersion, {
                        models: $.map(data.apCountList, function (item) {
                            return item.ApModel;
                        })
                    }).success(function (vers) {
                        var dataArr = $.map(data.apCountList, function (v) {
                            if (v.ApModel == UNMATCHED_TEXT && v.ApCount == 0) {
                                return null;
                            }
                            if (vers.data && vers.data[0]) {
                                $.each(vers.data, function (k2, m) {
                                    if (m.model === v.ApModel) {
                                        $.extend(true, v, m.version_list[0] || {});
                                    }
                                });
                            }
                            return v;
                        });
                        $scope.$broadcast('load#devModelTable', dataArr);
                    });
                }
            });
        }

        $scope.upgrade = function () {
            $scope.$broadcast('show#updateModal');
        };

        $scope.switchBranch = function () {
            $scope.$broadcast('load#devModelTable', []);
            getDevModels();
        };

        requestApGroup.success(function (data) {
            if (data.retCode == 0) {
                topId = data.message.groupId;
                $scope.template.branchList = data.message.subGroupList;
                $scope.template.branch = $scope.template.branchList.length ? $scope.template.branchList[0].groupId : null;
                getDevModels();
            }
        });
    }];
});
