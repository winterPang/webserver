/**
 * Created by Administrator on 2016/8/25.
 */
define(['jquery'], function($) {
    return ['$scope', '$http','$state', function ($scope, $http,$state) {
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
            $(currentMenuArr).each(function (index,item) {
                $.each($scope.firstMenuAppIds[item.sref],function(){
                    if (this == $scope.routesData[$state.current.name]) {
                        $scope.name = item.name;
                        $scope.leftMenu = item.tabs;
                    }
                });
            });
        },true);
        $scope.menuToggle = function(obj){
            $(obj.target).next().toggle();
            $(obj.target).parent("li").siblings().each(function(){
                $(this).children("ul").hide();
            })
        };
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
        }
        $(".main").attr("style", "height:" + ($(window).innerHeight() - 141) + "px");
        $(window).resize(function () {
            $(".main").attr("style", "height:" + ($(window).innerHeight() - 141) + "px");
        });
    }];
});