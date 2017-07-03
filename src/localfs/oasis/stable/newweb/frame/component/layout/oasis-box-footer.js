define(['angularAMD', 'utils', 'css!./frame/component/layout/less/layout'], function (_angularAMD, _utils) {
		'use strict';

		var _angularAMD2 = _interopRequireDefault(_angularAMD);

		var _utils2 = _interopRequireDefault(_utils);

		function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : {
						default: obj
				};
		}

		_angularAMD2.default.directive('oasisBoxFooter', [function () {
				// body...
				return {
						restrict: 'E',
						scope: {},
						template: '<div class="oasis-box-footer box-bottom" ng-transclude></div>',
						replace: true,
						priority: 48,
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
								// body...
								// debugger

						}
				};
		}]);
});
//# sourceMappingURL=oasis-box-footer.js.map
