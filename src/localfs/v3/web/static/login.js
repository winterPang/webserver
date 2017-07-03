var g_oDeviceInfo = {};
var BASE_URL = "../../";
var OEM_BASE = BASE_URL+"web/frame/oem/";

var PageText = {
	curLang: "cn",
	cn:
	{
		change_pswd: ["修改密码", "旧 密 码", "新 密 码", "密码确认", "确定", "取消", "新密码输入错误", "密码确认输入错误"],
		confirm_dlg: {title: "请更新密码", ok: "确定", cancel: "取消"},
		login_div:[
		    "中文",
			"您的浏览器版本过低，请使用IE8或更新的版本访问",
			"用户名",
			"请输入本地管理密码",
			"验证码",
			"刷新图片",
			"使我保持登录状态",
			"登录"
		],
		login_check:["密码不能为空","验证码输入错误"],
		net_err: "登录失败，请检查网络是否连通，或者%s服务是否启动",
		title:"登录",
		treeRoot:"All Networks"
	},
	en:
	{
		change_pswd: ["Change Password", "Old Password", "New Password", "Confirm Password", "Apply", "Cancel", "New Password Error", "Confirm Password Error"],
		confirm_dlg: {title: "Change password", ok: "Apply", cancel: "Cancel"},
		login_div:[
			"English",
			"Your browser is not supported, please update to IE8 or more recent.",
			"Username",
			"Password",
			"Verify code",
			"Refresh",
			"Keep me signed in",
			"Login"
		],
		login_check:["UserName cannot empty","Verify code error"],
		net_err: "Login in failed, please check your network, or the %s service is enable",
		title:"Login",
		treeRoot:"All Networks"
	},
	changeLanguage: function(sLang, tar)
	{
		if(!sLang)
		{            
			sLang = ("cn"==this.curLang) ? "cn" : "en";
		}

		var jLang = $("#lang_contrainer");
		var jCurrentA = $("#change_lang li a[data="+sLang+"]", jLang);
		$("#change_lang li a.selected", jLang).removeClass("selected");
		jCurrentA.addClass("selected");
	    document.title = PageText[sLang]["title"];

	    getCopyright(sLang);

		this.curLang = sLang;
		var oText = PageText[sLang][tar];

		$("#"+tar).show().find(".text_lang").each(function(i)
		{
			if("IMG" == this.tagName)
			{
				this.alt = this.title = oText[i];
			}
			else if("INPUT" != this.tagName)
			{
				$(this).html(oText[i]);
			}
			else if(("text" == this.type)||("password" == this.type))
			{
				$(this).attr("placeholder", oText[i]);
			}
		});
	}
};

$.MyLocale = {
	OEM:{}
};

function getCopyright(sLang)
{
    function setCopyright()
    {
        if(!$.MyLocale.OEM[sLang])
        {
            // save to locale
            $.MyLocale.OEM[sLang] = $.MyLocale.OEM;
        }

        var oem = $.MyLocale.OEM = $.MyLocale.OEM[sLang];
        var sCopyright = sprintf(oem.copyright, "", g_oDeviceInfo.year||2014);        
        $("#copyright").html(sCopyright);
    }

    if(!$.MyLocale.OEM[sLang])
    {
        _loadScript (OEM_BASE+g_oDeviceInfo.oem+"/"+sLang+"/config.js", setCopyright);
    }
    else
    {
        setCopyright();
    }
}
function sprintf(sFormat, valuelist)
{
    var arrTmp = new Array();
    for (var j=1; j<arguments.length; j++)
    {
        arrTmp[j-1] = arguments[j];
    }

    var sRet = "";
    var sTemp = sFormat;
    var n = sTemp.indexOf("%");
    for ( var i=0; ((i<arrTmp.length) && (-1!=n)); i++ )
    {
        var sNewChar;
        var ch = sTemp.charAt(n+1);

        switch ( ch )
        {
        case '%':
            sNewChar = "%";
            i--;
            break;
        case 'd':
            sNewChar = parseInt(arrTmp[i]);
            break;
        case 's':
            sNewChar = arrTmp[i];
            break;
        default:
            sNewChar = "%"+ch;
            break;
        }

        sRet += sTemp.substring(0,n) + sNewChar;
        sTemp = sTemp.substring(n+2);
        n = sTemp.indexOf("%");
    }
    sRet += sTemp;
    return sRet;
}
var Cookie = 
{
	get: function (sName)
	{
		// cookies are separated by semicolons
		var aCookie = document.cookie.split("; ");
		for (var i=0; i < aCookie.length; i++)
		{
			// a name/value pair (a crumb) is separated by an equal sign
			var aCrumb = aCookie[i].split("=");
			if (sName == aCrumb[0]) 
			  return unescape(aCrumb[1]||"");
		}
		
		// a cookie with the requested name does not exist
		return null;
	},

    set: function (oPara, retentionDuration)
    {
        var sExpres = "";
        var n = parseInt(retentionDuration);
        if(-1 == n)
        {
            // 不老化
            var date = new Date(2099,12,31);
            sExpres = "expires=" + date.toGMTString();
        }
        else if(n>0)
        {
            var date = new Date();
            date.setTime(date.getTime() + n*3600000);
            sExpres = "expires=" + date.toGMTString();
        }

        for (var sName in oPara)
        {
            var sCookie = sName+"="+escape(oPara[sName])+"; path=/;" + sExpres;
            document.cookie = sCookie;
        }
    },
    del: function(sName)
    {
        var date = new Date();
        date.setTime(date.getTime() - 10000);

        var aTemp = sName.split(",");
        for(var i=0; i<aTemp.length; i++)
        {
            var sCookie = aTemp[i] + "=d; path=/; expires=" + date.toGMTString();
            document.cookie = sCookie;
        }
    }
}

