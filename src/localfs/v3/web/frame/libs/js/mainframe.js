var Frame = {};
var Utils = {};

$.MyLocale = {};

function getPageWidth() {
    return $("body").width();
}

/**
 * toggle language
 */
var changeLange = function (lang) {
    if (lang == 'cn') {
        $('.cnLanguage').css('color', '#4ec1b2');
        $('.enLanguage').css('color', '#80878c');
    } else if (lang == 'en') {
        $('.cnLanguage').css('color', '#80878c');
        $('.enLanguage').css('color', '#4ec1b2');
    }
    Frame.Custom.changeLanguage(lang);
};

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
function MenuBar() {
    this.initMenu = initMenu;
    this.resizeMenu = resize;

    var resizeCount = 0;
    var oTimer = null;

    function onMenuClick(e) {
        var jSubMenu = $(this).next();

        // menuitem
        if (false == jSubMenu.hasClass("sub-menu")) {
            $('#side_menu .page-sidebar-menu li').removeClass("active")
            $(this).parent().addClass('active');
            $(this).parent().parent().parent().siblings().has('.sub-menu').children().filter("ul.sub-menu").hide();
            return;
        }

        $(this).parent().siblings().has('.sub-menu').children().filter("ul.sub-menu").hide();
        // submenu
        var jParent = $(this).parent().parent();
        if (jSubMenu.is(":visible")) {
            jSubMenu.hide();
        }
        else {
            jSubMenu.show();
        }
        return false;
    }

    function onFlowMenu(e) {
        var jContent = $('#side_menu');
        var jMenu = $('.page-sidebar-menu', jContent);
        var nTop = jMenu.css('marginTop').replace('px', "") * 1;
        var bIsUp = $(this).hasClass('down');
        var nGap = jContent.height() - jMenu.height();

        nGap = nGap > 0 ? 0 : nGap;
        bIsUp ? (nTop -= 78 * 2) : (nTop += 78 * 2);
        nTop = nTop > 0 ? 0 : (nTop < nGap ? nGap : nTop);

        jMenu.animate({marginTop: nTop + 'px'}, 200);
    }

    function resize() {
        var jContent = $('#side_menu');
        var jMenu = $('.page-sidebar-menu', jContent);

        if (jMenu.children('li').css("marginBottom") != '40px' && resizeCount < 10) {
            oTimer && clearTimeout(this.oTimer);
            oTimer = setTimeout(resize, 200);
            resizeCount++;
            return false;
        }
        resizeCount = 0;

        if (jMenu.height() < jContent.height()) {
            $('.menu-ctrl').fadeOut(100);
            jContent.css({bottom: 0});
            jMenu.animate({marginTop: 0 + 'px'}, 200);
        }
        else {
            $('.menu-ctrl').fadeIn(100);
            jContent.css({bottom: '12px'});
        }
    }

    function initMenu() {
        // add events
        $('#side_menu .page-sidebar-menu')
            .on('click', 'li > a', onMenuClick);
        $('.menu-ctrl').off('click.menuCtrl').on('click.menuCtrl', onFlowMenu);
    }
}

var Tablet = {
    resize: function () {
        //summary view
        var jPageCont = $("#tabContent");
        //echart
        $(".myEchart", jPageCont).each(function (index, item) {
            var jEle = $(this);
            if (jEle.is(":visible")) {
                jEle = $(this).data("instance");
                jEle && jEle.chart && jEle.resize();
            }
        });

    },
    init: function (bOpened) {

    },
    openNewPage: function () {

    },
    closeNewPage: function () {

    },
    onBodyClick: function (e) {

    }
}

var DeskPC = {
    resize: function () {
        var nScreenWidth = getPageWidth();
        var w = 200;
        $("#menu_div").width(w);
        var w2 = (nScreenWidth - w) / 2;
        $("#edit_div").width(w2);
        $("#summary_div").width(w2);
    },
    init: function () {
        $("#menu_div").show();
        $("#summary_div").show();
        $("#edit_div").show();

        MyConfig.MList.selectMode = "pc";
    },
    openNewPage: function () {
        $("#edit_div").show();
    },
    closeNewPage: function () {
        $("#edit_div").hide();
    },
    onBodyClick: function (e) {

    }
}

