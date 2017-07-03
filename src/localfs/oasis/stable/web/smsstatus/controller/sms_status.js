define(['bootstrap-table-CN', 'utils', 'sprintf', 'bootstrapValidator'], function ($, Utils) {
    return ['$scope', '$http', '$alertService', '$state', '$rootScope', '$timeout', function ($scope, $http, $alert, $state, $rootScope, $timeout) {

        function getRcString(attrName) {
            return Utils.getRcString("smsstatus_rc", attrName);
        }

        var sureDelete = getRcString('sure-delete').split(',');
        var msgDialogData = getRcString('msgDialog-data').split(',');
        var tableData = getRcString('table-data').split(',');
        var URL_GET_SMSSTATE = '/v3/ace/oasis/oasis-rest-sms/restapp/smsstate/?orderby=userName&ascending=true&queryCondition=%s&user_name=' + $rootScope.userInfo.user;
        var URL_DELETE_SMSSTATE = '/v3/ace/oasis/oasis-rest-sms/restapp/smsstate/%s?user_name=' + $rootScope.userInfo.user;

        $scope.statusOptions = {
            tId: 'SMSstatus',
            showPageList: false,
            url: sprintf(URL_GET_SMSSTATE, ''),
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
                {sortable: true, field: 'phone', title: tableData[1]},
                {sortable: true, field: 'phoneAddress', title: tableData[3]},
                {sortable: true, field: 'phoneType', title: tableData[2]},
                {
                    sortable: true, field: 'smsContent', title: tableData[4], formatter: function (v) {
                    if (v && v.length > 10) {
                        return '<span title="' + v + '">' + v.substring(0, 7) + '...</span>';
                    }
                    return v || '';
                }
                },
                {sortable: true, field: 'smsStateStr', title: tableData[5]},
                {sortable: true, field: 'sendTimeStr', title: tableData[6]},
                {
                    field: 'del', title: tableData[7], formatter: function (val, row, index) {
                    return '<a style="cursor:pointer;"><span class="glyphicon glyphicon-trash"></span></a>';
                }
                }
            ]
        };

        $scope.$on('click-cell.bs.table#SMSstatus', function (e, field, value, row, $element) {
            $scope.clickRow = row;
            if (field == "del") {
                $alert.confirm(sureDelete[0], function () {
                    $http.delete(sprintf(URL_DELETE_SMSSTATE, row.id)).success(function (data) {
                        if (data.code == 0) {
                            $scope.search();
                        } else {
                            $alert.noticeDanger(data.message);
                        }
                    }).error(function (msg) {
                        $alert.msgDialogError(msg || msgDialogData[0]);
                    })
                })
            }
        });


        $scope.refresh = function () {
            $scope.phone_number = '';
            $scope.search();
        };
        $scope.keysearch = function (e) {
            if (e.keyCode == 13) {
                $scope.search()
            }
        };
        $scope.search = function () {
            $scope.$broadcast('refresh#SMSstatus', {
                url: sprintf(URL_GET_SMSSTATE, $scope.phone_number)
            });
        };
    }];
});

