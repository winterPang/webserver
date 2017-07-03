define(['utils'],function (Utils) {
    return ['$scope', '$alertService', '$rootScope', '$http','$state', function ($scope, $alert, $rootScope, $http,$state) {

        function getRcString(attrName){
            return Utils.getRcString("list_rc",attrName);
        }

        var detailListId = "";
        var keyId = "";

        $scope.fresh = function () {
            $scope.getAppList();
        };

        $scope.create = function () {
            $state.go("global.content.application.appdiy_add");
        };
        //获取实例化应用的列表
        $scope.getAppList = function () {
            $scope.$broadcast('showLoading#option');
            $http({
                url: '/v3/ace/oasis/oasis-rest-application/restapp/tempApp/appList',
                method: 'get'
            }).success(function (data) {
                if(data.code === 0){
                    angular.forEach(data.data, function (item) {
                         item.where = '数据详情';
                         item.Key = ''
                    });
                    $scope.$broadcast('load#option', data.data);
                    $scope.$broadcast('hideLoading#option');
                }else if(data.code === 1){
                    $alert.msgDialogError(data.message);
                }
            })
        };
        //获取数据详情列表
        $scope.getBindList = function (appId) {
            $http({
                url: '/v3/ace/oasis/oasis-rest-application/restapp/tempApp/app/shops',
                method: 'get',
                params: {
                    appId: appId
                }
            }).success(function (data) {
                if(data.code === 0){
                    angular.forEach(data.data, function (item) {
                        item.shopModel = '场所'
                    });
                    $scope.$broadcast('load#tableRelieve', data.data)
                }else if(data.code === 1){
                    $alert.msgDialogError(data.message);
                }
            })
        };
        //获取秘钥接口
        $scope.getKey = function (appId) {
            $http({
                url: '/v3/ace/oasis/oasis-rest-application/restapp/tempApp/app/key',
                method: 'get',
                params: {
                    appId: appId
                }
            }).success(function (data) {
                if(data.code === 0){
                    var keyModel = [];
                    keyModel.push(data.data);
                    $scope.$broadcast('load#tableKey', keyModel)
                }else if(data.code === 1){
                    $alert.msgDialogError(data.message);
                }
            })
        };
        //管理应用表格
        $scope.options={
            tId: 'option',
            pageSize: 5,
            pageList: [5,10,20,50],
            clickToSelect: false,
            searchable: true,
            columns: [
                {sortable:true,field:'name',title:getRcString('list').split(",")[0],searcher:{}},
                {sortable:true,field:'Key',title:getRcString('list').split(",")[1],formatter:showKey,searcher:{}},
                {sortable:true,field:'appName',title:getRcString('list').split(",")[2],searcher:{}},
                {sortable:true,field:'userNum',title:getRcString('list').split(",")[3],formatter:showDetail,searcher:{}},
                {sortable:true,field:'where',title:getRcString('list').split(",")[4],formatter:showNum,searcher:{}}
            ],
            operateWidth: 200,
            operateTitle: getRcString('operation'),
            operate: {
                edit: function(e,row){
                    $state.go("global.content.application.appdiy_add", {appId:row.id});
                },
                remove: function (e, row) {
                    var deleteListId = row.id;
                    $alert.confirm('你是否确认删除应用',function () {
                        $http({
                            url: '/v3/ace/oasis/oasis-rest-application/restapp/tempApp/app/delete',
                            method: 'get',
                            params: {
                                appId: deleteListId
                            }
                        }).success(function (data) {
                            if(data.code === 0){
                                $alert.msgDialogSuccess(getRcString('successFull'));
                                $scope.getAppList();
                            }else if(data.code === 1){
                                $alert.msgDialogError(getRcString('failed'));
                            }
                        })
                    });
                }
            },
            tips:{
                edit: getRcString('edit'),
                remove: getRcString('delete')
            }
        };
        //数据详情表格
        $scope.tableRelieve={
            tId: 'tableRelieve',
            pageSize: 5,
            pageList: [5,10,20,50],
            clickToSelect: false,
            searchable: true,
            columns: [
                {sortable:true,field:'shopModel',title:getRcString('listClient').split(",")[0],searcher:{}},
                {sortable:true,field:'shopName',title:getRcString('listClient').split(",")[1],searcher:{}}
            ],
            operateWidth: 200,
            operateTitle: getRcString('operation'),
            operate: {
                remove: function (e, row) {
                    var deleteId = row.appId;
                    var deleteShopId = row.shopId;
                    $alert.confirm('你是否确认删除场所',function () {
                        $http({
                            url: '/v3/ace/oasis/oasis-rest-application/restapp/tempApp/app/shop',
                            method: 'get',
                            params: {
                                shopId: deleteShopId,
                                appId: deleteId
                            }
                        }).success(function (data) {
                            if(data.code === 0){
                                $alert.msgDialogSuccess(getRcString('successFull'));
                                $scope.getBindList(detailListId);
                            }else if(data.code === 1){
                                $alert.msgDialogError(getRcString('failed'));
                            }
                        })
                    });
                }
            },
            tips:{
                remove: getRcString('delete')
            }
        };
        //秘钥表格
        $scope.tableKey={
            tId: 'tableKey',
            //showPageList : false,
            pagination : false,
            clickToSelect: false,
            columns: [
                {field:'key',title:getRcString('keyClient')}
            ],
            operateWidth: 200,
            operateTitle: getRcString('operation'),
            operate: {
                refresh: function (e, row) {
                    var updateId = row.appId;
                    $alert.confirm('你是否确认更新应用标识',function () {
                        $http({
                            url: '/v3/ace/oasis/oasis-rest-application/restapp/tempApp/app/key/update',
                            method: 'get',
                            params: {
                                appId: updateId
                            }
                        }).success(function (data) {
                            if(data.code === 0){
                                var keyModelUpdate = [];
                                keyModelUpdate.push(data.data);
                                $scope.$broadcast('load#tableKey', keyModelUpdate)
                                $alert.msgDialogSuccess(getRcString('successUpdate'));
                            }else if(data.code === 1){
                                $alert.msgDialogError(getRcString('failedUpdate'));
                            }
                        })
                    });
                }
            },
            refresh:{
                edit: getRcString('update')
            },
            icons: {
                refresh:'fa fa-refresh'
            }
        };

        function showNum(value){
            return '<a class="list-link">'+value+'</a>';
        }

        function showKey(value){
            return '<a class="list-link">'+value+'查看秘钥</a>';
        }

        function  showDetail(value) {
            return '<a class="list-link">'+value+'  详情</a>';
        }

        angular.forEach(["click-cell.bs.table#option"], function (value) {
            $scope.$on(value, function (evt, field, value, row) {
                if(field === "userNum"){
                    $state.go("global.content.application.appdiy_concern", {appId:row.id});
                }else if(field === "where"){
                    detailListId = row.id;
                    $scope.getBindList(detailListId);
                    $scope.$broadcast("show#modalRelieve")
                }else if(field === "Key"){
                    keyId = row.id;
                    $scope.getKey(keyId);
                    $scope.$broadcast("show#modalKey")
                }
            })
        });
        //数据详情模态框
        $scope.modalRelieve = {
            mId:'modalRelieve',
            title:"场所列表",
            autoClose: true,
            showCancel: true,
            modalSize:'lg',
            showHeader:true,
            showFooter:true,
            okText: '确定',
            cancelText: '取消',
            okHandler: function(modal,$ele){

            },
            cancelHandler: function(modal,$ele){

            },
            beforeRender: function($ele){

                return $ele;
            }
        };
        //秘钥模态框
        $scope.modalKey = {
            mId:'modalKey',
            title:"秘钥列表",
            autoClose: true,
            showCancel: true,
            modalSize:'lg',
            showHeader:true,
            showFooter:true,
            okText: '确定',
            cancelText: '取消',
            okHandler: function(modal,$ele){

            },
            cancelHandler: function(modal,$ele){

            },
            beforeRender: function($ele){

                return $ele;
            }
        };

        $scope.getAppList();


    }];
});