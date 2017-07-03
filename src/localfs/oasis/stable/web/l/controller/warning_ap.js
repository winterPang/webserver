/**
 * Created by liuyanping on 2016/10/24
 */
define(['jquery','echarts3','css!l/css/menu3.css'], function ($,echarts) {
    return ['$scope', '$http','$rootScope','$timeout',function ($scope, $http,$rootScope,$timeout){
        $scope.warning = {
            options:{
                tId: "warning",
                showToolbar:true,
                // url: "",
                pageSize: 5,
                pageList: [5, 10, 15, 20],
                extraCls: 'default_table',
                showPageList:false,
                columns: [
                    {sortable: true, field: 'name', title: "告警来源"},
                    {sortable: true, field: 'aaa', title: "告警模块"},
                    {sortable: true, field: 'sss', title: "告警级别"},
                    {sortable: true, field: 'ddd', title: "告警信息"},
                    {sortable: true, field: 'fff', title: "告警时间"}
                ],
                sidePagination: 'client'
            }
        };
        var data = [
            {
            name:'AP1',aaa:'S1',sss:'提示',ddd:'负载过高',fff:'2016-11-2 11:00'
        },{
            name:'AP2',aaa:'S2',sss:'警告',ddd:'重启',fff:'2016-11-1 09:58'
        },{
            name:'AP3',aaa:'S3',sss:'提示',ddd:'升级',fff:'2016-10-2 07:42'
        },{
            name:'AP4',aaa:'S4',sss:'严重',ddd:'连接终端数过多',fff:'2016-09-2 15:37'
        },{
            name:'AP5',aaa:'S5',sss:'警告',ddd:'网络错误',fff:'2016-08-22 17:28'
        },{
            name:'AP6',aaa:'S6',sss:'警告',ddd:'丢包率过高',fff:'2016-08-03 22:00'
        }];
        $timeout(function(){
            $scope.$broadcast('load#warning', data);
        });
    }];
});