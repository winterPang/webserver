define(['angularAMD', 'utils', 'css!./frame/component/layout/less/layout'], function (_angularAMD, _utils) {
		'use strict';

		var _angularAMD2 = _interopRequireDefault(_angularAMD);

		var _utils2 = _interopRequireDefault(_utils);

		function _interopRequireDefault(obj) {
				return obj && obj.__esModule ? obj : {
						default: obj
				};
		}

		_angularAMD2.default.directive('oasisBox', [function () {
				// body...
				return {
						restrict: 'E',
						// scope:{},
						template: '<div  class="oasis-box" ng-transclude></div>',
						replace: true,
						priority: 48,
						transclude: true,
						require: ['oasisBoxHeader', 'oasisBoxBody', 'oasisBoxFooter'],
						controller: function controller($scope, $element, $attrs, $transclude) {}

				};
		}]);
});
//# sourceMappingURL=oasis-box.js.map
