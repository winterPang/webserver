var g_oDeviceInfo = {};
var BASE_URL = "../../../";
var OEM_BASE = BASE_URL+"web/frame/oem/";

var PageText = {
	curLang: "en",
	cn:
	{
		net_err: "登录失败，请检查网络是否连通，或者%s服务是否启动"
	},
	en:
	{
		net_err: "Login in failed, please check your network, or the %s service is enable"
	}
}
$.MyLocale = {
	OEM:{}
};
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
function getCopyright()
{
    var sLang = $(".logout").attr("lang");

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
    
function onPageInit()
{
    $("#logo").attr("src", OEM_BASE+g_oDeviceInfo.oem+"/images/logo-login.png");
    getCopyright();
}
function onAjaxErr()
{
    var sLang = $(".logout").attr("lang");

	var sProtocal = window.location.protocol.replace(":", "").toUpperCase();
	var sMsg = PageText[sLang]["net_err"].replace("%s", sProtocal);
	alert(sMsg);
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
function getConfig(pfCallback)
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
}

function onMyLoad()
{
	getConfig(onPageInit);
}

var Logout = function () {

    return {
        //main function to initiate the module
        init: function () 
        {
            // handleLogin();
            onMyLoad();
        }
    };

}();
