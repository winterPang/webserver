
function createMenu(oContainer, jTab, oNav, pfReadyNotify)
{
    var _oMenuObject = false;
    var _oContainer = oContainer;
    var _mainMenu = $(".menu-main",_oContainer);
    var _jTabUl = jTab;
    var _oTabContent = $("#tabContent");
    var _aActive = [];
    var _oNav = $("<ul class='breadcrumb'></ul>").prependTo(oNav);
    var _aUrlTable = false;
    var _sDefaultMenuId = false;
    var _jActivePage = _oTabContent;
    var _bUseTab = true;
    var _sCustomUrl = false;
    var _hTimer = false;
    var _oMID = {dpi:"M_DPI",yun:"M_YUNWEIHU",dashboard:"M_DASHBOARD"};
    var _sCurMenuType = _oMID["dpi"];


/***************************************************************************************/
/* interval methods */
    function findApManage(aMenuData)
    {
        var sTarget = "M_APManage"
        function doFind(aMenuData)
        {
            for(var i=0;i<aMenuData.length;i++)
            {
                var oTemp = aMenuData[i];
                if(oTemp.id == sTarget)
                {
                    sTarget = oTemp.tabs || oTemp.submenu;
                    sTarget = sTarget[0] || {};
                    sTarget = sTarget.id;
                }
                else if(oTemp.tabs || oTemp.submenu)
                {
                    doFind(oTemp.submenu || oTemp.tabs);
                }
            }
        }

        doFind(aMenuData);
        return sTarget;
    }

    function _getUrlById(sMenuId)
    {
        var oApNode = {
            M_APDetail : true,
            M_APGDetail : true,
            M_APGSetting : true,
            M_AccessPoints : true,
            M_APGroups : true,
            M_APSettings : true,
            M_APProvision : true,
            M_APGroupProvision : true,
            M_APConfig:true
        };

        var oInfor = _aUrlTable[sMenuId||_sDefaultMenuId];
                
        if(!oInfor && oApNode[sMenuId])
        {
            var sNewId = findApManage(_oMenuObject[_sCurMenuType]);
            window.location = "#"+sNewId;
        }
        else if(!oInfor && sMenuId == "M_SysLog")
        {
            sMenuId = "M_Dashboard";
            //window.location = "#"+sMenuId;
        }

        return _aUrlTable[sMenuId||_sDefaultMenuId];
    }

    function _loadModule(oUrlInfo)
    {
        function setActiveTab()
        {   
            var jHeaderLine = $(".headline",_jActivePage);
            var jTitle = $("span.title", jHeaderLine);
            var sTitle = jTitle.html();
            if(sTitle)
            {
                _addMenuPath(sTitle);
                jTitle.remove ();
            }
            if($(".nav.sub-nav.nav-tabs").is(':visible'))
            {
                $(".nav.sub-nav.nav-tabs li>a[href="+sTabId+"]").click();
                _adjustNavBar(false);
            }
        }
        function getActiveTab()
        {
            var sActiveTab = $(".nav.sub-nav.nav-tabs li.active>a").attr("href");

            return sActiveTab || Utils.Base.activeTab;
        }
        // oUrlInfo.url is "ModuleName/[lang]/Page.html"
        var sUrl = _sCustomUrl || oUrlInfo.url;
        var aModId = sUrl.split(/[/.]/);
        var sTabId = getActiveTab();

        sUrl = (aModId.length>3) ? (aModId[0]+"."+aModId[2]) : sUrl;
        Utils.Pages.loadModule(sUrl, null, _jActivePage, setActiveTab);
    }

    function _updateModule(oUrlInfo)
    {
        // oUrlInfo.url is "ModuleName/[lang]/Page.html"
        var aModId = oUrlInfo.url.split(/[/.]/);
        var sUrl = (aModId.length>3) ? (aModId[0]+"."+aModId[2]) : oUrlInfo.url;
        Utils.Pages.updateModule(sUrl, {type:"update"}, _jActivePage);
    }

    function _isNewMenuItem(sMenuId)
    {
        var bNewItem = true;
        $.each($("a",_jTabUl), function(i, item)
        {
            if("#"+sMenuId == $(this).attr("href"))
            {
                bNewItem = false;
                return false;
            }
        });

        return bNewItem;
    }

    function _getRcText(oItem, type)
    {
        //type:"Menu","mainFrame" ...
        var oRcMsg = $.MyLocale[type];
        var sId = oItem.id || oItem;
        if(_isHelpId(sId))
        {
            sId = "HELP";
        }

        return oItem.desc || oRcMsg[sId];
    }
    
    function _makeUrlTable(oParent, aMenuData, aUrlInfo)
    {
        if(!aMenuData || aMenuData.length == 0)
        {
            return ;
        }

        for(var i=0; i<aMenuData.length; i++)
        {
            var oData = aMenuData[i];
            oData.parent = oParent;
            
            if(oData.submenu)
            {
                _makeUrlTable(oData, oData.submenu, aUrlInfo);
            }
            else if(oData.tabs)
            {
                _makeUrlTable(oData, oData.tabs, aUrlInfo);
            }
            else
            {
                aUrlInfo[oData.id] = oData;
                if(!_sDefaultMenuId)
                {
                     _sDefaultMenuId = oData.id;
                }
            }
        }
    }

/***************************************************************************************/
/* plugin: menu path */

    function _initPathBtn()
    {
        function openNode(jTree,id)
        {
            jTree.jstree("open_node",{id:id});
            var sParent = jTree.jstree("get_node",{id:id}).parent;
            if(sParent)
            {
                openNode(jTree,sParent);
            }
        }

        $(_oNav).off().on('click', 'li>span.path-link', function(){
            var sType = $(this).attr("type");
            var sId = $(this).attr("href");
            var jTree = $("#menuTree");
            switch(sType)
            {
                case "tree":
                     jTree.jstree("close_all");
                    jTree.jstree("deselect_all");
                    openNode(jTree,sId);
                    jTree.jstree("select_node",{id:sId});
                    _showMenuPath();
                    break;
                case "menu":
                    $('.page-sidebar-menu li>a:[href='+sId+']>span.menu-item').click();
                    break;
                case "tab":
                    $("#frame_tablist li.active>a>span").click();
                    break;
                case "system":
                    $('#side_menu .menu-title').click();
                    break;
                default:
                    break;
            }

            return false;
        })
    }

    function _setWindowTitle (sTitle)
    {

        var aTitle = [$.MyLocale_cn.Menu.NAME];

        var jMenuItems = _mainMenu.find("li.active>a");
        for (var i=0; i<jMenuItems.length; i++)
        {
            aTitle.push ($(jMenuItems[i]).text());
        }

        if(sTitle)
        {
            aTitle.push(sTitle);
        }

        document.title = aTitle.join(MyConfig.titleSeperator || "|");
    }

    function _showMenuPath()
    {
        function pushPath(text,value,type)
        {
            var sHtml = '<li class="menu-path-item">' + sSep + '<span class="path-link" href="'
                      + value+'" type="'+type+'">'+text+'</span></li>';
            aLI.push (sHtml);
            sSep = '<i class="icon-chevron-right"></i>';
        }
        var jUL = _oNav;

        var sSep = '';
        var aLI = [];

        var aPath = Frame.Cookie.get("MenuPath");
        if(aPath)
        {
            aPath = JSON.parse(aPath);
            var nLen = aPath.length-1;
            for(var i = nLen;i >= 0;i--)
            {
                if( i == nLen && aPath[i].sId == "_TreeRoot")
                {
                    pushPath($.MyLocale.mainFrame["tree_root"],aPath[i].sId,"tree");
                }
                else
                {
                    pushPath(aPath[i].sText,aPath[i].sId,"tree");
                }
            }
        }
        else
        {
            pushPath($.MyLocale.mainFrame["system"],"#M_Dashboard","system");
            $('#view_switch .system').addClass("active");
            $('#view_switch .network').removeClass("active");
        }
        
        $("li.active>a>span.menu-item",_mainMenu).each (function(i, oSpan)
        {
            var sUrl = $(oSpan).parent().attr("href");
            if(sUrl != "#M_Dashboard")
            {
                pushPath(oSpan.innerHTML,sUrl,"menu");
            }
        });

        jUL.html (aLI.join(''));

        var oActiveTab = $("li.active > a", _jTabUl)[0];
        if (oActiveTab)
        {
            var opt = {
                value : $(oActiveTab).attr("href"),
                type : "tab"
            };
            _addMenuPath ($(oActiveTab).text(),opt);
        }

        _initPathBtn();
    }

/***************************************************************************************/
/* menu */

    function _activeMenuItems(oMenuItem)
    {
        while (_aActive.length)
        {
            _aActive.pop().removeClass("active");
        }
        
        var jLink = $("a[href=#"+oMenuItem.id+"]");

        if(jLink.length == 0 )
        {
            var sMenuId = oMenuItem.parent.tabs || [];
            sMenuId = sMenuId[0] || {};
            sMenuId = sMenuId.id || "";

            jLink = $("a[href=#"+sMenuId+"]");
        }

        var jParent = jLink.parent();
        while ((jParent.length>0) && !jParent.is(_mainMenu))
        {
            if(jParent.is("li"))
            {
                jParent.addClass("active");
                _aActive.push(jParent);
            }
            jParent  = jParent.parent();
        }
    }

    function _makeSubMenu(aArray, iLevel)
    {
        if(!aArray || aArray.length == 0)
        {
            return ;
        }
        var aClass = ["page-sidebar-menu","first sub-menu","sub-menu","sub-menu","sub-menu"];
        var jUL = $('<ul class=' + '"' + aClass[iLevel] + '"' +'></ul>');

        for (var i = 0; i<aArray.length; i++)
        {
            var oCurItem = aArray[i];
            var jItem = $('<li></li>');
            var jLink = $('<a href="#' + oCurItem.id + '" title="'+_getRcText(oCurItem, "Menu")+'"></a>');

            //TODO:  is need icon ?
            //var sIcon = _IconMap[oCurItem.id];
            var sIcon = "noIcon";

            // add custom menu icon
            $('<i class="menu-icon ' + sIcon + '"></i>').appendTo(jLink);

            // menu node
            if ((oCurItem.submenu) || (oCurItem.tabs && !_bUseTab))
            {
                // add arrow icon
                $('<span class="menu-icon-arrow arrow"></span>').appendTo(jLink);
            }

            // add menu text
            $('<span class="menu-item"></span>')
                .text(_getRcText(oCurItem, "Menu"))
                .appendTo(jLink);

            jItem.append(jLink);

            if (oCurItem.submenu)
            {
                jItem.append(_makeSubMenu(oCurItem.submenu, iLevel+1));
            }

            else if (oCurItem.tabs)
            {
                if ( _bUseTab )
                {
                    // set the last menu-item link to the first tab item
                    jLink.attr("href", '#'+oCurItem.tabs[0].id);
                    jItem.data("tabs", oCurItem.tabs);
                }
                else
                {
                    jItem.append(_makeSubMenu(oCurItem.tabs, iLevel+1));
                }
            }
            jUL.append(jItem);
        }

        return jUL;
    }
    
    // main entry
    function _makeMenuMain(sMenuId)
    {
        var aMenuArry ,isRefresh; 

        if(sMenuId)
        {
            Frame.Cookie.set({"MenuType":sMenuId});
            isRefresh = false;
        }
        else
        {
            sMenuId = Frame.Cookie.get("MenuType");
            isRefresh = true;
        }
        
        _sCurMenuType = sMenuId || "M_System";
        _sDefaultMenuId = false;

        aMenuArry =  _oMenuObject[_sCurMenuType];
        _mainMenu.empty();
        _mainMenu.append(_makeSubMenu(aMenuArry, 0));

        _aUrlTable = {};
        _makeUrlTable(null, aMenuArry, _aUrlTable);

        if(!isRefresh)
        {
            window.location.hash = _sDefaultMenuId;
        }
    }

/***************************************************************************************/
/* tabs */

    function _createTabs(oUrlData)
    {
        if(!oUrlData)
        {
            return;
        }
        function _makeTabHtml(oTab)
        {
            var jItem = $('<li class="tab-item"></li>');
            var jLink = $('<a href="#' + oTab.id + '"><span></span></a>');

            jLink.find("span").text(_getRcText(oTab, "Menu"));
            jItem.append(jLink);
            _jTabUl.append(jItem);

            if(_isHelpId(oTab.id))
            {
                jLink.on("click", _onHelpClick);
            }
        }

        // remove the old tabs
        _jTabUl.empty();

        if (oUrlData.tabs && oUrlData.tabs.length != 0)
        {
            var aTabs = oUrlData.tabs;
            for (var i=0; i < aTabs.length; i++)
            {
                _makeTabHtml(aTabs[i]);
            }
        }
        else
        {
            _makeTabHtml(oUrlData);
        }
    }

    function _activeTab(oUrlInfo)
    {
        if (_bUseTab)
        {
            var sMenuId = Frame.Cookie.get("MenuType") || "M_System";
            $(".main_menu .sub_menu li.menu_list").removeClass("active").each(function(){
                if($(this).attr("menu") == sMenuId)
                {
                    $(this).addClass("active");
                    return false;
                }
            });
        }

        // load the new page
        if(_sCustomUrl === "WebMap")
        {
            showWebMap();
        }
        else
        {
            _loadModule(oUrlInfo);
        }

        _showMenuPath();
        _setWindowTitle ();
        
        // $(".page-sidebar-menu li.active .sub-menu").hide();
    }

function _isHelpId(sMenuId)
{
    return sMenuId.indexOf("_Help") > 0;
}

function _onHelpClick()
{
    var aTemp = this.href.split("#");
    var sMenuId = aTemp[1];
    _showHelp(sMenuId);
    return false;
}

function _showHelp(sMenuId)
{
    var jHelp = $("#help_content");
    var oUrlInfo = _getUrlById(sMenuId);

    sUrl = Frame.Util.getPathUrl(oUrlInfo.url);
    jHelp.load(sUrl, '', function(){jHelp.modal();});

    return false;
}

function showWebMap()
{
    Utils.Pages.loadModule("wdashboard.webmap", _oMenuObject, _jActivePage);
}

function _processSpecialUrl(sMenuId)
{
    if(sMenuId.indexOf("debug") == 0)
    {
        if("debug" == sMenuId) sMenuId = "debug.index";
        var sUrl = sMenuId.replace(".", "/") + ".html";
        Utils.Pages.loadModule(sUrl, null, _jActivePage);
        return true;
    }

    if(sMenuId.indexOf("_Help") > 0)
    {
        _showHelp(sMenuId);
        return true;
    }
    
    if (("" == sMenuId ) || ("M_Dashboard"==sMenuId))
    {
    	$("#page_container,#menu_div").addClass("dashboard");
        $("#side_menu ul li").has("a[href=#M_Dashboard]").addClass("active");
        //wkf5041:TODO
        _jTabUl.hide();
        $("#layout_center").layout().sizePane("north",55);
    }
    else
    {
    	$("#page_container,#menu_div").removeClass("dashboard");
    }

    return false;
}

/***************************************************************************************/
/* public methods */

    function _init()
    {
        
    }

    function _updatePage(sMenuId)
    {
        var oUrlInfo = _getUrlById(sMenuId);
        if(!oUrlInfo)
        {
            return false;
        }

        // menu-header
        if(oUrlInfo.submenu)
        {
            return true;
        }

        // menu-item
        if(oUrlInfo.tabs)
        {
            oUrlInfo = oUrlInfo.tabs[0];
        }

        _updateModule (oUrlInfo);
        return true;
    }

    function _loadPage(sMenuId)
    {
        if(_processSpecialUrl(sMenuId))
        {
            return true;
        }

        var oUrlInfo = _getUrlById(sMenuId);
        if(!oUrlInfo)
        {
            return false;
        }

        // menu-header
        if(oUrlInfo.submenu)
        {
            return true;
        }

        if (!_bUseTab)
        {
            _activeMenuItems(oUrlInfo);
            _activeTab(oUrlInfo);
            return true;
        }

        // menu-item
        if(oUrlInfo.tabs)
        {
            _activeMenuItems(oUrlInfo);
            _createTabs(oUrlInfo);
            _activeTab(oUrlInfo.tabs[0]);
        }
        else
        {
            // tab-item
            if(_isNewMenuItem(oUrlInfo.id))
            {
                _activeMenuItems(oUrlInfo);
            }
            else if(oUrlInfo.parent)
            {
                _activeMenuItems(oUrlInfo.parent.tabs[0]);
            }

            _createTabs(oUrlInfo.parent || oUrlInfo);
            _activeTab(oUrlInfo);
        }

        _jTabUl.find("li:last").addClass("lastitem");
        $("#global_btns").empty();

        return true;
    }

    function _setMenuPath(str)
    {
        var jSpan = $("li:last span", _oNav);
        var sText = jSpan.html() + ' [ <span>'+str+'</span> ]';
        jSpan.html(sText);
    }

    function _addMenuPath(str,opt)
    {
        opt = opt || {};
        opt.value = opt.value || "";
        opt.type = opt.type || "";

        var sTabHtml = '<li class="menu-path-item"><i class="icon-chevron-right"></i><span href="'
                     + opt.value+'" type="'+opt.type+'">'+str+'</span></li>';

        $(sTabHtml).appendTo(_oNav).prev().children('span').addClass('path-link');
    }

    function _popMenuPath()
    {
        var jLastLI = $("li:last", _oNav);

        jLastLI.prev()
            .removeAttr("backIndex")
            .removeClass("link")
            .unbind("click")

        jLastLI.remove();
    }

    var g_sCurMenuId = false;
    function parseCurMenuId()
    {
        var sHash  =window.location.hash;
        var sMenuId = sHash.split('?')[0];

        if(sMenuId != "")
        {
            // skip the first char "#"
            sMenuId = sMenuId.substring(1);
        }

        return sMenuId;
    }

    function getCurMenuId()
    {
        if(false === g_sCurMenuId)
        {
            g_sCurMenuId = parseCurMenuId();
        }

        return g_sCurMenuId;
    }
    var g_sFirstMenuId = false;
    function parseFirstMenuId()
    {
        var sTemp  =window.location.search;
        var fMenuId = sTemp.split("modelId=")[1] || "dpi";
        return fMenuId;
    }
    function getFirstMenuId()
    {
        if(false === g_sFirstMenuId)
        {
            g_sCurMenuId = parseFirstMenuId();
        }

        return g_sCurMenuId;
    }
    function isSupport(sMenuId)
    {
        return _aUrlTable[sMenuId] ? true : false;
    }
    function getMenuPath (sMenuId)
	{
		var aPath = [];
		
		// menu is not loaded
		if (!_aUrlTable)
		{
			return "FRAME";
		}
		
		sMenuId = sMenuId || getCurMenuId() || _sDefaultMenuId;
		var oItem = _aUrlTable[sMenuId];
		while (oItem)
		{
			aPath.push(oItem.id);
			
			oItem = oItem.parent;
		}
        aPath.push(Frame.Cookie.get("MenuType"));
		aPath.reverse();
		return aPath.join('/');
	}

    function _adjustNavBar(bShow){
        if(bShow)
        {
            _jTabUl.show();
            $("#layout_center").layout().sizePane("north",115);
        }
        else
        {
            _jTabUl.hide();
            $("#layout_center").layout().sizePane("north",55);
        }
    }

    function _reFresh()
    {
        _onUrlChanged();
        return;
    }

    function _onUrlChanged()
    {
        var oUrlPara = Utils.Base.parseUrlPara ();
        var sOldMenuId = g_sCurMenuId;
        var sPage = oUrlPara.np;

        g_sCurMenuId = parseCurMenuId();

        Frame.getHelpPanel().close();

        if(sPage)
        {
            _sCustomUrl = sPage;
        }
               
        _loadPage(g_sCurMenuId);
        _sCustomUrl = false;

        $(window).resize();
    }

    function _initNav()
    {
        $(".main_menu .sub_menu li .menu-tab").click(function(e){
            var jItme = $(this).parent();
            var sMenuId = jItme.attr("menu");
            
            if(jItme.hasClass("active")) return false;
            sMenuId && _makeMenuMain(sMenuId);
        });

        _makeMenuMain();
        _onUrlChanged();
        pfReadyNotify && pfReadyNotify();
    }


    function checkAndMakeMenu()
    {
        Frame.Signal.waitVar (
            function ()
            {
                return $.MyLocale.Lang ? true : false;
            },
            function ()
            {
                _initNav();
            });
    }

/***************************************************************************************/
/* static code */

    Frame.NewMenu = {
        init: _init,
        loadPage: _loadPage,
        getCurMenuId: getCurMenuId,
        isSupport: isSupport,
        getMenuPath: getMenuPath,
        setMenuPath: _setMenuPath,
        addMenuPath: _addMenuPath,
        popMenuPath: _popMenuPath,
        reloadMenu: _makeMenuMain,
        refreshPage: _reFresh
    };

    // Process BACK/FORWORD button on browser, not support IE6/7
    window.onhashchange = _onUrlChanged;
    _oMenuObject = MyConfig.MenuData;


    checkAndMakeMenu();
}
