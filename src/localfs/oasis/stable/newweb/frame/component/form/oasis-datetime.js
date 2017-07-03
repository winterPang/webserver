define(['angularAMD', 'utils', 'jquery', 'bootstrapDatetimepicker', 'css!frame/libs/bootstrap-datetimepicker/css/bootstrap-datetimepicker', 'css!frame/component/form/less/datetime'], function (_angularAMD, _utils, _jquery) {
  'use strict';

  var _angularAMD2 = _interopRequireDefault(_angularAMD);

  var _utils2 = _interopRequireDefault(_utils);

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  console.log(_jquery2.default);
  // 在这里初始化时间选择框的国际化

  // 导入样式
  _jquery2.default.fn.datetimepicker.dates.cn = {
    days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    daysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    daysMin: ['日', '一', '二', '三', '四', '五', '六', '日'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthsShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    meridiem: ['上午', '下午'],
    today: '今天',
    clear: '清除'
  };

  var factory = function factory($timeout) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        osModel: '=',
        osDisabled: '=',
        osLabel: '@'
      },
      template: '<div class="oasis-datetime" ng-class="{disabled:osDisabled}">\
        <label ng-bind="osLabel" for="{{id}}" ng-style="labelStyle"></label>\
        <input ng-model="osModel" type="text" readonly placeholder="{{holder}}" class="form-control" id="{{id}}" ng-style="inputStyle" ng-disabled="osDisabled">\
        </div>',
      link: function link(scope, ele, attr) {

        //  config by doc
        var format = attr.osFormat || 'yyyy-mm-dd hh:ii';
        var minDate = attr.osMinDate || false;
        var maxDate = attr.osMaxDate || false;
        var startDate = attr.osStartDate || -Infinity;
        var endDate = attr.osEndDate || Infinity;
        var language = _utils2.default.getLang();

        var daysOfWeekDisabled = attr.osDaysOfWeekDisabled || [];
        var viewMode = attr.osViewMode || 'days';
        var showTodayButton = attr.osBtnToday || false;
        var showClear = attr.osBtnClear || false;
        var disabledHours = attr.osDisabledHours || false;

        scope.id = Math.random().toString(16).substr(2) + '_datetimepicker';
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
          (0, _jquery2.default)('#' + scope.id).datetimepicker({
            format: format,
            minDate: minDate,
            maxDate: maxDate,
            startDate: startDate,
            endDate: endDate,
            daysOfWeekDisabled: daysOfWeekDisabled,
            viewMode: viewMode,
            showTodayButton: showTodayButton,
            showClear: showClear,
            disabledHours: disabledHours,
            language: language,
            autoclose: true,
            allowInputToggle: true
          });
        });

        scope.$on('$destroy', function () {
          (0, _jquery2.default)('#' + scope.id).datetimepicker('destroy');
        });
      }
    };
  };

  _angularAMD2.default.directive('oasisDatetime', ['$timeout', factory]);
});
//# sourceMappingURL=oasis-datetime.js.map
