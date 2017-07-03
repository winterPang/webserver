;(function($)
{
    var WIDGETNAME = "Toggle";
    var oToggle = {
        options:{
        },
        _create: function()
        {
            var jToggle = this.element;
            
            if("jtoggle" == jToggle.attr("ctrl"))
            {
                return false;
            }
            jToggle.attr("ctrl", "jtoggle");

            this.options.show = jToggle.attr("show");
            this.options.hide = jToggle.attr("hide");
            this.options.text = jToggle.attr("text");
            this.options.adv = jToggle.hasClass("advance");
            this.options.group = jToggle.attr("group");

            var that = this;
            jToggle.bind('click', function(event) {
                that.toggle();

                if("INPUT" != this.tagName)
                {
                    // deny jump for "A"
                    return false;
                }
            });

            if(this.options.adv)
            {
                this.hide();
            }
            return;
        },
        setOption: function(opt)
        {
            this.options = $.extend({},this.options, opt);
        },
        show : function()
        {
            this.toggle("show");
        },
        hide : function()
        {
            this.toggle("hide");
        },
        toggle : function(status)
        {
            var jElement = this.element;
            var sShow, sHide, sText;

            var sContents = jElement.attr("contents");
            if(!sContents)
            {
            	return false;
            }

			var jContent = jElement.next();
			if (!jContent.is(sContents))
			{
				jContent = $(sContents);
			}

			//  当前状态，取上一次反状态
            var bShow = (undefined===status) ? jContent.is(":hidden") : ("show"==status);

            if(this.options.adv)
            {
                sShow = $.MyLocale.Toggle.show;
                sHide = $.MyLocale.Toggle.hide;
            }

            sShow = this.options.show || sShow;
            sHide = this.options.hide || sHide;
            sText = this.options.text;

            // change the toggle text
            if(sShow&&sHide)
            {
                var jEle = sText ? $("#"+sText) : jElement;
                var sMessage = bShow ? sShow : sHide;
                jEle.html(sMessage);
            }

            // show or hide the contents
            if (bShow)
            {
                jContent.removeClass ("hide");
            }
            else
            {
                jContent.addClass ("hide");
            }

            var oStyle = Frame.Util.parseStyle(jContent.attr("style"));
            if (oStyle.display)
            {
                bShow ? jContent.show() : jContent.hide();
            }

            if(bShow)
            {
                this.options.onShow && this.options.onShow();
            }
            else
            {
                this.options.onHide && this.options.onHide();
            }
        },
        value : function(val)
        {
            var jElement = this.element;
            if(!jElement.is("input[type=checkbox]"))
            {
                // is not checkbox, do nothing
                return;
            }

            var jCheckbox = jElement;
            if(undefined === val)
            {
                // get value
                return jCheckbox.attr("checked") ? "true" : "false";
            }

            // set value
            if ("true" === val)
            {
                this.show ();
                jCheckbox.attr("checked", true);
            }
            else
            {
                this.hide ();
                jCheckbox.attr("checked", false);
            }
            jCheckbox.change ();
            return this;
        },
        _destroy : function()
        {
            var jElement = this.element;
            jElement.removeAttr('ctrl').unbind('click');
        }
    };

    function _init(oFrame)
    {
        $(".toggle", oFrame).jtoggle();
    }

    function _destroy()
    {

    }
    $.widget("ui.jtoggle", oToggle);
    Widgets.regWidget(WIDGETNAME, {"init": _init, "destroy": _destroy, "widgets": [], "utils":["Widget"]});
})(jQuery);