function _loadScript(sJsFile, cb, para)
{
	var obj = document.body ? document.body : document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.setAttribute('src', sJsFile);
	obj.appendChild(script);

	if(document.all) 
	{
		script.onreadystatechange = function() 
		{
			(this.readyState == 'complete' || this.readyState == 'loaded') && cb&&cb(para);
		};
	}
	else 
	{
		script.onload = function(){cb&&cb(para);};
	}
}

function getDynUrl(sUrl)
{
	return BASE_URL + "wnm/" + sUrl;
}

/*function refreshVCode()
{
	$("#img_vcode").attr("src", getDynUrl("vcode.bmp?t="+Math.random()));
}*/

// ajax错误处理
function onAjaxErr()
{
	var sProtocal = window.location.protocol.replace(":", "").toUpperCase();
	var sMsg = PageText[PageText.curLang]["net_err"].replace("%s", sProtocal);
	alert(sMsg);
}

function rememberLogin()
{
    var oForm = document.getElementById("login-form");
    Cookie.set({"user_name": oForm.username.value});
	Cookie.set({"password": oForm.password.value});
}
function checkUserName()
{
    if(("" == $("#user_name").val())||($("#user_name").attr("placeholder") == $("#user_name").val()))
    {
        var jError = $('.alert-error', $('.login-form')).show();
        var jMsg = $("span.msg", jError);
        var sMsg = PageText[PageText.curLang]["login_check"][0];

        jMsg.html(sMsg);
        return false;
    }
}


function checkInput (sPassword)
{
	// check the input
	if ("" == sPassword)
	{
		return 0;
	}

	if ( $("#vcode_cnt").is(":visible") && !$.trim($("#vcode").val()))
	{
		return 1;
	}

	return -1;
}


// 点击登录按钮的处理
function onLoginSubmit()
{
	var sPassword = $.trim($("#password").val());
	var name = $.trim($("#name").val());
    /*登录之前的输入校验*/
	/*var nErrId = checkInput (sPassword);
	if (-1 != nErrId)
	{
		var sMsg = PageText[PageText.curLang]["login_check"][nErrId];
		$('#err_msg').html(sMsg);
		return false;
	}*/

	// 下发登录请求(触发相关的校验)
	if($("#remember_me").hasClass("remember_active_btn")){
		rememberLogin();
	}
	$("#login-form").submit();
	return false;
}

// 显示login页面
/*function showLogin()
{
	function _showLoginPage(vcode)
	{		
		if ("true" == vcode)
		{
			refreshVCode ();
			$("#vcode_cnt").show();
		}

		PageText.changeLanguage(PageText.curLang, "login_div");
		$("#user_name").focus(); 
	}
	
	// HTTPS请求: 开始自动登录, 登录成功的话就跳转到首页面, 否则显示登录页面
	$.ajax({
		url: getDynUrl("frame/login.php"),
		dataType: "json",
		data: {ssl:getQueryPara("ssl", "true"),lang:PageText.curLang},
		success: function(oLoginResult)
		{
			if (oLoginResult.error)
			{
				// 自动登录失败, 显示登录页面
				_showLoginPage(oLoginResult.vcode);
			}
			else if (oLoginResult.changePswd)
			{
				// 登录成功, 后台会返回一个跳转的URL
				showPswdDlg(oLoginResult);
			}
			else
			{
				// 登录成功, 且不需要修改密码, 直接进入首页面
				window.location = oLoginResult.url;
			}
		},
		error: onAjaxErr
	});
}*/

function onInitContent()
{
	function changeAdImg()
	{
		bFlag++;
		if (bFlag == obj2.length)
		{
			bFlag = 0;
		};
		var jAdList = $('#adPanel ul');
		var jItem = $('li',jAdList);
		var nLeft = jAdList.css('left').replace("px","")*1;
		nLeft -= jItem.width();
		jAdList.animate({left:nLeft},400,function(e){
			var jFirst = $('li',this).first();
			$('li',this).last().after(jFirst);
			$(this).css({left:0});
		});
		for(var j=0;j<obj2.length;j++)
		{
			obj2[j].style.backgroundColor="#eeeeee";
		}
		obj2[bFlag].style.backgroundColor="#4ec1b2";

	}

	var oTimer = setInterval(changeAdImg,4000);
	var bFlag = 0;
	var obj2 = document.getElementsByTagName("i");
	    obj2[0].style.backgroundColor ="#4ec1b2";
	    obj2[1].style.backgroundColor ="#eeeeee";
	    obj2[2].style.backgroundColor ="#eeeeee";
    $("#adPanel").on('mouseenter','ul>li',function(){value = 0})
    			 .on('mouseleave','ul>li',function(){value = 1});
}


