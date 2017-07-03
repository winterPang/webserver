define(['angularAMD', 'css!frame/component/form/less/select'], function (_angularAMD) {
    'use strict';

    var _angularAMD2 = _interopRequireDefault(_angularAMD);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var factory = function factory($timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                osModel: '=',
                osDisabled: '=',
                osLabel: '@',
                osData: '='
            },
            template: '<div class="oasis-select" ng-class="{disabled:osDisabled}">\
        <label ng-bind="osLabel" for="{{id}}" ng-style="labelStyle" ng-show="!!osLabel"></label>\
        <input role="input" class="form-control" id="{{id}}" placeholder="{{holder}}" type="text" ng-model="text" readonly ng-style="inputStyle" ng-disabled="osDisabled"/>\
        <div class="select-dropdown" ng-style="inputStyle">\
        <div class="search-box" ng-show="search"><input class="form-control" ng-model="searchText"></div>\
        <ul class="list-group" ng-style="panelStyle">\
        <li class="list-group-item" ng-class="{active:(osModel===(keyField===\'$all\'?item:item[keyField]))}" ng-repeat="item in osData | filter:searchText" ng-click="setValue(keyField===\'$all\'?item:item[keyField],item[textField],item)" ng-bind="item[textField]"></li>\
        </ul>\
        </div>\
        </div>',
            link: function link(scope, ele, attr) {

                var $input = $('[role=input]', ele);
                var $panel = $('.select-dropdown', ele);
                var hide = $panel.hide.bind($panel);
                var show = function show() {
                    var position = $input.position();
                    $panel.css({
                        top: parseFloat(position.top) + 31 + 'px',
                        left: position.left
                    }).show();
                };

                scope.trigger = attr.osTrigger || null;

                scope.id = Math.random().toString(16).substr(2) + '_select';
                if (attr.osModel === undefined) {
                    throw new Error('oasis-select应该有一个os-model属性');
                }
                scope.search = attr.osSearch === undefined ? true : attr.osSearch === 'true';
                scope.holder = attr.placeholder || '';
                scope.keyField = attr.osKey || 'id';
                scope.textField = attr.osText || 'name';

                scope.$watch('osData', function (d) {
                    //  检查没有数据的时候讲选择的清空了
                    if (d && d.length === 1) {
                        scope.setValue(d[0][scope.keyField], d[0][scope.textField]);
                    } else {
                        scope.setValue('', '');
                    }
                });

                scope.labelStyle = {
                    width: attr.labelwidth ? attr.labelwidth + 'px' : '80px'
                };

                scope.inputStyle = {
                    width: attr.inputwidth ? attr.inputwidth + 'px' : '200px'
                };

                scope.panelStyle = {
                    maxHeight: attr.panelMaxHeight ? attr.panelMaxHeight + 'px' : '200px'
                };

                scope.setValue = function (id, name, item) {
                    scope.osModel = id;
                    scope.text = name;
                    hide();
                };
                if (scope.trigger) {
                    $timeout(function () {
                        $(scope.trigger).off('click').on('click', function (e) {
                            show();
                            e.preventDefault();
                            e.stopPropagation();
                        });
                    });
                }

                // 事件处理
                $input.off('focus click').on('focus click', show);

                function hideByOuter(e) {
                    if (!($(ele).find(e.target).length || $(ele).is(e.target))) {
                        hide();
                        e.stopPropagation();
                    }
                }

                $(document).off('click', hideByOuter).on('click', hideByOuter);
            }
        };
    };
    // 导入样式


    _angularAMD2.default.directive('oasisSelect', ['$timeout', factory]);
});
//# sourceMappingURL=oasis-select.js.map
