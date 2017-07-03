/**
 * Created by liuyanping(kf6877) on 2017/1/12.
 */
define(['jquery', 'app', 'utils'], function ($, app, Utils) {
    return app.controller('registerByPhone', ['$scope', '$http', '$interval', '$state', '$timeout', function ($scope, $http, $interval, $state, $timeout) {
        /*chinese or english start*/
        function getRcString(attrName) {
            return Utils.getRcString("register_byPhone_rc", attrName);
        }
        var requestError = getRcString("request-error");
        var codeError = getRcString("code-error");
        var codeText = getRcString("code-text").split(",");
        var phoneCode = getRcString("phone-code");
        var dataError = getRcString("data-error");
        var agreeError = getRcString("agree-error");
        /*chinese or english end*/

        /*error message start*/
        $scope.error = {
            show: false,
            message: ''
        };
        function clearError() {
            $timeout.cancel($scope.clearTimeout);
            $scope.clearTimeout = $timeout(function () {
                $scope.error = {
                    show: false,
                    message: ''
                };
            }, 5000);
        }
        $scope.codeError = {
            show: false,
            required: false,
            error: false,
            timeOut: false
        };
        $scope.clearCodeError = function () {
            $scope.codeError = {
                show: false,
                required: false,
                error: false,
                timeOut: false
            };
        };
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
        /*password confirm icon-eye change end*/

        var disabled = false;
        $scope.passwordpat = /^[0-9a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]{8,32}$/;
        var low = /^([0-9a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]{1,7}|\d+|[a-zA-Z]+|[_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+)$/;
        var middle = /^([0-9a-zA-Z]+|[a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+|[0-9_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+)$/;
        var heigh = /^((?![0-9a-zA-Z]+$)(?![a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+$)(?![0-9_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+$)[0-9a-zA-Z_`\-=\[\];'\\,\.\/~\!@#\$%\^&\*\(\)\+\{\}:"\|<>\?"]+)$/;
        $scope.agree = true;
        $scope.validName = {
            url: '/oasis/stable/web/static/oasis-rest-user/restapp/users/isExistName/{value}',
            method: 'get',
            validFn: function (resp) {
                return !resp.data;
            }
        };
        $scope.validPhone = {
            url: '/oasis/stable/web/static/oasis-rest-user/restapp/users/isExistPhone/{value}',
            method: 'get',
            validFn: function (resp) {
                return !resp.data;
            }
        };
        $scope.changeCode = function () {
            $http.get('/oasis/stable/web/static/pinserver/getPin?random=' + Math.random()).success(function (data) {
                $scope.getCode = data.buf;
            }).error(function () {
                $scope.error.show = true;
                $scope.error.message = codeError;
                clearError();
            });
        };
        $scope.changeCode();

        $scope.getPhoneCode = function (e) {
            var othis = $(e.target);
            if (othis.text() != codeText[0]) {
                return;
            }
            if (!$scope.register || !$scope.register.code) {
                if (!$scope.byPhone.code.$dirty) {
                    $scope.codeError.show = true;
                    $scope.codeError.required = true;
                    $scope.codeError.error = false;
                    $scope.codeError.timeOut = false;
                }
                if (!$scope.register || !$scope.register.phone) {
                    $scope.byPhone.phone.$dirty = true;
                    $scope.change.phone = true;
                }
                return;
            }
            if (!$scope.register || !$scope.register.phone) {
                $scope.byPhone.phone.$dirty = true;
                $scope.change.phone = true;
                return;
            }
            if ($scope.byPhone.phone.$invalid || $scope.byPhone.code.$invalid) {
                return;
            }
            $http.post('/oasis/stable/web/static/oasis-rest-sms/restapp/user/getPhoneCode?pinCode=' + $scope.register.code, {phone: $scope.register.phone}).success(function (data) {
                if (data.code == 0) {
                    $('input[name="phone"]').attr("disabled","disabled");
                    $scope.codeDisabled = true;
                    var time = 90;
                    othis.text(codeText[1] + time + "s");
                    var interval = $interval(function () {
                        time--;
                        if (time <= 0) {
                            $interval.cancel(interval);
                            $scope.codeDisabled = false;
                            othis.text(codeText[0]);
                            $('input[name="phone"]').removeAttr("disabled");
                        } else {
                            othis.text(codeText[1] + time + "s");
                        }
                    }, 1000);
                } else if (data.retCode == -1) {
                    if (data.reason == "time out") {
                        $scope.codeError.show = true;
                        $scope.codeError.error = false;
                        $scope.codeError.required = false;
                        $scope.codeError.timeOut = true;
						$scope.changeCode();
                        return;
                    }
                    $scope.codeError.show = true;
                    $scope.codeError.error = true;
                    $scope.codeError.required = false;
                    $scope.codeError.timeOut = false;
					$scope.changeCode();
                }else if(data.code == 1){
                    $scope.error.show = true;
                    $scope.error.message = data.message;
                    clearError();
                }
            }).error(function () {
                $scope.error.show = true;
                $scope.error.message = phoneCode;
                clearError()
            });
        };
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
        $scope.$watch("byPhone.password.$viewValue", function (v) {
            if(v){
                if ($scope.register) {
                    $scope.register.password = $scope.byPhone.password.$viewValue;
                    if ($scope.register.password == $scope.conpassword) {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', true);
                    } else {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', false);
                    }
                } else {
                    $scope.register = {
                        password: $scope.byPhone.password.$viewValue
                    }
                }
            }
        });
        $scope.$watch("byPhone.conpassword.$viewValue", function (v) {
            if(v){
                if ($scope.register) {
                    $scope.conpassword = $scope.byPhone.conpassword.$viewValue;
                    if ($scope.register.password == $scope.conpassword) {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', true);
                    } else {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', false);
                    }
                } else {
                    $scope.register = {
                        password: $scope.byPhone.password.$viewValue
                    }
                }
            }
        });
        $scope.$watch("byPhone.password1.$viewValue", function (v) {
            if(v){
                if ($scope.register) {
                    $scope.register.password = $scope.byPhone.password1.$viewValue;
                    if ($scope.register.password == $scope.conpassword) {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', true);
                    } else {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', false);
                    }
                } else {
                    $scope.register = {
                        password: $scope.byPhone.password1.$viewValue
                    }
                }
            }
        });
        $scope.$watch("byPhone.conpassword1.$viewValue", function (v) {
            if(v){
                if ($scope.register) {
                    $scope.conpassword = $scope.byPhone.conpassword1.$viewValue;
                    if ($scope.register.password == $scope.conpassword) {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', true);
                    } else {
                        $scope.byPhone.conpassword.$setValidity('pwCheck', false);
                    }
                } else {
                    $scope.register = {
                        password: $scope.byPhone.password1.$viewValue
                    }
                }
            }
        });
        $scope.$watch("byPhone.code.$viewValue", function (v) {
            if ($scope.register) {
                $scope.register.code = $scope.byPhone.code.$viewValue;
            } else {
                $scope.register = {
                    code: $scope.byPhone.code.$viewValue
                }
            }

        });
        $scope.keySubmit = function(ev){
            if(ev.keyCode==13) {
                $scope.submitData();
            }
        };
        $scope.submitData = function () {
            if (disabled) {
                return;
            }
            if(!$scope.agree){
                $scope.error.show = true;
                $scope.error.message = agreeError;
                clearError();
                return;
            }
            disabled = true;
            $timeout(function () {
                disabled = false;
            }, 2000);
            if ($scope.byPhone.$invalid) {
                $scope.error.show = true;
                $scope.error.message = dataError;
                clearError();
                return;
            }
            if($scope.codeError.show){
                $scope.error.show = true;
                $scope.error.message = dataError;
                clearError();
                return;
            }
            var data = {
                name: $scope.register.name,
                phone: $scope.register.phone,
                password: $scope.register.password,
                checkCode: $scope.register.checkCode
            };
            $http.post('/oasis/stable/web/static/oasis-rest-user/restapp/users/addUser/phone' + '?locale=' + Utils.getLang(), data).success(function (data) {
                if (data.code == 0) {
                    $state.go('registerByPhoneSuccess');
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
