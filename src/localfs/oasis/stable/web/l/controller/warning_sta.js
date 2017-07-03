/**
 * Created by liuyanping on 2016/10/24
 */
define(['jquery','echarts3','css!l/css/menu3.css'], function ($,echarts) {
    return ['$scope', '$http','$rootScope','$timeout',function ($scope, $http,$rootScope,$timeout){
        $scope.warning = {
            options:{
                tId: "warning",
                showToolbar:true,
                extraCls: 'default_table',
                // url: "",
                pageSize: 5,
                pageList: [5, 10, 15, 20],
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
        var data = [{
            name:'00-25-64-76-BD-40',aaa:'S1',sss:'提示',ddd:'上行流量使用过多',fff:'2016-11-2 11:00'
        },{
            name:'30-21-44-23-HF-25',aaa:'S2',sss:'警告',ddd:'上线失败',fff:'2016-11-1 09:58'
        },{
            name:'25-65-65-45-NR-30',aaa:'S3',sss:'提示',ddd:'下行流量使用过多',fff:'2016-10-2 07:42'
        },{
            name:'66-55-15-12-EY-05',aaa:'S4',sss:'严重',ddd:'异常下线',fff:'2016-09-2 15:37'
        },{
            name:'48-11-97-23-RH-49',aaa:'S5',sss:'警告',ddd:'用户体验差',fff:'2016-08-22 17:28'
        },{
            name:'95-48-19-34-JR-88',aaa:'S6',sss:'警告',ddd:'丢包率过高',fff:'2016-08-03 22:00'
        }];
        $timeout(function(){
            $scope.$broadcast('load#warning', data);
        });

    }];
});