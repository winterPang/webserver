define(['jquery', 'app'], function ($, app) {
    app.directive('ajaxValid', ['$http', function ($http) {

        var DEFAULTS = {
            url: '',
            method: 'post',// 请求方式
            params: {},    //  额外参数
            live: 2,  //  boolean/number  可以是数字。如果是数字就是几秒内执行一次
            validFn: function (resp) {
                return !!resp;
            }
        };

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function ($scope, $ele, attr, c) {
                $scope.tid = null;
                if ($scope[attr.ajaxValid]) {
                    var options = $.extend(true, {}, DEFAULTS, $scope[attr.ajaxValid]);
                    // 缓存参数模板
                    var params = options.params;
                    var url = options.url;
                    options.params = {};
                    $ele.bind('blur', function () {
                        $scope.$apply(function () {
                            validate();
                        });
                    });

                    function validate(m) {
                        m = m || c.$viewValue;
                        if(m==''||m===undefined){
                            return;
                        }
                        $.each(params, function (k, v) {
                            options.params[k] = v.replace('{value}', m);
                        });
                        options.url = url.replace('{value}', m);
                        var request = {};
                        if (options.method == 'post') {
                            request = $http.post(options.url, JSON.stringify(options.params), {"Content-Type": "application/json",validate:true});
                        } else if (options.method == 'get') {
                            request = $http.get(options.url + '?' + $.param(options.params),{validate:true});
                        }
                        request.success(function (data) {
                            var result = options.validFn(data);
                            if (typeof result == 'boolean') {
                                c.$setValidity('ajaxValid', result);
                                if (result) {
                                    for (var i = 0; i <= 10; i++) {
                                        c.$setValidity('ajaxValid-' + i, true);
                                    }
                                }
                            } else if (typeof result == 'number') {  // 如果是code码
                                c.$setValidity('ajaxValid-' + result, false);
                            }
                        }).error(function (data) {
                            c.$setValidity('ajaxValid', options.validFn(data));
                        });
                    }

                    $scope.$watch(attr.ngModel, function (m) {
                        var options = $.extend(true, {}, DEFAULTS, $scope[attr.ajaxValid]);
                        if (typeof options.live == 'boolean') {
                            options.live && validate(m);
                        } else if (typeof options.live == 'number') {
                            clearTimeout($scope.tid);
                            $scope.tid = setTimeout(function () {
                                validate(m);
                            }, options.live * 1000);
                        }
                    });
                }
            }
        };
    }]);
});