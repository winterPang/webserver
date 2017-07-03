/*******************************************************************************
 Copyright (c) 2011, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:frame.js
@ProjectCode: Comware v7
@ModuleName: Frame.Core
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description:框架处理函数定义。
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
            // 不老化
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
@Description: 框架提供的包含JS的接口，代替HTML中的script标签。
    该接口使用变参，第一个参数为模块名，后面的JS LIB名称（即JS文件所在的目录的点分表示法）。
    当包含多个JS文件时，可以所有的JS文件都放在第二个参数中使用分号分开，也可以使用多个参数，
    每个参数为一个JS文件，建议把同一类的文件放在一个参数中，方便维护。
    <P>该接口会依次请求参数中指明的JS文件，当所有的JS文件都请求成功后，会向请求的模块发送init事件通知，
    各页面右以注册自己的init事件处理函数初始化自己的页面。
@Usage: 
    当只有一个JS文件时可使用文件名做为模块名,此时只传一个参数即可：
    Frame.include("Pages.Systime.Summary")
    此时模块名为Pages.Systime.Summary，包含的JS为Pages/Systime/Summary.js
    
    模块名和文件名不同的情况：
    Frame.include("Systime.Summary", "Pages.Systime.Summary");
    此时模块名为Systime.Summary，包含的JS为Pages/Systime/Summary.js
    
    包含多个JS文件的情况：
    Frame.include("Systime.Summary", "Pages.Systime.Summary;Pages.Systime.Create;Libs.Frame.Dialog");
    此时模块名为Systime.Summary，包含了三个JS文件，分别为
    pages/systime/summary.js
    pages/systime/creaet.js
    libs/frame/dialog.js
    
    包含多个文件也可以使用多个参数的方法, 从第二个参数开始, 每一个参数都是一个或多个JS:
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
    * sModuleName - string, 模块名，可以自己定义， 但不能和其它人的重复。建议使用路径名作为模块名。
    可以保证肯定不会和其他人重复。
    * libs - string, LIB路径, 即JS文件的路径，可以是libs目录下的， 也可以是自己目录下的文件。
    如Libs.Frame.Dialog、Pages.Vlan.Summary。当包含多个JS文件时请使用分号隔开
@Return: void.
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    include: function(opt, libs)
    {
        var aLibs = [];
        var iIndex = 0;

        // 如果设置了表态文件不缓存时需要在URL后增加一个随机数
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

        // 准备JS文件列表
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
            var sRoot = MyConfig.root||"/"; // 由于这里是核心代码, 不能使用Frame.Util.getUrlPath组装全路径
            var sPath = sLib.replace(/^Libs\./,"frame/libs/").replace(/\./g, "/")+".js"+sCachPara;
            var sJsFile = sRoot + sPath;
            aJsFiles.push(sJsFile.toLowerCase());
        }

         loadOneJs(); // 同步load
        // _loadJs(aJsFiles); // 异步load
    },

/*****************************************************************************
@FuncName: public, Frame.regNotify
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 事件通知注册接口。V7框架中使用事件机制处理系统中的异步操作，
	各页面可以注册自己关心的事件进行处理。常用的事件包括页面的初始化init、
	页面销毁destroy，页面必须在JS文件中注册这两个事件。
@Usage: 
	请参考 Frame.notify
@ParaIn: 
	* sModule - string, 模块名，可以自己定义， 但不能和其它人的重复。建议使用路径名作为模块名。
	可以保证肯定不会和其他人重复。
	* sEvent, string, 事件名称
	* fn, Function, 事件处理函数
@Return: boolean, 成功时返回true，否则返回false
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
@Description: 取消事件注册， 与Frame.regNotify相返。
@Usage: 取消本模块中所有的注册：
	var MODULE_NAME = "Pages.Systime.Summary";
	Frame.unregNotify(MODULE_NAME);
	
	取消初始化的注册：
	Frame.unregNotify(MODULE_NAME, "init");
@ParaIn: 
	* sModule - string, 模块名。
	* sEvent - string, 事件名称。
	* fn - Function, 事件的处理函数。如果不指定则会注册该事件的所有注册的处理函数。
		暂不支持该参数
@Return: boolean, 成功时返回true，否则返回false
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
@Description: 事件异步通知接口。发出通知后立即返回。一般由框架或控件调用，各模块注册响应处理。
@Usage: 在控件中调用：
	var oPara = {para1:true,para2:"abc"};
	Frame.notify("Libs.Frame.Dialog", "close", oPara);
	
	如果页面需要感知对话框关闭，就可以先注册对话框的close事件：
	Frame.regNotify("Libs.Frame.Dialog", "close", function(oPara)
	{
		var p1 = oPara.para1;   // true
		var p2 = oPara.para2;   // "abc";
	});

	在不使用的时候注册取消：
	Frame.unregNotify("Libs.Frame.Dialog", "close", function(){});
@ParaIn: 
	* sModule - string, 模块名。
	* sEvent - string, 事件名称。
	* opt - JSON, 通知参数。
@Return: 无
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
@Description: 事件同步通知接口。发出通知后等待所有处理者处理完成后再返回。一般由框架或控件调用，各模块注册响应处理。
@Usage: 在控件中调用：
	var oPara = {para1:true,para2:"abc"};
	Frame.notify("Libs.Frame.Dialog", "close", oPara);
	
	如果页面需要感知对话框关闭，就可以先注册对话框的close事件：
	Frame.regNotify("Libs.Frame.Dialog", "close", function(oPara)
	{
		var p1 = oPara.para1;   // true
		var p2 = oPara.para2;   // "abc";
	});

	在不使用的时候注册取消：
	Frame.unregNotify("Libs.Frame.Dialog", "close", function(){});
@ParaIn: 
	* sModule - string, 模块名。
	* sEvent - string, 事件名称。
	* opt - JSON, 通知参数。
@Return: 无
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
@Return: 无
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    init: function()
    {
        // 判断是否是合法登录进来的
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
@Description: 获取全局信息
@Usage:
    Frame.get("sessionid");
    Frame.get("lang", "en");
    Frame.get("username");
    Frame.get("password");
@ParaIn:
    * sKey - string, 命令字，支持以下几种
        <li>sessionid，获取用户ID字符串
        <li>rid，获取随机串。每次登录后都会随机生成一个字符串，该串在本次登录期间不变。
            主要用于追加到静态URL后面，防止浏览器缓存。各页面一般不需要用到
        <li>lang，获取当前语言字符串
        <li>username，获取当前登录用户的用户名
        <li>product，获取当前产品名称
        <li>sysoid，获取当前产品OID
        <li>theme，获取当前的皮肤名称
        <li>idletime，获取当前的web超时时间
    * default - void, 缺省返回值, 当获取的参数不存在时返回该值。可以不指定。
@Return: void, 获取到的值，返回的类型根据命令字的不同而不同.
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
@Description: 列表字符串，以逗号分隔的枚举字符串或者是一个数组。如果列表的枚举值不是以0开始的整数，
    则必须使用数组来定义，其数组格式为[{value:value1, text: text1},{}]，或者{value1:text1,value2:text2}。
    也可以是一个js函数，此时需要返回符合上述条件的枚举字符串或者数组。
    <p>列表字符串用于定义列表中枚举列的情况，可以在行编辑或者高级查询时以下拉框的形式显示出来，方便用户选择。
    <h3>函数列表</h3>
    <li><a href="#Frame.ListString.format">format</a>
    <li><a href="#Frame.ListString.getTextByValue">getTextByValue</a>
@Usage:
//字符串格式
var sList = "Up,Down";

//简单数组格式
var aList = ["emergencies","alerts","critical","errors","warnings","notifications","informational","debugging"];

//自定义数组格式。注意isDefault属性默认是false，一个定义中只能有一个是true
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
@Description: 定义列表的行编辑处理函数
@Usage:
//字符串格式，中间以逗号分隔，适用于从0开始的枚举值
var sList = "emergencies,alerts,critical,errors,warnings,notifications,informational,debugging";
Frame.ListString.format(sList);

//简单数组格式，实际值从1开始的枚举值
var aList = ["emergencies","alerts","critical","errors","warnings","notifications","informational","debugging"];
Frame.ListString.format(aList, {start:1});

//自定义数组格式，适用于任意序列的枚举值
var aList = {"0":"emergencies", "1":"alerts", "2":"critical", "3":"errors", "4":"warnings",
             "5":"notifications", "6":"informational", "7":"debugging"};
Frame.ListString.format(aList);

//标准格式。
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
    * listStr, String, 需要格式化的字符串
@Return: Array, 返回一个标准格式的数组
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

        // 字符串下标格式转换为数字下标的格式
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

        // listStr肯定是数组
        var nLen = listItems.length;

        // 没有数据, 直接返回
        if(0 == nLen)
        {
            return listItems;
        }

        // 已经是正确的格式, 直接返回
        if($.isPlainObject(listItems[0]))
        {
            return listItems;
        }

        // 内容是字符串类型, 需要转换为 {value: xx, text: xxx}
        // 由于设备上返回的数据都是字符串类型，因此value也需要是字符串类型。
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
@Description: 定义列表的行编辑处理函数
@Usage:
//自定义数组格式，适用于任意序列的枚举值
var aList = {"0":"emergencies", "1":"alerts", "2":"critical", "3":"errors"};
var aData = Frame.ListString.format(aList);
Frame.ListString.getTextByValue(aData, "2"); // return "critical"
@ParaIn:
    * listStr, String, 需要格式化的字符串
@Return: Array, 返回一个标准格式的数组
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
@Description: 定义列表的行编辑处理函数
@Usage:
var sList = "emergencies,alerts,critical,errors,warnings,notifications,informational,debugging";
Frame.ListString.each(sList, function(val, text)
{
    aHtml.push(Frame.Util.sprintf("<option value='%d'>%s</option>", val, text));
});
@ParaIn:
    * listStr, String, 需要格式化的字符串
    * para1, Function/Object, 如果只有两个参数，则该参数为回调函数。如果有三个参数，则该参数为处理选项
    * para2, 回调函数
@Return: Array, 返回一个标准格式的数组
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
@Description:  与服务器(设备)交互的总类. 由于从服务器上获取时需要异步操作, 所以该class下的所有接口都需要一个回调函数
@Usage:
*****************************************************************************/
var Server = 
{
    // 公共信息
    _cach: {},

/*****************************************************************************
@FuncName: public, Frame.Server.get
@DateCreated: 2012-02-09
@Author: huangdongxiao 02807
@Description: 获取全局信息
@Usage:
    function setIdleTime(nIdleTime)
    {
        nIdleTime = parseInt(nIdleTime);
        // ...
    }
    Frame.Server.get("idletime", setIdleTime, 10);
@ParaIn:
    * sKey - String, 命令字，支持以下几种
        <li>idletime，从服务器上获取当前的web超时时间
    * cb - Function, 获取到数据后的通知函数. 
    * default - void, 缺省返回值, 当获取的参数不存在时返回该值。可以不指定。
@Return: void, 获取到的值，返回的类型根据命令字的不同而不同.
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
        case "entity":  // 取第一个不空的sysoid
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
定时器的内部数据结构：
{
    name: String; 定时器名称，为了自动回收资源，该名称不能重复。如果发现重复时则认为是reset操作，会先销毁上次的定时器句柄
    create_times: int; 创建的次数，用于调试
    time_out: int; 超时时间
    wait_time: int; 已等待的时间，当这个时间超过time_out时触发回调函数处理
    loop: Boolean; 是否是循环定时器
    used: Boolean; 是否在用的标记。
    callback: Function; 到时后的回调函数。如果是循环定时器，则该函数返回false时定时器会终止。一次定时器时返回值被忽略
    paras: void; 传递给回调函数的参数，可以是任意类型，框架不会识别该参数的意义
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
                // 还没有到超时时间
                continue;
            }

            var ret = oTimer.callback(oTimer.paras);
            if(!oTimer.loop || (false === ret))
            {
                // 一次性定时器或者循环定时器返回了false时，终止定时器
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

        // 暂时不用
        //this._hTimer = setInterval(Timer._do, Timer._FREQUENCY);
    },

/*****************************************************************************
@FuncName: public, Frame.Timer.create
@DateCreated: 2011-11-01
@Author: huangdongxiao 02807
@Description: 创建定时器。各页面在使用定时器时禁止使用setTimeout, setInterval，必须使用本函数来完成
@Usage: 
    var oTimer = false;

    // 创建一个1秒钟的一次性定时器
    oTimer = Frame.Timer.create("sysinfo_cpu", function(){}, 1000);
    
    // 创建一个1秒钟的循环定时器，且回调函数中带有参数
    oTimer = Frame.Timer.create("sysinfo_cpu", function(mypara)
    {
        if(1==mypara.id)
        {
        }
    }, 1000, true, {id:1});

    // 在页面退出时需要进行销毁
    if(oTimer)
    {
        Frame.Timer.destroy(oTimer);
    }
@ParaIn: 
    * sModule, string, 模块名，用于标示是哪个模块或者页面调用的，方便定位问题。
    * pfAction, Function, 定时器到时后的执行函数。返回true or false。
        如果是循环定时器，则当函数返回的不是true时会终止定时器。
    * nTime, Integer, 定时器时间，毫秒
    * bLoop, Boolean, true-循环定时器；false-非循环定时器
    * para, void, 传给pfAction的参数，可以使用object类型传递多个数据。
@Return: 创建的定时器对象，销毁时要用。定时器对象是一个结构，不建议页面中修改其中的数据
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
                name: sModule, //String; 定时器名称
                pageid: "",     //String; 定时器可以与页面的ID绑定，绑定后当页面切走后就会自动销毁
                create_times: 0, //int; 创建的次数，用于调试
                time_out: parseInt(nTime), //int; 超时时间
                wait_time: 0,   //int; 已等待的时间，当这个时间超过time_out时触发回调函数处理
                loop: (true===bLoop),    //Boolean; 是否是循环定时器
                used: true,     //Boolean; 是否在用的标记。
                callback: pfAction, //Function; 到时后的回调函数。
                paras: para     //void; 传递给回调函数的参数，可以是任意类型，框架不会识别该参数的意义
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

        // 页面中的定时器需要先保存到DBM中，重复创建时会先删除上一次的实例
        if ( (0 == sModule.indexOf("Pages.")) && Frame.DBM)
        {
            var db = Frame.DBM.open("Frame.Timer", {openFlag:"read|write|create"});
            var oOldTimer = Frame.DBM.get(db, sModule, false);
            Timer.destroy(oOldTimer);           // 删除旧的定时器
            Frame.DBM.set(db, sModule, oTimer); // 记录新的定时器
            Frame.DBM.close(db);
        }
        
        return oTimer;
    },

/*****************************************************************************
@FuncName: public, Frame.Timer.reset
@DateCreated: 2011-11-01
@Author: huangdongxiao 02807
@Description: 重置定时器，使用定时器重新开始计算时间。
@Usage: 
@ParaIn: 
    * oTimer, Object, 创建的定时器对象
@Return: 无
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
                wait_time: 0,   //int; 已等待的时间，当这个时间超过time_out时触发回调函数处理
                used: false     //Boolean; 是否在用的标记。
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
@Description: 销毁定时器。
@Usage: 
@ParaIn: 
    * oTimer, Object, 创建的定时器对象
@Return: 无
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
@Description: 延时执行一个动作。
@Usage: 
    // 定义处理函数
    function doMyAction(oPara)
    {
        alert(oPara);
    }
    
    // 不使用参数
    var hDelay = Frame.OS.delay("mydelay", 1000, doMyAction);
    
    // 使用简单参数
    var hDelay = Frame.OS.delay("mydelay", 1000, doMyAction, 1);

    // 使用复杂参数
    var hDelay = Frame.OS.delay("mydelay", 1000, doMyAction, {name:"hdx",flag:"test", id=3});
    
@ParaIn: 
    * sModule, String, 模块名，用于定位问题
    * nTime, Interger, 延时的时间，毫秒
    * pfAction, Function, 执行函数指针
    * para, any, 用户参数，被透传到执行函数中
@Return: 如果已经被锁定,则会立刻返回false,否则返回true
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
@Description: 取消延时执行，delay的反向操作。如果某一延时操作在未到达时可以调用该接口取消其执行。
@Usage: 
    // 定义处理函数
    function doMyAction(oPara)
    {
        alert(oPara);
    }
    
    // 不使用参数
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
    * hDelay, Handle, 调用延时操作时返回的句柄
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
@Description: 启动一个线程
@Usage: 
    // 定义处理函数
    function doMyAction(oPara)
    {
        alert(oPara); // 1
    }
    
    // 不使用参数
    var hDelay = Frame.OS.thread("mymodule", doMyAction, 1);
@ParaIn: 
    * sModule, String, 模块名，用于定位问题
    * pfAction, Function, 处理函数
    * oPara, paraList, 传给处理函数的可变参数列表
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
@Description: 判断并创建一个信号量。如果已经存在则不进行处理；如果不存在则创建。
    信号量的数据结构为：
    <code>
            oSignal = 
            {
                name: sSignal,
                status: "waiting",
                cb: []
            }
    </code>
@Usage: 
    // 定义信号名称
    var sSignalName = "Xxx.Xxx.Xxx";

    // 创建信号量
    var oSignal = Signal._create(sSignal);
@ParaIn: 
    * sModule, String, 模块名，在控件中可以用控件的名称代替。
    * sSignal, string, 信号量名称，由各产生信号的控件定义，建议使用控件的路径，如"Libs.Frame.Xxx"。
@Return: Signal, 如果指定的信号量已存在，则返回该信号量对象；
    如果不存则先创建，然后再返回新创建的信号量对象
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
@Description: 等待一个信号到达。一般是一个调用者在等待控件的某一信号时使用，
    也可用于一个控件中等待另外一个控件中的信号。每个信号都需要有一个信号名称，
    信号名称以定义串形式由各产生信号的控件定义，等待者使用。
    一个信号可能会有多个人等待，信号到达后等待者会按照顺序进行处理，
    处理时可以返回false终止后面的人的处理。当等待者处理完自己的事情后会主动离开，
    不会再处理后面的ready事件。
    如果在等待时信号已经到达，则直接进行同步处理，不再执行等待动作。
    在定义信号名称时建议使用控件的路径，如"Libs.Frame.Xxx"。
    <P>应用场景：当一个控件涉及到多个JS文件时，可以抽象出一个单一的JS文件由各模块包含，
    在该JS文件中自己包含全部所需要的JS文件。如果在页面中需要在实际的JS load完毕后处理一些事情，
    则页面中需要使用控件提供的信号量进行等待。如面板的onPanelFinished
@Usage: 
    // 定义信号名称
    var sSignalName = "Libs.Frame.Xxx";

    //定义处理函数：处理函数不需要参数
    function _Signal_PlotReady()
    {
        Frame.Msg.Info("signal is ready: " + sSignalName);
    }
    
    // 等待信号量
    Frame.Signal.wait(sSignalName, "mytest",  _Signal_PlotReady);
    
    // 也可以使用匿名处理函数
    Frame.Signal.wait(sSignalName, "mytest",  function()
    {
        Frame.Msg.Info("signal is ready: " + sSignalName);
    });
@ParaIn: 
    * sModule, String, 模块名。是被等待模块的模块名，不是自己模块的模块名。
    * sSignal, String, 信号量名称，由各产生信号的控件定义，建议使用控件的路径，如"Libs.Frame.Xxx"。
    * fn, Function, 信号量到达后的处理函数，形式为 String function (bTimeout)。
    <p>处理函数说明:
    <li>paras<br>
    bTimeout, boolean, 是否超时. 在wait时如果设置了超时时间,则在超时后也会调用等待函数,但参数为true,如果是正常调用,则参数为false
    <li>return: "continue", 需要继续等待, 此时处理函数不会被清除,如果有人再次通知ready,则会重新执行一次该处理函数; 
        "ok", 已经处理完毕,此时处理函数会从处理队列中被清除,如果有人再次通知ready,将不会再次执行该函数
    *iTimeout, integer, 等待超时时间，单位为秒。默认为0，表示永不超时。在该时间内如果还没有等到信号，则以后不再处理。
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
            // 信号已经准备好,直接调用处理函数即可
            Frame.Debuger.info(sModule+": signal("+sSignal+") is ready, call function now");
            if("continue" != fn(false))
            {
                // 等待函数已经处理完自己的事情, 直接返回.
                return;
            }
            // else, 等待函数还需要继续等待后面的信号进行处理.
        }
        
        // 信号没有准备好, 需要缓存起来
        Frame.Debuger.info(Frame.Util.sprintf("%s: cache the signal - %s", sModule, sSignal));
        var hTimer = false;
        if(iTimeout > 0)
        {
            var iIndex = oSignal.cb.length;
            hTimer = Timer.create("Signal.wait", function()
            {
                // 定时器中的等待函数在没有处理完后不继续等待
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
@Description: 等待某一个条件满足时执行指定的函数。
    一般用于两个模块间的同步，是<a href=#Frame.Signal.wait">Frame.Signal.wait</a>的简化用法
@Usage: 
    // 定义变量
    var sMyName;
    
    // 等待sMyName有值后执行指定的动作
    Frame.waitVar(
        function(){return sMyName?true:false;},
        function(){alert(sMyName);}
    );

    // 从后台获取数据，并赋值给sMyName
    Frame.SRequest.getInstance("get", "1")
        .appendNode("Syslog").appendNode("LogHosts")
            .appendNode("Host")
                .appendColumn("Address", oData.Address)
    .root().get(function(){sMyName=this.Syslog.Host[0].Address;}
    
@ParaIn: 
    * pfReady, Function, wait结束的判断函数，返回true时结束，否则继续等待。
        函数中会循环判断，因此该函数内的实现不要尽量简单，最好是只有一个变量判断。
    * pfExcute, Function, wait结束时执行的动作，该函数没有参数，如果需要调用者可以先封装一下。
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
@Description: 设置信号完成。当控件的信号到达时，需要调用该接口通知等待的模块进行处理。
@Usage: 
    // 定义信号名称
    var sSignalName = "Libs.Frame.Xxx";
    
    // 通知各模块信号已经准备好
    Frame.Signal.ready(sSignalName);
@ParaIn: 
    * sSignal, string, 信号量名称，由各产生信号的控件定义，建议使用控件的路径，如"Libs.Frame.Xxx"。
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
                    // 等待函数没有处理完事情, 需要继续等待下一次ready
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
@Description: 删除信号量。一般用不着
@Usage: 
    Frame.Signal.remove(sSignalName);
@ParaIn: 
    * sSignal, string, 信号量名称，由各产生信号的控件定义，建议使用控件的路径，如"Libs.Frame.Xxx"。
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
@Description: Web框架提供的ajax类，该类封装了JQuery的ajax，增加了web框架相关的一些处理。
    Frame.Ajax主要由SRequest调用，各页面在正常处理一般不需要使用。在有特殊需求的页面，
    使用前最好先和web组确认一下。
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
@Description: 禁用ajax, 当进行设备重启, 或者退出登录时可以使用该函数防止后续操作的影响.
    这是一个全局的操作，调用该接口后后续的ajax调用都将不生效。重复调用时只有第一次有效
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
@Description: 使能Ajax。是 <a href="Frame.Ajax.diable">Frame.Ajax.disable</a> 的反向操作。
    重复调用时只有第一次有效
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
@Description: Ajax下发接口. 本接口一般用于特殊页面处理。对使用XCMP下发的不需要使用本接口。
@Usage: 
    // 使用默认选项
    Frame.Ajax.send(sUrl);

    var oAjax ;
    function getData()
    {
        // 自定义选项
        oAjax = Frame.Ajax.send(sUrl, {
            paras: {para1: 1, para2:"abc", para3:"test"}, 
            showMsg: false,
            onFailed: function(sErrType, sMsg)
            {
                if ("failed" == sErrType)
                {
                    // 设备上返回了失败
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
    * sUrl, String, 下发的URL, 不能为空
    * opt, AjaxOption, Ajax下发参数. 可以为空
@Return: JQueryAjax, 返回JQuery的Ajax对象。可以使用abort方法终止已发送的请求
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
@Description: Ajax默认选项. 除下面列出来的选项外，jquery的ajax的所有选项(请参考jQueryAPI.chm)都可以使用。
<span class="notice">注意：</span> Web框架增加了onComplete、onSuccess、onFailed三个事件函数，
分别代替jQuery中的complete、success、error。因此禁止在页面的option中传入jQuery中的这三个函数
<div id="onajaxfailed" class="key">错误处理函数</div>
Ajax下发失败后的处理函数，失败的情况包括：
    <ol>
    <li>set操作时后台完成了设置动作，但设置没有成功。即业务上设置出错了
    <li>用户超时。当管理员通过命令行或者其它的方法free web user后，再操作页面会提示超时，点击确定后会自动转到登录页面。
    <li>没有权限。当没有set权限的用户下发set操作时会返回该错误。一般出现在调试阶段，合入版本后不应该出现该提示
    <li>请求超时。如果在下发请求时有timeout参数，则在超时后也会通知本事件处理。该错误一般出现在高度阶段
    <li>网络不通。由于主备倒换，修改IP等导致网络不通时进行通知
    </ol>
出错后框架会提取错误字符串，传递给onFailed。
<div class="function-desc">
函数原型：function onFailed(sErrType, sErrMsg)<br>
参数: 
    <li>sErrType, String, 错误类型，除以下几种外还有几种内部使的如error, parseError等。各模块如果需要判断，
        建议使用正向判断，即只判断自己关心的类型，其它的忽略不处理
        <ol>
        <li>failed, 业务模块设置错误
        <li>timeout, 在超时时间内请求没有完成
        <li>abort, 请求被中断
        <li>deny, 没有权限
        <li>logout, 退出登录
        <li>disconnect, 网络中断
        <li>unknow, 未知错误
        </ol>
    <li>sErrMsg, String, 完整的错误字符串（HTML格式）
<div>返回值：None</div>
</div>
正常的配置错误数据, sErrType为failed：
<pre class=code>{
    "rpc-error":[
    {
        "error-type":"application",
        "error-tag":"operation-failed",
        "error-severity":"error",
        "error-path":"/rpc/edit-config[1]/config[1]/top[1]/Ifmgr[1]/Interfaces[1]/Interface[3]/PVID[1]",
        "error-message":"操作失败。",
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
        // 第二个错误项
        // ...
    }]
}</pre>
<p>除正常的配置错误外，其它的都属于异常错误，其数据格式和参数有所不同：
    <ol>
    <li>this不再指向上面的error-info结构，而是浏览器的ajax对象，各模块可以通过该对象获取原始数据
    <li>错误字符串一般没有可读性，不建议显示给用户
    </ol>
<div id="onajaxsuccess" class="key">成功回调函数</div>
Ajax下发成功后的处理函数，没有参数，可以通过this获取后台返回的数据，get和set获取到的数据格式不同。
        get时数据是一个和下发的结构相同的JSON对象，如
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
        set时返回的数据是一个设置结果(只有一个ok，一般不需要处理)。
        <div class="function-desc">
        函数原型：function onSuccess()<br>
        返回值：None
        </div>
@fields:
    * showMsg - Boolean, 当ajax请求回来后是否由框架显示提示信息. 默认值为true.
    * role, String, 当前请求的权限类型, 默认是false,即不关心. 有效值为read, write, execute
    * menuId, String, 请求所属的菜单. 和role一起判断当前下发的权限. 若权限不够, 直接通知调用者, 不下发到设备上. 若没有该属性时使用当前菜单
    * successMsg - String, 成功时的提示信息字符串. 默认情况下框架会提示一个框架性的字符串, 
        如果某页面需要提示的字符串, 可以通过该属性进行修改
    * failedMsg - String, 失败时的提示信息字符串. 默认情况下框架会提示设备上返回的字符串.
        如果某页面需要提示其它的字符串, 可以通过该属性进行修改
    * paras, JSON, 下发参数, 格式为{paraname: paravalue}
    * getErrMsg, Function, 获取RPC错误描述信息. 当进行设置操作时，后台的错误会以netconf协议的格式返回，框架会转换为JS对象，
        并调用本接口获取错误项对应的描述信息，同后台返回的错误一并提示给用户。<br>
        函数原型：function(sXPath, oErrInfo)<br>
        返回值：String,  如果有对应的项描述，则返回描述字符串，否则返回空串。如在设置端口的PVID时出错后可以返回
        "设置端口Ethernet1/0/1的PVID错误。"或者返回"端口名：Ethernet1/0/1, 错误项: PVID"。最终显示给用户的提示如下：<br>
        <div class="dlg-alert">
        操作失败。<br>
        端口名：Ethernet1/0/1, 错误项: PVID
        </div>
    * onComplete - Function, 下发完成后的回调函数, 不区分成功和失败. 该事件通知后, 仍会通知成功和失败的事件处理。
    * onSuccess - #onajaxsuccess/Function, 成功回调函数。下发成功后调用。
    * onFailed - #onajaxfailed/Function, 错误回调函数，下发失败后的调用。
@Modification:
    * yyyy-mm-dd: Author, add or modify something
    * 2011-07-27: 黄东晓, 增加closeOnEscape属性
*******************************************************************************/
        var opt = {
            // 框架自定义参数
            showMsg: true,
            role: false,
            successMsg: null,
            failedMsg: null,
            onGetErrMsg: onGetErrMsg,
            onComplete: $.noop,
            onSuccess: $.noop,
            onFailed: $.noop,

            // jquery的ajax参数
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
                    // 权限不足时使用框架中定义的提示信息
                    sMsg = $.MyLocale.NO_PRIVILEGE;
                }
                var sXPath = oErr["error-path"];    // 直接从netconf返回的错误信息中没有error-path和error-info
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
   在响应式中控制菜单的显示状态和显示位置
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
   打开一个新页面，如在列表页面中打开添加页面等。
*/
var NewPage =
{
    _bOpened: false,
    jActiveEle: false  // 活动的元素。当全屏显示时会使用jNewPage，非全屏显示时使用jForm

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
        // 用户活动处理, 5秒钟发一个keepalive请求
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
        // 检查是否超时
        function checkTimeout()
        {
            var nIdleTimeMs = Frame.get("idletime", 10) * 60000;
            if (((new Date()) - keepAlive._lastOptTime) > nIdleTimeMs)
            {
                // 长时间不操作时，需要logout
                Frame.logout();
                return;
            }
            keepAlive._hDelay = Frame.OS.delay("Frame.KeepAlive", MyConfig.config.checkTimeout, checkTimeout);
        }

        if((false !== this._lastOptTime) && (false === keepAlive._hDelay))
        {
            // 初始化完成后才开始工作. start时重新开始计时
            this._lastOptTime = new Date();
            checkTimeout();
        }
    },
    update: function()
    {
        if(false !== this._lastOptTime)
        {
            // 初始化完成后才开始工作
            Frame.Ajax.send(Frame.Util.getDynUrl("keepalive.j"), {showMsg: false});
            this._lastOptTime = new Date();
        }
    },
    pause: function()
    {
        // 在下发前先暂停, 防止后台耗时操作会导致前台超时退出
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
        		//仅支持一种语言
        		case "en":
        		case "cn":  
        			break;
        		//支持多种语言
        		default:    //其他情况和中英文双语等同处理
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

