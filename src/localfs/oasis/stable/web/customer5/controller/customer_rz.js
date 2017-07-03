define(['jquery','utils','echarts','angular-ui-router','bsTable',
    'customer5/directive/xanth_byod_rz',
    'customer5/directive/xanth_client_rz',
    'customer5/directive/xanth_come_rz',
    'customer5/directive/xanth_count_rz',
    'customer5/directive/xanth_portal_rz'
    ],function($scope,Utils,echarts) {
    return ['$scope', '$http','$state',function($scope,$http,$state){
        $scope.redirectCustomer = function(){
            $state.go("^.customer");
        }       
    }]
});