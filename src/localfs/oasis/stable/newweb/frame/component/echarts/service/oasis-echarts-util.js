define(['angularAMD'], function (_angularAMD) {
    'use strict';

    var _angularAMD2 = _interopRequireDefault(_angularAMD);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var isPieChart = function isPieChart(type) {
        return ['pie', 'donut'].indexOf(type) > -1;
    };

    var isMapChart = function isMapChart(type) {
        return ['map'].indexOf(type) > -1;
    };

    var isAxisChart = function isAxisChart(type) {
        return ['line', 'bar', 'area'].indexOf(type) > -1;
    };

    var isHeatmapChart = function isHeatmapChart(type) {
        return ['heatmap'].indexOf(type) > -1;
    };

    var getAxisTicks = function getAxisTicks(data, config, type) {
        var ticks = [];
        if (data[0]) {
            angular.forEach(data[0].datapoints, function (datapoint) {
                ticks.push(datapoint.x);
            });
        }

        return {
            type: 'category',
            boundaryGap: type === 'bar',
            data: ticks
        };
    };

    var _DefaultSeries = {
        // type: 'line',
        // name: '',
        itemStyle: {},
        //markPoint:{},
        //markLine:{},
        //markArea:{},
        silent: false,
        animation: true,
        animationThreshold: 2000,
        animationDuration: 1000,
        animationEasing: "linear",
        animationDelay: 0,
        animationDurationUpdate: 300,
        animationEasingUpdate: 'cubicOut ',
        animationDelayUpdate: 0,
        tooltip: {}
    };

    var getSeries = function getSeries(data, config, type) {
        var series = [];
        angular.forEach(data, function (serie) {
            // datapoints for line, area, bar chart
            //var datapoints = [];      
            var conf = {
                type: type || 'line',
                name: serie.name
                //data: [],
            };
            var copySerie = angular.extend({}, serie);
            delete copySerie.data;
            var _config = copySerie;

            conf = angular.extend({}, _DefaultSeries, conf);
            conf.data = serie.data && !serie.datapoints ? serie.data : [];
            if (isAxisChart(type)) {
                var _common = {
                    coordinateSystem: "cartesian2d",
                    lengendHoverLink: true,
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    polarIndex: 0,
                    stack: null,
                    label: {},
                    zlevel: 0,
                    z: 2
                };
                var _AxisConf = {
                    sysbol: 'emptyCircle',
                    sysbolSize: 4,
                    //symbolRotate:0,
                    symbolOffset: [0, 0],
                    showSymbol: true,
                    showAllSymbol: false,
                    hoverAnimation: true,
                    connectNulls: false,
                    clipOverflow: true,
                    step: false,
                    areaStyle: {},
                    smooth: false
                };

                var _BarConf = {
                    //legendHoverLink:true,      
                    // barWidth:"",
                    // barMaxWidth:"",
                    // baiMinHeight:0,
                    // barGap:"30%",
                    // barCategoryGap:"20%"
                };

                if (type === 'area') {
                    conf.type = 'line';
                    conf.itemStyle = {
                        normal: {
                            areaStyle: {
                                type: 'default'
                            }
                        }
                    };
                }
                //dispose  serie.config
                conf = angular.extend(conf, _common);
                if (type === 'bar') {
                    conf = angular.extend(conf, _BarConf, _config || {});
                } else {
                    conf = angular.extend(conf, _AxisConf, _config || {});
                }
                //dispose serie.data  
                angular.forEach(serie.datapoints, function (datapoint) {
                    conf.data.push(datapoint.y);
                });
            } else {
                angular.forEach(serie.datapoints, function (datapoint) {
                    conf.data.push({ value: datapoint.y, name: datapoint.x });
                });
            }
            if (isPieChart(type)) {
                // donut charts are actually pie charts
                conf.type = 'pie';
                var _PieDefaultConf = {
                    legendHoverLink: true,
                    hoverAnimation: true,
                    selectedMode: false,
                    selectedOffset: 10,
                    clockwise: true,
                    startAngle: 90,
                    minAngle: 3,
                    roseType: false,
                    avoidLabelOverlap: true,
                    stillShowZeroSum: true,
                    label: {},
                    labelLine: {},
                    center: [],
                    radius: []
                };
                conf = angular.extend(conf, _PieDefaultConf, _config || {});
                // pie chart need special radius, center config
                conf.center = config.center || ['50%', '40%'];
                conf.radius = config.radius || '60%';
                // donut chart require special itemStyle
                if (type === 'donut') {
                    conf.label = {
                        normal: {
                            show: false,
                            position: 'outside',
                            formatter: '{b}'
                        }
                    };
                    // conf.itemStyle = {
                    //     normal: {
                    //         label: {
                    //             show: false
                    //         },
                    //         labelLine: {
                    //             show: false
                    //         }
                    //     },
                    //     emphasis: {
                    //         label: {
                    //             show: true,
                    //             position: 'center',
                    //             textStyle: {
                    //                 fontSize: '50',
                    //                 fontWeight: 'bold'
                    //             }
                    //         }
                    //     }
                    // }
                    conf.radius = config.radius || ['45%', '75%'];
                } else if (type === 'pie') {
                    conf.itemStyle = {
                        normal: {
                            label: {
                                position: 'inner',
                                formatter: function formatter(item) {
                                    return (+item.percent).toFixed() + '%';
                                }
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                formatter: '{b}\n{d}%'
                            }
                        }
                    };
                }
            }
            // gauge chart need many special config
            if (type === 'gauge') {
                var _GaugeConf = {
                    radius: '75%',
                    startAngle: 225,
                    endAngle: -45,
                    clockwise: true,
                    min: 0,
                    max: 100,
                    splitNumber: 10,
                    axisLine: { // 坐标轴线
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: [[0.2, '#228b22'], [0.8, '#48b'], [1, '#ff4500']],
                            width: 8
                        }
                    },
                    axisTick: { // 坐标轴小标记
                        splitNumber: 10, // 每份split细分多少段
                        length: 12, // 属性length控制线长
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto'
                        }
                    },
                    splitLine: { // 分隔线
                        show: true, // 默认显示，属性show控制显示与否
                        length: 30, // 属性length控制线长
                        lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    // itemStyle:{},
                    pointer: {
                        width: 5
                    },
                    title: {
                        show: true,
                        offsetCenter: [0, '-40%'], // x, y，单位px
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder'
                        }
                    },
                    detail: {
                        formatter: '{value}%',
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto',
                            fontWeight: 'bolder'
                        }
                    }
                    // markPoint:{},
                    // markLine:{},
                    // markArea:{}
                };
                conf = angular.extend(conf, _GaugeConf, _config || {});
            }
            if (isMapChart(type)) {
                conf.type = 'map';
                var _DefaultMap = {
                    roam: false,
                    map: "",
                    center: [],
                    aspectScale: 0.75,
                    boundingCoords: null,
                    zoom: 1,
                    scaleLimit: {},
                    nameMap: {},
                    selectedMode: false,
                    label: {},
                    itemStyle: {},
                    zlevel: 0,
                    z: 2
                };
                conf = angular.extend(conf, _DefaultMap, _config || {});
            }
            if (type === 'radar') {
                var _DefaultRadar = {
                    //radarIndex:"",
                    symbol: "circle",
                    symbolSize: 4,
                    //symbolRotate:"",
                    symbolOffset: [0, 0],
                    label: {},
                    itemStyle: {},
                    lineStyle: {},
                    areaStyle: {}
                };
                conf = angular.extend(conf, _DefaultRadar, _config || {});
            }
            if (isHeatmapChart(type)) {
                conf.type = 'heatmap';
                var _DefaultHeatMap = {
                    coordinateSystem: 'cartesian2d',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    geoIndex: 0,
                    calendarIndex: 0,
                    blurSize: 20,
                    minOpacity: 0,
                    maxOpacity: 1,
                    markPoint: {},
                    markLine: {},
                    markArea: {},
                    zlevel: 0,
                    z: 2,
                    silent: false,
                    tooltip: {}
                };
                //conf.name = serie.name;
                //conf.data = serie.data;
                //conf = angular.extend(conf, {
                //     label: {
                //         normal: {
                //             show: true
                //         }
                //     },
                //     itemStyle: {
                //         emphasis: {
                //             shadowBlur: 10,
                //             shadowColor: 'rgba(0, 0, 0, 0.5)'
                //         }
                //     }
                // }, config.heatmap || {});
                conf = angular.extend(conf, _DefaultHeatMap, _config || {});
            }
            series.push(conf);
        });
        return series;
    };

    var dataZoom = function dataZoom(data, config, type) {};

    var getLegend = function getLegend(data, config, type) {
        var legend = { data: [] };

        if (isPieChart(type)) {
            var _DefaultLegend = {
                show: true,
                orient: 'horizontal',
                top: '80%',
                // bottom:'10%',
                // left: 'middle',
                itemWidth: 20,
                itemHeight: 12,
                icon: 'pin'
            };
            legend = angular.extend(legend, _DefaultLegend);
            if (data[0]) {
                angular.forEach(data[0].datapoints, function (datapoint) {
                    legend.data.push(datapoint.x);
                });
            }

            //legend.orient = 'verticle';
            // legend.left = "auto";
            // legend. = 'right';
            // legend.y = 'center';
        } else if (type === 'map') {
            legend = {};
        } else {
            angular.forEach(data, function (serie) {
                legend.data.push(serie.name);
            });
            legend.orient = 'horizontal';
        }

        return angular.extend(legend, config.legend || {});
    };

    var getTooltip = function getTooltip(data, config, type) {
        var tooltip = {};

        switch (type) {
            case 'line':
            case 'area':
                tooltip.trigger = 'axis';
                break;
            case 'pie':
                tooltip.trigger = 'item';
                tooltip.position = ['50%', '50%'];
                break;
            case 'donut':
            case 'bar':
            case 'map':
            case 'gauge':
                tooltip.trigger = 'item';
                break;
        }

        if (type === 'pie') {
            tooltip.formatter = '{a} <br/>{b}: {c} ({d}%)';
        }

        if (type === 'map') {
            tooltip.formatter = '{b}';
        }

        return angular.extend(tooltip, angular.isObject(config.tooltip) ? config.tooltip : {});
    };

    var getTitle = function getTitle(data, config, type) {
        if (angular.isObject(config.title)) {
            return config.title;
        }

        return isPieChart(type) ? null : {
            text: config.title,
            subtext: config.subtitle || '',
            x: 50
        };
    };

    var formatKMBT = function formatKMBT(y, formatter) {
        if (!formatter) {
            formatter = function formatter(v) {
                return Math.round(v * 100) / 100;
            };
        }
        y = Math.abs(y);
        if (y >= 1000000000000) {
            return formatter(y / 1000000000000) + 'T';
        } else if (y >= 1000000000) {
            return formatter(y / 1000000000) + 'B';
        } else if (y >= 1000000) {
            return formatter(y / 1000000) + 'M';
        } else if (y >= 1000) {
            return formatter(y / 1000) + 'K';
        } else if (y < 1 && y > 0) {
            return formatter(y);
        } else if (y === 0) {
            return '';
        } else {
            return formatter(y);
        }
    };

    _angularAMD2.default.factory('echartsUtil', [function () {
        return {
            isPieChart: isPieChart,
            isAxisChart: isAxisChart,
            isHeatmapChart: isHeatmapChart,
            getAxisTicks: getAxisTicks,
            getSeries: getSeries,
            getLegend: getLegend,
            getTooltip: getTooltip,
            getTitle: getTitle,
            formatKMBT: formatKMBT
        };
    }]);
});
//# sourceMappingURL=oasis-echarts-util.js.map
