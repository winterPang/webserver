define(['angularAMD', 'jqueryZtree'], function (app, echarts) {
    return app.directive('dashboardZtree', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            template: '<ul class="ztree"></ul>',
            scope: {
                options: '=dashboardZtree'
            },
            link: function ($scope, $ele, attr) {
                var id = 't' + new Date().getTime().toString(16) + parseInt(Math.random() * 10);
                var defaults = {
                    ajax: {
                        url: '',
                        params: {},
                        method: 'get'
                    },
                    checkLevel: 'all',//'all','parent','child'
                    tree: {
                        view: {
                            showIcon: false
                        },
                        async: {
                            enable: true,
                            type: 'get',
                            otherParam: {},
                            url: ''
                        },
                        check: {
                            enable: true,
                            nocheckInherit: true
                        },
                        callback: {}
                    }
                };
                $scope.treeObj = {};
                $scope.$watch('selected', function (selected) {
                    $scope.$emit('select.ztree', selected);
                }, true);
                $scope.$watch('options', function (opts) {
                    function evalSelected() {
                        var tree = $scope.treeObj[id];
                        $timeout(function () {
                            $scope.$apply(function () {
                                var checked = tree.getCheckedNodes();
                                var selected = [];
                                $.each(checked, function () {
                                    var node = {
                                        id: this.id,
                                        name: this.name
                                    };
                                    if (options.checkLevel == 'all') {
                                        selected.push(node);
                                    } else if (options.checkLevel == 'parent') {
                                        if (this.isParent) {
                                            selected.push(node);
                                        }
                                    } else if (options.checkLevel == 'child') {
                                        if (!this.isParent) {
                                            selected.push(node);
                                        }
                                    }
                                });
                                $scope.selected = selected;
                            });
                        });
                    }

                    var options = $.extend(true, {}, defaults, opts);
                    options.tree.async.type = options.ajax.method;
                    options.tree.async.url = options.ajax.url;
                    options.tree.async.otherParam = options.ajax.params;
                    options.tree.callback.onCheck = function (e, treeId) {
                        evalSelected();
                    };
                    options.tree.callback.onAsyncSuccess = function () {
                        evalSelected();
                    };
                    $scope.treeObj[id] = $.fn.zTree.init($ele, options.tree);
                }, true);
            }
        }
    }]);
});