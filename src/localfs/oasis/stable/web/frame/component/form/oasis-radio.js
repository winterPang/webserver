define(['angularAMD', 'utils', 'css!./frame/component/form/less/form'], function (_angularAMD, _utils) {
    'use strict';

    var _angularAMD2 = _interopRequireDefault(_angularAMD);

    var _utils2 = _interopRequireDefault(_utils);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    _angularAMD2.default.directive('oasisRadio', [function () {
        // let _osRadio = [];
        return {
            restrict: 'E',
            scope: {
                osModel: '=',
                osDisabled: '='
            },
            template: '<div class="oasis-radio"><label class="unchecked"></label><label ng-transclude></label></div>',
            replace: true,
            transclude: true,
            controller: function controller($scope, $element, $attrs, $transclude) {},
            link: function link($scope, $element, $attr, controller) {
                var $ele = $($element.find("label")[0]);
                $scope.$watch("osModel", function (v) {
                    if (v == $attr.value) {
                        $ele.removeClass("unchecked").addClass("checked");
                    } else {
                        $ele.removeClass("checked").addClass("unchecked");
                    }
                });
                $scope.$watch("osDisabled", function (v) {
                    if (v) {
                        $ele.unbind("click");
                        $ele.addClass("disabled");
                    } else {
                        $ele.unbind("click").bind("click", function () {
                            $scope.$apply(function () {
                                $scope.osModel = $attr.value;
                            });
                        });
                        $ele.removeClass("disabled");
                    }
                }, true);
            }
        };
    }]);
});
//# sourceMappingURL=oasis-radio.js.map
