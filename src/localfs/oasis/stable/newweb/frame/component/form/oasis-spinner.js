define(['angularAMD', 'css!frame/component/form/less/spinner'], function (_angularAMD) {
  'use strict';

  var _angularAMD2 = _interopRequireDefault(_angularAMD);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var numRegex = /^[0-9]*$/;
  // 导入样式


  var factory = function factory() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        osModel: '=',
        osDisabled: '=',
        osLabel: '@'
      },
      template: '<div class="oasis-spinner" ng-class="{disabled:osDisabled}">\
        <label ng-bind="osLabel" for="{{id}}" ng-style="labelStyle"></label>\
        <button class="btn btn-left" ng-click="minus()" ng-disabled="osModel<=min || osDisabled">-</button>\
        <input ng-model="osModel" class="form-control" ng-blur="checkNum" type="text" ng-blur="checkRange()" id="{{id}}" ng-style="inputStyle" ng-disabled="osDisabled">\
        <button class="btn btn-right" ng-click="plus()" ng-disabled="osModel>=max || osDisabled">+</button>\
        </div>',
      link: function link(scope, ele, attr) {
        scope.id = Math.random().toString(16).substr(2) + '_spinner';
        scope.max = Infinity;
        scope.min = -Infinity;
        if (attr.osModel === undefined) {
          throw new Error('oasis-spinner应该有一个os-model属性');
        }

        if (scope.osModel === undefined) {
          scope.osModel = 0;
        }

        if (attr.osMin !== undefined) {
          scope.min = Number(attr.osMin);
        }

        if (attr.osMax !== undefined) {
          scope.max = Number(attr.osMax);
        }

        scope.labelStyle = {
          width: attr.labelwidth ? attr.labelwidth + 'px' : '80px'
        };

        scope.inputStyle = {
          width: attr.inputwidth ? attr.inputwidth + 'px' : '80px'
        };

        scope.plus = function () {
          scope.osModel++;
        };

        scope.minus = function () {
          scope.osModel--;
        };

        scope.$watch('osModel', function (val, old) {
          if (!numRegex.test(val)) {
            scope.osModel = old || 0;
          }
        });

        scope.checkRange = function () {
          if (scope.osModel > scope.max) {
            scope.osModel = scope.max;
          }
          if (scope.osModel < scope.min) {
            scope.osModel = scope.min;
          }
        };
      }
    };
  };

  _angularAMD2.default.directive('oasisSpinner', [factory]);
});
//# sourceMappingURL=oasis-spinner.js.map
