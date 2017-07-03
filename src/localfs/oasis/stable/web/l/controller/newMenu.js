/**
 * Created by liuyanping on 2016/10/24
 */
define(['jquery','l/directive/tree-common', 'bootstrapDatepicker', 'bootstrapDatepickerCN','l/directive/dashboard-ztree','css!l/css/newMenu.css'], function () {
    return ['$scope', '$http', '$rootScope', '$stateParams', '$timeout', function ($scope, $http, $rootScope, $stateParams, $timeout) {
        $("#l-date").datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd',
            language: 'zh-CN'
        }).datepicker('setDate', new Date());
        function changeClass(obj) {
            if (obj.length > 1) {
                if (obj.children("i").hasClass("l-open")) {
                    obj.children("i").attr("class", "l-close");
                }
            } else {
                if (obj.children("i").hasClass("l-open")) {
                    obj.children("i").attr("class", "l-close");
                } else if (obj.children("i").hasClass("l-close")) {
                    obj.children("i").attr("class", "l-open");
                }
            }
        }

        $('.l-left').delegate('.l-animate', 'click', function () {
            if ($(this).next('ul').length == 1) {
                $(this).next('ul').slideToggle().parent('li').siblings('li').children('ul').slideUp();
            } else {
                $(this).parent('li').siblings('li').children('ul').slideUp();
            }
            changeClass($(this));
            changeClass($(this).parent('li').siblings('li').children('div'));
        });
        $(".l-right,.l-left").attr("style", "height:" + ($(window).innerHeight() - 50) + "px");
        $(".l-area-ztree").attr("style", "max-height:" + ($(window).innerHeight() - 180) + "px;max-width:" + ($(window).innerWidth() - 220) + "px;");
        $(window).resize(function () {
            $(".l-right,.l-left").attr("style", "height:" + ($(window).innerHeight() - 50) + "px");
            $(".l-area-ztree").attr("style", "max-height:" + ($(window).innerHeight() - 180) + "px;max-width:" + ($(window).innerWidth() - 220) + "px;");
        });

    }];
});