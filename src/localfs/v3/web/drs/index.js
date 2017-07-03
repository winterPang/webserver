(function ($)
{
    var MODULE_NAME = "drs.index";
    var g_jForm,g_oPara;
    function navTabsChange()
    {
        var sTarget = $(this).attr("href");
        var sModule = "drs." + sTarget.substring(1);
        Utils.Pages.loadModule (sModule, null, $(sTarget));
    }

    function initForm()
    {
        g_jForm.on("show", navTabsChange);
    }
    function _init(oPara)
    {

        g_jForm = $("#drs_monitor .nav-tabs li a");
        g_oPara = Utils.Base.parseUrlPara ();
        $.extend(g_oPara, oPara);
        initForm();
        if(g_oPara.ID)
        {
            switch(g_oPara.ID)
            {
                case "appinfo_detail":
                    $(g_jForm[0]).tab("show");
                    break;
                case "urlinfo_detail":
                    $(g_jForm[1]).tab("show");
                    break;
                case "userFlow_detail":
                    $(g_jForm[2]).tab("show");
                    break;
                case "spiFlow_detail":
                    $(g_jForm[3]).tab("show");
                    break;
                default:
                    break;
            }
        }
    };

    function _destroy()
    {

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": [],
        "utils": ["Request"],

    });
}) (jQuery);
