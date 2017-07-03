/**
 * Created by liuyanping(kf6877) on 2017/1/12.
 */
define(['jquery', 'app', 'utils'], function ($, app, Utils) {
    return app.controller('findPas', ['$scope', '$http', '$state', '$timeout', function ($scope, $http, $state, $timeout) {
        /*chinese or english start*/
        function getRcString(attrName) {
            return Utils.getRcString("findPas_rc", attrName);
        }

        var requestError = getRcString("request-error");
        var codeError = getRcString("code-error").split(",");
        var userRequired = getRcString("user-required").split(",")[0];
        var userError = getRcString("user-required").split(",")[1];
        var phoneRequired = getRcString("phone-required");
        /*chinese or english end*/

        /*error message start*/
        $scope.checkError = {};
        $scope.clearError = function (str) {
            if (str == 'name') {
                $scope.checkError.nameError = false;
                $scope.checkError.nameMessage = "";
            } else if (str == 'code') {
                $scope.checkError.codeError = false;
                $scope.checkError.codeMessage = "";
            } else if (str == 'check') {
                $scope.checkError.checkCodeError = false;
                $scope.checkError.checkCodeMessage = "";
            }
        };
        $scope.error = {
            show: false,
            message: ''
        };
        function clearMessage() {
            $timeout(function () {
                $scope.error = {
                    show: false,
                    message: ''
                };
            }, 5000);
        }

        /*error message end*/

        /*password icon-eye change start*/
        $scope.showPassword = false;
        $scope.toggleEye = false;
        $scope.togglePassword = function () {
            $scope.showPassword = !$scope.showPassword;
            $scope.toggleEye = !$scope.toggleEye;
        };
        /*password icon-eye change end*/

        /*password confirm icon-eye change start*/
        $scope.showPasswordCon = false;
        $scope.toggleEyeCon = false;
        $scope.togglePasswordCon = function () {
            $scope.showPasswordCon = !$scope.showPasswordCon;
            $scope.toggleEyeCon = !$scope.toggleEyeCon;
        };
        /*password confirm icon-eye change end */

        var disabled = false;

        $scope.findPas = {};
        $scope.passwordpat = /^[0-9a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]{8,32}$/;
        var low = /^([0-9a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]{1,7}|\d+|[a-zA-Z]+|[_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+)$/;
        var middle = /^([0-9a-zA-Z]+|[a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+|[0-9_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+)$/;
        var heigh = /^((?![0-9a-zA-Z]+$)(?![a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+$)(?![0-9_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+$)[0-9a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+)$/;
        $scope.changeCode = function () {
            $http.get('/oasis/stable/web/static/pinserver/getPin?random=' + Math.random()).success(function (data) {
                $scope.getCode = data.buf;
            }).error(function () {
                $scope.error.show = true;
                $scope.error.message = codeError[0];
                clearError();
            });
        };
        $scope.changeCode();
        $scope.$watch("findPas.password", function(v){
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
        $scope.$watch("byPhone.password.$viewValue", function (v) {
            if (v) {
                if ($scope.findPas) {
                    $scope.findPas.password = $scope.byPhone.password.$viewValue;
                    if ($scope.findPas.password == $scope.conpassword) {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', true);
                    } else {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', false);
                    }
                } else {
                    $scope.findPas = {
                        password: $scope.byPhone.password.$viewValue
                    }
                }
            }

        });
        $scope.$watch("byPhone.conpassword.$viewValue", function (v) {
            if (v) {
                if ($scope.findPas) {
                    $scope.conpassword = $scope.byPhone.conpassword.$viewValue;
                    if ($scope.findPas.password == $scope.conpassword) {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', true);
                    } else {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', false);
                    }
                } else {
                    $scope.findPas = {
                        password: $scope.byPhone.password.$viewValue
                    }
                }
            }

        });
        $scope.$watch("byPhone.password1.$viewValue", function (v) {
            if (v) {
                if ($scope.findPas) {
                    $scope.findPas.password = $scope.byPhone.password1.$viewValue;
                    if ($scope.findPas.password == $scope.conpassword) {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', true);
                    } else {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', false);
                    }
                } else {
                    $scope.findPas = {
                        password: $scope.byPhone.password1.$viewValue
                    }
                }
            }
        });
        $scope.$watch("byPhone.conpassword1.$viewValue", function (v) {
            if (v) {
                if ($scope.findPas) {
                    $scope.conpassword = $scope.byPhone.conpassword1.$viewValue;
                    if ($scope.findPas.password == $scope.conpassword) {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', true);
                    } else {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', false);
                    }
                } else {
                    $scope.findPas = {
                        password: $scope.byPhone.password1.$viewValue
                    }
                }
            }
        });
        var way = "";
        $scope.keySubmitone = function(ev){
            if(ev.keyCode==13) {
                $scope.step.next();
            }
        };
        $scope.keySubmittwo = function(ev){
            if(ev.keyCode==13) {
                $scope.step.dataSubmit();
            }
        };
        $scope.step = {
            firstStep: true,
            secondStep: false,
            secondStepPhone: false,
            next: function () {
                if (disabled) {
                    return;
                }
                disabled = true;
                $timeout(function () {
                    disabled = false;
                }, 2000);
                var value = $scope.findPas.name;
                if (!value) {
                    $scope.checkError.nameError = true;
                    $scope.checkError.nameMessage = userRequired;
                    return;
                }
                if (!$scope.findPas.code) {
                    $scope.checkError.codeError = true;
                    $scope.checkError.codeMessage = codeError[1];
                    return;
                }
                var name = /^[a-zA-Z][a-zA-Z0-9_]{5,31}$/;
                var email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})$/;
                var phone = /^1[34578]\d{9}$/;
                if (name.test(value) || email.test(value) || phone.test(value)) {
                    $http.get('/oasis/stable/web/static/oasis-rest-user/restapp/users/checkPEInfo?pinCode=' + $scope.findPas.code + '&user_name=' + value + '&locale=' + Utils.getLang()).success(function (data) {
                        if (data.code == 0) {
                            if (data.data == "p") {
                                way = "p";
                                $scope.step.firstStep = false;
                                $scope.step.secondStep = true;
                                $scope.step.secondStepPhone = true;
                            } else if (data.data == "e") {
                                way = "e";
                                $scope.step.firstStep = false;
                                $scope.step.secondStep = true;
                                $scope.step.secondStepPhone = false;
                            }
                        } else if (data.code == 1) {
                            $scope.error.show = true;
                            $scope.error.message = data.message;
                            clearMessage();
                        } else if (data.reason == "time out") {
                            $scope.checkError.codeError = true;
                            $scope.checkError.codeMessage = codeError[3];
							$scope.changeCode();
                        } else {
                            $scope.checkError.codeError = true;
                            $scope.checkError.codeMessage = codeError[2];
							$scope.changeCode();
                        }
                    }).error(function () {
                        $scope.error.show = true;
                        $scope.error.message = requestError;
                        clearMessage();
                    });
                } else {
                    $scope.checkError.nameError = true;
                    $scope.checkError.nameMessage = userError;
                }
            },
            dataSubmit: function () {
                if (disabled) {
                    return;
                }
                disabled = true;
                $timeout(function () {
                    disabled = false;
                }, 2000);
                if($scope.step.secondStepPhone){
                    if (!$scope.findPas.checkCode) {
                        $scope.checkError.checkCodeError = true;
                        $scope.checkError.checkCodeMessage = phoneRequired;
                        return;
                    }
                }
                if ($scope.byPhone.$invalid) {
                    $scope.byPhone.password.$dirty = true;
                    $scope.byPhone.conpassword.$dirty = true;
                    return;
                }
                if (way == "e") {
                    $http.post('/oasis/stable/web/static/oasis-rest-user/restapp/users/resetPwdWithEmail' + '?locale=' + Utils.getLang(), {
                        email: $scope.findPas.name,
                        password: $scope.findPas.password
                    }).success(function (data) {
                        if (data.code == 0) {
                            $state.go("findPasByEmailSuccess");
                        } else if (data.code == 1) {
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
                                clearMessage();
                            }else{
                                $scope.error.show = true;
                                $scope.error.message = data.message;
                                clearMessage();
                            }
                        }
                    }).error(function () {
                        $scope.error.show = true;
                        $scope.error.message = requestError;
                        clearMessage();
                    });
                } else if (way == "p") {
                    $http.post('/oasis/stable/web/static/oasis-rest-user/restapp/users/resetPwdWithCheck' + '?locale=' + Utils.getLang(), {
                        name: $scope.findPas.name,
                        password: $scope.findPas.password,
                        checkCode: $scope.findPas.checkCode
                    }).success(function (data) {
                        if (data.code == 0) {
                            $state.go("findPasByPhoneSuccess");
                        } else {
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
                                clearMessage();
                            }else{
                                $scope.error.show = true;
                                $scope.error.message = data.message;
                                clearMessage();
                            }
                        }
                    }).error(function () {
                        $scope.error.show = true;
                        $scope.error.message = requestError;
                        clearMessage();
                    })
                }
            }
        };
    }]);
});
