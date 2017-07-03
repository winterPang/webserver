/*******************************************************************************
 Copyright (c) 2011, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:frame.js
@ProjectCode: Comware v7
@ModuleName: Frame.Core
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description:��ܴ��������塣
@Modification:
*******************************************************************************/

(function($F){

function getRandomStr()
{
    var str = Math.random()+"";
    return str.substring(2);
}
var _rid;

var _jsCache = {
    _list:{},
    get: function(sJsFile)
    {
        var sKey = sJsFile.replace(/\.\.\//g, "");
        return _jsCache._list[sKey];
    },
    add: function(sJsFile, cb)
    {
        var sKey = sJsFile.replace(/\.\.\//g, "");
        var oCache = {
            status: "loading", 
            file: sJsFile,
            cb:[]
        };

        cb && oCache.cb.push(cb);
        _jsCache._list[sKey] = oCache;
        return oCache;
    },
    addCb: function(oCache, cb)
    {
        oCache.cb.push(cb);
    },
    exec: function(oCache)
    {
        var aFunc = oCache.cb;
        oCache.status = "ok";
        oCache.cb = [];
        for(var i=0; i<aFunc.length; i++)
        {
            aFunc[i](oCache.file);
        }

        Frame.Debuger.info("loaded of " + oCache.file);
    },
    remove: function(sJsFile)
    {
        if(_jsCache._list[sJsFile])
        {
            delete _jsCache._list[sJsFile];
        }
    }
};

function _loadScript(sJsFile, cb)
{
    var oJsCache = _jsCache.get(sJsFile);
    if(oJsCache)
    {
        _jsCache.addCb(oJsCache, cb);
        if("ok" == oJsCache.status)
        {
            Frame.OS.thread("_loadScript", function(){_jsCache.exec(oJsCache);});
        }
        // has been loaded
        Frame.Debuger.info("loadjs: cache of " + sJsFile);
        
        return ;
    }

    oJsCache = _jsCache.add(sJsFile, cb);

    var obj = document.body ? document.body : document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.setAttribute('src', sJsFile);
    obj.appendChild(script);

    if(document.all) 
    {
        script.onreadystatechange = function() 
        {
            if(this.readyState == 'complete' || this.readyState == 'loaded') 
            {
                _jsCache.exec(oJsCache);
            }
        };
    }
    else 
    {
        script.onload = function() 
        {
            _jsCache.exec(oJsCache);
        };
    }
}
// $.getScript = _loadScript;
$.loadScript = _loadScript;

/*
key="init", "destroy", ...
_fnList = {
	module1:
	{
		init: [fn1, fn2],
		destroy: [fn1, fn2]
	}
	module2:
	{
		init: [fn1, fn2],
		destroy: [fn1, fn2]
	}
}
*/
var EM = 
{
	_fnList: {},
	reg: function(module, key, fn)
	{
		var oModule = this._fnList[module]||{};
		oModule[key] = oModule[key] || [];
		oModule[key].push(fn);
		
		this._fnList[module] = oModule;
	},

	unreg: function(module, key)
	{
		if(!key)
		{
			delete this._fnList[module];
		}
		else
		{
			delete this._fnList[module][key];
		}
	},
	notify: function(module, key, options)
	{
		var oThis = this;
		if("all" == module)
		{
			$.each(this._fnList, function(m)
			{
				oThis.notify(m,key,options);
			});
			return;
		}
		
		var oModule = this._fnList[module] || {};

		if(!key)
		{
			for(var key in oModule)
			{
				this.notify(module, key, options);
			}
			return;
		}

		var list = oModule[key] || [];
		var fnList = [];
		$.merge(fnList, list);

		$.each(fnList, function(i,fn)
		{
			if(false === fn(options))
			{
				return false;
			}
			return true;
		});
	}
};

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
            date.setTime(date.getTime() + n*60000);
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
    },
    clear: function()
    {
        var date = new Date();
        date.setTime(date.getTime() - 10000);

        // cookies are separated by semicolons
        var aCookie = document.cookie.split("; ");
        for (var i=0; i < aCookie.length; i++)
        {
            // a name/value pair (a crumb) is separated by an equal sign
            var aCrumb = aCookie[i].split("=");
            var sCookie = aCrumb[0] + "=d; path=/; expires=" + date.toGMTString();
            document.cookie = sCookie;
        }
    }
}
Frame.Cookie = Cookie;

function _initShortcut()
{
    function onLogout()
    {
        Frame.Msg.confirm($.MyLocale.LOGOUT_CONFIRM, function(){Frame.logout();});
        return false;
    }

    function onSettings()
    {
        //$("#maincontent .content-view").load("../debuger.html");
    }

    function onSave ()
    {
        Frame.Msg.confirm($.MyLocale.SAVE_CONFIRM,function(){
            var hWait = Frame.Msg.wait($.MyLocale.SAVING);
            Utils.Request.saveCfg(null, false,
                function(){hWait.close();},
                function(sErrType, msg)
                {
                    hWait.close(); 
                    Frame.Msg.error(msg);          
                }
            );
        });   
    }

    var aFunctions = {
        "tbarSave": onSave,
        "tbarSavePhone": onSave,         
        "tbarLogout": onLogout,
        "tbarLogoutPhone": onLogout,
        "tbarSetting": onSettings
    };

    for(var btn in aFunctions)
    {
        var jBtn = $("#"+btn);
        jBtn.click(function(e) 
        {
            aFunctions[this.id].call(this, e);
            return false;
        });
    }

    $("#change_language")
        .on("mouseover", function(){$(this).addClass("hover");})
        .on("mouseout", function(){$(this).removeClass("hover")})
        .find("select")
        .change(function(e)
        {
            var jEle = $(this);
            var sLang = jEle.val(); //attr("data");

            jEle.parent().find(".active").removeClass("active");
            jEle.addClass("active");
            $('#frame_top .dropdown-toggle').dropdown('toggle');
            Frame.Custom.changeLanguage(sLang);
        }).click(function(e)
        {
        	e.stopPropagation();
        });

    $("#change_password").click(function(e)
    {
        Utils.Base.openDlg("wdashboard.changepassword", {}, {className:"modal-large"});
        return false;
    });
}

$.extend(Frame,
{
	ver: "7.0.0",
	name: "Frame",


/*****************************************************************************
@FuncName: public, Frame.include
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: ����ṩ�İ���JS�Ľӿڣ�����HTML�е�script��ǩ��
    �ýӿ�ʹ�ñ�Σ���һ������Ϊģ�����������JS LIB���ƣ���JS�ļ����ڵ�Ŀ¼�ĵ�ֱ�ʾ������
    ���������JS�ļ�ʱ���������е�JS�ļ������ڵڶ���������ʹ�÷ֺŷֿ���Ҳ����ʹ�ö��������
    ÿ������Ϊһ��JS�ļ��������ͬһ����ļ�����һ�������У�����ά����
    <P>�ýӿڻ��������������ָ����JS�ļ��������е�JS�ļ�������ɹ��󣬻��������ģ�鷢��init�¼�֪ͨ��
    ��ҳ������ע���Լ���init�¼���������ʼ���Լ���ҳ�档
@Usage: 
    ��ֻ��һ��JS�ļ�ʱ��ʹ���ļ�����Ϊģ����,��ʱֻ��һ���������ɣ�
    Frame.include("Pages.Systime.Summary")
    ��ʱģ����ΪPages.Systime.Summary��������JSΪPages/Systime/Summary.js
    
    ģ�������ļ�����ͬ�������
    Frame.include("Systime.Summary", "Pages.Systime.Summary");
    ��ʱģ����ΪSystime.Summary��������JSΪPages/Systime/Summary.js
    
    �������JS�ļ��������
    Frame.include("Systime.Summary", "Pages.Systime.Summary;Pages.Systime.Create;Libs.Frame.Dialog");
    ��ʱģ����ΪSystime.Summary������������JS�ļ����ֱ�Ϊ
    pages/systime/summary.js
    pages/systime/creaet.js
    libs/frame/dialog.js
    
    ��������ļ�Ҳ����ʹ�ö�������ķ���, �ӵڶ���������ʼ, ÿһ����������һ������JS:
    Frame.include("Frame.Menu",
        "Libs.Plugin.Layout",
        "Libs.Plugin.Validate",
        "Libs.Plugin.SpinBtn",
        "Libs.Plugin.Tooltip",
        "Libs.Plugin.Flot.Flot;Libs.Plugin.Flot.Pie",
        "Libs.Plugin.JqGrid",
        "Libs.Frame.Menu;Libs.Frame.Effect;Libs.Frame.Dialog",
        "Libs.Frame.Debuger",
        "Oem.Default.Config");
@ParaIn: 
    * sModuleName - string, ģ�����������Լ����壬 �����ܺ������˵��ظ�������ʹ��·������Ϊģ������
    ���Ա�֤�϶�������������ظ���
    * libs - string, LIB·��, ��JS�ļ���·����������libsĿ¼�µģ� Ҳ�������Լ�Ŀ¼�µ��ļ���
    ��Libs.Frame.Dialog��Pages.Vlan.Summary�����������JS�ļ�ʱ��ʹ�÷ֺŸ���
@Return: void.
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    include: function(opt, libs)
    {
        var aLibs = [];
        var iIndex = 0;

        // ��������˱�̬�ļ�������ʱ��Ҫ��URL������һ�������
        var sCachPara = (true===MyConfig.config.cachePage) ? "" : "?u="+Frame.get("rid");

        if(typeof(opt)=="string")
        {
            opt = {module: opt, para:{}};
        }

        var sModuleName = opt.module;
        var oPara = opt.para;

        function end()
        {
            EM.notify(sModuleName, "loaded", oPara);
            opt.cb && opt.cb();
        }

        // get JS files;
        function loadOneJs()
        {
            if(aJsFiles.length == iIndex)
            {
                end();
                return;
            }

            var sJsFile = aJsFiles[iIndex];
            Frame.Debuger.info("loadjs - "+sJsFile);
            $.loadScript(sJsFile, loadOneJs);
            
            // for next JS file
            iIndex ++;
        }
        
        function _loadJs(aJsFiles)
        {
            var nCount = aJsFiles.length;
            function loadEnd()
            {
                nCount --;
                if(nCount==0)
                {
                    end();
                }
            }
            
            for(var i=0; i<aJsFiles.length; i++)
            {
                var sJsFile = aJsFiles[iIndex];
                Frame.Debuger.info("loadjs - "+sJsFile);
                $.loadScript(sJsFile, loadEnd);
            }
        }

        // ׼��JS�ļ��б�
        if(!libs)
        {
            libs = sModuleName;
            aLibs = libs.split(";");
        }
        else for(var i=1; i< arguments.length; i++)
        {
            $.merge(aLibs, arguments[i].split(";"));
        };

        var aJsFiles = [];
        for(var i=0; i<aLibs.length; i++)
        {
            var sLib = aLibs[i];
            var sRoot = MyConfig.root||"/"; // ���������Ǻ��Ĵ���, ����ʹ��Frame.Util.getUrlPath��װȫ·��
            var sPath = sLib.replace(/^Libs\./,"frame/libs/").replace(/\./g, "/")+".js"+sCachPara;
            var sJsFile = sRoot + sPath;
            aJsFiles.push(sJsFile.toLowerCase());
        }

         loadOneJs(); // ͬ��load
        // _loadJs(aJsFiles); // �첽load
    },

/*****************************************************************************
@FuncName: public, Frame.regNotify
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: �¼�֪ͨע��ӿڡ�V7�����ʹ���¼����ƴ���ϵͳ�е��첽������
	��ҳ�����ע���Լ����ĵ��¼����д������õ��¼�����ҳ��ĳ�ʼ��init��
	ҳ������destroy��ҳ�������JS�ļ���ע���������¼���
@Usage: 
	��ο� Frame.notify
@ParaIn: 
	* sModule - string, ģ�����������Լ����壬 �����ܺ������˵��ظ�������ʹ��·������Ϊģ������
	���Ա�֤�϶�������������ظ���
	* sEvent, string, �¼�����
	* fn, Function, �¼�������
@Return: boolean, �ɹ�ʱ����true�����򷵻�false
@Caution: 
@Modification:
	* yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
	regNotify: function(sModule, sEvent, fn)
	{
		return EM.reg(sModule, sEvent, fn);
	},

/*****************************************************************************
@FuncName: public, Frame.unregNotify
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: ȡ���¼�ע�ᣬ ��Frame.regNotify�෵��
@Usage: ȡ����ģ�������е�ע�᣺
	var MODULE_NAME = "Pages.Systime.Summary";
	Frame.unregNotify(MODULE_NAME);
	
	ȡ����ʼ����ע�᣺
	Frame.unregNotify(MODULE_NAME, "init");
@ParaIn: 
	* sModule - string, ģ������
	* sEvent - string, �¼����ơ�
	* fn - Function, �¼��Ĵ������������ָ�����ע����¼�������ע��Ĵ�������
		�ݲ�֧�ָò���
@Return: boolean, �ɹ�ʱ����true�����򷵻�false
@Caution: 
@Modification:
	* yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
	unregNotify: function(sModule, sEvent, fn)
	{
		return EM.unreg(sModule, sEvent, fn);
	},

/*****************************************************************************
@FuncName: public, Frame.notify
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: �¼��첽֪ͨ�ӿڡ�����֪ͨ���������ء�һ���ɿ�ܻ�ؼ����ã���ģ��ע����Ӧ����
@Usage: �ڿؼ��е��ã�
	var oPara = {para1:true,para2:"abc"};
	Frame.notify("Libs.Frame.Dialog", "close", oPara);
	
	���ҳ����Ҫ��֪�Ի���رգ��Ϳ�����ע��Ի����close�¼���
	Frame.regNotify("Libs.Frame.Dialog", "close", function(oPara)
	{
		var p1 = oPara.para1;   // true
		var p2 = oPara.para2;   // "abc";
	});

	�ڲ�ʹ�õ�ʱ��ע��ȡ����
	Frame.unregNotify("Libs.Frame.Dialog", "close", function(){});
@ParaIn: 
	* sModule - string, ģ������
	* sEvent - string, �¼����ơ�
	* opt - JSON, ֪ͨ������
@Return: ��
@Caution: 
@Modification:
	* yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
	notify: function(sModule, sEvent, opt)
	{
		EM.notify(sModule, sEvent, opt);
		return true;
	},
	
/*****************************************************************************
@FuncName: public, Frame.notifyAndWait
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: �¼�ͬ��֪ͨ�ӿڡ�����֪ͨ��ȴ����д����ߴ�����ɺ��ٷ��ء�һ���ɿ�ܻ�ؼ����ã���ģ��ע����Ӧ����
@Usage: �ڿؼ��е��ã�
	var oPara = {para1:true,para2:"abc"};
	Frame.notify("Libs.Frame.Dialog", "close", oPara);
	
	���ҳ����Ҫ��֪�Ի���رգ��Ϳ�����ע��Ի����close�¼���
	Frame.regNotify("Libs.Frame.Dialog", "close", function(oPara)
	{
		var p1 = oPara.para1;   // true
		var p2 = oPara.para2;   // "abc";
	});

	�ڲ�ʹ�õ�ʱ��ע��ȡ����
	Frame.unregNotify("Libs.Frame.Dialog", "close", function(){});
@ParaIn: 
	* sModule - string, ģ������
	* sEvent - string, �¼����ơ�
	* opt - JSON, ֪ͨ������
@Return: ��
@Caution: 
@Modification:
	* yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
	notifyAndWait: function(sModule, sEvent, opt)
	{
		return EM.notify(sModule, sEvent, opt);
	},

/*****************************************************************************
@FuncName: public, Frame.init
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: Called by frame
@Usage: 
@ParaIn: 
@Return: ��
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    init: function()
    {
        // �ж��Ƿ��ǺϷ���¼������
       /* if(!FrameInfo || ("true" != Cookie.get(FrameInfo.sessionid)))
        {
            alert(FrameInfo.sessionid);
            window.location = MyConfig.root;
            return false;
        }*/

        _initShortcut();
        MenuSwitch.init ();
        Theme.init();
        MyLayout.init();

        Frame.Custom.onLanguageChanged(Cookie.get("lang")||"cn");
    },

    logout: function()
    {
        /*Frame.Ajax.disable();
        $.ajax({
            cache: false,
            dataType: "json",
            type: "POST",
            url: Frame.Util.getDynUrl("logout.j"),
            success: function(oJson, sCode)
            {
				var sUrl = ("true" === oJson.autoLogin) ? "../" : "frame/[lang]/logout.html";
				window.location = Frame.Util.getPathUrl(sUrl);
            },
            error: function(oHttp, sDesc, oExcept)
            {
				var sUrl = "frame/[lang]/logout.html";
				window.location = Frame.Util.getPathUrl(sUrl);
            },
            complete: function()
            {
				Cookie.del(Frame.get("sessionid"));
			}
        });*/
        $.cookie("current_menu","");
        window.location = MyConfig.path+"/logout";
    },

    getHelpPanel: function(para)
    {
        NewPage.init(para);
        return NewPage;
    },

    resize: function()
    {
        Frame.notify("all", "resize");
    },

/*****************************************************************************
@FuncName: public, Frame.get
@DateCreated: 2011-07-26
@Author: huangdongxiao 02807
@Description: ��ȡȫ����Ϣ
@Usage:
    Frame.get("sessionid");
    Frame.get("lang", "en");
    Frame.get("username");
    Frame.get("password");
@ParaIn:
    * sKey - string, �����֣�֧�����¼���
        <li>sessionid����ȡ�û�ID�ַ���
        <li>rid����ȡ�������ÿ�ε�¼�󶼻��������һ���ַ������ô��ڱ��ε�¼�ڼ䲻�䡣
            ��Ҫ����׷�ӵ���̬URL���棬��ֹ��������档��ҳ��һ�㲻��Ҫ�õ�
        <li>lang����ȡ��ǰ�����ַ���
        <li>username����ȡ��ǰ��¼�û����û���
        <li>product����ȡ��ǰ��Ʒ����
        <li>sysoid����ȡ��ǰ��ƷOID
        <li>theme����ȡ��ǰ��Ƥ������
        <li>idletime����ȡ��ǰ��web��ʱʱ��
    * default - void, ȱʡ����ֵ, ����ȡ�Ĳ���������ʱ���ظ�ֵ�����Բ�ָ����
@Return: void, ��ȡ����ֵ�����ص����͸��������ֵĲ�ͬ����ͬ.
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    get: function(sKey, defvalue)
    {
        switch(sKey)
        {
        case "sessionid":
            return FrameInfo.sessionid;
        case "mdcid":
            return FrameInfo.vid || defvalue;
        case "rid":
            return _rid||(_rid=getRandomStr());
        case "lang":
            return $.MyLocale.Lang;
        case "username":
            return FrameInfo.uname;
        case "theme":
            return ThemeConfig.name;
        case "SkinPath":
            return Frame.Util.getPathUrl("frame/libs/css/");
        case "mainheight":
            return $("#maincontent").height();
        case "devname":
            return FrameInfo.devname;
        case "sysoid":
            return Server._cach["entity"]["VendorType"] || defvalue;
        case "SerialNumber":
            return Server._cach["entity"][sKey] || defvalue;
        case "DeviceType":
            return Server._cach["entity"]["Model"] || Server._cach["entity"]["Name"] || defvalue;
        case "sysname":
        case "idletime":
            return Server._cach[sKey] || defvalue;
        case "oem":
            return FrameInfo.oem;
        default:
            return (defvalue===undefined) ? "not-support" : defvalue ;
        }
    },
    set: function (sKey, val)
    {
        var bRet = false;
        switch(sKey)
        {
        case "sysname":
            $("#sysname").html(val).attr("title", val);
            Server._cach[sKey] = val;
            break;
        case "idletime":
            Server._cach[sKey] = val;
            break;
        default:
            bRet = false;
            break;
        }
        return bRet;
    }
});

/*****************************************************************************
@typedef: ListString
@DateCreated: 2012-05-09
@Author: huangdongxiao 02807
@Description: �б��ַ������Զ��ŷָ���ö���ַ���������һ�����顣����б��ö��ֵ������0��ʼ��������
    �����ʹ�����������壬�������ʽΪ[{value:value1, text: text1},{}]������{value1:text1,value2:text2}��
    Ҳ������һ��js��������ʱ��Ҫ���ط�������������ö���ַ����������顣
    <p>�б��ַ������ڶ����б���ö���е�������������б༭���߸߼���ѯʱ�����������ʽ��ʾ�����������û�ѡ��
    <h3>�����б�</h3>
    <li><a href="#Frame.ListString.format">format</a>
    <li><a href="#Frame.ListString.getTextByValue">getTextByValue</a>
@Usage:
//�ַ�����ʽ
var sList = "Up,Down";

//�������ʽ
var aList = ["emergencies","alerts","critical","errors","warnings","notifications","informational","debugging"];

//�Զ��������ʽ��ע��isDefault����Ĭ����false��һ��������ֻ����һ����true
var aList = [{value:4, text:"Down", isDefault:true}, {value:2, text:"Up"}];
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*******************************************************************************/
var ListString =
{

/*****************************************************************************
@FuncName, public, Frame.ListString.format
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: �����б���б༭������
@Usage:
//�ַ�����ʽ���м��Զ��ŷָ��������ڴ�0��ʼ��ö��ֵ
var sList = "emergencies,alerts,critical,errors,warnings,notifications,informational,debugging";
Frame.ListString.format(sList);

//�������ʽ��ʵ��ֵ��1��ʼ��ö��ֵ
var aList = ["emergencies","alerts","critical","errors","warnings","notifications","informational","debugging"];
Frame.ListString.format(aList, {start:1});

//�Զ��������ʽ���������������е�ö��ֵ
var aList = {"0":"emergencies", "1":"alerts", "2":"critical", "3":"errors", "4":"warnings",
             "5":"notifications", "6":"informational", "7":"debugging"};
Frame.ListString.format(aList);

//��׼��ʽ��
var aList = [
    {value:0, text:"emergencies"},
    {value:1, text:"alerts"},
    {value:2, text:"critical"},
    {value:3, text:"errors"},
    {value:4, text:"warnings"},
    {value:5, text:"notifications"},
    {value:6, text:"informational"},
    {value:7, text:"debugging"}
];
Frame.ListString.format(aList);
@ParaIn:
    * listStr, String, ��Ҫ��ʽ�����ַ���
@Return: Array, ����һ����׼��ʽ������
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    format: function(listStr, opt)
    {
        var listData = listStr;

        opt = $.extend({}, {displayField: "text", valueField: "value"}, opt);

        if($.isFunction(listStr))
        {
            listData = listStr();
        }

        var nStart=0, listItems=listData;
        var sValKey = opt.valueField;
        var sDispKey = opt.displayField;

        if ( $.isPlainObject(listData) && (listData.items))
        {
            nStart = listData.start || nStart;
            listItems = listData.items;
        }

        if("string"==typeof(listItems))
        {
            listItems = listItems.split(",");  //.split(/[,;]/);
        }

        // �ַ����±��ʽת��Ϊ�����±�ĸ�ʽ
        // {value1: text1, value2:text2} -> [{value:value1,text:text1},{value:value2, text:text2}].
        if($.isPlainObject(listItems))
        {
            var aList = [];
            for(var k in listItems)
            {
                var oData = {}
                oData[sValKey] = k;
                oData[sDispKey] = listItems[k];
                aList.push(oData);
            }
            return aList;
        }

        // listStr�϶�������
        var nLen = listItems.length;

        // û������, ֱ�ӷ���
        if(0 == nLen)
        {
            return listItems;
        }

        // �Ѿ�����ȷ�ĸ�ʽ, ֱ�ӷ���
        if($.isPlainObject(listItems[0]))
        {
            return listItems;
        }

        // �������ַ�������, ��Ҫת��Ϊ {value: xx, text: xxx}
        // �����豸�Ϸ��ص����ݶ����ַ������ͣ����valueҲ��Ҫ���ַ������͡�
        var aList = [];
        for(var i=0; i<listItems.length; i++)
        {
            var oData = {}
            oData[sValKey] = i+nStart+"";
            oData[sDispKey] = listItems[i];
            aList[i] = oData;
        }
        return aList;
    }

/*****************************************************************************
@FuncName, public, Frame.ListString.getTextByValue
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: �����б���б༭������
@Usage:
//�Զ��������ʽ���������������е�ö��ֵ
var aList = {"0":"emergencies", "1":"alerts", "2":"critical", "3":"errors"};
var aData = Frame.ListString.format(aList);
Frame.ListString.getTextByValue(aData, "2"); // return "critical"
@ParaIn:
    * listStr, String, ��Ҫ��ʽ�����ַ���
@Return: Array, ����һ����׼��ʽ������
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    ,getTextByValue: function (aData, value)
    {
        for(var i=0; i<aData.length; i++)
        {
            if(aData[i].value == value)
            {
                return aData[i].text;
            }
        }

        return "";
    }

/*****************************************************************************
@FuncName, public, Frame.ListString.each
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: �����б���б༭������
@Usage:
var sList = "emergencies,alerts,critical,errors,warnings,notifications,informational,debugging";
Frame.ListString.each(sList, function(val, text)
{
    aHtml.push(Frame.Util.sprintf("<option value='%d'>%s</option>", val, text));
});
@ParaIn:
    * listStr, String, ��Ҫ��ʽ�����ַ���
    * para1, Function/Object, ���ֻ��������������ò���Ϊ�ص������������������������ò���Ϊ����ѡ��
    * para2, �ص�����
@Return: Array, ����һ����׼��ʽ������
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    ,each: function (aData, para1/*optional*/, para2)
    {
        var opt={displayField: "text", valueField: "value"}, cb=para1;

        if(para2)
        {
            $.extend(opt, para1);
            cb = para2;
        }

        var aList = this.format(aData, opt);
        for(var i=0; i<aList.length; i++)
        {
            cb(aList[i][opt.valueField], aList[i][opt.displayField]);
        }

        return i;
    }
}
Frame.ListString = ListString;

/*****************************************************************************
@FuncName: class, Frame.Server
@DateCreated: 2012-02-09
@Author: huangdongxiao 02807
@Description:  �������(�豸)����������. ���ڴӷ������ϻ�ȡʱ��Ҫ�첽����, ���Ը�class�µ����нӿڶ���Ҫһ���ص�����
@Usage:
*****************************************************************************/
var Server = 
{
    // ������Ϣ
    _cach: {},

/*****************************************************************************
@FuncName: public, Frame.Server.get
@DateCreated: 2012-02-09
@Author: huangdongxiao 02807
@Description: ��ȡȫ����Ϣ
@Usage:
    function setIdleTime(nIdleTime)
    {
        nIdleTime = parseInt(nIdleTime);
        // ...
    }
    Frame.Server.get("idletime", setIdleTime, 10);
@ParaIn:
    * sKey - String, �����֣�֧�����¼���
        <li>idletime���ӷ������ϻ�ȡ��ǰ��web��ʱʱ��
    * cb - Function, ��ȡ�����ݺ��֪ͨ����. 
    * default - void, ȱʡ����ֵ, ����ȡ�Ĳ���������ʱ���ظ�ֵ�����Բ�ָ����
@Return: void, ��ȡ����ֵ�����ص����͸��������ֵĲ�ͬ����ͬ.
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    get: function(sKey, cb, defvalue)
    {
        var NC = Utils.Pages["Frame.NC"].NC_Frame;
        var oServer = this;
        var sPath;
        var oBase = Utils.Request.getTableInstance(NC.WebUI,{count:1});
        Utils.Request.getAll([oBase], {onSuccess: myCallback, menu:"FRAME"});

        function myCallback(oInfos)
        {
            var aBase = Utils.Request.getTableRows(NC.WebUI, oInfos);
            if(aBase.length == 0)return ;
            var val = aBase[0].SessionAgingTime;
            
            oServer._cach[sKey] = val;
            cb && cb (val);
        } 
        
        /*        
        switch(sKey)
        {
        case "sysname":
            oRequest.appendNode("Device").appendNode("Base").appendColumn("HostName");
            sPath = "Device.Base[0].HostName";
            break;
        case "entity":  // ȡ��һ�����յ�sysoid
            oRequest.appendNode("Device").appendNode("PhysicalEntities").appendNode("Entity")
                .appendColumn("Model,VendorType,SerialNumber,Model,Name").appendColumn("Class", "3");
            sPath = "Device.PhysicalEntities[0]";
            MyConfig.config.local && (sPath = "Device.PhysicalEntities[1]");
            break;
        
        case "idletime":
            oRequest.appendNode("Fundamentals").appendNode("WebUI").appendColumn("SessionAgingTime");
            sPath = "Fundamentals.WebUI[0].SessionAgingTime";
            break;
        default:
            return false;
        }
        */
        return true;
    }
} //// end of ToopTip
Frame.Server = Server;


/*
��ʱ�����ڲ����ݽṹ��
{
    name: String; ��ʱ�����ƣ�Ϊ���Զ�������Դ�������Ʋ����ظ�����������ظ�ʱ����Ϊ��reset���������������ϴεĶ�ʱ�����
    create_times: int; �����Ĵ��������ڵ���
    time_out: int; ��ʱʱ��
    wait_time: int; �ѵȴ���ʱ�䣬�����ʱ�䳬��time_outʱ�����ص���������
    loop: Boolean; �Ƿ���ѭ����ʱ��
    used: Boolean; �Ƿ����õı�ǡ�
    callback: Function; ��ʱ��Ļص������������ѭ����ʱ������ú�������falseʱ��ʱ������ֹ��һ�ζ�ʱ��ʱ����ֵ������
    paras: void; ���ݸ��ص������Ĳ������������������ͣ���ܲ���ʶ��ò���������
}
*/
var Timer = 
{
    _FREQUENCY: 10,
    _hTimer: false,
    _modules:{},
    _do: function()
    {
        for(var sName in Timer._modules)
        {
            var oTimer = Timer._modules[sName];
            if(!oTimer || !oTimer.used) continue;

            oTimer.wait_time += Timer._FREQUENCY;
            if(oTimer.wait_time < oTimer.time_out)
            {
                // ��û�е���ʱʱ��
                continue;
            }

            var ret = oTimer.callback(oTimer.paras);
            if(!oTimer.loop || (false === ret))
            {
                // һ���Զ�ʱ������ѭ����ʱ��������falseʱ����ֹ��ʱ��
                Timer.destroy(oTimer);
            }
        }
    },
    init: function()
    {
        if(this._hTimer)
        {
            clearInterval(this._hTimer);
        }

        // ��ʱ����
        //this._hTimer = setInterval(Timer._do, Timer._FREQUENCY);
    },

/*****************************************************************************
@FuncName: public, Frame.Timer.create
@DateCreated: 2011-11-01
@Author: huangdongxiao 02807
@Description: ������ʱ������ҳ����ʹ�ö�ʱ��ʱ��ֹʹ��setTimeout, setInterval������ʹ�ñ����������
@Usage: 
    var oTimer = false;

    // ����һ��1���ӵ�һ���Զ�ʱ��
    oTimer = Frame.Timer.create("sysinfo_cpu", function(){}, 1000);
    
    // ����һ��1���ӵ�ѭ����ʱ�����һص������д��в���
    oTimer = Frame.Timer.create("sysinfo_cpu", function(mypara)
    {
        if(1==mypara.id)
        {
        }
    }, 1000, true, {id:1});

    // ��ҳ���˳�ʱ��Ҫ��������
    if(oTimer)
    {
        Frame.Timer.destroy(oTimer);
    }
@ParaIn: 
    * sModule, string, ģ���������ڱ�ʾ���ĸ�ģ�����ҳ����õģ����㶨λ���⡣
    * pfAction, Function, ��ʱ����ʱ���ִ�к���������true or false��
        �����ѭ����ʱ�����򵱺������صĲ���trueʱ����ֹ��ʱ����
    * nTime, Integer, ��ʱ��ʱ�䣬����
    * bLoop, Boolean, true-ѭ����ʱ����false-��ѭ����ʱ��
    * para, void, ����pfAction�Ĳ���������ʹ��object���ʹ��ݶ�����ݡ�
@Return: �����Ķ�ʱ����������ʱҪ�á���ʱ��������һ���ṹ��������ҳ�����޸����е�����
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    _create: function(sModule, pfAction, nTime, bLoop, para)
    {
        var oTimer = this._modules[sModule];
        if(!oTimer)
        {
            oTimer = 
            {
                type: "Frame.Timer",
                name: sModule, //String; ��ʱ������
                pageid: "",     //String; ��ʱ��������ҳ���ID�󶨣��󶨺�ҳ�����ߺ�ͻ��Զ�����
                create_times: 0, //int; �����Ĵ��������ڵ���
                time_out: parseInt(nTime), //int; ��ʱʱ��
                wait_time: 0,   //int; �ѵȴ���ʱ�䣬�����ʱ�䳬��time_outʱ�����ص���������
                loop: (true===bLoop),    //Boolean; �Ƿ���ѭ����ʱ��
                used: true,     //Boolean; �Ƿ����õı�ǡ�
                callback: pfAction, //Function; ��ʱ��Ļص�������
                paras: para     //void; ���ݸ��ص������Ĳ������������������ͣ���ܲ���ʶ��ò���������
            };
            this._modules[sModule] = oTimer;
        }

        oTimer.create_times ++;
        this.reset(oTimer);
        return sModule;
    },
    create: function(sModule, pfAction, nTime, bLoop, para)
    {
        function _do()
        {
            oTimer.timer = false;
            
            var bContinue = pfAction(para);
            if ((true === bContinue) && (true === bLoop) )
            {
                oTimer.timer = setTimeout(_do, nTime);
            }
        }

        var oTimer = 
        {
            name: sModule,
            action: _do,
            time: nTime,
            loop: bLoop,
            timer: setTimeout(_do, nTime)
        };

        // ҳ���еĶ�ʱ����Ҫ�ȱ��浽DBM�У��ظ�����ʱ����ɾ����һ�ε�ʵ��
        if ( (0 == sModule.indexOf("Pages.")) && Frame.DBM)
        {
            var db = Frame.DBM.open("Frame.Timer", {openFlag:"read|write|create"});
            var oOldTimer = Frame.DBM.get(db, sModule, false);
            Timer.destroy(oOldTimer);           // ɾ���ɵĶ�ʱ��
            Frame.DBM.set(db, sModule, oTimer); // ��¼�µĶ�ʱ��
            Frame.DBM.close(db);
        }
        
        return oTimer;
    },

/*****************************************************************************
@FuncName: public, Frame.Timer.reset
@DateCreated: 2011-11-01
@Author: huangdongxiao 02807
@Description: ���ö�ʱ����ʹ�ö�ʱ�����¿�ʼ����ʱ�䡣
@Usage: 
@ParaIn: 
    * oTimer, Object, �����Ķ�ʱ������
@Return: ��
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    reset: function(oTimer)
    {
        if(!oTimer) return;

        if("Frame.Timer.2"==oTimer.type)
        {
            $.extend(oTimer, {
                wait_time: 0,   //int; �ѵȴ���ʱ�䣬�����ʱ�䳬��time_outʱ�����ص���������
                used: false     //Boolean; �Ƿ����õı�ǡ�
            });
            return;
        }

        if(oTimer.timer)
        {
            clearTimeout(oTimer.timer);
        }
        
        oTimer.timer = setTimeout(oTimer.action, oTimer.time);
    },
    
/*****************************************************************************
@FuncName: public, Frame.Timer.destroy
@DateCreated: 2011-11-01
@Author: huangdongxiao 02807
@Description: ���ٶ�ʱ����
@Usage: 
@ParaIn: 
    * oTimer, Object, �����Ķ�ʱ������
@Return: ��
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    destroy: function(oTimer)
    {
        if(!oTimer) return;

        if("Frame.Timer.2"==oTimer.type)
        {
            oTimer.used = false;
            return;
        }

        if(oTimer.timer)
        {
            clearTimeout(oTimer.timer);
            oTimer.timer = false;
        }
    }
} ////{{ end of Timer }}
Frame.DBM && Frame.regNotify("Frame.Pages", "destroy", function(opt)
{
    var sModule = opt.name;
    var db = Frame.DBM.open("Frame.Timer", {openFlag:"read|write"});
    if(!db) return;
    
    var oTimer = Frame.DBM.get(db, sModule, false);
    Frame.DBM.close(db);
    
    Timer.destroy(oTimer);

    Frame.DBM.del("Frame.Timer", sModule);
});
Frame.Timer = Timer;

var OS = 
{
    NAME: "OS",

/*****************************************************************************
@FuncName: public, Frame.OS.delay
@DateCreated: 2011-10-13
@Author: huangdongxiao 02807
@Description: ��ʱִ��һ��������
@Usage: 
    // ���崦����
    function doMyAction(oPara)
    {
        alert(oPara);
    }
    
    // ��ʹ�ò���
    var hDelay = Frame.OS.delay("mydelay", 1000, doMyAction);
    
    // ʹ�ü򵥲���
    var hDelay = Frame.OS.delay("mydelay", 1000, doMyAction, 1);

    // ʹ�ø��Ӳ���
    var hDelay = Frame.OS.delay("mydelay", 1000, doMyAction, {name:"hdx",flag:"test", id=3});
    
@ParaIn: 
    * sModule, String, ģ���������ڶ�λ����
    * nTime, Interger, ��ʱ��ʱ�䣬����
    * pfAction, Function, ִ�к���ָ��
    * para, any, �û���������͸����ִ�к�����
@Return: ����Ѿ�������,������̷���false,���򷵻�true
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    delay: function(sModule, nTime, pfAction, oPara)
    {
        return Timer.create(sModule+".Delay", pfAction, nTime, false, oPara);
    },
    
/*****************************************************************************
@FuncName: public, Frame.OS.cancelDelay
@DateCreated: 2011-10-13
@Author: huangdongxiao 02807
@Description: ȡ����ʱִ�У�delay�ķ�����������ĳһ��ʱ������δ����ʱ���Ե��øýӿ�ȡ����ִ�С�
@Usage: 
    // ���崦����
    function doMyAction(oPara)
    {
        alert(oPara);
    }
    
    // ��ʹ�ò���
    var hDelay = Frame.OS.delay("mydelay", 1000, doMyAction);
    
    function onCancelAction()
    {
        if(hDelay)
        {
            Frame.OS.cancelDelay(hDelay);
            hDelay = false;
        }
    }
@ParaIn: 
    * hDelay, Handle, ������ʱ����ʱ���صľ��
@Return: none
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    cancelDelay: function(hDelay)
    {
        if(false !== hDelay)
        {
            Timer.destroy(hDelay);
            hDelay = false;
        }
        return hDelay;
    },
    
/*****************************************************************************
@FuncName: public, Frame.OS.thread
@DateCreated: 2011-10-13
@Author: huangdongxiao 02807
@Description: ����һ���߳�
@Usage: 
    // ���崦����
    function doMyAction(oPara)
    {
        alert(oPara); // 1
    }
    
    // ��ʹ�ò���
    var hDelay = Frame.OS.thread("mymodule", doMyAction, 1);
@ParaIn: 
    * sModule, String, ģ���������ڶ�λ����
    * pfAction, Function, ������
    * oPara, paraList, �����������Ŀɱ�����б�
@Return: none
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    thread: function(sModule, pfAction, oPara)
    {
        return this.delay(sModule, 0, pfAction, oPara);
    }
}
Frame.OS = OS;

var Signal = 
{
    _NAME: "Frame.Signal",
    
/*****************************************************************************
@FuncName: private, Frame.Signal._create
@DateCreated: 2011-08-15
@Author: huangdongxiao 02807
@Description: �жϲ�����һ���ź���������Ѿ������򲻽��д�������������򴴽���
    �ź��������ݽṹΪ��
    <code>
            oSignal = 
            {
                name: sSignal,
                status: "waiting",
                cb: []
            }
    </code>
@Usage: 
    // �����ź�����
    var sSignalName = "Xxx.Xxx.Xxx";

    // �����ź���
    var oSignal = Signal._create(sSignal);
@ParaIn: 
    * sModule, String, ģ�������ڿؼ��п����ÿؼ������ƴ��档
    * sSignal, string, �ź������ƣ��ɸ������źŵĿؼ����壬����ʹ�ÿؼ���·������"Libs.Frame.Xxx"��
@Return: Signal, ���ָ�����ź����Ѵ��ڣ��򷵻ظ��ź�������
    ����������ȴ�����Ȼ���ٷ����´������ź�������
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    _create: function(sModule, sSignal)
    {
        var db = Frame.DBM.open(sModule, {openFlag: "read"});
        if(null == db)
        {
            db = Frame.DBM.open(sModule, {openFlag: "read|write|create"});
        }

        var oSignal = Frame.DBM.get(db, sSignal, false);
        if(false === oSignal)
        {
            oSignal = {title:this._NAME, name: sSignal,status: "waiting",cb: []};
            Frame.DBM.set(db, sSignal, oSignal);
        }

        return oSignal;
    },

    reset: function(sModule, sSignal)
    {
        var db = Frame.DBM.open(sModule, {openFlag: "read"});
        if(null == db)
        {
            // no database
            return false;
        }

        var oSignal = Frame.DBM.get(db, sSignal, false);
        if(false === oSignal)
        {
            // no data item
            return false;
        }

        if("isReady" == oSignal.status)
        {
            oSignal.status = "reset";
        }

        for(var i=0; i<oSignal.cb.length; i++)
        {
            Timer.destroy(oSignal.cb[i].timer);
        }
        
        return true;
    },

/*****************************************************************************
@FuncName: public, Frame.Signal.wait
@DateCreated: 2011-08-15
@Author: huangdongxiao 02807
@Description: �ȴ�һ���źŵ��һ����һ���������ڵȴ��ؼ���ĳһ�ź�ʱʹ�ã�
    Ҳ������һ���ؼ��еȴ�����һ���ؼ��е��źš�ÿ���źŶ���Ҫ��һ���ź����ƣ�
    �ź������Զ��崮��ʽ�ɸ������źŵĿؼ����壬�ȴ���ʹ�á�
    һ���źſ��ܻ��ж���˵ȴ����źŵ����ȴ��߻ᰴ��˳����д���
    ����ʱ���Է���false��ֹ������˵Ĵ������ȴ��ߴ������Լ��������������뿪��
    �����ٴ�������ready�¼���
    ����ڵȴ�ʱ�ź��Ѿ������ֱ�ӽ���ͬ����������ִ�еȴ�������
    �ڶ����ź�����ʱ����ʹ�ÿؼ���·������"Libs.Frame.Xxx"��
    <P>Ӧ�ó�������һ���ؼ��漰�����JS�ļ�ʱ�����Գ����һ����һ��JS�ļ��ɸ�ģ�������
    �ڸ�JS�ļ����Լ�����ȫ������Ҫ��JS�ļ��������ҳ������Ҫ��ʵ�ʵ�JS load��Ϻ���һЩ���飬
    ��ҳ������Ҫʹ�ÿؼ��ṩ���ź������еȴ���������onPanelFinished
@Usage: 
    // �����ź�����
    var sSignalName = "Libs.Frame.Xxx";

    //���崦����������������Ҫ����
    function _Signal_PlotReady()
    {
        Frame.Msg.Info("signal is ready: " + sSignalName);
    }
    
    // �ȴ��ź���
    Frame.Signal.wait(sSignalName, "mytest",  _Signal_PlotReady);
    
    // Ҳ����ʹ������������
    Frame.Signal.wait(sSignalName, "mytest",  function()
    {
        Frame.Msg.Info("signal is ready: " + sSignalName);
    });
@ParaIn: 
    * sModule, String, ģ�������Ǳ��ȴ�ģ���ģ�����������Լ�ģ���ģ������
    * sSignal, String, �ź������ƣ��ɸ������źŵĿؼ����壬����ʹ�ÿؼ���·������"Libs.Frame.Xxx"��
    * fn, Function, �ź��������Ĵ���������ʽΪ String function (bTimeout)��
    <p>������˵��:
    <li>paras<br>
    bTimeout, boolean, �Ƿ�ʱ. ��waitʱ��������˳�ʱʱ��,���ڳ�ʱ��Ҳ����õȴ�����,������Ϊtrue,�������������,�����Ϊfalse
    <li>return: "continue", ��Ҫ�����ȴ�, ��ʱ���������ᱻ���,��������ٴ�֪ͨready,�������ִ��һ�θô�����; 
        "ok", �Ѿ��������,��ʱ��������Ӵ�������б����,��������ٴ�֪ͨready,�������ٴ�ִ�иú���
    *iTimeout, integer, �ȴ���ʱʱ�䣬��λΪ�롣Ĭ��Ϊ0����ʾ������ʱ���ڸ�ʱ���������û�еȵ��źţ����Ժ��ٴ���
@Return: void
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    wait: function(sModule, sSignal, fn, iTimeout)
    {
        var oSignal = Signal._create(sModule, sSignal);

        Frame.Debuger.assert(oSignal, Frame.Util.sprintf("signal: %s not exist", sSignal));
        if("isReady" == oSignal.status)
        {
            // �ź��Ѿ�׼����,ֱ�ӵ��ô���������
            Frame.Debuger.info(sModule+": signal("+sSignal+") is ready, call function now");
            if("continue" != fn(false))
            {
                // �ȴ������Ѿ��������Լ�������, ֱ�ӷ���.
                return;
            }
            // else, �ȴ���������Ҫ�����ȴ�������źŽ��д���.
        }
        
        // �ź�û��׼����, ��Ҫ��������
        Frame.Debuger.info(Frame.Util.sprintf("%s: cache the signal - %s", sModule, sSignal));
        var hTimer = false;
        if(iTimeout > 0)
        {
            var iIndex = oSignal.cb.length;
            hTimer = Timer.create("Signal.wait", function()
            {
                // ��ʱ���еĵȴ�������û�д�����󲻼����ȴ�
                Frame.Debuger.info(Frame.Util.sprintf("%s: signal(%s-%s) is timeout.", Signal._NAME, sSignal, oSignal.cb[iIndex].title));
                oSignal.cb[iIndex].cb(true);
                oSignal.cb[iIndex] = null;
            }, iTimeout*1000);
        }
        oSignal.cb.push({cb:fn, title: sModule, timer: hTimer});
    },

/*****************************************************************************
@FuncName: public, Frame.Signal.waitVar
@DateCreated: 2013-07-04
@Author: huangdongxiao 02807
@Description: �ȴ�ĳһ����������ʱִ��ָ���ĺ�����
    һ����������ģ����ͬ������<a href=#Frame.Signal.wait">Frame.Signal.wait</a>�ļ��÷�
@Usage: 
    // �������
    var sMyName;
    
    // �ȴ�sMyName��ֵ��ִ��ָ���Ķ���
    Frame.waitVar(
        function(){return sMyName?true:false;},
        function(){alert(sMyName);}
    );

    // �Ӻ�̨��ȡ���ݣ�����ֵ��sMyName
    Frame.SRequest.getInstance("get", "1")
        .appendNode("Syslog").appendNode("LogHosts")
            .appendNode("Host")
                .appendColumn("Address", oData.Address)
    .root().get(function(){sMyName=this.Syslog.Host[0].Address;}
    
@ParaIn: 
    * pfReady, Function, wait�������жϺ���������trueʱ��������������ȴ���
        �����л�ѭ���жϣ���˸ú����ڵ�ʵ�ֲ�Ҫ�����򵥣������ֻ��һ�������жϡ�
    * pfExcute, Function, wait����ʱִ�еĶ������ú���û�в����������Ҫ�����߿����ȷ�װһ�¡�
@Return: void
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    waitVar: function(pfReady, pfExcute)
    {
        var hTimer = setInterval(function()
            {
                if(true===pfReady())
                {
                    clearInterval(hTimer);
                    pfExcute();
                }
            }, 10)
    },
    
/*****************************************************************************
@FuncName: public, Frame.Signal.ready
@DateCreated: 2011-08-15
@Author: huangdongxiao 02807
@Description: �����ź���ɡ����ؼ����źŵ���ʱ����Ҫ���øýӿ�֪ͨ�ȴ���ģ����д���
@Usage: 
    // �����ź�����
    var sSignalName = "Libs.Frame.Xxx";
    
    // ֪ͨ��ģ���ź��Ѿ�׼����
    Frame.Signal.ready(sSignalName);
@ParaIn: 
    * sSignal, string, �ź������ƣ��ɸ������źŵĿؼ����壬����ʹ�ÿؼ���·������"Libs.Frame.Xxx"��
@Return: void
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    ready: function(sModule, sSignal)
    {
        var oSignal = Signal._create(sModule, sSignal);
        Frame.Debuger.assert(oSignal, "signal not exist");

        // notify all the waiters
        Frame.Debuger.info(Frame.Util.sprintf("%s: signal(%s) is ready.", sModule, sSignal));
        var aWaitCb = [];
        $.each(oSignal.cb, function(i, oInfo)
        {
            if(null !== oInfo)
            {
                if(false != oInfo.timer)
                {
                    Timer.destroy(oInfo.timer);
                    oInfo.timer = false;
                }
                if( oInfo.cb && ("continue" == oInfo.cb(false)) )
                {
                    // �ȴ�����û�д���������, ��Ҫ�����ȴ���һ��ready
                    aWaitCb.push(oInfo);
                }
            }
        });
        
        // clear all the notify Callbacks
        oSignal.status =  "isReady";
        oSignal.cb = aWaitCb;
    },
    
/*****************************************************************************
@FuncName: public, Frame.Signal.remove
@DateCreated: 2011-08-15
@Author: huangdongxiao 02807
@Description: ɾ���ź�����һ���ò���
@Usage: 
    Frame.Signal.remove(sSignalName);
@ParaIn: 
    * sSignal, string, �ź������ƣ��ɸ������źŵĿؼ����壬����ʹ�ÿؼ���·������"Libs.Frame.Xxx"��
@Return: void
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    remove: function(sModule, sSignal)
    {
        Frame.DBM.del(sModule, sSignal);
    }
} // end of Signal
Frame.Signal = Signal;

/*****************************************************************************
@FuncName: class, Frame.Ajax
@DateCreated: 2011-08-15
@Author: huangdongxiao 02807
@Description: Web����ṩ��ajax�࣬�����װ��JQuery��ajax��������web�����ص�һЩ����
    Frame.Ajax��Ҫ��SRequest���ã���ҳ������������һ�㲻��Ҫʹ�á��������������ҳ�棬
    ʹ��ǰ����Ⱥ�web��ȷ��һ�¡�
@Usage: 
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
var Ajax = 
{
    _NAME: "Frame.Ajax",

/*****************************************************************************
@FuncName: public, Frame.Ajax.disable
@DateCreated: 2011-08-15
@Author: huangdongxiao 02807
@Description: ����ajax, �������豸����, �����˳���¼ʱ����ʹ�øú�����ֹ����������Ӱ��.
    ����һ��ȫ�ֵĲ��������øýӿں������ajax���ö�������Ч���ظ�����ʱֻ�е�һ����Ч
@Usage: 
    Frame.Ajax.disable();
@ParaIn: None
@Return: void
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    disable: function()
    {
        Ajax._disable = true;
    },

/*****************************************************************************
@FuncName: public, Frame.Ajax.enable
@DateCreated: 2011-08-15
@Author: huangdongxiao 02807
@Description: ʹ��Ajax���� <a href="Frame.Ajax.diable">Frame.Ajax.disable</a> �ķ��������
    �ظ�����ʱֻ�е�һ����Ч
@Usage: 
    Frame.Ajax.enable();
@ParaIn: None
@Return: void
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    enable: function()
    {
        Ajax._disable = false;
    },

/*****************************************************************************
@FuncName: public, Frame.Ajax.send
@DateCreated: 2011-08-15
@Author: huangdongxiao 02807
@Description: Ajax�·��ӿ�. ���ӿ�һ����������ҳ�洦����ʹ��XCMP�·��Ĳ���Ҫʹ�ñ��ӿڡ�
@Usage: 
    // ʹ��Ĭ��ѡ��
    Frame.Ajax.send(sUrl);

    var oAjax ;
    function getData()
    {
        // �Զ���ѡ��
        oAjax = Frame.Ajax.send(sUrl, {
            paras: {para1: 1, para2:"abc", para3:"test"}, 
            showMsg: false,
            onFailed: function(sErrType, sMsg)
            {
                if ("failed" == sErrType)
                {
                    // �豸�Ϸ�����ʧ��
                    Frame.Msg.alert(sMsg);
                    $("#apply_reboot").button("enable");
                }
            }
        });
    }

    function stopRequest()
    {
        if(oAjax)
        {
            oAjax.abort();
            oAjax = false;
        }
    }
@ParaIn: 
    * sUrl, String, �·���URL, ����Ϊ��
    * opt, AjaxOption, Ajax�·�����. ����Ϊ��
@Return: JQueryAjax, ����JQuery��Ajax���󡣿���ʹ��abort������ֹ�ѷ��͵�����
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    send: function(sUrl, option)
    {

/*****************************************************************************
@typedef: AjaxOption
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: AjaxĬ��ѡ��. �������г�����ѡ���⣬jquery��ajax������ѡ��(��ο�jQueryAPI.chm)������ʹ�á�
<span class="notice">ע�⣺</span> Web���������onComplete��onSuccess��onFailed�����¼�������
�ֱ����jQuery�е�complete��success��error����˽�ֹ��ҳ���option�д���jQuery�е�����������
<div id="onajaxfailed" class="key">��������</div>
Ajax�·�ʧ�ܺ�Ĵ�������ʧ�ܵ����������
    <ol>
    <li>set����ʱ��̨��������ö�����������û�гɹ�����ҵ�������ó�����
    <li>�û���ʱ��������Աͨ�������л��������ķ���free web user���ٲ���ҳ�����ʾ��ʱ�����ȷ������Զ�ת����¼ҳ�档
    <li>û��Ȩ�ޡ���û��setȨ�޵��û��·�set����ʱ�᷵�ظô���һ������ڵ��Խ׶Σ�����汾��Ӧ�ó��ָ���ʾ
    <li>����ʱ��������·�����ʱ��timeout���������ڳ�ʱ��Ҳ��֪ͨ���¼������ô���һ������ڸ߶Ƚ׶�
    <li>���粻ͨ�����������������޸�IP�ȵ������粻ͨʱ����֪ͨ
    </ol>
������ܻ���ȡ�����ַ��������ݸ�onFailed��
<div class="function-desc">
����ԭ�ͣ�function onFailed(sErrType, sErrMsg)<br>
����: 
    <li>sErrType, String, �������ͣ������¼����⻹�м����ڲ�ʹ����error, parseError�ȡ���ģ�������Ҫ�жϣ�
        ����ʹ�������жϣ���ֻ�ж��Լ����ĵ����ͣ������ĺ��Բ�����
        <ol>
        <li>failed, ҵ��ģ�����ô���
        <li>timeout, �ڳ�ʱʱ��������û�����
        <li>abort, �����ж�
        <li>deny, û��Ȩ��
        <li>logout, �˳���¼
        <li>disconnect, �����ж�
        <li>unknow, δ֪����
        </ol>
    <li>sErrMsg, String, �����Ĵ����ַ�����HTML��ʽ��
<div>����ֵ��None</div>
</div>
���������ô�������, sErrTypeΪfailed��
<pre class=code>{
    "rpc-error":[
    {
        "error-type":"application",
        "error-tag":"operation-failed",
        "error-severity":"error",
        "error-path":"/rpc/edit-config[1]/config[1]/top[1]/Ifmgr[1]/Interfaces[1]/Interface[3]/PVID[1]",
        "error-message":"����ʧ�ܡ�",
        "error-info":
        {
            "top":
            {
                "Ifmgr":
                {
                    "Interfaces":
                    {
                        "Interface":
                        {
                            "ConfigSpeed":"1000",
                            "ConfigDuplex":"2",
                            "VlanType":"1",
                            "PVID":"6",
                            "Index":"284",
                            "Shutdown":"0",
                            "Description":"test more port setup"
                        }
                    }
                }
            }
        }
    },
    {
        // �ڶ���������
        // ...
    }]
}</pre>
<p>�����������ô����⣬�����Ķ������쳣���������ݸ�ʽ�Ͳ���������ͬ��
    <ol>
    <li>this����ָ�������error-info�ṹ�������������ajax���󣬸�ģ�����ͨ���ö����ȡԭʼ����
    <li>�����ַ���һ��û�пɶ��ԣ���������ʾ���û�
    </ol>
<div id="onajaxsuccess" class="key">�ɹ��ص�����</div>
Ajax�·��ɹ���Ĵ�������û�в���������ͨ��this��ȡ��̨���ص����ݣ�get��set��ȡ�������ݸ�ʽ��ͬ��
        getʱ������һ�����·��Ľṹ��ͬ��JSON������
<pre class=code>
    {
        Syslog:
        {
            Logs:[
                {Time: "2012-07-03T17:38", Servery: 3, ...},
                {Time: "2012-07-03T12:31", Servery: 2, ...}
            ]
        }
    }
</pre>
        setʱ���ص�������һ�����ý��(ֻ��һ��ok��һ�㲻��Ҫ����)��
        <div class="function-desc">
        ����ԭ�ͣ�function onSuccess()<br>
        ����ֵ��None
        </div>
@fields:
    * showMsg - Boolean, ��ajax����������Ƿ��ɿ����ʾ��ʾ��Ϣ. Ĭ��ֵΪtrue.
    * role, String, ��ǰ�����Ȩ������, Ĭ����false,��������. ��ЧֵΪread, write, execute
    * menuId, String, ���������Ĳ˵�. ��roleһ���жϵ�ǰ�·���Ȩ��. ��Ȩ�޲���, ֱ��֪ͨ������, ���·����豸��. ��û�и�����ʱʹ�õ�ǰ�˵�
    * successMsg - String, �ɹ�ʱ����ʾ��Ϣ�ַ���. Ĭ������¿�ܻ���ʾһ������Ե��ַ���, 
        ���ĳҳ����Ҫ��ʾ���ַ���, ����ͨ�������Խ����޸�
    * failedMsg - String, ʧ��ʱ����ʾ��Ϣ�ַ���. Ĭ������¿�ܻ���ʾ�豸�Ϸ��ص��ַ���.
        ���ĳҳ����Ҫ��ʾ�������ַ���, ����ͨ�������Խ����޸�
    * paras, JSON, �·�����, ��ʽΪ{paraname: paravalue}
    * getErrMsg, Function, ��ȡRPC����������Ϣ. ���������ò���ʱ����̨�Ĵ������netconfЭ��ĸ�ʽ���أ���ܻ�ת��ΪJS����
        �����ñ��ӿڻ�ȡ�������Ӧ��������Ϣ��ͬ��̨���صĴ���һ����ʾ���û���<br>
        ����ԭ�ͣ�function(sXPath, oErrInfo)<br>
        ����ֵ��String,  ����ж�Ӧ�����������򷵻������ַ��������򷵻ؿմ����������ö˿ڵ�PVIDʱ�������Է���
        "���ö˿�Ethernet1/0/1��PVID����"���߷���"�˿�����Ethernet1/0/1, ������: PVID"��������ʾ���û�����ʾ���£�<br>
        <div class="dlg-alert">
        ����ʧ�ܡ�<br>
        �˿�����Ethernet1/0/1, ������: PVID
        </div>
    * onComplete - Function, �·���ɺ�Ļص�����, �����ֳɹ���ʧ��. ���¼�֪ͨ��, �Ի�֪ͨ�ɹ���ʧ�ܵ��¼�����
    * onSuccess - #onajaxsuccess/Function, �ɹ��ص��������·��ɹ�����á�
    * onFailed - #onajaxfailed/Function, ����ص��������·�ʧ�ܺ�ĵ��á�
@Modification:
    * yyyy-mm-dd: Author, add or modify something
    * 2011-07-27: �ƶ���, ����closeOnEscape����
*******************************************************************************/
        var opt = {
            // ����Զ������
            showMsg: true,
            role: false,
            successMsg: null,
            failedMsg: null,
            onGetErrMsg: onGetErrMsg,
            onComplete: $.noop,
            onSuccess: $.noop,
            onFailed: $.noop,

            // jquery��ajax����
            cache: false,
            dataType: "json",
            type: "POST",   
            url: sUrl,
            data: option ? option.paras : null,
            complete: option? option.onComplete : null,
            success: function(oJson, sCode)
            {
                var pfOutput = $.noop;
                var sMsg;
                var bSuccess = true;

                if(Ajax._disable) return;

                if (oJson.ok)
                {
                    sMsg = (opt.successMsg) ? opt.successMsg : $.MyLocale.SET_SUCCESS;
                    pfOutput = Frame.Msg.info;
                }
                else if (oJson.error)
                {
                    sMsg = (opt.failedMsg) ? opt.failedMsg : oJson.error;
                    pfOutput = Frame.Msg.error;
                    bSuccess = false;
                }
                else if (oJson["rpc-error"])
                {
                    var aRpcErr = oJson["rpc-error"];
                    if(aRpcErr.length>1)
                    {
                        pfOutput = Frame.Msg.merror;
                        sMsg = getRpcErr(aRpcErr);
                    }
                    else
                    {
                        pfOutput = Frame.Msg.error;
                        sMsg = (opt.failedMsg) ? opt.failedMsg : getRpcErr(aRpcErr)[0];
                    }
                    bSuccess = false;
                }
                opt.showMsg && pfOutput(sMsg);

                if(bSuccess)
                {
                    if("text" == opt.dataType)
                    {
                        opt.onSuccess.apply({}, [oJson, sMsg]);
                    }
                    else
                    {
                        opt.onSuccess.apply(oJson, [sMsg]);
                    }
                }
                else
                {
                    opt.onFailed.apply(oJson, ["failed", sMsg]);
                }
            },
            error: function(oHttp, sDesc, oExcept)
            {
                var pfOutput = Frame.Msg.error;
                var pfAfterClosed = false;
                var sMsg = "";
                var sErrType = "unknow";

                if(Ajax._disable) return;

                Frame.Debuger.info("[ajax] error, url="+opt.url);
                if(("abort" == sDesc)||("timeout" == sDesc))
                {
                    sErrType = sDesc;
                    opt.showMsg = false;
                }
                else if (400 == oHttp.status)
                {
                    sErrType = "logout";
                    sMsg = $.MyLocale.TIMEOUT;
                    opt.showMsg = true;
                    Ajax.disable();
                    pfAfterClosed = Frame.logout;
                }
                else if (0 == oHttp.status)
                {
                    sErrType = "disconnect";
                    sMsg = $.MyLocale.DISCONNECT;
                    opt.showMsg = false;
                }
                else if (403 == oHttp.status)
                {
                    sErrType = "deny";
                    sMsg = opt.failedMsg || $.MyLocale.NO_PRIVILEGE;
                }
                else
                {
                    sMsg = sDesc+". staus=" + oHttp.status + ", text=" + oHttp.statusText;
                    Frame.Debuger.error("ajax: " + sMsg);
                    opt.showMsg = false;
                    sMsg = $.MyLocale.JSON_ERR;
                }

                opt.showMsg && pfOutput(sMsg, pfAfterClosed);
                if ("logout" == sErrType)
                {
                    return;
                }

                opt.onFailed && opt.onFailed.apply({}, [sErrType, sMsg]);
            }
        };

        function getXPath(sXPath)
        {
            // "/rpc/edit-config[1]/config[1]/top[1]/Ifmgr[1]/Interfaces[1]/Interface[2]/VLANOpt[1]/PVID[1]"
            var nStart = sXPath.indexOf("/top[1]/");
            sXPath = sXPath.substring(nStart+8);      // Ifmgr[1]/Interfaces[1]/Interface[2]/VLANOpt[1]/PVID[1]
            return sXPath.replace(/\[[0-9]*\]/g,"");  // Ifmgr/Interfaces/Interface/VLANOpt/PVID
        }

        function onGetErrMsg(sXPath, oErrInfo)
        {
            var aJsonPath = sXPath.replace(/(\[[0-9]+\])/g,"").split('/');
            var sErrItem = aJsonPath[aJsonPath.length-1];
            var errLabel = $("#"+sErrItem).prev();
            return ""; //errLabel.html();
        }

        function getRpcErr(aErrs)
        {
            var aMsgAll = [];
            for(var i=0; i<aErrs.length; i++)
            {
                var oErr = aErrs[i];
                var sMsg = oErr["error-message"];
                if("access-denied" == oErr["error-tag"])
                {
                    // Ȩ�޲���ʱʹ�ÿ���ж������ʾ��Ϣ
                    sMsg = $.MyLocale.NO_PRIVILEGE;
                }
                var sXPath = oErr["error-path"];    // ֱ�Ӵ�netconf���صĴ�����Ϣ��û��error-path��error-info
                var oErrInfo = oErr["error-info"] ? oErr["error-info"]["top"] : {};
                var sCfg = sXPath ? opt.onGetErrMsg(getXPath(sXPath), oErrInfo) : "";

                if(sCfg)
                {
                    sCfg = "<span class='error-type'>"+sCfg +": </span>";
                }

                aMsgAll.push("<div>" + sCfg +"<span class='error-reason'>" + sMsg + "</span></div>");
            }
            return aMsgAll;
        };
        
        if(Ajax._disable) return false;

        $.extend(opt, option);
        if(opt.role && opt.menuId)
        {
            var oProv = Frame.Menu.getPrivilege(opt.menuId);
            if(!oProv) return false; // page is loading
            if (true !== oProv[opt.role])
            {
                opt.error({"status":403});
                opt.complete && opt.complete();
                return false;
            }
        }
        Frame.Debuger.info("[ajax] send url:"+opt.url);
        return $.ajax(opt);
    }
} // end of Ajax
Frame.Ajax = Ajax;

