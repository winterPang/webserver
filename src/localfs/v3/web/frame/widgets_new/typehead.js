;(function($)
{
    var WIDGETNAME = "Typehead";

    var oTypeHead = {       
        _create: function(){
            var oDiv = this._oTypehead = this.element;
            if("typehead" == oDiv.attr("ctrl"))
            {
                return false;
            }
            oDiv.attr("ctrl", "typehead");
            oDiv.attr("autocomplete","off");

            var opt = {};

            if(oDiv.hasClass("big"))
            {
                opt.ClassName = "big";
            }


            oDiv.typeahead(opt);
            var jFrom = oDiv.closest(".form");
            Utils.Widget.autoCheckForm(jFrom);
            return;
        },
        setData: function(oData, options)
        {
            var oDiv = this._oTypehead;
            var aData=$.isArray(oData) ? oData:[oData];
            var sDisplay, sVal, sItemField;
            var oDefOpt = {
                displayField: "name", 
                valueField:"id", 
                itemField:"text"
            };

            options = $.extend({}, oDefOpt, options);
            sDisplay = options.displayField;
            sVal = options.valueField;
            sItemField = options.itemField;

            var sourceData = [];

            for(var i = 0; i<aData.length; i++) 
            {
                if(typeof aData[i] == "string")
                {
                    var obj = {};
                    obj[sVal] = obj[sDisplay] = obj[sItemField] = aData[i];
                    sourceData.push(obj);
                }
                else if(typeof aData[i] == "object")
                {
                    if(!aData[i][sItemField])
                    {
                        aData[i][sItemField] = aData[i][sDisplay];
                    }
                    sourceData = aData;
                }
            };
            oDiv.typeahead({source:sourceData,display:sDisplay,val:sVal,itemField:sItemField,items:aData.length});
        },
        appendData: function(Data)
        {

            var aSource = this.element.data("typeahead").source;
            var options=this.element.data("typeahead").options;

            var sVal=options.val;

            var aData=$.isArray(Data) ? Data:[Data] ;
            var aVal=[];
            for(var i=0;i<aSource.length;i++)
            {
                aVal.push(aSource[i][sVal]);
            }

            for(var i=0;i<aData.length;i++)
            {
                if($.inArray(aData[i][sVal], aVal) == -1)
                {
                    aSource.push(aData[i]); 
                }
            }
           
            this.element.typeahead({source:aSource,display:options.display,val:options.val,itemField:options.itemField,items:aSource.length});
        },
        value:function(str)
        {
            if(!str)
            {
                return this.element.val();
            }
            return  this.element.val(str);
        },
        disable:function()
        {
            this.element.siblings('span.typeaheadBtn').attr("disabled","disabled");
            this.element.attr("disabled",true);
        },
        enable:function()
        {
            this.element.siblings('span.typeaheadBtn').removeAttr('disabled');
            this.element.attr("disabled",false);
        },
        check:function()
        {
            var jEle = this.element;
            var sCtrl = jEle.attr("ctrl")||"";
            var sErrId = jEle.attr("errid") || (jEle.attr("id")+"_error");
            var jErr = $("#"+sErrId);
            var bRet = true;
            if(sCtrl != "")
            {
                jEle.removeAttr("ctrl");
            }

            bRet = (Utils.Widget.checkEle(jEle) && bRet);

            if(bRet)
            {
                jErr.empty().hide();
            }
            else
            {
                var sMsg = $.MyLocale.Validator["defmsg"];
                jErr && jErr.text(sMsg).show();
            }

            if(sCtrl != "")
            {
                jEle.attr("ctrl",sCtrl);
            }
            return bRet;
        },
        _destory:function()
        {
            this._oTypehead.remove();
            $.Widget.prototype.destroy.call(this);
        }
    };

    function _init(oFrame)
    {
        $(".typehead", oFrame).typehead();
    }

    function _destroy()
    {

    }

    $.widget("ui.typehead", oTypeHead);
    Widgets.regWidget(WIDGETNAME, {
        "init": _init, "destroy": _destroy, 
        "widgets": [], 
        "utils":["Widget"],
        "libs": ["Libs.Typeahead.Bootstrap-typeahead"]
    });
})(jQuery);
