define(['angularAMD', 'css!./css/iconfont', 'frame/libs/iconfont/iconfont'], function(app) {
    app.directive('iconfont', function() {
        return {
            restrict: 'E',
            scope: {
                type: '@'
            },
            template: '<svg class="icon" aria-hidden="true"><use xlink:href="{{\'#icon-\'+type}}"></use></svg>',
            replace: true
        };
    });
});