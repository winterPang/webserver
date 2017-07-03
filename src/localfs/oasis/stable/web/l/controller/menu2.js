/**
 * Created by liuyanping on 2016/10/24
 */
define(['jquery','css!l/css/menu2.css'], function ($) {
    return ['$scope', '$http','$rootScope','$stateParams',function ($scope, $http,$rootScope,$stateParams){
        function isEmptyObject(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        }
        if(!isEmptyObject($stateParams)){
            $scope.sceneInfo = $stateParams;
        }
        console.log($scope.sceneInfo);
        /*function changeClass(obj){
            if(obj.length > 1){
                if(obj.children("i").hasClass("l-open")){
                    obj.children("i:last").attr("class","l-close");
                }
            }else{
                if(obj.children("i:last").hasClass("l-open")){
                    obj.children("i:last").attr("class","l-close");
                }else if(obj.children("i:last").hasClass("l-close")){
                    obj.children("i:last").attr("class","l-open");
                }
            }
        }*/
        function changeClass(obj){
            if(obj.length > 1){
                if(obj.children("i").hasClass("l-open")){
                    obj.children("i.l-open").attr("class","l-close");
                }
            }else{
                if(obj.children("i").hasClass("l-open")){
                    obj.children("i.l-open").attr("class","l-close");
                }else if(obj.children("i").hasClass("l-close")){
                    obj.children("i.l-close").attr("class","l-open");
                }
            }
        }
        $('.l-left').delegate('.l-animate','click',function(){
            if($(this).next('ul').length == 1){
                $(this).next('ul').slideToggle().parent('li').siblings('li').children('ul').slideUp();
            }else{
                $(this).parent('li').siblings('li').children('ul').slideUp();
            }
            changeClass($(this));
            changeClass($(this).parent('li').siblings('li').children('div'));
        });
    }];
});