function UserBar() {
    function onLogout() {
        $.cookie("current_menu", "");
        Frame.Msg.confirm($.MyLocale.LOGOUT_CONFIRM, function () {
            window.location = "/v3/logout";
        });
        return false;
    }

    function onPassWord() {
        Utils.Base.openDlg("dashboard.changepassword", {}, {className: "modal-large"});
        return false;
    }

    function backHome() {
        $.cookie("current_menu", "");
        //window.location.href ="https://lvzhou.h3c.com/o2o/o2omng/homePage/homePage.xhtml";
        window.location.href = "/oasis/stable/web/frame/index.html#/global/content/home";
        return false;
    }

    function backSystem() {
        $.cookie("current_menu", "");
        // window.location.href ="https://lvzhou.h3c.com/o2o/o2omng/shop/shopListRedirect.xhtml?faces-redirect=true";
        window.location.href = "/oasis/stable/web/frame/index.html#/global/content/system/site";
        return false;
    }

    function toForum() {
        window.open("http://bbswlan.h3c.com/forum.php?mod=forumdisplay&fid=58");
        return false;
    }

    function onItemClick(e) {
        var sIndex = $(this).attr("index");
        var pfMap = [onPassWord, backHome, onLogout, backSystem, toForum];

        if (FrameInfo.Model == 999) {
            pfMap = [backSystem, backHome, onLogout];
        }
        pfMap[sIndex]();
    }

    function toggleUserMenu(e) {
        function show() {
            jMenu.slideDown(200);
            $('body').on('click.usermenu', hide);
        }

        function hide() {
            jMenu.slideUp(200);
            jMenu.prev().removeClass("active");
            $('body').off('click.usermenu');
        }

        var jMenu = $("#drop_list");
        $(this).toggleClass('active');
        jMenu.is(':visible') ? hide() : show();

        e.stopPropagation();
    }

    function eventOff() {
        return false;
    }

    function initUser() {
        $("#user_menu").unbind('click').bind('click', toggleUserMenu);
        $("#drop_list").off('click').on('click', 'li', onItemClick);
        $("#language_block").bind('click', eventOff)
        $("#change_language")
            .on("change", function (e) {
                console.log($(this).val());
                Frame.Custom.changeLanguage($(this).val());
            })
        var chat = $("#chat_html").xiaoBeiChat({
            xiaobeiPath: "../../web/chat/cn/chat.html",
            sessionId: FrameInfo.g_user.JSESSIONID
        })
        chat.bind("newMsg", function (e, data) {
            if (data) {
                $("#chat_html").removeClass();
                $("#chat_html").addClass("message_icon_get");
            } else {
                $("#chat_html").removeClass();
                $("#chat_html").addClass("message_icon");
            }
        })
        chat.bind("chatHeadImg", function (e, data) {
            if (data) {
                //  设置自己的头像
                $("#headerimg").attr("src", data);
            }
        })
    }

    this.initUser = initUser;

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
function MainFrame() {

    var _oMenuBar = new MenuBar();
    var _oUsetrBar = new UserBar();
    var _oCurDevice = false;
    var _bOpened = false;

    // ==============  选择场所，start  ==============
    /**
     * 解析路径参数
     * @param location  location对象
     * @return {{}}
     */
    function parseQuery(location) {
        var query = location.search.replace('?', '');
        var params = query.split('&');
        var result = {};
        $.each(params, function () {
            var temp = this.split('=');
            result[temp[0]] = temp.length === 2 ? temp[1] : undefined;
        });
        return result;
    }

    var $panel = $('#scenes_panel'), //  下拉面板
        $trigger = $('#change_scenes_trigger'),  //  点击展开的按钮
        $btnChange = $('#switchScenesBtn'),  //  确认按钮
        $selectedScene = $('#selectedScene'),  //  场景选择下拉框
        $devSn = $('#devSn'),  //  设备管理下拉
        $devContain = $('#device-contain'),
        $contain = $('#scene-contain');  //  容器
    //  if first load,set devsn value param's devsn
    var firstLoad = true, //   是否首次加载
        locales = {
            cn: {
                trigger: '切换设备',
                device: '选择设备',
                shop: '选择场所',
                online: '在线',
                offline: '不在线',
                minibei:'切换场所'
            },
            en: {
                trigger: 'Switch Device',
                device: 'Device',
                shop: 'Shop',
                online: 'Online',
                offline: 'Offline',
                minibei:'Shop'
            }
        },
        _lang = $.cookie('lang') || 'cn';

    var senceInfo = parseQuery(window.location),
        model = senceInfo.model,  // 存储model信息
        sn = senceInfo.sn,
        nasid = senceInfo.nasid,
        sceneDevList = {}, //   场景和设备的关联关系
        sceneModelObj = {}, //  场景和model的对应关系  {shopId:model}
        devInfoList = {};  //  设备信息列表  {devSN:{devInfo}}

    $('#switch-text').html(locales[_lang].trigger);  //  点击展开的文本
    $('#switch-shop').html(locales[_lang].shop);   //  选择场所label
    $('#switch-device').html(locales[_lang].device);   //   选择设备label

    /**
     * 生成dev下拉框并设置值
     */
    function fillDevField() {
        var val = $selectedScene.val(), devs = sceneDevList[val], devHtml = [];
        $devSn.html('');
        var selectedModel = sceneModelObj[val];
        //  model是1的时候，隐藏设备选择   model是1的时候是小小贝
        $devContain[selectedModel === 1 ? 'hide' : 'show']();
        if(selectedModel==1){
            $('#switch-text').html(locales[_lang].minibei);
        }
        var devSnList = [];
        $.each(devs, function (i, d) {
            devSnList.push(d.devSN);
        });

        /**
         * 获取设备在线状态   1:不在线   0:在线
         * 微服务: renwenjie
         */
        $.post('/base/getDevs', {devSN: devSnList}, function (data) {
            var statusList = JSON.parse(data).detail, devList = [];
            $.each(devs, function (i, dev) {
                $.each(statusList, function (j, sta) {
                    if (dev.devSN === sta.devSN) {
                        dev.status = sta.status;
                        devList.push(dev);
                    }
                });
            });
            callback(devList);
        }, 'html');

        /**
         * 拼接select下拉框的数据
         * @param devs   所有的设备信息
         */
        function callback(devs) {
            $.each(devs, function (i, dev) {
                devHtml.push('<option value="', dev.devSN, '">',
                    dev.devName + '(' + (dev.status == 0 ? locales[_lang].online : locales[_lang].offline) + ')',
                    '</option>');
            });
            //  如果是第一次加载就现在进来的sn，如果不是第一次进页面就选择默认的
            $devSn.html(devHtml.join('')).val((devs.length && !firstLoad) ? devs[0].devSN : sn);
            firstLoad = false;
        }
    }

    /**
     * 获取场景信息
     * @param sceneDevList
     * @param devInfoList
     */
    function getSceneList(sceneDevList, devInfoList) {
        $.get("/v3/web/cas_session?refresh=" + Math.random(), function (data) {
            $.post('/v3/scenarioserver', {
                Method: 'getdevListByUser',
                param: {
                    userName: data.user
                }
            }, function (data) {
                data = JSON.parse(data);
                if (data && data.retCode == '0') {
                    var sceneHtmlList = [];
                    var sceneObj = {};
                    $.each(data.message, function (i, s) {
                        var devInfo = {
                            devName: s.devName,
                            devSN: s.devSN,
                            url: s.redirectUrl
                        };
                        if (!sceneDevList[s.scenarioId]) {
                            sceneDevList[s.scenarioId] = [];
                        }
                        // 设备信息
                        devInfoList[s.devSN] = devInfo;
                        //  {场景ID:devList}  场景和设备的对应关系
                        sceneDevList[s.scenarioId].push(devInfo);
                        //  {场所ID:场所名称}
                        sceneObj[s.scenarioId] = s.shopName;
                        //  {场所ID:场所model}
                        sceneModelObj[s.scenarioId] = Number(s.model);
                    });
                    // 拼接select框的option
                    $.each(sceneObj, function (k, v) {
                        sceneHtmlList.push('<option value="', k, '">', v, '</option>');
                    });
                    $selectedScene.html(sceneHtmlList.join('')).val(nasid);
                    // 填充设备列表
                    fillDevField();
                }
            }, 'html');
        });
    }

    getSceneList(sceneDevList, devInfoList);
    $trigger.off('click').on('click', function () {
        $panel.toggle();
    });

    $btnChange.off('click').on('click', function () {
        $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname));
        $panel.hide();
    });

    $selectedScene.off('change').on('change', fillDevField);

    $(document).on('click', function (e) {
        var $target = $(e.target);
        if ($target != $contain && !$.contains($contain.get(0), e.target)) {
            $panel.hide();
        }
    });
    // ==============  选择场所，end  ==============

    function getuserSession() {
        $.ajax({
            url: MyConfig.path + "/scenarioserver",
            type: "POST",
            headers: {Accept: "application/json"},
            contentType: "application/json",
            data: JSON.stringify({
                "Method": "getdevListByUser",
                "param": {
                    "userName": FrameInfo.g_user.attributes.name

                }
            }),
            dataType: "json",
            success: function (data) {
                var AcInfo = [];
                if (data.retCode == 0 && data.message) {
                    var snList = [];
                    var aclist = data.message;
                    for (var i = 0; i < aclist.length; i++) {
                        if (aclist[i].shopName) {
                            AcInfo.push({
                                shop_name: aclist[i].shopName,
                                sn: aclist[i].devSN,
                                placeTypeName: aclist[i].scenarioName,
                                redirectUrl: aclist[i].redirectUrl,
                                nasid: aclist[i].scenarioId
                            });
                            snList.push(aclist[i].devSN);
                        } else if (aclist[i].devSN) {
                            snList.push(aclist[i].devSN);
                        }
                    }

                } else {
                    Frame.Debuger.error("[ajax] error,url=====" + MyConfig.path + "/scenarioserver");
                }
                getAcInfo(AcInfo);
            }
        });
    }

    getuserSession();

    function getAcInfo(aclist) {
        var opShtmlTemple = "<li data_sn=vals  sel data-url=urls>palce</li>";
        var ulhtml = '<div class="select">' +
            '<p>' +
            '</p>' +
            '<ul>' +
            '</ul>' +
            '</div>';
        $("#station").append(ulhtml);
        for (var i = 0; i < aclist.length; i++) {
            if (window.location.host == "v3webtest.h3c.com") {
                aclist[i].redirectUrl = aclist[i].redirectUrl.replace("lvzhouv3.h3c.com", "v3webtest.h3c.com");
            }
            var newHtmTemple = opShtmlTemple.replace(/vals/g, aclist[i].sn)
                .replace(/urls/g, aclist[i].redirectUrl).replace(/palce/g, aclist[i].shop_name);
            var newHtmlTemple_1 = "";
            if (FrameInfo.ACSN == aclist[i].sn) {
                $(".select > p").text($(newHtmTemple).text());
            } else {
                newHtmlTemple_1 = newHtmTemple.replace(/sel/g, "");
            }
            $(".content .select ul").append(newHtmlTemple_1);

        }
        $(".select").click(function (e) {
            $(".select").toggleClass('open');
            return false;
        });

        $(".content .select ul li").on("click", function () {
            var _this = $(this);
            $(".select > p").text(_this.html());
            $.cookie("current_menu", "");
            var redirectUrl = $(this).attr("data-url");
            window.location.href = redirectUrl;
            _this.addClass("selected").siblings().removeClass("selected");
            $(".select").removeClass("open");
        });
        $(document).on('click', function () {
            $(".select").removeClass("open");
        })
    }

    function onNewPageOpen() {
        _bOpened = true;
        _oCurDevice.openNewPage();
    }

    function onNewPageClose() {
        _bOpened = false;
        _oCurDevice.closeNewPage();
    }

    function onNewPageResize() {
        _oCurDevice.resize();
    }

    function onBodyClick(e) {
        _oCurDevice.onBodyClick(e);
    }

    function onMenuReady() {
        _oMenuBar.initMenu();
        _oUsetrBar.initUser();
    }

    function onMenuResize() {
        _oMenuBar.resizeMenu();
    }

    function getDeviceByWidth() {
        var oDevice;
        var nScreenWidth = getPageWidth();
        oDevice = Tablet; //DeskPC;
        if (_oCurDevice != oDevice) {
            _oCurDevice = oDevice;
        }

        return oDevice;
    }

    function doResize() {
        getDeviceByWidth();
        _oCurDevice.resize($(window).height());
        Frame.notify("all", "resize");
    }

    function initResize() {
        var oTimer;
        var oScrn = document.documentElement;
        var oOldScrn = {"width": oScrn.clientWidth, "height": oScrn.clientHeight};

        $(window).resize(function () {
            if ((oOldScrn.height == oScrn.clientHeight) && (oOldScrn.width == oScrn.clientWidth)) {
                return;
            }

            oOldScrn = {"width": oScrn.clientWidth, "height": oScrn.clientHeight};

            if (oTimer) {
                clearTimeout(oTimer);
            }
            oTimer = setTimeout(function () {
                doResize();
            }, 200);
        });
    }

    function initFrameCenter() {
        var _jFrame = $('.page-sidebar-fixed ');
        var bIsIE8 = isIE8Browser();
        if (bIsIE8) {
            _jFrame.addClass("ie8");
        }

        function isIE8Browser() {
            var bIE8 = false;
            if ($.browser.msie && (parseInt($.browser.version) == 8)) {
                bIE8 = true;
            }
            return bIE8;
        }
    }

    Frame.regNotify("newPage", "open", onNewPageOpen);
    Frame.regNotify("newPage", "close", onNewPageClose);
    Frame.regNotify("newPage", "resize", onNewPageResize);
    Frame.regNotify("menu", "resize", onMenuResize);

    $("body").addClass("page-header-fixed page-sidebar-fixed page-footer-fixed");
    //$(".header").removeClass("navbar-static-top").addClass("navbar-fixed-top");

    initFrameCenter();
    initResize();
    doResize();

    $("body").on("click", onBodyClick);

    /*function checkModuleCookie(){
     var menuCookieArr = [];
     $.each( $(".xb-layout-north ul li a"),function(i,v){
     menuCookieArr.push($(this).attr("data-value"));
     });

     if($.inArray($.cookie("current_menu"),menuCookieArr) == -1){
     $.cookie("current_menu","")
     }
     }
     //jiaoyan cookie pipeibuyizhi（delete cookie）
     checkModuleCookie();

     $(".xb-layout-north ul").delegate("li","click",function(){
     var dvalue = $(this).children("a").attr("data-value");
     if((FrameInfo.Model == 999)&&(dvalue == "manage")){
     window.location="/v3";
     return ;
     }

     window.location.hash="#";
     $(this).siblings().children("a").removeAttr("class")
     $(this).children("a").addClass("active")
     $("#dirText").text($(this).children("a").text());
     $.cookie("current_menu",dvalue);
     createMenu($("#side_menu"), $("#frame_tablist"), $("#frame_nav"), onMenuReady,dvalue);
     });
     if($.cookie("current_menu")){
     $(".xb-layout-north ul li a[data-value="+$.cookie("current_menu")+"]").addClass("active");
     var cokText = $(".xb-layout-north ul li a[data-value="+$.cookie("current_menu")+"]").text();
     $("#dirText").text(cokText);
     createMenu($("#side_menu"), $("#frame_tablist"), $("#frame_nav"), onMenuReady,$.cookie("current_menu"));

     }else{
     var firstVale;
     if(FrameInfo.Model == 999){
     firstVale=$(".xb-layout-north ul li:nth-child("+(4-FrameInfo.MenuIndex)+")").children("a").attr("data-value");
     }else{
     firstVale=$(".xb-layout-north ul li:last-child").children("a").attr("data-value");
     }

     $.cookie("current_menu",firstVale);

     window.location.hash="#";//初始化问题（cookie丢失）hash值不对

     $(".xb-layout-north ul li a:not([data-value='"+firstVale+"'])").removeAttr("class");;

     $(".xb-layout-north ul li a[data-value='"+firstVale+"']").addClass("active");

     createMenu($("#side_menu"), $("#frame_tablist"),$("#frame_nav"), onMenuReady,firstVale);
     }*/
    createMenu($("#side_menu"), $("#frame_tablist"), $("#frame_nav"), onMenuReady);
    Frame.init();
}


