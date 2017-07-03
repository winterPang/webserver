/**
 * Created by Administrator on 2017/5/11.
 */
define(['utils','jquery','jqueryZtree','css!frame/libs/ztree/css/zTreeStyle','css!apsiteMng/css/detail','site/libs/jsAddress'], function (Utils,$) {
    return ['$scope', '$http', '$state','$window','$alertService','$stateParams', '$timeout','$rootScope',function ($scope, $http, $state,$window,$alert,$stateParams,$timeout,$rootScope) {

        var SiteCommon = {
            URL_GET_SITES_LIST: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shops?queryCondition=%s',
            URL_DELETE_SITE: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shops/%d',
            MANAGE_URL_TEMPLATE: "https://" + location.hostname + "/oasis/stable/web/frame/index.html#/scene15/nasid%d/devsn%s/content%stopName%s/monitor/dashboard15",
            MAINTENANCE_URL_TEMPLATE: "https://" + location.hostname + "/oasis/stable/web/frame/index.html#/scene88/nasid%s/devsn%s/content/monitor/dashboard88",
            NO_DEVICES_URL: "https://" + location.hostname + "/oasis/stable/web/frame/index.html",
            URL_GET_DEV_LIST: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/%d',
            URL_DELETE_DEV: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices/%s',
            URL_POST_MODIFY_DEV_ALIAS: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/devicealias',
            URL_ISEXIST_SAME_DEVSN: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/deviceSnExisted/%s',
            URL_GET_IRFDEVS: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/getirfdevs?dev_sn=%s',
            URL_AP_GROUP: '/v3/cloudapgroup',
            URL_GET_DEVICES_STATUS: '/base/getDevs',
            URL_POST_ADD_DEV: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2'
        };
        function getRcString(attrName) {
            return Utils.getRcString("listView_rc", attrName);
        }
        var shopTableData = getRcString('table-data').split(',');
        $scope.options = {
            url: SiteCommon.URL_GET_SITES_LIST,
            tId: 'shopList',
            sortField: 'orderby', // 查询参数sort
            sortName: 'shopName',
            sortOrder: 'asc',
            sidePagination: 'server',
            operate: {

            },
            columns: [
                {
                    sortable: true,
                    field: 'shopName',
                    title: shopTableData[0],
                    showTooltip: true,
                    formatter: function (val, row, index) {
                        return '<a href="#/global/content/system/site/detail/' + row.id + '">' + row.shopName.replace(/\s/g, '&nbsp;') + '</a>';
                    }
                },
                {field: 'createdName', showTooltip: true, title: shopTableData[1]},
                {field: 'addrShow', showTooltip: true, title: shopTableData[2]},
                {field: 'shopDesc', showTooltip: true, title: shopTableData[3]},
                {field: 'regionName', showTooltip: true, title: shopTableData[4]},
                {field: 'scenarioName', showTooltip: true, title: shopTableData[5]}
            ],
            queryParams: function (params) {
                params.ascending = params.order === 'asc';
                return params;
            },
            beforeAjax: function () {
                var defer = $q.defer();
                if (!$scope.branchData && $rootScope.userRoles.accessApList == 'true') {
                    $http({
                        method: 'POST',
                        url: '/v3/cloudapgroup',
                        data: {
                            Method: 'getGroupNameListByRoleName',
                            query: {
                                userName: $rootScope.userRoles.userRoot,
                                roleName: $rootScope.userRoles.userName
                            }
                        }
                    }).success(function (branch_data) {
                        $scope.branchData = branch_data;
                        defer.resolve(branch_data);
                    }).error(function (error) {
                        defer.reject(error);
                    });
                } else {
                    defer.resolve($scope.branchData);
                }
                return defer.promise;
            },
            responseHandler: function (site_data, branch_data) {
                if (site_data && 0 == site_data.code && site_data.data && branch_data && branch_data.retCode == 0) {
                    var scenesObj = {};
                    angular.forEach(site_data.data.data, function (v, k) {
                        scenesObj[v.id] = v;
                    });
                    angular.forEach(branch_data.message, function (v, k) {
                        if (scenesObj[v.nasId]) {
                            scenesObj[v.nasId].groupIdList = v.groupList;
                            scenesObj[v.nasId].topId = v.topId;
                        }
                    });

                    angular.forEach(scenesObj, function (v, k) {
                        if (v.groupIdList) {
                            $scope.$apply(function () {
                                $scope.contentName = v.groupIdList[0].groupId;
                                $scope.topName = v.topId;
                            });
                            v.shopUrl = sprintf(SiteCommon.MANAGE_URL_TEMPLATE, v.id, v.sn, v.groupIdList[0].groupId, v.topId);
                            return v;
                        }
                    });
                }
                if (site_data.data) {
                    $scope.$apply(function () {
                        $scope.flags.shop_of_dev_list = site_data.data.data[0];
                    });
                    return {
                        total: site_data.data.rowCount,
                        rows: site_data.data.data
                    };
                } else {
                    return {
                        total: 0,
                        rows: []
                    };
                }
            }
        };
        var addOrEdit;
        var data = {
            message: [
                {
                    name: '龙冠实验局', sub: [
                    {
                        name: '龙冠和谐大厦', type: 'nas', sub: [
                        {name: '绿洲分组'},
                        {name: '路由器分组'},
                        {name: '无线分组'},
                        {name: '资料部分组'}
                    ]
                    },
                    {
                        name: '东电实验局', type: 'nas', sub: [
                        {name: '交换机分组'},
                        {name: '分组'},
                        {name: '无线分组'},
                        {name: '资料部分组'}
                    ]
                    }
                ]
                }
            ], retCode: 0
        };
        var setting = {
            treeId:"applicationTree",
            data: {
                key : {
                    children:"sub",
                    name:"name",
                    checked: "isChecked"
                }
            },
            view: {
                showIcon: false
            },
            callback:{
                onClick:zTreeOnClick
            },
            async:{
                enable : true
            }
        };
        var siteList=[
            {name: '场所1',site:'用户1',type:'东电',device:'这是场所1',date:'东电'},
            {name: '场所2',site:'用户1',type:'东电',device:'这是场所2',date:'东电'},
            {name: '场所3',site:'用户1',type:'龙冠',device:'这是最常用场所',date:'龙冠'},
            {name: '场所4',site:'用户1',type:'东电',device:'这是场所4',date:'东电'},
            {name: '场所5',site:'用户1',type:'龙冠',device:'这是场所5',date:'龙冠'}
        ];
        $scope.form={};
        $scope.addBtnShow=true;
        $scope.cancelBtnShow=false;
        // $scope.options = {
        //     tId: 'base',
        //     showRowNumber: true,
        //     search:true,
        //     data:[] ,
        //     columns: [
        //         {title: '场所名称', field: 'name'},
        //         {title:'创建者',field:'site'},
        //         {title:'场所地址',field:'type'},
        //         {title:'描述',field:'device'},
        //         {title:'所属区域',field:'date'}
        //     ],
        //     operateWidth: 240,  //   操作列的宽度
        //     operateTitle: '操作',//   操作列显示的头部
        //     formatNoMatches: function () {
        //         return "<div>暂无数据，<a id='addSite' style='cursor: pointer'>请添加</a ></div>";
        //     },
        //     operate: {
        //         edit: function (ev,row,btn) {
        //             $scope.$apply(function(){
        //                 addOrEdit='edit';
        //                 $scope.form.name=row.name;
        //                 $scope.form.apBranchSelect='东电';
        //                 $scope.form.industry='餐饮';
        //                 $scope.siteBox=true;
        //                 $scope.addBtnShow=false;
        //                 $scope.cancelBtnShow=true;
        //             });
        //         },
        //         remove: function(ev,row,btn){
        //             $alert.confirm('确认删除该分组么吗？',function(){
        //                 $alert.msgDialogSuccess('删除分组成功');
        //             },function(){})
        //         },
        //         detail:function(ev,row,btn){
        //
        //         }
        //     },
        //     tips: {
        //         edit: '编辑',
        //         remove: '删除',
        //         detail:'更多'
        //     },
        //     icons: {
        //         edit: 'glyphicon glyphicon-pencil',
        //         remove: 'glyphicon glyphicon-remove',
        //         detail:'glyphicon glyphicon-option-horizontal'
        //     }
        // };
        $scope.treeOption={
            mId:'treeOptionId',
            title:"选择区域",
            autoClose: true ,                        // 点击确定按钮是否关闭弹窗，默认关闭
            showCancel: true  ,                      // 是否显示取消按钮，默认显示
            modalSize:'normal',                      // 可选值 normal,sm,lg  分别对应正常，小型，大型
            showHeader:true ,                    // 显示头部
            showFooter:true ,                        // 显示尾部和按钮
            showClose:true ,
            okText: '确定',                         // 确定按钮文本
            cancelText: '取消',                     // 取消按钮文本
            okHandler: function(modal,$ele){

            },
            cancelHandler: function(modal,$ele){
                //点击取消按钮事件，默认什么都不做，并且关闭模态框
            },
            beforeRender: function($ele){
                //渲染弹窗之前执行的操作,$ele为传入的html片段

                return $ele;
            }
        }
        $('#treeOptionId').on('shown.bs.modal', function () {
            var zTreeObj = $.fn.zTree.init($("#apSiteTree"), setting, data.message);
            var nodes = zTreeObj.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                zTreeObj.expandNode(nodes[i], true, true, true);
            }
        })
        function zTreeOnClick(event, treeId, treeNode){
            $scope.$apply(function(){
                $scope.form.apBranchSelect=treeNode.name;
            });
        }
        //为请添加添加添加事件
        $timeout(function(){
            $('#addSite').click(function(){
                $scope.$apply(function(){
                    addOrEdit='add';
                    $scope.siteBox=true;
                    $scope.addBtnShow=false;
                    $scope.cancelBtnShow=true;
                });
            })
        })
        //添加事件
        $scope.addApBranch=function(){
            addOrEdit='add';
           $scope.siteBox=true;
            $scope.addBtnShow=false;
            $scope.cancelBtnShow=true;
        }
        //完成
        $scope.onSubmit=function(){
            if(addOrEdit=='add'){
                $alert.msgDialogSuccess('添加场所成功');
            }else{
                $alert.msgDialogSuccess('修改场所成功');
            }
	    $scope.$broadcast('load#base',siteList);
            $scope.addBtnShow=true;
            $scope.cancelBtnShow=false;
            $scope.siteBox=false;
            $scope.form.name='';
            $scope.form.apBranchSelect='';
        }
        //取消
        $scope.cancel=function(){
            $scope.addBtnShow=true;
            $scope.cancelBtnShow=false;

            $scope.form.name='';
            $scope.form.apBranchSelect='';
            $scope.siteBox=false;
        }
        //选择区域
        $scope.apBranchSelect=function(){
            $scope.$broadcast('show#treeOptionId');
        }
    }]
})