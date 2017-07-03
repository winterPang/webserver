define([], function () {
    'use strict';

    define(['jquery', 'app'], function ($, app) {
        app.directive('difCheck', function () {
            return {
                require: 'ngModel',
                link: function link(scope, elem, attrs, ctrl) {
                    var firstPassword = '#' + attrs.difCheck;
                    // 网上好多例子都掉了$(elem) 美元符号和括号
                    $(elem).add(firstPassword).on('keyup', function () {
                        scope.$apply(function () {
                            var v = elem.val() != $(firstPassword).val();
                            ctrl.$setValidity('difCheck', v);
                        });
                    });
                }
            };
        });
    });
});
//# sourceMappingURL=changepwd.js.map
