define(['jquery','utils','css!account/css/account.css'], function ($,Utils) {
    return ['$scope', '$http','$state','$alertService','$stateParams',function ($scope, $http,$state,$alert,$stateParams){
        function getRcString(attrName){
            return Utils.getRcString("account_authorization_rc",attrName);
        }
        var userName = $stateParams.name;
        var userId = $stateParams.id;
        $scope.parentName = $stateParams.parentName;
        $scope.parentId = $stateParams.parentId;
        $scope.number = $stateParams.number;
        $scope.authorization = {
            name : userName
        };
        if($scope.parentId){
            $http.get("/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regionsOfSubUser/"+$scope.parentId).success(function(data){
                if(data.code == 0){
                    $scope.regionList = data.data;
                }else{
                    $alert.noticeDanger(data.message);
                }
            }).error(function(){
                $alert.noticeDanger(getRcString("first-get"));
            });
        }else{
            $http.get("/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions").success(function(data){
                if(data.code == 0){
                    $scope.regionList = data.data;
                }else{
                    $alert.noticeDanger(data.message);
                }
            }).error(function(){
                $alert.noticeDanger(getRcString("first-get"));
            });
        }

        $scope.formSubmit = function(){
            $('form[name=authorizationForm] button:contains('+getRcString("ok")+')').attr('disabled','disabled');
            var param = {
                authUserId : userId,
                authFromRegionId : $scope.authorization.region.id
            };
            $http.post("/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/authregion",param).success(function(data){
                if(data.code == 0){
                    $alert.noticeSuccess(data.message);
                    $state.go("global.content.user.account_list",{name:$scope.parentName,id:$scope.parentId,number:$scope.number});
                }else{
                    $('form[name=authorizationForm] button:contains('+getRcString("ok")+')').attr('disabled',false);
                    $alert.noticeDanger(data.message);
                }
            }).error(function(){
                $alert.noticeDanger(getRcString("fail-message"));
            });
        }

    }];
});