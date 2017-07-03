
;(function($F)
{
function getPageFilePath(sBase, sLibName)
{
    return sBase + $.trim(sLibName.replace(/\./g,"/").toLowerCase())+".js";
}

function log(sMsg)
{
	 Frame.Debuger.info("mjs: " + sMsg);
}

function mergeFiles(oModObj)
{
    var aJsFiles = [];
    var aUtils = oModObj.utils || [];
    var aWidgets = oModObj.widgets || [];
    var aLibs = oModObj.libs || [];
    var aSubModules = oModObj.subModules || [];

    aUtils.push("Widget");
    aUtils.push("Msg");
    // merge to a file list
    for (var i = 0; i < aLibs.length; i++)
    {
        aJsFiles.push(getPageFilePath("frame/libs/", aLibs[i]));
    }
    for (var i = 0; i < aWidgets.length; i++)
    {
        if ("TagInput" == aWidgets[i])
        {
            continue;
        }
        aJsFiles.push(getPageFilePath("frame/widgets_new/", aWidgets[i]));
    }
    for (var i = 0; i < aUtils.length; i++)
    {
        aJsFiles.push(getPageFilePath("frame/utils/", aUtils[i]));
    }
    for (var i = 0; i < aSubModules.length; i++)
    {
        aJsFiles.push(getPageFilePath("", aSubModules[i]));
    }
    return aJsFiles;
}

function getFileList(names, sBase)
{
    names = names||[];
    var aNames = ($.isArray(names)) ? names : names.split(";");
    var aFiles = [];
    for(var i=0; i<aNames.length; i++)
    {
        aFiles[i] = getPageFilePath(sBase, aNames[i]);
    }
    return aFiles;
}

var Libs = {
	load: function (libs, pfNotify) 
	{
        var aFiles = getFileList(libs, "frame/");
        loadJSFiles(aFiles, pfNotify);
	}
};
$F.Libs = Libs;

$.extend($F.Utils, 
{
    loadUtil: function (utilName, pfNotify) 
    {
        var aFiles = getFileList(utilName, "frame/utils/");
        loadJSFiles(aFiles, pfNotify);
    },
    regUtil: function (sUtilName, oUtilObj)
    {
        var oPool = this;
        if(!oPool[sUtilName])
        {
            oPool[sUtilName] = oUtilObj;
        }
        log("reg util: " + sUtilName);
    },
    adjustHeader:adjustGlobalHeader
});

var Widgets = {
    _oPool:{},
    loadWidget: function (widgetName, pfNotify) 
    {
        var aFiles = getFileList(utilName, "frame/widget_new/");
        loadJSFiles(aFiles, pfNotify);
    },
    regWidget: function (sWidgetName, oRegInfo)
    {
        Libs.load(oRegInfo.libs, function()
        {
            var oPool = Widgets._oPool;
            if(!oPool[sWidgetName])
            {
                oRegInfo.loadEnd = new Date();
                oPool[sWidgetName] = oRegInfo;
            }
        });
    },
    initWidgets: function (oWidgets, jContent)
    {
        if (!oWidgets)
        {
            return;
        }

        var aWidgets = oWidgets;
        if(!$.isArray(oWidgets))
        {
            aWidgets = [oWidgets];
        }

        var oPool = Widgets._oPool;
        for (var i = 0; i < aWidgets.length; i++)
        {
            var oWidgetsInfo = oPool[aWidgets[i]];
            oWidgetsInfo.init(jContent);
        }
        return;
    },
    destroyWidgets: function (oWidgets, jContent)
    {
        if (!oWidgets)
        {
            return;
        }

        var aWidgets = oWidgets;
        if(!$.isArray(oWidgets))
        {
            aWidgets = [oWidgets];
        }

        var oPool = Widgets._oPool;
        for (var i = 0; i < aWidgets.length; i++)
        {
            var oWidgetsInfo = oPool[aWidgets[i]];
            oWidgetsInfo && oWidgetsInfo.destroy(jContent);
        }
        return;
    }
    ,onChangeTheme: function ()
    {
        var oPool = Widgets._oPool;
        for (var sName in oPool)
        {
            var oWidgetsInfo = oPool[sName];
            if (oWidgetsInfo && oWidgetsInfo.changeTheme)
            {
                oWidgetsInfo.changeTheme ();
            }
        }
    }
};
$F.Widgets = Widgets;

function adjustGlobalHeader (jContent)
{
    jContent = jContent || $("#tabContent");
    var jHeaderLine = $(".headline", jContent);

    var jTitle = $("span.title", jHeaderLine);
    var sTitle = jTitle.html();
    if (sTitle)
    {
        jTitle.remove ();
        var aTitles = sTitle.split(",");
        for(var i=0;i<aTitles.length;i++)
        {
            Frame.NewMenu.addMenuPath(aTitles[i]);
        }
    }

    // move to tabs
    // var bTab = false;
    // var jUL = $('<ul class="nav nav-tabs"></ul>');
    // $(".btn-group.btn-text a.btn", jHeaderLine).each(function(i, oLink)
    // {
    //     var jLI = $("<li></li>");
    //     var jLink = $(oLink);
    //     if (jLink.is(".active"))
    //     {
    //         jLI.addClass("active");
    //     }
    //     jLink.removeAttr("class");
    //     jLI.append(jLink).appendTo(jUL);
    //     bTab = true;
    // });
    // if (bTab)
    // {
    //     jContent.prepend(jUL);
    // }

    var jButtons = $(".btn-group", jHeaderLine);
    if(jHeaderLine.hasClass("wlan-headline") || jButtons.length == 0)
    {
        $("#global_btns").empty().append(jButtons);

        jHeaderLine.remove ();
    }
    else
    {
        jHeaderLine.show();
    }
}

Utils.Pages = {
    _oModulePara:{}
    ,Mods: new jsFileMange()
    ,getWindow: function(jPage)
    {
        var jPageWindow = jPage.closest(".modal");
        if(jPageWindow.length == 0)
        {
            jPageWindow = jPage.closest(".sub-page");
        }
        return jPageWindow;
    }
    ,closeWindow: function(jPageWindow)
    {
        if(jPageWindow.is(".modal"))
        {
            // dialog page
            jPageWindow.modal("hide");
            return ;
        }

        // right panel
        history.back ();
        // Frame.getHelpPanel().close();
    }
    ,loadJS: function(sModId, olibs,data)
    {
		var oMods = this.Mods;
		var oModPara = this._oModulePara;

		function onPageReady()
        {
            sModId = sModId.toLowerCase();
			var oModule = oModPara[sModId] || {content:$("#tabContent"), data:null};
			var jContent = oModule.content;
			var oData = oModule.data;
			var oPageInfo = oMods.getModInfo(sModId);
			Widgets.initWidgets(oPageInfo.widgets, jContent);
			oPageInfo.init(oData, jContent);

            //
            if(sModId.split(".").length == 2)
            {
                adjustGlobalHeader (jContent);
            }

            if (oPageInfo.resize)
            {
                oPageInfo.resize (jContent);
            }

			return;
		}

		if (!olibs)
		{
			olibs = sModId;
		}
		this.Mods.loadJs(sModId, olibs, onPageReady);		
    }
    ,getModule: function (module)
    {
        var sModId = ("string" == typeof(module)) ? module : module.attr("modId");
        return this.Mods.getModInfo(sModId);
    }
    ,regModule: function(sModId, oModObj)
    {
        sModId = sModId.toLowerCase();
        this.Mods.regModule(sModId, oModObj);
    }
	,updateModule: function(sModId, oPara, jContent)
	{
		var oMods = this.Mods;
		if ($("[modId='" + sModId + "']").length > 0)
		{
			var oPageInfo = oMods.getModInfo(sModId);
			var pf = oPageInfo.update || oPageInfo.init;
			pf(oPara, jContent);
			return;
		}
	}
	,updateJContent: function(jContent, oPara)
	{
		var sModId = jContent.attr("modId");
		if (sModId)
		{
			Utils.Pages.updateModule(sModId, oPara, jContent);
			return;
		}
	}
	,destroy: function(para)
	{
		var sModId, jContent;

        if ("string" == typeof(para))
        {
            sModId = para;
        }
        else
        {
            jContent = para;
            sModId = jContent.attr("modId");
        }

        if (sModId)
        {
            sModId = sModId.toLowerCase();
            var oModPara = this._oModulePara;
            var oModule = oModPara[sModId] || {content:$("#summary_div"), data:null};
            var jContent = oModule.content;
            var oPageInfo = this.Mods.getModInfo(sModId);

         //   Utils.Request.clearMoudleAjax(sModId);

            jContent.removeAttr("modId");

            // the page maybe not exist
            if (oPageInfo)
            {
                oPageInfo.destroy();
                Widgets.destroyWidgets(oPageInfo.widgets, jContent);
            }

            delete oModPara[sModId];
        }
    }
    ,loadModule: function(sModId, oPara, jContent, pfFunc)
    {
        var aTemp = sModId.split("#");
        var sAnchor = aTemp[1];
        sModId = aTemp[0];

        function scrollToAnchor()
        {
            if(sAnchor)
            {
                var jAnchor = $("#" + sAnchor, jContent); 
                if(jAnchor.length)
                {
                    $("#page_container").scrollTop(jAnchor.offset().top-130);
                }
            }
        }

        function loadEnd ()
        {
            var jDlg = $(this).closest(".modal");
            if(jDlg.length > 0)
            {
                // move the dialog to center, after loading
                jDlg.modal ("layout");
            }

            scrollToAnchor();

            if (pfFunc)
            {
                pfFunc.apply(this);
            }
        }

        this.destroy(jContent);

        sModId = sModId.toLowerCase();
		this._oModulePara[sModId] = {"content":jContent, "data":oPara};
		var sUrl = sModId;
		if(-1 == sUrl.indexOf(".html"))
        {
            var aUrl = sModId.split(".");
            var nLen = aUrl.length-1;
            sUrl = "";
            for(var i=0;i<=nLen;i++)
            {
                if(i == nLen)
                {
                    sUrl = sUrl + "[lang]/" + aUrl[i] + ".html";
                }
                else
                {
                    sUrl = sUrl + aUrl[i] + "/";
                }
            }
            sUrl = sUrl;			
			sUrl = Frame.Util.getPathUrl(sUrl);
			
        }else{
            sUrl = Frame.Util.getPathUrl(sUrl);
        }               

        jContent.attr("modId", sModId);
        jContent.empty().load(sUrl, false, loadEnd);
	}
    ,_resize: function ()
    {
        var oModPara = Utils.Pages._oModulePara;

        for (var sModId in oModPara)
        {
            var oPageInfo = false;
            var oModule = oModPara[sModId];
            if (oModule && oModule.content)
            {
                oPageInfo = Utils.Pages.Mods.getModInfo(sModId);
            }
            if (oPageInfo && oPageInfo.resize)
            {
                oPageInfo.resize (oModule.content);
            }
        }
    }
    ,onChangeTheme: function ()
    {
        var oModPara = Utils.Pages._oModulePara;

        for (var sModId in oModPara)
        {
            var oPageInfo = false;
            var oModule = oModPara[sModId];
            if (oModule && oModule.content)
            {
                oPageInfo = Utils.Pages.Mods.getModInfo(sModId);
            }
            if (oPageInfo && oPageInfo.changeTheme)
            {
                oPageInfo.changeTheme (oModule.content);
            }
        }
    }
};

function loadJSFiles(aFiles, pfNotify, notifyPara)
{
	var iFileNum = 0;
    var aSend = [];

    function loadOver(sJsFile)
    {
        log("load end of " + sJsFile);
    	iFileNum++;
    	if(aFiles.length === iFileNum)
    	{
    		pfNotify && pfNotify(notifyPara);
    	}
    	return;
    }

    // not files need load
    if(0 === aFiles.length)
    {
        pfNotify && pfNotify(notifyPara);
    }

    for (var i = 0; i < aFiles.length; i++)
    {
    	var sJsFile = Frame.Util.getPathUrl(aFiles[i]);
        log("load start of " + sJsFile);
    	$.loadScript(sJsFile, loadOver);
    }
}

function jsFileMange()
{
	this.loadJs = loadJs;
	this.regModule = regModule;
	this.getModInfo = getModInfo;

	var _oModPool = {};

	function getModFormPool(sModId)
	{
        sModId = sModId.toLowerCase();
		var oMod = _oModPool[sModId];
		if (!oMod)
		{
			oMod = null;
		}
		return oMod;
	}

	function setModToPool(sModId, oMod)
	{
        sModId = sModId.toLowerCase();
		_oModPool[sModId] = oMod;
		return;
	}

	function getModInfo(sModId)
	{
        sModId = sModId.toLowerCase();
		var oMod = getModFormPool(sModId);
		return oMod ? oMod.oModInfo : null;
	}

	function isModRegOk(oMod)
	{
		var bOK = false;
		if (oMod)
		{
			var oLoadInfo = oMod.oLoadInfo;
			bOK = (oLoadInfo.bJsFileOk && oLoadInfo.bUtilsOk && oLoadInfo.bWidgetsOk);
		}
		return bOK;
	}

	function setItemOk(sModId, sType)
	{
		var oMod = getModFormPool(sModId);
		var oLoadInfo = oMod.oLoadInfo;

		log("setItemOk: " + sModId + ", " + sType);

		if(true === oLoadInfo[sType])
		{
			Frame.Debuger.assert(false, "Duplicate setting");
			return;
		}

		oLoadInfo[sType] = true;
		if(isModRegOk(oMod))
		{
			oMod.pfNotyList(sModId);
		}
		return;
	}

	function loadJs(sModId, olibs, pfModRegNtfy)
	{
		log("jsFileMange loadJs: " + sModId);
		var oModule = getModFormPool(sModId);
		if (isModRegOk(oModule))
		{
			log("registered: " + sModId);
			pfModRegNtfy && pfModRegNtfy(sModId);
			return true;
		}

		if (oModule)
		{
            // is loading
			return true;
		}
		
		oModule = {
			oLoadInfo: {bJsFileOk:false, bUtilsOk:false, bWidgetsOk:false},
			pfNotyList:null,
			oModInfo: null
		};
		if (pfModRegNtfy)
		{
			oModule.pfNotyList = pfModRegNtfy;
		}
		setModToPool(sModId, oModule);

		// loading
        var aFiles = getFileList(olibs, "");
        log("js loading: " + sModId);
        loadJSFiles(aFiles, function()
        {
        	setItemOk(sModId, "bJsFileOk");
        });
        return false;
    }

    function regModule(sModId, oModObj)
    {
        oModObj.loadEnd = new Date();
        getModFormPool(sModId).oModInfo = oModObj;

        var isReady = function(oPool, aNames)
        {
            var bReady = true;
            aNames = aNames||[];
            for(var i=0; i<aNames.length; i++)
            {
                if(!oPool[aNames[i]])
                {
                    bReady = false;
                    break;
                }
            }
            return bReady;
        };
        var pfDebug = function(t1)
        {
            var t2 = new Date();
            if(t1 && (t2-t1 > 5000))
            {
                Frame.Debuger.error("Please check your widgets or utils's name in modal " + sModId);
                return false;
            }

            return t1;
        }

        function waitForWidget(sModId, aWidgets)
        {
            var t1 = new Date();
            Frame.Signal.waitVar(
                function(){t1=pfDebug(t1); return isReady(Widgets._oPool, aWidgets)},
                function(){setItemOk(sModId, "bWidgetsOk")});
        }
        function waitForUtils(sModId, aUtils)
        {
            var t1 = new Date();
            Frame.Signal.waitVar(
                function(){t1=pfDebug(t1); return isReady(Utils, aUtils)},
                function(){setItemOk(sModId, "bUtilsOk")});
        }

        function onLoadOver()
        {
            waitForWidget(sModId, oModObj.widgets||[]);
            waitForUtils(sModId, oModObj.utils||[]);
        }

        var aJsFiles = mergeFiles (oModObj);
        loadJSFiles(aJsFiles, onLoadOver);
    }
}

Frame.regNotify("mjs", "resize",  Utils.Pages._resize);
Frame.regNotify("mjs", "change.theme",  function(){
    Utils.Pages.onChangeTheme();
    Widgets.onChangeTheme()
});

})(window)
