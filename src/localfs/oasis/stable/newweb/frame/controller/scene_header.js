/**
 * Created by Administrator on 2016/8/23.
 */
define(['socketio', 'utils', 'xiaobeichat'], function (socketio, Utils) {
    return ['$scope', '$http', '$alertService','$timeout','$rootScope','$state', '$stateParams', function ($scope, $http, $alert,$timeout,$rootScope,$state,$stateParams) {

        $rootScope.sceneInfo = $stateParams;

        $rootScope.oasisType = 1;
        $rootScope.changeType = "切换至专业版";
        $rootScope.goAnother = function () {
            if($rootScope.oasisType == 0){
                $rootScope.changeType = "切换至极简版";
                $rootScope.oasisType = 1;
            }else {
                $rootScope.changeType = "切换至专业版";
                $rootScope.oasisType = 0;
            }
        };

        $scope.logout = function () {
            $alert.confirm(getRcString("logout-message"), function () {
                window.location.href = '/v3/logout'
            })
        };
        if( Utils.getLang() == 'cn'){
            $scope.cnLanguage='language-active';
        }else{
            $scope.enLanguage = 'language-active';
        }

        $scope.changeLange = function(lang){
            if(lang=="cn"){
                $scope.enLanguage = '';
                $scope.cnLanguage='language-active';
            }else{
                $scope.enLanguage = 'language-active';
                $scope.cnLanguage='';
            }
            Utils.setLang({'lang':lang},undefined,'.h3c.com');
            window.location.reload();
        };



        function getRcString(attrName) {
            return Utils.getRcString("sysNotice_detail_rc", attrName);
        }
        //存放所有菜单对应的权限信息
        $scope.permissions = [];

        //存放所有路由对应的appId
        $scope.routesData = {};

        //默认权限
        $scope.permission = {
            raw: [],
            read: false,
            write: false,
            execute: false
        };
        //是否显示下方内容，getMenuTree请求成功值为true
        $scope.content = {
            show: false
        };

        //获取菜单对应权限信息，以appId为标识，存放在$scope.permissions中
        function getPermission(obj) {
            $.each(obj, function () {
                if (this.tabs) {
                    if (this.tabs.length != 0) {
                        getPermission(this.tabs);
                    } else {
                        if($scope.routesData[this.sref] != "home"){
                            $scope.permissions.push({"id": $scope.routesData[this.sref], "permission": this.permission});
                        }
                    }
                } else {
                    if($scope.routesData[this.sref] != "home") {
                        $scope.permissions.push({"id": $scope.routesData[this.sref], "permission": this.permission});
                    }
                }
            });
        }


        //根据Id获取权限信息
        $scope.getPermissionById = function (id) {
            var permission = [];
            $.each($scope.permissions, function () {
                if (this.id == id) {
                    permission = this.permission;
                    return false;
                }
            });
            var str = permission.join();
            return {
                permission: permission,
                read: str.indexOf('_READ') != -1,
                write: str.indexOf('_WRITE') != -1,
                execute: str.indexOf('_EXEC') != -1
            };
        };

        //获取某菜单下的所有叶子菜单的appId
        function getAppId(obj) {
            if (obj.tabs) {
                if (obj.tabs.length == 0) {
                    $scope.firstMenuAppId.push($scope.routesData[obj.sref]);
                } else {
                    $.each(obj.tabs, function () {
                        getAppId(this);
                    })
                }
            } else {
                $scope.firstMenuAppId.push($scope.routesData[obj.sref]);
            }
        }

        //请求routes.json
        $http.get("../../init/newroutes.json").success(function (data) {
            //保存所有路由对应的appId
            $.each(data.routes, function () {
                $scope.routesData[this.state] = this.appId;
            });

            //已有全部appId，请求菜单信息

            /*$http.post("/v3/menuaccess/getMenuTree", {
                "model": "default",
                "lang": Utils.getLang()
            })*/

            $http.get("../frame/json/scene_menu.json").success(function (data) {
                if (data.retCode == 0) {
                    $scope.menu = data.data.menu;
                    $.each($scope.menu, function () {
                        if(this.tabs){
                            if (this.tabs[0].sref) {
                                this.sref = this.tabs[0].sref
                            } else {
                                this.sref = this.tabs[0].tabs[0].sref
                            }
                        }
                    });
                    getPermission($scope.menu);
                    //ngetPermission($scope.menu);
                    if (data.data.menu.home) {
                        $scope.permissions.push({"id": "home", "permission": data.data.menu.home.permission});
                    } else {
                        $scope.permissions.push({"id": "home", "permission": []});
                    }
                    $scope.content.show = true;
                    var r = $scope.getPermissionById($scope.routesData[$state.current.name]);
                    $scope.permission = {
                        raw: r.permission,
                        read: r.read,
                        write: r.write,
                        execute: r.execute
                    };
                    $scope.firstMenuAppIds = {};
                    $.each($scope.menu, function () {
                        $scope.firstMenuAppId = [];
                        getAppId(this);
                        $scope.firstMenuAppIds[this.sref] = $scope.firstMenuAppId;
                    });

                }
            }).error(function () {
                //window.location.reload();
            });
        });
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $scope.$watch("routesData", function () {
                var rights = $scope.getPermissionById($scope.routesData[toState.name]);
                $scope.permission = {
                    raw: rights.permission,
                    read: rights.read,
                    write: rights.write,
                    execute: rights.execute
                };
            });
        });

    }];
});