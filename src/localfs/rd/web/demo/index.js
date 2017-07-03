/**
 * Created by Administrator on 2016/1/23.
 */
;(function ($) {
    var MODULE_NAME = "demo.index";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("client_rc", sRcName);
    }


    function openEditDlg()
    {
        Utils.Base.openDlg(null, {}, {scope:$("#Cleardlg"),className:"modal-small"});

    }

    function initGrid()
    {

    }


    function initData()
    {

    }



    function initForm()
    {

    }

    function _init()
    {
        initForm();
        initGrid();
        initData();
    }

    function _destroy()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Mlist","SList"],
        "utils":["Base"]
    });
})( jQuery );

