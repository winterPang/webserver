define(['bootstrap-table-CN', 'utils', 'bootstrapValidator'], function ($, Utils) {
    return ['$scope', '$http', '$alertService', '$state', '$rootScope', '$timeout', function ($scope, $http, $alert, $state, $rootScope, $timeout) {

        function getRcString(attrName) {
            return Utils.getRcString("smsrecord_rc", attrName);
        }

        var tableData = getRcString('table-data').split(',');
        var URL_GET_SMSRECORD = '/v3/ace/oasis/oasis-rest-sms/restapp/smsrecord/?orderby=userName&ascending=true&queryCondition=&user_name=' + $rootScope.userInfo.user;

        $scope.recordOptions = {
            tId: 'SMSrecord',
            showPageList: false,
            url: URL_GET_SMSRECORD,
            sidePagination: 'server',
            queryParams: function (params) {
                params.start = params.offset + 1;
                return params;
            },
            responseHandler: function (data) {
                if (!data) {
                    return;
                }
                if (data.code == 0) {
                    return {
                        total: data.data.rowCount,
                        rows: data.data.data
                    };
                } else {
                    return {
                        total: 0,
                        rows: []
                    };
                }
            },
            columns: [
                {sortable: true, field: 'userName', title: tableData[0]},
                {sortable: true, field: 'buyCount', title: tableData[1]},
                {sortable: true, field: 'buyTimeStr', title: tableData[2]}
            ]
        };
        $scope.refresh = function () {
            $scope.$broadcast('refresh#SMSrecord', {
                url: URL_GET_SMSRECORD
            });
        }
    }];
});



