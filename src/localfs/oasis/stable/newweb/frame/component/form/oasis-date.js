define(['angularAMD', 'utils', 'bootstrapDatepicker', 'bootstrapDatepickerCN', 'css!frame/libs/bootstrap-datepicker/css/bootstrap-datepicker.css', 'css!frame/component/form/less/date'], function (_angularAMD, _utils) {
  'use strict';

  var _angularAMD2 = _interopRequireDefault(_angularAMD);

  var _utils2 = _interopRequireDefault(_utils);

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
      template: '<div class="oasis-date" ng-class="{disabled:osDisabled}">\
        <label ng-bind="osLabel" for="{{id}}" ng-style="labelStyle"></label>\
        <input ng-model="osModel" type="text" readonly placeholder="{{holder}}" class="form-control" id="{{id}}" ng-style="inputStyle" ng-disabled="osDisabled">\
        </div>',
      link: function link(scope, ele, attr) {

        var format = attr.osFormat || 'yyyy-mm-dd';
        var startDate = attr.osStartDate || -Infinity;
        var endDate = attr.osEndDate || Infinity;
        var daysOfWeekDisabled = attr.osDaysOfWeekDisabled || '';
        var daysOfWeekHighlighted = attr.osDaysOfWeekHighlighted || '';
        var clearBtn = attr.osClearBtn === undefined ? true : attr.osClearBtn === 'true';
        var language = _utils2.default.getLang() === 'en' ? 'en-US' : 'zh-CN';

        scope.id = Math.random().toString(16).substr(2) + '_datepicker';
        if (attr.osModel === undefined) {
          throw new Error('oasis-date应该有一个os-model属性');
        }

        scope.holder = attr.placeholder || '';

        scope.labelStyle = {
          width: attr.labelwidth ? attr.labelwidth + 'px' : '80px'
        };

        scope.inputStyle = {
          width: attr.inputwidth ? attr.inputwidth + 'px' : '200px'
        };
        $timeout(function () {
          $('#' + scope.id).datepicker({
            autoclose: true,
            clearBtn: clearBtn,
            format: format,
            startDate: startDate,
            endDate: endDate,
            language: language,
            daysOfWeekDisabled: daysOfWeekDisabled,
            daysOfWeekHighlighted: daysOfWeekHighlighted
          });
        });

        scope.$on('$destroy', function () {
          $('#' + scope.id).datepicker('destroy');
        });
      }
    };
  };

  _angularAMD2.default.directive('oasisDate', ['$timeout', factory]);
});
//# sourceMappingURL=oasis-date.js.map
