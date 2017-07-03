define([], function () {
    return ['$scope', '$http', '$alertService','$state', function ($scope, $http, $alert,$state) {
        $scope.row={"name":"场所名称11","intro":"场所简介11","shopaddr":"场所（总部）地址11","phone":"18752464578"};
        //$http.get('url',function(data){
        //    $scope.row=data;
        //});
    }];
});