angular.module("myApp", []).controller('myCtr', ['$scope', function ($scope) {
    $scope.flags = {
        cur_conf: 'baseconf'
    };
    $scope.evts = {
        retMould: function () {
            window.open('https://' + location.hostname + '/oasis/stable/newweb/frame/index.html#/global/tool/batchconf');
        }
    };
    $('[class="nav navbar-nav"]').delegate('li', 'click', function () {
        var me = this;
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass('active');
        $scope.$apply(function () {
            $scope.flags.cur_conf = $(me).attr('name');
        });
    });
}]);