/**
 * Created by Administrator on 2016/10/11.
 */
/**
 * Created by Administrator on 2016/10/9.
 */
define(['jquery', 'bootstrapValidator', 'fullcalendar', 'css!frame/libs/fullcalendar-3.0.1/css/fullcalendar'], function ($) {
    return ['$scope', '$http', '$alertService', '$state', '$rootScope', function ($scope, $http, $alert, $state, $rootScope) {


        //selectClient
        $scope.select = function () {
            $scope.$broadcast('refresh', {});
            $scope.$broadcast('show');
        };
        $scope.selectClient = {
            title: '客户端',
            cancelText: '关闭',
            showOk: false
        };
        $scope.clientOptions = {
            columns: [
                {sortable: true, field: 'MACaddress', title: 'MAC地址'},
                {sortable: true, field: 'IPaddress', title: 'IP地址'},
                {sortable: true, field: 'WirelessService', title: '无线服务'},
                {sortable: true, field: 'AP', title: 'AP'},
                {sortable: true, field: 'terminalProducer', title: '终端产商'},
                {sortable: true, field: 'terminalType', title: '终端类型'},
                {sortable: true, field: 'measureType', title: '测量类型'}
            ]
        }
    }];
});

