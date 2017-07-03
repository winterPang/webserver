define(['jquery', 'utils', 'moment', 'bootstrap-daterangepicker', 'css!bootstrap_daterangepicker_css'], function ($, Utils, moment) {
    return ['$scope', '$http', '$rootScope', '$window', "$stateParams",'$alertService', function ($scope, $http, $rootScope,$window, $stateParams,$alert) {
        function getRcString(attrName) {
            return Utils.getRcString("leading_in_rc", attrName);
        }

        $scope.onReturn = function () {
            $window.history.back();
        }

        var id = $stateParams.pathid;
        var tableData = getRcString('table-data').split(',');
        var tableUrl = '/v3/ace/oasis/oasis-rest-shop/restshop/shoplog/getshoplogbypathid';
        $scope.options = {
            tId: "theTable",
            url: tableUrl,
            sortField: 'orderby', // 查询参数sort
            sortName: 'id',
            sortOrder: 'desc',
            queryParams: function (params) {
                params.ascending = false;
                params.path_id = $stateParams.pathid;
                return params;
            },
            columns: [
                {field: 'userName', title: tableData[0]},
                {field: 'createdTime', title: tableData[1]},
                {
                    field: 'description', title: tableData[4], formatter: function (val, row, index) {
                    return val && val.replace(/\s/g, '&nbsp;');
                }
                },
                {field: 'result', title: tableData[5]},
                {field: 'failMessage', title: tableData[6]}
            ],
            sidePagination: 'server',
            responseHandler: function (res) {
                return {
                    total: res.data.rowCount,
                    rows: res.data.data
                };
            }
        };
        $scope.refresh = function () {
            $scope.$broadcast('refresh#theTable');
        };
    }];
});