/*
   ����Ӧʽ�п��Ʋ˵�����ʾ״̬����ʾλ��
*/
var MenuSwitch = {
    _animation: false,
    init: function ()
    {
        $(".menu-switch")
            //.mouseover(function(){$(this).find(".menu-themb").fadeIn()})
            //.mouseout(function(){$(this).find(".menu-themb").fadeOut()})
            .on("click", ".menu-themb", function(){MenuSwitch.toggle ($(this));} );
    },
    isOpened: function ()
    {

    },
    toggle: function (jSwitchThumb)
    {
        if (!jSwitchThumb)
        {
            jSwitchThumb = $(".menu-switch .menu-themb");
        }

        this._animation = true;
        if(jSwitchThumb.is(".opened"))
        {
            jSwitchThumb.removeClass("opened").addClass("closed").parent().css("left", 0);
        }
        else
        {
            jSwitchThumb.removeClass("closed").addClass("opened").parent().css("left", 240);
        }
        $(window).resize();
    },
    changeTo: function (sType /*left or top*/)
    {

    },
    _showOnLeft: function (jSwitchThumb)
    {
        var sEffect = false;
        if (this._animation)
        {
            this._animation = false;
            sEffect = "slide";
        }

        if(jSwitchThumb.is(".opened"))
        {
            var jMenuDiv = $("#menu_div");
            $("#page_container").removeClass("full-width");

            if (jMenuDiv.attr("init"))
            {
                $("#menu_div").show(sEffect);
            }
            else
            {
                jMenuDiv.attr("init", "true");
            }
        }
        else
        {
            $("#page_container").addClass("full-width");
            $("#menu_div").hide(sEffect);
        }
    },
    _showOnTop: function ()
    {
            $("#menu_div").show("slide");
    },
    showOn: function (sType /*left or top*/)
    {
        var jSwitchThumb = $(".menu-switch .menu-themb");
        if ("top" == sType)
        {
            this._showOnTop (jSwitchThumb);
        }
        else
        {
            this._showOnLeft (jSwitchThumb);
        }

    }
}
Frame.MenuSwitch = MenuSwitch;

