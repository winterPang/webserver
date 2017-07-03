/**
 * Created by liuyanping on 2016/10/24
 */
define(['jquery', 'l/directive/tree-common', 'bootstrapDatepicker', 'bootstrapDatepickerCN', 'css!l/css/menu3.css', 'l/directive/dashboard-ztree', 'css!ztree_css'], function ($, common) {
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

        function asyncView(selected) {
            $scope.$apply(function () {
                if (selected && selected.length) {
                    var arr = [];
                    $.each(selected, function () {
                        arr.push(this.name);
                        $scope.selectedVal.push(this.id);
                    });
                    $scope.selectedName = arr.join(',');
                } else {
                    $scope.selectedVal = [];
                    $scope.selectedName = '请选择区域';
                }
            });
        }

        /// zhangfuqiang start
        $scope.selectedName = '请选择区域';
        $scope.selectedVal = [];
        $scope.showAreaTree = false;
        $timeout(function () {
            $scope.areaTree = $.fn.zTree.init($('#areaTree'), {
                view: {showIcon: false},
                async: {enable: true, type: 'get', otherParam: {}, url: '../l/json/ng-ztree-basic.json'},
                check: {enable: true, nocheckInherit: true},
                callback: {
                    onCheck: function () {
                        asyncView(common.getTreeNodes($scope.areaTree));
                    },
                    onAsyncSuccess: function () {
                        asyncView(common.getTreeNodes($scope.areaTree));
                    }
                }
            });
        });
        /// zhangfuqiang end
    }];
});