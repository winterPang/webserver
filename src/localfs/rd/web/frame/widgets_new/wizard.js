;(function($)
{
    var WIDGETNAME = "Wizard";

    var oWizard = { 
        _options: {},
        _create: function(){
            var oDiv = this._oUsage = this.element;
            if("bwizard" == oDiv.attr("ctrl"))
            {
                return false;
            }
            oDiv.attr("ctrl", "bwizard");
            oDiv.addClass("bwizard-steps");
            return;
        },
        /*
        onInit	null	Fired when plugin is initialized
        onShow	null	Fired when plugin data is shown
        onNext	null	Fired when next button is clicked (return false to disable moving to the next step)
        onPrevious	null	Fired when previous button is clicked (return false to disable moving to the previous step)
        onFirst	null	Fired when first button is clicked (return false to disable moving to the first step)
        onLast	null	Fired when last button is clicked (return false to disable moving to the last step)
        onTabClick	null	Fired when a tab is clicked (return false to disable moving to that tab and showing it's contents)
        onTabShow	null	Fired when a tab content is shown (return false to disable showing that tab content)
        */
        setWizardParas: function(Opt)
        {
            var aLiArr = Opt.headDatas || [];
            var aTabIds = Opt.tabIds || [];
            var jUl = $("<ul></ul>");
            var jContents = this.element.find(".tab-content");
            var jBtn = $("<ul class='paper wizard'><li class='previous'><a href='#'>"+$.MyLocale.Wizard.Previous+"</a></li><li class='next'><a href='#'>"+$.MyLocale.Wizard.Next+"</a></li><li class='next finish' style='display: none;'><a href='#'>"+$.MyLocale.Wizard.Finish+"</a></li></ul>");
            var sLast = "";
            for(var i=0; i<aLiArr.length;i++)
            {
                if(i==aLiArr.length-1){sLast="last"};
                $("<li class='"+sLast+"'><a href='#"+aTabIds[i]+"' data-toggle='tab'><span class='label'>"+(i+1)+"</span> "+aLiArr[i]+"</a></li>").appendTo(jUl);
                $("#"+aTabIds[i]).addClass("tab-pane");
            }
            jUl.insertBefore(jContents);
            jBtn.appendTo(jContents);
            var pfFunctions = {};
            pfFunctions = $.extend({},pfFunctions, Opt);            
            this.element.bootstrapWizard(pfFunctions);
        },
        _destory:function()
        {
            $.Widget.prototype.destroy.call(this);
        }
    };
    function _init(oFrame)
    {
        $(".bwizard", oFrame).wizard();
    }

    function _destroy()
    {

    }
    $.widget("ui.wizard", oWizard);
    Widgets.regWidget(WIDGETNAME, {"init": _init, "destroy": _destroy, "widgets": [], "utils":["Widget"],
        "libs": ["Libs.wizard.bootstrapwizard"]
});
})(jQuery);
