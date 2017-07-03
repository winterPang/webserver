define(['jquery', 'angularAMD', 'echarts3'], function ($, app, echarts) {
    return app.directive('dashboardEcharts', function () {
        return {
            restrict: 'EA',
            replace: true,
            template: '<div></div>',
            scope: {
                config: '=dashboardEcharts'
            },
            link: function ($scope, $ele) {
                var eId = $scope.config.eId || '';
                if (!($ele instanceof $)) {
                    $ele = $($ele);
                }
                $scope.dom = $ele.get(0);
                $scope.charts = echarts.init($scope.dom);
                $scope.$watch('config.option', function (option) {
                    try {
                        $scope.charts.setOption(option);
                    } catch (e) {
                        console.debug('echarts error, please check your options!');
                    }
                }, true);
                $scope.$watch('config.events', function (events) {
                    if (events) {
                        $.each(events, function (k, v) {
                            $scope.charts.on(k, v);
                        });
                    }
                });

                var methods = ['getWidth', 'getHeight', 'getDom', 'getOption', 'resize', 'dispatchAction',
                    'showLoading', 'hideLoading', 'getDataURL', 'getConnectedDataURL', 'clear'];
                $.each(methods, function (i, m) {
                    var m2 = m + '.echarts';
                    var mt = eId ? m2 + '#' + eId : m2;
                    $scope.$on(mt, function () {
                        $scope.charts[m].apply($scope.charts, Array.prototype.slice.call(arguments, 1));
                    });
                });

                if (window) {
                    window.addEventListener('resize', $scope.charts.resize);
                }
            }
        };
    });
});