/**
 * Created by Administrator on 2016/11/2.
 */
define(['css!l/css/sta_analyse', 'l/directive/dashboard-echarts','l/controller/funcs_common'],
    function () {
        return ['$scope', '$http', '$timeout', '$rootScope', function ($scope,$http,$timeout) {

            $scope.sta_experience_score_option = {
                option: {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['优质', '良好', '较差']
                    },
                    grid: {
                        left: '4.5%',
                        right: '4.5%',
                        top:'9%',
                        bottom: '15%',
                        containLabel: true
                    },
                    dataZoom: [
                        {
                            realtime:true,
                            type:'inside',
                            start: 60,
                            end: 100
                        },{}
                    ],
                    xAxis: [
                        {
                            type: 'category',
                            data: randomTime(),
                            axisLabel: {
                                interval: 39
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '优质',
                            type: 'bar',
                            stack: 'score',
                            itemStyle:{
                                normal:{
                                    color:'rgba(28,175,125,.8)'
                                }
                            },
                            data: randomData()
                        },
                        {
                            name: '良好',
                            type: 'bar',
                            stack: 'score',
                            itemStyle:{
                                normal:{
                                    color:'rgba(30,220,243,.8)'
                                }
                            },
                            data: randomData()
                        },
                        {
                            name: '较差',
                            type: 'bar',
                            stack: 'score',
                            itemStyle:{
                                normal:{
                                    color:'rgba(219,76,38,.8)'
                                }
                            },
                            data: randomData()
                        }
                    ]
                }
            };
            $scope.experience = {
                data:[
                    {a:'AP1',b:'00-25-64-76-BD-40',c:'优质',d:'强',e:"17ms",f:"0.3%"},
                    {a:'AP2',b:'30-21-44-23-HF-25',c:'优质',d:'强',e:"19ms",f:"0.5%"},
                    {a:'AP3',b:'25-65-65-45-NR-30',c:'良好',d:'中',e:"23ms",f:"1.2%"},
                    {a:'AP4',b:'66-55-15-12-EY-05',c:'较差',d:'弱',e:"177ms",f:"7.8%"},
                    {a:'AP5',b:'48-11-97-23-RH-49',c:'良好',d:'中',e:"19ms",f:"2.0%"},
                    {a:'AP6',b:'95-48-19-34-JR-88',c:'良好',d:'中',e:"21ms",f:"2.1%"},
                    {a:'AP7',b:'20-34-29-45-KU-76',c:'良好',d:'中',e:"22ms",f:"1.7%"},
                    {a:'AP8',b:'64-84-64-56-WE-14',c:'优质',d:'强',e:"12ms",f:"0.4%"},
                    {a:'AP9',b:'98-19-19-67-GE-52',c:'较差',d:'弱',e:"190ms",f:"8.9%"},
                    {a:'AP10',b:'54-75-00-78-JU-40',c:'良好',d:'中',e:"19ms",f:"1.5%"}
                ],
                table:{
                    tId: "experience",
                    extraCls: 'default_table',
                    showToolbar: true,
                    pageSize: 5,
                    pageList: [5, 10, 15, 20],
                    showPageList:false,
                    columns: [
                        {sortable: true, field: 'b', title: "MAC地址"},
                        {sortable: true, field: 'a', title: "关联AP"},
                        {sortable: true, field: 'c', title: "体验结果"},
                        {sortable: true, field: 'd', title: "信号强度"},
                        {sortable: true, field: 'e', title: "时延"},
                        {sortable: true, field: 'f', title: "丢包率"}

                    ],
                    sidePagination: 'client'
                }
            };
            $timeout(function(){
                $scope.$broadcast("load#experience",$scope.experience.data);
            })
        }]
    }
);