var Theme = {
    init: function()
    {
        var jMenuTheme = $("#menuTheme");
        $(".theme", jMenuTheme).click(function(e)
        {
            var jEle = $(this);
            var sThemeName = jEle.attr("data-style");

            if (jEle.is(".active"))
            {
                return false;
            }

            // refresh page
            Frame.Cookie.set({"theme": sThemeName});
            setTimeout(function(e){Utils.Base.refreshCurPage ();}, 20);
            return false;

            // or load theme
            Theme.loadTheme(sThemeName, true);
            jMenuTheme.find(".active").removeClass("active");
            jEle.addClass("active");

            return false;
        });

        var sThemeName = Frame.Cookie.get("theme") || "blue";
        Theme.loadTheme(sThemeName, true);
        // $(".theme[data-style="+sThemeName+"]", jMenuTheme).click();
    }
    ,loadTheme: function(sThemeName, bResize)
    {
        // Frame.Cookie.set({"theme": sThemeName});
        sThemeName = "green";

        var sCss = Frame.Util.getPathUrl("frame/css/"+sThemeName+"/index.css");
        $("#mytheme").attr("href", sCss);

        var sConfig = Frame.Util.getPathUrl("frame/css/"+sThemeName+"/config.js");
        $.getScript(sConfig, function(){ThemeConfig.init()});
    }
    ,onChanged: function(sName)
    {
        $(window).resize();
        Frame.notify("all", "change.theme", sName);
    }
}
Frame.Theme = Theme;

