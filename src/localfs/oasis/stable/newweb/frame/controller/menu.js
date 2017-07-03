define(['css!frame/css/menu', '../directive/bs_sidebar'], function () {
    return ['$scope', '$timeout', '$rootScope', '$state', function ($scope, $timeout, $rootScope, $state) {
        /* icon菜单与全菜单的切换 start */
        $(".oasis-header-icon").click(function () {
            var isClose = !$(this).toggleClass('icon-close').hasClass('icon-close'),
                event   = isClose ? 'expend' : 'collapse';
            $scope.$broadcast('bs.side.' + event);
        });

        /* icon菜单与全菜单的切换 end */
        /* 默认是极简版 start */
        $rootScope.domeType = 0;
        /* 默认是极简版 end */
        /* 菜单及左侧内容区高度、多级菜单展开闭合 start */
        $timeout(function () {
            /* 菜单及左侧内容区高度 start */
            $(".oasis-menu").css("height", ($(window).innerHeight() - 64) + "px");
            $(".oasis-main-content").css("height", ($(window).innerHeight() - 64 - 28) + "px");
            $(window).resize(function () {
                $(".oasis-menu").css("height", ($(window).innerHeight() - 64) + "px");
                $(".oasis-main-content").css("height", ($(window).innerHeight() - 64 - 28) + "px");
            });
            /* 菜单及左侧内容区高度 end */
            /* 菜单右侧'+'与'-'图标的切换 start */
            function changeClass(obj) {
                if (obj.length > 1) {
                    if (obj.children("i").hasClass("glyphicon glyphicon-minus")) {
                        obj.children("i.glyphicon.glyphicon-minus").attr("class", "glyphicon glyphicon-plus");
                        obj.removeClass("open");
                    }
                } else {
                    if (obj.children("i").hasClass("glyphicon glyphicon-minus")) {
                        obj.children("i.glyphicon.glyphicon-minus").attr("class", "glyphicon glyphicon-plus");
                        obj.removeClass("open");
                    } else if (obj.children("i").hasClass("glyphicon glyphicon-plus")) {
                        obj.children("i.glyphicon.glyphicon-plus").attr("class", "glyphicon glyphicon-minus");
                        obj.addClass("open");
                    }
                }
            }
            /* 菜单右侧'+'与'-'图标的切换 end */
            /* 多级菜单的展开与闭合 start */
            $('.oasis-menu').delegate('.menu-animate', 'click', function () {
                if ($(this).next('ul').length == 1) {
                    $(this).next('ul').slideToggle().parent('li').siblings('li').children('ul').slideUp();
                } else {
                    $(this).parent('li').siblings('li').children('ul').slideUp();
                }
                changeClass($(this));
                changeClass($(this).parent('li').siblings('li').children('div'));
            });
            /* 多级菜单的展开与闭合 end */
        });
        /* 菜单及左侧内容区高度、多级菜单展开闭合 start */
        /* 获取左侧菜单数据 start */
        $scope.$watch("firstMenuAppIds", function () {
            var currentMenuArr = $scope.menu;
            $(currentMenuArr).each(function (index,item) {
                $.each($scope.firstMenuAppIds[item.sref],function(){
                    if (this == $scope.routesData[$state.current.name]) {
                        $scope.name = item.name;
                        $scope.leftMenu = item.tabs;
                        return false;
                    }
                });
            });
        },true);
        /* 获取左侧菜单数据 end */
        /* 判断当前菜单是否被选中 start */
        $scope.menuActive = function(sref,tabs){
            var falg = false;
            var currentAppId = $scope.routesData[$state.current.name];
            if(tabs == undefined || tabs.length == 0){
                if($scope.routesData[sref] == currentAppId){
                    falg = true;
                }
            }else {
                var appId = [];
                $.each(tabs,function(){
                    appId.push($scope.routesData[this.sref]);
                });
                $.each(appId,function(){
                    if(this == currentAppId){
                        falg = true;
                    }
                });
            }
            return falg;
        };
        /* 判断当前菜单是否被选中 end */


        /* js销毁前 start */
        $scope.$on("$destroy",function () {
            $(".oasis-header-icon").unbind("click").removeClass('icon-close');
        });
        /* js销毁前 end */
    }];
});