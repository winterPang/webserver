/**
 * Created by Administrator on 2015/12/1.
 */
(function ($)
{
    var MODULE_NAME = "cooperate.index";
    var g_jForm,g_oPara;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("cooperate_rc", sRcName);
    }

    function initData()
    {
        
    }

    function ChangelogoInfo(row, cell, value, columnDef, dataContext, type)
    {
        
    }

    function Changelink(row, cell, value, columnDef, dataContext, type)
    {
       
    }

    function initGrid()
    {
        
    }
    function _init(oPara)
    {
       
    };

    function _destroy()
    {

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList"],
        "utils":["Request","Base"],
    });
}) (jQuery);
