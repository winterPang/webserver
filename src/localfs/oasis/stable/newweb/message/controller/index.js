/**
 * Created by l13643 on 2017/4/10.
 */
define(['css!../css/message.css'], function () {
    return ['$rootScope',
            '$scope',
            '$state',
            '$http',function ($rootScope,
                                 $scope,
                                 $state,
                                 $http) {

        $scope.resolve = function(){
/*
            var AUTH_URL = '/oasis/stable/web/static/oasis-rest-sms/restapp/sms/getSmsAuth?user_name=' + $rootScope.userInfo.user;
            $http
                .get(AUTH_URL)
                .success(function(data){
                    if(data.code === 0){
                        $scope.perm = 0; //  -1 null 0 Emay  1 Green 2 Both

                        $state.go('global.content.system.message.greentown');
                        //default show tab
                        $scope.isEmay = 'G'
                    }
                })
                .error(function(){
                    $scope.resolve()
                })
*/
            $scope.perm = 0; //  -1 null 0 Emay  1 Green 2 Both
            $state.go('global.content.system.message.emay');
            //default show tab
            $scope.currentTab = 0
        };
        $scope.tabSwitch = function (tabName) {
            $scope.currentTab = tabName
        }

    }]
});