// 页面初始化
function onPageInit()
{
	var jText = $("#text");
	var jPassword = $("#password");
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r != null) return unescape(r[2]); return null; //返回参数值
	}
	var xx = getUrlParam('error');
	if (xx == 1){
		$("#password_error").show();
	}
	
	//选择了记住密码，需要的处理
	if(Cookie.get("remember_password")){
		$("#remember_me").removeClass("remember_btn").empty().addClass("remember_active_btn");
		$("#name").val(Cookie.get("user_name")||"");
		$("#password").val(Cookie.get("password")||"");
	}
	onInitContent();
	changeRememberClass();
	var query = getQueryString();

	if(query.length>0){
		$("#lt").val(query[0].split("=")[1]);
		$("#execution").val(query[1].split("=")[1]);
	}else{
		window.location ="/v3";
		return false;
	}
	
	$("#password").keydown(function(event){
		if (event.keyCode == 13){
			onLoginSubmit();
		}
		return true;
	})
	/*
	$("#registerBtn").on("click",function(){
		var options = {
			backdrop:"static",
			keyboard :false
		}
		$('#register').modal(options);
	})
	*/
     $("#loginBtn").on("click", function(){
		 onLoginSubmit();
     	return false;
     });
	 
	 $("#visitorLoginBtn").on("click", function(){
		 $("#name").val("demouser");
		 $("#password").val("demouser");
		 onLoginSubmit();
	 });

	 $("#switch").click(function(){
	 	if($(this).hasClass('show_word'))
	 	{
	 		$(this).removeClass('show_word');
	 		jText.hide();
	 		jPassword.show();
	 		jPassword.val(jText.val());
	 	}
	 	else{
	 		$(this).addClass('show_word');
	 		jText.show();
	 		jPassword.hide();
	 		jText.val(jPassword.val());
	 	}
	 });

	$("#text").keyup(function(){
				
		$("#password").val($("#text").val());					
				
	});
			
	 /*$("#password").attr("placeholder",PageText[PageText.curLang]["login_div"][3])
	 			  .focus()
	 			  .keydown(function(e){
	 				if(e.keyCode == 13)
	 				{
	 					$("#loginBtn").click();
	 				}
	 			});
	 $("#vcode").attr("placeholder",PageText[PageText.curLang]["login_div"][4])
	 			  .keydown(function(e){
	 				if(e.keyCode == 13)
	 				{
	 					$("#loginBtn").click();
	 				}
	 			});*/
}

function getQueryString(){

	var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g"));

	if(result == null){

		return "";

	}

	for(var i = 0; i < result.length; i++){

		result[i] = result[i].substring(1);

	}

	return result;

}


/*function checkBroswer()
{
	var bIsIE = $.browser.msie;
    var ver = parseFloat($.browser.version);
    var isNotSupport = function()
    {
        if(bIsIE && (ver <= 6))
        {
            return true;
        }
        
        return false;
    };
    
    // if the browser is not supported, show the message, but allow user continue.
    if(isNotSupport())
    {
        $("#browser_not_support").show();
        $("#loginform").hide();
    }
}*/

function changeRememberClass(){
	$("#remember_me").on("click",function(){
		if($("#remember_me").hasClass("remember_active_btn")){
			$("#remember_me").removeClass("remember_active_btn").empty().addClass("remember_btn");
			if(Cookie.get("remember_password")){
				Cookie.del("remember_password");
				if(Cookie.get("password")){}
				Cookie.del("password");
				Cookie.del("user_name");
			}
		}else{
			$("#remember_me").removeClass("remember_btn").empty().addClass("remember_active_btn");
			Cookie.set({"remember_password": "checked"});
		}

	})
}
function onMyLoad()
{
	// initLanguage();
	// checkBroswer();
	onPageInit();

}

var Login = function () {

    return {
        //main function to initiate the module
        init: function () 
        {
            // handleLogin();
            onMyLoad();
        },
        resize: function (nHeight)
        {
        	var sClass = "height_1";
        	if (nHeight < 480)
        	{
        		sClass = "height_2";
        	}
        	else if (nHeight < 790)
        	{
        		sClass = "height_3";
        	}
        	else if (nHeight < 1024)
        	{
        		sClass = "height_4";
        	}
        	$("body").removeClass("height_1 height_2 height_3 height_4").addClass (sClass);
        }
    };

}();

$(window).resize(function ()
{
	Login.resize($(window).height());
})
