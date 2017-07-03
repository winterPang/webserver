define(['jquery', 'jqueryZtree', 'css!frame/libs/ztree/css/zTreeStyle', 'css!devmanage/css/newdevmanage'], function ($) {
    return ['$scope', '$rootScope', '$alertService', function ($scope, $rootScope, $alert) {
        $scope.flags = {
            simple_branch: $rootScope.oasisType == 0 ? 'simple' : '',
            ing: false
        };
        $scope.upgradeList = {
            url: '../devmanage/init/devList.json',
            extraCls: 'new_style_170413_table',
            showCheckBox: true,
            operateWidth: 100,
            tId: 'upgradeList',
            columns: [
                {field: 'name', showTooltip: true, title: '名称'},
                {field: 'sn', showTooltip: true, title: '序列号'},
                {field: 'ver', showTooltip: true, title: '当前版本'},
                {field: 'vernew', showTooltip: true, title: '最新版本'},
                {field: 'uptime', showTooltip: true, title: '上次重启时间'},
                {field: 'upresult', showTooltip: true, title: '上次重启结果'},
                {
                    field: 'upstatus', showTooltip: true, title: '当前重启状态', formatter: function (val, row) {
                    return $scope.flags.ing ? '<i class="fa fa-refresh"></i>' : val;
                }
                }
            ]
        };
        $scope.hisUpListModal = {
            mId: 'hisUpListModal',
            title: '历史重启记录'
        };
        $scope.hisUpListTable = {
            url: '../devmanage/init/devList.json',
            extraCls: 'new_style_170413_table',
            operateWidth: 100,
            tId: 'hisUpListTable',
            columns: [
                {field: 'name', showTooltip: true, title: '名称'},
                {field: 'sn', showTooltip: true, title: '序列号'},
                {field: 'uptime', showTooltip: true, title: '上次重启时间'},
                {field: 'upresult', showTooltip: true, title: '上次重启结果'}
            ]
        };
        $scope.showHisUpListModal = function () {
            $scope.$broadcast('show#hisUpListModal');
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
            }
        };
        $scope.showScreenMore = function () {
            $scope.$broadcast('show#screenMore');
        };
        $scope.evts = {};
        $scope.evts.unSelectAll = function () {
            $('.label-opt').find('li').removeClass('colors');
        };
        $scope.upgradeTip = function () {
            $scope.flags.ing = true;
            $scope.$broadcast('refresh#upgradeList');
        };
    }];
});