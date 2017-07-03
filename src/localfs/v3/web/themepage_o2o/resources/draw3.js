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

    jq('#tabs').find('li.ui-tabs-active ui-state-active').each(function(i){
    	jq(this).removeClass('ui-tabs-active ui-state-active');
	});

    // 从url后面获取templateId
    $scope.type = jq.getUrlParams('type');
    $scope.templateId = jq.getUrlParams('templateId');
    $scope.ownerId = jq.getUrlParams('ownerId');
    O2oThemeTemplate['query']({templateId: $scope.templateId, type : $scope.type}, function(value, responseHeaders) {
    	if(0 != value.errorCode){
    		alert('记录不存在或者网络原因，请联系管理员。');
    		return ;
    	}
    	
    	$scope.instance = value.data;
    	$scope.subId = $scope.instance.id;
    	pathName = $scope.instance.pathName;
    	var indexObj = jq("#indexContent");
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
        
        if($scope.type == 2){
          var tabs = ['wechat', 'phone', 'user'];
          jq('.wechat-link').show();
          jq('.phone-link').show();
          jq('.user-link').show();
          
	 	   if (tabs && tabs.length) {
	 	      jq('.form-tab-items > div.' + tabs[0]).show();
	 	   }
	 	   //   事件绑定
	 	  jq('.form-tab li').each(function (i, tab) {
	 		 jq(tab).unbind('click').bind('click', function () {
	 			  jq('.form-tab-items > div').eq(i).show().siblings().hide();
	 	       });
	 	   });
        }
        if($scope.type >= 4){
        	jq("#homeItem").css('display','block'); 
        }
        jq("a").on("click", "a", function(event) {
            event.preventDefault();
        });
       
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
    	if($scope.type == 2){
        	var tabs = ['wechat', 'phone', 'user'];
            jq('.wechat-link').hide();
            jq('.phone-link').hide();
            jq('.user-link').hide();
    	}

        
    	var html = '';
    	var cfg = '';
	    if(null != indexCtrl && undefined != indexCtrl){
	       cfg = indexCtrl.getFinalCfg();
	       //alert(cfg);
	       // base64
	       html = encode64(utf16to8(indexCtrl.getFinalHtml()));
	       console.log(indexCtrl.getFinalHtml());
	    }
	    // 解析浏览器后面的主题模板
    	O2oThemeTemplate['publishData']({subId:$scope.subId,pageHtml:html,pageCfg:cfg,
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
    	 
        if($scope.type == 2){
          var tabs = ['wechat', 'phone', 'user'];
          jq('.wechat-link').show();
          jq('.phone-link').show();
          jq('.user-link').show();
        }
    }

}]);

/**
 * 上传图片
 */
//var currImgId;
var canvasImgId;
function uploadImg(imgId,params){
	// 记录当前操作的图片域id
	//currImgId = canvasId,;
	canvasImgId = imgId;
	openwindow(contextPath + '/uam/theme/uploadWindow2.xhtml?pathName='+pathName+'&_'+params, 'upload',800,1000);
}

// 刷新图片 ,如果是画布需要替换的图片，则图片class必须是canvas_img_replace
function refreshImg(imgName){
    // 当前上传图片个数
	if(undefined != canvasImgId && null != canvasImgId){
		if(canvasImgId == "logoImg" || canvasImgId == "header"){
			jq("#"+canvasImgId).attr("src",imgName);
		}
		jq("#"+canvasImgId).css('background-image', 'url(' + imgName + ')');
		jq("#"+canvasImgId+"edit").attr("src",imgName);
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
    return $resource(contextPath +'/uam/threetheme', {}, {
      'query': {method:'POST', params:{operate: 'query'}},
      'publishData': {method:'POST', params:{operate: 'draw'}}
    });
  }]);
