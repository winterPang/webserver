;(function($)
{
    var WIDGETNAME = "DateTime";
    function getDoubleStr(num)
    {
        return num >=10 ? num:"0"+num;
    };
    var oDateTime = {
        options:{
            type: "date",
            format:"",
            pickSeconds:true
        },
        _create: function(){
            var oDiv = this._oDatetime = this.element;

            if("datetime" == oDiv.attr("ctrl"))
            {
                return false;
            }
            oDiv.attr("ctrl", "datetime");
            oDiv.addClass("input-append");
            var sType ='data-time-icon="icon-time"';
            var sformat = "yyyy-MM-dd";
            
            if("time" === this.options.type)
            {
                sType ='data-date-icon="icon-calendar"';
                sformat = this.options.format || "hh:mm:ss";
            }
            
            var html = '<input data-format='+sformat+' type="text" disabled></input><span class="add-on"><i '+sType+'></i></span>'
            oDiv.append(html);
            var sLanguage=Frame.get("lang")=="en" ? "en":"zh-CN";

            if("time" === this.options.type)
            {
                oDiv.datetimepicker({pickDate: false,pickSeconds:this.options.pickSeconds,language:sLanguage});
            }
            else
            {
                oDiv.datetimepicker({pickTime: false,language:sLanguage});
            }
            return;
        },
        setDate: function(sNewDate)
        {
            var newDate = new Date(sNewDate);
            this._oDatetime.data('datetimepicker').setLocalDate(newDate);
            return;
        },
        setTime: function(sNewTime)
        {
            this._oDatetime.data('datetimepicker').setValue(sNewTime);
            return;
        },
        getDate: function()
        {
            var oCurDate = this._oDatetime.data('datetimepicker').getLocalDate();
            var sYear = oCurDate.getFullYear(); 	
	        var sDate = getDoubleStr(oCurDate.getDate());
            var sMonth = getDoubleStr(oCurDate.getMonth()+1);
            return sYear+'-'+sMonth+'-'+sDate;            
        },
        getTime: function()
        {
            var oCurDate = this._oDatetime.data('datetimepicker').getLocalDate();
            return getDoubleStr(oCurDate.getHours())+':'+getDoubleStr(oCurDate.getMinutes())+':'+getDoubleStr(oCurDate.getSeconds());        
        },
        disable: function()
        {   
            this.element.addClass("disabled");
            this.element.datetimepicker("disable"); 
        },
        enable: function()
        {
            this.element.removeClass("disabled");
            this.element.datetimepicker("disable"); 
            this.element.datetimepicker("enable");
        },
        _destory:function()
        {
            this._oDatetime.remove();
            $.Widget.prototype.destroy.call(this);
        }
    };

    function _init(oFrame)
    {
        $(".datewidget", oFrame).datetime();
        $(".timewidget", oFrame).datetime({type:"time"});
        $(".timewidget_nosecond", oFrame).datetime({type:"time",pickSeconds:false,format:"hh:mm"});
    }

    function _destroy()
    {

    }

    $.widget("ui.datetime", oDateTime);
    Widgets.regWidget(WIDGETNAME, {
        "init": _init, "destroy": _destroy, 
        "widgets": [], 
        "utils":["Widget"],
        "libs": ["Libs.Datetimepicker.Bootstrap-datetimepicker"]
    });
})(jQuery);
