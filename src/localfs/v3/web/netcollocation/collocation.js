;(function ($) {
     var MODULE_BASE = "netnollocation";
     var MODULE_NAME = MODULE_BASE + ".collocation";
     var g_sn = FrameInfo.ACSN;
      function getRcText(sRcName) {
        return Utils.Base.getRcString("User_monitor_rc", sRcName);
    }
    
   
    function initForm()
    {
        
        
    }  

    function initData()
    {
        
    }
    function initGrid()
    {  
        
    }
    function onAjaxErr()
    {
    }
    function _init()
    {

        initForm();
        initGrid();
        initData();


    };

    function _destroy()
    {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Form","Minput","Echart","DateRange","SingleSelect","DateTime","Antmenu"],
        "utils":["Base","Request"]
    });
})( jQuery );

