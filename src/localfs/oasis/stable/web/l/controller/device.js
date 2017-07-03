/**
 * Created by zhangfuqiang on 2016/11/4.
 */
define(['jquery', 'css!l/css/device', 'jqueryZtree', 'l/directive/dashboard-ztree', 'css!ztree_css'], function ($) {
        return ['$scope', '$http', '$timeout', '$alertService',
            function ($scope, $http, $timeout, $alert) {
                //  点击的表格的行的数据
                $scope.row = {};
                //  表格中内嵌菜单
                $scope.menu = $('.l-device-menu');
                //  设备管理表格
                $scope.deviceTable = {
                    url: '../l/json/devices.json',
                    showToolbar: true,
                    // extraCls: 'default_table',
                    columns: [
                        {sortable: true, field: 'apName', title: 'AC名称'},
                        {sortable: true, field: 'macInfo', title: 'MAC'},
                        {sortable: true, field: 'apDetail', title: 'AC描述'},
                        {
                            field: 'operate',
                            title: '操作',
                            class: 'operate_mark',
                            render: '<a type="button" class="refresh list-link" ><i style="background-position: -57.78571429rem -3.28571429rem;" class="fa fa-mydetail"></i> </a>'
                        }
                    ],
                    onClickCell: function (field, val, row, $td) {
                        if (field === 'operate') {
                            var offset = $td.offset();
                            var wHeight = $(window).height();
                            var oHeight = $scope.menu.height();
                            $scope.$apply(function () {
                                $scope.row = row;
                            });
                            if (offset.top + oHeight + 30 > wHeight) {
                                $scope.menu.css({
                                    top: offset.top - oHeight + 10,
                                    left: offset.left
                                }).show();
                            } else {
                                $scope.menu.css({
                                    top: offset.top + 30,
                                    left: offset.left
                                }).show();
                            }
                        }
                    }
                };
                //  点击菜单项隐藏菜单
                $scope.menu.delegate('li', 'click', function () {
                    $scope.menu.hide();
                });

                $(document).on('click', function (e) {
                    var $target = $(e.target);
                    if (!$target.is('td.operate_mark') && !$target.is('td.operate_mark a') && !$target.is('td.operate_mark a i')) {
                        $scope.menu.hide();
                    }
                });
                $('div').scroll(function () {
                    $scope.menu.hide();
                });

                $(window).on('resize', function () {
                    $scope.menu.hide();
                });

                $scope.main = {
                    upgrade: function () {
                        $alert.confirm('是否升级设备版本到V16.02.release？', function () {
                            $alert.noticeSuccess('设备升级成功!');
                        });
                    },
                    operate: function () {
                        $alert.notice('设备操作');
                    },
                    command: function () {
                        $scope.$broadcast('show#cmdHelper');
                    },
                    cfgRestore: function () {
                        $scope.$broadcast('show#cfgRestore');
                    },
                    fileSystem: function () {
                        $scope.$broadcast('show#fileModal');
                    }
                };

                // 文件操作
                $scope.fileModal = {
                    modal: {
                        mId: 'fileModal',
                        showFooter: false,
                        showHeader: false
                    },
                    upload: {
                        disable: true,
                        click: function () {
                            $alert.notice('上传文件到' + $scope.file.name);
                        }
                    },
                    download: {
                        disable: true,
                        click: function () {
                            $alert.notice('下载文件' + $scope.file.name);
                        }
                    },
                    rename: {
                        disable: true,
                        click: function () {
                            $alert.notice('重新命名' + $scope.file.name);
                        }
                    },
                    remove: {
                        disable: true,
                        click: function () {
                            $alert.notice('删除文件' + $scope.file.name);
                        }
                    },
                    close: function () {
                        $scope.$broadcast('hide#fileModal');
                    }
                };

                $timeout(function () {
                    $scope.fileModal.fileTree = $.fn.zTree.init($('#fileTree'), {
                        view: {showIcon: true},
                        async: {enable: true, type: 'get', otherParam: {}, url: '../l/json/file-tree.json'},
                        callback: {
                            onClick: function (e, name, node) {
                                $scope.$apply(function () {
                                    $scope.file = node;
                                    if (node.isParent) {
                                        $scope.fileModal.upload.disable = false;
                                        $scope.fileModal.download.disable = true;
                                        $scope.fileModal.rename.disable = false;
                                        $scope.fileModal.remove.disable = false;
                                    } else {
                                        $scope.fileModal.upload.disable = true;
                                        $scope.fileModal.download.disable = false;
                                        $scope.fileModal.rename.disable = false;
                                        $scope.fileModal.remove.disable = false;
                                    }
                                });
                            }
                        }
                    });
                });

                //  命令助手
                $scope.cmdHelper = {
                    modal: {
                        mId: 'cmdHelper',
                        modalSize: 'lg',
                        showHeader: false
                    },
                    cmdStr: '',
                    setFocus: function () {
                        $('[ng-model="cmdHelper.cmdStr"]').focus();
                    },
                    keyup: function (e) {
                        if (e.keyCode === 13 && $scope.cmdHelper.cmdStr) {
                            if ($scope.cmdHelper.cmdStr == 'clear') {
                                $scope.cmdHelper.lines = $scope.cmdHelper.lines.slice(0,3);
                            } else {
                                $scope.cmdHelper.lines.push({txt: '<H3C>  ' + $scope.cmdHelper.cmdStr, time: +new Date()});
                            }
                            $scope.cmdHelper.cmdStr = '';
                        }
                    },
                    lines: [{txt: '欢迎使用命令助手'},
                        {txt: '版本号：V6.0'},
                        {txt: '版权所有 新华三集团'}]
                };

                //   配置还原
                $scope.cfgRestore = {
                    modal: {
                        mId: 'cfgRestore',
                        showHeader: false
                    }
                };

                $scope.$on('shown.bs.modal#cmdHelper', function () {
                    $('[ng-model="cmdHelper.cmdStr"]').focus();
                });
            }]
    }
);