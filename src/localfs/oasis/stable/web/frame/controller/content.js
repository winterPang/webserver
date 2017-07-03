define(["utils",'!frame/libs/jquery/jqPaginator.min'], function (Utils) {
    return ['$scope', '$http', '$q', '$rootScope', '$state', function ($scope, $http, $q, $rootScope, $state) {
        function getRcString(attrName) {
            return Utils.getRcString("sysNotice_detail_rc", attrName);
        }
        //存放所有菜单对应的权限信息
        $scope.permissions = [];

        //存放所有路由对应的appId
        $scope.routesData = {};

        //默认权限
        $scope.npermission = {
            raw: [],
            read: false,
            write: false,
            execute: false
        };
        $scope.permission = [];
        //是否显示下方内容，getMenuTree请求成功值为true
        $scope.content = {
            show: false
        };
        //获取branchName

        if ($state.params.branchName) {
            var groupName = $state.params.branchName.split('topName');
            $rootScope.branchName = groupName[0];
            $rootScope.topName = groupName[1];
        }
        //获取菜单对应权限信息，以appId为标识，存放在$scope.permissions中
        function ngetPermission(obj) {
            $.each(obj, function () {
                if (this.tabs) {
                    if (this.tabs.length != 0) {
                        ngetPermission(this.tabs);
                    } else {
                        $scope.permissions.push({"id": $scope.routesData[this.sref], "permission": this.permission});
                    }
                } else {
                    $scope.permissions.push({"id": $scope.routesData[this.sref], "permission": this.permission});
                }
            });
        }

        function getPermission(obj) {
            $.each(obj, function () {
                if (this.tabs) {
                    if (this.tabs.length != 0) {
                        getPermission(this.tabs);
                    } else {
                        $scope.permission.push({"id": this.id, "permission": this.permission});
                    }
                } else {
                    $scope.permission.push({"id": this.id, "permission": this.permission});
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
        $http.get("../../init/routes.json").success(function (data) {
            //保存所有路由对应的appId
            $.each(data.routes, function () {
                $scope.routesData[this.state] = this.appId;
            });

            //已有全部appId，请求菜单信息
            $http.post("/v3/menuaccess/getMenuTree", {
                "model": "default",
                "lang": Utils.getLang()
            }).success(function (data) {
                if (data.retCode == 0) {
                    $scope.menu = data.data.menu.default;
                    $.each($scope.menu, function () {
                        if (this.tabs[0].sref) {
                            this.sref = this.tabs[0].sref
                        } else {
                            this.sref = this.tabs[0].tabs[0].sref
                        }
                    });
                    getPermission($scope.menu);
                    ngetPermission($scope.menu);
                    if (data.data.menu.home) {
                        $scope.permission.push({"id": "home", "permission": data.data.menu.home.permission});
                    } else {
                        $scope.permission.push({"id": "home", "permission": []});
                    }
                    $scope.content.show = true;
                    var r = $scope.getPermissionById($scope.routesData[$state.current.name]);
                    $scope.npermission = {
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
                window.location.reload();
            });
        });


        $http({
            url:"../../init/frame/content.json",
            method:"GET",                   
        }).success(function(response){ 
            $scope.messages2=response;
        }).error(function(response){         
        });

        $scope.detailModal={
            options:{
                 mId:'detailModal',
                 title:getRcString('detail'),                          
                 autoClose: true,                         
                 showCancel: false, 
                 modalSize:"normal",                        
                 buttonAlign: 'center',
                 showFooter:false,                      
                 okHandler: function(modal,$ele){
                 //点击确定按钮事件，默认什么都不做
                 },
                 cancelHandler: function(modal,$ele){
                 //点击取消按钮事件，默认什么都不做
                 },
                 beforeRender: function($ele){
                 //渲染弹窗之前执行的操作,$ele为传入的html片段
                    return $ele;
                 }
            }
        }

        $scope.openModal=function(itemTitle,itemMessage,$event){         
                $(event.target).parents("table.table2").find("span.span1").removeClass('span1').addClass('span3');
                $scope.$broadcast('show#detailModal',$scope);
                $scope.itemTitle=itemTitle;  
                $scope.itemMessage=itemMessage;           
            }

        $scope.changeState=function($event,itemTitle){
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            saveState(action,itemTitle);
        }

        $scope.selected=[];

        function saveState(action,itemTitle){
            if(action == 'add' && $scope.selected.indexOf(itemTitle) == -1){
                $scope.selected.push(itemTitle);
            }
            if(action == 'remove' && $scope.selected.indexOf(itemTitle)!=-1){
                $scope.selected.splice(itemTitle,1);
            }
        }

        $scope.setRead=function(){
            for(var i=0,len=$scope.selected.length;i<len;i++){
                if($("#"+$scope.selected[i]).parents('table').find("span.span1").length>0){
                    $("#"+$scope.selected[i]).parents('table').find("span.span1").removeClass('span1').addClass('span3');
                    
                }
            }
            
        }

        $scope.$on('show.bs.modal#sysNoticeModal', function () {
            $('#pagenation').jqPaginator({
                totalPages: 10,
                currentPage: 3,
                visiblePages:5,

                first: '<li class="first"><a href="javascript:void(0);"><<</a></li>',
                prev: '<li class="prev"><a href="javascript:void(0);"><</a></li>',
                next: '<li class="next"><a href="javascript:void(0);">></a></li>',
                last: '<li class="last"><a href="javascript:void(0);">>></a></li>',
                page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
                onPageChange: function (num) {
                    $('#text').html('当前第' + num + '页');
                }
            });
        });

        
           
        $http({
            url:"/oasis/stable/web/static/oasis-rest-notification/restapp/webnotify/getWebnotify?user_info="+$scope.userInfo.user+"&notify_location=2",
            method:"GET",                   
        }).success(function(response){  
            if(response.code==0){
                var arr=[];
                for(var i=0,len=response.data.length;i<len;i++){
                    arr.push(response.data[i].webnotifyContent);
                }
                $scope.messages=arr;

                if(arr.length>1){            
                    var int=$("#scrolling").offset().top;
                    interval =  setInterval(function(){
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
                         clearInterval(interval);
                    });

                    $("#wrapper").mouseout(function(){
                        interval=setInterval(function(){
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
            }else{
                return -1;
            }         
        }).error(function(response){         
        }); 
        
        
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $scope.$watch("routesData", function () {
                var rights = $scope.getPermissionById($scope.routesData[toState.name]);
                $scope.npermission = {
                    raw: rights.permission,
                    read: rights.read,
                    write: rights.write,
                    execute: rights.execute
                };
            });
            
            if(toState.name.indexOf('scene')>=0&&typeof(interval)!="undefined"){
                clearInterval(interval);
            }
        });
        var w = $('.top-panel .dropdown-menu').width()+$('#home').width();
        var ul = $('.navbar.navbar-top .navbar-right');
        var rig = ul.css('margin-right');
        $('#userdrop').parent('div').on('show.bs.dropdown', function () {
            ul.css('margin-right', parseInt(rig) + w + 45 + 'px');
        });
        $('#userdrop').parent('div').on('hide.bs.dropdown', function () {
            ul.css('margin-right', rig);
        });

        // ================================系统通知=============================
            $scope.sysNoticeModal={
                options:{
                     mId:'sysNoticeModal',
                     title:getRcString('sysNotice'),                          
                     autoClose: true,                         
                     showCancel: false, 
                     modalSize:"lg",                        
                     buttonAlign: 'center',
                     showFooter:false,                      
                     okHandler: function(modal,$ele){
                     //点击确定按钮事件，默认什么都不做
                     },
                     cancelHandler: function(modal,$ele){
                     //点击取消按钮事件，默认什么都不做
                     },
                     beforeRender: function($ele){
                     //渲染弹窗之前执行的操作,$ele为传入的html片段
                        return $ele;
                     }
                }
            }

            $scope.sysNotice=function(){
                $scope.$broadcast('show#sysNoticeModal',$scope);
            }

            /*$scope.info.weixin8=false;*/
        // ================================系统通知=============================
    }];
});