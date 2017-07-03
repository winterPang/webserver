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
                    fullSubName = name + '[' + subName + ']';
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

var pathName;
mainApp.controller('o2oThemeTemplateController', [
    '$scope',
    '$http',
    '$window',
    '$location',
    'O2oThemeTemplate',
    function($scope, $http, $window, $location, O2oThemeTemplate) {

    	jQuery('#tabs').find('li.ui-tabs-active ui-state-active').each(function(i){
    	jQuery(this).removeClass('ui-tabs-active ui-state-active');
	});

    // 从url后面获取templateId
    $scope.type = jQuery.getUrlParams('type');
    $scope.templateId = jQuery.getUrlParams('templateId');
    $scope.ownerId = jQuery.getUrlParams('ownerId');
    O2oThemeTemplate['query']({templateId: $scope.templateId, type : $scope.type}, function(value, responseHeaders) {
    	
    	if(0 != value.errorCode){
    		alert('记录不存在或者网络原因，请联系管理员。');
    		return ;
    	}
    	$scope.instance = value.data;
    	$scope.subId = $scope.instance.id;
    	pathName = $scope.instance.pathName;
    	var indexObj = jQuery("#indexContent");
    	// 由于页面显示自信息都是乱序，所以通过循环获取记录
        if($scope.type == $scope.instance.pageType){
        	indexObj.html($scope.instance.pageHtml);
        	
        	indexObj.find("#phoneTgudingForm").show();
        	//indexObj.find("#qqDiv").css("display","inline-block").show();
        	indexObj.find("#weixinDiv").css("display","inline-block");
        	indexObj.find("#wxwifiDiv").css("display","inline-block");
        	
            indexCtrl = indexObj.phoneControl({
                // 定制记录时间戳路径
                imageUploadPath : "images/",
                jsonCfg : $scope.instance.pageCfg
            });
        }
    }, function(httpResponse) {
    	alert('记录不存在或者网络原因，请联系管理员。');
    });

    // 切换tab页
    $scope.changeValue = function(ptype){
    	$scope.type = ptype;
    	var url = $location.$$absUrl.split("?");
    	$window.location.href = url[0] + '?templateId='+ $scope.templateId +'&type='+ptype +"&ownerId="+$scope.ownerId;
    }

    // 发布文件
    $scope.publishData = function(){
    	
    	//判断是否
    	
    	var html = '';
    	var cfg = '';
	    if(null != indexCtrl && undefined != indexCtrl){
	    	if(indexCtrl.getFinalHtml().indexOf("resources/images/add.gif") != -1){
	    		alert("请上传图片");
	    		return ;
	    	}
	    	
	       cfg = indexCtrl.getFinalCfg();
	       var imageCfg = JSON.parse(cfg);
	       var imgUpload = false;
	       var flag = false;
	       var timeFlag = false;
			jq.each(imageCfg, function(valueKey, value) {
				jq.each(value, function(valueIndex, adValue) {
					if(adValue[0].indexOf("resources/images/add.gif") != -1){
						imgUpload = true;
					}
					if (adValue.length > 1) {
						href = adValue[3];
						if(href != -1){
							var _url = "^((https|http|ftp|rtsp|mms)?://)+" // 
					         + "(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@ 
					         + "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
					         + "|" // 允许IP和DOMAIN（域名） 
					         + "([0-9a-z_!~*'()-]+.)*" // 域名- www. 
					         + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名 
					         + "[a-z]{2,6})" // first level domain- .com or .museum 
					         + "(:[0-9]{1,4})?" // 端口- :80 
					         + "((/?)|" // a slash isn't required if there is no file name 
					         + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"; 
						   var re=new RegExp(_url, 'i' );
						   if(!re.test(href)){
							flag = true;
						   }
						}
						if(adValue[1] !="-1" && adValue[2] != "-1"){
							var starttime = adValue[1].replace(/-/g, "/");
							var endtime = adValue[2].replace(/-/g, "/");
							starttime = (new Date(starttime)).getTime();
							endtime = (new Date(endtime)).getTime();
							if(starttime - endtime > 0){
								timeFlag = true;
							}
						}
					}
				});
			});
			if(imgUpload){
				alert("必须上传图片");
			       return;
			}
			if(flag){
				alert("图片链接错误");
			       return;
			}
			if(timeFlag){
				alert("开始时间不能大于结束时间");
			       return;
			}
			
	       // 文本广告ID,href
	       var textAdIdHref =indexCtrl.getTextAdIds();
	       // 图片广告ID,href
	       var imageAds =indexCtrl.getImagedIds();
	       // base64
	       html = encode64(utf16to8(indexCtrl.getFinalHtml()));
	    }
	    // 解析浏览器后面的主题模板
    	O2oThemeTemplate['publishData']({subId:$scope.subId,pageHtml:html,pageCfg:cfg,
    								textAdIdHref : textAdIdHref,
    								imageAds : imageAds,
	    							type : $scope.type,
	    							templateId : $scope.templateId,
	    							ownerId : $scope.ownerId
    							}, function(value, responseHeaders) {
    								
    		if(0 == value.errorCode){
    			alert('发布文件成功。');
        	} else {
        		alert('记录不存在或者网络原因，请联系管理员。');
        	}
        }, function(httpResponse) {
        	alert('记录不存在或者网络原因，请联系管理员。');
        });
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
	openwindow(contextPath + '/uam/theme/uploadWindow.xhtml?pathName='+pathName, 'upload',430,200);
}

// 刷新图片 ,如果是画布需要替换的图片，则图片class必须是canvas_img_replace
function refreshImg(imgName){
    // 当前上传图片个数
	if(undefined != canvasImgId && null != canvasImgId){
		jq('#'+canvasImgId).find('.canvas_img_replace')[0].src = imgName;
	}
	if(currImgId != ''){
		jq('#'+currImgId)[0].src = imgName;
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

mainApp.factory('O2oThemeTemplate', ['$resource',
  function($resource){
    return $resource(contextPath +'/uam/theme', {}, {
      'query': {method:'POST', params:{operate: 'query'}},
      'publishData': {method:'POST', params:{operate: 'draw'}}
    });
  }]);
