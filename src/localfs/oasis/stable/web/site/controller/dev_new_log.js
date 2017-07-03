/*** Created by zhengchunyu zkf6899 on 2017/2/28.*/
define(['jquery', 'utils', 'moment', 'bootstrap-daterangepicker', 'css!bootstrap_daterangepicker_css'], function ($, Utils, moment) {
    return ['$scope', '$http', '$window', '$rootScope','$state','$stateParams', '$alertService', function ($scope, $http,$window, $rootScope,$state,$stateParams, $alert) {
        function getRcString(attrName) {
            return Utils.getRcString("leading_in_rc", attrName);
        }
        $scope.onReturn = function () {
            $window.history.back();
        }
        var shopid = $stateParams.shopid;
        var tableData = getRcString('table-data').split(',');
        var tableUrl = '/v3/ace/oasis/oasis-rest-shop/restshop/fileupload/getdevicefilepath';
        $scope.options = {
            tId: "theTable",
            url: tableUrl,
            sortField: 'orderby', // 查询参数sort
            sortName: 'id',
            sortOrder: 'desc',
            queryParams: function (params) {
                params.ascending = false;
                params.shop_id = shopid;
                return params;
            },
            columns: [
                {field: 'userName', title: tableData[0]},
                {field: 'createdTime', title: tableData[1]},
                {field: 'statusStr', title: tableData[2]}
            ],
            operateWidth: 240,
            operateTitle: tableData[4],
            operate: {
                edit: function (e, row, $btn) {
                    if(row.status == 1)
                    {
                        $state.go('^.dev_new_log_detail',{shopid:shopid,pathid:row.id});
                    }
                    else {
                        $alert.msgDialogSuccess(getRcString('manageing'));
                    }
                }
            },
            tips: {
                edit: getRcString("title")
            },
            icons: {
                edit: 'fa fa-mydetail'
            },
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