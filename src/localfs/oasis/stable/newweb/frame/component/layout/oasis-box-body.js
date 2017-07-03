define(['angularAMD', 'utils', 'css!./frame/component/layout/less/layout'], function (_angularAMD, _utils) {
    'use strict';

    var _angularAMD2 = _interopRequireDefault(_angularAMD);

    var _utils2 = _interopRequireDefault(_utils);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var drawOsBoxBody = function drawOsBoxBody($scope, $element, $attr) {
        if ($attr.height) $element.css({ 'height': $attr.height + "px" });
        if ($attr.heightAuto == "" || typeof $attr.heightAuto == 'boolean' && $attr.heightAuto) {
            $element.addClass('no-height');
        }
        if ($attr.type && $attr.type == "echart") $element.addClass("echart-box").addClass('echart-height');
    };

    _angularAMD2.default.directive('oasisBoxBody', [function () {
        // body...
        return {
            restrict: 'E',
            scope: {},
            template: '<div class="oasis-box-body box-body" ng-transclude></div>',
            replace: true,
            //priority: 48,
            transclude: true,
            controller: function controller($scope, $element, $attrs, $transclude) {
                //debugger
                // $transclude($scope,function (clone) {              
                //     //  debugger
                //       var header = $(".box-footer",$element);
                //       var body = $(".box-body",$element)
                //       header.append($('div[name="header"]',$(clone)))
                //       body.append($('div[name="body"]',$(clone)))
                //    });
            },
            link: function link($scope, $element, $attr, controller) {
                //body...组件封装最优方案DOM操作在link函数中完成
                drawOsBoxBody($scope, $element, $attr);
            }
        };
    }]);
});
//# sourceMappingURL=oasis-box-body.js.map
