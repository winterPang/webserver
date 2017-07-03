define(['bootstrapValidator','utils'], function ($,Utils) {
    return ['$scope','$rootScope', '$http', '$timeout', '$alertService', function ($scope,$rootScope, $http, $timeout, $alert, $watch) {
        function getRcString(attrName){
            return Utils.getRcString("update_password_rc",attrName);
        }
       $scope.$watch("currPwd", function () {
            console.log($scope.currPwd);
            var $currPwd=$scope.currPwd;
            if(($currPwd==undefined)||($currPwd.length>=8)||($currPwd!=undefined)){
                $scope.hasShow=false;
            }
        });
        $scope.hasShow = false;
        var URL_password='/v3/ace/oasis/oasis-rest-user/restapp/users/password';
        $scope.onSubmit=function(e){
            $(e.target).blur();
            $alert.confirm(getRcString('isChangePassword'),function(){
                $http({
                    method: 'POST',
                    url:URL_password,
                    data: {
                        //$rootScope.userInfo.user
                        "name":$rootScope.userInfo.user,
                        "oldPassword": $scope.currPwd,
                        "password": $scope.reptNewPwd
                    },
                    header: {
                        "Content-type": "application/json",
                        "Accept": "application/json"
                    }
                }).success(
                    function (data, status, headers, config) { 
                        console.log(data);
                        $scope.data=data;
                        $scope.hasShow=false;
                        if (data.code == 1) {
                            $scope.hasShow = true;
                            $("input[id=currPwd]").addClass("ng-dirty");
                            
                        } else if (data.code == 0) {
                            $alert.noticeSuccess(getRcString('successMessage') + $scope.newPwd);
                        }  
                });     
            });
        }
    }];
});
        //$timeout(function () {
            //$("[name=pwdForm]").bootstrapValidator({
                //message: 'This value is not valid',
                //feedbackIcons: {
                    /*input状态样式图片*/
                    //valid: 'glyphicon glyphicon-ok',//成功样式
                    //invalid: 'glyphicon glyphicon-remove',
                    //validating: 'glyphicon glyphicon-refresh'
                //},
                //fields: {//验证规则
                    //currPwd: {//当前密码
                        //validators: {
                            //notEmpty: {//非空验证：提示消息
                                //message: getRcString('notNull')
                            //},
                            /*stringLength: {
                                min: 8,
                                max:32,
                                message: getRcString('length')
                            },*/
                            //regexp: {
                                //regexp: /^([^\s]{8,16})$/,
                                //message: '密码必须为8到32位的除空格外的非空字符'
                            //}
                            /*,
                            different:{
                                field:'newPwd',
                                message:getRcString('newPwdDifferent')
                            }*/
                        //}
                    //},
                    //newPwd: {//新密码
                        //validators: {
                            //notEmpty: {//非空验证：提示消息
                                //message: getRcString('notNull')
                            //},
                            /*stringLength: {
                                min: 8,
                                max:32,
                                message: getRcString('length')
                            },*/
                            /*different: {
                                field: 'currPwd',
                                message: getRcString('currPwdDifferent')
                            },*/
                            /*identical:{
                                field:'reptNewPwd',
                                message:getRcString('reptNewPwdIdentical')
                            }
                        }*/
                    //},
                    /*reptNewPwd: {//确认密码
                        validators: {
                            notEmpty: {
                                message: getRcString('notNull')
                            },
                            stringLength: {
                                min: 8,
                                max:32,
                                message: getRcString('length')
                            },
                            identical: {//相同
                                field: 'newPwd', //需要进行比较的input name值
                                message: getRcString('identical')
                            }
                        }
                    }*/
                //}
            //}).on('success.form.bv', function (e) {
                //e.preventDefault();
                //console.log($scope.currPwd);
                //$alert.confirm(getRcString('isChangePassword'),function(){
                    /*$http({
                        method: 'POST',
                        url:URL_password,
                        data: {
                            //$rootScope.userInfo.user
                            "name":$rootScope.userInfo.user,
                            "oldPassword": $scope.currPwd,
                            "password": $scope.reptNewPwd
                        },
                        header: {
                            "Content-type": "application/json",
                            "Accept": "application/json"
                        }
                    }).success(
                        function (data, status, headers, config) { 
                            console.log(data);
                            $scope.data=data;
                            $scope.hasShow=false;
                            if (data.code == 1) {
                                $scope.hasShow = true;
                                console.log(data.message);
                                $("label[for=currPwd]").parent(".form-group").addClass("has-error");
                                $("label[for=currPwd]").addClass("failed");
                                $("input[id=currPwd]").addClass("failed").next().css("display", "none");
                                //alert(data.message);
                            } else {
                                $("input[id=currPwd]").next().removeClass("glyphicon-remove");
                                $("label[for=currPwd]").removeClass("failed");
                            }
                            if (data.code == 0) {
                                $alert.noticeSuccess(getRcString('successMessage') + $scope.newPwd);
                            }   
                    }); */
                //})                   
            //});
        //});
