var mainApp = angular.module('mainApp', ['angularFileUpload']);
mainApp.controller('common.upload.controller', ['$scope','$http','$window', '$fileUploader',
    function($scope, $http, $window, $fileUploader) {
	
	$scope.getUrlParams = function(paramName) {
        var re = new RegExp("(^|\\?|&)"+ paramName + "=([^&]*)(&|$)",'g');
        re.exec(window.location.href);
        return RegExp.$2;
    }
	
	$scope.uploader = $fileUploader.create({
	    scope: $scope,
	    url: '/o2oui/upload',
	    autoUpload: true,   // 自动开始上传
	    formData: [{'pathName' : $scope.getUrlParams('pathName')}],
	    _transformResponse: function(response){
            if(null != response){
            	var res = angular.fromJson(response);
            	if(null != res){
            		window.opener.refreshImg('images/' + res.model);
            	}
            }
	    }
	});
	
	$scope.clear = function(){
		// clear queue
	    $scope.uploader.clearQueue();
	}
	
}]);