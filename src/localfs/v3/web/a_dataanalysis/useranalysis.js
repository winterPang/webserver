(function ($)
{
    var MODULE_NAME = "a_dataanalysis.useranalysis";

    function _init(oPara)
    {
        
    };

    function _destroy()
    {

    }

    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Form"],
        "utils": ["Base"]
    });
}) (jQuery);