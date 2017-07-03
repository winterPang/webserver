define(['angularAMD', 'utils', 'css!./frame/component/layout/less/layout'], function (_angularAMD, _utils) {
	'use strict';

	var _angularAMD2 = _interopRequireDefault(_angularAMD);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var _drawOsHeaderDom = function _drawOsHeaderDom($scope, $element, $attr, $state) {
		//$scope.$eval($attr.bgnone);
		if ($attr.bgnone == "" || $attr.bgnone) $element.addClass("no-background");
		if ($attr.ostitle) {
			var title = $attr.ostitle;
			var titleTemp = '<span class="title">' + title + '</span>';
			$element.prepend(titleTemp);
		}
		if ($attr.linkdetail) {
			var linkState = $attr.linkdetail;
			var href = $state.href(linkState);
			if (!href) {
				console.warn('linkdatail param not exist');
			}
			var linkdetailTemp = '<a class=" link-detail" ui-sref=' + linkState + ' \n\t\thref=' + href + ' title="\u66F4\u591A"><i class="fa fa-list-ul pull-right"></i></a>';
			$element.append(linkdetailTemp);
		}
		//if($attr.type && $attr.type == "bar") $element.addClass('header-bar');
	};
	//import 'sprintf';


	_angularAMD2.default.directive('oasisBoxHeader', ['$state', function ($state) {
		// body...
		return {
			restrict: 'E',
			// scope:{},
			template: '<div class="oasis-box-header box-header" ng-transclude></div>',
			replace: true,
			//priority:48,
			transclude: true,
			link: function link($scope, $element, $attr, controller) {
				// body...
				//debugger
				_drawOsHeaderDom($scope, $element, $attr, $state);
			}
		};
	}]);
});
//# sourceMappingURL=oasis-box-header.js.map
