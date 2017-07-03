var g_oDeviceInfo = {};
var BASE_URL = "../../";
var OEM_BASE = BASE_URL+"web/frame/oem/";

var PageText = {
	//curLang: "en",
	curLang: "cn",
	cn:
	{
		banners:
		{
			login:"Login提示",
			shell: "Shell",
			legal: "Legal",
			motd: "Motd"
		},
		banner_div: ["单击此处关闭该网页。", "继续访问web网管。"],
		change_pswd: ["修改密码", "旧 密 码", "新 密 码", "密码确认", "确定", "取消", "新密码输入错误", "密码确认输入错误"],
		confirm_dlg: {title: "请更新密码", ok: "确定", cancel: "取消"},
		login_div:[
			"中文",
			"您的浏览器版本过低，请使用IE8或更新的版本访问",
			"用户名",
			"密码",
			"验证码",
			"刷新图片",
			"记住我",
			"登录"
		],
		login_check:["用户名不能为空","验证码输入错误"],
		net_err: "登录失败，请检查网络是否连通，或者%s服务是否启动",
		title:"登录",
		treeRoot:"All Networks"
	},
	en:
	{
		banners:
		{
			login: "Web Security Notes",
			shell: "Shell",
			legal: "Legal",
			motd: "Motd"
		},
		banner_div: ["Click here to close this page.", "Continue to access the Web interface."],
		change_pswd: ["Change Password", "Old Password", "New Password", "Confirm Password", "Apply", "Cancel", "New Password Error", "Confirm Password Error"],
		confirm_dlg: {title: "Change password", ok: "Apply", cancel: "Cancel"},
		login_div:[
			"English",
			"Your browser is not supported, please update to IE8 or more recent.",
			"Username",
			"Password",
			"Verify code",
			"Refresh",
			"Remember me",
			"Login"
		],
		login_check:["UserName cannot empty","Verify code error"],
		net_err: "Login in failed, please check your network, or the %s service is enable",
		title:"Login",
		treeRoot:"All Networks"
	}
	/*changeLanguage: function(sLang, tar)
	{
		if(!sLang)
		{
			sLang = ("en"==this.curLang) ? "cn" : "en";
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
	}*/
};

$.MyLocale = {
	OEM:{}
};

/*function getCopyright(sLang)
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
        $("#title_content").html($.MyLocale.OEM.title);
    }

    if(!$.MyLocale.OEM[sLang])
    {
        _loadScript (OEM_BASE+g_oDeviceInfo.oem+"/"+sLang+"/config.js", setCopyright);
    }
    else
    {
        setCopyright();
    }
}*/
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
            // ���ϻ�
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

var Banner = {
	show: function()
	{
		var rc = PageText[PageText.curLang].banners;
		var aHtml = [];
		for(var bn in g_oDeviceInfo.banner)
		{
			aHtml.push('<h1 class="banner-header">'+rc[bn]+'</h1>');
			aHtml.push('<pre class="banner-item">'+g_oDeviceInfo.banner[bn]+'</pre>');
		}
		
		if (aHtml.length == 0)
		{
			return false;
		}

		$("#banner_header").html(aHtml.join(''));
		$("#banner_div").show();
		return true;
	},
	hide: function()
	{
		$("#banner_div").hide();
	}
};

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

function getBrowserLanguage()
{
	var sLang;

	sLang = Cookie.get("lang");
	if(!sLang)
	{
		sLang = navigator.language || navigator.language || navigator.userLanguage || navigator.systemLanguage || "en";
		sLang = sLang.toLowerCase();
		sLang = (sLang.indexOf("cn")!=-1) ? "cn" : "en";
	}

	return sLang;
}

function getLanguage()
{
	var sLang;

	//������Ҫ�鿴��ǰ��ƷOEM֧�ֵ�����ģʽ
	//var sLanguageSupported = OemConfig.getSupportedLang ();
	var sLanguageSupported = "cn";
	switch (sLanguageSupported)
	{
		//��֧��һ������
		case "en":
		case "cn":  
			sLang = sLanguageSupported;
			break;

		//֧�ֶ�������
		default:    //�����������Ӣ��˫���ͬ����
			$("#lang_contrainer").show();
			sLang = getBrowserLanguage();
			break;
	}
    Cookie.set({"supportLang": sLanguageSupported});
	return sLang;
}

