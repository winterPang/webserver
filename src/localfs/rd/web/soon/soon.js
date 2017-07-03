;(function ($) {
    var MODULE_BASE = "soon";
    var MODULE_NAME = MODULE_BASE + ".soon";
    

    function getRcText(sRcName){
       
    }

    function getRcString(sRcId, sRcName){
        
    }

   
    function _init()
    {
        //  NC = Utils.Pages[MODULE_NC].NC;
    }

    function _destroy()
    {
       
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Mlist","SList","Echart"],
        "utils":["Base"]
        //  "subModules":[MODULE_NC]
    });

})( jQuery );
