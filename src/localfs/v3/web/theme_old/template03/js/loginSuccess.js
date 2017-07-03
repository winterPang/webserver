
$(document).ready(function() {
	// 第三页:按钮事件
	var timer = $("#timer");
	if (typeof(timer) != "undefined" && timer.size() > 0) {
		//startLoginSuccessTimer();
	}
	var homePage = $("#homePage");
	if (typeof(homePage) != "undefined" && homePage.size() > 0) {
		$("#homePage").click(function(){
			stopTimer();
		});
	}
	var params = getAllUriParamsJson();
	// 初始化图片
	//initImage(params['templateId'], params['nas_id'], params['ssid']);
	initImage(1456, 122, "");
	//保存广告统计数据pv,uv 
	
});

/**
 * 获取url中的参数。
 *
 * @param paramName 参数名
 * @returns 参数值
 */
function getUrlParamValue(paramName) {
    var re = new RegExp("(^|\\?|&)"+ paramName + "=([^&]*)(&|$)",'g');
    re.exec(window.location.href);
    return RegExp.$2;
}

/**
 * 获取URI中的参数
 * @returns 返回JSON格式的参数集合
 */
function getAllUriParamsJson() {
	var uri = window.document.location.href.toString();
	if (uri.substr(uri.length - 1, uri.length) == '#') {
		uri = uri.substr(0, uri.length - 1);
	}
	var u = uri.split("?");
	if(typeof(u[1]) == "string"){
		u = u[1].split("&");
		var get = {};
		for(var i in u){
			var j = u[i].split("=");
			get[j[0]] = j[1];
		}
		return get;
	} else {
		return {};
	}
}

var counter = 3;
var myTimer;
/**
 * 认证成功页面的计时器
 */
function startLoginSuccessTimer() {
	$("#timer").html(counter);
	myTimer = setInterval(function() {
		counter--;
		$("#timer").html(counter);
		if (counter == 0) {
			stopTimer();
		}
	}, 1000);
}
function stopTimer() {
	clearInterval(myTimer);
	// TODO:增加模板ID、店铺ID参数
	var params = getAllUriParamsJson();
	location.href = "/portal/login" + "?nas_id=" + params['nas_id']
		+ "&templateId=" + params['templateId']
		+ "&userMac=" + params['userMac']
		+ "&ssid=" + params['ssid'] + "&operateType=4";
}

/**
 * 初始化页面中的图片
 * @param templateId 模板ID
 */
function initImage(templateId, nasId, ssid) {
	var uri = '/portal/login?pageType=3&templateId=' + templateId + "&operateType=5&nas_id=" + nasId + "&ssid=" + ssid;
	$.get(uri)
	.done(function(data) {
		if (typeof(data.error) != 'undefined') {
			alert(data.error);
		} else {
			var imageInfo = data.image;
			for (var key in imageInfo)
		    {
				if(key == "bgBody"){
					$('#'+key).css('background-image', 'url(' + imageInfo.bgBody[0] + ')');
				}
				
				if (imageInfo[key][2] != undefined && imageInfo[key] != null) {
					$('#'+key).wrap("<a href='" + imageInfo[key][1] + "' />");
				}
		    }
		}
	})
	.fail(function(data) {
		console.log($("#60000").val());
	});

}