//验证码
/*function refreshVCode()
{
	$("#img_vcode").attr("src", getDynUrl("vcode.bmp?t="+Math.random()));
}*/

// ajax������
function onAjaxErr()
{
	var sProtocal = window.location.protocol.replace(":", "").toUpperCase();
	var sMsg = PageText[PageText.curLang]["net_err"].replace("%s", sProtocal);
	alert(sMsg);
}

// ��ʾ�޸�����Ի���
/*function showPswdDlg(oLoginResult)
{
	function onApplyClick()
	{
		var sNewPswd = $("#new_pswd", jChgePwd).val();
		var sCnfPswd = $("#cnf_pswd", jChgePwd).val();
		if(!sNewPswd)
		{
		    $("#pswd_info", jChgePwd).html(oCPText[6]);
		    return;
		}
		if(!sCnfPswd || sNewPswd != sCnfPswd)
		{
		    $("#pswd_info", jChgePwd).html(oCPText[7])
		    return;
		}
		// �ύ���豸�Ͻ����޸�����.
		var oBtn = $(this);
		oBtn.attr("disabled", true);
		
		$.ajax({
			url: getDynUrl("frame/changepswd.php"),
			dataType: "json",
			data: {
				sessionid: oLoginResult.sessionid,
				opswd: $("#old_pswd", jChgePwd).val(),
				npswd: sNewPswd
			},
			success: function (oInfo)
			{
				if (oInfo.ok)
				{
					window.location = oLoginResult.url;
				}
				else 
				{
					$("#pswd_info").html(oInfo.error).addClass("alert-error");
					oBtn.attr("disabled", false);
				}
			},
			error: onAjaxErr
		});
		
		return false;
	};
	function onCancelClick()
	{
		var oBtn = $(this);
		oBtn.attr("disabled", true);

		/!* ����Ǽ�������, ��ȡ����������ҳ��. ����رմ���
		 	SESSION_LOGIN_PSWD_NORMAL   0  ����Ҫ�޸����� 
		 	SESSION_LOGIN_PSWD_CHANGE   1  �����ѵ���, �����޸�. ���ȡ���������¼ 
		 	SESSION_LOGIN_PSWD_CONFIRM  2  ���뼴������, ���Բ��޸�, ���ȡ����������� *!/
		if (2 == oLoginResult.type)
		{
			/!* ���뼴������, ���Բ��޸�, ֱ������ *!/
			window.location = oLoginResult.url;
		}
		else
		{
			/!*�����ѵ���, ���ȡ����ťʱ��logout, �ٹرմ���*!/
			$.get(getDynUrl("logout.j?sessionid="+oLoginResult.sessionid));
			setTimeout(function()
			{
				/!* �ڲ���������Ϲرմ��ڻ�ʧЧ, ����ҳ��û�ж����������ת��һ����ҳ����ʵ�ֵ��ȡ����ı仯 *!/
				//window.close();
				window.location = PageText.curLang+"/logout.html";
			}, 500);
		}

		return false;
	};
    var jChgePwd = $("#change_pswd");
    var sLang = Cookie.get("lang");
    var oCPText = PageText[sLang]["change_pswd"];
    
    jChgePwd.find(".text_lang").each(function(i)
    {
        $(this).html(oCPText[i]);
    });
    $("#pswd_info", jChgePwd).html(oLoginResult.msg);
    $("#btn_apply", jChgePwd).click(onApplyClick);
    $("#btn_cancel", jChgePwd).click(onCancelClick);
    jChgePwd.modal();
}*/

function showLoginError(sMsg)
{
    var jError = $('.alert-error', $('.login-form')).show();
    var jMsg = $("div.msg", jError).show();
    
    if(!sMsg)
    {
        sMsg = PageText[PageText.curLang]["login_check"][0];
    }
    jMsg.html(sMsg);
}
function rememberLogin()
{
    var oForm = document.getElementById("loginform");
    Cookie.set({user_name: oForm.user_name.value});
}

/*function resetTreePara()
{
	var aPath = [{sId:"_TreeRoot",sText:PageText[PageText.curLang].treeRoot}];
	var oNode = {"nodeId":"_TreeRoot"};

	Cookie.set({
		"MenuPath" : JSON.stringify(aPath),
		"TreeNode" : JSON.stringify(oNode)
		});
}*/

