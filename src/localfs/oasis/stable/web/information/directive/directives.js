define(['angularAMD', 'utils'], function (app, Utils) {

    var sLang = Utils.getLang() || 'cn';
    var URL_changePhone = sprintf('../information/views/%s/change_phone.html', sLang);
    var URL_bindPhone = sprintf('../information/views/%s/bind_phone.html', sLang);
    var URL_changeEmail = sprintf('../information/views/%s/change_email.html', sLang);
    var URL_bindEmail = sprintf('../information/views/%s/bind_email.html', sLang);

    app.directive('changePhone', ['$interval', 'PerfectInfoServices', '$alertService', function ($interval, Ser, $alert) {
        return {
            restrict: "A",
            templateUrl: URL_changePhone,
            controller:function($scope){
                $scope.CPM = {};
            },
            link: function (scope) {
                // 更改手机号 - 模态框配置
                scope.changePhoneModal = {
                    mId: 'CPM',
                    title: scope.CPM_title,
                    autoClose: false,
                    showCancel: true,
                    modalSize: 'normal',
                    showHeader: true,
                    showFooter: false,
                    showClose: true,
                    okHandler: function (modal, $ele) {},
                    cancelHandler: function (modal, $ele) {},
                    beforeRender: function ($ele) {return $ele;}
                };

                scope.CPF1 = {
                    step: '1'
                };

                // 监听隐藏模态框事件 - 恢复表单初始化
                scope.$on('hidden.bs.modal#CPM', function () {
                    scope.CPF1.step = 1;
                    scope.CPF1.code = '';
                    scope.CPF1.phoneCode = '';
                    scope.CPF1.codeError.show = false;
                    scope.CPF1.codeError.error = false;
                    scope.CPF1.codeError.timeout = false;
                    scope.CPF2.pone = '';
                    scope.CPF2.code = '';
                    scope.CPF2.phoneCode = '';
                    scope.CPF1.enabledSend = false;
                    scope.CPF2.enabledSend = false;
                    $interval.cancel(g_CPF1_timer);
                    $interval.cancel(g_CPF2_timer);
                    scope.CPM.changePhoneForm1.$setPristine();
                    scope.CPM.changePhoneForm1.$setUntouched();
                    scope.CPM.changePhoneForm2.$setPristine();
                    scope.CPM.changePhoneForm2.$setUntouched();
                });

                // 发送手机验证码
                var g_CPF1_timer = null;
                scope.CPF1.codeError = {
                    show: false,
                    error: false,
                    timeout: false
                };
                scope.CPF1.sendPhoneCode = function (code, phone) {

                    scope.CPF1.codeError.show = false;
                    scope.CPF1.codeError.error = false;
                    scope.CPF1.codeError.timeout = false;

                    Ser.getPhoneCode(code, phone).success(function (data) {
                        if (data.code==0) {

                            $alert.msgDialogSuccess(scope.phone_code);

                            scope.CPF1.enabledSend = true;
                            scope.CPF1.enabledSendCounter = 90;

                            g_CPF1_timer = $interval(function () {
                                --scope.CPF1.enabledSendCounter;
                                if (scope.CPF1.enabledSendCounter <= 0) {
                                    $interval.cancel(g_CPF1_timer);
                                    scope.CPF1.enabledSend = false;
                                }
                            }, 1000);

                        } else if (data.retCode==-1 && data.reason=='time out') {
                            scope.CPF1.codeError.show = true;
                            scope.CPF1.codeError.error = false;
                            scope.CPF1.codeError.timeout = true;
                        } else if (data.retCode==-1 && data.reason=='mismatch') {
                            scope.CPF1.codeError.show = true;
                            scope.CPF1.codeError.error = true;
                            scope.CPF1.codeError.timeout = false;
                        } else {
                            $alert.msgDialogError(data.message);
                        }
                    });
                };
                // 下一步操作
                scope.CPF1.next = function () {
                    var sendData = {
                        name: scope.IMFData.username,
                        phone: scope.IMFData.phone,
                        checkCode: scope.CPF1.phoneCode
                    };
                    Ser.validOldPhone(sendData).success(function (data) {
                        if (data.code == 0) {
                            $alert.msgDialogSuccess(data.message);
                            scope.CPF1.step = '2';
                            scope.getPin(scope.CPF2);
                        } else {
                            $alert.msgDialogError(data.message);
                        }
                    });
                };

                scope.CPF2 = {};
                // 手机 - 香港/大陆 正则
                if (window.location.host === 'oasishk.h3c.com') {
                    scope.CPF2.telReg = /^([1|6|9])(\d{10}|\d{7})$/;
                } else {
                    scope.CPF2.telReg = /^(\+86|0086)?\s*1[34578]\d{9}$/;
                }
                // 发送手机验证码
                var g_CPF2_timer = null;
                scope.CPF2.codeError = {
                    show: false,
                    error: false,
                    timeout: false
                };
                scope.CPF2.sendPhoneCode = function (code, phone) {

                    scope.CPF2.codeError.show = false;
                    scope.CPF2.codeError.error = false;
                    scope.CPF2.codeError.timeout = false;

                    Ser.getPhoneCode(code, phone).success(function (data) {
                        if (data.code==0) {
                            $alert.msgDialogSuccess(scope.phone_code);

                            scope.CPF2.enabledSend = true;
                            scope.CPF2.enabledSendCounter = 90;

                            g_CPF2_timer = $interval(function () {
                                --scope.CPF2.enabledSendCounter;
                                if (scope.CPF2.enabledSendCounter <= 0) {
                                    $interval.cancel(g_CPF2_timer);
                                    scope.CPF2.enabledSend = false;
                                }
                            }, 1000);
                        } else if (data.retCode==-1 && data.reason=='time out') {
                            scope.CPF2.codeError.show = true;
                            scope.CPF2.codeError.error = false;
                            scope.CPF2.codeError.timeout = true;
                        } else if (data.retCode==-1 && data.reason=='mismatch') {
                            scope.CPF2.codeError.show = true;
                            scope.CPF2.codeError.error = true;
                            scope.CPF2.codeError.timeout = false;

                        } else if (data.code==1) {
                            $alert.msgDialogError(data.message);
                        }
                    });
                };
                // 确定操作
                scope.CPF2.submit = function () {
                    var sendData = {
                        name: scope.IMFData.username,
                        phone: scope.CPF2.phone,
                        checkCode: scope.CPF2.phoneCode
                    };
                    Ser.bindPhone(sendData).success(function (data) {
                        if (data.code == 0) {
                            scope.$broadcast('hide#CPM');
                            scope.IMFData.phone = scope.CPF2.phone;
                            $alert.msgDialogSuccess(data.message);
                        } else {
                            $alert.msgDialogError(data.message);
                        }
                    });
                };
                $('#phoneDisabled').tooltip({
                    template: '<div class="tooltip" role="tooltip">' +
                    '<div class="tooltip-arrow" style="border-top-color: #78cec3;"></div>' +
                    '<div class="tooltip-inner" style="background-color: #78cec3;"></div>' +
                    '</div>',
                    trigger: 'focus'
                }).bind('click', function () {
                    $(this).focus();
                });


            }
        };
    }]);

    app.directive('bindPhone', ['$interval', 'PerfectInfoServices', '$alertService', function ($interval, Ser, $alert) {
        return {
            restrict: "A",
            templateUrl: URL_bindPhone,
            controller:function($scope){
                $scope.BPM = {};
            },
            link: function (scope) {
                // 绑定手机号 - 模态框配置
                scope.bindPhoneModal = {
                    mId: 'BPM',
                    title: scope.BPM_title,
                    autoClose: false,
                    showCancel: true,
                    modalSize: 'normal',
                    showHeader: true,
                    showFooter: false,
                    showClose: true,
                    okHandler: function (modal, $ele) {},
                    cancelHandler: function (modal, $ele) {},
                    beforeRender: function ($ele) {return $ele;}
                };

                scope.BPF = {};

                // 手机 - 香港/大陆 正则
                if (window.location.host === 'oasishk.h3c.com') {
                    scope.BPF.telReg = /^([1|6|9])(\d{10}|\d{7})$/;
                } else {
                    scope.BPF.telReg = /^(\+86|0086)?\s*1[34578]\d{9}$/;
                }

                // 监听隐藏模态框事件 - 恢复表单初始化
                scope.$on('hidden.bs.modal#BPM', function () {
                    scope.BPF.phone = '';
                    scope.BPF.code = '';
                    scope.BPF.phoneCode = '';

                    scope.BPF.codeError.show = false;
                    scope.BPF.codeError.error = false;
                    scope.BPF.codeError.timeout = false;

                    scope.BPF.enabledSend = false;
                    $interval.cancel(g_BPF_timer);

                    scope.BPM.bindPhoneForm.$setPristine();
                    scope.BPM.bindPhoneForm.$setUntouched();
                });

                // 发送手机验证码
                var g_BPF_timer = null;
                scope.BPF.codeError = {
                    show: false,
                    error: false,
                    timeout: false
                };
                scope.BPF.sendPhoneCode = function (code, phone) {

                    scope.BPF.codeError.show = false;
                    scope.BPF.codeError.error = false;
                    scope.BPF.codeError.timeout = false;

                    Ser.getPhoneCode(code, phone).success(function (data) {
                        if (data.code==0) {
                            $alert.msgDialogSuccess(scope.phone_code);

                            scope.BPF.enabledSend = true;
                            scope.BPF.enabledSendCounter = 90;

                            g_BPF_timer = $interval(function () {
                                --scope.BPF.enabledSendCounter;
                                if (scope.BPF.enabledSendCounter <= 0) {
                                    $interval.cancel(g_BPF_timer);
                                    scope.BPF.enabledSend = false;
                                }
                            }, 1000);
                        } else if (data.retCode==-1 && data.reason=='time out') {
                            scope.BPF.codeError.show = true;
                            scope.BPF.codeError.error = false;
                            scope.BPF.codeError.timeout = true;
                        } else if (data.retCode==-1 && data.reason=='mismatch') {
                            scope.BPF.codeError.show = true;
                            scope.BPF.codeError.error = true;
                            scope.BPF.codeError.timeout = false;
                        } else if (data.code==1) {
                            $alert.msgDialogError(data.message);
                        }
                    });
                };

                // 确定操作
                scope.BPF.submit = function () {
                    var sendData = {
                        name: scope.IMFData.username,
                        phone: scope.BPF.phone,
                        checkCode: scope.BPF.phoneCode
                    };
                    Ser.bindPhone(sendData).success(function (data) {
                        if (data.code == 0) {
                            scope.$broadcast('hide#BPM');
                            scope.IMFData.phone = scope.BPF.phone;
                            $alert.msgDialogSuccess(data.message);
                        } else {
                            $alert.msgDialogError(data.message);
                        }
                    });
                };




            }
        };
    }]);

    app.directive('changeEmail', ['PerfectInfoServices', '$alertService', function (Ser, $alert) {
        return {
            restrict: "A",
            templateUrl: URL_changeEmail,
            controller: function ($scope) {
                $scope.CEM = {};
            }
            ,
            link: function (scope) {
                scope.CEF1 = {
                    step: '1'
                };
                // 更换邮箱 - 模态框配置
                scope.changeEmailModal = {
                    mId: 'CEM',
                    title: scope.CEM_title,
                    autoClose: false,
                    showCancel: true,
                    modalSize: 'normal',
                    showHeader: true,
                    showFooter: false,
                    showClose: true,
                    okHandler: function (modal, $ele) {
                    },
                    cancelHandler: function (modal, $ele) {
                    },
                    beforeRender: function ($ele) {
                        return $ele;
                    }
                };
                // 监听隐藏模态框事件 - 恢复表单初始化
                scope.$on('hidden.bs.modal#CEM', function () {
                    scope.CEF1.step = '1';

                    scope.CEF1.email = '';
                    scope.CEF2.email = '';

                    scope.CEM.changeEmailForm1.$setPristine();
                    scope.CEM.changeEmailForm1.$setUntouched();
                    scope.CEM.changeEmailForm2.$setPristine();
                    scope.CEM.changeEmailForm2.$setUntouched();
                });
                // 第一步 - 下一步操作
                scope.CEF1.next = function () {
                    var sendData = {
                        name: scope.IMFData.username,
                        email: scope.IMFData.email
                    };
                    Ser.changeEmail(sendData).success(function (data) {
                        if (data.code==0) {
                            $alert.msgDialogSuccess(scope.CEM_1_validaEmail);
                            scope.CEF1.step = '2';
                        } else {
                            $alert.msgDialogError(data.message);
                        }
                    });
                };
                // 第二步 - 确认操作
                scope.CEF2 = {};
                scope.CEF2.submit = function () {
                    var sendData = {
                        name: scope.IMFData.username,
                        email: scope.CEF2.email
                    };
                    Ser.bindEmail(sendData).success(function (data) {
                        if (data.code==0) {
                            $alert.msgDialogSuccess(scope.CEM_changeSuccess);
                            scope.$broadcast('hide#CEM');
                        } else {
                            $alert.msgDialogError(scope.CEM_changeFail);
                        }
                    });
                };





            }
        };
    }]);

    app.directive('bindEmail', ['PerfectInfoServices', '$alertService', function (Ser, $alert) {
        return {
            restrict: "A",
            templateUrl: URL_bindEmail,
            controller: function ($scope) {
                $scope.BEM = {};
            }
            ,
            link: function (scope) {

                // 绑定邮箱 - 模态框配置
                scope.bindEmailModal = {
                    mId: 'BEM',
                    title: scope.BEM_title,
                    autoClose: false,
                    showCancel: true,
                    modalSize: 'normal',
                    showHeader: true,
                    showFooter: false,
                    showClose: true,
                    okHandler: function (modal, $ele) {
                    },
                    cancelHandler: function (modal, $ele) {
                    },
                    beforeRender: function ($ele) {
                        return $ele;
                    }
                };
                // 监听隐藏模态框事件 - 恢复表单初始化
                scope.$on('hidden.bs.modal#BEM', function () {
                    scope.BEF.email = '';
                    scope.BEM.bindEmailForm.$setPristine();
                    scope.BEM.bindEmailForm.$setUntouched();
                });
                // 确认操作
                scope.BEF = {};
                scope.BEF.submit = function () {
                    var sendData = {
                        name: scope.IMFData.username,
                        email: scope.BEF.email
                    };
                    Ser.bindEmail(sendData).success(function (data) {
                        if (data.code==0) {
                            $alert.msgDialogSuccess(scope.BEM_bindSuccess);
                            scope.$broadcast('hide#BEM');
                        } else {
                            $alert.msgDialogError(data.message);
                        }
                    });
                };





            }
        };
    }]);

});