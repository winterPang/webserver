;(function($)
{
    var WIDGETNAME = "DateRange";
    var oDateRange = {
        options:{
            format:'YYYY/MM/DD',
            timePicker:false,
            timePickerIncrement:1,
            timePicker12Hour:false,
            separator:' - ',
            pickSeconds:true,
            yearRangeClose:false
        },
        _create: function()
        {
            var oDateRange = this._oDateRange = this.element;          
            var opt=this.options;
            if("daterange" == oDateRange.attr("ctrl"))
            {
                return false;
            }
            oDateRange.attr("ctrl", "daterange");
            var obj = $.MyLocale.Datepicker;  
                obj.weekLabel= obj.weekHeader;
                obj.daysOfWeek = obj.dayNamesMin;
            var oLocale = Frame.get("lang") == "en" ? "":obj;
            opt.yearRangeClose = (oDateRange.attr("yearRangeClose")=="true");
            if(opt.yearRangeClose)
            {
                opt.format = opt.format.replace(/[Y]{4}[\w\W]{1}/i,"");
            }
            oDateRange.daterangepicker({
                format:opt.format,
                timePicker:opt.timePicker,
                timePickerIncrement:opt.timePickerIncrement,
                timePicker12Hour:opt.timePicker12Hour,
                separator:opt.separator,
                pickSeconds:opt.pickSeconds,
                locale:oLocale,
                yearRangeClose:opt.yearRangeClose
            });
            return;
        },
        setRangeData: function(str,opt)
        {
            this.options.format =(opt&&opt.format)||this.options.format;
            this.options.timePicker =(opt&&opt.timePicker)||this.options.timePicker;
            this.options.timePickerIncrement =(opt&&opt.timePickerIncrement)||this.options.timePickerIncrement;
            this.options.timePicker12Hour =(opt&&opt.timePicker12Hour)||this.options.timePicker12Hour;
            this.options.separator =(opt&&opt.separator)||this.options.separator;
            this.options.pickSeconds = (opt&&opt.pickSeconds == false) ? false:this.options.pickSeconds;
            this.options.yearRangeClose = (opt&&opt.yearRangeClose == false) ? false:this.options.yearRangeClose;
            if(this.options.yearRangeClose)
            {
                this.options.format = this.options.format.replace(/[Y]{4}[\w\W]{1}/i,"");
            }
            this.element.val(str);
            this.destroy();
            return this._create();
        },
        value: function(aValue)   
        {
            if(!aValue)
            {
                return this.element.val();
            }
            else
            {
                this.setRangeData(aValue);
            } 
        },
        getRangeData: function()
        {
            if(!this.element.val())return this.element.val();
            var sFormat = this.options.format;
            var oRangeDate = {};
            oRangeDate["startData"]=this.element.data("daterangepicker").startDate.format(sFormat);
            oRangeDate["endData"]=this.element.data("daterangepicker").endDate.format(sFormat);
            return oRangeDate;
        },
        disable: function()
        {   
            this.element.attr("disabled", true); 
        },
        enable: function()
        {
            this.element.attr("disabled", false);
        },
        destroy: function()
        {
            this.element.removeAttr('ctrl');
            this.element.data("daterangepicker").container.remove();
            this.element.removeData('daterangepicker');
            $.Widget.prototype.destroy.call(this);
        }
    };

    function _init(oFrame)
    {
        $(".datetimerange", oFrame).daterange({timePicker:true,format:'YYYY/MM/DD HH:mm:ss'});
        $(".daterange", oFrame).daterange();
    }
    function _destroy() 
    {

    }

    $.widget("ui.daterange", oDateRange);
    Widgets.regWidget(WIDGETNAME, {
        "init": _init, "destroy": _destroy, 
        "widgets": [], 
        "utils":["Widget"],
        "libs": ["Libs.Daterangepicker.Daterangepicker"
                ,"Libs.Daterangepicker.Moment"]
    });
})(jQuery);
