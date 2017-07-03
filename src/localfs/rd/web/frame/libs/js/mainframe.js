var Frame = {};
var Utils = {};

$.MyLocale = {};

function getPageWidth()
{
    return $("body").width();
}

/*****************************************************************************
@FuncName, Class, menuBar
@DateCreated: 2013-06-08
@Author: 
@Description: process menu
@Usage:
@ParaIn:
@Return: 
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
function menuBar()
{
	//var sidebarWidth = 225;
	//var sidebarCollapsedWidth = 35;
	//var _iCurHeight;

	this.styleChange = styleChange;
	this.doResize = doResize;
	this.initMenu = initMenu;

	function styleChange()
	{
		return;
	}

	function doResize(iHeight)
	{
        return;
	}
    function onMenuClick(e)
    {
        var jSubMenu = $(this).next();

        // menuitem
        if (false == jSubMenu.hasClass("sub-menu"))
        {
            return;
        }

        // submenu

        var jParent = $(this).parent().parent();
        
        jParent.children('li.open').children('a').children('.arrow').removeClass('open');
        jParent.children('li.open').children('.sub-menu').slideUp(200);
        jParent.children('li.open').removeClass('open');

        if (jSubMenu.is(":visible")) 
        {
            jQuery('.arrow', jQuery(this)).removeClass("open");
            jQuery(this).parent().removeClass("open");
            jSubMenu.slideUp(200);
        }
        else
        {
            jQuery('.arrow', jQuery(this)).addClass("open");
            jQuery(this).parent().addClass("open");
            jSubMenu.slideDown(200);
        }
        return false;
    }
	/*function showSubmenu ()
	{
	}
	
	function hideSubmenu ()
	{
	    if(!$("#menu_div").hasClass("mobile"))
        {
            $(".page-sidebar-menu li.active .sub-menu").hide();
            $(".page-sidebar-menu li.open .sub-menu").hide();
            $(".page-sidebar-menu li.open").removeClass("open");
            $(".page-sidebar-menu li .arrow.open").removeClass("open");
        }
	}*/

	function initMenu()
	{
        // add events
        $('#side_menu .page-sidebar-menu')
            .on('click', 'li > a', onMenuClick);
    }
}
function initFrameCenter()
{
    var _jFrame = $('.page-sidebar-fixed ');
    var bIsIE8 = isIE8Browser();
    if(bIsIE8)
    {
        _jFrame.addClass("ie8");
    }
    
    function isIE8Browser()
    {
        var bIE8 = false;
        if($.browser.msie && (parseInt($.browser.version) == 8))
        {
            bIE8 = true;              
        }
        return bIE8;
    }    
}

function mainContent()
{
    var jContainer = $("#page_container");
    var jContent = $("#summary_div .tab-content", jContainer);

    this.doResize = doResize;
    
    function doResize(iHeight)
    {
        /********************************
         * Modify by wkf5041, 2015/04/25
         
         **************************************/
        var nScreenHeight = $(window).height();
        jContainer.height (nScreenHeight - parseInt(jContainer.css("margin-top")) - parseInt(jContainer.css("margin-bottom")));

        if ($(window).width() < MyConfig.Layout.width1)
        {
            Frame.Scrollbar.destroy(jContainer);
            Frame.Scrollbar.destroy(jContent);

            // nofity resize for all controls
            Frame.notify("all", "resize");
            return;
        }

        // for dashboard
        if (jContent.is(":visible"))
        {
            var nHeight = nScreenHeight;
            var jCopyRight = $(".copyright", jContainer);
            if (jCopyRight.is(":visible"))
            {
                nHeight -= jCopyRight.height();
            }
            Frame.Scrollbar.create (jContent, nHeight);
        }

        // add scrollbar for page container
        Frame.Scrollbar.create (jContainer, nScreenHeight);

        // nofity resize for all controls
        Frame.notify("all", "resize");
    }
}

