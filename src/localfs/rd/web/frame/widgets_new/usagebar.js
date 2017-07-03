;(function($)
{
    var WIDGETNAME = "UsageBar";

    var oUsageBar = {       
        _create: function(){
            var oDiv = this._oUsage = this.element;
            if("usagebar" == oDiv.attr("ctrl"))
            {
                return false;
            }
            oDiv.attr("ctrl", "usagebar");
            oDiv.addClass("usage-off-align");
            oDiv.append('<div class="on"></div>');
            return;
        },
        value:function(str)
        {            
            if(!str)
            {
                return $(".on",this.element).width()/0.89;
            }

            var nNum = parseInt(str);
            if(nNum <= 100)
            {
                $(".on",this.element).width(nNum*0.89);
                if(nNum > 80)
                {
                    $(".on",this.element).addClass("usage-warning-align");
                }
                else
                {
                    $(".on",this.element).addClass("usage-align");
                }
            }            
            return;
        },
        _destory:function()
        {
            this._oUsage.removeClass("usage-off-align");
            this._oUsage.removeAttr("usagebar");
            $(".on",this._oUsage).remove();
            $.Widget.prototype.destroy.call(this);
        }
    };

    function _init(oFrame)
    {
        $(".usagebar", oFrame).usagebar();
    }

    function _destroy()
    {

    }
    $.widget("ui.usagebar", oUsageBar);
    Widgets.regWidget(WIDGETNAME, {"init": _init, "destroy": _destroy, "widgets": [], "utils":["Widget"]});
})(jQuery);
