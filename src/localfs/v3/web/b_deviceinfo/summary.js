
;(function ($) {

    var MODULE_NAME = "b_deviceinfo.summary";

    var g_aApp =
    {
        "SysLog":       {position: 0, bg: "",        url: "b_deviceinfo.Syslog"}
        ,"APs":         {position: 1, bg: "echart-height",  url: "b_deviceinfo.APs"}
        ,"health":      {position: 2, bg: "echart-height",  url: "b_deviceinfo.health"}
        ,"SSID":        {position: 1, bg: "",               url: "b_deviceinfo.ssid_test"}
        ,"Clients":     {position: 2, bg: "",               url: "b_deviceinfo.Clients"}
        ,"Usage":       {position: 3, bg: "echart-height", url: "b_deviceinfo.Usage"}
    };

    var MyApp = {
        _prefix: "#app_",
        _aDefApp: ["SysLog", "APs", "health", "SSID", "Clients","Usage"],
        _aBox: ["#sysinfo_box_r1", "#sysinfo_box_1", "#sysinfo_box_2", "#sysinfo_box_3"],
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
                    var jItem = $("<div class='app-box no-bk-color app-box-slist'></div>");
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

    function initAppMenu ()
    {
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

    function _init()
    {
        // NC = Utils.Pages[MODULE_NC].NC;
        MyApp.load (g_aApp);
        initAppMenu ();
    };

    function _destroy()
    {
        MyApp.unload ();
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": [],
        "utils":[],
        "subModules":[]
    });
})( jQuery );

