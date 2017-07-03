$(document).ready(function() {
	var params = getAllUriParamsJson();
	// 初始化图片
	// 模板已定制，这里不再初始化图片
	initImage(params['templateId'], params['nas_id'], params['ssid']);
	//initImage(1456, 122, "");
	// 初始化登录面板
	initLoginForm();

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
 * qq登录链接处理
 */
function qqLogin(){
	$("#qq").attr({"disabled":"disabled"});
	var nas_id = getUrlParamValue("nas_id");
	// 跳转到腾讯服务器
	$.post("/portal/qqLogin", {nas_id:nas_id})
	.done(function(data) {
		if (typeof(data.error) != 'undefined') {
			alert($("#60004").val() + data.error);
			$("#qq").removeAttr("disabled");
		} else {
			location.href = data;
		}
	}).fail(function(data) {
		alert($("#60004").val());
		$("#qq").removeAttr("disabled");
	});
}

/**
浏览器版本信息
* @type {Object}
* @return {Boolean}  返回布尔值
*/
function browser() {
    var u = navigator.userAgent.toLowerCase();
    var app = navigator.appVersion.toLowerCase();
    return {
        txt: u, // 浏览器版本信息
        version: (u.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1], // 版本号
        msie: /msie/.test(u) && !/opera/.test(u), // IE内核
        mozilla: /mozilla/.test(u) && !/(compatible|webkit)/.test(u), // 火狐浏览器
        safari: /safari/.test(u) && !/chrome/.test(u), //是否为safair
        chrome: /chrome/.test(u), //是否为chrome
        opera: /opera/.test(u), //是否为oprea
        presto: u.indexOf('presto/') > -1, //opera内核
        webKit: u.indexOf('applewebkit/') > -1, //苹果、谷歌内核
        gecko: u.indexOf('gecko/') > -1 && u.indexOf('khtml') == -1, //火狐内核
        mobile: !!u.match(/applewebkit.*mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/), //ios终端
        android: u.indexOf('android') > -1, //android终端
        iPhone: u.indexOf('iphone') > -1, //是否为iPhone
        iPad: u.indexOf('ipad') > -1, //是否iPad
        webApp: !!u.match(/applewebkit.*mobile.*/) && u.indexOf('safari/') == -1 //是否web应该程序，没有头部与底部
    };
}

/**
 * 微信登录链接处理
 */
function weixinLogin() {
	var b = browser();
	if(b.ios||b.iPhone||b.iPad){
		// iOS终端，可以主动打开app store
		window.location.href = "weixin://";
	}else if(b.android){
		// android提示安装微信
		window.location.href = "weixin://";
	} else {
		// 其他终端提示不支持
		alert($("#60006").val());
	}
}

/**
 * 获取URI中的参数
 * @returns 返回URI中‘？’以后的字符串
 */
function getAllUriParams() {
	var uri = window.document.location.href.toString();
	var u = uri.split("?");
	if(typeof(u[1]) == "string"){
		return u[1];
	} else {
		return "";
	}
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

String.prototype.format=function()
{
  if(arguments.length==0) return this;
  for(var s=this, i=0; i<arguments.length; i++)
    s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
  return s;
};

var counter = 60;
var myTimer;
function startMessageTimer(btnVal) {
	myTimer = setInterval(function() {
		counter--;
		$('.btn-getcode').html(btnVal.format(counter));
		if (counter <= 0) {
			$('.btn-getcode>button').removeAttr("disabled");
			$('.btn-getcode').html('<button style="border:none;background-color:#fff;padding:0;color:#4ec1b2;">获取验证码</button>');
			stopTimer();
		}
	}, 1000);
}
function stopTimer() {
	clearInterval(myTimer);
}
/**
 * 发送短信获取登录校验码
 */
function sendLoginMessage() {
	$('.btn-getcode>button').attr({"disabled":"disabled"});
	var phoneNum = $('.input-phone input').val();
	var params = getAllUriParamsJson();
	if (phoneNum == undefined || phoneNum == "") {
		alert($("#60007").val());
	} else {
		$.get('/portal/login?phoneNO=' + phoneNum + "&operateType=2" + "&storeId=" + params.nas_id + "&ssid=" + params.ssid)
		.done(function(data) {
			if (typeof(data.error) != 'undefined') {
				alert($("#60009").val() + data.error);
			} else {
				counter = data.resendTime;
				startMessageTimer(data.btnVal);
			}
		})
		.fail(function() {
			alert($("#60009").val());
		});
	}
}

/**
 * 手机登录
 */
function phoneLogin() {
	var userName = $('.input-phone input').val();
	var password = $('.input-code input').val();
	
	if (userName == undefined || userName == "") {
			alert($("#60007").val());
		return;
	}
	if (password == undefined || password == "") {
			alert($("#60008").val());
		return;
	}

	var params = getAllUriParamsJson();
	params.userName = userName;
	params.signature = password;
	
	params.operateType = 3;
	$.post("/portal/login", params)
	.done(function(data) {
		if (typeof(data.error) != 'undefined') {
			alert($("#60004").val() + data.error);
		} else {
			location.href = data.redirect_uri;
			
		}
	})
	.fail(function(data) {
		alert($("#60004").val());
	});
}

/**
 * 用户登录
 */
function userLogin() {
	var userName = $('.input-name input').val();
	var password = $('.input-pwd input').val(); 
	if (userName == undefined || userName == "") {
			alert($("#60010").val());
		return;
	}
	if (password == undefined || password == "") {
			alert($("#60011").val());
		return;
	}

	var params = getAllUriParamsJson();
	params.userName = userName;
	params.signature = password;
	params.operateType = 7;

	$.post("/portal/login", params)
	.done(function(data) {
		if (typeof(data.error) != 'undefined') {
			alert($("#60004").val() + data.error);
		} else {
			location.href = data.redirect_uri;
		}
	})
	.fail(function(data) {
		alert($("#60004").val());
	});
}
/**
 * 初始化页面中的图片
 * @param templateId 模板ID
 * @param nasId 店铺ID
 * @param ssid
 */
function initImage(templateId, nasId, ssid) {
	var uri = "/portal/login?pageType=2&templateId=" + templateId + "&operateType=5&nas_id=" + nasId + "&ssid=" + ssid;
	$.get(uri)
	.done(function(data) {
		if(data.error){
			alert(data.error);
		} else if (typeof(data.error) != 'undefined') {
			alert($("#60000").val());
		} else {
			var imageInfo = data.image;
			for (var key in imageInfo)
		    {
				if(key == "header"){
					$('#'+key).attr('src', imageInfo.header[0]);
				}
				
				if (imageInfo[key][2] != undefined && imageInfo[key] != null) {
					$('#'+key).wrap("<a href='" + imageInfo[key][1] + "' />");
				}
		    }
		}
	})
	.fail(function(data) {
		alert($("#60000").val() + ':' + data);
	});

}

/**
 * 初始化登录面板
 */
function initLoginForm() {
	var params = getAllUriParamsJson();
	var uri = "/portal/login?operateType=6&nas_id=" + params['nas_id'] 
		+ "&ssid=" + params['ssid']
		+ "&usermac=" + params['usermac']
		+ "&userip=" + params['userip'];
	$.get(uri)
	.done(function(data) {
		//var tabs = ['wechat','phone'];
		//var tabs = ['wechat', 'phone', 'user'];
		var tabs =[];
		// 设置微信公众号事件及样式
		if (data.weixin == 1 && data.weixinConnectWifi.isWeixinConnectWifi == 1) {
			tabs.push("wechat");
			//微信账号连接按钮事件
            $('.wechat .btn-wechat').unbind('click').bind('click', function () {
            	weixinLogin();
            });
            $('.wechat .btn-wifi').unbind('click').bind('click', function () {
            	callWechatBrowser(params);
            });
		} else {
			// 设置微信公众号事件及样式
			if (data.weixin == 1) {
				tabs.push("wxcount");
				//微信账号连接按钮事件
	            $('.wxcount .btn-wechat').unbind('click').bind('click', function () {
	            	weixinLogin();
	            });
			} else {
			}
			// 设置微信连wifi事件及样式
			if (data.weixinConnectWifi.isWeixinConnectWifi == 1) {
				tabs.push("wxwifi");
				//微信wifi连接按钮事件
	            $('.wxwifi .btn-wifi').unbind('click').bind('click', function () {
	            	callWechatBrowser(params);
	            });
			} else {
			}
		}
		
		//	qq
		if (data.qq == 1) {
		} else {
		}
		if (data.phone2guding == 0) {
			
		}else if (data.phone2guding == 1) {
			tabs.push("phone");
			
            $('.phone .btn-login').unbind('click').bind('click', function () {
                phoneLogin();
            });
            //发送验证码
			 $('.btn-getcode>button').unbind('click').bind('click', function () {
				    sendLoginMessage();
	         });
		}else if (data.phone2guding == 2) {
			tabs.push("user");
			 $('.user .btn-login').unbind('click').bind('click', function () {
	                userLogin();
	            });
		} else if (data.phone2guding == 3) {
			tabs.push("phone");
			tabs.push("user");
			$('.phone .btn-login').unbind('click').bind('click', function () {
                phoneLogin();
            });
            //发送验证码
			 $('.btn-getcode>button').unbind('click').bind('click', function () {
				    sendLoginMessage();
	         });
			 
			 $('.user .btn-login').unbind('click').bind('click', function () {
	                userLogin();
	         });
		}
		
		
       $.each(tabs, function () {
           $('.' + this + '-link').show();
       });
	     
	   if (tabs && tabs.length) {
	       if (tabs.length == 2) {
	           $('.form-tab li').width(149);
	       } else if (tabs.length == 1) {
	           $('.form-tab li').width('100%');
	       }
	       $('.form-tab li.' + tabs[0] + '-link').addClass('active');
	       $('.form-tab-items > div.' + tabs[0]).show();
	   }
	 //   事件绑定
	   $('.form-tab li').each(function (i, tab) {
	       $(tab).unbind('click').bind('click', function () {
	           $(this).addClass('active').siblings().removeClass('active');
	           $('.form-tab-items > div').eq(i).show().siblings().hide();
	       });
	   });
		
	})
	.fail(function() {
		alert($("#60000").val());
	});
}

function callWechatBrowser(params) {
	var params = getAllUriParamsJson(); 
	loginUrl = "/portal/wifilogin.jsp?" 
			+ "nas_id=" + params['nas_id'] 
			+ "&redirect_uri=" + params['redirect_uri']
			+ "&ssid=" + params['ssid']
			+ "&templateId=" + params['templateId']
			+ "&userip=" + params['userip']
			+ "&usermac=" + params['usermac']
			+ "&userurl=" + params['userurl'];
	// window.location.replace(loginUrl);
	// 换一种方式，能够通过返回，返回到原来页面
	window.location.href = loginUrl;
}