var Mobile = {
    resize: function()
    {
        $("#frame_menu").hide();
        $("#frame_menu").css({ marginTop: "45px"});
    },
    init: function (bOpened)
    {
        $("#menu_div").addClass("mobile");
        $("#summary_div").width("auto");
        $("#edit_div").width("auto");

        if(bOpened)
        {
            $("#summary_div").hide()
            $("#edit_div").show();
        }
        else
        {
            $("#summary_div").show();
            $("#edit_div").hide();
        }

        MyConfig.MList.selectMode = "mobile";
    },
    openNewPage: function()
    {
        $("#summary_div").hide()
        $("#edit_div").show();
    },
    closeNewPage: function()
    {
        $("#summary_div").show()
        $("#edit_div").hide();
    },
    onBodyClick: function(e)
    {
        var jMenuDiv = $(".mobile #frame_menu");
        var jMenuToggle = $(".mobile .menu-toggle");
        jMenuDiv.hide();
        jMenuToggle.removeClass("active");
    }
}

var Tablet = {
    resize: function()
    {
        //summary view
        var jPageCont = $("#tabContent");
        var jPageColum = $(".app-colum", jPageCont);
        if(jPageCont.width() < 1024 )
        {
            jPageColum.addClass('no-float');
        }
        else
        {
            jPageColum.removeClass('no-float');
        }

        //echart
        $(".myEchart", jPageCont).each(function(index,item){
            var jEle = $(this);
            if(jEle.is(":visible"))
            {
                jEle = $(this).data("instance");
                jEle && jEle.chart && jEle.resize();
            }
        });

    },
    init: function (bOpened)
    {
        
    },
    openNewPage: function()
    {
        
    },
    closeNewPage: function()
    {
        
    },
    onBodyClick: function(e)
    {

    }
}

var DeskPC = {
    resize: function()
    {
        //summary view
        var jPageCont = $("#tabContent");
        var jPageColum = $(".app-colum", jPageCont);
        if(jPageCont.width() < 1024 )
        {
            jPageColum.addClass('no-float');
        }
        else
        {
            jPageColum.removeClass('no-float');
        }

        //echart
        $(".myEchart", jPageCont).each(function(index,item){
            var jEle = $(this);
            if(jEle.is(":visible"))
            {
                jEle = $(this).data("instance");
                jEle && jEle.chart && jEle.resize();
            }
        });
    },
    init: function ()
    {
    },
    openNewPage: function()
    {
    },
    closeNewPage: function()
    {
    },
    onBodyClick: function(e)
    {
        
    }
}

