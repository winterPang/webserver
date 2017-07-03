;(function($)
{
    var UTILNAME = "Msg";
    var oMsg = {
        "confirm" : confirmDiag,
        "error" : errorDiag,
        "wait" : waitDiag,
        "alert" : alertDiag,
        "deleteConfirm" : deleteConfirm
    };

    function confirmDiag(sMsg,pfFunc)
    {
        return Frame.Msg.confirm(sMsg,pfFunc);
    }
    function errorDiag(sMsg)
    {
        return Frame.Msg.error(sMsg);
    }
    function waitDiag(sMsg)
    {
        return Frame.Msg.wait(sMsg);
    }
    function alertDiag(sMsg)
    {
        return Frame.Msg.alert(sMsg);
    }
    function deleteConfirm(pfFunc)
    {
        return function(opt)
        {
            Frame.Msg.confirm($.MyLocale.DELETE_CONFIRM, function(){
                pfFunc.apply(this,[opt]);
            });
        }
    }

    Utils.regUtil(UTILNAME, oMsg, {"widgets": [], "utils":[]});
})(jQuery);