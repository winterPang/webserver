var uploadApp = angular.module('uploadEnApp', ['ngResource']);
var o2oPathName = "/v3/ace/oasis/auth-data/o2oportal/";
uploadApp.controller('UploaderEnController', ['$scope','$http','$window',
    function($scope, $http, $window) {
        $scope.prompt = " ";
        $scope.save = function() {
            var fd = new FormData();
            // var file = document.querySelector('input[type=file]').files[0];
            var file = $(':file')[0].files[0];
            var file_l = $(':file').val();
            var extStart = file_l.lastIndexOf(".");
            var ext = file_l.substring(extStart, file_l.length).toUpperCase();
            if (!ext) {
                $scope.prompt = "Please select a picture to be uploaded";
                return;
            }else{
                $scope.prompt = " ";
            };
            if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
                $scope.prompt = "Valid picture formats include BMP,PNG,GIF,JPEG,JPG";
                return;
            }else{
                $scope.prompt = " ";
            };
            var file_size = file.size;
            var size = file_size / 1024;
            if (size > 1024) {
                $scope.prompt = "The file size cannot exceed 1 MB";
                return;
            }else{
                $scope.prompt = " ";
            };
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
                        // ImgAdd();
                        window.opener.refreshImg(data.data);
                        window.close();
                    }
                });
        }
}]);

