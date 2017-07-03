define(['utils', 'moment'], function (Utils, moment) {
    return ['$scope', '$window', function ($scope, $window) {

        var g_Now = moment(),
            g_StartDate = moment(g_Now).subtract(1, 'day').startOf('day'),
            g_EndDate = moment(g_Now).subtract(1, 'day').endOf('day'),
            g_RcId = 'authUserHistoryDetails',
            g_Lang = Utils.getLang() || 'cn';

        $scope.unexport = true;

        $scope.event = {
            return: function () {
                $window.history.back();
            },
            refresh: function () {
                initAuthHistoryTable();
            },
            export: function () {
                /* TODO: 导出接口 */
            }
        };

        function getRcText(attr) {
            return Utils.getRcString(g_RcId, attr).split(',');
        }

        function initDateRangePicker() {
            var config = {
                startDate: moment(g_Now).subtract(1, 'day').startOf('day'),
                endDate: moment(g_Now).subtract(1, 'day').endOf('day'),
                minDate: moment(g_Now).subtract(30, 'days').startOf('day'),
                maxDate: moment(g_Now).subtract(1, 'day').endOf('day'),
                dateLimit: {days: 30},
                opens: 'left',
                locale: {format: "YYYY/MM/DD"}
            };
            if (g_Lang === 'cn') {
                $.extend(config.locale, {
                    applyLabel: getRcText("date-picker-label")[0],
                    cancelLabel: getRcText("date-picker-label")[1],
                    fromLabel: getRcText("date-picker-label")[2],
                    toLabel: getRcText("date-picker-label")[3],
                    daysOfWeek: getRcText("date-picker-week"),
                    monthNames: getRcText("date-picker-month")
                });
            }
            var callback = function (startDate, endDate) {
                g_StartDate = startDate;
                g_EndDate = endDate;
                $scope.$apply(initAuthHistoryTable);
            };
            $('#dateRangePicker').daterangepicker(config, callback);
        }

        function initAuthHistoryTable() {
            $scope.authHistoryTable = {
                tId: 'authHistory',
                searchable: true,
                paginationSize: 'sm',
                sidePagination: 'server',
                method: 'post',
                url: '/v3/portalmonitor/portalhistory/getportalhistorylistbylastvalue',
                dataType: 'json',
                contentType: 'application/json',
                pageListChange: {
                    pageNumber: 1
                },
                queryParams: function (params) {
                    var oSortField = undefined;
                    if (params.sort !== undefined) {
                        oSortField = {};
                        oSortField[params.sort] = (params.order === 'asc' ? 1 : -1);
                    }
                    function hasAttr(o) {
                        var has = false;
                        for (var attr in o) {
                            has = true;
                        }
                        return has;
                    }
                    var oFirstRecord, oLastRecord, oRecord;
                    $scope.$broadcast('getData#authHistory', function (data) {
                        oFirstRecord = data[0];
                        oLastRecord = data[data.length-1];
                    });
                    if (params.pageChangeFlag === 'first') {
                        oRecord = undefined;
                    } else if (params.pageChangeFlag === 'next') {
                        oRecord = oLastRecord;
                    } else if (params.pageChangeFlag === 'pre') {
                        oRecord = oFirstRecord;
                    } else if (params.pageChangeFlag === 'last') {
                        oRecord = undefined;
                    }
                    return {
                        devSN: $scope.sceneInfo.sn,
                        count: params.limit,
                        endTime: g_EndDate.toDate().toString(),
                        startTime: g_StartDate.toDate().toString(),
                        sortField: oSortField,
                        checkField: hasAttr(params.findoption) ? params.findoption : undefined,
                        action: params.pageChangeFlag,
                        lastRecord: oRecord
                    };
                },
                responseHandler: function (data) {
                    /* 假数据 */
                   /* data = {
                        totalcount: 95,
                        historyList: [
                            {UserName: '1'},{UserName: '2'},{UserName: '3'},{UserName: '4'},
                            {UserName: '5'},{UserName: '6'},{UserName: '7'},{UserName: '8'},
                            {UserName: '9'},{UserName: '10'}
                        ]
                    };*/
                    $scope.$apply(function () {
                        $scope.unexport = (data.historyList.length === 0);
                    });
                    return {
                        rows: data.historyList,
                        total: data.totalcount
                    };
                },
                columns: [
                    {field: 'UserName', title: getRcText('list-header')[0], sortable: false, searcher: {}},
                    {field: 'UserIP', title: getRcText('list-header')[1], sortable: true, searcher: {}},
                    {field: 'UserMac', title: getRcText('list-header')[2], sortable: false, searcher: {}},
                    {field: 'AuthTypeStr', title: getRcText('list-header')[3], sortable: false},
                    {field: 'InMBytes', title: getRcText('list-header')[4], sortable: false},
                    {field: 'OutMBytes', title: getRcText('list-header')[5], sortable: false},
                    {field: 'onlineTimeStr', title: getRcText('list-header')[6], sortable: true},
                    {field: 'DurationTimeStr', title: getRcText('list-header')[7], sortable: false}
                ]
            };
        }

        function init() {
            initDateRangePicker();
            initAuthHistoryTable();
        }

        init();


    }];
});