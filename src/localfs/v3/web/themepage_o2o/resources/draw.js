var mainApp = angular.module('mainApp', ['ngResource']);

mainApp.config(function($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
        var query = '', name = {}, value, fullSubName, subName={}, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '.' + subName;
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});

var o2oPathName = "/v3/ace/oasis/auth-data/o2oportal/";
mainApp.controller('o2oThemeTemplateController', [
    '$scope',
    '$http',
    '$window',
    '$location',
    function($scope, $http, $window, $location) {

    jq('#tabs').find('li.ui-tabs-active ui-state-active').each(function(i){
    	jq(this).removeClass('ui-tabs-active ui-state-active');
	});
    $scope.model = {};
    // 从url后面获取templateId
    $scope.type = jq.getUrlParams('type');
    $scope.templateId = jq.getUrlParams('templateId');
    $scope.tracker = jq.getUrlParams('tracker');
    
    $scope.model.type =  $scope.type;
    $scope.model.templateId = $scope.templateId;
    $scope.model.tracker =  $scope.tracker;
    $scope.cfg="";
    $scope.html="";
    
    // var urlget = "/restapp/o2oportal/themetemplate/preDraw";
    var urlget = o2oPathName + "themetemplate/preDraw";
    $http.get(urlget + '/' + $scope.templateId+'/'+$scope.type, {}).success(function(response) {
		if(response.errorcode==0){
			console.log(response.data);
			
			//$scope.instance = value.data;
			$scope.instance  = response.data;
	    	$scope.subId = $scope.instance.id;
			$scope.cfg = $scope.instance.pageCfg;
			$scope.html = $scope.instance.pageHtml;
	    	pathName = 'themepage/' + $scope.instance.pathName;
	    	
	    	var indexObj = jq("#indexContent");
	    	// 由于页面显示自信息都是乱序，所以通过循环获取记录
	        if($scope.type == $scope.instance.pageType){
	        	indexObj.html($scope.html);
	            indexCtrl = indexObj.phoneControl({
	                // 定制记录时间戳路径
	                imageUploadPath : "images/",
	                jsonCfg : $scope.instance.pageCfg
	            });
	        }
	        indexObj.find("#weixinDiv").css("display","inline-block");
        	indexObj.find("#wxwifiDiv").css("display","inline-block");
        	
	        cfg = JSON.parse($scope.cfg);
	    	jq.each(cfg, function(valueKey, value) {
				jq.each(value, function(valueIndex, adValue) {
					jq('#'+valueKey+ ' img').attr("src", $scope.tracker+'/'+adValue[0]);
				});
			});
		
		}else{
			alert('记录不存在或者网络原因，请联系管理员。');
		}
	});
    
    // 切换tab页
    $scope.changeValue = function(ptype){
    	$scope.type = ptype;
    	var url = $location.$$absUrl.split("?");
    	$window.location.href = url[0] + '?templateId='+ $scope.templateId +'&type='+ptype+'&tracker='+$scope.tracker;
    }

    // 发布文件
    $scope.publishData = function(){
    	
	    if(null != indexCtrl && undefined != indexCtrl){
	    	$scope.model.pageCfg = indexCtrl.getFinalCfg();
	       // base64
	    	$scope.model.pageHtml = encode64(utf16to8(indexCtrl.getFinalHtml()));
	    }
	    var urlpost = o2oPathName + "themetemplate/publish";
	   $http({
           method:'POST',
           url:urlpost,
           headers: {'Content-Type':'application/json'},
           data:JSON.stringify($scope.model),
       }).success(function(response) {
    	   if(response.errorcode==0){
				alert('发布文件成功。');
			}else{
				alert('记录不存在或者网络原因，请联系管理员。');
			}
		}).error(function(response) {
			alert('记录不存在或者网络原因，请联系管理员。error');
		});;
    }

}]);

/**
 * 上传图片
 */
var currImgId;
var canvasImgId;
function uploadImg(canvasId, imgId){
	// 记录当前操作的图片域id
	currImgId = imgId;
	canvasImgId = canvasId;
    openwindow('/v3/web/themepage_o2o/upload.html?pathName='+pathName, 'upload',420,250);
	// openwindow('/v3/ace/oasis/auth-data/restapp/upload/upload.html', 'upload',420,250);
}

// 刷新图片 ,如果是画布需要替换的图片，则图片class必须是canvas_img_replace

function refreshImg(imgName){
	
	var tracker = jq.getUrlParams('tracker');
    // 当前上传图片个数
	if(undefined != canvasImgId && null != canvasImgId){
		jq('#'+canvasImgId).find('.canvas_img_replace')[0].src = tracker+'/'+ imgName;
	}
	if(currImgId != ''){
		jq('#'+currImgId)[0].src = tracker+'/'+imgName;
	}
}

function openwindow(url,name,iWidth,iHeight)
{
	var url; //转向网页的地址;
	var name; //网页名称，可为空;
	var iWidth; //弹出窗口的宽度;
	var iHeight; //弹出窗口的高度;
	//window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
	var iTop = (window.screen.height-30-iHeight)/2; //获得窗口的垂直位置;
	var iLeft = (window.screen.width-10-iWidth)/2; //获得窗口的水平位置;
	window.open(url,name,'height='+iHeight+',,innerHeight='+iHeight+',width='+iWidth+',innerWidth='+iWidth+',top='+iTop+',left='+iLeft+',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
}


