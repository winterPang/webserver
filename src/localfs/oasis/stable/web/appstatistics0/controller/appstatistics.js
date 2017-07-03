/**
 * Created by Administrator on 2016/11/16.
 */
define(['jquery', 'utils', 'echarts3', 'bootstrap-daterangepicker-1_2', 'css!bootstrap_daterangepicker1_2_css', '../../appstatistics0/directive/dashboard-echarts', '../../appstatistics0/directive/funcs_common'], function ($, Utils, echarts) {
        return ['$scope', '$http', '$state', '$alertService', '$timeout', function ($scope, $http, $state, $alert, $timeout) {

            //init charts pie and line
            var myChart = echarts.init($('#mypie')[0]);
            var myLineChart = echarts.init($('#myLine')[0]);

            //request data
            $scope.formData = {
                "Method": "GetAppPie",
                "MAC": "",
                "APPName": "",
                "SelectWay": 0,
                "APPGroupName": "",
                "Param": {
                    "family": 0,
                    "direct": 0,
                    "ACSN": $scope.sceneInfo.sn,
                    "StartTime": new Date(new Date().toLocaleDateString()).getTime() / 1000,
                    "EndTime": new Date().getTime() / 1000
                }
            };
            var request = $.post('/v3/ant/read_dpi_app', $scope.formData);
            var reqPie = function () {
                var colors = ['#D52B4D', '#FF9900', '#44BB74', '#D56F2B', '#C48D3C', '#55AA66', '#44A3BB', '#2BD5D5'];
                $.get('../../init/appstatistics0/week_data.json').success(function (data) {
                    $scope.pieChartData = [];
                    $scope.detailData = [];
                    $scope.totalValue = 0;
                    // request.success(function (data) {
                    data.message.map(function (val, ind) {
                        $scope.totalValue += val.value;
                        $scope.pieChartData.push({'value': val.value, 'name': val.name});
                        $scope.detailData.push({'value': val.value, 'name': val.name, 'color': colors[ind]});
                    });
                    $.map($scope.detailData, function (val) {
                        val.per = Math.round(100 * val.value / $scope.totalValue) + '%';
                    });
                    var PIE_OPTION = {
                        tooltip: {
                            trigger: 'item'
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        color: colors,
                        series: [
                            {
                                type: 'pie',
                                hoverAnimation: false,
                                radius: ['40%', '70%'],
                                center: ['50%', '50%'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                name: getRcString('pie-data'),
                                data: $scope.pieChartData
                            }
                        ]
                    };
                    myChart.setOption(PIE_OPTION);
                }).error(function (msg) {
                    $alert.msgDialogError(msg);
                });
            };
            var reqLine = function () {
                request.success(function (data) {
                    var LINE_OPTION = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        grid: {
                            top: '20%',
                            bottom: '25%',
                            right: '3%',
                            left: '7%'
                        },
                        dataZoom: [
                            {
                                realtime: true,
                                type: 'inside',
                                start: 90,
                                end: 100
                            }, {}
                        ],
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
                                data: randomTime(),
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#475C81'
                                    }
                                },
                                axisLabel: {
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            }
                        ],
                        yAxis: [
                            {
                                name: getRcString('line-data') + '(MB)',
                                type: 'value',
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#475C81'
                                    }
                                },
                                axisLabel: {
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                                nameTextStyle: {
                                    color: '#808080'
                                }
                            }
                        ],
                        series: [
                            {
                                type: 'line',
                                data: randomData(),
                                smooth: true,
                                name: getRcString('line-data'),
                                itemStyle: {
                                    normal: {
                                        color: '#9DE274'
                                    }
                                }
                            }
                        ]
                    };
                    myLineChart.setOption(LINE_OPTION);
                }).error(function (msg) {
                    $alert.msgDialogError(msg);
                })
            };
            var reqTable = function (url) {
                $.get(url).success(function (data) {
                    // request.success(function (data) {  //data->message
                    $scope.$broadcast('load', data.rows);
                }).error(function (msg) {
                    $alert.msgDialogError(msg);
                });
            };

            //get chinese from html
            function getRcString(attrName) {
                return Utils.getRcString("appstatistics_rc", attrName);
            }
            var tableData = getRcString('table-data').split(',');
            var dateData = getRcString('date-data').split(',');
            var dateInit = getRcString('date-init').split(',');

            var TABLES_DEFAULT_OPTIONS = {
                pageSize: 5,
                showPageList: false,
                searchable: true,
                paginationSize: 'sm'
            };

            //vars
            $scope.vars = {
                data_choice_cond: $('[data-choice-condition]').attr('data-choice-condition'),
                date_choice: $('[data-date-choice]').attr('data-date-choice'),
                tables: [
                    $.extend(true, {}, TABLES_DEFAULT_OPTIONS, {
                        columns: [
                            {sortable: true, field: 'appname', title: tableData[1], searcher: {}},
                            {sortable: true, field: 'user_time', title: tableData[2], searcher: {}},
                            {sortable: true, field: 'MAC', title: tableData[3], searcher: {}},
                            {sortable: true, field: 'online', title: tableData[4], searcher: {}},
                            {sortable: true, field: 'flow', title: tableData[5], searcher: {}}
                        ]
                    }),
                    $.extend(true, {}, TABLES_DEFAULT_OPTIONS, {
                        columns: [
                            {sortable: true, field: 'APPGroupName', title: tableData[0], searcher: {}},
                            {sortable: true, field: 'APPName', title: tableData[1], searcher: {}},
                            {sortable: true, field: 'value', title: tableData[2], searcher: {}},
                            {sortable: true, field: 'UserMAC', title: tableData[3], searcher: {}},
                            {sortable: true, field: 'TotalTime', title: tableData[4], searcher: {}},
                            {sortable: true, field: 'Flow', title: tableData[5], searcher: {}}
                        ]
                    }),
                    $.extend(true, {}, TABLES_DEFAULT_OPTIONS, {
                        columns: [
                            {sortable: true, field: 'appname', title: tableData[1], searcher: {}},
                            {sortable: true, field: 'begintime', title: tableData[6], searcher: {}},
                            {sortable: true, field: 'endtime', title: tableData[7], searcher: {}}
                        ]
                    }),
                    $.extend(true, {}, TABLES_DEFAULT_OPTIONS, {
                        columns: [
                            {sortable: true, field: 'usermac', title: tableData[8], searcher: {}},
                            {sortable: true, field: 'begintime', title: tableData[6], searcher: {}},
                            {sortable: true, field: 'endtime', title: tableData[7], searcher: {}}
                        ]
                    })
                ]
            };
            //funcs
            $scope.funcs = {
                remove_all_border_red: function (e) {
                    $(e.target).parents('.probe-choice').find('.border-red').removeClass('border-red');
                },
                clear_all_input: function (e) {
                    $(e.target).parents('.probe-choice').find('.probe-input').val('');
                },
                toggle_show_hide: function (e) {
                    var $curr_target = (e.target.nodeName == 'SPAN' ? $(e.target).parent('.choice-head') : $(e.target));
                    $curr_target.siblings('.choice-show').toggleClass('height-change');
                    $scope.funcs.remove_all_border_red(e);
                    $scope.funcs.clear_all_input(e);
                },
                hide_choice_show: function (e) {
                    $(e.target).parents('.probe-choice').children('.choice-show').removeClass('height-change');
                    $scope.funcs.remove_all_border_red(e);
                    $scope.funcs.clear_all_input(e);
                },
                add_border_red: function (e) {
                    $(e.target).siblings('.probe-input').addClass('border-red');
                },
                init_chart:function () {
                    $scope.formData.Method == 'GetAppPie' ? reqPie() : reqLine();
                },
                table_index:function (i) {
                    $scope.app_statistics_detail_table = $scope.vars.tables[i];
                },
                change_choice_head: function (e, val) {
                    $(e.target).parents('.probe-choice').find('.current-state').html(val);
                    $scope.funcs.init_chart();
                },
                choice_input_is_empty: function (e) {
                    if ($(e.target).siblings('.probe-input').val() !== '') {
                        $scope.funcs.change_choice_head(e, $(e.target).siblings('.probe-input').val());
                        $scope.funcs.hide_choice_show(e);
                    } else {
                        $scope.funcs.remove_all_border_red(e);
                        $scope.funcs.add_border_red(e);
                    }
                },
                choice_condition: function (e, cond) {
                    $(e.target).parents('.probe-choice').find('.current-state').attr('data-choice-condition', cond);
                    $scope.vars.data_choice_cond = cond;
                },
                change_table: function () {
                    if ($scope.vars.data_choice_cond == 'all') {
                        if ($scope.vars.app_type == 'all') {
                            $scope.funcs.table_index(1);
                            reqTable('../../init/appstatistics0/week_table_data.json');
                        } else {
                            $scope.funcs.table_index(0);
                            reqTable('../../init/appstatistics0/app_statistics_detail_table2.json');
                        }
                    } else if ($scope.vars.data_choice_cond == 'mac') {
                        $scope.funcs.table_index(2);
                        reqTable('../../init/appstatistics0/app_statistics_detail_table3.json');
                    } else {
                        $scope.funcs.table_index(3);
                        reqTable('../../init/appstatistics0/app_statistics_detail_table4.json');
                    }
                }
            };

            $('.appstatistics_panel .probe-input').focus(function (e) {
                $scope.funcs.clear_all_input(e);
            });

            function mac_app_choice(e,choice) {
                $scope.funcs.choice_input_is_empty(e);
                $scope.funcs.choice_condition(e, choice);
                $scope.funcs.change_table();
            }
            $scope.app_visit = function (e) {
                mac_app_choice(e,'app');
                $scope.formData.APPName = $scope.vars.visit_app;
                $scope.formData.MAC = "";
            };
            $scope.user_mac = function (e) {
                mac_app_choice(e,'mac');
                $scope.formData.MAC = $scope.vars.user_mac;
                $scope.formData.APPName = "";
            };

            $scope.toggle_choice_show = function (e) {
                $scope.funcs.toggle_show_hide(e);
            };
            $scope.hide_choice_show = function (e) {
                $scope.funcs.hide_choice_show(e);
            };
            $scope.change_value = function (e) {
                if ($(e.target).parents('.appstatistics_panel').length) {
                    $scope.funcs.choice_condition(e, 'all');
                    $scope.funcs.change_table();
                } else {
                    var date, startTime;
                    var nowDatetime = new Date();
                    var nowYear = nowDatetime.getFullYear();
                    var nowMonth = nowDatetime.getMonth();
                    var nowDate = nowDatetime.getDate();
                    var nowHour = nowDatetime.getHours();
                    var nowMinutes = nowDatetime.getMinutes();
                    var nowSecond = nowDatetime.getSeconds();
                    var getStartTime = function (year, mon, day) {
                        return new Date(year, mon, day, nowHour, nowMinutes, nowSecond).getTime() / 1000;
                    };
                    switch ($(e.target).text()) {
                        case dateData[0]:
                            date = 'today';
                            startTime = new Date(nowDatetime.toLocaleDateString()).getTime() / 1000;
                            break;
                        case dateData[1]:
                            date = 'week';
                            startTime = getStartTime(nowYear, nowMonth, nowDate - 7);
                            break;
                        case dateData[2]:
                            date = 'month';
                            startTime = getStartTime(nowYear, nowMonth - 1, nowDate);
                            break;
                        case dateData[3]:
                            date = 'year';
                            startTime = getStartTime(nowYear - 1, nowMonth, nowDate);
                            break;
                    }
                    $scope.vars.date_choice = date;
                    $scope.formData.Param.StartTime = startTime;
                    $scope.formData.Param.EndTime = nowDatetime.getTime() / 1000;
                }
                $scope.funcs.change_choice_head(e, $(e.target).text());
                $scope.funcs.hide_choice_show(e);
            };
            $('.daterange').daterangepicker({
                "autoApply": true,
                "linkedCalendars": false,
                "showCustomRangeLabel": false,
                "alwaysShowCalendars": true,
                "format": 'YYYY/MM/DD',
                "startDate": "2016/11/16",
                "endDate": "2016/11/22",
                "locale": {
                    applyLabel: dateInit[0],
                    cancelLabel: dateInit[1],
                    fromLabel: dateInit[2],
                    toLabel: dateInit[3],
                    daysOfWeek: [dateInit[4], dateInit[5], dateInit[6], dateInit[7], dateInit[8], dateInit[9], dateInit[10]],
                    monthNames: [dateInit[11], dateInit[12], dateInit[13], dateInit[14], dateInit[15], dateInit[16],
                        dateInit[17], dateInit[18], dateInit[19], dateInit[20], dateInit[21], dateInit[22]],
                    firstDay: 1
                }
            }).on('inputchange', function (e) {
                var datearr = e.target.value.split(' - ');//['2016/11/22','2016/11/26']
                $scope.formData.Param.StartTime = new Date(datearr[0]).getTime() / 1000;
                $scope.formData.Param.EndTime = (new Date(datearr[1]).getTime() + 86400000) / 1000;

                $scope.funcs.change_choice_head(e, e.target.value);
                $scope.vars.date_choice = 'range';
                $scope.funcs.hide_choice_show(e);
            });
            $scope.$watch('vars.app_type', function (v1,v2) {
                init(v1,v2);
                $scope.funcs.change_table();
            });
            $scope.$watch('vars.stat_method', init);
            $scope.$watch('vars.draw_type', init);

            function init(v1, v2) {
                var reload = (arguments.length == 0) || (v1 != v2);
                if (reload) {
                    $scope.formData.APPGroupName = ($scope.vars.app_type == 'all' ? "" : $scope.vars.app_type);
                    $scope.formData.SelectWay = ($scope.vars.stat_method == 'manNum' ? 0 : $scope.vars.stat_method == 'Time' ? 1 : 2);
                    $scope.formData.Method = ($scope.vars.draw_type == 'pie' ? "GetAppPie" : "GetAppLine");
                    $scope.funcs.init_chart();
                }
            }

            //init
            $timeout(init);
            $scope.funcs.table_index(0);
        }];
    }
);