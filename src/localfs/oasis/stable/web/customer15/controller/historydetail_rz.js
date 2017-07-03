define(['utils'], function (Utils) {
    return ['$scope', '$http', '$window', function ($scope, $http, $window) {
        function getRcString(attrName) {
            return Utils.getRcString("user_rc", attrName);
        }

        $scope.leadDevSN = '';

        $scope.return = function () {
            $window.history.back();
        };
        $scope.options = {
            pageSize: 10,
            showPageList: false,
            clickToSelect: false,
            url: '/v3/stamonitor/monitor',
            method: 'post',
            sidePagination: 'server',
            contentType: "application/json",
            dataType: "json",
            searchable: true,
            queryParams: function (params) {
                var chouseBody = {
                    method: 'clientcount_cloud_history',
                    param: {
                        topId: $scope.topName,
                        groupId: $scope.branchName,
                        dataType: 'auth',
                        devSN: $scope.leadDevSN,
                        skipNum: params.offset,
                        limitNum: params.limit,
                        clientMAC: params.findoption.clientMAC ? params.findoption.clientMAC : '',
                        clientSSID: params.findoption.clientSSID ? params.findoption.clientSSID : ''
                    }
                };
                params.start = undefined;
                params.size = undefined;
                params.order = undefined;
                params.limit = undefined;
                params.offset = undefined;
                params.skipnum = undefined;
                params.limitnum = undefined;
                return $.extend(true, {}, params, chouseBody);
            },
            responseHandler: function (data) {
                $scope.leadDevSN = data.response.devSN;
                $.each(data.response.clientInfo, function (i, item) {
                    item.upLineDate = (new Date(item.upLineDate)).toLocaleDateString() + " " + (new Date(item.upLineDate)).toTimeString().split(" ")[0];
                });
                return {
                    total: data.response.count_total || 0,
                    rows: data.response.clientInfo || []
                };
            },
            columns: [
                {field: 'clientMAC', title: getRcString('Visitor_LIST_HEADER').split(",")[0], searcher: {}},
                {field: 'clientIP', title: getRcString('Visitor_LIST_HEADER').split(",")[1]},
                {field: 'upLineDate', title: getRcString('Visitor_LIST_HEADER').split(",")[2]},
                {
                    field: 'onlineTime', title: getRcString('Visitor_LIST_HEADER').split(",")[3],
                    formatter: function (v) {
                        var onlineDay = Math.floor(v / 86400);
                        onlineDay < 10 && (onlineDay = '0' + onlineDay);
                        var onlineHour = Math.floor((v % 86400) / 3600);
                        onlineHour < 10 && (onlineHour = '0' + onlineHour);
                        var onlineMinute = Math.floor(v % 86400 % 3600 / 60);
                        onlineMinute < 10 && (onlineMinute = '0' + onlineMinute);
                        var onlineSecond = v % 86400 % 3600 % 60;
                        onlineSecond < 10 && (onlineSecond = '0' + onlineSecond);
                        return onlineDay + 'd:' + onlineHour + 'h:' + onlineMinute + 'm:' + onlineSecond + 's';
                    }
                }
            ]
        };
    }]
});