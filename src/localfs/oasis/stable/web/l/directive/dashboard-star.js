define(['angularAMD', 'echarts3'], function (app, echarts) {
    return app.directive('dashboardStar', function () {
        return {
            restrict: 'EA',
            replace: true,
            template: '<div></div>',
            scope: {
                number: '@dashboardStar'
            },
            link: function ($scope, $ele, attr) {
                var num = $scope.number;
                if (num > 5 || num < 0) {
                    console.debug('the number must between 0 and 5, now ' + num);
                    return;
                }
                var empty = 5 - num, i = 1, j = 1;
                for (; i <= num; i++) {
                    $ele.append('<span class="lightStar"></span>');
                }
                for (; j <= empty; j++) {
                    $ele.append('<span class="emptyStar"></span>');
                }
            }
        };
    });
});