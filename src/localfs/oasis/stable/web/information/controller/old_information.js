define(['jquery','utils'], function ($,Utils) {
    return ['$scope', '$rootScope', '$http', '$alertService','$timeout',function ($scope,$rootScope,$http,$alert,$timeout) {
        /*jQuery.validator.addMethod("telphoneValid", function(value, element) { 
         var length=value.length;
         var tel = /^(\+86|0086)?\s*1[34578]\d{9}$/;
         return  this.optional(element)||(length == 11 && tel.test(value));
         }, getRcString('phone'));
         jQuery.validator.addMethod("emailValid", function(value, element) {
         var eml = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
         return  this.optional(element)|| eml.test(value);
         }, getRcString('email'));*/
        //$scope.phone="";
        //alert(1);
        //debugger
        var URL='/v3/ace/oasis/oasis-rest-user/restapp/users';
        $scope.userName=$rootScope.userInfo.user;
        function getRcString(attrName){
            return Utils.getRcString("user_change_rc",attrName);
        }
        $scope.sId = {};
        $scope.getUserMes=function(){
            $http.get("/v3/ace/oasis/oasis-rest-user/restapp/users/detail?user_name="+$rootScope.userInfo.user).success(function(data){
                if(data.code == 0){
                    $scope.telNumber = data.data.phone;
                    $scope.emailAddr = data.data.email;
                    $scope.addr=data.data.address;
                    $scope.sId={
                        phone:data.data.phone,
                        email:data.data.email
                    }
                }
            });
        };
        $scope.getUserMes();
        console.log($scope.sId.phone);
        $scope.validPhone = {
            url: '/v3/ace/oasis/oasis-rest-user/restapp/users/isExistPhone/{value}',
            method: 'get',
            live : true,
            validFn: function (resp) {
                if($scope.telNumber==$scope.sId.phone){
                    return true;
                }else{
                    return !resp.data;
                }
            }
        };
        $scope.validEmail = {
            url: '/v3/ace/oasis/oasis-rest-user/restapp/users/isExistEmail/{value}',
            method: 'get',
            live : true,
            validFn: function (resp) {
                if($scope.emailAddr==$scope.sId.email){
                    return true;
                }else{
                    return !resp.data;
                }
            }
        };
        $scope.formSubmit = function(){
            console.log("提交");
            $http({
                method: 'PUT',
                url:URL,
                data: {
                    "name":$rootScope.userInfo.user,
                    "phone": $scope.telNumber,
                    "email": $scope.emailAddr,
                    "address":$scope.addr
                },
                header: {
                    "Content-type": "application/json",
                    "Accept": "application/json"
                }
            }).success(function(data){
                console.log(data);
                if(data.code==0){
                    $alert.noticeSuccess(getRcString('successMessage'));
                    //$timeout(function(){
                    $scope.getUserMes();
                    //},500);
                }else{
                    $alert.notice(data.message+getRcString('errorMessage'));
                }
            });
        }
    }]
});
// $("#informationChange").validate({
//     errorElement: "span",
//     /*errorPlacement : function(error, element) {
//         error.appendTo( element.parent());
//     },*/
//     highlight : function(element, errorClass,
//                          validClass) {
//         if($(element).siblings('.form-control').hasClass('highlight_green')){
//             $(element).siblings('.form-control')
//                 .removeClass('highlight_green').addClass('highlight_red');
//         }else{
//             $(element).closest('.form-control').addClass(
//                 'highlight_red');
//         }
//     },
//     success : function(element) {
//         $(element).siblings('.form-control')
//             .removeClass('highlight_red');
//         $(element).siblings('.form-control').addClass(
//             'highlight_green');
//         $(element).remove();
//     },
//     rules:{
//         telNumber:{
//             required:true,
//             telphoneValid:true
//         },
//         emailAddr: {
//             required: true,
//             emailValid: true
//         }
//     },
//     messages: {
//         telNumber:{
//             required:getRcString('notNull'),
//             telphoneValid:getRcString('phone')
//         },
//         emailAddr: {
//             required:getRcString('notNull'),
//             email:getRcString('email')
//         }
//     },
//     submitHandler: function(form) {
//         $http({
//             method: 'PUT',
//             url:URL,
//             data: {
//                 "name":$rootScope.userInfo.user,
//                 "phone": $scope.telNumber,
//                 "email": $scope.emailAddr
//             },
//             header: {
//                 "Content-type": "application/json",
//                 //"Accept": "application/json"
//             }
//             }).success(function(data){
//                 console.log(data);
//                 if(data.code==0){
//                     $alert.noticeSuccess(getRcString('successMessage'));
//                 }else{
//                     $alert.notice(data.message+getRcString('errorMessage'));
//                 }
//         });
//     }
// });