var MyLayout = {
    init: function ()
    {
        var layoutSettings = {
            //  enable showOverflow on west-pane so CSS popups will overlap north pane
                resizable:              false   // when open, pane can be resized 

            //  reference only - these options are NOT required because 'true' is the default
            ,   closable:               true    // pane can open & close
            ,   slidable:               true    // when closed, pane can 'slide' open over other panes - closes on mouse-out

            //  some resizing/toggling settings
            ,   north__slidable:        false   // OVERRIDE the pane-default of 'slidable=true'
            ,   north__togglerLength_closed: '100%' // toggle-button is full-width of resizer-bar
            ,   north__spacing_open:    0       // big resizer-bar when open (zero height)
            ,   north__size:            70  // OVERRIDE the pane-default of 'slidable=true'
            ,   north__showOverflowOnHover: false
            ,   south__spacing_open:    0       // no resizer-bar when open (zero height)
            ,   south__spacing_closed:  20      // big resizer-bar when open (zero height)
            ,   south__size:            58  // OVERRIDE the pane-default of 'slidable=true'
            //  some pane-size settings
            ,   west__size:             200
            ,   west__spacing_open:     0       // no resizer-bar when open (zero height)
            ,   west__spacing_closed:   10      // no resizer-bar when open (zero height)
            ,   west__togglerClass:     "toggle"
            ,   west__minSize:          200
            ,   west__resizable:        false
            ,   west__closable:         false
            ,   west__onresize:         Frame.NewMenu.resize
            ,   west__showOverflowOnHover: false
            ,   center__minWidth:       200
        };

        MyConfig.Layout.enable = true;
        $("html").height("100%");
        $('body').css({width:"100%",height:"100%"}).layout(layoutSettings);

        var layoutSettings = {
            //  enable showOverflow on west-pane so CSS popups will overlap north pane
                resizable:              false   // when open, pane can be resized 

            //  reference only - these options are NOT required because 'true' is the default
            ,   closable:               false    // pane can open & close
            ,   slidable:               true    // when closed, pane can 'slide' open over other panes - closes on mouse-out

            //  some resizing/toggling settings
            ,   north__slidable:        false   // OVERRIDE the pane-default of 'slidable=true'
            ,   north__slidable:        false   // OVERRIDE the pane-default of 'slidable=true'
            ,   north__togglerLength_closed: '100%' // toggle-button is full-width of resizer-bar
            ,   north__spacing_open:    0       // big resizer-bar when open (zero height)
            ,   north__size:            99  // OVERRIDE the pane-default of 'slidable=true'
            ,   north__showOverflowOnHover: true
            ,   center__onresize:       Frame.resize
        };
        $("#layout_center").layout(layoutSettings);
    }
}; // end of MyLayout

