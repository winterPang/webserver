/**
 * Created by liuyanping(kf6877) on 2017/1/12.
 */
define(['jquery','app'], function ($,app) {
   return app.controller('registerByPhoneSuccess', ['$scope','$interval','$window',function ($scope,$interval,$window) {
      $scope.goLogin = function(){
         $window.location.href = "../../../login.html";
      };
      $scope.time = 5;
      $interval(function(){
         $scope.time--;
         if($scope.time <= 1){
            $scope.goLogin();
         }
      },1000);
   }]);
});
