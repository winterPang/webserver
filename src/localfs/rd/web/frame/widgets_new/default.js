;(function($)
{
    var WIDGETNAME = "Default";

    var oDefault = {       
        _create: function(){            
            this.element.find("a.info-icon").click(function()
            {
                $(this).blur().parent(".info").toggleClass("expanded");
                return false;
            });
        },
        _destory:function()
        {
            $.Widget.prototype.destroy.call(this);
        }
    };
    $.widget("ui.defaultInfo", oDefault);

    function _init(oFrame)
    {
        $(".info", oFrame).defaultInfo();
    }

    function _destroy()
    {

    }

    Widgets.regWidget(WIDGETNAME, {"init": _init, "destroy": _destroy, "widgets": [], "utils":["Widget"]});
})(jQuery);
