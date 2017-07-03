define(["utils"], function (Utils) {
    return ['$scope', '$http', '$q','$rootScope','$state', function ($scope, $http, $q,$rootScope,$state) {
        //存放所有菜单对应的权限信息
        $scope.permissions = [];

        //存放所有路由对应的appId
        $scope.routesData = {};

        //默认权限
        $scope.permission = {
            raw:[],
            read:false,
            write:false,
            execute:false
        };

        //是否显示下方内容，getMenuTree请求成功值为true
        $scope.content = {
            show: false
        };
        //获取branchName
   
        if($state.params.branchName){
            var groupName = $state.params.branchName.split('topName');
            $rootScope.branchName = groupName[0];
            $rootScope.topName = groupName[1];
        }
    
        //获取菜单对应权限信息，以appId为标识，存放在$scope.permissions中
        function getPermission(obj) {
            $.each(obj, function () {
                if (this.tabs) {
                    if (this.tabs.length != 0) {
                        getPermission(this.tabs);
                    } else {
                        $scope.permissions.push({"id": $scope.routesData[this.sref], "permission": this.permission});
                    }
                }else{
                    $scope.permissions.push({"id": $scope.routesData[this.sref], "permission": this.permission});
                }
            });
        }

        //根据Id获取权限信息
        $scope.getPermissionById = function (id) {
            var permission = [];
            $.each($scope.permissions, function () {
                if (this.id == id) {
                    permission = this.permission;
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
        function getAppId(obj){
            if(obj.tabs){
                if(obj.tabs.length == 0){
                    $scope.firstMenuAppId.push($scope.routesData[obj.sref]);
                }else{
                    $.each(obj.tabs,function(){
                        getAppId(this);
                    })
                }
            }else{
                $scope.firstMenuAppId.push($scope.routesData[obj.sref]);
            }
        }

        //请求routes.json
        $http.get("../../init/routes.json").success(function(data){
            //保存所有路由对应的appId
            $.each(data.routes,function(){
                $scope.routesData[this.state] = this.appId;
            });

            //已有全部appId，请求菜单信息
            $http.post("/v3/menuaccess/getMenuTree", {
                "model": $scope.sceneInfo.model,
                "sceneId": $scope.sceneInfo.nasid,
                "lang":Utils.getLang()
            }).success(function (data) {
                if (data.retCode == 0) {
                    $scope.menu = data.data.menu[$scope.sceneInfo.model];
                    $.each($scope.menu,function () {
                        if(this.tabs[0].sref){
                            this.sref = this.tabs[0].sref
                        }else {
                            this.sref = this.tabs[0].tabs[0].sref
                        }

                    });
                    getPermission($scope.menu);
                    $scope.content.show = true;
                    var r = $scope.getPermissionById($scope.routesData[$state.current.name]);
                    $scope.permission = {
                        raw:r.permission,
                        read:r.read,
                        write:r.write,
                        execute:r.execute
                    };
                    $scope.firstMenuAppIds = {};
                    $.each($scope.menu,function(){
                        $scope.firstMenuAppId = [];
                        getAppId(this);
                        $scope.firstMenuAppIds[this.sref] = $scope.firstMenuAppId;
                    });

                }
            }).error(function () {
                window.location.reload();
            });

        });
    
                 
        $http({
            url:"/oasis/stable/web/static/oasis-rest-notification/restapp/webnotify/getWebnotify?user_info="+$scope.userInfo.user+"&notify_location=3"+"&nas_id="+$scope.sceneInfo.nasid,
            method:"GET",                   
        }).success(function(response){    
            if(response.code==0){
                var arr=[];
                for(var i=0,len=response.data.length;i<len;i++){
                    arr.push(response.data[i].webnotifyContent);
                }
                $scope.messages=arr;  

                if(arr.length>1||parseInt($("#scrolling").offset().top)>29){
                    var int=$("#scrolling").offset().top;
                    intervalInner =  setInterval(function(){
                                        if($("#scrolling").offset().top<=int-$("#scrolling").height()){
                                             $("#scrolling").offset({top:int+10}) ;
                                        }else{
                                            $("#scrolling").offset(function(n,c){
                                                newPos=new Object();
                                                newPos.top=c.top++;         
                                                return newPos;
                                            });  
                                        }   
                                    }, 150);
                    $("#wrapper").mouseover(function(){
                         clearInterval(intervalInner);
                    });

                    $("#wrapper").mouseout(function(){
                        intervalInner=setInterval(function(){
                            if($("#scrolling").offset().top<=int-$("#scrolling").height()){
                                 $("#scrolling").offset({top:int+10}) ;
                            }else{
                                $("#scrolling").offset(function(n,c){
                                    newPos=new Object();
                                    newPos.top=c.top++;         
                                    return newPos;
                                });  
                            }   
                        }, 150);
                    });  
                }                                                       
            }         
        }).error(function(response){         
        });
        
               

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $scope.$watch("routesData",function () {
                var rights = $scope.getPermissionById($scope.routesData[toState.name]);
                $scope.permission = {
                    raw:rights.permission,
                    read:rights.read,
                    write:rights.write,
                    execute:rights.execute
                };
            });

            if(toState.name.indexOf('global')>=0&&typeof(intervalInner)!="undefined"){
                clearInterval(intervalInner);
            }
        });


    
        /*$scope.$on('$locationChangeSuccess',function(event, viewConfig){
            clearInterval(intervalInner);          
        });*/

        var w = $('.top-panel .dropdown-menu').width();
        var ul = $('.navbar.navbar-top .navbar-right');
        var rig = ul.css('margin-right');
        $('#userdrop').parent('div').on('show.bs.dropdown', function () {
            ul.css('margin-right', parseInt(rig) + w + 45 + 'px');
        });
        $('#userdrop').parent('div').on('hide.bs.dropdown', function () {
            ul.css('margin-right', rig);
        });
        // return deferred.promise;
    }];
});