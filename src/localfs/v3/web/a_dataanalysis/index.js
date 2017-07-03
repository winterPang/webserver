/**
 * Created by Administrator on 2016/2/23.
 */
/**
 * Created by Administrator on 2015/12/1.
 */
/**
 * Created by Administrator on 2015/12/1.
 */
(function ($)
{
    var MODULE_NAME = "a_dataanalysis.index";

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
