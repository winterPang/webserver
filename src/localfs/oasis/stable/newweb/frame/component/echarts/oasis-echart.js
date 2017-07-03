define(['angularAMD', 'echarts3', 'echarts-chinaMap', './frame/component/echarts/service/oasis-echarts-util', './frame/component/echarts/service/oasis-echarts-theme'], function (_angularAMD, _echarts) {
    'use strict';

    var _angularAMD2 = _interopRequireDefault(_angularAMD);

    var _echarts2 = _interopRequireDefault(_echarts);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }

        return obj;
    }

    /**
     * generate directive link function
     *
     * @param {Service} $http, http service to make ajax requests from angular
     * @param {String} type, chart type
     */
    function getLinkFunction($http, theme, util, type, $window) {

        return function (scope, element, attrs) {
            scope.config = scope.config || {};
            var ndWrapper = element.find('div')[0],
                ndParent = element.parent()[0],
                parentWidth = ndParent.clientWidth,
                parentHeight = ndParent.clientHeight,
                width,
                height,
                chart;
            var chartEvent = {};
            var textStyle = { color: 'red', fontSize: 36, fontWeight: 900, fontFamily: 'Microsoft Yahei, Arial' };

            function getSizes(config) {
                width = config.width || parseInt(attrs.width) || parentWidth || 320;
                height = config.height || parseInt(attrs.height) || parentHeight || 240;
                ndWrapper.style.width = width + 'px';
                ndWrapper.style.height = height + 'px';
            }

            function getOptions(option, type) {
                var _options;

                // merge default config
                var copyOption = angular.extend({}, option);
                delete copyOption.series;
                var config = copyOption;
                var data = option.series;

                config = angular.extend({
                    showXAxis: true,
                    showYAxis: true,
                    showLegend: true
                }, config);

                var xAxis = angular.extend({
                    orient: 'top',
                    axisLine: { show: true }
                }, angular.isObject(config.xAxis) ? config.xAxis : {});

                var yAxis = angular.extend({
                    type: 'value',
                    orient: 'right',
                    scale: false,
                    axisLine: {
                        show: true
                    },
                    axisLabel: {
                        formatter: function formatter(v) {
                            return util.formatKMBT(v);
                        }
                    }
                }, angular.isObject(config.yAxis) ? config.yAxis : {});

                // basic config
                var options = (_options = {
                    title: util.getTitle(data, config, type),
                    tooltip: util.getTooltip(data, config, type),
                    legend: util.getLegend(data, config, type),
                    toolbox: angular.extend({ show: false }, angular.isObject(config.toolbox) ? config.toolbox : {}),
                    xAxis: util.isHeatmapChart(type) ? config.xAxis : [angular.extend(xAxis, util.getAxisTicks(data, config, type))],
                    yAxis: util.isHeatmapChart(type) ? config.yAxis : [yAxis],
                    graphic: config.graphic && (angular.isObject(config.graphic) || angular.isArray(config.graphic)) ? config.graphic : [],
                    series: util.getSeries(data, config, type),
                    visualMap: config.visualMap ? config.visualMap : null,
                    geo: config.geo ? config.geo : null,
                    polar: config.polar ? config.polar : null,
                    grid: config.grid ? config.grid : null,
                    radiusAxis: config.radiusAxis ? config.radiusAxis : null,
                    angleAxis: config.angleAxis ? config.angleAxis : null,
                    radar: type == 'radar' && config.radar ? config.radar : null,
                    dataZoom: config.dataZoom ? config.dataZoom : null,
                    axisPointer: config.axisPointer ? config.axisPointer : null,
                    brush: config.brush ? config.brush : null,
                    parallel: config.parallel ? config.parallel : null,
                    parallelAxis: config.parallelAxis ? config.parallelAxis : null,
                    singleAxis: config.singleAxis ? config.singleAxis : null,
                    timeline: config.timeline ? config.timeline : null
                }, _defineProperty(_options, 'graphic', config.graphic ? config.graphic : null), _defineProperty(_options, 'calendar', config.calendar ? config.calendar : null), _options);

                if (!config.showXAxis) {
                    angular.forEach(options.xAxis, function (axis) {
                        axis.axisLine = { show: false };
                        axis.axisLabel = { show: false };
                        axis.axisTick = { show: false };
                    });
                }

                if (!config.showYAxis) {
                    angular.forEach(options.yAxis, function (axis) {
                        axis.axisLine = { show: false };
                        axis.axisLabel = { show: false };
                        axis.axisTick = { show: false };
                    });
                }

                if (!config.showLegend || type === 'gauge') {
                    delete options.legend;
                }

                if (!util.isAxisChart(type) && !util.isHeatmapChart(type)) {
                    delete options.xAxis;
                    delete options.yAxis;
                }

                if (config.dataZoom) {
                    options.dataZoom = angular.extend({
                        show: true,
                        realtime: true
                    }, config.dataZoom);
                }

                if (config.dataRange) {
                    options.dataRange = angular.extend({}, config.dataRange);
                }
                angular.forEach(options, function (val, k) {
                    if (!val || $.isEmptyObject(options[k])) delete options[k];
                });
                return options;
            }

            function setOptions(option) {
                var options = void 0;
                getSizes(option);
                if (!chart) {
                    chart = _echarts2.default.init(ndWrapper, option.theme || 'shine');
                }

                if (option.event) {
                    if (!Array.isArray(option.event)) {
                        option.event = [option.event];
                    }

                    if (Array.isArray(option.event)) {
                        option.event.forEach(function (ele) {
                            //if(ele.type)
                            if (!chartEvent[ele.type]) {
                                chartEvent[ele.type] = true;
                                chart.on(ele.type, function (param) {
                                    ele.fn(param);
                                });
                            }
                        });
                    }
                }

                options = getOptions(option, type);
                if (option.forceClear) {
                    chart.clear();
                }
                if (options.series.length) {
                    chart.setOption(options);
                    chart.resize();
                } else {
                    chart.showLoading({ text: option.errorMsg || '没有数据', textStyle: textStyle });
                }

                scope.$on('resizeEcahart#' + option.id, function (opt) {
                    // let option = chart.getOption(),
                    var config = {
                        width: ndParent.clientWidth
                    };
                    getSizes(config);
                    chart && chart.resize();
                });
            }
            // update when charts config changes
            scope.$watch('option', function (value) {
                if (value) {
                    setOptions(value);
                }
            }, true);
        };
    }

    /**
     * add directives
     */

    var types = ['line', 'bar', 'area', 'pie', 'donut', 'gauge', 'map', 'radar', 'heatmap'];
    for (var i = 0, n = types.length; i < n; i++) {
        (function (type) {
            _angularAMD2.default.directive(type + 'Chart', ['$http', 'echartsUtil', 'echartsTheme', function ($http, Util, Theme) {
                return {
                    restrict: 'EA',
                    template: '<div config="config" data="data"></div>',
                    scope: {
                        option: '=option'
                        // data: '=data',
                        // chartObj: '=?chartobj'
                    },
                    // replace: true,
                    link: getLinkFunction($http, Theme, Util, type)
                };
            }]);
        })(types[i]);
    }
});
//# sourceMappingURL=oasis-echart.js.map
