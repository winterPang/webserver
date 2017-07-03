define(['angularAMD', 'css!./frame/component/form/less/form'], function (_angularAMD) {
  'use strict';

  var _angularAMD2 = _interopRequireDefault(_angularAMD);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _linkFunc = function _linkFunc($scope, $element, $attr, controller) {
    var $ele = $($element.find('label')[0]);
    $scope.$watch('osModel', function (v) {
      if (v.find(function (n) {
        return n == $attr.value;
      })) {
        $ele.removeClass('unchecked').addClass('checked');
      } else {
        $ele.removeClass('checked').addClass('unchecked');
      }
    }, true);
    $scope.$watch('osDisabled', function (v) {
      if (v) {
        $ele.unbind('click');
        $ele.addClass('disabled');
      } else {
        $ele.unbind('click').bind('click', function () {
          $scope.$apply(function () {
            if ($scope.osModel.find(function (n) {
              return n == $attr.value;
            })) {
              var index = $scope.osModel.findIndex(function (n) {
                return n == $attr.value;
              });
              $scope.osModel.splice(index, 1);
            } else {
              $scope.osModel.push($attr.value);
            }
            //$scope.osModel = $attr.value;
          });
        });
        $ele.removeClass('disabled');
      }
    }, true);
  };

  _angularAMD2.default.directive('oasisCheckbox', [function () {
    return {
      restrict: 'E',
      scope: {
        osModel: '=',
        osDisabled: '='
      },
      template: '<div class="oasis-checkbox"><label class="unchecked"></label><label ng-transclude></label></div>',
      replace: true,
      transclude: true,
      controller: function controller($scope, $element, $attrs, $transclude) {},
      link: function link($scope, $element, $attr, controller) {
        _linkFunc($scope, $element, $attr, controller);
      }
    };
  }]);
});
//# sourceMappingURL=oasis-checkbox.js.map
