;(function($)
{
    var WIDGETNAME = "TimeZone";

    //世界国家的坐标和时区
    var _TimeZoonData =
    {
        AbuDhabi:          {coords:{x: 97,y:171}, offset: "+04:00" },
        Adelaide:          {coords:{x:240,y:240}, offset: "+09:30" },
        Alaska:            {coords:{x:342,y: 69}, offset: "-09:00" },
        Almaty:            {coords:{x:151,y:115}, offset: "+06:00" },
        Amman:             {coords:{x:  0,y:  0}, offset: "+02:00" },
        Amsterdam:         {coords:{x: 44,y:104}, offset: "+01:00" },
        Arizona:           {coords:{x:409,y:123}, offset: "-07:00" },
        Asuncion:          {coords:{x:  0,y:  0}, offset: "-04:00" },
        Astana:            {coords:{x:156,y:124}, offset: "+06:00" },
        Athens:            {coords:{x: 67,y:160}, offset: "+02:00" },
        AtlanticTime:      {coords:{x:  0,y:  0}, offset: "-04:00" },
        Auckland:          {coords:{x:306,y:260}, offset: "+12:00" },
        Baghdad:           {coords:{x: 90,y:127}, offset: "+03:00" },
        Baku:              {coords:{x:122,y:140}, offset: "+04:00" },
        Bangkok:           {coords:{x:191,y:166}, offset: "+07:00" },
        Beijing:           {coords:{x:202,y:121}, offset: "+08:00" },
        Belgrade:          {coords:{x: 49,y:112}, offset: "+01:00" },
        Bogota:            {coords:{x:472,y:179}, offset: "-05:00" },
        Brasilia:          {coords:{x:  0,y:  0}, offset: "-03:00" },
        Brisbane:          {coords:{x:240,y:227}, offset: "+10:00" },
        Brussels:          {coords:{x: 49,y: 82}, offset: "+01:00" },
        Bucharest:         {coords:{x: 67,y:116}, offset: "+02:00" },
        BuenosAires:       {coords:{x:  0,y:  0}, offset: "-03:00" },
        Cairo:             {coords:{x: 68,y:142}, offset: "+02:00" },
        Canada:            {coords:{x:430,y:127}, offset: "-06:00" },
        CapeVerde:         {coords:{x:544,y:124}, offset: "-01:00" },
        Caracas:           {coords:{x:480,y:175}, offset: "-04:30" },
        Casablanca:        {coords:{x: 31,y:134}, offset: "+00:00" },
        Cayenne:           {coords:{x:  0,y:  0}, offset: "-03:00" },
        Chihuahua:         {coords:{x:420,y:140}, offset: "-07:00" },
        Chennai:           {coords:{x:145,y:142}, offset: "+05:30" },
        Darwin:            {coords:{x:240,y:215}, offset: "+09:30" },
        EasternTime:       {coords:{x:475,y:107}, offset: "-05:00" },
        Ekaterinburg:      {coords:{x:136,y: 78}, offset: "+05:00" },
        Fiji:              {coords:{x:295,y:216}, offset: "+12:00" },
        Georgetown:        {coords:{x:  0,y:  0}, offset: "-04:00" },
        Greenland:         {coords:{x:  0,y:  0}, offset: "-03:00" },
        Guadalajara:       {coords:{x:432,y:150}, offset: "-06:00" },
        Guam:              {coords:{x:282,y:178}, offset: "+10:00" },
        Harare:            {coords:{x: 69,y:207}, offset: "+02:00" },
        Hawaii:            {coords:{x:338,y:151}, offset: "-10:00" },
        Helsinki:          {coords:{x: 71,y: 89}, offset: "+02:00" },
        Hobart:            {coords:{x:255,y:248}, offset: "+10:00" },
        Indiana:           {coords:{x:479,y:101}, offset: "-05:00" },
        International:     {coords:{x:312,y: 66}, offset: "-12:00" },
        Irkutsk:           {coords:{x:202,y: 72}, offset: "+08:00" },
        Jayawardenepura:   {coords:{x:  0,y:  0}, offset: "+05:30" },
        Jerusalem:         {coords:{x: 71,y:131}, offset: "+02:00" },
        Kabul:             {coords:{x:136,y:134}, offset: "+04:30" },
        Kathmandu:         {coords:{x:151,y:142}, offset: "+05:45" },
        Krasnoyarsk:       {coords:{x:192,y: 65}, offset: "+07:00" },
        Kuwait:            {coords:{x: 94,y:137}, offset: "+03:00" },
        Lisbon:            {coords:{x: 30,y: 92}, offset: "+00:00" },
        Magadan:           {coords:{x:281,y:205}, offset: "+11:00" },
        Manaus:            {coords:{x:  0,y:  0}, offset: "-04:00" },
        Melbourne:         {coords:{x:260,y:236}, offset: "+10:00" },
        MidAtlantic:       {coords:{x:536,y:112}, offset: "-02:00" },
        MidwayIsland:      {coords:{x:314,y:145}, offset: "-11:00" },
        Montevideo:        {coords:{x:  0,y:  0}, offset: "-03:00" },
        Moscow:            {coords:{x: 94,y: 95}, offset: "+03:00" },
        Nairobi:           {coords:{x: 96,y:187}, offset: "+03:00" },
        Newfoundland:      {coords:{x:  0,y:  0}, offset: "-03:30" },
        Nuku:              {coords:{x:325,y:211}, offset: "+13:00" },
        PacificTime:       {coords:{x:348,y:124}, offset: "-08:00" },
        Perth:             {coords:{x:215,y:234}, offset: "+08:00" },
        Petropavlovsk:     {coords:{x:  0,y:  0}, offset: "+12:00" },
        PortLouis:         {coords:{x:  0,y:  0}, offset: "+04:00" },
        Rangoon:           {coords:{x:175,y:167}, offset: "+06:30" },
        Santiago:          {coords:{x:  0,y:  0}, offset: "-04:00" },
        Sarajevo:          {coords:{x: 64,y:104}, offset: "+01:00" },
        Saskatchewan:      {coords:{x:456,y: 70}, offset: "-06:00" },
        Seoul:             {coords:{x:233,y:128}, offset: "+09:00" },
        Singapore:         {coords:{x:208,y:188}, offset: "+08:00" },
        Taipei:            {coords:{x:217,y:151}, offset: "+08:00" },
        Tashkent:          {coords:{x:137,y:148}, offset: "+05:00" },
        Tbilisi:           {coords:{x:  0,y:  0}, offset: "+03:00" },
        Tehran:            {coords:{x: 96,y:143}, offset: "+03:30" },
        Tijuana:           {coords:{x:  0,y:  0}, offset: "-08:00" },
        Tokyo:             {coords:{x:233,y:137}, offset: "+09:00" },
        US:                {coords:{x:428,y:144}, offset: "-06:00" },
        UsCanada:          {coords:{x:415,y:102}, offset: "-07:00" },
        Vladivostok:       {coords:{x:250,y: 69}, offset: "+10:00" },
        WestCentralAfrica: {coords:{x: 64,y:176}, offset: "+01:00" },
        Windhoek:          {coords:{x:  0,y:  0}, offset: "+02:00" },
        Yakutsk:           {coords:{x:235,y: 55}, offset: "+09:00" }
    }

    // sOffset: 格式为"+09:30", "-09:00"
    function zone2Number(sOffset)
    {
        var a = sOffset.split(':');
        var h = parseInt(a[0],10);
        var m = parseInt(sOffset.substring(0,1)+a[1],10);   // 第一个字符为正负号
        var n = h+m/60;
        while( n<-12) n += 24;
        while( n>13) n -= 24;
        return n;
    }
    
    var oTimeZone = {
        _create: function(){
            
            var oDiv = this._oTimeZone = this.element;
            var sDivId = this._oTimeZone.attr("id");
            var sSelectId = sDivId+"_select";
            var sSelectHtml, sOptionHtml;

            if("timezone" == oDiv.attr("ctrl"))
            {
                return false;
            }
            oDiv.attr("ctrl", "timezone");

            sOptionHtml="";
            for(var i in _TimeZoonData)
            {
                var oData =_TimeZoonData[i];
                var sOffset = oData.offset;
                var sValue = i;
                var sZoneName = $.MyLocale.TimeZoon ? $.MyLocale.TimeZoon[i] : i;

                sOptionHtml += "<option value="+sValue+" offset='"+sOffset+"' zname='"+i+"'>"+sZoneName+" (GMT"+sOffset+")</option>";
            }

            sSelectHtml = "<select id="+sSelectId+" class='width-auto'>" + sOptionHtml + "</select>";

            oDiv.addClass("time-zone").html(sSelectHtml);

            $("#"+sSelectId).trigger("change");
            return;
        },
        getTimeZoneValue: function()
        {
            return this._oTimeZone.find("select").val();
        },
        getTimeZoneOffset: function()
        {
            var sDivId = this._oTimeZone.attr("id");
            var sOffset = $("#"+sDivId+"_select option:selected").attr("offset")+":00";
            return sOffset;
        },
        setTimeZone: function(sValue)
        {
            var jSelect = this._oTimeZone.children("select");
            //对sValue进行分割，显示当前的值
            var sFirstChar = sValue.substring(0,1);
            sFirstChar = sFirstChar.toUpperCase();
            if(sFirstChar=="Z")
            {
                jSelect.val("Lisbon");
                return false;
            }

            var sTimeZoneName = sValue.substring(9,sValue.length);
            var sTimeZoneLine = sValue.substring(0,6);

            if(_TimeZoonData[sTimeZoneName])
            {
                var nCurrent = zone2Number(sTimeZoneLine);
                var nZone = zone2Number(_TimeZoonData[sTimeZoneName].offset);
                if(nZone==nCurrent)
                {
                    jSelect.val(sTimeZoneName);
                    return false;
                }
            }

            // add custom timezone
            $("<option></option>")
                .attr("value", sTimeZoneName)
                .attr("offset", sTimeZoneLine)
                .attr("zname", sTimeZoneName)
                .text (sTimeZoneName + "(GMT" + sTimeZoneLine + ")")
                .appendTo (jSelect);
            jSelect.val (sTimeZoneName);
        },
        _destory:function()
        {
            this._oTimeZone.removeAttr("ctrlName").removeClass("time-zone").empty();
            $.Widget.prototype.destroy.call(this);
        }
    };
    $.widget("ui.timezone", oTimeZone);

    function _init(oFrame)
    {
        $(".timezone", oFrame).timezone();
    }

    function _destroy()
    {

    }

    Widgets.regWidget(WIDGETNAME, {"init": _init, "destroy": _destroy, "widgets": [], "utils":["Widget"]});
})(jQuery);
