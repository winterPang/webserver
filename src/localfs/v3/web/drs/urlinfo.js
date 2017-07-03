;(function ($) {
    var MODULE_NAME = "drs.urlinfo";
    var LIST_NAME = "#urlList";
    var g_sn = FrameInfo.ACSN;
    // var NC, MODULE_NC = "drs.NC";
    var g_Device,g_bflag=true;
    var g_aUrls = [];

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("urlinfo_infor_rc", sRcName);
    }
    function initGrid ()
    {
        var opt = {
            colNames: getRcText ("USER_HEADER"),
            showHeader: true,
            search:true,
            pageSize:12,
            /*select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [
                {name: "WebSiteName", datatype: "String"},
                {name: "CategoryName", datatype: "String"},
                {name:"UserMAC",datatype:"String"},
                {name: "TotalTime", datatype: "Integer"},
                {name:"accessnumber",datatype:"Integer"},
                //{name:"nPktDir",datatype:"Integer"}
            ]
        };
        $("#urlList").SList ("head", opt);
    }

    function getTheDate(str1,str2)
    {
        var tNow = new Date();
        var nYear = tNow.getFullYear();
        var nMonth = tNow.getMonth();
        var nDay = tNow.getDate();
        var nHour = tNow.getHours();
        var nMinute = tNow.getMinutes();
        var nSeconds = tNow.getSeconds();
        if(str1=="one")
        {
            if(str2=="end")
            {
                //var sNowEndTime = nYear + "-" + addzero(nMonth) + "-" + addzero(nDay) + "T" +addzero(nHour) +":"+addzero(nMinute)+":"+addzero(nSeconds);
                var oNowEndTime = {Year:nYear,Month:nMonth,Day:nDay,Hour:nHour,Minute:nMinute,Seconds:nSeconds};
                return oNowEndTime;
            }
            if(str2 =="Start")
            {
                // var sNowStart = nYear + "-" + addzero(nMonth) + "-" + addzero(nDay) + "T" +"00:00:00";
                var oNowStart = {Year:nYear,Month:nMonth,Day:nDay};
                return oNowStart;
            }
        }
        if(str1=="aweek")
        {
            if(str2=="end")
            {
                //var sEndTime = nYear + "-" + addzero(nMonth) + "-" + addzero(nDay-nCount) + "T" + "23:59:59"
                var oEndTime = {Year:nYear,Month:nMonth,Day:nDay,Hour:nHour,Minute:nMinute,Seconds:nSeconds};
                return oEndTime;
            }
            if(str2=="Start")
            {
                if(nDay>=7)
                {
                    //var sStartTime = nYear + "-" + addzero(nMonth) + "-" + addzero(nDay-nCount) + "T" + "00:00:00"
                    var oStartTime = {Year:nYear,Month:nMonth,Day:(nDay-6)};
                }
                if(nDay<7)
                {
                    switch(nMonth)
                    {

                        case 1:
                            //sStartTime = nYear-1 + "-" + 12 + "-" + addzero(nDay+31-nCount) + "T" +"00:00:00";
                            var oStartTime  = {Year:(nYear-1),Month:12,Day:(nDay+25)};
                            break;
                        case 2:
                        case 4:
                        case 6:
                        case 9:
                        case 11:
                            //sStartTime = nYear + "-" + addzero(nMonth-1) + "-" + addzero(nDay+31-nCount) + "T" +"00:00:00";
                            var oStartTime = {Year:nYear,Month:(nMonth-1),Day:(nDay+25)};
                            break;
                        case 3:
                            if(nYear%4!=0)
                            //sStartTime = nYear + "-" +  addzero(nMonth-1) + "-" + addzero(nDay+29-nCount) + "T" +"00:00:00";
                                var oStartTime = {Year:nYear,Month:(nMonth-1),Day:(nDay+22)};
                            else
                            //sStartTime = nYear + "-" +  addzero(nMonth-1) + "-" + addzero(nDay+28-nCount) + "T" +"00:00:00";
                                var oStartTime = {Year:nYear,Month:(nMonth-1),Day:(nDay+23)};
                            break;
                        case 5:
                        case 7:
                        case 8:
                        case 10:
                        case 12:
                            //sStartTime = nYear + "-" + addzero(nMonth-1) + "-" + addzero(nDay+30-nCount) + "T" +"00:00:00";
                            var oStartTime = {Year:nYear,Month:(nMonth-1),Day:(nDay+24)};
                            break;
                    }
                }
                return oStartTime;
            }
        }
    }

    function addzero(num)
    {
        var str;
        str =  num<10 ? ("0" + num): num;
        return str;
    }
    function accessNumber(aData)
    {
        for(var i=0;i<aData.length;i++)
        {
            aData[i].accessnumber=1;
            for(var j=0;j<aData.length;j++)
            {

                if((aData[i].WebSiteName==aData[j].WebSiteName)&&(aData[i].UserMAC!=aData[j].UserMAC))
                {
                    if(i>j)
                    {
                        aData[i].accessnumber=aData[j].accessnumber;
                        break;
                    }
                    else
                    {
                        aData[i].accessnumber +=1;
                    }
                }
            }
        }

        return aData;
    }

    function initData()
    {
        var tNow = new Date();
        var nHourNow = tNow.getHours();
        var nMinuteNow = tNow.getMinutes();
        var nSecondsNow = tNow.getSeconds();
        var sStartTime =  getTheDate("aweek","Start");
        var sEnd =  getTheDate("aweek","end");
        var nStartTime = (new Date(sStartTime.Year,sStartTime.Month,sStartTime.Day).getTime())/1000;
        var nEndTime = (new Date(sEnd.Year,sEnd.Month,sEnd.Day,sEnd.Hour,sEnd.Minute,sEnd.Seconds).getTime())/1000;

        var aUrls = [];
        var aUrlsDown = [];
        $.ajax({
            url:MyConfig.path+"/ant/dpi_url",
            dataType: "json",
            type:"post",
            data:{
                Method:'GetUrl',
                Param: {
                    family:"0",
                    direct:"0",
                    ACSN:g_sn,
                    StartTime:nStartTime,
                    EndTime:nEndTime,

                },
                Return: [
                    "UserMAC",
                    "WebSiteName",
                    "CategoryName",
                    "TotalTime",

                ]

            },
            success: function (Data)
            {

                aUrls = Data.message;
                $.ajax({
                    url:MyConfig.path+"/ant/dpi_url",
                    dataType: "json",
                    type:"post",
                    data:{
                        Method:'GetUrl',
                        Param: {
                            family:"0",
                            direct:"1",
                            ACSN:g_sn,
                            StartTime:nStartTime,
                            EndTime:nEndTime,

                        },
                        Return: [
                            "UserMAC",
                            "WebSiteName",
                            "CategoryName",
                            "TotalTime",
                        ]

                    },
                    success: function (DownData)
                    {
                        var aUrlTemp = [],nCount = 0;
                        aUrlsDown = DownData.message;
                        aUrls = accessNumber(aUrls);
                        aUrlsDown = accessNumber(aUrlsDown);
                        for(var i=0;i<aUrls.length;i++)
                        {
                            g_aUrls[i]=aUrls[i];
                        }
                        var nLenght = g_aUrls.length;
                        for(var i=0;i<aUrlsDown.length;i++)
                        {
                            g_aUrls[nLenght+i]=aUrlsDown[i];
                        }
                        for(var i=0;i<g_aUrls.length;i++)
                        {
                            for(var j=i+1;j<g_aUrls.length;j++)
                            {
                                if((g_aUrls[i].WebSiteName == g_aUrls[j].WebSiteName)&&(g_aUrls[i].UserMAC == g_aUrls[j].UserMAC))
                                {
                                    g_aUrls.splice(j,1);
                                }
                            }
                        }
                        for(var i=0;i<g_aUrls.length;i++)
                        {
                            if(g_aUrls[i].TotalTime!=0)
                            {
                                aUrlTemp[nCount] = g_aUrls[i];
                                nCount++;
                            }
                        }
                        for(var i=0;i<aUrlTemp.length;i++)
                        {
                            var nHour, nMinute,nSeconds;
                            var nThisWeekHour = 0;
                            if(aUrlTemp[i].TotalTime>=3600)
                            {
                                nHour =(aUrlTemp[i].TotalTime/3600).toFixed(0);
                                if(nHour>168)
                                {
                                    nThisWeekHour = 144+nHourNow;
                                    aUrlTemp[i].TotalTime = nThisWeekHour+":"+nMinuteNow+":"+nSecondsNow;
                                    continue;
                                }
                                var nTime = aUrlTemp[i].TotalTime%3600;
                                if(nTime>=60)
                                {
                                    nMinute = (nTime/60).toFixed(0);
                                    nSeconds =(nTime)%60;
                                    aUrlTemp[i].TotalTime = nHour+":"+nMinute+":"+nSeconds;
                                }
                                else
                                {
                                    nSeconds =(nTime)%60;
                                    aUrlTemp[i].TotalTime = nHour+":"+"0"+":"+nSeconds;
                                }
                            }
                            else if(aUrlTemp[i].TotalTime>=60)
                            {
                                nMinute = (aUrlTemp[i].TotalTime/60).toFixed(0);
                                nSeconds = aUrlTemp[i].TotalTime%60;
                                aUrlTemp[i].TotalTime = "0"+":"+nMinute+":"+nSeconds;
                            }
                            else
                            {
                                aUrlTemp[i].TotalTime = "0"+":"+"0"+":"+aUrlTemp[i].TotalTime;
                            }

                        }
                        $("#urlList").SList("refresh", aUrlTemp);
                        g_aUrls.splice(0);
                    },
                    error: onAjaxErr
                });
            },
            error: onAjaxErr
        });
    }


    function onAjaxErr()
    {
       /* var sProtocal = window.location.protocol.replace(":", "").toUpperCase();
        // var sMsg = PageText[PageText.curLang]["net_err"].replace("%s", sProtocal);
        alert("cuowu");*/
    }
    function getDynUrl(sUrl)
    {
        return  "../../wnm/" + sUrl;
    }
    function _init()
    {
        // NC = Utils.Pages[MODULE_NC].NC;
        initGrid();
        initData();
    };

    function _destroy()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList"],
        "utils":["Request","Msg"],
        // "subModules":[MODULE_NC]
    });
})( jQuery );
