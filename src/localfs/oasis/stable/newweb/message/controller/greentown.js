/**
 * Created by l13643 on 2017/4/10.
 */
define(['../directive/smsmanagement/management',
        '../directive/smsrecord/record',
        '../directive/smsstatus/status'], function () {
    return ['$scope', function ($scope) {
        $scope.curTab = 0;
        $scope.tabSwitch = function (to) {
            $scope.curTabl !== to ? $scope.curTab = to : null;
        }
    }]
});