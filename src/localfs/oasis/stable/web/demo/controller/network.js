/**
 * Created by Administrator on 2016/11/2.
 */
define(["jqueryZtree","css!frame/libs/ztree/css/zTreeStyle","css!demo/css/network","css!demo/css/network_home"], function () {
        return ['$scope', '$http', '$state', '$timeout', function ($scope, $http, $state, $timeout) {
            $scope.vm = {
                activeTab:1
            };

            $scope.$watch("allSelect",function(v){
                if(v){
                    $scope.showButton = true;
                    $.each($scope.sites,function () {
                        this.checkbox = true;
                    });
                }else{
                    $scope.showButton = false;
                    $.each($scope.sites,function () {
                        this.checkbox = false;
                    })
                }
            });
            $scope.$watch("sites",function(v){
                console.log(v);
                $scope.showButton = false;
                $.each(v,function () {
                    if(this.checkbox){
                        $scope.showButton = true;
                    }
                })
            },true);
            var setting = {
                view: {
                    addHoverDom: addHoverDom,
                    removeHoverDom: removeHoverDom
                },
                edit: {
                    enable: true,
                    editNameSelectAll: true,
                    showRemoveBtn: true,
                    showRenameBtn: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                // callback: {
                //     beforeDrag: beforeDrag,
                //     beforeEditName: beforeEditName,
                //     beforeRemove: beforeRemove,
                //     beforeRename: beforeRename,
                //     onRemove: onRemove,
                //     onRename: onRename
                // }
            };
            var zNodes =[
                { id:1, pId:0, name:"北京",open:true},
                { id:11, pId:1, name:"昌平区"},
                { id:12, pId:1, name:"朝阳区"},
                { id:13, pId:1, name:"东城区"},
                { id:14, pId:13, name:"东城区"},
                { id:2, pId:0, name:"上海"},
                { id:21, pId:2, name:"闵行"},
                { id:22, pId:2, name:"闵行"},
                { id:23, pId:2, name:"闵行"},
                { id:3, pId:0, name:"广州"},
                { id:31, pId:3, name:"闵行"},
                { id:32, pId:3, name:"闵行"},
                { id:33, pId:3, name:"闵行"}
            ];
            function addHoverDom(treeId, treeNode) {
                var sObj = $("#" + treeNode.tId + "_span");
                if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
                var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                    + "' title='add node' onfocus='this.blur();'></span>";
                sObj.after(addStr);
            }
            function removeHoverDom(treeId, treeNode) {
                $("#addBtn_"+treeNode.tId).unbind().remove();
            }
            function selectAll() {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
            }

            $(document).ready(function(){
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            });








            $scope.sitesBegin=[
                {des:'默认网络',
                    id: '1',
                    name: '我的网络1',
                    url: 'v.menuUrl',
                    online: '2-',
                    offline: '-2',
                    score: 30,
                    up: '3.2',
                    down: '0.5',
                    clientnum: '20',

                },
                {des:'备用网络',
                    id: '2',
                    name: '我的网络2',
                    url: 'v.menuUrl',
                    online: '2-',
                    offline: '-2',
                    score: '85',
                    up: '3.2',
                    down: '0.5',
                    clientnum: '307'
                }, {des:'宿舍网络',
                    id: '3',
                    name: '我的网络3',
                    url: 'v.menuUrl',
                    online: '2-',
                    offline: '-2',
                    score: 25,
                    up: '3.2',
                    down: '0.5',
                    clientnum: '21'
                }, {
                    id: '4',
                    name: '断线',
                    url: 'v.menuUrl',
                    online: '-',
                    offline: '-',
                    score: 'N/A',
                    up: '-',
                    down: '-',
                    clientnum: '-'
                },
                {des:'默认网络',
                    id: '5',
                    name: '我的网络1',
                    url: 'v.menuUrl',
                    online: '2-',
                    offline: '-2',
                    score: 30,
                    up: '3.2',
                    down: '0.5',
                    clientnum: '23'
                },
                {des:'默认网络',
                    id: '6',
                    name: '我的网络1',
                    url: 'v.menuUrl',
                    online: '2-',
                    offline: '-2',
                    score: 30,
                    up: '3.2',
                    down: '0.5',
                    clientnum: '78'
                },
                {des:'默认网络',
                    id: '7',
                    name: '我的网络1',
                    url: 'v.menuUrl',
                    online: '2-',
                    offline: '-2',
                    score: 30,
                    up: '3.2',
                    down: '0.5',
                    clientnum: '20'
                },
                {des:'默认网络',
                    id: '8',
                    name: '我的网络2',
                    url: 'v.menuUrl',
                    online: '2-',
                    offline: '-2',
                    score: '85',
                    up: '3.2',
                    down: '0.5',
                    clientnum: '20'
                }, {des:'默认网络',
                    id: '9',
                    name: '我的网络3',
                    url: 'v.menuUrl',
                    online: '2-',
                    offline: '-2',
                    score: 25,
                    up: '3.2',
                    down: '0.5',
                    clientnum: '20'
                }
            ];

            $scope.options={
                tId: 'options',
                data: [
                    {name:'我的网络1',online: '50',up:'20 Mbps',down:'0.4 Mbps',score:'30'},
                    {name:'我的网络2',online: '330',up:'2.8 Mbps',down:'0.9 Mbps',score:'56'},
                    {name:'我的网络3',online: '224',up:'8.9 Mbps',down:'2.1 Mbps',score:'24'},
                    {name:'我的网络4',online: '14',up:'9.3 Mbps',down:'4.4 Mbps',score:'89'},
                ],
                columns: [
                    {title:'网络名称',field:'name'},
                    {title: '在线终端', field: 'online'} ,
                    {title: '上行速率', field: 'up'} ,
                    {title: '下载速率', field: 'down'} ,
                    {title: '得分', field: 'score'} ,
                ] ,
                operate:{
                    detail:function(e,row,$btn){

                    },
                    bind: function(e,row,$btn){

                    },
                    edit:  function(e,row,$btn){

                    },
                    remove:function(e,row,$btn){

                    },

                },
                tips:{
                    detail: '运维',
                    bind:'授权',
                    edit: '规划',
                    remove: '删除'

                },
                icons: {
                    detail:'fa fa-info-circle',
                    bind:'fa fa-link',
                    edit:'fa fa-pencil-square-o',
                    remove:'fa fa-trash'
                },

            };
            $scope.delBtn=function(){
                $alert.confirm("确定删除吗？", function () {

                });
            }

            $scope.addToggleo=function () {
                $scope.hoverClasso="hover";
            };
            $scope.deleteToggleo=function(){
                $scope.hoverClasso="";
            };
            $scope.addTogglet=function () {
                $scope.hoverClasst="hover";
            };
            $scope.deleteTogglet=function(){
                $scope.hoverClasst="";
            };
            $scope.addToggleth=function () {
                $scope.hoverClassth="hover";
            };
            $scope.deleteToggleth=function(){
                $scope.hoverClassth="";
            };
            $scope.indicatorOption = {
                radius : 40,
                percentage :true,
                barColor : "#61DABB",
                barWidth: 3,
                initValue : 70,
                barBgColor:"#1D2A3A",
                roundCorner:true
            };
            $scope.page = 1;
                $scope.pageSize = 4;
                $scope.pagination = {
                    first: '首页',
                    prev: '上一页',
                    next: '下一页',
                    last: '末页',
                    totalPages: Math.ceil(($scope.sitesBegin.length)/($scope.pageSize)),
                    paginationClass: 'pagination',
                    onPageClick: function (e, page) {

                        console.log('new_page:' + page);
                    },
                    onChange: function (page) {

                        console.log('new_page:' + page);
                    }
                };

            $scope.$watch('pageSize',function(e,val){

                $scope.pagination.totalPages  = Math.ceil(($scope.sitesBegin.length)/(e));
                //console.log($scope.pageSize);
                //$scope.sites=$scope.sitesBegin
                $scope.updata($scope.page,$scope.pageSize);

            });
            $scope.$watch('page',function(){
                $scope.updata($scope.page,$scope.pageSize);
            });
            $scope.updata=function(npage,npageSize){
                var start=(npage-1)*npageSize;
                var end=(($scope.sitesBegin.length-start)<npageSize)?($scope.sitesBegin.length-1):(start+npageSize-1);
                $scope.sites =  $scope.sitesBegin.slice(start,end+1);
            }
            $scope.updata($scope.page,$scope.pageSize);






            $scope.form = {
                option: {
                    mId: 'addShop',
                    // autoClose: false,
                    showHeader: false,
                    showFooter: false,
                    beforeRender: function ($ele) {
                        $ele.find('button[name=cancel]').on('click', function () {
                            $scope.$broadcast('hide#addShop');
                        });
                    }
                }
            };
            $scope.addModal = function(){
                $scope.$broadcast('show#addShop');
            }








            $scope.shop = {
                option: {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c}G ({d}%)"
                    },
                    series: [
                        {
                            name: '流量',
                            type: 'pie',
                            center: ['50%', '45%'],
                            radius: ['25%', '60%'],
                            avoidLabelOverlap: false,
                            data: [
                                {value: 1548, name: '东城区'},
                                {value: 1003, name: '西城区'},
                                {value: 899, name: '朝阳区'},
                                {value: 565, name: '海淀区'},
                                {value: 332, name: '昌平区'}
                            ]
                        }
                    ]
                }
            };
            // $scope.scroe = {
            //     option: {
            //         tooltip: {
            //             trigger: 'item',
            //             formatter: "{a} <br/>{b}: {c} ({d}%)"
            //         },
            //         series: [
            //             {
            //                 name: '流量',
            //                 type: 'pie',
            //                 center: ['50%', '45%'],
            //                 radius: ['25%', '60%'],
            //                 avoidLabelOverlap: false,
            //                 data: [
            //                     {value: 1548, name: '东城区'},
            //                     {value: 1003, name: '西城区'},
            //                     {value: 899, name: '朝阳区'},
            //                     {value: 565, name: '海淀区'},
            //                     {value: 332, name: '昌平区'}
            //                 ]
            //             }
            //         ]
            //     }
            // };








































            $scope.score = {
                options:{
                    tId: "score",
                    pageSize: 5,
                    pageList: [5, 10, 15, 20],
                    extraCls: 'default_table',
                    showPageList:false,
                    columns: [
                        {sortable: true, field: 'name', title: "场所名称"},
                        {sortable: true, field: 'aaa', title: "AP数量"},
                        {sortable: true, field: 'sss', title: "评分"}
                    ],
                    sidePagination: 'client'
                }
            };
            var data1 = [
                {
                    name:'昌平区',aaa:'35',sss:'43.5',ddd:'负载过高',fff:'2016-11-2 11:00'
                },{
                    name:'海淀区',aaa:'56',sss:'59',ddd:'重启',fff:'2016-11-1 09:58'
                },{
                    name:'朝阳区',aaa:'54',sss:'62.3',ddd:'升级',fff:'2016-10-2 07:42'
                },{
                    name:'东城区',aaa:'49',sss:'66.8',ddd:'连接终端数过多',fff:'2016-09-2 15:37'
                },{
                    name:'海淀区',aaa:'73',sss:'69.7',ddd:'网络错误',fff:'2016-08-22 17:28'
                },{
                    name:'AP6',aaa:'S6',sss:'警告',ddd:'丢包率过高',fff:'2016-08-03 22:00'
                }];
            $timeout(function(){
                $scope.$broadcast('load#score', data1);
            });
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
    }
);