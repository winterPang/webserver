define(['jquery','utils','css!account/css/account.css'], function ($,Utils) {
    return ['$scope', '$http','$state','$stateParams','$alertService',function ($scope, $http,$state,$stateParams,$alert){
        function getRcString(attrName){
            return Utils.getRcString("account_list_rc",attrName);
        }
        $scope.parentName = $stateParams.parentName;
        $scope.parentId = $stateParams.parentId;
        $scope.number = $stateParams.number;
        $scope.modify = {
            name:$stateParams.name
        };
        $scope.old = {};
        $scope.role = {};
        $http.get("/v3/ace/oasis/oasis-rest-user/restapp/users/detail?sub_name="+$scope.modify.name).success(function(data){
            if(data.code == 0){
                $scope.modify.phone = data.data.phone;
                $scope.modify.email = data.data.email;
                $scope.modify.address = data.data.address;
                $scope.old = {
                    phone: data.data.phone,
                    email: data.data.email
                };
                $scope.role = data.data.roleList;
                $scope.role = $scope.role[0];
                if($scope.roleList){
                    $.each($scope.roleList,function(index,data){
                        if(data.name == $scope.role.name){
                            $scope.role = $scope.roleList[index];
                        }
                    });
                }
            }else{
                $alert.noticeDanger(data.message);
            }
        }).error(function(){
            $alert.noticeDanger(getRcString("first-get"));
        });
        $http.get("/v3/ace/oasis/oasis-rest-admin/restapp/roles/getSubTenantRoles").success(function(data){
            if(data.code == 0){
                $scope.roleList = data.data.data;
                if($scope.role.name){
                    $.each($scope.roleList,function(index,data){
                        if(data.name == $scope.role.name){
                            $scope.role = $scope.roleList[index];
                        }
                    });
                }
            }else{
                $alert.noticeDanger(data.message);
            }
        }).error(function(){
            $alert.noticeDanger(getRcString("first-get"));
        });

        $scope.validEmail = {
            url: '/v3/ace/oasis/oasis-rest-user/restapp/users/isExistEmail/{value}',
            method: 'get',
            validFn: function (resp) {
                if($scope.modify.email == $scope.old.email){
                    return true;
                }else{
                    return !resp.data;
                }
            }
        };
        $scope.validPhone = {
            url: '/v3/ace/oasis/oasis-rest-user/restapp/users/isExistPhone/{value}',
            method: 'get',
            validFn: function (resp) {
                if($scope.modify.phone == $scope.old.phone){
                    return true;
                }else{
                    return !resp.data;
                }
            }
        };
        $scope.formSubmit = function(){
                if(!($scope.modify.roleList instanceof Array)){
                    $scope.modify.roleList = [$scope.role];
                }
                $http.put("/v3/ace/oasis/oasis-rest-user/restapp/users",$scope.modify).success(function(data){
                    if(data.code == 0){
                        $alert.noticeSuccess(data.message);
                        $state.go("global.content.user.account_list",{name:$scope.parentName,number:$scope.number,id:$scope.parentId});
                    }else{
                        $alert.noticeDanger(data.message);
                    }
                }).error(function(){
                    $alert.noticeDanger(getRcString("fail-message"));
                })

        };
    }];
});