define(['jquery','utils','css!account/css/account.css'], function ($,Utils) {
    return ['$scope', '$http','$state','$alertService','$rootScope','$stateParams',function ($scope, $http,$state,$alert,$rootScope,$stateParams){
        function getRcString(attrName){
            return Utils.getRcString("account_add_rc",attrName);
        }
        $scope.role={};
        $scope.passwordpat = /^[0-9a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]{8,32}$/;
        $scope.add = {
            parentName:$stateParams.parentName
        };
                $http.get("/v3/ace/oasis/oasis-rest-admin/restapp/roles/getSubTenantRoles").success(function(data){
                    if(data.code == 0){
                        $scope.roleList = data.data.data;
                    }else{
                        $alert.noticeDanger(data.message);
                    }
                }).error(function(){
                    $alert.noticeDanger(getRcString("first-get"));
                });
        $scope.validName = {
            url: '/v3/ace/oasis/oasis-rest-user/restapp/users/isExistName/{value}',
            method: 'get',
            validFn: function (resp) {
                return !resp.data;
            }
        };
        $scope.validEmail = {
            url: '/v3/ace/oasis/oasis-rest-user/restapp/users/isExistEmail/{value}',
            method: 'get',
            validFn: function (resp) {
                return !resp.data;
            }
        };
        $scope.validPhone = {
            url: '/v3/ace/oasis/oasis-rest-user/restapp/users/isExistPhone/{value}',
            method: 'get',
            validFn: function (resp) {
                return !resp.data;
            }
        };
        $scope.cancelAdd = function(){
            $state.go("global.content.user.account_list",{name:$stateParams.parentName,id:$stateParams.parentId});
        };
        $scope.formSubmit = function(){
            if( !($scope.add.roleList instanceof Array)){
                $scope.add.roleList = [$scope.role];
            }
            $http.post("/v3/ace/oasis/oasis-rest-user/restapp/users",$scope.add).success(function(data){
                if(data.code == 0){
                    $alert.noticeSuccess(data.message);
                    $state.go("global.content.user.account_list",{name:$stateParams.parentName,id:$stateParams.parentId});
                }else{
                    if(data.data){
                        var messageInfo = "";
                        $.each(data.data,function(k,v){
                            if(messageInfo == ""){
                                messageInfo = v;
                            }else{
                                messageInfo = messageInfo + "," + v;
                            }
                        });
                        $alert.noticeDanger(messageInfo);
                    }else{
                        $alert.noticeDanger(data.message);
                    }
                }
            }).error(function(){
                $alert.noticeDanger(getRcString("disabled-message"));
            })
        };
    }];
});