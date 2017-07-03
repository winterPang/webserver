define(['angularAMD', 'utils', 'css!./frame/component/menu/less/template'], function (_angularAMD, _utils) {
  'use strict';

  var _angularAMD2 = _interopRequireDefault(_angularAMD);

  var _utils2 = _interopRequireDefault(_utils);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _angularAMD2.default.directive('oasisMenu', [function () {
    console.log(11111);
    var TemplateUrl = '../frame/component/menu/template.html';
    var Default = {
      type: 'vertical',
      animation: 500
    };
    function renderMenu($scope, options) {
      $scope.data = options.data;
      $scope.menuType = options.type;
      var animation = options.animation;
      $scope.targatMenu = function (event) {
        //debugger
        var currentEle = $(angular.element(event.currentTarget));
        var nextEle = currentEle.next();
        // $(".oasis-link").remove();
        // if (currentEle.children(".oasis-link").length === 0) {
        //      currentEle.prepend("<sapn class='oasis-link'></span>");
        // }
        // ink = currentEle.find(".oasis-link");
        // ink.removeClass("animate-ink");
        // if (!ink.height() && !ink.width()) {
        //      d = Math.max(currentEle.outerWidth(), currentEle.outerHeight());
        //     ink.css({
        //           height: d,
        //           width: d
        //       })
        // }
        // x = event.pageX -currentEle.offset().left - ink.width() / 2;
        // y = event.pageY - currentEle.offset().top - ink.height() / 2;
        // ink.css({
        //       top: x + 'px',
        //       left: y + 'px'
        // }).addClass("animate-ink")
        //currentEle.prepend("<sapn class='oasis-link'></span>");
        if (nextEle.is('ul') && nextEle.is(':visible')) {
          var otherVisible = nextEle.find('ul:visible');
          otherVisible.slideUp(animation).removeClass('menu-open');
          nextEle.slideUp(animation).removeClass('menu-open');
        } else if (!nextEle.is(':visible')) {
          var parent = currentEle.parents('ul').first();
          var ul = parent.find('ul:visible');
          ul.slideUp(animation).removeClass('menu-open');
          nextEle.slideDown(animation).addClass('menu-open');
        }
      };
    }
    return {
      restrict: 'EA',
      scope: {
        options: '=opts'
      },
      templateUrl: TemplateUrl,
      replace: true,
      controller: function controller($scope, $element) {
        //debugger
      },
      link: function link($scope, $element, attr, controller) {
        //   debugger
        if (!($element instanceof jQuery)) {
          $element = $($element);
        }
        if (attr.width) $element.css({
          width: attr.width + "px"
        });
        if (attr.bgcolor) $element.css({
          'background-color': attr.bgcolor
        });
        $scope.$watch('options', function (options) {
          options = $.extend({}, Default, options);
          if (options.data) {
            renderMenu($scope, options);
          }
        });
      }
    };
  }]);
});
//# sourceMappingURL=oasis-menu.js.map
