;(function ($) {
    var MODULE_NAME = "drs.webinfo";
    var LIST_NAME = "#webList";
    var g_sn = FrameInfo.ACSN;
    //var NC, MODULE_NC = "drs.NC";
    var g_Device,g_bflag=true;
    var g_aUrls = [];
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("web_infor_rc", sRcName);
    }
    function initGrid ()
    {
        var opt = {
            showHeader: true,
            search:true,
            pageSize:12,
            colNames: getRcText ("USER_HEADER"),
             /* select:{id:"UserInfo",name:"UserInfo:", title: getRcText("URL_NAME"),"options": makeUserSelect, action:onSelectChange},*/
            colModel: [
                {name: "WebSiteName", datatype: "String"},
                {name: "CategoryName", datatype: "String"},
                {name:"UserMAC",datatype:"Mac"},
                {name: "TotalTime", datatype: "Integer"},
                {name:"LastTime",datatype:"String"}

            ]
        };
        $("#webList").SList ("head", opt);
    }

    function getTheDate(str1,str2)
    {
        var tNow = new Date();
        var nYear = tNow.getFullYear();
        var nMonth = tNow.getMonth()+1;
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



    function initData(sStartTime, sEnd, nIpType)
    {
        var tNow = new Date();
        var nHourNow = tNow.getHours();
        var nMinuteNow = tNow.getMinutes();
        var nSecondsNow = tNow.getSeconds();
        var sStartTime =  getTheDate("aweek","Start");
        var sEnd =  getTheDate("aweek","end");
        var nStartTime = (new Date(sStartTime.Year,sStartTime.Month-1,sStartTime.Day).getTime())/1000;
        var nEndTime = (new Date(sEnd.Year,sEnd.Month-1,sEnd.Day,sEnd.Hour,sEnd.Minute,sEnd.Seconds).getTime())/1000;

        var aUrls = [];
        var aUrlsDown = [];
        var SendMsg = {
            url:MyConfig.path+"/ant/read_dpi_url",
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
                            "LastTime",
                        ]
             },
             onSuccess:getMsgSuccess,
             onFailed:getMsgFail
         }
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(downData)
        {
             var aUrlTemp = [],nCount = 0;
            var aUrlsDown = downData.message;
            for(var i=0;i<aUrls.length;i++)
            {
                g_aUrls[i] = aUrls[i];
               // g_aUrls[i].nPktDir = getRcText("UPPKT");
            }
            var nLenght = g_aUrls.length;
            for(var i=0;i<aUrlsDown.length;i++)
            {
                g_aUrls[nLenght+i] = aUrlsDown[i];
                //g_aUrls[nLenght+i].nPktDir = getRcText("DOWNPKT");
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
                var nHour, nMinute,nSeconds;
                var nThisWeekHour = 0;
                g_aUrls[i].LastTime = new Date(g_aUrls[i].LastTime*1000).getFullYear()+getRcText("NIAN")+(new Date(g_aUrls[i].LastTime*1000).getMonth()+1)+getRcText("YUE")+new Date(g_aUrls[i].LastTime*1000).getDate()+getRcText("RI")+
                    new Date(g_aUrls[i].LastTime*1000).getHours()+getRcText("SHI")+new Date(g_aUrls[i].LastTime*1000).getMinutes()+getRcText("FEN")+new Date(g_aUrls[i].LastTime*1000).getSeconds()+getRcText("MIAO");
                if(g_aUrls[i].TotalTime>=3600)
                {
                    nHour =(g_aUrls[i].TotalTime/3600).toFixed(0);
                    if(nHour>168)
                    {
                        nThisWeekHour = 144+nHourNow;
                        g_aUrls[i].TotalTime = nThisWeekHour+":"+nMinuteNow+":"+nSecondsNow;
                        continue;
                    }
                    var nTime = g_aUrls[i].TotalTime%3600;
                    if(nTime>=60)
                    {
                        nMinute = (nTime/60).toFixed(0);
                        nSeconds =(nTime)%60;
                        g_aUrls[i].TotalTime = nHour+":"+nMinute+":"+nSeconds;
                    }
                    else
                    {
                        nSeconds =(nTime)%60;
                        g_aUrls[i].TotalTime = nHour+":"+"0"+":"+nSeconds;
                    }
                }
                else if(g_aUrls[i].TotalTime>=60)
                {
                    nMinute = (g_aUrls[i].TotalTime/60).toFixed(0);
                    nSeconds = g_aUrls[i].TotalTime%60;
                    g_aUrls[i].TotalTime = "0"+":"+nMinute+":"+nSeconds;
                }
                else
                {
                    g_aUrls[i].TotalTime = "0"+":"+"0"+":"+g_aUrls[i].TotalTime;
                }

            }
            for(var i=0;i<g_aUrls.length;i++)
            {
                if(g_aUrls[i].TotalTime!="0:0:0")
                {
                    aUrlTemp[nCount] = g_aUrls[i];
                    nCount++;
                }
            }
            for(var i=0;i<aUrlTemp.length;i++)
                {
                    var sType = aUrlTemp[i].CategoryName;
                    switch(sType)
                    {
                        case "Entertainment":
                        {
                            aUrlTemp[i].CategoryName = getRcText("Entertainment");
                            break;
                        }
                        case "News":
                        {
                            aUrlTemp[i].CategoryName = getRcText("News");
                            break;
                        }
                        case "Shopping":
                        {
                            aUrlTemp[i].CategoryName = getRcText("Shopping");
                            break;
                        }
                        case "Computers & Technology":
                        {
                            aUrlTemp[i].CategoryName = getRcText("Technology");
                            break;
                        }
                        case "Streaming Media & Downloads":
                        {
                            aUrlTemp[i].CategoryName = getRcText("Downloads");
                            break;
                        }
                        case "Search Engines & Portals":
                        {
                            aUrlTemp[i].CategoryName = getRcText("Search");
                            break;
                        }
                        case "Transportation":
                        {
                            aUrlTemp[i].CategoryName = getRcText("Transportation");
                            break;
                        }
                        case "Finance":
                        {
                            aUrlTemp[i].CategoryName = getRcText("Finance");
                            break;
                        }
                        default:
                            aUrlTemp[i].CategoryName = getRcText("Unknown");
                            break;
                    }
                }

            $("#webList").SList("refresh", aUrlTemp);
            g_aUrls.splice(0);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }
    }

    function onAjaxErr()
    {
    }
    function getDynUrl(sUrl)
    {
        return  "../../wnm/" + sUrl;
    }
    function _init()
    {
        initGrid();
        initData();
    };

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList"],
        "utils":["Request","Msg"],
    });
})( jQuery );