var Scrollbar = {
    create: function (jEle, nHeight)
    {
        // if (jEle.parent('.slimScrollDiv').size() > 0)
        // {
        //     if (jEle.height () == nHeight)
        //     {
        //         return;
        //     }

        //     jEle.slimScroll({destroy: true});
        //     jEle.removeAttr('style');
        // }

        // jEle.slimscroll({
        //     size: '7px',
        //     color: '#a1b2bd',
        //     opacity: .3,
        //     height: nHeight,
        //     allowPageScroll: false,
        //     disableFadeOut: true
        // });
    },
    destroy: function (jEle)
    {
        // if (jEle.parent('.slimScrollDiv').size() > 0)
        // {
        //     jEle.slimScroll({destroy: true});
        //     jEle.removeAttr('style');
        // }
    }
}
Frame.Scrollbar = Scrollbar;


/*
   ��һ����ҳ�棬�����б�ҳ���д����ҳ��ȡ�
*/
var NewPage =
{
    _bOpened: false,
    jActiveEle: false  // ���Ԫ�ء���ȫ����ʾʱ��ʹ��jNewPage����ȫ����ʾʱʹ��jForm

    ,para: {}
    
    ,init: function(para)
    {
        if(para)
        {
            this.para = para;
        }

        if(!this.jActiveEle)
        {
            // this.jActiveEle = $("#edit_div .content");
            this.jActiveEle = $("#tabContent");
        }
    }
    
    ,isOpen: function()
    {
        return this._bOpened;
    }

    ,toggle: function()
    {
        if(this._bOpened)
        {
            this.close();
        }
        else
        {
            this.open()
        }
        return this;
    }
    
    ,open:function()
    {
        if(this._bOpened)
        {
            return this;
        }

        this._bOpened = true;
        Frame.notify("newPage", "open");
        return this;
    }
    ,close:function()
    {
        if(!this._bOpened)
        {
            return this;
        }

        this._bOpened = false;
        Frame.notify("newPage", "close");
        this.empty();
        return this;
    }
    ,empty: function()
    {
        Utils.Pages.destroy (this.jActiveEle);
        this.jActiveEle.empty();
        return this;
    }
    ,load: function(sUrl, pfInit)
    {
        Utils.Pages.loadModule(sUrl, this.para.data, this.jActiveEle, pfInit);
        return this;
    }
    ,update: function(oData, sModule)
    {
        Utils.Pages.updateJContent(this.jActiveEle, oData);
    }
}

