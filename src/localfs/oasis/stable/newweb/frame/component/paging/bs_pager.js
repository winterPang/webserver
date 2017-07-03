define([], function () {
    'use strict';

    define(['app', 'jquery.twbsPagination'], function (mainApp) {
        if (!$ || !$.fn || !$.fn.twbsPagination) {
            console.warn('twbsPagination组件还没有初始化!');
            return;
        }
        mainApp.directive('bsPager', ['$timeout', function ($timeout) {
            return {
                restrict: 'EA',
                scope: {
                    options: '=bsPager'
                },
                replace: true,
                require: 'ngModel',
                template: '<div></div>',
                link: function link($scope, $ele, $attr, $ngModel) {
                    if (!($ele instanceof jQuery)) {
                        $ele = $($ele);
                    }
                    var defaults = {
                        totalPages: 1,
                        startPage: 1,
                        first: '&laquo;',
                        prev: '&lt;',
                        next: '&gt;',
                        last: '&raquo;',
                        loop: false,
                        pageClass: 'twbs-page',
                        nextClass: 'twbs-next',
                        prevClass: 'twbs-prev',
                        lastClass: 'twbs-last',
                        firstClass: 'twbs-first',
                        paginationClass: 'pagination',
                        onPageClick: function onPageClick(e, page) {},
                        onChange: function onChange(page) {}
                    };
                    var options = $.extend(true, {}, defaults, $scope.options);
                    // 页码修改后执行操作
                    options.onPageClick = function (e, page) {
                        $ngModel.$setViewValue(page);
                        options.onChange(page);
                    };
                    // 总页数修改后执行操作
                    $scope.$watch('options.totalPages', function (val) {
                        options.totalPages = val;
                        if (!val) {
                            $ele.hide();
                            return;
                        }
                        // 先销毁组件
                        if ($ele.data('twbsPagination')) {
                            $ele.twbsPagination('destroy');
                        }
                        // 创建组件并设置为行内块级元素
                        $ele.twbsPagination(options).css('display', 'inline-block');
                    }, true);
                }
            };
        }]);
    });
});
//# sourceMappingURL=bs_pager.js.map