// �����豸�Ϸ��صĵ�¼���
function onLoginEnd(oLoginResult)
{
	if (oLoginResult.message!="ok")
	{
		/*if ("true"===oLoginResult.vcode)
		{
			refreshVCode();
			$("#vcode_cnt").show();
		}
		else
		{
			$("#vcode_cnt").hide();
		}*/
		oLoginResult.error="用户登录密码或用户名错误";
		showLoginError(oLoginResult.error);
	}
	/*else if (oLoginResult.changePswd)
	{
		showPswdDlg(oLoginResult);
	}*/
	else
	{
        if($("#remember_user").hasClass("checked"))
        {
            rememberLogin();
        }
		// ��¼�ɹ�, ��̨�᷵��һ����ת��URL
		window.location = BASE_URL + "wnm/frame/home.html";
	}
}

function getQueryPara(sName, def)
{
	var sHref = window.location.href;
	var a = sHref.split('?');
	if (a.length == 1)
	{
		return def;
	}
	
	var s = a[1];
	a = s.split('&');
	for(var i=0; i<a.length; i++)
	{
		var a1 = a[i].split('=');
		if (sName == a1[0])
		{
			return a1[1];
		}
	}
	
	return def;
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

function checkInput (oForm)
{
	// check the input
	if ("" == oForm.user_name.value)
	{
		return 0;
	}

	if ( $("#vcode_cnt").is(":visible") && ("" == oForm.vldcode.value) )
	{
		return 1;
	}

	return -1;
}

function disableBtn(sId)
{
	document.getElementById(sId).disabled = true;
}
function enableBtn(sId)
{
	document.getElementById(sId).disabled = false;
}
// �����¼��ť�Ĵ���
function onLoginSubmit()
{
	var oForm = this;

	// check the input values
	var nErrId = checkInput (oForm);
	if (-1 != nErrId)
	{
		var sMsg = PageText[PageText.curLang]["login_check"][nErrId];
		showLoginError (sMsg);
		return false;
	}

	var sLang = PageText.curLang;
	var oData = {
			user_name: oForm.user_name.value,
			password: oForm.password.value,
			ssl: getQueryPara("ssl", "true"),
			lang:sLang
	    }	
	/*if($("#vcode_cnt").is(":visible"))
    {
        oData.vldcode = oForm.vldcode.value;
    }	*/
	
	$("#submitbtn").attr("disabled",true);

	// save to cookie
	Cookie.set({"lang": sLang}, 360);
	saveRemember(oData);
	disableBtn ("login_button");

	////{{ local start
	//window.localRun=true;
//	alert(window.localRun);
	if(window.localRun)
	{
		//var sMenu = $("#product_list").val();
		//sMenu = "60" //wireless
		//window.location = BASE_URL + "wnm/frame/index.php?sessionid=abc1234&menu="+sMenu;
		window.location = BASE_URL + "wnm/frame/home.html";
		return false;
	}
	////}}

	// �·���¼����
	$.ajax({
		url: getDynUrl("frame/login.json"),
	//	url: "/portal_customer/get",
	//	url:"http://h3crd-wlan1.chinacloudapp.cn/portal_app/auth?username=aaa&password=bbb",
		dataType: "json",
		data: oData,
		//type:"post",
		success: function(oResult){
			onLoginEnd(oResult);
			enableBtn ("login_button");
		},
		error: function(){
			onAjaxErr();
			enableBtn ("login_button");
		}
	});

	return false;
}

function saveRemember(oData)
{
	var sUserName = oData.user_name;
	if($("#remember_user").hasClass("checked"))
	{
		Cookie.set({username: sUserName, remember:"true"}, 14);
	}
	else
	{
		Cookie.del("username");
		Cookie.del("remember");
	}
}

function loadRemember()
{
    /* �ϴε�¼��ס�˵�¼״̬,�ü�ס�ĵ�¼��Ϣ��ʼ���û��� ���� */
    var sUserName = Cookie.get("username");
    if(sUserName)
    {
        $("#user_name").val(sUserName);
    }
    var sRemember = Cookie.get("remember");
    if(sRemember)
    {
    	$("#remember_user").addClass("checked");
    }
}

// ��ʾloginҳ��
function showLogin()
{
	/*function _showLoginPage(vcode)
	{
	//	Banner.hide();
		//验证码显示
		/!*if ("true" == vcode)
		{
			refreshVCode ();
			$("#vcode_cnt").show();
		}*!/

	//	PageText.changeLanguage(PageText.curLang, "login_div");
		$("#user_name").focus();

		loadRemember();
	}*/
	$("#user_name").focus();
	loadRemember();
	// HTTPS����: ��ʼ�Զ���¼, ��¼�ɹ��Ļ�����ת����ҳ��, ������ʾ��¼ҳ��
	$.ajax({
		url: getDynUrl("frame/login.json"),
		dataType: "json",
		data: {ssl:getQueryPara("ssl", "true"),lang:PageText.curLang},
		success: function(oLoginResult)
		{
			if (oLoginResult.message!="ok")
			{
				// �Զ���¼ʧ��, ��ʾ��¼ҳ��
				//_showLoginPage(oLoginResult.vcode);
				$("#user_name").focus();
				loadRemember();
			}
			/*else if (oLoginResult.changePswd)
			{
				// ��¼�ɹ�, ��̨�᷵��һ����ת��URL
				showPswdDlg(oLoginResult);
			}*/
			else
			{
				// ��¼�ɹ�, �Ҳ���Ҫ�޸�����, ֱ�ӽ�����ҳ��
				window.location = BASE_URL + "wnm/frame/home.html";
			}
		},
		error: onAjaxErr
	});
}

/*function onInitContent()
{
    $("#logo").attr("src", OEM_BASE+g_oDeviceInfo.oem+"/images/logo-login.png");
}*/

/*function bindPlaceholder()
{
	$("#loginform").find(".text_lang").each(function(i)
	{
		if(("INPUT" == this.tagName)&&("text" == this.type)||("password" == $(this).parent(".label-pwd")))
		{
            $(this).bind("focus",function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                    if("password" == $(this).parent(".label-pwd"))
                    {
                        $(this).attr("type","password");
                    }
                }
            }).bind("blur",function() {
                var input = $(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder');
                    if("password" == this.type)
                    {
                        $(this).attr("type","text")
                    }
                    input.val(input.attr('placeholder'));
                }
            }).blur();
        }
    });
}*/

/*function bindChangeLang()
{
	$("#change_lang a").bind("click", function()
	{
		$("#lang_contrainer .dropdown-toggle").dropdown('toggle');
	    var sLang = $(this).attr("data");
		PageText.changeLanguage(sLang, "login_div");
		$("#user_name").focus(); 
		return false;
	});
}*/
/*function bindRefreshVCode()
{
	$("#refresh_vcode").bind("click", function(){refreshVCode();return false;});

}*/

/*function bindRememberCheckbox()
{
	$("#remember_user").bind("click", function(){$(this).toggleClass("checked")});

}*/
// ҳ���ʼ��
function onPageInit()
{
	PageText.curLang = getLanguage();
//	Banner.show() ;
//	showLogin();
//	onInitContent();
//	resetTreePara();
    // bindPlaceholder();
//    bindChangeLang();
//	bindRefreshVCode();
//    bindRememberCheckbox();
    $("#loginform").on("submit", onLoginSubmit);
}

function initLanguage()
{
	PageText.curLang = getBrowserLanguage();
}

function checkBroswer()
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

    if(bIsIE && ver == 8)
    {
    	$("#loginform input").keydown(function(e){
    		if(e.keyCode == 13)
    		{
    			$("#loginform").submit();
    		}
    	});
    }
}

/*function getConfig(pfCallback)
{
	$.ajax({
		url: getDynUrl("check.j"),
		dataType: "json",
		success: function(oDevInfo)
		{
			g_oDeviceInfo = oDevInfo;
			_loadScript (OEM_BASE+oDevInfo.oem+"/config.js", pfCallback);
		},
		error: onAjaxErr
	});
}*/

/*function getConfig(pfCallback)
{
	$.ajax({
		url: getDynUrl("check.j"),
		dataType: "json",
		success: function(oDevInfo)
		{
			g_oDeviceInfo = oDevInfo;
			_loadScript (OEM_BASE+oDevInfo.oem+"/config.js", pfCallback);
		},
		error: onAjaxErr
	});
}*/

function onMyLoad()
{
	initLanguage();
	checkBroswer();
	//getConfig(onPageInit);
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
