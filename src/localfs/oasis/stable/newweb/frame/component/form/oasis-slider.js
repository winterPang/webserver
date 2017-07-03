define(['angularAMD', 'bootstrapSlider', 'css!bootstrap_slider_css', 'css!frame/component/form/less/slider'], function (_angularAMD) {
  'use strict';

  var _angularAMD2 = _interopRequireDefault(_angularAMD);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // 导入样式
  var factory = function factory($timeout) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        osModel: '=',
        osDisabled: '=',
        osLabel: '@'
      },
      template: '<div class="oasis-slider" ng-class="{disabled:osDisabled}">\
        <label ng-bind="osLabel" for="{{id}}" ng-style="labelStyle"></label>\
        <input ng-model="osModel" type="text" id="{{id}}" ng-style="inputStyle" ng-disabled="osDisabled">\
        </div>',
      link: function link(scope, ele, attr) {
        scope.id = Math.random().toString(16).substr(2) + '_slider';
        if (attr.osModel === undefined) {
          throw new Error('oasis-slider应该有一个os-model属性');
        }

        scope.labelStyle = {
          width: attr.labelwidth ? attr.labelwidth + 'px' : '80px'
        };

        scope.inputStyle = {
          width: attr.sliderwidth ? attr.sliderwidth + 'px' : '200px'
        };

        var min = attr.osMin === undefined ? 0 : attr.osMin;
        var max = attr.osMax === undefined ? 10 : attr.osMax;
        var step = attr.osStep || 1;
        var value = scope.osModel || 0;
        var tooltip = attr.osShowTip === undefined ? true : attr.osShowTip;

        $timeout(function () {
          $('#' + scope.id).slider({ min: min, max: max, step: step, value: value, tooltip: tooltip });
        });
      }
    };
  };

  _angularAMD2.default.directive('oasisSlider', ['$timeout', factory]);
});
//# sourceMappingURL=oasis-slider.js.map
