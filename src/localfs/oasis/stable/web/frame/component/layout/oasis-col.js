define(['angularAMD', 'utils', 'css!./frame/component/layout/less/layout'], function (_angularAMD, _utils) {
		'use strict';

		var _angularAMD2 = _interopRequireDefault(_angularAMD);

		var _utils2 = _interopRequireDefault(_utils);

		function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : {
						default: obj
				};
		}

		_angularAMD2.default.directive('oasisCol', [function () {
				// body...
				return {
						restrict: 'E',
						scope: {},
						template: '<div class="oasis-col" ng-transclude></div>',
						replace: true,
						priority: 50,
						transclude: true,
						link: function link($scope, $element, attr, controller) {
								// body...
								//debugger
								if (attr.md) $element.addClass("col-md-" + attr.md);
								if (attr.xs) $element.addClass("col-xs-" + attr.xs);
								if (attr.sm) $element.addClass("col-sm-" + attr.sm);
								if (attr.lg) $element.addClass("col-lg-" + attr.lg);
								// if(attr.border) $element.css({
								// 	'border':attr.border+"px solid #e7e7e9"
								// });
						}
				};
		}]);
});
//# sourceMappingURL=oasis-col.js.map
