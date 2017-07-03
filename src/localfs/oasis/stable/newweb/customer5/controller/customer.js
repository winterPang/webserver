define(['jquery','utils','echarts','angular-ui-router','bsTable',
    'customer5/directive/xanth_byod',
    'customer5/directive/xanth_client',
    'customer5/directive/xanth_come',
    'customer5/directive/xanth_count',
    'customer5/directive/xanth_portal'
    ],function($,Utils,echarts) {
    return ['$scope', '$http','$state',function($scope,$http,$state){
        $scope.redirect = function(){
            $state.go("^.customer_rz");
        }                                  
    }]
});