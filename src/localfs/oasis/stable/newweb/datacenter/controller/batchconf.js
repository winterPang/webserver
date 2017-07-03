define(['jquery', 'jqueryZtree', 'css!frame/libs/ztree/css/zTreeStyle', 'css!devmanage/css/newdevmanage'], function ($) {
    return ['$scope', '$rootScope', '$alertService', '$http', function ($scope, $rootScope, $alert, $http) {
        $http.get('../datacenter/init/mouldinfo.json').success(function (data) {
            $scope.moulds = data;
            $scope.mouldlitable = {
                "total": data[1].mould_li.count,
                "rows": data[1].mould_li.rows
            }
        });
        $scope.flags = {
            simple_branch: $rootScope.oasisType == 0 ? 'simple' : '',
            currentStep: '',
            show_mould_li_table: 'false',
            edit_conf_mould: false,
            is_high_conf: false,
            ing: false
        };

        var $labelBox = $('.options-box .label-opt');
        $labelBox.delegate('li', 'click', function () {
            $(this).toggleClass('colors');
        });
        $scope.mouldLiTable = {
            tId: 'mouldLiTable',
            showCheckBox: true,
            columns: [
                {field: 'name', showTooltip: true, title: '文件名称'},
                {field: 'creater', showTooltip: true, title: '创建者'},
                {field: 'lasttime', showTooltip: true, title: '创建时间'},
                {field: 'size', showTooltip: true, title: '文件大小'}
            ],
            operateWidth: 100,
            operate: {
                download: {
                    click: function () {
                        $scope.$apply(function () {
                            $alert.noticeSuccess('正在下载...');
                        });
                    }
                }
            }
        };
        function zTreeOnClick(event, treeId, treeNode) {
            $scope.$apply(function () {
                $scope.branchName = treeNode.name;
            });
        }

        var data = {
            message: [
                {
                    name: '龙冠实验局', sub: [
                    {
                        name: '龙冠和谐大厦', type: 'nas', sub: [
                        {name: '绿洲分组'},
                        {name: '路由器分组'},
                        {name: '无线分组'},
                        {name: '资料部分组'}
                    ]
                    },
                    {
                        name: '东电实验局', type: 'nas', sub: [
                        {name: '交换机分组'},
                        {name: '分组'},
                        {name: '无线分组'},
                        {name: '资料部分组'}
                    ]
                    }
                ]
                }
            ], retCode: 0
        };
        var setting = {
            treeId: "applicationTree",
            data: {
                key: {
                    children: "sub",
                    name: "name",
                    checked: "isChecked"
                }
            },
            view: {
                showIcon: false
            },
            callback: {
                onClick: zTreeOnClick
            },
            async: {
                enable: true
            }
        };
        var treeObj = $.fn.zTree.init($("#branchTree"), setting, data.message);
        var nodes = treeObj.getNodes();
        for (var i = 0; i < nodes.length; i++) {
            treeObj.expandNode(nodes[i], true, true, true);
        }
        $scope.screenMore = {
            mId: 'screenMore',
            title: '高级筛选',
            beforeRender: function () {
                var $modalLabelBox = $('.label-opt');
                $modalLabelBox.delegate('li', 'click', function () {
                    $(this).toggleClass('colors');
                });
                var treeObj = $.fn.zTree.init($("#branchTree"), setting, data.message);
                var nodes = treeObj.getNodes();
                for (var i = 0; i < nodes.length; i++) {
                    treeObj.expandNode(nodes[i], true, true, true);
                }
            },
            okHandler: function () {
                $scope.flags.currentStep = 3;
                $scope.flags.show_mould_li_table = '';
            }
        };
        $scope.confInfoModal = {
            mId: "confInfoModal",
            title: "配置模板信息",
            showCancel: false,
            okText: '关闭'
        };
        $scope.$on('click-cell.bs.table#mouldLiTable', function (e, field, val, row) {
            if (field == 'name') {
                $scope.$broadcast('show#confInfoModal');
            }
        });
        $scope.evts = {
            showHisConfListModal: function () {
                $scope.$broadcast('show#hisConfListModal');
            },
            isHighConf: function () {
                $scope.flags.is_high_conf = true;
            },
            isCommonConf: function () {
                $scope.flags.is_high_conf = false;
            },
            closeEditArea: function () {
                $scope.flags.edit_conf_mould = false;
            },
            editConfMould: function () {
                $scope.flags.edit_conf_mould = true;
            },
            sureConf: function () {
                $scope.flags.ing = true;
                $scope.$broadcast('refresh#confList');
            },
            retMould: function () {
                $scope.flags.show_mould_li_table = 'false';
                $scope.flags.currentStep = '';
            },
            showMouldLiTable: function () {
                $scope.flags.show_mould_li_table = 'true';
                $scope.$broadcast('load#mouldLiTable', $scope.mouldlitable);
            },
            unSelectAll: function () {
                $labelBox.find('li').removeClass('colors');
            },
            delLot: function () {
                $alert.confirm('确定删除吗？')
            }
        };
        $scope.confList = {
            url: '../devmanage/init/devList.json',
            extraCls: 'new_style_170413_table',
            showCheckBox: true,
            operateWidth: 100,
            tId: 'confList',
            columns: [
                {field: 'name', showTooltip: true, title: '名称'},
                {field: 'sn', showTooltip: true, title: '序列号'},
                {field: 'status', showTooltip: true, title: '状态'},
                {field: 'type', showTooltip: true, title: '类型'},
                {field: 'model', showTooltip: true, title: '型号'},
                {field: 'group', showTooltip: true, title: '分组', visible: $scope.flags.simple_branch != 'simple'},
                {
                    field: 'conf', showTooltip: true, title: '配置情况', formatter: function (val, row) {
                    return $scope.flags.ing ? '<i class="fa fa-download"></i>' : val;
                }
                }
            ]
        };
        $scope.hisConfListModal = {
            mId: 'hisConfListModal',
            modalSize: 'lg',
            title: '历史下发配置记录'
        };
        $scope.hisConfListTable = {
            url: '../devmanage/init/devList.json',
            extraCls: 'new_style_170413_table',
            operateWidth: 100,
            tId: 'hisConfListTable',
            columns: [
                {field: 'name', showTooltip: true, title: '名称'},
                {field: 'sn', showTooltip: true, title: '序列号'},
                {field: 'status', showTooltip: true, title: '状态'},
                {field: 'type', showTooltip: true, title: '类型'},
                {field: 'model', showTooltip: true, title: '型号'},
                {field: 'confTime', showTooltip: true, title: '上次配置时间'},
                {field: 'confStatus', showTooltip: true, title: '上次配置状态'}
            ]
        };
    }];
});