/**
 * 下拉框组件
 */
define(['angularAMD', 'jquery', 'select2'], function (app, $) {
    if (!$ || !$.fn || !$.fn.select2) {
        console.warn('select2组件还没有初始化!');
        return;
    }
    app.directive('select2', function () {
        var defaults = {
            sId: '',
            allowClear: true,
            placeholder: '请选择',
            closeOnSelect: true,
            width: 'resolve',
            data: undefined //  可以是数组，可以是方法，可以是promise
        };
        var methods = ['toggleDropdown', 'open', 'close',
            'isOpen', 'hasFocus', 'focus', 'enable', 'data', 'val',
            'destroy', 'render'];
        var events = ['change', 'select2:close', 'select2:closing', 'select2:open',
            'select2:opening', 'select2:select', 'select2:selecting', 'select2:unselect',
            'select2:unselecting'];
        return {
            restrict: 'EA',
            scope: {
                options: '=select2'
            },
            link: function ($scope, $ele) {
                if (!($ele instanceof jQuery)) {
                    $ele = $($ele);
                }
                $scope.$watch('options', function (options) {
                    if (options) {
                        // 事件方法前缀
                        var evtSuffix = options.sId ? '#' + options.sId : '';
                        // 事件监听
                        $.each(events, function (i, e) {
                            $ele.on(e, function () {
                                var args = Array.prototype.slice.call(arguments, 1);
                                $scope.$emit.apply($scope, [e + evtSuffix].concat(args));
                            });
                        });
                        // 方法执行
                        $.each(methods, function (i, m) {
                            $scope.$on(m + evtSuffix, function (e, p, call) {
                                if (arguments.length == 2 && p instanceof Function) {
                                    p.call($ele, $ele.select2(m));
                                } else if (arguments.length == 3) {
                                    call.call($ele, $ele.select2(m, p));
                                } else {
                                    $ele.select2(m, p);
                                }
                            });
                        });

                        var opts = $.extend(true, {}, defaults, options);
                        var data = opts.data;
                        if (data && $.isFunction(data)) {  //  返回的是数组或者Promise对象可以处理，其他的不处理
                            var rs = data();
                            // 如果返回的Array
                            if ($.isArray(rs)) {
                                opts.data = rs;
                                $ele.select2(opts);
                            } else if (rs && rs.then) {   //   返回的是Promise对象
                                rs.then(function (data) {
                                    opts.data = data;
                                    $ele.select2(opts);
                                }, function () {
                                    opts.data = [];
                                    $ele.select2(opts);
                                });
                            }
                        } else if ($.isArray(data)) {
                            $ele.select2(opts);
                        } else {
                            opts.data = undefined;
                            $ele.select2(opts);
                        }
                    } else {
                        $ele.select2(defaults);
                    }
                });
            }
        };
    });
});