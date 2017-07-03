/**
 * 修改模块信息
 * @author kf.zhangfuqiang@h3c.com
 * @description  修改模块信息，包括文件查看，路由查询,文件上传等
 */
define(['jquery', 'jqueryZtree', 'css!developer/css/style', 'css!frame/libs/ztree/css/zTreeStyle'], function ($) {
    return ['$scope', '$stateParams', '$element', '$http', function ($scope, $stateParams, $ele, $http) {
        var userName = $stateParams.userName,
            appId = $stateParams.appId,
            $file = $('#file'),
            $tree = $('#ztree'),
            rc = $ele.find('[data-locales]').attr('data-locales').split('#');
        // 是否显示文件管理
        $scope.showFileTab = true;
        $scope.fileName = rc[0];
        // 上传文件按钮
        $scope.uploadFile = function () {
            $file.trigger('click');
        };
        // 路由列表
        $scope.routeList = {
            tId: 'routeList',
            searchable: true,
            url: '../../init/routes.json',
            columns: [
                {sortable: true, searcher: {}, field: 'state', title: 'state'},
                {sortable: true, searcher: {}, field: 'url', title: 'url'},
                {sortable: true, searcher: {}, field: 'templateUrl', title: 'templateUrl'},
                {sortable: true, searcher: {}, field: 'controller', title: 'controller'},
                {sortable: true, searcher: {}, field: 'dependencies', title: 'dependencies'}
            ],
            responseHandler: function (data) {
                return {
                    total: data.routes.length,
                    rows: data.routes
                };
            }
        };
        // 上传文件修改事件
        $file.on('change', function (e) {
            var value = e.target.value;
            $scope.$apply(function () {
                $scope.fileName = value || rc[0];
            });
        });
        // 显示文件ztree
        $scope.tree = $.fn.zTree.init($tree, {
            view: {
                line: false,
                selectedMulti: false
            },
            edit: {
                drag: {isMove: false, prev: false, next: false, inner: false, isCopy: false},
                enable: true,
                removeTitle: "删除文件(夹)",
                renameTitle: "重命名",
                editNameSelectAll: true,
                showRemoveBtn: true,
                showRenameBtn: true

            },
            data: {
                simpleData: {
                    enable: true
                },
                key: {
                    name: 'name',
                    title: 'name'
                }
            },
            async: {
                enable: true,
                type: 'get',
                url: '../../init/developer/fileTree.json'
            }
        });
        $scope.tree.expandAll(true);
    }];
});