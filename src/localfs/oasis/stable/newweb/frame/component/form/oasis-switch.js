define(['angularAMD', 'css!frame/component/form/less/switch'], function (_angularAMD) {
  'use strict';

  var _angularAMD2 = _interopRequireDefault(_angularAMD);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var factory = function factory() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        osModel: '=',
        osDisabled: '=',
        osLabel: '@'
      },
      template: '<div class="oasis-switch" ng-class="{disabled:osDisabled}">\
        <label ng-bind="osLabel" for="{{id}}" ng-style="labelStyle"></label>\
        <div class="switch-box" ng-style="boxStyle" ng-click="active=!active">\
        <div class="switch-handler" ng-class="{active:active}">\
        <div>{{onText}}<div></div></div>\
        <div>{{offText}}<div></div></div>\
        </div>\
        </div>\
        </div>',
      link: function link(scope, ele, attr) {
        var isParentTrigger = true; // 是否是外部组件传进来的值
        scope.id = Math.random().toString(16).substr(2) + '_switch';
        if (attr.osModel === undefined) {
          throw new Error('oasis-switch应该有一个os-model属性');
        }
        // 参数配置
        scope.onText = attr.osOnText || 'ON';
        scope.offText = attr.osOffText || 'OFF';
        scope.onValue = attr.osOnValue !== undefined ? attr.osOnValue : true;
        scope.offValue = attr.osOffValue !== undefined ? attr.osOffValue : false;

        scope.labelStyle = {
          width: attr.labelwidth ? attr.labelwidth + 'px' : '80px'
        };

        scope.boxStyle = {
          width: attr.osWidth ? attr.osWidth + 'px' : '80px'
        };

        // 外部传递值到里面
        scope.$watch('osModel', function (model) {
          if (isParentTrigger) {
            scope.active = model === scope.offValue;
          }
          isParentTrigger = true;
        });
        // 里面传递值到外面
        scope.$watch('active', function (active) {
          isParentTrigger = false;
          scope.osModel = active ? scope.offValue : scope.onValue;
        });
      }
    };
  };
  // 导入样式


  _angularAMD2.default.directive('oasisSwitch', [factory]);
});
//# sourceMappingURL=oasis-switch.js.map
