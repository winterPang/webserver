/**
 * Created by liuyanping(kf6877) on 2017/1/12.
 */
define(['jquery','app','utils'], function ($,app,Utils) {
   return app.controller('registerByEmail', ['$scope','$state','$http','$timeout',function ($scope,$state,$http,$timeout) {
      /*chinese or english start*/
      function getRcString(attrName) {
         return Utils.getRcString("register_byEmail_rc", attrName);
      }
      var requestError = getRcString("request-error");
      var dataError = getRcString("data-error");
      var agreeError = getRcString("agree-error");
      /*chinese or english end*/
      var disabled = false;
      $scope.passwordpat = /^[0-9a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]{8,32}$/;
      var low = /^([0-9a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]{1,7}|\d+|[a-zA-Z]+|[_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+)$/;
      var middle = /^([0-9a-zA-Z]+|[a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+|[0-9_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+)$/;
      var heigh = /^((?![0-9a-zA-Z]+$)(?![a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+$)(?![0-9_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+$)[0-9a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+)$/;

      $scope.env = window.location.host.split('.')[0];
      $scope.showPassword = false;
      $scope.toggleEye = false;
      $scope.togglePassword = function () {
         $scope.showPassword = !$scope.showPassword;
         $scope.toggleEye = !$scope.toggleEye;
      };
      $scope.showPasswordCon = false;
      $scope.toggleEyeCon = false;
      $scope.togglePasswordCon = function () {
         $scope.showPasswordCon = !$scope.showPasswordCon;
         $scope.toggleEyeCon = !$scope.toggleEyeCon;
      };
      $scope.agree = true;
      $scope.$watch("register.password", function(v){
         if(v){
            if(v.length >= 8){
               $scope.passwordLevel = true;
               if(low.test(v)){
                  $scope.pw = {
                     l:true,
                     m:false,
                     h:false
                  }
               }else if(middle.test(v)){
                  $scope.pw = {
                     l:false,
                     m:true,
                     h:false
                  }
               }else if(heigh.test(v)){
                  $scope.pw = {
                     l:false,
                     m:false,
                     h:true
                  }
               }
            }else{
               $scope.passwordLevel = false;
            }
         }
      },true);
      $scope.$watch("byEmail.password.$viewValue", function (v) {
         if(v){
            if($scope.register){
               $scope.register.password = $scope.byEmail.password.$viewValue;
               if($scope.register.password == $scope.conpassword){
                  $scope.byEmail.conpassword.$setValidity('pwCheck',true);
               }else{
                  $scope.byEmail.conpassword.$setValidity('pwCheck',false);
               }
            }else{
               $scope.register = {
                  password : $scope.byEmail.password.$viewValue
               }
            }
         }

      });
      $scope.$watch("byEmail.conpassword.$viewValue", function (v) {
         if(v){
            if($scope.register){
               $scope.conpassword = $scope.byEmail.conpassword.$viewValue;
               if($scope.register.password == $scope.conpassword){
                  $scope.byEmail.conpassword.$setValidity('pwCheck',true);
               }else{
                  $scope.byEmail.conpassword.$setValidity('pwCheck',false);
               }
            }else{
               $scope.register = {
                  password : $scope.byEmail.password.$viewValue
               }
            }
         }

      });
      $scope.$watch("byEmail.password1.$viewValue", function (v) {
         if(v || $scope.conpassword){
            if($scope.register){
               $scope.register.password = $scope.byEmail.password1.$viewValue;
               if($scope.register.password == $scope.conpassword){
                  $scope.byEmail.conpassword.$setValidity('pwCheck',true);
               }else{
                  $scope.byEmail.conpassword.$setValidity('pwCheck',false);
               }
            }else{
               $scope.register = {
                  password : $scope.byEmail.password1.$viewValue
               }
            }
         }
      });
      $scope.$watch("byEmail.conpassword1.$viewValue", function (v) {
         if(v){
            if($scope.register){
               $scope.conpassword = $scope.byEmail.conpassword1.$viewValue;
               if($scope.register.password == $scope.conpassword){
                  $scope.byEmail.conpassword.$setValidity('pwCheck',true);
                  // $scope.editForm.editPasswordConform2.$setValidity('pwCheck',true);
               }else{
                  $scope.byEmail.conpassword.$setValidity('pwCheck',false);
                  // $scope.editForm.editPasswordConform2.$setValidity('pwCheck',false);
               }
            }else{
               $scope.register = {
                  password : $scope.byEmail.password1.$viewValue
               }
            }
         }
      });
      $scope.validEmail = {
         url: '/oasis/stable/web/static/oasis-rest-user/restapp/users/isExistEmail/{value}',
         method: 'get',
         validFn: function (resp) {
            return !resp.data;
         }
      };
      $scope.validName = {
         url: '/oasis/stable/web/static/oasis-rest-user/restapp/users/isExistName/{value}',
         method: 'get',
         validFn: function (resp) {
            return !resp.data;
         }
      };
      $scope.error = {
         show: false,
         message : ''
      };
      function clearError() {
         $timeout.cancel($scope.clearTimeout);
         $scope.clearTimeout = $timeout(function () {
            $scope.error = {
               show: false,
               message: ''
            };
         },5000);
      }
      $scope.keySubmit = function(ev){
         if(ev.keyCode==13) {
            $scope.submitData();
         }
      };
      $scope.submitData = function(){
         if(disabled){
            return;
         }
         if(!$scope.agree){
            $scope.error.show = true;
            $scope.error.message = agreeError;
            clearError();
            return;
         }
         if($scope.byEmail.$invalid){
            $scope.error.show = true;
            $scope.error.message = dataError;
            clearError();
            return;
         }
         disabled = true;
         $timeout(function () {
            disabled = false;
         },2000);
         $http.post('/oasis/stable/web/static/oasis-rest-user/restapp/users/addUser/email' + '?locale=' + Utils.getLang(),$scope.register).success(function (data) {
            if(data.code == 0){
               $state.go('registerByEmailSuccess');
            } else{
               if(data.data){
                  var message = "";
                  for(var i in data.data){
                     if(message == ""){
                        message = message + data.data[i];
                     }else{
                        message = ", "+message + data.data[i];
                     }
                  }
                  $scope.error.show = true;
                  $scope.error.message = message;
                  clearError();
               }else{
                  $scope.error.show = true;
                  $scope.error.message = data.message;
                  clearError();
               }
            }
         }).error(function () {
            $scope.error.show = true;
            $scope.error.message = requestError;
            clearError();
         });
      }

   }]);
});
