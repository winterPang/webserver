/**
 * Created by Administrator on 2016/8/25.
 */
define(['jquery', "css!newdesign/frame/css/style"], function ($) {
    return ['$scope', '$http', '$state', '$timeout', '$rootScope', function ($scope, $http, $state, $timeout, $rootScope) {
        // var name = $state.current.name.split(".")[2];
        // $http.get("../../init/menu.json").success(function(data){
        //
        //     var currentMenuArr = data.menu[$scope.sceneInfo.model];
        //     $(currentMenuArr).each(function(){
        //         if(this.id == name){
        //             $scope.name = this.name;
        //             $scope.leftMenu = this.tabs;
        //         }
        //     });
        // });
        $scope.$watch("firstMenuAppIds", function () {
            var currentMenuArr = $scope.menu;
            $(currentMenuArr).each(function (index, item) {
                $.each($scope.firstMenuAppIds[item.sref], function () {
                    if (this == $scope.routesData[$state.current.name]) {
                        if ($scope.routesData[$state.current.name] == 'devmanage' && $rootScope.domeType == 0) {
                            $scope.leftMenu = [];
                            $scope.leftMenu[0] = item.tabs[0];
                        } else {
                            $scope.leftMenu = item.tabs;
                        }
                        $scope.name = item.name;
                    }
                });
            });
        }, true);
        $scope.menuToggle = function (obj) {
            $(obj.target).next().toggle();
            $(obj.target).parent("li").siblings().each(function () {
                $(this).children("ul").hide();
            })
        };
        $scope.menuActive = function (sref, tabs) {
            var falg = false;
            var currentAppId = $scope.routesData[$state.current.name];
            if (tabs == undefined || tabs.length == 0) {
                if ($scope.routesData[sref] == currentAppId) {
                    falg = true;
                }
            } else {
                var appId = [];
                $.each(tabs, function () {
                    appId.push($scope.routesData[this.sref]);
                });
                $.each(appId, function () {
                    if (this == currentAppId) {
                        falg = true;
                    }
                });
            }
            return falg;
        }
        /* $(".main").attr("style", "height:" + ($(window).innerHeight() - 149) + "px");
         $(window).resize(function () {
         $(".main").attr("style", "height:" + ($(window).innerHeight() - 149) + "px");
         });*/

        $timeout(function () {
            $(".newdesign-main-right").attr("style", "height:" + ($(window).innerHeight() - 88) + "px");
            $(".newdegin-menu").attr("style", "height:" + ($(window).innerHeight() - 58) + "px");
            $(window).resize(function () {
                $(".newdesign-main-right").attr("style", "height:" + ($(window).innerHeight() - 88) + "px");
                $(".newdegin-menu").attr("style", "height:" + ($(window).innerHeight() - 58) + "px");
            });
        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $timeout(function () {
                $(".newdesign-main-right").attr("style", "height:" + ($(window).innerHeight() - 88) + "px");
                $(".newdegin-menu").attr("style", "height:" + ($(window).innerHeight() - 58) + "px");
                $(window).resize(function () {
                    $(".newdesign-main-right").attr("style", "height:" + ($(window).innerHeight() - 88) + "px");
                    $(".newdegin-menu").attr("style", "height:" + ($(window).innerHeight() - 58) + "px");
                });
            });
        });
        $("#warningmsg").css("padding-left", "250px");
    }];
});