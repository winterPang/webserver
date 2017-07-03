/**
 * 显示模块列表
 * @author kf.zhangfuqiang@h3c.com
 * @description  显示模块列表
 */
define(['jquery'], function ($) {
    return ['$scope', '$http', '$alertService', '$element', function ($scope, $http, $alert, $ele) {
        var userName = ($scope.userInfo && $scope.userInfo.user) ? $scope.userInfo.user : 'panglidong',
            URL_ADD_MODULE = '../../init/developer/list.json',
            URL_LIST_MODULE = '../../init/developer/list.json',
            rc = $ele.find('[data-locales]').attr('data-locales').split('#');
        $scope.disableBtnOpen = true;
        $scope.options = {
            showCheckBox: true,
            url: URL_LIST_MODULE,
            columns: [
                {field: "userName", title: rc[0]},
                {field: "appId", title: rc[1]},
                {field: "appName", title: rc[2]}
            ],
            operateWidth: 100,
            operate: {
                edit: function (e, row) {
                    $scope.$state.go('global.content.scenes.developer_modify', {
                        userName: row.userName,
                        appId: row.appId
                    });
                }
            }
        };
        $scope.openModule = function () {
            var selected = [];
            if ($scope.selectModule && $scope.selectModule.length) {
                $.each($scope.selectModule, function () {
                    selected.push(this.appName);
                });
            }
            $alert.confirm(rc[3].replace('%s', selected.join('，')));
        };
        $scope.applyApp = {
            modal: {
                mId: 'applyAppModal',
                okHandler: function (modal) {
                    var appName = $scope.applyApp.appName;
                    $http.get(URL_ADD_MODULE, {
                        userName: userName,
                        moduleName: $scope.applyApp.appName
                    }).success(function (data) {
                        $scope.$broadcast('append', {
                            userName: userName,
                            appName: appName,
                            appId: makeId()
                        });
                    }).error(function () {
                        $alert.noticeDanger('request error.');
                    });
                }
            },
            showModal: function () {
                $scope.$broadcast('show#applyAppModal');
            },
            appName: ''
        };
        // 关闭模态框表单处理
        $scope.$on('hidden.bs.modal#applyAppModal', function () {
            $scope.applyApp.appName = '';
            $scope.applyAppForm.$setUntouched();
            $scope.applyAppForm.$setPristine();
        });

        function makeId() {
            return Math.random().toString(16).substr(2);
        }

        function setOpenStatus() {
            $scope.$broadcast('getSelections', function (data) {
                $scope.$apply(function () {
                    $scope.selectModule = data;
                    $scope.disableBtnOpen = !data || !data.length;
                });
            });
        }

        $scope.$on('check.bs.table', setOpenStatus);
        $scope.$on('uncheck.bs.table', setOpenStatus);
        $scope.$on('check-all.bs.table', setOpenStatus);
        $scope.$on('uncheck-all.bs.table', setOpenStatus);
        $scope.$on('check-some.bs.table', setOpenStatus);
        $scope.$on('uncheck-some.bs.table', setOpenStatus);
    }];
});