var keepAlive =
{
    _lastOptTime: false,
    _hDelay: false,
    init: function()
    {
        // �û������, 5���ӷ�һ��keepalive����
        function userAlive()
        {
            var oCurTime = new Date();
            if ((oCurTime - keepAlive._lastOptTime) > MyConfig.config.keepAlive)
            {
                Frame.Ajax.send(Frame.Util.getDynUrl("keepalive.j"), {showMsg: false});
            }
            keepAlive._lastOptTime = oCurTime;
        }

        this._lastOptTime=new Date();
        this.start();
        $("body").bind("keyup", userAlive).bind("click", userAlive);
    },
    start: function()
    {
        // ����Ƿ�ʱ
        function checkTimeout()
        {
            var nIdleTimeMs = Frame.get("idletime", 10) * 60000;
            if (((new Date()) - keepAlive._lastOptTime) > nIdleTimeMs)
            {
                // ��ʱ�䲻����ʱ����Ҫlogout
                Frame.logout();
                return;
            }
            keepAlive._hDelay = Frame.OS.delay("Frame.KeepAlive", MyConfig.config.checkTimeout, checkTimeout);
        }

        if((false !== this._lastOptTime) && (false === keepAlive._hDelay))
        {
            // ��ʼ����ɺ�ſ�ʼ����. startʱ���¿�ʼ��ʱ
            this._lastOptTime = new Date();
            checkTimeout();
        }
    },
    update: function()
    {
        if(false !== this._lastOptTime)
        {
            // ��ʼ����ɺ�ſ�ʼ����
            Frame.Ajax.send(Frame.Util.getDynUrl("keepalive.j"), {showMsg: false});
            this._lastOptTime = new Date();
        }
    },
    pause: function()
    {
        // ���·�ǰ����ͣ, ��ֹ��̨��ʱ�����ᵼ��ǰ̨��ʱ�˳�
        Frame.OS.cancelDelay(keepAlive._hDelay);
        keepAlive._hDelay = false;
    }
}
Frame.keepAlive = keepAlive;

