
;(function ($) {

    var MODULE_NAME = "WDashboard.Summary";

    //var NC, MODULE_NC = "WDashboard.NC";

    var g_aApp =
    {
        "SysLog":       {position: 0, bg: "bg-gray",        url: "WDashboard.Syslog"}
        // ,"APs":         {position: 2, bg: "echart-height",  url: "WDashboard.APs"}
        ,"ACs":         {position: 1, bg: "echart-height",  url: "WDashboard.ACs"}
        ,"SSID":        {position: 3, bg: "default-height", url: "WDashboard.terminal"}
        ,"Clients":     {position: 3, bg: "default-height", url: "WDashboard.Clients"}
        ,"APs":         {position: 3, bg: "default-height",  url: "WDashboard.onlineap"}
        ,"Usage":       {position: 3, bg: "echart-height", url: "WDashboard.Usage"}
    };

    function getRcText (sRcId)
    {
        return Utils.Base.getRcString("dashboard_rc", sRcId);
    }

    var MyApp = {
        _prefix: "#app_",
        _aDefApp: ["SysLog","Clients","APs","SSID"],
        _aBox: ["#sysinfo_box_r1","#sysinfo_box_1", "#sysinfo_box_2", "#sysinfo_box_3"],
        show: function (sAppId)
        {
            $(this._prefix + sAppId).show();
        },
        hide: function (sAppId)
        {
            $(this._prefix + sAppId).hide();
        },
        load: function (aAppList)
        {
            var aSupportdApp = MyConfig.Dashboard || this._aDefApp;
            for (var i=0; i<aSupportdApp.length; i++)
            {
                var sAppName =  aSupportdApp[i];
                var oApp = aAppList[sAppName];
                if (!oApp)
                {
                    continue;
                }

                // create dashboard block
                if(i==0)
                {
                    var jItem = $("<div></div>");
                }
                else
                {
                    var jItem = $("<div class='app-box'></div>");
                }
                jItem
                    .attr("id", "app_"+sAppName)
                    .addClass (oApp.bg)
                    .appendTo($(this._aBox[oApp.position]));
                Utils.Pages.loadModule(oApp.url,null,jItem);
            }
        },
        unload: function ()
        {
            for (var i=0; i<this._aBox.length; i++)
            {
                var jBox = $(this._aBox[i]);
                $(".app-box", jBox).each (function()
                {
                    Utils.Pages.destroy($(this));
                });
                jBox.empty ();
            }
        }
    }

    function appendEmptyApp (jParent)
    {
        var jItem = $("<div class='app-box' style='padding:5px 10px;'><span style='padding:3px 15px; border:1px dashed #aaa; font-size:48px'>+</span></div>")
        jItem
            .addClass ("bg-blue")
            .appendTo(jParent);
    }

    function initAppMenu ()
    {
        //$(".icon-option").click ()
        $("#module_list a").click (function (e)
        {
            var jCheckbox = $(this);
            if (jCheckbox.is(".checked"))
            {
                jCheckbox.removeClass("checked");
                MyApp.hide (jCheckbox.attr("rcid"));
            }
            else
            {
                jCheckbox.addClass("checked");
                MyApp.show (jCheckbox.attr("rcid"));
            }

            jCheckbox.trigger("change");
            e.stopPropagation();
        });
    }
    /*function getData()
    {
        function myCallback(oInfos)
        {
            var aBase = Utils.Request.getTableRows(NC.DeviceBase, oInfos);
            $(".dashboard #devname").text (aBase[0].HostName);

        }
        var oBase = Utils.Request.getTableInstance(NC.DeviceBase);

        Utils.Request.getAll([ oBase], {onSuccess:myCallback,showMsg:false,showErrMsg:false});
    }*/
// end of your code
    /*****************************************************************************/

    function _init()
    {
    //    NC = Utils.Pages[MODULE_NC].NC;
        MyApp.load (g_aApp);
        initAppMenu ();
//        getData();
        // _onResize();
    };

    function _destroy()
    {
        MyApp.unload ();
    }

    function _onResize()
    {
        var jContainer = $("#plot_container").hide().css("overflow", "auto");
        var nMarginTop = 25;
        var nMarginBottom= 20;
        var nBannerHeight= 0;

        if($(".frame-block.dashboard").hasClass("mobile"))
        {
            nMarginTop = 10;
            nMarginBottom = 10;
            nBannerHeight = 51;
        }
        var nHeight = $(window).height()- nMarginTop - nMarginBottom - $("#copyright").height() - 51;
        jContainer.height(nHeight-nBannerHeight).show();
    }


    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        // "resize":_onResize,
        "widgets": [],
        "utils":[]
    });

})( jQuery );

