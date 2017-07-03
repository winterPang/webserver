define(['utils', 'moment', 'echarts3', 'css!warning/css/style'], function (Utils, moment, echarts) {
    return ['$rootScope', '$scope', '$http', '$alertService', function ($rootScope, $scope, $http, $alert) {

        $scope.list = {};
        $scope.modal = {};
        $scope.filterBar = {
            startDate: moment().startOf("day"),
            endDate: moment(),
            module: '',
            level: '',
            moduleList: null,
            levelList: [
                'emergency',
                'alert',
                'critical',
                'error',
                'warning',
                'notification',
                'informational',
                'debugging'
            ]
        };
        $scope.config = {
            collected: true,
            emergency: true,
            alert: true,
            critical: true,
            error: true,
            warning: true,
            notification: false,
            informational: false,
            debugging: false,
            level: 'warning',
            selectLevelDes: function (level) {
                if ($scope.config.collected) {
                    $scope.config.level = level;
                }
            }
        };

        var config = {
            collected: true,
            level: 'warning'
        };
        var levelChart = null,
            moduleChart = null;
        function getRcText(attr) {
            return Utils.getRcString('warning_module', attr).split(',');
        }

        window.onresize = function () {
            levelChart && levelChart.resize();
            moduleChart && moduleChart.resize();
        };

        function initChart(id, options) { // 初始化 - chart
            var div = document.getElementById(id);
            if (!div) {return;}
            var chart = echarts.init(div);
            chart.setOption(options);
            if (id == 'levelPie') {
                levelChart = chart;
            } else {
                moduleChart = chart;
            }
        }

        function toSecond(Moment) { // Moment -> Second
            return Math.floor(Moment.valueOf()/1000)+'';
        }

        function getDevLogs(body, callback) { // devLogs请求
            var defaults = {
                devSN: $scope.sceneInfo.sn,
                starttime: toSecond( $scope.filterBar.startDate),
                endtime: toSecond( $scope.filterBar.endDate )
            };
            var oBody = $.extend({}, defaults, body);
            $http({
                url: '/devlogserver/getdevlogs',
                method: 'post',
                data: oBody
            }).success(callback).error(function (data) {
                console.log(data);
            });
        }

        function getDevLogStatus(callback) {
            $http({
                url: '/v3/ant/confmodule/getdevlogstatus',
                method: 'post',
                data: {devSN: $scope.sceneInfo.sn}
            }).success(callback).error(function (data) {
                console.log(data);
            });
        }

        function setDevLogStatus(body, callback) {
            var defaults = {devSN: $scope.sceneInfo.sn};
            var oBody = $.extend({}, defaults, body);
            $http({
                url: '/v3/ant/confmodule/setdevlogstatus',
                method: 'post',
                data: oBody
            }).success(callback).error(function (data) {
                $alert.msgDialogError(getRcText('set-config-msg')[1]);
            });
        }

        function drawEmptyPie(id) {
            var options = {
                tooltip: {
                    show: false
                },
                series: [
                    {
                        type: 'pie',
                        center: ['50%', '50%'],
                        radius: '60%',
                        hoverAnimation: false,
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {show: false}
                        },
                        data: [
                            {
                                name: 'N/A',
                                value: 1,
                                itemStyle: {normal: {color: '#e2e2e2'}, emphasis: {color: '#e2e2e2'}}
                            }
                        ]
                    }
                ]
            };
            initChart(id, options);
        }

        function drawPie(id, legendData, data) {
            var options = {
                color: ['#4fc4f6', '#78cec3', '#4ec1b2', '#f2bc98', '#fbceb1', '#fe808b', '#ff9c9e', '#c8c3e1'],
                legend: {
                    show: false, /* 去掉legend */
                    x: 'right',
                    y: 50,
                    itemWidth: 22,
                    itemHeight: 14,
                    orient: 'vertical',
                    data: legendData
                },
                tooltip: { // "{a}<br/>{b}：{c} （{d}%）"
                    formatter: "{b}（{d}%）<br/>{a}：{c}"
                },
                series: [
                    {
                        name: getRcText('warn-chart-count'),
                        type: 'pie',
                        center: ['50%', '50%'],
                        radius: '60%',
                        minAngle: 3,
                        hoverAnimation: false,
                        stillShowZeroSum: false,
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 1,
                                borderType: 'solid'
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                formatter: '{b}',
                                textStyle: {fontSize: 13}
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                length: 10,
                                length2: 15,
                                smooth: 0.5
                            }
                        },
                        data: data
                    }
                ]
            };
            initChart(id, options);
        }

        function initDateRangePicker() { // 时间选择插件
            var config = {
                startDate: $scope.filterBar.startDate,
                endDate: $scope.filterBar.endDate,
                maxDate: $scope.filterBar.endDate,
                dateLimit: {days: 7},
                timePicker: true,
                timePicker24Hour: true,
                timePickerSeconds: true,
                opens: "right",
                //linkedCalendars: false,
                locale: {}
            };
            var oLocale = {
                format: "YYYY/MM/DD HH:mm:ss",
                applyLabel: getRcText("date-picker-label")[0],
                cancelLabel: getRcText("date-picker-label")[1],
                fromLabel: getRcText("date-picker-label")[2],
                toLabel: getRcText("date-picker-label")[3],
                daysOfWeek: getRcText("date-picker-week"),
                monthNames: getRcText("date-picker-month")
            };
            if (Utils.getLang() !== 'en') {
                config.locale = oLocale;
            } else {
                config.locale.format = "YYYY/MM/DD HH:mm:ss";
            }
            $('#dateRangePicker').daterangepicker(config, function (start, end, label) {
                $scope.filterBar.startDate = start;
                $scope.filterBar.endDate = end;
                initModuleList();
            });
        }

        function initModuleList() { // 告警模块列表
            var filter = {
                MODULELIST: 1,
                starttime: toSecond($scope.filterBar.startDate),
                endtime: toSecond($scope.filterBar.endDate)
            };
            getDevLogs(filter, function (data) {
                if (data.retCode != 0 ) {
                    return;
                } else if (data.message.MODULELIST.length) {
                    $scope.filterBar.moduleList = data.message.MODULELIST[0]['module'];
                } else {
                    $scope.filterBar.moduleList = [];
                }
            });
        }

        function initPopover() { // 提示框
            $('#configBtn').popover({
                content: getRcText('warn-popover-content')[0],
                template: '<div class="popover" role="tooltip">' +
                '<div class="arrow"></div>' +
                '<div class="popover-content"></div>' +
                '</div>',
                placement: 'bottom',
                trigger: 'hover'
            }).popover('show');

            window.setTimeout(function () {
                $('#configBtn').popover('hide');
            }, 3500);

            $('#searchLogBtn').popover({
                content: getRcText('warn-popover-info')[0],
                template: '<div class="popover" role="tooltip">' +
                '<div class="arrow"></div>' +
                '<div class="popover-content"></div>' +
                '</div>',
                placement: 'bottom',
                trigger: 'hover'
            });
        }

        function initWarnList() { // 告警日志表格
            var g_total = 0, // 表格中数据条数未知
                g_curPage = 1, // 刷新页面，表格页数是1
                g_limit = 10; // 表格 默认每页 显示10条

            $scope.list.warn = {
                tId: 'warn',
                searchable: true,
                paginationSize: 'sm',
                sidePagination: 'server',
                method: 'post',
                url: '/devlogserver/getdevlogs',
                pageListChange: {
                    pageNumber: 1
                },
                queryParams: function (params) {

                    var limit, action, tab,
                        tab_first = undefined,
                        tab_last = undefined;
                    var nextPage = params.start;
                    var paramsLimit = Number(params.limit);

                    $scope.$broadcast('getData#warn', function (data) {
                        tab_first = data[0];
                        tab_last = data[data.length-1];
                    });

                    if (g_limit != paramsLimit) { // 切换每页显示多少条时
                        limit = paramsLimit;
                        g_limit = paramsLimit;
                    } else if (nextPage == g_curPage || nextPage == 1) { // 第一页
                        limit = paramsLimit;
                        action = 1;
                        tab = undefined;
                    } else if (nextPage == Math.ceil(g_total/params.limit)) { // 最后一页
                        limit = g_total%paramsLimit;
                        action = -1;
                        tab = undefined;
                    } else if (nextPage == g_curPage-1) { // 上一页
                        limit = paramsLimit;
                        action = -1;
                        tab = tab_first;
                    }  else if (nextPage == g_curPage+1) { // 下一页
                        limit = paramsLimit;
                        action = 1;
                        tab = tab_last;
                    }

                    g_curPage = nextPage;

                    var nLevel = $scope.filterBar.levelList.indexOf($scope.filterBar.level);
                    var sModule = $scope.filterBar.module;

                    return {
                        devSN: $scope.sceneInfo.sn,
                        DATA: 1,
                        COUNT: params.start == 1 ? 1 : undefined,
                        starttime: toSecond( $scope.filterBar.startDate),
                        endtime: toSecond( $scope.filterBar.endDate ),
                        sortmodule: params.sort,
                        sort: params.sort && (params.order=='desc' ? -1 : 1),
                        search: params.findoption && params.findoption.content,
                        Level: nLevel == -1 ? undefined : (nLevel+''),
                        module: sModule ? sModule : undefined,

                        limit: limit, // 一般是params.limit个，如果是最后一页，要计算最后一页个数。
                        action: action, // 向前翻，最后一页用-1，向后翻，第一页用1
                        tab: tab // 向前翻页，当前页第一条数据，向后翻页，当前页最后一条数据，第一页/最后一页不返东西。
                    };
                },
                responseHandler: function (data) {
                    if (data.message['COUNT'] != undefined) {
                        g_total = data.message['COUNT'];
                    }
                    return {
                        rows: data.message['DATA'],
                        total: g_total
                    };
                },
                columns: [
                    {
                        width: 140,
                        title: getRcText('warn-list-header')[0],
                        field: 'service'
                    },
                    {
                        width: 104,
                        sortable: true,
                        title: getRcText('warn-list-header')[1],
                        field: 'wModule'
                    },
                    {
                        width: 104,
                        sortable: true,
                        title: getRcText('warn-list-header')[2],
                        field: 'Level',
                        formatter: function (value) {
                            return $scope.filterBar.levelList[value];
                        }
                    },
                    {
                        width: 612,
                        title: getRcText('warn-list-header')[3],
                        field: 'content',
                        formatter: function (value) {
                            // '<div style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden;width:500px;" title="'+value+'">' + value + '</div>'
                            return (value?'<div style="width: 90%;word-break: break-word;">'+value+'</div>':'');
                        },
                        searcher: {}
                    },
                    {
                        width: 163,
                        sortable: true,
                        title: getRcText('warn-list-header')[4],
                        field: 'receptionTime',
                        formatter: function (value) {
                            return ( value ? moment(value*1000).format('YYYY/MM/DD HH:mm:ss') : '' );
                        }
                    }
                ]
            };
        }

        function initConfigModal() { // 配置模态框
            $scope.modal.config = {
                mId: 'config',
                title: getRcText('warn-config-title')[0],
                autoClose: false,
                showCancel: true,
                modalSize: 'lg',
                showHeader: true,
                showFooter: true,
                showClose: true,
                okHandler: function (modal, $ele) {
                    var oBody = {
                        status: $scope.config.collected ? 'on' : 'off',
                        level: $scope.config.level
                    };
                    setDevLogStatus(oBody, function (data) {
                        if(data.retCode == 0) {
                            config.collected = $scope.config.collected;
                            config.level = $scope.config.level;
                            $scope.$broadcast('hide#config');
                            $alert.msgDialogSuccess(getRcText('set-config-msg')[0]);
                        } else {
                            $alert.msgDialogError(getRcText('set-config-msg')[1]);
                        }
                    });
                },
                cancelHandler: function (modal, $ele) {
                },
                beforeRender: function ($ele) {
                    return $ele;
                }

            };
        }

        function initConfigData() {
            getDevLogStatus(function (data) {
                var code = data.retCode;
                if (code == 1) {
                    console.log(data.message);
                } else if (code == -1) {
                    config.collected = false;
                    config.level = '';
                    $scope.config.collected = false;
                    $scope.config.level = '';
                } else if (code == 0) {
                    config.collected = true;
                    config.level = data.message;
                    $scope.config.collected = true;
                    $scope.config.level = data.message;
                } else if (code == 2) {
                    if (!getRcText('set-config-msg')[0]) {return;}
                    $alert.msgDialogError(getRcText('set-config-msg')[2]);
                    $scope.config.collected = false;
                    $scope.config.level = '';
                }
            });
        }

        function initEvent() {

            $scope.filterBar.clickSearchBtn = function () { // 点击搜索按钮
                var nLevel = $scope.filterBar.levelList.indexOf($scope.filterBar.level);
                var sModule = $scope.filterBar.module;

                refreshPageData({
                    starttime: toSecond($scope.filterBar.startDate) + '',
                    endtime: toSecond($scope.filterBar.endDate) + '',
                    Level: nLevel == -1 ? undefined : nLevel + '',
                    module: sModule ? sModule : undefined
                });
            };

            $scope.filterBar.clickConfigBtn = function () { // 打开配置框
                $('#configBtn').popover('hide');
                $scope.config.collected = config.collected;
                $scope.config.level = config.level;
                $scope.$broadcast('show#config');
            };

            $scope.config.clickCollectedSwitch = function () { // 开启/关闭 日志收集
                var levelList = $scope.filterBar.levelList;
                if ($scope.config.collected) {
                    $scope.config.level = 'warning';
                } else {
                    $scope.config.level = '';
                }
            };

            $scope.$watch('config.level', function (curLevel, preLevel) {
                if (curLevel != preLevel) {
                    var levelList = $scope.filterBar.levelList;
                    var n = levelList.indexOf(curLevel) + 1;
                    angular.forEach(levelList, function (v, i) {
                        $scope.config[v] = (i < n);
                    });
                }
            });
        }

        function refreshPageData(filterParams) { // 刷新页面数据
            // 严重等级饼图
            getDevLogs($.extend({}, {LEVEL: 1}, filterParams), function (data) {
                if (data.retCode != 0) {return;}
                // ['#800A0A', '#BC1717', '#ED1C1C', '#ED5C1C', '#f39801', '#57b42f', '#4fc4f6', '#999']
                var color = ['#fe808b', '#f2bc98', '#b3b7dd', '#ff9c9e', '#fbceb1', '#8cd7cd', '#4ec1b2', '#4fc5f7'];
                var aLegend = ['', '', '', '', '', '', '', ''],
                    aLevel = ['', '', '', '', '', '', '', ''],
                    aData = data.message.LEVEL,
                    levelList = $scope.filterBar.levelList;
                angular.forEach(aData, function (v) {
                    aLegend[v.level] = levelList[v.level];
                    aLevel[v.level] = {
                        name: levelList[v.level],
                        value: v.sum,
                        itemStyle: {
                            normal: {color: color[v.level]}
                        }
                    };
                });
                var i = 0,
                    n = 8;
                for (i = 0; i < n; i++) {
                    if (!aLegend[i]) {
                        aLegend.splice(i, 1);
                        aLevel.splice(i, 1);
                        i--;
                        n--;
                    }
                }
                if (!aData.length) {
                    drawEmptyPie('levelPie');
                } else {
                    drawPie('levelPie', aLegend, aLevel);
                }
            });

            // 告警模块饼图
            getDevLogs($.extend({}, {MODULE: 1}, filterParams), function (data) {
                if (data.retCode != 0) {return;}
                var aLegend = [],
                    aModule = [],
                    aData = data.message.MODULE;
                angular.forEach(aData, function (v, i) {
                    aLegend.push(v.module);
                    aModule.push({
                        name: v.module,
                        value: v.sum
                    });
                });
                if (!aData.length) {
                    drawEmptyPie('modulePie');
                } else {
                    drawPie('modulePie', aLegend, aModule);
                }

            });

            // 告警日志表格
            initWarnList();
        }

        function init() { // 初始化
            initDateRangePicker();
            initModuleList();
            initPopover();
            initWarnList();
            initConfigModal();
            initConfigData();
            initEvent();
            refreshPageData(null);
        }

        init();

    }];
});