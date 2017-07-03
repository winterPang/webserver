var uploadApp = angular.module('uploadApp', ['ngResource']);
var o2oPathName = "/v3/ace/oasis/auth-data/o2oportal/";
uploadApp.controller('UploaderController', ['$scope','$http','$window',
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
                $scope.prompt = "请选择上传图片";
                return;
            }else{
                $scope.prompt = " ";
            };
            if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
                $scope.prompt = "图片限于bmp,png,gif,jpeg,jpg格式";
                return;
            }else{
                $scope.prompt = " ";
            };
            var file_size = file.size;
            var size = file_size / 1024;
            if (size > 1024) {
                $scope.prompt = "上传的文件大小不能超过1MB";
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

