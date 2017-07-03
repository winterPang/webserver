
;(function($)
{
    var WIDGETNAME = "FullCalendar";
    function getDoubleStr(num)
    {
        return num >=10 ? num:"0"+num;
    }
    var oCalendar = {
        options:{
            editable: false,
            eventLimit: true // allow "more" link when too many events
        },
        _create: function(){
            var oDiv = this._calender =this.element;
        },
        init:function(oevents)
        {
            $.extend(oCalendar.options, oevents);
            var oDiv = this.element;
            oDiv.fullCalendar(oCalendar.options);
        },
        getDate: function(data)
        {
            var data = data || new Date();
            var sYear = data.getFullYear();
            var sDate = getDoubleStr(data.getDate());
            var sMonth = getDoubleStr(data.getMonth()+1);
            return sYear+'-'+sMonth+'-'+sDate;
        },
        getTime: function(time)
        {
            var time = time || new Date();
            return getDoubleStr(time.getHours())+':'+getDoubleStr(time.getMinutes())+':'
                +getDoubleStr(time.getSeconds());
        },
        _destory:function()
        {
            this.element.remove();
            $.Widget.prototype.destroy.call(this);
        }
    };

    function _init(oForm)
    {
       var opara =  $(".fullcalendar",oForm).fullcalendar();
    }

    function _destroy()
    {

    }

    $.widget("ui.fullcalendar", oCalendar);
   // $.loadScript('../frame/libs/fullcalendar/lib/moment-min.js',
        Widgets.regWidget(WIDGETNAME, {
            "init": _init, "destroy": _destroy,
            "widgets": [],
            "utils":["Widget"]
          //  "libs": ["Libs.Fullcalendar.Lib.jquery-ui-custom-min"/*,"Libs.Fullcalendar.fullcalendar"*/]
        })
   // );
})(jQuery);
