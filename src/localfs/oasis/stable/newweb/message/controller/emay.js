define(['jquery','utils', 'bootstrapValidator'], function ($,Utils) {
    return ['$scope', '$rootScope', '$http', '$timeout', '$alertService', '$state',
        function ($scope, $rootScope, $http, $timeout, $alert, $state) {
            var prefix = '/v3/ace/oasis/oasis-rest-emay/restapp/emay/';
            //请求路径  ?switch=xxx
            var listUrl = prefix + 'emayconf',   //  展示表格数据url
                commitUrl = prefix + 'emayconf', //  注册短信配置url
                delUrl = prefix + 'emayconf';  // 删除短信配置url

            //默认显示表格
            $scope.showTable = true;
            $scope.updatePwd = '';
            $scope.row = {};
            $scope.showPWD = false;
            function getRcString(attrName){
                    return Utils.getRcString("sys_config_rc",attrName);
                }
            //加载表格数据，判断是否显示表格
            function loadTableData() {
                $timeout(function () {
                    $scope.$broadcast('showLoading');
                });
                $http.get(listUrl).success(function (data) {
                    if (data.code == 1) {
                        $scope.showTable = false;
                        $scope.$broadcast('load', []);
                    } else {
                        $scope.$broadcast('load', [data.data]);
                    }
                    $scope.$broadcast('hideLoading');
                }).error(function (data) {
                    $alert.noticeDanger(data);
                    $scope.$broadcast('hideLoading');
                });
            }
            var page=getRcString("title").split(','); 
            $scope.$watch("permission", function (perm) {
                if (perm) {
                    var p = $.grep(perm, function (o) {
                        return o.id == 'message';
                    });

                    if (!p.length) {
                        $state.go("global.content.system.operate_log");
                    } else {
                        var MSG_WRITE = (p[0].permission.indexOf('MSG_WRITE') !== -1 || p[0].permission.indexOf('ALL') !== -1) || false;
                        //表格配置
                        var msgOptions = {
                            pagination: false,
                            formatNoMatches: function () {
                                return MSG_WRITE
                                    ? '<div>'+getRcString("not-fond")+'<a id="gotoregister" style="cursor: pointer;">'+getRcString("register")+'</a></div>'
                                    : '<div>'+getRcString("not-fond").split(',')[0]+'</div>';
                            },
                            columns: [
                                {field: 'emaySn', title: page[0]},
                                {field: 'emayKey', title: page[1]},
                                {field: 'balance', title: page[2], render: '{balance}'+page[5]},
                                {field: 'userName', title: page[3]}
                            ]
                        };
                    // 如果没有写权限就不显示删除按钮
                    if (MSG_WRITE) {
                            msgOptions.columns.push({
                                field: 'delete', title: page[4],
                                formatter: function (value, row) {
                                    return '<a style="cursor: pointer;"><span class="glyphicon glyphicon-remove"></span></a>'
                                }
                            });
                            msgOptions.onClickCell = function (field, value, row) {
                                if (field == "delete") {
                                    $alert.confirm(getRcString("sure-delete"), function () {
                                        $http.delete(delUrl).success(function (data) {
                                            if (data.code == 0) {
                                                $scope.$broadcast('load', []);
                                                $alert.noticeSuccess(getRcString("success-delete"));
                                                $scope.showTable = false;
                                            } else {
                                                $alert.notice(data.message);
                                            }
                                        }).error(function (data) {
                                            $alert.noticeDanger(data);
                                        });
                                    });
                                }
                            };
                        }
                        $scope.msgOptions = msgOptions;
                        loadTableData();
                     }
                }
            });

            /**
             * 重置表单
             */
            $scope.$on('hidden.bs.modal', function () {
                $scope.row.updatePwd = '';
                // 重置表单
                $scope.modifyForm.updatePwd.$setPristine();
                $scope.modifyForm.updatePwd.$setUntouched();
            });

            $('[bs-table="msgOptions"]').delegate('#gotoregister', 'click', function () {
                $scope.$apply(function () {
                    $scope.serialNumberKey = '';
                    $scope.serialNumberCode = '';
                    $scope.serialNumber = '';
                    $scope.emaySigner = '';  //新增的属性，可以为空
                    $scope.showTable = false;
                    // 初始化表单
                    $scope.serialNumberForm.$setPristine();
                    $scope.serialNumberForm.$setUntouched();
                });
            });
            //表单提交事件
            $scope.onSubmit = function () {
                var commit = {
                    emaySn: $scope.serialNumber,
                    emayKey: $scope.serialNumberKey,
                    password: $scope.serialNumberCode,
                    emaySigner: $scope.emaySigner //  新增参数  20161031
                };
                $http.post(commitUrl, JSON.stringify(commit)).success(function (data) {
                    if (data.code == 0) {
                        $scope.showTable = true;
                        $scope.serialNumberCode = '';
                        $scope.serialNumberKey = '';
                        $scope.serialNumber = '';
                        $scope.emaySigner = '';  //新增的属性，可以为空
                        // 初始化表单
                        $scope.serialNumberForm.$setPristine();
                        $scope.serialNumberForm.$setUntouched();
                        $alert.noticeSuccess(getRcString("success-register"));
                        // 注册成功，加载表格数据
                        loadTableData();
                    } else {
                        $alert.msgDialogError(data.message);
                    }
                }).error(function (data) {
                    $alert.noticeDanger(data);
                });
            };
            $scope.refresh = function () {
                $scope.$broadcast('refresh', {
                    url: listUrl
                });
            }
        }];
});