/*****************************************************************************
@FuncName, Class, MainFrame
@DateCreated: 2013-06-08
@Author: 
@Description: process main MainFrame
@Usage:
@ParaIn:
@Return: 
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
function MainFrame()
{
	var _oMenuBar = new menuBar();//����menu���󣨳�ʼ��menubar��

	var _oMainContent = new mainContent();//����mainContent���󣨳�ʼ��mainContent��
    var _oCurDevice = false;
    var _bOpened = false;

    function getDeviceByWidth()
    {
        var oDevice;
        var nScreenWidth = getPageWidth();

        if(nScreenWidth >= MyConfig.Layout.width2)
        {
            oDevice = DeskPC; //DeskPC;
        }
        else if(nScreenWidth >= MyConfig.Layout.width1)
        {
            oDevice = Tablet; // update Mobile wei Tablet
        }
        else
        {
            oDevice = Mobile;
        }

        if(_oCurDevice != oDevice)
        {
            oDevice.init(_bOpened);
            _oCurDevice = oDevice;
        }

        return oDevice;
    }

   /* function initMenuSwitchBtn()
    {
        $("#tree_switch li.switch").on("click",onSwitchClick);
        $("#tree_switch li.switch").hover(onSwitchOver,onSwitchOut);

        var hTimer = false;
        var _sType = "1";
        function onSwitchClick(e)
        {
            var jEle = $(this);
            if(jEle.hasClass("active") || jEle.hasClass("disabled"))
            {
                return ;
            }
            jEle.parent().find('li').removeClass("active");
            jEle.addClass("active");
            var sType = jEle.attr("val");
            _sType = sType;
            doSwitch(sType);
        }

        function onSwitchOver(e)
        {
            var jEle = $(this);
            if(jEle.hasClass("disabled") || jEle.hasClass("m-hover"))
            {
                return ;
            }

            jEle.parent().children().removeClass("active");
            jEle.parent().find('li').removeClass("m-hover");
            jEle.addClass("m-hover");

            var sType = jEle.attr("val");

            if(hTimer)
            {
                clearTimeout(hTimer);
                hTimer = false;
            }
            hTimer = setTimeout(function(){
               doSwitch(sType);
            },200);
        }

        function onSwitchOut(e)
        {
            var jEle = $(this);
            if(hTimer)
            {
                clearTimeout(hTimer);
                hTimer = false;
            }
            hTimer = setTimeout(function(){
               doSwitch(_sType);
               jEle.parent().children("[val="+_sType+"]").addClass("active");
               jEle.parent().children().removeClass("m-hover");
            },50);
        }

        function doSwitch(sType)
        {
            var jContainer = $("#side_menu");
            var nWidth = jContainer.width();
            if(sType == "0")
            {
                $('body').layout().hide("west");
            }
            else if(sType == "1")
            {
                //nWidth = nWidth/2 <= 200 ? 402 : nWidth;
                $(".tree-block",jContainer).hide();
                $('body').layout().show("west");
                $("body").layout().sizePane("west",201);
            }
            else if(sType == "2")
            {
                //nWidth = nWidth <= 200 ? 200 : nWidth;
                $(".tree-block",jContainer).show();
                $('body').layout().show("west");
                $("body").layout().sizePane("west",402);
            }
        }
    }*/

    function onBodyClick(e)
    {
        _oCurDevice.onBodyClick(e);
    }

    function doResize(bMenu)
    {
        _oMenuBar.styleChange();
        getDeviceByWidth();

        _oMenuBar.doResize($(window).height());

        if(true === bMenu)
        {
            // resize menu only
            return ;
        }

        _oCurDevice.resize($(window).height());
        _oMainContent.doResize();
    }

    function initResize()
    {
        var oTimer;
        var oScrn = document.documentElement;
        var oOldScrn = {"width": oScrn.clientWidth, "height": oScrn.clientHeight};

        $(window).resize(function() 
        {
            if((oOldScrn.height == oScrn.clientHeight) && (oOldScrn.width == oScrn.clientWidth))
            {
                //return;
            }

            oOldScrn = {"width": oScrn.clientWidth, "height": oScrn.clientHeight};

            if (oTimer) 
            {
                clearTimeout(oTimer);
            }
            oTimer = setTimeout(function() {doResize();}, 100);
        });
    }

    function onMenuReady()
    {
        _oMenuBar.initMenu();
        return;
    }

    function onNewPageOpen()
    {
        _bOpened = true;
        _oCurDevice.openNewPage();
    }

    function onNewPageClose()
    {
        _bOpened = false;
        _oCurDevice.closeNewPage();
    }

    function onNewPageResize()
    {
        _oCurDevice.resize();
    }

    Frame.regNotify("newPage", "open", onNewPageOpen);
    Frame.regNotify("newPage", "close", onNewPageClose);
    Frame.regNotify("newPage", "resize", onNewPageResize);

    $("body").addClass("page-header-fixed page-sidebar-fixed page-footer-fixed");
    $(".header").removeClass("navbar-static-top").addClass("navbar-fixed-top");

    initFrameCenter();//У��������Ƿ�ie8,���ie8����
    initResize();
    doResize();

    $("body").on("click", onBodyClick);

    createMenu($("#side_menu"), $("#frame_tablist"), null,onMenuReady);
    Frame.init();
    $("#pop-devicename").text($("#devicename").val());


}

var g_oMainFrame;

/*****************************************************************************
@FuncName, private, documentReady
@DateCreated: 2013-06-08
@Author: 
@Description: main entry
@Usage:
@ParaIn:
@Return: 
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
jQuery(document).ready(function() 
{
    	$.ajax({
		url: "/rd/getRdUserName",
		type: "GET",
		dataType: "json",
		contentType:"application/json",
		success: function(data)
		{
			FrameInfo.uname = data.rdUserName;
            g_oMainFrame = new MainFrame();
		},

		error: function()
		{
			console.log('send failed');   
		}
	});
    
});

