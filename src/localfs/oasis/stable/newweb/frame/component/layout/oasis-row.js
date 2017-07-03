define(['angularAMD', 'utils', 'css!./frame/component/layout/less/layout'], function (_angularAMD, _utils) {
		'use strict';

		var _angularAMD2 = _interopRequireDefault(_angularAMD);

		var _utils2 = _interopRequireDefault(_utils);

		function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : {
						default: obj
				};
		}

		_angularAMD2.default.directive('oasisRow', [function () {
				// body...
				return {
						restrict: 'E',
						scope: {},
						template: '<div class="oasis-row" ng-transclude></div>',
						replace: true,
						priority: 49,
						transclude: true,
						link: function link($scope, $element, attr, controller) {
								// body...
								// if(attr.gutter) $element.css({
								// 	'padding-left':attr.gutter+"px",
								// 	'padding-right':attr.gutter+"px",
								//  })
						}
				};
		}]);
});
//# sourceMappingURL=oasis-row.js.map
