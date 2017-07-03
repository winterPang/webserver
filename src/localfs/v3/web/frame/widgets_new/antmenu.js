; (function ($) {
    var WIDGETNAME = "Antmenu";

    var addLi = function(opt, oClickFunc)
    {
        var aTemp = [];
        var nOptLength = opt.length;
        for(var i = 0; i < nOptLength; i++)
        {
            oClickFunc[opt[i].value] = opt[i].func;
            aTemp.push('<li value="' +opt[i].value + '" param="' + (opt[i].param || '') + '"> \
                <a href="javascript:void(0);"><i class="fa ' + (opt[i].class || '') + '"></i>' + opt[i].name +  ' </a>');

            if(opt[i].data && opt[i].data.length)
            {
                aTemp = aTemp.concat(addUl(opt[i].data, oClickFunc));
            }

            aTemp.push('</li>');
        }

        return aTemp;
    }

    var addUl = function(opt, oClickFunc)
    {
        var aTemp = [];

        aTemp.push('<ul class="submenu">');
        aTemp = aTemp.concat(addLi(opt, oClickFunc));
        aTemp.push('</ul>');

        return aTemp;
    }

    var oAntMenu = {
        options:{
            search:{show:false, content:""},
            footer:{show:false, content:""},
        },
        init: function(option)
        {
            var jscope = this.element;
            var aData  = option.data;
            var aHtml  = [];
            var oClickFunc = {};
            this.options.footer = option.footer ||{show:false, content:""};
            this.options.search = option.search ||{show:false, content:""};

            aHtml.push('<div class="jquery-accordion-menu red">');

            if(this.options.search.show)
            {
                aHtml.push('<div class="jquery-accordion-menu-header" id="form">'+this.options.search.content+'</div>');
            }

            if(aData.length)
            {
                aHtml.push('<ul id="demo-list">');
                aHtml = aHtml.concat(addLi(aData,oClickFunc));
                aHtml.push('</ul>');
            }

            if(this.options.footer.show)
            {
                aHtml.push('<div class="jquery-accordion-menu-footer">' +
                    this.options.footer.content +
                    '</div>'
                    );
            }

            aHtml.push('</div>');

            jscope.append(aHtml.join("")).children().jqueryAccordionMenu();

             $("li", jscope).click(function(e){
                 var value = $(this).attr("value");
                 $("#demo-list li.active").removeClass("active")
                 $(this).addClass("active");
                 if($(this).has("ul").length == 0)
                    oClickFunc[value](this);
             });
            return;
        },

    };


    function _init(oFrame) {
        $(".antmenu", oFrame).antmenu();
    }

    function _destroy() {

    }

    $.widget("ui.antmenu", oAntMenu);


    Widgets.regWidget(WIDGETNAME, {
        "init": _init, 
        "destroy": _destroy,
        "widgets": [],
        "utils": [],
        "libs": ["Libs.jquerynav.jqueryaccordionmenu"]
    });
})(jQuery);
