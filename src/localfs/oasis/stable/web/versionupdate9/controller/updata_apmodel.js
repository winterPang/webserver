/**
 * @author zhangfuqiang
 * @modify 2017/3/29  add device's alias support
 */
define(['echarts', 'utils', 'common9/devices'], function (ecahrts, Utils, Dev) {
    return ['$scope', '$http', '$alertService', '$interval', '$filter', '$timeout', '$state', '$stateParams',
        function ($scope, $http, $alert, $interval, $filter, $timeout, $state, $stateParams) {
            function getRcString(attrName) {
                return Utils.getRcString("device_infor_rc", attrName);
            }
            var updataStatusList;
            var getModelVersionUrl = Utils.getUrl('POST', 'o2o', '/oasis/oasis-rest-dev-version/restdev/o2oportal/getModelVersions', '/init/versionupdate5/get_model_version.json');
            var getApModelDetailUrl = Utils.getUrl('POST', '', '/apmonitor/getApModelInfoBycloudapgroup?topId=' + $stateParams.topId + '&midId=' + $stateParams.groupID, '/init/versionupdate5/system.json');
            var updateDevicesUrl = '/v3/base/updateDevices';
            var updateProcessUrl = '/v3/base/getAllUpdateStatus';
            var tableHead = getRcString("Version_HEADER").split(',');
            var updateErr = getRcString("VER_ERROR").split(',');
            var apModel = $stateParams.apmodel;
            var g_apSnListArr = [];
            var g_versionInfo = [];
            var processInterval = null;

            $scope.$on('$destroy', clearProcessInterval);

            //reset form
            $scope.updateType = {
                versionType: "2"
            };

            // 模态框中的下拉框
            $scope.modalForm = {
                selectVersion: '',
                onlineUpdate: true
            };

            $scope.apModelInfo = apModel;

            $scope.$on('hidden.bs.modal#versitionUpdata', function () {
                $scope.updateType = {
                    versionType: "2"
                };
                $scope.pwd = false;
                $scope.versionForm.$setPristine();
                $scope.versionForm.$setUntouched();
            });

            $scope.$on('shown.bs.modal#versitionUpdata', function () {
                $(window).trigger('resize');
            });

            var versionObj = {},   //  版本和详细信息的映射
                versionSelectorList = [],   //   加载下拉框的数据
                lastVersionName = '';

            var devSNPromise = Dev.getAlias($stateParams.nasid);
            // 先加载设备型号信息
            var request = $http.post(getModelVersionUrl.url, {models: [$scope.apModelInfo]});
            request.success(function (data) {
                // 缓存版本信息
                if (data.code == 0) {
                    $.each(data.data, function (k, v) {
                        $.each(v.version_list, function (i, ver) {
                            versionSelectorList.push({
                                value: ver.version,
                                text: ver.version + '(' + ver.description + ')'
                            });
                            versionObj[ver.version] = ver;
                        });
                    });

                    if (versionSelectorList.length) {
                        lastVersionName = versionSelectorList[0].value; //  最新版本是第一个
                    }
                    $scope.lastVersionName = lastVersionName;
                    $scope.modalForm.selectVersion = lastVersionName; //  初始化显示最新的版本，也就是第一个版本
                    $scope.versionSelectorList = versionSelectorList; //  渲染下拉框

                    // 在这里加载所有的设备信息
                    getApSnList();
                }
            });


            function clearProcessInterval() {
                processInterval && clearInterval(processInterval);
                processInterval = null;
            }

            //获取apsn
            function getApSnList() {
                $http.post(getApModelDetailUrl.url, {model: [apModel]}).success(function (data) {
                    if (data.errcode) {
                        return;
                    }
                    g_versionInfo = data.apModelInfo.length ? data.apModelInfo[0].apList : [];
                    var dataList = $.map(g_versionInfo, function (item) {
                        item.latestVersion = lastVersionName;
                        g_apSnListArr.push(item.apSN);
                        return item;
                    });
                    clearProcessInterval();
                    updateProcess(dataList);
                    $scope.isCheck = true;
                    processInterval = setInterval(function () {
                        updateProcess();
                    }, 5000);
                });
            }

            // 表格
            $scope.upgrad = {
                tId: 'upgradTable',
                // searchable: true,
                showCheckBox: true,
                showPageList: true,
                columns: [
                    {field: 'apName', title: tableHead[0]},
                    {field: 'apSN', title: tableHead[1]},
                    {
                        field: 'currVersion', title: tableHead[6],
                        formatter: function (val, row) {
                            return val ? val : row.softwareVersion ? row.softwareVersion.split(',')[1].trim() : '';
                        }
                    },
                    {field: 'latestVersion', title: tableHead[2]},
                    {
                        field: 'lastUpdateTime', title: tableHead[3],
                        formatter: function (val) {
                            return val ? $filter('date')(val, 'yyyy-MM-dd HH:mm:ss') : '';
                        }
                    },
                    {
                        searcher: {}, field: 'percent', title: tableHead[4], color: "green",
                        formatter: function (value, row, index) {
                            var id = row.apSn;
                            if (value === 0) {
                                return '<div>' + getRcString('Version_down_nostart') + '</div>';
                            } else if (value > 0 && value < 100) { //  只要percent有数据并且status不是升级成功就显示进度条
                                return ['<div class="progress" style="height:15px;line-height: 15px;margin-bottom: 0;">',
                                    '<div class="progress-bar" id="', id, '" style="width:', value, '%;background-color:#3eb0a1;">',
                                    '<span id="progressNumber" style="text-align:center;">', value, "%" + '</span>',
                                    '</div></div>'].join('');
                            } else {
                                return '<div>' + getRcString('Version_down_succ') + '</div>';
                            }
                        }
                    },
                    {
                        searcher: {}, field: 'status', title: tableHead[5],
                        formatter: function (value, row, index) {
                            return updateErr[value];
                        }
                    }
                ]
            };

            $scope.isCheck = true;
            $.each([
                'check.bs.table#upgradTable', 'uncheck.bs.table#upgradTable',
                'check-all.bs.table#upgradTable', 'uncheck-all.bs.table#upgradTable'
            ], function (a, b) {
                $scope.$on(this, function () {
                    $scope.$broadcast('getSelections#upgradTable', function (data) {
                        var canUpgradeDev = [];
                        $.each(data, function () {
                            var dev = this,
                                currVersion = dev.val ? dev.val : dev.softwareVersion ? dev.softwareVersion.split(',')[1].trim() : '';
                            canUpgradeDev.push(dev);
                        });
                        $scope.$apply(function () {
                            // console.debug(data);
                            $scope.licenseList = canUpgradeDev;
                            $scope.isCheck = !canUpgradeDev.length;
                        });
                    });
                });
            });

            //点击升级按钮
            $scope.upgrade = function () {
                $scope.modalForm.onlineUpdate = true;
                $scope.updateType = {
                    versionType: "2"
                };
                $scope.$broadcast("show#versitionUpdata")
            };

            //updata bs-modal
            $scope.updateOption = {
                mId: 'versitionUpdata',
                title: getRcString("SELECT"),
                modalSize: 'lg',
                okHandler: function () {
                    $scope.modalForm.onlineUpdate ? startUpdateVersion() : setTimeout(downloadVersion, 500);
                }
            };

            //点击升级确定按钮
            function startUpdateVersion() {
                var _commData = {}, postData = [], selectVersionObj = versionObj[$scope.modalForm.selectVersion];
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
                $scope.$broadcast('getSelections#upgradTable', function (data) {
                    $.each(data, function (i, v) {
                        postData.push($.extend(true, {}, _commData, {
                            devSN: v.apSN,
                            fileSize: selectVersionObj.size,
                            devVersionUrl: selectVersionObj.url,
                            softwareVersion: selectVersionObj.version
                        }));
                    });
                    //  升级设备
                    updateVersion(postData);
                });
            }

            function updateVersion(postData) {
                $http.post(updateDevicesUrl, {param: postData}).success(function (data) {
                    if (data.retCode == 0) {
                        updataStatusList=data.message;
                        getApSnList();
                    }
                });
            }

            function updateProcess(list) {
                $scope.$broadcast('getData#upgradTable', function (data) {
                    data = list || data;
                    $http.post(updateProcessUrl, {
                        devSN: $.map(data, function (item) {
                            return item.apSN;
                        })
                    }).success(function (dt) {
                        var resultList = [], statusCount = 0;
                        var statusObj={};
                        if(updataStatusList){
                            $.each(updataStatusList,function(i,val){
                                var snName=val.devSN;
                                statusObj[snName]=val.retCode;
                            });
                        }
                        devSNPromise.then(function fillData(alias) {
                            // 处理能匹配到的升级状态
                            $.each(data, function (i, d) {
                                var exist = false; //  查看在状态列表中是否有这个SN
                                $.each(dt.message, function (i, s) {
                                    console.log(updataStatusList);
                                    if (d.apSN === s.devSN) {
                                        exist = true;
                                        var sn=d.apSN;
                                        if(statusObj&&statusObj[sn]){
                                            s.status=statusObj[sn];
                                        }
                                        var _dev = $.extend(true, d, s, {apName: alias[d.apSN] || d.apName});
                                        resultList.push(_dev);
                                        if (s.status !== 0) { //0--正在升级; 1--升级成功; 2--下载失败; 3—设备空间不足;4--保存配置失败; 5--其他错误
                                            statusCount++;
                                        }
                                    }
                                });
                                if (!exist) {
                                    //  TODO  拼接数据,如果没有升级过就显示''
                                    var _dev = $.extend(true, d, {
                                        lastUpdateTime: '',
                                        percent: '',
                                        status: 6
                                    }, {apName: alias[d.apSN] || d.apName});
                                    resultList.push(_dev);
                                }
                            });
                            statusCount === resultList.length && clearProcessInterval();
                            // var fullList = [], count = 0;//  包含了版本号的
                            // function loadTableData(list) {
                            //     count++;
                            //     if (count === resultList.length) {
                            //         $scope.$broadcast('load#upgradTable', resultList);
                            //     }
                            // }
                            // loadTableData();
                            //  加载设备当前版本
                            // $.each(resultList, function () {
                            //     var item = this;
                            //     $http.get('/v3/devmonitor/app/system?devSN=' + item.apSN).success(function (data) {
                            //         item.currVersion = data.errcode ? '' : data.devHardVersion;
                            //         loadTableData();
                            //     }).error(function () {
                            //         item.currVersion = '';
                            //         loadTableData();
                            //     });
                            // });

                            $scope.$broadcast('load#upgradTable', resultList);
                        });
                    });
                });
            }

            $scope.download = function () {
                $scope.modalForm.onlineUpdate = false;
                $scope.$broadcast("show#versitionUpdata");
            };
            function downloadVersion() {
                window.open(versionObj[$scope.modalForm.selectVersion].url);
            }
        }];
});
