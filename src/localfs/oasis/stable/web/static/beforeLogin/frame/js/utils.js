/**
 * Modified by liuyanping(kf6877) on 2017/1/11.
 */
define(['jquery'],function($){
    console.log("============util================");
    function getRcString(sRcId, sRcName)
    {
        return $("#"+sRcId).attr(sRcName) || "";
    }

    var Cookie =
    {
        get: function (sName)
        {
            // cookies are separated by semicolons
            var aCookie = document.cookie.split("; ");
            for (var i=0; i < aCookie.length; i++)
            {
                // a name/value pair (a crumb) is separated by an equal sign
                var aCrumb = aCookie[i].split("=");
                if (sName == aCrumb[0])
                    return unescape(aCrumb[1]||"");
            }

            // a cookie with the requested name does not exist
            return null;
        },

        set: function (oPara, retentionDuration)
        {
            var sExpres = "";
            var n = parseInt(retentionDuration);
            if(-1 == n)
            {
                // ²»ÀÏ»¯
                var date = new Date(2099,12,31);
                sExpres = "expires=" + date.toGMTString();
            }
            else if(n>0)
            {
                var date = new Date();
                date.setTime(date.getTime() + n*3600000);
                sExpres = "expires=" + date.toGMTString();
            }

            for (var sName in oPara)
            {
                var sCookie = sName+"="+escape(oPara[sName])+"; path=/;" + sExpres;
                document.cookie = sCookie;
            }
        },
        del: function(sName)
        {
            var date = new Date();
            date.setTime(date.getTime() - 10000);

            var aTemp = sName.split(",");
            for(var i=0; i<aTemp.length; i++)
            {
                var sCookie = aTemp[i] + "=d; path=/; expires=" + date.toGMTString();
                document.cookie = sCookie;
            }
        }
    };

    function getLang(){
        return Cookie.get('lang')? Cookie.get('lang'):'cn';
    }

    function setLang(oPara, retentionDuration){
        Cookie.set(oPara, retentionDuration);
    }
    return {
        getRcString:getRcString,
        getLang:getLang,
        setLang:setLang
    }
});