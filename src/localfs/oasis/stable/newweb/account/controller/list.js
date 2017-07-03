define(['jquery',"utils", 'css!account/css/account.css'], function ($,Utils) {
    return ['$scope', '$http', '$state', '$alertService', '$rootScope', '$stateParams', function ($scope, $http, $state, $alert, $rootScope, $stateParams) {
        $scope.userName = $stateParams.name;
        $scope.number = $stateParams.number;
        $scope.userId = $stateParams.id;
        $scope.tableSuccess = true;

        if (!$scope.userName) {
            $scope.userName = $rootScope.userInfo.user
        }
        if(!$scope.number){
            $scope.number = 1;
        }
         
        $scope.$watch("permission", function () {
            $scope.showHide = {
                write: false
            };
            $.each($scope.permission, function () {
                if (this.id == "account") {
                    $.each(this.permission, function () {
                        if (this == "SUBTENANT_WRITE") {
                            $scope.showHide.write = true;
                        }
                    });
                }
            });
            function getRcString(attrName) {
                return Utils.getRcString("account_list_rc", attrName);
            }
           
            var tableTitle = getRcString("table-title").split(",");
            var revokeAuth = getRcString("revokeAuth-message").split(",");
            $scope.account = {
                name: $rootScope.userInfo.user
            };
            $scope.queryCondition = "";
            if ($scope.showHide.write) {

                $scope.options = {
                    tId: "accountList",
                    url: "/v3/ace/oasis/oasis-rest-user/restapp/users/listSubUsers?sub_name=" + $scope.userName,
                    totalField: 'data.rowCount',
                    sortField: 'orderBy',
                    dataField: 'data.data',
                    // sortName: 'name',
                    pageSize: 5,
                    pageNumber:Number($scope.number),
                    pageList: [5, 10, 15, 20],
                    columns: [
                        {sortable: true, field: 'name', title: tableTitle[0]},
                        {field: 'phone', title: tableTitle[1]},
                        {field: 'email', title: tableTitle[2]},
                        {field: 'roleList', title: tableTitle[8],formatter:function(val,row,index){
                            if(val.length == 1){
                                return val[0].name;
                            }else{
                                return ""
                            }
                        }},
                        {
                            field: 'account', title: tableTitle[3], formatter: function (val, row, index) {
                            return '<a style="cursor: pointer"><span class="glyphicon glyphicon-user"></span></a>';
                        }
                        },
                        {
                            field: 'rootRegion',
                            title: tableTitle[4],
                            formatter: function (val, row, index) {
                                if (val) {
                                    return val.authRegionName
                                } else {
                                    return '<a href="#/global/content/user/account/authorization/'+$scope.userName+'/'+$scope.userId+'/' + row.name + '/' + row.id + '/'+$scope.number+'"><span class="glyphicon glyphicon-plus"></span></a>';
                                }
                            }
                        },
                        {
                            field: 'unauthorization', title: tableTitle[5], formatter: function (val, row, index) {
                            return '<a style="cursor: pointer"><span class="glyphicon glyphicon-minus"></span></a>';
                        }
                        },
                        {
                            field: 'modify', title: tableTitle[6], formatter: function (val, row, index) {
                            return '<a href="#/global/content/user/account/modify/'+$scope.userName+ '/'+ $scope.userId +'/' + row.name +'/'+$scope.number+ '"><span class="glyphicon glyphicon-pencil"></span></a>';
                        }
                        },
                        {
                            field: 'delete', title: tableTitle[7], formatter: function (val, row, index) {
                            return '<a style="cursor: pointer"><span class="glyphicon glyphicon-trash"></span></a>';
                        }
                        }
                    ],
                    sidePagination: 'server',
                    responseHandler: function (data) {
                        $scope.$apply(function(){
                            $scope.userList = data.data.parents;
                        });
                        return data;
                    }
                };
            } else {
                $scope.options = {
                    tId: "accountList",
                    url: "/v3/ace/oasis/oasis-rest-user/restapp/users/listSubUsers?sub_name=" + $scope.userName,
                    totalField: 'data.rowCount',
                    sortField: 'orderBy',
                    dataField: 'data.data',
                    // sortName: 'name',
                    pageSize: 5,
                    pageNumber:Number($scope.number),
                    pageList: [5, 10, 15, 20],
                    columns: [
                        {sortable: true, field: 'name', title: tableTitle[0]},
                        {field: 'phone', title: tableTitle[1]},
                        {field: 'email', title: tableTitle[2]},
                        {
                            field: 'account', title: tableTitle[3], formatter: function (val, row, index) {
                            return '<a style="cursor: pointer"><span class="glyphicon glyphicon-user"></span></a>';
                        }
                        }
                    ],
                    sidePagination: 'server',
                    responseHandler: function (data) {
                        $scope.$apply(function(){
                            $scope.userList = data.data.parents;
                        });
                        return data;
                    }
                };
            }

            $scope.$on('page-change.bs.table#accountList',function(e,number,size){
                $scope.number = number;
            });
            $scope.$on('sort.bs.table#accountList', function () {
                $scope.$broadcast('showLoading#accountList');
            });
            $scope.$on('load-success.bs.table#accountList', function () {
                $scope.$apply(function(){
                    $scope.tableSuccess = false;
                });
                $scope.$broadcast('hideLoading#accountList');
            });
            $scope.$on('click-cell.bs.table#accountList', function (e, field, value, row, $element) {
                if (field == "delete") {
                    $alert.confirm(getRcString("delete-message"), function () {
                        $http.delete('/v3/ace/oasis/oasis-rest-user/restapp/users/deleteUserById?userId=' + row.id).success(function (data) {
                            if (data.code == 0) {
                                $alert.noticeSuccess(data.message);
                                $scope.$broadcast('refresh#accountList');
                            } else {
                                $alert.noticeDanger(data.message);
                            }
                        }).error(function () {
                            $alert.noticeDanger(getRcString("fail-message"));
                        });
                    });
                }
                if (field == "unauthorization") {
                    $alert.confirm(revokeAuth[0], function () {
                        if(row.rootRegion){
                            $http.get("/v3/ace/oasis/oasis-rest-user/restapp/users/getAllSubUsers?user_id="+row.id).success(function(data){
                                if(data.code == 0){
                                    $http.post('/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/revokeAuth', data.data).success(function (data2) {
                                        if (data2.code == 0) {
                                            $alert.noticeSuccess(data2.message);
                                            $scope.$broadcast('refresh#accountList');
                                        } else {
                                            $alert.noticeDanger(data2.message);
                                        }
                                    }).error(function () {
                                        $alert.noticeDanger(getRcString("fail-message"));
                                    });
                                }else{
                                    $alert.noticeDanger(data.message);
                                }
                            }).error(function(){
                                $alert.noticeDanger(getRcString("fail-message"));
                            });
                        }else {
                            $alert.noticeDanger(revokeAuth[1]);
                        }

                    });
                }
                if (field == "account") {
                    $state.go("global.content.user.account_list",{name:row.name,id:row.id,number:1});
                }
            });
            $scope.listClick = function (acc) {
                if(acc.name == $scope.userName){
                    $scope.$broadcast('refresh#accountList', {url: "/v3/ace/oasis/oasis-rest-user/restapp/users/listSubUsers?sub_name=" + acc.name});
                }else{
                    $state.go("global.content.user.account_list",{name:acc.name,id:acc.id});
                }
            };
            $scope.refresh = function () {
                $scope.$broadcast('refresh#accountList', {url: "/v3/ace/oasis/oasis-rest-user/restapp/users/listSubUsers?sub_name=" + $scope.userName + "&queryCondition=" + $scope.queryCondition});
            };
            $scope.enterSearch = function (event) {
                if (event.keyCode == "13") {
                    $scope.search();
                }
            };
            $scope.search = function () {
                $scope.$broadcast('refresh#accountList', {url: "/v3/ace/oasis/oasis-rest-user/restapp/users/listSubUsers?sub_name=" + $scope.userName + "&queryCondition=" + $scope.queryCondition});

            };
            $scope.addAccount = function(){
                $state.go("global.content.user.account_add",{parentName:$scope.userName,parentId:$scope.userId});
            }
        });

    }];
});