Frame.FileMnger = {
    showResult: function(bResult, sMsg)
    {
        Frame.Msg.alert(sMsg);
    }
}

Frame.Custom = 
{
    NAME: "Custom"
    ,VERSION: "1.0"
    ,changeLanguage: function(sLang)
    {
        $.getJSON(Frame.Util.getDynUrl("set-language.j?lang="+sLang), function(oResult)
        {
            if(oResult.error)
            {
                Frame.Debuger.warning("Change language failed");
            }
            // Frame.Custom.onLanguageChanged(sLang);
            window.location.reload();
        });

        Cookie.set({lang: sLang});
    }
    ,onLanguageChanged: function (sLang)
    {
        function _renderLanguage()
        {
            $.extend ($.MyLocale, $["MyLocale_"+sLang]);

            var oText = $.MyLocale.mainFrame;
            $.each(oText, function(key, item)
            {
                $("#"+key).html(item);
            });

            var oTextTip = $.MyLocale.shotcutTip;
            $.each(oTextTip, function(key, item)
            {
                $("#"+key).attr("title",item);
            })
            Frame.notify("all","language.changed");
            _initContext();
        }
        function _initContext()
        {
            $("#username").text(Frame.get("username"));
            $("#username").attr("title",Frame.get("username"));
            $("#username-phone").text(Frame.get("username"));
            $("#username-phone").attr("title",Frame.get("username"));
            $(".brand #logo").attr("src", Frame.Util.getPathUrl("frame/oem/"+Frame.get("oem")+"/images/logo.png"))
                             .bind("load",function(){
                                 // $("#frame_menu").css({ marginTop: $("#tbarSave").height()+$("#tbarSave").position().top+2});
                             });
            $("#day_unit").html(" "+$.MyLocale.DAY);
            $("#runing_label").text($.MyLocale.mainFrame.runing_label);
            $("#running_time").text($.MyLocale.mainFrame.running_time);
            var sSupportLang = Cookie.get("supportLang");
        	switch (sSupportLang)
        	{
        		//��֧��һ������
        		case "en":
        		case "cn":  
        			break;
        		//֧�ֶ�������
        		default:    //�����������Ӣ��˫���ͬ����
        			$(".shortcut #change_language").removeClass("hide");
        			break;
        	}
        }

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
                var sCopyright = Frame.Util.sprintf(oem.copyright, "", 2014);        
                $(".copyright").html(sCopyright);
            }

            if(!$.MyLocale.OEM[sLang])
            {
                var sJsFile = Frame.Util.getPathUrl("frame/oem/"+Frame.get("oem")+"/"+sLang+"/config.js");
                $.getScript(sJsFile, setCopyright);
            }
            else
            {
                setCopyright();
            }
        }
*/
        Frame.NewMenu.init();
        $("#change_language select").val(sLang);

        $.extend ($.MyLocale, {OEM:{}});

        Frame.Debuger.info("Change to language: " + sLang);
        if($["MyLocale_"+sLang])
        {
            _renderLanguage();
        }
        else
        {
            var sJsFile = Frame.Util.getPathUrl("frame/"+sLang+"/locale.html");
            $.getScript(sJsFile, _renderLanguage)
        }
       /* getCopyright(sLang);*/
    }
}

})(Frame)