var g_oMainFrame;
var local = false;

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

jQuery(document).ready(function () {
    if (!window.location.search || window.location.search.indexOf("model=") <= 0) {
        window.location = "/v3";
        return false
    }
    ;

    var searchData = window.location.search.split("&");
    var curModel = searchData[0].split("model=")[1];
    if (curModel == 999) {
        if (!window.location.search || window.location.search.indexOf("menu=") <= 0) {
            window.location = "/v3";
            return false
        }
        ;

        FrameInfo.Model = curModel;
        FrameInfo.MenuIndex = searchData[1].split("menu=")[1];

    } else {

        if (!window.location.search || window.location.search.indexOf("sn=") <= 0) {
            window.location = "/v3";
            return false
        }
        ;

        if (!window.location.search || window.location.search.indexOf("nasid=") <= 0) {
            window.location = "/v3";
            return false
        }
        ;

        FrameInfo.Model = curModel;
        FrameInfo.ACSN = searchData[1].split("sn=")[1];
        FrameInfo.Nasid = searchData[2].split("nasid=")[1];

    }
    function checkDevUser(params) {
        return $.ajax({
            url: MyConfig.path + "/scenarioserver",
            type: "POST",
            headers: {Accept: "application/json"},
            contentType: "application/json",
            data: JSON.stringify({
                "Method": "checkDevUser",
                "param": {
                    "userName": params.userName,
                    "devSN": params.devSn
                }
            }),
            dataType: "json"
        });
    };

    function getHomePage() {
        try {
            $.ajax({
                url: "https://lvzhou.h3c.com/o2o/o2omng/homePage/homePage.xhtml",
                type: "GET",
                dataType: "jsonp",
                success: function (date) {
                    //console.log(date);
                },
                error: function (err) {
                    //console.log(err.statusText);
                }
            });
        }
        catch (err) {
            //console.log(err)
        }

    }

    $.get("/v3/web/cas_session?refresh=" + Math.random(), function (data) {
        FrameInfo.g_user = data;
        if (data.attributes && data.attributes.name.toLocaleLowerCase() == "demovistor") {
            $("#username").text("访客");
        } else {
            $("#username").text(data.user);
        }
        //jiaoyan devsn shebeiyuliehao shifu yuyonghu xingxi xiang fuhe
        var i = setInterval(getHomePage, 5 * 60 * 1000);
        if (data.attributes.name.toLowerCase() != "super") {
            if (FrameInfo.Model != 999) {
                checkDevUser({userName: data.attributes.name, devSn: FrameInfo.ACSN})
                    .done(function (checkData) {

                        if (checkData.retCode == "0") {
                            g_oMainFrame = new MainFrame();
                        } else {
                            /*Frame.Debuger.warning("checkUser waining:devSn==="+
                             FrameInfo.ACSN+"===not belong to ==="+data.attributes.name);*/
                            window.location = "/v3";
                            return false
                        }
                    }).fail(function (err) {
                    /* Frame.Debuger.error("[ajax] error,url====="+
                     MyConfig.path+"/scenarioserver===checkUser");*/
                    window.location = "/v3";
                    return false
                })
            } else {
                g_oMainFrame = new MainFrame();
            }

        } else {
            $("#station").hide();
            $(".change_station").hide();
            g_oMainFrame = new MainFrame();
        }

    });
});

