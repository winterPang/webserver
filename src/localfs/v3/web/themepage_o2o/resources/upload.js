var uploadApp = angular.module('uploadApp', ['ngResource']);
var o2oPathName = "/v3/ace/oasis/auth-data/o2oportal/";
uploadApp.controller('UploaderController', [
    '$scope',
    '$http',
    '$window',
    function($scope, $http, $window) {
        $scope.save = function() {
            var fd = new FormData();
            var file = document.querySelector('input[type=file]').files[0];
            fd.append("logo",file);
            $http({
                    method: 'POST',
                    url: o2oPathName + "themetemplate/upload",
                    data: fd,
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                }).success(function(data) {
                    //上传成功的操作
                    if (data.errorcode == "0") {
                        window.opener.refreshImg(data.data);
                        window.close();
                    }
                });
        }
}]);

