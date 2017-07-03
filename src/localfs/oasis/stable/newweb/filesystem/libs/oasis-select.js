define(["angularAMD", "css!filesystem/css/select"], function (_angularAMD) {
    "use strict";

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
        <label ng-bind="osLabel" for="{{id}}" ng-style="labelStyle"></label>\
        <div class="dropdown">\
        <input class="form-control" id="{{id}}" placeholder="{{holder}}" type="text" ng-model="text" readonly ng-style="inputStyle" data-toggle="dropdown" ng-disabled="osDisabled"/>\
        <div class="dropdown-menu" ng-style="inputStyle">\
        <div class="search-box" ng-show="search"><input class="form-control" ng-model="searchText"></div>\
        <ul class="list-group" ng-style="panelStyle">\
        <li class="list-group-item" ng-class="{active:(osModel===(keyField===\'$all\'?item:item[keyField]))}" ng-repeat="item in data | filter:searchText" ng-click="setValue(keyField===\'$all\'?item:item[keyField],item[textField],item)" ng-bind="item[textField]"></li>\
        </ul>\
        </div>\
        </div>\
        </div>',
            link: function link(scope, ele, attr) {

                scope.trigger = attr.osTrigger || null;

                scope.id = Math.random().toString(16).substr(2) + '_spinner';
                if (attr.osModel === undefined) {
                    throw new Error('oasis-select应该有一个os-model属性');
                }
                scope.search = attr.osSearch === undefined ? true : attr.osSearch === 'true';
                scope.data = attr.osData ? scope.osData : [];
                scope.holder = attr.placeholder || '';
                scope.keyField = attr.osKey || 'id';
                scope.textField = attr.osText || 'name';

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
                };
                if (scope.trigger) {
                    $timeout(function () {
                        $(scope.trigger).off('click').on('click', function (e) {
                            $(ele).find('.dropdown-menu').dropdown('toggle');
                            e.preventDefault();
                            e.stopPropagation();
                        });
                    });
                }
            }
        };
    };
    // 导入样式


    _angularAMD2.default.directive('oasisSelect', ['$timeout', factory]);
});
//# sourceMappingURL=oasis-select.js.map
