define(['jquery', 'utils', 'moment', 'bootstrap-daterangepicker', 'css!bootstrap_daterangepicker_css'], function ($, Utils, moment) {
    return ['$scope', '$http', '$rootScope', '$state', '$alertService', function ($scope, $http, $rootScope, $state, $alert) {
        function getRcString(attrName) {
            return Utils.getRcString("leading_in_rc", attrName);
        }

        var tableData = getRcString('table-data').split(',');
        var siteUrl = '/v3/ace/oasis/oasis-rest-shop/restshop/shoplog/getshoplog';
        var deviceUrl = '/v3/ace/oasis/oasis-rest-shop/restshop/fileupload/getalldevicefilepath';

        $scope.isSiteLog = true;
        $scope.navClick = function(str){
            if(str === 'site' && !$scope.isSiteLog){
                $scope.isSiteLog = true;
            }else if(str === 'device' && $scope.isSiteLog){
                $scope.isSiteLog = false;
            }
        };
        $scope.siteOptions = {
            tId: "siteTable",
            url: siteUrl,
            sortField: 'orderby', // 查询参数sort
            sortName: 'id',
            sortOrder: 'asc',
            queryParams: function (params) {
                params.ascending = false;
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
        $scope.deviceOptions = {
            tId: "deviceTable",
            url: deviceUrl,
            sortField: 'orderby', // 查询参数sort
            sortName: 'id',
            sortOrder: 'desc',
            queryParams: function (params) {
                params.ascending = false;
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
                        $state.go('^.dev_detail',{shopid:row.shopId,pathid:row.id});
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