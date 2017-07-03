/**
 * Created by Administrator on 2015/12/1.
 */
(function ($)
{
    var MODULE_NAME = "auth.drawpage";
    var g_jForm,g_oPara;
    function navTabsChange()
    {
        var sTarget = $(this).attr("href");
        var sModule = "auth." + sTarget.substring(1);
        Utils.Pages.loadModule (sModule, null, $(sTarget));
    }

    function initForm()
    {
        g_jForm.on("show", navTabsChange);
    }
    function _init(oPara)
    {

        g_jForm = $("#authdraw_page .nav-tabs li a");
        g_oPara = Utils.Base.parseUrlPara ();
        $.extend(g_oPara, oPara);
        initForm();
        //默认显示首页登录页面
        $(g_jForm[0]).tab("show");
        /*if(g_oPara.ID)
        {
            switch(g_oPara.ID)
            {
                case "url_detail":
                    $(g_jForm[0]).tab("show");
                    break;
                case "WecomApp_detail":
                    $(g_jForm[1]).tab("show");
                    break;
                case "interface_detail":
                    $(g_jForm[2]).tab("show");
                    break;
                case "userFlow_detail":
                    $(g_jForm[3]).tab("show");
                    break;
                default:
                    break;
            }
        }*/

    };

    function _destroy()
    {

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": []
    });
}) (jQuery);
